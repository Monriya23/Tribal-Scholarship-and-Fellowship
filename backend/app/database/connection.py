from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# SQLite connection args for multi-thread access
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    import app.database.models  # Ensure models are registered
    Base.metadata.create_all(bind=engine)
    
    # Safe SQLite auto-migration helper for schema evolutions
    if settings.DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            # 1. schemes table
            if "schemes" in tables:
                cols = [c["name"] for c in inspector.get_columns("schemes")]
                if "selection_method" not in cols:
                    conn.execute(text("ALTER TABLE schemes ADD COLUMN selection_method VARCHAR DEFAULT 'MERIT_RANKING'"))
                if "workflow_definition" not in cols:
                    conn.execute(text("ALTER TABLE schemes ADD COLUMN workflow_definition JSON DEFAULT '{}'"))

            # 2. scheme_versions table
            if "scheme_versions" in tables:
                cols = [c["name"] for c in inspector.get_columns("scheme_versions")]
                if "effective_from" not in cols:
                    conn.execute(text("ALTER TABLE scheme_versions ADD COLUMN effective_from VARCHAR"))
                if "effective_to" not in cols:
                    conn.execute(text("ALTER TABLE scheme_versions ADD COLUMN effective_to VARCHAR"))
                if "status" not in cols:
                    conn.execute(text("ALTER TABLE scheme_versions ADD COLUMN status VARCHAR DEFAULT 'ACTIVE'"))
                if "required_documents" not in cols:
                    conn.execute(text("ALTER TABLE scheme_versions ADD COLUMN required_documents JSON DEFAULT '[]'"))

            # 3. users table
            if "users" in tables:
                cols = [c["name"] for c in inspector.get_columns("users")]
                if "student_profile_id" not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN student_profile_id VARCHAR"))
                if "institution_id" not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN institution_id VARCHAR"))
                if "state_jurisdiction" not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN state_jurisdiction VARCHAR"))

            # 4. students table
            if "students" in tables:
                cols = [c["name"] for c in inspector.get_columns("students")]
                if "father_name" not in cols:
                    conn.execute(text("ALTER TABLE students ADD COLUMN father_name VARCHAR"))
                if "mother_name" not in cols:
                    conn.execute(text("ALTER TABLE students ADD COLUMN mother_name VARCHAR"))
                if "domicile_state" not in cols:
                    conn.execute(text("ALTER TABLE students ADD COLUMN domicile_state VARCHAR"))
                if "annual_family_income" not in cols:
                    conn.execute(text("ALTER TABLE students ADD COLUMN annual_family_income FLOAT"))
                if "academic_history" not in cols:
                    conn.execute(text("ALTER TABLE students ADD COLUMN academic_history JSON DEFAULT '[]'"))

            # 5. applications table
            if "applications" in tables:
                cols = [c["name"] for c in inspector.get_columns("applications")]
                if "scheme_version_id" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN scheme_version_id VARCHAR"))
                if "academic_year" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN academic_year VARCHAR DEFAULT '2025-26'"))
                if "access_mode" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN access_mode VARCHAR DEFAULT 'SELF_SERVICE'"))
                if "assisted_by" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN assisted_by VARCHAR"))
                if "assisted_institution_id" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN assisted_institution_id VARCHAR"))
                if "consent_record" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN consent_record JSON DEFAULT '{}'"))
                if "original_grade_type" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN original_grade_type VARCHAR DEFAULT 'PERCENTAGE'"))
                if "original_grade_value" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN original_grade_value VARCHAR DEFAULT ''"))
                if "normalized_percentage" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN normalized_percentage FLOAT"))
                if "normalization_method" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN normalization_method VARCHAR"))
                if "normalization_source" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN normalization_source VARCHAR"))
                if "is_draft" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN is_draft BOOLEAN DEFAULT 0"))
                if "draft_data" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN draft_data JSON DEFAULT '{}'"))
                if "updated_at" not in cols:
                    conn.execute(text("ALTER TABLE applications ADD COLUMN updated_at DATETIME"))

            # 6. application_documents table
            if "application_documents" in tables:
                cols = [c["name"] for c in inspector.get_columns("application_documents")]
                if "file_hash" not in cols:
                    conn.execute(text("ALTER TABLE application_documents ADD COLUMN file_hash VARCHAR"))
                if "mime_type" not in cols:
                    conn.execute(text("ALTER TABLE application_documents ADD COLUMN mime_type VARCHAR DEFAULT 'application/pdf'"))
                if "is_readable" not in cols:
                    conn.execute(text("ALTER TABLE application_documents ADD COLUMN is_readable BOOLEAN DEFAULT 1"))
                if "quality_notes" not in cols:
                    conn.execute(text("ALTER TABLE application_documents ADD COLUMN quality_notes TEXT"))
                if "provenance_category" not in cols:
                    conn.execute(text("ALTER TABLE application_documents ADD COLUMN provenance_category VARCHAR DEFAULT 'USER_SUBMITTED'"))

            # 7. deficiencies table
            if "deficiencies" in tables:
                cols = [c["name"] for c in inspector.get_columns("deficiencies")]
                if "document_id" not in cols:
                    conn.execute(text("ALTER TABLE deficiencies ADD COLUMN document_id VARCHAR"))
                if "officer_role" not in cols:
                    conn.execute(text("ALTER TABLE deficiencies ADD COLUMN officer_role VARCHAR DEFAULT 'INSTITUTION_OFFICER'"))
                if "issue_type" not in cols:
                    conn.execute(text("ALTER TABLE deficiencies ADD COLUMN issue_type VARCHAR DEFAULT 'CORRECTION_REQUIRED'"))
                if "resubmitted_at" not in cols:
                    conn.execute(text("ALTER TABLE deficiencies ADD COLUMN resubmitted_at DATETIME"))
                if "resolved_by" not in cols:
                    conn.execute(text("ALTER TABLE deficiencies ADD COLUMN resolved_by VARCHAR"))

            conn.commit()
