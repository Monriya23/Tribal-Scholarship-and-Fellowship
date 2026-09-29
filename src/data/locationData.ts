// ==========================================================================
// TRIBAL EDUCATION OPPORTUNITIES - LOCATION & LANGUAGE ARCHITECTURE
// Ministry of Tribal Affairs (MoTA) - Government of India
// Official Location, District, Language, and Local Assistance Registry
// ==========================================================================

export interface SupportedLanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isAvailable: boolean; // Whether active translations exist in the system
  isDefault?: boolean;
}

export interface AssistancePoint {
  id: string;
  name: string;
  type: 'TRIBAL_WELFARE_OFFICE' | 'CSC_KIOSK' | 'NODAL_INSTITUTION' | 'DISTRICT_COLLECTORATE' | 'EKLAVYA_SCHOOL';
  typeLabel: string;
  state: string;
  district: string;
  address: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  supportedServices: string[];
  supportedLanguages: string[];
  isOfficialData: boolean; // True for verified government offices; False for prototype demonstration
  workingHours: string;
}

export interface DistrictInfo {
  name: string;
  code: string;
  tribalPopulationCategory?: 'HIGH_DENSITY' | 'MEDIUM_DENSITY' | 'GENERAL' | 'ITDA_BLOCK';
  languages: SupportedLanguageInfo[];
  assistancePoints: AssistancePoint[];
  institutions: {
    id: string;
    name: string;
    type: 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'PREMIER_INSTITUTE' | 'EMRS';
    aisheOrUdiseCode: string;
    isTopClassEligible?: boolean;
  }[];
}

export interface StateInfo {
  name: string;
  code: string;
  nodalDepartment: string;
  officialPortalUrl: string;
  primaryLanguages: SupportedLanguageInfo[];
  districts: Record<string, DistrictInfo>;
}

// --------------------------------------------------------------------------
// Standard Language Catalog
// --------------------------------------------------------------------------
export const LANGUAGE_CATALOG: Record<string, SupportedLanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', isAvailable: true, isDefault: true },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isAvailable: true },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isAvailable: true },
  sat: { code: 'sat', name: 'Santali (Ol Chiki)', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', isAvailable: false },
  gon: { code: 'gon', name: 'Gondi', nativeName: 'गोण्डी', isAvailable: false },
  ho: { code: 'ho', name: 'Ho', nativeName: '𑢹𑣉 / हो', isAvailable: false },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isAvailable: false },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isAvailable: false },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isAvailable: false },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isAvailable: false },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isAvailable: false },
  as: { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', isAvailable: false },
  bodo: { code: 'bodo', name: 'Bodo', nativeName: 'बड़ो', isAvailable: false },
};

