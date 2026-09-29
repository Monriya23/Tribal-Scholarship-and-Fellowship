from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import User
from app.security.auth import SecurityAuth

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Extract user if valid Authorization header present, else None."""
    if not authorization:
        return None
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            return None
        payload = SecurityAuth.decode_access_token(token)
        if not payload:
            return None
        user_id = payload.get("sub")
        return db.query(User).filter(User.id == user_id, User.is_active == True).first()
    except Exception:
        return None

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Mandatory current user dependency."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required"
        )
    try:
        parts = authorization.split(" ", 1)
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format. Use 'Bearer <token>'"
            )
        token = parts[1]
        payload = SecurityAuth.decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        user = db.query(User).filter(User.id == payload.get("sub"), User.is_active == True).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account not found or inactive"
            )
        return user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def require_roles(allowed_roles: List[str]):
    """Role-based access control (RBAC) dependency generator."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "MINISTRY_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

def validate_application_access(current_user: Optional[User], application: Any, db: Session) -> bool:
    """
    Enforce Object-Level Authorization (IDOR protection).
    - Students may only access applications belonging to their linked student profile.
    - Institution Officers may only access applications matching their assigned institution AISHE.
    - State Officers may only access applications from students within their state jurisdiction.
    - Ministry Admins have full administrative oversight.
    """
    if not current_user:
        return True  # Public / unauthenticated read if endpoint allows optional auth
    
    if current_user.role == "MINISTRY_ADMIN":
        return True
        
    if current_user.role == "STUDENT":
        if current_user.student_profile_id and application.applicant_id != current_user.student_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You cannot view or modify another student's application record."
            )
        return True
        
    if current_user.role in ["INSTITUTION_OFFICER", "VERIFIER"]:
        if current_user.institution_id and application.institute_aishe != current_user.institution_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Application belongs to AISHE '{application.institute_aishe}', outside your assigned institution '{current_user.institution_id}'."
            )
        return True
        
    if current_user.role in ["STATE_OFFICER", "DWO"]:
        student = getattr(application, "student", None)
        if not student:
            from app.database.models import Student
            student = db.query(Student).filter(Student.id == application.applicant_id).first()
        if student and current_user.state_jurisdiction and student.state != current_user.state_jurisdiction:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Application applicant is from '{student.state}', outside your state jurisdiction '{current_user.state_jurisdiction}'."
            )
        return True
        
    return True

