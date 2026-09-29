import { StudentDigitalCaseFile } from '../types';

export const MOCK_STUDENTS: Record<string, StudentDigitalCaseFile> = {
  'ST-CASE-2026-JH-88341': {
    motaLifetimeId: 'ST-CASE-2026-JH-88341',
    aadhaarVaultRef: 'XXXX-XXXX-4819',
    fullName: 'Pooja Munda',
    dateOfBirth: '1998-04-12',
    gender: 'FEMALE',
    tribeCommunityName: 'Munda',
    casteCertificateNumber: 'JH/ST/2021/9812',
    domicileState: 'Jharkhand',
    domicileDistrict: 'Ranchi',
    pincode: '834001',
    mobile: '+91 98351 24789',
    email: 'pooja.munda@research.iitd.ac.in',
    bankDetails: {
      accountNumberMasked: '••••••••6721',
      accountHolderName: 'POOJA MUNDA',
      bankName: 'State Bank of India (Ranchi Main Branch)',
      ifscCode: 'SBIN0000167',
      isAadhaarSeeded: true,
      npciStatus: 'ACTIVE'
    },
    currentAcademic: {
      degreeLevel: 'PHD',
      courseName: 'Ph.D in Environmental Science & Tribal Agro-Forestry',
      specialization: 'Indigenous Bio-resource Conservation',
      institutionAisheCode: 'AISHE-U-0105',
      institutionName: 'Indian Institute of Technology Delhi (IIT Delhi)',
      institutionState: 'Delhi',
      currentYearOfStudy: 1,
      admissionYear: 2025,
      enrolmentNumber: '2025ESZ8412',
      previousYearScorePercentage: 78.4
    },
    familyIncomeAnnual: 220000,
    verifiedDocuments: [
      {
        id: 'doc_caste_pm',
        docType: 'CASTE_CERTIFICATE',
        docNumber: 'JH/ST/2021/9812',
        issuedBy: 'Sub-Divisional Officer (SDO), Sadar Ranchi',
        issueDate: '2021-06-15',
        verificationSource: 'DIGILOCKER',
        verificationHash: 'SHA256:e8b9...f4a1',
        fileUrl: '/docs/caste_pooja_munda.pdf',
        extractedData: {
          applicantName: 'Pooja Munda',
          fatherName: 'Birsa Munda',
          tribeName: 'Munda',
          state: 'Jharkhand',
          certificateNumber: 'JH/ST/2021/9812'
        },
        verifiedAt: '2025-08-10T11:20:00Z'
      },
      {
        id: 'doc_income_pm',
        docType: 'INCOME_CERTIFICATE',
        docNumber: 'JH/INC/2025/44910',
        issuedBy: 'Circle Officer, Kanke, Ranchi',
        issueDate: '2025-05-18',
        validUntil: '2026-03-31',
        verificationSource: 'STATE_CASTE_PORTAL',
        verificationHash: 'SHA256:a1c7...90bb',
        fileUrl: '/docs/income_pooja_munda.pdf',
        extractedData: {
          applicantName: 'Pooja Munda',
          annualIncomeAmount: 220000,
          financialYear: '2025-26'
        },
        verifiedAt: '2025-08-10T11:20:00Z'
      },
      {
        id: 'doc_aadhaar_pm',
        docType: 'AADHAAR_KYC',
        docNumber: 'XXXX-XXXX-4819',
        issuedBy: 'UIDAI',
        issueDate: '2019-01-14',
        verificationSource: 'DIGILOCKER',
        verificationHash: 'SHA256:7f4d...3e12',
        fileUrl: '/docs/aadhaar_pooja_munda.pdf',
        extractedData: {
          name: 'Pooja Munda',
          gender: 'Female',
          dob: '12/04/1998'
        },
        verifiedAt: '2025-08-10T11:20:00Z'
      }
    ],
    pastAwards: [
      {
        awardId: 'AWD-NFST-2023-0881',
        schemeCode: 'NFST',
        schemeName: 'National Fellowship for Higher Education of ST Students',
        academicYear: '2023-24',
        course: 'M.Phil in Environmental Studies',
        institutionName: 'Central University of Jharkhand',
        sanctionOrderNumber: 'MOTA/NFST/2023/M-Phil/0881',
        totalAmountDisbursed: 768000,
        status: 'UPGRADED',
        motaFellowshipId: 'MOTA-NFST-2023-JH-0881'
      }
    ],
    activeFellowshipId: 'MOTA-NFST-2023-JH-0881'
  },

  'ST-CASE-2026-CG-41902': {
    motaLifetimeId: 'ST-CASE-2026-CG-41902',
    aadhaarVaultRef: 'XXXX-XXXX-7104',
    fullName: 'Rahul Kumar Gond',
    dateOfBirth: '2004-11-05',
    gender: 'MALE',
    tribeCommunityName: 'Gond',
    casteCertificateNumber: 'CG/ST/2022/77102',
    domicileState: 'Chhattisgarh',
    domicileDistrict: 'Bastar',
    pincode: '494001',
    mobile: '+91 94061 98234',
    email: 'rahul.gond.btech@nitrr.ac.in',
    bankDetails: {
      accountNumberMasked: '••••••••1945',
      accountHolderName: 'RAHUL KUMAR GOND',
      bankName: 'Punjab National Bank (Jagdalpur)',
      ifscCode: 'PUNB0192300',
      isAadhaarSeeded: true,
      npciStatus: 'ACTIVE'
    },
    currentAcademic: {
      degreeLevel: 'UNDERGRADUATE',
      courseName: 'B.Tech in Computer Science & Engineering',
      specialization: 'Artificial Intelligence',
      institutionAisheCode: 'AISHE-U-0205',
      institutionName: 'National Institute of Technology Raipur (NIT Raipur)',
      institutionState: 'Chhattisgarh',
      currentYearOfStudy: 2,
      admissionYear: 2024,
      enrolmentNumber: '24115089',
      previousYearScorePercentage: 74.2
    },
    familyIncomeAnnual: 220000, // Declared ₹2.2L, but test document has ₹3.2L for Mismatch showcase!
    verifiedDocuments: [
      {
        id: 'doc_caste_rg',
        docType: 'CASTE_CERTIFICATE',
        docNumber: 'CG/ST/2022/77102',
        issuedBy: 'Tahsildar, Bastar',
        issueDate: '2022-03-20',
        verificationSource: 'DIGILOCKER',
        verificationHash: 'SHA256:1198...77aa',
        fileUrl: '/docs/caste_rahul_gond.pdf',
        extractedData: {
          applicantName: 'Rahul Kumar Gond',
          tribeName: 'Gond'
        },
        verifiedAt: '2024-09-01T09:15:00Z'
      }
    ],
    pastAwards: [
      {
        awardId: 'AWD-PMS-2024-9102',
        schemeCode: 'PMS-ST',
        schemeName: 'Post-Matric Scholarship for ST Students',
        academicYear: '2024-25',
        course: 'B.Tech 1st Year',
        institutionName: 'NIT Raipur',
        sanctionOrderNumber: 'CG/TW/PMS/2024/09102',
        totalAmountDisbursed: 135000,
        status: 'COMPLETED'
      }
    ]
  },

  'ST-CASE-2026-OD-55018': {
    motaLifetimeId: 'ST-CASE-2026-OD-55018',
    aadhaarVaultRef: 'XXXX-XXXX-9932',
    fullName: 'Ananya Soren',
    dateOfBirth: '1999-08-22',
    gender: 'FEMALE',
    tribeCommunityName: 'Santhal',
    casteCertificateNumber: 'OD/ST/2020/38194',
    domicileState: 'Odisha',
    domicileDistrict: 'Mayurbhanj',
    pincode: '757001',
    mobile: '+91 97782 10492',
    email: 'ananya.soren@ed.ac.uk',
    bankDetails: {
      accountNumberMasked: '••••••••5519',
      accountHolderName: 'ANANYA SOREN',
      bankName: 'Bank of Baroda (Baripada)',
      ifscCode: 'BARB0BARIPA',
      isAadhaarSeeded: true,
      npciStatus: 'ACTIVE'
    },
    currentAcademic: {
      degreeLevel: 'POSTGRADUATE',
      courseName: 'M.Sc in Data Science & Public Policy',
      specialization: 'Computational Governance',
      institutionAisheCode: 'FOREIGN-UK-0012',
      institutionName: 'University of Edinburgh, United Kingdom (QS Rank #27)',
      institutionState: 'Overseas (UK)',
      currentYearOfStudy: 1,
      admissionYear: 2026,
      enrolmentNumber: 'ED-2026-PG-912',
      previousYearScorePercentage: 81.6
    },
    familyIncomeAnnual: 480000,
    verifiedDocuments: [
      {
        id: 'doc_caste_as',
        docType: 'CASTE_CERTIFICATE',
        docNumber: 'OD/ST/2020/38194',
        issuedBy: 'Tahasildar, Baripada',
        issueDate: '2020-02-14',
        verificationSource: 'DIGILOCKER',
        verificationHash: 'SHA256:bb29...9811',
        fileUrl: '/docs/caste_ananya_soren.pdf',
        extractedData: {
          applicantName: 'Ananya Soren',
          tribeName: 'Santhal'
        },
        verifiedAt: '2026-01-12T14:00:00Z'
      }
    ],
    pastAwards: []
  },

  'ST-CASE-2026-MP-33109': {
    motaLifetimeId: 'ST-CASE-2026-MP-33109',
    aadhaarVaultRef: 'XXXX-XXXX-6601',
    fullName: 'Rakesh Bhil',
    dateOfBirth: '2003-06-19',
    gender: 'MALE',
    tribeCommunityName: 'Bhil',
    casteCertificateNumber: 'MP/ST/2021/1192',
    domicileState: 'Madhya Pradesh',
    domicileDistrict: 'Jhabua',
    pincode: '457661',
    mobile: '+91 91118 44021',
    email: 'rakesh.bhil@iitb.ac.in',
    bankDetails: {
      accountNumberMasked: '••••••••8812',
      accountHolderName: 'RAKESH BHIL',
      bankName: 'State Bank of India (Jhabua)',
      ifscCode: 'SBIN0000392',
      isAadhaarSeeded: true,
      npciStatus: 'ACTIVE'
    },
    currentAcademic: {
      degreeLevel: 'UNDERGRADUATE',
      courseName: 'B.Tech in Mechanical Engineering',
      institutionAisheCode: 'AISHE-U-0312',
      institutionName: 'Indian Institute of Technology Bombay (IIT Bombay)',
      institutionState: 'Maharashtra',
      currentYearOfStudy: 3,
      admissionYear: 2023,
      enrolmentNumber: '230110045',
      previousYearScorePercentage: 79.5
    },
    familyIncomeAnnual: 180000,
    verifiedDocuments: [],
    pastAwards: []
  }
};
