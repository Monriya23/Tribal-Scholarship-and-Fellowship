import datetime
from pydantic import BaseModel
from typing import Dict, Any, Optional

class SelectionRunRequest(BaseModel):
    scheme_code: str  # NFST, NOS
    academic_year: str = "2025-26"
    total_slots: Optional[int] = 750

class SelectionResultResponse(BaseModel):
    id: str
    scheme_id: str
    academic_year: str
    application_id: str
    rank: Optional[int] = None
    normalized_score: Optional[float] = None
    quota_category: str
    selection_status: str
    calculation_trace: Dict[str, Any]
    batch_id: Optional[str] = None
    published_at: datetime.datetime

    class Config:
        from_attributes = True
