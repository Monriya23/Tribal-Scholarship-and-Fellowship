import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, 
  Compass, 
  FileText, 
  FolderCheck, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Award, 
  HelpCircle, 
  Building2, 
  Landmark, 
  BarChart3, 
  Sliders, 
  ShieldAlert, 
  Sparkles, 
  FileCheck2, 
  Cpu, 
  BookOpen 
} from 'lucide-react';

export type NavTabId =
  | 'landing'
  | 'scholarships'
  | 'fellowships'
  | 'about'
  | 'help'
  | 'scheme_detail'
  | 'onboarding'
  | 'personalized_schemes'
  | 'student_dashboard'
  | 'digital_case_file'
  | 'scheme_discovery'
  | 'dynamic_form'
  | 'ai_document_sandbox'
  | 'application_timeline'
  | 'deficiency_center'
  | 'payment_tracker'
  | 'fellowship_lifecycle'
  | 'grievance_portal'
  | 'institution_dashboard'
  | 'institution_dossier'
  | 'institution_analytics'
  | 'state_dashboard'
  | 'state_verification'
  | 'state_bottlenecks'
  | 'state_proposals_uc'
  | 'ministry_dashboard'
  | 'scheme_builder'
  | 'screening_selection'
  | 'process_bottlenecks'
  | 'payment_reconciliation'
  | 'audit_trail'
  | 'source_status'
  | 'reviewer_dashboard'
  | 'candidate_comparison';

interface NavigationProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  activeRole: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, activeRole }) => {
  const getNavItems = () => {
    // 1. Authenticated Student Desk
    if (activeRole === 'applicant') {
      return [
        { id: 'student_dashboard' as NavTabId, label: 'Dashboard Overview', icon: BarChart3 },
        { id: 'dynamic_form' as NavTabId, label: 'Apply Online', icon: FileText },
        { id: 'application_timeline' as NavTabId, label: 'Track Applications', icon: Clock },
        { id: 'deficiency_center' as NavTabId, label: 'Action Required', icon: AlertTriangle },
        { id: 'ai_document_sandbox' as NavTabId, label: 'Document Lab', icon: FileCheck2 },
        { id: 'payment_tracker' as NavTabId, label: 'DBT Payment Tracker', icon: CreditCard },
        { id: 'fellowship_lifecycle' as NavTabId, label: 'Fellowship Lifecycle', icon: Award },
        { id: 'grievance_portal' as NavTabId, label: 'Helpdesk & Grievance', icon: HelpCircle }
      ];
    }

    // 2. Institution Nodal Officer Desk
    if (activeRole === 'institution') {
      return [
        { id: 'institution_dashboard' as NavTabId, label: 'Verification Queue', icon: Building2 },
        { id: 'institution_dossier' as NavTabId, label: 'Scrutiny Dossier', icon: FileCheck2 },
        { id: 'ai_document_sandbox' as NavTabId, label: 'Document Inspector', icon: FolderCheck },
        { id: 'grievance_portal' as NavTabId, label: 'Assigned Inquiries', icon: HelpCircle }
      ];
    }

    // 3. State Tribal Welfare Directorate
    if (activeRole === 'state_officer') {
      return [
        { id: 'state_dashboard' as NavTabId, label: 'State Directorate Overview', icon: Landmark },
        { id: 'state_verification' as NavTabId, label: 'Verification Pipeline', icon: FileCheck2 },
        { id: 'grievance_portal' as NavTabId, label: 'State Helpdesk', icon: HelpCircle }
      ];
    }

    // 4. Ministry National Command & Policy Desk
    if (activeRole === 'ministry_admin') {
      return [
        { id: 'ministry_dashboard' as NavTabId, label: 'National Overview', icon: BarChart3 },
        { id: 'scheme_builder' as NavTabId, label: 'Scheme & Policy Rules', icon: Sliders },
        { id: 'source_status' as NavTabId, label: 'Official Sources & Sync', icon: Cpu },
        { id: 'audit_trail' as NavTabId, label: 'Audit Trail', icon: ShieldAlert },
        { id: 'grievance_portal' as NavTabId, label: 'National Helpdesk', icon: HelpCircle }
      ];
    }

    // 5. Selection Committee / Expert Reviewer
    if (activeRole === 'expert_reviewer') {
      return [
        { id: 'reviewer_dashboard' as NavTabId, label: 'Assigned Fellowships', icon: Award },
        { id: 'candidate_comparison' as NavTabId, label: 'Candidate Evaluation', icon: Sparkles }
      ];
    }

    return [{ id: 'landing' as NavTabId, label: 'Home', icon: Home }];
  };

  const navItems = getNavItems();

  return (
    <nav style={{ backgroundColor: 'var(--primary-navy)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="container" style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0 1rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.75rem 1rem',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.78)',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--accent-saffron)' : '3px solid transparent',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.78)';
              }}
            >
              <Icon size={15} color={isActive ? 'var(--accent-saffron)' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
