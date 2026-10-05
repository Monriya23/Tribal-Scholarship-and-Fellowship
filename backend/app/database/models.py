import datetime
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"usr_{uuid.uuid4().hex[:10]}")
    email = Column(String, unique=True, index=True, nullable=True)
    mobile = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True)  # STUDENT, INSTITUTION_OFFICER, STATE_OFFICER, MINISTRY_ADMIN, REVIEWER
    full_name = Column(String, nullable=False)
    institution_id = Column(String, nullable=True)
    state_jurisdiction = Column(String, nullable=True)  # e.g. "Jharkhand", "Odisha", "All"
    student_profile_id = Column(String, ForeignKey("students.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    student_profile = relationship("Student", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Institution(Base):
    __tablename__ = "institutions"
    
    id = Column(String, primary_key=True, index=True)
    aishe_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False, index=True)
    type = Column(String, default="COLLEGE")  # IIT, NIT, IIM, CENTRAL_UNIV, STATE_UNIV, COLLEGE, SCHOOL
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False)
    nodal_officer_name = Column(String, nullable=True)
    nodal_officer_email = Column(String, nullable=True)
    nodal_officer_phone = Column(String, nullable=True)
    is_notified_topclass = Column(Boolean, default=False)
    verification_status = Column(String, default="VERIFIED")  # VERIFIED, PENDING, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    base_url = Column(String, nullable=False)
    source_type = Column(String, default="OFFICIAL_PORTAL")  # OFFICIAL_PORTAL, GAZETTE, NSP, PARLIAMENT
    active = Column(Boolean, default=True)
    last_checked_at = Column(DateTime, nullable=True)
    last_success_at = Column(DateTime, nullable=True)
    status = Column(String, default="CONNECTED")  # CONNECTED, SYNCING, ERROR, ACCESS_UNAVAILABLE
    error_message = Column(Text, nullable=True)
    robots_status = Column(String, default="ALLOWED")  # ALLOWED, RESTRICTED, UNKNOWN
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    documents = relationship("SourceDocument", back_populates="source", cascade="all, delete-orphan")
    sync_logs = relationship("SyncLog", back_populates="source", cascade="all, delete-orphan")

