// Official API Service connecting React Frontend to FastAPI Backend

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface OfficialSource {
  id: string;
  name: string;
  organization: string;
  base_url: string;
  source_type: string;
  active: boolean;
  robots_status: string;
  last_checked_at?: string;
  last_success_at?: string;
  status: string;
  error_message?: string;
  document_count: number;
}

export interface OfficialDocument {
  id: string;
  source_id: string;
  title: string;
  url: string;
  document_type: string;
  mime_type: string;
  content_hash: string;
  published_date?: string;
  effective_date?: string;
  fetched_at: string;
  status: string;
  version: number;
  chunk_count: number;
  policy_claim_count: number;
}

export interface PolicyClaimItem {
  id: string;
  scheme_id: string;
  scheme_code?: string;
  source_document_id: string;
  document_title?: string;
  document_url?: string;
  source_name?: string;
  document_version_id?: string;
  claim_type: string;
  field: string;
  operator: string;
  value: string;
  unit?: string;
  extracted_text: string;
  source_page?: number;
  confidence: number;
  review_status: 'DETECTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'SUPERSEDED';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface PolicyConflictItem {
  id: string;
  scheme_id: string;
  scheme_code?: string;
  field: string;
  source_a_id: string;
  source_a_name?: string;
  claim_a_id: string;
  claim_a_value?: string;
  claim_a_text?: string;
  source_b_id: string;
  source_b_name?: string;
  claim_b_id: string;
  claim_b_value?: string;
  claim_b_text?: string;
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  resolved_by?: string;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
}

export interface SyncOverview {
  connected_sources_count: number;
  total_sources_count: number;
  indexed_documents_count: number;
  detected_changes_count: number;
  pending_reviews_count: number;
  active_conflicts_count: number;
  last_sync_timestamp?: string;
  recent_logs: {
    id: string;
    source_id: string;
    source_name?: string;
    started_at: string;
    completed_at?: string;
    status: string;
    pages_checked: number;
    documents_found: number;
    documents_changed: number;
    documents_failed: number;
    error_message?: string;
    log_details: string[];
  }[];
}

export interface RAGCitation {
  source_name: string;
  source_url: string;
  document_title: string;
  document_url: string;
  document_type: string;
  page_number?: number;
  section_title?: string;
  extracted_quote: string;
  policy_version?: string;
  last_fetched?: string;
}

export interface RAGResponse {
  query: string;
  answer: string;
  found_in_official_sources: boolean;
  confidence_score: number;
  citations: RAGCitation[];
  generated_at: string;
}

export interface DashboardKPIItem {
  id: string;
  label: string;
  value: number | string;
  badge: 'OFFICIAL SOURCE' | 'USER SUBMITTED' | 'SYSTEM CALCULATED' | 'AI EXTRACTED' | 'HUMAN VERIFIED';
  source: string;
  calculation: string;
  last_updated: string;
}

export class OfficialApiService {
  // Sources
  static async getSources(): Promise<OfficialSource[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sources`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend offline or failed to fetch sources:', e);
      return [];
    }
  }

  // Documents
  static async getDocuments(sourceId?: string): Promise<OfficialDocument[]> {
    try {
      const url = sourceId ? `${API_BASE_URL}/documents?source_id=${sourceId}` : `${API_BASE_URL}/documents`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend offline or failed to fetch documents:', e);
      return [];
    }
  }

  // Sync Overview & Trigger
  static async getSyncOverview(): Promise<SyncOverview> {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/overview`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return {
        connected_sources_count: 0,
        total_sources_count: 0,
        indexed_documents_count: 0,
        detected_changes_count: 0,
        pending_reviews_count: 0,
        active_conflicts_count: 0,
        recent_logs: []
      };
    }
  }

  static async triggerSync(sourceId?: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/sync/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_id: sourceId })
    });
    return await res.json();
  }

  // Policy Claims & Reviews
  static async getPolicyClaims(schemeCode?: string, status?: string): Promise<PolicyClaimItem[]> {
    try {
      let url = `${API_BASE_URL}/policy/claims`;
      const params = new URLSearchParams();
      if (schemeCode) params.append('scheme_code', schemeCode);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async reviewPolicyClaim(
    claimId: string, 
    action: 'APPROVE' | 'REJECT' | 'UNDER_REVIEW' | 'SET_ACTIVE', 
    reviewerName: string = 'Authorized Policy Officer',
    notes?: string
  ): Promise<PolicyClaimItem> {
    const res = await fetch(`${API_BASE_URL}/policy/claims/${claimId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reviewer_name: reviewerName, notes })
    });
    return await res.json();
  }

  static async getClaimProvenance(claimId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/policy/claims/${claimId}/provenance`);
    return await res.json();
  }

  // Conflicts
  static async getPolicyConflicts(): Promise<PolicyConflictItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/policy/conflicts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async resolveConflict(
    conflictId: string, 
    chosenClaimId: string, 
    resolverName: string, 
    resolutionNotes: string
  ): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/policy/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chosen_claim_id: chosenClaimId,
        resolver_name: resolverName,
        resolution_notes: resolutionNotes
      })
    });
    return await res.json();
  }

  // RAG Querying
  static async queryRAG(query: string, schemeCode?: string): Promise<RAGResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, scheme_code: schemeCode })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return {
        query,
        answer: 'I could not connect to the official source backend or find this information in the currently indexed official sources.',
        found_in_official_sources: false,
        confidence_score: 0.0,
        citations: [],
        generated_at: new Date().toISOString()
      };
    }
  }

  // Applications & OCR
  static async submitApplication(data: {
    applicant_mota_id: string;
    scheme_code: string;
    declared_income: number;
    declared_percentage: number;
    course_name: string;
    institute_aishe: string;
    institute_name?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/applications/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  static async getApplications(schemeCode?: string, stage?: string): Promise<any[]> {
    try {
      let url = `${API_BASE_URL}/applications`;
      const params = new URLSearchParams();
      if (schemeCode) params.append('scheme_code', schemeCode);
      if (stage) params.append('stage', stage);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async getVerificationDossier(applicationId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/applications/${applicationId}/dossier`);
    return await res.json();
  }

  static async uploadDocument(
    file: File, 
    docType: string, 
    declaredIncome?: number, 
    declaredPercentage?: number
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    if (declaredIncome !== undefined) formData.append('declared_income', declaredIncome.toString());
    if (declaredPercentage !== undefined) formData.append('declared_percentage', declaredPercentage.toString());

    const res = await fetch(`${API_BASE_URL}/applications/upload-document`, {
      method: 'POST',
      body: formData
    });
    return await res.json();
  }

  // KPIs
  static async getDashboardKPIs(): Promise<DashboardKPIItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard-kpis`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.kpis || [];
    } catch (e) {
      return [];
    }
  }
}
