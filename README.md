# 🏛️ MoTA AI-Enabled Official Scholarship & Fellowship Management System
### *National Digital Public Infrastructure (DPI) for Scheduled Tribe Scholars*
**Ministry of Tribal Affairs (MoTA), Government of India**

---

## 📌 Mission Statement & System Disclosure

> [!IMPORTANT]
> **Authentic Official Data Architecture**:
> This platform uses **genuinely public, official government sources** (gazettes, scheme circulars, and public portals) for policy intelligence, rule formulation, and grounded RAG answering.
> 
> Private applicant and beneficiary data is collected **only through direct user submission** via smart application forms or authorized institutional channels. 
> The system **never fabricates government statistics, beneficiary numbers, or policy rules**, and strictly respects access controls, `robots.txt`, and rate limits without scraping restricted areas.

---

## 🏗️ Architecture & Data Ingestion Flow

```
[ OFFICIAL PUBLIC SOURCES ]
   • MoTA Portal (tribal.gov.in)
   • National Scholarship Portal (scholarships.gov.in)
   • National Fellowship Portal (fellowship.tribal.gov.in)
   • National Overseas Scholarship Portal (overseas.tribal.gov.in)
                 │
                 ▼
[ FASTAPI INGESTION BACKEND ]
   • WebPageConnector / PDFConnector / StaticDocumentConnector
   • HTML Parser & BeautifulSoup Sanitizer
   • PDFExtractor (Page-by-page Chunking & SHA-256 Checksum)
                 │
                 ▼
[ CHANGE DETECTION & VERSIONING ]
   • Hash Comparison (v1 -> v2)
   • Unified Text Diff & Change Summaries
                 │
                 ▼
[ AI POLICY CLAIM EXTRACTION ]
   • Extraction of Formal Criteria (Income <= 2.5L / Marks >= 55% / Age <= 36)
   • Exact Source, Document Title & Page Attribution
                 │
                 ▼
[ HUMAN POLICY REVIEW QUEUE ]
   • Authorized Officer Approval / Rejection Workflow
   • Conflict Detection & Resolution Matrix
                 │
                 ▼
[ ACTIVE RULE ENGINE & RAG ]
   • Grounded RAG with exact clause citations
   • Deterministic Application Evaluation
                 │
                 ▼
[ REAL USER SUBMISSIONS & DOSSIER ]
   • Student Document OCR & Readability Check
   • End-to-End Provenance: Source -> Rule -> Application -> Decision
```

---

## 🌐 Configured Official Government Sources

| Source Name | Organization | Base URL | Access Protocol |
| :--- | :--- | :--- | :--- |
| **Ministry of Tribal Affairs (Main Portal)** | Ministry of Tribal Affairs, GoI | `https://tribal.gov.in/` | Public HTTP / HTTPS |
| **National Scholarship Portal (NSP)** | NIC & Ministry of Tribal Affairs | `https://scholarships.gov.in/` | Public Scheme Circulars |
| **National Fellowship Portal (NFST)** | Ministry of Tribal Affairs, GoI | `https://fellowship.tribal.gov.in/` | Public Guidelines & Circulars |
| **National Overseas Scholarship (NOS)** | Ministry of Tribal Affairs, GoI | `https://overseas.tribal.gov.in/` | Public Guidelines & Notices |

---

## 👥 Multi-Role Stakeholder Desks (5 Personas)

1. **🎓 Student / Applicant**: Lifetime Digital Case File, Scheme Discovery with Real-Time Precheck, Smart Dynamic Application Form, AI Document Upload Sandbox, Application Timeline (16 Stages), Structured Deficiency Resolution, DBT/PFMS Payment Tracker, Fellowship Lifecycle (Quarterly Reports & Upgradation), Grievance Redressal Portal.
2. **🏫 Institution Nodal Officer**: AISHE Institute Scrutiny Queue, Side-by-side Officer Verification Dossier with OCR discrepancy alerts, One-click structured deficiency notice issuer.
3. **🏛️ State / UT Tribal Welfare Department**: State Command Center, District-wise application funnel, Institution backlog radar, SOE / UC submission tracker.
4. **🇮🇳 Ministry / MoTA National Command**: Nationwide KPI telemetry, Dynamic Scheme & Rule Builder, Immutable Audit Trail ledger, National Policy Conflict review.
5. **🔬 Expert Selection Committee**: Side-by-side Candidate Comparison Matrix, Research Proposal scoring, QS World University Ranking evaluation.

---

## 🏷️ Standard Data Source Badges

To provide complete transparency to officials and evaluators, all displayed information is tagged with standard provenance badges:

- `[OFFICIAL SOURCE]`: Directly extracted from verified, indexed government documents and circulars.
- `[USER SUBMITTED]`: Directly entered or uploaded by an applicant.
- `[AI EXTRACTED]`: Extracted by OCR or AI text parsing and pending human review.
- `[HUMAN VERIFIED]`: Reviewed and confirmed by an authorized nodal officer or policy admin.
- `[SYSTEM CALCULATED]`: Dynamically calculated from database records (e.g. `COUNT(applications.id)`).

---

## 🚀 Running the Platform Locally

### 1. Prerequisites
- Node.js (v18+)
- Python (3.11+)

### 2. Backend (FastAPI Data Layer)
```bash
# Navigate to project root
cd "c:/TRIBAL SCHOLARSHIP AND FELLOWSHIP"

# Install Python requirements
pip install -r backend/requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```
*FastAPI Interactive Docs available at:* `http://127.0.0.1:8000/docs`

### 3. Frontend (React + TypeScript + Vite)
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend Portal available at:* `http://localhost:5173/`

---

## 📋 Demonstrating the Complete End-to-End Flow

1. **Step 1 — Official Data Intelligence**: Open **Source Status Dashboard** (`Platform Architecture` tab or header).
2. **Step 2 — Trigger Live Sync**: Click **[Sync Official Sources]** to trigger the backend ingestion engine.
3. **Step 3 — Inspect Extracted Policy Claims**: Navigate to the **Policy Review Queue** tab to view AI-extracted rules with exact document and page references.
4. **Step 4 — Human Officer Approval**: Click **[Approve]** on a policy claim to make it an active rule in the deterministic Rule Engine.
5. **Step 5 — Query Grounded RAG**: Open the **Official RAG Assistant** and ask a policy question (e.g. *"What is the family income limit for the National Overseas Scholarship?"*). Note the zero-hallucination grounded citation with document title and page number.
6. **Step 6 — Submit Real Application**: Navigate to **Apply (Smart Form)** as a Student and submit an application.
7. **Step 7 — Officer Verification Dossier**: Switch to the **Institution Nodal Officer** role and open the **AI Verification Dossier** to see the full audit chain: `OFFICIAL SOURCE -> RULE -> APPLICATION -> DECISION`.

---

## ⚠️ Limitations & Unsupported Integrations Disclosure

- **PFMS Direct Bank Push**: Currently labeled `Integration Ready`; actual fund transfer requires authorized Government VPN & PFMS Digital Signature Tokens (DSC).
- **DigiLocker Direct OAuth**: Configured for standard DigiLocker DocID schema; production integration requires official CCA-issued SSL certificates and government API gateway credentials.
- **NSP Core API**: Real public circulars and scheme notices are scraped/ingested; private applicant records from NSP are not scraped.
