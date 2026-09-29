import React, { useState } from 'react';
import { OfficialApiService, RAGResponse } from '../../services/officialApiService';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  Send,
  Calendar,
  Layers
} from 'lucide-react';

export const OfficialRAGAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentResult, setCurrentResult] = useState<RAGResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const sampleQuestions = [
    'What is the family income limit for the National Overseas Scholarship (NOS)?',
    'What is the monthly stipend for NFST JRF and SRF Ph.D scholars?',
    'What is the Central-State funding sharing ratio for Post-Matric ST scholarships?',
    'What is the annual contingency grant for Science research scholars under NFST?',
    'What is the minimum marks percentage required for ST candidates applying for higher fellowship?'
  ];

  const handleSearch = async (questionText: string) => {
    setQuery(questionText);
    setIsSearching(true);

    try {
      const result = await OfficialApiService.queryRAG(questionText);
      setCurrentResult(result);
    } catch (e) {
      console.error('RAG search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Sparkles size={14} />
            Authentic Official Document RAG Engine
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', marginTop: '0.25rem', margin: 0 }}>
            Official Policy Assistant (Zero Hallucination)
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Answers generated strictly from authentic, indexed Ministry of Tribal Affairs circulars, gazette documents, and scheme guidelines with exact citations, page references, and policy versions.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem', borderTop: '4px solid #8b5cf6' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) handleSearch(query);
            }}
            style={{ display: 'flex', gap: '0.75rem' }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Ask any scheme rule question (e.g. income limit, stipend amount, sharing ratio, marks)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '38px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="btn btn-primary"
              style={{ fontWeight: 700, minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Send size={16} />
              Ask RAG
            </button>
          </form>

          {/* Quick Prompts */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Official Policy Queries:
            </span>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSearch(sq)}
                style={{
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  color: 'var(--gov-navy-900)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* RAG Answer Display */}
        {isSearching ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="pulse-dot" style={{ width: '12px', height: '12px', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)' }}>
              Retrieving Verified Clauses from Official MoTA Repository...
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Searching indexed chunks with strict anti-hallucination guardrails.
            </p>
          </div>
        ) : currentResult ? (
          <div className="card" style={{ padding: '1.75rem', borderLeft: `5px solid ${currentResult.found_in_official_sources ? 'var(--gov-green-600)' : 'var(--gov-red-500)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color={currentResult.found_in_official_sources ? 'var(--gov-green-700)' : 'var(--gov-red-600)'} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  Official Grounded Answer
                </h3>
              </div>
              <span className={`badge ${currentResult.found_in_official_sources ? 'badge-success' : 'badge-danger'}`}>
                {currentResult.found_in_official_sources ? 'OFFICIAL SOURCE' : 'NOT IN INDEXED SOURCES'}
              </span>
            </div>

            {/* Answer Content */}
            <div style={{ 
              fontSize: '0.98rem', 
              color: 'var(--text-primary)', 
              lineHeight: 1.7, 
              backgroundColor: 'var(--bg-muted)', 
              padding: '1.25rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line'
            }}>
              {currentResult.answer}
            </div>

            {/* Citations & Direct PDF Links */}
            {currentResult.citations && currentResult.citations.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--gov-navy-950)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} color="var(--gov-navy-800)" />
                  Exact Official Source Citations ({currentResult.citations.length}):
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentResult.citations.map((citation, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '8px',
                        borderLeft: '4px solid var(--gov-saffron-500)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--gov-navy-950)' }}>
                            {citation.section_title || 'Official Clause'}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            <span><strong>Source:</strong> {citation.source_name}</span>
                            <span><strong>Document:</strong> {citation.document_title} (Page {citation.page_number || 1})</span>
                            <span><strong>Policy Version:</strong> {citation.policy_version || '2025-26'}</span>
                            {citation.last_fetched && (
                              <span><strong>Fetched:</strong> {new Date(citation.last_fetched).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        {citation.document_url && (
                          <a
                            href={citation.document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                          >
                            <ExternalLink size={12} />
                            Open Official Source
                          </a>
                        )}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: '4px', marginTop: '0.4rem' }}>
                        “{citation.extracted_quote}”
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
