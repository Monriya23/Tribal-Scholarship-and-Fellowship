from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.database.connection import get_db
from app.database.models import AuditLog, User, Application, Student, Scheme, Deficiency
from app.models.audit import AuditLogResponse
from app.services.data_adapter import StateDataAdapterService
from app.security.permissions import require_roles

router = APIRouter(prefix="/admin", tags=["Administration & Audit"])

class StateBatchIngestRequest(BaseModel):
    state_name: str
    scheme_code: str = "POSTMATRIC"
    records: List[Dict[str, Any]]

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    action_type: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN", "STATE_OFFICER"])),
    db: Session = Depends(get_db)
):
    """
    Fetch immutable system audit trail records.
    """
    query = db.query(AuditLog)
    if action_type:
        query = query.filter(AuditLog.action_type == action_type)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
        
    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [AuditLogResponse.model_validate(l) for l in logs]

@router.post("/ingest/state-batch")
def ingest_state_batch(
    req: StateBatchIngestRequest,
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN", "STATE_OFFICER"])),
    db: Session = Depends(get_db)
):
    """
    Ingest batch scholarship records from an external State Portal via Data Adapter.
    """
    result = StateDataAdapterService.ingest_state_portal_batch(
        db=db,
        state_name=req.state_name,
        records=req.records,
        scheme_code=req.scheme_code
    )
    return result

@router.post("/ingest/csv")
async def ingest_state_csv(
    state_name: str = Form("National Import"),
    scheme_code: str = Form("POSTMATRIC"),
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN", "STATE_OFFICER"])),
    db: Session = Depends(get_db)
):
    """
    Upload and normalize State scholarship CSV dataset into central database.
    """
    content = await file.read()
    csv_text = content.decode('utf-8', errors='ignore')
    
    result = StateDataAdapterService.ingest_csv_data(
        db=db,
        csv_text=csv_text,
        state_name=state_name,
        scheme_code=scheme_code
    )
    return result

@router.get("/telemetry")
def get_system_telemetry(
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN", "STATE_OFFICER"])),
    db: Session = Depends(get_db)
):
    """
    High-level platform telemetry for administrators.
    """
    total_apps = db.query(Application).filter(Application.is_draft == False).count()
    total_students = db.query(Student).count()
    total_deficiencies = db.query(Deficiency).filter(Deficiency.status == "OPEN").count()
    total_audits = db.query(AuditLog).count()
    
    return {
        "total_applications": total_apps,
        "total_students": total_students,
        "open_deficiencies": total_deficiencies,
        "audit_event_count": total_audits,
        "system_status": "ONLINE",
        "deterministic_engine": "ACTIVE"
    }
