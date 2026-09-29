import React from 'react';
import { ApplicationRecord, StudentDigitalCaseFile } from '../../types';
import { StageBadge } from '../common/StageBadge';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  Landmark,
  Check
} from 'lucide-react';

interface PaymentTrackerProps {
  student: StudentDigitalCaseFile;
  applications: ApplicationRecord[];
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({ student, applications }) => {
  const paidApps = applications.filter(a => a.paymentInfo);
  const activePaymentApp = paidApps[0] || applications[0];

  const paymentInfo = activePaymentApp?.paymentInfo || {
    sanctionedAmount: 265000,
    monthlyDisbursementAmount: 3000,
    paymentStatus: 'DBT_PROCESSING' as const,
    sanctionDate: '2026-09-18T10:30:00Z',
    pfmsBillNumber: 'PFMS/MOTA/2026/99412',
    pfmsBillDate: '2026-09-24T14:15:00Z',
    treasuryTokenNumber: 'TRZ-2026-904128',
    bankUtrNumber: 'Pending Bank Push',
    actionRequired: 'None. Electronic transfer in progress to Aadhaar-seeded account.'
  };

  const paymentSteps = [
    {
      title: '1. Sanction Order Approved',
      status: 'COMPLETED',
      date: paymentInfo.sanctionDate ? new Date(paymentInfo.sanctionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '18 Sep 2026',
      details: `Sanction order authorized for ₹${paymentInfo.sanctionedAmount.toLocaleString('en-IN')} by Ministry of Tribal Affairs.`
    },
    {
      title: '2. Payment Bill Generated',
      status: 'COMPLETED',
      date: paymentInfo.pfmsBillDate ? new Date(paymentInfo.pfmsBillDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '24 Sep 2026',
      details: 'Electronic disbursement mandate generated through Central Payment System.'
    },
    {
      title: '3. Treasury Clearance Issued',
      status: 'COMPLETED',
      date: '25 Sep 2026',
      details: 'Funds authorized at Pay & Accounts Office for electronic transfer.'
    },
    {
      title: '4. Bank Transfer in Progress (Aadhaar Bridge)',
      status: paymentInfo.paymentStatus === 'CREDITED' ? 'COMPLETED' : 'IN_PROGRESS',
      date: 'In Progress',
      details: `Direct electronic transfer being routed to your Aadhaar-linked account at ${student.bankDetails.bankName}.`
    },
    {
      title: '5. Credited to Your Bank Account',
      status: paymentInfo.paymentStatus === 'CREDITED' ? 'COMPLETED' : 'PENDING',
      date: paymentInfo.disbursedDate ? new Date(paymentInfo.disbursedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Expected within 2-3 business days',
      details: paymentInfo.bankUtrNumber ? `UTR Reference: ${paymentInfo.bankUtrNumber}` : 'You will receive an SMS notification once the amount is credited.'
    }
  ];

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-green-700)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <CreditCard size={16} />
              Direct Benefit Transfer (DBT) Tracker
            </div>
            <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 600 }}>
              [SANDBOX / DEMO] Simulated Payment Environment — No Live PFMS Transaction
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', marginTop: '0.35rem', marginBottom: '0.35rem', fontWeight: 800 }}>
            Track Scholarship Payments
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Scholarship and fellowship funds are transferred directly into your Aadhaar-linked bank account without any intermediaries. (PFMS Integration-Ready Architecture).
          </p>
        </div>

        {/* Bank Account Status Banner */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff', borderLeft: '6px solid var(--gov-green-600)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Aadhaar-Linked Bank Account
              </div>
              <strong style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', display: 'block', marginTop: '0.2rem' }}>
                {student.bankDetails.bankName}
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Account: <code>{student.bankDetails.accountNumberMasked}</code> • IFSC: <code>{student.bankDetails.ifscCode}</code> • Name: <strong>{student.bankDetails.accountHolderName}</strong>
              </div>
            </div>

            <div>
              <span className="badge badge-success" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <CheckCircle2 size={14} />
                Aadhaar Seeding: Active & Ready
              </span>
            </div>
          </div>
        </div>

        {/* Payment Tracking Timeline */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: 0, fontWeight: 800 }}>
                Payment Progress ({activePaymentApp.schemeCode})
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Sanctioned Amount: <strong className="tabular-nums" style={{ color: 'var(--gov-green-700)', fontSize: '1.05rem' }}>₹{paymentInfo.sanctionedAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <span className="badge badge-warning" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              Transfer in Progress
            </span>
          </div>

          {/* Stepper Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {paymentSteps.map((step, idx) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';

              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.15rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: isInProgress ? 'var(--gov-saffron-50)' : isCompleted ? '#ffffff' : 'var(--bg-muted)',
                    border: isInProgress ? '1.5px solid var(--gov-saffron-500)' : '1px solid var(--border-light)',
                    boxShadow: isInProgress ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--gov-green-600)' : isInProgress ? 'var(--gov-saffron-500)' : 'var(--border-medium)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
                        {step.title}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: isCompleted ? 'var(--gov-green-700)' : isInProgress ? 'var(--gov-saffron-600)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {step.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      {step.details}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Helpful Guidance Card */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={18} color="var(--gov-navy-900)" />
            <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
              Important information regarding bank accounts
            </strong>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Direct Benefit Transfer (DBT) requires your bank account to be linked with your Aadhaar number. Please ensure your account remains active and has no maximum balance restrictions or dormant status.
          </p>
        </div>
      </div>
    </div>
  );
};
