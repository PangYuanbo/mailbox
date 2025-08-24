from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import date, datetime
from uuid import UUID

class DailySummaryBase(BaseModel):
    date: date
    content_markdown: str
    total_emails: int
    categories_summary: Dict[str, Any]

class DailySummaryCreate(DailySummaryBase):
    pass

class DailySummaryResponse(DailySummaryBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True