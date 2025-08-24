from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    color: Optional[str] = Field(None, max_length=7, pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=7, pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: UUID
    
    class Config:
        from_attributes = True