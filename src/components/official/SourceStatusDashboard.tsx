import React, { useState, useEffect } from 'react';
import { 
  OfficialApiService, 
  OfficialSource, 
  OfficialDocument, 
  PolicyClaimItem, 
  PolicyConflictItem, 
  SyncOverview 
} from '../../services/officialApiService';
import { 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Layers, 
  BarChart3, 
  Clock, 
  Database,
  Search,
  Sparkles,
  Check,
  X,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SourceStatusDashboard: React.FC = () => {
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [documents, setDocuments] = useState<OfficialDocument[]>([]);
  const [claims, setClaims] = useState<PolicyClaimItem[]>([]);
  const [conflicts, setConflicts] = useState<PolicyConflictItem[]>([]);
  const [syncOverview, setSyncOverview] = useState<SyncOverview | null>(null);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStepMessage, setSyncStepMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'sources' | 'documents' | 'claims_queue' | 'conflicts' | 'sync_logs'>('sources');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedClaimProvenance, setSelectedClaimProvenance] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const [srcs, docs, clms, confs, ov] = await Promise.all([
        OfficialApiService.getSources(),
        OfficialApiService.getDocuments(),
        OfficialApiService.getPolicyClaims(),
        OfficialApiService.getPolicyConflicts(),
        OfficialApiService.getSyncOverview()
      ]);
      setSources(srcs);
      setDocuments(docs);
      setClaims(clms);
      setConflicts(confs);
      setSyncOverview(ov);
    } catch (e) {
      console.error('Failed to load official data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncSources = async () => {
    setIsSyncing(true);
    setSyncStepMessage('Connecting to Official Government Portals...');
    try {
      await new Promise(r => setTimeout(r, 600));
      setSyncStepMessage('Fetching Public Guidelines & Circulars...');
      await OfficialApiService.triggerSync();
      
      await new Promise(r => setTimeout(r, 1200));
      setSyncStepMessage('Parsing Text & Detecting Content Changes...');
      await loadData();
      
      setSyncStepMessage('Indexing Chunks & Extracting Policy Claims...');
      await new Promise(r => setTimeout(r, 800));
      await loadData();
      
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
      setSyncStepMessage('');
    }
  };

  const handleReviewClaim = async (claimId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await OfficialApiService.reviewPolicyClaim(claimId, action, 'Authorized MoTA Policy Officer');
      await loadData();
    } catch (e) {
      console.error('Review failed:', e);
    }
  };

  const handleViewProvenance = async (claimId: string) => {
    try {
      const prov = await OfficialApiService.getClaimProvenance(claimId);
      setSelectedClaimProvenance(prov);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Top Intelligence Banner */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', background: 'linear-gradient(135deg, #0A1F44 0%, #051329 100%)', color: '#ffffff', borderLeft: '6px solid var(--gov-saffron-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid var(--gov-saffron-500)', borderRadius: '9999px', padding: '0.25rem 0.75rem', marginBottom: '0.65rem' }}>
                <ShieldCheck size={14} color="var(--gov-saffron-400)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gov-saffron-400)', textTransform: 'uppercase' }}>
                  Authentic Official Source Ingestion & Policy Intelligence Layer
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Ministry of Tribal Affairs Official Knowledge Base
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.35rem', margin: '0.35rem 0 0 0' }}>
                All scheme rules and guidelines are ingested from authentic official MoTA circulars, gazettes, and public portals. Zero synthetic data.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={handleSyncSources}
                disabled={isSyncing}
                className="btn btn-saffron btn-lg"
                style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={18} className={isSyncing ? 'pulse-dot' : ''} />
                {isSyncing ? (syncStepMessage || 'Syncing...') : 'Sync Official Sources'}
              </button>
            </div>
          </div>
        </div>

        {/* Real KPI Telemetry Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Official Sources Connected
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {syncOverview?.connected_sources_count || sources.filter(s => s.status === 'CONNECTED').length} / {sources.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gov-green-700)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>OFFICIAL SOURCE</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Indexed Documents & Circulars
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {documents.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>OFFICIAL SOURCE</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Policy Claims (Pending Review)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {claims.filter(c => c.review_status === 'DETECTED' || c.review_status === 'UNDER_REVIEW').length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gov-amber-700)', marginTop: '0.25rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>AI EXTRACTED</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Approved Rules
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {claims.filter(c => c.review_status === 'APPROVED' || c.review_status === 'ACTIVE').length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>HUMAN VERIFIED</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #dc2626' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Policy Conflicts Detected
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {conflicts.filter(c => c.status === 'OPEN').length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gov-red-700)', marginTop: '0.25rem' }}>
              <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>REVIEW REQUIRED</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('sources')}
            className={`btn ${activeTab === 'sources' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            Official Sources ({sources.length})
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            Indexed Circulars & PDFs ({documents.length})
          </button>

          <button
            onClick={() => setActiveTab('claims_queue')}
            className={`btn ${activeTab === 'claims_queue' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            Policy Review Queue ({claims.length})
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            className={`btn ${activeTab === 'conflicts' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            Policy Conflicts ({conflicts.length})
          </button>

          <button
            onClick={() => setActiveTab('sync_logs')}
            className={`btn ${activeTab === 'sync_logs' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            Live Ingestion Logs ({syncOverview?.recent_logs?.length || 0})
          </button>
        </div>

        {/* Tab 1: Official Sources */}
        {activeTab === 'sources' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Configured Government Source Registry
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {sources.map(src => (
                <div key={src.id} style={{ padding: '1.25rem', border: '1px solid var(--border-medium)', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                      {src.name}
                    </h4>
                    <span className="badge badge-success">
                      {src.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.6rem 0' }}>
                    {src.organization}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                    <strong>Base URL:</strong> <a href={src.base_url} target="_blank" rel="noreferrer" style={{ color: 'var(--gov-navy-700)' }}>{src.base_url}</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                    <span>Indexed Docs: <strong>{src.document_count || 0}</strong></span>
                    <span>Robots.txt: <strong style={{ color: 'var(--gov-green-700)' }}>{src.robots_status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Indexed Documents */}
        {activeTab === 'documents' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Official Scheme Guidelines, Circulars & Versions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ padding: '1.25rem', border: '1px solid var(--border-medium)', borderRadius: '8px', backgroundColor: '#ffffff', borderLeft: '4px solid var(--gov-navy-800)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                        {doc.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        <span>Type: <strong>{doc.document_type}</strong></span>
                        <span>Version: <strong>v{doc.version}</strong></span>
                        <span>Chunks Indexed: <strong>{doc.chunk_count}</strong></span>
                        <span>Hash: <code>{doc.content_hash.slice(0, 12)}...</code></span>
                        <span>Published: {doc.published_date || 'N/A'}</span>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                    >
                      <ExternalLink size={12} />
                      Open Official URL
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Policy Claims & Human Approval Queue */}
        {activeTab === 'claims_queue' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  Human Policy Review Queue (AI-Extracted Claims)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Extracted policy rules require authorized human verification before entering the active Rule Engine.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {claims.map(claim => (
                <div 
                  key={claim.id}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    borderLeft: `4px solid ${
                      claim.review_status === 'APPROVED' || claim.review_status === 'ACTIVE' 
                        ? 'var(--gov-green-600)' 
                        : claim.review_status === 'REJECTED' 
                        ? 'var(--gov-red-500)' 
                        : 'var(--gov-amber-500)'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-primary">{claim.scheme_code || 'SCHEME'}</span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--gov-navy-950)' }}>
                          {claim.field}: {claim.operator} {claim.value} {claim.unit || ''}
                        </strong>
                        <span className={`badge ${
                          claim.review_status === 'APPROVED' || claim.review_status === 'ACTIVE'
                            ? 'badge-success'
                            : claim.review_status === 'REJECTED'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}>
                          {claim.review_status}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <strong>Document:</strong> {claim.document_title} • <strong>Page:</strong> {claim.source_page || 1} • <strong>Confidence:</strong> {(claim.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleViewProvenance(claim.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem' }}
                      >
                        Provenance
                      </button>

                      {claim.review_status !== 'APPROVED' && claim.review_status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleReviewClaim(claim.id, 'APPROVE')}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: 'var(--gov-green-700)' }}
                        >
                          <Check size={12} />
                          Approve
                        </button>
                      )}

                      {claim.review_status !== 'REJECTED' && (
                        <button
                          onClick={() => handleReviewClaim(claim.id, 'REJECT')}
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <X size={12} />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                    “{claim.extracted_text}”
                  </div>

                  {claim.approved_by && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--gov-green-700)', marginTop: '0.35rem' }}>
                      ✓ Approved by <strong>{claim.approved_by}</strong> on {new Date(claim.approved_at || '').toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Conflicts */}
        {activeTab === 'conflicts' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Policy Discrepancy & Conflict Resolution
            </h3>
            {conflicts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={32} color="var(--gov-green-600)" style={{ margin: '0 auto 0.5rem auto' }} />
                No policy conflicts detected across active official documents.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {conflicts.map(conf => (
                  <div key={conf.id} style={{ padding: '1.25rem', border: '1px solid var(--gov-red-500)', borderRadius: '8px', backgroundColor: 'var(--gov-red-50)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-red-700)', fontWeight: 700, fontSize: '0.92rem' }}>
                      <AlertTriangle size={16} />
                      OFFICIAL SOURCE CONFLICT: {conf.field} ({conf.scheme_code})
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                      {conf.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Sync Logs */}
        {activeTab === 'sync_logs' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
              Real-Time Ingestion Logs & Crawl History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {syncOverview?.recent_logs && syncOverview.recent_logs.length > 0 ? (
                syncOverview.recent_logs.map(log => (
                  <div key={log.id} style={{ padding: '1rem', border: '1px solid var(--border-medium)', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--gov-navy-950)' }}>
                        {log.source_name || 'Official Source'}
                      </strong>
                      <span className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                        {log.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Started: {new Date(log.started_at).toLocaleString()} • Pages Checked: <strong>{log.pages_checked}</strong> • Docs Found: <strong>{log.documents_found}</strong>
                    </div>
                    {log.log_details && log.log_details.length > 0 && (
                      <div style={{ marginTop: '0.5rem', backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {log.log_details.map((entry, idx) => (
                          <div key={idx}>• {entry}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No sync logs recorded yet. Click <strong>[Sync Official Sources]</strong> to initiate a live sync.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Provenance Modal Drawer */}
        {selectedClaimProvenance && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="var(--gov-green-700)" />
                  Official Claim Provenance Certificate
                </h3>
                <button 
                  onClick={() => setSelectedClaimProvenance(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
                <div><strong>Policy Field:</strong> {selectedClaimProvenance.field}</div>
                <div><strong>Rule Operator:</strong> {selectedClaimProvenance.operator} {selectedClaimProvenance.value} {selectedClaimProvenance.unit || ''}</div>
                <div><strong>Source Authority:</strong> {selectedClaimProvenance.source_name}</div>
                <div><strong>Official Document:</strong> {selectedClaimProvenance.document_title} (Page {selectedClaimProvenance.page_number})</div>
                <div><strong>Document Version:</strong> v{selectedClaimProvenance.document_version}</div>
                <div><strong>Content Hash:</strong> <code>{selectedClaimProvenance.content_hash?.slice(0, 16)}...</code></div>
                <div><strong>Provenance Badge:</strong> <span className="badge badge-success">{selectedClaimProvenance.badge}</span></div>
                
                <div style={{ marginTop: '0.75rem', backgroundColor: 'var(--bg-muted)', padding: '0.75rem', borderRadius: '6px', fontStyle: 'italic' }}>
                  “{selectedClaimProvenance.extracted_text}”
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
