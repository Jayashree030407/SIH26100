import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { DecisionModal } from '../common/DecisionModal';
import {
  FileCheck2,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  FileText,
  Search,
  ExternalLink,
  ShieldAlert,
  Scale,
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { ComplianceStatus } from '../../types';

export const BidDetailView: React.FC = () => {
  const {
    activeBidId,
    bids,
    tenders,
    navigateTo,
    openWhyFlagged,
    openEvidenceViewer,
    overrideRequirement,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'DOCUMENTS' | 'PROFILE' | 'DECISION'>('CHECKLIST');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const bid = bids.find(b => b.id === activeBidId) || bids[0];
  const tender = tenders.find(t => t.id === bid.tenderId) || tenders[0];

  const compliantCount = bid.results.filter(r => r.status === 'COMPLIANT').length;
  const reviewCount = bid.results.filter(r => r.status === 'NEEDS_REVIEW').length;
  const nonCompliantCount = bid.results.filter(r => r.status === 'NON_COMPLIANT').length;

  const filteredResults = bid.results.filter(res => {
    const req = tender.requirements.find(r => r.id === res.requirementId);
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || req?.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Nav & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('bids', { tenderId: tender.id })}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Vendor Bids</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDecisionModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>
              {currentUser?.role === 'EVALUATOR' ? 'Submit Technical Evaluation' : 'Make Final Officer Decision'}
            </span>
          </button>
        </div>
      </div>

      {/* Flagship Header Card: Vendor & Compliance Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                {bid.id}
              </span>
              <RiskBadge risk={bid.riskLevel} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Tender: {bid.tenderId}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {bid.vendorName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>GSTIN: <strong className="font-mono text-slate-800">{bid.vendorGst}</strong></span>
              <span>•</span>
              <span>PAN: <strong className="font-mono text-slate-800">{bid.vendorPan}</strong></span>
              <span>•</span>
              <span>MSME Udyam: <strong className="font-mono text-slate-800">{bid.vendorUdyam || 'N/A'}</strong></span>
              <span>•</span>
              <span>Submitted: <strong className="text-slate-800">{bid.submissionDate}</strong></span>
            </div>
          </div>

          {/* Compliance Score Panel */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Compliance Score
              </span>
              <div className="flex items-baseline justify-end space-x-1">
                <span className={`text-3xl font-extrabold font-mono ${
                  bid.complianceScore >= 85 ? 'text-emerald-600' : bid.complianceScore >= 70 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {bid.complianceScore}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Deterministic Rule Score</span>
            </div>

            <div className="pl-4 border-l border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between space-x-3">
                <span className="text-emerald-700 font-medium flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Compliant:
                </span>
                <span className="font-bold text-slate-900">{compliantCount}</span>
              </div>
              <div className="flex items-center justify-between space-x-3">
                <span className="text-amber-700 font-medium flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Needs Review:
                </span>
                <span className="font-bold text-slate-900">{reviewCount}</span>
              </div>
              <div className="flex items-center justify-between space-x-3">
                <span className="text-rose-700 font-medium flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Non-Compliant:
                </span>
                <span className="font-bold text-slate-900">{nonCompliantCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Officer Decision Banner */}
        <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          bid.finalOfficerStatus === 'APPROVED'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : bid.finalOfficerStatus === 'REJECTED'
            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
            : bid.finalOfficerStatus === 'CLARIFICATION_REQUESTED'
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-blue-50/80 border-blue-200 text-blue-900'
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Current Officer Status:</span>
              <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-white/80 shadow-2xs">
                {bid.finalOfficerStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs italic pt-0.5">
              Remarks: "{bid.officerDecisionReason || 'Awaiting final committee sign-off. Review all 18 requirements below.'}"
            </p>
          </div>

          <button
            onClick={() => setIsDecisionModalOpen(true)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-md font-semibold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs"
          >
            Update Decision
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('CHECKLIST')}
          className={`pb-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'CHECKLIST'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>18-Clause Compliance Matrix</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {bid.results.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`pb-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'DOCUMENTS'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Uploaded Documents & Extractions</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {bid.documents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`pb-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'PROFILE'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Financial & Legal Profile</span>
        </button>
      </div>

      {/* Professional Indication for Vendor OCR Status (Issue 7) */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Sample extracted bid data — vendor document OCR pipeline is under development. Document fields are evaluated deterministically by the rule engine.</span>
        </div>
        <span className="text-[10px] bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded font-semibold shrink-0 ml-2">
          Demo Dataset
        </span>
      </div>

      {/* TAB 1: 18-Clause Compliance Matrix */}
      {activeTab === 'CHECKLIST' && (
        <div className="space-y-4">
          {/* Filters for checklist */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-semibold">Filter Status:</span>
              {['ALL', 'NON_COMPLIANT', 'NEEDS_REVIEW', 'COMPLIANT'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All (18)' : st === 'NON_COMPLIANT' ? `Failed (${nonCompliantCount})` : st === 'NEEDS_REVIEW' ? `Review (${reviewCount})` : `Compliant (${compliantCount})`}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-semibold">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Eligibility">Eligibility</option>
                <option value="Financial">Financial</option>
                <option value="Documentation">Documentation</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-24">Clause ID</th>
                    <th className="py-3 px-3 w-28">Category</th>
                    <th className="py-3 px-6">Tender Mandate & Description</th>
                    <th className="py-3 px-4">Expected vs Detected</th>
                    <th className="py-3 px-4 w-32">Status</th>
                    <th className="py-3 px-5 text-right w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredResults.map(res => {
                    const req = tender.requirements.find(r => r.id === res.requirementId);
                    if (!req) return null;

                    const isFlagged = res.status === 'NON_COMPLIANT' || res.status === 'NEEDS_REVIEW';

                    return (
                      <tr
                        key={res.requirementId}
                        className={`transition-colors ${
                          res.status === 'NON_COMPLIANT'
                            ? 'bg-rose-50/30 hover:bg-rose-50/60'
                            : res.status === 'NEEDS_REVIEW'
                            ? 'bg-amber-50/30 hover:bg-amber-50/60'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {res.requirementId}
                          <span className="block text-[10px] text-slate-400 font-normal">{req.clauseRef}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                            {req.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 max-w-sm">
                          <p className="font-medium text-slate-900 leading-snug">{req.description}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Evidence: {req.evidenceRequired}</p>
                          {res.officerOverrideStatus && (
                            <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded font-semibold">
                              Officer Overridden ({res.officerNotes})
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1 text-xs">
                            <div className="text-slate-500">
                              Exp: <strong className="text-slate-700 font-mono">{res.expectedValue || req.expectedValue || 'RFP Spec'}</strong>
                            </div>
                            <div className="text-slate-900">
                              Got: <strong className={`font-mono ${isFlagged ? 'text-rose-700 font-bold' : 'text-emerald-700'}`}>
                                {res.detectedValue || 'Clause verified'}
                              </strong>
                            </div>
                            {res.difference && (
                              <div className="text-[11px] text-rose-600 font-mono">
                                Diff: {res.difference}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={res.status} size="md" />
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            {res.status === 'NEEDS_REVIEW' && !res.evidence
                              ? 'Unautomated Rule'
                              : `Score: ${res.confidence}% (Illustrative)`}
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {isFlagged && (
                              <button
                                onClick={() => openWhyFlagged(res)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded font-semibold text-[11px] transition-colors"
                                title="Inspect explainable reasons for why this clause was flagged"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>Why Flagged?</span>
                              </button>
                            )}

                            <button
                              onClick={() => openEvidenceViewer(req, res, bid)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-[11px] transition-colors"
                              title="View clause evidence and source document"
                            >
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>Evidence</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Uploaded Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Uploaded Technical Bid Dossier ({bid.documents.length} Files Analyzed)
            </span>
            <span className="text-slate-500">Document clause extraction & rule evaluation</span>
          </div>

          <div className="divide-y divide-slate-100">
            {bid.documents.map((doc, idx) => (
              <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{doc.name}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-[10px]">
                        {doc.docType}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      {doc.size || doc.fileSize || '1.5 MB'} • {doc.totalPages} Pages • Ingested: {new Date(doc.uploadedAt || doc.uploadDate || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                      Extracted Preview: "{doc.extractedTextPreview}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Processed
                  </span>
                  <button
                    onClick={() => {
                      const req = tender.requirements[idx % tender.requirements.length];
                      const res = bid.results.find(r => r.requirementId === req.id) || bid.results[0];
                      openEvidenceViewer(req, res, bid);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    Inspect Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Financial & Legal Profile */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Financial Credibility & Thresholds
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">3-Year Average Annual Turnover:</span>
                <span className="font-bold text-slate-900 font-mono">₹{(bid.annualTurnoverCr ?? 7.2).toFixed(2)} Crore</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tender Minimum Requirement:</span>
                <span className="font-bold text-blue-700 font-mono">₹5.00 Crore</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Net Worth Status:</span>
                <span className="font-bold text-emerald-700">Positive / Solvency Certified</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Earnest Money Deposit (EMD):</span>
                <span className="font-bold text-slate-900">
                  {bid.emdExemption ? 'Exempted via MSME Udyam Registration' : '₹5,00,000 Paid via Bank Guarantee'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Experience & Statutory Credentials
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Years in Similar Business:</span>
                <span className="font-bold text-slate-900 font-mono">{bid.experienceYears ?? 4.5} Years (Min req: 3.0 yrs)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Largest Single Supply Order:</span>
                <span className="font-bold text-slate-900 font-mono">{bid.previousUnitsSupplied ?? 650} Units (Min req: 500 units)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">GST Registration Status:</span>
                <span className="font-bold text-emerald-700">Active (Demo / Simulated Registry)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Debarment / Blacklist Check:</span>
                <span className="font-bold text-emerald-700">Clean Record (Demo / Simulated Registry)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      <DecisionModal
        bid={bid}
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
      />
    </div>
  );
};
