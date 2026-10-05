import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';

export const DemoTourBanner: React.FC = () => {
  const { isDemoTourActive, demoTourStep, nextDemoStep, prevDemoStep, endDemoTour } = useApp();

  if (!isDemoTourActive) return null;

  const steps = [
    {
      title: 'Step 1: Select Sample Tender',
      instruction: 'Viewing tender GEM/2026/B/10234 "Supply of Desktop Computers" on GeM portal.',
      targetPage: 'tenders'
    },
    {
      title: 'Step 2: View Extracted Requirements (18 Total)',
      instruction: 'AI extracted 5 Technical, 4 Eligibility, 3 Financial, 4 Documentation, and 2 Legal requirements.',
      targetPage: 'tender-detail'
    },
    {
      title: 'Step 3: Select Sample Vendor',
      instruction: 'Viewing vendor bids: TechNova (92%), Bharat Digital (78%), and NextGen Infotech (61%).',
      targetPage: 'bids'
    },
    {
      title: 'Step 4: View Uploaded Vendor Documents',
      instruction: 'Reviewing 9 uploaded technical bid documents with structured extraction and rule evaluation status.',
      targetPage: 'bid-detail'
    },
    {
      title: 'Step 5: Multi-Vendor Bid Comparison',
      instruction: 'Side-by-side compliance breakdown mapping all bidders across all 18 evaluated clauses.',
      targetPage: 'vendor-comparison'
    },
    {
      title: 'Step 6: Show Compliance Score & Summary',
      instruction: 'Overall score and risk classification based on deterministic compliance engine evaluation.',
      targetPage: 'bid-detail'
    },
    {
      title: 'Step 7: Inspect "Why Flagged?"',
      instruction: 'Explainable breakdown shows exact shortfall, policy clause, and recommended officer action.',
      targetPage: 'modal'
    },
    {
      title: 'Step 8: Document Evidence Viewer',
      instruction: '3-pane view highlighting extracted text snippet with clause citations.',
      targetPage: 'modal'
    },
    {
      title: 'Step 9: Officer Makes Final Review & Decision',
      instruction: 'Officer exercises human-in-the-loop authority with mandatory remarks and audit recording.',
      targetPage: 'bid-detail'
    },
    {
      title: 'Step 10: Complete Audit Trail',
      instruction: 'Persistent log of every automated check, document ingestion, and officer decision.',
      targetPage: 'audit-logs'
    }
  ];

  const current = steps[demoTourStep - 1] || steps[0];

  return (
    <div className="bg-slate-900 text-white px-6 py-3 border-b border-blue-500/40 sticky top-16 z-25 flex flex-wrap items-center justify-between shadow-lg animate-in slide-in-from-top-2">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
          {demoTourStep}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">SIH26100 Evaluator Tour</span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-sm font-semibold text-white">{current.title}</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{current.instruction}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <div className="text-xs text-slate-400 mr-2 font-mono">
          Step {demoTourStep} of 10
        </div>

        {demoTourStep > 1 && (
          <button
            onClick={prevDemoStep}
            className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        )}

        <button
          onClick={nextDemoStep}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <span>{demoTourStep === 10 ? 'Finish Tour' : 'Next Step'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={endDemoTour}
          className="p-1 text-slate-400 hover:text-white transition-colors ml-1"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
