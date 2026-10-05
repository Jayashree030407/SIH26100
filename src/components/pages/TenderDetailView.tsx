import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Building,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronRight,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { RequirementCategory } from '../../types';

export const TenderDetailView: React.FC = () => {
  const { activeTenderId, tenders, bids, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tender = tenders.find(t => t.id === activeTenderId) || tenders[0];
  const tenderBids = bids.filter(b => b.tenderId === tender.id);

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Clauses', value: 'ALL', count: tender.requirements.length },
    { label: 'Technical', value: 'Technical', count: tender.requirements.filter(r => r.category === 'Technical').length },
    { label: 'Eligibility', value: 'Eligibility', count: tender.requirements.filter(r => r.category === 'Eligibility').length },
    { label: 'Financial', value: 'Financial', count: tender.requirements.filter(r => r.category === 'Financial').length },
    { label: 'Documentation', value: 'Documentation', count: tender.requirements.filter(r => r.category === 'Documentation').length },
    { label: 'Legal', value: 'Legal', count: tender.requirements.filter(r => r.category === 'Legal').length },
  ];

  const filteredRequirements = tender.requirements.filter(req => {
    const matchesCategory = selectedCategory === 'ALL' || req.category === selectedCategory;
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clauseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.evidenceRequired.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('tenders')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tenders</span>
        </button>

        <button
          onClick={() => navigateTo('bids', { tenderId: tender.id })}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Evaluate {tenderBids.length} Submitted Vendor Bids</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tender Metadata Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                {tender.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {tender.status}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {tender.category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {tender.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center pt-1">
              <Building className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" />
              <span>{tender.issuingAuthority}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Contract</span>
              <span className="text-base font-bold text-slate-900 font-mono">{tender.estimatedValue}</span>
            </div>
            <div className="pl-3 border-l border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Closing Date</span>
              <span className="text-xs font-semibold text-slate-700">{tender.closingDate}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-md border border-slate-100">
          <strong>Procurement Scope:</strong> {tender.description}
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  selectedCategory === cat.value
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.value ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clause or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Structured Checklist Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Compliance Criteria Checklist ({filteredRequirements.length} Clauses)
            </span>
            <span className="text-slate-500">Extracted from Tender RFP via Gemini NLP & Domain Rules</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-24">ID</th>
                  <th className="py-3 px-3 w-28">Category</th>
                  <th className="py-3 px-3 w-28">Clause Ref</th>
                  <th className="py-3 px-3 w-24">Type</th>
                  <th className="py-3 px-5">Requirement Description & Expected Benchmark</th>
                  <th className="py-3 px-4">Required Evidence Document</th>
                  <th className="py-3 px-3 w-24 text-center">Mandatory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequirements.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[11px]">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                      {req.clauseRef}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded font-medium text-[10px] uppercase">
                        {req.verificationType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-medium text-slate-900 leading-snug">{req.description}</p>
                      {req.expectedValue && (
                        <p className="text-[11px] text-blue-700 font-mono mt-1 font-semibold">
                          Expected Threshold: {req.expectedValue}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-medium">{req.evidenceRequired}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {req.mandatory ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Optional
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
