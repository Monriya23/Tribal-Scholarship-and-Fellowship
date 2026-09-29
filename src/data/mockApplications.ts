import { ApplicationRecord } from '../types';

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'ST-2026-001245',
    applicantMotaId: 'ST-CASE-2026-CG-41902',
    applicantName: 'Rahul Kumar Gond',
    applicantTribe: 'Gond',
    applicantEmail: 'rahul.gond.btech@nitrr.ac.in',
    applicantMobile: '+91 94061 98234',
    schemeId: 'scheme_pms_st_2026',
    schemeCode: 'PMS-ST',
    schemeName: 'Post-Matric Scholarship for Scheduled Tribe Students',
    academicYear: '2025-26',
    currentStage: 'INSTITUTION_VERIFICATION',
    isRenewal: true,
    linkedPreviousAwardId: 'AWD-PMS-2024-9102',
    submissionDate: '2026-09-22T10:15:00Z',
    lastUpdatedDate: '2026-09-28T09:30:00Z',
    institutionAisheCode: 'AISHE-U-0205',
    institutionName: 'National Institute of Technology Raipur',
    state: 'Chhattisgarh',
    district: 'Bastar',
    courseName: 'B.Tech Computer Science & Engineering (2nd Year)',
    declaredIncome: 220000,
    declaredPercentage: 74.2,
    aiPrecheckCompleted: true,
    aiOverallConfidence: 89,
    aiSummaryNotes: 'ST Certificate verified via DigiLocker. Alert: Income mismatch detected between application declaration (₹2,20,000) and extracted document figure (₹3,20,000). Marksheet score verified (74.2%). Human review required.',
    documentDiagnostics: [
      {
        documentId: 'doc_cg_caste_1245',
        documentType: 'CASTE_CERTIFICATE',
        fileName: 'ST_Certificate_RahulGond.pdf',
        fileSize: '1.4 MB',
        ocrReadabilityScore: 98,
        classificationScore: 99,
        classifiedAs: 'Scheduled Tribe Caste Certificate (State of Chhattisgarh)',
        isCorrectType: true,
        overallConfidence: 97,
        extractedFields: [
          {
            fieldName: 'certificateNumber',
            fieldLabel: 'Caste Certificate No.',
            extractedValue: 'CG/ST/2022/77102',
            declaredValue: 'CG/ST/2022/77102',
            isMatch: true,
            confidence: 99
          },
          {
            fieldName: 'applicantName',
            fieldLabel: 'Candidate Full Name',
            extractedValue: 'Rahul Kumar Gond',
            declaredValue: 'Rahul Kumar Gond',
            isMatch: true,
            confidence: 98
          },
          {
            fieldName: 'tribeName',
            fieldLabel: 'Tribe / Sub-Caste',
            extractedValue: 'Gond',
            declaredValue: 'Gond',
            isMatch: true,
            confidence: 98
          },
          {
            fieldName: 'issuingAuthority',
            fieldLabel: 'Issuing Authority',
            extractedValue: 'Tahsildar, Bastar District',
            declaredValue: 'Tahsildar, Bastar District',
            isMatch: true,
            confidence: 96
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 100,
          dobMatchScore: 100,
          casteMatchScore: 100,
          incomeMatchScore: 100,
          overallConsistency: 'CONSISTENT',
          notes: ['Exact string match on applicant name, father name, and tribe community.']
        },
        anomaliesDetected: [],
        evaluationStatus: 'PASSED'
      },
      {
        documentId: 'doc_cg_income_1245',
        documentType: 'INCOME_CERTIFICATE',
        fileName: 'Income_Certificate_2025_26.pdf',
        fileSize: '890 KB',
        ocrReadabilityScore: 95,
        classificationScore: 96,
        classifiedAs: 'Revenue Department Annual Income Certificate',
        isCorrectType: true,
        overallConfidence: 84,
        extractedFields: [
          {
            fieldName: 'annualIncomeAmount',
            fieldLabel: 'Annual Family Income',
            extractedValue: 320000,
            declaredValue: 220000,
            isMatch: false,
            confidence: 94,
            note: 'Discrepancy: Extracted figure is ₹3,20,000 while application declared ₹2,20,000.'
          },
          {
            fieldName: 'headOfFamily',
            fieldLabel: 'Father / Guardian Name',
            extractedValue: 'Sukhdev Gond',
            declaredValue: 'Sukhdev Gond',
            isMatch: true,
            confidence: 97
          },
          {
            fieldName: 'financialYear',
            fieldLabel: 'Financial Year',
            extractedValue: '2025-26',
            declaredValue: '2025-26',
            isMatch: true,
            confidence: 98
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 98,
          dobMatchScore: 95,
          casteMatchScore: 100,
          incomeMatchScore: 45,
          overallConsistency: 'MAJOR_MISMATCH',
          notes: ['Income mismatch: Extracted income ₹3,20,000 exceeds declared ₹2,20,000 and the scheme ceiling of ₹2,50,000.']
        },
        anomaliesDetected: [
          {
            type: 'MISMATCH',
            severity: 'CRITICAL',
            message: 'MISMATCH DETECTED: Declared income ₹2,20,000 vs Extracted document income ₹3,20,000.',
            recommendedAction: 'Institution Nodal Officer to inspect certificate or request clarification/revised income proof from applicant.'
          }
        ],
        evaluationStatus: 'REVIEW_REQUIRED'
      },
      {
        documentId: 'doc_cg_marks_1245',
        documentType: 'MARKSHEET',
        fileName: 'BTech_1st_Year_Marksheet.pdf',
        fileSize: '1.8 MB',
        ocrReadabilityScore: 97,
        classificationScore: 98,
        classifiedAs: 'NIT Raipur Semester Grade Card / Transcript',
        isCorrectType: true,
        overallConfidence: 96,
        extractedFields: [
          {
            fieldName: 'percentage',
            fieldLabel: 'Aggregate Percentage / CGPA',
            extractedValue: 74.2,
            declaredValue: 74.2,
            isMatch: true,
            confidence: 98
          },
          {
            fieldName: 'rollNumber',
            fieldLabel: 'Enrolment / Roll No.',
            extractedValue: '24115089',
            declaredValue: '24115089',
            isMatch: true,
            confidence: 99
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 100,
          dobMatchScore: 100,
          casteMatchScore: 100,
          incomeMatchScore: 100,
          overallConsistency: 'CONSISTENT',
          notes: ['Roll number and student identity verified with NIT Raipur student database.']
        },
        anomaliesDetected: [],
        evaluationStatus: 'PASSED'
      }
    ],
    ruleEvaluationResults: [
      {
        ruleId: 'rule_pms_cat',
        ruleLabel: 'Social Category is Scheduled Tribe (ST)',
        requiredCriteria: 'Category == ST',
        extractedValue: 'ST (Gond)',
        status: 'PASS',
        ruleExplanation: 'Verified from digitally signed ST Caste Certificate #CG/ST/2022/77102.'
      },
      {
        ruleId: 'rule_pms_inc',
        ruleLabel: 'Annual Family Income <= ₹2,50,000',
        requiredCriteria: '<= ₹2,50,000',
        extractedValue: '₹3,20,000 (Extracted) vs ₹2,20,000 (Declared)',
        status: 'REVIEW',
        ruleExplanation: 'Extracted income (₹3,20,000) exceeds the statutory ceiling (₹2,50,000) and mismatches declared amount.'
      },
      {
        ruleId: 'rule_pms_deg',
        ruleLabel: 'Post-Matric Recognized Course',
        requiredCriteria: 'Recognized Course',
        extractedValue: 'B.Tech CSE (NIT Raipur)',
        status: 'PASS',
        ruleExplanation: 'Institute is an Institute of National Importance (AISHE: AISHE-U-0205).'
      },
      {
        ruleId: 'rule_pms_score',
        ruleLabel: 'Passed Qualifying Examination (>= 45%)',
        requiredCriteria: '>= 45%',
        extractedValue: '74.2%',
        status: 'PASS',
        ruleExplanation: 'Academic score 74.2% satisfies the minimum 45% requirement.'
      }
    ],
    isEligibilitySatisfied: false,
    deficiencies: [],
    timeline: [
      {
        stage: 'REGISTRATION',
        label: 'Digital Case File Registered',
        actor: 'Rahul Kumar Gond (Student)',
        timestamp: '2026-09-22T10:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'APPLICATION',
        label: 'Application Submitted Online',
        actor: 'Rahul Kumar Gond (Student)',
        timestamp: '2026-09-22T10:15:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'AI_PRECHECK',
        label: 'AI Document Intelligence & OCR Extraction Completed',
        actor: 'MoTA AI Engine',
        timestamp: '2026-09-22T10:17:30Z',
        status: 'COMPLETED',
        comments: 'Extracted 3 documents. 1 Mismatch Flagged: Income Certificate.'
      },
      {
        stage: 'ELIGIBILITY_CHECK',
        label: 'Deterministic Eligibility Rules Evaluated',
        actor: 'Policy Rule Engine',
        timestamp: '2026-09-22T10:18:00Z',
        status: 'COMPLETED',
        comments: '3 of 4 rules passed. 1 rule marked for Human Review.'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'Institution Nodal Officer Scrutiny',
        actor: 'Dr. B. K. Soren (NIT Raipur Nodal Desk)',
        timestamp: '2026-09-23T09:00:00Z',
        status: 'IN_PROGRESS',
        durationDays: 5,
        comments: 'Pending officer review of flagged income document.'
      },
      {
        stage: 'STATE_VERIFICATION',
        label: 'State Tribal Welfare Department Verification',
        actor: 'State Nodal Cell, Chhattisgarh',
        timestamp: '',
        status: 'PENDING'
      },
      {
        stage: 'MINISTRY_SCRUTINY',
        label: 'MoTA Central Sanction & Scrutiny',
        actor: 'Ministry of Tribal Affairs',
        timestamp: '',
        status: 'PENDING'
      },
      {
        stage: 'DBT_PFMS_DISBURSEMENT',
        label: 'Direct Benefit Transfer / PFMS',
        actor: 'PFMS Central Treasury',
        timestamp: '',
        status: 'PENDING'
      }
    ]
  },

  {
    id: 'ST-2026-002189',
    applicantMotaId: 'ST-CASE-2026-JH-88341',
    applicantName: 'Pooja Munda',
    applicantTribe: 'Munda',
    applicantEmail: 'pooja.munda@research.iitd.ac.in',
    applicantMobile: '+91 98351 24789',
    schemeId: 'scheme_nfst_2026',
    schemeCode: 'NFST',
    schemeName: 'National Fellowship for Higher Education of ST Students',
    academicYear: '2025-26',
    currentStage: 'MINISTRY_SCRUTINY',
    isRenewal: true,
    linkedPreviousAwardId: 'AWD-NFST-2023-0881',
    submissionDate: '2026-09-10T14:20:00Z',
    lastUpdatedDate: '2026-09-27T16:00:00Z',
    institutionAisheCode: 'AISHE-U-0105',
    institutionName: 'Indian Institute of Technology Delhi (IIT Delhi)',
    state: 'Jharkhand',
    district: 'Ranchi',
    courseName: 'Ph.D in Environmental Science & Tribal Agro-Forestry',
    declaredIncome: 220000,
    declaredPercentage: 78.4,
    researchTopic: 'Ethno-botanical documentation and sustainable agro-forestry value chain development among Chota Nagpur tribal communities.',
    aiPrecheckCompleted: true,
    aiOverallConfidence: 98,
    aiSummaryNotes: 'All credentials match existing Digital Case File. Previous M.Phil fellowship record #MOTA-NFST-2023-JH-0881 verified. IIT Delhi admission confirmed. Income within ₹6.0L limit. 100% clean verification pass.',
    documentDiagnostics: [
      {
        documentId: 'doc_pm_caste',
        documentType: 'CASTE_CERTIFICATE',
        fileName: 'ST_Certificate_DigiLocker.pdf',
        fileSize: '1.1 MB',
        ocrReadabilityScore: 99,
        classificationScore: 100,
        classifiedAs: 'Scheduled Tribe Certificate (Jharkhand State)',
        isCorrectType: true,
        overallConfidence: 99,
        extractedFields: [
          {
            fieldName: 'certificateNumber',
            fieldLabel: 'Caste Certificate No.',
            extractedValue: 'JH/ST/2021/9812',
            declaredValue: 'JH/ST/2021/9812',
            isMatch: true,
            confidence: 99
          },
          {
            fieldName: 'applicantName',
            fieldLabel: 'Applicant Name',
            extractedValue: 'Pooja Munda',
            declaredValue: 'Pooja Munda',
            isMatch: true,
            confidence: 99
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 100,
          dobMatchScore: 100,
          casteMatchScore: 100,
          incomeMatchScore: 100,
          overallConsistency: 'CONSISTENT',
          notes: ['Verified against DigiLocker national credential repository.']
        },
        anomaliesDetected: [],
        evaluationStatus: 'PASSED'
      },
      {
        documentId: 'doc_pm_phd_adm',
        documentType: 'ADMISSION_PROOF',
        fileName: 'IIT_Delhi_PhD_Admission_Letter.pdf',
        fileSize: '2.4 MB',
        ocrReadabilityScore: 98,
        classificationScore: 99,
        classifiedAs: 'IIT Delhi Registrar Research Admission Memo',
        isCorrectType: true,
        overallConfidence: 98,
        extractedFields: [
          {
            fieldName: 'registrationNumber',
            fieldLabel: 'Registration Number',
            extractedValue: '2025ESZ8412',
            declaredValue: '2025ESZ8412',
            isMatch: true,
            confidence: 99
          },
          {
            fieldName: 'department',
            fieldLabel: 'Department / School',
            extractedValue: 'Centre for Rural Development & Technology',
            declaredValue: 'Centre for Rural Development & Technology',
            isMatch: true,
            confidence: 98
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 100,
          dobMatchScore: 100,
          casteMatchScore: 100,
          incomeMatchScore: 100,
          overallConsistency: 'CONSISTENT',
          notes: ['Full-time status verified with IIT Delhi Dean of Academics.']
        },
        anomaliesDetected: [],
        evaluationStatus: 'PASSED'
      }
    ],
    ruleEvaluationResults: [
      {
        ruleId: 'rule_nfst_cat',
        ruleLabel: 'Social Category is Scheduled Tribe (ST)',
        requiredCriteria: 'Category == ST',
        extractedValue: 'ST (Munda)',
        status: 'PASS',
        ruleExplanation: 'Verified from DigiLocker ST Certificate.'
      },
      {
        ruleId: 'rule_nfst_pg_score',
        ruleLabel: 'Post-Graduate Score >= 55%',
        requiredCriteria: '>= 55%',
        extractedValue: '78.4%',
        status: 'PASS',
        ruleExplanation: 'Passed M.Phil / PG degree with Distinction (78.4%).'
      },
      {
        ruleId: 'rule_nfst_degree',
        ruleLabel: 'Enrolled in Full-Time M.Phil or Ph.D',
        requiredCriteria: 'Full-Time Research',
        extractedValue: 'Ph.D at IIT Delhi (Full-Time Regular)',
        status: 'PASS',
        ruleExplanation: 'Admission order verified from IIT Delhi Registrar.'
      },
      {
        ruleId: 'rule_nfst_inc',
        ruleLabel: 'Annual Family Income <= ₹6,00,000',
        requiredCriteria: '<= ₹6,00,000',
        extractedValue: '₹2,20,000',
        status: 'PASS',
        ruleExplanation: 'Income is well within the ceiling of ₹6.00 Lakh.'
      }
    ],
    isEligibilitySatisfied: true,
    institutionReview: {
      reviewedBy: 'Prof. S. R. Sharma (Dean Academics, IIT Delhi)',
      reviewedAt: '2026-09-15T11:30:00Z',
      decision: 'APPROVED',
      remarks: 'Candidate is enrolled as regular full-time Ph.D research scholar. Highly recommended for NFST Award.',
      daysTaken: 3
    },
    expertReview: {
      reviewerName: 'Prof. A. K. Nayak (Chairman, MoTA Expert Research Committee)',
      proposalScore: 94,
      academicMeritScore: 92,
      recommendation: 'STRONGLY_RECOMMENDED',
      feedback: 'Outstanding research proposal with high field relevance to indigenous tribal communities of eastern India.'
    },
    deficiencies: [],
    timeline: [
      {
        stage: 'REGISTRATION',
        label: 'Digital Case File Retrieved (Renewal Auto-Link)',
        actor: 'System',
        timestamp: '2026-09-10T14:00:00Z',
        status: 'COMPLETED',
        comments: 'Found existing verified records from previous M.Phil Award #AWD-NFST-2023-0881.'
      },
      {
        stage: 'APPLICATION',
        label: 'Ph.D Upgradation Application Submitted',
        actor: 'Pooja Munda (Applicant)',
        timestamp: '2026-09-10T14:20:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'AI_PRECHECK',
        label: 'AI Pre-Check & Consistency Analysis Completed',
        actor: 'MoTA AI Engine',
        timestamp: '2026-09-10T14:22:00Z',
        status: 'COMPLETED',
        comments: 'All 5 documents classified and validated. Confidence: 98%.'
      },
      {
        stage: 'ELIGIBILITY_CHECK',
        label: 'Eligibility Rules Verified',
        actor: 'Rule Engine',
        timestamp: '2026-09-10T14:23:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'Institution Verified & Forwarded to Ministry',
        actor: 'Prof. S. R. Sharma (IIT Delhi)',
        timestamp: '2026-09-15T11:30:00Z',
        status: 'COMPLETED',
        durationDays: 3
      },
      {
        stage: 'SCREENING',
        label: 'Expert Committee Review Completed (Score: 94/100)',
        actor: 'Prof. A. K. Nayak (Expert Reviewer)',
        timestamp: '2026-09-22T17:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'MINISTRY_SCRUTINY',
        label: 'MoTA Fellowship Cell Final Sanction Desk',
        actor: 'Joint Secretary (MoTA, New Delhi)',
        timestamp: '2026-09-23T10:00:00Z',
        status: 'IN_PROGRESS',
        durationDays: 5,
        comments: 'Final Sanction Order generation and PFMS budget allocation in progress.'
      },
      {
        stage: 'SANCTION_AWARD',
        label: 'Sanction Order Generation',
        actor: 'MoTA Fellowship Cell',
        timestamp: '',
        status: 'PENDING'
      },
      {
        stage: 'DBT_PFMS_DISBURSEMENT',
        label: 'Monthly JRF Stipend Disbursement (₹37,000/mo)',
        actor: 'PFMS MoTA Cell',
        timestamp: '',
        status: 'PENDING'
      }
    ]
  },

  {
    id: 'ST-2026-003450',
    applicantMotaId: 'ST-CASE-2026-OD-55018',
    applicantName: 'Ananya Soren',
    applicantTribe: 'Santhal',
    applicantEmail: 'ananya.soren@ed.ac.uk',
    applicantMobile: '+91 97782 10492',
    schemeId: 'scheme_nos_2026',
    schemeCode: 'NOS-ST',
    schemeName: 'National Overseas Scholarship for ST Candidates',
    academicYear: '2025-26',
    currentStage: 'SCREENING',
    isRenewal: false,
    submissionDate: '2026-09-01T09:00:00Z',
    lastUpdatedDate: '2026-09-25T11:00:00Z',
    institutionAisheCode: 'FOREIGN-UK-0012',
    institutionName: 'University of Edinburgh (United Kingdom)',
    state: 'Odisha',
    district: 'Mayurbhanj',
    courseName: 'M.Sc Data Science & Public Policy',
    declaredIncome: 480000,
    declaredPercentage: 81.6,
    overseasUniversityName: 'University of Edinburgh',
    overseasQsRanking: 27,
    aiPrecheckCompleted: true,
    aiOverallConfidence: 96,
    aiSummaryNotes: 'Unconditional admission offer from University of Edinburgh (QS Rank #27, within top 500 limit). Passport verified with 4-year validity. Undergrad percentage 81.6% (meets >=60% requirement). Ready for Expert Committee ranking.',
    documentDiagnostics: [
      {
        documentId: 'doc_as_offer',
        documentType: 'ADMISSION_PROOF',
        fileName: 'Edinburgh_Unconditional_Offer_Letter.pdf',
        fileSize: '3.1 MB',
        ocrReadabilityScore: 99,
        classificationScore: 99,
        classifiedAs: 'Unconditional Foreign University Admission Letter',
        isCorrectType: true,
        overallConfidence: 98,
        extractedFields: [
          {
            fieldName: 'universityName',
            fieldLabel: 'University Name',
            extractedValue: 'University of Edinburgh',
            declaredValue: 'University of Edinburgh',
            isMatch: true,
            confidence: 99
          },
          {
            fieldName: 'qsRanking',
            fieldLabel: 'QS World Ranking',
            extractedValue: 27,
            declaredValue: 27,
            isMatch: true,
            confidence: 99
          }
        ],
        crossDocumentConsistency: {
          nameMatchScore: 100,
          dobMatchScore: 100,
          casteMatchScore: 100,
          incomeMatchScore: 100,
          overallConsistency: 'CONSISTENT',
          notes: ['Offer letter contains verified digital signature of University Admissions Officer.']
        },
        anomaliesDetected: [],
        evaluationStatus: 'PASSED'
      }
    ],
    ruleEvaluationResults: [
      {
        ruleId: 'rule_nos_cat',
        ruleLabel: 'Category is Scheduled Tribe (ST)',
        requiredCriteria: 'Category == ST',
        extractedValue: 'ST (Santhal)',
        status: 'PASS',
        ruleExplanation: 'Verified from DigiLocker ST Certificate #OD/ST/2020/38194.'
      },
      {
        ruleId: 'rule_nos_inc',
        ruleLabel: 'Family Income <= ₹8,00,000',
        requiredCriteria: '<= ₹8,00,000',
        extractedValue: '₹4,80,000',
        status: 'PASS',
        ruleExplanation: 'Income is under the ₹8.00 Lakh ceiling.'
      },
      {
        ruleId: 'rule_nos_marks',
        ruleLabel: 'Undergraduate/PG Score >= 60%',
        requiredCriteria: '>= 60%',
        extractedValue: '81.6%',
        status: 'PASS',
        ruleExplanation: 'Secured 81.6% in B.Tech, exceeding the 60% requirement.'
      },
      {
        ruleId: 'rule_nos_qs',
        ruleLabel: 'Foreign University QS Rank <= 500',
        requiredCriteria: '<= 500',
        extractedValue: 'QS Rank #27',
        status: 'PASS',
        ruleExplanation: 'University of Edinburgh is ranked #27 globally in QS 2026.'
      }
    ],
    isEligibilitySatisfied: true,
    deficiencies: [],
    timeline: [
      {
        stage: 'APPLICATION',
        label: 'NOS Application Submitted',
        actor: 'Ananya Soren',
        timestamp: '2026-09-01T09:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'AI_PRECHECK',
        label: 'AI Verification & QS Rank Match Completed',
        actor: 'MoTA AI Engine',
        timestamp: '2026-09-01T09:05:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'MINISTRY_SCRUTINY',
        label: 'Ministry Scrutiny Cell Verification',
        actor: 'MoTA Overseas Cell Desk',
        timestamp: '2026-09-12T15:00:00Z',
        status: 'COMPLETED',
        durationDays: 11
      },
      {
        stage: 'SCREENING',
        label: 'Expert Committee Comparative Ranking',
        actor: 'National Selection Committee (NOS-ST)',
        timestamp: '2026-09-18T10:00:00Z',
        status: 'IN_PROGRESS',
        durationDays: 10,
        comments: 'Under evaluation for 1 of 20 coveted overseas scholarship slots.'
      },
      {
        stage: 'SELECTION',
        label: 'National Selection Merit List',
        actor: 'Ministry of Tribal Affairs',
        timestamp: '',
        status: 'PENDING'
      }
    ]
  },

  {
    id: 'ST-2026-004112',
    applicantMotaId: 'ST-CASE-2026-MP-33109',
    applicantName: 'Rakesh Bhil',
    applicantTribe: 'Bhil',
    applicantEmail: 'rakesh.bhil@iitb.ac.in',
    applicantMobile: '+91 91118 44021',
    schemeId: 'scheme_topclass_2026',
    schemeCode: 'TOPCLASS-ST',
    schemeName: 'National Scholarship for Higher Education in Premier Institutes',
    academicYear: '2025-26',
    currentStage: 'DBT_PFMS_DISBURSEMENT',
    isRenewal: false,
    submissionDate: '2026-08-15T11:00:00Z',
    lastUpdatedDate: '2026-09-28T08:00:00Z',
    institutionAisheCode: 'AISHE-U-0312',
    institutionName: 'Indian Institute of Technology Bombay (IIT Bombay)',
    state: 'Madhya Pradesh',
    district: 'Jhabua',
    courseName: 'B.Tech in Mechanical Engineering (3rd Year)',
    declaredIncome: 180000,
    declaredPercentage: 79.5,
    aiPrecheckCompleted: true,
    aiOverallConfidence: 99,
    aiSummaryNotes: 'Sanction approved. PFMS Bill #MOTA/TC/2026/04912 generated. NPCI bank account active and validated.',
    documentDiagnostics: [],
    ruleEvaluationResults: [],
    isEligibilitySatisfied: true,
    deficiencies: [],
    paymentInfo: {
      sanctionedAmount: 265000,
      monthlyDisbursementAmount: 3000,
      paymentStatus: 'DBT_PROCESSING',
      sanctionDate: '2026-09-18T10:30:00Z',
      pfmsBillNumber: 'PFMS/MOTA/2026/99412',
      pfmsBillDate: '2026-09-24T14:15:00Z',
      treasuryTokenNumber: 'TRZ-2026-904128',
      bankUtrNumber: 'Pending Bank Push',
      actionRequired: 'None. Funds are being pushed via RBI-NPCI DBT bridge directly to Aadhaar-seeded SBI account.'
    },
    timeline: [
      {
        stage: 'APPLICATION',
        label: 'Application Submitted',
        actor: 'Rakesh Bhil',
        timestamp: '2026-08-15T11:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'IIT Bombay Nodal Verification',
        actor: 'IIT Bombay Scholarship Cell',
        timestamp: '2026-08-28T16:00:00Z',
        status: 'COMPLETED',
        durationDays: 13
      },
      {
        stage: 'MINISTRY_SCRUTINY',
        label: 'MoTA Scrutiny Approved',
        actor: 'MoTA Premier Institutes Desk',
        timestamp: '2026-09-12T12:00:00Z',
        status: 'COMPLETED',
        durationDays: 15
      },
      {
        stage: 'SANCTION_AWARD',
        label: 'Sanction Order #MOTA/TC/2026/04912 Issued',
        actor: 'Finance Division, MoTA',
        timestamp: '2026-09-18T10:30:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'DBT_PFMS_DISBURSEMENT',
        label: 'DBT / PFMS Electronic Transfer Processing',
        actor: 'Public Financial Management System (PFMS)',
        timestamp: '2026-09-24T14:15:00Z',
        status: 'IN_PROGRESS',
        durationDays: 4,
        comments: 'PFMS Bill #PFMS/MOTA/2026/99412 submitted to Reserve Bank of India / NPCI Gateway.'
      }
    ]
  },

  {
    id: 'ST-2026-005923',
    applicantMotaId: 'ST-CASE-2026-JH-10492',
    applicantName: 'Manish Marandi',
    applicantTribe: 'Santhal',
    applicantEmail: 'manish.marandi@students.iitkgp.ac.in',
    applicantMobile: '+91 94311 88204',
    schemeId: 'scheme_pms_st_2026',
    schemeCode: 'PMS-ST',
    schemeName: 'Post-Matric Scholarship for Scheduled Tribe Students',
    academicYear: '2025-26',
    currentStage: 'DEFICIENT',
    isRenewal: false,
    submissionDate: '2026-09-12T16:30:00Z',
    lastUpdatedDate: '2026-09-26T14:00:00Z',
    institutionAisheCode: 'AISHE-U-0498',
    institutionName: 'IIT Kharagpur',
    state: 'Jharkhand',
    district: 'Dumka',
    courseName: 'Dual Degree (B.Tech + M.Tech) Mining Engineering',
    declaredIncome: 195000,
    declaredPercentage: 84.0,
    aiPrecheckCompleted: true,
    aiOverallConfidence: 81,
    aiSummaryNotes: 'Deficiency raised by State Nodal Desk: The uploaded Income Certificate was issued in financial year 2022-23 (validity expired). A renewed Income Certificate for FY 2025-26 is required.',
    documentDiagnostics: [],
    ruleEvaluationResults: [],
    isEligibilitySatisfied: false,
    deficiencies: [
      {
        id: 'DEF-2026-00812',
        applicationId: 'ST-2026-005923',
        documentType: 'INCOME_CERTIFICATE',
        stageCreated: 'STATE_VERIFICATION',
        raisedByOfficer: 'Shri S. R. Marandi (State Tribal Welfare Officer, Jharkhand)',
        raisedByRole: 'state_officer',
        createdAt: '2026-09-24T11:00:00Z',
        deadlineDate: '2026-10-10T23:59:59Z',
        issueDescription: 'Uploaded Income Certificate #JH/INC/2022/10923 was issued on 14/05/2022 and has expired. State rules mandate an income certificate issued within the current financial year (FY 2025-26).',
        requiredAction: 'Please obtain and upload a valid Income Certificate for FY 2025-26 issued by Circle Officer / SDO or pull directly via DigiLocker.',
        status: 'AWAITING_APPLICANT'
      }
    ],
    timeline: [
      {
        stage: 'APPLICATION',
        label: 'Application Submitted',
        actor: 'Manish Marandi',
        timestamp: '2026-09-12T16:30:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'Institution Verified',
        actor: 'IIT Kharagpur Desk',
        timestamp: '2026-09-19T10:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'STATE_VERIFICATION',
        label: 'Deficiency Raised: Expired Income Certificate',
        actor: 'State Tribal Welfare Officer, Jharkhand',
        timestamp: '2026-09-24T11:00:00Z',
        status: 'BLOCKED',
        comments: 'Action required from applicant by 10 Oct 2026.'
      }
    ]
  },

  {
    id: 'ST-2026-006780',
    applicantMotaId: 'ST-CASE-2026-JH-99214',
    applicantName: 'Vikram Birhor',
    applicantTribe: 'Birhor (Particularly Vulnerable Tribal Group - PVTG)',
    applicantEmail: 'vikram.birhor@research.bhu.ac.in',
    applicantMobile: '+91 99341 55091',
    schemeId: 'scheme_nfst_2026',
    schemeCode: 'NFST',
    schemeName: 'National Fellowship for Higher Education of ST Students',
    academicYear: '2025-26',
    currentStage: 'POST_SELECTION',
    isRenewal: false,
    submissionDate: '2025-07-10T09:00:00Z',
    lastUpdatedDate: '2026-09-27T10:00:00Z',
    institutionAisheCode: 'AISHE-U-0550',
    institutionName: 'Banaras Hindu University (BHU Varanasi)',
    state: 'Jharkhand',
    district: 'Hazaribagh',
    courseName: 'Ph.D in Linguistics (Preservation of Endangered PVTG Dialects)',
    declaredIncome: 140000,
    declaredPercentage: 76.5,
    researchTopic: 'Lexical documentation and acoustic phonetics of Birhor language in Jharkhand and Odisha.',
    aiPrecheckCompleted: true,
    aiOverallConfidence: 99,
    aiSummaryNotes: 'Fellowship Active. PVTG Priority Candidate. Quarterly Progress Reports up to Q3 verified. Total ₹4,81,000 disbursed so far.',
    documentDiagnostics: [],
    ruleEvaluationResults: [],
    isEligibilitySatisfied: true,
    deficiencies: [],
    fellowshipData: {
      fellowshipAwardId: 'MOTA-NFST-2025-PVTG-0044',
      tenureYears: 5,
      joiningDate: '2025-08-01T00:00:00Z',
      guideSupervisorName: 'Prof. R. P. Pathak (Dept of Linguistics, BHU)',
      currentQuarter: 4,
      reportsSubmitted: [
        {
          quarter: 1,
          submittedOn: '2025-11-05T10:00:00Z',
          verifiedByHod: true,
          approvedByMota: true,
          status: 'APPROVED'
        },
        {
          quarter: 2,
          submittedOn: '2026-02-10T11:00:00Z',
          verifiedByHod: true,
          approvedByMota: true,
          status: 'APPROVED'
        },
        {
          quarter: 3,
          submittedOn: '2026-05-15T09:30:00Z',
          verifiedByHod: true,
          approvedByMota: true,
          status: 'APPROVED'
        },
        {
          quarter: 4,
          submittedOn: '2026-08-20T14:00:00Z',
          verifiedByHod: true,
          approvedByMota: false,
          status: 'PENDING'
        }
      ],
      contingencyClaims: [
        {
          claimId: 'CONT-2025-01',
          amount: 15000,
          purpose: 'Field Audio Recording Equipment & Tribal Village Travel',
          date: '2025-12-10',
          status: 'PAID'
        },
        {
          claimId: 'CONT-2026-02',
          amount: 10000,
          purpose: 'International Phonetic Conference Registration & Papers',
          date: '2026-06-04',
          status: 'PAID'
        }
      ],
      isUpgradationEligible: true
    },
    paymentInfo: {
      sanctionedAmount: 469000,
      monthlyDisbursementAmount: 37000,
      paymentStatus: 'CREDITED',
      sanctionDate: '2025-07-25T11:00:00Z',
      pfmsBillNumber: 'PFMS/MOTA/2026/Q3-8812',
      bankUtrNumber: 'SBIN002938192301',
      disbursedDate: '2026-08-02T10:00:00Z'
    },
    timeline: [
      {
        stage: 'SANCTION_AWARD',
        label: 'Fellowship Award Sanction Issued (#MOTA-NFST-2025-PVTG-0044)',
        actor: 'Ministry of Tribal Affairs',
        timestamp: '2025-07-25T11:00:00Z',
        status: 'COMPLETED'
      },
      {
        stage: 'POST_SELECTION',
        label: 'Active Research Fellowship — Q4 Progress Report Under Scrutiny',
        actor: 'MoTA Research Division',
        timestamp: '2026-08-20T14:00:00Z',
        status: 'IN_PROGRESS'
      }
    ]
  }
];