// --------------------------------------------------------------------------
// All India State & District Hierarchy with High-Fidelity Pilot Data
// --------------------------------------------------------------------------
export const ALL_INDIA_LOCATIONS: Record<string, StateInfo> = {
  'Jharkhand': {
    name: 'Jharkhand',
    code: 'JH',
    nodalDepartment: 'Department of Scheduled Tribe, Scheduled Caste, Minority & Backward Class Welfare',
    officialPortalUrl: 'https://ekalyan.cgg.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.ho],
    districts: {
      'Ranchi': {
        name: 'Ranchi',
        code: 'JH-RAN',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.ho],
        assistancePoints: [
          {
            id: 'AP-JH-RAN-01',
            name: 'District Tribal Welfare Office (DTWO) Ranchi',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Tribal Welfare Office',
            state: 'Jharkhand',
            district: 'Ranchi',
            address: 'Block-A, 2nd Floor, Collectorate Building, Kutchery Road, Ranchi',
            pincode: '834001',
            contactPerson: 'Shri Manoj Kumar (DTWO)',
            phone: '0651-2214352',
            email: 'dtwo-ranchi@jharkhand.gov.in',
            supportedServices: ['Application Assistance', 'Document Verification', 'Deficiency Resolution', 'Grievance Support'],
            supportedLanguages: ['English', 'हिन्दी', 'Santali'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:00 PM (Mon-Sat)'
          },
          {
            id: 'AP-JH-RAN-02',
            name: 'Ranchi University Tribal Nodal Support Desk',
            type: 'NODAL_INSTITUTION',
            typeLabel: 'University Student Guidance Desk',
            state: 'Jharkhand',
            district: 'Ranchi',
            address: 'Administrative Block, Ranchi University, Morabadi Campus, Ranchi',
            pincode: '834008',
            contactPerson: 'Dr. Sunita Oraon (Nodal Officer)',
            phone: '+91 94311 78921',
            email: 'scholarships@ranchiuniversity.ac.in',
            supportedServices: ['Fellowship Lifecycle', 'Higher Education Guidance', 'Bank Seeding Help'],
            supportedLanguages: ['English', 'हिन्दी', 'Ho'],
            isOfficialData: true,
            workingHours: '10:30 AM - 4:30 PM (Working Days)'
          },
          {
            id: 'AP-JH-RAN-03',
            name: 'Kanke Block Common Service Centre (CSC)',
            type: 'CSC_KIOSK',
            typeLabel: 'Gram Panchayat Digital Access Kiosk',
            state: 'Jharkhand',
            district: 'Ranchi',
            address: 'Near Block Development Office, Kanke Chowk, Ranchi',
            pincode: '834006',
            contactPerson: 'Rajesh Munda (VLE Lead)',
            phone: '+91 98351 44520',
            email: 'csc.kanke@jharkhandmail.in',
            supportedServices: ['Digital Scanning & Upload', 'Assisted Application Entry', 'Aadhaar NPCI Status Check'],
            supportedLanguages: ['English', 'हिन्दी'],
            isOfficialData: false, // Prototype Demo Kiosk
            workingHours: '8:30 AM - 6:00 PM (All 7 Days)'
          }
        ],
        institutions: [
          { id: 'INST-JH-01', name: 'Ranchi University, Ranchi', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0207', isTopClassEligible: true },
          { id: 'INST-JH-02', name: 'Birsa Agricultural University (BAU)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0205', isTopClassEligible: true },
          { id: 'INST-JH-03', name: 'St. Xavier\'s College, Ranchi', type: 'COLLEGE', aisheOrUdiseCode: 'C-42618', isTopClassEligible: false },
          { id: 'INST-JH-04', name: 'Eklavya Model Residential School (EMRS), Saldega', type: 'EMRS', aisheOrUdiseCode: '20200100101', isTopClassEligible: false },
          { id: 'INST-JH-05', name: 'Government High School, Morabadi, Ranchi', type: 'SCHOOL', aisheOrUdiseCode: '20200100214', isTopClassEligible: false }
        ]
      },
      'Khunti': {
        name: 'Khunti',
        code: 'JH-KHU',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.ho],
        assistancePoints: [
          {
            id: 'AP-JH-KHU-01',
            name: 'District Tribal Welfare Office Khunti',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Tribal Welfare Office',
            state: 'Jharkhand',
            district: 'Khunti',
            address: 'Collectorate Complex, Khunti Sadar',
            pincode: '835210',
            contactPerson: 'Shri A. K. Purty',
            phone: '06528-222340',
            email: 'dtwo-khunti@jharkhand.gov.in',
            supportedServices: ['Application Assistance', 'Income/Caste Certificate Attestation', 'Pre-Matric DBT Help'],
            supportedLanguages: ['English', 'हिन्दी', 'Santali'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:00 PM'
          }
        ],
        institutions: [
          { id: 'INST-JH-06', name: 'Birsa College Khunti', type: 'COLLEGE', aisheOrUdiseCode: 'C-42621', isTopClassEligible: false },
          { id: 'INST-JH-07', name: 'EMRS Torpa, Khunti', type: 'EMRS', aisheOrUdiseCode: '20200200311', isTopClassEligible: false }
        ]
      },
      'East Singhbhum': {
        name: 'East Singhbhum (Jamshedpur)',
        code: 'JH-ESI',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.ho],
        assistancePoints: [
          {
            id: 'AP-JH-ESI-01',
            name: 'District Welfare Office Jamshedpur',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Welfare Office',
            state: 'Jharkhand',
            district: 'East Singhbhum',
            address: 'Old Court Building, Sakchi, Jamshedpur',
            pincode: '831001',
            contactPerson: 'Smt. R. Hembrom',
            phone: '0657-2431201',
            email: 'dwo-jamshedpur@jharkhand.gov.in',
            supportedServices: ['Post-Matric Support', 'National Overseas Guidance', 'Digital Grievances'],
            supportedLanguages: ['English', 'हिन्दी', 'Santali'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:00 PM'
          }
        ],
        institutions: [
          { id: 'INST-JH-08', name: 'NIT Jamshedpur (National Institute of Technology)', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0208', isTopClassEligible: true },
          { id: 'INST-JH-09', name: 'Kolhan University Chaibasa Camp Jamshedpur', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0209', isTopClassEligible: false }
        ]
      },
      'Dumka': {
        name: 'Dumka (Santhal Pargana)',
        code: 'JH-DUM',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.sat],
        assistancePoints: [],
        institutions: [
          { id: 'INST-JH-10', name: 'Sido Kanhu Murmu University (SKMU)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0210', isTopClassEligible: true }
        ]
      },
      'West Singhbhum': {
        name: 'West Singhbhum (Chaibasa)',
        code: 'JH-WSI',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.ho],
        assistancePoints: [],
        institutions: []
      },
      'Gumla': { name: 'Gumla', code: 'JH-GUM', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Simdega': { name: 'Simdega', code: 'JH-SIM', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Hazaribagh': { name: 'Hazaribagh', code: 'JH-HAZ', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Dhanbad': { name: 'Dhanbad', code: 'JH-DHA', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Bokaro': { name: 'Bokaro', code: 'JH-BOK', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Palamu': { name: 'Palamu', code: 'JH-PAL', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] }
    }
  },

  'Tamil Nadu': {
    name: 'Tamil Nadu',
    code: 'TN',
    nodalDepartment: 'Adi Dravidar and Tribal Welfare Department',
    officialPortalUrl: 'https://adw.tn.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta],
    districts: {
      'Coimbatore': {
        name: 'Coimbatore',
        code: 'TN-CBE',
        tribalPopulationCategory: 'MEDIUM_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta],
        assistancePoints: [
          {
            id: 'AP-TN-CBE-01',
            name: 'District Adi Dravidar & Tribal Welfare Office Coimbatore',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Tribal Welfare Office',
            state: 'Tamil Nadu',
            district: 'Coimbatore',
            address: 'Room No. 104, District Collectorate, State Bank Road, Coimbatore',
            pincode: '641018',
            contactPerson: 'Thiru K. Senthil Kumar (DTO)',
            phone: '0422-2300450',
            email: 'dto-cbe@tn.gov.in',
            supportedServices: ['Pre & Post-Matric Support', 'Hostel Admission Guidance', 'Scholarship DBT Help'],
            supportedLanguages: ['English', 'தமிழ்'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:45 PM (Mon-Fri)'
          },
          {
            id: 'AP-TN-CBE-02',
            name: 'Bharathiar University SC/ST Special Coaching & Guidance Cell',
            type: 'NODAL_INSTITUTION',
            typeLabel: 'University Student Welfare Desk',
            state: 'Tamil Nadu',
            district: 'Coimbatore',
            address: 'Maruthamalai Road, Bharathiar University Campus, Coimbatore',
            pincode: '641046',
            contactPerson: 'Prof. V. Murugesan',
            phone: '0422-2428100',
            email: 'scstcell@buc.edu.in',
            supportedServices: ['NFST Fellowship Processing', 'UGC-NET Mentorship', 'Postgraduate Stipends'],
            supportedLanguages: ['English', 'தமிழ்'],
            isOfficialData: true,
            workingHours: '9:30 AM - 5:00 PM'
          },
          {
            id: 'AP-TN-CBE-03',
            name: 'Anaimalai Tribal Block E-Seva Centre',
            type: 'CSC_KIOSK',
            typeLabel: 'Government e-Seva Kiosk',
            state: 'Tamil Nadu',
            district: 'Coimbatore',
            address: 'Near Taluk Office, Pollachi-Anaimalai Main Road, Pollachi',
            pincode: '642104',
            contactPerson: 'M. Anandhan',
            phone: '+91 97890 22341',
            email: 'eseva.anaimalai@tn.gov.in',
            supportedServices: ['Certificate Download', 'Digital Form Filling', 'Bank Linking Verification'],
            supportedLanguages: ['தமிழ்', 'English'],
            isOfficialData: false, // Prototype Demo Entry
            workingHours: '9:00 AM - 6:00 PM'
          }
        ],
        institutions: [
          { id: 'INST-TN-01', name: 'Bharathiar University, Coimbatore', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0442', isTopClassEligible: true },
          { id: 'INST-TN-02', name: 'PSG College of Technology, Coimbatore', type: 'COLLEGE', aisheOrUdiseCode: 'C-41124', isTopClassEligible: true },
          { id: 'INST-TN-03', name: 'Government Arts College, Coimbatore', type: 'COLLEGE', aisheOrUdiseCode: 'C-41122', isTopClassEligible: false },
          { id: 'INST-TN-04', name: 'Government Tribal Residential High School, Topslip', type: 'SCHOOL', aisheOrUdiseCode: '33120100401', isTopClassEligible: false }
        ]
      },
      'The Nilgiris': {
        name: 'The Nilgiris (Ooty)',
        code: 'TN-NIL',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta],
        assistancePoints: [
          {
            id: 'AP-TN-NIL-01',
            name: 'District Tribal Welfare Office Udhagamandalam',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Tribal Welfare Office',
            state: 'Tamil Nadu',
            district: 'The Nilgiris',
            address: 'Additional Collectorate Building, Fingerpost, Ooty',
            pincode: '643006',
            contactPerson: 'Thiru S. Balasubramanian',
            phone: '0423-2442231',
            email: 'dtwo-nil@tn.gov.in',
            supportedServices: ['PVTG Special Stipends (Toda/Kota/Kurumba)', 'School Admission Assistance', 'DBT Tracking'],
            supportedLanguages: ['English', 'தமிழ்'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:30 PM'
          }
        ],
        institutions: [
          { id: 'INST-TN-05', name: 'Government Arts College Ooty', type: 'COLLEGE', aisheOrUdiseCode: 'C-41130', isTopClassEligible: false },
          { id: 'INST-TN-06', name: 'EMRS M. Palada, Nilgiris', type: 'EMRS', aisheOrUdiseCode: '33110200102', isTopClassEligible: false }
        ]
      },
      'Chennai': {
        name: 'Chennai',
        code: 'TN-CHE',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta],
        assistancePoints: [
          {
            id: 'AP-TN-CHE-01',
            name: 'Directorate of Tribal Welfare, Chepauk',
            type: 'DISTRICT_COLLECTORATE',
            typeLabel: 'State Directorate Headquarters',
            state: 'Tamil Nadu',
            district: 'Chennai',
            address: 'Ezhilagam, Chepauk, Chennai',
            pincode: '600005',
            contactPerson: 'State Nodal Director',
            phone: '044-28591823',
            email: 'director-tw@tn.gov.in',
            supportedServices: ['Policy Guidance', 'State Level Escalations', 'Overseas Support'],
            supportedLanguages: ['English', 'தமிழ்'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:45 PM'
          }
        ],
        institutions: [
          { id: 'INST-TN-07', name: 'IIT Madras (Indian Institute of Technology)', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0456', isTopClassEligible: true },
          { id: 'INST-TN-08', name: 'Madras Medical College (MMC)', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'C-38290', isTopClassEligible: true },
          { id: 'INST-TN-09', name: 'Anna University, Chennai', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0439', isTopClassEligible: true }
        ]
      },
      'Salem': { name: 'Salem', code: 'TN-SLM', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta], assistancePoints: [], institutions: [] },
      'Dharmapuri': { name: 'Dharmapuri', code: 'TN-DHA', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta], assistancePoints: [], institutions: [] },
      'Tiruvannamalai': { name: 'Tiruvannamalai (Jawadhu Hills)', code: 'TN-TNM', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta], assistancePoints: [], institutions: [] },
      'Madurai': { name: 'Madurai', code: 'TN-MDU', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta], assistancePoints: [], institutions: [] },
      'Tiruchirappalli': { name: 'Tiruchirappalli', code: 'TN-TRY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.ta], assistancePoints: [], institutions: [] }
    }
  },

  'Odisha': {
    name: 'Odisha',
    code: 'OD',
    nodalDepartment: 'ST & SC Development, Minorities & Backward Classes Welfare Department',
    officialPortalUrl: 'https://scholarship.odisha.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.hi],
    districts: {
      'Mayurbhanj': {
        name: 'Mayurbhanj',
        code: 'OD-MAY',
        tribalPopulationCategory: 'HIGH_DENSITY',
        languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or, LANGUAGE_CATALOG.sat, LANGUAGE_CATALOG.hi],
        assistancePoints: [
          {
            id: 'AP-OD-MAY-01',
            name: 'District Welfare Office Baripada',
            type: 'TRIBAL_WELFARE_OFFICE',
            typeLabel: 'District Welfare Office',
            state: 'Odisha',
            district: 'Mayurbhanj',
            address: 'Collectorate Campus, Baripada, Mayurbhanj',
            pincode: '757001',
            contactPerson: 'Shri B. C. Murmu (DWO)',
            phone: '06792-252756',
            email: 'dwo-mayurbhanj@odisha.gov.in',
            supportedServices: ['Post-Matric Verification', 'Pre-Matric Stipend Help', 'Grievances'],
            supportedLanguages: ['English', 'Odia', 'Santali'],
            isOfficialData: true,
            workingHours: '10:00 AM - 5:00 PM'
          }
        ],
        institutions: [
          { id: 'INST-OD-01', name: 'Maharaja Sriram Chandra Bhanja Deo University', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0359', isTopClassEligible: true }
        ]
      },
      'Sundargarh': { name: 'Sundargarh (Rourkela)', code: 'OD-SUN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-OD-02', name: 'NIT Rourkela', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0355', isTopClassEligible: true }
      ]},
      'Koraput': { name: 'Koraput', code: 'OD-KOR', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or], assistancePoints: [], institutions: [] },
      'Rayagada': { name: 'Rayagada', code: 'OD-RAY', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or], assistancePoints: [], institutions: [] },
      'Khurda': { name: 'Khurda (Bhubaneswar)', code: 'OD-KHU', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.or, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-OD-03', name: 'IIT Bhubaneswar', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0356', isTopClassEligible: true },
        { id: 'INST-OD-04', name: 'AIIMS Bhubaneswar', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0701', isTopClassEligible: true }
      ]}
    }
  },

  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    code: 'MP',
    nodalDepartment: 'Tribal Affairs and Scheduled Caste Welfare Department',
    officialPortalUrl: 'https://tribal.mp.gov.in/mptaas',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon],
    districts: {
      'Bhopal': { name: 'Bhopal', code: 'MP-BHO', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-MP-01', name: 'MANIT Bhopal (NIT)', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0275', isTopClassEligible: true },
        { id: 'INST-MP-02', name: 'AIIMS Bhopal', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0702', isTopClassEligible: true }
      ]},
      'Jhabua': { name: 'Jhabua', code: 'MP-JHA', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Alirajpur': { name: 'Alirajpur', code: 'MP-ALI', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Mandla': { name: 'Mandla', code: 'MP-MAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon], assistancePoints: [], institutions: [] },
      'Dindori': { name: 'Dindori', code: 'MP-DIN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon], assistancePoints: [], institutions: [] },
      'Barwani': { name: 'Barwani', code: 'MP-BAR', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] }
    }
  },

  'Chhattisgarh': {
    name: 'Chhattisgarh',
    code: 'CG',
    nodalDepartment: 'Tribal and Scheduled Caste Development Department',
    officialPortalUrl: 'https://postmatric-scholarship.cg.nic.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon],
    districts: {
      'Bastar': { name: 'Bastar (Jagdalpur)', code: 'CG-BAS', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon], assistancePoints: [], institutions: [] },
      'Dantewada': { name: 'Dantewada (South Bastar)', code: 'CG-DAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi, LANGUAGE_CATALOG.gon], assistancePoints: [], institutions: [] },
      'Kanker': { name: 'Kanker (North Bastar)', code: 'CG-KAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Raipur': { name: 'Raipur', code: 'CG-RAI', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-CG-01', name: 'NIT Raipur', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0092', isTopClassEligible: true },
        { id: 'INST-CG-02', name: 'AIIMS Raipur', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0703', isTopClassEligible: true }
      ]},
      'Surguja': { name: 'Surguja (Ambikapur)', code: 'CG-SUR', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] }
    }
  },

  'Maharashtra': {
    name: 'Maharashtra',
    code: 'MH',
    nodalDepartment: 'Tribal Development Department',
    officialPortalUrl: 'https://mahadbt.maharashtra.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.mr, LANGUAGE_CATALOG.hi],
    districts: {
      'Nandurbar': { name: 'Nandurbar', code: 'MH-NAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.mr, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Gadchiroli': { name: 'Gadchiroli', code: 'MH-GAD', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.mr, LANGUAGE_CATALOG.gon], assistancePoints: [], institutions: [] },
      'Nashik': { name: 'Nashik', code: 'MH-NAS', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.mr, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Mumbai City': { name: 'Mumbai City', code: 'MH-MUM', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.mr, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-MH-01', name: 'IIT Bombay', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0306', isTopClassEligible: true },
        { id: 'INST-MH-02', name: 'TISS Mumbai (Tata Institute of Social Sciences)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0330', isTopClassEligible: true }
      ]}
    }
  },

  'Assam': {
    name: 'Assam',
    code: 'AS',
    nodalDepartment: 'Department of Welfare of Plain Tribes & Backward Classes',
    officialPortalUrl: 'https://wptbc.assam.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.as, LANGUAGE_CATALOG.bodo, LANGUAGE_CATALOG.hi],
    districts: {
      'Karbi Anglong': { name: 'Karbi Anglong', code: 'AS-KAR', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.as, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Kokrajhar': { name: 'Kokrajhar (BTR)', code: 'AS-KOK', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.bodo, LANGUAGE_CATALOG.as], assistancePoints: [], institutions: [] },
      'Kamrup Metropolitan': { name: 'Kamrup Metropolitan (Guwahati)', code: 'AS-KAM', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.as, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-AS-01', name: 'IIT Guwahati', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0053', isTopClassEligible: true },
        { id: 'INST-AS-02', name: 'Gauhati University', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0048', isTopClassEligible: true }
      ]}
    }
  },

  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    code: 'AP',
    nodalDepartment: 'Tribal Welfare Department',
    officialPortalUrl: 'https://jnanabhumi.ap.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te, LANGUAGE_CATALOG.hi],
    districts: {
      'Alluri Sitharama Raju': { name: 'Alluri Sitharama Raju (Paderu)', code: 'AP-ASR', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te], assistancePoints: [], institutions: [] },
      'Visakhapatnam': { name: 'Visakhapatnam', code: 'AP-VIS', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-AP-01', name: 'Andhra University', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0003', isTopClassEligible: true },
        { id: 'INST-AP-02', name: 'IIM Visakhapatnam', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0847', isTopClassEligible: true }
      ]}
    }
  },

  'Telangana': {
    name: 'Telangana',
    code: 'TS',
    nodalDepartment: 'Tribal Welfare Department',
    officialPortalUrl: 'https://telanganaepass.cgg.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te, LANGUAGE_CATALOG.hi],
    districts: {
      'Bhadradri Kothagudem': { name: 'Bhadradri Kothagudem', code: 'TS-BHA', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te], assistancePoints: [], institutions: [] },
      'Hyderabad': { name: 'Hyderabad', code: 'TS-HYD', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.te, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-TS-01', name: 'University of Hyderabad (UoH)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0500', isTopClassEligible: true },
        { id: 'INST-TS-02', name: 'IIT Hyderabad', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0498', isTopClassEligible: true }
      ]}
    }
  },

  'Gujarat': {
    name: 'Gujarat',
    code: 'GJ',
    nodalDepartment: 'Tribal Development Department',
    officialPortalUrl: 'https://digitalgujarat.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.gu, LANGUAGE_CATALOG.hi],
    districts: {
      'Dahod': { name: 'Dahod', code: 'GJ-DAH', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.gu, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Dang': { name: 'Dang (Ahwa)', code: 'GJ-DAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.gu], assistancePoints: [], institutions: [] },
      'Ahmedabad': { name: 'Ahmedabad', code: 'GJ-AHM', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.gu, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-GJ-01', name: 'IIM Ahmedabad', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0145', isTopClassEligible: true },
        { id: 'INST-GJ-02', name: 'IIT Gandhinagar', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0146', isTopClassEligible: true }
      ]}
    }
  },

  'Rajasthan': {
    name: 'Rajasthan',
    code: 'RJ',
    nodalDepartment: 'Tribal Area Development (TAD) Department',
    officialPortalUrl: 'https://tad.rajasthan.gov.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi],
    districts: {
      'Udaipur': { name: 'Udaipur (TAD Zone)', code: 'RJ-UDA', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-RJ-01', name: 'Mohanlal Sukhadia University (MLSU)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0402', isTopClassEligible: true }
      ]},
      'Banswara': { name: 'Banswara', code: 'RJ-BAN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Dungarpur': { name: 'Dungarpur', code: 'RJ-DUN', tribalPopulationCategory: 'HIGH_DENSITY', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] },
      'Jaipur': { name: 'Jaipur', code: 'RJ-JAI', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-RJ-02', name: 'MNIT Jaipur', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0399', isTopClassEligible: true }
      ]}
    }
  },

  'Delhi (UT)': {
    name: 'Delhi (UT)',
    code: 'DL',
    nodalDepartment: 'Department for the Welfare of SC/ST/OBC/Minorities, GNCTD',
    officialPortalUrl: 'https://edistrict.delhigovt.nic.in',
    primaryLanguages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi],
    districts: {
      'New Delhi': { name: 'New Delhi (Central)', code: 'DL-NDL', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [
        { id: 'INST-DL-01', name: 'University of Delhi (DU)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0109', isTopClassEligible: true },
        { id: 'INST-DL-02', name: 'Jawaharlal Nehru University (JNU)', type: 'UNIVERSITY', aisheOrUdiseCode: 'U-0108', isTopClassEligible: true },
        { id: 'INST-DL-03', name: 'IIT Delhi', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0107', isTopClassEligible: true },
        { id: 'INST-DL-04', name: 'AIIMS New Delhi', type: 'PREMIER_INSTITUTE', aisheOrUdiseCode: 'U-0105', isTopClassEligible: true }
      ]},
      'Central Delhi': { name: 'Central Delhi', code: 'DL-CEN', languages: [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi], assistancePoints: [], institutions: [] }
    }
  }
};

