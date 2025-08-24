from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    return [CategoryResponse.from_orm(cat) for cat in categories]

@router.post("/", response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_db)
):
    category = Category(
        name=category_data.name,
        color=category_data.color,
        icon=category_data.icon,
        description=category_data.description
    )
    
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return CategoryResponse.from_orm(category)

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Category).where(Category.id == category_id)
    result = await db.execute(query)
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return CategoryResponse.from_orm(category)

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    category_update: CategoryUpdate,
    db: AsyncSession = Depends(get_db)
):
    query = select(Category).where(Category.id == category_id)
    result = await db.execute(query)
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    await db.commit()
    await db.refresh(category)
    
    return CategoryResponse.from_orm(category)

@router.delete("/{category_id}")
async def delete_category(
    category_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Category).where(Category.id == category_id)
    result = await db.execute(query)
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.delete(category)
    await db.commit()
    
    return {"message": "Category deleted successfully"}