import React, { useState } from 'react';
import { StudentDigitalCaseFile, ApplicationRecord, SchemeConfig } from '../../types';
import { NavTabId } from '../common/Navigation';
import { LanguageService } from '../../services/languageService';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  FolderCheck,
  ChevronRight,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';
import { OpportunityMatchDetailsModal } from '../modals/OpportunityMatchDetailsModal';

interface StudentDashboardProps {
  student: StudentDigitalCaseFile;
  applications: ApplicationRecord[];
  onNavigate: (tab: NavTabId) => void;
  onSelectApplication: (appId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  applications,
  onNavigate,
  onSelectApplication
}) => {
  const t = LanguageService.t();
  const [showMatchModal, setShowMatchModal] = useState(false);

  const studentApps = applications.filter(a => a.applicantMotaId === student.motaLifetimeId);
  const activeApp = studentApps[0] || applications[0];

  const hasDeficiency = studentApps.some(a => a.currentStage === 'DEFICIENT' || a.deficiencies?.some(d => d.status === 'AWAITING_APPLICANT'));

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStageNumber = (stage: string) => {
    switch (stage) {
      case 'REGISTRATION':
      case 'APPLICATION':
        return 1;
      case 'DOCUMENT_SUBMISSION':
      case 'AI_PRECHECK':
      case 'ELIGIBILITY_CHECK':
        return 2;
      case 'INSTITUTION_VERIFICATION':
      case 'DEFICIENT':
        return 3;
      case 'STATE_VERIFICATION':
        return 4;
      case 'MINISTRY_SCRUTINY':
      case 'SCREENING':
      case 'SELECTION':
        return 5;
      case 'SANCTION_AWARD':
      case 'DBT_PFMS_DISBURSEMENT':
      case 'COMPLETED':
        return 6;
      default:
        return 2;
    }
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'REGISTRATION':
      case 'APPLICATION':
        return 'Application Submitted';
      case 'DOCUMENT_SUBMISSION':
      case 'AI_PRECHECK':
      case 'ELIGIBILITY_CHECK':
        return 'Document Verification';
      case 'INSTITUTION_VERIFICATION':
        return 'Under Institution Verification';
      case 'STATE_VERIFICATION':
        return 'Under State Review';
      case 'MINISTRY_SCRUTINY':
      case 'SCREENING':
      case 'SELECTION':
        return 'Under Ministry Merit Selection';
      case 'SANCTION_AWARD':
      case 'DBT_PFMS_DISBURSEMENT':
        return 'Award Sanctioned • DBT Processing';
      case 'COMPLETED':
        return 'Active Beneficiary';
      case 'DEFICIENT':
        return 'Correction Required';
      default:
        return 'Under Verification';
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>

        {/* 1. Calm, Personal Greeting Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: '1.25rem', 
          marginBottom: '2.25rem' 
        }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              color: 'var(--forest-green)', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.35rem',
              backgroundColor: 'var(--green-subtle)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(23, 107, 58, 0.2)'
            }}>
              <ShieldCheck size={15} />
              MoTA Lifetime ID: {student.motaLifetimeId || 'ST-CASE-2026-JH-88341'}
            </div>

            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 900 }}>
              {getGreeting()}, {student.fullName}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--muted-text)', margin: 0 }}>
              Welcome to your personal SETU education journey. Track active applications, rectify documents, and explore new schemes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('onboarding')}
            className="btn btn-primary"
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <PlusCircle size={16} />
            <span>Explore Opportunities</span>
          </button>
        </div>

        {/* 2. Priority 1: YOUR NEXT STEP */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: 'var(--primary-maroon)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em', 
            marginBottom: '0.65rem' 
          }}>
            Your Next Step
          </div>

          {hasDeficiency ? (
            <div className="card" style={{ 
              padding: '1.75rem 2rem', 
              borderLeft: '6px solid var(--terracotta)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '680px' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--maroon-subtle)', 
                    color: 'var(--terracotta)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="badge badge-danger">Correction Required</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary-maroon)' }}>
                        Income Certificate Needs Correction
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.55 }}>
                      The verification desk noted that the uploaded income certificate is expired. Please upload a certificate issued for Financial Year 2025–26 to continue verification without rejection.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('deficiency_center')}
                  className="btn btn-primary"
                  style={{ fontWeight: 700, flexShrink: 0 }}
                >
                  Review Document →
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ 
              padding: '1.5rem 1.75rem', 
              borderLeft: '6px solid var(--forest-green)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--green-subtle)', 
                    color: 'var(--forest-green)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary-maroon)', display: 'block' }}>
                      All documents in order • No pending action required
                    </strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
                      Your application is progressing normally through Nodal Officer review.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (activeApp) {
                      onSelectApplication(activeApp.id);
                      onNavigate('application_timeline');
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: 600, borderColor: 'var(--primary-maroon)', color: 'var(--primary-maroon)' }}
                >
                  Track Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Priority 2: YOUR APPLICATION & LIFECYCLE JOURNEY */}
        {activeApp && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: 'var(--primary-maroon)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.65rem' 
            }}>
              Your Application
            </div>

            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary-maroon)', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-primary">{activeApp.schemeCode}</span>
                    <span className="badge badge-neutral">App ID: {activeApp.id}</span>
                  </div>

                  <h2 style={{ fontSize: '1.45rem', color: 'var(--primary-maroon)', margin: '0.2rem 0', fontWeight: 800 }}>
                    {activeApp.schemeName}
                  </h2>

                  <div style={{ fontSize: '0.9rem', color: 'var(--muted-text)', marginTop: '0.25rem' }}>
                    Course: <strong>{activeApp.courseName}</strong> • Institution: <strong>{activeApp.institutionName}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${activeApp.currentStage === 'DEFICIENT' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.86rem', padding: '0.4rem 0.85rem' }}>
                    {getStageTitle(activeApp.currentStage)}
                  </span>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginTop: '0.4rem', fontWeight: 600 }}>
                    {getStageNumber(activeApp.currentStage)} of 6 stages completed
                  </div>
                </div>
              </div>

              {/* YOUR JOURNEY Visual Timeline */}
              <div style={{ 
                backgroundColor: 'var(--background)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.35rem 1.5rem', 
                marginBottom: '1.75rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-maroon)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.95rem' }}>
                  Your Journey: Discover → Apply → Verify → Decide → Track
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  {[
                    { label: 'Discover', step: 1 },
                    { label: 'Apply', step: 2 },
                    { label: 'Verify', step: 3 },
                    { label: 'State Review', step: 4 },
                    { label: 'Decide', step: 5 },
                    { label: 'Track (DBT)', step: 6 }
                  ].map((stageItem) => {
                    const currentStepNum = getStageNumber(activeApp.currentStage);
                    const isCompleted = currentStepNum > stageItem.step;
                    const isCurrent = currentStepNum === stageItem.step;
                    const isDeficient = isCurrent && activeApp.currentStage === 'DEFICIENT';

                    return (
                      <div key={stageItem.step} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted 
                            ? 'var(--forest-green)' 
                            : isDeficient 
                            ? 'var(--terracotta)' 
                            : isCurrent 
                            ? 'var(--primary-maroon)' 
                            : 'var(--border)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.4rem auto',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          {isCompleted ? '✓' : isDeficient ? '!' : stageItem.step}
                        </div>
                        <div style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: isCurrent ? 800 : 500, 
                          color: isCurrent ? 'var(--primary-maroon)' : 'var(--muted-text)' 
                        }}>
                          {stageItem.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('digital_case_file')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: 600 }}
                >
                  View Digital Case File
                </button>

                <button
                  onClick={() => {
                    onSelectApplication(activeApp.id);
                    onNavigate('application_timeline');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  <span>Track Full Timeline</span>
                  <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. SIGNATURE SETU EXPERIENCE: WHY AM I SEEING THIS? */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{
            padding: '1.75rem 2rem',
            backgroundColor: '#FFFFFF',
            borderLeft: '5px solid var(--mustard-gold)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--mustard-gold)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  <Sparkles size={16} />
                  Why Am I Seeing This Opportunity?
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-maroon)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
                  You match several profile signals for National Fellowship (NFST)
                </h3>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '0.85rem 0', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>✓ Education Level (Post-Graduate)</span>
                  <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>✓ Tribal Category (ST Verified)</span>
                  <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>✓ Academic Information (78.4% Marks)</span>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
                  Final eligibility verification is still required upon document submission and merit selection.
                </p>
              </div>

              <button
                onClick={() => setShowMatchModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 600, borderColor: 'var(--mustard-gold)', color: 'var(--primary-maroon)' }}
              >
                View Criteria →
              </button>
            </div>
          </div>
        </div>

        {/* 5. YOUR DOCUMENTS (Real Status & Typo/Mismatch Feedback) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: 'var(--primary-maroon)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em', 
            marginBottom: '0.65rem' 
          }}>
            Your Documents
          </div>

          <div className="card" style={{ padding: '1.5rem 1.75rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: hasDeficiency ? '1.25rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <CheckCircle2 size={18} color="var(--forest-green)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Marksheet (Class X & XII)</span>
                <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>Verified</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <CheckCircle2 size={18} color="var(--forest-green)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>ST Community Certificate</span>
                <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>Verified</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                {hasDeficiency ? (
                  <>
                    <AlertCircle size={18} color="var(--terracotta)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Income Certificate</span>
                    <span className="badge badge-danger" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>Correction Required</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} color="var(--forest-green)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Income Certificate</span>
                    <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>Verified</span>
                  </>
                )}
              </div>
            </div>

            {/* Information Mismatch Callout (Clean, student-friendly, no internal jargon) */}
            {hasDeficiency && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.15rem 1.35rem',
                backgroundColor: 'var(--maroon-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(92, 36, 25, 0.2)',
                fontSize: '0.88rem'
              }}>
                <div style={{ fontWeight: 800, color: 'var(--primary-maroon)', marginBottom: '0.35rem' }}>
                  INFORMATION MISMATCH NOTICE
                </div>
                <div style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>
                  <span>Submitted Name on Application: <strong>MONIKA RIA</strong></span><br />
                  <span>Submitted Name on Income Certificate: <strong>MONIKA RIYA</strong></span>
                </div>
                <div style={{ color: 'var(--muted-text)', fontSize: '0.84rem' }}>
                  Please upload an updated document or submit an affidavit confirming name spelling to proceed.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. ESSENTIAL SERVICES */}
        <div>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: 'var(--primary-maroon)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em', 
            marginBottom: '0.65rem' 
          }}>
            Services & Support
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* DBT Tracker */}
            <div 
              onClick={() => onNavigate('payment_tracker')}
              className="card"
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--green-subtle)', color: 'var(--forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <CreditCard size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                  Direct Benefit Transfer (DBT)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                  Monitor electronic credit of stipend and academic allowance into your Aadhaar-seeded bank account.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                <span>View Bank Disbursement Status</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Document Lab */}
            <div 
              onClick={() => onNavigate('ai_document_sandbox')}
              className="card"
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--maroon-subtle)', color: 'var(--primary-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <FolderCheck size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                  Verified Documents Repository
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                  Review your stored Caste Certificate, Academic Marksheets, and income records.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-maroon)' }}>
                <span>Manage Stored Documents</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Helpdesk & Local Assistance */}
            <div 
              onClick={() => onNavigate('help')}
              className="card"
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gold-subtle)', color: 'var(--mustard-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <HelpCircle size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-maroon)', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
                  Helpdesk & Assistance Directory
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                  Locate district welfare officers, nearest CSC assistance centers, or raise an official inquiry.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-maroon)' }}>
                <span>Find Support in Your District</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Why Am I Seeing This Modal */}
      {showMatchModal && activeApp && (
        <OpportunityMatchDetailsModal
          scheme={activeApp as any}
          profileData={{
            educationStage: 'HIGHER_EDUCATION',
            courseLevel: student.currentAcademic?.courseName || 'Doctoral / Post Graduate',
            familyIncomeAnnual: student.familyIncomeAnnual || 220000,
            percentageScore: student.currentAcademic?.previousYearScorePercentage || 78.4,
            state: student.domicileState || 'Jharkhand',
            district: student.domicileDistrict || 'Ranchi',
            tribalGroup: student.tribeCommunityName || 'Santhal'
          } as any}
          onClose={() => setShowMatchModal(false)}
          onApply={() => {
            setShowMatchModal(false);
            onNavigate('scholarships');
          }}
        />
      )}
    </div>
  );
};

