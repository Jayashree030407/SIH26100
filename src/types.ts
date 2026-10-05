export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW' | 'PENDING';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RequirementCategory = 'Technical' | 'Eligibility' | 'Financial' | 'Documentation' | 'Legal';

export type VerificationType = 'document' | 'financial_metric' | 'certificate' | 'registry_lookup' | 'specification';

export interface TenderRequirement {
  id: string; // e.g. "REQ-001"
  category: RequirementCategory;
  clauseRef: string; // e.g. "Clause 4.2.1"
  description: string;
  mandatory: boolean;
  verificationType: VerificationType;
  evidenceRequired: string;
  expectedValue?: string | number;
  unit?: string;
  ruleDescription?: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  docType: 'GST_CERTIFICATE' | 'PAN_CARD' | 'UDYAM_REGISTRATION' | 'ISO_9001' | 'EXPERIENCE_CERTIFICATE' | 'TURNOVER_CERTIFICATE' | 'AUDITED_FINANCIALS' | 'AUTHORIZATION_LETTER' | 'TECH_SPEC_SHEET' | 'OTHER';
  fileSize?: string;
  size?: string;
  uploadDate?: string;
  uploadedAt?: string;
  totalPages: number;
  extractedTextPreview?: string;
  aiProcessed: boolean;
  ocrConfidence?: number;
  ocrStatus?: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  extractedFields: Record<string, any>;
}

export interface ExtractedEvidence {
  requirementId: string;
  documentName: string;
  pageNumber: number;
  fieldName: string;
  detectedValue: string | number;
  detectedTextSnippet: string;
  confidenceScore: number; // 0 to 100
  extractionTimestamp: string;
}

export interface RequirementComplianceResult {
  requirementId: string;
  status: ComplianceStatus;
  evidence?: ExtractedEvidence;
  expectedValue?: string;
  detectedValue?: string;
  difference?: string;
  reason?: string;
  aiExplanation?: string;
  confidence: number;
  isIllustrativeConfidence?: boolean;
  officerVerified?: boolean;
  officerOverrideStatus?: ComplianceStatus;
  officerNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface VendorBid {
  id: string;
  vendorId?: string;
  vendorName: string;
  vendorGst?: string;
  vendorPan?: string;
  vendorUdyam?: string;
  tenderId: string;
  tenderTitle?: string;
  bidSubmissionDate?: string;
  submissionDate?: string;
  quotedPriceINR?: number; // e.g., 4850000
  annualTurnoverCr?: number;
  experienceYears?: number;
  previousUnitsSupplied?: number;
  emdExemption?: boolean;
  complianceScore: number; // 0 to 100
  riskLevel: RiskLevel;
  finalOfficerStatus: 'PENDING_OFFICER_DECISION' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED';
  officerDecisionReason?: string;
  decisionTimestamp?: string;
  decidedBy?: string;
  documents: VendorDocument[];
  results: RequirementComplianceResult[];
  categoryBreakdown: {
    technicalPassed: number;
    technicalTotal: number;
    eligibilityPassed: number;
    eligibilityTotal: number;
    financialPassed: number;
    financialTotal: number;
    documentationPassed: number;
    documentationTotal: number;
    legalPassed: number;
    legalTotal: number;
  };
}

export interface Tender {
  id: string; // e.g. "GEM/2026/B/10234"
  title: string;
  department?: string;
  issuingAuthority?: string;
  category: string;
  description: string;
  submissionDeadline?: string;
  closingDate?: string;
  publishDate?: string;
  estimatedBudgetINR?: number;
  estimatedValue?: string;
  createdDate?: string;
  status: 'ACTIVE' | 'EVALUATION' | 'AWARDED' | 'CLOSED';
  requirements: TenderRequirement[];
  requirementsSource?: 'Gemini' | 'Fallback';
  bidsCount: number;
  evaluatedBidsCount?: number;
}

export type OfficerRole = 'EVALUATOR' | 'APPROVER';

export interface OfficerUser {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  avatarUrl?: string;
  badgeNumber: string;
  role: OfficerRole;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  officerId: string;
  action: string;
  tenderId: string;
  vendorName?: string;
  result: string;
  details?: string;
  ipAddress?: string;
}

export interface ExternalVerificationRecord {
  id: string;
  type: 'GST' | 'PAN' | 'UDYAM' | 'ISO_9001' | 'MCA_PORTAL';
  targetIdentifier: string; // e.g., GSTIN, PAN, Udyam Reg
  vendorName: string;
  status: 'VERIFIED' | 'MISMATCH' | 'EXPIRED' | 'UNVERIFIED';
  verifiedAt: string;
  isSimulated: true;
  registrySource: string;
  details: Record<string, any>;
}
