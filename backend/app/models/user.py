import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLoginRequest(BaseModel):
    identifier: str  # Email or Mobile or MoTA ID
    password: str

class UserRegisterRequest(BaseModel):
    full_name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    password: str
    role: str = "STUDENT"  # STUDENT, INSTITUTION_OFFICER, STATE_OFFICER, MINISTRY_ADMIN, REVIEWER
    institution_id: Optional[str] = None
    state_jurisdiction: Optional[str] = None
    mota_lifetime_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str
    email: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    role: str
    full_name: str
    institution_id: Optional[str] = None
    state_jurisdiction: Optional[str] = None
    student_profile_id: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime
    last_login_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