class SourceDocument(Base):
    __tablename__ = "source_documents"
    
    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("sources.id"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    document_type = Column(String, default="GUIDELINE_PDF")  # GUIDELINE_PDF, CIRCULAR, SCHEME_PAGE, GAZETTE, FAQ
    mime_type = Column(String, default="application/pdf")
    content_hash = Column(String, nullable=False, index=True)
    published_date = Column(String, nullable=True)
    effective_date = Column(String, nullable=True)
    fetched_at = Column(DateTime, default=datetime.datetime.utcnow)
    raw_content_location = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    status = Column(String, default="INDEXED")  # FETCHED, PARSED, INDEXED, FAILED
    version = Column(Integer, default=1)
    chunk_count = Column(Integer, default=0)
    
    source = relationship("Source", back_populates="documents")
    versions = relationship("SourceDocumentVersion", back_populates="document", cascade="all, delete-orphan")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    policy_claims = relationship("PolicyClaim", back_populates="document", cascade="all, delete-orphan")

class SourceDocumentVersion(Base):
    __tablename__ = "source_document_versions"
    
    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("source_documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content_hash = Column(String, nullable=False)
    raw_content_location = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    change_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("SourceDocument", back_populates="versions")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("source_documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, nullable=True)
    section_title = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("SourceDocument", back_populates="chunks")

class Scheme(Base):
    __tablename__ = "schemes"
    
    id = Column(String, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)  # NFST, NOS, TOPCLASS, POSTMATRIC, PREMATRIC
    name = Column(String, nullable=False)
    category = Column(String, default="POST_MATRIC")  # HIGHER_EDUCATION_FELLOWSHIP, OVERSEAS_STUDIES, TOP_CLASS, POST_MATRIC, PRE_MATRIC
    description = Column(Text, nullable=True)
    objective = Column(Text, nullable=True)
    funding_type = Column(String, default="CENTRAL_SECTOR")  # CENTRAL_SECTOR, CENTRALLY_SPONSORED
    central_share = Column(Integer, default=100)
    state_share = Column(Integer, default=0)
    active_version = Column(String, default="2025-26")
    selection_method = Column(String, default="MERIT_RANKING")  # MERIT_RANKING, COMMITTEE_EVALUATION, ELIGIBILITY_FIRST_COME, AUTO_ENTITLEMENT
    workflow_definition = Column(JSON, default=dict)
    source_document_id = Column(String, ForeignKey("source_documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    versions = relationship("SchemeVersion", back_populates="scheme", cascade="all, delete-orphan")
    claims = relationship("PolicyClaim", back_populates="scheme", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="scheme")

class SchemeVersion(Base):
    __tablename__ = "scheme_versions"
    
    id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    version_tag = Column(String, nullable=False)  # e.g. "2025-26", "2026-v1"
    effective_academic_year = Column(String, nullable=False)
    effective_from = Column(String, nullable=True)
    effective_to = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")  # ACTIVE, SUPERSEDED, DRAFT
    financial_benefits = Column(JSON, default=dict)
    eligibility_criteria = Column(JSON, default=list)
    required_documents = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    scheme = relationship("Scheme", back_populates="versions")

class PolicyClaim(Base):
    __tablename__ = "policy_claims"
    
    id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    source_document_id = Column(String, ForeignKey("source_documents.id"), nullable=False)
    document_version_id = Column(String, ForeignKey("source_document_versions.id"), nullable=True)
    claim_type = Column(String, default="ELIGIBILITY")  # ELIGIBILITY, BENEFIT, DOCUMENT, RENEWAL, QUOTA
    field = Column(String, nullable=False)  # family_income, minimum_marks, age_limit, tribe_requirement, qualifying_exam
    operator = Column(String, nullable=False)  # LESS_THAN_OR_EQUAL, GREATER_THAN_OR_EQUAL, EQUALS, IN, CONTAINS
    value = Column(String, nullable=False)
    unit = Column(String, nullable=True)  # INR, PERCENT, YEARS, QS_RANK
    extracted_text = Column(Text, nullable=False)
    source_page = Column(Integer, nullable=True)
    confidence = Column(Float, default=0.95)
    review_status = Column(String, default="DETECTED")  # DETECTED, UNDER_REVIEW, APPROVED, REJECTED, ACTIVE, SUPERSEDED
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    scheme = relationship("Scheme", back_populates="claims")
    document = relationship("SourceDocument", back_populates="policy_claims")

class PolicyConflict(Base):
    __tablename__ = "policy_conflicts"
    
    id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    field = Column(String, nullable=False)
    source_a_id = Column(String, ForeignKey("sources.id"), nullable=False)
    claim_a_id = Column(String, ForeignKey("policy_claims.id"), nullable=False)
    source_b_id = Column(String, ForeignKey("sources.id"), nullable=False)
    claim_b_id = Column(String, ForeignKey("policy_claims.id"), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="REQUIRES_HUMAN_REVIEW")  # REQUIRES_HUMAN_REVIEW, RESOLVED, DISMISSED
    resolved_by = Column(String, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(String, primary_key=True, index=True)  # e.g. "pol_nfst_2026_v2"
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False, index=True)
    policy_name = Column(String, nullable=False)
    policy_type = Column(String, default="GUIDELINE")  # GUIDELINE, AMENDMENT, CIRCULAR, NOTIFICATION, GAZETTE, FAQ
    version = Column(String, nullable=False, index=True)  # e.g. "NFST-2026-v2"
    status = Column(String, default="DRAFT", index=True)  # DRAFT, UNDER_REVIEW, APPROVED, ACTIVE, SUPERSEDED, ARCHIVED
    effective_from = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    effective_to = Column(DateTime, nullable=True)
    publication_date = Column(String, nullable=True)
    source_title = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    source_document_id = Column(String, ForeignKey("source_documents.id"), nullable=True)
    source_page = Column(Integer, nullable=True)
    extracted_at = Column(DateTime, default=datetime.datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String, nullable=True)
    supersedes_policy_version = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    scheme = relationship("Scheme", back_populates="policies")
    clauses = relationship("PolicyClause", back_populates="policy", cascade="all, delete-orphan")
    rules = relationship("PolicyRule", back_populates="policy", cascade="all, delete-orphan")

class PolicyClause(Base):
    __tablename__ = "policy_clauses"
    
    id = Column(String, primary_key=True, index=True)  # e.g. "cls_nfst_4_2"
    policy_id = Column(String, ForeignKey("policies.id"), nullable=False, index=True)
    section = Column(String, nullable=False)  # e.g. "Section 4.2", "Eligibility"
    heading = Column(String, nullable=False)
    original_text = Column(Text, nullable=False)
    normalized_text = Column(Text, nullable=True)
    source_page = Column(Integer, nullable=True)
    source_reference = Column(String, nullable=False)
    effective_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    policy = relationship("Policy", back_populates="clauses")
    rules = relationship("PolicyRule", back_populates="clause", cascade="all, delete-orphan")

class PolicyRule(Base):
    __tablename__ = "policy_rules"
    
    id = Column(String, primary_key=True, index=True)  # e.g. "NFST-ELIG-001"
    clause_id = Column(String, ForeignKey("policy_clauses.id"), nullable=False, index=True)
    policy_id = Column(String, ForeignKey("policies.id"), nullable=False, index=True)
    rule_type = Column(String, default="ELIGIBILITY")  # ELIGIBILITY, INCOME, AGE, ACADEMIC, DOCUMENT, INSTITUTION, COURSE, DOMICILE, BENEFIT, SELECTION, RENEWAL, DEADLINE, EXCEPTION, PAYMENT
    field = Column(String, nullable=False)  # family_income, caste, qualifying_exam, minimum_marks, age_limit
    operator = Column(String, nullable=False)  # LESS_THAN_OR_EQUAL, GREATER_THAN_OR_EQUAL, EQUALS, IN, CONTAINS, EXISTS
    value = Column(String, nullable=False)
    unit = Column(String, nullable=True)  # INR, PERCENT, YEARS, QS_RANK, BOOLEAN
    condition = Column(String, nullable=True)
    action = Column(String, default="PASS")
    priority = Column(Integer, default=1)
    effective_from = Column(String, nullable=True)
    effective_to = Column(String, nullable=True)
    source_reference = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    clause = relationship("PolicyClause", back_populates="rules")
    policy = relationship("Policy", back_populates="rules")

class PolicySnapshot(Base):
    __tablename__ = "policy_snapshots"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"snp_{uuid.uuid4().hex[:10]}")
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False, index=True)
    policy_id = Column(String, nullable=True)
    policy_version = Column(String, nullable=False, index=True)
    stage = Column(String, default="ELIGIBILITY", index=True)
    applicable_rules = Column(JSON, default=list)
    input_values = Column(JSON, default=dict)
    evidence_references = Column(JSON, default=list)
    calculated_results = Column(JSON, default=list)
    system_decision = Column(String, nullable=False)  # PASS, FAIL, REVIEW, EXCEPTION, ELIGIBLE, NOT_ELIGIBLE
    human_decision = Column(String, nullable=True)  # APPROVED, REJECTED, MODIFIED
    human_override_reason = Column(Text, nullable=True)
    human_actor = Column(String, nullable=True)
    snapshot_timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="policy_snapshots")

class PolicySimulation(Base):
    __tablename__ = "policy_simulations"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"sim_{uuid.uuid4().hex[:10]}")
    scheme_id = Column(String, nullable=False, index=True)
    scheme_code = Column(String, nullable=True)
    base_policy_version = Column(String, nullable=False)
    proposed_policy_version = Column(String, nullable=False)
    proposed_change_description = Column(Text, nullable=False)
    rule_changes = Column(JSON, default=list)
    total_analyzed = Column(Integer, default=0)
    potentially_affected = Column(Integer, default=0)
    eligibility_outcome_changes = Column(Integer, default=0)
    verification_outcome_changes = Column(Integer, default=0)
    manual_review_required = Column(Integer, default=0)
    simulation_results = Column(JSON, default=list)
    simulated_by = Column(String, nullable=False)
    is_sandbox = Column(Boolean, default=True)  # Sandboxed: never modifies production application records
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PolicyException(Base):
    __tablename__ = "policy_exceptions"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"exc_{uuid.uuid4().hex[:10]}")
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    scheme_id = Column(String, nullable=True)
    category = Column(String, nullable=False, index=True)  # POLICY_CONFLICT, MISSING_AUTHORITATIVE_SOURCE, UNMAPPED_GRADING, DOCUMENT_INCONSISTENCY, INSTITUTION_UNAVAILABLE, STATE_SPECIFIC_RULE, BENEFIT_OVERLAP, DEADLINE_EXCEPTION, HUMAN_ESCALATION
    description = Column(Text, nullable=False)
    evidence = Column(JSON, default=dict)
    policy_version = Column(String, nullable=False)
    assigned_to = Column(String, nullable=True)
    status = Column(String, default="OPEN", index=True)  # OPEN, ASSIGNED, UNDER_REVIEW, RESOLVED, ESCALATED, CLOSED
    resolution = Column(String, nullable=True)  # APPROVED_EXCEPTION, WAIVER_GRANTED, MANUAL_OVERRIDE, REJECTED_EXCEPTION
    resolution_reason = Column(Text, nullable=True)
    resolved_by = Column(String, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="exceptions")

