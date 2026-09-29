from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import User, Student
from app.models.user import UserProfileResponse
from app.security.permissions import require_roles, get_current_user

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserProfileResponse])
def list_users(
    role: Optional[str] = None,
    current_user: User = Depends(require_roles(["MINISTRY_ADMIN", "STATE_OFFICER"])),
    db: Session = Depends(get_db)
):
    """List system users (Administrative access)."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role.upper())
    users = query.order_by(User.created_at.desc()).all()
    return [UserProfileResponse.model_validate(u) for u in users]

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_detail(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user details by ID."""
    if current_user.id != user_id and current_user.role not in ["MINISTRY_ADMIN", "STATE_OFFICER"]:
        raise HTTPException(status_code=403, detail="Not authorized to view other users")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfileResponse.model_validate(user)
