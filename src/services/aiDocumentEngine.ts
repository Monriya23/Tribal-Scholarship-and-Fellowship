import { DocumentAIDiagnostic, ExtractedField, VerificationStatus } from '../types';

export interface SampleDocumentTemplate {
  id: string;
  type: string;
  label: string;
  description: string;
  fileName: string;
  fileSize: string;
  mockImagePreview?: string;
  defaultData: Record<string, any>;
  hasMismatch?: boolean;
  mismatchDescription?: string;
}

export const SAMPLE_DOCUMENT_TEMPLATES: SampleDocumentTemplate[] = [
  {
    id: 'sample_caste_valid',
    type: 'CASTE_CERTIFICATE',
    label: 'Valid ST Caste Certificate (Jharkhand)',
    description: 'Digitally signed ST Certificate issued by SDO Sadar Ranchi with QR verification.',
    fileName: 'ST_Certificate_Santhal_JH.pdf',
    fileSize: '1.2 MB',
    defaultData: {
      certificateNumber: 'JH/ST/2021/9812',
      applicantName: 'Pooja Munda',
      fatherName: 'Birsa Munda',
      tribeName: 'Munda',
      state: 'Jharkhand',
      district: 'Ranchi',
      issueDate: '2021-06-15',
      issuingAuthority: 'Sub-Divisional Officer, Sadar Ranchi'
    }
  },
  {
    id: 'sample_income_valid',
    type: 'INCOME_CERTIFICATE',
    label: 'Valid Income Certificate (₹2,20,000)',
    description: 'Current FY 2025-26 revenue certificate with matching declared income.',
    fileName: 'Income_Certificate_FY2526_2.2L.pdf',
    fileSize: '950 KB',
    defaultData: {
      certificateNumber: 'JH/INC/2025/44910',
      applicantName: 'Pooja Munda',
      headOfFamily: 'Birsa Munda',
      annualIncomeAmount: 220000,
      financialYear: '2025-26',
      issueDate: '2025-05-18',
      validity: '2026-03-31'
    }
  },
  {
    id: 'sample_income_mismatch',
    type: 'INCOME_CERTIFICATE',
    label: 'Income Certificate with Mismatch (₹3,20,000)',
    description: 'Demonstrates AI mismatch detection: Extracted income ₹3,20,000 vs Declared ₹2,20,000.',
    fileName: 'Income_Certificate_Discrepancy_3.2L.pdf',
    fileSize: '1.1 MB',
    hasMismatch: true,
    mismatchDescription: 'Discrepancy: Extracted figure is ₹3,20,000 while application declared ₹2,20,000.',
    defaultData: {
      certificateNumber: 'CG/INC/2025/88102',
      applicantName: 'Rahul Kumar Gond',
      headOfFamily: 'Sukhdev Gond',
      annualIncomeAmount: 320000,
      financialYear: '2025-26',
      issueDate: '2025-06-10',
      validity: '2026-03-31'
    }
  },
  {
    id: 'sample_income_expired',
    type: 'INCOME_CERTIFICATE',
    label: 'Expired Income Certificate (FY 2022-23)',
    description: 'Demonstrates expiry detection: Certificate issued in 2022, current FY required.',
    fileName: 'Income_Certificate_Expired_2022.pdf',
    fileSize: '840 KB',
    hasMismatch: true,
    mismatchDescription: 'Certificate issued on 14/05/2022 has expired. Current FY 2025-26 certificate required.',
    defaultData: {
      certificateNumber: 'JH/INC/2022/10923',
      applicantName: 'Manish Marandi',
      headOfFamily: 'Shibu Marandi',
      annualIncomeAmount: 195000,
      financialYear: '2022-23',
      issueDate: '2022-05-14',
      validity: '2023-03-31'
    }
  },
  {
    id: 'sample_marksheet_valid',
    type: 'MARKSHEET',
    label: 'University Degree Transcript (78.4%)',
    description: 'Official consolidated marksheet confirming qualifying aggregate score.',
    fileName: 'MPhil_Degree_Transcript_78.4.pdf',
    fileSize: '2.1 MB',
    defaultData: {
      rollNumber: 'CUJ/MPHIL/2023/04',
      applicantName: 'Pooja Munda',
      examName: 'Master of Philosophy (Environmental Science)',
      totalMarksObtained: 784,
      totalMaxMarks: 1000,
      percentage: 78.4,
      grade: 'Distinction / Grade A+',
      passStatus: 'PASSED'
    }
  },
  {
    id: 'sample_foreign_offer',
    type: 'ADMISSION_PROOF',
    label: 'Foreign University Offer Letter (QS #27)',
    description: 'Unconditional admission letter from University of Edinburgh for NOS verification.',
    fileName: 'Edinburgh_Unconditional_Offer_2026.pdf',
    fileSize: '2.8 MB',
    defaultData: {
      universityName: 'University of Edinburgh',
      country: 'United Kingdom',
      qsRanking: 27,
      applicantName: 'Ananya Soren',
      courseName: 'M.Sc Data Science & Public Policy',
      durationYears: 1,
      admissionStatus: 'UNCONDITIONAL_OFFER',
      academicSession: '2026-2027'
    }
  }
];

