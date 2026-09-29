import React, { useState } from 'react';
import { UserRole, SchemeConfig, StudentDigitalCaseFile, ApplicationRecord } from './types';
import { NavTabId, Navigation } from './components/common/Navigation';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { StorageService } from './services/storageService';

// Public Pages
import { HeroSection } from './components/landing/HeroSection';
import { ScholarshipsPage } from './components/public/ScholarshipsPage';
import { FellowshipsPage } from './components/public/FellowshipsPage';
import { SchemeDetailPage } from './components/public/SchemeDetailPage';
import { AboutPage } from './components/public/AboutPage';
import { HelpPage } from './components/public/HelpPage';

// Auth Modal
import { AuthModal } from './components/auth/AuthModal';

// Student Workflows
import { StudentOnboarding, OnboardingProfileData } from './components/student/StudentOnboarding';
import { PersonalizedOpportunities } from './components/student/PersonalizedOpportunities';
import { StudentDashboard } from './components/student/StudentDashboard';
import { DigitalCaseFile } from './components/student/DigitalCaseFile';
import { DynamicApplicationForm } from './components/student/DynamicApplicationForm';
import { DocumentUploadLab } from './components/student/DocumentUploadLab';
import { ApplicationTimeline } from './components/student/ApplicationTimeline';
import { DeficiencyResolution } from './components/student/DeficiencyResolution';
import { PaymentTracker } from './components/student/PaymentTracker';
import { FellowshipLifecycle } from './components/student/FellowshipLifecycle';
import { GrievancePortal } from './components/student/GrievancePortal';

// Institution Desk
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { OfficerVerificationDossier } from './components/institution/OfficerVerificationDossier';

// State Desk
import { StateDashboard } from './components/state/StateDashboard';

// Ministry Admin Desk
import { MinistryDashboard } from './components/ministry/MinistryDashboard';
import { SchemeBuilder } from './components/ministry/SchemeBuilder';
import { AuditTrailViewer } from './components/ministry/AuditTrailViewer';

// Reviewer Desk
import { CandidateComparisonMatrix } from './components/reviewer/CandidateComparisonMatrix';

// Official Data & Sources (For Ministry / Officer Desks Only)
import { SourceStatusDashboard } from './components/official/SourceStatusDashboard';
import { OfficialRAGAssistant } from './components/official/OfficialRAGAssistant';

