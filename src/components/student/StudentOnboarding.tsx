import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  School,
  Building2,
  Sparkles,
  Globe2,
  Lock,
  Mail,
  Phone,
  User,
  HelpCircle,
  AlertCircle,
  FileCheck,
  Languages,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { getAllStates, getDistrictsForState, getLanguagesForLocation, SupportedLanguageInfo } from '../../data/locationData';

export interface OnboardingProfileData {
  // Step 1: Account
  fullName: string;
  mobileNumber: string;
  email: string;
  password?: string;
  
  // Step 2: About You
  dob: string;
  gender: string;
  category: string;
  hasStCertificate: boolean;
  stCertificateStatus: 'AVAILABLE' | 'APPLIED' | 'NEEDS_HELP';

  // Step 3: Education
  educationStage: 'SCHOOL' | 'COLLEGE' | 'RESEARCH' | 'OVERSEAS';
  schoolClass?: string; // 'Class IX', 'Class X', 'Class XI', 'Class XII'
  courseLevel?: string; // 'Undergraduate', 'Postgraduate', 'Professional Course'
  researchLevel?: string; // 'Ph.D.', 'M.Phil', 'Post-Doctoral'
  overseasLevel?: string; // 'Master\'s Abroad', 'Ph.D. Abroad'
  institutionName: string;
  courseName: string;
  yearOfStudy: string;
  percentageScore: number;
  hasUgcNetOrCsir?: boolean;
  hasOverseasOffer?: boolean;

  // Step 4: Location & Language
  state: string;
  district: string;
  preferredLanguage: string;

  // Step 5: Eligibility
  familyIncomeAnnual: number;
  isPvtg: boolean;
  isPwd: boolean;
  isFirstGeneration: boolean;
}

interface StudentOnboardingProps {
  onComplete: (data: OnboardingProfileData) => void;
  onCancel?: () => void;
  initialData?: Partial<OnboardingProfileData>;
}

