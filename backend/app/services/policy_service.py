import datetime
import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import (
    Policy, PolicyClause, PolicyRule, PolicySnapshot, 
    PolicySimulation, PolicyException, PolicyConflict, 
    Scheme, Application, Student, ApplicationDocument, AuditLog
)
from app.models.policy import (
    PolicyCreateRequest, PolicySimulationRequest, 
    PolicySnapshotCreateRequest, HumanOverrideRequest
)

class PolicyService:
    @staticmethod
    def get_applicable_policy(db: Session, scheme_id: str, target_date: Optional[datetime.datetime] = None) -> Optional[Policy]:
        """
        Effective-Date Engine: Determines which Policy version applies
        to an application based on its submission or evaluation date.
        """
        if not target_date:
            target_date = datetime.datetime.utcnow()

        # 1. Search for a policy where effective_from <= target_date and (effective_to is None or effective_to >= target_date)
        policies = db.query(Policy).filter(
            Policy.scheme_id == scheme_id,
            Policy.status.in_(["ACTIVE", "APPROVED", "SUPERSEDED"])
        ).order_by(Policy.effective_from.desc()).all()

        for pol in policies:
            eff_from = pol.effective_from
            eff_to = pol.effective_to
            if eff_from <= target_date:
                if eff_to is None or eff_to >= target_date:
                    return pol

        # 2. Fallback to current ACTIVE policy
        active_pol = db.query(Policy).filter(
            Policy.scheme_id == scheme_id,
            Policy.status == "ACTIVE"
        ).first()

        return active_pol

    @staticmethod
    def create_policy_version(db: Session, req: PolicyCreateRequest, actor_name: str = "Authorized Officer") -> Policy:
        """
        Policy Versioning: Creates a new policy version without overwriting previous versions.
        Optionally supersedes previous active version.
        """
        policy_id = f"pol_{uuid.uuid4().hex[:10]}"
        eff_from = req.effective_from or datetime.datetime.utcnow()

        # If supersedes, update previous version
        if req.supersedes_policy_version:
            prev = db.query(Policy).filter(
                Policy.scheme_id == req.scheme_id,
                Policy.version == req.supersedes_policy_version
            ).first()
            if prev:
                prev.status = "SUPERSEDED"
                prev.effective_to = eff_from
                prev.notes = (prev.notes or "") + f" [Superseded by {req.version} on {eff_from.strftime('%Y-%m-%d')}]"

        new_policy = Policy(
            id=policy_id,
            scheme_id=req.scheme_id,
            policy_name=req.policy_name,
            policy_type=req.policy_type,
            version=req.version,
            status="DRAFT",
            effective_from=eff_from,
            effective_to=req.effective_to,
            publication_date=req.publication_date or datetime.date.today().strftime("%d %b %Y"),
            source_title=req.source_title,
            source_url=req.source_url,
            source_document_id=req.source_document_id,
            source_page=req.source_page,
            supersedes_policy_version=req.supersedes_policy_version,
            notes=req.notes,
            created_at=datetime.datetime.utcnow()
        )
        db.add(new_policy)

        # Create clauses and rules
        for clause_req in req.clauses:
            clause_id = f"cls_{uuid.uuid4().hex[:8]}"
            clause = PolicyClause(
                id=clause_id,
                policy_id=policy_id,
                section=clause_req.section,
                heading=clause_req.heading,
                original_text=clause_req.original_text,
                normalized_text=clause_req.normalized_text or clause_req.original_text,
                source_page=clause_req.source_page or req.source_page,
                source_reference=clause_req.source_reference,
                effective_date=clause_req.effective_date or req.publication_date,
                created_at=datetime.datetime.utcnow()
            )
            db.add(clause)

            for rule_req in clause_req.rules:
                rule_id = f"{req.scheme_id[:4].upper()}-{rule_req.rule_type[:4].upper()}-{uuid.uuid4().hex[:4].upper()}"
                rule = PolicyRule(
                    id=rule_id,
                    clause_id=clause_id,
                    policy_id=policy_id,
                    rule_type=rule_req.rule_type,
                    field=rule_req.field,
                    operator=rule_req.operator,
                    value=rule_req.value,
                    unit=rule_req.unit,
                    condition=rule_req.condition,
                    action=rule_req.action,
                    priority=rule_req.priority,
                    effective_from=rule_req.effective_from or req.publication_date,
                    effective_to=rule_req.effective_to,
                    source_reference=rule_req.source_reference,
                    status="ACTIVE",
                    created_at=datetime.datetime.utcnow()
                )
                db.add(rule)

        # Log to Audit
        audit = AuditLog(
            id=f"aud_{uuid.uuid4().hex[:10]}",
            actor_name=actor_name,
            actor_role="MINISTRY_ADMIN",
            action_type="CREATE_POLICY_VERSION",
            entity_type="POLICY",
            target_entity_id=policy_id,
            details=f"Created policy {req.policy_name} version {req.version} for scheme {req.scheme_id}",
            after_state={"version": req.version, "status": "DRAFT", "effective_from": str(eff_from)}
        )
        db.add(audit)

        db.commit()
        db.refresh(new_policy)
        return new_policy

    @staticmethod
    def evaluate_rules_with_provenance(
        db: Session, 
        policy_id: str, 
        applicant_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Rule Engine with Provenance:
        Evaluates active rules under a specific policy version and returns
        structured rule-by-rule results with exact official source reference.
        """
        rules = db.query(PolicyRule).filter(
            PolicyRule.policy_id == policy_id,
            PolicyRule.status == "ACTIVE"
        ).order_by(PolicyRule.priority.asc()).all()

        results = []
        overall_status = "PASS"

        for r in rules:
            field_name = r.field
            operator = r.operator
            expected_val = r.value
            actual_val = applicant_data.get(field_name)

            passed = False
            explanation = ""

            if actual_val is None:
                passed = False
                explanation = f"Required field '{field_name}' not provided in applicant data."
            else:
                try:
                    if operator == "LESS_THAN_OR_EQUAL":
                        passed = float(actual_val) <= float(expected_val)
                        explanation = f"Value {actual_val} {'<=' if passed else '>'} threshold {expected_val} {r.unit or ''}"
                    elif operator == "GREATER_THAN_OR_EQUAL":
                        passed = float(actual_val) >= float(expected_val)
                        explanation = f"Value {actual_val} {'>=' if passed else '<'} threshold {expected_val} {r.unit or ''}"
                    elif operator == "EQUALS":
                        passed = str(actual_val).strip().lower() == str(expected_val).strip().lower()
                        explanation = f"Value '{actual_val}' {'matches' if passed else 'does not match'} required '{expected_val}'"
                    elif operator == "IN":
                        allowed = [x.strip().lower() for x in expected_val.split(",")]
                        passed = str(actual_val).strip().lower() in allowed
                        explanation = f"Value '{actual_val}' {'is in' if passed else 'is not in'} allowed list [{expected_val}]"
                    elif operator == "CONTAINS":
                        passed = str(expected_val).strip().lower() in str(actual_val).strip().lower()
                        explanation = f"Value contains required term"
                    elif operator == "EXISTS":
                        passed = bool(actual_val)
                        explanation = f"Requirement verified"
                    else:
                        passed = True
                        explanation = f"Default evaluated true"
                except Exception as e:
                    passed = False
                    explanation = f"Error evaluating rule: {str(e)}"

            rule_result = "PASS" if passed else "FAIL"
            if not passed and r.action == "REVIEW":
                rule_result = "REVIEW"

            if rule_result == "FAIL":
                overall_status = "FAIL"
            elif rule_result == "REVIEW" and overall_status != "FAIL":
                overall_status = "REVIEW"

            results.append({
                "rule_id": r.id,
                "rule_type": r.rule_type,
                "field": r.field,
                "operator": r.operator,
                "expected_value": expected_val,
                "input_value": actual_val,
                "unit": r.unit,
                "result": rule_result,
                "explanation": explanation,
                "source_reference": r.source_reference
            })

        return {
            "policy_id": policy_id,
            "overall_status": overall_status,
            "evaluated_rules_count": len(rules),
            "passed_rules_count": sum(1 for r in results if r["result"] == "PASS"),
            "failed_rules_count": sum(1 for r in results if r["result"] == "FAIL"),
            "review_rules_count": sum(1 for r in results if r["result"] == "REVIEW"),
            "rule_results": results
        }

    @staticmethod
    def create_decision_snapshot(db: Session, req: PolicySnapshotCreateRequest) -> PolicySnapshot:
        """
        Application Policy Snapshot:
        Captures the exact policy context, applicable rules, input values,
        evidence references, and calculated results for historical time travel.
        """
        snapshot = PolicySnapshot(
            id=f"snp_{uuid.uuid4().hex[:10]}",
            application_id=req.application_id,
            scheme_id=req.scheme_id,
            policy_id=req.policy_id,
            policy_version=req.policy_version,
            stage=req.stage,
            applicable_rules=req.applicable_rules,
            input_values=req.input_values,
            evidence_references=req.evidence_references,
            calculated_results=req.calculated_results,
            system_decision=req.system_decision,
            human_decision=req.human_decision,
            human_override_reason=req.human_override_reason,
            human_actor=req.human_actor,
            snapshot_timestamp=datetime.datetime.utcnow(),
            created_at=datetime.datetime.utcnow()
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
        return snapshot

    @staticmethod
    def run_policy_impact_simulation(db: Session, req: PolicySimulationRequest) -> PolicySimulation:
        """
        Policy Change Impact Simulator (Sandboxed):
        Simulates a proposed rule change against real or synthetic applications in-memory.
        DOES NOT modify any production application records.
        """
        # Fetch applications for the target scheme
        apps = db.query(Application).filter(Application.scheme_id == req.scheme_id).all()
        total_analyzed = len(apps)
        potentially_affected = 0
        eligibility_changes = 0
        verification_changes = 0
        manual_review = 0

        sim_details = []

        for app in apps:
            student = db.query(Student).filter(Student.id == app.applicant_id).first()
            app_affected = False
            change_reasons = []

            # Check each proposed rule change
            for change in req.rule_changes:
                field = change.get("field")
                new_op = change.get("operator")
                new_val = change.get("value")

                # Get student value
                actual_val = None
                if field == "family_income":
                    actual_val = app.declared_income or (student.annual_family_income if student else None)
                elif field in ["percentage", "marks", "qualifying_marks"]:
                    actual_val = app.normalized_percentage or app.declared_percentage
                elif field == "course_level":
                    actual_val = app.course_name

                if actual_val is not None and new_val is not None:
                    try:
                        if new_op == "LESS_THAN_OR_EQUAL":
                            old_pass = float(actual_val) <= float(change.get("old_value", new_val))
                            new_pass = float(actual_val) <= float(new_val)
                            if old_pass != new_pass:
                                app_affected = True
                                eligibility_changes += 1
                                change_reasons.append(f"Income threshold change affects eligibility (Current: {actual_val}, New Cap: {new_val})")
                        elif new_op == "GREATER_THAN_OR_EQUAL":
                            old_pass = float(actual_val) >= float(change.get("old_value", new_val))
                            new_pass = float(actual_val) >= float(new_val)
                            if old_pass != new_pass:
                                app_affected = True
                                eligibility_changes += 1
                                change_reasons.append(f"Academic cutoff change affects eligibility (Current: {actual_val}%, New Cutoff: {new_val}%)")
                    except Exception:
                        manual_review += 1
                        change_reasons.append(f"Uncertain calculation for field '{field}' requires manual review")

            if app_affected:
                potentially_affected += 1
                sim_details.append({
                    "application_id": app.id,
                    "application_no": app.application_no,
                    "applicant_name": student.full_name if student else "Applicant",
                    "current_status": app.status,
                    "impact_category": "ELIGIBILITY_CHANGE",
                    "details": change_reasons
                })

        sim_record = PolicySimulation(
            id=f"sim_{uuid.uuid4().hex[:10]}",
            scheme_id=req.scheme_id,
            scheme_code=req.scheme_id,
            base_policy_version=req.base_policy_version,
            proposed_policy_version=req.proposed_policy_version,
            proposed_change_description=req.proposed_change_description,
            rule_changes=req.rule_changes,
            total_analyzed=total_analyzed,
            potentially_affected=potentially_affected,
            eligibility_outcome_changes=eligibility_changes,
            verification_outcome_changes=verification_changes,
            manual_review_required=manual_review,
            simulation_results=sim_details,
            simulated_by=req.simulated_by,
            is_sandbox=True,
            created_at=datetime.datetime.utcnow()
        )
        db.add(sim_record)
        db.commit()
        db.refresh(sim_record)
        return sim_record

    @staticmethod
    def record_human_override(db: Session, req: HumanOverrideRequest) -> AuditLog:
        """
        Human Override Governance:
        Enforces strict logging of officer overrides without ever deleting
        the underlying automated system determination.
        """
        app = db.query(Application).filter(Application.id == req.application_id).first()
        
        # 1. Create Immutable Audit Log
        audit = AuditLog(
            id=f"aud_{uuid.uuid4().hex[:10]}",
            actor_name=req.actor,
            actor_role=req.actor_role,
            action_type="OVERRIDE_DECISION",
            entity_type="APPLICATION",
            target_entity_id=req.application_id,
            details=f"Human override on {req.decision_type}: System '{req.previous_system_result}' -> Human '{req.final_human_result}'",
            before_state={"system_result": req.previous_system_result, "policy_version": req.policy_version},
            after_state={"human_decision": req.final_human_result, "reason": req.reason, "evidence": req.evidence_reference},
            reason=req.reason,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(audit)

        # 2. Update/Save Decision Snapshot with Human Override
        snapshot = PolicySnapshot(
            id=f"snp_{uuid.uuid4().hex[:10]}",
            application_id=req.application_id,
            scheme_id=app.scheme_id if app else "SCHEME_DEFAULT",
            policy_version=req.policy_version,
            stage=req.decision_type,
            applicable_rules=[],
            input_values={},
            evidence_references=[{"ref": req.evidence_reference}] if req.evidence_reference else [],
            calculated_results=[{"system_result": req.previous_system_result}],
            system_decision=req.previous_system_result,
            human_decision=req.final_human_result,
            human_override_reason=req.reason,
            human_actor=req.actor,
            snapshot_timestamp=datetime.datetime.utcnow(),
            created_at=datetime.datetime.utcnow()
        )
        db.add(snapshot)

        db.commit()
        return audit