export class AIDocumentEngine {
  /**
   * Simulates real-time OCR extraction, classification, and cross-consistency validation
   */
  static processUploadedDocument(
    docType: string,
    fileName: string,
    fileSize: string,
    declaredValues: Record<string, any>,
    selectedTemplate?: SampleDocumentTemplate
  ): DocumentAIDiagnostic {
    const isIncome = docType === 'INCOME_CERTIFICATE';
    const isCaste = docType === 'CASTE_CERTIFICATE';
    const isMarksheet = docType === 'MARKSHEET';
    const isAdmission = docType === 'ADMISSION_PROOF';

    const templateData = selectedTemplate?.defaultData || {};

    const extractedFields: ExtractedField[] = [];
    let overallConfidence = 96;
    let ocrReadability = 98;
    let classificationScore = 97;
    let evaluationStatus: VerificationStatus = 'PASSED';
    const anomalies: DocumentAIDiagnostic['anomaliesDetected'] = [];

    if (isCaste) {
      const extCert = templateData.certificateNumber || 'JH/ST/2021/9812';
      const extName = templateData.applicantName || declaredValues.fullName || 'Pooja Munda';
      const extTribe = templateData.tribeName || declaredValues.tribeCommunityName || 'Munda';

      extractedFields.push({
        fieldName: 'certificateNumber',
        fieldLabel: 'Caste Certificate Number',
        extractedValue: extCert,
        declaredValue: declaredValues.casteCertificateNumber || extCert,
        isMatch: true,
        confidence: 99
      });

      extractedFields.push({
        fieldName: 'applicantName',
        fieldLabel: 'Candidate Full Name',
        extractedValue: extName,
        declaredValue: declaredValues.fullName || extName,
        isMatch: true,
        confidence: 98
      });

      extractedFields.push({
        fieldName: 'tribeName',
        fieldLabel: 'Tribe Community',
        extractedValue: extTribe,
        declaredValue: declaredValues.tribeCommunityName || extTribe,
        isMatch: true,
        confidence: 97
      });
    } else if (isIncome) {
      const extIncome = templateData.annualIncomeAmount !== undefined ? templateData.annualIncomeAmount : (declaredValues.familyIncomeAnnual || 220000);
      const declIncome = declaredValues.familyIncomeAnnual || 220000;
      const isIncomeMatch = extIncome === declIncome;
      const isExpired = templateData.financialYear && templateData.financialYear !== '2025-26';

      extractedFields.push({
        fieldName: 'annualIncomeAmount',
        fieldLabel: 'Annual Family Income',
        extractedValue: extIncome,
        declaredValue: declIncome,
        isMatch: isIncomeMatch,
        confidence: 94,
        note: !isIncomeMatch ? `Mismatch: Extracted ₹${extIncome.toLocaleString('en-IN')} vs Declared ₹${declIncome.toLocaleString('en-IN')}` : undefined
      });

      extractedFields.push({
        fieldName: 'financialYear',
        fieldLabel: 'Financial Year Validity',
        extractedValue: templateData.financialYear || '2025-26',
        declaredValue: '2025-26',
        isMatch: !isExpired,
        confidence: 96,
        note: isExpired ? `Expired financial year: ${templateData.financialYear} (Required: 2025-26)` : undefined
      });

      extractedFields.push({
        fieldName: 'headOfFamily',
        fieldLabel: 'Parent / Head of Family',
        extractedValue: templateData.headOfFamily || 'Father / Guardian',
        declaredValue: 'Father / Guardian',
        isMatch: true,
        confidence: 95
      });

      if (!isIncomeMatch) {
        overallConfidence = 84;
        evaluationStatus = 'REVIEW_REQUIRED';
        anomalies.push({
          type: 'MISMATCH',
          severity: 'CRITICAL',
          message: `MISMATCH DETECTED: Declared income ₹${declIncome.toLocaleString('en-IN')} vs Document income ₹${extIncome.toLocaleString('en-IN')}.`,
          recommendedAction: 'Manual review required: Verify whether the applicant declared gross or net income.'
        });
      }

      if (isExpired) {
        overallConfidence = 81;
        evaluationStatus = 'REVIEW_REQUIRED';
        anomalies.push({
          type: 'EXPIRED',
          severity: 'WARNING',
          message: `EXPIRED CERTIFICATE: Income document was issued for FY ${templateData.financialYear}. Valid FY 2025-26 required.`,
          recommendedAction: 'Request applicant to upload current FY 2025-26 Income Certificate.'
        });
      }
    } else if (isMarksheet) {
      const extPercentage = templateData.percentage !== undefined ? templateData.percentage : (declaredValues.previousYearScorePercentage || 78.4);
      const declPercentage = declaredValues.previousYearScorePercentage || 78.4;

      extractedFields.push({
        fieldName: 'percentage',
        fieldLabel: 'Aggregate Percentage',
        extractedValue: extPercentage,
        declaredValue: declPercentage,
        isMatch: Math.abs(extPercentage - declPercentage) < 0.1,
        confidence: 98
      });

      extractedFields.push({
        fieldName: 'passStatus',
        fieldLabel: 'Result Status',
        extractedValue: 'PASSED',
        declaredValue: 'PASSED',
        isMatch: true,
        confidence: 99
      });
    } else if (isAdmission) {
      extractedFields.push({
        fieldName: 'universityName',
        fieldLabel: 'Admitted University',
        extractedValue: templateData.universityName || declaredValues.institutionName || 'Indian Institute of Technology Delhi',
        declaredValue: declaredValues.institutionName || 'Indian Institute of Technology Delhi',
        isMatch: true,
        confidence: 98
      });

      if (templateData.qsRanking !== undefined) {
        extractedFields.push({
          fieldName: 'qsRanking',
          fieldLabel: 'QS World Ranking',
          extractedValue: templateData.qsRanking,
          declaredValue: declaredValues.overseasQsRanking || templateData.qsRanking,
          isMatch: true,
          confidence: 99
        });
      }
    } else {
      extractedFields.push({
        fieldName: 'documentReadability',
        fieldLabel: 'OCR Readability',
        extractedValue: '100% Legible',
        declaredValue: 'Valid Document',
        isMatch: true,
        confidence: 95
      });
    }

    const hasCriticalAnomaly = anomalies.some(a => a.severity === 'CRITICAL');
    const hasWarningAnomaly = anomalies.some(a => a.severity === 'WARNING');

    const consistencyLevel = hasCriticalAnomaly 
      ? 'MAJOR_MISMATCH' 
      : hasWarningAnomaly 
        ? 'MINOR_DISCREPANCY' 
        : 'CONSISTENT';

    return {
      documentId: `doc_${Date.now()}`,
      documentType: docType,
      fileName,
      fileSize,
      ocrReadabilityScore: ocrReadability,
      classificationScore,
      classifiedAs: selectedTemplate?.label || `${docType.replace(/_/g, ' ')} Document`,
      isCorrectType: true,
      overallConfidence,
      extractedFields,
      crossDocumentConsistency: {
        nameMatchScore: 98,
        dobMatchScore: 96,
        casteMatchScore: 100,
        incomeMatchScore: hasCriticalAnomaly ? 45 : 98,
        overallConsistency: consistencyLevel,
        notes: hasCriticalAnomaly 
          ? ['Cross-field discrepancy detected between document contents and application claim.']
          : ['All extracted values match baseline identity and admission credentials.']
      },
      anomaliesDetected: anomalies,
      evaluationStatus
    };
  }
}
