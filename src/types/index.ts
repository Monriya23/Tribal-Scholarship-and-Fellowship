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

// =========================================================================
// STEP 10: POLICY INTELLIGENCE & DECISION GOVERNANCE TYPES
// =========================================================================

export type PolicyStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export type PolicyRuleType = 
  | 'ELIGIBILITY'
  | 'INCOME'
  | 'AGE'
  | 'ACADEMIC'
  | 'DOCUMENT'
  | 'INSTITUTION'
  | 'COURSE'
  | 'DOMICILE'
  | 'BENEFIT'
  | 'SELECTION'
  | 'RENEWAL'
  | 'DEADLINE'
  | 'EXCEPTION'
  | 'PAYMENT';

export type ExceptionCategory =
  | 'POLICY_CONFLICT'
  | 'MISSING_AUTHORITATIVE_SOURCE'
  | 'UNMAPPED_GRADING'
  | 'DOCUMENT_INCONSISTENCY'
  | 'INSTITUTION_UNAVAILABLE'
  | 'STATE_SPECIFIC_RULE'
  | 'BENEFIT_OVERLAP'
  | 'DEADLINE_EXCEPTION'
  | 'HUMAN_ESCALATION';

export type ExceptionStatus = 'OPEN' | 'ASSIGNED' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';

export interface PolicyRuleItem {
  id: string;
  clause_id?: string;
  policy_id?: string;
  rule_type: PolicyRuleType;
  field: string;
  operator: 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL' | 'EQUALS' | 'IN' | 'CONTAINS' | 'EXISTS';
  value: string;
  unit?: string;
  condition?: string;
  action?: string;
  priority?: number;
  effective_from?: string;
  effective_to?: string;
  source_reference: string;
  status?: string;
  created_at?: string;
}

export interface PolicyClauseItem {
  id: string;
  policy_id: string;
  section: string;
  heading: string;
  original_text: string;
  normalized_text?: string;
  source_page?: number;
  source_reference: string;
  effective_date?: string;
  rules: PolicyRuleItem[];
  created_at?: string;
}

export interface PolicyItem {
  id: string;
  scheme_id: string;
  scheme_code: string;
  scheme_name: string;
  policy_name: string;
  policy_type: string;
  version: string;
  status: PolicyStatus;
  effective_from: string;
  effective_to?: string;
  publication_date?: string;
  source_title: string;
  source_url?: string;
  source_document_id?: string;
  source_page?: number;
  extracted_at?: string;
  approved_at?: string;
  approved_by?: string;
  supersedes_policy_version?: string;
  notes?: string;
  rules_count?: number;
  clauses_count?: number;
  clauses?: PolicyClauseItem[];
  rules?: PolicyRuleItem[];
  created_at?: string;
  updated_at?: string;
}

export interface PolicySnapshotItem {
  id: string;
  application_id: string;
  scheme_id: string;
  policy_id?: string;
  policy_version: string;
  stage: string;
  applicable_rules: any[];
  input_values: Record<string, any>;
  evidence_references: any[];
  calculated_results: any[];
  system_decision: string;
  human_decision?: string;
  human_override_reason?: string;
  human_actor?: string;
  snapshot_timestamp: string;
  created_at: string;
}

export interface PolicySimulationResultItem {
  application_id: string;
  application_no: string;
  applicant_name: string;
  current_status: string;
  impact_category: string;
  details: string[];
}

export interface PolicySimulationItem {
  id: string;
  scheme_id: string;
  scheme_code?: string;
  base_policy_version: string;
  proposed_policy_version: string;
  proposed_change_description: string;
  rule_changes: {
    field: string;
    operator: string;
    value: string;
    old_value?: string;
    unit?: string;
  }[];
  total_analyzed: number;
  potentially_affected: number;
  eligibility_outcome_changes: number;
  verification_outcome_changes: number;
  manual_review_required: number;
  simulation_results: PolicySimulationResultItem[];
  simulated_by: string;
  is_sandbox: boolean;
  created_at: string;
}

export interface PolicyExceptionItem {
  id: string;
  application_id: string;
  application_no?: string;
  applicant_name?: string;
  scheme_id?: string;
  scheme_code?: string;
  category: ExceptionCategory;
  description: string;
  evidence: Record<string, any>;
  policy_version: string;
  assigned_to?: string;
  status: ExceptionStatus;
  resolution?: string;
  resolution_reason?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

