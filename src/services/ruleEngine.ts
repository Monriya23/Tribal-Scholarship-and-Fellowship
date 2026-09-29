import { SchemeConfig, EligibilityRule } from '../types';

export interface RuleEvaluationItem {
  ruleId: string;
  ruleLabel: string;
  requiredCriteria: string;
  extractedValue: string;
  status: 'PASS' | 'FAIL' | 'REVIEW';
  ruleExplanation: string;
  sourcePolicyId?: string;
  sourceDocumentTitle?: string;
  sourcePage?: number;
  policyVersion?: string;
  provenanceBadge?: 'OFFICIAL SOURCE' | 'AI EXTRACTED' | 'HUMAN VERIFIED';
}

export interface RuleEvaluationSummary {
  allRulesPassed: boolean;
  hasReviewRequired: boolean;
  hasFailedRules: boolean;
  passedCount: number;
  totalCount: number;
  evaluatedPolicyVersion: string;
  evaluatedRuleEngineVersion: string;
  evaluationTimestamp: string;
  results: RuleEvaluationItem[];
}

export class PolicyRuleEngine {
  /**
   * Deterministically evaluates scheme rules against application inputs & AI-extracted document values.
   * Grounded in approved official policy rules with exact version tracking for auditability.
   */
  static evaluateSchemeRules(
    scheme: SchemeConfig,
    applicationData: Record<string, any>,
    extractedDocumentData: Record<string, any> = {},
    customRules?: EligibilityRule[]
  ): RuleEvaluationSummary {
    const rulesToEvaluate = customRules && customRules.length > 0 ? customRules : scheme.eligibilityRules;
    const results: RuleEvaluationItem[] = [];
    let allPassed = true;
    let hasReview = false;
    let hasFail = false;
    let passedCount = 0;

    const currentTimestamp = new Date().toISOString();
    const policyVersion = scheme.activeAcademicYear || '2025-26';
    const ruleEngineVersion = 'RULE-ENGINE-V2.1-APPROVED';

    for (const rule of rulesToEvaluate) {
      const evaluation = this.evaluateSingleRule(rule, applicationData, extractedDocumentData, policyVersion);
      results.push(evaluation);

      if (evaluation.status === 'PASS') {
        passedCount++;
      } else if (evaluation.status === 'REVIEW') {
        hasReview = true;
        allPassed = false;
      } else {
        hasFail = true;
        allPassed = false;
      }
    }

    return {
      allRulesPassed: allPassed && !hasReview && !hasFail,
      hasReviewRequired: hasReview,
      hasFailedRules: hasFail,
      passedCount,
      totalCount: rulesToEvaluate.length,
      evaluatedPolicyVersion: policyVersion,
      evaluatedRuleEngineVersion: ruleEngineVersion,
      evaluationTimestamp: currentTimestamp,
      results
    };
  }

  private static evaluateSingleRule(
    rule: EligibilityRule,
    appData: Record<string, any>,
    extDocData: Record<string, any>,
    policyVersion: string
  ): RuleEvaluationItem {
    const fieldName = rule.field;
    const declaredVal = appData[fieldName];
    const extractedVal = extDocData[fieldName] !== undefined ? extDocData[fieldName] : declaredVal;

    let status: 'PASS' | 'FAIL' | 'REVIEW' = 'PASS';
    let displayExtracted = String(extractedVal !== undefined ? extractedVal : 'Not Provided');
    let requiredCriteriaStr = `${rule.operator} ${JSON.stringify(rule.targetValue)}`;

    if (rule.operator === 'EQUALS') {
      requiredCriteriaStr = `${rule.field} == ${rule.targetValue}`;
      if (declaredVal !== rule.targetValue && extractedVal !== rule.targetValue) {
        status = 'FAIL';
      }
    } else if (rule.operator === 'LESS_THAN_OR_EQUAL') {
      const numericTarget = Number(rule.targetValue);
      const numDeclared = Number(declaredVal || 0);
      const numExtracted = Number(extractedVal || numDeclared);

      requiredCriteriaStr = `<= ₹${numericTarget.toLocaleString('en-IN')}`;
      displayExtracted = `₹${numExtracted.toLocaleString('en-IN')}`;

      if (numDeclared !== numExtracted) {
        displayExtracted = `₹${numExtracted.toLocaleString('en-IN')} (Extracted) vs ₹${numDeclared.toLocaleString('en-IN')} (Declared)`;
        status = 'REVIEW'; // Discrepancy requires human confirmation
      } else if (numExtracted > numericTarget) {
        status = 'FAIL';
      } else {
        status = 'PASS';
      }
    } else if (rule.operator === 'GREATER_THAN_OR_EQUAL') {
      const numericTarget = Number(rule.targetValue);
      const numVal = Number(extractedVal || declaredVal || 0);

      requiredCriteriaStr = `>= ${numericTarget}%`;
      displayExtracted = `${numVal}%`;

      if (numVal < numericTarget) {
        status = 'FAIL';
      } else {
        status = 'PASS';
      }
    } else if (rule.operator === 'IN') {
      const allowedList = Array.isArray(rule.targetValue) ? rule.targetValue : [rule.targetValue];
      requiredCriteriaStr = `One of: ${allowedList.join(', ')}`;

      if (!allowedList.includes(declaredVal) && !allowedList.includes(extractedVal)) {
        status = 'FAIL';
      } else {
        status = 'PASS';
      }
    }

    return {
      ruleId: rule.id,
      ruleLabel: rule.label,
      requiredCriteria: requiredCriteriaStr,
      extractedValue: displayExtracted,
      status,
      ruleExplanation: rule.explanation,
      policyVersion: policyVersion,
      provenanceBadge: 'OFFICIAL SOURCE'
    };
  }
}
