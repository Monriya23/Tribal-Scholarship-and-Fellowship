import datetime
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.database.models import Application, ApplicationStatusHistory, Scheme, Student
from app.security.validation import SecurityValidator

class ApplicationWorkflowEngine:
    """
    Application Lifecycle State Machine & Workflow Engine.
    Enforces valid stage transitions, assisted applications, and readable Application IDs.
    """
    
    VALID_TRANSITIONS: Dict[str, List[str]] = {
        "DRAFT": ["SUBMITTED", "CLOSED"],
        "SUBMITTED": ["DOCUMENT_VERIFICATION", "INSTITUTION_VERIFICATION", "DEFICIENCY", "CLOSED"],
        "DOCUMENT_VERIFICATION": ["INSTITUTION_VERIFICATION", "DEFICIENCY", "ELIGIBILITY_REVIEW", "REJECTED"],
        "DEFICIENCY": ["RESUBMITTED", "CLOSED"],
        "RESUBMITTED": ["DOCUMENT_VERIFICATION", "INSTITUTION_VERIFICATION", "ELIGIBILITY_REVIEW"],
        "INSTITUTION_VERIFICATION": ["ELIGIBILITY_REVIEW", "DEFICIENCY", "REJECTED"],
        "ELIGIBILITY_REVIEW": ["SELECTION", "APPROVED", "DEFICIENCY", "REJECTED", "NOT_SELECTED"],
        "SELECTION": ["APPROVED", "NOT_SELECTED", "AWARD", "WAITLISTED"],
        "APPROVED": ["AWARD", "PAYMENT_PROCESSING", "CLOSED"],
        "NOT_SELECTED": ["CLOSED"],
        "AWARD": ["PAYMENT_PROCESSING", "CLOSED"],
        "PAYMENT_PROCESSING": ["PAYMENT_RELEASED", "DEFICIENCY", "CLOSED"],
        "PAYMENT_RELEASED": ["RENEWAL", "COMPLETED", "CLOSED"],
        "RENEWAL": ["DOCUMENT_VERIFICATION", "INSTITUTION_VERIFICATION", "ELIGIBILITY_REVIEW"],
        "COMPLETED": ["CLOSED"],
        "CLOSED": []
    }

    @classmethod
    def generate_application_number(cls, db: Session, academic_year: str = "2026") -> str:
        """
        Generate guaranteed unique, readable application number: TSF-2026-XXXXXX
        """
        year = academic_year.split("-")[0] if "-" in academic_year else academic_year
        count = db.query(Application).count() + 1
        seq = str(count).zfill(6)
        app_no = f"TSF-{year}-{seq}"
        
        # Guard against collision
        while db.query(Application).filter(Application.application_no == app_no).first() is not None:
            count += 1
            seq = str(count).zfill(6)
            app_no = f"TSF-{year}-{seq}"
            
        return app_no

    @classmethod
    def validate_transition(cls, current_stage: str, target_stage: str) -> Tuple[bool, str]:
        """Validate whether state machine allows moving from current_stage to target_stage."""
        cur = current_stage.upper().strip()
        tgt = target_stage.upper().strip()
        
        if cur == tgt:
            return True, "No stage change"
            
        allowed = cls.VALID_TRANSITIONS.get(cur, [])
        if tgt not in allowed:
            return False, f"Invalid transition: Cannot move application directly from '{cur}' to '{tgt}'. Allowed next stages: {', '.join(allowed) if allowed else 'None (Terminal State)'}"
            
        return True, "Transition allowed"

    @classmethod
    def transition_application_stage(
        cls,
        db: Session,
        application: Application,
        target_stage: str,
        actor_id: str,
        actor_role: str,
        actor_name: str,
        reason: Optional[str] = None,
        target_status: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: str = "127.0.0.1"
    ) -> Application:
        """
        Execute stage transition, log status history, and record audit event.
        """
        is_valid, msg = cls.validate_transition(application.current_stage, target_stage)
        if not is_valid:
            raise ValueError(msg)

        before_stage = application.current_stage
        before_status = application.status
        
        new_status = target_status or target_stage
        
        application.current_stage = target_stage
        application.status = new_status
        application.updated_at = datetime.datetime.utcnow()
        
        # History
        history = ApplicationStatusHistory(
            application_id=application.id,
            from_stage=before_stage,
            to_stage=target_stage,
            from_status=before_status,
            to_status=new_status,
            action_by=actor_name,
            actor_role=actor_role,
            reason=reason or f"Application transitioned to {target_stage}",
            metadata_json=metadata or {},
            timestamp=datetime.datetime.utcnow()
        )
        db.add(history)
        
        # Audit Log
        SecurityValidator.log_audit_event(
            db=db,
            actor_id=actor_id,
            actor_role=actor_role,
            actor_name=actor_name,
            action_type="STAGE_TRANSITION",
            entity_type="APPLICATION",
            target_entity_id=application.id,
            details=f"Stage transitioned from {before_stage} to {target_stage}",
            before_state={"stage": before_stage, "status": before_status},
            after_state={"stage": target_stage, "status": new_status},
            reason=reason,
            ip_address=ip_address
        )
        
        db.commit()
        db.refresh(application)
        return application

    @classmethod
    def check_duplicate_application(
        cls,
        db: Session,
        applicant_id: str,
        scheme_id: str,
        academic_year: str,
        exclude_app_id: Optional[str] = None
    ) -> Optional[Application]:
        """
        Detect duplicate application for same student + scheme + academic year.
        """
        query = db.query(Application).filter(
            Application.applicant_id == applicant_id,
            Application.scheme_id == scheme_id,
            Application.academic_year == academic_year,
            Application.status.notin_(["DRAFT", "CLOSED", "REJECTED"])
        )
        if exclude_app_id:
            query = query.filter(Application.id != exclude_app_id)
            
        return query.first()
