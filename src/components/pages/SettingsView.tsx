import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { checkServerHealth } from '../../services/apiService';
import {
  Settings,
  Cpu,
  ShieldCheck,
  BookOpen,
  Server,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, addAuditLog } = useApp();
  const [serverStatus, setServerStatus] = useState<any>(null);

  useEffect(() => {
    checkServerHealth().then(res => setServerStatus(res));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System Configuration & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Platform architecture, AI pipeline specifications, and public procurement governance standards.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & AI Engine Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Model & Pipeline</h3>
              <p className="text-[11px] text-slate-500">Google Gemini Developer API</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active Model:</span>
              <span className="font-bold text-blue-700 font-mono">gemini-3.8-flash</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Execution Runtime:</span>
              <span className="font-semibold text-slate-800">Server-Side Node.js / Express</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Server Status:</span>
              <span className="inline-flex items-center font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {serverStatus?.status === 'ok' ? 'Online (Port 3000)' : 'Active (Dev Server)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">SIH Problem Code:</span>
              <span className="font-bold font-mono text-slate-900">SIH26100</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            Gemini is strictly leveraged for <strong>document parsing, entity extraction, and explainable audit reasoning</strong>. All compliance decisions pass through the deterministic comparison engine.
          </div>
        </div>

        {/* Public Procurement Policy Reference */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Legal & Policy Mandates</h3>
              <p className="text-[11px] text-slate-500">GFR 2017 & GeM Guidelines</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">GFR 2017 - Rule 144 (Fundamental Principles)</span>
              <span className="text-[11px] text-slate-600">
                Mandates fair, transparent, and non-discriminatory technical evaluations with objective qualifying thresholds.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">GFR 2017 - Rule 160 (Transparency & Right to Know)</span>
              <span className="text-[11px] text-slate-600">
                Requires complete, recorded justifications for why any bidder is disqualified or declared non-responsive.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">GeM Technical Clarification Protocol</span>
              <span className="text-[11px] text-slate-600">
                Provides procurement officers with an official mechanism to seek clarification for faint seals or non-material deviations.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Logged in Officer Details */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Authenticated Officer Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Officer Name</span>
            <span className="font-bold text-slate-900">{currentUser?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee / Officer ID</span>
            <span className="font-bold font-mono text-slate-900">{currentUser?.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
            <span className="font-semibold text-slate-800">{currentUser?.designation}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-semibold text-slate-800">{currentUser?.department}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
