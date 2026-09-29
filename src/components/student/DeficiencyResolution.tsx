import React, { useState } from 'react';
import { ApplicationRecord, DeficiencyRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { NavTabId } from '../common/Navigation';
import { useLanguage } from '../../services/languageService';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  RefreshCw, 
  Clock, 
  ArrowRight,
  FileText,
  ShieldCheck,
  Check,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeficiencyResolutionProps {
  applications: ApplicationRecord[];
  onApplicationUpdated: (app: ApplicationRecord) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const DeficiencyResolution: React.FC<DeficiencyResolutionProps> = ({
  applications,
  onApplicationUpdated,
  onNavigate
}) => {
  const { t } = useLanguage();
  // Find all applications with deficiencies
  const deficientApps = applications.filter(a => a.deficiencies && a.deficiencies.length > 0);
  const activeDeficientApp = deficientApps[0] || applications[0];

  const [selectedApp, setSelectedApp] = useState<ApplicationRecord>(activeDeficientApp);
  const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyRecord | null>(
    selectedApp?.deficiencies?.[0] || null
  );

  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmissionDone, setResubmissionDone] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('Income_Certificate_FY2025_26_Valid.pdf');

  const handleResubmit = () => {
    if (!selectedDeficiency) return;
    setIsResubmitting(true);

    setTimeout(() => {
      // Update deficiency to RESOLVED/RESUBMITTED
      const updatedDeficiency: DeficiencyRecord = {
        ...selectedDeficiency,
        status: 'RESUBMITTED',
        resubmissionTimestamp: new Date().toISOString(),
        resubmissionAiVerificationScore: 98,
        officerResolutionNotes: 'Applicant uploaded renewed FY 2025-26 Income Certificate. Verified and cleared.',
        resolvedAt: new Date().toISOString()
      };

      const updatedDeficiencies = selectedApp.deficiencies.map(d => 
        d.id === selectedDeficiency.id ? updatedDeficiency : d
      );

      // Advance stage from DEFICIENT to STATE_VERIFICATION or INSTITUTION_VERIFICATION
      const updatedApp: ApplicationRecord = {
        ...selectedApp,
        currentStage: 'STATE_VERIFICATION',
        deficiencies: updatedDeficiencies,
        lastUpdatedDate: new Date().toISOString(),
        aiSummaryNotes: 'Deficiency resolved: Renewed Income Certificate uploaded. Sent to verification desk.',
        timeline: [
          ...selectedApp.timeline,
          {
            stage: 'DOCUMENT_SUBMISSION',
            label: 'Corrected Document Submitted',
            actor: `${selectedApp.applicantName} (Student)`,
            timestamp: new Date().toISOString(),
            status: 'COMPLETED',
            comments: 'Renewed FY 2025-26 certificate submitted by student.'
          }
        ]
      };

      StorageService.updateApplication(updatedApp);
      StorageService.logActivity({
        actorRole: 'applicant',
        actorName: selectedApp.applicantName,
        ipAddress: '103.24.11.89',
        actionType: 'RESUBMIT_DOCUMENT',
        targetEntityId: selectedApp.id,
        entityType: 'APPLICATION',
        details: `Resubmitted corrected document for deficiency #${selectedDeficiency.id}.`
      });

      setSelectedApp(updatedApp);
      setSelectedDeficiency(updatedDeficiency);
      setIsResubmitting(false);
      setResubmissionDone(true);
      onApplicationUpdated(updatedApp);

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  const actionItemsCount = selectedApp?.deficiencies?.filter(d => d.status === 'OPEN' || d.status === 'AWAITING_APPLICANT').length || 0;

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-red-600)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <AlertTriangle size={16} />
            Action Required Desk
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.35rem', fontWeight: 800 }}>
            {actionItemsCount > 0 ? `${actionItemsCount} things need your attention` : 'Action Items & Updates'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Review the items below and upload any requested documents so your application can continue through verification without delay.
          </p>
        </div>

        {selectedDeficiency ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Action Item Card */}
            <div className="card" style={{ padding: '2rem', borderTop: '5px solid var(--gov-red-600)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-danger" style={{ fontWeight: 700 }}>Action Required</span>
                    <span className="badge badge-neutral">Application: {selectedApp.schemeCode || 'ST-SCHEME'}</span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0', fontWeight: 800 }}>
                    {selectedDeficiency.documentType.replace(/_/g, ' ')} Update
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Notice issued on {new Date(selectedDeficiency.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <span className={`badge ${selectedDeficiency.status === 'RESUBMITTED' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                    {selectedDeficiency.status === 'RESUBMITTED' ? 'Submitted & Under Review' : 'Pending Your Action'}
                  </span>
                </div>
              </div>

              {/* What went wrong - Plain Language Explanation */}
              <div style={{ backgroundColor: 'var(--gov-red-50)', padding: '1.25rem 1.5rem', borderRadius: '10px', borderLeft: '4px solid var(--gov-red-600)', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--gov-red-700)', fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={16} />
                  Reason:
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {selectedDeficiency.issueDescription.includes('mismatch') || selectedDeficiency.issueDescription.includes('exceeds') ? (
                    <>
                      <strong>Discrepancy in declared details:</strong> Your uploaded income certificate indicates an annual income of <strong>₹3,20,000</strong>, whereas the application form declared <strong>₹2,20,000</strong>.
                    </>
                  ) : (
                    selectedDeficiency.issueDescription
                  )}
                </p>
              </div>

              {/* What you need to do - Plain Language Guidance */}
              <div style={{ backgroundColor: 'var(--gov-green-50)', padding: '1.25rem 1.5rem', borderRadius: '10px', borderLeft: '4px solid var(--gov-green-600)', marginBottom: '1.75rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--gov-green-800)', fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} />
                  What you need to do:
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  Please upload a valid, digitally signed Income Certificate issued by the competent Revenue Authority (Tahsildar / Sub-Divisional Magistrate) for Financial Year 2025-26.
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--gov-green-800)', marginTop: '0.6rem', fontWeight: 600 }}>
                  ⏰ Action Deadline: {new Date(selectedDeficiency.deadlineDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Resubmission Section */}
              {resubmissionDone || selectedDeficiency.status === 'RESUBMITTED' ? (
                <div style={{ padding: '1.75rem', backgroundColor: 'var(--gov-green-100)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--gov-green-600)' }}>
                  <CheckCircle2 size={40} color="var(--gov-green-700)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h3 style={{ color: 'var(--gov-green-900)', fontSize: '1.25rem', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
                    Submitted Successfully
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--gov-green-800)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                    Your updated document has been received. It will be reviewed by the verification desk.
                  </p>
                  <button 
                    onClick={() => onNavigate('application_timeline')}
                    className="btn btn-primary"
                    style={{ fontWeight: 600 }}
                  >
                    Track Application Status →
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ border: '2px dashed var(--gov-navy-700)', borderRadius: '10px', padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-muted)', marginBottom: '1.5rem' }}>
                    <Upload size={36} color="var(--gov-navy-800)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--gov-navy-950)' }}>
                      Upload Corrected Document (PDF or JPG, max 2MB)
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
                      Make sure the document is clear and all details are readable.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}>
                      <FileText size={14} color="var(--gov-navy-800)" />
                      <span>{selectedFileName}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                    <button
                      onClick={() => onNavigate('student_dashboard')}
                      className="btn btn-secondary"
                    >
                      Back to Dashboard
                    </button>
                    <button
                      onClick={handleResubmit}
                      disabled={isResubmitting}
                      className="btn btn-saffron btn-lg"
                      style={{ fontWeight: 700, minWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {isResubmitting ? (
                        <>
                          <RefreshCw size={18} className="pulse-dot" />
                          <span>Submitting Document...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Upload & Submit for Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help / Guidance Card */}
            <div className="card" style={{ padding: '1.25rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={18} color="var(--gov-navy-800)" />
                <strong style={{ fontSize: '0.92rem', color: 'var(--gov-navy-950)' }}>
                  Need help with your certificate?
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                You can download your verified digital certificate directly through DigiLocker, or visit your nearest Common Service Centre (CSC) / e-Seva Kendra for assistance.
              </p>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '12px' }}>
            <CheckCircle2 size={48} color="var(--gov-green-600)" style={{ margin: '0 auto 1.25rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              No Action Required
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.35rem auto 1.75rem auto', lineHeight: 1.5 }}>
              Great news! There are no pending deficiency notices or document corrections required for your applications right now.
            </p>
            <button onClick={() => onNavigate('student_dashboard')} className="btn btn-primary" style={{ fontWeight: 600 }}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
