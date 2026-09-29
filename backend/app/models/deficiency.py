import datetime
from pydantic import BaseModel
from typing import Optional

class DeficiencyCreateRequest(BaseModel):
    application_id: str
    document_type: str
    document_id: Optional[str] = None
    issue_type: str = "CORRECTION_REQUIRED"  # UNREADABLE, INFORMATION_MISMATCH, MISSING_SEAL, EXPIRED, INCORRECT_DOC
    issue_description: str
    required_action: str

class DeficiencyResubmitRequest(BaseModel):
    deficiency_id: str
    action_taken_notes: str
    new_document_id: Optional[str] = None

class DeficiencyResolveRequest(BaseModel):
    deficiency_id: str
    resolution_notes: str
    decision: str = "RESOLVE"  # RESOLVE or REJECT_AGAIN

class DeficiencyResponse(BaseModel):
    id: str
    application_id: str
    document_id: Optional[str] = None
    document_type: str
    stage_created: str
    raised_by_officer: str
    officer_role: str
    issue_type: str
    issue_description: str
    required_action: str
    status: str
    created_at: datetime.datetime
    resubmitted_at: Optional[datetime.datetime] = None
    resolved_at: Optional[datetime.datetime] = None
    resolved_by: Optional[str] = None

    class Config:
        from_attributes = True
