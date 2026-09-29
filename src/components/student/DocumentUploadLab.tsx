import React, { useState } from 'react';
import { StudentDigitalCaseFile } from '../../types';
import { DocumentGuidanceModal } from '../modals/DocumentGuidanceModal';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Eye, 
  RefreshCw,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentUploadLabProps {
  student: StudentDigitalCaseFile;
}

interface DocumentItem {
  id: string;
  name: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  status: 'VERIFIED' | 'NEEDS_ATTENTION';
  issue?: {
    title: string;
    description: string;
    submittedValue: string;
    otherValue: string;
    recommendation: string;
  };
}

export const DocumentUploadLab: React.FC<DocumentUploadLabProps> = ({ student }) => {
  const [selectedGuideDoc, setSelectedGuideDoc] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'ST Category Certificate',
      documentType: 'Caste Certificate',
      fileName: 'Jharkhand_ST_Certificate_Pooja_Munda.pdf',
      fileSize: '1.2 MB',
      status: 'VERIFIED'
    },
    {
      id: 'doc-2',
      name: 'Qualifying Examination Marksheet',
      documentType: 'Academic Marksheet',
      fileName: 'Post_Grad_Final_Marksheet_BHU.pdf',
      fileSize: '2.4 MB',
      status: 'VERIFIED'
    },
    {
      id: 'doc-3',
      name: 'Family Income Certificate',
      documentType: 'Income Certificate',
      fileName: 'Income_Certificate_FY2025_26_JH.pdf',
      fileSize: '890 KB',
      status: 'NEEDS_ATTENTION',
      issue: {
        title: "There's a difference in declared income between your documents.",
        description: 'The income certificate mentions an annual family income of ₹3,20,000, whereas ₹2,20,000 was entered on the application form.',
        submittedValue: '₹2,20,000 / year (Application Form)',
        otherValue: '₹3,20,000 / year (Uploaded Certificate)',
        recommendation: 'Please verify which certificate is current or upload a revised income certificate for Financial Year 2025-26.'
      }
    },
    {
      id: 'doc-4',
      name: 'Identity Proof (Aadhaar)',
      documentType: 'Identity Document',
      fileName: 'Aadhaar_Card_Masked.pdf',
      fileSize: '750 KB',
      status: 'VERIFIED'
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[2]);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceDone, setReplaceDone] = useState(false);

  const handleReplaceDocument = () => {
    if (!selectedDoc) return;
    setIsReplacing(true);

    setTimeout(() => {
      setDocuments(docs => docs.map(d => {
        if (d.id === selectedDoc.id) {
          return {
            ...d,
            status: 'VERIFIED',
            fileName: 'Corrected_Income_Certificate_2025_26.pdf',
            issue: undefined
          };
        }
        return d;
      }));

      setIsReplacing(false);
      setReplaceDone(true);
      setSelectedDoc(null);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    }, 1000);
  };

  const verifiedCount = documents.filter(d => d.status === 'VERIFIED').length;
  const attentionCount = documents.filter(d => d.status === 'NEEDS_ATTENTION').length;

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-green-700)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <FileCheck size={16} />
            Document Verification
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.35rem', fontWeight: 800 }}>
            Document Check
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Review your submitted certificates and documents to ensure all details match and meet verification requirements.
          </p>
        </div>

        {/* Status Summary Pill Banner */}
        <div className="card" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Documents</div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--gov-green-700)' }}>{verifiedCount} of {documents.length}</strong>
              </div>
              {attentionCount > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Needs Attention</div>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--gov-red-600)' }}>{attentionCount} Document</strong>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Applicant: <strong>{student.fullName}</strong>
            </div>
          </div>
        </div>

        {/* Document List & Detail Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
          {/* Document Cards Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const isVerified = doc.status === 'VERIFIED';

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--gov-navy-900)' : isVerified ? '1px solid var(--border-light)' : '1.5px solid var(--gov-red-500)',
                    backgroundColor: isSelected ? 'var(--bg-muted)' : '#ffffff',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FileText size={18} color="var(--gov-navy-800)" />
                      <strong style={{ fontSize: '0.98rem', color: 'var(--gov-navy-950)' }}>
                        {doc.name}
                      </strong>
                    </div>

                    <span className={`badge ${isVerified ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                      {isVerified ? (
                        <>
                          <CheckCircle2 size={12} /> Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={12} /> Needs Attention
                        </>
                      )}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span>{doc.fileName}</span>
                    <span>{doc.fileSize}</span>
                  </div>

                  <div style={{ paddingTop: '0.4rem', borderTop: '1px dashed var(--border-light)' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuideDoc(doc.documentType);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--gov-saffron-700)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      Don't have this document yet? Learn how to obtain it →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Document Inspector / Action Card */}
          <div>
            {selectedDoc ? (
              <div className="card" style={{ padding: '1.75rem', borderRadius: '12px', borderTop: `4px solid ${selectedDoc.status === 'VERIFIED' ? 'var(--gov-green-600)' : 'var(--gov-red-600)'}`, boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 700 }}>
                    {selectedDoc.name}
                  </h3>
                  <span className={`badge ${selectedDoc.status === 'VERIFIED' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedDoc.status === 'VERIFIED' ? 'Verified' : 'Needs Attention'}
                  </span>
                </div>

                {selectedDoc.status === 'VERIFIED' ? (
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--gov-green-50)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--gov-green-600)' }}>
                    <CheckCircle2 size={36} color="var(--gov-green-700)" style={{ margin: '0 auto 0.5rem auto' }} />
                    <h4 style={{ color: 'var(--gov-green-900)', fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                      Document Verified
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--gov-green-800)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                      All parameters on this certificate match your application records and meet scheme eligibility requirements.
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      File: <code>{selectedDoc.fileName}</code>
                    </div>
                  </div>
                ) : (
                  <div>
                    {selectedDoc.issue && (
                      <div style={{ backgroundColor: 'var(--gov-red-50)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--gov-red-600)', marginBottom: '1.5rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--gov-red-700)', fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <AlertTriangle size={16} />
                          {selectedDoc.issue.title}
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {selectedDoc.issue.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Entered in Form:</div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--gov-navy-950)' }}>
                              {selectedDoc.issue.submittedValue}
                            </strong>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Found on Document:</div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--gov-red-600)' }}>
                              {selectedDoc.issue.otherValue}
                            </strong>
                          </div>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {selectedDoc.issue.recommendation}
                        </p>
                      </div>
                    )}

                    <div style={{ border: '2px dashed var(--border-medium)', borderRadius: '10px', padding: '1.75rem', textAlign: 'center', backgroundColor: 'var(--bg-muted)', marginBottom: '1.25rem' }}>
                      <Upload size={32} color="var(--gov-navy-800)" style={{ margin: '0 auto 0.5rem auto' }} />
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
                        Select Updated Certificate (PDF/JPG)
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        File will be securely saved and linked to your case file.
                      </div>
                    </div>

                    <button
                      onClick={handleReplaceDocument}
                      disabled={isReplacing}
                      className="btn btn-saffron btn-lg"
                      style={{ width: '100%', justifyContent: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {isReplacing ? (
                        <>
                          <RefreshCw size={16} className="pulse-dot" />
                          <span>Updating Document...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Replace Document</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Select a document on the left to review details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Guidance Modal */}
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
