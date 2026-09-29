import React, { useState } from 'react';
import { SchemeConfig } from '../../types';
import { useLanguage } from '../../services/languageService';
import { AssistedAccessModal } from '../modals/AssistedAccessModal';
import { 
  GraduationCap, 
  FlaskConical, 
  Globe2, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Award, 
  FileText, 
  HelpCircle, 
  AlertCircle, 
  FileCheck, 
  ChevronRight, 
  Compass,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  Users,
  CreditCard,
  Layers,
  Scale
} from 'lucide-react';

interface HeroSectionProps {
  schemes: SchemeConfig[];
  onFindScholarship: () => void;
  onExploreSchemes: () => void;
  onTrackApplication: () => void;
  onTrackPayment?: () => void;
  onSelectScheme: (scheme: SchemeConfig) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigatePublic: (page: 'home' | 'scholarships' | 'fellowships' | 'about' | 'help' | 'payment_tracker' | 'grievance_portal' | 'digital_case_file') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  schemes,
  onFindScholarship,
  onExploreSchemes,
  onTrackApplication,
  onTrackPayment,
  onSelectScheme,
  onOpenAuth,
  onNavigatePublic
}) => {
  const { t } = useLanguage();
  const [showAssistedModal, setShowAssistedModal] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');

  // 5 Complete Education Pathways (Unified Ecosystem)
  const educationPathways = [
    {
      id: 'pre_matric',
      categoryTitle: 'PRE-MATRIC',
      title: 'Pre-Matric Scholarship',
      stage: 'School Education',
      target: 'Classes IX & X Scheduled Tribe students',
      badge: 'State & Central Scheme',
      accentColor: 'var(--terracotta)',
      icon: BookOpen,
      category: 'PRE_MATRIC',
      schemeCode: 'PRE_MATRIC_ST'
    },
    {
      id: 'post_matric',
      categoryTitle: 'POST-MATRIC',
      title: 'Post-Matric Scholarship',
      stage: 'Higher Secondary & College',
      target: 'Class XI, XII, ITI, Diploma, Undergraduate & PG',
      badge: 'Centrally Sponsored Scheme',
      accentColor: 'var(--primary-maroon)',
      icon: GraduationCap,
      category: 'POST_MATRIC',
      schemeCode: 'PMS_ST'
    },
    {
      id: 'top_class',
      categoryTitle: 'NATIONAL SCHOLARSHIP',
      title: 'Top Class Education',
      stage: 'Premier Higher Institutions',
      target: 'ST students in IITs, NITs, IIMs, AIIMS, NLU & Top Institutes',
      badge: 'Central Sector Scheme',
      accentColor: 'var(--forest-green)',
      icon: Award,
      category: 'TOP_CLASS',
      schemeCode: 'TOPCLASS_ST'
    },
    {
      id: 'national_fellowship',
      categoryTitle: 'NATIONAL FELLOWSHIP',
      title: 'National Fellowship (NFST)',
      stage: 'Doctoral & Research Studies',
      target: 'M.Phil & Ph.D Research Scholars (750 Annual Slots)',
      badge: 'Direct Ministry Grant',
      accentColor: 'var(--mustard-gold)',
      icon: FlaskConical,
      category: 'HIGHER_EDUCATION_FELLOWSHIP',
      schemeCode: 'NFST'
    },
    {
      id: 'national_overseas',
      categoryTitle: 'NATIONAL OVERSEAS',
      title: 'National Overseas Scheme (NOS)',
      stage: 'International Higher Studies',
      target: 'Masters & Ph.D abroad in Top 500 Global Universities',
      badge: 'International Fellowship',
      accentColor: 'var(--primary-maroon)',
      icon: Globe2,
      category: 'OVERSEAS_STUDIES',
      schemeCode: 'NOS'
    }
  ];

  const handlePathwayClick = (item: typeof educationPathways[0]) => {
    const targetScheme = schemes.find(s => s.code === item.schemeCode || s.category === item.category);
    if (targetScheme) {
      onSelectScheme(targetScheme);
    } else {
      onExploreSchemes();
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      localStorage.setItem('setu_track_query', trackQuery.trim());
    }
    onTrackApplication();
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
      
      {/* =========================================================================
          1. HOMEPAGE EDITORIAL HERO — IMAGE 1
          ========================================================================= */}
      <section style={{ 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid var(--border)', 
        padding: '3.75rem 0 4.25rem 0',
        position: 'relative'
      }}>
        {/* Subtle decorative bridge line at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary-maroon) 0%, var(--mustard-gold) 50%, var(--forest-green) 100%)'
        }} />

        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3.5rem', 
            alignItems: 'center' 
          }}>
            {/* Left Column: Clear answers to What is SETU? Who is it for? What can I do? */}
            <div style={{ maxWidth: '580px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--forest-green)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1rem',
                backgroundColor: 'var(--green-subtle)',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(23, 107, 58, 0.2)'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--mustard-gold)' }} />
                Ministry of Tribal Affairs • Government of India
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <img 
                  src="/setu_logo.png" 
                  alt="SETU - Official Brand Logo" 
                  style={{ height: '58px', width: 'auto', objectFit: 'contain' }} 
                />
              </div>

              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: 'var(--primary-maroon)', 
                marginBottom: '0.85rem', 
                lineHeight: 1.35 
              }}>
                Tribal Scholarship & Fellowship Management Platform
              </div>

              <p style={{
                fontSize: '1.12rem',
                color: 'var(--terracotta)',
                fontStyle: 'italic',
                fontWeight: 600,
                margin: '0 0 1rem 0'
              }}>
                "Connecting Tribal students to educational opportunities."
              </p>

              <p style={{
                fontSize: '1.02rem',
                color: 'var(--muted-text)',
                lineHeight: 1.6,
                margin: '0 0 2rem 0'
              }}>
                Discover scholarships across school, college, doctoral research, and overseas studies. Complete guided document checks and track your application to direct bank transfer.
              </p>

              {/* Clear Primary Actions */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                  onClick={onExploreSchemes}
                  className="btn btn-primary btn-lg"
                  style={{ 
                    fontWeight: 700, 
                    boxShadow: '0 4px 12px rgba(92, 36, 25, 0.25)',
                    padding: '0.85rem 1.85rem',
                    fontSize: '1.02rem'
                  }}
                >
                  <Search size={18} />
                  <span>Find Opportunities</span>
                </button>

                <button
                  onClick={onTrackApplication}
                  className="btn btn-secondary btn-lg"
                  style={{ 
                    fontWeight: 600, 
                    borderColor: 'var(--primary-maroon)', 
                    color: 'var(--primary-maroon)',
                    padding: '0.85rem 1.75rem',
                    fontSize: '1.02rem'
                  }}
                >
                  <span>Track Application</span>
                  <ArrowRight size={17} />
                </button>
              </div>

              {/* Assistance link */}
              <div style={{ fontSize: '0.92rem', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>Need help with your application?</span>
                <button
                  onClick={() => onNavigatePublic('help')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-maroon)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Find Local Assistance Desk →
                </button>
              </div>
            </div>

            {/* Right Column: LARGE REAL PHOTO 1 (Hero Image) */}
            <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '3px solid var(--surface-muted)',
                boxShadow: '0 14px 32px rgba(92, 36, 25, 0.16)',
                aspectRatio: '16/10',
                backgroundColor: 'var(--surface-muted)'
              }}>
                <img 
                  src="/setu_photo_1_hero.png" 
                  alt="Scheduled Tribe school students in uniform smiling and learning in a classroom with brick wall"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 25%',
                    display: 'block' 
                  }}
                />
                
                {/* Official Photo Caption Strip */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(70, 27, 19, 0.94)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid var(--mustard-gold)'
                }}>
                  <span style={{ fontWeight: 600 }}>Education • Opportunity • Empowerment</span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--mustard-gold)', fontWeight: 600 }}>MoTA Official</span>
                </div>
              </div>

              {/* Sub-caption */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '0.75rem', 
                fontSize: '0.8rem', 
                color: 'var(--muted-text)',
                padding: '0 0.25rem'
              }}>
                <span>Supporting ST students across all 36 States & UTs</span>
                <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>● Direct Benefit Transfer (DBT)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EXPLORE YOUR EDUCATION JOURNEY (Opportunities at Every Stage)
          ========================================================================= */}
      <section style={{ padding: '4rem 0 4.5rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.75rem auto' }}>
            <div style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: 'var(--forest-green)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.45rem' 
            }}>
              Opportunities at Every Stage
            </div>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.6rem 0', fontWeight: 800 }}>
              Explore Your Education Journey
            </h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.6 }}>
              SETU connects Tribal students with financial assistance across school classrooms, higher education, premier national institutes, doctoral research, and study abroad.
            </p>
          </div>

          {/* 5 Distinct Pathways Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {educationPathways.map((pathway) => {
              const Icon = pathway.icon;
              return (
                <div
                  key={pathway.id}
                  onClick={() => handlePathwayClick(pathway)}
                  className="card"
                  style={{
                    padding: '1.65rem 1.75rem',
                    cursor: 'pointer',
                    borderTop: `4px solid ${pathway.accentColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    backgroundColor: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(92, 36, 25, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: pathway.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {pathway.categoryTitle}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        {pathway.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pathway.accentColor,
                        flexShrink: 0
                      }}>
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-maroon)', margin: 0, fontWeight: 700 }}>
                          {pathway.title}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: 'var(--forest-green)', fontWeight: 600, marginTop: '0.15rem' }}>
                          {pathway.stage}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                      {pathway.target}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '0.85rem', 
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: pathway.accentColor
                  }}>
                    <span>Explore opportunity</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SCHOLARSHIP SECTION — LARGE IMAGE 2
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '3.5rem', 
            alignItems: 'center' 
          }}>
            {/* Left: LARGE REAL PHOTO 2 */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                boxShadow: '0 12px 28px rgba(92, 36, 25, 0.12)',
                aspectRatio: '16/11',
                backgroundColor: 'var(--surface-muted)'
              }}>
                <img 
                  src="/setu_photo_2_scholarship.jpg" 
                  alt="Scheduled Tribe schoolgirls in blue and white checked uniforms walking together to school with backpacks"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 35%',
                    display: 'block' 
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(70, 27, 19, 0.92)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid var(--terracotta)'
                }}>
                  <span>Foundational & Higher Secondary Support</span>
                  <span style={{ color: 'var(--mustard-gold)' }}>Pre & Post-Matric</span>
                </div>
              </div>
            </div>

            {/* Right: Scholarship Content */}
            <div>
              <div style={{ 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: 'var(--terracotta)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                marginBottom: '0.45rem' 
              }}>
                Scholarship Opportunities
              </div>
              <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.85rem 0', fontWeight: 800 }}>
                Empowering Students from School to Higher Education
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--muted-text)', lineHeight: 1.65, margin: '0 0 1.5rem 0' }}>
                Scholarships cover academic tuition, mandatory institution fees, book grants, and monthly maintenance allowances directly credited via Aadhaar-linked bank accounts.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Pre-Matric (Classes IX & X):</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Full institutional fee coverage + annual books grant.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Post-Matric & Higher Education:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Group I–IV academic support, hosteller & day-scholar allowances.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Top Class Education:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>100% tuition + ₹30,000 books + living stipend at 265+ premier institutions (IITs, IIMs, AIIMS, NLUs).</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigatePublic('scholarships')}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                <span>View All Scholarship Schemes →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FELLOWSHIP SECTION — LARGE IMAGE 3
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '3.5rem', 
            alignItems: 'center' 
          }}>
            {/* Left: Fellowship Content */}
            <div>
              <div style={{ 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: 'var(--forest-green)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                marginBottom: '0.45rem' 
              }}>
                Fellowships & Research
              </div>
              <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.85rem 0', fontWeight: 800 }}>
                Advancing Doctoral Research & Global Studies
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--muted-text)', lineHeight: 1.65, margin: '0 0 1.5rem 0' }}>
                National Fellowships and Overseas Study Grants provide financial autonomy to Scheduled Tribe scholars pursuing M.Phil, Ph.D., and international degrees.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>National Fellowship for ST Students (NFST):</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>750 annual slots with ₹31,000/mo (JRF) and ₹35,000/mo (SRF) + contingency.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>National Overseas Scholarship (NOS):</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>20 annual slots for Masters & Ph.D abroad covering full tuition, living allowance ($15,400/yr / £9,900/yr), and return airfare.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Transparent Merit Selection:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Deterministic academic merit ranking with UGC/CSIR-NET normalization.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigatePublic('fellowships')}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                <span>Explore Fellowship Grants →</span>
              </button>
            </div>

            {/* Right: LARGE REAL PHOTO 3 */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                boxShadow: '0 12px 28px rgba(92, 36, 25, 0.12)',
                aspectRatio: '16/11',
                backgroundColor: 'var(--surface-muted)'
              }}>
                <img 
                  src="/setu_photo_3_fellowship.jpg" 
                  alt="Scheduled Tribe university graduates and research scholars in convocation gowns and graduation caps with ceremonial stoles"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 20%',
                    display: 'block' 
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(70, 27, 19, 0.92)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid var(--mustard-gold)'
                }}>
                  <span>Research Scholars & Global Fellows</span>
                  <span style={{ color: 'var(--mustard-gold)' }}>NFST & NOS Grants</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. YOUR EDUCATION JOURNEY (Connected Lifecycle Bridge)
          ========================================================================= */}
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
            <div style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: 'var(--primary-maroon)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.45rem' 
            }}>
              Continuous Support
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-maroon)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              Your Education Journey with SETU
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.6 }}>
              SETU is not just a form — it is a guided bridge accompanying you through every milestone from enrollment to annual renewals.
            </p>
          </div>

          {/* Connected Horizontal Timeline Rail */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            position: 'relative'
          }}>
            {[
              { stage: 'SCHOOL', label: 'Pre-Matric', sub: 'Class IX & X', color: 'var(--terracotta)' },
              { stage: 'HIGHER ED', label: 'Post-Matric', sub: 'UG / PG / Diploma', color: 'var(--primary-maroon)' },
              { stage: 'RESEARCH', label: 'Fellowship', sub: 'M.Phil / Ph.D (NFST)', color: 'var(--mustard-gold)' },
              { stage: 'OVERSEAS', label: 'Global Study', sub: 'Top 500 Universities', color: 'var(--forest-green)' },
              { stage: 'PAYMENT', label: 'DBT Credit', sub: 'Aadhaar NPCI Bank', color: 'var(--forest-green)' },
              { stage: 'RENEWAL', label: 'Annual Grant', sub: 'Continued Progression', color: 'var(--primary-maroon)' }
            ].map((milestone, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderTop: `3px solid ${milestone.color}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem 1rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: milestone.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  {milestone.stage}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-maroon)', marginBottom: '0.2rem' }}>
                  {milestone.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                  {milestone.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. HOW SETU WORKS (DISCOVER → APPLY → VERIFY → TRACK → RECEIVE SUPPORT)
          ========================================================================= */}
      <section style={{ padding: '4rem 0 4.5rem 0', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.75rem auto' }}>
            <div style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: 'var(--forest-green)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.45rem' 
            }}>
              Transparent • Guided • Accountable
            </div>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.6rem 0', fontWeight: 800 }}>
              How SETU Works
            </h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.6 }}>
              A single unified pathway connecting application submission, transparent document verification, statutory rule evaluation, and direct payment.
            </p>
          </div>

          {/* 5-Stage Visual Lifecycle Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem'
          }}>
            {[
              {
                step: '01',
                stage: 'DISCOVER',
                title: 'Intelligent Intake',
                desc: 'Profile matching highlights eligible schemes with transparent matching signals.',
                icon: Compass,
                color: 'var(--primary-maroon)'
              },
              {
                step: '02',
                stage: 'APPLY',
                title: 'Guided Application',
                desc: 'Dynamic smart forms with instant pre-validation and offline draft recovery.',
                icon: FileText,
                color: 'var(--terracotta)'
              },
              {
                step: '03',
                stage: 'VERIFY',
                title: 'Deficiency Loop',
                desc: 'Instant document check detects typos and allows fixes without rejection.',
                icon: FileCheck,
                color: 'var(--mustard-gold)'
              },
              {
                step: '04',
                stage: 'TRACK',
                title: 'Policy Evaluation',
                desc: 'Deterministic eligibility rules and transparent rank explanation for fair sanction.',
                icon: Award,
                color: 'var(--forest-green)'
              },
              {
                step: '05',
                stage: 'RECEIVE SUPPORT',
                title: 'DBT Direct Payment',
                desc: 'Disbursement tracked directly to your Aadhaar-linked bank account via PFMS.',
                icon: CheckCircle2,
                color: 'var(--primary-maroon)'
              }
            ].map((item, idx) => {
              const StageIcon = item.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '1.65rem 1.45rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.color, opacity: 0.9 }}>
                        STEP {item.step}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: 'var(--muted-text)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {item.stage}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      <StageIcon size={19} color={item.color} />
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-maroon)', margin: 0, fontWeight: 700 }}>
                        {item.title}
                      </h3>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HELP & ASSISTANCE — LARGE IMAGE 4
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '3.5rem', 
            alignItems: 'center' 
          }}>
            {/* Left: LARGE REAL PHOTO 4 */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                boxShadow: '0 12px 28px rgba(92, 36, 25, 0.12)',
                aspectRatio: '16/11',
                backgroundColor: 'var(--surface-muted)'
              }}>
                <img 
                  src="/setu_photo_4_help.png" 
                  alt="Family supporting and guiding young students studying with notebooks and pencils at a desk"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 20%',
                    display: 'block' 
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(70, 27, 19, 0.92)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid var(--forest-green)'
                }}>
                  <span>Student Access & Assisted Support</span>
                  <span style={{ color: 'var(--mustard-gold)' }}>Local Kiosks & CSCs</span>
                </div>
              </div>
            </div>

            {/* Right: Help & Assistance Content */}
            <div>
              <div style={{ 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: 'var(--forest-green)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                marginBottom: '0.45rem' 
              }}>
                Student Access System
              </div>
              <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.85rem 0', fontWeight: 800 }}>
                Need Help with Your Application?
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--muted-text)', lineHeight: 1.65, margin: '0 0 1.5rem 0' }}>
                SETU supports students across all districts through verified institutional assistance desks, Common Service Centres (CSCs), and multilingual support.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Location-Based Assistance:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Find Tribal Welfare Offices and ITDA project desks in your district.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Document & Certificate Guidance:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Clear procurement rules for Caste, Income, and Domicile certificates.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-maroon)' }}>Assisted Online Application:</strong>
                    <span style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginLeft: '0.35rem' }}>Free assisted registration at authorized CSC kiosks with applicant consent.</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigatePublic('help')}
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  <MapPin size={16} />
                  <span>Find Support Near You →</span>
                </button>

                <button
                  onClick={() => setShowAssistedModal(true)}
                  className="btn btn-secondary"
                  style={{ fontWeight: 600 }}
                >
                  <span>Assisted Access Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. TRUST & TRANSPARENCY (Human Benefits of Technology)
          ========================================================================= */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.75rem auto' }}>
            <div style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: 'var(--primary-maroon)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.45rem' 
            }}>
              Trust & Transparency
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-maroon)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              Why Students & Officers Trust SETU
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.6 }}>
              A fair, accountable public-service platform designed to ensure no eligible Tribal student is left behind due to paperwork errors.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                title: 'No Instant Rejections',
                desc: 'Deficiency loop gives you 15 days to re-upload documents if there is a minor spelling discrepancy or blurry scan.',
                icon: ShieldCheck,
                color: 'var(--forest-green)'
              },
              {
                title: 'Deterministic Eligibility',
                desc: 'Every decision is backed by official published scheme rules, not black-box algorithms or subjective bias.',
                icon: Scale,
                color: 'var(--primary-maroon)'
              },
              {
                title: 'Explain My Rank',
                desc: 'Research scholars can view exactly how academic scores and reservation rosters determined their selection.',
                icon: Award,
                color: 'var(--mustard-gold)'
              },
              {
                title: 'Immutable Audit Trail',
                desc: 'Every officer verification step and status update is cryptographically logged for complete accountability.',
                icon: Layers,
                color: 'var(--terracotta)'
              }
            ].map((feature, idx) => {
              const FIcon = feature.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '1.75rem 1.5rem',
                    borderTop: `3px solid ${feature.color}`
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feature.color,
                    marginBottom: '1rem'
                  }}>
                    <FIcon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-maroon)', margin: '0 0 0.45rem 0', fontWeight: 700 }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. TRACK YOUR APPLICATION (Instant Lookup)
          ========================================================================= */}
      <section style={{ padding: '3.75rem 0 4.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-maroon)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              Track Your Application Status
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--muted-text)', margin: 0 }}>
              Enter your Application Number or Aadhaar Reference ID to check real-time progress across verification, sanction, and DBT payment.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ flex: '1 1 300px', maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="e.g. APP-2026-ST-0042 or Aadhaar Reference"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="form-control"
                style={{
                  fontSize: '0.96rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontWeight: 700,
                padding: '0.75rem 1.65rem',
                fontSize: '0.96rem'
              }}
            >
              <FileCheck size={18} />
              <span>Track Application</span>
            </button>
          </form>
        </div>
      </section>

      {/* Assisted Access Modal */}
      {showAssistedModal && (
        <AssistedAccessModal onClose={() => setShowAssistedModal(false)} />
      )}
    </div>
  );
};
