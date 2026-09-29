// Core TypeScript definitions for the MoTA AI-Enabled Scholarship & Fellowship Management System

export type UserRole = 
  | 'applicant' 
  | 'institution' 
  | 'state_officer' 
  | 'ministry_admin' 
  | 'expert_reviewer';

export type ApplicationStage =
  | 'REGISTRATION'
  | 'APPLICATION'
  | 'DOCUMENT_SUBMISSION'
  | 'AI_PRECHECK'
  | 'ELIGIBILITY_CHECK'
  | 'INSTITUTION_VERIFICATION'
  | 'STATE_VERIFICATION'
  | 'MINISTRY_SCRUTINY'
  | 'SCREENING'
  | 'SELECTION'
  | 'SANCTION_AWARD'
  | 'DBT_PFMS_DISBURSEMENT'
  | 'POST_SELECTION'
  | 'COMPLETED'
  | 'DEFICIENT'
  | 'REJECTED';

export type VerificationStatus = 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED' | 'PENDING' | 'DEFICIENT';

export type DeficiencyStatus = 'OPEN' | 'AWAITING_APPLICANT' | 'RESUBMITTED' | 'RESOLVED' | 'WAIVED';

export type PaymentStatus = 
  | 'SANCTIONED'
  | 'PFMS_BILL_GENERATED'
  | 'TREASURY_VALIDATED'
  | 'DBT_PROCESSING'
  | 'CREDITED'
  | 'FAILED'
  | 'ON_HOLD';

// Scheme Definition
export interface EligibilityRule {
  id: string;
  field: string;
  label: string;
  operator: 'EQUALS' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL' | 'IN' | 'CONTAINS';
  targetValue: any;
  explanation: string;
  mandatory: boolean;
}

export interface RequiredDocumentConfig {
  docType: string;
  label: string;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
  extractionFields: string[];
}

export interface SchemeConfig {
  id: string;
  code: string;
  name: string;
  version: string;
  category: 'PRE_MATRIC' | 'POST_MATRIC' | 'HIGHER_EDUCATION_FELLOWSHIP' | 'OVERSEAS_STUDIES' | 'TOP_CLASS';
  fundingType: 'CENTRAL_SECTOR' | 'CENTRALLY_SPONSORED';
  centralSharePercent: number; // e.g., 75% or 100%
  stateSharePercent: number;
  description: string;
  objective: string;
  targetBeneficiaries: string;
  financialBenefits: {
    stipendMonthly?: number;
    contingencyAnnual?: number;
    tuitionFeeCapAnnual?: number;
    maintenanceAllowanceMonthly?: number;
    booksStationeryAnnual?: number;
    travelGrantOneTime?: number;
  };
  eligibilityRules: EligibilityRule[];
  requiredDocuments: RequiredDocumentConfig[];
  workflowStages: ApplicationStage[];
  selectionMode: 'DETERMINISTIC_MERIT' | 'SLOT_BASED_QUOTA' | 'EXPERT_COMMITTEE_REVIEW' | 'DIRECT_SANCTION';
  totalSlotsAnnual: number;
  applicationDeadline: string;
  activeAcademicYear: string;
  renewalPolicy: {
    allowAutoRenewal: boolean;
    minAttendancePercent?: number;
    minGpaPercent?: number;
    requireProgressReport: boolean;
  };
}

// Student Digital Case File
export interface VerifiedDocumentVaultItem {
  id: string;
  docType: string;
  docNumber: string;
  issuedBy: string;
  issueDate: string;
  validUntil?: string;
  verificationSource: 'DIGILOCKER' | 'STATE_CASTE_PORTAL' | 'IT_DEPT' | 'AI_OCR_VERIFIED';
  verificationHash: string;
  fileUrl: string;
  extractedData: Record<string, any>;
  verifiedAt: string;
}

export interface PastAwardRecord {
  awardId: string;
  schemeCode: string;
  schemeName: string;
  academicYear: string;
  course: string;
  institutionName: string;
  sanctionOrderNumber: string;
  totalAmountDisbursed: number;
  status: 'COMPLETED' | 'UPGRADED' | 'ACTIVE';
  motaFellowshipId?: string;
}

