from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class SyncTriggerRequest(BaseModel):
    source_id: Optional[str] = None  # If None, sync all sources
    force_refetch: bool = False

class SyncLogResponse(BaseModel):
    id: str
    source_id: str
    source_name: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str
    pages_checked: int
    documents_found: int
    documents_changed: int
    documents_failed: int
    error_message: Optional[str] = None
    log_details: List[Any] = []

    class Config:
        from_attributes = True

class SyncOverviewResponse(BaseModel):
    connected_sources_count: int
    total_sources_count: int
    indexed_documents_count: int
    detected_changes_count: int
    pending_reviews_count: int
    active_conflicts_count: int
    last_sync_timestamp: Optional[datetime] = None
    recent_logs: List[SyncLogResponse] = []
