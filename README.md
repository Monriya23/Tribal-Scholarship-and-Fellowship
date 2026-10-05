# 🌉 SETU — POLICY-AWARE TRIBAL SCHOLARSHIP & FELLOWSHIP

### Connecting Policy • People • Evidence • Decisions • Educational Opportunity

> **Smart India Hackathon 2026 Prototype**  
> **Problem Statement ID:** 26239  
> **Problem Statement Title:** AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes  
> **Ministry:** Ministry of Tribal Affairs (MoTA), Government of India  
> **Category:** Software | **Theme:** Smart Education  
> 
> *SETU is an engineering prototype developed for Smart India Hackathon 2026 and is **NOT** an official Government of India production system.*

---

SETU is a policy-aware digital platform designed to prototype the end-to-end lifecycle management of Tribal scholarships and fellowships — from scheme discovery and application to verification, merit ranking, award workflows, payment milestone tracking, renewal, and grievance handling.

The fundamental challenge in scholarship administration is not simply digitizing paper application forms. Across different schemes, there exist distinct:
- Eligibility conditions and income ceilings
- Document and certification requirements
- Selection and ranking methodologies
- Multi-tier verification workflows
- Policy versions and official circulars
- Exceptional and non-standard cases

SETU addresses this challenge through a structured lifecycle paradigm:

$$\text{POLICY} \longrightarrow \text{SCHEME} \longrightarrow \text{BENEFICIARY} \longrightarrow \text{EVIDENCE} \longrightarrow \text{DECISION} \longrightarrow \text{LIFECYCLE}$$

> **Core Operating Principle:**  
> *AI interprets. Rules decide. Humans resolve uncertainty. Audit trails prove what happened.*

---

## 🚀 Live Prototype

