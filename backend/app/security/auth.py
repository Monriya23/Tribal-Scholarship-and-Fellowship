import hashlib
import hmac
import json
import base64
import time
import secrets
from typing import Optional, Dict, Any
from app.config import settings

SECRET_KEY = getattr(settings, "SECRET_KEY", "mota-tribal-scholarship-secure-key-2026-sih")
TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7  # 7 days

class SecurityAuth:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using PBKDF2-HMAC-SHA256 with a unique random salt."""
        salt = secrets.token_hex(16)
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return f"{salt}${key.hex()}"

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Verify plain password against PBKDF2 salt$hash format."""
        try:
            salt, key_hex = hashed_password.split('$')
            expected_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return hmac.compare_digest(expected_key.hex(), key_hex)
        except Exception:
            return False

    @staticmethod
    def create_access_token(user_id: str, role: str, email: Optional[str] = None, extra_data: Optional[Dict[str, Any]] = None) -> str:
        """Generate a cryptographically signed URL-safe JWT-like token using HMAC-SHA256."""
        header = {"alg": "HS256", "typ": "JWT"}
        payload = {
            "sub": user_id,
            "role": role,
            "email": email or "",
            "iat": int(time.time()),
            "exp": int(time.time()) + TOKEN_EXPIRY_SECONDS
        }
        if extra_data:
            payload.update(extra_data)

        header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).decode('utf-8').rstrip("=")
        payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8').rstrip("=")
        
        signature = hmac.new(
            SECRET_KEY.encode('utf-8'),
            f"{header_b64}.{payload_b64}".encode('utf-8'),
            hashlib.sha256
        ).digest()
        sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip("=")

        return f"{header_b64}.{payload_b64}.{sig_b64}"

    @staticmethod
    def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify signature and decode payload from token."""
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return None
            header_b64, payload_b64, sig_b64 = parts

            # Re-compute signature
            signature = hmac.new(
                SECRET_KEY.encode('utf-8'),
                f"{header_b64}.{payload_b64}".encode('utf-8'),
                hashlib.sha256
            ).digest()
            expected_sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip("=")

            if not hmac.compare_digest(sig_b64, expected_sig_b64):
                return None

            # Add padding back
            padded_payload = payload_b64 + "=" * (-len(payload_b64) % 4)
            payload_json = base64.urlsafe_b64decode(padded_payload).decode('utf-8')
            payload = json.loads(payload_json)

            # Check expiration
            if payload.get("exp", 0) < int(time.time()):
                return None

            return payload
        except Exception:
            return None
