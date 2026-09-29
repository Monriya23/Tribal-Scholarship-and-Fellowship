import { GrievanceTicket, AuditLogEntry, BottleneckMetric } from '../types';

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'GRV-2026-9042',
    applicationId: 'ST-2026-001245',
    applicantMotaId: 'ST-CASE-2026-CG-41902',
    applicantName: 'Rahul Kumar Gond',
    category: 'DOCUMENT_VERIFICATION',
    subject: 'Income Certificate clarification regarding agricultural income inclusion',
    description: 'The revenue officer included gross agriculture turnover instead of net family income in the 2025 certificate. I have attached the revised rectification memo from the Tahsildar.',
    createdAt: '2026-09-24T14:30:00Z',
    slaDeadlineDays: 7,
    assignedAuthority: 'INSTITUTION_NODAL',
    status: 'UNDER_REVIEW',
    auditTrail: [
      {
        timestamp: '2026-09-24T14:30:00Z',
        actor: 'Rahul Kumar Gond',
        action: 'Grievance ticket created with supporting attachment.'
      },
      {
        timestamp: '2026-09-25T09:15:00Z',
        actor: 'System Router',
        action: 'Assigned to NIT Raipur Nodal Officer Desk (SLA: 7 days).'
      }
    ]
  },
  {
    id: 'GRV-2026-8819',
    applicationId: 'ST-2026-004112',
    applicantMotaId: 'ST-CASE-2026-MP-33109',
    applicantName: 'Rakesh Bhil',
    category: 'BANK_NPCI_ERROR',
    subject: 'Aadhaar seeding status inquiry with SBI Jhabua branch',
    description: 'Bank branch confirmed NPCI mapper status is updated to active on 20 Sept. Requesting PFMS payment re-trigger.',
    createdAt: '2026-09-21T10:00:00Z',
    slaDeadlineDays: 5,
    assignedAuthority: 'PFMS_HELPDESK',
    status: 'RESOLVED',
    resolutionNotes: 'NPCI Aadhaar mapper verified successfully on 23 Sept. PFMS electronic bill generated and queued for disbursement.',
    resolvedAt: '2026-09-23T16:45:00Z',
    auditTrail: [
      {
        timestamp: '2026-09-21T10:00:00Z',
        actor: 'Rakesh Bhil',
        action: 'Ticket submitted.'
      },
      {
        timestamp: '2026-09-23T16:45:00Z',
        actor: 'PFMS MoTA Integration Desk',
        action: 'NPCI status re-validated and ticket resolved.'
      }
    ]
  },
  {
    id: 'GRV-2026-7734',
    applicationId: 'ST-2026-005923',
    applicantMotaId: 'ST-CASE-2026-JH-10492',
    applicantName: 'Manish Marandi',
    category: 'DEFICIENCY_DISPUTE',
    subject: 'Request 7 days extension for uploading renewed FY 2025-26 Income Certificate',
    description: 'Circle office JharSewa portal was under server maintenance for 3 days. SDO counter receipt has been submitted. Request extension of deadline till 15 Oct.',
    createdAt: '2026-09-25T17:00:00Z',
    slaDeadlineDays: 3,
    assignedAuthority: 'STATE_TRIBAL_WELFARE',
    status: 'SUBMITTED',
    auditTrail: [
      {
        timestamp: '2026-09-25T17:00:00Z',
        actor: 'Manish Marandi',
        action: 'Grievance submitted.'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-0928-001',
    timestamp: '2026-09-28T09:30:14Z',
    actorRole: 'institution',
    actorName: 'Dr. B. K. Soren (NIT Raipur Nodal Desk)',
    ipAddress: '14.139.224.18',
    actionType: 'VIEW_DOSSIER',
    targetEntityId: 'ST-2026-001245',
    entityType: 'APPLICATION',
    details: 'Opened applicant verification dossier for Rahul Kumar Gond; reviewed AI extracted income discrepancy.'
  },
  {
    id: 'AUD-2026-0928-002',
    timestamp: '2026-09-28T08:14:02Z',
    actorRole: 'ministry_admin',
    actorName: 'Joint Secretary (MoTA, New Delhi)',
    ipAddress: '164.100.12.98 (NIC Gov Network)',
    actionType: 'SANCTION_GENERATE',
    targetEntityId: 'ST-2026-004112',
    entityType: 'APPLICATION',
    details: 'Generated and signed electronic Sanction Order #MOTA/TC/2026/04912 for Top Class Institute Scholarship.'
  },
  {
    id: 'AUD-2026-0927-010',
    timestamp: '2026-09-27T16:00:22Z',
    actorRole: 'expert_reviewer',
    actorName: 'Prof. A. K. Nayak (Expert Reviewer)',
    ipAddress: '202.141.80.45',
    actionType: 'RULE_EVALUATION',
    targetEntityId: 'ST-2026-002189',
    entityType: 'APPLICATION',
    details: 'Completed expert rubric scoring for Pooja Munda Ph.D proposal (Score: 94/100, Strongly Recommended).'
  },
  {
    id: 'AUD-2026-0926-044',
    timestamp: '2026-09-26T11:45:10Z',
    actorRole: 'state_officer',
    actorName: 'Shri S. R. Marandi (State Tribal Welfare Officer, Jharkhand)',
    ipAddress: '10.150.4.12',
    actionType: 'RAISE_DEFICIENCY',
    targetEntityId: 'ST-2026-005923',
    entityType: 'APPLICATION',
    details: 'Raised structured deficiency for expired Income Certificate on application #ST-2026-005923.'
  },
  {
    id: 'AUD-2026-0925-098',
    timestamp: '2026-09-25T14:22:00Z',
    actorRole: 'applicant',
    actorName: 'Pooja Munda',
    ipAddress: '103.27.8.19',
    actionType: 'AI_OCR_SCAN',
    targetEntityId: 'doc_pm_phd_adm',
    entityType: 'DOCUMENT',
    details: 'Uploaded IIT Delhi Admission letter. AI OCR successfully classified document and extracted 5 fields with 98% confidence.'
  }
];

export const MOCK_BOTTLENECK_METRICS: BottleneckMetric[] = [
  {
    stage: 'INSTITUTION_VERIFICATION',
    stageName: 'Institution / Nodal Desk Verification',
    pendingCount: 42180,
    delayedBeyondSlaCount: 7890,
    averageDaysTaken: 9.4,
    targetSlaDays: 7.0,
    deficiencyRatePercent: 14.2,
    errorRatePercent: 2.1,
    stateBreakdown: [
      { stateName: 'Jharkhand', pendingCount: 16300, averageDays: 12.4, criticalAlert: true },
      { stateName: 'Chhattisgarh', pendingCount: 12400, averageDays: 14.2, criticalAlert: true },
      { stateName: 'Madhya Pradesh', pendingCount: 18000, averageDays: 9.6, criticalAlert: false },
      { stateName: 'Odisha', pendingCount: 10600, averageDays: 8.1, criticalAlert: false },
      { stateName: 'Maharashtra', pendingCount: 8000, averageDays: 7.9, criticalAlert: false }
    ],
    topLaggingInstitutions: [
      {
        aisheCode: 'AISHE-C-28910',
        institutionName: 'Ranchi College of Engineering & Technology',
        state: 'Jharkhand',
        pendingCases: 180,
        oldestPendingDays: 24
      },
      {
        aisheCode: 'AISHE-C-19804',
        institutionName: 'Govt Polytechnic Bastar',
        state: 'Chhattisgarh',
        pendingCases: 142,
        oldestPendingDays: 19
      },
      {
        aisheCode: 'AISHE-C-33104',
        institutionName: 'Jhabua Tribal Degree College',
        state: 'Madhya Pradesh',
        pendingCases: 110,
        oldestPendingDays: 16
      }
    ]
  },
  {
    stage: 'STATE_VERIFICATION',
    stageName: 'State / UT Tribal Welfare Verification',
    pendingCount: 31200,
    delayedBeyondSlaCount: 6410,
    averageDaysTaken: 11.2,
    targetSlaDays: 10.0,
    deficiencyRatePercent: 9.8,
    errorRatePercent: 1.4,
    stateBreakdown: [
      { stateName: 'Jharkhand', pendingCount: 9200, averageDays: 15.1, criticalAlert: true },
      { stateName: 'Chhattisgarh', pendingCount: 7800, averageDays: 16.0, criticalAlert: true },
      { stateName: 'Madhya Pradesh', pendingCount: 8400, averageDays: 10.2, criticalAlert: false },
      { stateName: 'Odisha', pendingCount: 3400, averageDays: 6.8, criticalAlert: false },
      { stateName: 'Maharashtra', pendingCount: 2400, averageDays: 7.1, criticalAlert: false }
    ],
    topLaggingInstitutions: []
  },
  {
    stage: 'MINISTRY_SCRUTINY',
    stageName: 'MoTA National Scrutiny & Sanction Order',
    pendingCount: 14800,
    delayedBeyondSlaCount: 1840,
    averageDaysTaken: 6.5,
    targetSlaDays: 7.0,
    deficiencyRatePercent: 4.1,
    errorRatePercent: 0.8,
    stateBreakdown: [],
    topLaggingInstitutions: []
  },
  {
    stage: 'DBT_PFMS_DISBURSEMENT',
    stageName: 'DBT Electronic Fund Transfer / PFMS Bridge',
    pendingCount: 18400,
    delayedBeyondSlaCount: 1200,
    averageDaysTaken: 3.8,
    targetSlaDays: 4.0,
    deficiencyRatePercent: 3.2,
    errorRatePercent: 3.2, // Bank rejection / NPCI unseeded rate
    stateBreakdown: [],
    topLaggingInstitutions: []
  }
];
