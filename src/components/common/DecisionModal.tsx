import React, { useState } from 'react';
import { VendorBid } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface DecisionModalProps {
  bid: VendorBid;
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({ bid, isOpen, onClose }) => {
  const { updateOfficerDecision, currentUser } = useApp();
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'>('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'EVALUATOR' && decision === 'APPROVED') {
      setError('Permission Restricted: As a Procurement Evaluator, you can review and request clarification or recommend disqualification. Only a Procurement Approver can confirm final contract award/qualification.');
      return;
    }
    if (!remarks.trim() || remarks.length < 5) {
      setError('Please provide detailed officer remarks justifying the decision (minimum 5 characters).');
      return;
    }
    updateOfficerDecision(bid.id, decision, remarks.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {currentUser?.role === 'EVALUATOR' ? 'Evaluator Technical Recommendation' : 'Tender Committee Final Decision'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser?.role === 'EVALUATOR'
                  ? 'Technical officer evaluation and recommendation for committee review'
                  : 'Formal executive qualification and award sign-off record'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Bid Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Bidder Entity:</span>
              <span className="font-bold text-slate-800">{bid.vendorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Tender Reference:</span>
              <span className="font-mono text-slate-700">{bid.tenderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">AI Evaluated Score:</span>
              <span className="font-bold font-mono text-slate-900">{bid.complianceScore}% ({bid.riskLevel} Risk)</span>
            </div>
          </div>

          {/* Decision Selection Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Officer Action
              </label>
              {currentUser?.role === 'EVALUATOR' && (
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                  Evaluator Mode: Clarify / Disqualify Only
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={currentUser?.role === 'EVALUATOR'}
                onClick={() => setDecision('APPROVED')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  currentUser?.role === 'EVALUATOR'
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                    : decision === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title={currentUser?.role === 'EVALUATOR' ? 'Requires Approver Role to confirm final qualification' : 'Approve & Qualify Bidder'}
              >
                <CheckCircle2 className={`w-5 h-5 mb-1 ${decision === 'APPROVED' && currentUser?.role !== 'EVALUATOR' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs">Approve / Qualify</span>
                {currentUser?.role === 'EVALUATOR' && <span className="text-[9px] text-slate-400">(Approver Only)</span>}
              </button>

              <button
                type="button"
                onClick={() => setDecision('CLARIFICATION_REQUESTED')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  decision === 'CLARIFICATION_REQUESTED'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-200 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className={`w-5 h-5 mb-1 ${decision === 'CLARIFICATION_REQUESTED' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs">Clarification</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  decision === 'REJECTED'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-200 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-5 h-5 mb-1 ${decision === 'REJECTED' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="text-xs">Disqualify</span>
              </button>
            </div>
          </div>

          {/* Remarks input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Officer Justification & Minutes Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              placeholder={
                decision === 'APPROVED'
                  ? 'e.g., Technically qualified. All mandatory criteria satisfied or verified in order.'
                  : decision === 'CLARIFICATION_REQUESTED'
                  ? 'e.g., Clarification sought under Clause 6.1 regarding unreadable ISO 9001 seal.'
                  : 'e.g., Disqualified due to failure in mandatory average annual turnover and experience thresholds.'
              }
              className="w-full p-2.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
            />
            {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
          </div>

          {/* Audit disclaimer */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Recorded by <strong>{currentUser?.name}</strong> [Role: <strong>{currentUser?.role || 'APPROVER'}</strong>] (ID: {currentUser?.id}) in the persistent audit log.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              {currentUser?.role === 'EVALUATOR' ? 'Submit Evaluator Recommendation' : 'Confirm & Sign Final Decision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
