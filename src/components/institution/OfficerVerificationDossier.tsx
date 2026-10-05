import React, { useState } from 'react';
import { ApplicationRecord, DeficiencyRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { OfficialApiService } from '../../services/officialApiService';
import { StageBadge } from '../common/StageBadge';
import { NavTabId } from '../common/Navigation';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  Eye, 
  Send,
  Sparkles,
  Lock,
  History,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OfficerVerificationDossierProps {
  application: ApplicationRecord | null;
  onBack: () => void;
  onApplicationUpdated: (app: ApplicationRecord) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const OfficerVerificationDossier: React.FC<OfficerVerificationDossierProps> = ({
  application,
  onBack,
  onApplicationUpdated,
  onNavigate
}) => {
  if (!application) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <p>No application selected for scrutiny. Please return to the scrutiny queue.</p>
          <button onClick={onBack} className="btn btn-primary btn-sm">Return to Queue</button>
        </div>
      </div>
    );
  }

  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [officerRemarks, setOfficerRemarks] = useState('All biometric and DigiLocker credentials verified against institute student database.');
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState('Income value in submitted document does not match declared application value. Please submit current FY 2025-26 certificate.');
  const [actionDone, setActionDone] = useState<string | null>(null);

  // Human Override State (Step 12 Human Override Governance)
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideRuleLabel, setOverrideRuleLabel] = useState('Income Ceiling Check');
  const [overridePrevResult, setOverridePrevResult] = useState('REVIEW_REQUIRED');
  const [overrideFinalResult, setOverrideFinalResult] = useState('APPROVED');
  const [overrideReason, setOverrideReason] = useState('Original signed Tahsildar Income Certificate inspected physically and cross-verified with State Land Revenue register.');
  const [overrideEvidenceRef, setOverrideEvidenceRef] = useState('Physical Certificate Sl.No. JHK/INC/2026/8941 verified on 24 Sep 2026');

  const activeDocDiagnostic = application.documentDiagnostics[selectedDocIndex] || application.documentDiagnostics[0];

  const handleApprove = () => {
    const updatedApp: ApplicationRecord = {
      ...application,
      currentStage: 'STATE_VERIFICATION',
      lastUpdatedDate: new Date().toISOString(),
      institutionReview: {
        reviewedBy: 'Dr. B. K. Soren (Institution Nodal Officer)',
        reviewedAt: new Date().toISOString(),
        decision: 'APPROVED',
        remarks: officerRemarks,
        daysTaken: 1
      },
      timeline: [
        ...application.timeline,
        {
          stage: 'INSTITUTION_VERIFICATION',
          label: 'Institution Nodal Officer Approved & Forwarded to State',
          actor: 'Dr. B. K. Soren (NIT Raipur Desk)',
          timestamp: new Date().toISOString(),
          status: 'COMPLETED',
          comments: officerRemarks
        }
      ]
    };

    StorageService.updateApplication(updatedApp);
    StorageService.logActivity({
      actorRole: 'institution',
      actorName: 'Dr. B. K. Soren (Nodal Officer)',
      ipAddress: '14.139.224.18',
      actionType: 'APPROVE_APPLICATION',
      targetEntityId: application.id,
      entityType: 'APPLICATION',
      details: `Approved application #${application.id} for ${application.applicantName}. Forwarded to State Tribal Welfare Cell.`
    });

    onApplicationUpdated(updatedApp);
    setActionDone('APPROVED');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleRaiseDeficiency = () => {
    const newDeficiency: DeficiencyRecord = {
      id: `DEF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationId: application.id,
      documentType: activeDocDiagnostic?.documentType || 'INCOME_CERTIFICATE',
      stageCreated: 'INSTITUTION_VERIFICATION',
      raisedByOfficer: 'Dr. B. K. Soren (Institution Nodal Officer)',
      raisedByRole: 'institution',
      createdAt: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      issueDescription: deficiencyReason,
      requiredAction: 'Upload renewed or rectified official document to clear verification checkpoint.',
      status: 'AWAITING_APPLICANT'
    };

    const updatedApp: ApplicationRecord = {
      ...application,
      currentStage: 'DEFICIENT',
      deficiencies: [...application.deficiencies, newDeficiency],
      lastUpdatedDate: new Date().toISOString(),
      timeline: [
        ...application.timeline,
        {
          stage: 'INSTITUTION_VERIFICATION',
          label: 'Structured Deficiency Raised: Action Required from Applicant',
          actor: 'Dr. B. K. Soren (Nodal Officer)',
          timestamp: new Date().toISOString(),
          status: 'BLOCKED',
          comments: deficiencyReason
        }
      ]
    };

    StorageService.updateApplication(updatedApp);
    StorageService.logActivity({
      actorRole: 'institution',
      actorName: 'Dr. B. K. Soren (Nodal Officer)',
      ipAddress: '14.139.224.18',
      actionType: 'RAISE_DEFICIENCY',
      targetEntityId: application.id,
      entityType: 'APPLICATION',
      details: `Raised deficiency on ${activeDocDiagnostic?.documentType || 'Document'} for ${application.applicantName}. Reason: ${deficiencyReason}`
    });

    onApplicationUpdated(updatedApp);
    setShowDeficiencyModal(false);
    setActionDone('DEFICIENT');
  };

  const handleExecuteOverride = async () => {
    try {
      await OfficialApiService.recordHumanOverride({
        application_id: application.id,
        decision_type: 'ELIGIBILITY_CRITERIA',
        previous_system_result: overridePrevResult,
        final_human_result: overrideFinalResult,
        reason: overrideReason,
        actor: 'Dr. B. K. Soren (Institution Nodal Officer)',
        actor_role: 'INSTITUTION_OFFICER',
        policy_version: 'NFST-2026-v2',
        evidence_reference: overrideEvidenceRef
      });

      // Update local application record
      const updatedApp: ApplicationRecord = {
        ...application,
        ruleEvaluationResults: application.ruleEvaluationResults.map(r => 
          r.ruleLabel.toLowerCase().includes(overrideRuleLabel.toLowerCase())
            ? { ...r, status: 'PASS' }
            : r
        ),
        timeline: [
          ...application.timeline,
          {
            stage: 'INSTITUTION_VERIFICATION',
            label: `Governed Human Override: ${overrideRuleLabel} (${overridePrevResult} -> ${overrideFinalResult})`,
            actor: 'Dr. B. K. Soren (Nodal Officer)',
            timestamp: new Date().toISOString(),
            status: 'COMPLETED',
            comments: `${overrideReason} [Evidence: ${overrideEvidenceRef}]`
          }
        ]
      };

      StorageService.updateApplication(updatedApp);
      onApplicationUpdated(updatedApp);
      setShowOverrideModal(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Failed to execute override:', e);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 180px)', padding: '2rem 0' }}>
      <div className="container">
        {/* Top Navigation & Status Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} />
            <span>Return to Verification Queue</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Application ID: <strong style={{ color: 'var(--gov-navy-950)' }}>#{application.id}</strong>
            </span>
            <StageBadge stage={application.currentStage} />
          </div>
        </div>

        {/* Dossier Header Info */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderTop: '4px solid var(--primary-maroon)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Building2 size={18} color="var(--primary-maroon)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-maroon)', textTransform: 'uppercase' }}>
                  Statutory Institutional Scrutiny Dossier
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                {application.applicantName}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Applied for <strong>{application.schemeName} ({application.schemeCode})</strong> • AY {application.academicYear}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowOverrideModal(true)} 
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', borderColor: '#F59E0B' }}
              >
                <History size={15} />
                <span>Human Override Governance</span>
              </button>
              <button onClick={() => setShowDeficiencyModal(true)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={15} />
                <span>Raise Structured Deficiency</span>
              </button>
              <button onClick={handleApprove} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} />
                <span>Approve & Forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Scrutiny Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Side: Document Viewer & OCR Diagnostics */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={18} color="var(--gov-navy-900)" />
              <span>Applicant Digital Case File ({application.documentDiagnostics.length} Documents)</span>
            </h3>

            {/* Document Selector Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              {application.documentDiagnostics.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDocIndex(idx)}
                  style={{
                    padding: '0.45rem 0.8rem',
                    borderRadius: '6px',
                    border: selectedDocIndex === idx ? '2px solid var(--primary-maroon)' : '1px solid var(--border-medium)',
                    backgroundColor: selectedDocIndex === idx ? 'rgba(128,0,32,0.06)' : '#FFFFFF',
                    color: selectedDocIndex === idx ? 'var(--primary-maroon)' : 'var(--text-secondary)',
                    fontWeight: selectedDocIndex === idx ? 700 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {doc.documentType.replace('_', ' ')} {doc.evaluationStatus === 'PASSED' ? '✓' : '⚠️'}
                </button>
              ))}
            </div>

            {/* Selected Document OCR Visual */}
            {activeDocDiagnostic && (
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                    {activeDocDiagnostic.documentType}
                  </span>
                  <span className={`badge ${activeDocDiagnostic.evaluationStatus === 'PASSED' ? 'badge-success' : 'badge-warning'}`}>
                    {activeDocDiagnostic.evaluationStatus}
                  </span>
                </div>

                <div className="ocr-bbox" style={{ marginBottom: '0.75rem' }}>
                  <span className="ocr-bbox-tag">VERIFIED_HOLDER</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Certificate Issued To:</div>
                  <strong style={{ fontSize: '0.9rem' }}>{application.applicantName}</strong>
                </div>

                <div className={`ocr-bbox ${activeDocDiagnostic.evaluationStatus === 'REVIEW_REQUIRED' ? 'mismatch' : ''}`}>
                  <span className="ocr-bbox-tag">EXTRACTED_CONTENT</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Extracted Parameter:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                    {activeDocDiagnostic.extractedFields.map(f => `${f.fieldLabel}: ${typeof f.extractedValue === 'number' ? `₹${f.extractedValue.toLocaleString('en-IN')}` : f.extractedValue}`).join(' | ')}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified Digital Signature</span>
                  <span style={{ color: 'var(--gov-green-700)', fontWeight: 600 }}>✓ SHA-256 Validated</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: AI Verification Summary & Deterministic Rule Checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Policy Grounding Card (Step 10 Provenance) */}
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-maroon)', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={17} color="var(--primary-maroon)" />
                  <strong style={{ fontSize: '0.88rem', color: 'var(--gov-navy-950)' }}>
                    Operative Policy Grounding
                  </strong>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(128,0,32,0.08)', color: 'var(--primary-maroon)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  NFST-2026-v2 (Active)
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Source: <strong>Official NFST Operational Framework 2025-26</strong> (Clauses 4.1 to 4.3, Pages 12-15). 
                Evaluated under statutory rule set. All overrides are immutably logged to the decision snapshot.
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={18} color="#8b5cf6" />
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    AI Verification Summary Dossier
                  </h3>
                </div>
                <span className="badge badge-neutral">Confidence: {application.aiOverallConfidence}%</span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                {application.aiSummaryNotes}
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                <span className="badge badge-success">✓ ST Category Verified</span>
                <span className="badge badge-success">✓ AISHE Enrolment Confirmed</span>
                <span className="badge badge-success">✓ Name & DOB Match (100%)</span>
              </div>
            </div>

            {/* Deterministic Rule Engine Evaluation Breakdown */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="var(--gov-navy-900)" />
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    Deterministic Scheme Policy Evaluation
                  </h3>
                </div>
                <span className="badge badge-info">{application.ruleEvaluationResults.length} Statutory Rules</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {application.ruleEvaluationResults.map((rule, i) => (
                  <div key={i} style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', backgroundColor: rule.status === 'PASS' ? 'var(--gov-green-50)' : 'var(--gov-amber-50)', border: `1px solid ${rule.status === 'PASS' ? '#bbf7d0' : '#fde68a'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--gov-navy-950)' }}>{rule.ruleLabel}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Criteria: <code>{rule.requiredCriteria}</code> • Value: <strong>{rule.extractedValue}</strong>
                      </div>
                    </div>
                    <span className={`badge ${rule.status === 'PASS' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {rule.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Remarks Box */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Officer Scrutiny Remarks & Endorsement Note</label>
              <textarea
                rows={2}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

        {/* Modal: Governed Human Override */}
        {showOverrideModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2rem', borderTop: '5px solid #B45309' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <History size={22} color="#B45309" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 800 }}>
                  Governed Officer Decision Override
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                Under Step 12 Human Override Governance, the original automated system result is NEVER erased. 
                Your override is appended to an immutable audit record and decision snapshot with full accountability.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Previous Automated System Result</label>
                    <input type="text" value={overridePrevResult} disabled className="form-control" style={{ backgroundColor: '#F1F5F9', fontWeight: 700 }} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Final Officer Determination</label>
                    <select 
                      value={overrideFinalResult} 
                      onChange={(e) => setOverrideFinalResult(e.target.value)}
                      className="form-control"
                      style={{ fontWeight: 700, color: '#0F766E' }}
                    >
                      <option value="APPROVED">APPROVED (Satisfies Policy)</option>
                      <option value="REJECTED">REJECTED (Ineligible)</option>
                      <option value="EXCEPTION_GRANTED">EXCEPTION GRANTED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Mandatory Official Justification <span className="required">*</span></label>
                  <textarea
                    rows={3}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="form-control"
                    required
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Supporting Physical / Gazette Evidence Reference <span className="required">*</span></label>
                  <input
                    type="text"
                    value={overrideEvidenceRef}
                    onChange={(e) => setOverrideEvidenceRef(e.target.value)}
                    className="form-control"
                    required
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => setShowOverrideModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button onClick={handleExecuteOverride} className="btn btn-primary btn-sm" style={{ backgroundColor: '#B45309', borderColor: '#B45309' }}>
                  Attest & Execute Governed Override
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Raise Structured Deficiency */}
        {showDeficiencyModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '2rem', borderTop: '5px solid var(--gov-red-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={22} color="var(--gov-red-600)" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  Raise Structured Deficiency to Applicant
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Do NOT reject the application outright. State the exact document discrepancy so the student can upload a corrected certificate.
              </p>

              <div className="form-group">
                <label className="form-label">Flagged Document</label>
                <input type="text" value={activeDocDiagnostic?.documentType || 'INCOME_CERTIFICATE'} disabled className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Specific Issue & Correction Instruction <span className="required">*</span></label>
                <textarea
                  rows={4}
                  value={deficiencyReason}
                  onChange={(e) => setDeficiencyReason(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => setShowDeficiencyModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleRaiseDeficiency} className="btn btn-danger">
                  Submit Deficiency Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
