from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RAGQueryRequest(BaseModel):
    query: str
    scheme_code: Optional[str] = None
    max_citations: int = 4

class RAGCitation(BaseModel):
    source_name: str
    source_url: str
    document_title: str
    document_url: str
    document_type: str
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    extracted_quote: str
    policy_version: Optional[str] = "2025-26"
    last_fetched: Optional[datetime] = None

class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    found_in_official_sources: bool
    confidence_score: float
    citations: List[RAGCitation] = []
    generated_at: datetime
