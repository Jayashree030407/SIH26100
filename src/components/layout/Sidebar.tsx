import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  ShieldCheck,
  Building2,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, navigateTo, currentUser, logout, tenders, bids } = useApp();

  const pendingDecisionsCount = bids.filter(b => b.finalOfficerStatus === 'PENDING_OFFICER_DECISION').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tenders', label: 'Tenders', icon: FileSpreadsheet, badge: tenders.length },
    { id: 'bids', label: 'Bids', icon: FileCheck2, badge: bids.length },
    { id: 'vendor-comparison', label: 'Compare Vendors', icon: Layers, badge: 'New' },
    { id: 'verification', label: 'Verification Center', icon: Building2, badge: 'Demo' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { id: 'audit-logs', label: 'Audit Logs', icon: History, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#0B2545] text-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none border-r border-[#12355B]/50">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#12355B]/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#1F5A91] flex items-center justify-center text-white font-bold shadow-md shadow-[#0B2545]/50 border border-white/10">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-white tracking-tight">ProcureAI</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20">
                SIH26100
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">AI Bid Compliance Platform</p>
          </div>
        </div>
      </div>

      {/* GeM Portal / Government Affiliation Badge */}
      <div className="px-4 py-2.5 bg-[#091E38]/80 border-b border-[#12355B]/40 flex items-center justify-between text-xs backdrop-blur-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
          <span className="text-[11px] font-medium text-slate-300">Gov Procurement Portal</span>
        </div>
        <span className="text-[10px] bg-white/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">
          Demo Mode
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id || 
            (item.id === 'tenders' && activePage === 'tender-detail') ||
            (item.id === 'bids' && activePage === 'bid-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#1F5A91] text-white shadow-sm font-semibold border border-white/10'
                  : 'text-slate-300 hover:bg-[#12355B]/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'New'
                      ? 'bg-[#2E7D32]/25 text-emerald-300 border border-[#2E7D32]/40'
                      : item.badge === 'Demo'
                      ? 'bg-[#B7791F]/25 text-amber-300 border border-[#B7791F]/40'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* SIH Fast-Action Callout */}
        <div className="mt-6 pt-4 border-t border-[#12355B]/40 px-2">
          <div className="bg-[#12355B]/40 rounded-xl p-3 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>SIH26100 Highlight</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Explainable compliance with deterministic rules and human officer final decision.
            </p>
          </div>
        </div>
      </nav>

      {/* Bottom Officer Profile & Logout */}
      <div className="p-3 border-t border-[#12355B]/50 bg-[#07192F] space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <button
            onClick={() => navigateTo('settings')}
            className="flex items-center space-x-1.5 hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Docs</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-1 hover:text-rose-300 transition-colors"
            title="Sign out of officer portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0B2545] border border-[#12355B]/50 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#1F5A91]/30 text-blue-300 flex items-center justify-center font-bold text-xs border border-[#1F5A91]/40">
            {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'GO'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Officer'}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                currentUser?.role === 'EVALUATOR' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
              }`}>
                {currentUser?.role || 'APPROVER'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.designation || 'Buyer / Officer'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