| Resource | Link |
|---|---|
| 🌐 **Live SETU Platform** | Vercel deployment URL — to be added after deployment |
| ⚙️ **Backend API** | [https://tribal-scholarship-and-fellowship.onrender.com/](https://tribal-scholarship-and-fellowship.onrender.com/) |
| 📚 **Interactive API Docs (Swagger)** | [https://tribal-scholarship-and-fellowship.onrender.com/docs](https://tribal-scholarship-and-fellowship.onrender.com/docs) |
| 🔎 **OpenAPI Schema** | [https://tribal-scholarship-and-fellowship.onrender.com/openapi.json](https://tribal-scholarship-and-fellowship.onrender.com/openapi.json) |
| ❤️ **Backend Health Check** | [https://tribal-scholarship-and-fellowship.onrender.com/health](https://tribal-scholarship-and-fellowship.onrender.com/health) |
| 💻 **GitHub Repository** | [https://github.com/Monriya23/Tribal-Scholarship-and-Fellowship](https://github.com/Monriya23/Tribal-Scholarship-and-Fellowship) |

---

## 🎯 The Problem

Tribal scholarship and fellowship administration faces critical operational bottlenecks across multiple schemes and administrative tiers:

- **Multiple Scholarship & Fellowship Schemes:** Pre-matric, post-matric, top-class scholarships, and national/overseas fellowships operate across fragmented portals with varying rules.
- **Different Eligibility & Document Requirements:** Each scheme mandates specific income ceilings, qualification thresholds, caste verifications, and institutional endorsement requirements.
- **Changing Guidelines & Policy Versions:** Guidelines, allowances, and income thresholds evolve over time through new gazettes and circulars, creating historical ambiguity.
- **Manual Document Verification:** Verification officers manually review thousands of income certificates, caste certificates, and marksheets without cross-document consistency checks.
- **Unclear Deficiencies & Application Status:** Applicants face opaque rejection reasons without structured, itemized deficiency rectification mechanisms.
- **Limited Transparency in Selection Decisions:** Merit ranking criteria and cutoff evaluations lack accessible, transparent justifications.
- **Exceptions Requiring Human Judgement:** Complex real-world edge cases (e.g., unmapped institutional grading scales, minor certificate name variations) are often rejected rather than triaged.
- **Disconnected Application, Payment, Renewal & Grievance Processes:** The lifecycle stages operate in administrative silos rather than a single unified digital case record.

---

## 💡 The SETU Solution

SETU provides a unified, policy-aware prototype platform that preserves scheme-specific rules and workflows while providing a shared infrastructure for verification, exception handling, and auditability.

```
Official Guidelines / Notifications
                ↓
        Policy Intelligence
                ↓
      Versioned Policy Rules
                ↓
        Scheme Engine
                ↓
        Beneficiary 360
                ↓
      Document Intelligence
                ↓
        Decision Engine
                ↓
     Human Review / Exceptions
                ↓
        Digital Case File
                ↓
 Award → Payment → Renewal → Grievance
```

### Key Capabilities & Prototype Features

- **Unified Scholarship & Fellowship Management:** Single prototype portal for pre-matric, post-matric, top-class scholarships, and national/overseas fellowships.
- **Scheme Configuration Engine:** Declarative parameterization of scheme metadata, central/state funding ratios, and selection models.
- **Policy Intelligence:** Extraction and structuring of policy clauses from official guidelines and circular documents.
- **Policy Versioning & Effective-Date Management:** Preserving distinct policy versions with explicit effective date ranges (`effective_from`, `effective_to`).
- **Policy Conflict Resolution:** Surfacing discrepancies across guideline circulars for human administrative review.
- **Policy Time Travel:** Reconstructing historic evaluation contexts using the specific policy snapshot active on the application submission date.
- **Policy Change Impact Simulation:** Sandbox engine to test proposed rule adjustments against application cohorts before publishing changes.
- **Beneficiary 360:** Unified student view linking profile identity, education records, documents, applications, benefits, renewals, and grievances.
- **Institution Intelligence:** Support for AISHE institution indexing and dedicated scrutiny queues.
- **Document Intelligence / OCR:** Text extraction with confidence scoring, document quality grading, and cross-document field validation.
- **Cross-Document Consistency Analysis:** Automated comparison of applicant names, dates of birth, and caste categories across uploaded records.
- **Explainable Decisions & Explain My Rank:** Transparent breakdowns of eligibility rules, evaluation scores, and ranking criteria.
- **Exception Management Engine:** Structured four-state case triage (`PASS` / `FAIL` / `REVIEW` / `EXCEPTION`).
- **Human Review / Governed Overrides:** Governed override recording with mandatory reason documentation and evidence linking.
- **Digital Case File:** Persistent digital case records spanning application data, evidence, verification remarks, payment stages, and renewal history.
- **Audit & Provenance:** Traceability linking published sources to rules, applications, and final decisions.
- **Lifecycle & Grievance Workflows:** End-to-end prototype management spanning application submission, verification, awards, renewal, and grievance resolution.

---

## 🧠 Key Differentiators

### 1. Policy Intelligence
Official scheme circulars, gazettes, and public policy documents are ingested, parsed, and converted into structured, verifiable policy rules with clause and page-level attribution.

### 2. Policy Versioning & Effective Dates
Policy rules are never silently overwritten. Every change produces a distinct version (e.g., `NFST-2025-v1` $\rightarrow$ `NFST-2026-v2`) with explicit effective date ranges (`effective_from`, `effective_to`), ensuring historic stability.

### 3. Policy Time Travel
Historical decisions can be reconstructed and audited accurately by executing evaluation logic against the specific policy snapshot active at the time of application submission.

### 4. Policy Conflict Resolution
When multiple circulars or guidelines contain conflicting criteria (e.g., differing income ceilings), the system flags the conflict and routes it to an administrative resolution matrix for human resolution rather than making arbitrary assumptions.

### 5. Policy Change Impact Simulation
Before activating a new guideline version, policy administrators can simulate the rule changes against historical applicant data in a sandbox environment to evaluate impact on qualification rates and budget projections.

### 6. Beneficiary 360
A unified view aggregating student identity, institutional affiliation, academic performance, uploaded documents, past applications, disbursement milestones, renewals, grievances, and complete decision history.

### 7. Document Intelligence & Quality Checks
Automated text extraction from uploaded certificates with field-level OCR confidence scoring and cross-document consistency checks (e.g., matching name across Aadhaar, Caste, and Income certificates).

> [!NOTE]
> **Document Intelligence Disclaimer:**  
> Automated OCR extraction assists document processing and highlights discrepancies; it does **not** constitute legal document authenticity verification. Official verification remains governed by authorized institutional and nodal officers.

### 8. Explainable Decisions
Every eligibility and ranking outcome produces a clear, deterministic explanation breakdown:
$$\text{Applicant Input} \longrightarrow \text{Evaluated Rule} \longrightarrow \text{System Result} \longrightarrow \text{Human Action} \longrightarrow \text{Final Decision}$$

### 9. Exception Management Engine
Real-world student scenarios are not forced into rigid binary pass/fail outcomes. SETU categorizes cases into four distinct states:

$$\mathbf{PASS} \quad\vert\quad \mathbf{FAIL} \quad\vert\quad \mathbf{REVIEW} \quad\vert\quad \mathbf{EXCEPTION}$$

Common exception classes triaged by the engine:
- **Unmapped Grading Scales:** Non-standard institutional CGPA/CPI grading scales.
- **Document Inconsistencies:** Minor spelling or structural differences between identity records.
- **Policy Ambiguities:** Transitional guideline revisions awaiting nodal clarification.
- **Institutional Status Issues:** AISHE code validations or accredited overseas university checks.
- **Benefit Overlap Checks:** Potential cross-scheme duplication flags.
- **Deadline Exceptions:** Governed late submissions under exceptional circumstances.

### 10. Digital Case File & Auditability
Every scholarship application generates an audit-trailed digital case record containing the submission payload, extracted evidence, applied policy version, verification notes, officer overrides, payment milestones, and grievance tickets.

---

## 🏗️ System Architecture

### Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│           React 19 + TypeScript + Vite + Tailwind/Modern CSS           │
│     (Student Portal, Institution Nodal Desk, Ministry Admin Desk)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                       FASTAPI BACKEND SERVICE                          │
│                                                                        │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────┐ │
│  │   Source Ingestion    │ │   Policy Intelligence │ │ Deterministic │ │
│  │  & Document Extract   │ │  & Conflict Resolver  │ │  Rule Engine  │ │
│  └───────────────────────┘ └───────────────────────┘ └───────────────┘ │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────┐ │
│  │    Beneficiary 360    │ │    Exception & Case   │ │   Grounded    │ │
│  │  & Application Engine │ │   Override Governance │ │ RAG Assistant │ │
│  └───────────────────────┘ └───────────────────────┘ └───────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLAlchemy ORM
┌───────────────────────────────────▼────────────────────────────────────┐
│                            DATA LAYER                                  │
│         PostgreSQL (Production) / SQLite (Local Dev & Testing)          │
│  (Schemes, Policies, Claims, Applications, Snapshots, Audit Log)       │
└────────────────────────────────────────────────────────────────────────┘
```

### Deployment Topology

```
                  ┌───────────────────────────────┐
                  │          End Users            │
                  │ (Students, Officers, Admins)  │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │        SETU Frontend          │
                  │          (Vercel)             │
                  └──────────────┬────────────────┘
                                 │ REST API (HTTPS)
                                 ▼
                  ┌───────────────────────────────┐
                  │         SETU Backend          │
                  │       (FastAPI / Render)      │
                  └──────────────┬────────────────┘
                                 │ SQLAlchemy Pool
                                 ▼
                  ┌───────────────────────────────┐
                  │          PostgreSQL           │
                  │        (Render Managed)       │
                  └───────────────────────────────┘
```

---

## 📚 Scholarship & Fellowship Ecosystem

SETU is designed around key scholarship and fellowship schemes administered for Scheduled Tribe scholars:

| Scheme | Target Level | Funding Model (Baseline) | Selection / Allocation Workflow |
|---|---|---|---|
| **Pre-Matric Scholarship** | Classes IX & X | Centrally Sponsored (75:25)* | Entitlement-based on eligibility criteria |
| **Post-Matric Scholarship** | Class XI to Post-Graduate | Centrally Sponsored (75:25)* | Entitlement-based on eligibility & institutional verification |
| **Top Class Scholarship** | Premier Notified Institutes (IITs, NITs, AIIMS, IIMs) | Central Sector (100%)* | Institutional admission auto-entitlement workflow |
| **National Fellowship (NFST)** | M.Phil & Ph.D. Research Scholars | Central Sector (100%)* | Merit ranking & slot-based allocation workflow |
| **National Overseas Scholarship (NOS)** | Master's & Ph.D. Abroad (Top 500 QS) | Central Sector (100%)* | Committee evaluation & QS ranking validation workflow |

*\*Prototype scheme configuration — verify against the applicable current official guideline.*

> [!NOTE]
> The platform provides a common architecture while allowing scheme-specific eligibility, documents, selection logic, and workflows. Live government APIs are not assumed unless officially available and authorized.

---

## 👥 Stakeholder Capabilities Matrix

| Stakeholder Role | Key Portal Capabilities |
|---|---|
| **🎓 Student / Scholar** | Scheme discovery with pre-checks, smart applications, document upload sandbox, stage-by-stage application tracking (16 stages in prototype workflow), structured deficiency resolution, and grievance filing. |
| **🏫 Institution Nodal Officer** | AISHE-indexed scrutiny queue, side-by-side verification dossier, automated discrepancy inspection, and itemized deficiency notice dispatch. |
| **🏛️ State / UT Department** | District-level application funnel monitoring, institutional verification tracking, exception oversight, and sanction order reconciliation. |
| **🇮🇳 Ministry / MoTA Admin** | Scheme parameter builder, policy claim review queue, conflict resolution matrix, policy impact simulation sandbox, and audit trail inspection. |
| **⚖️ Selection Committee** | Multi-candidate evaluation matrix, research proposal scoring, QS ranking evaluation workflow, and governed selection decision recording. |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI & Icons:** Lucide React, Modern CSS & Tailwind-compatible styling
- **User Experience:** Canvas Confetti, accessible modal dialogues, and responsive data tables

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM & Database Toolkit:** SQLAlchemy 2.0+
- **ASGI Server:** Uvicorn
- **Data Validation & Settings:** Pydantic v2
- **Document Processing:** PyPDF, PDFPlumber, BeautifulSoup4
- **HTTP Client:** HTTPX, Requests

### Database & Storage
- **Production Database:** Managed PostgreSQL on Render (via `psycopg`)
- **Local / Test Database:** SQLite / aiosqlite
- **Storage:** Local and cloud-compatible document storage for upload management

### Governance, Intelligence & Security
- **Authentication:** JWT (JSON Web Tokens) with PBKDF2 password hashing
- **Access Control:** Role-Based Access Control (RBAC) across 5 administrative personas
- **Policy Engine:** Deterministic rule evaluation with snapshot versioning
- **Grounded RAG:** Contextual clause-cited assistance from indexed official circulars
- **Audit Logging:** Structured audit trails for officer actions, reviews, exceptions, and overrides

---

## ☁️ Deployment

The SETU platform prototype is deployed on cloud infrastructure:

- **Frontend Hosting:** Vercel
- **Backend Service:** Render (`Python 3.11` Web Service)
- **Database:** PostgreSQL on Render
- **Backend Base URL:** [https://tribal-scholarship-and-fellowship.onrender.com/](https://tribal-scholarship-and-fellowship.onrender.com/)
- **API Base Path:** [https://tribal-scholarship-and-fellowship.onrender.com/api](https://tribal-scholarship-and-fellowship.onrender.com/api)
- **Interactive OpenAPI Documentation:** [https://tribal-scholarship-and-fellowship.onrender.com/docs](https://tribal-scholarship-and-fellowship.onrender.com/docs)
- **OpenAPI Schema:** [https://tribal-scholarship-and-fellowship.onrender.com/openapi.json](https://tribal-scholarship-and-fellowship.onrender.com/openapi.json)
- **Health Endpoint:** [https://tribal-scholarship-and-fellowship.onrender.com/health](https://tribal-scholarship-and-fellowship.onrender.com/health)

The frontend communicates with the FastAPI backend through the configured `VITE_API_BASE_URL` environment variable.

---

## 🧪 Prototype & Data Disclosure

SETU is an engineering prototype developed for **Smart India Hackathon 2026 (Problem Statement 26239)**.

The prototype uses available official public information where applicable and separates official-source information from user-submitted, AI-extracted, human-verified, and synthetic/test information:

| Provenance Badge | Definition & Scope |
|---|---|
| `[OFFICIAL SOURCE]` | Information directly derived from published government guidelines, circulars, and public notifications. |
| `[USER SUBMITTED]` | Data provided directly by the applicant during application submission or profile onboarding. |
| `[AI EXTRACTED]` | Data extracted via OCR or text parsing, requiring human verification before formal activation. |
| `[HUMAN VERIFIED]` | Information reviewed, validated, or confirmed by an authorized nodal officer. |
| `[SYSTEM CALCULATED]` | Deterministic values derived by system calculation (e.g., aggregate score, date difference). |
| `[SYNTHETIC / TEST]` | Demo and test fixtures used to demonstrate workflows and test exception handling. |

> [!IMPORTANT]
> **Data Governance Disclosures:**  
> 1. AI-assisted extraction does not constitute official policy approval or legal document verification.  
> 2. All policy activation, conflict resolution, and exception overrides remain strictly subject to authorized human review.  
> 3. No private government databases or non-public credentials are used.

---

## 🔐 Governance & Security Principles

SETU is built on strict governance foundations designed for policy-aware administrative systems:

$$\text{AI interprets} \longrightarrow \text{Deterministic rules decide} \longrightarrow \text{Humans resolve uncertainty} \longrightarrow \text{Database remembers} \longrightarrow \text{Audit trail proves what happened}$$

### Governed Override Record (Synthetic Demo Example)
When an authorized officer performs an exception override, the system mandates a complete audit record:

```json
{
  "application_id": "DEMO-APPLICATION-001",
  "actor": "DEMO-OFFICER",
  "actor_role": "INSTITUTION_OFFICER",
  "timestamp": "2026-04-15T11:30:00Z",
  "policy_version": "NFST-2026-v2",
  "previous_system_result": "REVIEW (Grading scale non-standard)",
  "final_human_result": "APPROVED",
  "override_reason": "Verified institutional conversion certificate provided by university registrar.",
  "evidence_reference": "DEMO_Conversion_Certificate_2026.pdf (Page 1)"
}
```

### Audit Information
Every administrative action, conflict resolution, and exception override records structured audit information:
- **Actor:** Name and identifier of the officer
- **Actor Role:** Administrative role (`MINISTRY_ADMIN`, `INSTITUTION_OFFICER`, `STATE_OFFICER`, etc.)
- **Timestamp:** Exact UTC timestamp of the action
- **Policy Version:** Specific policy version applied
- **Evidence Reference:** Document title, clause reference, or page citation
- **Previous System Result:** Deterministic system calculation prior to override
- **Human Decision / Result:** Final human action (`APPROVED`, `REJECTED`, `RESOLVED`)
- **Override Reason / Resolution Notes:** Mandatory justification recorded by the actor
- **Audit History:** Structured audit history of state transitions

---

## 🚀 Running Locally

Follow these steps to run the complete SETU prototype locally:

### 1. Prerequisites
- **Node.js** (v18.0 or higher)
- **Python** (v3.11 or higher)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Monriya23/Tribal-Scholarship-and-Fellowship.git
cd Tribal-Scholarship-and-Fellowship
```

### 3. Backend Setup (FastAPI)
```bash
# Navigate to backend directory or run from project root
pip install -r backend/requirements.txt

# Start the FastAPI backend server
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000/`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

### 4. Frontend Setup (React + Vite)
```bash
# In a separate terminal, install dependencies
npm install

# Start the Vite development server
npm run dev
```
- **Frontend Portal:** `http://localhost:5173/`

---

## ⚠️ Current Limitations

To ensure honest technical disclosure, the prototype identifies the following boundaries:

- **Government Verification APIs:** Integrations with production DigiLocker and PFMS gateways require official administrative credentials, digital signature certificates (DSC), and government network access.
- **OCR Assistance Boundary:** OCR extraction accelerates verification and detects discrepancies; it does not replace legal document verification by authorized officers.
- **Policy Rule Activation:** AI-extracted policy criteria remain in a draft/review state until explicitly confirmed and activated by authorized administrators.
- **Synthetic / Demo Data:** Demo application records and test cases are clearly demarcated from official-source information.
- **Production Compliance:** Transitioning to a production deployment requires formal security auditing, STQC compliance, and official Ministry infrastructure onboarding.

---

## 📌 Project Status

**SIH 2026 Prototype — Active Development**

### Implemented & Audited Modules
- [x] Multi-Scheme Management Framework (Pre-Matric, Post-Matric, Top Class, NFST, NOS)
- [x] Versioned Policy Intelligence & Clause Extraction
- [x] Policy Effective-Date Handling & Conflict Resolution Matrix
- [x] Policy Time Travel (Snapshot-based decision reconstruction)
- [x] Policy Change Impact Simulation Sandbox
- [x] Student Application Submission & 16-Stage Lifecycle Tracking
- [x] Document Intelligence & Cross-Document Consistency Checking
- [x] Multi-Stakeholder Workspaces (Student, Institution, State, Ministry, Committee)
- [x] Exception Management Engine (`PASS` / `FAIL` / `REVIEW` / `EXCEPTION`)
- [x] Human Override Governance & Structured Audit Logging
- [x] Grounded RAG Assistant with Clause and Page Citations
- [x] Deployed Backend on Render with PostgreSQL Database

---

## 🏆 Smart India Hackathon 2026

- **Problem Statement ID:** 26239
- **Problem Statement Title:** AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes
- **Ministry:** Ministry of Tribal Affairs, Government of India
- **Category:** Software
- **Theme:** Smart Education

---

## 🔗 Project Links

- 🌐 **Live Platform:** `Vercel deployment URL — to be added after deployment`
- ⚙️ **Backend Service:** [https://tribal-scholarship-and-fellowship.onrender.com/](https://tribal-scholarship-and-fellowship.onrender.com/)
- 📚 **FastAPI Documentation:** [https://tribal-scholarship-and-fellowship.onrender.com/docs](https://tribal-scholarship-and-fellowship.onrender.com/docs)
- ❤️ **Health Endpoint:** [https://tribal-scholarship-and-fellowship.onrender.com/health](https://tribal-scholarship-and-fellowship.onrender.com/health)
- 💻 **GitHub Repository:** [https://github.com/Monriya23/Tribal-Scholarship-and-Fellowship](https://github.com/Monriya23/Tribal-Scholarship-and-Fellowship)

---

## 🌉 SETU

> Connecting Policy • People • Evidence • Decisions • Educational Opportunity

*Built for Smart India Hackathon 2026 — Problem Statement 26239.*
