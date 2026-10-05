from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# 1. Policy Rule Schemas
class PolicyRuleResponse(BaseModel):
    id: str
    clause_id: str
    policy_id: str
    rule_type: str  # ELIGIBILITY, INCOME, AGE, ACADEMIC, DOCUMENT, INSTITUTION, COURSE, DOMICILE, BENEFIT, SELECTION, RENEWAL, DEADLINE, EXCEPTION, PAYMENT
    field: str
    operator: str
    value: str
    unit: Optional[str] = None
    condition: Optional[str] = None
    action: str = "PASS"
    priority: int = 1
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    source_reference: str
    status: str = "ACTIVE"
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyRuleCreateRequest(BaseModel):
    rule_type: str
    field: str
    operator: str
    value: str
    unit: Optional[str] = None
    condition: Optional[str] = None
    action: str = "PASS"
    priority: int = 1
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    source_reference: str

# 2. Policy Clause Schemas
class PolicyClauseResponse(BaseModel):
    id: str
    policy_id: str
    section: str
    heading: str
    original_text: str
    normalized_text: Optional[str] = None
    source_page: Optional[int] = None
    source_reference: str
    effective_date: Optional[str] = None
    rules: List[PolicyRuleResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyClauseCreateRequest(BaseModel):
    section: str
    heading: str
    original_text: str
    normalized_text: Optional[str] = None
    source_page: Optional[int] = None
    source_reference: str
    effective_date: Optional[str] = None
    rules: List[PolicyRuleCreateRequest] = []

# 3. Policy Object Schemas
class PolicyResponse(BaseModel):
    id: str
    scheme_id: str
    scheme_code: Optional[str] = None
    scheme_name: Optional[str] = None
    policy_name: str
    policy_type: str  # GUIDELINE, AMENDMENT, CIRCULAR, NOTIFICATION, GAZETTE, FAQ
    version: str  # e.g. "NFST-2026-v2"
    status: str  # DRAFT, UNDER_REVIEW, APPROVED, ACTIVE, SUPERSEDED, ARCHIVED
    effective_from: datetime
    effective_to: Optional[datetime] = None
    publication_date: Optional[str] = None
    source_title: str
    source_url: Optional[str] = None
    source_document_id: Optional[str] = None
    source_page: Optional[int] = None
    extracted_at: datetime
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    supersedes_policy_version: Optional[str] = None
    notes: Optional[str] = None
    rules_count: int = 0
    clauses_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PolicyDetailResponse(PolicyResponse):
    clauses: List[PolicyClauseResponse] = []
    rules: List[PolicyRuleResponse] = []

class PolicyCreateRequest(BaseModel):
    scheme_id: str
    policy_name: str
    policy_type: str = "GUIDELINE"
    version: str
    effective_from: Optional[datetime] = None
    effective_to: Optional[datetime] = None
    publication_date: Optional[str] = None
    source_title: str
    source_url: Optional[str] = None
    source_document_id: Optional[str] = None
    source_page: Optional[int] = None
    supersedes_policy_version: Optional[str] = None
    notes: Optional[str] = None
    clauses: List[PolicyClauseCreateRequest] = []

class PolicyStatusUpdateRequest(BaseModel):
    status: str  # APPROVED, ACTIVE, SUPERSEDED, ARCHIVED, UNDER_REVIEW
    actor_name: str = "Authorized Policy Officer"
    notes: Optional[str] = None

# 4. Policy Claim Schemas (Pipeline)
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

# 5. Policy Conflict Schemas
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

# 6. Policy Snapshot & Decision Trace (Reconstructable Decision)
class PolicySnapshotResponse(BaseModel):
    id: str
    application_id: str
    scheme_id: str
    policy_id: Optional[str] = None
    policy_version: str
    stage: str
    applicable_rules: List[Dict[str, Any]] = []
    input_values: Dict[str, Any] = {}
    evidence_references: List[Dict[str, Any]] = []
    calculated_results: List[Dict[str, Any]] = []
    system_decision: str
    human_decision: Optional[str] = None
    human_override_reason: Optional[str] = None
    human_actor: Optional[str] = None
    snapshot_timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class PolicySnapshotCreateRequest(BaseModel):
    application_id: str
    scheme_id: str
    policy_id: Optional[str] = None
    policy_version: str
    stage: str = "ELIGIBILITY"
    applicable_rules: List[Dict[str, Any]] = []
    input_values: Dict[str, Any] = {}
    evidence_references: List[Dict[str, Any]] = []
    calculated_results: List[Dict[str, Any]] = []
    system_decision: str
    human_decision: Optional[str] = None
    human_override_reason: Optional[str] = None
    human_actor: Optional[str] = None

# 7. Policy Change Impact Simulator (Sandbox)
class PolicySimulationRequest(BaseModel):
    scheme_id: str
    base_policy_version: str
    proposed_policy_version: str
    proposed_change_description: str
    rule_changes: List[Dict[str, Any]] = []
    simulated_by: str = "Authorized Policy Officer"

class PolicySimulationResponse(BaseModel):
    id: str
    scheme_id: str
    scheme_code: Optional[str] = None
    base_policy_version: str
    proposed_policy_version: str
    proposed_change_description: str
    rule_changes: List[Dict[str, Any]] = []
    total_analyzed: int
    potentially_affected: int
    eligibility_outcome_changes: int
    verification_outcome_changes: int
    manual_review_required: int
    simulation_results: List[Dict[str, Any]] = []
    simulated_by: str
    is_sandbox: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

# 8. Policy Exception Schemas
class PolicyExceptionResponse(BaseModel):
    id: str
    application_id: str
    application_no: Optional[str] = None
    applicant_name: Optional[str] = None
    scheme_id: Optional[str] = None
    scheme_code: Optional[str] = None
    category: str  # POLICY_CONFLICT, MISSING_AUTHORITATIVE_SOURCE, UNMAPPED_GRADING, DOCUMENT_INCONSISTENCY, INSTITUTION_UNAVAILABLE, STATE_SPECIFIC_RULE, BENEFIT_OVERLAP, DEADLINE_EXCEPTION, HUMAN_ESCALATION
    description: str
    evidence: Dict[str, Any] = {}
    policy_version: str
    assigned_to: Optional[str] = None
    status: str  # OPEN, ASSIGNED, UNDER_REVIEW, RESOLVED, ESCALATED, CLOSED
    resolution: Optional[str] = None  # APPROVED_EXCEPTION, WAIVER_GRANTED, MANUAL_OVERRIDE, REJECTED_EXCEPTION
    resolution_reason: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyExceptionResolveRequest(BaseModel):
    resolution: str  # APPROVED_EXCEPTION, WAIVER_GRANTED, MANUAL_OVERRIDE, REJECTED_EXCEPTION
    resolution_reason: str
    resolved_by: str = "Authorized Officer"

# 9. Human Override Governance
class HumanOverrideRequest(BaseModel):
    application_id: str
    decision_type: str  # ELIGIBILITY, VERIFICATION, SELECTION, AWARD
    previous_system_result: str
    final_human_result: str
    reason: str
    actor: str = "Authorized Officer"
    actor_role: str = "INSTITUTION_OFFICER"
    policy_version: str
    evidence_reference: Optional[str] = None
    notes: Optional[str] = None

class HumanOverrideResponse(BaseModel):
    status: str
    message: str
    override_id: str
    audit_logged: bool = True
    timestamp: datetime
