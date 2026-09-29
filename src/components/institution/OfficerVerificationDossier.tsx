import React, { useState } from 'react';
import { ApplicationRecord, DeficiencyRecord } from '../../types';
import { StorageService } from '../../services/storageService';
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
  Lock
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
      details: `Raised structured deficiency on application #${application.id}: ${deficiencyReason}`
    });

    onApplicationUpdated(updatedApp);
    setShowDeficiencyModal(false);
    setActionDone('DEFICIENT');
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container-wide">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowLeft size={14} /> Back to Queue
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-neutral">Dossier: {application.id}</span>
                <span className="badge badge-info">{application.schemeCode}</span>
                <StageBadge stage={application.currentStage} size="sm" />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0 0 0' }}>
                Officer Verification Workstation: {application.applicantName}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowDeficiencyModal(true)} 
              className="btn btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
            >
              <AlertTriangle size={16} />
              Raise Structured Deficiency
            </button>

            <button 
              onClick={handleApprove}
              className="btn btn-success"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <CheckCircle2 size={16} />
              Approve & Forward to State
            </button>
          </div>
        </div>

        {actionDone && (
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderRadius: '8px', 
            backgroundColor: actionDone === 'APPROVED' ? 'var(--gov-green-100)' : 'var(--gov-red-100)',
            color: actionDone === 'APPROVED' ? 'var(--gov-green-800)' : 'var(--gov-red-800)',
            marginBottom: '1.5rem',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {actionDone === 'APPROVED' 
                ? '✓ Application Scrutiny Approved! Case forwarded to State Tribal Welfare Cell.' 
                : '⚠ Structured Deficiency Raised. Applicant has been notified to resubmit document.'}
            </span>
            <button onClick={onBack} className="btn btn-secondary btn-sm">
              Return to Scrutiny Queue
            </button>
          </div>
        )}

        {/* Split-Screen Workstation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Side: Original Document Visualizer */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--gov-navy-900)" />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  Submitted Original Document
                </h3>
              </div>
              <span className="badge badge-info">
                DigiLocker / Direct Upload
              </span>
            </div>

            {/* Document Selector Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {application.documentDiagnostics.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDocIndex(idx)}
                  className={`btn btn-sm ${selectedDocIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {doc.documentType.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Simulated Document Paper Panel */}
            {activeDocDiagnostic && (
              <div className="ocr-document-view" style={{ minHeight: '420px' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px double var(--gov-navy-900)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GOVERNMENT OF INDIA REVENUE CERTIFICATE</div>
                  <strong style={{ fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{activeDocDiagnostic.classifiedAs.toUpperCase()}</strong>
                </div>

                <div className="ocr-bbox">
                  <span className="ocr-bbox-tag">APPLICANT</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Candidate:</div>
                  <strong style={{ fontSize: '0.9rem' }}>{application.applicantName}</strong>
                </div>

                <div className={`ocr-bbox ${activeDocDiagnostic.evaluationStatus === 'REVIEW_REQUIRED' ? 'mismatch' : ''}`}>
                  <span className="ocr-bbox-tag">EXTRACTED_CONTENT</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Extracted Parameter:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                    {activeDocDiagnostic.extractedFields.map(f => `${f.fieldLabel}: ${typeof f.extractedValue === 'number' ? `₹${f.extractedValue.toLocaleString('en-IN')}` : f.extractedValue}`).join(' | ')}
                  </div>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified Digital Signature</span>
                  <span style={{ color: 'var(--gov-green-700)', fontWeight: 600 }}>✓ SHA-256 Validated</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: AI Verification Summary & Deterministic Rule Checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* AI Summary Card */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={18} color="#8b5cf6" />
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    AI Verification Summary Dossier
                  </h3>
                </div>
                <span className="badge badge-neutral">Confidence: {application.aiOverallConfidence}%</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                {application.aiSummaryNotes}
              </p>

              {/* Consistency Check Mini Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                <span className="badge badge-success">✓ ST Category Verified</span>
                <span className="badge badge-success">✓ AISHE Enrolment Confirmed</span>
                <span className="badge badge-success">✓ Name & DOB Match (100%)</span>
              </div>
            </div>

            {/* Deterministic Rule Engine Evaluation Breakdown */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="var(--gov-navy-900)" />
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    Deterministic Scheme Policy Evaluation
                  </h3>
                </div>
                <span className="badge badge-info">{application.ruleEvaluationResults.length} Statutory Rules</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {application.ruleEvaluationResults.map((rule, i) => (
                  <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: rule.status === 'PASS' ? 'var(--gov-green-50)' : 'var(--gov-amber-50)', border: `1px solid ${rule.status === 'PASS' ? '#bbf7d0' : '#fde68a'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--gov-navy-950)' }}>{rule.ruleLabel}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
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
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Officer Scrutiny Remarks & Endorsement Note</label>
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
