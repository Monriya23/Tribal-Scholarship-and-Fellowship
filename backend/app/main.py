import datetime
import hashlib
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import init_db, SessionLocal
from app.database.models import (
    Source, SourceDocument, DocumentChunk, Scheme, SchemeVersion, PolicyClaim, User, Student,
    Application, Policy, PolicyClause, PolicyRule, PolicyConflict, PolicyException, PolicySnapshot
)
from app.security.auth import SecurityAuth
from app.services.source_registry import SourceRegistryService
from app.api import (
    auth, users, schemes, applications, documents, verification,
    eligibility, selection, deficiencies, notifications, grievances,
    sources, policy, sync, rag, analytics, admin
)

def seed_official_baseline(db):
    """Seed authentic baseline MoTA circulars, official schemes, and administrative role accounts."""
    SourceRegistryService.ensure_initial_sources(db)
    
    # 1. Seed Default Administrative & Role Accounts
    default_users = [
        {
            "id": "usr_mota_admin_01",
            "email": "admin@tribal.gov.in",
            "mobile": "9876543210",
            "full_name": "Dr. Rajeshwar Sharma (Director, MoTA)",
            "role": "MINISTRY_ADMIN",
            "password": "Password@2026",
            "state_jurisdiction": "All India"
        },
        {
            "id": "usr_inst_officer_01",
            "email": "nodal.officer@nitrr.ac.in",
            "mobile": "9876543211",
            "full_name": "Prof. Amit Tigga (Nodal Officer, NIT Raipur)",
            "role": "INSTITUTION_OFFICER",
            "password": "Password@2026",
            "institution_id": "C-12345"
        },
        {
            "id": "usr_state_officer_01",
            "email": "director.tribal@jharkhand.gov.in",
            "mobile": "9876543212",
            "full_name": "Smt. Sunita Murmu (State Welfare Commissioner, Jharkhand)",
            "role": "STATE_OFFICER",
            "password": "Password@2026",
            "state_jurisdiction": "Jharkhand"
        },
        {
            "id": "usr_reviewer_01",
            "email": "expert.reviewer@tribal.gov.in",
            "mobile": "9876543213",
            "full_name": "Dr. Arjun Hansda (Empaneled Policy Reviewer)",
            "role": "REVIEWER",
            "password": "Password@2026"
        },
        {
            "id": "usr_student_pooja",
            "email": "pooja.munda@student.ac.in",
            "mobile": "9876543214",
            "full_name": "Pooja Munda",
            "role": "STUDENT",
            "password": "Password@2026",
            "state_jurisdiction": "Jharkhand"
        }
    ]

    for u_data in default_users:
        existing_u = db.query(User).filter((User.id == u_data["id"]) | (User.email == u_data["email"])).first()
        if not existing_u:
            user_obj = User(
                id=u_data["id"],
                email=u_data["email"],
                mobile=u_data["mobile"],
                hashed_password=SecurityAuth.hash_password(u_data["password"]),
                role=u_data["role"],
                full_name=u_data["full_name"],
                institution_id=u_data.get("institution_id"),
                state_jurisdiction=u_data.get("state_jurisdiction"),
                is_active=True,
                created_at=datetime.datetime.utcnow()
            )
            db.add(user_obj)

    # 2. Seed Official MoTA Schemes
    schemes_data = [
        {
            "id": "scheme_nfst",
            "code": "NFST",
            "name": "National Fellowship for Higher Education of ST Students",
            "category": "HIGHER_EDUCATION_FELLOWSHIP",
            "description": "Fellowship scheme for Scheduled Tribe scholars pursuing M.Phil and Ph.D. degrees in Science, Humanities, Engineering and Social Sciences.",
            "funding_type": "CENTRAL_SECTOR",
            "central_share": 100,
            "state_share": 0,
            "selection_method": "MERIT_RANKING",
            "active_version": "2025-26"
        },
        {
            "id": "scheme_nos",
            "code": "NOS",
            "name": "National Overseas Scholarship for ST Students",
            "category": "OVERSEAS_STUDIES",
            "description": "Financial assistance for meritorious ST students to pursue Master's, Ph.D., and Post-Doctoral research in accredited foreign universities.",
            "funding_type": "CENTRAL_SECTOR",
            "central_share": 100,
            "state_share": 0,
            "selection_method": "COMMITTEE_EVALUATION",
            "active_version": "2025-26"
        },
        {
            "id": "scheme_topclass",
            "code": "TOPCLASS",
            "name": "National Scholarship for Higher Education (Top Class) for ST Students",
            "category": "TOP_CLASS",
            "description": "Full financial support for ST students admitted to premier notified institutions including IITs, IIMs, NITs, AIIMS, and National Law Universities.",
            "funding_type": "CENTRAL_SECTOR",
            "central_share": 100,
            "state_share": 0,
            "selection_method": "AUTO_ENTITLEMENT",
            "active_version": "2025-26"
        },
        {
            "id": "scheme_postmatric",
            "code": "POSTMATRIC",
            "name": "Post-Matric Scholarship Scheme for ST Students",
            "category": "POST_MATRIC",
            "description": "Centrally Sponsored scheme providing financial assistance to ST students studying at post-matriculation or post-secondary stages.",
            "funding_type": "CENTRALLY_SPONSORED",
            "central_share": 75,
            "state_share": 25,
            "selection_method": "ELIGIBILITY_FIRST_COME",
            "active_version": "2025-26"
        },
        {
            "id": "scheme_prematric",
            "code": "PREMATRIC",
            "name": "Pre-Matric Scholarship Scheme for ST Students (Classes IX & X)",
            "category": "PRE_MATRIC",
            "description": "Centrally Sponsored scheme to support tribal parents for education of their children studying in classes IX and X to minimize dropouts.",
            "funding_type": "CENTRALLY_SPONSORED",
            "central_share": 75,
            "state_share": 25,
            "selection_method": "AUTO_ENTITLEMENT",
            "active_version": "2025-26"
        }
    ]

    for s_info in schemes_data:
        existing_s = db.query(Scheme).filter(Scheme.id == s_info["id"]).first()
        if not existing_s:
            s_obj = Scheme(
                id=s_info["id"],
                code=s_info["code"],
                name=s_info["name"],
                category=s_info["category"],
                description=s_info["description"],
                funding_type=s_info["funding_type"],
                central_share=s_info["central_share"],
                state_share=s_info["state_share"],
                selection_method=s_info["selection_method"],
                active_version=s_info["active_version"]
            )
            db.add(s_obj)
            db.flush()
            
            # Version
            v_obj = SchemeVersion(
                id=f"{s_info['id']}_v1",
                scheme_id=s_obj.id,
                version_tag=s_info["active_version"],
                effective_academic_year=s_info["active_version"],
                financial_benefits={},
                eligibility_criteria=[],
                is_active=True
            )
            db.add(v_obj)

    # 3. Official Guideline Documents & Verified Policy Claims
    official_docs = [
        {
            "id": "doc_nfst_guidelines_2025",
            "source_id": "src_fellowship_portal",
            "title": "National Fellowship for ST Students - Official Guidelines 2025-26",
            "url": "https://fellowship.tribal.gov.in/guidelines/NFST_Guidelines_2025_26.pdf",
            "document_type": "GUIDELINE_PDF",
            "scheme_id": "scheme_nfst",
            "chunks": [
                {
                    "page": 4,
                    "title": "Eligibility Criteria (Clause 4.1)",
                    "text": "The candidate must belong to Scheduled Tribe (ST) category and have secured at least 55% marks at Post Graduate level. Total family income from all sources must not exceed ₹6,00,000 per annum for fellowship awards."
                },
                {
                    "page": 7,
                    "title": "Fellowship Rates (Clause 7.2)",
                    "text": "The fellowship amount shall be ₹35,000 per month for JRF (first 2 years) and ₹38,000 per month for SRF (remaining tenure). In addition, an annual contingency grant of ₹20,500 for Science subjects and ₹12,000 for Humanities/Social Sciences shall be admissible."
                },
                {
                    "page": 9,
                    "title": "Tenure and Review (Clause 9.1)",
                    "text": "The maximum tenure of fellowship is 5 years for Ph.D. scholars. Upgradation from JRF to SRF requires submission of an assessment report endorsed by the Research Supervisor and Head of Department."
                }
            ],
            "claims": [
                {
                    "field": "family_income",
                    "operator": "LESS_THAN_OR_EQUAL",
                    "value": "600000",
                    "unit": "INR",
                    "claim_type": "ELIGIBILITY",
                    "page": 4,
                    "text": "Total family income from all sources must not exceed ₹6,00,000 per annum for fellowship awards."
                },
                {
                    "field": "minimum_marks",
                    "operator": "GREATER_THAN_OR_EQUAL",
                    "value": "55",
                    "unit": "PERCENT",
                    "claim_type": "ELIGIBILITY",
                    "page": 4,
                    "text": "The candidate must have secured at least 55% marks at Post Graduate level."
                },
                {
                    "field": "stipend_monthly",
                    "operator": "EQUALS",
                    "value": "35000",
                    "unit": "INR/MONTH",
                    "claim_type": "BENEFIT",
                    "page": 7,
                    "text": "The fellowship amount shall be ₹35,000 per month for JRF (first 2 years)."
                }
            ]
        },
        {
            "id": "doc_nos_guidelines_2025",
            "source_id": "src_overseas_portal",
            "title": "National Overseas Scholarship for ST - Official Scheme Circular 2025-26",
            "url": "https://overseas.tribal.gov.in/circulars/NOS_Guidelines_2025_26.pdf",
            "document_type": "GUIDELINE_PDF",
            "scheme_id": "scheme_nos",
            "chunks": [
                {
                    "page": 3,
                    "title": "Income Limit (Clause 3.2)",
                    "text": "Total family income ceiling for National Overseas Scholarship is ₹8,00,000 per annum. Candidates who have secured admission in the top 500 QS World Ranked institutions are eligible to apply."
                },
                {
                    "page": 6,
                    "title": "Financial Assistance (Clause 6.1)",
                    "text": "The scheme covers 100% actual tuition fees charged by foreign universities along with an annual maintenance allowance of £9,900 in the United Kingdom or $15,400 in the United States and other countries."
                }
            ],
            "claims": [
                {
                    "field": "family_income",
                    "operator": "LESS_THAN_OR_EQUAL",
                    "value": "800000",
                    "unit": "INR",
                    "claim_type": "ELIGIBILITY",
                    "page": 3,
                    "text": "Total family income ceiling for National Overseas Scholarship is ₹8,00,000 per annum."
                },
                {
                    "field": "minimum_marks",
                    "operator": "GREATER_THAN_OR_EQUAL",
                    "value": "60",
                    "unit": "PERCENT",
                    "claim_type": "ELIGIBILITY",
                    "page": 3,
                    "text": "Minimum 60% marks in qualifying degree required."
                }
            ]
        },
        {
            "id": "doc_postmatric_guidelines_2025",
            "source_id": "src_nsp_portal",
            "title": "Post-Matric Scholarship for ST Students - Revised Guidelines",
            "url": "https://scholarships.gov.in/schemes/MoTA_PostMatric_Guidelines.pdf",
            "document_type": "GUIDELINE_PDF",
            "scheme_id": "scheme_postmatric",
            "chunks": [
                {
                    "page": 2,
                    "title": "Income Criteria (Clause 2.1)",
                    "text": "Scholarships will be paid to the students whose parents/guardians' annual income from all sources does not exceed ₹2,50,000 (Rupees Two Lakh Fifty Thousand only)."
                },
                {
                    "page": 5,
                    "title": "Disbursement via DBT (Clause 5.4)",
                    "text": "All scholarship amounts including maintenance allowance and compulsory tuition fees shall be disbursed directly into the Aadhaar-seeded bank account of the beneficiary via PFMS/DBT."
                }
            ],
            "claims": [
                {
                    "field": "family_income",
                    "operator": "LESS_THAN_OR_EQUAL",
                    "value": "250000",
                    "unit": "INR",
                    "claim_type": "ELIGIBILITY",
                    "page": 2,
                    "text": "Parents/guardians' annual income from all sources does not exceed ₹2,50,000."
                }
            ]
        }
    ]

    # 4. Seed Baseline Students & Applications
    stu_data = [
        {
            "id": "stu_pooja_01",
            "mota_lifetime_id": "ST-CASE-2026-JH-88341",
            "full_name": "Pooja Munda",
            "aadhaar_vault_ref": "aadhaar_vault_9921_xxxx",
            "date_of_birth": "2001-08-14",
            "gender": "FEMALE",
            "caste_tribe_name": "Munda",
            "sub_tribe": "Patar Munda",
            "is_pvtg": False,
            "annual_family_income": 280000.0,
            "district": "Ranchi",
            "state": "Jharkhand",
            "mobile": "9876543214",
            "email": "pooja.munda@student.ac.in",
            "disability_percent": 0.0
        },
        {
            "id": "stu_birsa_02",
            "mota_lifetime_id": "ST-CASE-2026-OD-77219",
            "full_name": "Birsa Soren",
            "aadhaar_vault_ref": "aadhaar_vault_4412_xxxx",
            "date_of_birth": "1999-03-22",
            "gender": "MALE",
            "caste_tribe_name": "Santhal",
            "is_pvtg": False,
            "annual_family_income": 420000.0,
            "district": "Mayurbhanj",
            "state": "Odisha",
            "mobile": "9876543215",
            "email": "birsa.soren@research.ac.in",
            "disability_percent": 0.0
        }
    ]

    for s_item in stu_data:
        existing_stu = db.query(Student).filter(Student.id == s_item["id"]).first()
        if not existing_stu:
            stu_obj = Student(
                id=s_item["id"],
                mota_lifetime_id=s_item["mota_lifetime_id"],
                full_name=s_item["full_name"],
                aadhaar_vault_ref=s_item["aadhaar_vault_ref"],
                date_of_birth=s_item["date_of_birth"],
                gender=s_item["gender"],
                caste_tribe_name=s_item["caste_tribe_name"],
                is_pvtg=s_item["is_pvtg"],
                annual_family_income=s_item["annual_family_income"],
                district=s_item["district"],
                state=s_item["state"],
                mobile=s_item["mobile"],
                email=s_item["email"],
                disability_percent=s_item["disability_percent"]
            )
            db.add(stu_obj)

    db.flush()

    app_data = [
        {
            "id": "app_nfst_001",
            "application_no": "TSF-2026-001245",
            "applicant_id": "stu_pooja_01",
            "scheme_id": "scheme_nfst",
            "academic_year": "2025-26",
            "current_stage": "MINISTRY_SCRUTINY",
            "declared_income": 280000.0,
            "declared_percentage": 78.4,
            "normalized_percentage": 78.4,
            "course_name": "Ph.D. in Metallurgy & Materials Science",
            "institute_aishe": "C-12345",
            "institute_name": "National Institute of Technology, Raipur",
            "status": "IN_PROGRESS",
            "evaluated_policy_version": "NFST-2026-v2"
        },
        {
            "id": "app_nos_002",
            "application_no": "TSF-2026-003491",
            "applicant_id": "stu_birsa_02",
            "scheme_id": "scheme_nos",
            "academic_year": "2025-26",
            "current_stage": "INSTITUTION_VERIFICATION",
            "declared_income": 420000.0,
            "declared_percentage": 82.1,
            "normalized_percentage": 82.1,
            "course_name": "M.S. in Renewable Energy Systems",
            "institute_aishe": "FOR-5501",
            "institute_name": "University of Manchester (UK)",
            "status": "IN_PROGRESS",
            "evaluated_policy_version": "NOS-2025-v1"
        }
    ]

    for a_item in app_data:
        existing_app = db.query(Application).filter(Application.id == a_item["id"]).first()
        if not existing_app:
            app_obj = Application(
                id=a_item["id"],
                application_no=a_item["application_no"],
                applicant_id=a_item["applicant_id"],
                scheme_id=a_item["scheme_id"],
                academic_year=a_item["academic_year"],
                current_stage=a_item["current_stage"],
                submission_date=datetime.datetime.utcnow() - datetime.timedelta(days=15),
                declared_income=a_item["declared_income"],
                declared_percentage=a_item["declared_percentage"],
                normalized_percentage=a_item["normalized_percentage"],
                course_name=a_item["course_name"],
                institute_aishe=a_item["institute_aishe"],
                institute_name=a_item["institute_name"],
                status=a_item["status"],
                evaluated_policy_version=a_item["evaluated_policy_version"]
            )
            db.add(app_obj)

    db.flush()

    # 5. Seed Structured Policies, Clauses, and Rules
    policies_data = [
        {
            "id": "pol_nfst_2025_v1",
            "scheme_id": "scheme_nfst",
            "policy_name": "National Fellowship for Higher Education of ST Students - Operating Guidelines 2025",
            "policy_type": "GUIDELINE",
            "version": "NFST-2025-v1",
            "status": "SUPERSEDED",
            "effective_from": datetime.datetime(2024, 4, 1),
            "effective_to": datetime.datetime(2025, 3, 31),
            "publication_date": "01 Apr 2024",
            "source_title": "Official NFST Guidelines 2024-25",
            "source_url": "https://fellowship.tribal.gov.in/guidelines/NFST_2024_25.pdf",
            "source_page": 4,
            "approved_by": "Director (Tribal Education), MoTA",
            "approved_at": datetime.datetime(2024, 3, 28),
            "notes": "Superseded by NFST-2026-v2 on 2025-04-01.",
            "clauses": [
                {
                    "id": "cls_nfst_v1_01",
                    "section": "Clause 4.1",
                    "heading": "Academic Eligibility",
                    "original_text": "Candidate must secure minimum 50% marks in PG.",
                    "source_reference": "NFST Guidelines 2024-25, Section 4.1, p.4",
                    "rules": [
                        {
                            "id": "NFST-ELIG-V1-01",
                            "rule_type": "ACADEMIC",
                            "field": "minimum_marks",
                            "operator": "GREATER_THAN_OR_EQUAL",
                            "value": "50",
                            "unit": "%",
                            "priority": 1,
                            "source_reference": "NFST Guidelines 2024-25, Section 4.1, p.4"
                        }
                    ]
                }
            ]
        },
        {
            "id": "pol_nfst_2026_v2",
            "scheme_id": "scheme_nfst",
            "policy_name": "National Fellowship for Higher Education of ST Students - Revised Framework 2026-27",
            "policy_type": "GUIDELINE",
            "version": "NFST-2026-v2",
            "status": "ACTIVE",
            "effective_from": datetime.datetime(2025, 4, 1),
            "effective_to": None,
            "publication_date": "01 Apr 2025",
            "source_title": "Official NFST Operational Framework 2025-26",
            "source_url": "https://fellowship.tribal.gov.in/guidelines/NFST_Guidelines_2025_26.pdf",
            "source_page": 12,
            "approved_by": "Joint Secretary (Tribal Welfare), MoTA",
            "approved_at": datetime.datetime(2025, 3, 30),
            "supersedes_policy_version": "NFST-2025-v1",
            "notes": "Current operative policy for all Fellowship awards.",
            "clauses": [
                {
                    "id": "cls_nfst_v2_01",
                    "section": "Clause 4.1",
                    "heading": "Tribal Domicile & Community Certification",
                    "original_text": "The candidate must belong to a notified Scheduled Tribe (ST) community and possess a valid digitally verifiable Caste Certificate issued by the competent revenue authority.",
                    "source_reference": "NFST Guideline 2025-26, Section 4.1, p.12",
                    "rules": [
                        {
                            "id": "NFST-ELIG-001",
                            "rule_type": "ELIGIBILITY",
                            "field": "caste_tribe",
                            "operator": "EQUALS",
                            "value": "ST",
                            "unit": "CATEGORY",
                            "priority": 1,
                            "source_reference": "NFST Guideline 2025-26, Section 4.1, p.12"
                        }
                    ]
                },
                {
                    "id": "cls_nfst_v2_02",
                    "section": "Clause 4.2",
                    "heading": "Academic Eligibility & PG Marks Cutoff",
                    "original_text": "The candidate must have secured at least 55% marks or equivalent CGPA in Post-Graduate examination from a UGC-recognized university.",
                    "source_reference": "NFST Guideline 2025-26, Section 4.2, p.12",
                    "rules": [
                        {
                            "id": "NFST-ACAD-002",
                            "rule_type": "ACADEMIC",
                            "field": "minimum_marks",
                            "operator": "GREATER_THAN_OR_EQUAL",
                            "value": "55",
                            "unit": "%",
                            "priority": 2,
                            "source_reference": "NFST Guideline 2025-26, Section 4.2, p.12"
                        }
                    ]
                },
                {
                    "id": "cls_nfst_v2_03",
                    "section": "Clause 4.3",
                    "heading": "Annual Family Income Ceiling",
                    "original_text": "Total family income from all sources must not exceed ₹6,00,000 per annum for fellowship awards.",
                    "source_reference": "NFST Guideline 2025-26, Section 4.3, p.13",
                    "rules": [
                        {
                            "id": "NFST-INCOME-003",
                            "rule_type": "INCOME",
                            "field": "family_income",
                            "operator": "LESS_THAN_OR_EQUAL",
                            "value": "600000",
                            "unit": "INR",
                            "priority": 3,
                            "source_reference": "NFST Guideline 2025-26, Section 4.3, p.13"
                        }
                    ]
                },
                {
                    "id": "cls_nfst_v2_04",
                    "section": "Clause 7.2",
                    "heading": "Monthly Fellowship & Contingency Rates",
                    "original_text": "The fellowship amount shall be ₹35,000 per month for JRF (first 2 years) and ₹38,000 per month for SRF (remaining tenure).",
                    "source_reference": "NFST Guideline 2025-26, Section 7.2, p.15",
                    "rules": [
                        {
                            "id": "NFST-BENEFIT-004",
                            "rule_type": "BENEFIT",
                            "field": "stipend_monthly",
                            "operator": "EQUALS",
                            "value": "35000",
                            "unit": "INR/MONTH",
                            "priority": 4,
                            "source_reference": "NFST Guideline 2025-26, Section 7.2, p.15"
                        }
                    ]
                }
            ]
        },
        {
            "id": "pol_nos_2025_v1",
            "scheme_id": "scheme_nos",
            "policy_name": "National Overseas Scholarship for ST Students - Regulations 2025-26",
            "policy_type": "GUIDELINE",
            "version": "NOS-2025-v1",
            "status": "ACTIVE",
            "effective_from": datetime.datetime(2025, 4, 1),
            "effective_to": None,
            "publication_date": "01 Apr 2025",
            "source_title": "National Overseas Scholarship Official Regulations",
            "source_url": "https://overseas.tribal.gov.in/circulars/NOS_Guidelines_2025_26.pdf",
            "source_page": 3,
            "approved_by": "Joint Secretary (Scholarships), MoTA",
            "approved_at": datetime.datetime(2025, 3, 29),
            "notes": "Covers overseas Master's and Ph.D. in top 500 QS institutions.",
            "clauses": [
                {
                    "id": "cls_nos_01",
                    "section": "Clause 3.1",
                    "heading": "Income Ceiling",
                    "original_text": "Total family income ceiling for National Overseas Scholarship is ₹8,00,000 per annum.",
                    "source_reference": "NOS Regulations 2025-26, Section 3.1, p.3",
                    "rules": [
                        {
                            "id": "NOS-INCOME-001",
                            "rule_type": "INCOME",
                            "field": "family_income",
                            "operator": "LESS_THAN_OR_EQUAL",
                            "value": "800000",
                            "unit": "INR",
                            "priority": 1,
                            "source_reference": "NOS Regulations 2025-26, Section 3.1, p.3"
                        }
                    ]
                },
                {
                    "id": "cls_nos_02",
                    "section": "Clause 3.2",
                    "heading": "Academic Requirement",
                    "original_text": "Minimum 60% marks or equivalent in qualifying degree is mandatory.",
                    "source_reference": "NOS Regulations 2025-26, Section 3.2, p.3",
                    "rules": [
                        {
                            "id": "NOS-ACAD-002",
                            "rule_type": "ACADEMIC",
                            "field": "minimum_marks",
                            "operator": "GREATER_THAN_OR_EQUAL",
                            "value": "60",
                            "unit": "%",
                            "priority": 2,
                            "source_reference": "NOS Regulations 2025-26, Section 3.2, p.3"
                        }
                    ]
                }
            ]
        },
        {
            "id": "pol_topclass_2025_v1",
            "scheme_id": "scheme_topclass",
            "policy_name": "National Scholarship for Higher Education (Top Class) Guidelines",
            "policy_type": "GUIDELINE",
            "version": "TOPCLASS-2025-v1",
            "status": "ACTIVE",
            "effective_from": datetime.datetime(2025, 4, 1),
            "effective_to": None,
            "publication_date": "01 Apr 2025",
            "source_title": "MoTA Top Class Notified Institutions Manual",
            "source_url": "https://tribal.gov.in/schemes/TopClass_Manual.pdf",
            "source_page": 2,
            "approved_by": "Director (MoTA)",
            "approved_at": datetime.datetime(2025, 3, 25),
            "clauses": [
                {
                    "id": "cls_topclass_01",
                    "section": "Clause 2.1",
                    "heading": "Income Limit",
                    "original_text": "Total family income from all sources must not exceed ₹6,00,000 per annum.",
                    "source_reference": "Top Class Manual, Clause 2.1, p.2",
                    "rules": [
                        {
                            "id": "TOPCLASS-INCOME-001",
                            "rule_type": "INCOME",
                            "field": "family_income",
                            "operator": "LESS_THAN_OR_EQUAL",
                            "value": "600000",
                            "unit": "INR",
                            "priority": 1,
                            "source_reference": "Top Class Manual, Clause 2.1, p.2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "pol_postmatric_2025_v1",
            "scheme_id": "scheme_postmatric",
            "policy_name": "Centrally Sponsored Post-Matric Scholarship for ST - Operational Framework",
            "policy_type": "GUIDELINE",
            "version": "POSTMATRIC-2025-v1",
            "status": "ACTIVE",
            "effective_from": datetime.datetime(2025, 4, 1),
            "effective_to": None,
            "publication_date": "01 Apr 2025",
            "source_title": "Post-Matric Scholarship Scheme Guidelines (NSP)",
            "source_url": "https://scholarships.gov.in/schemes/MoTA_PostMatric_Guidelines.pdf",
            "source_page": 2,
            "approved_by": "Joint Secretary (Scholarships), MoTA",
            "approved_at": datetime.datetime(2025, 3, 20),
            "clauses": [
                {
                    "id": "cls_postmatric_01",
                    "section": "Clause 2.1",
                    "heading": "Parental Income Limit",
                    "original_text": "Scholarships will be paid to students whose parents/guardians' annual income does not exceed ₹2,50,000.",
                    "source_reference": "Post-Matric Guidelines, Clause 2.1, p.2",
                    "rules": [
                        {
                            "id": "POSTMATRIC-INCOME-001",
                            "rule_type": "INCOME",
                            "field": "family_income",
                            "operator": "LESS_THAN_OR_EQUAL",
                            "value": "250000",
                            "unit": "INR",
                            "priority": 1,
                            "source_reference": "Post-Matric Guidelines, Clause 2.1, p.2"
                        }
                    ]
                }
            ]
        }
    ]

    for p_info in policies_data:
        existing_pol = db.query(Policy).filter(Policy.id == p_info["id"]).first()
        if not existing_pol:
            pol_obj = Policy(
                id=p_info["id"],
                scheme_id=p_info["scheme_id"],
                policy_name=p_info["policy_name"],
                policy_type=p_info["policy_type"],
                version=p_info["version"],
                status=p_info["status"],
                effective_from=p_info["effective_from"],
                effective_to=p_info.get("effective_to"),
                publication_date=p_info.get("publication_date"),
                source_title=p_info["source_title"],
                source_url=p_info.get("source_url"),
                source_page=p_info.get("source_page"),
                approved_by=p_info.get("approved_by"),
                approved_at=p_info.get("approved_at"),
                supersedes_policy_version=p_info.get("supersedes_policy_version"),
                notes=p_info.get("notes"),
                created_at=datetime.datetime.utcnow()
            )
            db.add(pol_obj)
            db.flush()

            for c_info in p_info.get("clauses", []):
                cls_obj = PolicyClause(
                    id=c_info["id"],
                    policy_id=pol_obj.id,
                    section=c_info["section"],
                    heading=c_info["heading"],
                    original_text=c_info["original_text"],
                    normalized_text=c_info["original_text"],
                    source_page=p_info.get("source_page"),
                    source_reference=c_info["source_reference"],
                    effective_date=p_info.get("publication_date"),
                    created_at=datetime.datetime.utcnow()
                )
                db.add(cls_obj)
                db.flush()

                for r_info in c_info.get("rules", []):
                    r_obj = PolicyRule(
                        id=r_info["id"],
                        clause_id=cls_obj.id,
                        policy_id=pol_obj.id,
                        rule_type=r_info["rule_type"],
                        field=r_info["field"],
                        operator=r_info["operator"],
                        value=r_info["value"],
                        unit=r_info.get("unit"),
                        priority=r_info.get("priority", 1),
                        effective_from=p_info.get("publication_date"),
                        source_reference=r_info["source_reference"],
                        status="ACTIVE",
                        created_at=datetime.datetime.utcnow()
                    )
                    db.add(r_obj)

    db.flush()

    # 6. Seed Policy Conflict (for Human Conflict Resolution)
    existing_conf = db.query(PolicyConflict).filter(PolicyConflict.id == "cnf_income_nfst_2026").first()
    if not existing_conf:
        # Find claims
        claim_a = db.query(PolicyClaim).filter(PolicyClaim.field == "family_income", PolicyClaim.scheme_id == "scheme_nfst").first()
        if claim_a:
            # Create a second claim representing a recent Gazette Circular
            claim_b = PolicyClaim(
                id="claim_gazette_nfst_income_2026",
                scheme_id="scheme_nfst",
                source_document_id=claim_a.source_document_id,
                claim_type="ELIGIBILITY",
                field="family_income",
                operator="LESS_THAN_OR_EQUAL",
                value="800000",
                unit="INR",
                extracted_text="MoTA Gazette Notification F.No. 11015/04/2026-Scholarship: The annual family income limit for NFST fellowship is enhanced to ₹8,00,000 per annum with effect from Academic Year 2026-27.",
                source_page=2,
                confidence=0.96,
                review_status="UNDER_REVIEW",
                created_at=datetime.datetime.utcnow()
            )
            db.add(claim_b)
            db.flush()

            conf_obj = PolicyConflict(
                id="cnf_income_nfst_2026",
                scheme_id="scheme_nfst",
                field="family_income",
                source_a_id="src_fellowship_portal",
                claim_a_id=claim_a.id,
                source_b_id="src_mota_main",
                claim_b_id=claim_b.id,
                description="Discrepancy detected between Base Guidelines (₹6,00,000 ceiling, clause 4.1) and Gazette Notification F.No. 11015/04/2026 (₹8,00,000 ceiling). Policy resolution required to establish operational ceiling for AY 2026-27.",
                status="REQUIRES_HUMAN_REVIEW",
                created_at=datetime.datetime.utcnow()
            )
            db.add(conf_obj)

    # 7. Seed Policy Exceptions (for Exception Case Management)
    exceptions_data = [
        {
            "id": "exc_grading_nitrr_01",
            "application_id": "app_nfst_001",
            "scheme_id": "scheme_nfst",
            "category": "UNMAPPED_GRADING",
            "description": "Applicant transcript from NIT Raipur uses 10-point CPI grading system (CPI 7.82/10) without standard AI percentage conversion formula.",
            "evidence": {"cpi": 7.82, "scale": 10.0, "institute": "NIT Raipur"},
            "policy_version": "NFST-2026-v2",
            "status": "OPEN"
        },
        {
            "id": "exc_doc_mismatch_02",
            "application_id": "app_nos_002",
            "scheme_id": "scheme_nos",
            "category": "DOCUMENT_INCONSISTENCY",
            "description": "Applicant father's name spelling discrepancy between Caste Certificate ('Ram Soren') and Income Certificate ('Ram Chandra Soren').",
            "evidence": {"caste_cert_name": "Ram Soren", "income_cert_name": "Ram Chandra Soren"},
            "policy_version": "NOS-2025-v1",
            "status": "UNDER_REVIEW"
        },
        {
            "id": "exc_conflict_03",
            "application_id": "app_nfst_001",
            "scheme_id": "scheme_nfst",
            "category": "POLICY_CONFLICT",
            "description": "Income ceiling discrepancy between Base Guideline (₹6 Lakh) and Gazette Circular (₹8 Lakh) affects cutoff decision.",
            "evidence": {"guideline_val": 600000, "gazette_val": 800000},
            "policy_version": "NFST-2026-v2",
            "status": "OPEN"
        }
    ]

    for exc_item in exceptions_data:
        existing_exc = db.query(PolicyException).filter(PolicyException.id == exc_item["id"]).first()
        if not existing_exc:
            exc_obj = PolicyException(
                id=exc_item["id"],
                application_id=exc_item["application_id"],
                scheme_id=exc_item["scheme_id"],
                category=exc_item["category"],
                description=exc_item["description"],
                evidence=exc_item["evidence"],
                policy_version=exc_item["policy_version"],
                status=exc_item["status"],
                created_at=datetime.datetime.utcnow()
            )
            db.add(exc_obj)

    # 8. Seed Policy Snapshots (for Policy Time Travel)
    existing_snp = db.query(PolicySnapshot).filter(PolicySnapshot.id == "snp_nfst_001_v1").first()
    if not existing_snp:
        snp_obj = PolicySnapshot(
            id="snp_nfst_001_v1",
            application_id="app_nfst_001",
            scheme_id="scheme_nfst",
            policy_id="pol_nfst_2025_v1",
            policy_version="NFST-2025-v1",
            stage="APPLICATION_SUBMISSION",
            applicable_rules=[
                {"rule_id": "NFST-ELIG-V1-01", "rule_type": "ACADEMIC", "field": "minimum_marks", "operator": "GREATER_THAN_OR_EQUAL", "expected": "50%", "actual": "78.4%", "result": "PASS"}
            ],
            input_values={"declared_income": 280000, "declared_percentage": 78.4, "course": "Ph.D. in Metallurgy"},
            evidence_references=[{"doc_type": "MARKSHEET", "file_name": "PG_Marksheet_NITRR.pdf", "verification": "VERIFIED"}],
            calculated_results=[{"system_decision": "ELIGIBLE", "confidence": 0.98}],
            system_decision="ELIGIBLE",
            human_decision="APPROVED",
            human_actor="Prof. Amit Tigga (Nodal Officer)",
            snapshot_timestamp=datetime.datetime(2025, 4, 15, 11, 30, 0),
            created_at=datetime.datetime(2025, 4, 15, 11, 30, 0)
        )
        db.add(snp_obj)

    db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite/Postgres DB
    init_db()
    db = SessionLocal()
    try:
        seed_official_baseline(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="Backend service for authentic official source ingestion, policy extraction, RAG, deterministic rule execution, and audit trail."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(schemes.router, prefix=settings.API_PREFIX)
app.include_router(applications.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(verification.router, prefix=settings.API_PREFIX)
app.include_router(eligibility.router, prefix=settings.API_PREFIX)
app.include_router(selection.router, prefix=settings.API_PREFIX)
app.include_router(deficiencies.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)
app.include_router(grievances.router, prefix=settings.API_PREFIX)
app.include_router(sources.router, prefix=settings.API_PREFIX)
app.include_router(policy.router, prefix=settings.API_PREFIX)
app.include_router(sync.router, prefix=settings.API_PREFIX)
app.include_router(rag.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)

@app.get("/")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "CONNECTED",
        "philosophy": "AI interprets. Deterministic rules decide. Humans resolve uncertainty. Database remembers. Audit trail proves what happened.",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
