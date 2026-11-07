import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from config import settings

logger = logging.getLogger("marketpulse.database")

# Handle SQLite specific parameters
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        echo=False
    )
    logger.info(f"Connected to database backend: {settings.DATABASE_URL.split('://')[0]}")
except Exception as exc:
    logger.error(f"Failed to initialize database engine for {settings.DATABASE_URL}: {exc}")
    # Fallback to local SQLite if PostgreSQL or configured URL fails
    logger.warning("Falling back to local SQLite database: sqlite:///./marketpulse.db")
    engine = create_engine("sqlite:///./marketpulse.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session and ensures
    it is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Creates database tables if they do not exist.
    """
    import database.models  # noqa: F401 - ensure models are registered
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
