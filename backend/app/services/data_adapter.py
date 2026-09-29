import csv
import io
import uuid
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import Student, Application, Scheme, Institution
from app.services.normalization import GradeNormalizationService

class StateDataAdapterService:
    """
    Data Adapter Layer for ingesting disparate State / External records into the Common Model.
    Supports CSV, Excel, and State Portal JSON payloads.
    """

    @classmethod
    def ingest_state_portal_batch(
        cls,
        db: Session,
        state_name: str,
        records: List[Dict[str, Any]],
        scheme_code: str = "POSTMATRIC"
    ) -> Dict[str, Any]:
        """
        Normalize and insert batch records from a State scholarship portal (e.g. Jharkhand e-Kalyan, Odisha Medhashree).
        """
        scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
        if not scheme:
            raise ValueError(f"Scheme '{scheme_code}' not found")

        imported_count = 0
        skipped_count = 0
        errors: List[str] = []

        for idx, rec in enumerate(records):
            try:
                # Map state fields to Common MoTA Model
                name = rec.get("student_name") or rec.get("full_name") or rec.get("ApplicantName")
                mota_id = rec.get("mota_id") or rec.get("state_reg_no") or f"ST-{state_name[:2].upper()}-{datetime.date.today().year}-{uuid.uuid4().hex[:6]}"
                tribe = rec.get("tribe") or rec.get("caste_name") or rec.get("Community", "Scheduled Tribe")
                income = float(rec.get("annual_income") or rec.get("family_income", 0))
                pct = float(rec.get("percentage") or rec.get("marks_percentage", 60.0))
                aishe = rec.get("aishe_code") or rec.get("college_aishe", "C-99999")
                course = rec.get("course_name") or rec.get("course", "Bachelor of Science")

                if not name:
                    skipped_count += 1
                    errors.append(f"Row {idx+1}: Missing student name")
                    continue

                # Check existing student
                student = db.query(Student).filter(Student.mota_lifetime_id == mota_id).first()
                if not student:
                    student = Student(
                        id=f"stu_{uuid.uuid4().hex[:8]}",
                        mota_lifetime_id=mota_id,
                        full_name=name.strip(),
                        aadhaar_vault_ref="XXXX-XXXX-9999",
                        date_of_birth=rec.get("dob", "2002-01-01"),
                        gender=rec.get("gender", "UNSPECIFIED").upper(),
                        tribe=tribe.strip(),
                        state=state_name,
                        district=rec.get("district", "Central"),
                        mobile=rec.get("mobile"),
                        email=rec.get("email"),
                        bank_account_masked="XXXXXX1234",
                        ifsc=rec.get("ifsc", "SBIN0001000"),
                        is_aadhaar_seeded=True,
                        annual_family_income=income
                    )
                    db.add(student)
                    db.flush()

                # Create application
                app_no = f"TSF-{datetime.datetime.utcnow().year}-{str(db.query(Application).count() + 1).zfill(6)}"
                
                # Grade Normalization
                norm_res = GradeNormalizationService.normalize_academic_score("PERCENTAGE", str(pct))

                app = Application(
                    id=f"app_{uuid.uuid4().hex[:8]}",
                    application_no=app_no,
                    applicant_id=student.id,
                    scheme_id=scheme.id,
                    academic_year="2025-26",
                    current_stage="INSTITUTION_VERIFICATION",
                    status="SUBMITTED",
                    access_mode="STATE_PORTAL_ADAPTER",
                    assisted_by=f"{state_name} State Nodal API",
                    declared_income=income,
                    declared_percentage=pct,
                    original_grade_type="PERCENTAGE",
                    original_grade_value=str(pct),
                    normalized_percentage=norm_res.get("normalized_percentage", pct),
                    normalization_method=norm_res.get("normalization_method", "DIRECT_PERCENTAGE"),
                    normalization_source=f"{state_name} State Portal Import",
                    course_name=course,
                    institute_aishe=aishe,
                    institute_name=rec.get("institute_name", "Affiliated College"),
                    evaluated_policy_version=scheme.active_version,
                    submission_date=datetime.datetime.utcnow()
                )
                db.add(app)
                imported_count += 1
            except Exception as e:
                skipped_count += 1
                errors.append(f"Row {idx+1}: {str(e)}")

        db.commit()
        return {
            "state_name": state_name,
            "scheme_code": scheme_code,
            "imported_count": imported_count,
            "skipped_count": skipped_count,
            "errors": errors
        }

    @classmethod
    def ingest_csv_data(
        cls,
        db: Session,
        csv_text: str,
        state_name: str = "National Import",
        scheme_code: str = "POSTMATRIC"
    ) -> Dict[str, Any]:
        """Parse CSV and pipe to state adapter ingestion."""
        reader = csv.DictReader(io.StringIO(csv_text))
        records = [row for row in reader]
        return cls.ingest_state_portal_batch(db, state_name, records, scheme_code)
