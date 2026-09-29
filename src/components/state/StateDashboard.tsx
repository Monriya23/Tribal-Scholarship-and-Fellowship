import React, { useState } from 'react';
import { MOCK_STATES, StateQuotaRecord } from '../../data/mockStates';
import { ApplicationRecord } from '../../types';
import { NavTabId } from '../common/Navigation';
import { 
  Landmark, 
  Building2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface StateDashboardProps {
  applications: ApplicationRecord[];
  onNavigate: (tab: NavTabId) => void;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({ applications, onNavigate }) => {
  const [selectedState, setSelectedState] = useState<StateQuotaRecord>(MOCK_STATES[0]); // Jharkhand

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header Capsule */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', borderLeft: '5px solid var(--gov-saffron-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-warning">State Nodal Cell</span>
                <span className="badge badge-neutral">{selectedState.stateName}</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                {selectedState.nodalDepartment}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                Centrally Sponsored Scheme Coordination & District Bottleneck Monitoring • FY 2025-26
              </p>
            </div>

            {/* State Picker */}
            <div style={{ minWidth: '200px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Select State / UT</label>
              <select
                value={selectedState.stateCode}
                onChange={(e) => {
                  const st = MOCK_STATES.find(s => s.stateCode === e.target.value);
                  if (st) setSelectedState(st);
                }}
                className="form-control"
                style={{ fontWeight: 600 }}
              >
                {MOCK_STATES.map((s) => (
                  <option key={s.stateCode} value={s.stateCode}>
                    {s.stateName} ({s.stateCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* State KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Applications (State)</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-navy-950)', marginTop: '0.25rem' }}>
              {selectedState.totalApplications.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Post-Matric & Pre-Matric</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gov-saffron-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gov-saffron-600)', fontWeight: 600 }}>State Pending Verification</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-saffron-600)', marginTop: '0.25rem' }}>
              {selectedState.statePendingVerification.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{selectedState.criticalDelaysCount} cases &gt; 15 days delay</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gov-green-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-700)', fontWeight: 600 }}>Central Share Disbursed</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gov-green-700)', marginTop: '0.25rem' }}>
              ₹{selectedState.centralShareDisbursedCr} Cr
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sanctioned: ₹{selectedState.centralShareSanctionedCr} Cr</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>Utilization Certificate (UC)</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284c7', marginTop: '0.25rem' }}>
              {selectedState.ucSubmittedPercent}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Submitted to MoTA PAO</div>
          </div>
        </div>

        {/* Bottleneck Radar & Proposals Action Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Bottleneck Radar */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--gov-red-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color="var(--gov-red-600)" />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  District & Institution Bottleneck Radar
                </h3>
              </div>
              <span className="badge badge-danger">{selectedState.criticalDelaysCount} Critical Delays</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Average State Processing Time: <strong style={{ color: 'var(--gov-navy-950)' }}>{selectedState.averageProcessingDays} days</strong> (SLA Target: 10.0 days).
            </p>

            <div style={{ backgroundColor: 'var(--gov-red-50)', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--gov-red-800)', display: 'block', marginBottom: '0.25rem' }}>
                ⚠ Hotspot Alert: Ranchi & Bastar Nodal Desks
              </strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--gov-red-700)' }}>
                312 applications pending &gt; 15 days at institution verification level. Automated SMS reminders dispatched to college nodal officers.
              </div>
            </div>

            <button 
              onClick={() => onNavigate('state_verification')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Open State Verification Scrutiny Desk</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Central-State Proposals & UC Management */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--gov-navy-900)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={18} color="var(--gov-navy-900)" />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  Proposals, SOE & UC Management
                </h3>
              </div>
              <span className="badge badge-success">75:25 Matching Share</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {selectedState.proposals.map((prop) => (
                <div key={prop.proposalId} style={{ padding: '0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--gov-navy-950)' }}>
                      {prop.schemeCode} ({prop.financialYear})
                    </strong>
                    <span className="badge badge-success">{prop.status}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Central Demand: <strong>₹{prop.centralDemandCr} Cr</strong> • State Share: <strong>₹{prop.stateShareCommittedCr} Cr</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    UC Status: {prop.ucStatus} • Submitted: {prop.submissionDate}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('state_proposals_uc')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Manage State SOE / UC Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
