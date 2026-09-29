import React, { useState } from 'react';
import { UserRole } from '../../types';
import { X, Lock, Mail, Phone, User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { AssistedAccessModal } from '../modals/AssistedAccessModal';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userDetails?: any) => void;
  onNavigateToRegister?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onLoginSuccess,
  onNavigateToRegister
}) => {
  const [showAssistedHelp, setShowAssistedHelp] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('applicant');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('birsa.munda@student.jharkhand.in');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Switch role and update preset credentials
  const handleRolePreset = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'applicant') {
      setLoginIdentifier('birsa.munda@student.jharkhand.in');
    } else if (role === 'institution') {
      setLoginIdentifier('nodal.officer@ranchiuniv.edu.in');
    } else if (role === 'state_officer') {
      setLoginIdentifier('dir.welfare@jharkhand.gov.in');
    } else if (role === 'ministry_admin') {
      setLoginIdentifier('director.scholarships@tribal.gov.in');
    } else if (role === 'expert_reviewer') {
      setLoginIdentifier('prof.reviewer@iitb.ac.in');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const derivedName = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'User';
    onLoginSuccess(loginRole, { name: derivedName, email: loginIdentifier, role: loginRole });
  };

  const handleGoToRegister = () => {
    onClose();
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          padding: '2.25rem', 
          borderTop: '5px solid var(--primary-maroon)',
          borderRadius: 'var(--radius-md)',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Header with SETU Logo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <img 
                src="/setu_logo.png" 
                alt="SETU - Official Tribal Scholarship & Fellowship Platform" 
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-maroon)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>
              Official Portal Sign In
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
              Access your dashboard, submitted applications, and DBT payment tracking.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Persona / Role Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
            Select Portal Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            {[
              { id: 'applicant', label: 'Student' },
              { id: 'institution', label: 'Institution' },
              { id: 'state_officer', label: 'State Desk' },
              { id: 'ministry_admin', label: 'Ministry' },
              { id: 'expert_reviewer', label: 'Reviewer' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRolePreset(r.id as UserRole)}
                style={{
                  padding: '0.45rem 0.2rem',
                  fontSize: '0.78rem',
                  fontWeight: loginRole === r.id ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  border: loginRole === r.id ? '1px solid var(--primary-maroon)' : '1px solid var(--border)',
                  backgroundColor: loginRole === r.id ? 'var(--maroon-subtle)' : 'var(--surface)',
                  color: loginRole === r.id ? 'var(--primary-maroon)' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              {loginRole === 'applicant' ? 'Email or Mobile Number (Aadhaar Seeded)' : 'Official Government Email'} <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-control"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. name@student.in"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password <span className="required">*</span></label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery OTP sent to registered mobile.'); }} style={{ fontSize: '0.78rem', color: 'var(--primary-maroon)' }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Keep me signed in on this official device</span>
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', fontWeight: 700, padding: '0.75rem', marginTop: '0.25rem' }}
          >
            Sign In to Portal →
          </button>
        </form>

        {/* Register Promotion Banner */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: 'var(--background)', 
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--primary-maroon)', marginBottom: '0.4rem', fontWeight: 700 }}>
            New Student Applicant?
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted-text)', margin: '0 0 0.75rem 0' }}>
            Discover Pre-Matric, Post-Matric, Fellowships, and Overseas opportunities in 5 simple steps.
          </p>
          <button
            type="button"
            onClick={handleGoToRegister}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700, width: '100%', borderColor: 'var(--primary-maroon)', color: 'var(--primary-maroon)' }}
          >
            Create Your Account & Find Schemes →
          </button>
        </div>

        {/* Assisted Access Link */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAssistedHelp(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--muted-text)', 
              fontSize: '0.78rem', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Need assisted application at your local CSC / Gram Panchayat?
          </button>
        </div>

      </div>

      {showAssistedHelp && (
        <AssistedAccessModal onClose={() => setShowAssistedHelp(false)} />
      )}
    </div>
  );
};