export function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('applicant');
  const [activeTab, setActiveTab] = useState<NavTabId>('landing');
  const [activeStudentId, setActiveStudentId] = useState<string>('ST-CASE-2026-JH-88341');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('ST-2026-001245');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Onboarding Profile State
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfileData | null>(null);

  // Stateful Scheme & Application Data
  const [schemes, setSchemes] = useState<SchemeConfig[]>(StorageService.getSchemes());
  const [applications, setApplications] = useState<ApplicationRecord[]>(StorageService.getApplications());
  const [selectedScheme, setSelectedScheme] = useState<SchemeConfig>(schemes[0] || null);

  const student: StudentDigitalCaseFile = StorageService.getStudentById(activeStudentId);
  const activeApplication: ApplicationRecord | null = applications.find(a => a.id === selectedApplicationId) || applications[0] || null;

  const publicTabs: NavTabId[] = [
    'landing', 
    'scholarships', 
    'fellowships', 
    'about', 
    'help', 
    'scheme_detail', 
    'onboarding', 
    'personalized_schemes'
  ];

  const isPublicPage = publicTabs.includes(activeTab);

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (newRole === 'applicant') setActiveTab('student_dashboard');
    else if (newRole === 'institution') setActiveTab('institution_dashboard');
    else if (newRole === 'state_officer') setActiveTab('state_dashboard');
    else if (newRole === 'ministry_admin') setActiveTab('ministry_dashboard');
    else if (newRole === 'expert_reviewer') setActiveTab('reviewer_dashboard');
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    window.location.reload();
  };

  const handleApplicationCreated = (newApp: ApplicationRecord) => {
    setApplications(StorageService.getApplications());
    setSelectedApplicationId(newApp.id);
    setActiveTab('application_timeline');
  };

  const handleApplicationUpdated = (updatedApp: ApplicationRecord) => {
    setApplications(StorageService.getApplications());
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    if (mode === 'register') {
      setActiveTab('onboarding');
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    handleRoleChange(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveRole('applicant');
    setActiveTab('landing');
  };

  const handleSelectSchemeDetail = (scheme: SchemeConfig) => {
    setSelectedScheme(scheme);
    setActiveTab('scheme_detail');
  };

  const handleStartApply = (scheme: SchemeConfig) => {
    setSelectedScheme(scheme);
    setActiveTab('dynamic_form');
  };

  const handleOnboardingComplete = (data: OnboardingProfileData) => {
    setOnboardingProfile(data);
    setActiveTab('personalized_schemes');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      // 1. PUBLIC PORTAL HOMEPAGE
      case 'landing':
        return (
          <main>
            <HeroSection
              schemes={schemes}
              onFindScholarship={() => setActiveTab('onboarding')}
              onExploreSchemes={() => setActiveTab('scholarships')}
              onTrackApplication={() => setActiveTab('application_timeline')}
              onTrackPayment={() => setActiveTab('payment_tracker')}
              onSelectScheme={handleSelectSchemeDetail}
              onOpenAuth={handleOpenAuth}
              onNavigatePublic={(page) => {
                if (page === 'home') setActiveTab('landing');
                else if (page === 'scholarships') setActiveTab('scholarships');
                else if (page === 'fellowships') setActiveTab('fellowships');
                else if (page === 'about') setActiveTab('about');
                else if (page === 'help') setActiveTab('help');
                else if (page === 'payment_tracker') setActiveTab('payment_tracker');
                else if (page === 'grievance_portal') setActiveTab('grievance_portal');
                else if (page === 'digital_case_file') setActiveTab('digital_case_file');
              }}
            />
          </main>
        );

      // 2. PUBLIC SCHEME CATALOGS
      case 'scholarships':
        return (
          <ScholarshipsPage
            schemes={schemes}
            onSelectScheme={handleSelectSchemeDetail}
            onApplyScheme={handleStartApply}
          />
        );

      case 'fellowships':
        return (
          <FellowshipsPage
            schemes={schemes}
            onSelectScheme={handleSelectSchemeDetail}
            onApplyScheme={handleStartApply}
          />
        );

      case 'scheme_detail':
        return (
          <SchemeDetailPage
            scheme={selectedScheme}
            onBack={() => setActiveTab('scholarships')}
            onCheckEligibility={() => setActiveTab('onboarding')}
            onApply={handleStartApply}
          />
        );

      case 'about':
        return (
          <AboutPage
            onFindScholarships={() => setActiveTab('onboarding')}
            onExploreSchemes={() => setActiveTab('scholarships')}
          />
        );

      case 'help':
        return (
          <HelpPage
            onOpenGrievance={() => setActiveTab('grievance_portal')}
            onTrackApplication={() => setActiveTab('application_timeline')}
          />
        );

      // 3. GUIDED ONBOARDING & PERSONALIZED RECOMMENDATIONS
      case 'onboarding':
        return (
          <StudentOnboarding
            onComplete={handleOnboardingComplete}
            onCancel={() => setActiveTab('landing')}
          />
        );

      case 'personalized_schemes':
        return (
          <PersonalizedOpportunities
            profileData={onboardingProfile}
            schemes={schemes}
            onSelectScheme={handleSelectSchemeDetail}
            onApplyScheme={handleStartApply}
            onRetakeQuestionnaire={() => setActiveTab('onboarding')}
          />
        );

      // 4. AUTHENTICATED STUDENT SUITE
      case 'student_dashboard':
        return (
          <StudentDashboard
            student={student}
            applications={applications}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectApplication={(appId) => {
              setSelectedApplicationId(appId);
              setActiveTab('application_timeline');
            }}
          />
        );

      case 'digital_case_file':
        return <DigitalCaseFile student={student} onNavigate={(tab) => setActiveTab(tab)} />;

      case 'dynamic_form':
        return (
          <DynamicApplicationForm
            schemes={schemes}
            selectedScheme={selectedScheme}
            student={student}
            onSchemeChange={(s) => setSelectedScheme(s)}
            onApplicationCreated={handleApplicationCreated}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      case 'ai_document_sandbox':
        return <DocumentUploadLab student={student} />;

      case 'application_timeline':
        return (
          <ApplicationTimeline
            application={activeApplication}
            onSelectAnotherApp={() => setActiveTab('student_dashboard')}
          />
        );

      case 'deficiency_center':
        return (
          <DeficiencyResolution
            applications={applications}
            onApplicationUpdated={handleApplicationUpdated}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      case 'payment_tracker':
      case 'payment_reconciliation':
        return <PaymentTracker student={student} applications={applications} />;

      case 'fellowship_lifecycle':
        return <FellowshipLifecycle student={student} applications={applications} />;

      case 'grievance_portal':
        return <GrievancePortal student={student} activeRole={activeRole} />;

      // 5. INSTITUTION OFFICER DESK
      case 'institution_dashboard':
      case 'institution_analytics':
        return (
          <InstitutionDashboard
            applications={applications}
            onOpenDossier={(app) => {
              setSelectedApplicationId(app.id);
              setActiveTab('institution_dossier');
            }}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      case 'institution_dossier':
        return (
          <OfficerVerificationDossier
            application={activeApplication}
            onBack={() => setActiveTab('institution_dashboard')}
            onApplicationUpdated={handleApplicationUpdated}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      // 6. STATE DESK
      case 'state_dashboard':
      case 'state_verification':
      case 'state_bottlenecks':
      case 'state_proposals_uc':
        return (
          <StateDashboard
            applications={applications}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      // 7. MINISTRY POLICY & ADMIN DESK
      case 'ministry_dashboard':
      case 'process_bottlenecks':
        return (
          <MinistryDashboard
            schemes={schemes}
            applications={applications}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );

      case 'scheme_builder':
        return (
          <SchemeBuilder
            schemes={schemes}
            onSchemesUpdated={(updated) => setSchemes(updated)}
          />
        );

      case 'source_status':
        return (
          <div>
            <SourceStatusDashboard />
            <OfficialRAGAssistant />
          </div>
        );

      case 'audit_trail':
        return <AuditTrailViewer />;

      // 8. REVIEWER DESK
      case 'reviewer_dashboard':
      case 'candidate_comparison':
      case 'screening_selection':
        return <CandidateComparisonMatrix applications={applications} />;

      default:
        return (
          <HeroSection
            schemes={schemes}
            onFindScholarship={() => setActiveTab('onboarding')}
            onExploreSchemes={() => setActiveTab('scholarships')}
            onTrackApplication={() => setActiveTab('application_timeline')}
            onSelectScheme={handleSelectSchemeDetail}
            onOpenAuth={handleOpenAuth}
            onNavigatePublic={(page) => {
              if (page === 'home') setActiveTab('landing');
              else if (page === 'scholarships') setActiveTab('scholarships');
              else if (page === 'fellowships') setActiveTab('fellowships');
              else if (page === 'about') setActiveTab('about');
              else if (page === 'help') setActiveTab('help');
            }}
          />
        );
    }
  };

  return (
    <div className={`app-root ${highContrast ? 'high-contrast' : ''}`}>
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        activeStudentId={activeStudentId}
        onStudentChange={setActiveStudentId}
        onResetData={handleResetData}
        highContrast={highContrast}
        onToggleHighContrast={() => {
          setHighContrast(!highContrast);
          document.body.classList.toggle('high-contrast');
        }}
        onNavigatePublic={(page) => {
          if (page === 'home') setActiveTab('landing');
          else if (page === 'scholarships') setActiveTab('scholarships');
          else if (page === 'fellowships') setActiveTab('fellowships');
          else if (page === 'about') setActiveTab('about');
          else if (page === 'help') setActiveTab('help');
        }}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={isLoggedIn ? (activeRole === 'applicant' ? (student?.fullName || 'Student Applicant') : undefined) : undefined}
      />

      {/* Conditionally render secondary navigation ONLY on authenticated desk views */}
      {!isPublicPage && (
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          activeRole={activeRole}
        />
      )}

      {renderActiveView()}

      <Footer
        onNavigatePublic={(page) => {
          if (page === 'home') setActiveTab('landing');
          else if (page === 'scholarships') setActiveTab('scholarships');
          else if (page === 'fellowships') setActiveTab('fellowships');
          else if (page === 'about') setActiveTab('about');
          else if (page === 'help') setActiveTab('help');
        }}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => {
            setIsAuthModalOpen(false);
            setActiveTab('onboarding');
          }}
        />
      )}
    </div>
  );
}

export default App;
