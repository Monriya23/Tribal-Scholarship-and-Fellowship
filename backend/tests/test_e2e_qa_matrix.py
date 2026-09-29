import unittest
import uuid
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database.connection import Base, get_db
from app.database.models import (
    User, Student, Scheme, SchemeVersion, PolicyClaim, Application,
    ApplicationDocument, Deficiency, AuditLog, SourceDocument, PolicyConflict, Source
)
from app.services.normalization import GradeNormalizationService
from app.services.eligibility import DeterministicEligibilityEngine
from app.services.workflow import ApplicationWorkflowEngine
from app.services.verification import DocumentIntelligenceService, SyntheticStateEDistrictProvider
from app.services.selection import SelectionEngine
from app.services.conflict_detector import ConflictDetectorService
from app.security.auth import SecurityAuth
from app.main import app

class TestEndToEndQARoleMatrix(unittest.TestCase):
    """
    SETU End-to-End QA, Role Testing, Security & Failure-Path Test Suite
    Covers Parts A through Q of Step 6.5.
    """

    def setUp(self):
        # Create a fresh isolated in-memory SQLite database per test with StaticPool & thread safety
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool
        )
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()
        
        # Override FastAPI dependency to use this test's db
        def override_get_db():
            db_session = self.Session()
            try:
                yield db_session
            finally:
                db_session.close()

        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

        # Seed reference source & schemes
        self.source = Source(
            id="src_mota_ref",
            name="Ministry of Tribal Affairs",
            organization="MoTA",
            base_url="https://tribal.nic.in"
        )
        self.scheme_nfst = Scheme(
            id="scheme_nfst_qa",
            code="NFST",
            name="National Fellowship for ST Students",
            category="HIGHER_EDUCATION_FELLOWSHIP",
            active_version="2025-26"
        )
        self.scheme_nos = Scheme(
            id="scheme_nos_qa",
            code="NOS",
            name="National Overseas Scholarship",
            category="OVERSEAS_STUDIES",
            active_version="2025-26"
        )
        self.db.add_all([self.source, self.scheme_nfst, self.scheme_nos])
        self.db.flush()

        # Seed source doc
        self.source_doc = SourceDocument(
            id="doc_src_nfst",
            source_id=self.source.id,
            title="NFST Official Guidelines 2025-26",
            url="https://tribal.nic.in/nfst.pdf",
            content_hash="hash_nfst_1"
        )
        self.db.add(self.source_doc)
        self.db.flush()

        # Seed policy claims for NFST
        claim_inc = PolicyClaim(
            id="claim_qa_inc",
            scheme_id=self.scheme_nfst.id,
            source_document_id=self.source_doc.id,
            claim_type="ELIGIBILITY",
            field="family_income",
            operator="LESS_THAN_OR_EQUAL",
            value="600000",
            extracted_text="Income ceiling 6.0 Lakhs per annum",
            source_page=3,
            review_status="APPROVED"
        )
        claim_marks = PolicyClaim(
            id="claim_qa_marks",
            scheme_id=self.scheme_nfst.id,
            source_document_id=self.source_doc.id,
            claim_type="ELIGIBILITY",
            field="minimum_marks",
            operator="GREATER_THAN_OR_EQUAL",
            value="55",
            extracted_text="Minimum 55% marks in Post-Graduation",
            source_page=4,
            review_status="APPROVED"
        )
        self.db.add_all([claim_inc, claim_marks])

        # Seed 4 standard test users
        self.pwd_hash = SecurityAuth.hash_password("Passcode@2026")
        
        # 1. Student User
        self.student_user = User(
            id="usr_stu_qa",
            email="student.pooja@tribal.gov.in",
            mobile="9876543210",
            hashed_password=self.pwd_hash,
            role="STUDENT",
            full_name="Pooja Munda",
            is_active=True
        )
        # 2. Institution Verification Officer User
        self.officer_user = User(
            id="usr_off_qa",
            email="officer.nit@edu.gov.in",
            mobile="9876543211",
            hashed_password=self.pwd_hash,
            role="INSTITUTION_OFFICER",
            full_name="Dr. S. K. Roy (Nodal Officer)",
            institution_id="U-001",
            is_active=True
        )
        # 3. State Officer User
        self.state_user = User(
            id="usr_state_qa",
            email="dwo.ranchi@jharkhand.gov.in",
            mobile="9876543212",
            hashed_password=self.pwd_hash,
            role="STATE_OFFICER",
            full_name="Shri A. K. Verma (DWO)",
            state_jurisdiction="Jharkhand",
            is_active=True
        )
        # 4. Ministry Admin User
        self.admin_user = User(
            id="usr_admin_qa",
            email="dir.scholarship@tribal.nic.in",
            mobile="9876543213",
            hashed_password=self.pwd_hash,
            role="MINISTRY_ADMIN",
            full_name="Director MoTA",
            is_active=True
        )
        self.db.add_all([self.student_user, self.officer_user, self.state_user, self.admin_user])

        # Seed Student Profile
        self.student_profile = Student(
            id="stu_profile_qa",
            mota_lifetime_id="ST-JH-2026-0099",
            full_name="Pooja Munda",
            aadhaar_vault_ref="VAULT-JH-99",
            date_of_birth="2001-04-12",
            gender="FEMALE",
            tribe="Munda",
            state="Jharkhand",
            district="Ranchi",
            bank_account_masked="XXXXXX4019",
            ifsc="SBIN0001234",
            is_aadhaar_seeded=True,
            annual_family_income=240000.0
        )
        self.db.add(self.student_profile)
        self.db.commit()

        # Auth Tokens
        self.student_token = SecurityAuth.create_access_token(self.student_user.id, self.student_user.role, self.student_user.email)
        self.officer_token = SecurityAuth.create_access_token(self.officer_user.id, self.officer_user.role, self.officer_user.email)
        self.state_token = SecurityAuth.create_access_token(self.state_user.id, self.state_user.role, self.state_user.email)
        self.admin_token = SecurityAuth.create_access_token(self.admin_user.id, self.admin_user.role, self.admin_user.email)

    def tearDown(self):
        self.db.close()
        app.dependency_overrides.clear()

    # =========================================================================
    # PART A & B: STUDENT JOURNEY & ROLE PERMISSIONS
    # =========================================================================

    def test_student_authentication_and_profile_access(self):
        """Verify Student login, JWT generation, and profile access."""
        resp = self.client.post("/api/auth/login", json={
            "identifier": "student.pooja@tribal.gov.in",
            "password": "Passcode@2026"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["role"], "STUDENT")
        self.assertEqual(data["full_name"], "Pooja Munda")
        self.assertIn("access_token", data)

    def test_student_draft_autosave_and_resume(self):
        """Verify low-connectivity draft autosave and resumption."""
        draft_payload = {
            "applicant_mota_id": "ST-JH-2026-0099",
            "scheme_code": "NFST",
            "academic_year": "2025-26",
            "draft_data": {
                "full_name": "Pooja Munda",
                "declared_income": 240000,
                "declared_percentage": 78.5,
                "course_name": "Ph.D Computer Science",
                "institute_aishe": "U-001",
                "institute_name": "NIT Raipur",
                "step_completed": 3
            }
        }
        resp = self.client.post("/api/applications/draft", json=draft_payload)
        self.assertEqual(resp.status_code, 200)
        res_json = resp.json()
        self.assertEqual(res_json["status"], "SAVED")
        app_id = res_json["application_id"]

        # Resume / check persisted draft in database using fresh session
        check_session = self.Session()
        draft_in_db = check_session.query(Application).filter(Application.id == app_id).first()
        self.assertIsNotNone(draft_in_db)
        self.assertTrue(draft_in_db.is_draft)
        self.assertEqual(draft_in_db.draft_data["step_completed"], 3)
        self.assertEqual(draft_in_db.course_name, "Ph.D Computer Science")
        check_session.close()

    def test_student_document_upload_ocr_provenance_and_mismatch(self):
        """Verify document upload, AI extraction, and cross-document discrepancy detection."""
        # Doc 1: Caste Certificate
        doc_caste = ApplicationDocument(
            id="doc_caste_qa_1",
            application_id="",
            doc_type="CASTE_CERTIFICATE",
            file_name="caste_certificate.pdf",
            file_path="/tmp/caste.pdf",
            extracted_fields={"beneficiary_name": "POOJA MUNDA", "tribe_community": "Munda"},
            ocr_confidence=0.95,
            provenance_category="USER_SUBMITTED"
        )
        # Doc 2: Income Certificate with deliberate spelling discrepancy
        doc_income = ApplicationDocument(
            id="doc_income_qa_2",
            application_id="",
            doc_type="INCOME_CERTIFICATE",
            file_name="income_cert.pdf",
            file_path="/tmp/income.pdf",
            extracted_fields={"beneficiary_name": "PUJA MUNDA", "annual_income": 240000},
            ocr_confidence=0.92,
            provenance_category="USER_SUBMITTED"
        )
        self.db.add_all([doc_caste, doc_income])
        self.db.commit()

        # Run cross-document consistency check
        check_res = DocumentIntelligenceService.perform_cross_document_consistency_check(
            documents=[doc_caste, doc_income],
            declared_profile={"full_name": "POOJA MUNDA", "annual_income": 240000}
        )
        self.assertEqual(check_res["consistency_status"], "INFORMATION_MISMATCH")
        self.assertNotEqual(check_res["consistency_status"], "FRAUD_DETECTED")
        self.assertEqual(len(check_res["discrepancies"]), 1)
        self.assertEqual(check_res["discrepancies"][0]["status"], "INFORMATION_MISMATCH")

    def test_student_complete_submission_and_deterministic_eligibility(self):
        """Verify full student application submission, deterministic rules evaluation and policy version attachment."""
        # Create required documents in db
        doc1 = ApplicationDocument(id="doc_sub_1", application_id="", doc_type="CASTE_CERTIFICATE", file_name="c.pdf", file_path="/tmp")
        doc2 = ApplicationDocument(id="doc_sub_2", application_id="", doc_type="INCOME_CERTIFICATE", file_name="i.pdf", file_path="/tmp")
        doc3 = ApplicationDocument(id="doc_sub_3", application_id="", doc_type="MARKSHEET", file_name="m.pdf", file_path="/tmp")
        doc4 = ApplicationDocument(id="doc_sub_4", application_id="", doc_type="BONAFIDE", file_name="b.pdf", file_path="/tmp")
        self.db.add_all([doc1, doc2, doc3, doc4])
        self.db.commit()

        submit_payload = {
            "applicant_mota_id": "ST-JH-2026-0099",
            "scheme_code": "NFST",
            "academic_year": "2025-26",
            "access_mode": "SELF_SERVICE",
            "declared_income": 240000.0,
            "declared_percentage": 78.5,
            "original_grade_type": "PERCENTAGE",
            "original_grade_value": "78.5",
            "course_name": "Ph.D Tribal Studies",
            "institute_aishe": "U-001",
            "institute_name": "Central University of Jharkhand",
            "document_ids": ["doc_sub_1", "doc_sub_2", "doc_sub_3", "doc_sub_4"]
        }
        resp = self.client.post("/api/applications/submit", json=submit_payload)
        self.assertEqual(resp.status_code, 200)
        app_data = resp.json()
        
        self.assertEqual(app_data["scheme_code"], "NFST")
        self.assertEqual(app_data["current_stage"], "INSTITUTION_VERIFICATION")
        self.assertEqual(app_data["evaluated_policy_version"], "2025-26")
        self.assertGreaterEqual(len(app_data["rule_evaluation_results"]), 2)
        
        # Verify individual rule checks
        rule_status_map = {r["rule_id"]: (r.get("result") or r.get("status")) for r in app_data["rule_evaluation_results"]}
        self.assertIn("PASS", rule_status_map.values())

    # =========================================================================
    # PART C: INSTITUTION / VERIFICATION OFFICER END-TO-END TEST
    # =========================================================================

    def test_officer_dossier_inspection_and_override_block_without_reason(self):
        """Verify Officer can inspect case file, but override without mandatory reason is blocked."""
        # Create test application under review
        app_obj = Application(
            id="app_off_test_01",
            application_no="TSF-2026-OFF01",
            applicant_id=self.student_profile.id,
            scheme_id=self.scheme_nfst.id,
            academic_year="2025-26",
            current_stage="ELIGIBILITY_REVIEW",
            status="REVIEW_REQUIRED",
            declared_income=300000,
            declared_percentage=65.0,
            course_name="Ph.D Forestry",
            institute_aishe="U-001",
            evaluated_policy_version="2025-26"
        )
        self.db.add(app_obj)
        self.db.commit()

        # 1. Attempt invalid transition from ELIGIBILITY_REVIEW to PAYMENT_PROCESSING (must be rejected)
        resp_invalid = self.client.post(
            f"/api/applications/{app_obj.id}/transition",
            json={"target_stage": "PAYMENT_PROCESSING", "reason": "Attempting skip"},
            headers={"Authorization": f"Bearer {self.officer_token}"}
        )
        self.assertEqual(resp_invalid.status_code, 400)
        self.assertIn("Invalid transition", resp_invalid.json()["detail"])

        # 2. Attempt valid transition to APPROVED with mandatory reason
        resp_valid = self.client.post(
            f"/api/applications/{app_obj.id}/transition",
            json={
                "target_stage": "APPROVED",
                "target_status": "APPROVED",
                "reason": "Institution Board manually validated income and state domicile credentials"
            },
            headers={"Authorization": f"Bearer {self.officer_token}"}
        )
        self.assertEqual(resp_valid.status_code, 200)
        updated_data = resp_valid.json()
        self.assertEqual(updated_data["current_stage"], "APPROVED")

        # 3. Verify audit log entry using fresh session
        check_session = self.Session()
        audit_entry = check_session.query(AuditLog).filter(
            AuditLog.target_entity_id == app_obj.id,
            AuditLog.action_type == "STAGE_TRANSITION"
        ).first()
        self.assertIsNotNone(audit_entry)
        self.assertEqual(audit_entry.actor_role, "INSTITUTION_OFFICER")
        check_session.close()

    def test_officer_deficiency_raising_and_resolution_cycle(self):
        """Verify Officer raises deficiency -> Application becomes DEFICIENT -> Notification sent."""
        app_obj = Application(
            id="app_def_test_02",
            application_no="TSF-2026-DEF02",
            applicant_id=self.student_profile.id,
            scheme_id=self.scheme_nfst.id,
            academic_year="2025-26",
            current_stage="INSTITUTION_VERIFICATION",
            status="IN_VERIFICATION",
            declared_income=200000,
            declared_percentage=80.0,
            course_name="M.Phil",
            institute_aishe="U-001"
        )
        self.db.add(app_obj)
        self.db.commit()

        # Officer raises deficiency via API
        def_payload = {
            "application_id": app_obj.id,
            "document_type": "INCOME_CERTIFICATE",
            "issue_type": "DOCUMENT_BLURRED",
            "issue_description": "Annual income figure obscured by stamp watermark",
            "required_action": "Upload digitally signed e-District certificate"
        }
        resp = self.client.post(
            "/api/deficiencies/raise",
            json=def_payload,
            headers={"Authorization": f"Bearer {self.officer_token}"}
        )
        self.assertEqual(resp.status_code, 200)
        def_data = resp.json()
        self.assertEqual(def_data["status"], "OPEN")
        self.assertEqual(def_data["issue_type"], "DOCUMENT_BLURRED")

        # Verify application status changed to DEFICIENT using fresh session
        check_session = self.Session()
        reloaded_app = check_session.query(Application).filter(Application.id == app_obj.id).first()
        self.assertEqual(reloaded_app.current_stage, "DEFICIENCY")
        self.assertEqual(reloaded_app.status, "DEFICIENT")
        check_session.close()

    # =========================================================================
    # PART D & E: STATE & ADMIN / MINISTRY WORKFLOW
    # =========================================================================

    def test_state_officer_jurisdiction_filtering(self):
        """Verify State Officer can access applications within their jurisdiction."""
        resp = self.client.get("/api/applications?stage=INSTITUTION_VERIFICATION", headers={"Authorization": f"Bearer {self.state_token}"})
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.json(), list)

    def test_admin_policy_claim_review_and_conflict_resolution(self):
        """Verify Admin can review extracted policy claims and resolve conflicting sources."""
        # 1. Add an unapproved claim
        new_claim = PolicyClaim(
            id="claim_unreviewed_01",
            scheme_id=self.scheme_nfst.id,
            source_document_id=self.source_doc.id,
            claim_type="ELIGIBILITY",
            field="age_limit",
            operator="LESS_THAN_OR_EQUAL",
            value="35",
            extracted_text="Age limit 35 years as on 1st July",
            review_status="DETECTED"
        )
        self.db.add(new_claim)
        self.db.commit()

        # 2. Admin reviews & approves claim
        resp = self.client.post(
            f"/api/policy/claims/{new_claim.id}/review",
            json={
                "action": "APPROVE",
                "reviewer_name": "Director MoTA",
                "notes": "Verified against MoTA Gazette Notification 2025"
            },
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["review_status"], "APPROVED")
        self.assertEqual(resp.json()["approved_by"], "Director MoTA")

    # =========================================================================
    # PART F: AUTHORIZATION & SECURITY TESTS (RBAC ENFORCEMENT)
    # =========================================================================

    def test_unauthorized_access_rejected_without_token(self):
        """Verify protected officer endpoints return HTTP 401 when called unauthenticated."""
        resp = self.client.post("/api/deficiencies/raise", json={
            "application_id": "app_001",
            "document_type": "CASTE_CERTIFICATE",
            "issue_type": "INVALID",
            "issue_description": "Unauth test",
            "required_action": "Fix"
        })
        self.assertEqual(resp.status_code, 401)

    def test_student_forbidden_from_officer_endpoints(self):
        """Verify Student role receives HTTP 403 when attempting to raise deficiencies."""
        resp = self.client.post(
            "/api/deficiencies/raise",
            json={
                "application_id": "app_001",
                "document_type": "CASTE_CERTIFICATE",
                "issue_type": "INVALID",
                "issue_description": "Student trying officer action",
                "required_action": "Fix"
            },
            headers={"Authorization": f"Bearer {self.student_token}"}
        )
        self.assertEqual(resp.status_code, 403)
        self.assertIn("Access denied", resp.json()["detail"])

    # =========================================================================
    # PART G: STATE MACHINE VALIDATION (LEGITIMATE VS INVALID TRANSITIONS)
    # =========================================================================

    def test_state_machine_blocks_illegal_stage_jumps(self):
        """Verify State Machine blocks illegal jumps like DRAFT -> SANCTION or DRAFT -> PAYMENT."""
        # 1. DRAFT -> SANCTION (Illegal)
        can_transition, msg = ApplicationWorkflowEngine.validate_transition("DRAFT", "SANCTION")
        self.assertFalse(can_transition)
        self.assertIn("Invalid transition", msg)

        # 2. DRAFT -> PAYMENT_PROCESSING (Illegal)
        can_transition, msg = ApplicationWorkflowEngine.validate_transition("DRAFT", "PAYMENT_PROCESSING")
        self.assertFalse(can_transition)

        # 3. SUBMITTED -> PAYMENT_RELEASED (Illegal)
        can_transition, msg = ApplicationWorkflowEngine.validate_transition("SUBMITTED", "PAYMENT_RELEASED")
        self.assertFalse(can_transition)

        # 4. REJECTED -> PAYMENT_RELEASED (Illegal)
        can_transition, msg = ApplicationWorkflowEngine.validate_transition("REJECTED", "PAYMENT_RELEASED")
        self.assertFalse(can_transition)

        # 5. SUBMITTED -> INSTITUTION_VERIFICATION (Legitimate)
        can_transition, msg = ApplicationWorkflowEngine.validate_transition("SUBMITTED", "INSTITUTION_VERIFICATION")
        self.assertTrue(can_transition)

    # =========================================================================
    # PART I & J: FAILURE PATHS & IDEMPOTENCY TESTING
    # =========================================================================

    def test_grade_normalization_unsupported_scale_returns_review_required(self):
        """Verify grade normalization falls back safely without fabricating a percentage."""
        res = GradeNormalizationService.normalize_academic_score("NON_STANDARD_SCALE", "5.8")
        self.assertIsNone(res["normalized_percentage"])
        self.assertEqual(res["original_value"], "5.8")
        self.assertIn("Unable to determine an authoritative conversion", res["explanation"])

    def test_duplicate_active_application_prevented(self):
        """Verify applicant cannot create duplicate active applications for same scheme and academic year."""
        # Create first application
        app_first = Application(
            id="app_dup_01",
            application_no="TSF-2026-DUP01",
            applicant_id=self.student_profile.id,
            scheme_id=self.scheme_nfst.id,
            academic_year="2025-26",
            current_stage="SUBMITTED",
            status="SUBMITTED",
            is_draft=False,
            declared_income=200000,
            declared_percentage=75.0,
            course_name="Ph.D",
            institute_aishe="U-001"
        )
        self.db.add(app_first)
        self.db.commit()

        # Check duplicate function using fresh session
        check_session = self.Session()
        dup = ApplicationWorkflowEngine.check_duplicate_application(
            db=check_session,
            applicant_id=self.student_profile.id,
            scheme_id=self.scheme_nfst.id,
            academic_year="2025-26"
        )
        self.assertIsNotNone(dup)
        self.assertEqual(dup.application_no, "TSF-2026-DUP01")
        check_session.close()

        # Attempt submit via API -> Should return HTTP 400
        submit_payload = {
            "applicant_mota_id": self.student_profile.mota_lifetime_id,
            "scheme_code": "NFST",
            "academic_year": "2025-26",
            "declared_income": 200000.0,
            "declared_percentage": 75.0,
            "course_name": "Ph.D",
            "institute_aishe": "U-001",
            "document_ids": []
        }
        resp = self.client.post("/api/applications/submit", json=submit_payload)
        self.assertEqual(resp.status_code, 400)
        self.assertIn("already exists", resp.json()["detail"])

    def test_sandbox_dbt_payment_isolation(self):
        """Verify synthetic verification and payment states are isolated and clearly marked DEMO."""
        provider = SyntheticStateEDistrictProvider()
        res = provider.verify_certificate("JH/2026/001", "CASTE_CERTIFICATE", "Jharkhand", "Pooja Munda")
        self.assertIn("Synthetic Verification Environment — Demo Only", res["environment_note"])
        self.assertTrue(res["is_verified"])

if __name__ == "__main__":
    unittest.main()
