import unittest
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from sqlalchemy.pool import StaticPool
from app.database.connection import Base, get_db
from app.database.models import (
    User, Student, Scheme, SchemeVersion, PolicyClaim, Application, 
    Policy, PolicyClause, PolicyRule, PolicyConflict, PolicyException, 
    PolicySnapshot, PolicySimulation, AuditLog, SourceDocument, Source
)
from app.services.policy_service import PolicyService
from app.models.policy import (
    PolicyCreateRequest, PolicySimulationRequest, 
    PolicySnapshotCreateRequest, HumanOverrideRequest
)
from app.main import app

class TestPolicyIntelligenceGovernance(unittest.TestCase):
    def setUp(self):
        # In-memory SQLite for complete test isolation across threads
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool
        )
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.db = self.Session()

        # Override dependency
        def override_get_db():
            db = self.Session()
            try:
                yield db
            finally:
                db.close()
        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

        # Seed baseline Scheme
        self.scheme = Scheme(
            id="scheme_nfst_test",
            code="NFST",
            name="National Fellowship for Higher Education of ST Students",
            category="HIGHER_EDUCATION_FELLOWSHIP",
            active_version="2025-26"
        )
        self.source = Source(
            id="src_mota_test",
            name="Ministry of Tribal Affairs",
            organization="MoTA",
            base_url="https://tribal.nic.in"
        )
        self.db.add_all([self.scheme, self.source])
        self.db.flush()

        # Seed baseline Student and Application
        self.student = Student(
            id="stu_test_01",
            mota_lifetime_id="ST-CASE-2026-JH-001",
            full_name="Pooja Munda",
            aadhaar_vault_ref="aadhaar_vault_test",
            date_of_birth="2001-08-14",
            gender="FEMALE",
            tribe="Munda",
            annual_family_income=280000.0,
            district="Ranchi",
            state="Jharkhand",
            mobile="9876543210",
            email="pooja.munda@test.ac.in",
            bank_account_masked="XXXXXX4321",
            ifsc="SBIN0001234",
            is_aadhaar_seeded=True
        )
        self.db.add(self.student)
        self.db.flush()

        self.app_record = Application(
            id="app_test_01",
            application_no="TSF-2026-TEST-001",
            applicant_id=self.student.id,
            scheme_id=self.scheme.id,
            academic_year="2025-26",
            current_stage="MINISTRY_SCRUTINY",
            declared_income=280000.0,
            declared_percentage=78.4,
            normalized_percentage=78.4,
            course_name="Ph.D. in Materials Science",
            institute_aishe="C-12345",
            institute_name="NIT Raipur",
            status="IN_PROGRESS",
            evaluated_policy_version="NFST-2026-v2"
        )
        self.db.add(self.app_record)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        app.dependency_overrides.clear()

    def test_1_policy_version_creation_and_preservation(self):
        """Test that creating a new policy version supersedes previous without overwriting."""
        # 1. Create v1
        req_v1 = PolicyCreateRequest(
            scheme_id=self.scheme.id,
            policy_name="NFST Operating Guidelines 2024",
            policy_type="GUIDELINE",
            version="NFST-2024-v1",
            effective_from=datetime.datetime(2024, 4, 1),
            effective_to=datetime.datetime(2025, 3, 31),
            publication_date="01 Apr 2024",
            source_title="Official NFST Guidelines 2024-25",
            clauses=[]
        )
        pol_v1 = PolicyService.create_policy_version(self.db, req_v1)
        pol_v1.status = "ACTIVE"
        self.db.commit()

        self.assertEqual(pol_v1.version, "NFST-2024-v1")
        self.assertEqual(pol_v1.status, "ACTIVE")

        # 2. Create v2 that supersedes v1
        req_v2 = PolicyCreateRequest(
            scheme_id=self.scheme.id,
            policy_name="NFST Revised Operating Guidelines 2025",
            policy_type="GUIDELINE",
            version="NFST-2025-v2",
            effective_from=datetime.datetime(2025, 4, 1),
            publication_date="01 Apr 2025",
            source_title="Official NFST Guidelines 2025-26",
            supersedes_policy_version="NFST-2024-v1",
            clauses=[]
        )
        pol_v2 = PolicyService.create_policy_version(self.db, req_v2)

        # 3. Assert both policies exist in DB and v1 is marked SUPERSEDED
        self.db.refresh(pol_v1)
        self.assertEqual(pol_v1.status, "SUPERSEDED")
        self.assertEqual(pol_v2.supersedes_policy_version, "NFST-2024-v1")
        
        all_pols = self.db.query(Policy).filter(Policy.scheme_id == self.scheme.id).all()
        self.assertEqual(len(all_pols), 2)

    def test_2_effective_date_engine_selection(self):
        """Test that date-based policy resolution correctly identifies historical vs current active policies."""
        # Seed v1 (2024-04-01 to 2025-03-31)
        p1 = Policy(
            id="pol_test_v1",
            scheme_id=self.scheme.id,
            policy_name="NFST 2024",
            version="NFST-2024-v1",
            status="SUPERSEDED",
            effective_from=datetime.datetime(2024, 4, 1),
            effective_to=datetime.datetime(2025, 3, 31),
            source_title="NFST Guidelines 2024"
        )
        # Seed v2 (2025-04-01 onwards)
        p2 = Policy(
            id="pol_test_v2",
            scheme_id=self.scheme.id,
            policy_name="NFST 2025",
            version="NFST-2025-v2",
            status="ACTIVE",
            effective_from=datetime.datetime(2025, 4, 1),
            effective_to=None,
            source_title="NFST Guidelines 2025"
        )
        self.db.add_all([p1, p2])
        self.db.commit()

        # Application submitted in Nov 2024 -> Should match NFST-2024-v1
        historical_date = datetime.datetime(2024, 11, 15)
        resolved_hist = PolicyService.get_applicable_policy(self.db, self.scheme.id, historical_date)
        self.assertIsNotNone(resolved_hist)
        self.assertEqual(resolved_hist.version, "NFST-2024-v1")

        # Application submitted in June 2025 -> Should match NFST-2025-v2
        current_date = datetime.datetime(2025, 6, 15)
        resolved_curr = PolicyService.get_applicable_policy(self.db, self.scheme.id, current_date)
        self.assertIsNotNone(resolved_curr)
        self.assertEqual(resolved_curr.version, "NFST-2025-v2")

    def test_3_rule_evaluation_with_provenance(self):
        """Test rule engine execution returning rule-by-rule checks with verified official provenance."""
        # Create policy and rules
        pol = Policy(
            id="pol_rule_test",
            scheme_id=self.scheme.id,
            policy_name="NFST Guidelines 2025",
            version="NFST-2025-v2",
            status="ACTIVE",
            effective_from=datetime.datetime(2025, 4, 1),
            source_title="NFST Guidelines 2025"
        )
        cls = PolicyClause(
            id="cls_rule_test_01",
            policy_id=pol.id,
            section="Clause 4.1",
            heading="Eligibility & Income",
            original_text="Income ceiling ₹6 Lakh and minimum 55% marks.",
            source_reference="NFST Guidelines 2025, Clause 4.1, p.12"
        )
        r1 = PolicyRule(
            id="NFST-INCOME-001",
            clause_id=cls.id,
            policy_id=pol.id,
            rule_type="INCOME",
            field="family_income",
            operator="LESS_THAN_OR_EQUAL",
            value="600000",
            unit="INR",
            source_reference="NFST Guidelines 2025, Clause 4.1, p.12",
            status="ACTIVE"
        )
        r2 = PolicyRule(
            id="NFST-ACAD-002",
            clause_id=cls.id,
            policy_id=pol.id,
            rule_type="ACADEMIC",
            field="minimum_marks",
            operator="GREATER_THAN_OR_EQUAL",
            value="55",
            unit="%",
            source_reference="NFST Guidelines 2025, Clause 4.2, p.12",
            status="ACTIVE"
        )
        self.db.add_all([pol, cls, r1, r2])
        self.db.commit()

        # Evaluate candidate data
        applicant_data = {
            "family_income": 280000,
            "minimum_marks": 78.4
        }
        eval_result = PolicyService.evaluate_rules_with_provenance(self.db, pol.id, applicant_data)
        
        self.assertEqual(eval_result["overall_status"], "PASS")
        self.assertEqual(eval_result["passed_rules_count"], 2)
        self.assertEqual(len(eval_result["rule_results"]), 2)
        self.assertEqual(eval_result["rule_results"][0]["source_reference"], "NFST Guidelines 2025, Clause 4.1, p.12")

    def test_4_conflict_detection_and_resolution(self):
        """Test official source conflict resolution marking chosen claim APPROVED and other SUPERSEDED."""
        c_a = PolicyClaim(
            id="claim_a_test",
            scheme_id=self.scheme.id,
            source_document_id="doc_1",
            claim_type="ELIGIBILITY",
            field="family_income",
            operator="LESS_THAN_OR_EQUAL",
            value="600000",
            extracted_text="Base Guideline ₹6,00,000 ceiling"
        )
        c_b = PolicyClaim(
            id="claim_b_test",
            scheme_id=self.scheme.id,
            source_document_id="doc_2",
            claim_type="ELIGIBILITY",
            field="family_income",
            operator="LESS_THAN_OR_EQUAL",
            value="800000",
            extracted_text="Gazette Amendment ₹8,00,000 ceiling"
        )
        self.db.add_all([c_a, c_b])
        self.db.flush()

        conflict = PolicyConflict(
            id="cnf_test_01",
            scheme_id=self.scheme.id,
            field="family_income",
            source_a_id=self.source.id,
            claim_a_id=c_a.id,
            source_b_id=self.source.id,
            claim_b_id=c_b.id,
            description="Guideline vs Gazette discrepancy",
            status="REQUIRES_HUMAN_REVIEW"
        )
        self.db.add(conflict)
        self.db.commit()

        # Resolve conflict via endpoint
        response = self.client.post(
            f"/api/policy/conflicts/{conflict.id}/resolve",
            json={
                "chosen_claim_id": c_b.id,
                "resolver_name": "Joint Secretary (Tribal Welfare)",
                "resolution_notes": "Gazette notification prevails as latest official policy amendment."
            }
        )
        self.assertEqual(response.status_code, 200)

        # Assert DB state
        self.db.refresh(conflict)
        self.db.refresh(c_a)
        self.db.refresh(c_b)
        self.assertEqual(conflict.status, "RESOLVED")
        self.assertEqual(c_b.review_status, "APPROVED")
        self.assertEqual(c_a.review_status, "SUPERSEDED")

    def test_5_policy_simulation_isolation_and_no_production_modifications(self):
        """Test sandboxed impact simulation without modifying production records."""
        # Initial production state
        initial_stage = self.app_record.current_stage
        initial_status = self.app_record.status

        sim_req = PolicySimulationRequest(
            scheme_id=self.scheme.id,
            base_policy_version="NFST-2026-v2",
            proposed_policy_version="NFST-2027-v3 (Proposed)",
            proposed_change_description="Lower income limit to 2 Lakh to test impact",
            rule_changes=[
                {
                    "field": "family_income",
                    "operator": "LESS_THAN_OR_EQUAL",
                    "value": "200000",
                    "old_value": "600000",
                    "unit": "INR"
                }
            ],
            simulated_by="Ministry Policy Admin"
        )
        sim = PolicyService.run_policy_impact_simulation(self.db, sim_req)

        self.assertTrue(sim.is_sandbox)
        self.assertEqual(sim.total_analyzed, 1)
        self.assertEqual(sim.potentially_affected, 1)
        self.assertEqual(sim.eligibility_outcome_changes, 1)

        # Assert production application record was NOT modified
        self.db.refresh(self.app_record)
        self.assertEqual(self.app_record.current_stage, initial_stage)
        self.assertEqual(self.app_record.status, initial_status)

    def test_6_decision_snapshot_and_time_travel(self):
        """Test storing immutable decision snapshot for retrospective policy time travel."""
        snp_req = PolicySnapshotCreateRequest(
            application_id=self.app_record.id,
            scheme_id=self.scheme.id,
            policy_id="pol_test_v1",
            policy_version="NFST-2025-v1",
            stage="APPLICATION_SUBMISSION",
            applicable_rules=[{"rule_id": "NFST-INCOME-001", "operator": "LESS_THAN_OR_EQUAL", "expected": 600000, "result": "PASS"}],
            input_values={"declared_income": 280000},
            evidence_references=[{"doc_type": "INCOME_CERTIFICATE", "file": "inc.pdf"}],
            calculated_results=[{"system_decision": "ELIGIBLE"}],
            system_decision="ELIGIBLE",
            human_decision="APPROVED",
            human_actor="Nodal Officer"
        )
        snp = PolicyService.create_decision_snapshot(self.db, snp_req)

        self.assertIsNotNone(snp.id)
        
        # Retrieve via time travel endpoint
        response = self.client.get(f"/api/policy/snapshots/{self.app_record.id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]["policy_version"], "NFST-2025-v1")
        self.assertEqual(data[0]["system_decision"], "ELIGIBLE")

    def test_7_human_override_governance(self):
        """Test recording officer override with immutable audit trail without erasing system check."""
        override_req = HumanOverrideRequest(
            application_id=self.app_record.id,
            decision_type="ELIGIBILITY",
            previous_system_result="REVIEW_REQUIRED",
            final_human_result="APPROVED",
            reason="Original income certificate physically verified with revenue seal.",
            actor="Dr. B. K. Soren",
            actor_role="INSTITUTION_OFFICER",
            policy_version="NFST-2026-v2",
            evidence_reference="Certificate #JHK-INC-8891"
        )
        audit = PolicyService.record_human_override(self.db, override_req)

        self.assertIsNotNone(audit.id)
        self.assertEqual(audit.action_type, "OVERRIDE_DECISION")
        self.assertEqual(audit.before_state["system_result"], "REVIEW_REQUIRED")
        self.assertEqual(audit.after_state["human_decision"], "APPROVED")

    def test_8_exception_lifecycle(self):
        """Test exception creation for unmapped grading and resolution with officer formula."""
        exc = PolicyException(
            id="exc_test_01",
            application_id=self.app_record.id,
            scheme_id=self.scheme.id,
            category="UNMAPPED_GRADING",
            description="Applicant uses CPI 7.82/10 at NIT Raipur.",
            evidence={"cpi": 7.82, "scale": 10.0},
            policy_version="NFST-2026-v2",
            status="OPEN"
        )
        self.db.add(exc)
        self.db.commit()

        # Resolve exception
        res = self.client.post(
            f"/api/policy/exceptions/{exc.id}/resolve",
            json={
                "resolution": "APPROVED_EXCEPTION",
                "resolution_reason": "Converted CPI to 74.29% using NIT Raipur formula (CPI - 0.75) * 10.",
                "resolved_by": "Director (MoTA)"
            }
        )
        self.assertEqual(res.status_code, 200)

        self.db.refresh(exc)
        self.assertEqual(exc.status, "RESOLVED")
        self.assertEqual(exc.resolution, "APPROVED_EXCEPTION")

if __name__ == "__main__":
    unittest.main()
