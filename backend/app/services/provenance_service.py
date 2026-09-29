from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import PolicyClaim, SourceDocument, Source

class ProvenanceService:
    @staticmethod
    def get_claim_provenance(db: Session, claim_id: str) -> Optional[Dict[str, Any]]:
        claim = db.query(PolicyClaim).filter(PolicyClaim.id == claim_id).first()
        if not claim:
            return None
        
        doc = db.query(SourceDocument).filter(SourceDocument.id == claim.source_document_id).first()
        source = db.query(Source).filter(Source.id == doc.source_id).first() if doc else None
        
        return {
            "claim_id": claim.id,
            "field": claim.field,
            "operator": claim.operator,
            "value": claim.value,
            "unit": claim.unit,
            "extracted_text": claim.extracted_text,
            "source_name": source.name if source else "Ministry of Tribal Affairs",
            "source_url": source.base_url if source else "https://tribal.gov.in/",
            "document_title": doc.title if doc else "Official Scheme Guidelines",
            "document_url": doc.url if doc else "",
            "document_type": doc.document_type if doc else "GUIDELINE_PDF",
            "page_number": claim.source_page or 1,
            "document_version": doc.version if doc else 1,
            "content_hash": doc.content_hash if doc else "",
            "fetched_at": doc.fetched_at.isoformat() if doc and doc.fetched_at else None,
            "review_status": claim.review_status,
            "approved_by": claim.approved_by,
            "approved_at": claim.approved_at.isoformat() if claim.approved_at else None,
            "badge": "OFFICIAL SOURCE" if claim.review_status in ["APPROVED", "ACTIVE"] else "AI EXTRACTED"
        }
