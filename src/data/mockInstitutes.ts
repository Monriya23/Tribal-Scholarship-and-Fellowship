export interface InstitutionRecord {
  aisheCode: string;
  name: string;
  type: 'IIT' | 'NIT' | 'CENTRAL_UNIVERSITY' | 'STATE_UNIVERSITY' | 'GOVT_COLLEGE' | 'OVERSEAS';
  state: string;
  district: string;
  nodalOfficerName: string;
  nodalOfficerEmail: string;
  nodalOfficerPhone: string;
  applicationsReceived: number;
  verifiedCount: number;
  pendingCount: number;
  deficientCount: number;
  averageTurnaroundDays: number;
  performanceGrade: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL_DELAY';
}

export const MOCK_INSTITUTIONS: InstitutionRecord[] = [
  {
    aisheCode: 'AISHE-U-0105',
    name: 'Indian Institute of Technology Delhi',
    type: 'IIT',
    state: 'Delhi',
    district: 'New Delhi',
    nodalOfficerName: 'Prof. S. R. Sharma',
    nodalOfficerEmail: 'nodal.scholarship@iitd.ac.in',
    nodalOfficerPhone: '+91 11 2659 7120',
    applicationsReceived: 142,
    verifiedCount: 138,
    pendingCount: 4,
    deficientCount: 6,
    averageTurnaroundDays: 2.8,
    performanceGrade: 'EXCELLENT'
  },
  {
    aisheCode: 'AISHE-U-0205',
    name: 'National Institute of Technology Raipur',
    type: 'NIT',
    state: 'Chhattisgarh',
    district: 'Raipur',
    nodalOfficerName: 'Dr. B. K. Soren',
    nodalOfficerEmail: 'scholarships@nitrr.ac.in',
    nodalOfficerPhone: '+91 771 2254200',
    applicationsReceived: 218,
    verifiedCount: 184,
    pendingCount: 34,
    deficientCount: 22,
    averageTurnaroundDays: 6.4,
    performanceGrade: 'GOOD'
  },
  {
    aisheCode: 'AISHE-U-0312',
    name: 'Indian Institute of Technology Bombay',
    type: 'IIT',
    state: 'Maharashtra',
    district: 'Mumbai',
    nodalOfficerName: 'Dr. M. S. Gaikwad',
    nodalOfficerEmail: 'dean.ap.office@iitb.ac.in',
    nodalOfficerPhone: '+91 22 2576 7000',
    applicationsReceived: 98,
    verifiedCount: 95,
    pendingCount: 3,
    deficientCount: 4,
    averageTurnaroundDays: 3.1,
    performanceGrade: 'EXCELLENT'
  },
  {
    aisheCode: 'AISHE-U-0498',
    name: 'Indian Institute of Technology Kharagpur',
    type: 'IIT',
    state: 'West Bengal',
    district: 'Paschim Medinipur',
    nodalOfficerName: 'Prof. T. K. Hansda',
    nodalOfficerEmail: 'scholarship.desk@iitkgp.ac.in',
    nodalOfficerPhone: '+91 3222 282000',
    applicationsReceived: 110,
    verifiedCount: 92,
    pendingCount: 18,
    deficientCount: 11,
    averageTurnaroundDays: 5.2,
    performanceGrade: 'GOOD'
  },
  {
    aisheCode: 'AISHE-C-28910',
    name: 'Ranchi College of Engineering & Technology',
    type: 'GOVT_COLLEGE',
    state: 'Jharkhand',
    district: 'Ranchi',
    nodalOfficerName: 'Prof. Ramesh Tirkey',
    nodalOfficerEmail: 'nodal@rcet-ranchi.ac.in',
    nodalOfficerPhone: '+91 651 2490123',
    applicationsReceived: 490,
    verifiedCount: 310,
    pendingCount: 180,
    deficientCount: 78,
    averageTurnaroundDays: 14.8,
    performanceGrade: 'CRITICAL_DELAY'
  }
];
