from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "Email Aggregator"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    NEON_DATABASE_URL: Optional[str] = Field(None, env="NEON_DATABASE_URL")
    
    OPENROUTER_API_KEY: str = Field(..., env="OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL: str = Field(
        default="https://openrouter.ai/api/v1",
        env="OPENROUTER_BASE_URL"
    )
    
    SMTP_HOST: str = Field(default="0.0.0.0", env="SMTP_HOST")
    SMTP_PORT: int = Field(default=2525, env="SMTP_PORT")
    ALLOWED_SENDERS: List[str] = Field(default_factory=list, env="ALLOWED_SENDERS")
    
    @validator("ALLOWED_SENDERS", pre=True)
    def parse_allowed_senders(cls, v):
        if isinstance(v, str):
            return [email.strip() for email in v.split(",") if email.strip()]
        return v
    
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    CORS_ORIGINS: List[str] = Field(default_factory=list, env="CORS_ORIGINS")
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    CLOUDFLARE_ACCOUNT_ID: Optional[str] = Field(None, env="CLOUDFLARE_ACCOUNT_ID")
    CLOUDFLARE_IMAGES_TOKEN: Optional[str] = Field(None, env="CLOUDFLARE_IMAGES_TOKEN")
    
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
settings = Settings()