// --------------------------------------------------------------------------
// Location & Language Helper Services
// --------------------------------------------------------------------------

/**
 * Returns list of all supported States & UTs
 */
export function getAllStates(): string[] {
  return Object.keys(ALL_INDIA_LOCATIONS).sort();
}

/**
 * Returns districts for a given State
 */
export function getDistrictsForState(stateName: string): string[] {
  const state = ALL_INDIA_LOCATIONS[stateName];
  if (!state) return [];
  return Object.keys(state.districts).sort();
}

/**
 * Returns mapped languages for a specific state & district
 */
export function getLanguagesForLocation(stateName: string, districtName?: string): SupportedLanguageInfo[] {
  const state = ALL_INDIA_LOCATIONS[stateName];
  if (!state) return [LANGUAGE_CATALOG.en];

  if (districtName && state.districts[districtName]) {
    return state.districts[districtName].languages;
  }

  return state.primaryLanguages || [LANGUAGE_CATALOG.en, LANGUAGE_CATALOG.hi];
}

/**
 * Returns assistance points and CSC desks for a location
 */
export function getAssistancePointsForLocation(
  stateName: string, 
  districtName?: string, 
  serviceFilter?: string
): AssistancePoint[] {
  const state = ALL_INDIA_LOCATIONS[stateName];
  if (!state) return [];

  let points: AssistancePoint[] = [];

  if (districtName && state.districts[districtName]) {
    points = [...state.districts[districtName].assistancePoints];
  } else {
    // Collect all assistance points in state
    Object.values(state.districts).forEach(d => {
      points.push(...d.assistancePoints);
    });
  }

  // If no specific points registered for district yet, provide standard District Nodal point fallback
  if (points.length === 0 && districtName) {
    points.push({
      id: `AP-AUTO-${state.code}-${districtName.substring(0, 3).toUpperCase()}`,
      name: `District Tribal Welfare Office (${districtName})`,
      type: 'TRIBAL_WELFARE_OFFICE',
      typeLabel: 'District Tribal Welfare Nodal Desk',
      state: stateName,
      district: districtName,
      address: `District Collectorate Complex, ${districtName}, ${stateName}`,
      pincode: 'PIN-XXXXXX',
      contactPerson: 'District Nodal Officer (Tribal Welfare)',
      phone: '1800-11-7788 (MoTA National Helpline)',
      email: `welfare.${districtName.toLowerCase().replace(/\s+/g, '')}@${state.code.toLowerCase()}.gov.in`,
      supportedServices: ['Application Assistance', 'Document Verification', 'Direct Benefit Transfer Help'],
      supportedLanguages: ['English', state.primaryLanguages[1]?.name || 'Regional'],
      isOfficialData: false, // Indicative Directory Entry
      workingHours: '10:00 AM - 5:00 PM (Monday to Friday)'
    });
  }

  if (serviceFilter && serviceFilter !== 'ALL') {
    return points.filter(p => p.supportedServices.some(s => s.toLowerCase().includes(serviceFilter.toLowerCase())));
  }

  return points;
}

/**
 * Returns institutions for a given district
 */
export function getInstitutionsForLocation(stateName: string, districtName: string) {
  const state = ALL_INDIA_LOCATIONS[stateName];
  if (!state || !state.districts[districtName]) return [];
  return state.districts[districtName].institutions;
}
