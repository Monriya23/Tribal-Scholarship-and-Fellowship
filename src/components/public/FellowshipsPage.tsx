import React from 'react';
import { SchemeConfig } from '../../types';
import { FlaskConical, Globe2, Award, CheckCircle2, ArrowRight, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

interface FellowshipsPageProps {
  schemes: SchemeConfig[];
  onSelectScheme: (scheme: SchemeConfig) => void;
  onApplyScheme: (scheme: SchemeConfig) => void;
}

export const FellowshipsPage: React.FC<FellowshipsPageProps> = ({
  schemes,
  onSelectScheme,
  onApplyScheme
}) => {
  const fellowshipSchemes = schemes.filter(s => 
    s.category === 'HIGHER_EDUCATION_FELLOWSHIP' || s.category === 'OVERSEAS_STUDIES'
  );

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container">
        {/* =========================================================================
            1. PAGE HEADER + LARGE REAL PHOTO 3 (Research & Convocation)
            ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '2.25rem 2.5rem',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(92, 36, 25, 0.06)'
        }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              color: 'var(--forest-green)', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '0.65rem',
              backgroundColor: 'var(--green-subtle)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(23, 107, 58, 0.2)'
            }}>
              <Award size={16} />
              Research • Higher Education • Opportunity
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', 
              color: 'var(--primary-maroon)', 
              margin: '0 0 0.85rem 0', 
              fontWeight: 900,
              lineHeight: 1.2
            }}>
              National Fellowships & Overseas Opportunities
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.65 }}>
              Prestigious national research fellowships and international scholarship awards providing full financial assistance to Scheduled Tribe scholars pursuing M.Phil, Ph.D., and postgraduate research across premier Indian and global institutions.
            </p>
          </div>

          {/* LARGE REAL PHOTO 3 */}
          <div style={{ 
            position: 'relative', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: '2px solid var(--border)', 
            maxHeight: '260px',
            backgroundColor: 'var(--surface-muted)',
            boxShadow: '0 8px 24px rgba(92, 36, 25, 0.1)'
          }}>
            <img 
              src="/setu_photo_3_fellowship.png" 
              alt="Scheduled Tribe university graduates and research scholars in convocation gowns and graduation caps with ceremonial stoles"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(70, 27, 19, 0.92)',
              backdropFilter: 'blur(4px)',
              padding: '0.65rem 1.15rem',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--mustard-gold)'
            }}>
              <span>National Fellowships & Research Felicitations</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--mustard-gold)' }}>MoTA National Grants</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. RESEARCH & DOCTORAL CONTEXT CARDS
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {fellowshipSchemes.map((scheme) => {
            const isOverseas = scheme.category === 'OVERSEAS_STUDIES';
            const accentColor = isOverseas ? 'var(--terracotta)' : 'var(--mustard-gold)';
            const headerColor = 'var(--primary-maroon)';
            
            return (
              <div 
                key={scheme.id}
                className="card"
                style={{
                  padding: '2.25rem',
                  borderTop: `4px solid ${accentColor}`,
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">
                        {scheme.code}
                      </span>
                      <span className="badge badge-success">
                        {isOverseas ? '20 Annual Slots' : '750 Annual Slots'}
                      </span>
                      <span className="badge badge-neutral">
                        {isOverseas ? 'International Studies' : 'National Doctoral Research'}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', color: headerColor, margin: '0.35rem 0', fontWeight: 800 }}>
                      {scheme.name}
                    </h2>
                    <p style={{ fontSize: '0.96rem', color: 'var(--muted-text)', margin: '0.35rem 0 0 0', maxWidth: '850px', lineHeight: 1.6 }}>
                      {scheme.description}
                    </p>
                  </div>

                  <div style={{ 
                    textAlign: 'right', 
                    backgroundColor: 'var(--background)', 
                    padding: '0.85rem 1.25rem', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Financial Entitlement
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-maroon)', marginTop: '0.15rem' }}>
                      {isOverseas ? 'Full Tuition + Living Allowance' : '₹37,000 to ₹42,000 / mo'}
                    </div>
                  </div>
                </div>

                {/* Key Fellowship Details Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '1.15rem', 
                  padding: '1.35rem', 
                  backgroundColor: 'var(--background)', 
                  borderRadius: 'var(--radius-sm)', 
                  marginBottom: '1.5rem', 
                  border: '1px solid var(--border)' 
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                      Target Cohort
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {isOverseas ? 'ST students with admitted offer in Top 500 QS global universities' : 'ST candidates registered for regular full-time M.Phil / Ph.D in recognized Indian universities'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                      Duration & Tenure
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {isOverseas ? '1 to 3 Years (Course duration for Masters/Ph.D)' : 'Up to 5 Years (2 Years JRF + 3 Years SRF upon evaluation)'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                      Selection Mechanism
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {isOverseas ? 'Strict QS Ranking criteria & Ministry Selection Committee' : 'Merit ranking based on post-graduate marks & reservation slots'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                      Disbursement Channel
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--forest-green)' }}>
                      Direct Benefit Transfer (DBT) via PFMS Electronic Transfer
                    </strong>
                  </div>
                </div>

                {/* Action CTAs */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="btn btn-secondary"
                    style={{ fontWeight: 600 }}
                  >
                    View Guidelines & Eligibility
                  </button>
                  <button
                    onClick={() => onApplyScheme(scheme)}
                    className="btn btn-primary"
                    style={{ fontWeight: 700 }}
                  >
                    Apply for Fellowship →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

