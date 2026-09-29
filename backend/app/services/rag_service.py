import re
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import DocumentChunk, SourceDocument, Source
from app.models.rag import RAGCitation, RAGQueryResponse

class RAGService:
    @staticmethod
    def answer_query(
        db: Session,
        query: str,
        scheme_code: Optional[str] = None,
        max_citations: int = 4
    ) -> RAGQueryResponse:
        cleaned_query = query.strip().lower()
        query_words = set(re.findall(r'\w{3,}', cleaned_query))
        
        if not query_words:
            return RAGQueryResponse(
                query=query,
                answer="Please enter a specific question regarding MoTA scholarship schemes, eligibility criteria, or official circulars.",
                found_in_official_sources=False,
                confidence_score=0.0,
                citations=[],
                generated_at=datetime.datetime.utcnow()
            )

        # Retrieve all indexed chunks
        query_db = db.query(DocumentChunk).join(SourceDocument)
        if scheme_code:
            # Filter if document is associated with scheme
            query_db = query_db.filter(SourceDocument.title.ilike(f"%{scheme_code}%"))
            
        chunks = query_db.all()
        
        if not chunks:
            return RAGQueryResponse(
                query=query,
                answer="I could not find this information in the currently indexed official sources.",
                found_in_official_sources=False,
                confidence_score=0.0,
                citations=[],
                generated_at=datetime.datetime.utcnow()
            )

        # Score chunks by term match and phrase overlap
        scored_chunks: List[tuple[float, DocumentChunk]] = []
        for chunk in chunks:
            content_lower = chunk.content.lower()
            match_count = sum(1 for w in query_words if w in content_lower)
            
            # Bonus for exact key phrase matches
            phrase_bonus = 0.0
            if "income" in cleaned_query and "income" in content_lower:
                phrase_bonus += 2.0
            if "fellowship" in cleaned_query and "fellowship" in content_lower:
                phrase_bonus += 2.0
            if "marks" in cleaned_query and ("marks" in content_lower or "%" in content_lower):
                phrase_bonus += 2.0
            if "age" in cleaned_query and "age" in content_lower:
                phrase_bonus += 2.0
            if "contingency" in cleaned_query and "contingency" in content_lower:
                phrase_bonus += 2.5
            if "stipend" in cleaned_query and "stipend" in content_lower:
                phrase_bonus += 2.5
                
            score = (match_count / max(1, len(query_words))) * 5.0 + phrase_bonus
            if match_count >= 1 or phrase_bonus > 0:
                scored_chunks.append((score, chunk))

        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_chunks = scored_chunks[:max_citations]

        # If score is too low or no matches found, do NOT hallucinate
        if not top_chunks or top_chunks[0][0] < 1.2:
            return RAGQueryResponse(
                query=query,
                answer="I could not find this information in the currently indexed official sources.",
                found_in_official_sources=False,
                confidence_score=0.0,
                citations=[],
                generated_at=datetime.datetime.utcnow()
            )

        # Build citations and synthesised answer from top chunks
        citations: List[RAGCitation] = []
        answer_points: List[str] = []
        
        for score, chunk in top_chunks:
            doc = db.query(SourceDocument).filter(SourceDocument.id == chunk.document_id).first()
            source = db.query(Source).filter(Source.id == doc.source_id).first() if doc else None
            
            citation = RAGCitation(
                source_name=source.name if source else "Ministry of Tribal Affairs",
                source_url=source.base_url if source else "https://tribal.gov.in/",
                document_title=doc.title if doc else "Official Guidelines",
                document_url=doc.url if doc else "",
                document_type=doc.document_type if doc else "GUIDELINE_PDF",
                page_number=chunk.page_number,
                section_title=chunk.section_title,
                extracted_quote=chunk.content[:240] + ("..." if len(chunk.content) > 240 else ""),
                policy_version="2025-26",
                last_fetched=doc.fetched_at if doc else datetime.datetime.utcnow()
            )
            citations.append(citation)
            
            # Include clean quote in the synthesised answer
            clean_excerpt = chunk.content.strip().replace("\n", " ")
            if len(clean_excerpt) > 300:
                clean_excerpt = clean_excerpt[:300] + "..."
            answer_points.append(f"• According to **{doc.title if doc else 'Official Guidelines'}** (Page {chunk.page_number or 1}): \"{clean_excerpt}\"")

        confidence = min(0.98, round(top_chunks[0][0] / 10.0 + 0.5, 2))
        
        synthesised_answer = (
            f"Based on the official indexed circulars and guidelines from the **{citations[0].source_name}**:\n\n" +
            "\n\n".join(answer_points)
        )

        return RAGQueryResponse(
            query=query,
            answer=synthesised_answer,
            found_in_official_sources=True,
            confidence_score=confidence,
            citations=citations,
            generated_at=datetime.datetime.utcnow()
        )
