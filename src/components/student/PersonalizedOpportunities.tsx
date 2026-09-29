import React, { useState } from 'react';
import { SchemeConfig } from '../../types';
import { OnboardingProfileData } from './StudentOnboarding';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Globe2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
  Landmark,
  CreditCard,
  Building2,
  Info
} from 'lucide-react';

import { OpportunityMatchDetailsModal } from '../modals/OpportunityMatchDetailsModal';

interface PersonalizedOpportunitiesProps {
  profileData: OnboardingProfileData | null;
  schemes: SchemeConfig[];
  onSelectScheme: (scheme: SchemeConfig) => void;
  onApplyScheme: (scheme: SchemeConfig) => void;
  onRetakeQuestionnaire: () => void;
}

export const PersonalizedOpportunities: React.FC<PersonalizedOpportunitiesProps> = ({
  profileData,
  schemes,
  onSelectScheme,
  onApplyScheme,
  onRetakeQuestionnaire
}) => {
  const [openWhyMap, setOpenWhyMap] = useState<Record<string, boolean>>({});
  const [detailedMatchScheme, setDetailedMatchScheme] = useState<SchemeConfig | null>(null);

  const toggleWhy = (schemeId: string) => {
    setOpenWhyMap(prev => ({ ...prev, [schemeId]: !prev[schemeId] }));
  };

  // Calculate matching relevance for each scheme based on profileData
  const getSchemeMatchDetails = (scheme: SchemeConfig) => {
    const isSchool = profileData?.educationStage === 'SCHOOL';
    const isPreMatricClass = profileData?.schoolClass === 'Class IX' || profileData?.schoolClass === 'Class X';
    const isPostMatricSchoolClass = profileData?.schoolClass === 'Class XI' || profileData?.schoolClass === 'Class XII';
    const isCollege = profileData?.educationStage === 'COLLEGE';
    const isResearch = profileData?.educationStage === 'RESEARCH';
    const isOverseas = profileData?.educationStage === 'OVERSEAS';

    const income = profileData?.familyIncomeAnnual || 200000;
    const isIncomeUnder25L = income <= 250000;
    const isIncomeUnder6L = income <= 600000;

    // 1. PRE-MATRIC
    if (scheme.category === 'PRE_MATRIC' || scheme.code === 'PRE_MATRIC_ST' || scheme.name.toLowerCase().includes('pre matric') || scheme.name.toLowerCase().includes('pre-matric')) {
      if (isSchool && isPreMatricClass) {
        return {
          isPrimaryMatch: true,
          relevance: 'HIGH',
          badgeText: 'Primary Recommended Scheme',
          badgeClass: 'badge-orange',
          reason: `You selected ${profileData?.schoolClass || 'Class IX/X'} in school education under Scheduled Tribe (ST) category in ${profileData?.district || 'your district'}, ${profileData?.state || 'your state'}.`,
          incomeStatus: isIncomeUnder25L ? '✓ Family income meets the ≤ ₹2.50 Lakh/yr ceiling' : '⚠ Requires income verification (Ceiling: ₹2.50L)',
          actionLabel: 'Continue to Pre-Matric Application'
        };
      }
      return {
        isPrimaryMatch: false,
        relevance: 'LOW',
        badgeText: 'School Level (Classes IX–X)',
        badgeClass: 'badge-neutral',
        reason: 'This scheme is specifically for school students studying in Class IX and Class X.',
        incomeStatus: 'Income ceiling: ≤ ₹2.50 Lakh/yr',
        actionLabel: 'View Scheme Details'
      };
    }

    // 2. POST-MATRIC
    if (scheme.category === 'POST_MATRIC' || scheme.code === 'POST_MATRIC_ST' || scheme.name.toLowerCase().includes('post matric') || scheme.name.toLowerCase().includes('post-matric')) {
      if ((isSchool && isPostMatricSchoolClass) || isCollege) {
        return {
          isPrimaryMatch: true,
          relevance: 'HIGH',
          badgeText: 'Primary Recommended Scheme',
          badgeClass: 'badge-primary',
          reason: `You selected ${isSchool ? profileData?.schoolClass : profileData?.courseLevel || 'Higher Education'} (${profileData?.courseName || 'College'}) in ${profileData?.state || 'your state'}.`,
          incomeStatus: isIncomeUnder25L ? '✓ Family income meets the ≤ ₹2.50 Lakh/yr ceiling' : '⚠ Requires income verification (Ceiling: ₹2.50L)',
          actionLabel: 'Continue to Post-Matric Application'
        };
      }
      return {
        isPrimaryMatch: false,
        relevance: 'LOW',
        badgeText: 'Post-Class X Studies',
        badgeClass: 'badge-neutral',
        reason: 'Intended for students in Class XI, XII, ITI, Diploma, Undergraduate, and Postgraduate courses.',
        incomeStatus: 'Income ceiling: ≤ ₹2.50 Lakh/yr',
        actionLabel: 'View Scheme Details'
      };
    }

    // 3. NATIONAL SCHOLARSHIP (TOP CLASS)
    if (scheme.category === 'TOP_CLASS' || scheme.code === 'TOP_CLASS_ST' || scheme.name.toLowerCase().includes('top class') || scheme.name.toLowerCase().includes('national scholarship')) {
      if (isCollege) {
        return {
          isPrimaryMatch: false,
          relevance: 'MEDIUM',
          badgeText: 'Premier Institute Pathway',
          badgeClass: 'badge-info',
          reason: 'Applicable if your college/university is in the Ministry notified list of 259+ premier institutes (e.g. IITs, NITs, IIMs, AIIMS, Central Universities).',
          incomeStatus: isIncomeUnder6L ? '✓ Family income meets the ≤ ₹6.00 Lakh/yr ceiling' : '⚠ Income limit: ≤ ₹6.00L',
          actionLabel: 'Check Institute & Apply'
        };
      }
      return {
        isPrimaryMatch: false,
        relevance: 'LOW',
        badgeText: 'Premier Higher Education',
        badgeClass: 'badge-neutral',
        reason: 'Supports ST students admitted into notified premier higher educational institutions across India.',
        incomeStatus: 'Income ceiling: ≤ ₹6.00 Lakh/yr',
        actionLabel: 'View Scheme Details'
      };
    }

    // 4. NATIONAL FELLOWSHIP (NFST)
    if (scheme.category === 'HIGHER_EDUCATION_FELLOWSHIP' || scheme.code === 'NFST_FELLOWSHIP' || scheme.name.toLowerCase().includes('fellowship') || scheme.name.toLowerCase().includes('nfst')) {
      if (isResearch || (isCollege && profileData?.courseLevel === 'Postgraduate')) {
        return {
          isPrimaryMatch: isResearch,
          relevance: 'HIGH',
          badgeText: isResearch ? 'Primary Recommended Fellowship' : 'Eligible for Doctoral Admission',
          badgeClass: 'badge-maroon',
          reason: `You indicated interest or enrollment in ${profileData?.researchLevel || 'Doctoral/Ph.D.'} research in ${profileData?.courseName || 'Higher Studies'}.${profileData?.hasUgcNetOrCsir ? ' (UGC-NET qualified - bonus merit)' : ''}`,
          incomeStatus: isIncomeUnder6L ? '✓ Family income meets the ≤ ₹6.00 Lakh/yr ceiling' : '⚠ Income limit: ≤ ₹6.00L',
          actionLabel: 'Continue to Fellowship Application'
        };
      }
      return {
        isPrimaryMatch: false,
        relevance: 'LOW',
        badgeText: 'M.Phil / Ph.D. Research',
        badgeClass: 'badge-neutral',
        reason: 'Provides monthly stipends (₹37,000/mo JRF / ₹42,000/mo SRF) for regular and full-time M.Phil & Ph.D. scholars.',
        incomeStatus: 'Income ceiling: ≤ ₹6.00 Lakh/yr',
        actionLabel: 'View Scheme Details'
      };
    }

    // 5. NATIONAL OVERSEAS (NOS)
    if (scheme.category === 'OVERSEAS_STUDIES' || scheme.code === 'NOS_OVERSEAS' || scheme.name.toLowerCase().includes('overseas') || scheme.name.toLowerCase().includes('abroad')) {
      if (isOverseas) {
        return {
          isPrimaryMatch: true,
          relevance: 'HIGH',
          badgeText: 'Primary Overseas Pathway',
          badgeClass: 'badge-gold',
          reason: `You selected foreign degree studies (${profileData?.overseasLevel || 'Master\'s/Ph.D. Abroad'}). Covers 100% tuition, airfare, and annual living allowance.`,
          incomeStatus: isIncomeUnder6L ? '✓ Family income meets the ≤ ₹6.00 Lakh/yr ceiling' : '⚠ Income limit: ≤ ₹6.00L',
          actionLabel: 'Continue to Overseas Application'
        };
      }
      return {
        isPrimaryMatch: false,
        relevance: 'LOW',
        badgeText: 'Study Abroad (Master\'s / Ph.D.)',
        badgeClass: 'badge-neutral',
        reason: 'Supports 20 meritorious ST candidates annually for higher studies abroad in QS Top 1000 universities.',
        incomeStatus: 'Income ceiling: ≤ ₹6.00 Lakh/yr',
        actionLabel: 'View Scheme Details'
      };
    }

    return {
      isPrimaryMatch: false,
      relevance: 'GENERAL',
      badgeText: 'General ST Scheme',
      badgeClass: 'badge-neutral',
      reason: 'General educational support scheme administered by Ministry of Tribal Affairs.',
      incomeStatus: 'Check official guidelines',
      actionLabel: 'View Scheme Details'
    };
  };

  // Sort schemes so high-relevance and primary matches appear first
  const sortedSchemes = [...schemes].sort((a, b) => {
    const matchA = getSchemeMatchDetails(a);
    const matchB = getSchemeMatchDetails(b);
    if (matchA.isPrimaryMatch && !matchB.isPrimaryMatch) return -1;
    if (!matchA.isPrimaryMatch && matchB.isPrimaryMatch) return 1;
    if (matchA.relevance === 'HIGH' && matchB.relevance !== 'HIGH') return -1;
    if (matchA.relevance !== 'HIGH' && matchB.relevance === 'HIGH') return 1;
    return 0;
  });

  const primaryScheme = sortedSchemes.find(s => getSchemeMatchDetails(s).isPrimaryMatch) || sortedSchemes[0];
  const primaryMatchDetails = primaryScheme ? getSchemeMatchDetails(primaryScheme) : null;

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>

        {/* Page Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: '1.25rem', 
          marginBottom: '2rem' 
        }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              color: 'var(--secondary-maroon)', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em',
              marginBottom: '0.35rem'
            }}>
              <Landmark size={15} />
              Ministry of Tribal Affairs • Smart Routing Results
            </div>
            
            <h1 style={{ fontSize: '2.1rem', color: 'var(--primary-navy)', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
              Opportunities for You
            </h1>
            
            <p style={{ fontSize: '0.96rem', color: 'var(--muted-text)', margin: 0 }}>
              Based on the information you provided, these opportunities may be relevant to you.
            </p>
          </div>

          <button
            onClick={onRetakeQuestionnaire}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}
          >
            <Sliders size={14} />
            <span>Update Profile / Answers</span>
          </button>
        </div>

        {/* Profile Snapshot Strip */}
        {profileData && (
          <div style={{ 
            padding: '1rem 1.35rem', 
            marginBottom: '2rem', 
            backgroundColor: 'var(--surface)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text)' }}>
              <strong>Profile:</strong> {profileData.fullName || 'Student Applicant'} • {profileData.educationStage === 'SCHOOL' ? profileData.schoolClass : profileData.courseLevel || profileData.educationStage} • {profileData.district}, {profileData.state} • Score: <strong>{profileData.percentageScore}%</strong> • Income: <strong>₹{profileData.familyIncomeAnnual.toLocaleString('en-IN')}/yr</strong>
            </div>

            <span className="badge badge-success" style={{ fontWeight: 600 }}>
              ✓ Intake Recorded
            </span>
          </div>
        )}

        {/* PRIMARY "YOUR NEXT STEP" BANNER (DIRECT ROUTING) */}
        {primaryScheme && primaryMatchDetails?.isPrimaryMatch && (
          <div style={{ 
            backgroundColor: 'var(--primary-navy)', 
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '6px solid var(--accent-gold)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  backgroundColor: 'rgba(176, 138, 62, 0.25)', 
                  color: '#FFFFFF', 
                  border: '1px solid var(--accent-gold)', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem'
                }}>
                  Recommended Primary Pathway
                </span>
                <h2 style={{ fontSize: '1.45rem', color: '#FFFFFF', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                  {primaryScheme.name}
                </h2>
              </div>

              <button
                onClick={() => onApplyScheme(primaryScheme)}
                className="btn btn-gold"
                style={{ fontWeight: 700, padding: '0.65rem 1.5rem' }}
              >
                <span>{primaryMatchDetails.actionLabel} →</span>
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 1rem 0', lineHeight: 1.55 }}>
              {primaryScheme.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              flexWrap: 'wrap', 
              fontSize: '0.82rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.15)', 
              paddingTop: '0.75rem' 
            }}>
              <div>
                <strong>Funding:</strong> 100% Central / Shared DBT
              </div>
              <div>
                <strong>Status:</strong> {primaryMatchDetails.incomeStatus}
              </div>
              <div 
                onClick={() => setDetailedMatchScheme(primaryScheme)}
                style={{ 
                  color: 'var(--accent-gold)', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem',
                  marginLeft: 'auto'
                }}
              >
                <HelpCircle size={14} />
                <span>Why am I seeing this? (View Matching Details)</span>
              </div>
            </div>

            {openWhyMap[primaryScheme.id] && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.85rem 1rem', 
                backgroundColor: 'rgba(0, 0, 0, 0.25)', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '0.84rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: 'var(--accent-gold)' }}>
                  Why this opportunity is recommended for you:
                </div>
                <div>{primaryMatchDetails.reason}</div>
              </div>
            )}
          </div>
        )}

        {/* ALL OPPORTUNITIES LIST */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', margin: '0 0 1.25rem 0', fontWeight: 700 }}>
            All Configured Tribal Opportunities
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sortedSchemes.map((scheme) => {
            const matchInfo = getSchemeMatchDetails(scheme);
            const isWhyOpen = openWhyMap[scheme.id];

            return (
              <div 
                key={scheme.id}
                className="card"
                style={{ 
                  padding: '1.5rem 1.75rem', 
                  borderRadius: 'var(--radius-md)',
                  border: matchInfo.isPrimaryMatch ? '2px solid var(--primary-navy)' : '1px solid var(--border)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${matchInfo.badgeClass}`}>
                        {matchInfo.badgeText}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                        • Ministry of Tribal Affairs
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
                      {scheme.name}
                    </h4>

                    <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                      {scheme.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <button
                      onClick={() => onSelectScheme(scheme)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 600 }}
                    >
                      View Scheme
                    </button>

                    <button
                      onClick={() => onApplyScheme(scheme)}
                      className="btn btn-primary btn-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Apply Online →
                    </button>
                  </div>
                </div>

                {/* Benefits & Eligibility Preview Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--surface-muted)',
                  borderRadius: 'var(--radius-sm)',
                  margin: '1rem 0 0.75rem 0',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>Financial Assistance: </span>
                    <strong style={{ color: 'var(--text)' }}>
                      {scheme.financialBenefits?.stipendMonthly 
                        ? `Stipend: ₹${scheme.financialBenefits.stipendMonthly.toLocaleString('en-IN')}/mo` 
                        : scheme.financialBenefits?.tuitionFeeCapAnnual 
                        ? `Tuition Fee: up to ₹${scheme.financialBenefits.tuitionFeeCapAnnual.toLocaleString('en-IN')}/yr`
                        : 'Full Tuition + Maintenance DBT'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>Eligibility Rule: </span>
                    <strong style={{ color: 'var(--text)' }}>{matchInfo.incomeStatus}</strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>Mode: </span>
                    <strong style={{ color: 'var(--text)' }}>Direct Benefit Transfer (DBT)</strong>
                  </div>
                </div>

                {/* "Why am I seeing this?" Trigger & Expandable Content */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => toggleWhy(scheme.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--primary-navy)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Info size={14} color="var(--primary-navy)" />
                    <span>Quick Summary</span>
                    {isWhyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailedMatchScheme(scheme)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--secondary-maroon)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'underline'
                    }}
                  >
                    <HelpCircle size={14} />
                    <span>Why am I seeing this? (View Matching Details)</span>
                  </button>
                </div>

                {isWhyOpen && (
                  <div style={{
                    marginTop: '0.6rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--navy-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.84rem',
                    color: 'var(--text)',
                    lineHeight: 1.55
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
                      Matching Factor Explanation:
                    </div>
                    <div>{matchInfo.reason}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)', marginTop: '0.4rem' }}>
                      * Note: This preliminary pathway recommendation is based on your profile answers. Formal sanction is subject to document verification and official scheme quota rules.
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* DBT & Payment Tracking Card */}
        <div style={{ 
          marginTop: '2.5rem', 
          padding: '1.5rem 1.75rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'var(--gold-subtle)', 
              color: 'var(--accent-gold)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              <CreditCard size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)', margin: '0 0 0.2rem 0', fontWeight: 700 }}>
                Direct Benefit Transfer (DBT) & Payment Tracking
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted-text)', margin: 0 }}>
                All approved scholarships and research stipends are credited directly into your Aadhaar-seeded bank account.
              </p>
            </div>
          </div>

          <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
            PFMS Integration-Ready (Demonstration Mode)
          </span>
        </div>

        {/* Opportunity Matching Details Modal */}
        {detailedMatchScheme && (
          <OpportunityMatchDetailsModal
            scheme={detailedMatchScheme}
            profileData={profileData}
            onClose={() => setDetailedMatchScheme(null)}
            onApply={onApplyScheme}
          />
        )}

      </div>
    </div>
  );
};
