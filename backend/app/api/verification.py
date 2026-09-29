from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.database.connection import get_db
from app.database.models import Application, Student, ApplicationDocument, DocumentVerification
from app.services.verification import DocumentIntelligenceService

router = APIRouter(prefix="/verification", tags=["Document Intelligence & Cross-Verification"])

class CertificateVerifyRequest(BaseModel):
    document_id: str
    certificate_number: str
    applicant_name: str
    state: str = "Jharkhand"

@router.get("/applications/{application_id}/cross-check")
def run_cross_document_check(application_id: str, db: Session = Depends(get_db)):
    """
    Run cross-document consistency verification across all uploaded certificates.
    Identifies typos or discrepancies as INFORMATION_MISMATCH (not fraud).
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    student = db.query(Student).filter(Student.id == app.applicant_id).first()
    docs = db.query(ApplicationDocument).filter(ApplicationDocument.application_id == app.id).all()

    profile_data = {
        "full_name": student.full_name if student else "Applicant",
        "annual_income": app.declared_income,
        "percentage": app.declared_percentage,
        "tribe": student.tribe if student else ""
    }

    result = DocumentIntelligenceService.perform_cross_document_consistency_check(
        documents=docs,
        declared_profile=profile_data
    )

    return {
        "application_id": app.id,
        "application_no": app.application_no,
        "consistency_status": result["consistency_status"],
        "discrepancies": result["discrepancies"],
        "checked_documents_count": result["checked_document_count"]
    }

@router.post("/verify-certificate")
def verify_certificate_number(
    req: CertificateVerifyRequest,
    db: Session = Depends(get_db)
):
    """
    Query certificate verification adapter (e-District / DigiLocker).
    Clearly marked as 'Synthetic Verification Environment — Demo Only' for test adapters.
    """
    doc = db.query(ApplicationDocument).filter(ApplicationDocument.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    vfy = DocumentIntelligenceService.verify_certificate_with_provider(
        db=db,
        document=doc,
        cert_number=req.certificate_number,
        applicant_name=req.applicant_name,
        state=req.state
    )

    return {
        "verification_id": vfy.id,
        "document_id": doc.id,
        "provider_name": vfy.verification_provider,
        "verification_type": vfy.verification_type,
        "is_demo_environment": vfy.is_demo_environment,
        "is_verified": vfy.is_verified,
        "provider_response": vfy.provider_response,
        "verified_at": vfy.verified_at.isoformat()
    }
