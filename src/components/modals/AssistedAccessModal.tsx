import React from 'react';
import { X, Building2, MapPin, Users, Phone, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface AssistedAccessModalProps {
  onClose: () => void;
}

export const AssistedAccessModal: React.FC<AssistedAccessModalProps> = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '680px', 
          padding: '2rem', 
          borderTop: '5px solid var(--gov-green-700)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-green-700)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <HelpCircle size={15} />
              Assisted Access Support
            </div>
            <h2 style={{ fontSize: '1.45rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0 0.25rem 0', fontWeight: 800 }}>
              Need Help Applying?
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Don't have access to a personal smartphone, reliable internet, or a scanner? You can apply through any of these free government assistance pathways.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* 3 Assisted Pathways */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Pathway 1 */}
          <div style={{ 
            padding: '1.15rem', 
            backgroundColor: 'var(--bg-main)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--gov-green-50)', 
              color: 'var(--gov-green-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                1. Institution Scholarship Nodal Desk (Recommended)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem 0', lineHeight: 1.45 }}>
                Every affiliated school, college, and university has a designated <strong>Tribal Welfare / Scholarship Nodal Officer</strong>. Visit your institution's administrative office with your original certificates.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--gov-green-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={14} /> The officer can register, fill details, scan certificates, and endorse your application directly.
              </div>
            </div>
          </div>

          {/* Pathway 2 */}
          <div style={{ 
            padding: '1.15rem', 
            backgroundColor: 'var(--bg-main)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--gov-saffron-50)', 
              color: 'var(--gov-saffron-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                2. Village Common Service Centre (CSC) / Block Office
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem 0', lineHeight: 1.45 }}>
                Visit your nearest Gram Panchayat Common Service Centre (Digital Seva Kendra) or Block Development Office (BDO) Tribal Welfare desk.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--gov-saffron-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={14} /> Village Level Entrepreneurs (VLEs) are authorized to assist students with document scanning and form submission.
              </div>
            </div>
          </div>

          {/* Pathway 3 */}
          <div style={{ 
            padding: '1.15rem', 
            backgroundColor: 'var(--bg-main)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: '#EFF6FF', 
              color: 'var(--gov-navy-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                3. Authorized Representative or Guardian
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem 0', lineHeight: 1.45 }}>
                A parent, teacher, or elder may fill the online application on your behalf using your Aadhaar number and active bank account details.
              </p>
            </div>
          </div>

        </div>

        {/* Reassurance banner */}
        <div style={{ 
          padding: '0.9rem 1.15rem', 
          backgroundColor: 'var(--gov-green-50)', 
          border: '1px solid var(--gov-green-100)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <ShieldCheck size={20} color="var(--gov-green-700)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--gov-green-800)', margin: 0, lineHeight: 1.4 }}>
            <strong>100% Free & Transparent:</strong> Government scholarship submission is completely free. Assisted applications flow into the exact same unified Direct Benefit Transfer (DBT) verification system with zero priority differences.
          </p>
        </div>

        {/* Footer with Helpline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            <Phone size={16} color="var(--gov-green-700)" />
            <span>National Helpline: <strong>1800-11-7788</strong> (Toll-Free, 9:30 AM – 6 PM)</span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-navy"
            style={{ padding: '0.55rem 1.25rem', fontWeight: 600 }}
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
