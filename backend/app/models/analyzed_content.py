from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class AnalyzedContent(Base):
    __tablename__ = "analyzed_content"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    importance_score = Column(Integer)
    title_optimized = Column(String(500))
    summary = Column(Text)
    content_markdown = Column(Text)
    key_points = Column(JSONB)
    tags = Column(JSONB)
    images = Column(JSONB)
    important_links = Column(JSONB)
    reading_time = Column(Integer)
    sentiment = Column(String(20))
    action_items = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    email = relationship("Email", backref="analyzed_content")
    category = relationship("Category", backref="analyzed_content")