import datetime
from pydantic import BaseModel
from typing import Optional

class GrievanceCreateRequest(BaseModel):
    applicant_id: str
    application_id: Optional[str] = None
    category: str
    subject: str
    description: str

class GrievanceResolveRequest(BaseModel):
    grievance_id: str
    resolution_notes: str
    status: str = "RESOLVED"  # RESOLVED, ESCALATED

class GrievanceResponse(BaseModel):
    id: str
    grievance_no: str
    applicant_id: str
    application_id: Optional[str] = None
    category: str
    subject: str
    description: str
    assigned_authority: str
    sla_deadline: datetime.datetime
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True
