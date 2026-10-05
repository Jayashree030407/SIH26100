import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import {
  Layers,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Eye,
  Filter,
  Printer,
  Download,
  FileSpreadsheet,
  Scale,
  Award,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

export const VendorComparisonView: React.FC = () => {
  const { tenders, bids, activeTenderId, currentUser, navigateTo, openWhyFlagged, openEvidenceViewer } = useApp();
  const [selectedTenderId, setSelectedTenderId] = useState<string>(activeTenderId);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'matrix' | 'overview'>('overview');

  const tender = tenders.find(t => t.id === selectedTenderId) || tenders[0];
  const tenderBids = bids.filter(b => b.tenderId === tender.id);

  const filteredRequirements = tender.requirements.filter(
    r => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Sort bids by price to compute L1, L2, L3
  const priceSortedBids = [...tenderBids].sort((a, b) => (a.quotedPriceINR || 0) - (b.quotedPriceINR || 0));
  const getPriceRank = (bidId: string) => {
    const idx = priceSortedBids.findIndex(b => b.id === bidId);
    return idx >= 0 ? `L${idx + 1}` : '';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Bid Comparative Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Vendor Bid Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive comparative evaluation of compliance scores, technical capabilities, pricing, and risk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tender Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-slate-400 font-medium">Tender:</span>
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="bg-transparent font-mono font-bold text-slate-800 outline-none cursor-pointer"
            >
              {tenders.map(t => (
                <option key={t.id} value={t.id}>{t.id}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => navigateTo('bids')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Bids</span>
          </button>
        </div>
      </div>

      {/* Tender Metadata Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Selected Tender</span>
          <span className="font-mono font-bold text-slate-900 truncate block">{tender.id}</span>
          <span className="text-[11px] text-slate-500 truncate block">{tender.title}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
          <span className="font-semibold text-slate-800 block truncate">{tender.category}</span>
          <span className="text-[11px] text-slate-500">Dept: {tender.department?.split('/')[0] || 'Government of India'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Budget</span>
          <span className="font-mono font-bold text-slate-900 block">
            {formatCurrency(tender.estimatedBudgetINR)}
          </span>
          <span className="text-[11px] text-slate-500">{tenderBids.length} Bids Submitted</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Evaluation Scope</span>
          <span className="font-mono font-bold text-blue-700 block">{tender.requirements.length} Mandatory Clauses</span>
          <span className="text-[11px] text-emerald-700 font-semibold">100% Deterministic Engine</span>
        </div>
      </div>

      {/* Vendor Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tenderBids.map((b, idx) => {
          const pass = b.results.filter(r => r.status === 'COMPLIANT').length;
          const rev = b.results.filter(r => r.status === 'NEEDS_REVIEW').length;
          const fail = b.results.filter(r => r.status === 'NON_COMPLIANT').length;
          const priceRank = getPriceRank(b.id);

          return (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{b.id}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {priceRank && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                        priceRank === 'L1' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {priceRank} Price
                      </span>
                    )}
                    <RiskBadge risk={b.riskLevel} size="sm" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{b.vendorName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quoted Price: <strong className="text-slate-900 font-mono">{formatCurrency(b.quotedPriceINR)}</strong>
                </p>

                {/* Mini breakdown pills */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="bg-emerald-50 rounded p-1">
                    <span className="text-emerald-700 font-bold block text-xs">{pass}</span>
                    <span className="text-emerald-600">Passed</span>
                  </div>
                  <div className="bg-amber-50 rounded p-1">
                    <span className="text-amber-700 font-bold block text-xs">{rev}</span>
                    <span className="text-amber-600">Review</span>
                  </div>
                  <div className="bg-rose-50 rounded p-1">
                    <span className="text-rose-700 font-bold block text-xs">{fail}</span>
                    <span className="text-rose-600">Failed</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Compliance</span>
                  <span className={`text-xl font-extrabold font-mono ${
                    b.complianceScore >= 85 ? 'text-emerald-600' : b.complianceScore >= 70 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {b.complianceScore}%
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('bid-detail', { bidId: b.id, tenderId: b.tenderId })}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                >
                  <span>Evaluation Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Key Comparison Overview Table
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Clause-by-Clause Comparison Matrix ({tender.requirements.length} Requirements)
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Showing {tenderBids.length} competing bidders
        </span>
      </div>

      {/* VIEW 1: Key Comparison Overview Table */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Bidder Multi-Dimensional Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Evaluation across Technical, Eligibility, Financial, Documentation, Risk, and Commercial price.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Tender: <strong className="text-slate-800">{tender.id}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4 min-w-[200px]">Vendor Name</th>
                  <th className="py-3 px-4 text-center">Compliance Score</th>
                  <th className="py-3 px-4 text-center">Technical Compliance</th>
                  <th className="py-3 px-4 text-center">Eligibility</th>
                  <th className="py-3 px-4 text-center">Financial Compliance</th>
                  <th className="py-3 px-4 text-center">Documentation</th>
                  <th className="py-3 px-4 text-center">Risk Level</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Clauses (P / R / F)</th>
                  <th className="py-3 px-4 text-right">Final Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {tenderBids
                  .sort((a, b) => b.complianceScore - a.complianceScore)
                  .map((b, idx) => {
                    const pass = b.results.filter(r => r.status === 'COMPLIANT').length;
                    const rev = b.results.filter(r => r.status === 'NEEDS_REVIEW').length;
                    const fail = b.results.filter(r => r.status === 'NON_COMPLIANT').length;
                    const priceRank = getPriceRank(b.id);

                    const techPct = b.categoryBreakdown.technicalTotal > 0
                      ? Math.round((b.categoryBreakdown.technicalPassed / b.categoryBreakdown.technicalTotal) * 100)
                      : 100;
                    const eligPct = b.categoryBreakdown.eligibilityTotal > 0
                      ? Math.round((b.categoryBreakdown.eligibilityPassed / b.categoryBreakdown.eligibilityTotal) * 100)
                      : 100;
                    const finPct = b.categoryBreakdown.financialTotal > 0
                      ? Math.round((b.categoryBreakdown.financialPassed / b.categoryBreakdown.financialTotal) * 100)
                      : 100;
                    const docPct = b.categoryBreakdown.documentationTotal > 0
                      ? Math.round((b.categoryBreakdown.documentationPassed / b.categoryBreakdown.documentationTotal) * 100)
                      : 100;

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block text-xs">{b.vendorName}</span>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>ID: {b.id}</span>
                            {b.vendorGst && <span>• GST: {b.vendorGst}</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-mono font-extrabold text-sm px-2 py-0.5 rounded ${
                            b.complianceScore >= 85 ? 'bg-emerald-50 text-emerald-700' : b.complianceScore >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {b.complianceScore}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-800">
                              {b.categoryBreakdown.technicalPassed}/{b.categoryBreakdown.technicalTotal}
                            </span>
                            <span className={`text-[10px] font-mono ${techPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              ({techPct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-800">
                              {b.categoryBreakdown.eligibilityPassed}/{b.categoryBreakdown.eligibilityTotal}
                            </span>
                            <span className={`text-[10px] font-mono ${eligPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              ({eligPct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-800">
                              {b.categoryBreakdown.financialPassed}/{b.categoryBreakdown.financialTotal}
                            </span>
                            <span className={`text-[10px] font-mono ${finPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              ({finPct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-800">
                              {b.categoryBreakdown.documentationPassed}/{b.categoryBreakdown.documentationTotal}
                            </span>
                            <span className={`text-[10px] font-mono ${docPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              ({docPct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <RiskBadge risk={b.riskLevel} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-mono font-bold text-slate-900">
                            {formatCurrency(b.quotedPriceINR)}
                          </div>
                          {priceRank && (
                            <span className={`text-[10px] font-mono font-bold ${
                              priceRank === 'L1' ? 'text-emerald-700' : 'text-slate-500'
                            }`}>
                              [{priceRank}]
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                          <span className="text-emerald-700 font-bold">{pass}</span> / <span className="text-amber-700 font-bold">{rev}</span> / <span className="text-rose-700 font-bold">{fail}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[11px]">
                          <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide inline-block ${
                            b.finalOfficerStatus === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.finalOfficerStatus === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.finalOfficerStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => navigateTo('bid-detail', { bidId: b.id, tenderId: b.tenderId })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Clause-by-Clause Side-by-Side Matrix Table */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs w-fit">
            {['ALL', 'Technical', 'Eligibility', 'Financial', 'Documentation', 'Legal'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? `All Requirements (${tender.requirements.length})` : cat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-56">Requirement & Standard</th>
                    {tenderBids.map(b => (
                      <th key={b.id} className="py-3 px-4 min-w-[220px]">
                        <div className="text-slate-900 font-bold text-xs">{b.vendorName}</div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-normal font-mono">
                          <span>Score: {b.complianceScore}%</span>
                          <span>• {formatCurrency(b.quotedPriceINR)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRequirements.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 bg-slate-50/50">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-blue-700">{req.id}</span>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-medium">
                            {req.category}
                          </span>
                        </div>
                        <p className="font-medium text-slate-900 mt-1 leading-tight">{req.description}</p>
                        {req.expectedValue && (
                          <p className="text-[10px] text-blue-700 font-mono mt-1 font-semibold">
                            Mandatory Benchmark: {req.expectedValue}
                          </p>
                        )}
                      </td>

                      {tenderBids.map(b => {
                        const result = b.results.find(r => r.requirementId === req.id);
                        if (!result) return <td key={b.id} className="py-3.5 px-4 text-slate-400">N/A</td>;

                        const isFlagged = result.status === 'NON_COMPLIANT' || result.status === 'NEEDS_REVIEW';

                        return (
                          <td
                            key={b.id}
                            className={`py-3.5 px-4 ${
                              result.status === 'NON_COMPLIANT'
                                ? 'bg-rose-50/25'
                                : result.status === 'NEEDS_REVIEW'
                                ? 'bg-amber-50/25'
                                : ''
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <StatusBadge status={result.status} size="sm" />
                                {isFlagged && (
                                  <button
                                    onClick={() => openWhyFlagged(result)}
                                    className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline"
                                  >
                                    Why?
                                  </button>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-800 font-mono font-medium leading-snug">
                                {result.detectedValue || 'Verified in Document'}
                              </p>
                              {result.difference && (
                                <p className="text-[10px] text-rose-600 font-mono font-semibold">
                                  {result.difference}
                                </p>
                              )}
                              {result.evidence && (
                                <button
                                  onClick={() => openEvidenceViewer(req, result, b)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center space-x-1 pt-0.5"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Evidence</span>
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Committee Determination & Officer Signatures (Preserved from Reports) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Scale className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tender Evaluation Committee Determination & Audit Verification
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-lg border border-slate-200">
          "The procurement committee has examined the automated deterministic compliance verification results generated by ProcureAI for Tender {tender.id}. All competing vendor submissions were systematically evaluated against the 18 mandatory qualification and technical clauses. Commercial pricing analysis and statutory compliance records have been locked for audit readiness."
        </p>

        {/* Signatures */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600 border-t border-slate-100">
          <div>
            <div className="font-bold text-slate-900">{currentUser?.name || 'Rajesh V. Sharma'}</div>
            <div className="text-[11px] text-slate-500">{currentUser?.designation || 'Senior Procurement Officer'}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Officer ID: {currentUser?.id || 'OFF-7829'}</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">Dr. M. S. Venkatesh</div>
            <div className="text-[11px] text-slate-500">Technical Evaluation Member</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Emp ID: GOV-4421</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">Ananya Sen, IA&AS</div>
            <div className="text-[11px] text-slate-500">Financial Advisor & Audit</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Emp ID: AUD-1089</div>
          </div>
        </div>
      </div>
    </div>
  );
};
