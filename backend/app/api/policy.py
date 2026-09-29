import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import PolicyClaim, Scheme, SourceDocument, Source, PolicyConflict
from app.models.policy import (
    PolicyClaimResponse, PolicyReviewRequest, PolicyConflictResponse, ConflictResolveRequest
)
from app.services.provenance_service import ProvenanceService

router = APIRouter(prefix="/policy", tags=["Policy Review & Provenance"])

@router.get("/claims", response_model=List[PolicyClaimResponse])
def get_policy_claims(
    scheme_code: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List policy claims extracted from official sources."""
    query = db.query(PolicyClaim)
    if scheme_code:
        scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
        if scheme:
            query = query.filter(PolicyClaim.scheme_id == scheme.id)
    if status:
        query = query.filter(PolicyClaim.review_status == status)
        
    claims = query.order_by(PolicyClaim.created_at.desc()).all()
    
    result = []
    for c in claims:
        doc = db.query(SourceDocument).filter(SourceDocument.id == c.source_document_id).first()
        src = db.query(Source).filter(Source.id == doc.source_id).first() if doc else None
        scheme = db.query(Scheme).filter(Scheme.id == c.scheme_id).first()
        
        item = PolicyClaimResponse(
            id=c.id,
            scheme_id=c.scheme_id,
            scheme_code=scheme.code if scheme else "NFST",
            source_document_id=c.source_document_id,
            document_title=doc.title if doc else "Guidelines",
            document_url=doc.url if doc else "",
            source_name=src.name if src else "Ministry of Tribal Affairs",
            document_version_id=c.document_version_id,
            claim_type=c.claim_type,
            field=c.field,
            operator=c.operator,
            value=c.value,
            unit=c.unit,
            extracted_text=c.extracted_text,
            source_page=c.source_page,
            confidence=c.confidence,
            review_status=c.review_status,
            approved_by=c.approved_by,
            approved_at=c.approved_at,
            rejection_reason=c.rejection_reason,
            created_at=c.created_at
        )
        result.append(item)
    return result

@router.post("/claims/{claim_id}/review", response_model=PolicyClaimResponse)
def review_policy_claim(
    claim_id: str,
    review_req: PolicyReviewRequest,
    db: Session = Depends(get_db)
):
    """Human approval or rejection of an AI-extracted policy claim."""
    claim = db.query(PolicyClaim).filter(PolicyClaim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    action = review_req.action.upper()
    if action == "APPROVE":
        claim.review_status = "APPROVED"
        claim.approved_by = review_req.reviewer_name
        claim.approved_at = datetime.datetime.utcnow()
        claim.rejection_reason = None
    elif action == "REJECT":
        claim.review_status = "REJECTED"
        claim.rejection_reason = review_req.notes or "Rejected during authorized human review"
    elif action == "SET_ACTIVE":
        claim.review_status = "ACTIVE"
        claim.approved_by = review_req.reviewer_name
        claim.approved_at = datetime.datetime.utcnow()
    elif action == "UNDER_REVIEW":
        claim.review_status = "UNDER_REVIEW"
    else:
        raise HTTPException(status_code=400, detail=f"Invalid action: {action}")
        
    db.commit()
    db.refresh(claim)
    
    doc = db.query(SourceDocument).filter(SourceDocument.id == claim.source_document_id).first()
    src = db.query(Source).filter(Source.id == doc.source_id).first() if doc else None
    scheme = db.query(Scheme).filter(Scheme.id == claim.scheme_id).first()
    
    return PolicyClaimResponse(
        id=claim.id,
        scheme_id=claim.scheme_id,
        scheme_code=scheme.code if scheme else "NFST",
        source_document_id=claim.source_document_id,
        document_title=doc.title if doc else "Guidelines",
        document_url=doc.url if doc else "",
        source_name=src.name if src else "Ministry of Tribal Affairs",
        claim_type=claim.claim_type,
        field=claim.field,
        operator=claim.operator,
        value=claim.value,
        unit=claim.unit,
        extracted_text=claim.extracted_text,
        source_page=claim.source_page,
        confidence=claim.confidence,
        review_status=claim.review_status,
        approved_by=claim.approved_by,
        approved_at=claim.approved_at,
        rejection_reason=claim.rejection_reason,
        created_at=claim.created_at
    )

@router.get("/claims/{claim_id}/provenance")
def get_claim_provenance(claim_id: str, db: Session = Depends(get_db)):
    """Get full official provenance chain for an extracted rule."""
    prov = ProvenanceService.get_claim_provenance(db, claim_id)
    if not prov:
        raise HTTPException(status_code=404, detail="Claim not found")
    return prov

@router.get("/conflicts", response_model=List[PolicyConflictResponse])
def get_policy_conflicts(db: Session = Depends(get_db)):
    """List detected policy discrepancies across official documents."""
    conflicts = db.query(PolicyConflict).all()
    result = []
    for c in conflicts:
        scheme = db.query(Scheme).filter(Scheme.id == c.scheme_id).first()
        src_a = db.query(Source).filter(Source.id == c.source_a_id).first()
        src_b = db.query(Source).filter(Source.id == c.source_b_id).first()
        claim_a = db.query(PolicyClaim).filter(PolicyClaim.id == c.claim_a_id).first()
        claim_b = db.query(PolicyClaim).filter(PolicyClaim.id == c.claim_b_id).first()
        
        result.append(PolicyConflictResponse(
            id=c.id,
            scheme_id=c.scheme_id,
            scheme_code=scheme.code if scheme else "NFST",
            field=c.field,
            source_a_id=c.source_a_id,
            source_a_name=src_a.name if src_a else "Source A",
            claim_a_id=c.claim_a_id,
            claim_a_value=claim_a.value if claim_a else None,
            claim_a_text=claim_a.extracted_text if claim_a else None,
            source_b_id=c.source_b_id,
            source_b_name=src_b.name if src_b else "Source B",
            claim_b_id=c.claim_b_id,
            claim_b_value=claim_b.value if claim_b else None,
            claim_b_text=claim_b.extracted_text if claim_b else None,
            description=c.description,
            status=c.status,
            resolved_by=c.resolved_by,
            resolution_notes=c.resolution_notes,
            resolved_at=c.resolved_at,
            created_at=c.created_at
        ))
    return result

@router.post("/conflicts/{conflict_id}/resolve")
def resolve_conflict(
    conflict_id: str,
    resolve_req: ConflictResolveRequest,
    db: Session = Depends(get_db)
):
    """Authorized human resolution of a conflicting circular."""
    conflict = db.query(PolicyConflict).filter(PolicyConflict.id == conflict_id).first()
    if not conflict:
        raise HTTPException(status_code=404, detail="Conflict not found")
        
    conflict.status = "RESOLVED"
    conflict.resolved_by = resolve_req.resolver_name
    conflict.resolution_notes = resolve_req.resolution_notes
    conflict.resolved_at = datetime.datetime.utcnow()
    
    # Mark chosen claim approved and other superseded
    chosen = db.query(PolicyClaim).filter(PolicyClaim.id == resolve_req.chosen_claim_id).first()
    if chosen:
        chosen.review_status = "APPROVED"
        chosen.approved_by = resolve_req.resolver_name
        chosen.approved_at = datetime.datetime.utcnow()
        
    other_claim_id = conflict.claim_b_id if resolve_req.chosen_claim_id == conflict.claim_a_id else conflict.claim_a_id
    other = db.query(PolicyClaim).filter(PolicyClaim.id == other_claim_id).first()
    if other:
        other.review_status = "SUPERSEDED"
        other.rejection_reason = f"Superseded in conflict resolution: {resolve_req.resolution_notes}"
        
    db.commit()
    return {"status": "SUCCESS", "message": "Conflict resolved successfully"}
