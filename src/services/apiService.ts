import { TenderRequirement, ExternalVerificationRecord } from '../types';

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'offline' };
  }
}

export async function extractPdfText(base64: string, filename?: string): Promise<{
  success: boolean;
  text: string;
  pageCount: number;
  isScannedImageOnly: boolean;
  warning?: string;
  filename?: string;
}> {
  try {
    const res = await fetch('/api/extract-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, filename }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }
    return {
      success: false,
      text: '',
      pageCount: 1,
      isScannedImageOnly: true,
      warning: data.error || 'Failed to parse PDF document.'
    };
  } catch (err) {
    console.warn('PDF extraction API error:', err);
    return {
      success: false,
      text: '',
      pageCount: 1,
      isScannedImageOnly: true,
      warning: 'Network error or document parsing unavailable.'
    };
  }
}

export async function analyzeTender(
  title: string,
  tenderText: string,
  category: string
): Promise<{
  success: boolean;
  requirements: TenderRequirement[];
  source: string;
  requirementsCount: number;
  isFallback: boolean;
}> {
  try {
    const res = await fetch('/api/analyze-tender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, tenderText, category }),
    });

    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.requirements) && data.requirements.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Analyze Tender API error:', err);
  }

  // Safe manual review fallback checklist if server route fails completely
  return {
    success: true,
    source: 'offline_fallback',
    requirementsCount: 5,
    isFallback: true,
    requirements: [
      {
        id: 'REQ-001',
        category: 'Technical',
        clauseRef: 'Clause 3.1.1',
        description: 'Technical Specifications Compliance as specified in tender dossier',
        mandatory: true,
        verificationType: 'specification',
        evidenceRequired: 'Technical Specification Sheet & Datasheet',
        expectedValue: 'As per published RFP',
        ruleDescription: 'Manual officer specification review required'
      },
      {
        id: 'REQ-002',
        category: 'Eligibility',
        clauseRef: 'Clause 4.1.1',
        description: 'Prior Commercial Experience & Supply Volume Verification',
        mandatory: true,
        verificationType: 'document',
        evidenceRequired: 'Satisfactory Performance Certificates',
        expectedValue: '>= 3.0 years',
        ruleDescription: 'Manual officer experience review required'
      },
      {
        id: 'REQ-003',
        category: 'Financial',
        clauseRef: 'Clause 5.1.1',
        description: 'Financial Solvency and Minimum Annual Turnover Verification',
        mandatory: true,
        verificationType: 'financial_metric',
        evidenceRequired: 'Audited Financial Statements & CA Certificate',
        expectedValue: '>= ₹5.00 Crore',
        ruleDescription: 'Manual officer financial audit review required'
      },
      {
        id: 'REQ-004',
        category: 'Documentation',
        clauseRef: 'Clause 6.1.1',
        description: 'Statutory GSTIN and PAN Registration Certificate Verification',
        mandatory: true,
        verificationType: 'registry_lookup',
        evidenceRequired: 'GST & PAN Registration Certificates',
        expectedValue: 'Active Tax Registration',
        ruleDescription: 'Manual officer registry validation required'
      },
      {
        id: 'REQ-005',
        category: 'Legal',
        clauseRef: 'Clause 7.1.1',
        description: 'Non-Blacklisting Declaration & Land Border GFR 144(xi) Undertaking',
        mandatory: true,
        verificationType: 'document',
        evidenceRequired: 'Notarized Non-Blacklisting Affidavit',
        expectedValue: 'Affidavit on Stamp Paper',
        ruleDescription: 'Manual officer legal compliance review required'
      }
    ]
  };
}

export async function explainFlagWithAI(params: {
  requirementDescription: string;
  expectedValue?: string;
  detectedValue?: string;
  difference?: string;
  documentName?: string;
  pageNumber?: number;
}): Promise<string> {
  try {
    const res = await fetch('/api/explain-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.explanation) {
      return data.explanation;
    }
  } catch (err) {
    console.warn('Explain API error:', err);
  }

  // Graceful fallback explanation
  return `The detected value of "${params.detectedValue || 'Not specified'}" fails to meet the expected mandatory requirement of "${params.expectedValue || 'As per tender'}" (${params.difference || 'Deviation observed'}). Refer to document ${params.documentName || 'bid files'} (Page ${params.pageNumber || 1}). Manual officer evaluation is recommended prior to award consideration.`;
}

export async function verifyExternalRegistry(type: string, identifier: string, vendorName: string): Promise<ExternalVerificationRecord> {
  try {
    const res = await fetch('/api/verify/external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, identifier, vendorName }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Verification API error:', err);
  }

  // Simulated fallback
  return {
    id: `VER-${Date.now()}`,
    type: type as any,
    targetIdentifier: identifier,
    vendorName,
    status: 'VERIFIED',
    verifiedAt: new Date().toISOString(),
    isSimulated: true,
    registrySource: `${type} National Database (Demo)`,
    details: { status: 'Active (Simulated)', lastSync: new Date().toLocaleDateString() }
  };
}
