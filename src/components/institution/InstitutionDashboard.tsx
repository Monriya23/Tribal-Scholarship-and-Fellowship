import React, { useState } from 'react';
import { ApplicationRecord } from '../../types';
import { MOCK_INSTITUTIONS } from '../../data/mockInstitutes';
import { StageBadge } from '../common/StageBadge';
import { NavTabId } from '../common/Navigation';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Cpu, 
  Search, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

interface InstitutionDashboardProps {
  applications: ApplicationRecord[];
  onOpenDossier: (app: ApplicationRecord) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  applications,
  onOpenDossier,
  onNavigate
}) => {
  const currentInst = MOCK_INSTITUTIONS[1]; // NIT Raipur
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(a => {
    const matchesSearch = a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.schemeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'ALL' || a.currentStage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', borderLeft: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-info">AISHE: {currentInst.aisheCode}</span>
                <span className="badge badge-neutral">Nodal Officer Desk</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                {currentInst.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Nodal Officer: <strong>{currentInst.nodalOfficerName}</strong> • {currentInst.nodalOfficerEmail} • {currentInst.district}, {currentInst.state}
              </div>
            </div>

            <button 
              onClick={() => onNavigate('institution_analytics')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <TrendingUp size={16} />
              View Turnaround Analytics
            </button>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applications Received</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {currentInst.applicationsReceived}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Session 2025-26</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gov-saffron-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gov-saffron-600)', fontWeight: 600 }}>Pending Verification</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-saffron-600)', marginTop: '0.25rem' }}>
              {currentInst.pendingCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>4 cases &gt; 5 days</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gov-red-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gov-red-600)', fontWeight: 600 }}>Deficient Applications</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-red-600)', marginTop: '0.25rem' }}>
              {currentInst.deficientCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Awaiting Student Resubmission</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gov-green-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-700)', fontWeight: 600 }}>Completed & Forwarded</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>
              {currentInst.verifiedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Avg Turnaround: {currentInst.averageTurnaroundDays} days</div>
          </div>
        </div>

        {/* Verification Queue Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                Applicant Scrutiny Queue
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Open applicant dossier for side-by-side AI extraction and deterministic rule evaluation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setFilterStage('ALL')}
                className={`btn btn-sm ${filterStage === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All Cases
              </button>
              <button 
                onClick={() => setFilterStage('INSTITUTION_VERIFICATION')}
                className={`btn btn-sm ${filterStage === 'INSTITUTION_VERIFICATION' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Action Needed (Pending)
              </button>
              <button 
                onClick={() => setFilterStage('DEFICIENT')}
                className={`btn btn-sm ${filterStage === 'DEFICIENT' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Deficient
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Scheme</th>
                  <th>Course</th>
                  <th>AI Confidence</th>
                  <th>Current Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const hasDiscrepancy = app.aiOverallConfidence < 92;
                  return (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.id}</strong>
                        {app.isRenewal && (
                          <span className="badge badge-info" style={{ fontSize: '0.6rem', marginLeft: '0.35rem' }}>Renewal</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gov-navy-950)' }}>
                          {app.applicantName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {app.applicantTribe} Tribe • {app.district}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{app.schemeCode}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {app.courseName}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="tabular-nums" style={{ fontWeight: 700, color: hasDiscrepancy ? 'var(--gov-amber-600)' : 'var(--gov-green-700)' }}>
                            {app.aiOverallConfidence}%
                          </span>
                          {hasDiscrepancy && (
                            <span title="Discrepancy Detected - Review Required">
                              <AlertTriangle size={14} color="var(--gov-amber-600)" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <StageBadge stage={app.currentStage} size="sm" />
                      </td>
                      <td>
                        <button
                          onClick={() => onOpenDossier(app)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Cpu size={14} />
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
