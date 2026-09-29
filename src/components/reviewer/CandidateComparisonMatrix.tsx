import React, { useState } from 'react';
import { ApplicationRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Building2, 
  Star, 
  FileText, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CandidateComparisonMatrixProps {
  applications: ApplicationRecord[];
}

export const CandidateComparisonMatrix: React.FC<CandidateComparisonMatrixProps> = ({ applications }) => {
  const [researchScore, setResearchScore] = useState<number>(94);
  const [academicScore, setAcademicScore] = useState<number>(92);
  const [recommendation, setRecommendation] = useState<'STRONGLY_RECOMMENDED' | 'RECOMMENDED' | 'WAITLISTED'>('STRONGLY_RECOMMENDED');
  const [evalRemarks, setEvalRemarks] = useState('High potential research topic with direct application to tribal agro-forestry preservation in eastern India.');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sparkles size={14} />
              Expert Selection Committee Desk
            </div>
            <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 600 }}>
              [SANDBOX / DEMO] Prototype Selection Configuration — Not an official government scoring rule
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', marginTop: '0.25rem', margin: 0 }}>
            Comparative Candidate Evaluation & Peer Review Matrix
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Evaluate and score assigned research proposals for NFST Ph.D fellowships and top 500 QS overseas scholarship candidates. Demonstrates the committee-based selection engine workflow.
          </p>
        </div>

        {/* Side-by-Side Candidates Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Candidate 1: Pooja Munda */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--gov-green-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-success">NFST Ph.D Fellowship</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.2rem' }}>
                  Pooja Munda (Munda Tribe)
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  IIT Delhi • Centre for Rural Development
                </div>
              </div>
              <span className="badge badge-neutral">Score: 93/100</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-muted)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem', lineHeight: 1.5 }}>
              <strong>Research Synopsis: </strong>
              Ethno-botanical documentation and sustainable agro-forestry value chain development among Chota Nagpur tribal communities.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Post-Graduation Score:</span>
                <strong className="tabular-nums" style={{ color: 'var(--gov-green-700)' }}>78.4% (CUJ M.Phil)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Prior Fellowship Award:</span>
                <code>MOTA-NFST-2023-JH-0881</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Publications Indexed:</span>
                <strong>2 SCOPUS Indexed Papers</strong>
              </div>
            </div>

            <span className="badge badge-success" style={{ width: '100%', justifyContent: 'center', padding: '0.4rem' }}>
              ✓ Verified Eligibility Clean Pass
            </span>
          </div>

          {/* Candidate 2: Ananya Soren */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-info">National Overseas (NOS)</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.2rem' }}>
                  Ananya Soren (Santhal Tribe)
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  University of Edinburgh (United Kingdom)
                </div>
              </div>
              <span className="badge badge-neutral">QS Rank: #27</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-muted)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem', lineHeight: 1.5 }}>
              <strong>Course & Focus: </strong>
              M.Sc Data Science & Public Policy with specialisation in computational governance and public health delivery in tribal belts.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Undergraduate Score:</span>
                <strong className="tabular-nums" style={{ color: 'var(--gov-green-700)' }}>81.6% (B.Tech)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Offer Letter Type:</span>
                <strong>Unconditional Offer Verified</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Passport Validity:</span>
                <strong>4 Years (2030)</strong>
              </div>
            </div>

            <span className="badge badge-info" style={{ width: '100%', justifyContent: 'center', padding: '0.4rem' }}>
              ✓ Top 500 QS Institution Satisfied
            </span>
          </div>
        </div>

        {/* Evaluation Rubric Scoring Form */}
        <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #7c3aed' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
            Expert Scored Rubric & Committee Recommendation (Pooja Munda)
          </h3>

          {submitted ? (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--gov-green-100)', color: 'var(--gov-green-800)', borderRadius: '8px', textAlign: 'center' }}>
              <CheckCircle2 size={36} color="var(--gov-green-700)" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ margin: '0 0 0.25rem 0' }}>Evaluation Recorded and Submitted to MoTA Fellowship Cell!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Scored Rubric (Research: {researchScore}/100, Academic: {academicScore}/100, {recommendation}) appended to candidate case dossier.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitEvaluation}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Research Relevance & Impact (0-100)</label>
                  <input type="number" value={researchScore} onChange={(e) => setResearchScore(Number(e.target.value))} className="form-control" max={100} min={0} />
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Track Record Score (0-100)</label>
                  <input type="number" value={academicScore} onChange={(e) => setAcademicScore(Number(e.target.value))} className="form-control" max={100} min={0} />
                </div>

                <div className="form-group">
                  <label className="form-label">Committee Recommendation</label>
                  <select value={recommendation} onChange={(e) => setRecommendation(e.target.value as any)} className="form-control">
                    <option value="STRONGLY_RECOMMENDED">STRONGLY RECOMMENDED</option>
                    <option value="RECOMMENDED">RECOMMENDED</option>
                    <option value="WAITLISTED">WAITLISTED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expert Committee Qualitative Feedback & Justification <span className="required">*</span></label>
                <textarea rows={3} value={evalRemarks} onChange={(e) => setEvalRemarks(e.target.value)} className="form-control" required />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Send size={16} />
                Submit Formal Committee Endorsement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
