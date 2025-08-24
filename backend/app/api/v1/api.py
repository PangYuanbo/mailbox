from fastapi import APIRouter
from app.api.v1.endpoints import emails, categories, analytics, preferences, summaries

api_router = APIRouter()

api_router.include_router(emails.router, prefix="/emails", tags=["emails"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(summaries.router, prefix="/summaries", tags=["summaries"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["preferences"])