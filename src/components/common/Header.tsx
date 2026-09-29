import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useLanguage } from '../../services/languageService';
import { 
  GraduationCap, 
  Languages, 
  User, 
  LogOut, 
  Eye, 
  Menu, 
  X, 
  ChevronDown,
  Building2,
  Landmark,
  ShieldCheck,
  Award
} from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeStudentId: string;
  onStudentChange: (id: string) => void;
  onResetData: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onNavigatePublic?: (page: 'home' | 'scholarships' | 'fellowships' | 'about' | 'help') => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  activeStudentId,
  onStudentChange,
  highContrast,
  onToggleHighContrast,
  onNavigatePublic,
  onOpenAuth,
  isLoggedIn = false,
  onLogout,
  userName = 'Student Portal'
}) => {
  const { lang, setLanguage } = useLanguage();
  const [fontSizeScale, setFontSizeScale] = useState<number>(1);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    const newScale = Math.min(Math.max(fontSizeScale + delta, 0.9), 1.15);
    setFontSizeScale(newScale);
    document.documentElement.style.fontSize = `${15 * newScale}px`;
  };

  const roleOptions: { role: UserRole; label: string; desc: string; icon: any }[] = [
    { role: 'applicant', label: 'Student Portal', desc: 'Applicant & Scholar Desk', icon: GraduationCap },
    { role: 'institution', label: 'Institution Desk', desc: 'AISHE Institute Verification', icon: Building2 },
    { role: 'state_officer', label: 'State Welfare Directorate', desc: 'State Tribal Welfare Cell', icon: Landmark },
    { role: 'ministry_admin', label: 'Ministry Central Desk', desc: 'MoTA National Central Desk', icon: ShieldCheck },
    { role: 'expert_reviewer', label: 'Selection Committee', desc: 'Academic Screening Panel', icon: Award }
  ];

  return (
    <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(92, 36, 25, 0.04)' }}>
      {/* 1. Government Identity Top Strip */}
      <div style={{ backgroundColor: 'var(--primary-maroon)', color: '#FFFFFF', fontSize: '0.74rem', height: '28px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left: Government of India & Ministry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500, letterSpacing: '0.02em' }}>
            <span>भारत सरकार | Government of India</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: 'var(--mustard-gold)', fontWeight: 600 }}>जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs</span>
          </div>

          {/* Right: Accessibility Controls & Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Font Scaler */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Text:</span>
              <button 
                onClick={() => handleFontSizeChange(-0.05)} 
                title="Decrease Font Size"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '0 0.3rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.68rem' }}
              >
                A-
              </button>
              <button 
                onClick={() => { setFontSizeScale(1); document.documentElement.style.fontSize = '15px'; }} 
                title="Reset Font Size"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '0 0.3rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.68rem' }}
              >
                A
              </button>
              <button 
                onClick={() => handleFontSizeChange(0.05)} 
                title="Increase Font Size"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '0 0.3rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.68rem' }}
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              title="Toggle High Contrast"
              style={{ background: 'none', border: 'none', color: highContrast ? '#FCD34D' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}
            >
              <Eye size={12} />
              <span>{highContrast ? 'Standard' : 'Contrast'}</span>
            </button>

            {/* Language Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
              <Languages size={11} style={{ opacity: 0.85 }} />
              <button
                onClick={() => setLanguage('en')}
                style={{
                  background: lang === 'en' ? 'rgba(255,255,255,0.25)' : 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: lang === 'en' ? 700 : 400
                }}
              >
                EN
              </button>
              <span style={{ opacity: 0.4 }}>|</span>
              <button
                onClick={() => setLanguage('hi')}
                style={{
                  background: lang === 'hi' ? 'rgba(255,255,255,0.25)' : 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: lang === 'hi' ? 700 : 400
                }}
              >
                हिन्दी
              </button>
              <span style={{ opacity: 0.4 }}>|</span>
              <button
                onClick={() => setLanguage('ta')}
                style={{
                  background: lang === 'ta' ? 'rgba(255,255,255,0.25)' : 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: lang === 'ta' ? 700 : 400
                }}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Primary Header (76px) */}
      <div className="container" style={{ height: '76px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Official SETU Logo Lockup */}
        <div 
          onClick={() => onNavigatePublic && onNavigatePublic('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', textDecoration: 'none' }}
        >
          <img 
            src="/setu_logo.png" 
            alt="SETU — Tribal Scholarship & Fellowship Management Platform" 
            style={{ 
              height: '58px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block'
            }} 
          />
        </div>

        {/* Center: Desktop Public Navigation Links */}
        <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <button 
            onClick={() => onNavigatePublic && onNavigatePublic('scholarships')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text)', 
              fontWeight: 700, 
              fontSize: '0.94rem', 
              cursor: 'pointer', 
              padding: '0.4rem 0',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-maroon)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
          >
            Scholarships
          </button>
          <button 
            onClick={() => onNavigatePublic && onNavigatePublic('fellowships')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text)', 
              fontWeight: 700, 
              fontSize: '0.94rem', 
              cursor: 'pointer', 
              padding: '0.4rem 0',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-maroon)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
          >
            Fellowships
          </button>
          <button 
            onClick={() => onNavigatePublic && onNavigatePublic('help')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text)', 
              fontWeight: 700, 
              fontSize: '0.94rem', 
              cursor: 'pointer', 
              padding: '0.4rem 0',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-maroon)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
          >
            Help & Desks
          </button>
        </nav>

        {/* Right: Auth Actions & Desk Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.86rem', color: 'var(--primary-maroon)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={16} color="var(--primary-maroon)" />
                <span>{userName}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="btn btn-primary"
                style={{ 
                  fontWeight: 700, 
                  padding: '0.5rem 1.35rem', 
                  fontSize: '0.92rem',
                  boxShadow: '0 2px 6px rgba(92, 36, 25, 0.2)'
                }}
              >
                Login
              </button>
            </div>
          )}

          {/* Stakeholder Desk Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
              title="Switch stakeholder portal"
            >
              <span>Desk: <strong>{roleOptions.find(r => r.role === activeRole)?.label.split(' ')[0]}</strong></span>
              <ChevronDown size={13} />
            </button>

            {isRoleDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-medium)',
                zIndex: 200,
                padding: '0.4rem 0'
              }}>
                <div style={{ padding: '0.4rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-maroon)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                  Stakeholder Portals
                </div>
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isCurrent = activeRole === opt.role;
                  return (
                    <div
                      key={opt.role}
                      onClick={() => {
                        onRoleChange(opt.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.55rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        backgroundColor: isCurrent ? 'var(--maroon-subtle)' : 'transparent',
                        borderLeft: isCurrent ? '3px solid var(--primary-maroon)' : '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) e.currentTarget.style.backgroundColor = 'var(--background)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon size={16} color={isCurrent ? 'var(--primary-maroon)' : 'var(--muted-text)'} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: isCurrent ? 700 : 600, color: 'var(--primary-maroon)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'flex', background: 'none', border: '1px solid var(--border-medium)', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => { onNavigatePublic && onNavigatePublic('home'); setIsMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.4rem 0', color: 'var(--primary-maroon)' }}
          >
            Home
          </button>
          <button 
            onClick={() => { onNavigatePublic && onNavigatePublic('scholarships'); setIsMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.4rem 0', color: 'var(--primary-maroon)' }}
          >
            Scholarships
          </button>
          <button 
            onClick={() => { onNavigatePublic && onNavigatePublic('fellowships'); setIsMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.4rem 0', color: 'var(--primary-maroon)' }}
          >
            Fellowships
          </button>
          <button 
            onClick={() => { onNavigatePublic && onNavigatePublic('help'); setIsMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.4rem 0', color: 'var(--primary-maroon)' }}
          >
            Help & Guidelines
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

