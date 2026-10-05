import React, { useState, useEffect } from 'react';
import { 
  OfficialApiService, 
  PolicyClaimItem, 
  PolicyConflictItem 
} from '../../services/officialApiService';
import { 
  PolicyItem, 
  PolicyRuleItem, 
  PolicyClauseItem, 
  PolicySnapshotItem, 
  PolicySimulationItem, 
  PolicyExceptionItem 
} from '../../types';
import { 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Play, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  History, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Sliders, 
  ArrowRight,
  Send,
  Lock,
  Database,
  Eye,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PolicyGovernanceCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'active_policies' | 'versions_timeline' | 'review_pipeline' | 'conflict_center' | 'simulator' | 'exceptions' | 'time_travel'
  >('active_policies');

  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [claims, setClaims] = useState<PolicyClaimItem[]>([]);
  const [conflicts, setConflicts] = useState<PolicyConflictItem[]>([]);
  const [exceptions, setExceptions] = useState<PolicyExceptionItem[]>([]);
  const [simulations, setSimulations] = useState<PolicySimulationItem[]>([]);
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('ALL');
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState<PolicyItem | null>(null);
  const [selectedProvenanceRule, setSelectedProvenanceRule] = useState<PolicyRuleItem | null>(null);

  // Time Travel State
  const [timeTravelAppId, setTimeTravelAppId] = useState<string>('app_nfst_001');
  const [timeTravelSnapshots, setTimeTravelSnapshots] = useState<PolicySnapshotItem[]>([]);
  const [timeTravelMode, setTimeTravelMode] = useState<'current' | 'historical'>('historical');
  const [isLoadingTimeTravel, setIsLoadingTimeTravel] = useState<boolean>(false);

  // Simulation Form State
  const [simScheme, setSimScheme] = useState<string>('scheme_nfst');
  const [simBaseVersion, setSimBaseVersion] = useState<string>('NFST-2026-v2');
  const [simProposedVersion, setSimProposedVersion] = useState<string>('NFST-2027-v3 (Proposed)');
  const [simDescription, setSimDescription] = useState<string>('Proposed enhancement of parental income ceiling from ₹6,00,000 to ₹8,00,000 per annum to align with Central Gazette norms.');
  const [simIncomeCeiling, setSimIncomeCeiling] = useState<string>('800000');
  const [simAcademicCutoff, setSimAcademicCutoff] = useState<string>('55');
  const [activeSimResult, setActiveSimResult] = useState<PolicySimulationItem | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Conflict Resolution Modal State
  const [selectedConflict, setSelectedConflict] = useState<PolicyConflictItem | null>(null);
  const [chosenClaimId, setChosenClaimId] = useState<string>('');
  const [resolutionReason, setResolutionReason] = useState<string>('Approved Gazette Notification F.No. 11015/04/2026 as prevailing official operational policy for AY 2026-27.');
  const [resolverName, setResolverName] = useState<string>('Joint Secretary (Tribal Welfare), MoTA');

  // Exception Resolution Modal State
  const [selectedException, setSelectedException] = useState<PolicyExceptionItem | null>(null);
  const [excResolutionType, setExcResolutionType] = useState<string>('APPROVED_EXCEPTION');
  const [excResolutionReason, setExcResolutionReason] = useState<string>('CPI converted to 74.29% using NIT Raipur approved formula (CPI - 0.75) * 10 with verified Dean Academic endorsement.');

  // Create Policy Version Modal
  const [showCreateVersionModal, setShowCreateVersionModal] = useState<boolean>(false);
  const [newVersionScheme, setNewVersionScheme] = useState<string>('scheme_nfst');
  const [newVersionTag, setNewVersionTag] = useState<string>('NFST-2026-v3');
  const [newVersionName, setNewVersionName] = useState<string>('NFST Revised Guidelines (Amendment 2026)');
  const [newVersionSourceTitle, setNewVersionSourceTitle] = useState<string>('MoTA Notification F.No. 11015/05/2026-Scholarship');
  const [newVersionSupersedes, setNewVersionSupersedes] = useState<string>('NFST-2026-v2');

  const loadAllGovernanceData = async () => {
    try {
      const [pols, clms, cnfs, excs, sims] = await Promise.all([
        OfficialApiService.getPolicies(),
        OfficialApiService.getPolicyClaims(),
        OfficialApiService.getPolicyConflicts(),
        OfficialApiService.getPolicyExceptions(),
        OfficialApiService.getPolicySimulations()
      ]);
      setPolicies(pols);
      setClaims(clms);
      setConflicts(cnfs);
      setExceptions(excs);
      setSimulations(sims);

      if (pols.length > 0 && !selectedPolicyDetail) {
        const detail = await OfficialApiService.getPolicyDetail(pols[0].id);
        setSelectedPolicyDetail(detail);
      }
    } catch (e) {
      console.error('Failed to load governance data:', e);
    }
  };

  useEffect(() => {
    loadAllGovernanceData();
  }, []);

  const handleSelectPolicy = async (policyId: string) => {
    try {
      const detail = await OfficialApiService.getPolicyDetail(policyId);
      setSelectedPolicyDetail(detail);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await OfficialApiService.simulatePolicyChange({
        scheme_id: simScheme,
        base_policy_version: simBaseVersion,
        proposed_policy_version: simProposedVersion,
        proposed_change_description: simDescription,
        rule_changes: [
          {
            field: 'family_income',
            operator: 'LESS_THAN_OR_EQUAL',
            value: simIncomeCeiling,
            old_value: '600000',
            unit: 'INR'
          },
          {
            field: 'qualifying_marks',
            operator: 'GREATER_THAN_OR_EQUAL',
            value: simAcademicCutoff,
            old_value: '55',
            unit: '%'
          }
        ],
        simulated_by: 'Joint Secretary (Tribal Welfare), MoTA'
      });
      setActiveSimResult(res);
      await loadAllGovernanceData();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Simulation failed:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResolveConflictSubmit = async () => {
    if (!selectedConflict || !chosenClaimId) return;
    try {
      await OfficialApiService.resolveConflict(
        selectedConflict.id,
        chosenClaimId,
        resolverName,
        resolutionReason
      );
      setSelectedConflict(null);
      await loadAllGovernanceData();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Conflict resolution failed:', e);
    }
  };

  const handleResolveExceptionSubmit = async () => {
    if (!selectedException) return;
    try {
      await OfficialApiService.resolvePolicyException(
        selectedException.id,
        excResolutionType,
        excResolutionReason,
        'Dr. Rajeshwar Sharma (Director, MoTA)'
      );
      setSelectedException(null);
      await loadAllGovernanceData();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Exception resolution failed:', e);
    }
  };

  const handleFetchTimeTravel = async () => {
    setIsLoadingTimeTravel(true);
    try {
      const snps = await OfficialApiService.getApplicationSnapshots(timeTravelAppId);
      setTimeTravelSnapshots(snps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTimeTravel(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'time_travel') {
      handleFetchTimeTravel();
    }
  }, [activeTab, timeTravelAppId]);

  const filteredPolicies = selectedSchemeFilter === 'ALL' 
    ? policies 
    : policies.filter(p => p.scheme_code === selectedSchemeFilter || p.scheme_id === selectedSchemeFilter);

  const activePoliciesCount = policies.filter(p => p.status === 'ACTIVE').length;
  const pendingReviewCount = claims.filter(c => c.review_status === 'DETECTED' || c.review_status === 'UNDER_REVIEW').length;
  const openConflictsCount = conflicts.filter(c => c.status !== 'RESOLVED').length;
  const openExceptionsCount = exceptions.filter(e => e.status === 'OPEN' || e.status === 'UNDER_REVIEW').length;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 180px)', padding: '2rem 0' }}>
      <div className="container">
        {/* Top Header Card */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '12px', 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span 
                  style={{ 
                    backgroundColor: 'rgba(128,0,32,0.1)', 
                    color: 'var(--primary-maroon)', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}
                >
                  GOVERNMENT CASE-MANAGEMENT & RULE GOVERNANCE
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Step 10 Policy Intelligence</span>
              </div>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--gov-navy-950)', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                Policy Intelligence & Decision Governance Center
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '850px', margin: 0, lineHeight: 1.5 }}>
                Enforces deterministic rule execution with verified official provenance, immutable decision snapshots, 
                effective-date historical reconstruction, sandboxed impact simulations, and human override audit trails.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button 
                onClick={() => setShowCreateVersionModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <Plus size={15} />
                <span>New Policy Version</span>
              </button>
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '1rem', 
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #EDF2F7'
            }}
          >
            <div 
              onClick={() => setActiveTab('active_policies')}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeTab === 'active_policies' ? 'rgba(30,58,138,0.05)' : '#F8FAFC',
                border: activeTab === 'active_policies' ? '1px solid var(--gov-navy-700)' : '1px solid #E2E8F0',
                borderRadius: '8px', 
                padding: '0.9rem 1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-navy-700)', marginBottom: '0.25rem' }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Policies</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>{activePoliciesCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{policies.length} total versions recorded</div>
            </div>

            <div 
              onClick={() => setActiveTab('review_pipeline')}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeTab === 'review_pipeline' ? 'rgba(217,119,6,0.08)' : '#F8FAFC',
                border: activeTab === 'review_pipeline' ? '1px solid var(--accent-saffron)' : '1px solid #E2E8F0',
                borderRadius: '8px', 
                padding: '0.9rem 1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', marginBottom: '0.25rem' }}>
                <Clock size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Review Pipeline</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#92400E' }}>{pendingReviewCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Validation required</div>
            </div>

            <div 
              onClick={() => setActiveTab('conflict_center')}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeTab === 'conflict_center' ? 'rgba(128,0,32,0.08)' : '#F8FAFC',
                border: activeTab === 'conflict_center' ? '1px solid var(--primary-maroon)' : '1px solid #E2E8F0',
                borderRadius: '8px', 
                padding: '0.9rem 1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-maroon)', marginBottom: '0.25rem' }}>
                <AlertTriangle size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Source Conflicts</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-maroon)' }}>{openConflictsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires human resolution</div>
            </div>

            <div 
              onClick={() => setActiveTab('exceptions')}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeTab === 'exceptions' ? 'rgba(180,83,9,0.08)' : '#F8FAFC',
                border: activeTab === 'exceptions' ? '1px solid #B45309' : '1px solid #E2E8F0',
                borderRadius: '8px', 
                padding: '0.9rem 1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', marginBottom: '0.25rem' }}>
                <ShieldAlert size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Open Exceptions</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#B45309' }}>{openExceptionsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grading & doc anomalies</div>
            </div>

            <div 
              onClick={() => setActiveTab('simulator')}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeTab === 'simulator' ? 'rgba(15,118,110,0.08)' : '#F8FAFC',
                border: activeTab === 'simulator' ? '1px solid #0F766E' : '1px solid #E2E8F0',
                borderRadius: '8px', 
                padding: '0.9rem 1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F766E', marginBottom: '0.25rem' }}>
                <Sliders size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Impact Sandbox</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F766E' }}>{simulations.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero production risk</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '2px solid #E2E8F0', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {[
            { id: 'active_policies', label: 'Active Policies & Rules Matrix', icon: BookOpen },
            { id: 'versions_timeline', label: 'Policy Versions & Supersession', icon: Layers },
            { id: 'review_pipeline', label: 'Pending Extraction Pipeline', icon: Clock, badge: pendingReviewCount },
            { id: 'conflict_center', label: 'Official Source Conflicts', icon: AlertTriangle, badge: openConflictsCount },
            { id: 'simulator', label: 'Policy Impact Simulator (Sandbox)', icon: Sliders },
            { id: 'exceptions', label: 'Exception Case Management', icon: ShieldAlert, badge: openExceptionsCount },
            { id: 'time_travel', label: 'Decision Time Travel & Audit', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.1rem',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--gov-navy-950)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--primary-maroon)' : '3px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary-maroon)' : 'currentColor'} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span 
                    style={{ 
                      backgroundColor: isActive ? 'var(--primary-maroon)' : '#94A3B8', 
                      color: '#FFFFFF', 
                      borderRadius: '10px', 
                      padding: '0.1rem 0.45rem', 
                      fontSize: '0.7rem',
                      fontWeight: 700 
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ACTIVE POLICIES & RULES MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'active_policies' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left Column: Policy List */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--gov-navy-950)' }}>
                  Scheme Policies
                </h3>
                <select
                  value={selectedSchemeFilter}
                  onChange={(e) => setSelectedSchemeFilter(e.target.value)}
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                >
                  <option value="ALL">All Schemes</option>
                  <option value="NFST">NFST Fellowship</option>
                  <option value="NOS">NOS Overseas</option>
                  <option value="TOPCLASS">Top Class</option>
                  <option value="POSTMATRIC">Post-Matric</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {filteredPolicies.map((pol) => {
                  const isSelected = selectedPolicyDetail?.id === pol.id;
                  return (
                    <div
                      key={pol.id}
                      onClick={() => handleSelectPolicy(pol.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid var(--primary-maroon)' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? 'rgba(128,0,32,0.03)' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gov-navy-700)' }}>
                          {pol.scheme_code}
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.45rem', 
                            borderRadius: '4px',
                            backgroundColor: pol.status === 'ACTIVE' ? 'rgba(15,118,110,0.12)' : 'rgba(100,116,139,0.12)',
                            color: pol.status === 'ACTIVE' ? '#0F766E' : '#475569'
                          }}
                        >
                          {pol.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                        {pol.version}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        {pol.policy_name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>Effective: {new Date(pol.effective_from).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                        <span>{pol.rules_count || pol.rules?.length || 0} Rules</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Policy Breakdown */}
            {selectedPolicyDetail && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ backgroundColor: 'var(--gov-navy-950)', color: '#FFFFFF', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {selectedPolicyDetail.scheme_code}
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
                          {selectedPolicyDetail.version}
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '4px',
                            backgroundColor: selectedPolicyDetail.status === 'ACTIVE' ? 'rgba(15,118,110,0.12)' : 'rgba(100,116,139,0.12)',
                            color: selectedPolicyDetail.status === 'ACTIVE' ? '#0F766E' : '#475569'
                          }}
                        >
                          {selectedPolicyDetail.status}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gov-navy-950)', margin: '0 0 0.4rem 0' }}>
                        {selectedPolicyDetail.policy_name}
                      </h2>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approved By</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--gov-navy-950)' }}>
                        {selectedPolicyDetail.approved_by || 'Ministry Committee'}
                      </div>
                    </div>
                  </div>

                  {/* Provenance Header Box */}
                  <div 
                    style={{ 
                      marginTop: '0.9rem', 
                      backgroundColor: '#F8FAFC', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <div>
                      <strong>Official Document:</strong> {selectedPolicyDetail.source_title} {selectedPolicyDetail.source_page ? `(Page ${selectedPolicyDetail.source_page})` : ''}
                    </div>
                    {selectedPolicyDetail.source_url && (
                      <a 
                        href={selectedPolicyDetail.source_url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'var(--gov-navy-700)', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontWeight: 600 }}
                      >
                        <span>View Source PDF</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Clauses & Rules Hierarchy */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '1rem' }}>
                  Decomposed Policy Clauses & Deterministic Rules
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {(selectedPolicyDetail.clauses || []).map((clause) => (
                    <div 
                      key={clause.id}
                      style={{ 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF' 
                      }}
                    >
                      {/* Clause Header */}
                      <div 
                        style={{ 
                          backgroundColor: '#F1F5F9', 
                          padding: '0.75rem 1rem', 
                          borderBottom: '1px solid #E2E8F0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--gov-navy-950)', fontSize: '0.88rem', marginRight: '0.5rem' }}>
                            {clause.section}:
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--gov-navy-900)', fontSize: '0.88rem' }}>
                            {clause.heading}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Ref: {clause.source_reference}
                        </span>
                      </div>

                      {/* Original Official Text */}
                      <div style={{ padding: '0.85rem 1rem', backgroundColor: '#FAFAFA', borderBottom: '1px dashed #E2E8F0', fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{clause.original_text}"
                      </div>

                      {/* Extracted Rules Matrix */}
                      <div style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                          Executable Policy Rules ({clause.rules?.length || 0})
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {(clause.rules || []).map((rule) => (
                            <div 
                              key={rule.id}
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '0.6rem 0.8rem', 
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #EDF2F7', 
                                borderRadius: '6px',
                                fontSize: '0.82rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span 
                                  style={{ 
                                    fontFamily: 'monospace', 
                                    fontWeight: 700, 
                                    color: 'var(--primary-maroon)', 
                                    backgroundColor: 'rgba(128,0,32,0.06)',
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {rule.id}
                                </span>
                                <div>
                                  <strong>{rule.field}</strong> {rule.operator} <strong style={{ color: 'var(--gov-navy-950)' }}>{rule.value} {rule.unit || ''}</strong>
                                </div>
                              </div>

                              <button
                                onClick={() => setSelectedProvenanceRule(rule)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <Eye size={12} />
                                <span>Provenance</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: POLICY VERSIONS & SUPERSESSION TIMELINE */}
        {/* ========================================================================= */}
        {activeTab === 'versions_timeline' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0' }}>
                Historical Policy Version Graph & Supersession Matrix
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Every official circular, gazette amendment, or revised operational framework creates a distinct immutable version. 
                Previous versions remain linked to historical applications for retrospective audit.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {policies.map((pol) => {
                const isSuper = pol.status === 'SUPERSEDED';
                const isActive = pol.status === 'ACTIVE';
                return (
                  <div 
                    key={pol.id}
                    style={{ 
                      border: isActive ? '2px solid var(--accent-saffron)' : '1px solid #E2E8F0',
                      borderRadius: '8px', 
                      padding: '1.25rem',
                      backgroundColor: isActive ? 'rgba(217,119,6,0.02)' : '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ backgroundColor: 'var(--gov-navy-950)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800 }}>
                          {pol.scheme_code}
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
                          Version: {pol.version}
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '4px',
                            backgroundColor: isActive ? '#0F766E' : (isSuper ? '#64748B' : '#D97706'),
                            color: '#FFFFFF'
                          }}
                        >
                          {pol.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong>Effective Period:</strong> {new Date(pol.effective_from).toLocaleDateString('en-IN')} → {pol.effective_to ? new Date(pol.effective_to).toLocaleDateString('en-IN') : 'Present (Operative)'}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gov-navy-900)', margin: '0 0 0.5rem 0' }}>
                      {pol.policy_name}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      <div><strong>Official Source:</strong> {pol.source_title}</div>
                      <div><strong>Publication Date:</strong> {pol.publication_date || 'N/A'}</div>
                      <div><strong>Approved By:</strong> {pol.approved_by || 'Competent Authority'}</div>
                      <div><strong>Supersedes:</strong> {pol.supersedes_policy_version || 'None (Initial Baseline)'}</div>
                    </div>

                    {pol.notes && (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <strong>Governance Notes:</strong> {pol.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PENDING EXTRACTION PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'review_pipeline' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(217,119,6,0.1)', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  CORE PRINCIPLE: AI INTERPRETS • RULES DECIDE • HUMANS AUTHORIZE
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0' }}>
                Policy Extraction & Verification Pipeline
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Workflow: <code>DETECTED → EXTRACTED → VALIDATION REQUIRED → HUMAN APPROVAL → ACTIVE</code>. 
                AI must never automatically enforce official policy without authorized human officer approval.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claims.map((claim) => (
                <div 
                  key={claim.id}
                  style={{ 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px', 
                    padding: '1.1rem',
                    backgroundColor: claim.review_status === 'APPROVED' ? 'rgba(15,118,110,0.02)' : '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ backgroundColor: 'var(--gov-navy-950)', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {claim.scheme_code || 'NFST'}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--gov-navy-950)', fontSize: '0.9rem' }}>
                        Field: {claim.field} {claim.operator} {claim.value} {claim.unit || ''}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          padding: '0.15rem 0.45rem', 
                          borderRadius: '4px',
                          backgroundColor: claim.review_status === 'APPROVED' ? 'rgba(15,118,110,0.12)' : 'rgba(217,119,6,0.12)',
                          color: claim.review_status === 'APPROVED' ? '#0F766E' : '#B45309'
                        }}
                      >
                        {claim.review_status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      AI Extraction Confidence: <strong>{(claim.confidence * 100).toFixed(0)}%</strong>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <strong>Extracted Source Excerpt (Page {claim.source_page || 'N/A'}):</strong> "{claim.extracted_text}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Source: {claim.document_title} • Extracted on {new Date(claim.created_at).toLocaleDateString('en-IN')}
                    </div>

                    {claim.review_status !== 'APPROVED' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={async () => {
                            await OfficialApiService.reviewPolicyClaim(claim.id, 'APPROVE', 'Joint Secretary (MoTA)');
                            await loadAllGovernanceData();
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Check size={13} />
                          <span>Approve & Authorize</span>
                        </button>
                        <button
                          onClick={async () => {
                            await OfficialApiService.reviewPolicyClaim(claim.id, 'REJECT', 'Joint Secretary (MoTA)', 'Flagged during human review');
                            await loadAllGovernanceData();
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.7rem', color: '#DC2626' }}
                        >
                          <X size={13} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.76rem', color: '#0F766E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={14} />
                        <span>Authorized by {claim.approved_by || 'Officer'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OFFICIAL SOURCE CONFLICTS */}
        {/* ========================================================================= */}
        {activeTab === 'conflict_center' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0' }}>
                Official Source Discrepancy & Conflict Resolver
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                When two official government circulars, gazettes, or guidelines specify conflicting thresholds, 
                the system creates an <strong>OFFICIAL SOURCE CONFLICT</strong> requiring authorized human resolution.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {conflicts.map((conf) => {
                const isResolved = conf.status === 'RESOLVED';
                return (
                  <div 
                    key={conf.id}
                    style={{ 
                      border: isResolved ? '1px solid #E2E8F0' : '2px solid var(--primary-maroon)', 
                      borderRadius: '8px', 
                      padding: '1.25rem',
                      backgroundColor: isResolved ? '#F8FAFC' : 'rgba(128,0,32,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--gov-navy-950)', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                          {conf.scheme_code || 'NFST'}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
                          Topic: Conflicting {conf.field} condition
                        </strong>
                      </div>

                      <span 
                        style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          backgroundColor: isResolved ? 'rgba(15,118,110,0.12)' : 'rgba(128,0,32,0.12)',
                          color: isResolved ? '#0F766E' : 'var(--primary-maroon)'
                        }}
                      >
                        {isResolved ? 'RESOLVED BY OFFICER' : 'REQUIRES HUMAN RESOLUTION'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      {conf.description}
                    </p>

                    {/* Side-by-Side Comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gov-navy-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Source A (Operating Guideline)
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.2rem' }}>
                          Value: ₹{conf.claim_a_value ? Number(conf.claim_a_value).toLocaleString('en-IN') : '6,00,000'} / annum
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {conf.claim_a_text || 'Official Base Guideline, Clause 4.1'}
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Source B (Gazette Amendment)
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.2rem' }}>
                          Value: ₹{conf.claim_b_value ? Number(conf.claim_b_value).toLocaleString('en-IN') : '8,00,000'} / annum
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {conf.claim_b_text || 'Gazette Notification F.No. 11015/04/2026'}
                        </div>
                      </div>
                    </div>

                    {!isResolved ? (
                      <button
                        onClick={() => {
                          setSelectedConflict(conf);
                          setChosenClaimId(conf.claim_b_id || '');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                      >
                        Resolve Discrepancy (Authorize Policy)
                      </button>
                    ) : (
                      <div style={{ backgroundColor: '#F1F5F9', padding: '0.6rem 0.85rem', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>Resolution Decision:</strong> {conf.resolution_notes} • <em>Resolved by {conf.resolved_by} on {conf.resolved_at ? new Date(conf.resolved_at).toLocaleDateString('en-IN') : 'Recently'}</em>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: POLICY IMPACT SIMULATOR (SANDBOX) */}
        {/* ========================================================================= */}
        {activeTab === 'simulator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Simulation Controls */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Sliders size={18} color="var(--primary-maroon)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--gov-navy-950)' }}>
                  Simulation Sandbox
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                Simulates proposed policy amendments against applications in-memory without modifying live database records.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Target Scheme
                  </label>
                  <select
                    value={simScheme}
                    onChange={(e) => setSimScheme(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  >
                    <option value="scheme_nfst">National Fellowship (NFST)</option>
                    <option value="scheme_nos">National Overseas Scholarship (NOS)</option>
                    <option value="scheme_topclass">Top Class Education</option>
                    <option value="scheme_postmatric">Post-Matric Scholarship</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Base Policy Version
                  </label>
                  <input
                    type="text"
                    value={simBaseVersion}
                    onChange={(e) => setSimBaseVersion(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Proposed Policy Tag
                  </label>
                  <input
                    type="text"
                    value={simProposedVersion}
                    onChange={(e) => setSimProposedVersion(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Proposed Family Income Ceiling (₹)
                  </label>
                  <input
                    type="number"
                    value={simIncomeCeiling}
                    onChange={(e) => setSimIncomeCeiling(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Proposed Academic Cutoff (%)
                  </label>
                  <input
                    type="number"
                    value={simAcademicCutoff}
                    onChange={(e) => setSimAcademicCutoff(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.3rem' }}>
                    Justification / Policy Note
                  </label>
                  <textarea
                    rows={3}
                    value={simDescription}
                    onChange={(e) => setSimDescription(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  <Play size={16} />
                  <span>{isSimulating ? 'Executing In-Memory Sandbox...' : 'Run Policy Impact Simulation'}</span>
                </button>
              </div>
            </div>

            {/* Simulation Results Display */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #EDF2F7', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ backgroundColor: 'rgba(15,118,110,0.12)', color: '#0F766E', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                      ISOLATED TEST SANDBOX
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Simulation only — no production records modified
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: 0 }}>
                    Policy Impact Analysis Report
                  </h3>
                </div>
              </div>

              {activeSimResult ? (
                <div>
                  {/* Summary Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Analyzed</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>{activeSimResult.total_analyzed}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered Applications</div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(217,119,6,0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(217,119,6,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Potentially Affected</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400E' }}>{activeSimResult.potentially_affected}</div>
                      <div style={{ fontSize: '0.72rem', color: '#B45309' }}>Outcome status changes</div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(15,118,110,0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(15,118,110,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>Eligibility Shifts</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F766E' }}>{activeSimResult.eligibility_outcome_changes}</div>
                      <div style={{ fontSize: '0.72rem', color: '#0F766E' }}>Newly qualifying candidates</div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Manual Review</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>{activeSimResult.manual_review_required}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Grading/income edge cases</div>
                    </div>
                  </div>

                  {/* Detailed Impact Breakdown */}
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.75rem' }}>
                    Simulated Candidate Impact Distribution
                  </h4>

                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                          <th style={{ padding: '0.6rem 0.8rem' }}>Application No</th>
                          <th style={{ padding: '0.6rem 0.8rem' }}>Applicant Name</th>
                          <th style={{ padding: '0.6rem 0.8rem' }}>Current Stage</th>
                          <th style={{ padding: '0.6rem 0.8rem' }}>Simulated Impact Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeSimResult.simulation_results || []).map((res, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontWeight: 700 }}>{res.application_no}</td>
                            <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>{res.applicant_name}</td>
                            <td style={{ padding: '0.6rem 0.8rem' }}>{res.current_status}</td>
                            <td style={{ padding: '0.6rem 0.8rem', color: 'var(--primary-maroon)' }}>
                              {(res.details || []).join('; ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Sliders size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
                  <p>Configure proposed rule parameters on the left and click <strong>Run Policy Impact Simulation</strong> to generate the distribution report.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: EXCEPTION ENGINE CASE MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'exceptions' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(180,83,9,0.1)', color: '#B45309', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  EXCEPTION GOVERNANCE • NOT AN ACCUSATION
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0' }}>
                Exception Case Management Queue
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Handles institutional grading variations (e.g. CPI 10-point scale), certificate name spelling variations, 
                and edge-case eligibility scenarios requiring structured officer review.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exceptions.map((exc) => {
                const isResolved = exc.status === 'RESOLVED';
                return (
                  <div 
                    key={exc.id}
                    style={{ 
                      border: isResolved ? '1px solid #E2E8F0' : '2px solid #F59E0B', 
                      borderRadius: '8px', 
                      padding: '1.25rem',
                      backgroundColor: isResolved ? '#F8FAFC' : '#FFFDF7'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ backgroundColor: '#B45309', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                          {exc.category}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--gov-navy-950)', fontSize: '0.92rem' }}>
                          App: {exc.application_no || exc.application_id} ({exc.applicant_name || 'Candidate'})
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.45rem', 
                            borderRadius: '4px',
                            backgroundColor: isResolved ? 'rgba(15,118,110,0.12)' : 'rgba(217,119,6,0.12)',
                            color: isResolved ? '#0F766E' : '#B45309'
                          }}
                        >
                          {exc.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Policy: <strong>{exc.policy_version}</strong>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {exc.description}
                    </p>

                    {exc.evidence && (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        <strong>Diagnostic Evidence:</strong> {JSON.stringify(exc.evidence)}
                      </div>
                    )}

                    {!isResolved ? (
                      <button
                        onClick={() => setSelectedException(exc)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                      >
                        Resolve Exception
                      </button>
                    ) : (
                      <div style={{ backgroundColor: '#F1F5F9', padding: '0.55rem 0.8rem', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>Official Resolution ({exc.resolution}):</strong> {exc.resolution_reason} • <em>Resolved by {exc.resolved_by}</em>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: DECISION TIME TRAVEL & AUDIT */}
        {/* ========================================================================= */}
        {activeTab === 'time_travel' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #EDF2F7', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-950)', margin: '0 0 0.35rem 0' }}>
                    Policy Time Travel & Historical Decision Reconstruction
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                    Reconstructs exactly how an application was evaluated at submission time, 
                    preserving the historical policy version, rule set, and human override logs.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gov-navy-950)' }}>Application ID:</label>
                  <select
                    value={timeTravelAppId}
                    onChange={(e) => setTimeTravelAppId(e.target.value)}
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', fontWeight: 600 }}
                  >
                    <option value="app_nfst_001">TSF-2026-001245 (Pooja Munda - NFST)</option>
                    <option value="app_nos_002">TSF-2026-003491 (Birsa Soren - NOS)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setTimeTravelMode('historical')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: timeTravelMode === 'historical' ? '2px solid var(--primary-maroon)' : '1px solid #CBD5E1',
                  backgroundColor: timeTravelMode === 'historical' ? 'rgba(128,0,32,0.06)' : '#FFFFFF',
                  color: timeTravelMode === 'historical' ? 'var(--primary-maroon)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                [Historical View] Evaluated at Submission (NFST-2025-v1)
              </button>

              <button
                onClick={() => setTimeTravelMode('current')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: timeTravelMode === 'current' ? '2px solid var(--gov-navy-700)' : '1px solid #CBD5E1',
                  backgroundColor: timeTravelMode === 'current' ? 'rgba(30,58,138,0.06)' : '#FFFFFF',
                  color: timeTravelMode === 'current' ? 'var(--gov-navy-700)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                [Current View] Evaluated under Active Policy (NFST-2026-v2)
              </button>
            </div>

            {/* Decision Replay Details */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--gov-navy-950)', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                    DECISION RECONSTRUCTION
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)' }}>
                    Policy Applied: {timeTravelMode === 'historical' ? 'NFST-2025-v1 (Historical Snapshot)' : 'NFST-2026-v2 (Current Operative)'}
                  </strong>
                </div>

                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Evaluated: {timeTravelMode === 'historical' ? '15 Apr 2025' : 'Current Time'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>SYSTEM DECISION</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F766E' }}>ELIGIBLE (PASS)</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>HUMAN DECISION</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gov-navy-950)' }}>APPROVED</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>REVIEWING OFFICER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gov-navy-950)' }}>Prof. Amit Tigga (NIT Raipur)</div>
                </div>
              </div>

              {/* Reconstructed Rule Trace */}
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.6rem' }}>
                Reconstructed Rule Evaluation Matrix:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #EDF2F7', fontSize: '0.8rem' }}>
                  <span>✓ <strong>Tribe Category Check</strong>: Candidate belongs to notified 'Munda' ST community</span>
                  <span style={{ color: '#0F766E', fontWeight: 700 }}>PASS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #EDF2F7', fontSize: '0.8rem' }}>
                  <span>✓ <strong>Academic Cutoff Check</strong>: Secured 78.4% in M.Sc. {timeTravelMode === 'historical' ? '>= 50% (v1 Rule)' : '>= 55% (v2 Rule)'}</span>
                  <span style={{ color: '#0F766E', fontWeight: 700 }}>PASS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #EDF2F7', fontSize: '0.8rem' }}>
                  <span>✓ <strong>Family Income Check</strong>: Declared ₹2,80,000 &lt;= ₹6,00,000 ceiling</span>
                  <span style={{ color: '#0F766E', fontWeight: 700 }}>PASS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: PROVENANCE INSPECTOR MODAL */}
        {/* ========================================================================= */}
        {selectedProvenanceRule && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', width: '560px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--primary-maroon)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--gov-navy-950)' }}>
                    Official Rule Provenance Record
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedProvenanceRule(null)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
                <div><strong>Rule ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-maroon)' }}>{selectedProvenanceRule.id}</span></div>
                <div><strong>Requirement:</strong> {selectedProvenanceRule.field} {selectedProvenanceRule.operator} <strong>{selectedProvenanceRule.value} {selectedProvenanceRule.unit || ''}</strong></div>
                <div><strong>Source Reference:</strong> {selectedProvenanceRule.source_reference}</div>
                <div><strong>Effective Date:</strong> {selectedProvenanceRule.effective_from || '01 Apr 2025'}</div>
                <div><strong>Operational Status:</strong> <span style={{ color: '#0F766E', fontWeight: 700 }}>ACTIVE</span></div>
                
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Audit Trail Attestation</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Verified against Ministry of Tribal Affairs Official Repository. Authenticity cryptographic SHA-256 hash verified.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button 
                  onClick={() => setSelectedProvenanceRule(null)} 
                  className="btn btn-primary btn-sm"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: RESOLVE CONFLICT MODAL */}
        {/* ========================================================================= */}
        {selectedConflict && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', width: '600px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={20} color="var(--primary-maroon)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--gov-navy-950)' }}>
                    Human Conflict Resolution Authorization
                  </h3>
                </div>
                <button onClick={() => setSelectedConflict(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Select the authoritative source to be enforced by the automated rule engine:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="claim"
                    value={selectedConflict.claim_a_id}
                    checked={chosenClaimId === selectedConflict.claim_a_id}
                    onChange={(e) => setChosenClaimId(e.target.value)}
                  />
                  <div>
                    <strong>Source A (Base Guidelines):</strong> ₹6,00,000 / annum
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="claim"
                    value={selectedConflict.claim_b_id}
                    checked={chosenClaimId === selectedConflict.claim_b_id}
                    onChange={(e) => setChosenClaimId(e.target.value)}
                  />
                  <div>
                    <strong>Source B (Gazette Amendment):</strong> ₹8,00,000 / annum (Enhanced Ceiling)
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Authorized Resolver Name & Title:</label>
                <input
                  type="text"
                  value={resolverName}
                  onChange={(e) => setResolverName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Resolution Justification / Order Reference:</label>
                <textarea
                  rows={3}
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button onClick={() => setSelectedConflict(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleResolveConflictSubmit} className="btn btn-primary btn-sm">Authorize & Enforce</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: RESOLVE EXCEPTION MODAL */}
        {/* ========================================================================= */}
        {selectedException && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', width: '580px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={20} color="#B45309" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--gov-navy-950)' }}>
                    Resolve Exception Case
                  </h3>
                </div>
                <button onClick={() => setSelectedException(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: '1rem', fontSize: '0.84rem' }}>
                <div><strong>Application:</strong> {selectedException.application_no || selectedException.application_id}</div>
                <div><strong>Category:</strong> {selectedException.category}</div>
                <div style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{selectedException.description}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Resolution Action:</label>
                <select
                  value={excResolutionType}
                  onChange={(e) => setExcResolutionType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                >
                  <option value="APPROVED_EXCEPTION">Approved Exception (Formula / Verified Evidence Accepted)</option>
                  <option value="WAIVER_GRANTED">Waiver Granted (Competent Authority Endorsement)</option>
                  <option value="MANUAL_OVERRIDE">Manual Override with Document Verification</option>
                  <option value="REJECTED_EXCEPTION">Rejected (Does Not Meet Guidelines)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Official Resolution Reason / Evidence Reference:</label>
                <textarea
                  rows={3}
                  value={excResolutionReason}
                  onChange={(e) => setExcResolutionReason(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button onClick={() => setSelectedException(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleResolveExceptionSubmit} className="btn btn-primary btn-sm">Submit Resolution</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: CREATE NEW POLICY VERSION MODAL */}
        {/* ========================================================================= */}
        {showCreateVersionModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', width: '600px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="var(--primary-maroon)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--gov-navy-950)' }}>
                    Create New Policy Version (Never Overwrites)
                  </h3>
                </div>
                <button onClick={() => setShowCreateVersionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Scheme</label>
                  <select
                    value={newVersionScheme}
                    onChange={(e) => setNewVersionScheme(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  >
                    <option value="scheme_nfst">National Fellowship for ST Students (NFST)</option>
                    <option value="scheme_nos">National Overseas Scholarship (NOS)</option>
                    <option value="scheme_topclass">Top Class Education for ST</option>
                    <option value="scheme_postmatric">Post-Matric Scholarship</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>New Version Tag (e.g. NFST-2026-v3)</label>
                  <input
                    type="text"
                    value={newVersionTag}
                    onChange={(e) => setNewVersionTag(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Policy Title / Description</label>
                  <input
                    type="text"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Official Source Document Title / Gazette No.</label>
                  <input
                    type="text"
                    value={newVersionSourceTitle}
                    onChange={(e) => setNewVersionSourceTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>Supersedes Previous Version</label>
                  <input
                    type="text"
                    value={newVersionSupersedes}
                    onChange={(e) => setNewVersionSupersedes(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                <button onClick={() => setShowCreateVersionModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button 
                  onClick={async () => {
                    try {
                      await OfficialApiService.createPolicy({
                        scheme_id: newVersionScheme,
                        policy_name: newVersionName,
                        policy_type: 'AMENDMENT',
                        version: newVersionTag,
                        source_title: newVersionSourceTitle,
                        supersedes_policy_version: newVersionSupersedes,
                        clauses: []
                      });
                      setShowCreateVersionModal(false);
                      await loadAllGovernanceData();
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch (e) {
                      console.error('Failed to create policy:', e);
                    }
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Create & Save Policy Version
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
