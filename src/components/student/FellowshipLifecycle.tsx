import React, { useState } from 'react';
import { StudentDigitalCaseFile, ApplicationRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  CreditCard,
  Building2,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FellowshipLifecycleProps {
  student: StudentDigitalCaseFile;
  applications: ApplicationRecord[];
}

export const FellowshipLifecycle: React.FC<FellowshipLifecycleProps> = ({ student, applications }) => {
  const fellowshipApp = applications.find(a => a.fellowshipData) || applications[applications.length - 1];

  const [activeTab, setActiveTab] = useState<'progress' | 'contingency' | 'upgradation'>('progress');
  const [contingencyAmount, setContingencyAmount] = useState<number>(12000);
  const [contingencyPurpose, setContingencyPurpose] = useState('Purchase of scientific research reference literature & field survey expenses');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [upgradeRequested, setUpgradeRequested] = useState(false);

  const fellowshipData = fellowshipApp?.fellowshipData || {
    fellowshipAwardId: 'MOTA-NFST-2025-PVTG-0044',
    tenureYears: 5,
    joiningDate: '2025-08-01T00:00:00Z',
    guideSupervisorName: 'Prof. R. P. Pathak (BHU)',
    currentQuarter: 4,
    reportsSubmitted: [
      { quarter: 1, submittedOn: '2025-11-05T10:00:00Z', verifiedByHod: true, approvedByMota: true, status: 'APPROVED' as const },
      { quarter: 2, submittedOn: '2026-02-10T11:00:00Z', verifiedByHod: true, approvedByMota: true, status: 'APPROVED' as const },
      { quarter: 3, submittedOn: '2026-05-15T09:30:00Z', verifiedByHod: true, approvedByMota: true, status: 'APPROVED' as const },
      { quarter: 4, submittedOn: '2026-08-20T14:00:00Z', verifiedByHod: true, approvedByMota: false, status: 'PENDING' as const }
    ],
    contingencyClaims: [
      { claimId: 'CONT-2025-01', amount: 15000, purpose: 'Field Audio Equipment', date: '2025-12-10', status: 'PAID' as const },
      { claimId: 'CONT-2026-02', amount: 10000, purpose: 'Conference Registration', date: '2026-06-04', status: 'PAID' as const }
    ],
    isUpgradationEligible: true
  };

  const lifecycleStages = [
    { name: 'Application', status: 'COMPLETED' },
    { name: 'Verification', status: 'COMPLETED' },
    { name: 'Selection', status: 'COMPLETED' },
    { name: 'Award', status: 'COMPLETED' },
    { name: 'Enrollment', status: 'COMPLETED' },
    { name: 'Renewal / Progress', status: 'IN_PROGRESS' },
    { name: 'Completion', status: 'PENDING' }
  ];

  const handleClaimContingency = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  const handleRequestUpgrade = () => {
    setUpgradeRequested(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-green-700)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Award size={16} />
            Fellowship Lifecycle
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.35rem', fontWeight: 800 }}>
            Research Scholar Portal
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Manage your research fellowship progress reports, claim annual contingency grants, and request tenure extensions.
          </p>
        </div>

        {/* 7-Stage Fellowship Journey Visual Bar */}
        <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 700 }}>
            Fellowship Scholar Journey
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            {lifecycleStages.map((stage, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: stage.status === 'COMPLETED' ? 'var(--gov-green-600)' : stage.status === 'IN_PROGRESS' ? 'var(--gov-saffron-500)' : 'var(--border-medium)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {stage.status === 'COMPLETED' ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: stage.status === 'IN_PROGRESS' ? 700 : 500, color: stage.status === 'IN_PROGRESS' ? 'var(--gov-saffron-700)' : stage.status === 'COMPLETED' ? 'var(--gov-navy-950)' : 'var(--text-muted)' }}>
                    {stage.name}
                  </span>
                </div>
                {idx < lifecycleStages.length - 1 && (
                  <ChevronRight size={16} color="var(--border-medium)" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Fellowship Award Overview Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '6px solid var(--gov-green-600)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-success">Active Research Scholar (JRF)</span>
                <span className="badge badge-neutral">Award ID: {fellowshipData.fellowshipAwardId}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0', fontWeight: 800 }}>
                National Fellowship for ST Students (NFST)
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Scholar: <strong>{student.fullName}</strong> • Research Guide: <strong>{fellowshipData.guideSupervisorName}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Stipend</div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gov-green-700)' }}>
                ₹37,000 / month
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Junior Research Fellow (JRF)</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-medium)', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveTab('progress')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'progress' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeTab === 'progress' ? 700 : 500,
              color: activeTab === 'progress' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.92rem'
            }}
          >
            <TrendingUp size={16} />
            Quarterly Progress ({fellowshipData.reportsSubmitted.length})
          </button>

          <button
            onClick={() => setActiveTab('contingency')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'contingency' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeTab === 'contingency' ? 700 : 500,
              color: activeTab === 'contingency' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.92rem'
            }}
          >
            <CreditCard size={16} />
            Contingency Grant Claims
          </button>

          <button
            onClick={() => setActiveTab('upgradation')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upgradation' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeTab === 'upgradation' ? 700 : 500,
              color: activeTab === 'upgradation' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.92rem'
            }}
          >
            <Sparkles size={16} />
            Stipend Upgradation (SRF)
          </button>
        </div>

        {/* Tab 1: Progress Reports */}
        {activeTab === 'progress' && (
          <div className="card" style={{ padding: '2rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 700 }}>
                  Quarterly Research Progress Reports
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  Progress reports must be endorsed by your Guide / HOD for continuous fellowship release.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {fellowshipData.reportsSubmitted.map((rep) => (
                <div 
                  key={rep.quarter}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-muted)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)' }}>
                        Quarter {rep.quarter} Research Progress Report
                      </strong>
                      <span className={`badge ${rep.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                        {rep.status === 'APPROVED' ? 'Verified & Approved' : 'Under Review'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Submitted on {new Date(rep.submittedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • HOD Endorsement: {rep.verifiedByHod ? '✓ Verified' : 'Pending'}
                    </div>
                  </div>

                  <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
                    <FileText size={14} />
                    View Summary
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Contingency Grant Claims */}
        {activeTab === 'contingency' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', marginBottom: '1.25rem', fontWeight: 700 }}>
                Submit Contingency Claim
              </h3>

              {claimSubmitted ? (
                <div style={{ padding: '2rem', backgroundColor: 'var(--gov-green-50)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--gov-green-600)' }}>
                  <CheckCircle2 size={36} color="var(--gov-green-700)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <strong style={{ color: 'var(--gov-green-900)', display: 'block', fontSize: '1.1rem' }}>Claim Submitted!</strong>
                  <p style={{ fontSize: '0.88rem', color: 'var(--gov-green-800)', marginTop: '0.35rem' }}>
                    Your claim for ₹{contingencyAmount.toLocaleString('en-IN')} has been forwarded to the finance desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimContingency}>
                  <div className="form-group">
                    <label className="form-label">Claim Amount (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={contingencyAmount}
                      onChange={(e) => setContingencyAmount(Number(e.target.value))}
                      className="form-control"
                      max={25000}
                    />
                    <div className="form-hint">Annual ceiling: ₹25,000 / year</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Purpose of Expense <span className="required">*</span></label>
                    <textarea
                      rows={3}
                      value={contingencyPurpose}
                      onChange={(e) => setContingencyPurpose(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attach Receipts / Bills (PDF)</label>
                    <input type="file" className="form-control" />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontWeight: 600 }}>
                    Submit Claim
                  </button>
                </form>
              )}
            </div>

            <div className="card" style={{ padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', marginBottom: '1.25rem', fontWeight: 700 }}>
                Disbursed Claims
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fellowshipData.contingencyClaims.map((claim) => (
                  <div key={claim.claimId} style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--gov-navy-950)' }}>
                        {claim.purpose}
                      </strong>
                      <span className="badge badge-success">₹{claim.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Claim #{claim.claimId} • Date: {claim.date} • Status: {claim.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Upgradation */}
        {activeTab === 'upgradation' && (
          <div className="card" style={{ padding: '2rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 700 }}>
                  Fellowship Upgradation (JRF → SRF)
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  Scholars who have completed 2 years of satisfactory research can request upgradation to Senior Research Fellow (SRF: ₹42,000 / month).
                </p>
              </div>
              <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem' }}>Eligible to Apply</span>
            </div>

            {upgradeRequested ? (
              <div style={{ padding: '2rem', backgroundColor: 'var(--gov-green-50)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--gov-green-600)' }}>
                <CheckCircle2 size={40} color="var(--gov-green-700)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: 'var(--gov-green-900)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                  Upgradation Request Submitted!
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--gov-green-800)', margin: 0 }}>
                  Your request has been forwarded to the University Assessment Committee and Ministry Division.
                </p>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1.5rem', borderRadius: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Current Position:</span>
                    <strong style={{ display: 'block', fontSize: '1rem', marginTop: '0.2rem' }}>JRF (Year 2 Completed)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Proposed Upgraded Stipend:</span>
                    <strong style={{ display: 'block', color: 'var(--gov-green-700)', fontSize: '1.1rem', marginTop: '0.2rem' }}>SRF (₹42,000 / month)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Assessment Panel:</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginTop: '0.2rem' }}>Dean, HOD, External Expert</strong>
                  </div>
                </div>

                <button onClick={handleRequestUpgrade} className="btn btn-saffron btn-lg" style={{ fontWeight: 700 }}>
                  <Sparkles size={18} />
                  Submit Formal Upgradation Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
