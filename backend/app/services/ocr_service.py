import io
import re
import hashlib
from typing import Dict, Any, List
from pathlib import Path
import pypdf

class OCRService:
    @staticmethod
    def process_uploaded_document(
        file_bytes: bytes,
        file_name: str,
        doc_type: str,
        declared_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        if not file_bytes:
            return {
                "status": "FAILED",
                "readability_score": 0.0,
                "error": "Document could not be read. The uploaded file is empty."
            }

        is_pdf = file_name.lower().endswith(".pdf")
        extracted_text = ""
        readability_score = 0.0

        if is_pdf:
            try:
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                text_parts = []
                for p in reader.pages:
                    t = p.extract_text() or ""
                    if t.strip():
                        text_parts.append(t)
                extracted_text = "\n".join(text_parts).strip()
                
                if not extracted_text:
                    return {
                        "status": "FAILED",
                        "readability_score": 10.0,
                        "error": "Document could not be read. The PDF appears to be a scanned image with no readable text layer. Please upload a clearer copy or OCR-rendered PDF."
                    }
                
                # Readability score based on word structure
                words = re.findall(r'\b[a-zA-Z0-9]{2,}\b', extracted_text)
                readability_score = min(98.0, max(45.0, len(words) * 0.8))
            except Exception as e:
                return {
                    "status": "FAILED",
                    "readability_score": 0.0,
                    "error": f"Failed to parse document: {str(e)}. Please upload a valid PDF."
                }
        else:
            # Image file simulation/inspection
            readability_score = 85.0
            extracted_text = f"Scanned image document {file_name} processed."

        # Field extraction based on document type
        extracted_fields: Dict[str, Any] = {}
        anomalies: List[str] = []

        if doc_type == "CASTE_CERTIFICATE":
            # Extract ST certificate number
            cert_match = re.search(r'(?:certificate\s+no|cert\s+no|reg\s+no)[\s.:]*([A-Za-z0-9\/-]+)', extracted_text, re.IGNORECASE)
            if cert_match:
                extracted_fields["certificate_number"] = cert_match.group(1).strip()
            
            # Extract tribe community
            for tribe in ["Santhal", "Munda", "Oraon", "Gond", "Bhil", "Khasi", "Garo", "Bodo", "Ho", "Kharia"]:
                if tribe.lower() in extracted_text.lower():
                    extracted_fields["tribe_name"] = tribe
                    break

        elif doc_type == "INCOME_CERTIFICATE":
            # Extract annual income
            income_match = re.search(r'(?:annual\s+income|total\s+income|income\s+of)[\s.:]*₹?\s*([0-9,]+)', extracted_text, re.IGNORECASE)
            if income_match:
                raw_inc = income_match.group(1).replace(",", "")
                try:
                    extracted_fields["annual_income"] = float(raw_inc)
                except ValueError:
                    pass
            
            # Check declared match
            if declared_data and "declared_income" in declared_data and "annual_income" in extracted_fields:
                decl = float(declared_data["declared_income"])
                ext = float(extracted_fields["annual_income"])
                if abs(decl - ext) > 5000:
                    anomalies.append(f"Income Mismatch: Uploaded certificate shows ₹{ext:,.0f} while application declared ₹{decl:,.0f}")

        elif doc_type == "MARKSHEET":
            # Extract percentage
            pct_match = re.search(r'([0-9]{2}(?:\.[0-9]+)?)\s*%', extracted_text)
            if pct_match:
                extracted_fields["percentage"] = float(pct_match.group(1))

        content_hash = hashlib.sha256(file_bytes).hexdigest()

        return {
            "status": "PASSED" if not anomalies else "REVIEW_REQUIRED",
            "file_name": file_name,
            "content_hash": content_hash,
            "readability_score": readability_score,
            "extracted_text": extracted_text[:1500],
            "extracted_fields": extracted_fields,
            "anomalies": anomalies,
            "is_valid": len(anomalies) == 0
        }
