import React from 'react';
import { X, FileText, Building, ExternalLink, HelpCircle, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DocumentGuidanceModalProps {
  docType: string;
  onClose: () => void;
}

interface DocGuideInfo {
  title: string;
  whatIsIt: string;
  issuingAuthority: string;
  validity: string;
  requiredProofs: string[];
  officialPortals: { name: string; url: string; state: string }[];
  offlineOption: string;
}

const DOCUMENT_GUIDELINES: Record<string, DocGuideInfo> = {
  ST_CERTIFICATE: {
    title: 'Scheduled Tribe (ST) Caste Certificate',
    whatIsIt: 'An official statutory certificate issued by state revenue authorities validating that the applicant belongs to a constitutionally notified Scheduled Tribe (ST) community.',
    issuingAuthority: 'Sub-Divisional Magistrate (SDM), Tehsildar, Revenue Divisional Officer (RDO), or District Magistrate.',
    validity: 'Permanent (Lifetime validity across India, subject to state verification).',
    requiredProofs: [
      'Proof of Identity (Aadhaar Card, Voter ID, or School ID)',
      "Father's or sibling's verified ST Caste Certificate",
      'Land revenue records / Khatiyan / Ancestral domicile record before 1950',
      'School Leaving Certificate (TC) mentioning tribal community'
    ],
    officialPortals: [
      { name: 'JharSewa (Jharkhand)', url: 'https://jharsewa.jharkhand.gov.in', state: 'Jharkhand' },
      { name: 'Digital Gujarat', url: 'https://www.digitalgujarat.gov.in', state: 'Gujarat' },
      { name: 'MahaOnline / Aaple Sarkar', url: 'https://aaplesarkar.mahaonline.gov.in', state: 'Maharashtra' },
      { name: 'Odisha e-District', url: 'https://edistrict.odisha.gov.in', state: 'Odisha' },
      { name: 'National Service Portal (ServicePlus)', url: 'https://serviceonline.gov.in', state: 'All States / UTs' }
    ],
    offlineOption: 'Visit your local Block Development Office (BDO), Tehsildar Office, or Gram Panchayat Common Service Centre (CSC) with original ancestral records.'
  },
  INCOME_CERTIFICATE: {
    title: 'Family Income Certificate',
    whatIsIt: 'An official certificate declaring the gross annual household income of the student’s parents/guardians from all sources for the current financial year.',
    issuingAuthority: 'Tehsildar, Revenue Inspector, or Sub-Divisional Officer (SDO).',
    validity: 'Valid for 1 financial year from the date of issue (must be current for 2026-27).',
    requiredProofs: [
      'Salary Slip / Form 16 / ITR acknowledgement (for salaried parents)',
      'Self-declaration of agricultural or informal income on stamp paper/affidavit',
      'Ration Card (BPL/AAY/Antyodaya card if applicable)',
      'Bank passbook statement for the past 6 months'
    ],
    officialPortals: [
      { name: 'National ServicePlus Portal', url: 'https://serviceonline.gov.in', state: 'All India' },
      { name: 'e-District Uttar Pradesh', url: 'https://edistrict.up.gov.in', state: 'Uttar Pradesh' },
      { name: 'e-District MP (MP e-District)', url: 'https://mpedistrict.gov.in', state: 'Madhya Pradesh' },
      { name: 'RTPS Bihar', url: 'https://serviceonline.bihar.gov.in', state: 'Bihar' }
    ],
    offlineOption: 'Submit an income application form along with an affidavit at your local Tehsil Revenue Counter or CSC Kiosk.'
  },
  DOMICILE_CERTIFICATE: {
    title: 'Domicile / Residence Certificate',
    whatIsIt: 'A formal document proving that the student is a permanent resident of the respective State/UT in India.',
    issuingAuthority: 'Tehsildar, Mamlatdar, District Magistrate, or Sub-Divisional Officer.',
    validity: 'Permanent / As specified by State government norms.',
    requiredProofs: [
      'Proof of continuous residence (Electricity bill, Ration card, Land registry)',
      'Birth Certificate or 10th standard passing certificate',
      'Aadhaar Card with local address',
      'Passport size photograph'
    ],
    officialPortals: [
      { name: 'ServicePlus National Portal', url: 'https://serviceonline.gov.in', state: 'All States' },
      { name: 'e-District Portal (Respective State)', url: 'https://services.india.gov.in', state: 'National Directory' }
    ],
    offlineOption: 'Apply at the Sub-Divisional Magistrate office or nearest CSC e-Seva centre.'
  },
  BONAFIDE: {
    title: 'Institution Bonafide / Admission Certificate',
    whatIsIt: 'A formal certificate issued on the official letterhead of your school, college, or university confirming that you are an active, enrolled student.',
    issuingAuthority: 'Dean of Academic Affairs, Registrar, Principal, or Head of Department (HOD).',
    validity: 'Valid for the current academic session (2026-27).',
    requiredProofs: [
      'Admission fee receipt / Enrolment ID card',
      'Original admission allotment letter',
      'AISHE institution code reference'
    ],
    officialPortals: [
      { name: 'Contact Institution Academic Section', url: '#', state: 'Direct Campus Desk' }
    ],
    offlineOption: 'Visit your college administrative office or student welfare counter to request a printed Bonafide Certificate.'
  },
  MARKSHEET: {
    title: 'Qualifying Examination Marksheet',
    whatIsIt: 'Official transcript or grade sheet of your previous qualifying examination (e.g. 10th, 12th, Bachelor’s, or Master’s degree).',
    issuingAuthority: 'Recognized School Education Board (CBSE, ICSE, State Board) or UGC-recognized University.',
    validity: 'Permanent academic record.',
    requiredProofs: [
      'DigiLocker Verified Digital Marksheet (Instantly accepted)',
      'Original printed marksheet issued by the University / Board Registrar'
    ],
    officialPortals: [
      { name: 'DigiLocker National Platform', url: 'https://www.digilocker.gov.in', state: 'All India' }
    ],
    offlineOption: 'Obtain an authorized duplicate or provisional transcript from your Board/University examination controller.'
  }
};

export const DocumentGuidanceModal: React.FC<DocumentGuidanceModalProps> = ({ docType, onClose }) => {
  // Fallback to ST certificate if unknown key
  const normalizedKey = docType.toUpperCase().includes('INCOME') 
    ? 'INCOME_CERTIFICATE' 
    : docType.toUpperCase().includes('DOMICILE') || docType.toUpperCase().includes('RESIDENCE')
    ? 'DOMICILE_CERTIFICATE'
    : docType.toUpperCase().includes('BONAFIDE') || docType.toUpperCase().includes('ADMISSION')
    ? 'BONAFIDE'
    : docType.toUpperCase().includes('MARK') || docType.toUpperCase().includes('DEGREE')
    ? 'MARKSHEET'
    : 'ST_CERTIFICATE';

  const guide = DOCUMENT_GUIDELINES[normalizedKey] || DOCUMENT_GUIDELINES.ST_CERTIFICATE;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '720px', 
          padding: '2rem', 
          borderTop: '5px solid var(--gov-saffron-600)',
          borderRadius: 'var(--radius-lg)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-saffron-700)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <FileText size={15} />
              Document Procurement Guidance
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0 0.25rem 0', fontWeight: 800 }}>
              How to Obtain: {guide.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Official government guidance on obtaining and validating this required certificate.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
            aria-label="Close guidance modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Overview & Issuing Authority */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
              What Is It?
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
              {guide.whatIsIt}
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
              Issuing Authority
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
              {guide.issuingAuthority}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--gov-green-700)', marginTop: '0.35rem' }}>
              <strong>Validity:</strong> {guide.validity}
            </div>
          </div>
        </div>

        {/* Required Proofs to Apply */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', marginBottom: '0.65rem', fontWeight: 700 }}>
            Documents / Proofs You Need to Apply:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
            {guide.requiredProofs.map((proof, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--gov-green-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{proof}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Government Service Portals */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', marginBottom: '0.65rem', fontWeight: 700 }}>
            Official State Portals (Apply Online):
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {guide.officialPortals.map((portal, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem 1rem', 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gov-navy-950)' }}>
                    {portal.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    State/Coverage: {portal.state}
                  </div>
                </div>
                {portal.url !== '#' ? (
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    Visit Official Portal <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>On-Campus</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Offline Assistance */}
        <div style={{ padding: '0.9rem 1.15rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.25rem' }}>
            Prefer Applying Offline?
          </div>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {guide.offlineOption}
          </p>
        </div>

        {/* Portal Purpose Disclaimer */}
        <div style={{ 
          padding: '0.85rem 1rem', 
          backgroundColor: 'var(--gov-saffron-50)', 
          border: '1px solid var(--gov-saffron-100)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} color="var(--gov-saffron-700)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--gov-saffron-700)', margin: 0, lineHeight: 1.4 }}>
            <strong>Note:</strong> This portal is the national scholarship application and management system and does not issue statutory certificates. Please obtain your certificate from the official state revenue authority.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <button
            onClick={onClose}
            className="btn btn-saffron"
            style={{ padding: '0.55rem 1.5rem', fontWeight: 600 }}
          >
            Close Guidance
          </button>
        </div>

      </div>
    </div>
  );
};
