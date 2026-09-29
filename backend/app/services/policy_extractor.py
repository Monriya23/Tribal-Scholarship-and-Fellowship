import re
import uuid
import datetime
from sqlalchemy.orm import Session
from app.database.models import PolicyClaim, Scheme, SourceDocument

class PolicyExtractorService:
    @staticmethod
    def extract_claims_from_text(
        db: Session,
        document_id: str,
        scheme_id: str,
        text: str,
        pages: list = None
    ) -> list[PolicyClaim]:
        extracted_claims = []
        
        # Regex Patterns grounded in official MoTA circular vocabulary
        rules_patterns = [
            {
                "field": "family_income",
                "operator": "LESS_THAN_OR_EQUAL",
                "patterns": [
                    r"(?:total\s+family\s+income|parental\s+income|annual\s+income)\s+(?:shall|should|must)?\s*not\s+exceed\s+₹?\s*([0-9,]+(?:\s*lakh|\s*lakhs)?)",
                    r"income\s+ceiling\s+(?:of|is|shall\s+be)\s+₹?\s*([0-9,]+(?:\s*lakh)?)",
                    r"income\s+criteria\s*:\s*₹?\s*([0-9,]+)"
                ],
                "unit": "INR",
                "claim_type": "ELIGIBILITY"
            },
            {
                "field": "minimum_marks",
                "operator": "GREATER_THAN_OR_EQUAL",
                "patterns": [
                    r"(?:minimum|at\s+least)\s+([0-9]{2})%\s+(?:marks|score)\s+in\s+(?:post\s+graduation|qualifying|master)",
                    r"secured\s+not\s+less\s+than\s+([0-9]{2})%\s+marks",
                    r"minimum\s+qualifying\s+marks\s*:\s*([0-9]{2})%"
                ],
                "unit": "PERCENT",
                "claim_type": "ELIGIBILITY"
            },
            {
                "field": "age_limit",
                "operator": "LESS_THAN_OR_EQUAL",
                "patterns": [
                    r"upper\s+age\s+limit\s+(?:shall\s+be|is)\s+([0-9]{2})\s+years",
                    r"age\s+(?:should|must)\s+not\s+be\s+more\s+than\s+([0-9]{2})\s+years",
                    r"maximum\s+age\s*:\s*([0-9]{2})\s+years"
                ],
                "unit": "YEARS",
                "claim_type": "ELIGIBILITY"
            },
            {
                "field": "stipend_monthly",
                "operator": "EQUALS",
                "patterns": [
                    r"fellowship\s+amount\s+(?:of|is)\s+₹?\s*([0-9,]+)\s*(?:/-)?\s*per\s+month",
                    r"monthly\s+stipend\s*:\s*₹?\s*([0-9,]+)"
                ],
                "unit": "INR/MONTH",
                "claim_type": "BENEFIT"
            },
            {
                "field": "contingency_annual",
                "operator": "EQUALS",
                "patterns": [
                    r"contingency\s+grant\s+(?:of|is)\s+₹?\s*([0-9,]+)\s*(?:/-)?\s*per\s+annum",
                    r"annual\s+contingency\s*:\s*₹?\s*([0-9,]+)"
                ],
                "unit": "INR/YEAR",
                "claim_type": "BENEFIT"
            }
        ]

        # Scan page by page if available
        if pages:
            for page_info in pages:
                page_num = page_info.get("page_number", 1)
                page_text = page_info.get("text", "")
                
                for rule in rules_patterns:
                    for pat in rule["patterns"]:
                        matches = re.finditer(pat, page_text, re.IGNORECASE)
                        for match in matches:
                            raw_val = match.group(1).strip()
                            # Clean numeric value
                            norm_val = raw_val.replace(",", "")
                            if "lakh" in norm_val.lower():
                                val_num = float(re.findall(r"[\d\.]+", norm_val)[0]) * 100000
                                norm_val = str(int(val_num))
                            
                            # Extract surrounding context (150 chars)
                            start_idx = max(0, match.start() - 40)
                            end_idx = min(len(page_text), match.end() + 60)
                            quote = page_text[start_idx:end_idx].strip()
                            
                            claim_id = f"claim_{uuid.uuid4().hex[:8]}"
                            claim = PolicyClaim(
                                id=claim_id,
                                scheme_id=scheme_id,
                                source_document_id=document_id,
                                claim_type=rule["claim_type"],
                                field=rule["field"],
                                operator=rule["operator"],
                                value=norm_val,
                                unit=rule["unit"],
                                extracted_text=quote,
                                source_page=page_num,
                                confidence=0.96,
                                review_status="DETECTED",
                                created_at=datetime.datetime.utcnow()
                            )
                            db.add(claim)
                            extracted_claims.append(claim)
        
        db.commit()
        return extracted_claims
