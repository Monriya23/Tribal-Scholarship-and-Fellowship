import React from 'react';
import { ApplicationStage, VerificationStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Cpu, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Award, 
  CreditCard, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface StageBadgeProps {
  stage: ApplicationStage | VerificationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, size = 'md', showIcon = true }) => {
  let badgeClass = 'badge-neutral';
  let label = stage.replace(/_/g, ' ');
  let IconComponent = Clock;

  switch (stage) {
    case 'REGISTRATION':
      badgeClass = 'badge-info';
      label = 'Registration';
      IconComponent = FileText;
      break;
    case 'APPLICATION':
      badgeClass = 'badge-info';
      label = 'Application Draft';
      IconComponent = FileText;
      break;
    case 'DOCUMENT_SUBMISSION':
      badgeClass = 'badge-info';
      label = 'Doc Submission';
      IconComponent = FileText;
      break;
    case 'AI_PRECHECK':
      badgeClass = 'badge-info';
      label = 'AI Pre-Check';
      IconComponent = Cpu;
      break;
    case 'ELIGIBILITY_CHECK':
      badgeClass = 'badge-info';
      label = 'Rule Evaluation';
      IconComponent = ShieldCheck;
      break;
    case 'INSTITUTION_VERIFICATION':
      badgeClass = 'badge-warning';
      label = 'Institution Review';
      IconComponent = Building2;
      break;
    case 'STATE_VERIFICATION':
      badgeClass = 'badge-warning';
      label = 'State Verification';
      IconComponent = Landmark;
      break;
    case 'MINISTRY_SCRUTINY':
      badgeClass = 'badge-warning';
      label = 'Ministry Scrutiny';
      IconComponent = Landmark;
      break;
    case 'SCREENING':
      badgeClass = 'badge-info';
      label = 'Screening & Merit';
      IconComponent = Sparkles;
      break;
    case 'SELECTION':
      badgeClass = 'badge-success';
      label = 'Selected';
      IconComponent = Award;
      break;
    case 'SANCTION_AWARD':
      badgeClass = 'badge-success';
      label = 'Sanction Issued';
      IconComponent = Award;
      break;
    case 'DBT_PFMS_DISBURSEMENT':
      badgeClass = 'badge-info';
      label = 'DBT / PFMS Payment';
      IconComponent = CreditCard;
      break;
    case 'POST_SELECTION':
      badgeClass = 'badge-success';
      label = 'Fellowship Active';
      IconComponent = Award;
      break;
    case 'COMPLETED':
      badgeClass = 'badge-success';
      label = 'Completed';
      IconComponent = CheckCircle2;
      break;
    case 'DEFICIENT':
    case 'AWAITING_APPLICANT':
      badgeClass = 'badge-danger';
      label = 'Deficiency Action Required';
      IconComponent = AlertTriangle;
      break;
    case 'REJECTED':
      badgeClass = 'badge-danger';
      label = 'Rejected';
      IconComponent = XCircle;
      break;
    case 'PASSED':
      badgeClass = 'badge-success';
      label = 'Verified / Passed';
      IconComponent = CheckCircle2;
      break;
    case 'REVIEW_REQUIRED':
      badgeClass = 'badge-warning';
      label = 'Review Required';
      IconComponent = AlertTriangle;
      break;
    case 'FAILED':
      badgeClass = 'badge-danger';
      label = 'Failed';
      IconComponent = XCircle;
      break;
    case 'RESUBMITTED':
      badgeClass = 'badge-info';
      label = 'Resubmitted';
      IconComponent = RotateCcw;
      break;
    default:
      badgeClass = 'badge-neutral';
      break;
  }

  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.45rem' } : size === 'lg' ? { fontSize: '0.85rem', padding: '0.35rem 0.85rem' } : {};

  return (
    <span className={`badge ${badgeClass}`} style={sizeStyle}>
      {showIcon && <IconComponent size={size === 'sm' ? 12 : 14} style={{ marginRight: 2 }} />}
      {label}
    </span>
  );
};
