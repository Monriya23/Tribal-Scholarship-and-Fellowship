import React, { useState } from 'react';
import { SchemeConfig } from '../../types';
import { DocumentGuidanceModal } from '../modals/DocumentGuidanceModal';
import { 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  Globe2, 
  CheckCircle2, 
  FileText, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SchemeDetailPageProps {
  scheme: SchemeConfig;
  onBack: () => void;
  onCheckEligibility: (scheme: SchemeConfig) => void;
  onApply: (scheme: SchemeConfig) => void;
}

export const SchemeDetailPage: React.FC<SchemeDetailPageProps> = ({
  scheme,
  onBack,
  onCheckEligibility,
  onApply
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedGuideDoc, setSelectedGuideDoc] = useState<string | null>(null);

  const getSchemeDetails = () => {
    if (scheme.category === 'HIGHER_EDUCATION_FELLOWSHIP') {
      return {
        about: "The National Fellowship for Higher Education of ST Students (NFST) provides financial assistance to Scheduled Tribe scholars to pursue higher education leading to M.Phil and Ph.D. degrees in Sciences, Humanities, Social Sciences, and Engineering & Technology.",
        whoCanApply: "Scheduled Tribe (ST) students who have registered for regular and full-time M.Phil/Ph.D. courses in recognized Indian Universities/Institutes/Colleges.",
        benefits: [
          { title: "Junior Research Fellow (JRF)", detail: "₹37,000 per month for the initial 2 years" },
          { title: "Senior Research Fellow (SRF)", detail: "₹42,000 per month for the remaining tenure (subject to evaluation)" },
          { title: "Contingency Grant (Humanities & Social Sciences)", detail: "₹10,000 to ₹20,500 per annum" },
          { title: "Contingency Grant (Sciences & Engineering)", detail: "₹12,000 to ₹25,000 per annum" },
          { title: "Escorts / Reader Assistance", detail: "₹2,000 per month for Persons with Benchmark Disabilities" }
        ],
        eligibility: [
          "The applicant must belong to a notified Scheduled Tribe (ST) community.",
          "Must have qualified Master's Degree examination with minimum 55% marks.",
          "Candidate must have secured admission into a regular M.Phil / Ph.D program in an institution recognized by UGC/AICTE/Ministry.",
          "Total annual family income should not exceed ₹6.00 Lakhs per annum."
        ],
        documents: [
          "Scheduled Tribe (ST) Caste Certificate issued by competent Revenue Authority",
          "Post-Graduate Qualifying Marksheet & Degree Certificate",
          "Valid Proof of Admission / Registration in M.Phil / Ph.D program",
          "Annual Family Income Certificate for Financial Year 2025-26",
          "Aadhaar Card (linked with bank account)",
          "Disability Certificate (if applicable)"
        ],
        selectionProcess: "The total number of fresh slots is 750 per year. Selection is strictly merit-based, evaluated on Post-Graduate academic percentage, adherence to state and gender reservation guidelines, with priority consideration for Particularly Vulnerable Tribal Groups (PVTGs).",
        faqs: [
          { q: "Can I receive this fellowship if I am also employed?", a: "No. The scholar is not allowed to accept any other full-time employment or other scholarship/fellowship during the tenure." },
          { q: "How is the monthly fellowship paid?", a: "The fellowship amount is disbursed directly into the scholar's Aadhaar-seeded bank account through Direct Benefit Transfer (DBT)." },
          { q: "What is the tenure of the fellowship?", a: "Maximum 5 years for integrated M.Phil + Ph.D or direct Ph.D. enrollment." }
        ]
      };
    } else if (scheme.category === 'OVERSEAS_STUDIES') {
      return {
        about: "The National Overseas Scholarship (NOS) provides financial assistance to meritorious Scheduled Tribe candidates selected for pursuing Master's and Ph.D. level courses in reputed foreign universities ranked among the top 1000 in the latest QS World University Rankings.",
        whoCanApply: "ST candidates who have secured an unconditional offer of admission from an eligible overseas university.",
        benefits: [
          { title: "Tuition Fees", detail: "Actual tuition and institutional fees paid directly to the foreign university" },
          { title: "Annual Maintenance Allowance", detail: "USD 15,400 per annum (USA) / GBP 9,900 per annum (UK and other countries)" },
          { title: "Contingency Allowance", detail: "USD 1,500 / GBP 1,100 per annum for books, study tour, and research expenses" },
          { title: "Travel & Airfare", detail: "Economy class airfare to and from India, along with visa fees and medical insurance" }
        ],
        eligibility: [
          "Candidate must belong to a notified Scheduled Tribe (ST) category.",
          "Minimum 60% marks or equivalent grade in the qualifying degree.",
          "Candidate age must be below 35 years as on the first day of the application year.",
          "Total family income from all sources must not exceed ₹8.00 Lakhs per annum.",
          "Candidate must have an unconditional admission offer from a university ranked in the Top 1000 QS World Rankings."
        ],
        documents: [
          "Valid ST Caste Certificate",
          "Unconditional Admission Offer Letter from Foreign University",
          "Undergraduate / Postgraduate Marksheets and Degree Certificate",
          "Income Certificate / ITR of Family Members",
          "Valid Indian Passport Copy",
          "Statement of Purpose (SOP) & Research Proposal"
        ],
        selectionProcess: "Total 20 awards per year. Applications are screened and ranked based on foreign university QS ranking and applicant merit by an expert selection committee.",
        faqs: [
          { q: "Is IELTS/TOEFL mandatory?", a: "The candidate must fulfill the language requirements of the admitting overseas institution." },
          { q: "Are all foreign universities eligible?", a: "Only foreign institutions ranked within the top 1000 in QS World University Rankings are recognized for NOS." }
        ]
      };
    } else {
      return {
        about: `${scheme.name} is a centrally sponsored scheme implemented in partnership with State Governments to assist Scheduled Tribe students in meeting educational expenses.`,
        whoCanApply: "Eligible ST students enrolled in recognized educational institutions across India.",
        benefits: [
          { title: "Compulsory Non-Refundable Fees", detail: "Full reimbursement of tuition, examination, and enrollment fees" },
          { title: "Maintenance Allowance", detail: "Monthly allowance for day scholars and hostellers as per approved category norms" },
          { title: "Study Tour & Book Allowance", detail: "Annual study allowance for professional and degree programs" }
        ],
        eligibility: [
          "Applicant must belong to a notified Scheduled Tribe (ST) community.",
          "Family annual income should not exceed ₹2,50,000 per annum from all sources.",
          "Must be studying in a recognized government or private educational institution.",
          "Must not be in receipt of any other central or state scholarship."
        ],
        documents: [
          "ST Community Certificate issued by competent Revenue Authority",
          "Previous Academic Year Marksheet",
          "Valid Family Income Certificate (FY 2025-26)",
          "Institution Fee Receipt and Bonafide Certificate",
          "Aadhaar-Seeded Bank Passbook / Account Details"
        ],
        selectionProcess: "All eligible ST students satisfying the income and educational criteria are sanctioned scholarship grants. Funds are credited through Direct Benefit Transfer (DBT).",
        faqs: [
          { q: "How do I renew my scholarship for the next year?", a: "You can submit a simple renewal application by logging in with your registration ID and uploading your latest passed marksheet." },
          { q: "Is an Aadhaar-seeded account required?", a: "Yes. In accordance with Government guidelines, scholarship funds are credited via DBT directly to your Aadhaar-linked account." }
        ]
      };
    }
  };

  const details = getSchemeDetails();

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--background)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Schemes</span>
        </button>

        {/* Scheme Header Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', borderTop: '4px solid var(--primary-navy)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">{scheme.code}</span>
            <span className="badge badge-success">Official Scheme</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', color: 'var(--primary-navy)', margin: '0.25rem 0 0.75rem 0', fontWeight: 800 }}>
            {scheme.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--muted-text)', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            {scheme.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button
              onClick={() => onCheckEligibility(scheme)}
              className="btn btn-secondary"
              style={{ fontWeight: 600 }}
            >
              Check My Eligibility
            </button>

            <button
              onClick={() => onApply(scheme)}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              Start Application →
            </button>
          </div>
        </div>

        {/* Informational Document Structure */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          {/* Section 1: About */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              About the Scheme
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
              {details.about}
            </p>
          </section>

          {/* Section 2: Who Can Apply */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Who Can Apply?
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
              {details.whoCanApply}
            </p>
          </section>

          {/* Section 3: Eligibility Criteria */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Eligibility Criteria
            </h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.94rem', color: 'var(--text)', lineHeight: 1.6 }}>
              {details.eligibility.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 4: What the Scheme Provides (Table) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              What the Scheme Provides
            </h2>
            <div className="table-responsive">
              <table className="table" style={{ border: '1px solid var(--border-light)' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Component</th>
                    <th>Financial Assistance / Entitlement</th>
                  </tr>
                </thead>
                <tbody>
                  {details.benefits.map((b, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{b.title}</td>
                      <td>{b.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Documents Required */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Documents Required
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {details.documents.map((doc, idx) => (
                <div key={idx} style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--surface-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                    <FileText size={18} color="var(--primary-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{doc}</span>
                  </div>
                  <button
                    onClick={() => setSelectedGuideDoc(doc)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--secondary-maroon)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      marginLeft: '1.7rem',
                      textDecoration: 'underline'
                    }}
                  >
                    Don't have this document? Learn how to obtain it →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Selection / Application Process */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Selection & Application Process
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
              {details.selectionProcess}
            </p>
          </section>

          {/* Section 7: FAQs */}
          <section>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {details.faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}
                >
                  <div 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--surface-muted)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.92rem', color: 'var(--primary-navy)' }}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {openFaq === idx && (
                    <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.6, borderTop: '1px solid var(--border-light)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom CTA Card */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            Ready to Apply for {scheme.code}?
          </h3>
          <p style={{ fontSize: '0.94rem', color: 'rgba(255,255,255,0.85)', margin: '0 0 1.5rem 0' }}>
            Complete your application online in simple guided steps with instant document verification.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => onCheckEligibility(scheme)}
              className="btn btn-secondary"
            >
              Check Eligibility
            </button>
            <button
              onClick={() => onApply(scheme)}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              Apply Online →
            </button>
          </div>
        </div>

        {/* Document Procurement Guidance Modal */}
        {selectedGuideDoc && (
          <DocumentGuidanceModal
            docType={selectedGuideDoc}
            onClose={() => setSelectedGuideDoc(null)}
          />
        )}
      </div>
    </div>
  );
};
