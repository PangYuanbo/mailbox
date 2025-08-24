from datetime import date, datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models.email import Email
from app.models.analyzed_content import AnalyzedContent
from app.models.daily_summary import DailySummary
from app.models.category import Category
import logging

logger = logging.getLogger(__name__)

class SummaryGenerator:
    async def generate_daily_summary(
        self, 
        summary_date: date, 
        db: AsyncSession
    ) -> DailySummary:
        start_datetime = datetime.combine(summary_date, datetime.min.time())
        end_datetime = start_datetime + timedelta(days=1)
        
        email_query = select(Email).where(
            and_(
                Email.received_at >= start_datetime,
                Email.received_at < end_datetime,
                Email.processed == True
            )
        )
        email_result = await db.execute(email_query)
        emails = email_result.scalars().all()
        
        content_query = select(AnalyzedContent).join(Email).where(
            and_(
                Email.received_at >= start_datetime,
                Email.received_at < end_datetime
            )
        )
        content_result = await db.execute(content_query)
        analyzed_contents = content_result.scalars().all()
        
        categories_summary = await self._generate_categories_summary(
            analyzed_contents, db
        )
        
        markdown_content = self._generate_markdown_summary(
            summary_date, emails, analyzed_contents, categories_summary
        )
        
        existing_query = select(DailySummary).where(
            DailySummary.date == summary_date
        )
        existing_result = await db.execute(existing_query)
        existing_summary = existing_result.scalar_one_or_none()
        
        if existing_summary:
            existing_summary.content_markdown = markdown_content
            existing_summary.total_emails = len(emails)
            existing_summary.categories_summary = categories_summary
            summary = existing_summary
        else:
            summary = DailySummary(
                date=summary_date,
                content_markdown=markdown_content,
                total_emails=len(emails),
                categories_summary=categories_summary
            )
            db.add(summary)
        
        await db.commit()
        await db.refresh(summary)
        
        return summary
    
    async def _generate_categories_summary(
        self, 
        analyzed_contents: List[AnalyzedContent],
        db: AsyncSession
    ) -> Dict[str, Any]:
        category_counts = {}
        
        for content in analyzed_contents:
            if content.category_id:
                category_id = str(content.category_id)
                if category_id not in category_counts:
                    category_counts[category_id] = {
                        "count": 0,
                        "importance_total": 0,
                        "top_items": []
                    }
                
                category_counts[category_id]["count"] += 1
                category_counts[category_id]["importance_total"] += content.importance_score or 0
                
                if content.importance_score and content.importance_score >= 7:
                    category_counts[category_id]["top_items"].append({
                        "title": content.title_optimized,
                        "summary": content.summary,
                        "score": content.importance_score
                    })
        
        for category_id in category_counts:
            top_items = category_counts[category_id]["top_items"]
            category_counts[category_id]["top_items"] = sorted(
                top_items, 
                key=lambda x: x["score"], 
                reverse=True
            )[:5]
            
            count = category_counts[category_id]["count"]
            total = category_counts[category_id]["importance_total"]
            category_counts[category_id]["average_importance"] = total / count if count > 0 else 0
        
        return category_counts
    
    def _generate_markdown_summary(
        self,
        summary_date: date,
        emails: List[Email],
        analyzed_contents: List[AnalyzedContent],
        categories_summary: Dict[str, Any]
    ) -> str:
        lines = [
            f"# Daily Email Summary - {summary_date}",
            "",
            f"**Total Emails Received:** {len(emails)}",
            f"**Processed Emails:** {len(analyzed_contents)}",
            "",
            "## Top Stories",
            ""
        ]
        
        top_contents = sorted(
            analyzed_contents,
            key=lambda x: x.importance_score or 0,
            reverse=True
        )[:10]
        
        for idx, content in enumerate(top_contents, 1):
            lines.extend([
                f"### {idx}. {content.title_optimized}",
                f"*Importance: {content.importance_score}/10*",
                "",
                content.summary or "No summary available",
                ""
            ])
            
            if content.key_points:
                lines.append("**Key Points:**")
                for point in content.key_points[:3]:
                    lines.append(f"- {point}")
                lines.append("")
        
        lines.extend([
            "## Category Distribution",
            ""
        ])
        
        for category_id, stats in categories_summary.items():
            lines.extend([
                f"- **Category {category_id}**: {stats['count']} emails",
                f"  Average Importance: {stats['average_importance']:.1f}/10",
                ""
            ])
        
        return "\n".join(lines)