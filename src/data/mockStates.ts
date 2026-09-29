export interface StateQuotaRecord {
  stateCode: string;
  stateName: string;
  nodalDepartment: string;
  totalApplications: number;
  institutionVerified: number;
  stateVerified: number;
  statePendingVerification: number;
  centralShareSanctionedCr: number;
  centralShareDisbursedCr: number;
  stateShareReleasedCr: number;
  ucSubmittedPercent: number; // Utilization Certificate %
  averageProcessingDays: number;
  criticalDelaysCount: number;
  proposals: {
    proposalId: string;
    schemeCode: string;
    financialYear: string;
    centralDemandCr: number;
    stateShareCommittedCr: number;
    status: 'SUBMITTED' | 'APPROVED' | 'SANCTIONED' | 'DISBURSED' | 'REVISION_NEEDED';
    submissionDate: string;
    ucStatus: 'SUBMITTED_100%' | 'PARTIAL_75%' | 'PENDING';
  }[];
}

export const MOCK_STATES: StateQuotaRecord[] = [
  {
    stateCode: 'JH',
    stateName: 'Jharkhand',
    nodalDepartment: 'Department of Scheduled Tribe, Scheduled Caste, Minority and Backward Class Welfare',
    totalApplications: 124800,
    institutionVerified: 98400,
    stateVerified: 82100,
    statePendingVerification: 16300,
    centralShareSanctionedCr: 215.4,
    centralShareDisbursedCr: 188.2,
    stateShareReleasedCr: 62.8,
    ucSubmittedPercent: 92,
    averageProcessingDays: 12.4,
    criticalDelaysCount: 312,
    proposals: [
      {
        proposalId: 'PROP-JH-PMS-2025-26',
        schemeCode: 'PMS-ST',
        financialYear: '2025-26',
        centralDemandCr: 195.0,
        stateShareCommittedCr: 65.0,
        status: 'SANCTIONED',
        submissionDate: '2025-06-15',
        ucStatus: 'SUBMITTED_100%'
      },
      {
        proposalId: 'PROP-JH-PRE-2025-26',
        schemeCode: 'PRE-MATRIC-ST',
        financialYear: '2025-26',
        centralDemandCr: 45.0,
        stateShareCommittedCr: 15.0,
        status: 'APPROVED',
        submissionDate: '2025-07-20',
        ucStatus: 'PARTIAL_75%'
      }
    ]
  },
  {
    stateCode: 'OD',
    stateName: 'Odisha',
    nodalDepartment: 'ST & SC Development, Minorities & Backward Classes Welfare Department',
    totalApplications: 148200,
    institutionVerified: 129000,
    stateVerified: 118400,
    statePendingVerification: 10600,
    centralShareSanctionedCr: 268.0,
    centralShareDisbursedCr: 242.5,
    stateShareReleasedCr: 80.8,
    ucSubmittedPercent: 96,
    averageProcessingDays: 8.1,
    criticalDelaysCount: 84,
    proposals: [
      {
        proposalId: 'PROP-OD-PMS-2025-26',
        schemeCode: 'PMS-ST',
        financialYear: '2025-26',
        centralDemandCr: 240.0,
        stateShareCommittedCr: 80.0,
        status: 'DISBURSED',
        submissionDate: '2025-05-30',
        ucStatus: 'SUBMITTED_100%'
      }
    ]
  },
  {
    stateCode: 'CG',
    stateName: 'Chhattisgarh',
    nodalDepartment: 'Tribal and Scheduled Caste Development Department',
    totalApplications: 92400,
    institutionVerified: 74200,
    stateVerified: 61800,
    statePendingVerification: 12400,
    centralShareSanctionedCr: 162.0,
    centralShareDisbursedCr: 135.0,
    stateShareReleasedCr: 45.0,
    ucSubmittedPercent: 88,
    averageProcessingDays: 14.2,
    criticalDelaysCount: 290,
    proposals: [
      {
        proposalId: 'PROP-CG-PMS-2025-26',
        schemeCode: 'PMS-ST',
        financialYear: '2025-26',
        centralDemandCr: 150.0,
        stateShareCommittedCr: 50.0,
        status: 'APPROVED',
        submissionDate: '2025-06-28',
        ucStatus: 'PARTIAL_75%'
      }
    ]
  },
  {
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    nodalDepartment: 'Tribal Affairs and Scheduled Caste Welfare Department',
    totalApplications: 210500,
    institutionVerified: 182000,
    stateVerified: 164000,
    statePendingVerification: 18000,
    centralShareSanctionedCr: 380.0,
    centralShareDisbursedCr: 345.2,
    stateShareReleasedCr: 115.0,
    ucSubmittedPercent: 94,
    averageProcessingDays: 9.6,
    criticalDelaysCount: 145,
    proposals: [
      {
        proposalId: 'PROP-MP-PMS-2025-26',
        schemeCode: 'PMS-ST',
        financialYear: '2025-26',
        centralDemandCr: 340.0,
        stateShareCommittedCr: 113.3,
        status: 'DISBURSED',
        submissionDate: '2025-05-15',
        ucStatus: 'SUBMITTED_100%'
      }
    ]
  },
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    nodalDepartment: 'Tribal Development Department, Government of Maharashtra',
    totalApplications: 115000,
    institutionVerified: 96000,
    stateVerified: 88000,
    statePendingVerification: 8000,
    centralShareSanctionedCr: 195.0,
    centralShareDisbursedCr: 182.0,
    stateShareReleasedCr: 60.5,
    ucSubmittedPercent: 95,
    averageProcessingDays: 7.9,
    criticalDelaysCount: 62,
    proposals: [
      {
        proposalId: 'PROP-MH-PMS-2025-26',
        schemeCode: 'PMS-ST',
        financialYear: '2025-26',
        centralDemandCr: 180.0,
        stateShareCommittedCr: 60.0,
        status: 'DISBURSED',
        submissionDate: '2025-06-10',
        ucStatus: 'SUBMITTED_100%'
      }
    ]
  }
];
