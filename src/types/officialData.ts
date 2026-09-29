// Core Data Models for the Official Scholarship Data Intelligence Layer (MoTA Ecosystem)

export type OfficialSourceType = 
  | 'GOVT_PORTAL' 
  | 'GAZETTE_NOTIFICATION' 
  | 'SCHEME_GUIDELINE_PDF' 
  | 'PARLIAMENT_QUESTION_REPLY' 
  | 'PRESS_INFORMATION_BUREAU' 
  | 'PUBLIC_DASHBOARD' 
  | 'CIRCULAR_AMENDMENT';

export type SyncStatus = 'SUCCESS' | 'CHANGED_REVIEW_REQUIRED' | 'FETCH_FAILED' | 'INTEGRATION_UNAVAILABLE';

export interface SourceProvenance {
  source_name: string;
  source_url: string;
  source_type: OfficialSourceType;
  original_title: string;
  publication_date?: string;
  effective_date?: string;
  fetched_at: string;
  source_document: string;
  source_page?: number;
  content_hash: string; // SHA-256 Checksum
  extraction_method: 'AUTOMATED_PDF_PARSER' | 'OFFICIAL_WEB_SCRAPER' | 'OFFICIAL_API' | 'MANUAL_VERIFIED_INGESTION';
}

export interface OfficialSourceRegistryItem {
  id: string;
  name: string;
  baseUrl: string;
  domain: string;
  category: 'MINISTRY' | 'FELLOWSHIP' | 'OVERSEAS' | 'NATIONAL_PORTAL' | 'PAYMENT_GATEWAY' | 'IDENTITY';
  description: string;
  status: SyncStatus;
  lastSyncTimestamp: string;
  totalDocumentsIndexed: number;
  totalPolicyClausesExtracted: number;
  isAutomatedAccessPermitted: boolean;
  notes?: string;
}

export interface OfficialGuidelineDocument {
  id: string;
  sourceId: string;
  title: string;
  schemeCode: string;
  documentUrl: string;
  fileSizeBytes: number;
  totalPages: number;
  publicationYear: string;
  contentHash: string;
  lastFetchedAt: string;
  provenance: SourceProvenance;
  extractedClauses: {
    clauseNumber: string;
    sectionTitle: string;
    pageNumber: number;
    rawText: string;
    normalizedClaim: Record<string, any>;
    category: 'ELIGIBILITY' | 'FINANCIAL_BENEFIT' | 'SELECTION_PROCEDURE' | 'DOCUMENT_REQUIREMENT' | 'DISBURSEMENT_MODE';
  }[];
}

export interface OfficialSchemePolicy {
  scheme_code: string;
  scheme_name: string;
  ministry: string;
  funding_type: 'CENTRAL_SECTOR' | 'CENTRALLY_SPONSORED';
  sharing_ratio_centre_state: string; // e.g. '75:25' or '100:0' or '90:10 (NE/Himalayan)'
  disbursement_model: string; // e.g. 'DBT via SNA SPARSH / PFMS' or 'MEA Mission Reimbursement'
  target_beneficiaries: string;
  annual_slots: number | string;
  income_ceiling_inr: number | null; // null if no income ceiling (e.g. NFST fellowship)
  academic_criteria: string;
  age_limit_years?: number | null;
  financial_benefits: {
    maintenance_or_stipend: string;
    tuition_fee_coverage?: string;
    contingency_grant?: string;
    other_allowances?: string;
    tuitionFeeCapAnnual?: string | number;
  };
  required_official_documents: string[];
  selection_mode: string;
  provenance: SourceProvenance;
}

export interface OfficialNotificationRecord {
  id: string;
  title: string;
  scheme_code: string;
  notification_date: string;
  closing_date?: string;
  source_name: string;
  source_url: string;
  document_url?: string;
  summary: string;
  status: 'ACTIVE' | 'CLOSED' | 'EXTENDED' | 'CORRIGENDUM';
  provenance: SourceProvenance;
}

export interface OfficialStatisticRecord {
  id: string;
  metric_name: string;
  metric_value: number | string;
  reporting_period: string;
  financial_year: string;
  scheme_code?: string;
  disaggregated_by_state?: Record<string, number>;
  source_name: string;
  source_document: string;
  source_url: string;
  fetched_at: string;
  provenance: SourceProvenance;
}

export interface OfficialDataSyncLog {
  id: string;
  startTime: string;
  endTime: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  sourcesContacted: number;
  pagesFetched: number;
  documentsDiscovered: number;
  documentsChanged: number;
  recordsExtracted: number;
  recordsRejected: number;
  errors: string[];
}

export interface PolicyConflictItem {
  id: string;
  scheme_code: string;
  parameter: string;
  source_a: {
    title: string;
    value: string;
    provenance: SourceProvenance;
  };
  source_b: {
    title: string;
    value: string;
    provenance: SourceProvenance;
  };
  analysis: string;
  status: 'ACTIVE_CONFLICT' | 'GAZETTE_SUPERCEDED' | 'PROPOSAL_UNDER_REVISION';
}
