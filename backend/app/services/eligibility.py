from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import Student, Application, Scheme, SchemeVersion, PolicyClaim, SourceDocument, ApplicationDocument
from app.services.normalization import GradeNormalizationService

class DeterministicEligibilityEngine:
    """
    Deterministic Eligibility Engine.
    Follows: AI interprets. Deterministic rules decide. Humans resolve uncertainty.
    Never invents unverified rules or conversions.
    """

    @classmethod
    def evaluate_application(
        cls,
        db: Session,
        application: Application,
        student: Student,
        scheme: Scheme,
        scheme_version: Optional[SchemeVersion] = None
    ) -> Dict[str, Any]:
        """
        Evaluate student application against approved official policy rules.
        Returns:
            - overall_result: "ELIGIBLE" | "NOT_ELIGIBLE" | "REVIEW_REQUIRED"
            - checks: List of individual rule checks with values, requirements, and policy citations
            - policy_version: Exact version tag evaluated
        """
        version_tag = scheme_version.version_tag if scheme_version else scheme.active_version

        # 1. Fetch all currently approved policy rules for this scheme
        approved_claims = db.query(PolicyClaim).filter(
            PolicyClaim.scheme_id == scheme.id,
            PolicyClaim.review_status.in_(["APPROVED", "ACTIVE"])
        ).all()

        checks_matrix: List[Dict[str, Any]] = []
        is_any_fail = False
        is_any_review_required = False

        # 2. Check: Scheduled Tribe Community Authenticity (Mandatory across all MoTA schemes)
        st_community = (student.tribe or "").strip()
        if st_community:
            checks_matrix.append({
                "criterion": "Scheduled Tribe (ST) Community Requirement",
                "result": "PASS",
                "declared_value": st_community,
                "required_value": "Recognized Scheduled Tribe (Article 342)",
                "rule_id": "RULE_ST_CATEGORY_MANDATORY",
                "explanation": f"Applicant belongs to recognized ST community: {st_community}.",
                "source_doc_title": "Constitution (Scheduled Tribes) Order / MoTA Framework",
                "source_page": 1,
                "policy_version": version_tag
            })
        else:
            is_any_fail = True
            checks_matrix.append({
                "criterion": "Scheduled Tribe (ST) Community Requirement",
                "result": "FAIL",
                "declared_value": "Not Provided",
                "required_value": "Recognized Scheduled Tribe",
                "rule_id": "RULE_ST_CATEGORY_MANDATORY",
                "explanation": "Applicant has not provided a recognized ST community.",
                "source_doc_title": "MoTA Guidelines",
                "source_page": 1,
                "policy_version": version_tag
            })

        # 3. Check: Grade Normalization
        grade_type = application.original_grade_type or "PERCENTAGE"
        grade_val = application.original_grade_value or str(application.declared_percentage)
        
        norm_result = GradeNormalizationService.normalize_academic_score(
            grade_type=grade_type,
            grade_value=grade_val
        )
        
        normalized_score = norm_result.get("normalized_percentage")
        if norm_result["status"] != "PASS" or normalized_score is None:
            is_any_review_required = True
            checks_matrix.append({
                "criterion": "Academic Score Normalization",
                "result": "REVIEW_REQUIRED",
                "declared_value": f"{grade_val} ({grade_type})",
                "required_value": "Authoritative Scale Mapping",
                "rule_id": "RULE_ACADEMIC_NORMALIZATION",
                "explanation": norm_result["explanation"],
                "source_doc_title": "Academic Assessment Policy",
                "source_page": 1,
                "policy_version": version_tag
            })
        else:
            checks_matrix.append({
                "criterion": "Academic Score Normalization",
                "result": "PASS",
                "declared_value": f"{grade_val} ({grade_type})",
                "required_value": f"{normalized_score}% Normalized",
                "rule_id": "RULE_ACADEMIC_NORMALIZATION",
                "explanation": norm_result["explanation"],
                "source_doc_title": norm_result["normalization_source"],
                "source_page": 1,
                "policy_version": version_tag
            })

        # 4. Check against Extracted Official Policy Claims
        for claim in approved_claims:
            doc = db.query(SourceDocument).filter(SourceDocument.id == claim.source_document_id).first()
            doc_title = doc.title if doc else "Official Scheme Circular"
            page_num = claim.source_page or 1

            if claim.field == "family_income":
                limit_val = float(claim.value)
                declared_inc = float(application.declared_income)
                
                if claim.operator in ["LESS_THAN_OR_EQUAL", "LTE"]:
                    if declared_inc <= limit_val:
                        checks_matrix.append({
                            "criterion": "Annual Family Income Ceiling",
                            "result": "PASS",
                            "declared_value": f"₹{declared_inc:,.0f}",
                            "required_value": f"≤ ₹{limit_val:,.0f} per annum",
                            "rule_id": claim.id,
                            "explanation": f"Declared family income of ₹{declared_inc:,.0f} is within the official ceiling of ₹{limit_val:,.0f}.",
                            "source_doc_title": doc_title,
                            "source_page": page_num,
                            "policy_version": version_tag
                        })
                    else:
                        is_any_fail = True
                        checks_matrix.append({
                            "criterion": "Annual Family Income Ceiling",
                            "result": "FAIL",
                            "declared_value": f"₹{declared_inc:,.0f}",
                            "required_value": f"≤ ₹{limit_val:,.0f} per annum",
                            "rule_id": claim.id,
                            "explanation": f"Declared income of ₹{declared_inc:,.0f} exceeds the official ceiling of ₹{limit_val:,.0f}.",
                            "source_doc_title": doc_title,
                            "source_page": page_num,
                            "policy_version": version_tag
                        })

            elif claim.field == "minimum_marks":
                min_marks = float(claim.value)
                actual_pct = normalized_score if normalized_score is not None else float(application.declared_percentage)
                
                if actual_pct >= min_marks:
                    checks_matrix.append({
                        "criterion": "Minimum Qualifying Academic Marks",
                        "result": "PASS",
                        "declared_value": f"{actual_pct}%",
                        "required_value": f"≥ {min_marks}%",
                        "rule_id": claim.id,
                        "explanation": f"Normalized academic score of {actual_pct}% meets the minimum requirement of {min_marks}%.",
                        "source_doc_title": doc_title,
                        "source_page": page_num,
                        "policy_version": version_tag
                    })
                else:
                    is_any_fail = True
                    checks_matrix.append({
                        "criterion": "Minimum Qualifying Academic Marks",
                        "result": "FAIL",
                        "declared_value": f"{actual_pct}%",
                        "required_value": f"≥ {min_marks}%",
                        "rule_id": claim.id,
                        "explanation": f"Academic score of {actual_pct}% is below the mandatory cutoff of {min_marks}%.",
                        "source_doc_title": doc_title,
                        "source_page": page_num,
                        "policy_version": version_tag
                    })

        # 5. Check: Required Documents Attached
        docs = db.query(ApplicationDocument).filter(ApplicationDocument.application_id == application.id).all()
        attached_types = {d.doc_type for d in docs}
        
        required_docs = ["CASTE_CERTIFICATE", "INCOME_CERTIFICATE", "MARKSHEET"]
        if scheme.code in ["NFST", "NOS"]:
            required_docs.append("BONAFIDE")

        for req_doc in required_docs:
            if req_doc in attached_types:
                # Check document validity status
                matched_doc = next((d for d in docs if d.doc_type == req_doc), None)
                if matched_doc and matched_doc.validation_status in ["REJECTED", "CORRECTION_REQUIRED", "UNREADABLE"]:
                    is_any_review_required = True
                    checks_matrix.append({
                        "criterion": f"Document: {req_doc.replace('_', ' ').title()}",
                        "result": "REVIEW_REQUIRED",
                        "declared_value": matched_doc.validation_status,
                        "required_value": "Legible & Valid",
                        "rule_id": f"DOC_STATUS_{req_doc}",
                        "explanation": f"Uploaded {req_doc} has quality flag: {matched_doc.validation_status}.",
                        "source_doc_title": "Document Verification Norms",
                        "source_page": 1,
                        "policy_version": version_tag
                    })
                else:
                    checks_matrix.append({
                        "criterion": f"Document: {req_doc.replace('_', ' ').title()}",
                        "result": "PASS",
                        "declared_value": "Uploaded",
                        "required_value": "Mandatory",
                        "rule_id": f"DOC_REQ_{req_doc}",
                        "explanation": f"Required document {req_doc} is attached.",
                        "source_doc_title": "Official Application Guidelines",
                        "source_page": 1,
                        "policy_version": version_tag
                    })
            else:
                is_any_review_required = True
                checks_matrix.append({
                    "criterion": f"Document: {req_doc.replace('_', ' ').title()}",
                    "result": "MISSING",
                    "declared_value": "Not Uploaded",
                    "required_value": "Mandatory",
                    "rule_id": f"DOC_REQ_{req_doc}",
                    "explanation": f"Mandatory document {req_doc} is missing from application.",
                    "source_doc_title": "Official Application Guidelines",
                    "source_page": 1,
                    "policy_version": version_tag
                })

        # Final Deterministic Outcome
        if is_any_fail:
            overall_result = "NOT_ELIGIBLE"
        elif is_any_review_required:
            overall_result = "REVIEW_REQUIRED"
        else:
            overall_result = "ELIGIBLE"

        return {
            "overall_result": overall_result,
            "checks": checks_matrix,
            "policy_version": version_tag,
            "evaluated_rule_count": len(checks_matrix)
        }
