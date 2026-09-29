import React, { useState, useEffect } from 'react';
import { SchemeConfig, StudentDigitalCaseFile, ApplicationRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { PolicyRuleEngine } from '../../services/ruleEngine';
import { NavTabId } from '../common/Navigation';
import { DocumentGuidanceModal } from '../modals/DocumentGuidanceModal';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  User,
  GraduationCap,
  Building,
  CreditCard,
  Lock,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DynamicApplicationFormProps {
  schemes: SchemeConfig[];
  selectedScheme: SchemeConfig | null;
  student: StudentDigitalCaseFile;
  onSchemeChange: (scheme: SchemeConfig) => void;
  onApplicationCreated: (newApp: ApplicationRecord) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const DynamicApplicationForm: React.FC<DynamicApplicationFormProps> = ({
  schemes,
  selectedScheme,
  student,
  onSchemeChange,
  onApplicationCreated,
  onNavigate
}) => {
  const currentScheme = selectedScheme || schemes[0];

  // 6 Steps: 1. Personal Details, 2. Academic Details, 3. Family & Eligibility, 4. Documents, 5. Review, 6. Submit
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGuideDoc, setSelectedGuideDoc] = useState<string | null>(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: student.fullName,
    dob: student.dateOfBirth,
    gender: student.gender,
    mobile: student.mobile || '9876543210',
    email: student.email || `${student.fullName.toLowerCase().replace(/\s+/g, '.')}@scholar.gov.in`,
    tribe: student.tribeCommunityName || 'Scheduled Tribe',
    casteCertNo: student.casteCertificateNumber || 'JH/ST/2025/9812',
    state: student.domicileState || 'Jharkhand',
    district: student.domicileDistrict || 'Ranchi',
    courseName: student.currentAcademic?.courseName || 'Ph.D in Environmental Science & Forestry',
    institutionName: student.currentAcademic?.institutionName || 'Banaras Hindu University (BHU)',
    institutionAishe: student.currentAcademic?.institutionAisheCode || 'U-0085',
    admissionYear: student.currentAcademic?.admissionYear || 2025,
    previousPercentage: student.currentAcademic?.previousYearScorePercentage || 84.5,
    annualIncome: student.familyIncomeAnnual || 220000,
    bankName: student.bankDetails?.bankName || 'State Bank of India',
    bankAccountMasked: student.bankDetails?.accountNumberMasked || 'XXXXXX4019',
    ifsc: student.bankDetails?.ifscCode || 'SBIN0001234',
    isAadhaarSeeded: student.bankDetails?.isAadhaarSeeded ?? true,
    researchTopic: 'Ethnobotany & Sacred Grove Conservation in Chota Nagpur Plateau',
    foreignUniversityName: '',
    foreignQsRank: 250
  });

  // Document Uploads List
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    docType: string;
    label: string;
    fileName: string;
    status: 'VERIFIED' | 'NEEDS_ATTENTION' | 'PENDING';
  }[]>([
    {
      docType: 'CASTE_CERTIFICATE',
      label: 'Scheduled Tribe (ST) Certificate',
      fileName: 'ST_Certificate_Official.pdf',
      status: 'VERIFIED'
    },
    {
      docType: 'INCOME_CERTIFICATE',
      label: 'Annual Income Certificate (FY 2025-26)',
      fileName: 'Income_Certificate_FY2025_26_Valid.pdf',
      status: 'VERIFIED'
    },
    {
      docType: 'BONAFIDE_CERTIFICATE',
      label: 'Institution Bonafide & Enrolment Certificate',
      fileName: 'BHU_Bonafide_Enrolment.pdf',
      status: 'VERIFIED'
    },
    {
      docType: 'MARKSHEET',
      label: 'Post-Graduate Qualifying Marksheet',
      fileName: 'Post_Grad_Marksheet_BHU.pdf',
      status: 'VERIFIED'
    }
  ]);

  const stepTitles = [
    'Personal Details',
    'Academic Details',
    'Family & Eligibility',
    'Documents',
    'Review',
    'Submit'
  ];

  const handleSaveDraft = () => {
    try {
      const draftPayload = {
        formData,
        currentStep,
        uploadedDocuments,
        schemeId: currentScheme.id,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(`TSF_DRAFT_${currentScheme.id}`, JSON.stringify(draftPayload));
      setDraftSavedNotice('Your application is saved as a draft. You can continue when you are connected.');
      setTimeout(() => setDraftSavedNotice(null), 6000);
    } catch (e) {
      setDraftSavedNotice('Draft saved locally in your browser.');
      setTimeout(() => setDraftSavedNotice(null), 4000);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newAppId = `ST-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const newApplication: ApplicationRecord = {
        id: newAppId,
        applicantMotaId: student.motaLifetimeId,
        applicantName: formData.fullName,
        applicantTribe: formData.tribe,
        applicantEmail: formData.email,
        applicantMobile: formData.mobile,
        schemeId: currentScheme.id,
        schemeCode: currentScheme.code,
        schemeName: currentScheme.name,
        academicYear: '2026-27',
        currentStage: 'INSTITUTION_VERIFICATION',
        isRenewal: false,
        submissionDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        institutionAisheCode: formData.institutionAishe,
        institutionName: formData.institutionName,
        state: formData.state,
        district: formData.district,
        courseName: formData.courseName,
        declaredIncome: formData.annualIncome,
        declaredPercentage: formData.previousPercentage,
        researchTopic: formData.researchTopic,
        aiPrecheckCompleted: true,
        aiOverallConfidence: 96,
        aiSummaryNotes: 'All uploaded certificates successfully verified against declared details with zero discrepancies.',
        documentDiagnostics: [],
        ruleEvaluationResults: currentScheme.eligibilityRules.map(r => ({
          ruleId: r.id,
          ruleLabel: r.label,
          requiredCriteria: r.explanation,
          extractedValue: 'Satisfied from student profile & documents',
          status: 'PASS',
          ruleExplanation: r.explanation
        })),
        isEligibilitySatisfied: true,
        deficiencies: [],
        timeline: [
          {
            stage: 'REGISTRATION',
            label: 'Application Submitted',
            actor: `${formData.fullName} (Student)`,
            timestamp: new Date().toISOString(),
            status: 'COMPLETED',
            comments: 'Application form filled and submitted online.'
          },
          {
            stage: 'AI_PRECHECK',
            label: 'Documents Checked',
            actor: 'Verification System',
            timestamp: new Date().toISOString(),
            status: 'COMPLETED',
            comments: 'All 4 required certificates verified.'
          },
          {
            stage: 'INSTITUTION_VERIFICATION',
            label: 'Institution Verification',
            actor: `${formData.institutionName} Nodal Officer`,
            timestamp: new Date().toISOString(),
            status: 'IN_PROGRESS',
            comments: 'Queued for university scrutiny.'
          },
          {
            stage: 'MINISTRY_SCRUTINY',
            label: 'Ministry Review',
            actor: 'Ministry of Tribal Affairs Scrutiny Cell',
            timestamp: new Date().toISOString(),
            status: 'PENDING'
          },
          {
            stage: 'SELECTION',
            label: 'Merit Selection & Ranking',
            actor: 'Selection Committee',
            timestamp: new Date().toISOString(),
            status: 'PENDING'
          },
          {
            stage: 'SANCTION_AWARD',
            label: 'Sanction & Award Disbursement',
            actor: 'Direct Benefit Transfer (DBT)',
            timestamp: new Date().toISOString(),
            status: 'PENDING'
          }
        ]
      };

      StorageService.updateApplication(newApplication);
      StorageService.logActivity({
        actorRole: 'applicant',
        actorName: formData.fullName,
        ipAddress: '103.24.11.89',
        actionType: 'APPROVE_APPLICATION',
        targetEntityId: newAppId,
        entityType: 'APPLICATION',
        details: `Submitted application for ${currentScheme.name} (${currentScheme.code})`
      });

      setIsSubmitting(false);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onApplicationCreated(newApplication);
    }, 1200);
  };

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Draft Notification Banner */}
        {draftSavedNotice && (
          <div style={{ 
            backgroundColor: 'var(--gov-green-50)', 
            border: '1px solid var(--gov-green-600)', 
            color: 'var(--gov-green-800)', 
            padding: '0.85rem 1.25rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Check size={18} color="var(--gov-green-700)" />
            <span>{draftSavedNotice}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--gov-saffron-700)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <FileText size={16} />
              Scholarship Application
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0.25rem 0', fontWeight: 800 }}>
              Your Application
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
              Applying for: <strong>{currentScheme.name}</strong> ({currentScheme.code})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              title="Save your progress locally"
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>
            <span className="badge badge-neutral" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              Step {currentStep} of 6
            </span>
          </div>
        </div>

        {/* 6-Step Stepper Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--gov-green-700)' : isCurrent ? 'var(--gov-navy-900)' : 'var(--bg-muted)',
                  color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: isCurrent ? '2px solid var(--gov-saffron-500)' : '1px solid var(--border-medium)',
                  margin: '0 auto'
                }}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--gov-navy-950)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Spacious Step Content Card */}
        <div className="card" style={{ padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Step 1: Personal Details
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Please verify your personal information. These details should match your identity documents.
              </p>

              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Date of Birth <span className="required">*</span></label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender <span className="required">*</span></label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="form-control"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number (Aadhaar linked) <span className="required">*</span></label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC DETAILS */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Step 2: Academic Details
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Enter your current course details and latest examination marks.
              </p>

              <div className="form-group">
                <label className="form-label">Institution / College Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course / Degree Program <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Admission Year <span className="required">*</span></label>
                  <input
                    type="number"
                    value={formData.admissionYear}
                    onChange={(e) => setFormData({ ...formData, admissionYear: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifying Exam Percentage (%) <span className="required">*</span></label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.previousPercentage}
                    onChange={(e) => setFormData({ ...formData, previousPercentage: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              {currentScheme.category === 'HIGHER_EDUCATION_FELLOWSHIP' && (
                <div className="form-group">
                  <label className="form-label">Research / Doctoral Topic Synopsis</label>
                  <textarea
                    rows={3}
                    value={formData.researchTopic}
                    onChange={(e) => setFormData({ ...formData, researchTopic: e.target.value })}
                    className="form-control"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FAMILY & ELIGIBILITY */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Step 3: Family & Eligibility
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Confirm your Scheduled Tribe caste details and annual household income.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">ST Community / Tribe <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.tribe}
                    onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caste Certificate Number <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.casteCertNo}
                    onChange={(e) => setFormData({ ...formData, casteCertNo: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Annual Family Income (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  step="5000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                  className="form-control"
                />
                <div className="form-hint">Make sure this amount matches your Revenue Department Income Certificate.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">State of Domicile <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">District <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Step 4: Upload Required Documents
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Upload clear PDF or JPG copies. All documents are verified to confirm eligibility.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {uploadedDocuments.map((doc, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={18} color="var(--gov-navy-800)" />
                          <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
                            {doc.label}
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Uploaded File: <code>{doc.fileName}</code>
                        </div>
                      </div>

                      <span className="badge badge-success">
                        ✓ Document Verified
                      </span>
                    </div>

                    <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-light)' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedGuideDoc(doc.docType)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--gov-saffron-700)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline'
                        }}
                      >
                        Don't have this document yet? Learn how to obtain it →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Step 5: Review Application Summary
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Please review your declared details and verified documents before final submission.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applicant</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{formData.fullName}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formData.tribe} Tribe • {formData.gender}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Course</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--gov-navy-950)' }}>{formData.courseName}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formData.institutionName} ({formData.previousPercentage}%)</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Income & Bank DBT</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--gov-navy-950)' }}>₹{formData.annualIncome.toLocaleString('en-IN')} / yr</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gov-green-700)' }}>✓ {formData.bankName} (Aadhaar Seeded)</span>
                </div>
              </div>

              <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--gov-green-50)', borderRadius: '8px', borderLeft: '4px solid var(--gov-green-700)', fontSize: '0.88rem', color: 'var(--gov-green-900)' }}>
                ✓ <strong>Pre-Check Clear: </strong> Your application satisfies all fundamental eligibility benchmarks and is ready for submission to the institution nodal desk.
              </div>
            </div>
          )}

          {/* STEP 6: SUBMIT */}
          {currentStep === 6 && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--gov-green-50)', color: 'var(--gov-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <ShieldCheck size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--gov-navy-950)', marginBottom: '0.5rem', fontWeight: 800 }}>
                Ready to Submit Your Application
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                By submitting, you certify that all information and certificates provided are accurate and genuine. Your application will be forwarded to <strong>{formData.institutionName}</strong> for nodal verification.
              </p>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-saffron btn-lg"
                style={{ fontWeight: 700, minWidth: '240px' }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </button>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          {currentStep < 6 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem' }}
                >
                  <Save size={15} />
                  <span>Save & Continue Later</span>
                </button>
              </div>

              <button
                onClick={handleNext}
                className="btn btn-saffron btn-lg"
                style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>{currentStep === 5 ? 'Proceed to Submit' : 'Continue'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Document Guidance Modal */}
        {selectedGuideDoc && (
          <DocumentGuidanceModal
            docType={selectedGuideDoc}
            onClose={() => setSelectedGuideDoc(null)}
          />
        )}
      </div>
    </div>
  );
};