class SyncLog(Base):
    __tablename__ = "sync_logs"
    
    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("sources.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="RUNNING")  # RUNNING, SUCCESS, FAILED, ACCESS_UNAVAILABLE
    pages_checked = Column(Integer, default=0)
    documents_found = Column(Integer, default=0)
    documents_changed = Column(Integer, default=0)
    documents_failed = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    log_details = Column(JSON, default=list)
    
    source = relationship("Source", back_populates="sync_logs")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(String, primary_key=True, index=True)
    mota_lifetime_id = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False, index=True)
    aadhaar_vault_ref = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    tribe = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False)
    mobile = Column(String, nullable=True)
    email = Column(String, nullable=True)
    bank_account_masked = Column(String, nullable=False)
    ifsc = Column(String, nullable=False)
    is_aadhaar_seeded = Column(Boolean, default=True)
    father_name = Column(String, nullable=True)
    mother_name = Column(String, nullable=True)
    domicile_state = Column(String, nullable=True)
    annual_family_income = Column(Float, nullable=True)
    academic_history = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    grievances = relationship("Grievance", back_populates="student", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String, primary_key=True, index=True)
    application_no = Column(String, unique=True, nullable=False, index=True)  # TSF-2026-004821
    applicant_id = Column(String, ForeignKey("students.id"), nullable=False)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    scheme_version_id = Column(String, nullable=True)
    academic_year = Column(String, default="2025-26", index=True)
    
    # Workflow Stage & Status
    # Stages: DRAFT, SUBMITTED, DOCUMENT_VERIFICATION, DEFICIENCY, RESUBMITTED,
    # INSTITUTION_VERIFICATION, ELIGIBILITY_REVIEW, SELECTION, APPROVED, NOT_SELECTED,
    # AWARD, PAYMENT_PROCESSING, PAYMENT_RELEASED, RENEWAL, COMPLETED, CLOSED
    current_stage = Column(String, default="SUBMITTED", index=True)
    status = Column(String, default="SUBMITTED", index=True)  # DRAFT, SUBMITTED, IN_VERIFICATION, DEFICIENT, APPROVED, REJECTED, AWARDED, PAID
    
    # Access Mode & Assisted Submission
    access_mode = Column(String, default="SELF_SERVICE")  # SELF_SERVICE, ASSISTED
    assisted_by = Column(String, nullable=True)  # Officer ID/Name
    assisted_institution_id = Column(String, nullable=True)
    consent_record = Column(JSON, default=dict)
    
    # Declared Data
    declared_income = Column(Float, nullable=False)
    declared_percentage = Column(Float, nullable=False)
    original_grade_type = Column(String, default="PERCENTAGE")  # PERCENTAGE, CGPA_10, CGPA_4, LETTER_GRADE
    original_grade_value = Column(String, default="")
    normalized_percentage = Column(Float, nullable=True)
    normalization_method = Column(String, nullable=True)
    normalization_source = Column(String, nullable=True)
    
    # Course & Institution
    course_name = Column(String, nullable=False)
    institute_aishe = Column(String, nullable=False, index=True)
    institute_name = Column(String, nullable=True)
    
    # Submission & Draft
    submission_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_draft = Column(Boolean, default=False)
    draft_data = Column(JSON, default=dict)
    
    # Deterministic Evaluation Snapshot
    evaluated_policy_version = Column(String, nullable=True)
    evaluated_rule_version = Column(String, nullable=True)
    rule_evaluation_results = Column(JSON, default=list)
    ai_confidence = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    student = relationship("Student", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")
    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")
    deficiencies = relationship("Deficiency", back_populates="application", cascade="all, delete-orphan")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")
    eligibility_results = relationship("EligibilityResult", back_populates="application", cascade="all, delete-orphan")
    selection_results = relationship("SelectionResult", back_populates="application", cascade="all, delete-orphan")
    policy_snapshots = relationship("PolicySnapshot", back_populates="application", cascade="all, delete-orphan")
    exceptions = relationship("PolicyException", back_populates="application", cascade="all, delete-orphan")

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"ash_{uuid.uuid4().hex[:10]}")
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    from_stage = Column(String, nullable=True)
    to_stage = Column(String, nullable=False)
    from_status = Column(String, nullable=True)
    to_status = Column(String, nullable=False)
    action_by = Column(String, nullable=False)  # User ID / System
    actor_role = Column(String, nullable=False)  # STUDENT, INSTITUTION_OFFICER, STATE_OFFICER, MINISTRY_ADMIN, SYSTEM
    reason = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="status_history")

