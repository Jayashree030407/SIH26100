import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalVerificationRecord } from '../../types';
import { verifyExternalRegistry } from '../../services/apiService';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';

export const VerificationCenterView: React.FC = () => {
  const { verificationRecords, addVerificationRecord, addAuditLog } = useApp();

  const [verifyType, setVerifyType] = useState<string>('GST');
  const [vendorName, setVendorName] = useState<string>('TechNova Systems India Pvt Ltd');
  const [identifier, setIdentifier] = useState<string>('07AABCT1234D1Z5');
  const [loading, setLoading] = useState<boolean>(false);
  const [latestResponse, setLatestResponse] = useState<ExternalVerificationRecord | null>(null);

  const handleRunVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    const result = await verifyExternalRegistry(verifyType, identifier.trim(), vendorName.trim());
    addVerificationRecord(result);
    setLatestResponse(result);
    setLoading(false);

    addAuditLog(
      `External Registry Verification: ${verifyType}`,
      'SYSTEM-REGISTRY',
      `${result.status} (${result.registrySource})`,
      vendorName,
      `ID: ${identifier}`
    );
  };

  const handlePreload = (type: string, id: string, name: string) => {
    setVerifyType(type);
    setIdentifier(id);
    setVendorName(name);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-1 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulated / Demo External Registries</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Statutory & External Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-verify bidder identity, tax compliance, enterprise classification, and quality certifications via automated registry connectors.
          </p>
        </div>
      </div>

      {/* Simulated Disclaimer Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-300">
            Notice: Simulated Environment for Smart India Hackathon Evaluation
          </p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            To comply with procurement security guidelines and enable reliable offline hackathon demonstrations, external government APIs (GSTN, Protean NSDL, Udyam MSME, IAF CertSearch) are emulated using production-fidelity data schemas and status verifications.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Run Test Verification (Left) and Historical Verification Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification Trigger Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Query External Registry</h3>
            <p className="text-xs text-slate-500">Enter bidder credentials or pick a sample preset</p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Quick Test Presets:</span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handlePreload('GST', '07AABCT1234D1Z5', 'TechNova Systems India Pvt Ltd')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
              >
                TechNova GST
              </button>
              <button
                type="button"
                onClick={() => handlePreload('PAN', 'AABCT1234D', 'TechNova Systems India Pvt Ltd')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
              >
                TechNova PAN
              </button>
              <button
                type="button"
                onClick={() => handlePreload('ISO_9001', 'ISO-EXPIRED-BHARAT', 'Bharat Digital Solutions LLP')}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded text-rose-700 font-medium"
              >
                Expired ISO Test
              </button>
              <button
                type="button"
                onClick={() => handlePreload('UDYAM', 'UDYAM-DL-02-0045812', 'TechNova Systems India Pvt Ltd')}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded text-emerald-700 font-medium"
              >
                MSME Udyam
              </button>
            </div>
          </div>

          <form onSubmit={handleRunVerification} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Registry Gateway</label>
              <select
                value={verifyType}
                onChange={(e) => setVerifyType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="GST">GSTN (Goods & Services Tax Network)</option>
                <option value="PAN">Income Tax Department PAN (NSDL / Protean)</option>
                <option value="UDYAM">Ministry of MSME Udyam Registry</option>
                <option value="ISO_9001">IAF CertSearch / NABCB (ISO 9001)</option>
                <option value="MCA_PORTAL">Ministry of Corporate Affairs (MCA21 V3)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Vendor Entity Legal Name</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-md font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Registration / Tax ID</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-md font-mono font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Querying Registry...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Simulated Verification</span>
                </>
              )}
            </button>
          </form>

          {/* Latest Result Card */}
          {latestResponse && (
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {latestResponse.registrySource}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  latestResponse.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {latestResponse.status}
                </span>
              </div>
              <p className="font-mono text-slate-900 font-bold">{latestResponse.targetIdentifier}</p>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                {Object.entries(latestResponse.details || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-slate-800">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Verification Records Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Active Verification Registry Records ({verificationRecords.length})
              </span>
              <span className="text-amber-700 font-medium">Auto-Synced</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Gateway / Registry</th>
                    <th className="py-3 px-4">Identifier</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {verificationRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{rec.type}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">{rec.registrySource}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {rec.targetIdentifier}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-[140px] truncate">
                        {rec.vendorName}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500">
                        {new Date(rec.verifiedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
