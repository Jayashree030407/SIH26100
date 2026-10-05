import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import {
  FileSpreadsheet,
  FileCheck,
  AlertOctagon,
  Percent,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  PlayCircle,
  PlusCircle,
  UploadCloud,
  FileText,
  Clock,
  ChevronRight,
  Scale,
  Sparkles,
  CheckCircle2,
  Building,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { tenders, bids, navigateTo, startDemoPresentation } = useApp();

  // Aggregate stats
  const activeTendersCount = tenders.length;
  const totalBidsCount = bids.length;
  const avgCompliance = Math.round(
    bids.reduce((acc, b) => acc + b.complianceScore, 0) / (bids.length || 1)
  );
  const highRiskBids = bids.filter(b => b.riskLevel === 'HIGH').length;
  const pendingOfficerReview = bids.filter(b => b.finalOfficerStatus === 'PENDING_OFFICER_DECISION').length;

  // Chart data: Vendor scores
  const vendorScoreData = bids.map(b => ({
    name: b.vendorName.replace(' Systems', '').replace(' Solutions', '').replace(' Technologies', ''),
    score: b.complianceScore,
    risk: b.riskLevel,
    color: b.complianceScore >= 85 ? '#10b981' : b.complianceScore >= 70 ? '#f59e0b' : '#ef4444'
  }));

  // Pie chart data: Status breakdown across all evaluated requirements
  let compliantCount = 0;
  let reviewCount = 0;
  let nonCompliantCount = 0;

  bids.forEach(b => {
    b.results.forEach(r => {
      if (r.status === 'COMPLIANT') compliantCount++;
      else if (r.status === 'NEEDS_REVIEW') reviewCount++;
      else if (r.status === 'NON_COMPLIANT') nonCompliantCount++;
    });
  });

  const pieData = [
    { name: 'Compliant Clauses', value: compliantCount, color: '#10b981' },
    { name: 'Needs Review', value: reviewCount, color: '#f59e0b' },
    { name: 'Non-Compliant Flags', value: nonCompliantCount, color: '#ef4444' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon 2026 • Problem Statement SIH26100</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            ProcureAI Officer Dashboard
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            AI-driven document understanding coupled with an explainable deterministic rules engine for government tender bid qualification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={startDemoPresentation}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Run 10-Step Demo Tour</span>
          </button>

          <button
            onClick={() => navigateTo('tenders')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Upload New Tender</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Tenders</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activeTendersCount}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              Active on GeM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">1 active evaluation in progress</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bids Evaluated</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalBidsCount}</span>
            <span className="text-xs font-semibold text-blue-600 font-mono">18 Requirements</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Processed across 9 document types</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Compliance Score</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{avgCompliance}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Benchmark: 75%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 3 sample participating bidders</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Action Required</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-900">{pendingOfficerReview}</span>
            <span className="text-xs font-semibold text-rose-600">
              {highRiskBids} High Risk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Pending final officer sign-off</p>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vendor Compliance Scores Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Bidder Compliance Scores (%)</h3>
                <p className="text-xs text-slate-500">Tender GEM/2026/B/10234 (Desktop Computers)</p>
              </div>
              <button
                onClick={() => navigateTo('vendor-comparison')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
              >
                <span>Full Comparison</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}% Compliance Score`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {vendorScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>TechNova Systems (92% - Low Risk)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span>Bharat Digital (78% - Med)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>NextGen (61% - High)</span>
            </div>
          </div>
        </div>

        {/* Requirements Status Breakdown Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clause Compliance Distribution</h3>
            <p className="text-xs text-slate-500 mb-2">Cumulative evaluation across all 54 evaluated criteria</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                Compliant Clauses
              </span>
              <span className="font-bold text-slate-900">{compliantCount} (74%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
                Needs Review / Ambiguous
              </span>
              <span className="font-bold text-slate-900">{reviewCount} (11%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                Non-Compliant / Deficiencies
              </span>
              <span className="font-bold text-slate-900">{nonCompliantCount} (15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tender Evaluations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Procurement Tenders</h3>
            <p className="text-xs text-slate-500">Government e-Marketplace (GeM) active bidding evaluations</p>
          </div>
          <button
            onClick={() => navigateTo('tenders')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
          >
            <span>View All Tenders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Tender ID & Reference</th>
                <th className="py-3 px-4">Title & Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Bids Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-700">
                    {tender.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {tender.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {tender.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {tender.estimatedValue}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {tender.bidsCount} Bids Submitted
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {tender.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => navigateTo('tender-detail', { tenderId: tender.id })}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors shadow-2xs"
                    >
                      <span>Evaluate Bids</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fast Action Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => navigateTo('vendor-comparison')}
          className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900">Multi-Vendor Comparison Matrix</h4>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Side-by-side compliance breakdown mapping all bidders across all 18 evaluated clauses.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigateTo('verification')}
          className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-all flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">External Verification Center</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Simulated cross-verification with GSTN, PAN Protean, Udyam MSME, and ISO IAF registries.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigateTo('audit-logs')}
          className="p-4 rounded-xl bg-slate-100 border border-slate-300 hover:border-slate-400 cursor-pointer transition-all flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Persistent Audit Log</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Chronological log of rule evaluations, officer overrides, and tender qualification determinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
