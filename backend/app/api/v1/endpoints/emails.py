from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.models.email import Email
from app.models.analyzed_content import AnalyzedContent
from app.schemas.email import EmailCreate, EmailResponse, EmailListResponse
from app.services.email_processor import EmailProcessor
from app.services.ai_analyzer import AIAnalyzer

router = APIRouter()

@router.post("/receive", response_model=EmailResponse)
async def receive_email(
    email_data: EmailCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    email = Email(
        subject=email_data.subject,
        sender_email=email_data.sender_email,
        sender_name=email_data.sender_name,
        raw_content=email_data.raw_content,
        received_at=datetime.utcnow()
    )
    
    db.add(email)
    await db.commit()
    await db.refresh(email)
    
    background_tasks.add_task(process_email, str(email.id))
    
    return EmailResponse.from_orm(email)

@router.get("/", response_model=List[EmailListResponse])
async def get_emails(
    skip: int = 0,
    limit: int = 100,
    processed: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Email).offset(skip).limit(limit)
    
    if processed is not None:
        query = query.where(Email.processed == processed)
    
    result = await db.execute(query.order_by(Email.received_at.desc()))
    emails = result.scalars().all()
    
    return [EmailListResponse.from_orm(email) for email in emails]

@router.get("/{email_id}", response_model=EmailResponse)
async def get_email(
    email_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Email).where(Email.id == email_id)
    result = await db.execute(query)
    email = result.scalar_one_or_none()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    return EmailResponse.from_orm(email)

@router.post("/{email_id}/analyze")
async def analyze_email(
    email_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    query = select(Email).where(Email.id == email_id)
    result = await db.execute(query)
    email = result.scalar_one_or_none()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    background_tasks.add_task(process_email, str(email_id))
    
    return {"message": "Email analysis started", "email_id": str(email_id)}

async def process_email(email_id: str):
    async with AsyncSessionLocal() as db:
        processor = EmailProcessor()
        analyzer = AIAnalyzer()
        
        query = select(Email).where(Email.id == UUID(email_id))
        result = await db.execute(query)
        email = result.scalar_one_or_none()
        
        if email:
            processed_content = await processor.process(email.raw_content)
            analysis_result = await analyzer.analyze(
                subject=email.subject,
                sender=email.sender_email,
                content=processed_content
            )
            
            await db.execute(
                update(Email)
                .where(Email.id == UUID(email_id))
                .values(processed=True)
            )
            await db.commit()