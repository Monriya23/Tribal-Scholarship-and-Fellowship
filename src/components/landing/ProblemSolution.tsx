import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  FolderCheck, 
  CreditCard,
  FileText
} from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gov-green-700)', textTransform: 'uppercase' }}>
            A Modern Student Experience
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0.5rem 0' }}>
            Why Apply Through the Unified Tribal Portal?
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            We've eliminated friction, repetitive paperwork, and confusing delays to make your scholarship journey transparent and fast.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gov-green-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FolderCheck size={22} color="var(--gov-green-700)" />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                One Profile for All Schemes
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Create your student profile once. Your verified certificates, academic history, and bank details automatically apply across all eligible MoTA schemes without re-uploading.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gov-saffron-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={22} color="var(--gov-saffron-600)" />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Instant Document Pre-Check
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Before you submit, our system checks if your certificates are legible, valid for the current academic year, and free of name or income discrepancies so your application isn't held up.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Clock size={22} color="#0284c7" />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Clear Tracking & Action Alerts
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Track your application through every step. If an officer needs additional information, you receive a clear, plain-language notification explaining exactly what to provide.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CreditCard size={22} color="#7c3aed" />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Direct Benefit Transfer (DBT)
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Scholarships, tuition reimbursements, and monthly fellowship stipends are credited directly to your Aadhaar-linked bank account with real-time transfer tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
