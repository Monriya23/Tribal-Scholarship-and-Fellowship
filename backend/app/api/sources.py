from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.database.models import Source, SourceDocument
from app.models.source import SourceResponse, SourceCreate, SourceUpdate
from app.services.source_registry import SourceRegistryService

router = APIRouter(prefix="/sources", tags=["Official Sources"])

@router.get("", response_model=List[SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    """List all registered official sources with document counts."""
    sources = SourceRegistryService.get_all_sources(db)
    result = []
    for s in sources:
        doc_count = db.query(SourceDocument).filter(SourceDocument.source_id == s.id).count()
        item = SourceResponse.model_validate(s)
        item.document_count = doc_count
        result.append(item)
    return result

@router.get("/{source_id}", response_model=SourceResponse)
def get_source_details(source_id: str, db: Session = Depends(get_db)):
    """Get single source details and connectivity status."""
    source = SourceRegistryService.get_source_by_id(db, source_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    doc_count = db.query(SourceDocument).filter(SourceDocument.source_id == source.id).count()
    item = SourceResponse.model_validate(source)
    item.document_count = doc_count
    return item

@router.post("", response_model=SourceResponse)
def add_source(source_in: SourceCreate, db: Session = Depends(get_db)):
    """Register a new official public government source."""
    existing = SourceRegistryService.get_source_by_id(db, source_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Source ID already exists")
    
    new_src = Source(
        id=source_in.id,
        name=source_in.name,
        organization=source_in.organization,
        base_url=source_in.base_url,
        source_type=source_in.source_type,
        active=source_in.active,
        robots_status=source_in.robots_status,
        status="CONNECTED"
    )
    db.add(new_src)
    db.commit()
    db.refresh(new_src)
    return SourceResponse.model_validate(new_src)
