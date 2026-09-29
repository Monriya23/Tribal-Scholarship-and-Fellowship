import uuid
import datetime
from sqlalchemy.orm import Session
from app.database.models import PolicyClaim, PolicyConflict, SourceDocument

class ConflictDetectorService:
    @staticmethod
    def scan_for_conflicts(db: Session, scheme_id: str) -> list[PolicyConflict]:
        claims = db.query(PolicyClaim).filter(PolicyClaim.scheme_id == scheme_id).all()
        
        # Group by field
        by_field: dict[str, list[PolicyClaim]] = {}
        for c in claims:
            if c.review_status not in ["REJECTED", "SUPERSEDED"]:
                by_field.setdefault(c.field, []).append(c)
        
        detected_conflicts = []
        for field, field_claims in by_field.items():
            if len(field_claims) > 1:
                # Check for value discrepancies
                values = {c.value for c in field_claims}
                if len(values) > 1:
                    # Conflict found!
                    claim_a = field_claims[0]
                    claim_b = field_claims[1]
                    
                    doc_a = db.query(SourceDocument).filter(SourceDocument.id == claim_a.source_document_id).first()
                    doc_b = db.query(SourceDocument).filter(SourceDocument.id == claim_b.source_document_id).first()
                    
                    conflict_id = f"conf_{uuid.uuid4().hex[:8]}"
                    existing = db.query(PolicyConflict).filter(
                        PolicyConflict.scheme_id == scheme_id,
                        PolicyConflict.field == field,
                        PolicyConflict.status == "OPEN"
                    ).first()
                    
                    if not existing:
                        conflict = PolicyConflict(
                            id=conflict_id,
                            scheme_id=scheme_id,
                            field=field,
                            source_a_id=doc_a.source_id if doc_a else "src_mota",
                            claim_a_id=claim_a.id,
                            source_b_id=doc_b.source_id if doc_b else "src_nsp",
                            claim_b_id=claim_b.id,
                            description=f"Discrepancy in '{field}': Document '{doc_a.title if doc_a else 'A'}' specifies {claim_a.value} {claim_a.unit or ''} whereas '{doc_b.title if doc_b else 'B'}' states {claim_b.value} {claim_b.unit or ''}.",
                            status="OPEN",
                            created_at=datetime.datetime.utcnow()
                        )
                        db.add(conflict)
                        detected_conflicts.append(conflict)
        
        db.commit()
        return detected_conflicts
