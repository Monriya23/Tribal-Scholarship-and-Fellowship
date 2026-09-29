from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.rag import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import RAGService

router = APIRouter(prefix="/rag", tags=["Official RAG Intelligence"])

@router.post("/query", response_model=RAGQueryResponse)
def query_rag_assistant(query_req: RAGQueryRequest, db: Session = Depends(get_db)):
    """
    Query the Official MoTA RAG Assistant.
    Strictly answers from indexed official circulars with exact citations.
    Returns anti-hallucination message if not found in indexed sources.
    """
    return RAGService.answer_query(
        db=db,
        query=query_req.query,
        scheme_code=query_req.scheme_code,
        max_citations=query_req.max_citations
    )
