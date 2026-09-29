import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import Notification, User

class NotificationService:
    @classmethod
    def send_notification(
        cls,
        db: Session,
        title: str,
        message: str,
        notification_type: str = "SYSTEM",
        user_id: Optional[str] = None,
        recipient_role: Optional[str] = None,
        link_url: Optional[str] = None
    ) -> Notification:
        """Create and persist a user/role notification."""
        notif = Notification(
            user_id=user_id,
            recipient_role=recipient_role,
            title=title,
            message=message,
            notification_type=notification_type,
            is_read=False,
            link_url=link_url,
            created_at=datetime.datetime.utcnow()
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif

    @classmethod
    def notify_deficiency_created(
        cls,
        db: Session,
        student_user_id: Optional[str],
        application_no: str,
        doc_type: str,
        issue_desc: str
    ) -> Optional[Notification]:
        """Notify student of a deficiency requiring rectification."""
        if not student_user_id:
            return None
        return cls.send_notification(
            db=db,
            user_id=student_user_id,
            title=f"Action Required: Deficiency Raised on Application {application_no}",
            message=f"A deficiency was noted on your {doc_type}: {issue_desc}. Please upload a revised document.",
            notification_type="DEFICIENCY",
            link_url=f"/application-status"
        )