class ApplicationDocument(Base):
    __tablename__ = "application_documents"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    doc_type = Column(String, nullable=False)  # CASTE_CERTIFICATE, INCOME_CERTIFICATE, BONAFIDE, MARKSHEET, DISABILITY_CERTIFICATE
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(String, nullable=True)
    file_hash = Column(String, nullable=True)
    mime_type = Column(String, default="application/pdf")
    
    # Document Quality & Pre-OCR
    readability_score = Column(Float, default=0.0)
    is_readable = Column(Boolean, default=True)
    quality_notes = Column(Text, nullable=True)
    
    # OCR Extraction Summary
    ocr_extracted_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.0)
    extracted_fields = Column(JSON, default=dict)
    
    # Lifecycle Status:
    # RECEIVED, UNREADABLE, EXTRACTED, CONSISTENCY_REVIEW, OFFICIAL_VERIFICATION_PENDING,
    # VERIFIED, REVIEW_REQUIRED, CORRECTION_REQUIRED, REJECTED
    validation_status = Column(String, default="RECEIVED", index=True)
    provenance_category = Column(String, default="USER_SUBMITTED")  # USER_SUBMITTED, AI_EXTRACTED, OFFICIAL_SOURCE_VERIFIED, HUMAN_VERIFIED, SYSTEM_CALCULATED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="documents")
    extractions = relationship("DocumentExtraction", back_populates="document", cascade="all, delete-orphan")
    verifications = relationship("DocumentVerification", back_populates="document", cascade="all, delete-orphan")

