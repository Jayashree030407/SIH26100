import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tender,
  VendorBid,
  OfficerUser,
  AuditLogEntry,
  ExternalVerificationRecord,
  RequirementComplianceResult,
  TenderRequirement,
  ComplianceStatus,
  OfficerRole
} from '../types';
import {
  DEMO_APPROVER,
  DEMO_EVALUATOR,
  SAMPLE_TENDER,
  OTHER_TENDERS,
  SAMPLE_BIDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_VERIFICATION_RECORDS
} from '../data/sampleData';
import { evaluateBidCompliance } from '../services/complianceEngine';

const STORAGE_KEYS = {
  TENDERS: 'procureai_tenders_sih26100',
  BIDS: 'procureai_bids_sih26100',
  AUDIT_LOGS: 'procureai_audit_logs_sih26100',
  VERIFICATION: 'procureai_verification_sih26100',
  USER: 'procureai_user_sih26100',
  AUTH: 'procureai_auth_sih26100',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (_e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_e) {
    // quota exceeded or private mode
  }
}

const computeInitialBids = (rawBids: VendorBid[], defaultRequirements: TenderRequirement[]): VendorBid[] => {
  return rawBids.map(bid => {
    const evalResult = evaluateBidCompliance(defaultRequirements, bid.documents || [], bid.results);
    return {
      ...bid,
      complianceScore: evalResult.complianceScore,
      riskLevel: evalResult.riskLevel,
      results: evalResult.results,
      categoryBreakdown: evalResult.categoryBreakdown
    };
  });
};

interface AppContextType {
  currentUser: OfficerUser | null;
  isAuthenticated: boolean;
  activePage: string;
  activeTenderId: string;
  activeBidId: string | null;
  tenders: Tender[];
  bids: VendorBid[];
  auditLogs: AuditLogEntry[];
  verificationRecords: ExternalVerificationRecord[];
  // Modals state
  whyFlaggedResult: RequirementComplianceResult | null;
  evidenceViewerData: { req: TenderRequirement; result: RequirementComplianceResult; bid: VendorBid } | null;
  // Demo Presentation Walkthrough
  isDemoTourActive: boolean;
  demoTourStep: number;
  // Navigation & Actions
  navigateTo: (page: string, params?: { tenderId?: string; bidId?: string }) => void;
  login: (role?: OfficerRole) => void;
  logout: () => void;
  resetBaselineData: () => void;
  addTender: (newTender: Tender) => void;
  updateOfficerDecision: (
    bidId: string,
    decision: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | 'VERIFIED',
    remarks: string
  ) => void;
  overrideRequirement: (
    bidId: string,
    requirementId: string,
    status: ComplianceStatus,
    notes: string
  ) => void;
  openWhyFlagged: (result: RequirementComplianceResult) => void;
  closeWhyFlagged: () => void;
  openEvidenceViewer: (req: TenderRequirement, result: RequirementComplianceResult, bid: VendorBid) => void;
  closeEvidenceViewer: () => void;
  startDemoPresentation: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  endDemoTour: () => void;
  addAuditLog: (action: string, tenderId: string, result: string, vendorName?: string, details?: string) => void;
  addVerificationRecord: (record: ExternalVerificationRecord) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<OfficerUser | null>(() =>
    loadStorage<OfficerUser | null>(STORAGE_KEYS.USER, DEMO_APPROVER)
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadStorage<boolean>(STORAGE_KEYS.AUTH, true)
  );
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [activeTenderId, setActiveTenderId] = useState<string>('GEM/2026/B/10234');
  const [activeBidId, setActiveBidId] = useState<string | null>('BID-TECHNOVA-01');

