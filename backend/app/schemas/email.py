from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class EmailBase(BaseModel):
    subject: str = Field(..., max_length=500)
    sender_email: EmailStr
    sender_name: Optional[str] = Field(None, max_length=255)
    raw_content: str

class EmailCreate(EmailBase):
    pass

class EmailResponse(EmailBase):
    id: UUID
    received_at: datetime
    processed: bool = False
    
    class Config:
        from_attributes = True

class EmailListResponse(BaseModel):
    id: UUID
    subject: str
    sender_email: str
    sender_name: Optional[str]
    received_at: datetime
    processed: bool
    
    class Config:
        from_attributes = True