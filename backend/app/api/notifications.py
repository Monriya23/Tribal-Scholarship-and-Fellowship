import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database.connection import get_db
from app.database.models import Notification, User
from app.security.permissions import get_current_user

router = APIRouter(prefix="/notifications", tags=["User Notifications"])

class NotificationItem(BaseModel):
    id: str
    user_id: Optional[str] = None
    recipient_role: Optional[str] = None
    title: str
    message: str
    notification_type: str
    is_read: bool
    read_at: Optional[datetime.datetime] = None
    link_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

@router.get("", response_model=List[NotificationItem])
def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List notifications for authenticated user."""
    notifs = db.query(Notification).filter(
        (Notification.user_id == current_user.id) | (Notification.recipient_role == current_user.role)
    ).order_by(Notification.created_at.desc()).all()
    return [NotificationItem.model_validate(n) for n in notifs]

@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.is_read = True
    notif.read_at = datetime.datetime.utcnow()
    db.commit()
    return {"status": "SUCCESS", "notification_id": notif.id}
