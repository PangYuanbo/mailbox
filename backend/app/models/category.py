from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    color = Column(String(7))
    icon = Column(String(50))
    description = Column(Text)