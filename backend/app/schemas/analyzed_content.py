from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class ImageData(BaseModel):
    url: str
    alt: str
    caption: Optional[str] = None

class AnalyzedContentBase(BaseModel):
    category: str
    importance_score: int = Field(..., ge=1, le=10)
    title_optimized: str
    summary: str
    content_markdown: str
    key_points: List[str]
    tags: List[str]
    images: List[ImageData]
    important_links: List[str]
    reading_time: int
    sentiment: str = Field(..., pattern="^(positive|neutral|negative)$")
    action_items: List[str]

class AnalyzedContentCreate(AnalyzedContentBase):
    email_id: UUID
    category_id: Optional[UUID] = None

class AnalyzedContentResponse(AnalyzedContentBase):
    id: UUID
    email_id: UUID
    category_id: Optional[UUID]
    created_at: datetime
    
    class Config:
        from_attributes = True