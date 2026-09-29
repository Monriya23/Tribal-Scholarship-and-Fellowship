import React, { useState } from 'react';
import { GrievanceTicket, StudentDigitalCaseFile, UserRole } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  HelpCircle, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Landmark,
  ArrowRight,
  MessageSquare,
  FileQuestion
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrievancePortalProps {
  student: StudentDigitalCaseFile;
  activeRole: UserRole;
}

export const GrievancePortal: React.FC<GrievancePortalProps> = ({ student, activeRole }) => {
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(StorageService.getGrievances());
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Form State
  const [category, setCategory] = useState<GrievanceTicket['category']>('DOCUMENT_VERIFICATION');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [applicationId, setApplicationId] = useState('ST-2026-001245');

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: GrievanceTicket = {
      id: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationId: applicationId || undefined,
      applicantMotaId: student.motaLifetimeId,
      applicantName: student.fullName,
      category,
      subject,
      description,
      createdAt: new Date().toISOString(),
      slaDeadlineDays: category === 'PAYMENT_DELAY' ? 5 : 7,
      assignedAuthority: category === 'BANK_NPCI_ERROR' ? 'PFMS_HELPDESK' : category === 'DOCUMENT_VERIFICATION' ? 'INSTITUTION_NODAL' : 'MINISTRY_OF_TRIBAL_AFFAIRS',
      status: 'SUBMITTED',
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: student.fullName,
          action: 'Grievance ticket registered.'
        }
      ]
    };

    StorageService.addGrievance(newTicket);
    StorageService.logActivity({
      actorRole: activeRole,
      actorName: student.fullName,
      ipAddress: '103.110.12.44',
      actionType: 'RESOLVE_GRIEVANCE',
      targetEntityId: newTicket.id,
      entityType: 'GRIEVANCE',
      details: `Created grievance ticket #${newTicket.id} (${category}): ${subject}`
    });

    setGrievances([newTicket, ...grievances]);
    setShowNewTicketForm(false);
    setSubject('');
    setDescription('');

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-saffron-600)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <HelpCircle size={16} />
              Help & Support
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.35rem', fontWeight: 800 }}>
              Need Help?
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              Submit an inquiry or raise an issue regarding your application, documents, or payments.
            </p>
          </div>

          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
          >
            <PlusCircle size={18} />
            {showNewTicketForm ? 'Close Form' : 'Raise a Grievance'}
          </button>
        </div>

        {/* New Ticket Form Card */}
        {showNewTicketForm && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '5px solid var(--gov-saffron-500)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--gov-navy-950)', marginBottom: '1.25rem', fontWeight: 800 }}>
              Raise a Grievance / Inquiry
            </h2>

            <form onSubmit={handleSubmitGrievance}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">What is the issue regarding? <span className="required">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="DOCUMENT_VERIFICATION">Document issue</option>
                    <option value="PAYMENT_DELAY">Payment issue / delay</option>
                    <option value="BANK_NPCI_ERROR">Bank / Aadhaar account issue</option>
                    <option value="DEFICIENCY_DISPUTE">Application issue</option>
                    <option value="RENEWAL_ISSUE">Eligibility question</option>
                    <option value="OTHER">Other question</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Application ID (Optional)</label>
                  <input
                    type="text"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="form-control"
                    placeholder="e.g. ST-2026-001245"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Title <span className="required">*</span></label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Question regarding income certificate renewal"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description <span className="required">*</span></label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  placeholder="Please describe your question or issue in detail..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attach Supporting File (Optional, PDF or JPG)</label>
                <input type="file" className="form-control" />
              </div>

              <button type="submit" className="btn btn-saffron btn-lg" style={{ fontWeight: 700 }}>
                Submit Grievance
              </button>
            </form>
          </div>
        )}

        {/* Existing Grievances List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: '0.5rem 0', fontWeight: 800 }}>
            Your Raised Grievances ({grievances.length})
          </h2>

          {grievances.map((ticket) => (
            <div key={ticket.id} className="card" style={{ padding: '1.75rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-neutral">Ticket #{ticket.id}</span>
                    <span className="badge badge-info">{ticket.category.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: '0.2rem 0', fontWeight: 700 }}>
                    {ticket.subject}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Filed on {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <span className={`badge ${ticket.status === 'RESOLVED' ? 'badge-success' : ticket.status === 'UNDER_REVIEW' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                  {ticket.status === 'RESOLVED' ? 'Resolved' : ticket.status === 'UNDER_REVIEW' ? 'Under Review' : 'Received'}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: '8px', margin: '0.75rem 0' }}>
                {ticket.description}
              </p>

              {ticket.resolutionNotes && (
                <div style={{ backgroundColor: 'var(--gov-green-50)', borderLeft: '4px solid var(--gov-green-600)', padding: '0.85rem 1.15rem', borderRadius: '0 8px 8px 0', fontSize: '0.88rem', color: 'var(--gov-green-900)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                  <strong>Resolution: </strong>
                  {ticket.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
