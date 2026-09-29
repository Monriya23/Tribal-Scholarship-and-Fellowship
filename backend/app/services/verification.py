import re
import datetime
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import ApplicationDocument, DocumentExtraction, DocumentVerification, Deficiency

class CertificateVerificationProvider(ABC):
    """
    Abstract adapter for querying official state/central certificate registries (e-District / DigiLocker).
    """
    @abstractmethod
    def verify_certificate(
        self,
        cert_number: str,
        cert_type: str,
        state: str,
        applicant_name: str
    ) -> Dict[str, Any]:
        pass

class SyntheticStateEDistrictProvider(CertificateVerificationProvider):
    """
    Demo Certificate Verification Provider.
    IMPORTANT: Explicitly flagged as Synthetic Verification Environment — Demo Only.
    """
    PROVIDER_NAME = "Synthetic State e-District Verification Gateway"
    IS_DEMO = True

    def verify_certificate(
        self,
        cert_number: str,
        cert_type: str,
        state: str,
        applicant_name: str
    ) -> Dict[str, Any]:
        clean_num = cert_number.strip().upper()
        
        # Synthetic validation logic for demo
        is_valid_format = bool(re.match(r'^(?:[A-Z]{2}[0-9A-Z\/-]+|[0-9]{6,16})$', clean_num))
        
        if not is_valid_format:
            return {
                "status": "NOT_FOUND",
                "is_verified": False,
                "provider_name": self.PROVIDER_NAME,
                "environment_note": "Synthetic Verification Environment — Demo Only",
                "issuer_authority": f"e-District Portal ({state})",
                "extracted_cert_no": clean_num,
                "message": "Certificate record not found in synthetic state registry."
            }

        return {
            "status": "VERIFIED",
            "is_verified": True,
            "provider_name": self.PROVIDER_NAME,
            "environment_note": "Synthetic Verification Environment — Demo Only",
            "issuer_authority": f"Office of Sub-Divisional Officer (SDO) / Tehsildar, {state}",
            "extracted_cert_no": clean_num,
            "verified_beneficiary_name": applicant_name,
            "issued_date": "2024-03-15",
            "validity": "PERMANENT" if cert_type == "CASTE_CERTIFICATE" else "VALID_FOR_FINANCIAL_YEAR_2025_26",
            "digital_signature_verified": True,
            "verification_timestamp": datetime.datetime.utcnow().isoformat()
        }

class DocumentIntelligenceService:
    """
    Document Intelligence, Consistency Verification, and Deficiency Generation.
    """

    @classmethod
    def perform_cross_document_consistency_check(
        cls,
        documents: List[ApplicationDocument],
        declared_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Cross-compare extracted fields across multiple documents.
        Identifies typos or discrepancies as INFORMATION_MISMATCH (not fraud).
        """
        extracted_names: Dict[str, str] = {}
        extracted_incomes: Dict[str, float] = {}
        discrepancies: List[Dict[str, Any]] = []

        declared_name = declared_profile.get("full_name", "").strip().upper()
        declared_income = declared_profile.get("annual_income")

        for doc in documents:
            fields = doc.extracted_fields or {}
            
            # Check for names
            if "beneficiary_name" in fields:
                extracted_names[doc.doc_type] = str(fields["beneficiary_name"]).strip().upper()
            elif "student_name" in fields:
                extracted_names[doc.doc_type] = str(fields["student_name"]).strip().upper()
                
            # Check for income
            if "annual_income" in fields:
                try:
                    extracted_incomes[doc.doc_type] = float(fields["annual_income"])
                except (ValueError, TypeError):
                    pass

        # 1. Compare Names
        for doc_type, name in extracted_names.items():
            if declared_name and name:
                # Basic fuzzy equality (case insensitive, ignoring minor space variation)
                clean_decl = re.sub(r'[^A-Z]', '', declared_name)
                clean_ext = re.sub(r'[^A-Z]', '', name)
                
                if clean_decl != clean_ext:
                    discrepancies.append({
                        "field": "Beneficiary Full Name",
                        "expected_value": declared_name,
                        "observed_value": name,
                        "document_type": doc_type,
                        "severity": "MEDIUM",
                        "status": "INFORMATION_MISMATCH",
                        "explanation": f"Name on {doc_type} ('{name}') has minor mismatch with declared profile name ('{declared_name}')."
                    })

        # 2. Compare Income
        if declared_income is not None and "INCOME_CERTIFICATE" in extracted_incomes:
            ext_inc = extracted_incomes["INCOME_CERTIFICATE"]
            decl_inc = float(declared_income)
            
            if abs(decl_inc - ext_inc) > 5000:
                discrepancies.append({
                    "field": "Annual Family Income",
                    "expected_value": f"₹{decl_inc:,.0f}",
                    "observed_value": f"₹{ext_inc:,.0f}",
                    "document_type": "INCOME_CERTIFICATE",
                    "severity": "HIGH",
                    "status": "INFORMATION_MISMATCH",
                    "explanation": f"Income certificate indicates ₹{ext_inc:,.0f} while application declared ₹{decl_inc:,.0f}."
                })

        return {
            "consistency_status": "CONSISTENT" if not discrepancies else "INFORMATION_MISMATCH",
            "discrepancies": discrepancies,
            "checked_document_count": len(documents)
        }

    @classmethod
    def verify_certificate_with_provider(
        cls,
        db: Session,
        document: ApplicationDocument,
        cert_number: str,
        applicant_name: str,
        state: str
    ) -> DocumentVerification:
        """
        Verify certificate against provider adapter and save audit record.
        """
        provider = SyntheticStateEDistrictProvider()
        res = provider.verify_certificate(
            cert_number=cert_number,
            cert_type=document.doc_type,
            state=state,
            applicant_name=applicant_name
        )

        verification = DocumentVerification(
            document_id=document.id,
            verification_provider=provider.PROVIDER_NAME,
            verification_type="SYNTHETIC_DEMO" if provider.IS_DEMO else "GOVERNMENT_API",
            is_demo_environment=provider.IS_DEMO,
            provider_response=res,
            is_verified=res.get("is_verified", False),
            mismatch_details={},
            verified_by="Automated Adapter System",
            verified_at=datetime.datetime.utcnow()
        )
        db.add(verification)
        
        # Update document status
        if res.get("is_verified"):
            document.validation_status = "VERIFIED"
        else:
            document.validation_status = "REVIEW_REQUIRED"
            
        db.commit()
        db.refresh(verification)
        return verification
