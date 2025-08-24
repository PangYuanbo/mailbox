from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import date, datetime
from uuid import UUID

from app.core.database import get_db
from app.models.daily_summary import DailySummary
from app.schemas.summary import DailySummaryResponse
from app.services.summary_generator import SummaryGenerator

router = APIRouter()

@router.get("/daily", response_model=DailySummaryResponse)
async def get_daily_summary(
    summary_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    if not summary_date:
        summary_date = datetime.utcnow().date()
    
    query = select(DailySummary).where(DailySummary.date == summary_date)
    result = await db.execute(query)
    summary = result.scalar_one_or_none()
    
    if not summary:
        generator = SummaryGenerator()
        summary = await generator.generate_daily_summary(summary_date, db)
    
    return DailySummaryResponse.from_orm(summary)

@router.post("/generate")
async def generate_summary(
    summary_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    if not summary_date:
        summary_date = datetime.utcnow().date()
    
    generator = SummaryGenerator()
    summary = await generator.generate_daily_summary(summary_date, db)
    
    return {
        "message": "Summary generated successfully",
        "date": str(summary_date),
        "summary_id": str(summary.id)
    }