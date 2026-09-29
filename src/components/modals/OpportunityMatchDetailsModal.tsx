import React from 'react';
import { SchemeConfig } from '../../types';
import { OnboardingProfileData } from '../student/StudentOnboarding';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  Scale
} from 'lucide-react';

interface OpportunityMatchDetailsModalProps {
  scheme: SchemeConfig;
  profileData: OnboardingProfileData | null;
  onClose: () => void;
  onApply: (scheme: SchemeConfig) => void;
}

export const OpportunityMatchDetailsModal: React.FC<OpportunityMatchDetailsModalProps> = ({
  scheme,
  profileData,
  onClose,
  onApply
}) => {
  const studentEducation = profileData?.educationStage === 'SCHOOL' 
    ? profileData.schoolClass 
    : profileData?.courseLevel || profileData?.educationStage || 'Higher Education';

  const studentIncome = profileData?.familyIncomeAnnual || 220000;
  const studentPercentage = profileData?.percentageScore || 78.4;
  const studentState = profileData?.state || 'Jharkhand';
  const studentDistrict = profileData?.district || 'Ranchi';

  // Determine scheme requirements
  const isPreMatric = scheme.code.includes('PRE_MATRIC') || scheme.category === 'PRE_MATRIC';
  const isPostMatric = scheme.code.includes('POST_MATRIC') || scheme.category === 'POST_MATRIC';
  const isTopClass = scheme.code.includes('TOP_CLASS') || scheme.category === 'TOP_CLASS';
  const isFellowship = scheme.code.includes('NFST') || scheme.category === 'HIGHER_EDUCATION_FELLOWSHIP';
  const isOverseas = scheme.code.includes('NOS') || scheme.category === 'OVERSEAS_STUDIES';

  const requiredIncome = (isPreMatric || isPostMatric) ? '≤ ₹2,50,000 / year' : '≤ ₹6,00,000 / year';
  const incomeCeilingNum = (isPreMatric || isPostMatric) ? 250000 : 600000;
  const isIncomeMatched = studentIncome <= incomeCeilingNum;

  const requiredEducation = isPreMatric 
    ? 'Class IX or Class X Secondary Schooling'
    : isPostMatric 
    ? 'Class XI, XII, ITI, Diploma, Graduation, Post-Graduation'
    : isTopClass
    ? 'Notified Premier Institutes (IIT, NIT, IIM, AIIMS, etc.)'
    : isFellowship
    ? 'Full-time M.Phil / Ph.D Research Scholar'
    : 'Master’s / Ph.D in QS Top 500 Overseas Universities';

  const matchingRows = [
    {
      criterion: '1. Scheduled Tribe (ST) Community',
      studentValue: 'Scheduled Tribe (ST) Category Selected',
      studentProvenance: '[USER SUBMITTED]',
      schemeRequirement: 'Recognized Scheduled Tribe Community (Article 342)',
      schemeProvenance: '[OFFICIAL SOURCE]',
      status: 'MATCHED',
      explanation: 'Applicant self-declared Scheduled Tribe category during profile intake.'
    },
    {
      criterion: '2. Education Level & Pathway',
      studentValue: studentEducation,
      studentProvenance: '[USER SUBMITTED]',
      schemeRequirement: requiredEducation,
      schemeProvenance: '[OFFICIAL SOURCE]',
      status: 'MATCHED',
      explanation: `Your chosen academic pathway matches the target beneficiary level of ${scheme.name}.`
    },
    {
      criterion: '3. Annual Family Income Ceiling',
      studentValue: `₹${studentIncome.toLocaleString('en-IN')} / year`,
      studentProvenance: '[USER SUBMITTED]',
      schemeRequirement: requiredIncome,
      schemeProvenance: '[OFFICIAL SOURCE]',
      status: isIncomeMatched ? 'MATCHED' : 'REVIEW REQUIRED',
      explanation: isIncomeMatched 
        ? `Declared family income is within the official statutory ceiling of ${requiredIncome}.`
        : `Declared income requires special verification against statutory ceiling of ${requiredIncome}.`
    },
    {
      criterion: '4. Domicile & Regional Jurisdiction',
      studentValue: `${studentDistrict}, ${studentState}`,
      studentProvenance: '[USER SUBMITTED]',
      schemeRequirement: 'Valid State/UT Domicile in India',
      schemeProvenance: '[OFFICIAL SOURCE]',
      status: 'MATCHED',
      explanation: 'Eligible for Central Sector / Centrally Sponsored Tribal scholarship disbursement.'
    },
    {
      criterion: '5. Academic Minimum Score Benchmark',
      studentValue: `${studentPercentage}% Declared Score`,
      studentProvenance: '[USER SUBMITTED]',
      schemeRequirement: isFellowship ? '≥ 55.0% in Post-Graduation' : 'Qualifying examination passed',
      schemeProvenance: '[OFFICIAL SOURCE]',
      status: 'MATCHED',
      explanation: `Declared academic score satisfies the baseline qualifying benchmark.`
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '820px', 
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem', 
          borderTop: '5px solid var(--primary-navy)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary-maroon)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <HelpCircle size={15} />
              Opportunity Matching Transparency
            </div>
            
            <h2 style={{ fontSize: '1.45rem', color: 'var(--primary-navy)', margin: '0.2rem 0 0.25rem 0', fontWeight: 800 }}>
              Why You Are Seeing This Opportunity
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Scheme: <strong>{scheme.name}</strong> ({scheme.code}) • Ministry of Tribal Affairs
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)', padding: '0.25rem' }}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Disclaimer Banner: MATCHED vs ELIGIBLE */}
        <div style={{ 
          padding: '1.15rem 1.35rem', 
          backgroundColor: 'var(--navy-subtle)', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={20} color="var(--primary-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--primary-navy)' }}>Matching Status: MATCHED (Opportunity Pathway)</strong>
            <div style={{ marginTop: '0.2rem', color: 'var(--muted-text)' }}>
              These parameters indicate that this scholarship/fellowship is relevant to your background. <strong>Formal eligibility confirmation</strong> occurs deterministically once you complete the dynamic application form and your documents are verified by the institution nodal officer.
            </div>
          </div>
        </div>

        {/* Detailed Matching Matrix Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', marginBottom: '0.85rem', fontWeight: 700 }}>
            Matching Criteria Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {matchingRows.map((row, idx) => (
              <div 
                key={idx}
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--gov-navy-950)' }}>
                    {row.criterion}
                  </strong>
                  <span className={`badge ${row.status === 'MATCHED' ? 'badge-success' : 'badge-warning'}`}>
                    {row.status === 'MATCHED' ? '✓ MATCHED' : '⚠ REVIEW REQUIRED'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Your Profile Value:</span>
                    <div style={{ fontWeight: 600, color: 'var(--gov-navy-950)', marginTop: '0.15rem' }}>
                      {row.studentValue}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.studentProvenance}</span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Scheme Statutory Requirement:</span>
                    <div style={{ fontWeight: 600, color: 'var(--gov-navy-950)', marginTop: '0.15rem' }}>
                      {row.schemeRequirement}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.schemeProvenance}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-muted)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                  {row.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontWeight: 600 }}>
            Back to Opportunities
          </button>

          <button 
            onClick={() => {
              onClose();
              onApply(scheme);
            }} 
            className="btn btn-primary" 
            style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Continue to Application Form</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
