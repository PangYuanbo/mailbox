from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Email(Base):
    __tablename__ = "emails"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String(500))
    sender_email = Column(String(255), nullable=False)
    sender_name = Column(String(255))
    raw_content = Column(Text)
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Boolean, default=False)