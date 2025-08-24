from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
import uuid

class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_weights = Column(JSONB)
    layout_preference = Column(String(50))
    theme = Column(String(20))
    notification_settings = Column(JSONB)