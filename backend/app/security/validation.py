import re
import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import AuditLog

class SecurityValidator:
    @staticmethod
    def validate_mota_id(mota_id: str) -> bool:
        """Validate format of MoTA Lifetime Student ID."""
        if not mota_id:
            return False
        # Expected pattern: MOTA-ST-XXXX-XXXX or ST-XXXX-XXXX
        return bool(re.match(r'^(?:MOTA-)?ST-[0-9]{4}-[0-9]{4,6}$', mota_id, re.IGNORECASE))

    @staticmethod
    def validate_aishe_code(aishe: str) -> bool:
        """Validate National AISHE institution code (e.g. C-12345, U-0123)."""
        if not aishe:
            return False
        return bool(re.match(r'^[CUS]-[0-9]{4,6}$', aishe.strip(), re.IGNORECASE))

    @staticmethod
    def sanitize_text(text: str) -> str:
        """Basic text sanitization to strip suspicious control characters."""
        if not text:
            return ""
        return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', str(text)).strip()

    @staticmethod
    def log_audit_event(
        db: Session,
        actor_role: str,
        actor_name: str,
        action_type: str,
        entity_type: str,
        target_entity_id: str,
        details: str,
        actor_id: Optional[str] = None,
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        reason: Optional[str] = None,
        ip_address: str = "127.0.0.1"
    ) -> AuditLog:
        """Persist immutable audit trail record."""
        audit = AuditLog(
            actor_id=actor_id,
            actor_role=actor_role,
            actor_name=actor_name,
            action_type=action_type,
            entity_type=entity_type,
            target_entity_id=target_entity_id,
            details=details,
            before_state=before_state,
            after_state=after_state,
            reason=reason,
            ip_address=ip_address,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(audit)
        db.commit()
        return audit
