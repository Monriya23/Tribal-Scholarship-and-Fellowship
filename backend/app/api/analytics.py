import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Application, Source, SourceDocument, PolicyClaim, Grievance

router = APIRouter(prefix="/analytics", tags=["Real Telemetry & Analytics"])

@router.get("/dashboard-kpis")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    """
    Returns authentic dashboard KPIs calculated directly from the database.
    Every metric defines its source, calculation formula, and timestamp.
    No fabricated or mock numbers are ever returned.
    """
    total_apps = db.query(Application).count()
    in_verification = db.query(Application).filter(Application.current_stage != "REGISTRATION").count()
    deficient_apps = db.query(Application).filter(Application.current_stage == "DEFICIENT").count()
    approved_apps = db.query(Application).filter(Application.status == "APPROVED").count()
    total_sources = db.query(Source).count()
    connected_sources = db.query(Source).filter(Source.status == "CONNECTED").count()
    indexed_docs = db.query(SourceDocument).count()
    total_policy_claims = db.query(PolicyClaim).count()
    approved_claims = db.query(PolicyClaim).filter(PolicyClaim.review_status.in_(["APPROVED", "ACTIVE"])).count()
    pending_claims = db.query(PolicyClaim).filter(PolicyClaim.review_status.in_(["DETECTED", "UNDER_REVIEW"])).count()
    total_grievances = db.query(Grievance).count()
    
    now_iso = datetime.datetime.utcnow().isoformat()
    
    return {
        "timestamp": now_iso,
        "kpis": [
            {
                "id": "total_applications",
                "label": "Total Applications Submitted",
                "value": total_apps,
                "badge": "USER SUBMITTED",
                "source": "Application Database",
                "calculation": "COUNT(applications.id)",
                "last_updated": now_iso
            },
            {
                "id": "in_verification",
                "label": "In Verification Pipeline",
                "value": in_verification,
                "badge": "SYSTEM CALCULATED",
                "source": "Workflow Engine",
                "calculation": "COUNT(applications.id WHERE stage != 'REGISTRATION')",
                "last_updated": now_iso
            },
            {
                "id": "deficient_count",
                "label": "Deficiencies Pending Resolution",
                "value": deficient_apps,
                "badge": "SYSTEM CALCULATED",
                "source": "Deficiency Ledger",
                "calculation": "COUNT(applications.id WHERE stage = 'DEFICIENT')",
                "last_updated": now_iso
            },
            {
                "id": "official_sources_connected",
                "label": "Official Public Sources Connected",
                "value": f"{connected_sources} / {total_sources}",
                "badge": "OFFICIAL SOURCE",
                "source": "Source Registry",
                "calculation": "COUNT(sources.id WHERE status = 'CONNECTED')",
                "last_updated": now_iso
            },
            {
                "id": "indexed_documents",
                "label": "Official Guidelines & Circulars Indexed",
                "value": indexed_docs,
                "badge": "OFFICIAL SOURCE",
                "source": "Document Repository",
                "calculation": "COUNT(source_documents.id)",
                "last_updated": now_iso
            },
            {
                "id": "approved_policy_rules",
                "label": "Active Approved Policy Rules",
                "value": approved_claims,
                "badge": "HUMAN VERIFIED",
                "source": "Policy Claim Ledger",
                "calculation": "COUNT(policy_claims.id WHERE review_status IN ('APPROVED', 'ACTIVE'))",
                "last_updated": now_iso
            },
            {
                "id": "pending_policy_reviews",
                "label": "Policy Claims Pending Human Approval",
                "value": pending_claims,
                "badge": "AI EXTRACTED",
                "source": "Policy Review Queue",
                "calculation": "COUNT(policy_claims.id WHERE review_status IN ('DETECTED', 'UNDER_REVIEW'))",
                "last_updated": now_iso
            }
        ]
    }