const STORAGE_KEY = 'mota_onboarding_draft_v2';

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ 
  onComplete, 
  onCancel,
  initialData 
}) => {
  // Try to load existing draft from localStorage
  const savedDraft = (() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  })();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Form State
  const [fullName, setFullName] = useState<string>(initialData?.fullName || savedDraft?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState<string>(initialData?.mobileNumber || savedDraft?.mobileNumber || '');
  const [email, setEmail] = useState<string>(initialData?.email || savedDraft?.email || '');
  const [password, setPassword] = useState<string>(savedDraft?.password || '');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [dob, setDob] = useState<string>(initialData?.dob || savedDraft?.dob || '2004-05-15');
  const [gender, setGender] = useState<string>(initialData?.gender || savedDraft?.gender || 'Female');
  const [category, setCategory] = useState<string>(initialData?.category || savedDraft?.category || 'Scheduled Tribe (ST)');
  const [stCertificateStatus, setStCertificateStatus] = useState<'AVAILABLE' | 'APPLIED' | 'NEEDS_HELP'>(
    initialData?.stCertificateStatus || savedDraft?.stCertificateStatus || 'AVAILABLE'
  );

  const [educationStage, setEducationStage] = useState<'SCHOOL' | 'COLLEGE' | 'RESEARCH' | 'OVERSEAS'>(
    initialData?.educationStage || savedDraft?.educationStage || 'COLLEGE'
  );
  const [schoolClass, setSchoolClass] = useState<string>(savedDraft?.schoolClass || 'Class X');
  const [courseLevel, setCourseLevel] = useState<string>(savedDraft?.courseLevel || 'Undergraduate');
  const [researchLevel, setResearchLevel] = useState<string>(savedDraft?.researchLevel || 'Ph.D.');
  const [overseasLevel, setOverseasLevel] = useState<string>(savedDraft?.overseasLevel || 'Master\'s Abroad');
  const [institutionName, setInstitutionName] = useState<string>(initialData?.institutionName || savedDraft?.institutionName || '');
  const [courseName, setCourseName] = useState<string>(initialData?.courseName || savedDraft?.courseName || '');
  const [yearOfStudy, setYearOfStudy] = useState<string>(initialData?.yearOfStudy || savedDraft?.yearOfStudy || '1st Year');
  const [percentageScore, setPercentageScore] = useState<number>(initialData?.percentageScore || savedDraft?.percentageScore || 82.0);
  const [hasUgcNetOrCsir, setHasUgcNetOrCsir] = useState<boolean>(savedDraft?.hasUgcNetOrCsir || false);
  const [hasOverseasOffer, setHasOverseasOffer] = useState<boolean>(savedDraft?.hasOverseasOffer || false);

  const [state, setState] = useState<string>(initialData?.state || savedDraft?.state || 'Jharkhand');
  const [district, setDistrict] = useState<string>(initialData?.district || savedDraft?.district || 'Ranchi');
  const [preferredLanguage, setPreferredLanguage] = useState<string>(savedDraft?.preferredLanguage || 'en');

  const [familyIncomeAnnual, setFamilyIncomeAnnual] = useState<number>(initialData?.familyIncomeAnnual || savedDraft?.familyIncomeAnnual || 200000);
  const [isPvtg, setIsPvtg] = useState<boolean>(initialData?.isPvtg || savedDraft?.isPvtg || false);
  const [isPwd, setIsPwd] = useState<boolean>(initialData?.isPwd || savedDraft?.isPwd || false);
  const [isFirstGeneration, setIsFirstGeneration] = useState<boolean>(savedDraft?.isFirstGeneration || false);

  // States & Districts
  const statesList = getAllStates();
  const districtsList = getDistrictsForState(state);
  const availableLanguages: SupportedLanguageInfo[] = getLanguagesForLocation(state, district);

  // Reset district if selected state changes and current district is not in new state
  useEffect(() => {
    const currentDistricts = getDistrictsForState(state);
    if (currentDistricts.length > 0 && !currentDistricts.includes(district)) {
      setDistrict(currentDistricts[0]);
    }
  }, [state]);

  // Save draft whenever state changes
  useEffect(() => {
    const draft: Partial<OnboardingProfileData> = {
      fullName,
      mobileNumber,
      email,
      dob,
      gender,
      category,
      hasStCertificate: stCertificateStatus === 'AVAILABLE',
      stCertificateStatus,
      educationStage,
      schoolClass,
      courseLevel,
      researchLevel,
      overseasLevel,
      institutionName,
      courseName,
      yearOfStudy,
      percentageScore,
      hasUgcNetOrCsir,
      hasOverseasOffer,
      state,
      district,
      preferredLanguage,
      familyIncomeAnnual,
      isPvtg,
      isPwd,
      isFirstGeneration
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  }, [
    fullName, mobileNumber, email, dob, gender, category, stCertificateStatus,
    educationStage, schoolClass, courseLevel, researchLevel, overseasLevel,
    institutionName, courseName, yearOfStudy, percentageScore, hasUgcNetOrCsir,
    hasOverseasOffer, state, district, preferredLanguage, familyIncomeAnnual,
    isPvtg, isPwd, isFirstGeneration
  ]);

  // Validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) errors.fullName = 'Please enter your full name';
      if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber.replace(/\D/g, ''))) {
        errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!password && !savedDraft?.password) {
        if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!dob) errors.dob = 'Please select your date of birth';
    }

    if (step === 3) {
      if (educationStage === 'SCHOOL' && !schoolClass) {
        errors.schoolClass = 'Please select your current class';
      }
      if (educationStage === 'COLLEGE' && !courseName.trim()) {
        errors.courseName = 'Please enter your course name (e.g. B.Sc. / B.Tech / B.A.)';
      }
      if (!institutionName.trim()) {
        errors.institutionName = 'Please enter your school, college or university name';
      }
    }

    if (step === 4) {
      if (!state) errors.state = 'Please select your State';
      if (!district) errors.district = 'Please select your District';
    }

    if (step === 5) {
      if (familyIncomeAnnual < 0) errors.familyIncomeAnnual = 'Please provide valid annual family income';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Build final onboarding profile data
      const data: OnboardingProfileData = {
        fullName,
        mobileNumber,
        email,
        dob,
        gender,
        category,
        hasStCertificate: stCertificateStatus === 'AVAILABLE',
        stCertificateStatus,
        educationStage,
        schoolClass: educationStage === 'SCHOOL' ? schoolClass : undefined,
        courseLevel: educationStage === 'COLLEGE' ? courseLevel : undefined,
        researchLevel: educationStage === 'RESEARCH' ? researchLevel : undefined,
        overseasLevel: educationStage === 'OVERSEAS' ? overseasLevel : undefined,
        institutionName,
        courseName: educationStage === 'SCHOOL' ? schoolClass : (courseName || 'General Studies'),
        yearOfStudy,
        percentageScore: Number(percentageScore) || 75.0,
        hasUgcNetOrCsir,
        hasOverseasOffer,
        state,
        district,
        preferredLanguage,
        familyIncomeAnnual: Number(familyIncomeAnnual) || 200000,
        isPvtg,
        isPwd,
        isFirstGeneration
      };

      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  // Helper to handle Demo OTP verification
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setFormErrors({ ...formErrors, mobileNumber: 'Enter valid mobile number to receive OTP' });
      return;
    }
    setOtpSent(true);
    setOtpCode('8834'); // Demo auto-fill
  };

  const handleVerifyOtp = () => {
    if (otpCode === '8834' || otpCode.length === 4) {
      setIsOtpVerified(true);
    }
  };

  const steps = [
    { num: 1, label: 'Account', title: 'Create Your Account' },
    { num: 2, label: 'About You', title: 'Personal Information' },
    { num: 3, label: 'Education', title: 'Education & Studies' },
    { num: 4, label: 'Location', title: 'Location & Language' },
    { num: 5, label: 'Eligibility', title: 'Eligibility & Income' }
  ];

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--background)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {/* Ministry Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            color: 'var(--secondary-maroon)', 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            <Building2 size={15} />
            Ministry of Tribal Affairs • Government of India
          </div>
          
          <h1 style={{ fontSize: '2.1rem', color: 'var(--primary-navy)', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
            {steps[currentStep - 1].title}
          </h1>
          
          <p style={{ fontSize: '0.95rem', color: 'var(--muted-text)', margin: 0 }}>
            Step {currentStep} of 5: Complete your intake details to discover scholarships and fellowships matched to your profile.
          </p>
        </div>

        {/* Clean Institutional Stepper */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '2.25rem',
          padding: '0 0.5rem',
          position: 'relative'
        }}>
          {steps.map((s, idx) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.4rem', 
                zIndex: 2,
                flex: 1
              }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isDone) setCurrentStep(s.num);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--primary-navy)' : isCurrent ? 'var(--primary-navy)' : 'var(--surface)',
                    color: isDone || isCurrent ? '#FFFFFF' : 'var(--muted-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    border: isCurrent ? '2px solid var(--accent-gold)' : isDone ? '2px solid var(--primary-navy)' : '1px solid var(--border)',
                    boxShadow: isCurrent ? '0 0 0 4px var(--navy-subtle)' : 'none',
                    cursor: isDone ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isDone ? '✓' : s.num}
                </button>
                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: isCurrent ? 700 : 500, 
                  color: isCurrent ? 'var(--primary-navy)' : isDone ? 'var(--text)' : 'var(--muted-text)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Government Intake Card */}
        <div className="card" style={{ 
          padding: '2.25rem 2.5rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow-sm)'
        }}>

          {/* ================================================================ */}
          {/* STEP 1: CREATE ACCOUNT */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Create Your Account
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
                  Create an official account to explore scholarships, submit applications, and track Direct Benefit Transfer (DBT) payments.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Full Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Full Name (as per Aadhaar / School Certificate) <span className="required">*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Birsa Marandi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  {formErrors.fullName && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.fullName}</p>}
                </div>

                {/* Mobile & Email Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Mobile Number (Aadhaar Seeded) <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      maxLength={10}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    />
                    {formErrors.mobileNumber && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.mobileNumber}</p>}
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.email}</p>}
                  </div>
                </div>

                {/* Password fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Create Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.password}</p>}
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Confirm Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {formErrors.confirmPassword && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Optional Demo Mobile OTP Verification */}
                <div style={{ 
                  backgroundColor: 'var(--navy-subtle)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={20} color="var(--primary-navy)" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                        Mobile OTP Verification (Demonstration)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                        Instant SMS verification secures your application and DBT notifications.
                      </div>
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Send Demo OTP
                    </button>
                  ) : isOtpVerified ? (
                    <span className="badge badge-success">
                      ✓ Mobile Verified
                    </span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="OTP: 8834"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        style={{ width: '90px', padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="btn btn-primary btn-sm"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: TELL US ABOUT YOURSELF */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Tell Us About Yourself
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
                  Basic identity details to ensure correct scheme eligibility matching and reservations.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {/* Date of Birth */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Date of Birth <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    {formErrors.dob && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.dob}</p>}
                  </div>

                  {/* Gender */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Gender <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Transgender / Other">Transgender / Other</option>
                    </select>
                  </div>
                </div>

                {/* Category / ST Status */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Social Category <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Scheduled Tribe (ST)">Scheduled Tribe (ST) - Eligible for MoTA Schemes</option>
                    <option value="Particularly Vulnerable Tribal Group (PVTG)">Particularly Vulnerable Tribal Group (PVTG)</option>
                    <option value="Scheduled Caste (SC)">Scheduled Caste (SC)</option>
                    <option value="Other">Other / General</option>
                  </select>
                  <p className="form-hint">
                    Ministry of Tribal Affairs schemes exclusively support notified Scheduled Tribe students.
                  </p>
                </div>

                {/* ST Certificate Status */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Do you possess a valid State-issued ST Caste Certificate? <span className="required">*</span>
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.4rem' }}>
                    {[
                      { id: 'AVAILABLE', title: 'Yes, I have certificate', desc: 'Issued by Tehsildar / SDO' },
                      { id: 'APPLIED', title: 'Applied / In Progress', desc: 'Acknowledgement slip available' },
                      { id: 'NEEDS_HELP', title: 'Need help to apply', desc: 'Free CSC assistance available' }
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setStCertificateStatus(opt.id as any)}
                        style={{
                          padding: '0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border: stCertificateStatus === opt.id ? '2px solid var(--primary-navy)' : '1px solid var(--border)',
                          backgroundColor: stCertificateStatus === opt.id ? 'var(--navy-subtle)' : 'var(--surface)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-navy)' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)', marginTop: '0.2rem' }}>
                          {opt.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: EDUCATION (INTELLIGENT ROUTING STAGE) */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Where are you in your education?
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
                  Select your current education level. This automatically identifies whether Pre-Matric, Post-Matric, National Fellowship, or Overseas pathways apply to you.
                </p>
              </div>

              {/* 4 Selectable Pathway Tiles */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '1rem', 
                marginBottom: '1.75rem' 
              }}>
                {[
                  {
                    id: 'SCHOOL',
                    icon: School,
                    title: 'School',
                    subtitle: 'Classes IX–XII',
                    desc: 'Pre-Matric (Classes IX–X) and Higher Secondary support',
                    accentColor: 'var(--accent-terracotta)'
                  },
                  {
                    id: 'COLLEGE',
                    icon: GraduationCap,
                    title: 'College / University',
                    subtitle: 'Undergraduate & Postgraduate',
                    desc: 'B.A., B.Sc., B.Tech, MBBS, M.A., Professional Degrees',
                    accentColor: 'var(--primary-navy)'
                  },
                  {
                    id: 'RESEARCH',
                    icon: BookOpen,
                    title: 'Research',
                    subtitle: 'M.Phil / Ph.D. Scholars',
                    desc: 'Doctoral stipends under National Fellowship (NFST)',
                    accentColor: 'var(--secondary-maroon)'
                  },
                  {
                    id: 'OVERSEAS',
                    icon: Globe2,
                    title: 'Overseas Education',
                    subtitle: 'Study Abroad',
                    desc: 'Master\'s & Ph.D. in QS Top 1000 foreign universities',
                    accentColor: 'var(--accent-gold)'
                  }
                ].map((item) => {
                  const isSelected = educationStage === item.id;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setEducationStage(item.id as any)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? `2px solid ${item.accentColor}` : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'var(--surface)' : 'var(--surface)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          backgroundColor: isSelected ? item.accentColor : 'var(--navy-subtle)',
                          color: isSelected ? '#FFFFFF' : 'var(--primary-navy)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--primary-navy)' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text)', margin: 0, lineHeight: 1.45 }}>
                        {item.desc}
                      </p>

                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          color: item.accentColor
                        }}>
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CONDITIONAL QUESTIONS BASED ON SELECTED STAGE */}
              <div style={{ 
                backgroundColor: 'var(--surface-muted)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Specific Academic Information
                </div>

                {/* IF SCHOOL SELECTED */}
                {educationStage === 'SCHOOL' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">
                        Current School Class <span className="required">*</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                        {['Class IX', 'Class X', 'Class XI', 'Class XII'].map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setSchoolClass(cls)}
                            style={{
                              padding: '0.65rem',
                              textAlign: 'center',
                              borderRadius: 'var(--radius-sm)',
                              border: schoolClass === cls ? '2px solid var(--accent-terracotta)' : '1px solid var(--border)',
                              backgroundColor: schoolClass === cls ? 'var(--light-orange)' : 'var(--surface)',
                              color: schoolClass === cls ? 'var(--accent-terracotta)' : 'var(--text)',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                      <p className="form-hint">
                        {schoolClass === 'Class IX' || schoolClass === 'Class X' 
                          ? '👉 Classes IX & X map to the Pre-Matric Scholarship Scheme.'
                          : '👉 Classes XI & XII map to the Post-Matric Scholarship Scheme.'}
                      </p>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">
                        School Name & Location <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Government High School, Kanke, Ranchi"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* IF COLLEGE SELECTED */}
                {educationStage === 'COLLEGE' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Course Level <span className="required">*</span></label>
                        <select
                          className="form-control"
                          value={courseLevel}
                          onChange={(e) => setCourseLevel(e.target.value)}
                        >
                          <option value="Undergraduate">Undergraduate (B.A., B.Sc., B.Com, B.Tech, MBBS)</option>
                          <option value="Postgraduate">Postgraduate (M.A., M.Sc., M.Com, M.Tech, MD)</option>
                          <option value="Professional Course">Professional / Technical Diploma</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Course Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. B.Tech Computer Science / B.A. Economics"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">College / University Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Ranchi University / St. Xavier's College"
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Year of Study <span className="required">*</span></label>
                        <select
                          className="form-control"
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                        >
                          <option value="1st Year">1st Year (Fresh Application)</option>
                          <option value="2nd Year">2nd Year (Renewal)</option>
                          <option value="3rd Year">3rd Year (Renewal)</option>
                          <option value="4th Year">4th Year (Renewal)</option>
                          <option value="5th Year">5th Year (Renewal)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* IF RESEARCH SELECTED */}
                {educationStage === 'RESEARCH' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Research Program <span className="required">*</span></label>
                        <select
                          className="form-control"
                          value={researchLevel}
                          onChange={(e) => setResearchLevel(e.target.value)}
                        >
                          <option value="Ph.D.">Ph.D. (Doctoral Research)</option>
                          <option value="M.Phil">M.Phil</option>
                          <option value="Integrated M.Phil + Ph.D.">Integrated M.Phil + Ph.D.</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Research Discipline / Topic <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Tribal Languages & Social Welfare"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">University / Research Institution <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Banaras Hindu University / JNU / IIT Bombay"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={hasUgcNetOrCsir}
                        onChange={(e) => setHasUgcNetOrCsir(e.target.checked)}
                      />
                      <span>Qualified in UGC-NET / CSIR-NET / GATE examination (Bonus merit score for NFST)</span>
                    </label>
                  </div>
                )}

                {/* IF OVERSEAS SELECTED */}
                {educationStage === 'OVERSEAS' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Target Degree Abroad <span className="required">*</span></label>
                        <select
                          className="form-control"
                          value={overseasLevel}
                          onChange={(e) => setOverseasLevel(e.target.value)}
                        >
                          <option value="Master's Abroad">Master's Degree Abroad</option>
                          <option value="Ph.D. Abroad">Ph.D. / Doctoral Studies Abroad</option>
                          <option value="Post-Doctoral">Post-Doctoral Research Abroad</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Target Field / Subject <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Environmental Science / Public Health"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Foreign University Name <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. University of Oxford / Australian National University"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={hasOverseasOffer}
                        onChange={(e) => setHasOverseasOffer(e.target.checked)}
                      />
                      <span>I hold an unconditional admission offer letter from a QS Top 1000 institution</span>
                    </label>
                  </div>
                )}

                {/* Common percentage / marks field */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Marks / Percentage in Qualifying Examination <span className="required">*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      className="form-control"
                      style={{ maxWidth: '160px' }}
                      value={percentageScore}
                      onChange={(e) => setPercentageScore(Number(e.target.value))}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)', fontWeight: 600 }}>%</span>
                  </div>
                </div>

                {formErrors.institutionName && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.institutionName}</p>}
                {formErrors.courseName && <p className="form-hint" style={{ color: 'var(--error)' }}>{formErrors.courseName}</p>}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 4: LOCATION & LANGUAGE MAPPING */}
          {/* ================================================================ */}
          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Where do you live?
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
                  Select your State and District. This loads local language options, nearby Tribal Welfare Desks, and state verification nodal offices.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Dependent State & District Dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      State / UT of Domicile <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {statesList.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      District <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      {districtsList.map((dst) => (
                        <option key={dst} value={dst}>{dst}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location-Aware Language Selection */}
                <div style={{ 
                  backgroundColor: 'var(--surface-muted)', 
                  padding: '1.35rem 1.5rem', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                    <Languages size={18} />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      Available Languages for {district}, {state}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginBottom: '1rem' }}>
                    Choose your preferred portal language. English is active by default.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {availableLanguages.map((lang) => {
                      const isSelected = preferredLanguage === lang.code;
                      return (
                        <div
                          key={lang.code}
                          onClick={() => {
                            if (lang.isAvailable) setPreferredLanguage(lang.code);
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--primary-navy)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--navy-subtle)' : 'var(--surface)',
                            cursor: lang.isAvailable ? 'pointer' : 'not-allowed',
                            opacity: lang.isAvailable ? 1 : 0.65,
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-navy)' }}>
                              {lang.nativeName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                              {lang.name}
                            </div>
                          </div>

                          {lang.isAvailable ? (
                            isSelected && <span style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>✓</span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--border)', padding: '2px 5px', borderRadius: '3px' }}>
                              Expanding
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Local Assistance Notification */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.84rem', color: 'var(--muted-text)', padding: '0.5rem 0' }}>
                  <MapPin size={18} color="var(--accent-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    District Tribal Welfare Office and verified CSC kiosks in <strong>{district}</strong> are mapped to provide free assisted application support.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 5: ELIGIBILITY & INCOME */}
          {/* ================================================================ */}
          {currentStep === 5 && (
            <div>
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Eligibility & Family Details
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
                  Provide family income to match official ceiling thresholds (₹2.5 Lakh for Post-Matric / Pre-Matric, ₹6.0 Lakh for National Fellowship / Overseas).
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Annual Income */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Total Annual Family Income (from all sources) <span className="required">*</span>
                  </label>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)' }}>₹</span>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      max="5000000"
                      className="form-control"
                      style={{ maxWidth: '240px', fontSize: '1.05rem', fontWeight: 600 }}
                      value={familyIncomeAnnual}
                      onChange={(e) => setFamilyIncomeAnnual(Number(e.target.value))}
                    />
                    <span style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
                      (₹{(familyIncomeAnnual / 100000).toFixed(2)} Lakh/year)
                    </span>
                  </div>

                  {/* Income Ceiling Visual Helpers */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '0.75rem',
                    backgroundColor: 'var(--surface-muted)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 700, color: familyIncomeAnnual <= 250000 ? 'var(--success)' : 'var(--muted-text)' }}>
                        ● Pre & Post-Matric:
                      </span>
                      <div style={{ color: 'var(--text)' }}>Ceiling: ≤ ₹2.50 Lakh/yr</div>
                    </div>

                    <div style={{ fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 700, color: familyIncomeAnnual <= 600000 ? 'var(--success)' : 'var(--muted-text)' }}>
                        ● National Fellowship (NFST):
                      </span>
                      <div style={{ color: 'var(--text)' }}>Ceiling: ≤ ₹6.00 Lakh/yr</div>
                    </div>

                    <div style={{ fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 700, color: familyIncomeAnnual <= 600000 ? 'var(--success)' : 'var(--muted-text)' }}>
                        ● Overseas Scholarship (NOS):
                      </span>
                      <div style={{ color: 'var(--text)' }}>Ceiling: ≤ ₹6.00 Lakh/yr</div>
                    </div>
                  </div>
                </div>

                {/* Special Affirmative Criteria */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label className="form-label">
                    Special Category Affirmation (if applicable)
                  </label>

                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    backgroundColor: isPvtg ? 'var(--navy-subtle)' : 'var(--surface)'
                  }}>
                    <input
                      type="checkbox"
                      checked={isPvtg}
                      onChange={(e) => setIsPvtg(e.target.checked)}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-navy)' }}>
                        Particularly Vulnerable Tribal Group (PVTG)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>
                        Eligible for 100% scholarship coverage and priority sanctioning.
                      </div>
                    </div>
                  </label>

                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    backgroundColor: isPwd ? 'var(--navy-subtle)' : 'var(--surface)'
                  }}>
                    <input
                      type="checkbox"
                      checked={isPwd}
                      onChange={(e) => setIsPwd(e.target.checked)}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-navy)' }}>
                        Persons with Benchmark Disability (Divyangjan / PwD)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>
                        Qualifies for additional disability allowance and assistive reader allowances.
                      </div>
                    </div>
                  </label>

                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    backgroundColor: isFirstGeneration ? 'var(--navy-subtle)' : 'var(--surface)'
                  }}>
                    <input
                      type="checkbox"
                      checked={isFirstGeneration}
                      onChange={(e) => setIsFirstGeneration(e.target.checked)}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-navy)' }}>
                        First-Generation Scholar in Family
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>
                        Priority mentorship and guidance support under Ministry affirmative action.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Action Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '2.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid var(--border)' 
          }}>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft size={16} />
              <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                Draft saved automatically
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                style={{ fontWeight: 700, padding: '0.65rem 1.65rem' }}
              >
                <span>{currentStep === 5 ? 'Discover Opportunities →' : 'Continue →'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
