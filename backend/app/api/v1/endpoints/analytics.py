from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from typing import Dict, Any

from app.core.database import get_db
from app.models.email import Email
from app.models.analyzed_content import AnalyzedContent
from app.models.category import Category

router = APIRouter()

@router.get("/overview")
async def get_analytics_overview(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    total_emails = await db.scalar(select(func.count(Email.id)))
    processed_emails = await db.scalar(
        select(func.count(Email.id)).where(Email.processed == True)
    )
    
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    
    emails_this_week = await db.scalar(
        select(func.count(Email.id))
        .where(Email.received_at >= week_ago)
    )
    
    category_stats = await get_category_statistics(db)
    
    return {
        "total_emails": total_emails,
        "processed_emails": processed_emails,
        "processing_rate": (processed_emails / total_emails * 100) if total_emails > 0 else 0,
        "emails_this_week": emails_this_week,
        "category_distribution": category_stats,
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/trends")
async def get_email_trends(
    days: int = 30,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    start_date = datetime.utcnow() - timedelta(days=days)
    
    daily_counts = await db.execute(
        select(
            func.date(Email.received_at).label("date"),
            func.count(Email.id).label("count")
        )
        .where(Email.received_at >= start_date)
        .group_by(func.date(Email.received_at))
        .order_by(func.date(Email.received_at))
    )
    
    trends = [
        {"date": str(row.date), "count": row.count}
        for row in daily_counts
    ]
    
    return {
        "period_days": days,
        "start_date": start_date.date().isoformat(),
        "end_date": datetime.utcnow().date().isoformat(),
        "daily_trends": trends
    }

async def get_category_statistics(db: AsyncSession) -> list:
    result = await db.execute(
        select(
            Category.name,
            Category.color,
            func.count(AnalyzedContent.id).label("count")
        )
        .join(AnalyzedContent, Category.id == AnalyzedContent.category_id)
        .group_by(Category.id, Category.name, Category.color)
    )
    
    return [
        {
            "category": row.name,
            "color": row.color,
            "count": row.count
        }
        for row in result
    ]