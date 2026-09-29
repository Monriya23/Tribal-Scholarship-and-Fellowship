import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.database.connection import get_db
from app.database.models import Scheme, SchemeVersion, PolicyClaim, User
from app.models.scheme import SchemeResponse, SchemeVersionResponse
from app.security.permissions import require_roles
from app.security.validation import SecurityValidator

router = APIRouter(prefix="/schemes", tags=["Official Schemes"])

class SchemeVersionCreateRequest(BaseModel):
    version_tag: str
    effective_academic_year: str
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    financial_benefits: Dict[str, Any] = {}
    eligibility_criteria: List[Dict[str, Any]] = []
    required_documents: List[str] = []

@router.get("", response_model=List[SchemeResponse])
def get_schemes(db: Session = Depends(get_db)):
    """List all official MoTA schemes and active policy versions."""
    schemes = db.query(Scheme).all()
    result = []
    for s in schemes:
        versions = db.query(SchemeVersion).filter(SchemeVersion.scheme_id == s.id).all()
        item = SchemeResponse(
            id=s.id,
            code=s.code,
            name=s.name,
            category=s.category,
            description=s.description,
            objective=s.objective,
            funding_type=s.funding_type,
            central_share=s.central_share,
            state_share=s.state_share,
            active_version=s.active_version,
            source_document_id=s.source_document_id,
            versions=[SchemeVersionResponse.model_validate(v) for v in versions]
        )
        result.append(item)
    return result

@router.get("/{scheme_code}", response_model=SchemeResponse)
def get_scheme_by_code(scheme_code: str, db: Session = Depends(get_db)):
    """Get single scheme details by code."""
    s = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
    if not s:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_code}' not found")
    versions = db.query(SchemeVersion).filter(SchemeVersion.scheme_id == s.id).all()
    return SchemeResponse(
        id=s.id,
        code=s.code,
        name=s.name,
        category=s.category,
        description=s.description,
        objective=s.objective,
        funding_type=s.funding_type,
        central_share=s.central_share,
        state_share=s.state_share,
        active_version=s.active_version,
        source_document_id=s.source_document_id,
        versions=[SchemeVersionResponse.model_validate(v) for v in versions]
    )

@router.get("/{scheme_code}/active-rules")
def get_scheme_active_rules(scheme_code: str, db: Session = Depends(get_db)):
    """Get active, human-approved rules for the Rule Engine."""
    scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    # Fetch approved policy claims
    claims = db.query(PolicyClaim).filter(
        PolicyClaim.scheme_id == scheme.id,
        PolicyClaim.review_status.in_(["APPROVED", "ACTIVE"])
    ).all()
    
    rules = []
    for c in claims:
        rules.append({
            "rule_id": c.id,
            "field": c.field,
            "operator": c.operator,
            "target_value": c.value,
            "unit": c.unit,
            "source_document_id": c.source_document_id,
            "source_page": c.source_page,
            "extracted_text": c.extracted_text,
            "policy_version": scheme.active_version,
            "provenance_badge": "OFFICIAL SOURCE"
        })
        
    return {
        "scheme_code": scheme.code,
        "scheme_name": scheme.name,
        "active_policy_version": scheme.active_version,
        "rule_count": len(rules),
        "rules": rules
    }

@router.post("/{scheme_code}/versions")
def create_scheme_version(
    scheme_code: str,
    req: SchemeVersionCreateRequest,
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN"])),
    db: Session = Depends(get_db)
):
    """Create a new policy version for a scheme without overwriting historical versions."""
    scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    new_v_id = f"{scheme.id}_v_{req.version_tag.replace('-', '_').replace('.', '_')}_{uuid.uuid4().hex[:4]}"
    new_v = SchemeVersion(
        id=new_v_id,
        scheme_id=scheme.id,
        version_tag=req.version_tag,
        effective_academic_year=req.effective_academic_year,
        effective_from=req.effective_from,
        effective_to=req.effective_to,
        status="ACTIVE",
        financial_benefits=req.financial_benefits,
        eligibility_criteria=req.eligibility_criteria,
        required_documents=req.required_documents,
        is_active=True,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_v)
    
    # Update active version pointer on Scheme
    scheme.active_version = req.version_tag
    
    SecurityValidator.log_audit_event(
        db=db,
        actor_id=current_user.id,
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        action_type="CREATE_SCHEME_VERSION",
        entity_type="SCHEME_VERSION",
        target_entity_id=new_v.id,
        details=f"Created and activated policy version {req.version_tag} for {scheme.code}"
    )

    db.commit()
    db.refresh(new_v)
    return {"status": "SUCCESS", "version_id": new_v.id, "version_tag": new_v.version_tag}
