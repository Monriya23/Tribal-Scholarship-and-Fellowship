from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SchemeBase(BaseModel):
    code: str
    name: str
    category: str = "POST_MATRIC"
    description: Optional[str] = None
    objective: Optional[str] = None
    funding_type: str = "CENTRAL_SECTOR"
    central_share: int = 100
    state_share: int = 0
    active_version: str = "2025-26"

class SchemeCreate(SchemeBase):
    id: str
    source_document_id: Optional[str] = None

class SchemeVersionResponse(BaseModel):
    id: str
    version_tag: str
    effective_academic_year: str
    financial_benefits: Dict[str, Any]
    eligibility_criteria: List[Dict[str, Any]]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class SchemeResponse(SchemeBase):
    id: str
    source_document_id: Optional[str] = None
    versions: List[SchemeVersionResponse] = []

    class Config:
        from_attributes = True
