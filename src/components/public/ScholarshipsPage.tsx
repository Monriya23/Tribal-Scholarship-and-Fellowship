import React, { useState } from 'react';
import { SchemeConfig } from '../../types';
import { 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Award, 
  FlaskConical, 
  Globe2,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ScholarshipsPageProps {
  schemes: SchemeConfig[];
  onSelectScheme: (scheme: SchemeConfig) => void;
  onApplyScheme: (scheme: SchemeConfig) => void;
}

export const ScholarshipsPage: React.FC<ScholarshipsPageProps> = ({
  schemes,
  onSelectScheme,
  onApplyScheme
}) => {
  const [selectedPathway, setSelectedPathway] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 5 Canonical Pathways
  const pathways = [
    { id: 'ALL', label: 'All Opportunities', count: schemes.length, category: null },
    { id: 'PRE_MATRIC', label: 'Pre-Matric (Class IX–X)', count: schemes.filter(s => s.category === 'PRE_MATRIC').length, category: 'PRE_MATRIC' },
    { id: 'POST_MATRIC', label: 'Post-Matric (Higher Secondary & College)', count: schemes.filter(s => s.category === 'POST_MATRIC').length, category: 'POST_MATRIC' },
    { id: 'TOP_CLASS', label: 'National Scholarship (Top Class)', count: schemes.filter(s => s.category === 'TOP_CLASS').length, category: 'TOP_CLASS' },
    { id: 'HIGHER_EDUCATION_FELLOWSHIP', label: 'National Fellowship (M.Phil / Ph.D)', count: schemes.filter(s => s.category === 'HIGHER_EDUCATION_FELLOWSHIP').length, category: 'HIGHER_EDUCATION_FELLOWSHIP' },
    { id: 'OVERSEAS_STUDIES', label: 'National Overseas (Study Abroad)', count: schemes.filter(s => s.category === 'OVERSEAS_STUDIES').length, category: 'OVERSEAS_STUDIES' }
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesPathway = selectedPathway === 'ALL' || s.category === selectedPathway;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPathway && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'PRE_MATRIC': return 'Pre-Matric School Education';
      case 'POST_MATRIC': return 'Post-Matric Higher Education';
      case 'TOP_CLASS': return 'National Scholarship • Top Class';
      case 'HIGHER_EDUCATION_FELLOWSHIP': return 'National Fellowship (NFST)';
      case 'OVERSEAS_STUDIES': return 'National Overseas Scheme (NOS)';
      default: return 'Scholarship & Fellowship Scheme';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'PRE_MATRIC': return 'var(--terracotta)';
      case 'POST_MATRIC': return 'var(--primary-maroon)';
      case 'TOP_CLASS': return 'var(--forest-green)';
      case 'HIGHER_EDUCATION_FELLOWSHIP': return 'var(--mustard-gold)';
      case 'OVERSEAS_STUDIES': return 'var(--primary-maroon)';
      default: return 'var(--primary-maroon)';
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* =========================================================================
            1. PAGE HEADER + LARGE REAL PHOTO 2 (Editorial Presentation)
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
              <GraduationCap size={16} />
              Educational Support Across The Student Journey
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', 
              color: 'var(--primary-maroon)', 
              margin: '0 0 0.85rem 0', 
              fontWeight: 900,
              lineHeight: 1.2
            }}>
              Scholarships & Fellowships
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.65 }}>
              Comprehensive financial support schemes funded by the Ministry of Tribal Affairs and State Governments, empowering Scheduled Tribe students at every academic milestone from secondary school to doctoral and overseas education.
            </p>
          </div>

          {/* LARGE PHOTO 2 */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid var(--border)',
            boxShadow: '0 8px 24px rgba(92, 36, 25, 0.1)',
            maxHeight: '260px',
            backgroundColor: 'var(--surface-muted)'
          }}>
            <img 
              src="/setu_photo_2_scholarship.jpg" 
              alt="Scheduled Tribe schoolgirls in blue and white checked uniforms walking together to school with backpacks"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
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
              <span>Pre-Matric & Higher Education Pathways</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--mustard-gold)' }}>MoTA Schemes</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. EXPLORE BY PATHWAY (Clear Navigation Bar)
            ========================================================================= */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-maroon)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Explore By Pathway
          </div>

          <div style={{
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            {pathways.map((pw) => (
              <button
                key={pw.id}
                onClick={() => setSelectedPathway(pw.id)}
                className={`btn btn-sm ${selectedPathway === pw.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontWeight: selectedPathway === pw.id ? 700 : 600,
                  fontSize: '0.86rem',
                  padding: '0.45rem 0.95rem'
                }}
              >
                <span>{pw.label}</span>
                <span style={{ 
                  opacity: selectedPathway === pw.id ? 0.9 : 0.6, 
                  fontSize: '0.75rem',
                  marginLeft: '0.2rem'
                }}>
                  ({pw.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-maroon)' }}>
            Available Opportunities ({filteredSchemes.length})
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="var(--muted-text)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by scheme name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>

        {/* =========================================================================
            3. AVAILABLE OPPORTUNITIES (Category → Scheme → Who it serves → Action)
            ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredSchemes.map((scheme) => {
            const catColor = getCategoryColor(scheme.category);
            return (
              <div 
                key={scheme.id}
                className="card"
                style={{ 
                  padding: '1.85rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  borderTop: `4px solid ${catColor}`,
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: catColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {getCategoryLabel(scheme.category)}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      Portal Open
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-maroon)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
                    {scheme.name}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
                    {scheme.description}
                  </p>

                  {/* Clean Informational Points */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.55rem', 
                    marginBottom: '1.5rem', 
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--background)',
                    padding: '1rem 1.15rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: 'var(--text)' }}>
                      <CheckCircle2 size={16} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Who it serves: </strong> ST students pursuing eligible education.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: 'var(--text)' }}>
                      <CheckCircle2 size={16} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Income Limit: </strong> As per verified scheme notification guidelines.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: 'var(--text)' }}>
                      <CheckCircle2 size={16} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Benefit Transfer: </strong> Direct Benefit Transfer (DBT) to bank account.</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontWeight: 600 }}
                  >
                    View Scheme →
                  </button>
                  <button
                    onClick={() => onApplyScheme(scheme)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontWeight: 700 }}
                  >
                    Apply Online
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

