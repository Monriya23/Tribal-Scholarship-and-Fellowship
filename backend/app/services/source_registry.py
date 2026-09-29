import datetime
from sqlalchemy.orm import Session
from app.database.models import Source
from app.config import settings

INITIAL_OFFICIAL_SOURCES = [
    {
        "id": "src_mota_portal",
        "name": "Ministry of Tribal Affairs (MoTA) Main Portal",
        "organization": "Ministry of Tribal Affairs, Government of India",
        "base_url": "https://tribal.gov.in/",
        "source_type": "OFFICIAL_PORTAL",
        "active": True,
        "robots_status": "ALLOWED"
    },
    {
        "id": "src_nsp_portal",
        "name": "National Scholarship Portal (NSP - MoTA Schemes)",
        "organization": "National Informatics Centre (NIC) / MoTA",
        "base_url": "https://scholarships.gov.in/",
        "source_type": "NSP",
        "active": True,
        "robots_status": "ALLOWED"
    },
    {
        "id": "src_fellowship_portal",
        "name": "National Fellowship for ST Students Portal",
        "organization": "Ministry of Tribal Affairs, Government of India",
        "base_url": "https://fellowship.tribal.gov.in/",
        "source_type": "OFFICIAL_PORTAL",
        "active": True,
        "robots_status": "ALLOWED"
    },
    {
        "id": "src_overseas_portal",
        "name": "National Overseas Scholarship (NOS) Portal",
        "organization": "Ministry of Tribal Affairs, Government of India",
        "base_url": "https://overseas.tribal.gov.in/",
        "source_type": "OFFICIAL_PORTAL",
        "active": True,
        "robots_status": "ALLOWED"
    }
]

class SourceRegistryService:
    @staticmethod
    def ensure_initial_sources(db: Session):
        for src_data in INITIAL_OFFICIAL_SOURCES:
            existing = db.query(Source).filter(Source.id == src_data["id"]).first()
            if not existing:
                src = Source(
                    id=src_data["id"],
                    name=src_data["name"],
                    organization=src_data["organization"],
                    base_url=src_data["base_url"],
                    source_type=src_data["source_type"],
                    active=src_data["active"],
                    robots_status=src_data["robots_status"],
                    status="CONNECTED",
                    last_checked_at=datetime.datetime.utcnow(),
                    last_success_at=datetime.datetime.utcnow()
                )
                db.add(src)
        db.commit()

    @staticmethod
    def get_all_sources(db: Session):
        return db.query(Source).all()

    @staticmethod
    def get_source_by_id(db: Session, source_id: str):
        return db.query(Source).filter(Source.id == source_id).first()

    @staticmethod
    def update_source_status(db: Session, source_id: str, status: str, error_message: str = None, success: bool = False):
        src = db.query(Source).filter(Source.id == source_id).first()
        if src:
            src.status = status
            src.last_checked_at = datetime.datetime.utcnow()
            if success:
                src.last_success_at = datetime.datetime.utcnow()
                src.error_message = None
            else:
                src.error_message = error_message
            db.commit()
            db.refresh(src)
        return src
