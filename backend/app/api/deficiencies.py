import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import Deficiency, Application, User, ApplicationDocument
from app.models.deficiency import (
    DeficiencyCreateRequest, DeficiencyResubmitRequest, DeficiencyResolveRequest, DeficiencyResponse
)
from app.services.notification import NotificationService
from app.security.permissions import require_roles, get_current_user
from app.security.validation import SecurityValidator

router = APIRouter(prefix="/deficiencies", tags=["Deficiency Management"])

@router.get("", response_model=List[DeficiencyResponse])
def get_deficiencies(
    application_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List deficiencies with optional filtering."""
    query = db.query(Deficiency)
    if application_id:
        query = query.filter(Deficiency.application_id == application_id)
    if status:
        query = query.filter(Deficiency.status == status.upper())
    defs = query.order_by(Deficiency.created_at.desc()).all()
    return [DeficiencyResponse.model_validate(d) for d in defs]

@router.post("/raise", response_model=DeficiencyResponse)
def raise_deficiency(
    req: DeficiencyCreateRequest,
    current_user: User = Depends(require_roles(["INSTITUTION_OFFICER", "STATE_OFFICER", "MINISTRY_ADMIN", "REVIEWER"])),
    db: Session = Depends(get_db)
):
    """
    Officer raises a deficiency on an application document.
    Updates application state and dispatches notification to applicant.
    """
    app = db.query(Application).filter(Application.id == req.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    def_id = f"def_{uuid.uuid4().hex[:8]}"
    deficiency = Deficiency(
        id=def_id,
        application_id=app.id,
        document_id=req.document_id,
        document_type=req.document_type,
        stage_created=app.current_stage,
        raised_by_officer=current_user.full_name,
        officer_role=current_user.role,
        issue_type=req.issue_type,
        issue_description=req.issue_description,
        required_action=req.required_action,
        status="OPEN",
        created_at=datetime.datetime.utcnow()
    )
    db.add(deficiency)

    # Transition application status to DEFICIENT
    app.current_stage = "DEFICIENCY"
    app.status = "DEFICIENT"
    app.updated_at = datetime.datetime.utcnow()

    # If specific document, mark status CORRECTION_REQUIRED
    if req.document_id:
        doc = db.query(ApplicationDocument).filter(ApplicationDocument.id == req.document_id).first()
        if doc:
            doc.validation_status = "CORRECTION_REQUIRED"

    # Notify student
    student = app.student
    student_user_id = student.user.id if student and student.user else None
    NotificationService.notify_deficiency_created(
        db=db,
        student_user_id=student_user_id,
        application_no=app.application_no,
        doc_type=req.document_type,
        issue_desc=req.issue_description
    )

    # Audit Log
    SecurityValidator.log_audit_event(
        db=db,
        actor_id=current_user.id,
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        action_type="RAISE_DEFICIENCY",
        entity_type="DEFICIENCY",
        target_entity_id=deficiency.id,
        details=f"Deficiency raised on {req.document_type} for {app.application_no}: {req.issue_description}"
    )

    db.commit()
    db.refresh(deficiency)
    return DeficiencyResponse.model_validate(deficiency)

@router.post("/resubmit", response_model=DeficiencyResponse)
def resubmit_deficiency(
    req: DeficiencyResubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Applicant submits revised document / response to resolve a deficiency.
    """
    deficiency = db.query(Deficiency).filter(Deficiency.id == req.deficiency_id).first()
    if not deficiency:
        raise HTTPException(status_code=404, detail="Deficiency not found")

    deficiency.status = "RESUBMITTED"
    deficiency.resubmitted_at = datetime.datetime.utcnow()

    app = db.query(Application).filter(Application.id == deficiency.application_id).first()
    if app:
        app.current_stage = "RESUBMITTED"
        app.status = "RESUBMITTED"
        app.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(deficiency)
    return DeficiencyResponse.model_validate(deficiency)

@router.post("/resolve", response_model=DeficiencyResponse)
def resolve_deficiency(
    req: DeficiencyResolveRequest,
    current_user: User = Depends(require_roles(["INSTITUTION_OFFICER", "STATE_OFFICER", "MINISTRY_ADMIN", "REVIEWER"])),
    db: Session = Depends(get_db)
):
    """
    Officer reviews resubmitted documents and resolves deficiency.
    """
    deficiency = db.query(Deficiency).filter(Deficiency.id == req.deficiency_id).first()
    if not deficiency:
        raise HTTPException(status_code=404, detail="Deficiency not found")

    if req.decision == "RESOLVE":
        deficiency.status = "RESOLVED"
        deficiency.resolved_at = datetime.datetime.utcnow()
        deficiency.resolved_by = current_user.full_name

        app = db.query(Application).filter(Application.id == deficiency.application_id).first()
        if app:
            app.current_stage = "INSTITUTION_VERIFICATION"
            app.status = "IN_VERIFICATION"
            app.updated_at = datetime.datetime.utcnow()
    else:
        deficiency.status = "OPEN"

    SecurityValidator.log_audit_event(
        db=db,
        actor_id=current_user.id,
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        action_type="RESOLVE_DEFICIENCY",
        entity_type="DEFICIENCY",
        target_entity_id=deficiency.id,
        details=f"Deficiency {deficiency.id} marked as {deficiency.status}: {req.resolution_notes}"
    )

    db.commit()
    db.refresh(deficiency)
    return DeficiencyResponse.model_validate(deficiency)
