import React from 'react';
import { UserRole } from '../../types';
import { NavTabId } from '../common/Navigation';
import { 
  Users, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface PersonaQuickLaunchProps {
  onSelectPersona: (role: UserRole, studentId?: string, targetTab?: NavTabId) => void;
}

export const PersonaQuickLaunch: React.FC<PersonaQuickLaunchProps> = ({ onSelectPersona }) => {
  const personas = [
    {
      role: 'applicant' as UserRole,
      studentId: 'ST-CASE-2026-JH-88341',
      targetTab: 'student_dashboard' as NavTabId,
      name: 'Pooja Munda',
      roleTitle: 'Student Portal',
      badge: 'Ph.D Research Scholar • NFST',
      badgeColor: 'var(--gov-green-600)',
      icon: Users,
      description: 'Manage active fellowship, track verification timeline, submit quarterly reports, and check DBT payments.'
    },
    {
      role: 'institution' as UserRole,
      targetTab: 'institution_dashboard' as NavTabId,
      name: 'NIT Raipur Desk',
      roleTitle: 'Institution Nodal Officer',
      badge: 'AISHE Verified Portal',
      badgeColor: '#0284c7',
      icon: Building2,
      description: 'Verify enrolled ST students, review submitted certificates, and issue deficiency requests in plain language.'
    },
    {
      role: 'state_officer' as UserRole,
      targetTab: 'state_dashboard' as NavTabId,
      name: 'Jharkhand State Nodal Cell',
      roleTitle: 'State Tribal Welfare Officer',
      badge: 'State Directorate',
      badgeColor: 'var(--gov-saffron-600)',
      icon: Landmark,
      description: 'Monitor district-wise scholarship allocations, track fund utilization, and review institute verification queues.'
    },
    {
      role: 'ministry_admin' as UserRole,
      targetTab: 'ministry_dashboard' as NavTabId,
      name: 'National MoTA Desk',
      roleTitle: 'Ministry / Policy Admin',
      badge: 'Govt of India Admin',
      badgeColor: 'var(--gov-navy-800)',
      icon: ShieldCheck,
      description: 'Review national scholarship statistics, configure scheme criteria, and inspect the immutable audit log.'
    },
    {
      role: 'expert_reviewer' as UserRole,
      targetTab: 'reviewer_dashboard' as NavTabId,
      name: 'Selection Committee',
      roleTitle: 'Expert Selection Panel',
      badge: 'Merit Assessment Panel',
      badgeColor: '#7c3aed',
      icon: Sparkles,
      description: 'Score research proposals, evaluate overseas university rankings, and submit selection recommendations.'
    }
  ];

  return (
    <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gov-navy-800)', textTransform: 'uppercase' }}>
            Stakeholder Desks
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0.5rem 0' }}>
            Dedicated Portals for Every Participant
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Switch between student, institution, state, ministry, and committee views to experience the platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="card"
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${p.badgeColor}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: p.badgeColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                        {p.roleTitle}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.name}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {p.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectPersona(p.role, p.studentId, p.targetTab)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                >
                  Enter {p.roleTitle} <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
