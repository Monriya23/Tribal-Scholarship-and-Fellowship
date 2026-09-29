import difflib
import datetime
from sqlalchemy.orm import Session
from app.database.models import SourceDocument, SourceDocumentVersion

class ChangeDetectorService:
    @staticmethod
    def detect_and_version(
        db: Session,
        document_id: str,
        new_content_hash: str,
        new_extracted_text: str,
        raw_location: str = None
    ) -> dict:
        doc = db.query(SourceDocument).filter(SourceDocument.id == document_id).first()
        if not doc:
            return {"status": "NOT_FOUND", "changed": False}

        # Check if content hash is identical
        if doc.content_hash == new_content_hash:
            return {
                "status": "NO_CHANGE",
                "changed": False,
                "current_version": doc.version,
                "message": "Content hash matches existing version."
            }

        # Content changed! Calculate diff
        old_text = doc.extracted_text or ""
        diff = list(difflib.unified_diff(
            old_text.splitlines(keepends=True),
            new_extracted_text.splitlines(keepends=True),
            fromfile=f"Version_{doc.version}",
            tofile=f"Version_{doc.version + 1}",
            n=3
        ))
        diff_summary = "".join(diff[:50])  # First 50 lines of diff
        if len(diff) > 50:
            diff_summary += f"\n... [{len(diff) - 50} more diff lines]"

        # Preserve the old version in versions table
        old_version = SourceDocumentVersion(
            id=f"{doc.id}_v{doc.version}",
            document_id=doc.id,
            version_number=doc.version,
            content_hash=doc.content_hash,
            raw_content_location=doc.raw_content_location,
            extracted_text=doc.extracted_text,
            change_summary=f"Superseded by Version {doc.version + 1} on {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
            created_at=doc.fetched_at
        )
        db.add(old_version)

        # Update document to new version
        new_version_num = doc.version + 1
        doc.version = new_version_num
        doc.content_hash = new_content_hash
        doc.extracted_text = new_extracted_text
        doc.raw_content_location = raw_location
        doc.fetched_at = datetime.datetime.utcnow()

        db.commit()
        db.refresh(doc)

        return {
            "status": "CHANGE_DETECTED",
            "changed": True,
            "previous_version": doc.version - 1,
            "new_version": doc.version,
            "diff_summary": diff_summary
        }
