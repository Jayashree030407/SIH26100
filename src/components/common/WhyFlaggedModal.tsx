import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import {
  AlertTriangle,
  X,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { explainFlagWithAI } from '../../services/apiService';

export const WhyFlaggedModal: React.FC = () => {
  const { whyFlaggedResult, closeWhyFlagged, tenders, activeTenderId, openEvidenceViewer, bids, activeBidId } = useApp();
  const [aiLoading, setAiLoading] = useState(false);
  const [dynamicExplanation, setDynamicExplanation] = useState<string | null>(null);

  if (!whyFlaggedResult) return null;

  const activeTender = tenders.find(t => t.id === activeTenderId);
  const req = activeTender?.requirements.find(r => r.id === whyFlaggedResult.requirementId);
  const activeBid = bids.find(b => b.id === activeBidId);

  const handleGenerateLiveAiExplanation = async () => {
    setAiLoading(true);
    const text = await explainFlagWithAI({
      requirementDescription: req?.description || '',
      expectedValue: whyFlaggedResult.expectedValue || req?.expectedValue?.toString() || 'As per tender',
      detectedValue: whyFlaggedResult.detectedValue || 'Not provided',
      difference: whyFlaggedResult.difference || 'Deviation observed',
      documentName: whyFlaggedResult.evidence?.documentName || 'Technical Dossier',
      pageNumber: whyFlaggedResult.evidence?.pageNumber || 1
    });
    setDynamicExplanation(text);
    setAiLoading(false);
  };

  const isMissingEvidence = whyFlaggedResult.detectedValue?.includes('not found') || !whyFlaggedResult.evidence;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">Compliance Anomaly: Why Flagged?</h3>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {whyFlaggedResult.requirementId}
                </span>
              </div>
              <p className="text-xs text-slate-400">Explainable audit reasoning for human procurement officer</p>
            </div>
          </div>
          <button
            onClick={closeWhyFlagged}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status & Clause Info */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Requirement Classification</span>
              <span className="text-xs font-semibold text-slate-800">
                {req?.category} • {req?.clauseRef || 'Clause Ref'}
              </span>
            </div>
            <StatusBadge status={whyFlaggedResult.status} size="lg" />
          </div>

          {/* Requirement Statement */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tender Mandate</h4>
            <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs sm:text-sm leading-relaxed">
              {req?.description || whyFlaggedResult.requirementId}
            </p>
          </div>

          {/* Expected vs Detected Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg">
              <span className="text-xs font-semibold text-blue-900 block mb-1">Expected / Mandatory Standard</span>
              <p className="text-sm font-bold text-blue-950 font-mono">
                {whyFlaggedResult.expectedValue || req?.expectedValue?.toString() || 'Specified in RFP'}
              </p>
            </div>

            <div className={`p-3.5 border rounded-lg ${
              isMissingEvidence 
                ? 'bg-rose-50/60 border-rose-200' 
                : 'bg-amber-50/60 border-amber-200'
            }`}>
              <span className={`text-xs font-semibold block mb-1 ${
                isMissingEvidence ? 'text-rose-900' : 'text-amber-900'
              }`}>
                Detected in Vendor Bid
              </span>
              <p className={`text-sm font-bold font-mono ${
                isMissingEvidence ? 'text-rose-900 font-semibold' : 'text-amber-950'
              }`}>
                {whyFlaggedResult.detectedValue || 'Not detected in uploaded documents'}
              </p>
            </div>
          </div>

          {/* Variance / Shortfall Calculation */}
          {whyFlaggedResult.difference && (
            <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Computed Shortfall / Difference:</span>
                <span className="text-xs text-slate-700 font-mono mt-0.5 block">{whyFlaggedResult.difference}</span>
              </div>
            </div>
          )}

          {/* Document & Page Citation */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Document Citation & Evidence</span>
            {isMissingEvidence ? (
              <div className="text-xs text-rose-700 font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Evidence not found in uploaded documents.</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{whyFlaggedResult.evidence?.documentName}</span>
                  <span className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">
                    Page {whyFlaggedResult.evidence?.pageNumber}
                  </span>
                </div>
                <div className="text-slate-500 font-medium">
                  Rule Score: <span className="font-bold text-emerald-700">{whyFlaggedResult.confidence}% (Illustrative)</span>
                </div>
              </div>
            )}
          </div>

          {/* Explainable AI Analysis */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Explainable Compliance Audit Note</span>
              </div>
              <button
                onClick={handleGenerateLiveAiExplanation}
                disabled={aiLoading}
                className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold underline disabled:opacity-50"
              >
                {aiLoading ? 'Synthesizing...' : 'Regenerate with Gemini'}
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{dynamicExplanation || whyFlaggedResult.aiExplanation || whyFlaggedResult.reason}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">
            Rule engine provides explainable recommendations; officer retains final decision authority.
          </span>
          <div className="flex items-center space-x-2">
            {req && activeBid && whyFlaggedResult.evidence && (
              <button
                onClick={() => {
                  closeWhyFlagged();
                  openEvidenceViewer(req, whyFlaggedResult, activeBid);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Open Evidence Viewer</span>
              </button>
            )}
            <button
              onClick={closeWhyFlagged}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
