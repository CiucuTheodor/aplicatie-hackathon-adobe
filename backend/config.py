import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "MarketPulse AI Backend"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS settings - split comma separated string into list
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Database: PostgreSQL by default, with SQLite fallback for local development
    DATABASE_URL: str = "sqlite:///./marketpulse.db"

    # External Connectors Configuration
    EMAG_REQUEST_TIMEOUT: int = 15
    EMAG_USER_AGENT: str = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
    EMAG_RATE_LIMIT_DELAY: float = 1.5

    # Reddit API Credentials (optional, public JSON endpoints used as fallback)
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "MarketPulseAI/1.0"

    # Twitter / X API Credentials
    TWITTER_BEARER_TOKEN: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
