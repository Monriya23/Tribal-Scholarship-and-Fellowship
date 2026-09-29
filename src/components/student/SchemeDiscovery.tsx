import React, { useState } from 'react';
import { SchemeConfig, StudentDigitalCaseFile } from '../../types';
import { PolicyRuleEngine } from '../../services/ruleEngine';
import { NavTabId } from '../common/Navigation';
import { LanguageService } from '../../services/languageService';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Check, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SchemeDiscoveryProps {
  schemes: SchemeConfig[];
  student: StudentDigitalCaseFile;
  onApplyScheme: (scheme: SchemeConfig) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const SchemeDiscovery: React.FC<SchemeDiscoveryProps> = ({
  schemes,
  student,
  onApplyScheme,
  onNavigate
}) => {
  const t = LanguageService.t();

  // 3-Step Guided Finder State
  const [studyLevel, setStudyLevel] = useState<string>('PHD');
  const [supportType, setSupportType] = useState<string>('FELLOWSHIP');
  const [selectedState, setSelectedState] = useState<string>(student.domicileState || 'Jharkhand');
  const [searchQuery, setSearchQuery] = useState('');

  // Eligibility Modal State
  const [activeSchemeForEligibility, setActiveSchemeForEligibility] = useState<SchemeConfig | null>(null);
  const [checkIncome, setCheckIncome] = useState<number>(student.familyIncomeAnnual || 220000);
  const [checkPercentage, setCheckPercentage] = useState<number>(student.currentAcademic?.previousYearScorePercentage || 72);
  const [checkCategory, setCheckCategory] = useState<string>('ST');

  // Filter schemes based on student answers
  const filteredSchemes = schemes.filter(s => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    if (studyLevel === 'PHD') return s.code === 'NFST' || s.code === 'NOS';
    if (studyLevel === 'OVERSEAS') return s.code === 'NOS';
    if (studyLevel === 'PRE_MATRIC') return s.code === 'PREMATRIC';
    if (studyLevel === 'POST_MATRIC') return s.code === 'POSTMATRIC';
    if (studyLevel === 'PREMIER_UG') return s.code === 'TOPCLASS' || s.code === 'POSTMATRIC';
    return true;
  });

  const getEligibilityEvaluation = (scheme: SchemeConfig) => {
    return PolicyRuleEngine.evaluateSchemeRules(
      scheme,
      {
        familyIncomeAnnual: checkIncome,
        category: checkCategory,
        previousYearScorePercentage: checkPercentage,
        degreeLevel: student.currentAcademic.degreeLevel
      },
      {}
    );
  };

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-saffron-600)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Compass size={14} />
            Smart Scheme Finder
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0.5rem 0' }}>
            {t.finder_title}
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            {t.finder_subtitle}
          </p>
        </div>

        {/* Guided 3-Step Finder Box */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', borderTop: '4px solid var(--gov-saffron-500)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {/* Step 1: Study Level */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)', display: 'block', marginBottom: '0.5rem' }}>
                1. {t.finder_step1_q}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { id: 'PRE_MATRIC', label: 'School (Class 9 & 10)' },
                  { id: 'POST_MATRIC', label: 'Higher Secondary / College (11th, 12th, UG, PG)' },
                  { id: 'PREMIER_UG', label: 'Top Premier Institute (IIT, IIM, NIT, AIIMS, NLU)' },
                  { id: 'PHD', label: 'M.Phil / Ph.D Research Fellowship' },
                  { id: 'OVERSEAS', label: 'Master’s / Ph.D in Foreign University' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStudyLevel(opt.id)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: `1px solid ${studyLevel === opt.id ? 'var(--gov-navy-900)' : 'var(--border-medium)'}`,
                      backgroundColor: studyLevel === opt.id ? 'var(--gov-navy-900)' : '#ffffff',
                      color: studyLevel === opt.id ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: studyLevel === opt.id ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Location */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)', display: 'block', marginBottom: '0.5rem' }}>
                2. {t.finder_step2_q}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>State / UT</span>
                  <select 
                    value={selectedState} 
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Assam">Assam</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="All India">All India (Any State)</option>
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Category</span>
                  <input 
                    type="text" 
                    value="Scheduled Tribe (ST)" 
                    disabled 
                    className="form-control" 
                    style={{ backgroundColor: 'var(--bg-muted)', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Support Type */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)', display: 'block', marginBottom: '0.5rem' }}>
                3. {t.finder_step3_q}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { id: 'FELLOWSHIP', label: 'Monthly Research Fellowship & Contingency' },
                  { id: 'TUITION', label: 'Tuition Fee Reimbursement & Maintenance' },
                  { id: 'OVERSEAS', label: 'Full Overseas Studies Grant & Airfare' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSupportType(opt.id)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: `1px solid ${supportType === opt.id ? 'var(--gov-saffron-500)' : 'var(--border-medium)'}`,
                      backgroundColor: supportType === opt.id ? 'var(--gov-saffron-50)' : '#ffffff',
                      color: supportType === opt.id ? 'var(--gov-saffron-600)' : 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: supportType === opt.id ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matching Scheme Cards */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: 0 }}>
              Potentially Matching Schemes ({filteredSchemes.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Select a scheme to view details, verify eligibility, or apply.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id}
                className="card"
                style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--gov-navy-800)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{scheme.code}</span>
                    <span className="badge badge-success">Active for 2025-26</span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', margin: '0 0 0.5rem 0' }}>
                    {scheme.name}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {scheme.description}
                  </p>

                  {/* Plain Language Benefit Pill */}
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '3px solid var(--gov-green-600)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Financial Support Provided
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginTop: '0.2rem' }}>
                      {scheme.financialBenefits?.stipendMonthly 
                        ? `₹${scheme.financialBenefits.stipendMonthly.toLocaleString('en-IN')}/month + ₹${(scheme.financialBenefits.contingencyAnnual || 20500).toLocaleString('en-IN')}/yr Contingency`
                        : scheme.financialBenefits?.tuitionFeeCapAnnual 
                        ? `100% Tuition Fees + ₹${scheme.financialBenefits.tuitionFeeCapAnnual.toLocaleString('en-IN')}/yr Maintenance`
                        : 'Full tuition fees and living maintenance allowance'}
                    </div>
                  </div>

                  {/* Important Criteria */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    <div>• <strong>For:</strong> {scheme.targetBeneficiaries}</div>
                    <div>• <strong>Deadline:</strong> {scheme.applicationDeadline}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setActiveSchemeForEligibility(scheme)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontWeight: 600 }}
                  >
                    Check Eligibility
                  </button>

                  <button
                    onClick={() => onApplyScheme(scheme)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontWeight: 700 }}
                  >
                    Start Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guided Eligibility Checker Modal */}
        {activeSchemeForEligibility && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-primary">{activeSchemeForEligibility.code}</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', margin: '0.25rem 0 0 0' }}>
                    Eligibility Check: {activeSchemeForEligibility.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveSchemeForEligibility(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>

              {/* Step-by-Step Questions */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gov-navy-950)', display: 'block', marginBottom: '0.35rem' }}>
                    Annual Family Income (from all sources):
                  </label>
                  <input
                    type="number"
                    value={checkIncome}
                    onChange={(e) => setCheckIncome(Number(e.target.value))}
                    className="form-control"
                    placeholder="Enter annual income in INR"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    As certified on your current financial year Income Certificate.
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gov-navy-950)', display: 'block', marginBottom: '0.35rem' }}>
                    Previous Qualifying Examination Percentage:
                  </label>
                  <input
                    type="number"
                    value={checkPercentage}
                    onChange={(e) => setCheckPercentage(Number(e.target.value))}
                    className="form-control"
                    placeholder="e.g. 72"
                  />
                </div>
              </div>

              {/* Eligibility Summary Result */}
              {(() => {
                const evalRes = getEligibilityEvaluation(activeSchemeForEligibility);
                return (
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '0.75rem' }}>
                      Your Eligibility Summary:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {evalRes.results.map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          {r.status === 'PASS' ? (
                            <CheckCircle2 size={18} color="var(--gov-green-600)" />
                          ) : r.status === 'REVIEW' ? (
                            <AlertTriangle size={18} color="var(--gov-amber-600)" />
                          ) : (
                            <XCircle size={18} color="var(--gov-red-600)" />
                          )}
                          <span style={{ color: r.status === 'PASS' ? 'var(--text-primary)' : 'var(--gov-red-700)' }}>
                            <strong>{r.ruleLabel}:</strong> {r.ruleExplanation}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '0.88rem', fontWeight: 700, color: evalRes.allRulesPassed ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
                      {evalRes.allRulesPassed ? (
                        '✓ You appear to be fully eligible for this scheme!'
                      ) : (
                        '⚠ Some criteria need review before final approval.'
                      )}
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setActiveSchemeForEligibility(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const s = activeSchemeForEligibility;
                    setActiveSchemeForEligibility(null);
                    onApplyScheme(s);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  Continue to Application <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
