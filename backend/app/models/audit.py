import datetime
from pydantic import BaseModel
from typing import Dict, Any, Optional

class AuditLogResponse(BaseModel):
    id: str
    timestamp: datetime.datetime
    actor_id: Optional[str] = None
    actor_role: str
    actor_name: str
    action_type: str
    entity_type: str
    target_entity_id: str
    details: str
    before_state: Optional[Dict[str, Any]] = None
    after_state: Optional[Dict[str, Any]] = None
    reason: Optional[str] = None
    ip_address: str

    class Config:
        from_attributes = True
