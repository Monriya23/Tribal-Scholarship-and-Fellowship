from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import SourceDocument, SourceDocumentVersion, DocumentChunk, PolicyClaim
from app.models.document import SourceDocumentResponse, DocumentDetailResponse, DocumentVersionResponse, DocumentChunkResponse

router = APIRouter(prefix="/documents", tags=["Official Documents"])

@router.get("", response_model=List[SourceDocumentResponse])
def get_documents(source_id: Optional[str] = None, db: Session = Depends(get_db)):
    """List all indexed official documents."""
    query = db.query(SourceDocument)
    if source_id:
        query = query.filter(SourceDocument.source_id == source_id)
    docs = query.order_by(SourceDocument.fetched_at.desc()).all()
    
    result = []
    for d in docs:
        claim_count = db.query(PolicyClaim).filter(PolicyClaim.source_document_id == d.id).count()
        item = SourceDocumentResponse.model_validate(d)
        item.policy_claim_count = claim_count
        result.append(item)
    return result

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document_detail(document_id: str, db: Session = Depends(get_db)):
    """Get full document with chunks, versions, and full text."""
    doc = db.query(SourceDocument).filter(SourceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    versions = db.query(SourceDocumentVersion).filter(SourceDocumentVersion.document_id == doc.id).all()
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).order_by(DocumentChunk.chunk_index.asc()).all()
    claim_count = db.query(PolicyClaim).filter(PolicyClaim.source_document_id == doc.id).count()
    
    return DocumentDetailResponse(
        id=doc.id,
        source_id=doc.source_id,
        title=doc.title,
        url=doc.url,
        document_type=doc.document_type,
        mime_type=doc.mime_type,
        content_hash=doc.content_hash,
        published_date=doc.published_date,
        effective_date=doc.effective_date,
        fetched_at=doc.fetched_at,
        status=doc.status,
        version=doc.version,
        chunk_count=doc.chunk_count,
        policy_claim_count=claim_count,
        extracted_text=doc.extracted_text,
        versions=[DocumentVersionResponse.model_validate(v) for v in versions],
        chunks=[DocumentChunkResponse.model_validate(c) for c in chunks]
    )
