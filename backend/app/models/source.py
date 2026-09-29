from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SourceBase(BaseModel):
    name: str
    organization: str
    base_url: str
    source_type: str = "OFFICIAL_PORTAL"
    active: bool = True
    robots_status: str = "ALLOWED"

class SourceCreate(SourceBase):
    id: str

class SourceUpdate(BaseModel):
    name: Optional[str] = None
    organization: Optional[str] = None
    base_url: Optional[str] = None
    active: Optional[bool] = None
    status: Optional[str] = None
    error_message: Optional[str] = None

class SourceResponse(SourceBase):
    id: str
    last_checked_at: Optional[datetime] = None
    last_success_at: Optional[datetime] = None
    status: str
    error_message: Optional[str] = None
    document_count: Optional[int] = 0

    class Config:
        from_attributes = True
