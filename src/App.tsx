import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DemoTourBanner } from './components/common/DemoTourBanner';
import { WhyFlaggedModal } from './components/common/WhyFlaggedModal';
import { EvidenceViewerModal } from './components/common/EvidenceViewerModal';

// Pages
import { DashboardView } from './components/pages/DashboardView';
import { TendersView } from './components/pages/TendersView';
import { TenderDetailView } from './components/pages/TenderDetailView';
import { BidsView } from './components/pages/BidsView';
import { BidDetailView } from './components/pages/BidDetailView';
import { VendorComparisonView } from './components/pages/VendorComparisonView';
import { VerificationCenterView } from './components/pages/VerificationCenterView';
import { ReportsView } from './components/pages/ReportsView';
import { AuditLogsView } from './components/pages/AuditLogsView';
import { SettingsView } from './components/pages/SettingsView';
import { LoginView } from './components/pages/LoginView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activePage } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'tenders':
        return <TendersView />;
      case 'tender-detail':
        return <TenderDetailView />;
      case 'bids':
        return <BidsView />;
      case 'bid-detail':
        return <BidDetailView />;
      case 'vendor-comparison':
        return <VendorComparisonView />;
      case 'verification':
        return <VerificationCenterView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 font-sans flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <TopBar />
        <DemoTourBanner />

        <main className="flex-1 pb-16">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals */}
      <WhyFlaggedModal />
      <EvidenceViewerModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
