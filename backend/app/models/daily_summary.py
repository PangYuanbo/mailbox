from sqlalchemy import Column, Date, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class DailySummary(Base):
    __tablename__ = "daily_summaries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False)
    content_markdown = Column(Text)
    total_emails = Column(Integer)
    categories_summary = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())