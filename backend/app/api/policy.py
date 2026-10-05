import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import (
    Policy, PolicyClause, PolicyRule, PolicyClaim, 
    PolicyConflict, PolicySnapshot, PolicySimulation, 
    PolicyException, Scheme, SourceDocument, Source, Application, Student
)
from app.models.policy import (
    PolicyResponse, PolicyDetailResponse, PolicyCreateRequest, 
    PolicyStatusUpdateRequest, PolicyClaimResponse, PolicyReviewRequest, 
    PolicyConflictResponse, ConflictResolveRequest, PolicySnapshotResponse, 
    PolicySnapshotCreateRequest, PolicySimulationRequest, PolicySimulationResponse, 
    PolicyExceptionResponse, PolicyExceptionResolveRequest, 
    HumanOverrideRequest, HumanOverrideResponse
)
from app.services.provenance_service import ProvenanceService
from app.services.policy_service import PolicyService

router = APIRouter(prefix="/policy", tags=["Policy Intelligence & Decision Governance"])

# =========================================================================
# 1. POLICIES & POLICY VERSIONS
# =========================================================================

@router.get("/policies", response_model=List[PolicyResponse])
def get_policies(
    scheme_code: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all structured policies and version records."""
    query = db.query(Policy)
    if scheme_code:
        scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
        if scheme:
            query = query.filter(Policy.scheme_id == scheme.id)
    if status:
        query = query.filter(Policy.status == status)

    policies = query.order_by(Policy.effective_from.desc()).all()
    results = []
    for p in policies:
        scheme = db.query(Scheme).filter(Scheme.id == p.scheme_id).first()
        rules_cnt = db.query(PolicyRule).filter(PolicyRule.policy_id == p.id).count()
        clauses_cnt = db.query(PolicyClause).filter(PolicyClause.policy_id == p.id).count()
        
        results.append(PolicyResponse(
            id=p.id,
            scheme_id=p.scheme_id,
            scheme_code=scheme.code if scheme else "NFST",
            scheme_name=scheme.name if scheme else "National Fellowship Scheme",
            policy_name=p.policy_name,
            policy_type=p.policy_type,
            version=p.version,
            status=p.status,
            effective_from=p.effective_from,
            effective_to=p.effective_to,
            publication_date=p.publication_date,
            source_title=p.source_title,
            source_url=p.source_url,
            source_document_id=p.source_document_id,
            source_page=p.source_page,
            extracted_at=p.extracted_at,
            approved_at=p.approved_at,
            approved_by=p.approved_by,
            supersedes_policy_version=p.supersedes_policy_version,
            notes=p.notes,
            rules_count=rules_cnt,
            clauses_count=clauses_cnt,
            created_at=p.created_at,
            updated_at=p.updated_at
        ))
    return results

@router.get("/policies/{policy_id}", response_model=PolicyDetailResponse)
def get_policy_detail(policy_id: str, db: Session = Depends(get_db)):
    """Get full policy breakdown including clauses and rules with source provenance."""
    p = db.query(Policy).filter(Policy.id == policy_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Policy not found")

    scheme = db.query(Scheme).filter(Scheme.id == p.scheme_id).first()
    clauses = db.query(PolicyClause).filter(PolicyClause.policy_id == p.id).all()
    rules = db.query(PolicyRule).filter(PolicyRule.policy_id == p.id).order_by(PolicyRule.priority.asc()).all()

    clauses_data = []
    for c in clauses:
        c_rules = [r for r in rules if r.clause_id == c.id]
        clauses_data.append({
            "id": c.id,
            "policy_id": c.policy_id,
            "section": c.section,
            "heading": c.heading,
            "original_text": c.original_text,
            "normalized_text": c.normalized_text,
            "source_page": c.source_page,
            "source_reference": c.source_reference,
            "effective_date": c.effective_date,
            "rules": [
                {
                    "id": r.id,
                    "clause_id": r.clause_id,
                    "policy_id": r.policy_id,
                    "rule_type": r.rule_type,
                    "field": r.field,
                    "operator": r.operator,
                    "value": r.value,
                    "unit": r.unit,
                    "condition": r.condition,
                    "action": r.action,
                    "priority": r.priority,
                    "effective_from": r.effective_from,
                    "effective_to": r.effective_to,
                    "source_reference": r.source_reference,
                    "status": r.status,
                    "created_at": r.created_at
                } for r in c_rules
            ],
            "created_at": c.created_at
        })

    return PolicyDetailResponse(
        id=p.id,
        scheme_id=p.scheme_id,
        scheme_code=scheme.code if scheme else "NFST",
        scheme_name=scheme.name if scheme else "National Fellowship Scheme",
        policy_name=p.policy_name,
        policy_type=p.policy_type,
        version=p.version,
        status=p.status,
        effective_from=p.effective_from,
        effective_to=p.effective_to,
        publication_date=p.publication_date,
        source_title=p.source_title,
        source_url=p.source_url,
        source_document_id=p.source_document_id,
        source_page=p.source_page,
        extracted_at=p.extracted_at,
        approved_at=p.approved_at,
        approved_by=p.approved_by,
        supersedes_policy_version=p.supersedes_policy_version,
        notes=p.notes,
        rules_count=len(rules),
        clauses_count=len(clauses),
        clauses=clauses_data,
        rules=[
            {
                "id": r.id,
                "clause_id": r.clause_id,
                "policy_id": r.policy_id,
                "rule_type": r.rule_type,
                "field": r.field,
                "operator": r.operator,
                "value": r.value,
                "unit": r.unit,
                "condition": r.condition,
                "action": r.action,
                "priority": r.priority,
                "effective_from": r.effective_from,
                "effective_to": r.effective_to,
                "source_reference": r.source_reference,
                "status": r.status,
                "created_at": r.created_at
            } for r in rules
        ],
        created_at=p.created_at,
        updated_at=p.updated_at
    )

@router.post("/policies", response_model=PolicyResponse)
def create_policy(req: PolicyCreateRequest, db: Session = Depends(get_db)):
    """Create a new policy or version without silently overwriting previous versions."""
    pol = PolicyService.create_policy_version(db, req)
    scheme = db.query(Scheme).filter(Scheme.id == pol.scheme_id).first()
    return PolicyResponse(
        id=pol.id,
        scheme_id=pol.scheme_id,
        scheme_code=scheme.code if scheme else "NFST",
        scheme_name=scheme.name if scheme else "Scheme",
        policy_name=pol.policy_name,
        policy_type=pol.policy_type,
        version=pol.version,
        status=pol.status,
        effective_from=pol.effective_from,
        effective_to=pol.effective_to,
        publication_date=pol.publication_date,
        source_title=pol.source_title,
        source_url=pol.source_url,
        source_document_id=pol.source_document_id,
        source_page=pol.source_page,
        extracted_at=pol.extracted_at,
        approved_at=pol.approved_at,
        approved_by=pol.approved_by,
        supersedes_policy_version=pol.supersedes_policy_version,
        notes=pol.notes,
        rules_count=len(pol.rules),
        clauses_count=len(pol.clauses),
        created_at=pol.created_at,
        updated_at=pol.updated_at
    )

@router.post("/policies/{policy_id}/status")
def update_policy_status(
    policy_id: str, 
    req: PolicyStatusUpdateRequest, 
    db: Session = Depends(get_db)
):
    """Update policy status (APPROVE, SET_ACTIVE, SUPERSEDE, ARCHIVE)."""
    p = db.query(Policy).filter(Policy.id == policy_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Policy not found")

    new_status = req.status.upper()
    p.status = new_status
    if new_status in ["APPROVED", "ACTIVE"]:
        p.approved_by = req.actor_name
        p.approved_at = datetime.datetime.utcnow()
    
    if req.notes:
        p.notes = (p.notes or "") + f" [{new_status}: {req.notes}]"

    db.commit()
    return {"status": "SUCCESS", "message": f"Policy status updated to {new_status}"}

@router.get("/applicable")
def get_applicable_policy_for_date(
    scheme_id: str,
    target_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Effective-Date Engine endpoint to resolve applicable policy for a historical date."""
    parsed_date = None
    if target_date:
        try:
            parsed_date = datetime.datetime.fromisoformat(target_date.replace("Z", "+00:00"))
        except Exception:
            parsed_date = datetime.datetime.utcnow()

    pol = PolicyService.get_applicable_policy(db, scheme_id, parsed_date)
    if not pol:
        raise HTTPException(status_code=404, detail="No policy found for scheme and date")

    return {
        "scheme_id": scheme_id,
        "policy_id": pol.id,
        "policy_name": pol.policy_name,
        "version": pol.version,
        "status": pol.status,
        "effective_from": pol.effective_from.isoformat(),
        "effective_to": pol.effective_to.isoformat() if pol.effective_to else None,
        "source_title": pol.source_title,
        "source_reference": f"{pol.source_title} ({pol.version})"
    }

# =========================================================================
# 2. POLICY CLAIMS PIPELINE
# =========================================================================

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

# =========================================================================
# 3. POLICY CONFLICT RESOLUTION
# =========================================================================

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
            source_a_name=src_a.name if src_a else "Official Scheme Guidelines",
            claim_a_id=c.claim_a_id,
            claim_a_value=claim_a.value if claim_a else None,
            claim_a_text=claim_a.extracted_text if claim_a else None,
            source_b_id=c.source_b_id,
            source_b_name=src_b.name if src_b else "Recent Ministry Circular",
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

# =========================================================================
# 4. POLICY CHANGE IMPACT SIMULATOR (SANDBOX)
# =========================================================================

@router.post("/simulate", response_model=PolicySimulationResponse)
def simulate_policy_change(
    req: PolicySimulationRequest,
    db: Session = Depends(get_db)
):
    """
    Run an isolated sandbox simulation of proposed policy rule changes
    against historical/current applications without altering production data.
    """
    sim = PolicyService.run_policy_impact_simulation(db, req)
    return PolicySimulationResponse(
        id=sim.id,
        scheme_id=sim.scheme_id,
        scheme_code=sim.scheme_code,
        base_policy_version=sim.base_policy_version,
        proposed_policy_version=sim.proposed_policy_version,
        proposed_change_description=sim.proposed_change_description,
        rule_changes=sim.rule_changes,
        total_analyzed=sim.total_analyzed,
        potentially_affected=sim.potentially_affected,
        eligibility_outcome_changes=sim.eligibility_outcome_changes,
        verification_outcome_changes=sim.verification_outcome_changes,
        manual_review_required=sim.manual_review_required,
        simulation_results=sim.simulation_results,
        simulated_by=sim.simulated_by,
        is_sandbox=True,
        created_at=sim.created_at
    )

@router.get("/simulations", response_model=List[PolicySimulationResponse])
def list_policy_simulations(db: Session = Depends(get_db)):
    """List past policy change simulations."""
    sims = db.query(PolicySimulation).order_by(PolicySimulation.created_at.desc()).all()
    return [
        PolicySimulationResponse(
            id=s.id,
            scheme_id=s.scheme_id,
            scheme_code=s.scheme_code,
            base_policy_version=s.base_policy_version,
            proposed_policy_version=s.proposed_policy_version,
            proposed_change_description=s.proposed_change_description,
            rule_changes=s.rule_changes,
            total_analyzed=s.total_analyzed,
            potentially_affected=s.potentially_affected,
            eligibility_outcome_changes=s.eligibility_outcome_changes,
            verification_outcome_changes=s.verification_outcome_changes,
            manual_review_required=s.manual_review_required,
            simulation_results=s.simulation_results,
            simulated_by=s.simulated_by,
            is_sandbox=True,
            created_at=s.created_at
        ) for s in sims
    ]

# =========================================================================
# 5. POLICY SNAPSHOTS & DECISION TIME TRAVEL
# =========================================================================

@router.get("/snapshots/{application_id}", response_model=List[PolicySnapshotResponse])
def get_application_snapshots(application_id: str, db: Session = Depends(get_db)):
    """
    Policy Time Travel:
    Retrieve all historical decision snapshots for an application to
    reconstruct the decision as evaluated at that specific point in time.
    """
    snapshots = db.query(PolicySnapshot).filter(
        PolicySnapshot.application_id == application_id
    ).order_by(PolicySnapshot.snapshot_timestamp.desc()).all()

    return [
        PolicySnapshotResponse(
            id=s.id,
            application_id=s.application_id,
            scheme_id=s.scheme_id,
            policy_id=s.policy_id,
            policy_version=s.policy_version,
            stage=s.stage,
            applicable_rules=s.applicable_rules or [],
            input_values=s.input_values or {},
            evidence_references=s.evidence_references or [],
            calculated_results=s.calculated_results or [],
            system_decision=s.system_decision,
            human_decision=s.human_decision,
            human_override_reason=s.human_override_reason,
            human_actor=s.human_actor,
            snapshot_timestamp=s.snapshot_timestamp,
            created_at=s.created_at
        ) for s in snapshots
    ]

@router.post("/snapshots", response_model=PolicySnapshotResponse)
def create_application_snapshot(
    req: PolicySnapshotCreateRequest,
    db: Session = Depends(get_db)
):
    """Save an immutable decision snapshot."""
    snp = PolicyService.create_decision_snapshot(db, req)
    return PolicySnapshotResponse(
        id=snp.id,
        application_id=snp.application_id,
        scheme_id=snp.scheme_id,
        policy_id=snp.policy_id,
        policy_version=snp.policy_version,
        stage=snp.stage,
        applicable_rules=snp.applicable_rules or [],
        input_values=snp.input_values or {},
        evidence_references=snp.evidence_references or [],
        calculated_results=snp.calculated_results or [],
        system_decision=snp.system_decision,
        human_decision=snp.human_decision,
        human_override_reason=snp.human_override_reason,
        human_actor=snp.human_actor,
        snapshot_timestamp=snp.snapshot_timestamp,
        created_at=snp.created_at
    )

# =========================================================================
# 6. EXCEPTION ENGINE
# =========================================================================

@router.get("/exceptions", response_model=List[PolicyExceptionResponse])
def get_exceptions(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List open and resolved exceptions."""
    query = db.query(PolicyException)
    if status:
        query = query.filter(PolicyException.status == status)
    if category:
        query = query.filter(PolicyException.category == category)

    exceptions = query.order_by(PolicyException.created_at.desc()).all()
    results = []
    for exc in exceptions:
        app = db.query(Application).filter(Application.id == exc.application_id).first()
        student = db.query(Student).filter(Student.id == app.applicant_id).first() if app else None
        scheme = db.query(Scheme).filter(Scheme.id == app.scheme_id).first() if app else None

        results.append(PolicyExceptionResponse(
            id=exc.id,
            application_id=exc.application_id,
            application_no=app.application_no if app else "TSF-2026-0012",
            applicant_name=student.full_name if student else "Applicant",
            scheme_id=exc.scheme_id or (app.scheme_id if app else None),
            scheme_code=scheme.code if scheme else "NFST",
            category=exc.category,
            description=exc.description,
            evidence=exc.evidence or {},
            policy_version=exc.policy_version,
            assigned_to=exc.assigned_to,
            status=exc.status,
            resolution=exc.resolution,
            resolution_reason=exc.resolution_reason,
            resolved_by=exc.resolved_by,
            resolved_at=exc.resolved_at,
            created_at=exc.created_at
        ))
    return results

@router.post("/exceptions/{exception_id}/resolve")
def resolve_exception(
    exception_id: str,
    req: PolicyExceptionResolveRequest,
    db: Session = Depends(get_db)
):
    """Resolve an exception case with full audit trail."""
    exc = db.query(PolicyException).filter(PolicyException.id == exception_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Exception not found")

    exc.status = "RESOLVED"
    exc.resolution = req.resolution
    exc.resolution_reason = req.resolution_reason
    exc.resolved_by = req.resolved_by
    exc.resolved_at = datetime.datetime.utcnow()

    db.commit()
    return {"status": "SUCCESS", "message": "Exception resolved successfully"}

# =========================================================================
# 7. HUMAN OVERRIDE GOVERNANCE
# =========================================================================

@router.post("/override", response_model=HumanOverrideResponse)
def record_override(
    req: HumanOverrideRequest,
    db: Session = Depends(get_db)
):
    """
    Enforces strict logging and snapshot preservation when an officer
    overrides an automated system evaluation.
    """
    audit = PolicyService.record_human_override(db, req)
    return HumanOverrideResponse(
        status="SUCCESS",
        message="Human override successfully recorded in immutable audit log and decision snapshot",
        override_id=audit.id,
        audit_logged=True,
        timestamp=audit.timestamp
    )