class DocumentExtraction(Base):
    __tablename__ = "document_extractions"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"ext_{uuid.uuid4().hex[:10]}")
    document_id = Column(String, ForeignKey("application_documents.id"), nullable=False)
    ocr_engine = Column(String, default="PYPDF_TESSERACT")
    extracted_text = Column(Text, nullable=True)
    extracted_fields = Column(JSON, default=dict)
    confidence_score = Column(Float, default=0.0)
    provenance = Column(String, default="AI_EXTRACTED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("ApplicationDocument", back_populates="extractions")

class DocumentVerification(Base):
    __tablename__ = "document_verifications"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"vfy_{uuid.uuid4().hex[:10]}")
    document_id = Column(String, ForeignKey("application_documents.id"), nullable=False)
    verification_provider = Column(String, nullable=False)  # STATE_EDISTRICT_ADAPTER, DIGILOCKER_DEMO_ADAPTER, MANUAL_OFFICER
    verification_type = Column(String, default="SYNTHETIC_DEMO")  # GOVERNMENT_API, SYNTHETIC_DEMO, MANUAL_INSPECTION
    is_demo_environment = Column(Boolean, default=True)  # Crucial: clearly marks Synthetic Verification Environment
    provider_response = Column(JSON, default=dict)
    is_verified = Column(Boolean, default=False)
    mismatch_details = Column(JSON, default=dict)
    verified_by = Column(String, nullable=True)
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("ApplicationDocument", back_populates="verifications")

