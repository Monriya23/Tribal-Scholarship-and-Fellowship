from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentChunkResponse(BaseModel):
    id: str
    chunk_index: int
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    content: str

    class Config:
        from_attributes = True

class DocumentVersionResponse(BaseModel):
    id: str
    version_number: int
    content_hash: str
    change_summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SourceDocumentResponse(BaseModel):
    id: str
    source_id: str
    title: str
    url: str
    document_type: str
    mime_type: str
    content_hash: str
    published_date: Optional[str] = None
    effective_date: Optional[str] = None
    fetched_at: datetime
    status: str
    version: int
    chunk_count: int
    policy_claim_count: Optional[int] = 0

    class Config:
        from_attributes = True

class DocumentDetailResponse(SourceDocumentResponse):
    extracted_text: Optional[str] = None
    versions: List[DocumentVersionResponse] = []
    chunks: List[DocumentChunkResponse] = []
