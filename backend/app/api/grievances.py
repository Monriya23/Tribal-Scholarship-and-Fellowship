import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import Grievance, Student, User
from app.models.grievance import GrievanceCreateRequest, GrievanceResolveRequest, GrievanceResponse
from app.security.permissions import require_roles
from app.security.validation import SecurityValidator

router = APIRouter(prefix="/grievances", tags=["Grievance Redressal"])

@router.get("", response_model=List[GrievanceResponse])
def get_grievances(
    applicant_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List grievances with optional status/applicant filters."""
    query = db.query(Grievance)
    if applicant_id:
        query = query.filter(Grievance.applicant_id == applicant_id)
    if status:
        query = query.filter(Grievance.status == status.upper())
    grievances = query.order_by(Grievance.created_at.desc()).all()
    return [GrievanceResponse.model_validate(g) for g in grievances]

@router.post("/submit", response_model=GrievanceResponse)
def submit_grievance(
    req: GrievanceCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Student submits a formal grievance. Assigns 7-day statutory SLA deadline.
    """
    student = db.query(Student).filter(Student.id == req.applicant_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    count = db.query(Grievance).count() + 1
    grievance_no = f"GRV-{datetime.datetime.utcnow().year}-{str(count).zfill(5)}"
    sla = datetime.datetime.utcnow() + datetime.timedelta(days=7)

    g = Grievance(
        id=f"grv_{uuid.uuid4().hex[:8]}",
        grievance_no=grievance_no,
        applicant_id=student.id,
        application_id=req.application_id,
        category=req.category,
        subject=req.subject,
        description=req.description,
        assigned_authority="INSTITUTION_NODAL",
        sla_deadline=sla,
        status="SUBMITTED",
        created_at=datetime.datetime.utcnow()
    )
    db.add(g)

    SecurityValidator.log_audit_event(
        db=db,
        actor_role="STUDENT",
        actor_name=student.full_name,
        action_type="SUBMIT_GRIEVANCE",
        entity_type="GRIEVANCE",
        target_entity_id=g.id,
        details=f"Grievance {g.grievance_no} submitted: {g.subject}"
    )

    db.commit()
    db.refresh(g)
    return GrievanceResponse.model_validate(g)

@router.post("/resolve", response_model=GrievanceResponse)
def resolve_grievance(
    req: GrievanceResolveRequest,
    current_user: User = Depends(require_roles(["INSTITUTION_OFFICER", "STATE_OFFICER", "MINISTRY_ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Authorized officer resolves a grievance with recorded resolution notes.
    """
    g = db.query(Grievance).filter(Grievance.id == req.grievance_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found")

    g.status = req.status
    g.resolution_notes = req.resolution_notes
    g.resolved_at = datetime.datetime.utcnow()

    SecurityValidator.log_audit_event(
        db=db,
        actor_id=current_user.id,
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        action_type="RESOLVE_GRIEVANCE",
        entity_type="GRIEVANCE",
        target_entity_id=g.id,
        details=f"Grievance {g.grievance_no} marked as {g.status}: {req.resolution_notes}"
    )

    db.commit()
    db.refresh(g)
    return GrievanceResponse.model_validate(g)