class Deficiency(Base):
    __tablename__ = "deficiencies"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    document_id = Column(String, ForeignKey("application_documents.id"), nullable=True)
    document_type = Column(String, nullable=False)
    stage_created = Column(String, default="INSTITUTION_VERIFICATION")
    raised_by_officer = Column(String, nullable=False)
    officer_role = Column(String, default="INSTITUTION_OFFICER")
    issue_type = Column(String, default="CORRECTION_REQUIRED")  # UNREADABLE, INFORMATION_MISMATCH, MISSING_SEAL, EXPIRED, INCORRECT_DOC
    issue_description = Column(Text, nullable=False)
    required_action = Column(Text, nullable=False)
    status = Column(String, default="OPEN", index=True)  # OPEN, ACTION_REQUIRED, RESUBMITTED, UNDER_REVIEW, RESOLVED, CLOSED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resubmitted_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String, nullable=True)
    
    application = relationship("Application", back_populates="deficiencies")

class EligibilityResult(Base):
    __tablename__ = "eligibility_results"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"elg_{uuid.uuid4().hex[:10]}")
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    scheme_version_id = Column(String, nullable=True)
    policy_version_tag = Column(String, nullable=False)
    overall_result = Column(String, nullable=False, index=True)  # ELIGIBLE, NOT_ELIGIBLE, REVIEW_REQUIRED
    checks_matrix = Column(JSON, default=list)
    input_snapshot = Column(JSON, default=dict)
    evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="eligibility_results")

class SelectionResult(Base):
    __tablename__ = "selection_results"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"sel_{uuid.uuid4().hex[:10]}")
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    academic_year = Column(String, nullable=False, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    rank = Column(Integer, nullable=True)
    normalized_score = Column(Float, nullable=True)
    quota_category = Column(String, default="GENERAL_ST")  # GENERAL_ST, PVTG, DISABILITY_ST, FEMALE_ST
    selection_status = Column(String, default="SELECTED", index=True)  # SELECTED, WAITLISTED, NOT_SELECTED, COMMITTEE_REVIEW_PENDING
    calculation_trace = Column(JSON, default=dict)
    batch_id = Column(String, nullable=True)
    published_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    application = relationship("Application", back_populates="selection_results")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"notif_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    recipient_role = Column(String, nullable=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="SYSTEM")  # DEFICIENCY, STATUS_UPDATE, DEADLINE, SYSTEM
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    link_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")

class Grievance(Base):
    __tablename__ = "grievances"
    
    id = Column(String, primary_key=True, index=True)
    grievance_no = Column(String, unique=True, nullable=False, index=True)
    applicant_id = Column(String, ForeignKey("students.id"), nullable=False)
    application_id = Column(String, ForeignKey("applications.id"), nullable=True)
    category = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    assigned_authority = Column(String, default="INSTITUTION_NODAL")
    sla_deadline = Column(DateTime, nullable=False)
    status = Column(String, default="SUBMITTED", index=True)  # SUBMITTED, IN_REVIEW, RESOLVED, ESCALATED
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    student = relationship("Student", back_populates="grievances")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True, default=lambda: f"aud_{uuid.uuid4().hex[:10]}")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    actor_id = Column(String, nullable=True)
    actor_role = Column(String, nullable=False)  # STUDENT, INSTITUTION_OFFICER, STATE_OFFICER, MINISTRY_ADMIN, SYSTEM, REVIEWER
    actor_name = Column(String, nullable=False)
    action_type = Column(String, nullable=False, index=True)  # SUBMIT_APPLICATION, VERIFY_DOCUMENT, CREATE_DEFICIENCY, RESOLVE_DEFICIENCY, OVERRIDE_DECISION, APPROVE_POLICY, ACTIVATE_POLICY
    entity_type = Column(String, nullable=False)  # APPLICATION, DOCUMENT, DEFICIENCY, POLICY_CLAIM, POLICY_CONFLICT, SCHEME_VERSION
    target_entity_id = Column(String, nullable=False, index=True)
    details = Column(Text, nullable=False)
    before_state = Column(JSON, nullable=True)
    after_state = Column(JSON, nullable=True)
    reason = Column(Text, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
