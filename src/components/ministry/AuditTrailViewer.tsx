import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  User, 
  Layers, 
  Lock, 
  FileText, 
  Filter 
} from 'lucide-react';

export const AuditTrailViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(StorageService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.targetEntityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'ALL' || l.actionType === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-navy-900)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <ShieldCheck size={14} />
            Governance & Compliance
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', marginTop: '0.25rem', margin: 0 }}>
            Immutable System Activity Audit Trail
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Every view, AI document scan, rule evaluation, deficiency issuance, approval, and sanction is cryptographically timestamped and logged.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by actor name, entity ID (e.g. ST-2026-001245), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'RULE_EVALUATION', 'RAISE_DEFICIENCY', 'APPROVE_APPLICATION', 'SANCTION_GENERATE'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`btn btn-sm ${filterAction === act ? 'btn-primary' : 'btn-secondary'}`}
              >
                {act.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-navy-950)', margin: 0 }}>
              Audit Events Record ({filteredLogs.length})
            </h3>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Lock size={10} /> Immutable Log
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor / Desk</th>
                  <th>Action Type</th>
                  <th>Target Entity</th>
                  <th>Details & IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gov-navy-950)', fontSize: '0.85rem' }}>
                        {log.actorName}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${log.actionType.includes('APPROVE') || log.actionType.includes('SANCTION') ? 'badge-success' : log.actionType.includes('DEFICIENCY') ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                        {log.actionType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <code>{log.targetEntityId}</code>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div>{log.details}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>IP: {log.ipAddress}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
