import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  FileCheck,
  ShieldCheck,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Search
} from 'lucide-react';

export const EvidenceViewerModal: React.FC = () => {
  const { evidenceViewerData, closeEvidenceViewer, overrideRequirement } = useApp();
  const [officerNotes, setOfficerNotes] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!evidenceViewerData) return null;

  const { req, result, bid } = evidenceViewerData;
  const doc = bid.documents.find(d => d.name === result.evidence?.documentName) || bid.documents[0];

  const handleMarkVerified = () => {
    overrideRequirement(
      bid.id,
      req.id,
      'COMPLIANT',
      officerNotes || 'Verified by procurement officer after physical/scanned page examination.'
    );
    setActionDone('Requirement marked as COMPLIANT by Officer.');
    setTimeout(() => {
      closeEvidenceViewer();
    }, 1200);
  };

  const handleRequestClarification = () => {
    overrideRequirement(
      bid.id,
      req.id,
      'NEEDS_REVIEW',
      officerNotes || 'Formal clarification requested from bidder regarding legible document seal / validity.'
    );
    setActionDone('Clarification request logged for bidder.');
    setTimeout(() => {
      closeEvidenceViewer();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-tight">Document Evidence Viewer</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                  {req.id}
                </span>
                <span className="text-xs text-slate-400">• {bid.vendorName}</span>
              </div>
              <p className="text-xs text-slate-400">Verifying tender compliance with direct page reference & clause extraction</p>
            </div>
          </div>
          <button
            onClick={closeEvidenceViewer}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Pane Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT PANE: Requirement Details (3 cols) */}
          <div className="lg:col-span-3 border-r border-slate-200 p-5 overflow-y-auto bg-slate-50 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requirement ID</span>
              <h4 className="text-base font-bold text-slate-900">{req.id}</h4>
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                  {req.category}
                </span>
                {req.mandatory && (
                  <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                    Mandatory
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Clause Reference:</span>
              <p className="text-xs font-mono text-slate-800 font-bold">{req.clauseRef}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">Tender Clause Statement:</span>
              <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-md border border-slate-200">
                {req.description}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">Required Evidence:</span>
              <p className="text-xs text-slate-700 bg-white p-2.5 rounded-md border border-slate-200">
                {req.evidenceRequired}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">Rule Logic:</span>
              <p className="text-xs text-slate-500 italic">
                {req.ruleDescription || 'Deterministic comparison against tender criteria'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">AI Evaluation Status</span>
              <StatusBadge status={result.status} size="md" />
              <p className="text-xs text-slate-600 mt-1">{result.reason}</p>
            </div>
          </div>

          {/* CENTER PANE: Document Preview / Extracted Text with Highlights (6 cols) */}
          <div className="lg:col-span-6 flex flex-col bg-slate-100 border-r border-slate-200 overflow-hidden">
            {/* Document Toolbar */}
            <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2 font-medium truncate">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{result.evidence?.documentName || doc?.name}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px] text-slate-700">
                  Page {result.evidence?.pageNumber || 1} of {doc?.totalPages || 6}
                </span>
                <button
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                  title="Document Verified"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Canvas / Text Extracted View */}
            <div className="flex-1 p-6 overflow-y-auto flex justify-center">
              <div className="w-full max-w-xl bg-white rounded-md shadow-md border border-slate-300 p-8 font-sans text-xs leading-relaxed space-y-4 min-h-[500px] select-text">
                {/* Simulated Document Header */}
                <div className="border-b-2 border-slate-800 pb-3 text-center space-y-1">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500">
                    Official Procurement Submission Document
                  </span>
                  <h3 className="text-sm font-bold uppercase text-slate-900 tracking-wide">
                    {result.evidence?.documentName?.replace('.pdf', '').replace(/_/g, ' ') || 'Document Preview'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Issued to: <span className="font-bold text-slate-700">{bid.vendorName}</span> • Tender Ref: GEM/2026/B/10234
                  </p>
                </div>

                <div className="text-slate-600 text-xs space-y-3 pt-2">
                  <p>
                    To: The Procurement Officer & Tender Committee, Government Procurement Portal.
                  </p>
                  <p>
                    Sub: Bid submission credentials and technical compliance verification against Tender ID: GEM/2026/B/10234.
                  </p>

                  {/* Highlighted Match Box */}
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-lg shadow-xs my-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                      <span className="flex items-center">
                        <Search className="w-3 h-3 mr-1" />
                        AI Extracted Clause Evidence Snippet
                      </span>
                      <span className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">
                        Page {result.evidence?.pageNumber || 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 bg-white p-2.5 rounded border border-amber-300 leading-normal">
                      "{result.evidence?.detectedTextSnippet || doc?.extractedTextPreview || 'Extracted clause evidence from verified page.'}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-amber-800 pt-1">
                      <span>Detected Field Value: <strong>{result.evidence?.detectedValue || result.detectedValue}</strong></span>
                      <span>Rule Match Score: <strong>{result.evidence?.confidenceScore || result.confidence}% (Illustrative)</strong></span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Sample extracted bid data — vendor document OCR pipeline is under development. Fields are deterministically evaluated by the compliance engine.
                  </p>
                </div>

                {/* Simulated Signature / Seal Block */}
                <div className="pt-8 mt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <div>
                    <span className="block font-bold text-slate-700">Authorized Signatory</span>
                    <span>{bid.vendorName}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 border border-dashed border-slate-400 rounded text-slate-400 font-mono">
                      [DEMO BIDDER SIGNATURE & ATTESTATION]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Evidence Panel & Verification Actions (3 cols) */}
          <div className="lg:col-span-3 p-5 overflow-y-auto bg-white space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence Assessment</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Extracted Value & Citation</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Document Name</span>
                <span className="font-bold text-slate-800 break-words">
                  {result.evidence?.documentName || doc?.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Page No.</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {result.evidence?.pageNumber || 1}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Rule Score</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {result.confidence}% <span className="text-[10px] text-slate-400 font-normal">(Illustrative)</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Extracted Value</span>
                <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">
                  {result.evidence?.detectedValue || result.detectedValue}
                </span>
              </div>
            </div>

            {/* Officer Action Panel */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">Officer Verification Notes</span>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Enter remarks or justification for officer decision..."
                rows={3}
                className="w-full p-2.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {actionDone && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium animate-in fade-in">
                  ✓ {actionDone}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleMarkVerified}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Verified (Compliant)</span>
                </button>

                <button
                  onClick={handleRequestClarification}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Request Clarification</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Human-in-the-Loop: Officer verified actions are recorded in the procurement audit log.</span>
          </div>
          <button
            onClick={closeEvidenceViewer}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
