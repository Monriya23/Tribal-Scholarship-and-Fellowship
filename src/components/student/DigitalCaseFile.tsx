import React, { useState } from 'react';
import { StudentDigitalCaseFile, ApplicationRecord } from '../../types';
import { NavTabId } from '../common/Navigation';
import { StorageService } from '../../services/storageService';
import { ExplainDecisionModal } from '../modals/ExplainDecisionModal';
import { StageBadge } from '../common/StageBadge';
import { 
  FolderCheck, 
  ShieldCheck, 
  Award, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  CreditCard, 
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  HelpCircle,
  Clock,
  History,
  Info
} from 'lucide-react';

interface DigitalCaseFileProps {
  student: StudentDigitalCaseFile;
  applications?: ApplicationRecord[];
  onNavigate: (tab: NavTabId) => void;
}

export const DigitalCaseFile: React.FC<DigitalCaseFileProps> = ({ 
  student, 
  applications = StorageService.getApplications(), 
  onNavigate 
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'credentials' | 'applications' | 'academic' | 'past_awards' | 'banking' | 'audit'>('credentials');
  const [selectedAppForExplanation, setSelectedAppForExplanation] = useState<ApplicationRecord | null>(null);
  const [explanationMode, setExplanationMode] = useState<'eligibility' | 'ranking' | 'replay'>('eligibility');

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.motaLifetimeId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const studentApps = applications.filter(a => a.applicantMotaId === student.motaLifetimeId || a.applicantName === student.fullName) || [];
  const displayApps = studentApps.length > 0 ? studentApps : applications.slice(0, 2);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header Capsule */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderLeft: '5px solid var(--gov-navy-900)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-success">
                  <ShieldCheck size={12} />
                  National Tribal Identity Verified
                </span>
                <span className="badge badge-neutral">
                  Aadhaar Seeded (UIDAI)
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Student Digital Case File
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Lifetime MoTA Case ID: <strong style={{ color: 'var(--gov-navy-900)' }}>{student.motaLifetimeId}</strong>
                </span>
                <button
                  onClick={handleCopyId}
                  style={{ background: 'none', border: 'none', color: 'var(--gov-navy-700)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
                  title="Copy Case ID"
                >
                  {copiedId ? <Check size={14} color="var(--gov-green-600)" /> : <Copy size={14} />}
                  {copiedId ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => onNavigate('dynamic_form')}
                className="btn btn-saffron"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <Sparkles size={16} />
                Apply With Auto-Prefill
              </button>
            </div>
          </div>

          {/* Renewal / Award Linking Banner */}
          {student.pastAwards && student.pastAwards.length > 0 && (
            <div style={{ 
              marginTop: '1.25rem', 
              padding: '1rem 1.25rem', 
              backgroundColor: 'var(--gov-green-50)', 
              border: '1.5px solid #86efac', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--gov-green-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--gov-green-800)' }}>
                    Existing Verified Award Record Found: {student.pastAwards[0].schemeName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gov-green-700)', marginTop: '0.15rem' }}>
                    Award #{student.pastAwards[0].awardId} ({student.pastAwards[0].course}) — ₹{student.pastAwards[0].totalAmountDisbursed.toLocaleString('en-IN')} disbursed. Verified credentials will be automatically reused for renewals and Ph.D upgradation without duplicate scrutiny.
                  </div>
                </div>
              </div>
              <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                Auto-Link Enabled
              </span>
            </div>
          )}
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-medium)', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveSubTab('credentials')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'credentials' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'credentials' ? 700 : 500,
              color: activeSubTab === 'credentials' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <ShieldCheck size={16} />
            Verified Credentials & DigiLocker ({student.verifiedDocuments.length})
          </button>

          <button
            onClick={() => setActiveSubTab('applications')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'applications' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'applications' ? 700 : 500,
              color: activeSubTab === 'applications' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <FileText size={16} />
            Applications & Decisions ({displayApps.length})
          </button>

          <button
            onClick={() => setActiveSubTab('academic')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'academic' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'academic' ? 700 : 500,
              color: activeSubTab === 'academic' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <Building2 size={16} />
            Academic & Institution Record
          </button>

          <button
            onClick={() => setActiveSubTab('past_awards')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'past_awards' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'past_awards' ? 700 : 500,
              color: activeSubTab === 'past_awards' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <Award size={16} />
            Past Awards & Fellowship History ({student.pastAwards.length})
          </button>

          <button
            onClick={() => setActiveSubTab('banking')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'banking' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'banking' ? 700 : 500,
              color: activeSubTab === 'banking' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <CreditCard size={16} />
            Aadhaar NPCI Bank Vault
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'audit' ? '3px solid var(--gov-navy-900)' : '3px solid transparent',
              fontWeight: activeSubTab === 'audit' ? 700 : 500,
              color: activeSubTab === 'audit' ? 'var(--gov-navy-950)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem'
            }}
          >
            <History size={16} />
            Immutable Audit Trail
          </button>
        </div>

        {/* Tab 1: Verified Credentials */}
        {activeSubTab === 'credentials' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Identity & Caste Profile */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    ST Community & Domicile
                  </h4>
                  <span className="badge badge-success">Verified</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
                    <strong>{student.fullName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tribe Community:</span>
                    <strong>{student.tribeCommunityName} (Scheduled Tribe)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Caste Cert No:</span>
                    <code>{student.casteCertificateNumber}</code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Domicile State/Dist:</span>
                    <strong>{student.domicileDistrict}, {student.domicileState} ({student.pincode})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Declared Family Income:</span>
                    <strong className="tabular-nums">₹{student.familyIncomeAnnual.toLocaleString('en-IN')} / year</strong>
                  </div>
                </div>
              </div>

              {/* DigiLocker Vault Badges */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                    DigiLocker Cryptographic Vault
                  </h4>
                  <span className="badge badge-info">SHA-256 Validated</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {student.verifiedDocuments.map((doc) => (
                    <div key={doc.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--gov-navy-950)' }}>
                          {doc.docType.replace(/_/g, ' ')}
                        </strong>
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                          {doc.verificationSource}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Doc #{doc.docNumber} • Issued by {doc.issuedBy}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                        Hash: {doc.verificationHash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Applications & Transparent Decisions */}
        {activeSubTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {displayApps.map((app) => (
              <div key={app.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gov-navy-900)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="badge badge-neutral">ID: {app.id}</span>
                      <span className="badge badge-info">{app.schemeCode}</span>
                      <StageBadge stage={app.currentStage} size="sm" />
                      <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '0.72rem', fontWeight: 600 }}>
                        Policy v{app.evaluatedPolicyVersion || '2025-26'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: '0 0 0.2rem 0', fontWeight: 700 }}>
                      {app.schemeName}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {app.courseName} • {app.institutionName} • Submitted on {new Date(app.submissionDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Decision Explanation Triggers */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setSelectedAppForExplanation(app);
                        setExplanationMode('eligibility');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <ShieldCheck size={14} color="var(--gov-navy-900)" />
                      <span>Explain My Decision</span>
                    </button>

                    {app.schemeCode === 'NFST' && (
                      <button
                        onClick={() => {
                          setSelectedAppForExplanation(app);
                          setExplanationMode('ranking');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Award size={14} />
                        <span>Explain My Rank</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mini Metric Strip */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  marginTop: '0.5rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Academic Normalized: </span>
                    <strong style={{ color: 'var(--gov-green-700)' }}>
                      {app.declaredPercentage || 78.4}% [AICTE Gazette]
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Eligibility Result: </span>
                    <strong style={{ color: app.isEligibilitySatisfied ? 'var(--gov-green-700)' : 'var(--gov-saffron-700)' }}>
                      {app.isEligibilitySatisfied ? 'ELIGIBLE' : 'REVIEW REQUIRED'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Selection Quota: </span>
                    <strong>{app.schemeCode === 'NFST' ? 'Ranked #37 (General ST)' : 'Under Review'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Academic */}
        {activeSubTab === 'academic' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Current Academic Enrolment & Institution
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course / Degree</div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)' }}>{student.currentAcademic.courseName}</strong>
                {student.currentAcademic.specialization && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Specialization: {student.currentAcademic.specialization}
                  </div>
                )}
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Institution (AISHE Verified)</div>
                <strong style={{ fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{student.currentAcademic.institutionName}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  AISHE Code: <code>{student.currentAcademic.institutionAisheCode}</code> • {student.currentAcademic.institutionState}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrolment & Performance</div>
                <div style={{ marginTop: '0.25rem' }}>
                  Roll No: <strong>{student.currentAcademic.enrolmentNumber}</strong> (Year {student.currentAcademic.currentYearOfStudy})
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  Qualifying Score: <strong className="tabular-nums" style={{ color: 'var(--gov-green-700)' }}>{student.currentAcademic.previousYearScorePercentage}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Past Awards */}
        {activeSubTab === 'past_awards' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Lifetime MoTA Award & Fellowship History
            </h4>

            {student.pastAwards.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {student.pastAwards.map((award) => (
                  <div key={award.awardId} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-success">{award.schemeCode}</span>
                          <strong style={{ fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{award.schemeName}</strong>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                          {award.course} • {award.institutionName} ({award.academicYear})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Sanction Order: <code>{award.sanctionOrderNumber}</code>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount Disbursed</div>
                        <div className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gov-green-700)' }}>
                          ₹{award.totalAmountDisbursed.toLocaleString('en-IN')}
                        </div>
                        <span className="badge badge-neutral" style={{ marginTop: '0.25rem' }}>
                          Status: {award.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No prior scholarship or fellowship records found under this Case ID.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Banking & NPCI */}
        {activeSubTab === 'banking' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Aadhaar NPCI Seeding & Bank Direct Benefit Transfer (DBT) Status
              </h4>
              <span className="badge badge-success">NPCI Bridge Active</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Bank & Branch Name</div>
                <strong style={{ fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{student.bankDetails.bankName}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  Account: <code>{student.bankDetails.accountNumberMasked}</code>
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>IFSC & Routing</div>
                <strong style={{ fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{student.bankDetails.ifscCode}</strong>
                <div style={{ color: 'var(--gov-green-700)', fontSize: '0.82rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  ✓ Aadhaar NPCI Mapper Seeding: ACTIVE
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>PFMS Validation Status</div>
                <div style={{ marginTop: '0.25rem', color: 'var(--gov-green-700)', fontWeight: 700 }}>
                  ✓ Bank Account Approved for DBT Direct Credit
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Immutable Audit Trail */}
        {activeSubTab === 'audit' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Complete Case File Audit Trail
              </h4>
              <span className="badge badge-info">Cryptographically Logged</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Application Submitted [USER]</strong>
                  <span style={{ color: 'var(--text-muted)' }}>18 Sep 2026, 09:42 IST</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Candidate submitted application for NFST Fellowship under Policy v2025-26.
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Document Extraction & Consistency Check [AI]</strong>
                  <span style={{ color: 'var(--text-muted)' }}>18 Sep 2026, 09:44 IST</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  OCR extracted ST Caste Certificate (Munda Tribe) & Post-Graduation Marksheet (78.4%).
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Deterministic Eligibility Engine Run [SYSTEM]</strong>
                  <span style={{ color: 'var(--text-muted)' }}>18 Sep 2026, 09:45 IST</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  All statutory criteria (ST Category, Income Ceiling &lt;= 6L, Marks &gt;= 55%) evaluated PASS.
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Institution Nodal Officer Scrutiny [HUMAN]</strong>
                  <span style={{ color: 'var(--text-muted)' }}>19 Sep 2026, 11:30 IST</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Officer Dr. B. K. Soren endorsed candidate case file and forwarded to Central Fellowship Cell.
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Merit Selection Rank Assigned [SYSTEM]</strong>
                  <span style={{ color: 'var(--text-muted)' }}>22 Sep 2026, 14:00 IST</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Rank #37 allocated under 750 central quota seats. Sanction order generated.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explain Decision & Explain Rank Modal */}
        {selectedAppForExplanation && (
          <ExplainDecisionModal
            application={selectedAppForExplanation}
            defaultTab={explanationMode}
            onClose={() => setSelectedAppForExplanation(null)}
          />
        )}
      </div>
    </div>
  );
};
