import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import {
  FileCheck2,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const BidsView: React.FC = () => {
  const { bids, tenders, activeTenderId, navigateTo } = useApp();
  const [selectedTenderFilter, setSelectedTenderFilter] = useState<string>(activeTenderId);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const activeTender = tenders.find(t => t.id === selectedTenderFilter) || tenders[0];

  const filteredBids = bids.filter(b => {
    const matchesTender = selectedTenderFilter === 'ALL' || b.tenderId === selectedTenderFilter;
    const matchesSearch =
      b.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || b.riskLevel === riskFilter;
    return matchesTender && matchesSearch && matchesRisk;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Vendor Bid Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review AI compliance verification reports, inspect flagged discrepancies, and record human officer decisions.
          </p>
        </div>

        <button
          onClick={() => navigateTo('vendor-comparison')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Side-by-Side Vendor Comparison</span>
        </button>
      </div>

      {/* Filters & Tender Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tender Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600">Select Tender:</span>
            <select
              value={selectedTenderFilter}
              onChange={(e) => setSelectedTenderFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs font-semibold text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Tenders</option>
              {tenders.map(t => (
                <option key={t.id} value={t.id}>{t.id} - {t.title.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  riskFilter === lvl
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'ALL' ? 'All Risks' : `${lvl} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bids List Cards */}
      <div className="space-y-4">
        {filteredBids.map(bid => {
          const compliantCount = bid.results.filter(r => r.status === 'COMPLIANT').length;
          const reviewCount = bid.results.filter(r => r.status === 'NEEDS_REVIEW').length;
          const nonCompliantCount = bid.results.filter(r => r.status === 'NON_COMPLIANT').length;

          return (
            <div
              key={bid.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left: Vendor Information & Meta */}
              <div className="space-y-3 min-w-[280px]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {bid.id}
                  </span>
                  <RiskBadge risk={bid.riskLevel} />
                  <span className="text-[11px] text-slate-400 font-mono">Tender: {bid.tenderId}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() => navigateTo('bid-detail', { bidId: bid.id, tenderId: bid.tenderId })}
                  >
                    {bid.vendorName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span>GST: <strong className="text-slate-700 font-mono">{bid.vendorGst}</strong></span>
                    <span>•</span>
                    <span>PAN: <strong className="text-slate-700 font-mono">{bid.vendorPan}</strong></span>
                    <span>•</span>
                    <span>Submitted: <strong className="text-slate-700">{bid.submissionDate}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1 text-xs">
                  <span className="text-slate-500">Officer Decision:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    bid.finalOfficerStatus === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bid.finalOfficerStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : bid.finalOfficerStatus === 'CLARIFICATION_REQUESTED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {bid.finalOfficerStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Center: Compliance Score Progress & Metric Chips */}
              <div className="flex-1 max-w-md space-y-3 lg:px-6 lg:border-x lg:border-slate-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    AI Compliance Score
                  </span>
                  <span className={`text-xl font-extrabold font-mono ${
                    bid.complianceScore >= 85 ? 'text-emerald-600' : bid.complianceScore >= 70 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {bid.complianceScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bid.complianceScore >= 85 ? 'bg-emerald-500' : bid.complianceScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${bid.complianceScore}%` }}
                  />
                </div>

                {/* Status chips breakdown */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {compliantCount} Compliant
                  </span>
                  {reviewCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {reviewCount} Review
                    </span>
                  )}
                  {nonCompliantCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                      <ShieldAlert className="w-3 h-3 mr-1" />
                      {nonCompliantCount} Non-Compliant
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center space-y-2 shrink-0">
                <button
                  onClick={() => navigateTo('bid-detail', { bidId: bid.id, tenderId: bid.tenderId })}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Open Evaluation Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400">
                  {bid.documents.length} PDF attachments analyzed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
