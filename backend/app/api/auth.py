import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User, Student
from app.models.user import UserLoginRequest, UserRegisterRequest, TokenResponse, UserProfileResponse, ChangePasswordRequest
from app.security.auth import SecurityAuth
from app.security.permissions import get_current_user
from app.security.validation import SecurityValidator

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account (Student, Institution Officer, State Officer, Ministry Admin).
    """
    if not req.email and not req.mobile:
        raise HTTPException(status_code=400, detail="Either email or mobile is required")
        
    if req.email:
        existing_email = db.query(User).filter(User.email == req.email.lower().strip()).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
            
    if req.mobile:
        existing_mobile = db.query(User).filter(User.mobile == req.mobile.strip()).first()
        if existing_mobile:
            raise HTTPException(status_code=400, detail="Mobile already registered")

    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    hashed_pwd = SecurityAuth.hash_password(req.password)
    
    # Check if student profile exists or needs link
    student_profile_id = None
    if req.role == "STUDENT" and req.mota_lifetime_id:
        stu = db.query(Student).filter(Student.mota_lifetime_id == req.mota_lifetime_id).first()
        if stu:
            student_profile_id = stu.id

    new_user = User(
        id=user_id,
        email=req.email.lower().strip() if req.email else None,
        mobile=req.mobile.strip() if req.mobile else None,
        hashed_password=hashed_pwd,
        role=req.role.upper(),
        full_name=req.full_name.strip(),
        institution_id=req.institution_id,
        state_jurisdiction=req.state_jurisdiction,
        student_profile_id=student_profile_id,
        is_active=True,
        created_at=datetime.datetime.utcnow(),
        last_login_at=datetime.datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    SecurityValidator.log_audit_event(
        db=db,
        actor_id=new_user.id,
        actor_role=new_user.role,
        actor_name=new_user.full_name,
        action_type="REGISTER_USER",
        entity_type="USER",
        target_entity_id=new_user.id,
        details=f"User registered with role {new_user.role}"
    )

    token = SecurityAuth.create_access_token(
        user_id=new_user.id,
        role=new_user.role,
        email=new_user.email
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=new_user.id,
        role=new_user.role,
        full_name=new_user.full_name,
        email=new_user.email
    )

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user using email, mobile, or MoTA Student ID.
    """
    ident = req.identifier.strip()
    
    # Query user by email, mobile, or linked student ID
    user = db.query(User).filter(
        (User.email == ident.lower()) | (User.mobile == ident)
    ).first()

    if not user and ident.startswith("ST-") or ident.startswith("MOTA-"):
        stu = db.query(Student).filter(Student.mota_lifetime_id == ident).first()
        if stu and stu.user:
            user = stu.user

    if not user:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    if not SecurityAuth.verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    user.last_login_at = datetime.datetime.utcnow()
    db.commit()

    token = SecurityAuth.create_access_token(
        user_id=user.id,
        role=user.role,
        email=user.email
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
        full_name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Fetch profile of currently authenticated user."""
    return UserProfileResponse.model_validate(current_user)

@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change password for authenticated user."""
    if not SecurityAuth.verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password incorrect")

    current_user.hashed_password = SecurityAuth.hash_password(req.new_password)
    db.commit()
    return {"status": "SUCCESS", "message": "Password changed successfully"}
