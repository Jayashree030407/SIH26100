import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficerRole } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/sampleData';
import {
  Scale,
  ShieldCheck,
  Building,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserCheck,
  FileCheck2,
  KeyRound
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<OfficerRole>('APPROVER');
  const [officerId, setOfficerId] = useState(DEMO_CREDENTIALS.approver.username);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.approver.password);
  const [department, setDepartment] = useState('Department of Expenditure, Ministry of Finance');

  const handleRoleChange = (role: OfficerRole) => {
    setSelectedRole(role);
    if (role === 'EVALUATOR') {
      setOfficerId(DEMO_CREDENTIALS.evaluator.username);
      setPassword(DEMO_CREDENTIALS.evaluator.password);
    } else {
      setOfficerId(DEMO_CREDENTIALS.approver.username);
      setPassword(DEMO_CREDENTIALS.approver.password);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ProcureAI</h1>
            <p className="text-xs text-slate-400 mt-0.5">Government Procurement Bid Compliance Platform</p>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Smart India Hackathon 2026 • SIH26100</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Officer Authentication Portal</h2>
            <p className="text-xs text-slate-500">Select your official procurement designation to log in</p>
          </div>

          {/* Quick Dual-Role Switcher for SIH Evaluators */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 text-xs block">Choose Role for Session:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('EVALUATOR')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'EVALUATOR'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-blue-700 font-bold text-xs">
                  <FileCheck2 className="w-4 h-4" />
                  <span>Evaluator</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 mt-1">Pooja Deshmukh</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Review, Evidence Flags & Rule Evaluation</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('APPROVER')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'APPROVER'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                  <span>Approver</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 mt-1">Rajesh V. Sharma</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Overrides, Final Award & Minutes Sign-off</p>
              </button>
            </div>
          </div>

          {/* Demo Credentials Reference Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
            <div className="font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center">
                <KeyRound className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Demo Credentials Configuration
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-semibold">Demo Auth Only</span>
            </div>
            <div className="text-slate-600 space-y-1 text-[10px] leading-relaxed">
              <p>• <strong>Evaluator:</strong> ID: <code className="font-mono text-slate-800 font-bold">{DEMO_CREDENTIALS.evaluator.username}</code> / Pass: <code className="font-mono text-slate-800">{DEMO_CREDENTIALS.evaluator.password}</code></p>
              <p>• <strong>Approver:</strong> ID: <code className="font-mono text-slate-800 font-bold">{DEMO_CREDENTIALS.approver.username}</code> / Pass: <code className="font-mono text-slate-800">{DEMO_CREDENTIALS.approver.password}</code></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Officer Employee ID</label>
              <input
                type="text"
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Department / Ministry</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="Department of Expenditure, Ministry of Finance">
                  Department of Expenditure, Ministry of Finance
                </option>
                <option value="Department of Higher Education, Ministry of Education">
                  Department of Higher Education, Ministry of Education
                </option>
                <option value="GeM Buyer Procurement Cell">GeM Buyer Procurement Cell</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Security PIN / Digital Passcode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20 text-xs sm:text-sm cursor-pointer"
            >
              <span>Login as {selectedRole === 'EVALUATOR' ? 'Pooja Deshmukh (Evaluator)' : 'Rajesh V. Sharma (Approver)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick One-Click Actions */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => login('EVALUATOR')}
              className="py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-900 border border-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Evaluator</span>
            </button>
            <button
              type="button"
              onClick={() => login('APPROVER')}
              className="py-2.5 bg-slate-100 hover:bg-indigo-50 text-indigo-900 border border-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Demo Approver</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Government of India Public Procurement Compliance Verification</p>
          <p className="text-[10px] text-slate-600">Simulated Environment for SIH26100 Evaluation</p>
        </div>
      </div>
    </div>
  );
};
