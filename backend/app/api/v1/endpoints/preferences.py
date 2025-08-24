from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.models.user_preference import UserPreference
from app.schemas.preference import PreferenceCreate, PreferenceResponse, PreferenceUpdate

router = APIRouter()

@router.get("/", response_model=PreferenceResponse)
async def get_preferences(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserPreference).limit(1))
    preference = result.scalar_one_or_none()
    
    if not preference:
        preference = UserPreference(
            layout_preference="newspaper",
            theme="light",
            category_weights={},
            notification_settings={}
        )
        db.add(preference)
        await db.commit()
        await db.refresh(preference)
    
    return PreferenceResponse.from_orm(preference)

@router.put("/", response_model=PreferenceResponse)
async def update_preferences(
    preference_update: PreferenceUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserPreference).limit(1))
    preference = result.scalar_one_or_none()
    
    if not preference:
        preference = UserPreference()
        db.add(preference)
    
    update_data = preference_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preference, field, value)
    
    await db.commit()
    await db.refresh(preference)
    
    return PreferenceResponse.from_orm(preference)