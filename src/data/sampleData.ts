import { Tender, TenderRequirement, VendorBid, OfficerUser, AuditLogEntry, ExternalVerificationRecord } from '../types';

export const DEMO_EVALUATOR: OfficerUser = {
  id: 'OFF-4192',
  name: 'Pooja Deshmukh',
  designation: 'Technical & Bid Evaluation Officer',
  department: 'Department of Expenditure, Ministry of Finance',
  email: 'pooja.deshmukh@gem.gov.in',
  badgeNumber: 'GOV-IN-41920',
  role: 'EVALUATOR'
};

export const DEMO_APPROVER: OfficerUser = {
  id: 'OFF-7829',
  name: 'Rajesh V. Sharma',
  designation: 'Senior Procurement Specialist & Tender Committee Head',
  department: 'Department of Expenditure, Ministry of Finance',
  email: 'rajesh.sharma@gem.gov.in',
  badgeNumber: 'GOV-IN-98214',
  role: 'APPROVER',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export const CURRENT_OFFICER: OfficerUser = DEMO_APPROVER;

export const DEMO_CREDENTIALS = {
  evaluator: {
    username: 'OFF-4192',
    password: 'demo-evaluator-2026',
    role: 'EVALUATOR' as const,
    user: DEMO_EVALUATOR,
    label: 'Procurement Evaluator',
    description: 'Review bids, inspect evidence, request clarification, flag non-compliance.'
  },
  approver: {
    username: 'OFF-7829',
    password: 'demo-approver-2026',
    role: 'APPROVER' as const,
    user: DEMO_APPROVER,
    label: 'Procurement Approver',
    description: 'All Evaluator permissions plus binding contract award/rejection sign-off.'
  }
};

export const SAMPLE_REQUIREMENTS: TenderRequirement[] = [
  // Technical (5)
  {
    id: 'REQ-001',
    category: 'Technical',
    clauseRef: 'Clause 3.1.1',
    description: 'Processor: Intel Core i7 13th Gen (13700) or AMD Ryzen 7 7700 or higher benchmark equivalent (Min. 8 cores, 16 threads)',
    mandatory: true,
    verificationType: 'specification',
    evidenceRequired: 'Technical Specification Sheet & OEM Datasheet',
    ruleDescription: 'CPU model must meet or exceed Core i7 13th Gen specifications'
  },
  {
    id: 'REQ-002',
    category: 'Technical',
    clauseRef: 'Clause 3.1.2',
    description: 'System Memory: Minimum 16 GB DDR5 4800 MHz RAM expandable to 64 GB with dual channel support',
    mandatory: true,
    verificationType: 'specification',
    evidenceRequired: 'OEM Technical Datasheet',
    ruleDescription: 'Memory capacity >= 16 GB and technology must be DDR5'
  },
  {
    id: 'REQ-003',
    category: 'Technical',
    clauseRef: 'Clause 3.1.3',
    description: 'Storage: Minimum 512 GB PCIe Gen 4 M.2 NVMe SSD with read speed >= 3000 MB/s',
    mandatory: true,
    verificationType: 'specification',
    evidenceRequired: 'Storage Spec Sheet & Benchmark declaration',
    ruleDescription: 'Storage type must be NVMe SSD >= 512 GB'
  },
  {
    id: 'REQ-004',
    category: 'Technical',
    clauseRef: 'Clause 3.2.4',
    description: 'Environmental & Energy Compliance: BEE Star 5 Star rating or Energy Star 8.0 certified or RoHS compliant',
    mandatory: true,
    verificationType: 'certificate',
    evidenceRequired: 'BEE / Energy Star / RoHS Test Report Certificate',
    ruleDescription: 'Valid environmental certification must be enclosed'
  },
  {
    id: 'REQ-005',
    category: 'Technical',
    clauseRef: 'Clause 3.4.1',
    description: 'Warranty: 3 Years comprehensive on-site OEM warranty with 24x7 call logging facility & next business day response',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'OEM Warranty Commitment Undertaking',
    ruleDescription: 'Warranty period >= 3 years and on-site support commitment'
  },

  // Eligibility (4)
  {
    id: 'REQ-006',
    category: 'Eligibility',
    clauseRef: 'Clause 4.1.1',
    description: 'Relevant Experience: Bidder must have minimum 3 years of continuous commercial experience in IT hardware supply to Gov/PSU/Corporates',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'Experience Certificate / Work Completion Orders',
    expectedValue: 3,
    unit: 'years',
    ruleDescription: 'Documented experience >= 3.0 years'
  },
  {
    id: 'REQ-007',
    category: 'Eligibility',
    clauseRef: 'Clause 4.1.2',
    description: 'Prior Supply Volume: Must have successfully supplied at least 500 units of desktop computers in a single contract during the last 3 financial years',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'Satisfactory Performance Certificates from Clients',
    expectedValue: 500,
    unit: 'units',
    ruleDescription: 'Single order volume >= 500 units'
  },
  {
    id: 'REQ-008',
    category: 'Eligibility',
    clauseRef: 'Clause 4.2.3',
    description: 'Quality Management Certification: Bidder or OEM must possess valid ISO 9001:2015 certification for manufacturing / system integration',
    mandatory: true,
    verificationType: 'certificate',
    evidenceRequired: 'ISO 9001:2015 Certificate copy',
    ruleDescription: 'Must hold active ISO 9001 certification with unexpired validity'
  },
  {
    id: 'REQ-009',
    category: 'Eligibility',
    clauseRef: 'Clause 4.3.1',
    description: 'Local Service Center Network: Must maintain a functional service center in Delhi NCR / State Capital with spare inventory',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'Service Center Escalation Matrix & Rent/Ownership Agreement',
    ruleDescription: 'Dedicated service infrastructure declaration'
  },

  // Financial (3)
  {
    id: 'REQ-010',
    category: 'Financial',
    clauseRef: 'Clause 5.1.1',
    description: 'Average Annual Turnover: Bidder must have average annual financial turnover of at least ₹5.00 Crore across last 3 audited fiscal years (2022-23, 2023-24, 2024-25)',
    mandatory: true,
    verificationType: 'financial_metric',
    evidenceRequired: 'CA Certified Turnover Certificate with UDIN & Audited Balance Sheets',
    expectedValue: 5.0,
    unit: '₹ Crore',
    ruleDescription: 'Turnover >= 5.00 Cr'
  },
  {
    id: 'REQ-011',
    category: 'Financial',
    clauseRef: 'Clause 5.1.2',
    description: 'Bank Solvency: Valid Bank Solvency Certificate of minimum ₹1.50 Crore issued by any Scheduled Commercial Bank within last 6 months',
    mandatory: true,
    verificationType: 'financial_metric',
    evidenceRequired: 'Bank Solvency Certificate on Bank Letterhead with IFSC/Branch details',
    expectedValue: 1.5,
    unit: '₹ Crore',
    ruleDescription: 'Solvency amount >= 1.50 Cr'
  },
  {
    id: 'REQ-012',
    category: 'Financial',
    clauseRef: 'Clause 5.2.1',
    description: 'Net Worth: Bidder must have positive net worth in each of the last three audited financial years',
    mandatory: true,
    verificationType: 'financial_metric',
    evidenceRequired: 'Audited Financial Statements / Balance Sheet Net Worth summary',
    ruleDescription: 'Net worth > 0 for all 3 years'
  },

  // Documentation (4)
  {
    id: 'REQ-013',
    category: 'Documentation',
    clauseRef: 'Clause 6.1.1',
    description: 'Goods and Services Tax: Valid GSTIN registration certificate with active tax filing status',
    mandatory: true,
    verificationType: 'registry_lookup',
    evidenceRequired: 'GST Registration Certificate (Form GST REG-06)',
    ruleDescription: 'GSTIN must be verified active and registered in India'
  },
  {
    id: 'REQ-014',
    category: 'Documentation',
    clauseRef: 'Clause 6.1.2',
    description: 'Permanent Account Number: PAN card registration copy in company / firm legal name',
    mandatory: true,
    verificationType: 'registry_lookup',
    evidenceRequired: 'PAN Card Copy & Income Tax Returns acknowledgment',
    ruleDescription: 'PAN must match entity name'
  },
  {
    id: 'REQ-015',
    category: 'Documentation',
    clauseRef: 'Clause 6.2.1',
    description: 'Manufacturer Authorization Form (MAF): OEM Authorization specifically addressed to this Tender Number authorizing bidder to quote and support',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'MAF signed by Authorized Signatory of OEM on official stationery',
    ruleDescription: 'Valid MAF matching Tender ID GEM/2026/B/10234'
  },
  {
    id: 'REQ-016',
    category: 'Documentation',
    clauseRef: 'Clause 6.3.2',
    description: 'Bid Security / EMD or Exemption: Submission of Earnest Money Deposit of ₹1,00,000 OR valid MSME/Udyam Registration certificate for EMD exemption',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'EMD Bank Guarantee / FDR receipt or Udyam Certificate',
    ruleDescription: 'EMD proof or valid MSME certificate'
  },

  // Legal (2)
  {
    id: 'REQ-017',
    category: 'Legal',
    clauseRef: 'Clause 7.1.1',
    description: 'Non-Blacklisting Undertaking: Self-declaration on Non-Judicial stamp paper of ₹100/- duly notarized that the firm is not debarred or blacklisted by any Central/State Gov/PSU',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'Notarized Affidavit on ₹100 Stamp Paper',
    ruleDescription: 'Affidavit dated within 30 days of bid submission'
  },
  {
    id: 'REQ-018',
    category: 'Legal',
    clauseRef: 'Clause 7.2.1',
    description: 'Land Border Sharing Compliance: Compliance certificate under Rule 144(xi) of General Financial Rules (GFR), 2017 regarding beneficial ownership from countries sharing land border with India',
    mandatory: true,
    verificationType: 'document',
    evidenceRequired: 'GFR 144(xi) Compliance Undertaking on Bidder Letterhead',
    ruleDescription: 'Mandatory statutory national security compliance declaration'
  }
];

export const SAMPLE_TENDER: Tender = {
  id: 'GEM/2026/B/10234',
  title: 'Supply, Testing and Commissioning of Desktop Computers (Qty: 450 Units)',
  department: 'Ministry of Electronics & Information Technology / Department of Expenditure',
  category: 'Information Technology Hardware',
  description: 'Procurement of 450 Enterprise Desktop Computers with Intel Core i7 13th Gen, 16GB DDR5, 512GB SSD, 23.8 inch IPS Monitors and 3 Years Comprehensive On-site OEM Warranty for Government Secretariat & field offices.',
  submissionDeadline: '2026-09-25T17:00:00Z',
  estimatedBudgetINR: 22500000, // ₹2.25 Crore
  createdDate: '2026-08-15T10:00:00Z',
  status: 'EVALUATION',
  requirements: SAMPLE_REQUIREMENTS,
  requirementsSource: 'Fallback',
  bidsCount: 3,
  evaluatedBidsCount: 3
};

export const OTHER_TENDERS: Tender[] = [
  {
    id: 'GEM/2026/B/10482',
    title: 'Procurement of High-Speed Core Network Switches and Next-Gen Firewalls',
    department: 'National Informatics Centre (NIC)',
    category: 'Networking & Security',
    description: 'Supply of 24 Core 10G/40G Managed Switches with redundant power supplies and High Availability Enterprise NextGen Firewalls with 5yr UTM license.',
    submissionDeadline: '2026-10-04T15:00:00Z',
    estimatedBudgetINR: 41000000,
    createdDate: '2026-08-28T09:30:00Z',
    status: 'ACTIVE',
    requirements: SAMPLE_REQUIREMENTS.slice(0, 12),
    requirementsSource: 'Fallback',
    bidsCount: 5,
    evaluatedBidsCount: 2
  },
  {
    id: 'GEM/2026/B/10891',
    title: 'Cloud Infrastructure Migration & Multi-Zone Managed Hosting Services',
    department: 'Digital India Corporation',
    category: 'Cloud & Managed Services',
    description: 'Turnkey cloud migration and 3-year managed operations for citizen service portals with MeitY empanelled Cloud Service Providers.',
    submissionDeadline: '2026-10-18T18:00:00Z',
    estimatedBudgetINR: 85000000,
    createdDate: '2026-09-01T11:15:00Z',
    status: 'ACTIVE',
    requirements: SAMPLE_REQUIREMENTS.slice(0, 10),
    bidsCount: 4,
    evaluatedBidsCount: 0
  },
  {
    id: 'GEM/2026/B/09812',
    title: 'Supply and Installation of Smart Classroom Interactive Flat Panels (75")',
    department: 'Department of School Education & Literacy',
    category: 'Audio Visual & Education',
    description: 'Supply of 600 units of 4K Interactive Flat Panels with Android 13 + OPS Windows 11 Pro PC modules for Kendriya Vidyalayas across Northern Zone.',
    submissionDeadline: '2026-08-10T14:00:00Z',
    estimatedBudgetINR: 66000000,
    createdDate: '2026-07-12T10:00:00Z',
    status: 'AWARDED',
    requirements: SAMPLE_REQUIREMENTS.slice(0, 14),
    bidsCount: 6,
    evaluatedBidsCount: 6
  }
];

export const SAMPLE_BIDS: VendorBid[] = [
  // 1. TechNova Systems Pvt. Ltd. (Compliant, 92%)
  {
    id: 'BID-TECHNOVA-01',
    vendorId: 'VEN-TN-091',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    tenderId: 'GEM/2026/B/10234',
    tenderTitle: 'Supply of Desktop Computers (Qty: 450 Units)',
    bidSubmissionDate: '2026-09-02T14:22:10Z',
    quotedPriceINR: 21825000, // ₹2.18 Crore (L2)
    complianceScore: 92,
    riskLevel: 'LOW',
    finalOfficerStatus: 'PENDING_OFFICER_DECISION',
    categoryBreakdown: {
      technicalPassed: 5,
      technicalTotal: 5,
      eligibilityPassed: 3,
      eligibilityTotal: 4,
      financialPassed: 3,
      financialTotal: 3,
      documentationPassed: 4,
      documentationTotal: 4,
      legalPassed: 2,
      legalTotal: 2
    },
    documents: [
      {
        id: 'DOC-TN-01',
        name: 'GST_Certificate_TechNova.pdf',
        docType: 'GST_CERTIFICATE',
        fileSize: '1.2 MB',
        uploadDate: '2026-09-02',
        totalPages: 3,
        aiProcessed: true,
        ocrConfidence: 99.1,
        extractedTextPreview: 'FORM GST REG-06: Registration Certificate. GSTIN: 07AAACT2938K1ZX. Legal Name: TECHNOVA SYSTEMS PRIVATE LIMITED. Trade Name: TECHNOVA SYSTEMS. Principal Place of Business: Okhla Industrial Area Phase-III, New Delhi 110020. Date of Issue: 18/07/2017. Status: ACTIVE.',
        extractedFields: { gstin: '07AAACT2938K1ZX', status: 'ACTIVE', legalName: 'TECHNOVA SYSTEMS PRIVATE LIMITED' }
      },
      {
        id: 'DOC-TN-02',
        name: 'PAN_Card_TechNova.pdf',
        docType: 'PAN_CARD',
        fileSize: '480 KB',
        uploadDate: '2026-09-02',
        totalPages: 1,
        aiProcessed: true,
        ocrConfidence: 98.4,
        extractedTextPreview: 'INCOME TAX DEPARTMENT, GOVT OF INDIA. Permanent Account Number: AAACT2938K. Name: TECHNOVA SYSTEMS PRIVATE LIMITED. Date of Incorporation: 12/04/2014.',
        extractedFields: { pan: 'AAACT2938K', entityName: 'TECHNOVA SYSTEMS PRIVATE LIMITED' }
      },
      {
        id: 'DOC-TN-03',
        name: 'Experience_Certificate.pdf',
        docType: 'EXPERIENCE_CERTIFICATE',
        fileSize: '3.4 MB',
        uploadDate: '2026-09-02',
        totalPages: 6,
        aiProcessed: true,
        ocrConfidence: 97.8,
        extractedTextPreview: 'Page 3: CERTIFICATE OF SATISFACTORY COMPLETION. This is to certify that M/s TechNova Systems Pvt. Ltd. has been supplying computer hardware and peripherals to RailTel Corporation since March 2021 (total span: 4.2 years of continuous institutional delivery). Over 850 workstation units supplied successfully across 4 major contracts.',
        extractedFields: { experienceYears: 4.2, previousUnitsSupplied: 850, client: 'RailTel Corporation' }
      },
      {
        id: 'DOC-TN-04',
        name: 'Audited_Financials_CA_Turnover.pdf',
        docType: 'AUDITED_FINANCIALS',
        fileSize: '5.1 MB',
        uploadDate: '2026-09-02',
        totalPages: 18,
        aiProcessed: true,
        ocrConfidence: 98.6,
        extractedTextPreview: 'Page 2: CA TURNOVER CERTIFICATE (UDIN: 24098214ABCD123). FY 2022-23: ₹6.12 Crore, FY 2023-24: ₹6.80 Crore, FY 2024-25: ₹7.40 Crore. Three-Year Average Annual Turnover: ₹6.77 Crore. Net Worth: Positive for all 3 fiscal cycles.',
        extractedFields: { avgTurnoverCr: 6.77, netWorthPositive: true, udin: '24098214ABCD123' }
      },
      {
        id: 'DOC-TN-05',
        name: 'ISO_9001_Certificate.pdf',
        docType: 'ISO_9001',
        fileSize: '950 KB',
        uploadDate: '2026-09-02',
        totalPages: 2,
        aiProcessed: true,
        ocrConfidence: 71.4,
        extractedTextPreview: 'Page 1: CERTIFICATE OF REGISTRATION ISO 9001:2015. Certificate Number: QM-2021-9871. Issued to TechNova Systems Pvt Ltd. Initial certification date: 15 Oct 2021. Notice: Expiry date seal imprint is blurred / partially cut off near margin fold.',
        extractedFields: { standard: 'ISO 9001:2015', certNumber: 'QM-2021-9871', expiryDateVerified: false }
      },
      {
        id: 'DOC-TN-06',
        name: 'Technical_Specification_Datasheet.pdf',
        docType: 'TECH_SPEC_SHEET',
        fileSize: '4.2 MB',
        uploadDate: '2026-09-02',
        totalPages: 12,
        aiProcessed: true,
        ocrConfidence: 99.0,
        extractedTextPreview: 'Model: HP ProTower G9. CPU: Intel Core i7-13700 (16 Cores, 24 Threads, up to 5.2 GHz). RAM: 16 GB DDR5 4800MHz (2x8GB, expandable to 64GB). SSD: 512 GB PCIe Gen4 NVMe M.2 SSD. Energy Star 8.0 & BEE certified. 3-Year Onsite Comprehensive OEM Warranty with next business day resolution.',
        extractedFields: { cpu: 'Intel Core i7-13700', ram: '16GB DDR5', storage: '512GB NVMe PCIe Gen4', warranty: '3 Years Onsite' }
      },
      {
        id: 'DOC-TN-07',
        name: 'OEM_Authorization_MAF.pdf',
        docType: 'AUTHORIZATION_LETTER',
        fileSize: '820 KB',
        uploadDate: '2026-09-02',
        totalPages: 2,
        aiProcessed: true,
        ocrConfidence: 98.9,
        extractedTextPreview: 'MANUFACTURER AUTHORIZATION FORM (MAF). Reference: GEM/2026/B/10234. We, HP India Sales Pvt. Ltd., hereby authorize TechNova Systems Pvt. Ltd. to bid and provide comprehensive 3-year warranty support for this tender.',
        extractedFields: { oem: 'HP India Sales Pvt. Ltd.', tenderRef: 'GEM/2026/B/10234', authorized: true }
      },
      {
        id: 'DOC-TN-08',
        name: 'Udyam_Registration_Certificate.pdf',
        docType: 'UDYAM_REGISTRATION',
        fileSize: '610 KB',
        uploadDate: '2026-09-02',
        totalPages: 1,
        aiProcessed: true,
        ocrConfidence: 99.2,
        extractedTextPreview: 'UDYAM REGISTRATION CERTIFICATE. UDYAM-DL-02-0081921. Enterprise Type: MEDIUM. Major Activity: Manufacturing & Services. Valid as per MSME portal.',
        extractedFields: { udyamNumber: 'UDYAM-DL-02-0081921', category: 'Medium' }
      },
      {
        id: 'DOC-TN-09',
        name: 'Non_Blacklisting_Stamp_Affidavit.pdf',
        docType: 'OTHER',
        fileSize: '1.1 MB',
        uploadDate: '2026-09-02',
        totalPages: 2,
        aiProcessed: true,
        ocrConfidence: 96.5,
        extractedTextPreview: 'AFFIDAVIT ON NON-JUDICIAL STAMP PAPER ₹100/-. Notarized on 28th August 2026. Deponent solemnly affirms that TechNova Systems Pvt. Ltd. has not been blacklisted, debarred or banned by any Ministry or Department.',
        extractedFields: { stampValueINR: 100, notarized: true, date: '2026-08-28' }
      }
    ],
    results: [
      {
        requirementId: 'REQ-001',
        status: 'COMPLIANT',
        expectedValue: 'Intel Core i7 13th Gen / Ryzen 7',
        detectedValue: 'Intel Core i7-13700 (16 Cores, 24 Threads, 5.2 GHz)',
        evidence: {
          requirementId: 'REQ-001',
          documentName: 'Technical_Specification_Datasheet.pdf',
          pageNumber: 2,
          fieldName: 'processor_model',
          detectedValue: 'Intel Core i7-13700',
          detectedTextSnippet: 'CPU: Intel Core i7-13700 (16 Cores, 24 Threads, up to 5.2 GHz)',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'Quoted processor Intel Core i7-13700 meets all architectural and benchmark benchmarks.'
      },
      {
        requirementId: 'REQ-002',
        status: 'COMPLIANT',
        expectedValue: 'Min 16 GB DDR5 4800 MHz',
        detectedValue: '16 GB DDR5 4800 MHz (Expandable to 64GB)',
        evidence: {
          requirementId: 'REQ-002',
          documentName: 'Technical_Specification_Datasheet.pdf',
          pageNumber: 3,
          fieldName: 'system_memory',
          detectedValue: '16 GB DDR5 4800MHz',
          detectedTextSnippet: 'Memory: 16 GB DDR5 4800MHz (2x8GB, expandable to 64GB)',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'Memory capacity and speed fully comply with tender specifications.'
      },
      {
        requirementId: 'REQ-003',
        status: 'COMPLIANT',
        expectedValue: '512 GB PCIe Gen4 NVMe SSD',
        detectedValue: '512 GB PCIe Gen4 NVMe M.2 SSD (3400 MB/s read)',
        evidence: {
          requirementId: 'REQ-003',
          documentName: 'Technical_Specification_Datasheet.pdf',
          pageNumber: 4,
          fieldName: 'storage',
          detectedValue: '512 GB PCIe Gen4 NVMe',
          detectedTextSnippet: 'SSD: 512 GB PCIe Gen4 NVMe M.2 SSD, Sequential Read 3400 MB/s',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'Storage interface and transfer velocity satisfy tender parameters.'
      },
      {
        requirementId: 'REQ-004',
        status: 'COMPLIANT',
        expectedValue: 'Energy Star 8.0 / BEE 5 Star / RoHS',
        detectedValue: 'Energy Star 8.0 & RoHS Certified',
        evidence: {
          requirementId: 'REQ-004',
          documentName: 'Technical_Specification_Datasheet.pdf',
          pageNumber: 7,
          fieldName: 'eco_compliance',
          detectedValue: 'Energy Star 8.0 & RoHS',
          detectedTextSnippet: 'Compliance: Energy Star 8.0 Certified, EPEAT Gold, RoHS Directive compliant',
          confidenceScore: 97,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 97,
        reason: 'Environmental compliance standards authenticated.'
      },
      {
        requirementId: 'REQ-005',
        status: 'COMPLIANT',
        expectedValue: '3 Years Comprehensive On-site Warranty',
        detectedValue: '3 Years Comprehensive On-site OEM Warranty',
        evidence: {
          requirementId: 'REQ-005',
          documentName: 'Technical_Specification_Datasheet.pdf',
          pageNumber: 11,
          fieldName: 'warranty_terms',
          detectedValue: '3 Years Onsite OEM Warranty',
          detectedTextSnippet: '3-Year Onsite Comprehensive OEM Warranty with next business day resolution and 24x7 desk',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'OEM warranty undertaking confirmed.'
      },
      {
        requirementId: 'REQ-006',
        status: 'COMPLIANT',
        expectedValue: '>= 3.0 years',
        detectedValue: '4.2 years',
        evidence: {
          requirementId: 'REQ-006',
          documentName: 'Experience_Certificate.pdf',
          pageNumber: 3,
          fieldName: 'experience_years',
          detectedValue: '4.2 years',
          detectedTextSnippet: 'M/s TechNova Systems Pvt. Ltd. has been supplying computer hardware and peripherals to RailTel Corporation since March 2021 (total span: 4.2 years of continuous institutional delivery)',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'Verified 4.2 years institutional experience exceeds the 3.0 years minimum threshold.'
      },
      {
        requirementId: 'REQ-007',
        status: 'COMPLIANT',
        expectedValue: '>= 500 units single contract',
        detectedValue: '850 units',
        evidence: {
          requirementId: 'REQ-007',
          documentName: 'Experience_Certificate.pdf',
          pageNumber: 4,
          fieldName: 'single_order_volume',
          detectedValue: '850 units',
          detectedTextSnippet: 'Successfully executed contract No. RCIL/2023/PO/908 for 850 units of desktop computers',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'Single order volume of 850 units exceeds mandatory 500 units requirement.'
      },
      {
        requirementId: 'REQ-008',
        status: 'NEEDS_REVIEW',
        expectedValue: 'Active ISO 9001:2015 certificate with unexpired validity',
        detectedValue: 'ISO 9001:2015 (Expiry blurred / unconfirmed)',
        difference: 'Certificate validity date unreadable on scanned page',
        reason: 'Certificate detected but expiry date could not be confidently verified from the provided scan.',
        aiExplanation: 'The ISO 9001:2015 document was detected and cert number QM-2021-9871 was parsed, but the lower margin expiry seal is faint and illegible. Manual officer review or clarification from vendor is recommended.',
        evidence: {
          requirementId: 'REQ-008',
          documentName: 'ISO_9001_Certificate.pdf',
          pageNumber: 1,
          fieldName: 'expiry_date',
          detectedValue: 'Unreadable Date Seal',
          detectedTextSnippet: 'Initial certification date: 15 Oct 2021. Notice: Expiry date seal imprint is blurred / partially cut off near margin fold.',
          confidenceScore: 71,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 71
      },
      {
        requirementId: 'REQ-009',
        status: 'COMPLIANT',
        expectedValue: 'Functional service center in Delhi NCR',
        detectedValue: 'Service Center at Okhla Phase-III, New Delhi',
        evidence: {
          requirementId: 'REQ-009',
          documentName: 'Experience_Certificate.pdf',
          pageNumber: 5,
          fieldName: 'service_center',
          detectedValue: 'Okhla Phase-III, New Delhi',
          detectedTextSnippet: 'Company operates dedicated service depot at B-42 Okhla Phase-III, New Delhi with 12 resident engineers',
          confidenceScore: 96,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 96,
        reason: 'Delhi NCR service center address verified with escalation contacts.'
      },
      {
        requirementId: 'REQ-010',
        status: 'COMPLIANT',
        expectedValue: '>= ₹5.00 Crore',
        detectedValue: '₹6.77 Crore',
        evidence: {
          requirementId: 'REQ-010',
          documentName: 'Audited_Financials_CA_Turnover.pdf',
          pageNumber: 2,
          fieldName: 'avg_annual_turnover',
          detectedValue: '₹6.77 Crore',
          detectedTextSnippet: 'Three-Year Average Annual Turnover: ₹6.77 Crore (FY23: ₹6.12Cr, FY24: ₹6.80Cr, FY25: ₹7.40Cr)',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'Average annual turnover of ₹6.77 Cr exceeds threshold of ₹5.00 Cr by ₹1.77 Cr.'
      },
      {
        requirementId: 'REQ-011',
        status: 'COMPLIANT',
        expectedValue: '>= ₹1.50 Crore Bank Solvency',
        detectedValue: '₹2.00 Crore Solvency (HDFC Bank)',
        evidence: {
          requirementId: 'REQ-011',
          documentName: 'Audited_Financials_CA_Turnover.pdf',
          pageNumber: 14,
          fieldName: 'solvency_certificate',
          detectedValue: '₹2.00 Crore',
          detectedTextSnippet: 'Solvency Certificate issued by HDFC Bank Okhla Branch dated 14/08/2026 certifying solvency up to ₹2.00 Crore',
          confidenceScore: 97,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 97,
        reason: 'Bank solvency of ₹2.00 Cr complies with ₹1.50 Cr requirement.'
      },
      {
        requirementId: 'REQ-012',
        status: 'COMPLIANT',
        expectedValue: 'Positive Net Worth across all 3 years',
        detectedValue: 'Positive (+₹4.8 Cr, +₹5.6 Cr, +₹6.9 Cr)',
        evidence: {
          requirementId: 'REQ-012',
          documentName: 'Audited_Financials_CA_Turnover.pdf',
          pageNumber: 8,
          fieldName: 'net_worth',
          detectedValue: 'Positive (3 years)',
          detectedTextSnippet: 'Net Worth as on 31st March 2025: ₹6.92 Crore (FY24: ₹5.61 Cr, FY23: ₹4.82 Cr)',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'Net worth audited consistently positive for last 3 financial years.'
      },
      {
        requirementId: 'REQ-013',
        status: 'COMPLIANT',
        expectedValue: 'Valid Active GSTIN',
        detectedValue: '07AAACT2938K1ZX (Active)',
        evidence: {
          requirementId: 'REQ-013',
          documentName: 'GST_Certificate_TechNova.pdf',
          pageNumber: 1,
          fieldName: 'gstin',
          detectedValue: '07AAACT2938K1ZX',
          detectedTextSnippet: 'FORM GST REG-06: Registration Certificate. GSTIN: 07AAACT2938K1ZX. Legal Name: TECHNOVA SYSTEMS PRIVATE LIMITED',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'GSTIN active and verified with GST portal demo registry.'
      },
      {
        requirementId: 'REQ-014',
        status: 'COMPLIANT',
        expectedValue: 'Valid PAN matching corporate name',
        detectedValue: 'AAACT2938K (Matches entity name)',
        evidence: {
          requirementId: 'REQ-014',
          documentName: 'PAN_Card_TechNova.pdf',
          pageNumber: 1,
          fieldName: 'pan',
          detectedValue: 'AAACT2938K',
          detectedTextSnippet: 'Permanent Account Number: AAACT2938K. Name: TECHNOVA SYSTEMS PRIVATE LIMITED',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'Corporate PAN matches bidder name exactly.'
      },
      {
        requirementId: 'REQ-015',
        status: 'COMPLIANT',
        expectedValue: 'OEM MAF matching tender ref GEM/2026/B/10234',
        detectedValue: 'HP India Sales Pvt. Ltd. MAF (Tender Ref Verified)',
        evidence: {
          requirementId: 'REQ-015',
          documentName: 'OEM_Authorization_MAF.pdf',
          pageNumber: 1,
          fieldName: 'maf_reference',
          detectedValue: 'GEM/2026/B/10234',
          detectedTextSnippet: 'We, HP India Sales Pvt. Ltd., hereby authorize TechNova Systems Pvt. Ltd. to bid and provide comprehensive 3-year warranty support for this tender Ref: GEM/2026/B/10234',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'MAF authenticated from authorized signatory of OEM with exact tender reference.'
      },
      {
        requirementId: 'REQ-016',
        status: 'COMPLIANT',
        expectedValue: 'EMD ₹1,00,000 or MSME Udyam Exemption',
        detectedValue: 'Udyam Exemption (UDYAM-DL-02-0081921)',
        evidence: {
          requirementId: 'REQ-016',
          documentName: 'Udyam_Registration_Certificate.pdf',
          pageNumber: 1,
          fieldName: 'udyam_number',
          detectedValue: 'UDYAM-DL-02-0081921',
          detectedTextSnippet: 'UDYAM REGISTRATION CERTIFICATE: UDYAM-DL-02-0081921. Enterprise Type: MEDIUM. Eligible for statutory EMD exemption as per Public Procurement Policy',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 99,
        reason: 'Valid Udyam MSME certificate submitted claiming statutory EMD exemption.'
      },
      {
        requirementId: 'REQ-017',
        status: 'COMPLIANT',
        expectedValue: 'Notarized Affidavit on ₹100 Non-Judicial Stamp',
        detectedValue: 'Affidavit on ₹100 Stamp (Notarized 28-Aug-2026)',
        evidence: {
          requirementId: 'REQ-017',
          documentName: 'Non_Blacklisting_Stamp_Affidavit.pdf',
          pageNumber: 1,
          fieldName: 'stamp_affidavit',
          detectedValue: '₹100 Stamp Notarized',
          detectedTextSnippet: 'AFFIDAVIT ON NON-JUDICIAL STAMP PAPER ₹100/-. Notarized on 28th August 2026 confirming entity is not debarred or blacklisted',
          confidenceScore: 97,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 97,
        reason: 'Stamp value and notarization dated within acceptable window.'
      },
      {
        requirementId: 'REQ-018',
        status: 'COMPLIANT',
        expectedValue: 'GFR Rule 144(xi) Land Border compliance undertaking',
        detectedValue: 'GFR 144(xi) Undertaking on Letterhead signed',
        evidence: {
          requirementId: 'REQ-018',
          documentName: 'Non_Blacklisting_Stamp_Affidavit.pdf',
          pageNumber: 2,
          fieldName: 'land_border_clause',
          detectedValue: 'Compliant Declaration',
          detectedTextSnippet: 'Clause 7.2.1: Deponent certifies compliance with DoE Order (Public Procurement No. 1) regarding restrictions on procurement from bidders sharing land border with India',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-02T14:30:12Z'
        },
        confidence: 98,
        reason: 'Statutory national security land border sharing certificate provided.'
      }
    ]
  },

  // 2. Bharat Digital Solutions (Needs Review, 78%)
  {
    id: 'BID-BHARAT-02',
    vendorId: 'VEN-BDS-044',
    vendorName: 'Bharat Digital Solutions',
    tenderId: 'GEM/2026/B/10234',
    tenderTitle: 'Supply of Desktop Computers (Qty: 450 Units)',
    bidSubmissionDate: '2026-09-03T11:45:00Z',
    quotedPriceINR: 20980000, // ₹2.09 Crore (L1 in price, but needs review)
    complianceScore: 78,
    riskLevel: 'MEDIUM',
    finalOfficerStatus: 'PENDING_OFFICER_DECISION',
    categoryBreakdown: {
      technicalPassed: 5,
      technicalTotal: 5,
      eligibilityPassed: 2,
      eligibilityTotal: 4,
      financialPassed: 3,
      financialTotal: 3,
      documentationPassed: 3,
      documentationTotal: 4,
      legalPassed: 1,
      legalTotal: 2
    },
    documents: [
      {
        id: 'DOC-BDS-01',
        name: 'GST_Certificate_BharatDigital.pdf',
        docType: 'GST_CERTIFICATE',
        fileSize: '1.4 MB',
        uploadDate: '2026-09-03',
        totalPages: 3,
        aiProcessed: true,
        ocrConfidence: 98.2,
        extractedTextPreview: 'GSTIN: 06AABCB4829F1ZK. Legal Name: BHARAT DIGITAL SOLUTIONS LLP. Registration Date: 02/09/2019. Active Status.',
        extractedFields: { gstin: '06AABCB4829F1ZK', status: 'ACTIVE', legalName: 'BHARAT DIGITAL SOLUTIONS LLP' }
      },
      {
        id: 'DOC-BDS-02',
        name: 'PAN_BharatDigital.pdf',
        docType: 'PAN_CARD',
        fileSize: '390 KB',
        uploadDate: '2026-09-03',
        totalPages: 1,
        aiProcessed: true,
        ocrConfidence: 99.0,
        extractedTextPreview: 'PAN: AABCB4829F. Name: BHARAT DIGITAL SOLUTIONS LLP.',
        extractedFields: { pan: 'AABCB4829F', entityName: 'BHARAT DIGITAL SOLUTIONS LLP' }
      },
      {
        id: 'DOC-BDS-03',
        name: 'Experience_Summary_Letters.pdf',
        docType: 'EXPERIENCE_CERTIFICATE',
        fileSize: '2.8 MB',
        uploadDate: '2026-09-03',
        totalPages: 5,
        aiProcessed: true,
        ocrConfidence: 84.1,
        extractedTextPreview: 'Page 2: Client work order from Haryana Urban Development Authority for supply of 320 PCs in 2024. Page 4: Work order without completion certificate for 200 PCs.',
        extractedFields: { experienceYears: 3.1, singleOrderVolume: 320, client: 'HUDA' }
      },
      {
        id: 'DOC-BDS-04',
        name: 'CA_Audited_Accounts.pdf',
        docType: 'AUDITED_FINANCIALS',
        fileSize: '4.7 MB',
        uploadDate: '2026-09-03',
        totalPages: 16,
        aiProcessed: true,
        ocrConfidence: 96.0,
        extractedTextPreview: 'Three-Year Average Turnover: ₹5.24 Crore. FY23: ₹4.90 Cr, FY24: ₹5.10 Cr, FY25: ₹5.72 Cr. Net Worth is positive.',
        extractedFields: { avgTurnoverCr: 5.24, netWorthPositive: true }
      },
      {
        id: 'DOC-BDS-05',
        name: 'ISO_Certificate_Bharat.pdf',
        docType: 'ISO_9001',
        fileSize: '1.1 MB',
        uploadDate: '2026-09-03',
        totalPages: 2,
        aiProcessed: true,
        ocrConfidence: 82.5,
        extractedTextPreview: 'ISO 9001:2015. Expiry Date: 12 August 2026 (Passed by 3 weeks before bid closing). Recertification audit audit receipt attached.',
        extractedFields: { standard: 'ISO 9001:2015', expired: true, expiryDate: '2026-08-12' }
      },
      {
        id: 'DOC-BDS-06',
        name: 'Tech_Specifications_Acer.pdf',
        docType: 'TECH_SPEC_SHEET',
        fileSize: '3.8 MB',
        uploadDate: '2026-09-03',
        totalPages: 10,
        aiProcessed: true,
        ocrConfidence: 98.1,
        extractedTextPreview: 'Acer Veriton M Series. Intel Core i7-13700. 16 GB DDR5 RAM. 512 GB NVMe SSD. Energy Star 8.0 compliant. 3-Year On-site Warranty.',
        extractedFields: { cpu: 'Intel Core i7-13700', ram: '16GB DDR5', storage: '512GB NVMe SSD' }
      }
    ],
    results: [
      {
        requirementId: 'REQ-001',
        status: 'COMPLIANT',
        expectedValue: 'Intel Core i7 13th Gen',
        detectedValue: 'Intel Core i7-13700',
        confidence: 98,
        reason: 'Quoted processor satisfies technical specification.'
      },
      {
        requirementId: 'REQ-002',
        status: 'COMPLIANT',
        expectedValue: 'Min 16 GB DDR5 4800 MHz',
        detectedValue: '16 GB DDR5 4800 MHz',
        confidence: 97,
        reason: 'RAM requirements verified.'
      },
      {
        requirementId: 'REQ-003',
        status: 'COMPLIANT',
        expectedValue: '512 GB PCIe Gen4 NVMe SSD',
        detectedValue: '512 GB PCIe Gen4 NVMe SSD',
        confidence: 98,
        reason: 'Storage specifications compliant.'
      },
      {
        requirementId: 'REQ-004',
        status: 'COMPLIANT',
        expectedValue: 'Energy Star 8.0 / BEE',
        detectedValue: 'Energy Star 8.0 certified',
        confidence: 96,
        reason: 'Eco-rating certificate verified.'
      },
      {
        requirementId: 'REQ-005',
        status: 'COMPLIANT',
        expectedValue: '3 Years On-site Warranty',
        detectedValue: '3 Years On-site Warranty',
        confidence: 97,
        reason: 'OEM warranty terms verified.'
      },
      {
        requirementId: 'REQ-006',
        status: 'COMPLIANT',
        expectedValue: '>= 3.0 years',
        detectedValue: '3.1 years',
        confidence: 92,
        reason: '3.1 years experience verified from client purchase orders.'
      },
      {
        requirementId: 'REQ-007',
        status: 'NON_COMPLIANT',
        expectedValue: '>= 500 units in single contract',
        detectedValue: '320 units (Largest single order)',
        difference: 'Shortfall of 180 units below mandatory 500 units limit',
        reason: 'Vendor failed single contract volume criteria. Largest single supply was 320 units.',
        aiExplanation: 'The tender explicitly demands a single contract completion of >= 500 units. Vendor submitted multiple aggregated orders (320 + 200 units), which cannot be combined under Clause 4.1.2 rules.',
        evidence: {
          requirementId: 'REQ-007',
          documentName: 'Experience_Summary_Letters.pdf',
          pageNumber: 2,
          fieldName: 'single_order_volume',
          detectedValue: '320 units',
          detectedTextSnippet: 'HUDA Order No. 4921 for 320 units of Desktop Computers. Second order was for 200 units on separate PO.',
          confidenceScore: 94,
          extractionTimestamp: '2026-09-03T11:55:00Z'
        },
        confidence: 94
      },
      {
        requirementId: 'REQ-008',
        status: 'NEEDS_REVIEW',
        expectedValue: 'Active unexpired ISO 9001:2015',
        detectedValue: 'Expired 12-Aug-2026 (Recertification pending)',
        difference: 'Certificate validity expired prior to bid submission date',
        reason: 'ISO 9001 expired 12-Aug-2026; vendor attached an audit slip claiming recertification in progress.',
        aiExplanation: 'A strict reading of Clause 4.2.3 requires active ISO certification on the bid closing date. Recertification audit acknowledgement slip is attached, which requires officer discretion/clarification.',
        evidence: {
          requirementId: 'REQ-008',
          documentName: 'ISO_Certificate_Bharat.pdf',
          pageNumber: 1,
          fieldName: 'iso_validity',
          detectedValue: 'Expired on 12/08/2026',
          detectedTextSnippet: 'Valid until: 12 August 2026. Auditor letter attached: Recertification audit conducted on 20 August 2026, certificate under issuance.',
          confidenceScore: 89,
          extractionTimestamp: '2026-09-03T11:55:00Z'
        },
        confidence: 89
      },
      {
        requirementId: 'REQ-009',
        status: 'COMPLIANT',
        expectedValue: 'Service center in Delhi NCR',
        detectedValue: 'Service facility at Gurugram, Haryana (NCR)',
        confidence: 95,
        reason: 'NCR service facility verified.'
      },
      {
        requirementId: 'REQ-010',
        status: 'COMPLIANT',
        expectedValue: '>= ₹5.00 Crore',
        detectedValue: '₹5.24 Crore',
        confidence: 96,
        reason: 'Average annual turnover of ₹5.24 Cr meets ₹5.00 Cr requirement.'
      },
      {
        requirementId: 'REQ-011',
        status: 'COMPLIANT',
        expectedValue: '>= ₹1.50 Crore Bank Solvency',
        detectedValue: '₹1.60 Crore Solvency (SBI)',
        confidence: 95,
        reason: 'Solvency certificate from SBI meets threshold.'
      },
      {
        requirementId: 'REQ-012',
        status: 'COMPLIANT',
        expectedValue: 'Positive Net Worth',
        detectedValue: 'Positive Net Worth across 3 years',
        confidence: 96,
        reason: 'Positive net worth certified by statutory auditor.'
      },
      {
        requirementId: 'REQ-013',
        status: 'COMPLIANT',
        expectedValue: 'Active GSTIN',
        detectedValue: '06AABCB4829F1ZK (Active)',
        confidence: 99,
        reason: 'GSTIN verified active.'
      },
      {
        requirementId: 'REQ-014',
        status: 'COMPLIANT',
        expectedValue: 'Valid PAN',
        detectedValue: 'AABCB4829F',
        confidence: 99,
        reason: 'Entity PAN matches.'
      },
      {
        requirementId: 'REQ-015',
        status: 'NEEDS_REVIEW',
        expectedValue: 'OEM MAF matching tender ref GEM/2026/B/10234',
        detectedValue: 'MAF mentions Acer India but tender number is typed GEM/2026/B/1023X',
        difference: 'Typographical mismatch in Tender ID on OEM authorization letter',
        reason: 'OEM MAF has typographical anomaly in the last digit of the tender reference.',
        aiExplanation: 'The MAF issued by Acer India refers to GEM/2026/B/1023X instead of GEM/2026/B/10234. Officer should issue an official clarification request to verify genuine OEM backing.',
        evidence: {
          requirementId: 'REQ-015',
          documentName: 'Tech_Specifications_Acer.pdf',
          pageNumber: 8,
          fieldName: 'maf_tender_ref',
          detectedValue: 'GEM/2026/B/1023X',
          detectedTextSnippet: 'Authorized to participate in Tender Ref No: GEM/2026/B/1023X for Supply of Desktops',
          confidenceScore: 82,
          extractionTimestamp: '2026-09-03T11:55:00Z'
        },
        confidence: 82
      },
      {
        requirementId: 'REQ-016',
        status: 'COMPLIANT',
        expectedValue: 'EMD ₹1,00,000 or MSME Exemption',
        detectedValue: 'EMD Bank Guarantee of ₹1,00,000 submitted',
        confidence: 98,
        reason: 'Bank Guarantee from PNB verified.'
      },
      {
        requirementId: 'REQ-017',
        status: 'COMPLIANT',
        expectedValue: 'Notarized Affidavit on ₹100 Stamp',
        detectedValue: '₹100 Stamp Non-Blacklisting Affidavit submitted',
        confidence: 95,
        reason: 'Notarized affidavit compliant.'
      },
      {
        requirementId: 'REQ-018',
        status: 'NEEDS_REVIEW',
        expectedValue: 'GFR Rule 144(xi) Land Border compliance undertaking',
        detectedValue: 'Undertaking text missing specific clause reference',
        reason: 'Statutory undertaking provided on plain letterhead without the mandatory legal wording for beneficial ownership.',
        confidence: 76
      }
    ]
  },

  // 3. NextGen Infotech Pvt. Ltd. (Non-Compliant, 61%)
  {
    id: 'BID-NEXTGEN-03',
    vendorId: 'VEN-NGI-019',
    vendorName: 'NextGen Infotech Pvt. Ltd.',
    tenderId: 'GEM/2026/B/10234',
    tenderTitle: 'Supply of Desktop Computers (Qty: 450 Units)',
    bidSubmissionDate: '2026-09-01T16:10:00Z',
    quotedPriceINR: 20160000, // ₹2.01 Crore (Lowest quoted, but critical non-compliances)
    complianceScore: 61,
    riskLevel: 'HIGH',
    finalOfficerStatus: 'PENDING_OFFICER_DECISION',
    categoryBreakdown: {
      technicalPassed: 4,
      technicalTotal: 5,
      eligibilityPassed: 1,
      eligibilityTotal: 4,
      financialPassed: 1,
      financialTotal: 3,
      documentationPassed: 3,
      documentationTotal: 4,
      legalPassed: 2,
      legalTotal: 2
    },
    documents: [
      {
        id: 'DOC-NG-01',
        name: 'GST_Certificate_NextGen.pdf',
        docType: 'GST_CERTIFICATE',
        fileSize: '1.1 MB',
        uploadDate: '2026-09-01',
        totalPages: 2,
        aiProcessed: true,
        ocrConfidence: 98.8,
        extractedTextPreview: 'GSTIN: 08AABCN9912D1ZX. Legal Name: NEXTGEN INFOTECH PVT LTD. Registered Address: Jaipur, Rajasthan. Status: ACTIVE.',
        extractedFields: { gstin: '08AABCN9912D1ZX', status: 'ACTIVE', legalName: 'NEXTGEN INFOTECH PVT LTD' }
      },
      {
        id: 'DOC-NG-02',
        name: 'PAN_NextGen.pdf',
        docType: 'PAN_CARD',
        fileSize: '410 KB',
        uploadDate: '2026-09-01',
        totalPages: 1,
        aiProcessed: true,
        ocrConfidence: 99.1,
        extractedTextPreview: 'PAN: AABCN9912D. Name: NEXTGEN INFOTECH PRIVATE LIMITED.',
        extractedFields: { pan: 'AABCN9912D' }
      },
      {
        id: 'DOC-NG-03',
        name: 'Audited_Financials.pdf',
        docType: 'AUDITED_FINANCIALS',
        fileSize: '6.2 MB',
        uploadDate: '2026-09-01',
        totalPages: 22,
        aiProcessed: true,
        ocrConfidence: 97.4,
        extractedTextPreview: 'Page 8: CA TURNOVER SUMMARY (UDIN: 24089124XYZ091). FY 2022-23: ₹3.90 Crore, FY 2023-24: ₹4.30 Crore, FY 2024-25: ₹4.40 Crore. Three-Year Average Annual Turnover: ₹4.20 Crore.',
        extractedFields: { avgTurnoverCr: 4.20, fy23Turnover: 3.90, fy24Turnover: 4.30, fy25Turnover: 4.40 }
      },
      {
        id: 'DOC-NG-04',
        name: 'Lenovo_Desktop_Specifications.pdf',
        docType: 'TECH_SPEC_SHEET',
        fileSize: '3.1 MB',
        uploadDate: '2026-09-01',
        totalPages: 8,
        aiProcessed: true,
        ocrConfidence: 98.5,
        extractedTextPreview: 'Lenovo ThinkCentre neo 50t. Intel Core i5-13400 (Quoted Core i5 instead of mandatory Core i7). RAM: 16GB DDR4 (Quoted DDR4 instead of DDR5). 512GB SSD.',
        extractedFields: { cpu: 'Intel Core i5-13400', ram: '16GB DDR4', storage: '512GB SSD' }
      },
      {
        id: 'DOC-NG-05',
        name: 'Experience_Proof_NextGen.pdf',
        docType: 'EXPERIENCE_CERTIFICATE',
        fileSize: '2.2 MB',
        uploadDate: '2026-09-01',
        totalPages: 4,
        aiProcessed: true,
        ocrConfidence: 91.0,
        extractedTextPreview: 'Supplied 180 desktops to Rajasthan State Seeds Corp in 2024. Commercial IT operations started in January 2024 (Span: 1.6 years).',
        extractedFields: { experienceYears: 1.6, singleOrderVolume: 180 }
      }
    ],
    results: [
      {
        requirementId: 'REQ-001',
        status: 'NON_COMPLIANT',
        expectedValue: 'Intel Core i7 13th Gen (13700) or higher',
        detectedValue: 'Intel Core i5-13400 (Lower Tier CPU)',
        difference: 'Quoted Core i5 instead of mandatory Core i7',
        reason: 'Quoted processor (Core i5-13400) fails the minimum Core i7 13th Gen mandatory benchmark requirement.',
        aiExplanation: 'Tender clause 3.1.1 strictly mandates Intel Core i7 13th Gen or equivalent. The uploaded specification datasheet confirms Lenovo ThinkCentre with Intel Core i5-13400 (10 cores vs 16 cores).',
        evidence: {
          requirementId: 'REQ-001',
          documentName: 'Lenovo_Desktop_Specifications.pdf',
          pageNumber: 2,
          fieldName: 'cpu_model',
          detectedValue: 'Intel Core i5-13400',
          detectedTextSnippet: 'CPU: Intel Core i5-13400 (6 Performance Cores, 4 Efficient Cores, up to 4.60 GHz)',
          confidenceScore: 99,
          extractionTimestamp: '2026-09-01T16:25:00Z'
        },
        confidence: 99
      },
      {
        requirementId: 'REQ-002',
        status: 'NON_COMPLIANT',
        expectedValue: 'Min 16 GB DDR5 4800 MHz',
        detectedValue: '16 GB DDR4 3200 MHz',
        difference: 'DDR4 memory offered instead of mandatory DDR5 4800 MHz',
        reason: 'DDR4 architecture does not comply with DDR5 specification.',
        evidence: {
          requirementId: 'REQ-002',
          documentName: 'Lenovo_Desktop_Specifications.pdf',
          pageNumber: 3,
          fieldName: 'memory_type',
          detectedValue: '16 GB DDR4 3200 MHz',
          detectedTextSnippet: 'Memory: 16 GB (1x16GB) DDR4 UDIMM 3200MHz',
          confidenceScore: 98,
          extractionTimestamp: '2026-09-01T16:25:00Z'
        },
        confidence: 98
      },
      {
        requirementId: 'REQ-003',
        status: 'COMPLIANT',
        expectedValue: '512 GB PCIe Gen4 NVMe SSD',
        detectedValue: '512 GB NVMe SSD',
        confidence: 97,
        reason: 'Storage capacity compliant.'
      },
      {
        requirementId: 'REQ-004',
        status: 'COMPLIANT',
        expectedValue: 'Energy Star 8.0 / BEE',
        detectedValue: 'Energy Star 8.0 certified',
        confidence: 96,
        reason: 'Energy Star certified.'
      },
      {
        requirementId: 'REQ-005',
        status: 'COMPLIANT',
        expectedValue: '3 Years Comprehensive Warranty',
        detectedValue: '3 Years On-site OEM Warranty',
        confidence: 97,
        reason: 'Warranty terms verified.'
      },
      {
        requirementId: 'REQ-006',
        status: 'NON_COMPLIANT',
        expectedValue: '>= 3.0 years relevant experience',
        detectedValue: '1.6 years',
        difference: '1.4 years below mandatory 3.0 years requirement',
        reason: 'Bidder has only 1.6 years commercial experience; minimum 3 years required.',
        aiExplanation: 'Incorporated recently; first commercial delivery recorded in Jan 2024. Fails mandatory eligibility threshold.',
        evidence: {
          requirementId: 'REQ-006',
          documentName: 'Experience_Proof_NextGen.pdf',
          pageNumber: 1,
          fieldName: 'experience_span',
          detectedValue: '1.6 years',
          detectedTextSnippet: 'Commercial IT operations started in January 2024 (total continuous operational duration: 1.6 years)',
          confidenceScore: 96,
          extractionTimestamp: '2026-09-01T16:25:00Z'
        },
        confidence: 96
      },
      {
        requirementId: 'REQ-007',
        status: 'NON_COMPLIANT',
        expectedValue: '>= 500 units single contract',
        detectedValue: '180 units',
        difference: '320 units below mandatory single contract volume',
        reason: 'Single order volume was 180 units; tender requirement is 500 units.',
        confidence: 95
      },
      {
        requirementId: 'REQ-008',
        status: 'NON_COMPLIANT',
        expectedValue: 'Valid ISO 9001:2015 certificate',
        detectedValue: 'Evidence not found in uploaded documents.',
        difference: 'Mandatory ISO 9001 certificate missing from bid submission',
        reason: 'ISO 9001:2015 certificate not uploaded by vendor.',
        aiExplanation: 'The vendor did not enclose any ISO 9001 quality certificate in their technical bid document package.',
        confidence: 100
      },
      {
        requirementId: 'REQ-009',
        status: 'NEEDS_REVIEW',
        expectedValue: 'Service center in Delhi NCR',
        detectedValue: 'Headquartered in Jaipur; third-party partner in Delhi claimed without agreement',
        reason: 'No direct service center in Delhi NCR; third party MoU unnotarized.',
        confidence: 80
      },
      {
        requirementId: 'REQ-010',
        status: 'NON_COMPLIANT',
        expectedValue: '>= ₹5.00 Crore',
        detectedValue: '₹4.20 Crore',
        difference: '₹0.80 Crore below mandatory threshold',
        reason: 'Vendor average annual turnover is below the mandatory threshold.',
        aiExplanation: 'The extracted average annual turnover is ₹4.20 Crore across FY23, FY24, and FY25, which is ₹0.80 Crore below the mandatory threshold of ₹5.00 Crore specified in tender Clause 5.1.1.',
        evidence: {
          requirementId: 'REQ-010',
          documentName: 'Audited_Financials.pdf',
          pageNumber: 8,
          fieldName: 'avg_turnover',
          detectedValue: '₹4.20 Crore',
          detectedTextSnippet: 'Page 8: Three-Year Average Annual Turnover: ₹4.20 Crore (FY23: ₹3.90 Cr, FY24: ₹4.30 Cr, FY25: ₹4.40 Cr)',
          confidenceScore: 97,
          extractionTimestamp: '2026-09-01T16:25:00Z'
        },
        confidence: 97
      },
      {
        requirementId: 'REQ-011',
        status: 'NON_COMPLIANT',
        expectedValue: '>= ₹1.50 Crore Bank Solvency',
        detectedValue: '₹80 Lakhs (₹0.80 Crore)',
        difference: '₹0.70 Crore deficit in bank solvency certificate',
        reason: 'Bank solvency of ₹80 Lakhs is below mandatory ₹1.50 Crore requirement.',
        confidence: 97
      },
      {
        requirementId: 'REQ-012',
        status: 'COMPLIANT',
        expectedValue: 'Positive Net Worth',
        detectedValue: 'Positive Net Worth',
        confidence: 96,
        reason: 'Net worth is positive.'
      },
      {
        requirementId: 'REQ-013',
        status: 'COMPLIANT',
        expectedValue: 'Valid Active GSTIN',
        detectedValue: '08AABCN9912D1ZX (Active)',
        confidence: 99,
        reason: 'Active GST registration.'
      },
      {
        requirementId: 'REQ-014',
        status: 'COMPLIANT',
        expectedValue: 'Valid PAN',
        detectedValue: 'AABCN9912D',
        confidence: 99,
        reason: 'PAN matches.'
      },
      {
        requirementId: 'REQ-015',
        status: 'NON_COMPLIANT',
        expectedValue: 'OEM MAF matching tender ref GEM/2026/B/10234',
        detectedValue: 'Generic dealership certificate, not tender-specific MAF',
        difference: 'No tender-specific Manufacturer Authorization Form',
        reason: 'Dealership certificate attached without specific authorization for Tender GEM/2026/B/10234.',
        confidence: 94
      },
      {
        requirementId: 'REQ-016',
        status: 'COMPLIANT',
        expectedValue: 'EMD ₹1,00,000 or MSME Exemption',
        detectedValue: 'FDR receipt of ₹1,00,000 enclosed',
        confidence: 98,
        reason: 'EMD deposited.'
      },
      {
        requirementId: 'REQ-017',
        status: 'COMPLIANT',
        expectedValue: 'Notarized Affidavit on ₹100 Stamp',
        detectedValue: 'Affidavit submitted',
        confidence: 96,
        reason: 'Non-blacklisting affidavit enclosed.'
      },
      {
        requirementId: 'REQ-018',
        status: 'COMPLIANT',
        expectedValue: 'GFR 144(xi) Land Border compliance',
        detectedValue: 'GFR 144(xi) signed certificate enclosed',
        confidence: 97,
        reason: 'Land border declaration submitted.'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-09-08 10:45:18',
    officerName: 'Rajesh V. Sharma',
    officerId: 'OFF-7829',
    action: 'Compliance Engine Evaluated',
    tenderId: 'GEM/2026/B/10234',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    result: 'Compliance Score: 92% (16 Compliant, 1 Non-Compliant, 1 Needs Review)',
    details: 'Automated deterministic rule evaluation executed across 18 tender clauses and 9 vendor documents.',
    ipAddress: '10.24.112.4'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-09-08 10:39:04',
    officerName: 'Rajesh V. Sharma',
    officerId: 'OFF-7829',
    action: 'Bid Documents Ingested & Analyzed',
    tenderId: 'GEM/2026/B/10234',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    result: '9 Documents Processed (Average OCR Confidence: 97.4%)',
    details: 'AI parsed GSTIN, PAN, CA Turnover Certificate, ISO 9001 and technical specs.',
    ipAddress: '10.24.112.4'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-09-08 10:34:12',
    officerName: 'Rajesh V. Sharma',
    officerId: 'OFF-7829',
    action: 'AI Tender Requirement Checklist Generated',
    tenderId: 'GEM/2026/B/10234',
    result: '18 Requirements Extracted across 5 Categories',
    details: 'Gemini AI extracted 5 Technical, 4 Eligibility, 3 Financial, 4 Documentation, 2 Legal requirements.',
    ipAddress: '10.24.112.4'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-09-08 10:32:00',
    officerName: 'Rajesh V. Sharma',
    officerId: 'OFF-7829',
    action: 'Tender Document Uploaded',
    tenderId: 'GEM/2026/B/10234',
    result: 'Tender_GEM_2026_B_10234.pdf (4.6 MB, 48 pages)',
    details: 'Uploaded into secure government repository for RFP parsing.',
    ipAddress: '10.24.112.4'
  },
  {
    id: 'AUD-905',
    timestamp: '2026-09-07 16:15:22',
    officerName: 'Priya Narayanan',
    officerId: 'OFF-4102',
    action: 'Simulated Registry Verification Run',
    tenderId: 'GEM/2026/B/10234',
    vendorName: 'Bharat Digital Solutions',
    result: 'GST Active, ISO Expired',
    details: 'Mock API call to GSTN returned Active; ISO registry flagged certificate expiry as of 12-Aug-2026.',
    ipAddress: '10.24.112.19'
  }
];

export const INITIAL_VERIFICATION_RECORDS: ExternalVerificationRecord[] = [
  {
    id: 'VER-GST-01',
    type: 'GST',
    targetIdentifier: '07AAACT2938K1ZX',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    status: 'VERIFIED',
    verifiedAt: '2026-09-08T09:12:00Z',
    isSimulated: true,
    registrySource: 'Goods & Services Tax Network (GSTN API - Demo)',
    details: {
      tradeName: 'TechNova Systems',
      status: 'Active',
      taxpayerType: 'Regular',
      stateJurisdiction: 'Ward 84, Delhi',
      filingFrequency: 'Monthly (GSTR-3B filed up to July 2026)'
    }
  },
  {
    id: 'VER-PAN-01',
    type: 'PAN',
    targetIdentifier: 'AAACT2938K',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    status: 'VERIFIED',
    verifiedAt: '2026-09-08T09:12:05Z',
    isSimulated: true,
    registrySource: 'Income Tax Department (NSDL/Protean Database - Demo)',
    details: {
      panStatus: 'Valid and Active',
      category: 'Company',
      aadhaarSeeding: 'Not Applicable (Corporate)'
    }
  },
  {
    id: 'VER-UDYAM-01',
    type: 'UDYAM',
    targetIdentifier: 'UDYAM-DL-02-0081921',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    status: 'VERIFIED',
    verifiedAt: '2026-09-08T09:12:10Z',
    isSimulated: true,
    registrySource: 'Ministry of Micro, Small and Medium Enterprises (MSME Portal - Demo)',
    details: {
      classification: 'Medium Enterprise',
      majorActivity: 'Manufacturing & IT Services',
      nicCodes: ['26201 - Manufacture of electronic computers', '62020 - Computer consultancy']
    }
  },
  {
    id: 'VER-ISO-01',
    type: 'ISO_9001',
    targetIdentifier: 'QM-2021-9871',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    status: 'UNVERIFIED',
    verifiedAt: '2026-09-08T09:12:15Z',
    isSimulated: true,
    registrySource: 'International Accreditation Forum (IAF CertSearch - Demo)',
    details: {
      standard: 'ISO 9001:2015',
      statusMessage: 'Certificate record found, but expiry date requires re-validation due to unreadable seal in upload.'
    }
  },
  {
    id: 'VER-MCA-01',
    type: 'MCA_PORTAL',
    targetIdentifier: 'U72200DL2014PTC267812',
    vendorName: 'TechNova Systems Pvt. Ltd.',
    status: 'VERIFIED',
    verifiedAt: '2026-09-08T09:12:20Z',
    isSimulated: true,
    registrySource: 'Ministry of Corporate Affairs (MCA21 Portal - Demo)',
    details: {
      cin: 'U72200DL2014PTC267812',
      companyClass: 'Private Limited',
      authorizedCapitalINR: 10000000,
      paidUpCapitalINR: 7500000,
      dateOfIncorporation: '12/04/2014',
      status: 'Active'
    }
  }
];
