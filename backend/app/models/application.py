from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class StudentProfileCreate(BaseModel):
    mota_lifetime_id: str
    full_name: str
    aadhaar_vault_ref: str
    date_of_birth: str
    gender: str
    tribe: str
    state: str
    district: str
    mobile: Optional[str] = None
    email: Optional[str] = None
    bank_account_masked: str
    ifsc: str
    is_aadhaar_seeded: bool = True
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    annual_family_income: Optional[float] = None

class ApplicationDraftRequest(BaseModel):
    applicant_mota_id: str
    scheme_code: str
    academic_year: Optional[str] = "2025-26"
    draft_data: Dict[str, Any]

class ApplicationSubmitRequest(BaseModel):
    applicant_mota_id: str
    scheme_code: str
    academic_year: Optional[str] = "2025-26"
    declared_income: float
    declared_percentage: float
    original_grade_type: Optional[str] = "PERCENTAGE"  # PERCENTAGE, CGPA_10, CGPA_4
    original_grade_value: Optional[str] = None
    course_name: str
    institute_aishe: str
    institute_name: Optional[str] = None
    document_ids: List[str] = []
    
    # Assisted Application Support
    access_mode: Optional[str] = "SELF_SERVICE"  # SELF_SERVICE, ASSISTED
    assisted_by: Optional[str] = None
    assisted_institution_id: Optional[str] = None
    consent_record: Optional[Dict[str, Any]] = None

class ApplicationTransitionRequest(BaseModel):
    target_stage: str
    target_status: Optional[str] = None
    reason: Optional[str] = None

class RuleEvaluationDetail(BaseModel):
    rule_id: str
    field: Optional[str] = None
    operator: Optional[str] = None
    criterion: Optional[str] = None
    required_value: Optional[str] = None
    declared_value: Optional[str] = None
    extracted_value: Optional[str] = None
    result: Optional[str] = None
    status: Optional[str] = None  # PASS, FAIL, REVIEW_REQUIRED, MISSING
    explanation: Optional[str] = None
    source_policy_id: Optional[str] = None
    source_doc_title: Optional[str] = None
    source_document_title: Optional[str] = None
    source_page: Optional[int] = None
    policy_version: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    application_no: str
    applicant_id: str
    applicant_name: Optional[str] = None
    scheme_code: str
    scheme_name: Optional[str] = None
    academic_year: Optional[str] = "2025-26"
    current_stage: str
    submission_date: datetime
    declared_income: float
    declared_percentage: float
    original_grade_type: Optional[str] = "PERCENTAGE"
    original_grade_value: Optional[str] = None
    normalized_percentage: Optional[float] = None
    normalization_method: Optional[str] = None
    course_name: str
    institute_aishe: str
    institute_name: Optional[str] = None
    access_mode: Optional[str] = "SELF_SERVICE"
    assisted_by: Optional[str] = None
    evaluated_policy_version: Optional[str] = None
    evaluated_rule_version: Optional[str] = None
    rule_evaluation_results: List[RuleEvaluationDetail] = []
    ai_confidence: float
    status: str
    is_draft: Optional[bool] = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class VerificationDossierResponse(BaseModel):
    application: ApplicationResponse
    student: Optional[Dict[str, Any]] = None
    documents: List[Dict[str, Any]] = []
    official_policy_rules: List[RuleEvaluationDetail] = []
    deficiencies: List[Dict[str, Any]] = []
    provenance_chain: Dict[str, Any]
    status_history: List[Dict[str, Any]] = []
