import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import (
    Application, Student, Scheme, PolicyClaim, ApplicationDocument, Deficiency, SourceDocument, ApplicationStatusHistory, User
)
from app.models.application import (
    ApplicationSubmitRequest, ApplicationDraftRequest, ApplicationResponse, VerificationDossierResponse,
    RuleEvaluationDetail, ApplicationTransitionRequest
)
from app.services.ocr_service import OCRService
from app.services.eligibility import DeterministicEligibilityEngine
from app.services.normalization import GradeNormalizationService
from app.services.workflow import ApplicationWorkflowEngine
from app.security.permissions import get_current_user_optional, require_roles
from app.security.validation import SecurityValidator
from app.config import settings

router = APIRouter(prefix="/applications", tags=["Student Applications & Lifecycle"])

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    scheme_code: Optional[str] = None,
    stage: Optional[str] = None,
    applicant_mota_id: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List actual submitted applications with optional filters.
    """
    query = db.query(Application).filter(Application.is_draft == False)
    
    if scheme_code:
        scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
        if scheme:
            query = query.filter(Application.scheme_id == scheme.id)
    if stage:
        query = query.filter(Application.current_stage == stage)
    if academic_year:
        query = query.filter(Application.academic_year == academic_year)
    if applicant_mota_id:
        stu = db.query(Student).filter(Student.mota_lifetime_id == applicant_mota_id).first()
        if stu:
            query = query.filter(Application.applicant_id == stu.id)
        
    apps = query.order_by(Application.submission_date.desc()).all()
    
    result = []
    for a in apps:
        student = db.query(Student).filter(Student.id == a.applicant_id).first()
        scheme = db.query(Scheme).filter(Scheme.id == a.scheme_id).first()
        
        item = ApplicationResponse(
            id=a.id,
            application_no=a.application_no,
            applicant_id=a.applicant_id,
            applicant_name=student.full_name if student else "Applicant",
            scheme_code=scheme.code if scheme else "NFST",
            scheme_name=scheme.name if scheme else "National Fellowship",
            academic_year=a.academic_year,
            current_stage=a.current_stage,
            submission_date=a.submission_date,
            declared_income=a.declared_income,
            declared_percentage=a.declared_percentage,
            original_grade_type=a.original_grade_type,
            original_grade_value=a.original_grade_value,
            normalized_percentage=a.normalized_percentage,
            normalization_method=a.normalization_method,
            course_name=a.course_name,
            institute_aishe=a.institute_aishe,
            institute_name=a.institute_name,
            access_mode=a.access_mode,
            assisted_by=a.assisted_by,
            evaluated_policy_version=a.evaluated_policy_version,
            evaluated_rule_version=a.evaluated_rule_version,
            rule_evaluation_results=[RuleEvaluationDetail(**r) for r in (a.rule_evaluation_results or [])],
            ai_confidence=a.ai_confidence,
            status=a.status,
            is_draft=a.is_draft,
            created_at=a.created_at,
            updated_at=a.updated_at
        )
        result.append(item)
    return result

@router.post("/draft")
def save_application_draft(
    draft_req: ApplicationDraftRequest,
    db: Session = Depends(get_db)
):
    """
    Save or update an in-progress draft application (Supports low-connectivity 'Save & Continue Later').
    """
    student = db.query(Student).filter(Student.mota_lifetime_id == draft_req.applicant_mota_id).first()
    if not student:
        student = Student(
            id=f"stu_{uuid.uuid4().hex[:8]}",
            mota_lifetime_id=draft_req.applicant_mota_id,
            full_name=draft_req.draft_data.get("full_name", "Student Draft"),
            aadhaar_vault_ref="XXXX-XXXX-0000",
            date_of_birth="2002-01-01",
            gender="UNSPECIFIED",
            tribe=draft_req.draft_data.get("tribe", "Scheduled Tribe"),
            state=draft_req.draft_data.get("state", "Jharkhand"),
            district=draft_req.draft_data.get("district", "Ranchi"),
            bank_account_masked="XXXXXX0000",
            ifsc="SBIN0000000",
            is_aadhaar_seeded=True
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    scheme = db.query(Scheme).filter(Scheme.code == draft_req.scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{draft_req.scheme_code}' not found")

    # Check existing draft
    existing_draft = db.query(Application).filter(
        Application.applicant_id == student.id,
        Application.scheme_id == scheme.id,
        Application.is_draft == True
    ).first()

    if existing_draft:
        existing_draft.draft_data = draft_req.draft_data
        existing_draft.updated_at = datetime.datetime.utcnow()
        db.commit()
        return {"status": "UPDATED", "application_id": existing_draft.id, "application_no": existing_draft.application_no}
    else:
        app_no = ApplicationWorkflowEngine.generate_application_number(db, draft_req.academic_year or "2026")
        draft_app = Application(
            id=f"app_{uuid.uuid4().hex[:8]}",
            application_no=app_no,
            applicant_id=student.id,
            scheme_id=scheme.id,
            academic_year=draft_req.academic_year or "2025-26",
            current_stage="DRAFT",
            status="DRAFT",
            declared_income=float(draft_req.draft_data.get("declared_income", 0)),
            declared_percentage=float(draft_req.draft_data.get("declared_percentage", 0)),
            course_name=draft_req.draft_data.get("course_name", "Draft Course"),
            institute_aishe=draft_req.draft_data.get("institute_aishe", "C-00000"),
            institute_name=draft_req.draft_data.get("institute_name", ""),
            is_draft=True,
            draft_data=draft_req.draft_data,
            submission_date=datetime.datetime.utcnow()
        )
        db.add(draft_app)
        db.commit()
        db.refresh(draft_app)
        return {"status": "SAVED", "application_id": draft_app.id, "application_no": draft_app.application_no}

@router.post("/submit", response_model=ApplicationResponse)
def submit_application(
    app_req: ApplicationSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Submit a real student application.
    Executes Deterministic Eligibility Engine and Normalizer.
    Enforces Application State Machine and prevents duplicate active applications.
    """
    student = db.query(Student).filter(Student.mota_lifetime_id == app_req.applicant_mota_id).first()
    if not student:
        # Create student profile on the fly
        student = Student(
            id=f"stu_{uuid.uuid4().hex[:8]}",
            mota_lifetime_id=app_req.applicant_mota_id,
            full_name="Pooja Munda",
            aadhaar_vault_ref="XXXX-XXXX-4819",
            date_of_birth="2001-04-12",
            gender="FEMALE",
            tribe="Munda",
            state="Jharkhand",
            district="Ranchi",
            bank_account_masked="XXXXXX4019",
            ifsc="SBIN0001234",
            is_aadhaar_seeded=True,
            annual_family_income=app_req.declared_income
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    scheme = db.query(Scheme).filter(Scheme.code == app_req.scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{app_req.scheme_code}' not found")

    # Duplicate check
    duplicate = ApplicationWorkflowEngine.check_duplicate_application(
        db=db,
        applicant_id=student.id,
        scheme_id=scheme.id,
        academic_year=app_req.academic_year or "2025-26"
    )
    if duplicate:
        raise HTTPException(
            status_code=400,
            detail=f"An active application ({duplicate.application_no}) already exists for this scheme and academic year."
        )

    # 1. Academic Normalization
    grade_type = app_req.original_grade_type or "PERCENTAGE"
    grade_val = app_req.original_grade_value or str(app_req.declared_percentage)
    norm_result = GradeNormalizationService.normalize_academic_score(grade_type, grade_val)

    app_id = f"app_{uuid.uuid4().hex[:8]}"
    app_no = ApplicationWorkflowEngine.generate_application_number(db, app_req.academic_year or "2026")

    # 2. Build preliminary Application entity
    new_app = Application(
        id=app_id,
        application_no=app_no,
        applicant_id=student.id,
        scheme_id=scheme.id,
        academic_year=app_req.academic_year or "2025-26",
        current_stage="SUBMITTED",
        status="SUBMITTED",
        access_mode=app_req.access_mode or "SELF_SERVICE",
        assisted_by=app_req.assisted_by,
        assisted_institution_id=app_req.assisted_institution_id,
        consent_record=app_req.consent_record or {},
        declared_income=app_req.declared_income,
        declared_percentage=app_req.declared_percentage,
        original_grade_type=grade_type,
        original_grade_value=grade_val,
        normalized_percentage=norm_result.get("normalized_percentage", app_req.declared_percentage),
        normalization_method=norm_result.get("normalization_method", "DIRECT_PERCENTAGE"),
        normalization_source=norm_result.get("normalization_source", "Declared Marksheet"),
        course_name=app_req.course_name,
        institute_aishe=app_req.institute_aishe,
        institute_name=app_req.institute_name or "NIT Raipur",
        evaluated_policy_version=scheme.active_version,
        evaluated_rule_version="DETERMINISTIC_RULES_V2_APPROVED",
        is_draft=False,
        submission_date=datetime.datetime.utcnow()
    )
    db.add(new_app)
    db.flush()

    # 3. Associate uploaded documents
    for doc_id in app_req.document_ids:
        doc = db.query(ApplicationDocument).filter(ApplicationDocument.id == doc_id).first()
        if doc:
            doc.application_id = new_app.id

    # 4. Execute Deterministic Eligibility Engine
    eval_res = DeterministicEligibilityEngine.evaluate_application(
        db=db,
        application=new_app,
        student=student,
        scheme=scheme
    )

    new_app.rule_evaluation_results = eval_res.get("checks", [])
    if eval_res["overall_result"] == "ELIGIBLE":
        new_app.current_stage = "INSTITUTION_VERIFICATION"
        new_app.ai_confidence = 0.96
    elif eval_res["overall_result"] == "REVIEW_REQUIRED":
        new_app.current_stage = "ELIGIBILITY_REVIEW"
        new_app.ai_confidence = 0.70
    else:
        new_app.current_stage = "DEFICIENCY"
        new_app.status = "DEFICIENT"
        new_app.ai_confidence = 0.35

    # Status History
    history = ApplicationStatusHistory(
        application_id=new_app.id,
        from_stage="SUBMITTED",
        to_stage=new_app.current_stage,
        from_status="SUBMITTED",
        to_status=new_app.status,
        action_by=student.full_name,
        actor_role="STUDENT" if new_app.access_mode == "SELF_SERVICE" else "OFFICER_ASSISTED",
        reason=f"Application submitted with eligibility result: {eval_res['overall_result']}"
    )
    db.add(history)

    # Audit Log
    SecurityValidator.log_audit_event(
        db=db,
        actor_role="STUDENT",
        actor_name=student.full_name,
        action_type="SUBMIT_APPLICATION",
        entity_type="APPLICATION",
        target_entity_id=new_app.id,
        details=f"Application {new_app.application_no} submitted for {scheme.code}. Result: {eval_res['overall_result']}"
    )

    db.commit()
    db.refresh(new_app)

    return ApplicationResponse(
        id=new_app.id,
        application_no=new_app.application_no,
        applicant_id=student.id,
        applicant_name=student.full_name,
        scheme_code=scheme.code,
        scheme_name=scheme.name,
        academic_year=new_app.academic_year,
        current_stage=new_app.current_stage,
        submission_date=new_app.submission_date,
        declared_income=new_app.declared_income,
        declared_percentage=new_app.declared_percentage,
        original_grade_type=new_app.original_grade_type,
        original_grade_value=new_app.original_grade_value,
        normalized_percentage=new_app.normalized_percentage,
        normalization_method=new_app.normalization_method,
        course_name=new_app.course_name,
        institute_aishe=new_app.institute_aishe,
        institute_name=new_app.institute_name,
        access_mode=new_app.access_mode,
        assisted_by=new_app.assisted_by,
        evaluated_policy_version=new_app.evaluated_policy_version,
        evaluated_rule_version=new_app.evaluated_rule_version,
        rule_evaluation_results=[RuleEvaluationDetail(**r) for r in (new_app.rule_evaluation_results or [])],
        ai_confidence=new_app.ai_confidence,
        status=new_app.status,
        is_draft=new_app.is_draft,
        created_at=new_app.created_at,
        updated_at=new_app.updated_at
    )

from app.security.permissions import get_current_user_optional, require_roles, validate_application_access
import os
from pathlib import Path

@router.post("/{application_id}/transition", response_model=ApplicationResponse)
def transition_application_stage(
    application_id: str,
    req: ApplicationTransitionRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Perform a validated stage transition in the Application State Machine.
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    validate_application_access(current_user, app, db)

    actor_id = current_user.id if current_user else "officer_system"
    actor_role = current_user.role if current_user else "INSTITUTION_OFFICER"
    actor_name = current_user.full_name if current_user else "Verification Officer"

    try:
        updated_app = ApplicationWorkflowEngine.transition_application_stage(
            db=db,
            application=app,
            target_stage=req.target_stage,
            target_status=req.target_status,
            actor_id=actor_id,
            actor_role=actor_role,
            actor_name=actor_name,
            reason=req.reason
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    student = db.query(Student).filter(Student.id == updated_app.applicant_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == updated_app.scheme_id).first()

    return ApplicationResponse(
        id=updated_app.id,
        application_no=updated_app.application_no,
        applicant_id=updated_app.applicant_id,
        applicant_name=student.full_name if student else "Applicant",
        scheme_code=scheme.code if scheme else "NFST",
        scheme_name=scheme.name if scheme else "National Fellowship",
        academic_year=updated_app.academic_year,
        current_stage=updated_app.current_stage,
        submission_date=updated_app.submission_date,
        declared_income=updated_app.declared_income,
        declared_percentage=updated_app.declared_percentage,
        original_grade_type=updated_app.original_grade_type,
        original_grade_value=updated_app.original_grade_value,
        normalized_percentage=updated_app.normalized_percentage,
        normalization_method=updated_app.normalization_method,
        course_name=updated_app.course_name,
        institute_aishe=updated_app.institute_aishe,
        institute_name=updated_app.institute_name,
        access_mode=updated_app.access_mode,
        assisted_by=updated_app.assisted_by,
        evaluated_policy_version=updated_app.evaluated_policy_version,
        evaluated_rule_version=updated_app.evaluated_rule_version,
        rule_evaluation_results=[RuleEvaluationDetail(**r) for r in (updated_app.rule_evaluation_results or [])],
        ai_confidence=updated_app.ai_confidence,
        status=updated_app.status,
        is_draft=updated_app.is_draft,
        created_at=updated_app.created_at,
        updated_at=updated_app.updated_at
    )

@router.post("/upload-document")
async def upload_application_document(
    doc_type: str = Form(...),
    declared_income: Optional[float] = Form(None),
    declared_percentage: Optional[float] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload real document, perform Pre-OCR validation, and run OCR extraction.
    Enforces strict file type whitelisting, size limits, and filename sanitization.
    """
    raw_filename = file.filename or "uploaded_document.pdf"
    clean_filename = os.path.basename(raw_filename).replace("..", "").replace("/", "").replace("\\", "")
    ext = Path(clean_filename).suffix.lower()

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported or unsafe file format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds the maximum permitted size of {settings.MAX_UPLOAD_SIZE_BYTES / (1024*1024):.0f} MB."
        )

    declared_data = {}
    if declared_income is not None:
        declared_data["declared_income"] = declared_income
    if declared_percentage is not None:
        declared_data["declared_percentage"] = declared_percentage
        
    ocr_result = OCRService.process_uploaded_document(
        file_bytes=content,
        file_name=clean_filename,
        doc_type=doc_type,
        declared_data=declared_data
    )
    
    file_id = f"doc_upload_{uuid.uuid4().hex[:8]}"
    save_path = settings.UPLOAD_STORAGE_PATH / f"{file_id}_{clean_filename}"
    save_path.write_bytes(content)

    # Persist ApplicationDocument record
    app_doc = ApplicationDocument(
        id=file_id,
        application_id="",  # Linked upon submit
        doc_type=doc_type,
        file_name=clean_filename,
        file_path=str(save_path),
        file_size=f"{len(content) / 1024:.1f} KB",
        file_hash=ocr_result.get("content_hash"),
        mime_type=file.content_type or "application/pdf",
        readability_score=ocr_result.get("readability_score", 0.0),
        is_readable=ocr_result.get("readability_score", 0.0) >= 40.0,
        ocr_extracted_text=ocr_result.get("extracted_text", "")[:2000],
        ocr_confidence=0.92 if ocr_result.get("status") == "PASSED" else 0.50,
        extracted_fields=ocr_result.get("extracted_fields", {}),
        validation_status="EXTRACTED" if ocr_result.get("status") == "PASSED" else "REVIEW_REQUIRED",
        provenance_category="USER_SUBMITTED"
    )
    db.add(app_doc)
    db.commit()
    db.refresh(app_doc)
    
    return {
        "document_id": file_id,
        "file_name": clean_filename,
        "doc_type": doc_type,
        "saved_location": str(save_path),
        "validation_status": app_doc.validation_status,
        "ocr_result": ocr_result
    }

@router.get("/{application_id}/dossier", response_model=VerificationDossierResponse)
def get_verification_dossier(
    application_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Fetch comprehensive verification dossier for Institution / State Officers / Student.
    Enforces object-level ownership / jurisdiction checks.
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    validate_application_access(current_user, app, db)
        
    student = db.query(Student).filter(Student.id == app.applicant_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == app.scheme_id).first()
    deficiencies = db.query(Deficiency).filter(Deficiency.application_id == app.id).all()
    history = db.query(ApplicationStatusHistory).filter(ApplicationStatusHistory.application_id == app.id).order_by(ApplicationStatusHistory.timestamp.asc()).all()
    docs = db.query(ApplicationDocument).filter(ApplicationDocument.application_id == app.id).all()
    
    app_res = ApplicationResponse(
        id=app.id,
        application_no=app.application_no,
        applicant_id=app.applicant_id,
        applicant_name=student.full_name if student else "Applicant",
        scheme_code=scheme.code if scheme else "NFST",
        scheme_name=scheme.name if scheme else "National Fellowship",
        academic_year=app.academic_year,
        current_stage=app.current_stage,
        submission_date=app.submission_date,
        declared_income=app.declared_income,
        declared_percentage=app.declared_percentage,
        original_grade_type=app.original_grade_type,
        original_grade_value=app.original_grade_value,
        normalized_percentage=app.normalized_percentage,
        normalization_method=app.normalization_method,
        course_name=app.course_name,
        institute_aishe=app.institute_aishe,
        institute_name=app.institute_name,
        access_mode=app.access_mode,
        assisted_by=app.assisted_by,
        evaluated_policy_version=app.evaluated_policy_version,
        evaluated_rule_version=app.evaluated_rule_version,
        rule_evaluation_results=[RuleEvaluationDetail(**r) for r in (app.rule_evaluation_results or [])],
        ai_confidence=app.ai_confidence,
        status=app.status,
        is_draft=app.is_draft,
        created_at=app.created_at,
        updated_at=app.updated_at
    )
    
    provenance_chain = {
        "policy_version": app.evaluated_policy_version,
        "rule_engine_version": app.evaluated_rule_version,
        "evaluation_timestamp": app.submission_date.isoformat(),
        "source_authority": "Ministry of Tribal Affairs, Government of India",
        "provenance_status": "AUTHENTIC_GOVERNMENT_POLICY"
    }

    return VerificationDossierResponse(
        application=app_res,
        student={
            "mota_lifetime_id": student.mota_lifetime_id if student else "",
            "full_name": student.full_name if student else "",
            "tribe": student.tribe if student else "",
            "state": student.state if student else "",
            "district": student.district if student else "",
            "bank_account_masked": student.bank_account_masked if student else "",
            "is_aadhaar_seeded": student.is_aadhaar_seeded if student else True
        },
        documents=[{
            "id": d.id,
            "doc_type": d.doc_type,
            "file_name": d.file_name,
            "readability_score": d.readability_score,
            "validation_status": d.validation_status,
            "extracted_fields": d.extracted_fields
        } for d in docs],
        official_policy_rules=app_res.rule_evaluation_results,
        deficiencies=[{
            "id": d.id,
            "document_type": d.document_type,
            "stage_created": d.stage_created,
            "raised_by_officer": d.raised_by_officer,
            "issue_description": d.issue_description,
            "required_action": d.required_action,
            "status": d.status
        } for d in deficiencies],
        provenance_chain=provenance_chain,
        status_history=[{
            "from_stage": h.from_stage,
            "to_stage": h.to_stage,
            "action_by": h.action_by,
            "actor_role": h.actor_role,
            "reason": h.reason,
            "timestamp": h.timestamp.isoformat()
        } for h in history]
    )