export interface StudentDigitalCaseFile {
  motaLifetimeId: string; // e.g. ST-CASE-2026-JH-88341
  aadhaarVaultRef: string; // Last 4 digits: XXXX-XXXX-4819
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  tribeCommunityName: string; // e.g. Santhal, Munda, Oraon, Bhil, Gond
  casteCertificateNumber: string;
  domicileState: string;
  domicileDistrict: string;
  pincode: string;
  mobile: string;
  email: string;
  bankDetails: {
    accountNumberMasked: string;
    accountHolderName: string;
    bankName: string;
    ifscCode: string;
    isAadhaarSeeded: boolean;
    npciStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING_VALIDATION';
  };
  currentAcademic: {
    degreeLevel: '10TH' | '12TH' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'MPHIL' | 'PHD' | 'POSTDOC';
    courseName: string;
    specialization?: string;
    institutionAisheCode: string;
    institutionName: string;
    institutionState: string;
    currentYearOfStudy: number;
    admissionYear: number;
    enrolmentNumber: string;
    previousYearScorePercentage: number;
  };
  familyIncomeAnnual: number;
  verifiedDocuments: VerifiedDocumentVaultItem[];
  pastAwards: PastAwardRecord[];
  activeFellowshipId?: string;
}

// Document AI Intelligence Types
export interface ExtractedField {
  fieldName: string;
  fieldLabel: string;
  extractedValue: any;
  declaredValue: any;
  isMatch: boolean;
  confidence: number; // 0 to 100
  note?: string;
}

export interface DocumentAIDiagnostic {
  documentId: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  ocrReadabilityScore: number; // 0 to 100
  classificationScore: number; // 0 to 100
  classifiedAs: string;
  isCorrectType: boolean;
  overallConfidence: number; // 0 to 100
  extractedFields: ExtractedField[];
  crossDocumentConsistency: {
    nameMatchScore: number;
    dobMatchScore: number;
    casteMatchScore: number;
    incomeMatchScore: number;
    overallConsistency: 'CONSISTENT' | 'MINOR_DISCREPANCY' | 'MAJOR_MISMATCH';
    notes: string[];
  };
  anomaliesDetected: {
    type: 'MISMATCH' | 'EXPIRED' | 'BLURRY_TEXT' | 'TAMPER_ALERT' | 'MISSING_MANDATORY_FIELD';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
    recommendedAction: string;
  }[];
  evaluationStatus: VerificationStatus;
}

// Structured Deficiency
export interface DeficiencyRecord {
  id: string;
  applicationId: string;
  documentType: string;
  stageCreated: ApplicationStage;
  raisedByOfficer: string;
  raisedByRole: UserRole;
  createdAt: string;
  deadlineDate: string;
  issueDescription: string;
  requiredAction: string;
  status: DeficiencyStatus;
  resubmittedDocumentId?: string;
  resubmissionTimestamp?: string;
  resubmissionAiVerificationScore?: number;
  officerResolutionNotes?: string;
  resolvedAt?: string;
}

// Application Record
export interface ApplicationRecord {
  id: string; // e.g. ST-2026-001245
  applicantMotaId: string;
  applicantName: string;
  applicantTribe: string;
  applicantEmail: string;
  applicantMobile: string;
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  academicYear: string;
  currentStage: ApplicationStage;
  isRenewal: boolean;
  linkedPreviousAwardId?: string;
  submissionDate: string;
  lastUpdatedDate: string;
  institutionAisheCode: string;
  institutionName: string;
  state: string;
  district: string;
  courseName: string;
  declaredIncome: number;
  declaredPercentage: number;
  researchTopic?: string;
  overseasUniversityName?: string;
  overseasQsRanking?: number;
  
  // Intelligence & Engine Outputs
  aiPrecheckCompleted: boolean;
  aiOverallConfidence: number;
  aiSummaryNotes: string;
  documentDiagnostics: DocumentAIDiagnostic[];
  
  // Policy & Selection Provenance
  evaluatedPolicyVersion?: string;
  rank?: number;
  normalizedPercentage?: number;
  normalizationMethod?: string;
  normalizationSource?: string;
  
  ruleEvaluationResults: {
    ruleId: string;
    ruleLabel: string;
    requiredCriteria: string;
    extractedValue: string;
    status: 'PASS' | 'FAIL' | 'REVIEW';
    ruleExplanation: string;
  }[];
  isEligibilitySatisfied: boolean;
  
