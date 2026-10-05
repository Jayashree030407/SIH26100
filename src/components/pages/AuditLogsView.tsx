import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.vendorName && log.vendorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Persistent Audit Log (Local Storage)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Compliance & Officer Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Persistent, time-stamped record of all automated evaluations, document extractions, officer overrides, and final decisions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Session Audit Log Active</span>
          </span>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, officer, tender ID, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Actions ({auditLogs.length})</option>
            <option value="Decision">Officer Decisions</option>
            <option value="Override">Requirement Overrides</option>
            <option value="Analyzed">AI Ingestion</option>
            <option value="Verification">External Registries</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-44">Timestamp & Hash</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Tender / Subject</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Officer Actor</th>
                <th className="py-3 px-5">Result & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-slate-900 font-semibold block text-[11px]">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">ID: {log.id}</span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {log.tenderId}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {log.vendorName || <span className="text-slate-400 italic">N/A (Tender Level)</span>}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{log.officerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.officerId}</span>
                  </td>

                  <td className="py-3.5 px-5">
                    <p className="font-medium text-slate-900 leading-snug">{log.result}</p>
                    {log.details && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-sans italic">{log.details}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
