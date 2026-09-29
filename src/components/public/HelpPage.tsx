import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  MessageSquare, 
  BookOpen, 
  MapPin, 
  Languages, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Wifi,
  Users,
  CheckCircle2,
  Clock,
  Landmark,
  ArrowRight,
  AlertCircle,
  FileCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { AssistedAccessModal } from '../modals/AssistedAccessModal';
import { DocumentGuidanceModal } from '../modals/DocumentGuidanceModal';
import { 
  getAllStates, 
  getDistrictsForState, 
  getLanguagesForLocation, 
  getAssistancePointsForLocation,
  AssistancePoint,
  SupportedLanguageInfo
} from '../../data/locationData';

interface HelpPageProps {
  onOpenGrievance?: () => void;
  onTrackApplication?: () => void;
  initialState?: string;
  initialDistrict?: string;
}

export const HelpPage: React.FC<HelpPageProps> = ({ 
  onOpenGrievance, 
  onTrackApplication,
  initialState,
  initialDistrict
}) => {
  // Check if state/district is saved in student profile / draft
  const savedDraft = (() => {
    try {
      const draft = localStorage.getItem('mota_onboarding_draft_v2');
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  })();

  // Initial State starts empty/unselected unless explicitly passed or saved in draft
  const [selectedState, setSelectedState] = useState<string>(
    initialState || savedDraft?.state || ''
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialDistrict || savedDraft?.district || ''
  );
  const [selectedService, setSelectedService] = useState<string>('ALL');
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showAssistedModal, setShowAssistedModal] = useState<boolean>(false);
  const [selectedGuideDoc, setSelectedGuideDoc] = useState<string | null>(null);

  const statesList = getAllStates();
  const districtsList = selectedState ? getDistrictsForState(selectedState) : [];
  const availableLanguages: SupportedLanguageInfo[] = selectedState && selectedDistrict 
    ? getLanguagesForLocation(selectedState, selectedDistrict) 
    : [];
  const assistancePoints: AssistancePoint[] = selectedState && selectedDistrict 
    ? getAssistancePointsForLocation(selectedState, selectedDistrict, selectedService) 
    : [];

  // Update district if state changes
  useEffect(() => {
    if (selectedState) {
      const currentDistricts = getDistrictsForState(selectedState);
      if (currentDistricts.length > 0 && !currentDistricts.includes(selectedDistrict)) {
        setSelectedDistrict(currentDistricts[0]);
      }
    } else {
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const serviceCategories = [
    { id: 'ALL', label: 'All Assistance' },
    { id: 'Application', label: 'Application Help' },
    { id: 'Document', label: 'Document & Certificates' },
    { id: 'Fellowship', label: 'Fellowship & Research' },
    { id: 'Direct Benefit Transfer', label: 'DBT & Bank Seeding' },
    { id: 'Grievance', label: 'Grievance & Escalation' }
  ];

  // 8 Clean Need Pathways
  const needPathways = [
    { id: 'applying', title: 'Applying Online', desc: 'Step-by-step guidance on creating a profile and selecting schemes.', icon: BookOpen },
    { id: 'documents', title: 'Document & Certificates', desc: 'Procurement authorities, validity rules, and scanning instructions.', icon: FileText },
    { id: 'eligibility', title: 'Eligibility Criteria', desc: 'Income ceilings, academic thresholds, and reservation quotas.', icon: ShieldCheck },
    { id: 'status', title: 'Application Status', desc: 'Track your application stage across verification and sanction.', icon: FileCheck },
    { id: 'deficiency', title: 'Deficiency & Correction', desc: 'How to fix name mismatches, expired certificates, or blurry scans.', icon: AlertCircle },
    { id: 'grievance', title: 'Official Grievance', desc: 'Register an official inquiry ticket with SLA timeframes.', icon: MessageSquare },
    { id: 'payment', title: 'Payment / DBT', desc: 'Aadhaar-seeding, PFMS credit verification, and bank updates.', icon: CreditCard },
    { id: 'language', title: 'Language Assistance', desc: 'Support in regional & tribal languages at nearby kiosks.', icon: Languages }
  ];

  const faqs = [
    {
      q: "Who is eligible to apply for Tribal scholarships on this platform?",
      a: "Any student belonging to a notified Scheduled Tribe (ST) community residing in India and studying in recognized schools, colleges, universities, or premier institutions can apply, subject to scheme-specific academic and family income criteria."
    },
    {
      q: "What is an Aadhaar-seeded bank account and why is it mandatory?",
      a: "In compliance with Government of India Direct Benefit Transfer (DBT) norms, scholarship funds are electronically transferred directly to the student's bank account mapped with their Aadhaar in the NPCI database. This prevents middlemen and ensures immediate credit."
    },
    {
      q: "What should I do if I receive an 'Action Required' or 'Deficiency' message?",
      a: "Do not worry. An Action Required notice means the verification desk noticed a minor issue (such as an expired income certificate or slight spelling difference). Simply log in to your dashboard, click 'Fix Now', upload the requested updated document, and submit."
    },
    {
      q: "Can I apply for more than one scholarship or fellowship at the same time?",
      a: "A student can generally receive only one government scholarship for a specific academic course at a time. However, research scholars can transition from JRF to SRF or apply for specialized contingency grants as permitted under scheme guidelines."
    },
    {
      q: "How can I track the progress of my submitted application?",
      a: "Click on 'Track Application' in the header or use the application timeline tool to view the 6-stage lifecycle progress from submission to verification, merit selection, and payment disbursement."
    },
    {
      q: "How do I raise an official grievance if my payment is delayed?",
      a: "You can submit an inquiry through our Help & Grievance Desk. You will receive an official tracking ticket, and your query will be routed to the respective Institution Nodal Officer or Ministry Desk with a defined SLA resolution timeline."
    }
  ];

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* =========================================================================
            1. PAGE HEADER + LARGE REAL PHOTO 4 (Assistance & College Library)
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
              <Landmark size={15} />
              Student Access System • Official Directory
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', 
              color: 'var(--primary-maroon)', 
              margin: '0 0 0.85rem 0', 
              fontWeight: 900,
              lineHeight: 1.2
            }}>
              Help & Assistance
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.65 }}>
              Find personalized guidance and government support based on: <strong>Location</strong>, <strong>Need</strong>, and <strong>Application Stage</strong>.
            </p>
          </div>

          {/* LARGE REAL PHOTO 4 */}
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
              src="/setu_photo_4_help.png" 
              alt="Family supporting and guiding young students studying with notebooks and pencils at a desk"
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
              <span>Institution Student Desks & Digital Kiosks</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--mustard-gold)' }}>MoTA Support</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. FIND HELP NEAR YOU (Select State & District - Unselected by default)
            ========================================================================= */}
        <div className="card" style={{ 
          padding: '2rem 2.25rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border)',
          backgroundColor: '#FFFFFF',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <MapPin size={20} color="var(--terracotta)" />
            <h2 style={{ fontSize: '1.45rem', color: 'var(--primary-maroon)', margin: 0, fontWeight: 800 }}>
              Find Help Near You
            </h2>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', marginBottom: '1.5rem' }}>
            Select your State/UT and District to locate verified official tribal welfare offices, institution nodal desks, and Common Service Centres (CSCs).
          </p>

          {/* Location Filters Bar */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.15rem',
            padding: '1.35rem',
            backgroundColor: 'var(--background)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.84rem', color: 'var(--primary-maroon)' }}>
                State / UT
              </label>
              <select
                className="form-control"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ fontSize: '0.92rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="">-- Select State / UT --</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.84rem', color: 'var(--primary-maroon)' }}>
                District
              </label>
              <select
                className="form-control"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
                style={{ fontSize: '0.92rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="">{selectedState ? '-- Select District --' : 'Select State First'}</option>
                {districtsList.map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.84rem', color: 'var(--primary-maroon)' }}>
                Service Type
              </label>
              <select
                className="form-control"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{ fontSize: '0.92rem', backgroundColor: '#FFFFFF' }}
              >
                {serviceCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Condition */}
          {!selectedState || !selectedDistrict ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1.5rem',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--muted-text)',
              fontSize: '0.92rem'
            }}>
              Please select a <strong>State / UT</strong> and <strong>District</strong> above to view official assistance centres and local nodal officers.
            </div>
          ) : (
            <div>
              {/* Location Details & Language Capability Bar */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem',
                paddingBottom: '1.15rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.92rem', color: 'var(--primary-maroon)' }}>
                  Showing verified assistance in: <strong>{selectedDistrict}, {selectedState}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--muted-text)' }}>
                  <Languages size={16} color="var(--forest-green)" />
                  <span>Languages spoken:</span>
                  {availableLanguages.map(l => (
                    <span 
                      key={l.code} 
                      style={{ 
                        backgroundColor: 'var(--green-subtle)', 
                        color: 'var(--forest-green)', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        border: '1px solid rgba(23, 107, 58, 0.2)'
                      }}
                    >
                      {l.nativeName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assistance Points Cards Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {assistancePoints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-text)' }}>
                    No specific assistance centres matching the selected filter in {selectedDistrict}.
                  </div>
                ) : (
                  assistancePoints.map((point) => (
                    <div 
                      key={point.id}
                      style={{ 
                        padding: '1.35rem 1.5rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border)',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        borderLeft: point.isOfficialData ? '4px solid var(--forest-green)' : '4px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className={`badge ${point.isOfficialData ? 'badge-success' : 'badge-neutral'}`}>
                              {point.typeLabel}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                              {point.isOfficialData ? 'Verified Official Government Desk' : 'Verified Local Support'}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-maroon)', margin: 0, fontWeight: 700 }}>
                            {point.name}
                          </h4>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                          <Clock size={14} />
                          <span>{point.workingHours || 'Working hours: 9:30 AM – 5:30 PM'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.86rem' }}>
                        <div>
                          <span style={{ color: 'var(--muted-text)' }}>Address: </span>
                          <span style={{ color: 'var(--text)' }}>{point.address}, PIN: {point.pincode}</span>
                        </div>

                        <div>
                          <span style={{ color: 'var(--muted-text)' }}>Contact: </span>
                          <strong style={{ color: 'var(--text)' }}>{point.contactPerson || 'Nodal Help Desk'}</strong> {point.phone ? `(${point.phone})` : ''}
                        </div>

                        <div>
                          <span style={{ color: 'var(--muted-text)' }}>Email: </span>
                          <span style={{ color: 'var(--text)' }}>{point.email || 'Contact information via official portal'}</span>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        flexWrap: 'wrap', 
                        fontSize: '0.8rem',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid var(--border)'
                      }}>
                        <span style={{ color: 'var(--muted-text)', fontWeight: 600 }}>Services:</span>
                        {point.supportedServices.map((srv, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              backgroundColor: 'var(--background)', 
                              color: 'var(--text)', 
                              padding: '2px 7px', 
                              borderRadius: '3px',
                              border: '1px solid var(--border)',
                              fontSize: '0.78rem'
                            }}
                          >
                            {srv}
                          </span>
                        ))}

                        <span style={{ marginLeft: 'auto', color: 'var(--muted-text)' }}>
                          Languages: {point.supportedLanguages.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. WHAT DO YOU NEED HELP WITH? (8 Clean Assistance Pathways)
            ========================================================================= */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
              What Do You Need Help With?
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--muted-text)', margin: 0 }}>
              Quickly navigate to verified resources and tools based on your specific application requirement.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {needPathways.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '1.35rem 1.45rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (item.id === 'status' && onTrackApplication) onTrackApplication();
                    else if (item.id === 'grievance' && onOpenGrievance) onOpenGrievance();
                    else if (item.id === 'documents') setSelectedGuideDoc('ST_CERTIFICATE');
                    else if (item.id === 'applying') setShowAssistedModal(true);
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--primary-maroon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={18} />
                      </div>
                      <h3 style={{ fontSize: '1.02rem', color: 'var(--primary-maroon)', margin: 0, fontWeight: 700 }}>
                        {item.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--forest-green)', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.85rem' }}>
                    <span>Learn more</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            4. ASSISTED ACCESS (Accurate Wording)
            ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          borderLeft: '5px solid var(--primary-maroon)',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flex: 1, minWidth: '280px' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'var(--maroon-subtle)', 
              color: 'var(--primary-maroon)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-maroon)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>
                Need Help Applying Online?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.55 }}>
                You may be able to access assisted application support through eligible institutional or authorized assistance channels.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAssistedModal(true)}
            className="btn btn-primary"
            style={{ fontWeight: 700, padding: '0.65rem 1.35rem' }}
          >
            Learn about assisted access →
          </button>
        </div>

        {/* =========================================================================
            5. CERTIFICATE GUIDANCE (Compact List)
            ========================================================================= */}
        <div className="card" style={{ padding: '2rem 2.25rem', marginBottom: '2.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--forest-green)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <FileText size={16} />
            Document & Certificate Guidance
          </div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-maroon)', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
            Required Government Certificates
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', marginBottom: '1.25rem' }}>
            Click on any certificate to view issuing authorities, validity norms, and tips to avoid deficiency notices.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'ST Certificate', type: 'ST_CERTIFICATE' },
              { label: 'Income Certificate', type: 'INCOME_CERTIFICATE' },
              { label: 'Domicile Certificate', type: 'DOMICILE_CERTIFICATE' },
              { label: 'Institution Bonafide', type: 'BONAFIDE' },
              { label: 'Qualifying Marksheet', type: 'MARKSHEET' }
            ].map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGuideDoc(d.type)}
                className="btn btn-secondary"
                style={{ 
                  justifyContent: 'flex-start', 
                  padding: '0.85rem 1rem', 
                  fontSize: '0.88rem', 
                  fontWeight: 600, 
                  textAlign: 'left' 
                }}
              >
                <BookOpen size={16} color="var(--primary-maroon)" />
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            6. OFFICIAL CONTACT & GRIEVANCE
            ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--primary-maroon)', backgroundColor: '#FFFFFF' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'var(--maroon-subtle)', 
              color: 'var(--primary-maroon)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem' 
            }}>
              <Phone size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-maroon)', marginBottom: '0.35rem', fontWeight: 700 }}>
              National Helpline (MoTA)
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Toll-free student helpdesk for scholarship queries, DBT guidance, and portal support.
            </p>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-maroon)', marginBottom: '0.2rem' }}>
              1800-11-7788
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
              Monday to Friday: 9:30 AM – 5:30 PM
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--forest-green)', backgroundColor: '#FFFFFF' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'var(--green-subtle)', 
              color: 'var(--forest-green)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem' 
            }}>
              <Mail size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-maroon)', marginBottom: '0.35rem', fontWeight: 700 }}>
              Official Email Support
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Send application numbers and document verification inquiries directly to the Ministry desk.
            </p>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--primary-maroon)', marginBottom: '0.2rem' }}>
              tribal-scholarships@gov.in
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
              Response SLA: 2–3 Working Days
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--mustard-gold)', backgroundColor: '#FFFFFF' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'var(--gold-subtle)', 
              color: 'var(--mustard-gold)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem' 
            }}>
              <MessageSquare size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-maroon)', marginBottom: '0.35rem', fontWeight: 700 }}>
              Official Grievance Desk
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Have an unresolved application delay or DBT payment discrepancy? Register an official grievance ticket.
            </p>
            {onOpenGrievance && (
              <button
                onClick={onOpenGrievance}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 600, width: '100%', borderColor: 'var(--mustard-gold)', color: 'var(--primary-maroon)' }}
              >
                Open Grievance Desk →
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            7. FREQUENTLY ASKED QUESTIONS
            ========================================================================= */}
        <div className="card" style={{ padding: '2rem 2.25rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
              Frequently Asked Questions (FAQs)
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Clear official answers to common questions about Tribal education scholarships and fellowships.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isOpen ? 'var(--background)' : '#FFFFFF',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.94rem',
                      color: 'var(--primary-maroon)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '1rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.88rem',
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border)'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modals */}
      {showAssistedModal && (
        <AssistedAccessModal onClose={() => setShowAssistedModal(false)} />
      )}

      {selectedGuideDoc && (
        <DocumentGuidanceModal
          docType={selectedGuideDoc}
          onClose={() => setSelectedGuideDoc(null)}
        />
      )}
    </div>
  );
};

