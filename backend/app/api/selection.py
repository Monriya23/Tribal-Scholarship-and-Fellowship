from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import SelectionResult, Scheme, User
from app.models.selection import SelectionRunRequest, SelectionResultResponse
from app.services.selection import SelectionEngine
from app.security.permissions import require_roles
from app.security.validation import SecurityValidator

router = APIRouter(prefix="/selection", tags=["Selection & Merit Engine"])

@router.get("", response_model=List[SelectionResultResponse])
def get_selection_results(
    scheme_code: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List published selection results and merit lists."""
    query = db.query(SelectionResult)
    if scheme_code:
        scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
        if scheme:
            query = query.filter(SelectionResult.scheme_id == scheme.id)
    if academic_year:
        query = query.filter(SelectionResult.academic_year == academic_year)
        
    results = query.order_by(SelectionResult.rank.asc()).all()
    return [SelectionResultResponse.model_validate(r) for r in results]

@router.post("/run")
def run_scheme_selection(
    req: SelectionRunRequest,
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Execute scheme-specific deterministic selection or committee queueing.
    """
    scheme_code = req.scheme_code.upper().strip()
    
    if scheme_code == "NFST":
        res = SelectionEngine.run_nfst_merit_selection(
            db=db,
            academic_year=req.academic_year,
            total_slots=req.total_slots or 750
        )
    elif scheme_code == "NOS":
        res = SelectionEngine.run_nos_committee_queue_assignment(
            db=db,
            academic_year=req.academic_year
        )
    else:
        raise HTTPException(status_code=400, detail=f"Selection engine not configured for scheme: {scheme_code}")

    SecurityValidator.log_audit_event(
        db=db,
        actor_id=current_user.id,
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        action_type="EXECUTE_SELECTION",
        entity_type="SELECTION_RESULT",
        target_entity_id=res.get("batch_id", "batch_manual"),
        details=f"Selection executed for {scheme_code} ({req.academic_year})"
    )

    return res
