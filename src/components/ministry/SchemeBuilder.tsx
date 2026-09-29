import React, { useState } from 'react';
import { SchemeConfig, EligibilityRule, RequiredDocumentConfig } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Sliders, 
  PlusCircle, 
  Trash2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchemeBuilderProps {
  schemes: SchemeConfig[];
  onSchemesUpdated: (updatedSchemes: SchemeConfig[]) => void;
}

export const SchemeBuilder: React.FC<SchemeBuilderProps> = ({ schemes, onSchemesUpdated }) => {
  const [activeSchemeId, setActiveSchemeId] = useState<string>(schemes[0]?.id || '');
  const activeScheme = schemes.find(s => s.id === activeSchemeId) || schemes[0];

  // Editable Form State
  const [schemeName, setSchemeName] = useState(activeScheme?.name || '');
  const [schemeCode, setSchemeCode] = useState(activeScheme?.code || '');
  const [version, setVersion] = useState(activeScheme?.version || '');
  const [fundingType, setFundingType] = useState(activeScheme?.fundingType || 'CENTRAL_SECTOR');
  const [centralShare, setCentralShare] = useState<number>(activeScheme?.centralSharePercent || 100);
  const [description, setDescription] = useState(activeScheme?.description || '');
  const [totalSlots, setTotalSlots] = useState<number>(activeScheme?.totalSlotsAnnual || 750);
  const [stipendMonthly, setStipendMonthly] = useState<number>(activeScheme?.financialBenefits?.stipendMonthly || 37000);
  const [tuitionCap, setTuitionCap] = useState<number>(activeScheme?.financialBenefits?.tuitionFeeCapAnnual || 120000);

  // Dynamic Rules State
  const [rules, setRules] = useState<EligibilityRule[]>(activeScheme?.eligibilityRules || []);
  const [documents, setDocuments] = useState<RequiredDocumentConfig[]>(activeScheme?.requiredDocuments || []);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Switch active scheme
  const handleSelectScheme = (scheme: SchemeConfig) => {
    setActiveSchemeId(scheme.id);
    setSchemeName(scheme.name);
    setSchemeCode(scheme.code);
    setVersion(scheme.version);
    setFundingType(scheme.fundingType);
    setCentralShare(scheme.centralSharePercent);
    setDescription(scheme.description);
    setTotalSlots(scheme.totalSlotsAnnual);
    setStipendMonthly(scheme.financialBenefits?.stipendMonthly || 0);
    setTuitionCap(scheme.financialBenefits?.tuitionFeeCapAnnual || 0);
    setRules(scheme.eligibilityRules || []);
    setDocuments(scheme.requiredDocuments || []);
    setSavedSuccess(false);
  };

  const handleAddRule = () => {
    const newRule: EligibilityRule = {
      id: `rule_dyn_${Date.now()}`,
      field: 'familyIncomeAnnual',
      label: 'Family Annual Income <= Ceiling',
      operator: 'LESS_THAN_OR_EQUAL',
      targetValue: 250000,
      explanation: 'Statutory family income must satisfy the means test ceiling.',
      mandatory: true
    };
    setRules([...rules, newRule]);
  };

  const handleRemoveRule = (index: number) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  const handleSaveScheme = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedScheme: SchemeConfig = {
      ...activeScheme,
      name: schemeName,
      code: schemeCode,
      version,
      fundingType: fundingType as any,
      centralSharePercent: centralShare,
      stateSharePercent: 100 - centralShare,
      description,
      totalSlotsAnnual: totalSlots,
      financialBenefits: {
        ...activeScheme.financialBenefits,
        stipendMonthly,
        tuitionFeeCapAnnual: tuitionCap
      },
      eligibilityRules: rules,
      requiredDocuments: documents
    };

    const allSchemes = StorageService.getSchemes();
    const idx = allSchemes.findIndex(s => s.id === updatedScheme.id);
    if (idx >= 0) allSchemes[idx] = updatedScheme;
    else allSchemes.push(updatedScheme);

    StorageService.saveSchemes(allSchemes);
    StorageService.logActivity({
      actorRole: 'ministry_admin',
      actorName: 'Joint Secretary (MoTA)',
      ipAddress: '164.100.12.98 (NIC Gov Network)',
      actionType: 'UPDATE_SCHEME_CONFIG',
      targetEntityId: updatedScheme.id,
      entityType: 'SCHEME',
      details: `Updated policy scheme configuration & eligibility rules for ${updatedScheme.code} (${updatedScheme.version}).`
    });

    onSchemesUpdated(allSchemes);
    setSavedSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-navy-900)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sliders size={14} />
              Policy Configurator & Scheme Builder
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--gov-navy-950)', marginTop: '0.25rem', margin: 0 }}>
              No-Code Scheme & Policy Rule Builder
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Do not hardcode rules into frontend code. Administrators can configure scheme parameters, deterministic rules, documents, and workflows dynamically.
            </p>
          </div>

          <button 
            onClick={() => {
              const newSchemeId = `scheme_dyn_${Date.now()}`;
              const brandNewScheme: SchemeConfig = {
                id: newSchemeId,
                code: 'NEW-ST',
                name: 'New Tribal Welfare Scheme (Draft)',
                version: 'v1.0 (Draft)',
                category: 'POST_MATRIC',
                fundingType: 'CENTRAL_SECTOR',
                centralSharePercent: 100,
                stateSharePercent: 0,
                description: 'Draft scheme configuration for new tribal assistance program.',
                objective: 'Educational support.',
                targetBeneficiaries: 'ST students.',
                financialBenefits: { stipendMonthly: 5000 },
                eligibilityRules: [],
                requiredDocuments: [],
                workflowStages: ['APPLICATION', 'INSTITUTION_VERIFICATION', 'MINISTRY_SCRUTINY', 'COMPLETED'],
                selectionMode: 'DETERMINISTIC_MERIT',
                totalSlotsAnnual: 500,
                applicationDeadline: '2026-12-31',
                activeAcademicYear: '2025-26',
                renewalPolicy: { allowAutoRenewal: true, requireProgressReport: false }
              };
              handleSelectScheme(brandNewScheme);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PlusCircle size={16} />
            Create New Scheme
          </button>
        </div>

        {/* Scheme Selector Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {schemes.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectScheme(s)}
              className={`btn btn-sm ${activeSchemeId === s.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 600 }}
            >
              {s.code} ({s.version})
            </button>
          ))}
        </div>

        {savedSuccess && (
          <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--gov-green-100)', color: 'var(--gov-green-800)', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            Scheme configuration and eligibility rule formulas saved successfully to policy engine!
          </div>
        )}

        {/* The Builder Form */}
        <form onSubmit={handleSaveScheme}>
          {/* Section 1: Basic Scheme Metadata */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--gov-navy-900)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              1. Scheme Master Details & Funding Structure
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Scheme Official Name <span className="required">*</span></label>
                <input type="text" value={schemeName} onChange={(e) => setSchemeName(e.target.value)} className="form-control" required />
              </div>

              <div className="form-group">
                <label className="form-label">Scheme Code <span className="required">*</span></label>
                <input type="text" value={schemeCode} onChange={(e) => setSchemeCode(e.target.value)} className="form-control" required />
              </div>

              <div className="form-group">
                <label className="form-label">Policy Version <span className="required">*</span></label>
                <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="form-control" required />
              </div>

              <div className="form-group">
                <label className="form-label">Funding Type</label>
                <select value={fundingType} onChange={(e) => setFundingType(e.target.value as any)} className="form-control">
                  <option value="CENTRAL_SECTOR">Central Sector (100% MoTA Funded)</option>
                  <option value="CENTRALLY_SPONSORED">Centrally Sponsored (Central:State Sharing)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Central Share Funding (%)</label>
                <input type="number" value={centralShare} onChange={(e) => setCentralShare(Number(e.target.value))} className="form-control" max={100} min={0} />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Slots / Beneficiary Target</label>
                <input type="number" value={totalSlots} onChange={(e) => setTotalSlots(Number(e.target.value))} className="form-control" />
              </div>
            </div>

            <div className="form-group" style={{ margin: '0.5rem 0 0 0' }}>
              <label className="form-label">Scheme Objective & Scope Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" />
            </div>
          </div>

          {/* Section 2: Deterministic Policy Rule Builder */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--gov-saffron-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: 0 }}>
                  2. Deterministic Eligibility Rule Matrix
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Rules evaluated automatically by PolicyRuleEngine against application inputs & AI OCR document extracts.
                </p>
              </div>

              <button type="button" onClick={handleAddRule} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <PlusCircle size={14} /> Add Condition
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {rules.map((rule, idx) => (
                <div key={rule.id} style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border-medium)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '0.75rem', alignItems: 'center' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Condition Label</label>
                    <input
                      type="text"
                      value={rule.label}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[idx].label = e.target.value;
                        setRules(updated);
                      }}
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Target Field</label>
                    <select
                      value={rule.field}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[idx].field = e.target.value;
                        setRules(updated);
                      }}
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                    >
                      <option value="category">category (ST)</option>
                      <option value="familyIncomeAnnual">familyIncomeAnnual</option>
                      <option value="previousYearScorePercentage">previousYearScorePercentage</option>
                      <option value="degreeLevel">degreeLevel</option>
                      <option value="overseasQsRanking">overseasQsRanking</option>
                      <option value="institutionAisheCode">institutionAisheCode</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Operator</label>
                    <select
                      value={rule.operator}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[idx].operator = e.target.value as any;
                        setRules(updated);
                      }}
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                    >
                      <option value="EQUALS">EQUALS (==)</option>
                      <option value="LESS_THAN_OR_EQUAL">&lt;= (Ceiling)</option>
                      <option value="GREATER_THAN_OR_EQUAL">&gt;= (Minimum)</option>
                      <option value="IN">IN (Array)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Explanation / Gazette Rule</label>
                    <input
                      type="text"
                      value={rule.explanation}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[idx].explanation = e.target.value;
                        setRules(updated);
                      }}
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--gov-red-600)', cursor: 'pointer', marginTop: '1.2rem' }}
                    title="Remove Rule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--gov-navy-950)', color: '#ffffff' }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
              Configured rules are saved deterministically and logged to the immutable government audit trail.
            </div>

            <button type="submit" className="btn btn-saffron btn-lg" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              Save & Activate Policy Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
