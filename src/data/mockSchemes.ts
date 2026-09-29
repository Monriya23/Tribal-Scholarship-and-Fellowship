import { SchemeConfig } from '../types';

export const INITIAL_SCHEMES: SchemeConfig[] = [
  {
    id: 'scheme_pms_st_2026',
    code: 'PMS-ST',
    name: 'Post-Matric Scholarship for Scheduled Tribe Students',
    version: 'v4.2 (2025-26 Revised)',
    category: 'POST_MATRIC',
    fundingType: 'CENTRALLY_SPONSORED',
    centralSharePercent: 75,
    stateSharePercent: 25,
    description: 'Centrally Sponsored Scheme to provide financial assistance to ST students studying at post-matriculation or post-secondary stages to enable them to complete their higher education.',
    objective: 'To substantially increase the Gross Enrolment Ratio (GER) of ST students in higher education with a focus on poorest households.',
    targetBeneficiaries: 'ST students enrolled in recognized Class 11, 12, ITI, Polytechnic, UG, and PG courses.',
    financialBenefits: {
      tuitionFeeCapAnnual: 120000,
      maintenanceAllowanceMonthly: 1200,
      booksStationeryAnnual: 3000,
      contingencyAnnual: 5000
    },
    eligibilityRules: [
      {
        id: 'rule_pms_cat',
        field: 'category',
        label: 'Social Category is Scheduled Tribe (ST)',
        operator: 'EQUALS',
        targetValue: 'ST',
        explanation: 'Applicant must belong to a notified Scheduled Tribe of the respective State/UT.',
        mandatory: true
      },
      {
        id: 'rule_pms_inc',
        field: 'familyIncomeAnnual',
        label: 'Annual Family Income <= ₹2,50,000',
        operator: 'LESS_THAN_OR_EQUAL',
        targetValue: 250000,
        explanation: 'Combined parental/family annual income from all sources must not exceed ₹2.50 Lakh.',
        mandatory: true
      },
      {
        id: 'rule_pms_deg',
        field: 'degreeLevel',
        label: 'Post-Matric Recognized Course',
        operator: 'IN',
        targetValue: ['11TH', '12TH', 'UNDERGRADUATE', 'POSTGRADUATE', 'MPHIL', 'PHD'],
        explanation: 'Course must be post-Class 10 in an AISHE/UGC/AICTE recognized institution.',
        mandatory: true
      },
      {
        id: 'rule_pms_score',
        field: 'previousYearScorePercentage',
        label: 'Passed Qualifying Examination (>= 45%)',
        operator: 'GREATER_THAN_OR_EQUAL',
        targetValue: 45,
        explanation: 'Must have passed previous qualifying examination without backlog.',
        mandatory: true
      }
    ],
    requiredDocuments: [
      {
        docType: 'CASTE_CERTIFICATE',
        label: 'ST Caste / Community Certificate',
        description: 'Digitally signed ST Certificate issued by competent revenue authority (SDO/Tehsildar) or DigiLocker pull.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'applicantName', 'tribeName', 'issueDate', 'issuingAuthority']
      },
      {
        docType: 'INCOME_CERTIFICATE',
        label: 'Income Certificate (FY 2025-26)',
        description: 'Valid Income Certificate issued by competent authority showing total family income.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'annualIncomeAmount', 'financialYear', 'headOfFamily', 'issueDate']
      },
      {
        docType: 'MARKSHEET',
        label: 'Previous Year Marksheet / Scorecard',
        description: 'Official marksheet showing total marks and percentage obtained.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 5,
        extractionFields: ['rollNumber', 'examName', 'totalMarksObtained', 'percentage', 'passStatus']
      },
      {
        docType: 'FEE_RECEIPT',
        label: 'Current Academic Year Fee Receipt / Admission Proof',
        description: 'Receipt from the college/university acknowledging current year enrolment.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 5,
        extractionFields: ['receiptNumber', 'amountPaid', 'academicYear', 'institutionName']
      },
      {
        docType: 'BANK_PASSBOOK',
        label: 'Aadhaar-Seeded Bank Passbook / Mandate',
        description: 'First page of bank passbook clearly showing Account Number, IFSC, and Name.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 5,
        extractionFields: ['accountNumber', 'ifscCode', 'accountHolderName', 'bankName']
      }
    ],
    workflowStages: [
      'REGISTRATION',
      'APPLICATION',
      'DOCUMENT_SUBMISSION',
      'AI_PRECHECK',
      'ELIGIBILITY_CHECK',
      'INSTITUTION_VERIFICATION',
      'STATE_VERIFICATION',
      'MINISTRY_SCRUTINY',
      'SANCTION_AWARD',
      'DBT_PFMS_DISBURSEMENT',
      'COMPLETED'
    ],
    selectionMode: 'DETERMINISTIC_MERIT',
    totalSlotsAnnual: 350000,
    applicationDeadline: '2026-11-30',
    activeAcademicYear: '2025-26',
    renewalPolicy: {
      allowAutoRenewal: true,
      minAttendancePercent: 75,
      minGpaPercent: 45,
      requireProgressReport: false
    }
  },
  {
    id: 'scheme_nfst_2026',
    code: 'NFST',
    name: 'National Fellowship for Higher Education of ST Students',
    version: 'v3.8 (MoTA Fellowship Cell)',
    category: 'HIGHER_EDUCATION_FELLOWSHIP',
    fundingType: 'CENTRAL_SECTOR',
    centralSharePercent: 100,
    stateSharePercent: 0,
    description: '100% Central Sector Fellowship Scheme providing financial assistance to meritorious ST candidates to pursue regular and full-time M.Phil and Ph.D degrees in Sciences, Humanities, and Engineering.',
    objective: 'To encourage and support ST scholars in higher research and achieve doctorates from premier universities.',
    targetBeneficiaries: 'ST students registered for full-time M.Phil / Ph.D in UGC/CSIR/ICAR recognized universities.',
    financialBenefits: {
      stipendMonthly: 37000, // JRF rate; SRF: 42000
      contingencyAnnual: 25000,
      maintenanceAllowanceMonthly: 0,
      tuitionFeeCapAnnual: 50000
    },
    eligibilityRules: [
      {
        id: 'rule_nfst_cat',
        field: 'category',
        label: 'Social Category is Scheduled Tribe (ST)',
        operator: 'EQUALS',
        targetValue: 'ST',
        explanation: 'Candidate must belong to a Scheduled Tribe.',
        mandatory: true
      },
      {
        id: 'rule_nfst_pg_score',
        field: 'previousYearScorePercentage',
        label: 'Post-Graduate Score >= 55%',
        operator: 'GREATER_THAN_OR_EQUAL',
        targetValue: 55,
        explanation: 'Must have secured at least 55% marks in Post-Graduation examination.',
        mandatory: true
      },
      {
        id: 'rule_nfst_degree',
        field: 'degreeLevel',
        label: 'Enrolled in Full-Time M.Phil or Ph.D',
        operator: 'IN',
        targetValue: ['MPHIL', 'PHD'],
        explanation: 'Applicant must have secured confirmed admission for full-time research.',
        mandatory: true
      },
      {
        id: 'rule_nfst_inc',
        field: 'familyIncomeAnnual',
        label: 'Annual Family Income <= ₹6,00,000',
        operator: 'LESS_THAN_OR_EQUAL',
        targetValue: 600000,
        explanation: 'Annual family income ceiling for NFST is ₹6.00 Lakh.',
        mandatory: true
      }
    ],
    requiredDocuments: [
      {
        docType: 'CASTE_CERTIFICATE',
        label: 'ST Community Certificate',
        description: 'Valid ST Certificate from competent revenue authority.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'applicantName', 'tribeName']
      },
      {
        docType: 'INCOME_CERTIFICATE',
        label: 'Income Certificate (<= 6.0L)',
        description: 'Revenue authority income certificate or ITR copy of parents.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'annualIncomeAmount', 'issueDate']
      },
      {
        docType: 'ADMISSION_PROOF',
        label: 'Ph.D / M.Phil Admission & Registration Letter',
        description: 'Official letter from University Registrar confirming full-time registration with Research Guide details.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 10,
        extractionFields: ['registrationNumber', 'courseName', 'department', 'guideName', 'admissionDate']
      },
      {
        docType: 'RESEARCH_SYNOPSIS',
        label: 'Research Proposal & Synopsis (3-5 pages)',
        description: 'Detailed research abstract with objectives, methodology, tribal relevance, and timeline.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 15,
        extractionFields: ['title', 'keywords', 'objectiveSummary']
      },
      {
        docType: 'MARKSHEET',
        label: 'Post-Graduation Degree & Consolidated Marksheet',
        description: 'PG transcript showing overall percentage/CGPA.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['examName', 'percentage', 'universityName']
      }
    ],
    workflowStages: [
      'REGISTRATION',
      'APPLICATION',
      'DOCUMENT_SUBMISSION',
      'AI_PRECHECK',
      'ELIGIBILITY_CHECK',
      'INSTITUTION_VERIFICATION',
      'MINISTRY_SCRUTINY',
      'SCREENING',
      'SELECTION',
      'SANCTION_AWARD',
      'DBT_PFMS_DISBURSEMENT',
      'POST_SELECTION',
      'COMPLETED'
    ],
    selectionMode: 'EXPERT_COMMITTEE_REVIEW',
    totalSlotsAnnual: 750,
    applicationDeadline: '2026-10-31',
    activeAcademicYear: '2025-26',
    renewalPolicy: {
      allowAutoRenewal: false,
      minAttendancePercent: 80,
      requireProgressReport: true
    }
  },
  {
    id: 'scheme_nos_2026',
    code: 'NOS-ST',
    name: 'National Overseas Scholarship for ST Candidates',
    version: 'v2.9 (MoTA Global Cell)',
    category: 'OVERSEAS_STUDIES',
    fundingType: 'CENTRAL_SECTOR',
    centralSharePercent: 100,
    stateSharePercent: 0,
    description: 'Prestigious full-ride scholarship for meritorious Scheduled Tribe candidates to pursue Master’s and Ph.D level courses abroad in top 500 QS World Ranked universities.',
    objective: 'To provide international exposure and advanced higher education in engineering, medicine, science, and social sciences abroad.',
    targetBeneficiaries: 'ST students with unconditional offer letters from top 500 QS ranked foreign universities.',
    financialBenefits: {
      tuitionFeeCapAnnual: 4500000, // Actual Tuition covered
      stipendMonthly: 125000, // Living allowance ~$1,500/month
      travelGrantOneTime: 150000,
      booksStationeryAnnual: 100000,
      contingencyAnnual: 120000
    },
    eligibilityRules: [
      {
        id: 'rule_nos_cat',
        field: 'category',
        label: 'Category is Scheduled Tribe (ST)',
        operator: 'EQUALS',
        targetValue: 'ST',
        explanation: 'Must belong to Scheduled Tribe.',
        mandatory: true
      },
      {
        id: 'rule_nos_inc',
        field: 'familyIncomeAnnual',
        label: 'Family Income <= ₹8,00,000',
        operator: 'LESS_THAN_OR_EQUAL',
        targetValue: 800000,
        explanation: 'Total family income ceiling is ₹8.00 Lakh per annum.',
        mandatory: true
      },
      {
        id: 'rule_nos_marks',
        field: 'previousYearScorePercentage',
        label: 'Undergraduate/PG Score >= 60%',
        operator: 'GREATER_THAN_OR_EQUAL',
        targetValue: 60,
        explanation: 'Minimum 60% marks or equivalent grade in qualifying degree.',
        mandatory: true
      },
      {
        id: 'rule_nos_qs',
        field: 'overseasQsRanking',
        label: 'Foreign University QS Rank <= 500',
        operator: 'LESS_THAN_OR_EQUAL',
        targetValue: 500,
        explanation: 'University must be ranked within top 500 in current QS World University Rankings.',
        mandatory: true
      }
    ],
    requiredDocuments: [
      {
        docType: 'CASTE_CERTIFICATE',
        label: 'ST Community Certificate',
        description: 'Certified ST document.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'applicantName']
      },
      {
        docType: 'INCOME_CERTIFICATE',
        label: 'ITR / Income Certificate (FY 2025-26)',
        description: 'Parental Income Tax Return verification.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['annualIncomeAmount', 'panNumber']
      },
      {
        docType: 'ADMISSION_PROOF',
        label: 'Unconditional Foreign University Offer Letter',
        description: 'Official admission letter from foreign institution stating course duration, start date, and tuition fee.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 10,
        extractionFields: ['universityName', 'courseName', 'durationYears', 'tuitionFeeForeignCurrency']
      },
      {
        docType: 'PASSPORT',
        label: 'Valid Indian Passport',
        description: 'Front and back page of Indian passport with minimum 2-year validity.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['passportNumber', 'holderName', 'expiryDate']
      },
      {
        docType: 'MARKSHEET',
        label: 'Qualifying Degree Transcripts (UG / PG)',
        description: 'Complete university transcripts with grading scale conversion.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 10,
        extractionFields: ['percentage', 'cgpa', 'degreeName']
      }
    ],
    workflowStages: [
      'REGISTRATION',
      'APPLICATION',
      'DOCUMENT_SUBMISSION',
      'AI_PRECHECK',
      'ELIGIBILITY_CHECK',
      'MINISTRY_SCRUTINY',
      'SCREENING',
      'SELECTION',
      'SANCTION_AWARD',
      'DBT_PFMS_DISBURSEMENT',
      'POST_SELECTION',
      'COMPLETED'
    ],
    selectionMode: 'EXPERT_COMMITTEE_REVIEW',
    totalSlotsAnnual: 20,
    applicationDeadline: '2026-12-15',
    activeAcademicYear: '2025-26',
    renewalPolicy: {
      allowAutoRenewal: false,
      requireProgressReport: true
    }
  },
  {
    id: 'scheme_topclass_2026',
    code: 'TOPCLASS-ST',
    name: 'National Scholarship for Higher Education in Premier Institutes (Top Class ST)',
    version: 'v3.1 (MoTA Institutions Cell)',
    category: 'TOP_CLASS',
    fundingType: 'CENTRAL_SECTOR',
    centralSharePercent: 100,
    stateSharePercent: 0,
    description: '100% Central funding for ST students admitted to notified premier institutes of national importance like IITs, IIMs, NITs, AIIMS, NLUs, and IIITs covering full tuition fee, living expenses, and computer grant.',
    objective: 'To empower ST students through quality education in world-class Indian institutions.',
    targetBeneficiaries: 'ST students enrolled in 250+ notified premier institutions across India.',
    financialBenefits: {
      tuitionFeeCapAnnual: 350000,
      maintenanceAllowanceMonthly: 3000,
      booksStationeryAnnual: 5000,
      contingencyAnnual: 45000 // One-time computer grant
    },
    eligibilityRules: [
      {
        id: 'rule_tc_cat',
        field: 'category',
        label: 'Social Category is Scheduled Tribe (ST)',
        operator: 'EQUALS',
        targetValue: 'ST',
        explanation: 'Must belong to ST category.',
        mandatory: true
      },
      {
        id: 'rule_tc_inc',
        field: 'familyIncomeAnnual',
        label: 'Family Income <= ₹6,00,000',
        operator: 'LESS_THAN_OR_EQUAL',
        targetValue: 600000,
        explanation: 'Total annual family income must be under ₹6.00 Lakh.',
        mandatory: true
      },
      {
        id: 'rule_tc_inst',
        field: 'institutionAisheCode',
        label: 'Admitted in Notified Premier Institution',
        operator: 'IN',
        targetValue: ['AISHE-U-0105', 'AISHE-U-0205', 'AISHE-U-0312', 'AISHE-U-0498', 'AISHE-U-0550'],
        explanation: 'Institution must be on the MoTA notified Top Class institute list (IITs, IIMs, NITs, AIIMS, etc.).',
        mandatory: true
      }
    ],
    requiredDocuments: [
      {
        docType: 'CASTE_CERTIFICATE',
        label: 'ST Certificate',
        description: 'Digitally verified ST Certificate.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMB: 5,
        extractionFields: ['certificateNumber', 'applicantName']
      },
      {
        docType: 'INCOME_CERTIFICATE',
        label: 'Income Certificate (FY 2025-26)',
        description: 'Current income certificate.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['annualIncomeAmount', 'issueDate']
      },
      {
        docType: 'ADMISSION_PROOF',
        label: 'Institute Allotment & Admission Letter',
        description: 'JoSAA / CSAB / CAT allotment letter and college fee invoice.',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 5,
        extractionFields: ['allotmentRank', 'courseName', 'tuitionFee']
      },
      {
        docType: 'BANK_PASSBOOK',
        label: 'Aadhaar-Linked Bank Details',
        description: 'Bank passbook copy with active NPCI mapping.',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMB: 5,
        extractionFields: ['accountNumber', 'ifscCode']
      }
    ],
    workflowStages: [
      'REGISTRATION',
      'APPLICATION',
      'DOCUMENT_SUBMISSION',
      'AI_PRECHECK',
      'ELIGIBILITY_CHECK',
      'INSTITUTION_VERIFICATION',
      'MINISTRY_SCRUTINY',
      'SANCTION_AWARD',
      'DBT_PFMS_DISBURSEMENT',
      'COMPLETED'
    ],
    selectionMode: 'SLOT_BASED_QUOTA',
    totalSlotsAnnual: 1000,
    applicationDeadline: '2026-11-15',
    activeAcademicYear: '2025-26',
    renewalPolicy: {
      allowAutoRenewal: true,
      minAttendancePercent: 75,
      minGpaPercent: 50,
      requireProgressReport: false
    }
  }
];
