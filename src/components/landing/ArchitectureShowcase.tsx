import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const ArchitectureShowcase: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible for the National Fellowship for ST Higher Education (NFST)?',
      a: 'Any Scheduled Tribe candidate who has completed a Post-Graduate degree with at least 55% marks and is enrolled or registered in an M.Phil or Ph.D program in an accredited Indian university or institution. There is an annual family income ceiling of ₹6.00 Lakhs per annum.'
    },
    {
      q: 'How does the National Overseas Scholarship (NOS) selection work?',
      a: 'ST candidates with at least 60% marks in their qualifying graduation/post-graduation who have received an offer of admission from top 500 QS World Ranked foreign universities are eligible. 100 slots are available annually, and selections are made on pure academic merit and ranking.'
    },
    {
      q: 'What is the family income limit for Post-Matric ST Scholarships?',
      a: 'For the Post-Matric Scholarship Scheme for ST Students, the annual family income from all sources should not exceed ₹2,50,000 per annum for the current financial year.'
    },
    {
      q: 'What should I do if my document shows a name or income mismatch?',
      a: 'Our smart pre-check system will highlight the exact difference (for example, if the name on your marksheet slightly differs from your ST Certificate). You will receive an "Action Required" notification with clear instructions to review or upload a corrected certificate.'
    },
    {
      q: 'How are scholarship and fellowship funds disbursed?',
      a: 'All financial benefits, tuition fees, and monthly stipends are disbursed via Direct Benefit Transfer (DBT) directly into the student\'s Aadhaar-seeded bank account through the Public Financial Management System (PFMS).'
    }
  ];

  return (
    <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gov-navy-800)', textTransform: 'uppercase' }}>
            Help & Guidelines
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0.5rem 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Clear answers to common questions about eligibility, documents, selection, and disbursements.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="card"
                style={{ 
                  padding: '1.25rem', 
                  cursor: 'pointer',
                  borderLeft: isOpen ? '4px solid var(--gov-saffron-500)' : '1px solid var(--border-medium)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--gov-navy-950)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={18} color="var(--gov-navy-800)" />
                    {faq.q}
                  </h3>
                  {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.75rem', marginBottom: 0, paddingLeft: '1.65rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
