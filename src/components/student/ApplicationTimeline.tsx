import React, { useState } from 'react';
import { ApplicationRecord } from '../../types';
import { StageBadge } from '../common/StageBadge';
import { useLanguage } from '../../services/languageService';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Circle, 
  Building2, 
  Landmark, 
  Award, 
  CreditCard,
  FileCheck,
  UserCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface ApplicationTimelineProps {
  application: ApplicationRecord | null;
  onSelectAnotherApp?: () => void;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ application }) => {
  const { t } = useLanguage();
  const [showWhyResult, setShowWhyResult] = useState(false);

  if (!application) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <Clock size={48} color="var(--gov-navy-700)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)' }}>No Application Selected</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please select an application from your dashboard to view its tracking timeline.</p>
        </div>
      </div>
    );
  }

  // Define the standardized 6 high-level milestones for student clarity
  const milestones = [
    {
      id: 'SUBMITTED',
      title: 'Application Submitted',
      description: 'Application form filled and submitted by applicant.',
      date: '14 Sep 2026',
      status: 'COMPLETED'
    },
    {
      id: 'DOCUMENTS',
      title: 'Documents Checked',
      description: 'Certificates and identity documents checked.',
      date: '16 Sep 2026',
      status: 'COMPLETED'
    },
    {
      id: 'INSTITUTION',
      title: 'Institution Verification',
      description: 'Verified by your college / university nodal desk.',
      date: '20 Sep 2026',
      status: 'COMPLETED'
    },
    {
      id: 'MINISTRY',
      title: 'Ministry Review',
      description: 'Under examination by the Ministry of Tribal Affairs scrutiny cell.',
      date: 'Current Stage',
      status: application.currentStage === 'DEFICIENT' ? 'ATTENTION' : 'IN_PROGRESS'
    },
    {
      id: 'SELECTION',
      title: 'Merit Selection & Ranking',
      description: 'Merit ranking and slot allocation as per scheme guidelines.',
      date: 'Expected in 7-10 days',
      status: 'PENDING'
    },
    {
      id: 'AWARD',
      title: 'Sanction & Award Disbursement',
      description: 'Award letter generated and funds sent via Direct Benefit Transfer.',
      date: 'Upcoming',
      status: 'PENDING'
    }
  ];

  const getStatusText = () => {
    switch (application.currentStage) {
      case 'INSTITUTION_VERIFICATION':
        return 'Your application is currently under Institution Verification with your college.';
      case 'STATE_VERIFICATION':
        return 'Your application is currently with the State Tribal Welfare Department.';
      case 'MINISTRY_SCRUTINY':
        return 'Your application is currently under Ministry Review.';
      case 'DEFICIENT':
        return 'Action Required: A document update has been requested.';
      case 'SANCTION_AWARD':
      case 'DBT_PFMS_DISBURSEMENT':
        return 'Your scholarship has been approved and is being processed for payment.';
      default:
        return 'Your application is being processed.';
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header Summary */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '6px solid var(--gov-navy-900)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-neutral" style={{ fontWeight: 600 }}>App ID: {application.id}</span>
                <span className="badge badge-info" style={{ fontWeight: 700 }}>{application.schemeCode}</span>
              </div>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0', fontWeight: 800 }}>
                {application.schemeName}
              </h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Applicant: <strong>{application.applicantName}</strong> • {application.institutionName}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</div>
              <div style={{ marginTop: '0.35rem' }}>
                <StageBadge stage={application.currentStage} size="lg" />
              </div>
            </div>
          </div>

          {/* Current Status Banner */}
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', backgroundColor: application.currentStage === 'DEFICIENT' ? 'var(--gov-red-50)' : 'var(--gov-saffron-50)', borderRadius: '8px', borderLeft: `4px solid ${application.currentStage === 'DEFICIENT' ? 'var(--gov-red-600)' : 'var(--gov-saffron-500)'}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Info size={20} color={application.currentStage === 'DEFICIENT' ? 'var(--gov-red-700)' : 'var(--gov-saffron-600)'} />
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gov-navy-950)' }}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* 6-Stage Visual Timeline */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <Clock size={22} color="var(--gov-navy-900)" />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 800 }}>
              Application Progress Timeline
            </h2>
          </div>

          <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
            {/* Vertical Connecting Line */}
            <div style={{
              position: 'absolute',
              left: '17px',
              top: '15px',
              bottom: '15px',
              width: '3px',
              backgroundColor: 'var(--border-medium)',
              zIndex: 0
            }} />

            {milestones.map((step, idx) => {
              const isDone = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              const isAttention = step.status === 'ATTENTION';

              let nodeBg = '#ffffff';
              let nodeBorder = 'var(--border-medium)';
              let nodeColor = 'var(--text-muted)';

              if (isDone) {
                nodeBg = 'var(--gov-green-600)';
                nodeBorder = 'var(--gov-green-600)';
                nodeColor = '#ffffff';
              } else if (isInProgress) {
                nodeBg = 'var(--gov-saffron-500)';
                nodeBorder = 'var(--gov-saffron-500)';
                nodeColor = '#ffffff';
              } else if (isAttention) {
                nodeBg = 'var(--gov-red-600)';
                nodeBorder = 'var(--gov-red-600)';
                nodeColor = '#ffffff';
              }

              return (
                <div key={idx} style={{ position: 'relative', marginBottom: '1.75rem', zIndex: 1 }}>
                  {/* Node Circle */}
                  <div style={{
                    position: 'absolute',
                    left: '-2.5rem',
                    top: '2px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: nodeBg,
                    border: `3px solid ${nodeBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: nodeColor,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {isDone ? (
                      <CheckCircle2 size={18} />
                    ) : isAttention ? (
                      <AlertTriangle size={18} />
                    ) : isInProgress ? (
                      <Clock size={18} />
                    ) : (
                      <Circle size={14} />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div style={{
                    padding: '1.15rem 1.35rem',
                    backgroundColor: isInProgress ? 'var(--gov-saffron-50)' : isAttention ? 'var(--gov-red-50)' : isDone ? '#ffffff' : 'var(--bg-muted)',
                    borderRadius: '10px',
                    border: isInProgress ? '1.5px solid var(--gov-saffron-500)' : isAttention ? '1.5px solid var(--gov-red-500)' : '1px solid var(--border-light)',
                    boxShadow: isInProgress ? 'var(--shadow-sm)' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem', color: isAttention ? 'var(--gov-red-700)' : 'var(--gov-navy-950)', fontWeight: 700 }}>
                        {step.title}
                      </strong>
                      <span className={`badge ${isDone ? 'badge-success' : isInProgress ? 'badge-warning' : isAttention ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '0.72rem' }}>
                        {isDone ? 'Verified' : isInProgress ? 'In Progress' : isAttention ? 'Action Required' : 'Upcoming'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
                      {step.description}
                    </p>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.45rem', fontWeight: 600 }}>
                      {step.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Selection: "Why this result?" Feature */}
        <div className="card" style={{ padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid var(--border-medium)', backgroundColor: '#ffffff' }}>
          <div 
            onClick={() => setShowWhyResult(!showWhyResult)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--gov-green-50)', color: 'var(--gov-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 700 }}>
                  Understanding Selection & Ranking Criteria
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Learn how your application is evaluated and ranked under official scheme guidelines.
                </div>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{showWhyResult ? 'Hide Details' : 'View Breakdown'}</span>
              {showWhyResult ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showWhyResult && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Your ranking is calculated using the official eligibility and selection criteria defined in the Ministry guidelines:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Score</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', display: 'block', marginTop: '0.2rem' }}>
                    84.5% (Qualifying Merit)
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>✓ Meets minimum requirement</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Income Eligibility</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', display: 'block', marginTop: '0.2rem' }}>
                    Eligible Category
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>✓ Within scheme ceiling</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Community Preference</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', display: 'block', marginTop: '0.2rem' }}>
                    Scheduled Tribe (ST)
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>✓ 100% Reserved Slot</div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--gov-green-50)', borderRadius: '8px', borderLeft: '4px solid var(--gov-green-600)', fontSize: '0.85rem', color: 'var(--gov-green-900)', lineHeight: 1.5 }}>
                <strong>Summary: </strong> Your application satisfies all fundamental eligibility benchmarks and is queued in order of merit. Official selection lists are published on the portal following committee approval.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
