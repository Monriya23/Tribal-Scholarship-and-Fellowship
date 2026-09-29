import React from 'react';
import { GraduationCap, Mail, Phone, Landmark, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../services/languageService';

interface FooterProps {
  onNavigatePublic?: (page: 'home' | 'scholarships' | 'fellowships' | 'about' | 'help') => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePublic, onOpenAuth }) => {
  const { t } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#3A140E', color: 'rgba(255,255,255,0.88)', marginTop: 'auto', borderTop: '4px solid var(--mustard-gold)' }}>
      {/* Upper Footer Links Section */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Column 1: Identity & Purpose */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ marginBottom: '1rem', backgroundColor: '#FFFFFF', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
              <img 
                src="/setu_logo.png" 
                alt="SETU Logo" 
                style={{ height: '48px', width: 'auto', display: 'block' }} 
              />
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', margin: '0 0 1rem 0' }}>
              A unified national initiative by the Ministry of Tribal Affairs, Government of India, to provide transparent scholarship discovery, merit fellowships, and direct financial support for Scheduled Tribe students.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--mustard-gold)', fontWeight: 600 }}>
              Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001
            </div>
          </div>

          {/* Column 2: Flagship Schemes */}
          <div>
            <h4 style={{ fontSize: '0.92rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', fontWeight: 700 }}>
              Scholarships & Fellowships
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.86rem' }}>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('scholarships')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Pre-Matric Scholarship for ST Students
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('scholarships')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Post-Matric Scholarship for ST Students
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('scholarships')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Top Class Education for ST Students
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('fellowships')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  National Fellowship for ST Students (NFST)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('fellowships')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  National Overseas Scholarship (NOS)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '0.92rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', fontWeight: 700 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.86rem' }}>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('home')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('about')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('help')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Help & FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePublic && onNavigatePublic('help')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Grievance Redressal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: '0.86rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                >
                  Applicant Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: National Helpdesk & Official Portals */}
          <div>
            <h4 style={{ fontSize: '0.92rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', fontWeight: 700 }}>
              National Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Phone size={16} color="var(--accent-gold)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>Toll-Free Helpline</div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>1800-11-7788</strong>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>09:30 AM – 05:30 PM (Mon–Fri)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Mail size={16} color="var(--accent-gold)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>Official Helpdesk Email</div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>scholarship.tribal@gov.in</strong>
                </div>
              </div>

              {/* Official External Links */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem', marginTop: '0.35rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Official Portals
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                  <a 
                    href="https://tribal.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>Ministry of Tribal Affairs</span>
                    <ExternalLink size={12} />
                  </a>
                  <a 
                    href="https://india.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.75)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>National Portal of India</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & GIGW Compliance Bar */}
      <div style={{ backgroundColor: '#0A1723', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
          <div>
            © {new Date().getFullYear()} Ministry of Tribal Affairs, Government of India. All Rights Reserved.
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility Statement</span>
            <span>Hyperlink Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
