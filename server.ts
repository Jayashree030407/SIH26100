import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
// @ts-ignore
import { PDFParse } from "pdf-parse";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// In-memory IP rate limiter for SIH Hackathon security
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
function rateLimiter(maxRequests: number = 60, windowMs: number = 60000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Only apply rate limiting to /api/* routes
    if (!req.path.startsWith('/api/')) return next();
    
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const entry = rateLimitStore.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count++;
    rateLimitStore.set(ip, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: "Rate limit exceeded. Maximum 60 requests/minute per client in demo mode.",
        retryAfterMs: entry.resetAt - now
      });
    }

    next();
  };
}

app.use(rateLimiter(90, 60000));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "ProcureAI",
    version: "2026.1.0",
    sihProblem: "SIH26100",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Standard baseline requirements for deterministic fallback
const BASELINE_FALLBACK_REQUIREMENTS = [
  {
    id: "REQ-001",
    category: "Technical",
    clauseRef: "Clause 3.1.1",
    description: "Processor benchmark: Intel Core i7 13th Gen or AMD Ryzen 7 7700 or higher (Min 8 cores, 16 threads)",
    mandatory: true,
    verificationType: "specification",
    evidenceRequired: "Technical Specification Sheet & OEM Datasheet",
    expectedValue: "Intel Core i7 13th Gen or higher",
    ruleDescription: "CPU model must meet or exceed Core i7 13th Gen specifications"
  },
  {
    id: "REQ-002",
    category: "Technical",
    clauseRef: "Clause 3.1.2",
    description: "System Memory: Minimum 16 GB DDR5 4800 MHz RAM expandable to 64 GB with dual channel support",
    mandatory: true,
    verificationType: "specification",
    evidenceRequired: "OEM Technical Datasheet",
    expectedValue: "16 GB DDR5 4800 MHz",
    ruleDescription: "Memory capacity >= 16 GB and technology must be DDR5"
  },
  {
    id: "REQ-003",
    category: "Technical",
    clauseRef: "Clause 3.1.3",
    description: "Storage: Minimum 512 GB PCIe Gen 4 M.2 NVMe SSD with read speed >= 3000 MB/s",
    mandatory: true,
    verificationType: "specification",
    evidenceRequired: "Storage Spec Sheet & Benchmark declaration",
    expectedValue: "512 GB PCIe Gen 4 NVMe SSD",
    ruleDescription: "Storage type must be NVMe SSD >= 512 GB"
  },
  {
    id: "REQ-004",
    category: "Technical",
    clauseRef: "Clause 3.2.4",
    description: "Environmental & Energy Compliance: BEE Star 5 Star rating or Energy Star 8.0 certified or RoHS compliant",
    mandatory: true,
    verificationType: "certificate",
    evidenceRequired: "BEE / Energy Star / RoHS Test Report Certificate",
    expectedValue: "Energy Star 8.0 / BEE 5-Star",
    ruleDescription: "Valid environmental certification must be enclosed"
  },
  {
    id: "REQ-005",
    category: "Technical",
    clauseRef: "Clause 3.4.1",
    description: "Warranty: 3 Years comprehensive on-site OEM warranty with 24x7 call logging facility & next business day response",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "OEM Warranty Commitment Undertaking",
    expectedValue: "3 Years Onsite OEM Warranty",
    ruleDescription: "Warranty period >= 3 years and on-site support commitment"
  },
  {
    id: "REQ-006",
    category: "Eligibility",
    clauseRef: "Clause 4.1.1",
    description: "Relevant Experience: Bidder must have minimum 3 years of continuous commercial experience in IT hardware supply to Gov/PSU/Corporates",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "Experience Certificate / Work Completion Orders",
    expectedValue: ">= 3.0 years",
    ruleDescription: "Documented experience >= 3.0 years"
  },
  {
    id: "REQ-007",
    category: "Eligibility",
    clauseRef: "Clause 4.1.2",
    description: "Prior Supply Volume: Must have successfully supplied at least 500 units of desktop computers in a single contract during the last 3 financial years",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "Satisfactory Performance Certificates from Clients",
    expectedValue: ">= 500 units single contract",
    ruleDescription: "Single order volume >= 500 units"
  },
  {
    id: "REQ-008",
    category: "Eligibility",
    clauseRef: "Clause 4.2.3",
    description: "Quality Management Certification: Bidder or OEM must possess valid ISO 9001:2015 certification for manufacturing / system integration",
    mandatory: true,
    verificationType: "certificate",
    evidenceRequired: "ISO 9001:2015 Certificate copy",
    expectedValue: "Active unexpired ISO 9001:2015",
    ruleDescription: "Must hold active ISO 9001 certification with unexpired validity"
  },
  {
    id: "REQ-009",
    category: "Eligibility",
    clauseRef: "Clause 4.3.1",
    description: "Local Service Center Network: Must maintain a functional service center in Delhi NCR / State Capital with spare inventory",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "Service Center Escalation Matrix & Rent/Ownership Agreement",
    expectedValue: "Functional Local Service Center",
    ruleDescription: "Dedicated service infrastructure declaration"
  },
  {
    id: "REQ-010",
    category: "Financial",
    clauseRef: "Clause 5.1.1",
    description: "Average Annual Turnover: Bidder must have average annual financial turnover of at least ₹5.00 Crore across last 3 audited fiscal years",
    mandatory: true,
    verificationType: "financial_metric",
    evidenceRequired: "CA Certified Turnover Certificate with UDIN & Audited Balance Sheets",
    expectedValue: ">= ₹5.00 Crore",
    ruleDescription: "Turnover >= 5.00 Cr"
  },
  {
    id: "REQ-011",
    category: "Financial",
    clauseRef: "Clause 5.1.2",
    description: "Bank Solvency: Valid Bank Solvency Certificate of minimum ₹1.50 Crore issued by any Scheduled Commercial Bank within last 6 months",
    mandatory: true,
    verificationType: "financial_metric",
    evidenceRequired: "Bank Solvency Certificate on Bank Letterhead with IFSC/Branch details",
    expectedValue: ">= ₹1.50 Crore",
    ruleDescription: "Solvency amount >= 1.50 Cr"
  },
  {
    id: "REQ-012",
    category: "Financial",
    clauseRef: "Clause 5.2.1",
    description: "Net Worth: Bidder must have positive net worth in each of the last three audited financial years",
    mandatory: true,
    verificationType: "financial_metric",
    evidenceRequired: "Audited Financial Statements / Balance Sheet Net Worth summary",
    expectedValue: "Positive Net Worth across all 3 years",
    ruleDescription: "Net worth > 0 for all 3 years"
  },
  {
    id: "REQ-013",
    category: "Documentation",
    clauseRef: "Clause 6.1.1",
    description: "Goods and Services Tax: Valid GSTIN registration certificate with active tax filing status",
    mandatory: true,
    verificationType: "registry_lookup",
    evidenceRequired: "GST Registration Certificate (Form GST REG-06)",
    expectedValue: "Active GSTIN",
    ruleDescription: "GSTIN must be verified active and registered in India"
  },
  {
    id: "REQ-014",
    category: "Documentation",
    clauseRef: "Clause 6.1.2",
    description: "Permanent Account Number: PAN card registration copy in company / firm legal name",
    mandatory: true,
    verificationType: "registry_lookup",
    evidenceRequired: "PAN Card Copy & Income Tax Returns acknowledgment",
    expectedValue: "Valid Corporate PAN",
    ruleDescription: "PAN must match entity name"
  },
  {
    id: "REQ-015",
    category: "Documentation",
    clauseRef: "Clause 6.2.1",
    description: "Manufacturer Authorization Form (MAF): OEM Authorization specifically addressed to this Tender Number authorizing bidder to quote and support",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "MAF signed by Authorized Signatory of OEM on official stationery",
    expectedValue: "Valid OEM Authorization Form",
    ruleDescription: "Valid MAF matching tender reference"
  },
  {
    id: "REQ-016",
    category: "Documentation",
    clauseRef: "Clause 6.3.2",
    description: "Bid Security / EMD or Exemption: Submission of Earnest Money Deposit OR valid MSME/Udyam Registration certificate for EMD exemption",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "EMD Bank Guarantee / FDR receipt or Udyam Certificate",
    expectedValue: "EMD Deposit or Valid MSME Exemption",
    ruleDescription: "EMD proof or valid MSME certificate"
  },
  {
    id: "REQ-017",
    category: "Legal",
    clauseRef: "Clause 7.1.1",
    description: "Non-Blacklisting Undertaking: Self-declaration on Non-Judicial stamp paper of ₹100/- duly notarized that the firm is not debarred or blacklisted by any Central/State Gov/PSU",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "Notarized Affidavit on ₹100 Stamp Paper",
    expectedValue: "Notarized Affidavit on ₹100 Stamp Paper",
    ruleDescription: "Affidavit dated within 30 days of bid submission"
  },
  {
    id: "REQ-018",
    category: "Legal",
    clauseRef: "Clause 7.2.1",
    description: "Land Border Sharing Compliance: Compliance certificate under Rule 144(xi) of General Financial Rules (GFR), 2017 regarding beneficial ownership from countries sharing land border with India",
    mandatory: true,
    verificationType: "document",
    evidenceRequired: "GFR 144(xi) Compliance Undertaking on Bidder Letterhead",
    expectedValue: "Rule 144(xi) Declaration",
    ruleDescription: "Mandatory statutory national security compliance declaration"
  }
];

// Helper to validate and sanitize Gemini output against schema
function validateAndSanitizeRequirements(rawList: any[]): any[] | null {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const validCategories = new Set(["Technical", "Eligibility", "Financial", "Documentation", "Legal"]);
  const validVerificationTypes = new Set(["document", "financial_metric", "certificate", "registry_lookup", "specification"]);

  const sanitized: any[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== "object") continue;

    const id = typeof item.id === "string" && item.id.trim() ? item.id.trim() : `REQ-${String(i + 1).padStart(3, '0')}`;
    const category = validCategories.has(item.category) ? item.category : "Technical";
    const clauseRef = typeof item.clauseRef === "string" ? item.clauseRef.trim() : `Clause ${i + 1}.1`;
    const description = typeof item.description === "string" && item.description.trim() ? item.description.trim() : `Requirement ${i + 1}`;
    const mandatory = typeof item.mandatory === "boolean" ? item.mandatory : true;
    const verificationType = validVerificationTypes.has(item.verificationType) ? item.verificationType : "document";
    const evidenceRequired = typeof item.evidenceRequired === "string" ? item.evidenceRequired.trim() : "Documentary Evidence";
    const expectedValue = item.expectedValue !== undefined ? String(item.expectedValue) : undefined;
    const ruleDescription = typeof item.ruleDescription === "string" ? item.ruleDescription.trim() : "Deterministic rule verification";

    sanitized.push({
      id,
      category,
      clauseRef,
      description,
      mandatory,
      verificationType,
      evidenceRequired,
      expectedValue,
      ruleDescription
    });
  }

  return sanitized.length > 0 ? sanitized : null;
}

// 2. Real Document Ingestion: Extract Text from Uploaded PDF
app.post("/api/extract-pdf", async (req, res) => {
  try {
    const { base64, filename } = req.body;

    if (!base64 || typeof base64 !== "string") {
      return res.status(400).json({ error: "Missing or invalid base64 PDF data." });
    }

    // Strip metadata header if present (e.g., "data:application/pdf;base64,")
    const cleanBase64 = base64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    if (pdfBuffer.length === 0) {
      return res.status(400).json({ error: "Empty PDF buffer received." });
    }

    const parser = new PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();
    const rawText = (textResult.text || "").trim();
    const pageCount = textResult.total || 1;
    await parser.destroy();

    // Check if the PDF has a readable embedded text layer or is scanned/image-only
    const isScannedImageOnly = rawText.length < 40;

    if (isScannedImageOnly) {
      return res.json({
        success: true,
        text: "",
        rawLength: rawText.length,
        pageCount,
        isScannedImageOnly: true,
        warning: "Scanned / Image-Only PDF: No embedded text stream detected. OCR is not configured in this demo environment. Document flagged for manual officer examination.",
        filename: filename || "uploaded_document.pdf"
      });
    }

    res.json({
      success: true,
      text: rawText,
      rawLength: rawText.length,
      pageCount,
      isScannedImageOnly: false,
      filename: filename || "uploaded_document.pdf"
    });
  } catch (err: any) {
    console.error("PDF extraction error:", err);
    res.status(500).json({
      error: "Failed to parse PDF document. The file may be corrupt or encrypted.",
      isScannedImageOnly: true,
      warning: "Failed to extract text. Manual review required."
    });
  }
});

// 3. Analyze Tender Document & Extract Checklist Clauses
app.post("/api/analyze-tender", async (req, res) => {
  try {
    const { title, tenderText, category } = req.body;

    // Request Validation
    if (!title && !tenderText) {
      return res.status(400).json({ error: "Tender title or RFP text snippet is required." });
    }

    const ai = getGeminiClient();

    if (ai && tenderText) {
      try {
        const prompt = `You are a Senior Government Procurement Compliance Officer analyzing an RFP / Tender document for the GeM (Government e-Marketplace) portal in India (SIH26100).
Analyze the provided tender text and extract 12 to 18 structured procurement requirements across 5 categories:
- Technical
- Eligibility
- Financial
- Documentation
- Legal

For each requirement, provide an object with:
id: "REQ-001" onwards
category: Exactly one of ["Technical", "Eligibility", "Financial", "Documentation", "Legal"]
clauseRef: e.g. "Clause 3.1.1"
description: Precise statement of the tender requirement
mandatory: boolean (true for essential qualifying criteria)
verificationType: One of ["document", "financial_metric", "certificate", "registry_lookup", "specification"]
evidenceRequired: Specific document/proof required from bidder
expectedValue: numeric or string expected threshold if applicable
ruleDescription: concise logic for deterministic evaluation

Return ONLY valid JSON matching an array of objects.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `${prompt}\n\nTender Title: ${title || 'Supply of Desktop Computers'}\nCategory: ${category || 'IT Hardware'}\nTender Text:\n${(tenderText || '').slice(0, 5000)}`,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text?.trim() || "";
        const parsed = JSON.parse(text);
        const validated = validateAndSanitizeRequirements(parsed);

        if (validated && validated.length >= 5) {
          return res.json({
            success: true,
            requirements: validated,
            source: "gemini-3.8-flash",
            requirementsCount: validated.length,
            isFallback: false
          });
        }
      } catch (geminiError) {
        console.warn("Gemini tender extraction fallback:", geminiError);
      }
    }

    // Safe, verified deterministic fallback with all 18 requirements
    const adaptedRequirements = BASELINE_FALLBACK_REQUIREMENTS.map((req, idx) => ({
      ...req,
      id: `REQ-${String(idx + 1).padStart(3, '0')}`
    }));

    res.json({
      success: true,
      requirements: adaptedRequirements,
      source: "deterministic_rules_db",
      requirementsCount: adaptedRequirements.length,
      isFallback: true,
      categories: {
        Technical: 5,
        Eligibility: 4,
        Financial: 3,
        Documentation: 4,
        Legal: 2,
      },
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to analyze tender" });
  }
});

// 4. Explain Flag / Compliance Anomaly (Why Flagged?)
app.post("/api/explain-flag", async (req, res) => {
  try {
    const { requirementDescription, expectedValue, detectedValue, difference, documentName, pageNumber } = req.body;

    if (!requirementDescription) {
      return res.status(400).json({ error: "Requirement description is required." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `As a senior Government Procurement Audit Officer, write a clear, objective, explainable justification for why this vendor bid requirement was flagged as NON-COMPLIANT or NEEDS REVIEW.
Requirement: ${requirementDescription}
Expected Standard: ${expectedValue || 'As per tender specification'}
Detected in Vendor Bid: ${detectedValue || 'Not detected'}
Difference/Shortfall: ${difference || 'Discrepancy detected'}
Document Reference: ${documentName || 'Bid Dossier'}, Page: ${pageNumber || 1}

Explain in 3 concise, objective sentences:
1. The exact factual shortfall or ambiguity.
2. The specific procurement risk if overlooked.
3. The recommended officer action (e.g. rejection under CPPP rules, request clarification under Rule 144, or verification committee inspection).
Free of hype, completely professional for official audit records.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        const explanation = response.text?.trim();
        if (explanation && explanation.length > 20) {
          return res.json({
            success: true,
            explanation,
            source: "gemini-3.8-flash",
          });
        }
      } catch (geminiError) {
        console.warn("Gemini explain fallback:", geminiError);
      }
    }

    // Deterministic fallback explanation
    const fallbackExplanation = `The extracted value "${detectedValue || 'Unverified'}" fails to satisfy the mandatory threshold of "${expectedValue || 'RFP specification'}" specified in the tender clause. Document citation: ${documentName || 'Uploaded Dossier'} (Page ${pageNumber || 1}). Under public procurement guidelines, this discrepancy constitutes a material deviation unless substantiated via official clarification.`;
    res.json({
      success: true,
      explanation: fallbackExplanation,
      source: "deterministic_engine",
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

// 5. Simulated External Government Verification Service (GST, PAN, Udyam, ISO, MCA)
// Structured modularly with simulated registry adapters
const REGISTRY_ADAPTERS = {
  GST: (identifier: string, vendorName: string) => {
    const isValid = identifier && identifier.length === 15;
    return {
      type: "GST",
      targetIdentifier: identifier,
      vendorName,
      status: isValid ? "VERIFIED" : "MISMATCH",
      isSimulated: true,
      label: "Demo / Simulated Registry",
      registrySource: "Goods & Services Tax Network (GSTN API - Demo Registry)",
      verifiedAt: new Date().toISOString(),
      details: {
        gstinStatus: isValid ? "Active" : "Invalid Format / Unregistered",
        taxpayerType: "Regular",
        legalName: vendorName,
        jurisdiction: "State & Central Tax Office, Division II",
        lastGstrFilingDate: "2026-08-20",
        complianceRating: isValid ? "9.6 / 10" : "Unrated",
      },
    };
  },
  PAN: (identifier: string, vendorName: string) => {
    const isValid = identifier && identifier.length === 10;
    return {
      type: "PAN",
      targetIdentifier: identifier,
      vendorName,
      status: isValid ? "VERIFIED" : "MISMATCH",
      isSimulated: true,
      label: "Demo / Simulated Registry",
      registrySource: "Income Tax Department (Protean / NSDL Database - Demo)",
      verifiedAt: new Date().toISOString(),
      details: {
        panStatus: isValid ? "Valid & Active" : "Unverified",
        holderCategory: "Company",
        nameOnPan: vendorName,
        incorporationMatch: isValid ? "100% Match" : "Mismatch",
      },
    };
  },
  UDYAM: (identifier: string, vendorName: string) => {
    return {
      type: "UDYAM",
      targetIdentifier: identifier,
      vendorName,
      status: "VERIFIED",
      isSimulated: true,
      label: "Demo / Simulated Registry",
      registrySource: "Ministry of MSME (Udyam Registration Portal - Demo)",
      verifiedAt: new Date().toISOString(),
      details: {
        enterpriseType: "Medium Enterprise",
        majorActivity: "Manufacturing & Services",
        eligibleForEmdExemption: true,
        districtIndustryCentre: "Okhla / New Delhi",
      },
    };
  },
  ISO_9001: (identifier: string, vendorName: string) => {
    const isExpired = identifier?.includes("EXPIRED") || identifier?.includes("BHARAT");
    return {
      type: "ISO_9001",
      targetIdentifier: identifier,
      vendorName,
      status: isExpired ? "EXPIRED" : "VERIFIED",
      isSimulated: true,
      label: "Demo / Simulated Registry",
      registrySource: "International Accreditation Forum (IAF CertSearch - Demo)",
      verifiedAt: new Date().toISOString(),
      details: {
        standard: "ISO 9001:2015 Quality Management",
        accreditationBody: "NABCB / UKAS",
        statusMessage: isExpired ? "Certificate validity expired; recertification verification required" : "Active & in good standing",
      },
    };
  },
  MCA_PORTAL: (identifier: string, vendorName: string) => {
    return {
      type: "MCA_PORTAL",
      targetIdentifier: identifier || "U72200DL2014PTC267812",
      vendorName,
      status: "VERIFIED",
      isSimulated: true,
      label: "Demo / Simulated Registry",
      registrySource: "Ministry of Corporate Affairs (MCA21 V3 - Demo)",
      verifiedAt: new Date().toISOString(),
      details: {
        cin: identifier || "U72200DL2014PTC267812",
        companyStatus: "Active",
        classOfCompany: "Private Limited",
        chargesRegistered: "None Outstanding",
      },
    };
  }
};

app.post("/api/verify/external", (req, res) => {
  const { type, identifier, vendorName } = req.body;

  if (!type || typeof type !== "string") {
    return res.status(400).json({ error: "Missing verification type." });
  }

  const adapter = REGISTRY_ADAPTERS[type as keyof typeof REGISTRY_ADAPTERS];
  if (adapter) {
    return res.json(adapter(identifier || "", vendorName || "Bidder Entity"));
  }

  res.status(400).json({ error: "Unsupported verification type" });
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProcureAI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
