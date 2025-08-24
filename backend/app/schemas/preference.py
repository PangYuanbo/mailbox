from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uuid import UUID

class PreferenceBase(BaseModel):
    category_weights: Optional[Dict[str, float]] = Field(default_factory=dict)
    layout_preference: Optional[str] = Field(default="newspaper", pattern="^(newspaper|homepage)$")
    theme: Optional[str] = Field(default="light", pattern="^(light|dark)$")
    notification_settings: Optional[Dict[str, Any]] = Field(default_factory=dict)

class PreferenceCreate(PreferenceBase):
    pass

class PreferenceUpdate(PreferenceBase):
    pass

class PreferenceResponse(PreferenceBase):
    id: UUID
    
    class Config:
        from_attributes = True