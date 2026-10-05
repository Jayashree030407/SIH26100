import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  HelpCircle,
  PlayCircle,
  Building,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  FileCheck2,
  RotateCcw,
  LogOut
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activePage,
    activeTenderId,
    activeBidId,
    tenders,
    bids,
    navigateTo,
    startDemoPresentation,
    isDemoTourActive,
    currentUser,
    logout,
    resetBaselineData
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTender = tenders.find(t => t.id === activeTenderId);
  const currentBid = bids.find(b => b.id === activeBidId);

  // Generate breadcrumb items
  const getBreadcrumbs = () => {
    const items = [{ label: 'Portal', page: 'dashboard' }];

    if (activePage === 'dashboard') {
      items.push({ label: 'Officer Dashboard', page: 'dashboard' });
    } else if (activePage === 'tenders') {
      items.push({ label: 'Tenders Management', page: 'tenders' });
    } else if (activePage === 'tender-detail') {
      items.push({ label: 'Tenders', page: 'tenders' });
      items.push({ label: currentTender ? currentTender.id : 'Tender Details', page: 'tender-detail' });
    } else if (activePage === 'bids') {
      items.push({ label: 'Vendor Bids', page: 'bids' });
    } else if (activePage === 'bid-detail') {
      items.push({ label: 'Vendor Bids', page: 'bids' });
      items.push({ label: currentBid ? currentBid.vendorName : 'Evaluation Dossier', page: 'bid-detail' });
    } else if (activePage === 'vendor-comparison') {
      items.push({ label: 'Vendor Comparison', page: 'vendor-comparison' });
    } else if (activePage === 'verification') {
      items.push({ label: 'Verification Center', page: 'verification' });
    } else if (activePage === 'reports') {
      items.push({ label: 'Reports & Analytics', page: 'reports' });
    } else if (activePage === 'audit-logs') {
      items.push({ label: 'Audit Trail', page: 'audit-logs' });
    } else if (activePage === 'settings') {
      items.push({ label: 'Portal Settings', page: 'settings' });
    }

    return items;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    const matchedTender = tenders.find(t => t.id.toLowerCase().includes(query) || t.title.toLowerCase().includes(query));
    if (matchedTender) {
      navigateTo('tender-detail', { tenderId: matchedTender.id });
      return;
    }
    const matchedBid = bids.find(b => b.vendorName.toLowerCase().includes(query));
    if (matchedBid) {
      navigateTo('bid-detail', { bidId: matchedBid.id, tenderId: matchedBid.tenderId });
      return;
    }
    navigateTo('bids');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-6 shadow-xs">
      {/* Left: Breadcrumbs and Department Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-xs text-slate-500 font-medium">
          {getBreadcrumbs().map((b, idx, arr) => (
            <React.Fragment key={b.label + idx}>
              <button
                onClick={() => navigateTo(b.page)}
                className={`hover:text-blue-600 transition-colors ${
                  idx === arr.length - 1 ? 'font-semibold text-slate-800' : ''
                }`}
              >
                {b.label}
              </button>
              {idx < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="hidden xl:flex items-center pl-3 border-l border-slate-200 text-xs text-slate-600">
          <Building className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
          <span className="font-medium">Government Procurement Portal</span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span className="text-slate-500">Department of Expenditure</span>
        </div>
      </div>

      {/* Right: Actions, Role Badge, Quick Switcher, Demo Mode */}
      <div className="flex items-center space-x-2.5">
        {/* Active Role Indicator & Re-authenticate Switcher */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center space-x-1.5">
            {currentUser?.role === 'EVALUATOR' ? (
              <span className="flex items-center font-bold text-blue-700">
                <FileCheck2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Role: Evaluator (Review Only)
              </span>
            ) : (
              <span className="flex items-center font-bold text-indigo-700">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Role: Approver (Full Authority)
              </span>
            )}
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center space-x-1 px-2 py-0.5 text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors font-medium cursor-pointer"
            title="Switching roles requires re-authentication"
          >
            <LogOut className="w-3 h-3 text-slate-500" />
            <span>Switch Role</span>
          </button>
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tender ID, clause, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder:text-slate-400"
          />
        </form>

        {/* Reset Baseline Data Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all tenders, bids, and audit logs to the initial baseline state?')) {
              resetBaselineData();
            }
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Reset Demo Baseline (Clear local modifications)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Start Demo Button (SIH evaluator walkthrough) */}
        <button
          onClick={startDemoPresentation}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
            isDemoTourActive
              ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
              : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-800 hover:to-indigo-800 shadow-blue-500/10'
          }`}
          title="Start interactive guided presentation of all 10 SIH evaluation stages"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{isDemoTourActive ? 'Demo Active' : 'Start Demo'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Procurement Alerts</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 mt-2">
                <div
                  onClick={() => {
                    navigateTo('bid-detail', { bidId: 'BID-TECHNOVA-01' });
                    setShowNotifications(false);
                  }}
                  className="py-2 px-1 hover:bg-slate-50 cursor-pointer rounded text-xs space-y-0.5"
                >
                  <p className="font-semibold text-slate-800 flex items-center">
                    <AlertTriangle className="w-3 h-3 text-amber-500 mr-1.5" />
                    Review Required: TechNova Systems
                  </p>
                  <p className="text-slate-500 text-[11px]">ISO 9001 expiry date seal illegible on page 1.</p>
                  <p className="text-[10px] text-slate-400">10 mins ago</p>
                </div>

                <div
                  onClick={() => {
                    navigateTo('bid-detail', { bidId: 'BID-NEXTGEN-03' });
                    setShowNotifications(false);
                  }}
                  className="py-2 px-1 hover:bg-slate-50 cursor-pointer rounded text-xs space-y-0.5"
                >
                  <p className="font-semibold text-slate-800 flex items-center">
                    <AlertTriangle className="w-3 h-3 text-rose-500 mr-1.5" />
                    Turnover Shortfall: NextGen Infotech
                  </p>
                  <p className="text-slate-500 text-[11px]">Detected ₹4.20 Cr vs ₹5.00 Cr mandatory threshold.</p>
                  <p className="text-[10px] text-slate-400">25 mins ago</p>
                </div>

                <div
                  onClick={() => {
                    navigateTo('tender-detail', { tenderId: 'GEM/2026/B/10234' });
                    setShowNotifications(false);
                  }}
                  className="py-2 px-1 hover:bg-slate-50 cursor-pointer rounded text-xs space-y-0.5"
                >
                  <p className="font-semibold text-slate-800 flex items-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1.5" />
                    Tender GEM/2026/B/10234
                  </p>
                  <p className="text-slate-500 text-[11px]">AI extracted 18 requirements across 5 categories.</p>
                  <p className="text-[10px] text-slate-400">1 hr ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-[11px] text-emerald-800 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rules Engine Active</span>
        </div>
      </div>
    </header>
  );
};
