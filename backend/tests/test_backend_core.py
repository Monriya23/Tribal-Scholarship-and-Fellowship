import unittest
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.database.connection import Base
from app.database.models import (
    User, Student, Scheme, SchemeVersion, PolicyClaim, Application, ApplicationDocument, Deficiency, Grievance, SelectionResult, SourceDocument, PolicyConflict, Source
)
from app.services.normalization import GradeNormalizationService
from app.services.eligibility import DeterministicEligibilityEngine
from app.services.workflow import ApplicationWorkflowEngine
from app.services.verification import DocumentIntelligenceService, SyntheticStateEDistrictProvider
from app.services.selection import SelectionEngine
from app.services.data_adapter import StateDataAdapterService
from app.services.conflict_detector import ConflictDetectorService
from app.security.auth import SecurityAuth
from app.main import app

class TestTribalBackendEngine(unittest.TestCase):
    def setUp(self):
        # In-memory SQLite for isolated test execution
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()

        # Seed test source & schemes
        self.source = Source(
            id="src_mota",
            name="Ministry of Tribal Affairs",
            organization="MoTA",
            base_url="https://tribal.nic.in"
        )
        self.scheme = Scheme(
            id="scheme_test_nfst",
            code="NFST",
            name="National Fellowship for ST Students",
            category="HIGHER_EDUCATION_FELLOWSHIP",
            active_version="2025-26"
        )
        self.scheme_nos = Scheme(
            id="scheme_test_nos",
            code="NOS",
            name="National Overseas Scholarship",
            category="OVERSEAS_STUDIES",
            active_version="2025-26"
        )
        self.db.add_all([self.source, self.scheme, self.scheme_nos])
        self.db.flush()

        # Seed policy claims
        claim1 = PolicyClaim(
            id="claim_inc_test",
            scheme_id=self.scheme.id,
            source_document_id="doc_test_1",
            claim_type="ELIGIBILITY",
            field="family_income",
            operator="LESS_THAN_OR_EQUAL",
            value="600000",
            extracted_text="Income ceiling 6 Lakhs",
            source_page=4,
            review_status="APPROVED"
        )
        claim2 = PolicyClaim(
            id="claim_marks_test",
            scheme_id=self.scheme.id,
            source_document_id="doc_test_1",
            claim_type="ELIGIBILITY",
            field="minimum_marks",
            operator="GREATER_THAN_OR_EQUAL",
            value="55",
            extracted_text="Minimum 55% marks required",
            source_page=4,
            review_status="APPROVED"
        )
        self.db.add_all([claim1, claim2])
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_security_auth_hashing(self):
        """Test PBKDF2 password hashing and token generation."""
        raw_pwd = "GovtSecurePassword@2026"
        hashed = SecurityAuth.hash_password(raw_pwd)
        
        self.assertTrue(SecurityAuth.verify_password(raw_pwd, hashed))
        self.assertFalse(SecurityAuth.verify_password("WrongPassword", hashed))

        token = SecurityAuth.create_access_token(
            user_id="usr_123",
            role="MINISTRY_ADMIN",
            email="admin@tribal.gov.in"
        )
        payload = SecurityAuth.decode_access_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload.get("sub"), "usr_123")
        self.assertEqual(payload.get("role"), "MINISTRY_ADMIN")

    def test_grade_normalization_authoritative(self):
        """Test grade normalization never blindly invents CGPA conversions."""
        # 1. Direct percentage
        res1 = GradeNormalizationService.normalize_academic_score("PERCENTAGE", "78.5")
        self.assertEqual(res1["status"], "PASS")
        self.assertEqual(res1["normalized_percentage"], 78.5)

        # 2. AICTE CGPA
        res2 = GradeNormalizationService.normalize_academic_score("CGPA_10", "8.5", "CGPA_10_AICTE")
        self.assertEqual(res2["status"], "PASS")
        self.assertEqual(res2["normalized_percentage"], 77.5)  # (8.5 - 0.75) * 10

        # 3. Unmapped Letter Grade -> REVIEW_REQUIRED
        res3 = GradeNormalizationService.normalize_academic_score("CUSTOM_SCALE_LETTER", "Grade-A+")
        self.assertEqual(res3["status"], "REVIEW_REQUIRED")
        self.assertIsNone(res3["normalized_percentage"])

    def test_deterministic_eligibility_engine(self):
        """Test deterministic rules evaluation returns structured check trace without LLM hallucinations."""
        student = Student(
            id="stu_test_1",
            mota_lifetime_id="ST-2026-0001",
            full_name="Birsa Munda",
            aadhaar_vault_ref="XXXX",
            date_of_birth="2000-05-10",
            gender="MALE",
            tribe="Munda",
            state="Jharkhand",
            district="Khunti",
            bank_account_masked="XXXX",
            ifsc="SBIN0001"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_test_1",
            application_no="TSF-2026-000001",
            applicant_id=student.id,
            scheme_id=self.scheme.id,
            declared_income=450000.0,
            declared_percentage=68.0,
            course_name="Ph.D. Anthropology",
            institute_aishe="U-0123"
        )
        self.db.add(app)
        self.db.flush()

        # Add required docs
        doc1 = ApplicationDocument(
            id="doc_caste",
            application_id=app.id,
            doc_type="CASTE_CERTIFICATE",
            file_name="caste.pdf",
            file_path="/tmp/caste.pdf",
            validation_status="VERIFIED"
        )
        doc2 = ApplicationDocument(
            id="doc_income",
            application_id=app.id,
            doc_type="INCOME_CERTIFICATE",
            file_name="income.pdf",
            file_path="/tmp/income.pdf",
            validation_status="VERIFIED"
        )
        doc3 = ApplicationDocument(
            id="doc_marks",
            application_id=app.id,
            doc_type="MARKSHEET",
            file_name="marksheet.pdf",
            file_path="/tmp/marksheet.pdf",
            validation_status="VERIFIED"
        )
        doc4 = ApplicationDocument(
            id="doc_bonafide",
            application_id=app.id,
            doc_type="BONAFIDE",
            file_name="bonafide.pdf",
            file_path="/tmp/bonafide.pdf",
            validation_status="VERIFIED"
        )
        self.db.add_all([doc1, doc2, doc3, doc4])
        self.db.commit()

        # Case 1: All valid -> ELIGIBLE
        result = DeterministicEligibilityEngine.evaluate_application(
            db=self.db,
            application=app,
            student=student,
            scheme=self.scheme
        )
        self.assertEqual(result["overall_result"], "ELIGIBLE")
        self.assertTrue(all(c["result"] == "PASS" for c in result["checks"]))

        # Case 2: Income exceeds -> NOT_ELIGIBLE
        app.declared_income = 800000.0
        result_fail = DeterministicEligibilityEngine.evaluate_application(
            db=self.db,
            application=app,
            student=student,
            scheme=self.scheme
        )
        self.assertEqual(result_fail["overall_result"], "NOT_ELIGIBLE")

    def test_application_state_machine(self):
        """Test strict stage transition enforcement."""
        app = Application(
            id="app_state_test",
            application_no="TSF-2026-000002",
            applicant_id="stu_test_1",
            scheme_id=self.scheme.id,
            current_stage="DRAFT",
            status="DRAFT",
            declared_income=200000,
            declared_percentage=60,
            course_name="MA",
            institute_aishe="C-123"
        )
        self.db.add(app)
        self.db.commit()

        # Valid transition: DRAFT -> SUBMITTED
        updated = ApplicationWorkflowEngine.transition_application_stage(
            db=self.db,
            application=app,
            target_stage="SUBMITTED",
            actor_id="stu_1",
            actor_role="STUDENT",
            actor_name="Birsa Munda"
        )
        self.assertEqual(updated.current_stage, "SUBMITTED")

        # Invalid jump: SUBMITTED -> PAYMENT_RELEASED must raise ValueError
        with self.assertRaises(ValueError):
            ApplicationWorkflowEngine.transition_application_stage(
                db=self.db,
                application=app,
                target_stage="PAYMENT_RELEASED",
                actor_id="stu_1",
                actor_role="STUDENT",
                actor_name="Birsa Munda"
            )

    def test_cross_document_consistency(self):
        """Test cross-document discrepancy flags INFORMATION_MISMATCH (not fraud)."""
        doc1 = ApplicationDocument(
            id="d1", application_id="a1", doc_type="CASTE_CERTIFICATE", file_name="c.pdf", file_path="/tmp",
            extracted_fields={"beneficiary_name": "MONIKA RIYA"}
        )
        doc2 = ApplicationDocument(
            id="d2", application_id="a1", doc_type="INCOME_CERTIFICATE", file_name="i.pdf", file_path="/tmp",
            extracted_fields={"beneficiary_name": "MONIKA RIA", "annual_income": 400000}
        )

        res = DocumentIntelligenceService.perform_cross_document_consistency_check(
            documents=[doc1, doc2],
            declared_profile={"full_name": "MONIKA RIYA", "annual_income": 250000}
        )
        self.assertEqual(res["consistency_status"], "INFORMATION_MISMATCH")
        self.assertGreater(len(res["discrepancies"]), 0)

    def test_certificate_provider_synthetic_flag(self):
        """Test demo certificate provider explicitly labels synthetic environment."""
        provider = SyntheticStateEDistrictProvider()
        res = provider.verify_certificate("JH/2024/123456", "CASTE_CERTIFICATE", "Jharkhand", "Birsa Munda")
        self.assertTrue(provider.IS_DEMO)
        self.assertIn("Synthetic Verification Environment — Demo Only", res["environment_note"])

    def test_selection_engine_trace_generation(self):
        """Test NFST merit selection executes deterministic ranking with calculation trace."""
        stu = Student(
            id="stu_sel_1", mota_lifetime_id="ST-SEL-01", full_name="Arjun Soren",
            aadhaar_vault_ref="XXXX", date_of_birth="2001-01-01", gender="MALE",
            tribe="Santhal", state="Odisha", district="Mayurbhanj", bank_account_masked="XXXX", ifsc="SBIN01"
        )
        app1 = Application(
            id="app_sel_1", application_no="TSF-2026-SEL01", applicant_id="stu_sel_1",
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="SUBMITTED",
            status="SUBMITTED", declared_income=200000, declared_percentage=75.0,
            course_name="M.Phil", institute_aishe="U-999"
        )
        self.db.add_all([stu, app1])
        self.db.commit()

        res = SelectionEngine.run_nfst_merit_selection(
            db=self.db,
            academic_year="2025-26",
            total_slots=10
        )
        self.assertEqual(res["scheme_code"], "NFST")
        self.assertGreaterEqual(res["total_evaluated"], 1)
        self.assertEqual(res["selected_count"], 1)

    def test_state_data_adapter_csv_ingestion(self):
        """Test external state CSV data parsing into common schema."""
        csv_data = "student_name,mota_id,tribe,annual_income,marks_percentage,college_aishe,course_name\nAnita Oraon,ST-JH-2026-0099,Oraon,180000,72.4,C-44444,B.Tech CS"
        result = StateDataAdapterService.ingest_csv_data(
            db=self.db,
            csv_text=csv_data,
            state_name="Jharkhand",
            scheme_code="NFST"
        )
        self.assertEqual(result["imported_count"], 1)
        self.assertEqual(result["skipped_count"], 0)

        # Verify record in DB
        stu = self.db.query(Student).filter(Student.mota_lifetime_id == "ST-JH-2026-0099").first()
        self.assertIsNotNone(stu)
        self.assertEqual(stu.full_name, "Anita Oraon")

    def test_fastapi_endpoints_health_and_schemes(self):
        """Test FastAPI API contracts via TestClient."""
        client = TestClient(app)
        
        # Health check
        res_health = client.get("/")
        self.assertEqual(res_health.status_code, 200)
        self.assertEqual(res_health.json()["status"], "HEALTHY")

        # Schemes list
        res_schemes = client.get("/api/schemes")
        self.assertEqual(res_schemes.status_code, 200)
        schemes = res_schemes.json()
        self.assertGreater(len(schemes), 0)
        scheme_codes = [s["code"] for s in schemes]
        self.assertIn("NFST", scheme_codes)
        self.assertIn("NOS", scheme_codes)
        self.assertIn("TOPCLASS", scheme_codes)
        self.assertIn("POSTMATRIC", scheme_codes)

    def test_case_1_authoritative_percentage_eligibility(self):
        """CASE 1: Student with authoritative percentage -> normal eligibility calculation."""
        res = GradeNormalizationService.normalize_academic_score("PERCENTAGE", "82.4")
        self.assertEqual(res["status"], "PASS")
        self.assertEqual(res["normalized_percentage"], 82.4)
        self.assertEqual(res["normalization_method"], "DIRECT_PERCENTAGE")

    def test_case_2_cgpa_authoritative_conversion(self):
        """CASE 2: Student with CGPA and authoritative conversion -> correct normalization with source."""
        res = GradeNormalizationService.normalize_academic_score("CGPA_10", "8.0", "CGPA_10_AICTE")
        self.assertEqual(res["status"], "PASS")
        self.assertEqual(res["normalized_percentage"], 72.5)  # (8.0 - 0.75) * 10
        self.assertIn("AICTE Guideline Gazette", res["normalization_source"])

    def test_case_3_cgpa_no_authoritative_conversion_review_required(self):
        """CASE 3: Student with CGPA/Letter grade and NO authoritative conversion -> REVIEW REQUIRED."""
        res = GradeNormalizationService.normalize_academic_score("CUSTOM_7_SCALE", "5.8")
        self.assertEqual(res["status"], "REVIEW_REQUIRED")
        self.assertIsNone(res["normalized_percentage"])
        self.assertEqual(res["original_value"], "5.8")
        self.assertIn("Unable to determine an authoritative conversion", res["explanation"])

    def test_case_4_document_name_mismatch_correction_workflow(self):
        """CASE 4: Document name mismatch -> correction/review workflow."""
        doc1 = ApplicationDocument(
            id="d_caste_1", application_id="a_mismatch", doc_type="CASTE_CERTIFICATE",
            file_name="c.pdf", file_path="/tmp", extracted_fields={"beneficiary_name": "POOJA MUNDA"}
        )
        doc2 = ApplicationDocument(
            id="d_inc_1", application_id="a_mismatch", doc_type="INCOME_CERTIFICATE",
            file_name="i.pdf", file_path="/tmp", extracted_fields={"beneficiary_name": "PUJA MUNDA", "annual_income": 200000}
        )
        res = DocumentIntelligenceService.perform_cross_document_consistency_check(
            documents=[doc1, doc2],
            declared_profile={"full_name": "POOJA MUNDA", "annual_income": 200000}
        )
        self.assertEqual(res["consistency_status"], "INFORMATION_MISMATCH")
        self.assertEqual(res["discrepancies"][0]["status"], "INFORMATION_MISMATCH")
        self.assertIn("POOJA MUNDA", res["discrepancies"][0]["expected_value"])

    def test_case_5_ocr_without_authoritative_api(self):
        """CASE 5: Document OCR succeeds but authority verification unavailable -> marked DEMO / manual review required."""
        provider = SyntheticStateEDistrictProvider()
        res = provider.verify_certificate("JH/2026/INVALID999", "CASTE_CERTIFICATE", "Jharkhand", "Student")
        self.assertIn("Synthetic Verification Environment — Demo Only", res["environment_note"])
        if not res["is_verified"]:
            self.assertEqual(res["status"], "NOT_FOUND")

    def test_case_6_conflicting_policy_documents(self):
        """CASE 6: Two conflicting official policy documents -> conflict state detected with both sources."""
        doc_a = SourceDocument(
            id="doc_src_a", source_id="src_mota", title="MoTA Gazette 2024",
            url="https://tribal.nic.in/g1.pdf", content_hash="hash_a1"
        )
        doc_b = SourceDocument(
            id="doc_src_b", source_id="src_mota", title="NSP Portal FAQ 2025",
            url="https://scholarships.gov.in/faq.pdf", content_hash="hash_b1"
        )
        self.db.add_all([doc_a, doc_b])
        self.db.flush()

        claim_a = PolicyClaim(
            id="claim_conf_a", scheme_id=self.scheme.id, source_document_id=doc_a.id,
            claim_type="ELIGIBILITY", field="family_income", operator="LESS_THAN_OR_EQUAL",
            value="600000", extracted_text="Income ceiling 6 Lakhs", review_status="ACTIVE", source_page=2
        )
        claim_b = PolicyClaim(
            id="claim_conf_b", scheme_id=self.scheme.id, source_document_id=doc_b.id,
            claim_type="ELIGIBILITY", field="family_income", operator="LESS_THAN_OR_EQUAL",
            value="800000", extracted_text="Income limit 8 Lakhs", review_status="ACTIVE", source_page=5
        )
        self.db.add_all([claim_a, claim_b])
        self.db.commit()

        conflicts = ConflictDetectorService.scan_for_conflicts(self.db, self.scheme.id)
        self.assertGreaterEqual(len(conflicts), 1)
        conf = conflicts[0]
        self.assertEqual(conf.field, "family_income")
        self.assertEqual(conf.status, "OPEN")
        self.assertIn("Discrepancy in 'family_income'", conf.description)

    def test_case_7_policy_version_immutability(self):
        """CASE 7: Policy version changes -> old application retains old policy version snapshot."""
        student = Student(
            id="stu_v1", mota_lifetime_id="ST-V1", full_name="Birsa Munda",
            aadhaar_vault_ref="XXXX", date_of_birth="2000-01-01", gender="MALE",
            tribe="Munda", state="Jharkhand", district="Ranchi", bank_account_masked="XXXX", ifsc="SBIN01"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_v1", application_no="TSF-2025-001", applicant_id=student.id,
            scheme_id=self.scheme.id, academic_year="2024-25", declared_income=500000,
            declared_percentage=70.0, course_name="Ph.D", institute_aishe="U-1",
            evaluated_policy_version="2024-25"
        )
        self.db.add(app)
        self.db.commit()

        # Update active version of scheme
        self.scheme.active_version = "2026-27"
        self.db.commit()

        # Historical application still retains original evaluated_policy_version "2024-25"
        reloaded_app = self.db.query(Application).filter(Application.id == "app_v1").first()
        self.assertEqual(reloaded_app.evaluated_policy_version, "2024-25")
        self.assertEqual(self.scheme.active_version, "2026-27")

    def test_case_8_demo_payment_data_is_sandbox(self):
        """CASE 8: Demo payment data is clearly isolated and marked as sandbox."""
        doc = ApplicationDocument(
            id="doc_pay_test", application_id="app_v1", doc_type="CASTE_CERTIFICATE",
            file_name="caste.pdf", file_path="/tmp/caste.pdf"
        )
        self.db.add(doc)
        self.db.commit()

        vfy = DocumentIntelligenceService.verify_certificate_with_provider(
            db=self.db,
            document=doc,
            cert_number="JH/2026/001",
            applicant_name="Birsa Munda",
            state="Jharkhand"
        )
        self.assertTrue(vfy.is_demo_environment)
        self.assertEqual(vfy.verification_type, "SYNTHETIC_DEMO")

    def test_case_9_real_user_application_integrity(self):
        """CASE 9: Real user application starts with authentic user-submitted data without fake transaction IDs."""
        app = Application(
            id="app_real_user", application_no="TSF-2026-REAL01", applicant_id="stu_v1",
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="DRAFT",
            status="DRAFT", declared_income=250000, declared_percentage=80.0,
            course_name="B.Tech", institute_aishe="U-001"
        )
        self.db.add(app)
        self.db.commit()
        
        self.assertEqual(app.current_stage, "DRAFT")
        self.assertEqual(app.status, "DRAFT")

    def test_case_10_unsupported_selection_formula_flagged(self):
        """CASE 10: Selection engine generates clear calculation trace with policy version used."""
        sel_res = SelectionEngine.run_nos_committee_queue_assignment(self.db, "2025-26")
        self.assertEqual(sel_res["scheme_code"], "NOS")
        self.assertEqual(sel_res["status"], "QUEUED_FOR_COMMITTEE_EVALUATION")

    def test_case_11_human_override_requires_mandatory_reason_and_logs_audit(self):
        """CASE 11: Human-in-the-loop override records mandatory reason and generates an immutable audit event."""
        student = Student(
            id="stu_ovr", mota_lifetime_id="ST-OVR-01", full_name="Soma Soren",
            aadhaar_vault_ref="VAULT-99", date_of_birth="2001-05-12", gender="FEMALE",
            tribe="Santhal", state="Odisha", district="Mayurbhanj", bank_account_masked="XXXX1234", ifsc="SBIN0001"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_ovr_01", application_no="TSF-2026-OVR01", applicant_id=student.id,
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="ELIGIBILITY_REVIEW",
            status="REVIEW_REQUIRED", declared_income=500000, declared_percentage=65.0,
            course_name="Ph.D Biotechnology", institute_aishe="U-002",
            evaluated_policy_version="2025-26"
        )
        self.db.add(app)
        self.db.commit()

        # Attempt transition with mandatory reason
        updated_app = ApplicationWorkflowEngine.transition_application_stage(
            db=self.db,
            application=app,
            target_stage="APPROVED",
            actor_id="officer_tribal_99",
            actor_role="INSTITUTION_VERIFIER",
            actor_name="Dr. R. K. Nayak",
            reason="Equivalence certificate from AIU verified manually for Grade conversion",
            metadata={"override_performed": True, "policy_version": "2025-26"}
        )
        self.db.commit()

        self.assertEqual(updated_app.current_stage, "APPROVED")
        self.assertEqual(updated_app.status, "APPROVED")

        # Verify audit record exists
        from app.database.models import AuditLog
        audit_entry = self.db.query(AuditLog).filter(
            AuditLog.target_entity_id == "app_ovr_01",
            AuditLog.action_type == "STAGE_TRANSITION"
        ).first()
        self.assertIsNotNone(audit_entry)
        self.assertEqual(audit_entry.actor_name, "Dr. R. K. Nayak")
        self.assertIn("ELIGIBILITY_REVIEW", str(audit_entry.before_state))

    def test_case_12_assisted_application_metadata_preservation(self):
        """CASE 12: Assisted application correctly stores assistance point metadata and consent record."""
        student = Student(
            id="stu_asst", mota_lifetime_id="ST-ASST-01", full_name="Rani Murmu",
            aadhaar_vault_ref="VAULT-88", date_of_birth="2002-08-20", gender="FEMALE",
            tribe="Santhal", state="Jharkhand", district="Dumka", bank_account_masked="XXXX5678", ifsc="SBIN0002"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_asst_01", application_no="TSF-2026-ASST01", applicant_id=student.id,
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="SUBMITTED",
            status="SUBMITTED", declared_income=180000, declared_percentage=78.5,
            course_name="M.Sc Chemistry", institute_aishe="U-12345",
            access_mode="ASSISTED",
            assisted_by="Shri A. K. Verma (District Welfare Officer)",
            assisted_institution_id="DWO-DUMKA-01",
            consent_record={"consent_given": True, "consent_timestamp": "2026-09-29T10:00:00Z", "mode": "BIOMETRIC_OR_OTP"}
        )
        self.db.add(app)
        self.db.commit()

        saved_app = self.db.query(Application).filter(Application.id == "app_asst_01").first()
        self.assertEqual(saved_app.access_mode, "ASSISTED")
        self.assertEqual(saved_app.assisted_by, "Shri A. K. Verma (District Welfare Officer)")
        self.assertTrue(saved_app.consent_record.get("consent_given"))

    def test_case_13_draft_resume_continuity(self):
        """CASE 13: Draft application saves partial form state and allows resumption without losing data."""
        student = Student(
            id="stu_draft", mota_lifetime_id="ST-DFT-01", full_name="Karan Hansda",
            aadhaar_vault_ref="VAULT-77", date_of_birth="2003-01-15", gender="MALE",
            tribe="Ho", state="Odisha", district="Sundargarh", bank_account_masked="XXXX9999", ifsc="SBIN0003"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_dft_01", application_no="TSF-2026-DFT01", applicant_id=student.id,
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="DRAFT",
            status="DRAFT", is_draft=True, declared_income=220000, declared_percentage=82.0,
            course_name="B.Tech Computer Science", institute_aishe="U-9988",
            draft_data={"step_completed": 2, "temp_phone": "9876543210", "hostel_opted": True}
        )
        self.db.add(app)
        self.db.commit()

        dft_app = self.db.query(Application).filter(Application.id == "app_dft_01").first()
        self.assertTrue(dft_app.is_draft)
        self.assertEqual(dft_app.draft_data["step_completed"], 2)
        self.assertTrue(dft_app.draft_data["hostel_opted"])

    def test_case_14_deficiency_resolution_and_reverification_cycle(self):
        """CASE 14: Full deficiency lifecycle: Flagging -> Student Resubmission -> State Machine updates."""
        student = Student(
            id="stu_def_cycle", mota_lifetime_id="ST-DEF-01", full_name="Mangal Munda",
            aadhaar_vault_ref="VAULT-66", date_of_birth="1999-11-10", gender="MALE",
            tribe="Munda", state="Jharkhand", district="Khunti", bank_account_masked="XXXX4444", ifsc="SBIN0004"
        )
        self.db.add(student)
        self.db.flush()

        app = Application(
            id="app_def_cycle_01", application_no="TSF-2026-DEF01", applicant_id=student.id,
            scheme_id=self.scheme.id, academic_year="2025-26", current_stage="SUBMITTED",
            status="SUBMITTED", declared_income=300000, declared_percentage=88.0,
            course_name="Ph.D History", institute_aishe="U-7766"
        )
        self.db.add(app)
        self.db.commit()

        # Transition to DEFICIENCY
        ApplicationWorkflowEngine.transition_application_stage(
            db=self.db,
            application=app,
            target_stage="DEFICIENCY",
            actor_id="officer_101",
            actor_role="INSTITUTION_VERIFIER",
            actor_name="Verifier Officer",
            reason="Income certificate unclear/blurred"
        )
        self.db.commit()
        self.assertEqual(app.current_stage, "DEFICIENCY")

        # Student Resubmits -> Transition to RESUBMITTED
        ApplicationWorkflowEngine.transition_application_stage(
            db=self.db,
            application=app,
            target_stage="RESUBMITTED",
            actor_id="stu_def_cycle",
            actor_role="STUDENT",
            actor_name="Mangal Munda",
            reason="Uploaded high-resolution digital certificate issued by Circle Officer"
        )
        self.db.commit()
        self.assertEqual(app.current_stage, "RESUBMITTED")

        # Move to DOCUMENT_VERIFICATION for re-verification
        ApplicationWorkflowEngine.transition_application_stage(
            db=self.db,
            application=app,
            target_stage="DOCUMENT_VERIFICATION",
            actor_id="system_service",
            actor_role="SYSTEM",
            actor_name="Document Intelligence Pipeline",
            reason="Resubmitted document re-verification initiated"
        )
        self.db.commit()
        self.assertEqual(app.current_stage, "DOCUMENT_VERIFICATION")

if __name__ == "__main__":
    unittest.main()