  const [tenders, setTenders] = useState<Tender[]>(() =>
    loadStorage<Tender[]>(STORAGE_KEYS.TENDERS, [SAMPLE_TENDER, ...OTHER_TENDERS])
  );
  const [bids, setBids] = useState<VendorBid[]>(() => {
    const loaded = loadStorage<VendorBid[] | null>(STORAGE_KEYS.BIDS, null);
    if (loaded && loaded.length > 0) {
      return computeInitialBids(loaded, SAMPLE_TENDER.requirements);
    }
    return computeInitialBids(SAMPLE_BIDS, SAMPLE_TENDER.requirements);
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );
  const [verificationRecords, setVerificationRecords] = useState<ExternalVerificationRecord[]>(() =>
    loadStorage<ExternalVerificationRecord[]>(STORAGE_KEYS.VERIFICATION, INITIAL_VERIFICATION_RECORDS)
  );

  // Sync state to localStorage for Phase 5 persistence
  useEffect(() => {
    saveStorage(STORAGE_KEYS.TENDERS, tenders);
  }, [tenders]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.BIDS, bids);
  }, [bids]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.VERIFICATION, verificationRecords);
  }, [verificationRecords]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.USER, currentUser);
    saveStorage(STORAGE_KEYS.AUTH, isAuthenticated);
  }, [currentUser, isAuthenticated]);

  // Modals
  const [whyFlaggedResult, setWhyFlaggedResult] = useState<RequirementComplianceResult | null>(null);
  const [evidenceViewerData, setEvidenceViewerData] = useState<{ req: TenderRequirement; result: RequirementComplianceResult; bid: VendorBid } | null>(null);

  // Demo Presentation Walkthrough
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);

  const navigateTo = (page: string, params?: { tenderId?: string; bidId?: string }) => {
    if (params?.tenderId) setActiveTenderId(params.tenderId);
    if (params?.bidId) setActiveBidId(params.bidId);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (role: OfficerRole = 'APPROVER') => {
    const user = role === 'EVALUATOR' ? DEMO_EVALUATOR : DEMO_APPROVER;
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActivePage('dashboard');
    addAuditLog('Officer Logged In', 'SYSTEM', `Session Authenticated (${user.role} Role)`, undefined, `Officer: ${user.name} (${user.id})`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActivePage('login');
    addAuditLog('Officer Logged Out', 'SYSTEM', 'Session Terminated', undefined);
  };

  const resetBaselineData = () => {
    localStorage.removeItem(STORAGE_KEYS.TENDERS);
    localStorage.removeItem(STORAGE_KEYS.BIDS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATION);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH);

    setTenders([SAMPLE_TENDER, ...OTHER_TENDERS]);
    setBids(computeInitialBids(SAMPLE_BIDS, SAMPLE_TENDER.requirements));
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setVerificationRecords(INITIAL_VERIFICATION_RECORDS);
    setCurrentUser(DEMO_APPROVER);
    setIsAuthenticated(true);
    setActiveTenderId('GEM/2026/B/10234');
    setActiveBidId('BID-TECHNOVA-01');
    setActivePage('dashboard');
  };

  const addTender = (newTender: Tender) => {
    setTenders(prev => [newTender, ...prev]);
    setActiveTenderId(newTender.id);

    // Generate candidate bid for the new tender to complete the reliable demo flow
    const sampleDocs = SAMPLE_BIDS[0].documents;
    const initialEval = evaluateBidCompliance(newTender.requirements, sampleDocs);

    const generatedBid: VendorBid = {
      id: `BID-${newTender.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || 'NEW'}-01`,
      vendorName: 'Bharat Infotech Solutions Pvt Ltd',
      vendorGst: '07AAACB9912K1ZY',
      vendorPan: 'AAACB9912K',
      vendorUdyam: 'UDYAM-DL-02-0049102',
      tenderId: newTender.id,
      tenderTitle: newTender.title,
      submissionDate: new Date().toISOString().split('T')[0],
      quotedPriceINR: 19500000,
      annualTurnoverCr: 6.8,
      experienceYears: 4.0,
      previousUnitsSupplied: 600,
      emdExemption: true,
      complianceScore: initialEval.complianceScore,
      riskLevel: initialEval.riskLevel,
      finalOfficerStatus: 'PENDING_OFFICER_DECISION',
      documents: sampleDocs,
      results: initialEval.results,
      categoryBreakdown: initialEval.categoryBreakdown
    };

    setBids(prev => [generatedBid, ...prev]);
    setActiveBidId(generatedBid.id);

    addAuditLog(
      'Tender Ingested & Analyzed',
      newTender.id,
      `${newTender.requirements.length} Requirements Extracted`,
      undefined,
      `${newTender.title} • Candidate bid auto-linked for compliance verification`
    );
  };

  const addAuditLog = (action: string, tenderId: string, result: string, vendorName?: string, details?: string) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officerName: currentUser?.name || 'Rajesh V. Sharma',
      officerId: currentUser?.id || 'OFF-7829',
      action,
      tenderId,
      vendorName,
      result,
      details: details ? `${details} [Role: ${currentUser?.role || 'APPROVER'}]` : `[Role: ${currentUser?.role || 'APPROVER'}]`,
      ipAddress: '10.24.112.4'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addVerificationRecord = (record: ExternalVerificationRecord) => {
    setVerificationRecords(prev => [record, ...prev]);
  };

  const updateOfficerDecision = (
    bidId: string,
    decision: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | 'VERIFIED',
    remarks: string
  ) => {
    const targetBid = bids.find(b => b.id === bidId);
    const targetStatus = decision === 'VERIFIED' ? 'APPROVED' : decision;

    setBids(prev => prev.map(b => {
      if (b.id === bidId) {
        return {
          ...b,
          finalOfficerStatus: targetStatus,
          officerDecisionReason: remarks,
          decisionTimestamp: new Date().toISOString(),
          decidedBy: `${currentUser?.name || 'Officer'} (${currentUser?.role || 'APPROVER'})`
        };
      }
      return b;
    }));

    addAuditLog(
      `Officer Final Decision: ${decision}`,
      targetBid?.tenderId || 'GEM/2026/B/10234',
      `Bid status updated to ${targetStatus}`,
      targetBid?.vendorName,
      `Remarks: ${remarks}`
    );
  };

  const overrideRequirement = (
    bidId: string,
    requirementId: string,
    status: ComplianceStatus,
    notes: string
  ) => {
    setBids(prev => prev.map(b => {
      if (b.id === bidId) {
        const updatedResults = b.results.map(r => {
          if (r.requirementId === requirementId) {
            return {
              ...r,
              status,
              officerVerified: true,
              officerOverrideStatus: status,
              officerNotes: notes,
              verifiedAt: new Date().toISOString(),
              verifiedBy: `${currentUser?.name || 'Officer'} (${currentUser?.role || 'APPROVER'})`
            };
          }
          return r;
        });

        const activeTender = tenders.find(t => t.id === b.tenderId) || SAMPLE_TENDER;
        const reEval = evaluateBidCompliance(activeTender.requirements, b.documents, updatedResults);

        return {
          ...b,
          complianceScore: reEval.complianceScore,
          riskLevel: reEval.riskLevel,
          results: updatedResults,
          categoryBreakdown: reEval.categoryBreakdown
        };
      }
      return b;
    }));

    const targetBid = bids.find(b => b.id === bidId);
    addAuditLog(
      `Requirement Override: ${requirementId}`,
      targetBid?.tenderId || 'GEM/2026/B/10234',
      `Manual status set to ${status}`,
      targetBid?.vendorName,
      `Officer note: ${notes}`
    );
  };

  const openWhyFlagged = (result: RequirementComplianceResult) => {
    setWhyFlaggedResult(result);
  };

  const closeWhyFlagged = () => {
    setWhyFlaggedResult(null);
  };

  const openEvidenceViewer = (req: TenderRequirement, result: RequirementComplianceResult, bid: VendorBid) => {
    setEvidenceViewerData({ req, result, bid });
  };

  const closeEvidenceViewer = () => {
    setEvidenceViewerData(null);
  };

  // Demo Presentation Tour (10 steps)
  const startDemoPresentation = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveTenderId('GEM/2026/B/10234');
    setActivePage('tenders');
  };

  const nextDemoStep = () => {
    if (demoTourStep === 1) {
      // Step 2: View extracted requirements
      setActivePage('tender-detail');
      setDemoTourStep(2);
    } else if (demoTourStep === 2) {
      // Step 3: Select sample vendor
      setActivePage('bids');
      setDemoTourStep(3);
    } else if (demoTourStep === 3) {
      // Step 4: View uploaded documents
      setActiveBidId('BID-TECHNOVA-01');
      setActivePage('bid-detail');
      setDemoTourStep(4);
    } else if (demoTourStep === 4) {
      // Step 5: Multi-vendor bid comparison
      setActivePage('vendor-comparison');
      setDemoTourStep(5);
    } else if (demoTourStep === 5) {
      // Step 6: Show compliance score
      setActivePage('bid-detail');
      setDemoTourStep(6);
    } else if (demoTourStep === 6) {
      // Step 7: Open "Why Flagged?"
      const sampleFlag = bids.find(b => b.id === 'BID-TECHNOVA-01')?.results.find(r => r.requirementId === 'REQ-008');
      if (sampleFlag) openWhyFlagged(sampleFlag);
      setDemoTourStep(7);
    } else if (demoTourStep === 7) {
      // Step 8: Show evidence viewer
      closeWhyFlagged();
      const currentBid = bids.find(b => b.id === 'BID-TECHNOVA-01')!;
      const req06 = SAMPLE_TENDER.requirements.find(r => r.id === 'REQ-006')!;
      const res06 = currentBid.results.find(r => r.requirementId === 'REQ-006')!;
      openEvidenceViewer(req06, res06, currentBid);
      setDemoTourStep(8);
    } else if (demoTourStep === 8) {
      // Step 9: Officer makes final decision
      closeEvidenceViewer();
      setActivePage('bid-detail');
      setDemoTourStep(9);
    } else if (demoTourStep === 9) {
      // Step 10: Show audit log
      setActivePage('audit-logs');
      setDemoTourStep(10);
    } else {
      endDemoTour();
    }
  };

  const prevDemoStep = () => {
    if (demoTourStep > 1) {
      setDemoTourStep(demoTourStep - 1);
    }
  };

  const endDemoTour = () => {
    setIsDemoTourActive(false);
    closeWhyFlagged();
    closeEvidenceViewer();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activePage,
        activeTenderId,
        activeBidId,
        tenders,
        bids,
        auditLogs,
        verificationRecords,
        whyFlaggedResult,
        evidenceViewerData,
        isDemoTourActive,
        demoTourStep,
        navigateTo,
        login,
        logout,
        resetBaselineData,
        addTender,
        updateOfficerDecision,
        overrideRequirement,
        openWhyFlagged,
        closeWhyFlagged,
        openEvidenceViewer,
        closeEvidenceViewer,
        startDemoPresentation,
        nextDemoStep,
        prevDemoStep,
        endDemoTour,
        addAuditLog,
        addVerificationRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

