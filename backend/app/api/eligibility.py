from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.database.connection import get_db
from app.database.models import Student, Scheme, Application
from app.services.eligibility import DeterministicEligibilityEngine

router = APIRouter(prefix="/eligibility", tags=["Deterministic Eligibility Engine"])

class EligibilityCheckRequest(BaseModel):
    applicant_mota_id: Optional[str] = None
    scheme_code: str
    tribe: str
    declared_income: float
    grade_type: str = "PERCENTAGE"  # PERCENTAGE, CGPA_10, CGPA_4
    grade_value: str
    course_name: str
    institute_aishe: str

@router.post("/evaluate")
def evaluate_eligibility_dry_run(
    req: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Simulate/evaluate deterministic eligibility for student inputs against approved official rules.
    Does NOT modify database state.
    """
    scheme = db.query(Scheme).filter(Scheme.code == req.scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{req.scheme_code}' not found")

    # Create ephemeral objects for evaluation
    temp_student = Student(
        id="ephemeral_stu",
        mota_lifetime_id=req.applicant_mota_id or "ST-TEMP-0000",
        full_name="Applicant",
        aadhaar_vault_ref="XXXX",
        date_of_birth="2002-01-01",
        gender="UNSPECIFIED",
        tribe=req.tribe,
        state="Jharkhand",
        district="Ranchi",
        bank_account_masked="XXXX",
        ifsc="SBIN0000",
        annual_family_income=req.declared_income
    )

    temp_app = Application(
        id="ephemeral_app",
        application_no="TSF-TEMP",
        applicant_id=temp_student.id,
        scheme_id=scheme.id,
        declared_income=req.declared_income,
        declared_percentage=float(req.grade_value.replace('%', '')) if req.grade_value.replace('.', '', 1).isdigit() else 0.0,
        original_grade_type=req.grade_type,
        original_grade_value=req.grade_value,
        course_name=req.course_name,
        institute_aishe=req.institute_aishe
    )

    result = DeterministicEligibilityEngine.evaluate_application(
        db=db,
        application=temp_app,
        student=temp_student,
        scheme=scheme
    )

    return {
        "scheme_code": scheme.code,
        "scheme_name": scheme.name,
        "policy_version": result["policy_version"],
        "overall_result": result["overall_result"],
        "checks": result["checks"],
        "evaluated_rule_count": result["evaluated_rule_count"]
    }