  // Workflow & Reviews
  institutionReview?: {
    reviewedBy: string;
    reviewedAt: string;
    decision: 'APPROVED' | 'DEFICIENT' | 'REJECTED';
    remarks: string;
    daysTaken: number;
  };
  stateReview?: {
    reviewedBy: string;
    reviewedAt: string;
    decision: 'APPROVED' | 'DEFICIENT' | 'REJECTED';
    remarks: string;
    daysTaken: number;
  };
  ministryReview?: {
    reviewedBy: string;
    reviewedAt: string;
    decision: 'SANCTIONED' | 'DEFICIENT' | 'REJECTED' | 'SENT_TO_SCREENING';
    remarks: string;
    sanctionOrderNo?: string;
  };
  expertReview?: {
    reviewerName: string;
    proposalScore: number; // 0-100
    academicMeritScore: number;
    recommendation: 'STRONGLY_RECOMMENDED' | 'RECOMMENDED' | 'WAITLISTED' | 'NOT_RECOMMENDED';
    feedback: string;
  };
  
  deficiencies: DeficiencyRecord[];
  
  // Payment
  paymentInfo?: {
    sanctionedAmount: number;
    monthlyDisbursementAmount: number;
    paymentStatus: PaymentStatus;
    sanctionDate?: string;
    pfmsBillNumber?: string;
    pfmsBillDate?: string;
    treasuryTokenNumber?: string;
    bankUtrNumber?: string;
    disbursedDate?: string;
    failureReason?: string;
    actionRequired?: string;
  };
  
  // Fellowship Tracking (Post Selection)
  fellowshipData?: {
    fellowshipAwardId: string;
    tenureYears: number;
    joiningDate: string;
    guideSupervisorName: string;
    currentQuarter: number;
    reportsSubmitted: {
      quarter: number;
      submittedOn: string;
      verifiedByHod: boolean;
      approvedByMota: boolean;
      status: 'APPROVED' | 'PENDING' | 'REVISION_NEEDED';
    }[];
    contingencyClaims: {
      claimId: string;
      amount: number;
      purpose: string;
      date: string;
      status: 'PAID' | 'PROCESSING' | 'SUBMITTED';
    }[];
    isUpgradationEligible: boolean; // M.Phil -> Ph.D
  };
  
  // Timeline audit
  timeline: {
    stage: ApplicationStage;
    label: string;
    actor: string;
    timestamp: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
    durationDays?: number;
    comments?: string;
  }[];
}

// Grievance Model
export interface GrievanceTicket {
  id: string; // e.g. GRV-2026-9042
  applicationId?: string;
  applicantMotaId: string;
  applicantName: string;
  category: 'DOCUMENT_VERIFICATION' | 'PAYMENT_DELAY' | 'BANK_NPCI_ERROR' | 'DEFICIENCY_DISPUTE' | 'RENEWAL_ISSUE' | 'OTHER';
  subject: string;
  description: string;
  createdAt: string;
  slaDeadlineDays: number;
  assignedAuthority: 'INSTITUTION_NODAL' | 'STATE_TRIBAL_WELFARE' | 'MINISTRY_OF_TRIBAL_AFFAIRS' | 'PFMS_HELPDESK';
  status: 'SUBMITTED' | 'ASSIGNED' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  resolutionNotes?: string;
  resolvedAt?: string;
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
  }[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  ipAddress: string;
  actionType: 'VIEW_DOSSIER' | 'AI_OCR_SCAN' | 'RULE_EVALUATION' | 'RAISE_DEFICIENCY' | 'RESUBMIT_DOCUMENT' | 'APPROVE_APPLICATION' | 'SANCTION_GENERATE' | 'PFMS_DISBURSE' | 'UPDATE_SCHEME_CONFIG' | 'RESOLVE_GRIEVANCE';
  targetEntityId: string;
  entityType: 'APPLICATION' | 'DOCUMENT' | 'SCHEME' | 'PAYMENT' | 'GRIEVANCE';
  details: string;
}

// Bottleneck Analytics Data
export interface BottleneckMetric {
  stage: ApplicationStage;
  stageName: string;
  pendingCount: number;
  delayedBeyondSlaCount: number;
  averageDaysTaken: number;
  targetSlaDays: number;
  deficiencyRatePercent: number;
  errorRatePercent: number;
  stateBreakdown: {
    stateName: string;
    pendingCount: number;
    averageDays: number;
    criticalAlert: boolean;
  }[];
  topLaggingInstitutions: {
    aisheCode: string;
    institutionName: string;
    state: string;
    pendingCases: number;
    oldestPendingDays: number;
  }[];
}
