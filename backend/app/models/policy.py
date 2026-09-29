from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class PolicyClaimResponse(BaseModel):
    id: str
    scheme_id: str
    scheme_code: Optional[str] = None
    source_document_id: str
    document_title: Optional[str] = None
    document_url: Optional[str] = None
    source_name: Optional[str] = None
    document_version_id: Optional[str] = None
    claim_type: str
    field: str
    operator: str
    value: str
    unit: Optional[str] = None
    extracted_text: str
    source_page: Optional[int] = None
    confidence: float
    review_status: str  # DETECTED, UNDER_REVIEW, APPROVED, REJECTED, ACTIVE, SUPERSEDED
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyReviewRequest(BaseModel):
    action: str  # APPROVE, REJECT, UNDER_REVIEW, SET_ACTIVE
    reviewer_name: str = "Authorized Policy Officer"
    notes: Optional[str] = None

class PolicyConflictResponse(BaseModel):
    id: str
    scheme_id: str
    scheme_code: Optional[str] = None
    field: str
    source_a_id: str
    source_a_name: Optional[str] = None
    claim_a_id: str
    claim_a_value: Optional[str] = None
    claim_a_text: Optional[str] = None
    source_b_id: str
    source_b_name: Optional[str] = None
    claim_b_id: str
    claim_b_value: Optional[str] = None
    claim_b_text: Optional[str] = None
    description: str
    status: str
    resolved_by: Optional[str] = None
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConflictResolveRequest(BaseModel):
    chosen_claim_id: str
    resolver_name: str
    resolution_notes: str
