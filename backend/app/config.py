import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
RAW_DOCS_DIR = STORAGE_DIR / "raw_sources"
UPLOADS_DIR = STORAGE_DIR / "uploads"

# Ensure directories exist
RAW_DOCS_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "MoTA Official Scholarship & Fellowship Intelligence Engine"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'scholarship_intelligence.db'}")
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", os.getenv("SECRET_KEY", "mota-tribal-scholarship-secure-key-2026-sih"))
    
    # Upload Security Constraints
    ALLOWED_EXTENSIONS: list[str] = [".pdf", ".png", ".jpg", ".jpeg"]
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB max per upload
    
    # Official crawler & ingestion settings
    USER_AGENT: str = "MoTA-Scholarship-Intelligence-System/1.0 (Government-Public-Data-Research; Contact: official-intelligence@tribal.gov.in)"
    REQUEST_TIMEOUT_SECONDS: int = 15
    MAX_DOC_DOWNLOAD_BYTES: int = 25 * 1024 * 1024  # 25 MB max per document
    ALLOW_ROBOTS_BYPASS: bool = False  # NEVER bypass robots.txt or access restrictions
    
    # Storage Paths
    RAW_STORAGE_PATH: Path = RAW_DOCS_DIR
    UPLOAD_STORAGE_PATH: Path = UPLOADS_DIR
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]

settings = Settings()
