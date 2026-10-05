import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Tender, TenderRequirement } from '../../types';
import { extractPdfText, analyzeTender } from '../../services/apiService';
import {
  FileSpreadsheet,
  PlusCircle,
  UploadCloud,
  FileText,
  Calendar,
  DollarSign,
  ChevronRight,
  Sparkles,
  Building,
  CheckCircle2,
  X,
  Search,
  SlidersHorizontal,
  ExternalLink,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const TendersView: React.FC = () => {
  const { tenders, addTender, navigateTo } = useApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form states for Upload Modal
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState(`GEM/2026/B/${Math.floor(10000 + Math.random() * 90000)}`);
  const [newCategory, setNewCategory] = useState('IT Hardware');
  const [newEstValue, setNewEstValue] = useState('₹4.50 Crore');
  const [newAuthority, setNewAuthority] = useState('Ministry of Education, Department of Higher Education');
  const [tenderSnippet, setTenderSnippet] = useState(
    'Request for Proposal (RFP) for procurement of 500 Desktop Computers, Intel Core i7 13th Gen, 16GB DDR5 RAM, 512GB NVMe SSD, OEM direct authorization, 3 years commercial track record with minimum ₹5 Crore turnover, and ISO 9001 certification.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfUploadStatus, setPdfUploadStatus] = useState<{
    fileName: string;
    pageCount: number;
    isScanned: boolean;
    warning?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTenders = tenders.filter(t =>
    t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handlePdfFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingPdf(true);
    setPdfUploadStatus(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1] || (reader.result as string);
        const result = await extractPdfText(base64, file.name);

        if (result.success && !result.isScannedImageOnly && result.text) {
          setTenderSnippet(result.text.slice(0, 4500));
          if (!newTitle) {
            setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
          }
          setPdfUploadStatus({
            fileName: file.name,
            pageCount: result.pageCount,
            isScanned: false
          });
        } else {
          setPdfUploadStatus({
            fileName: file.name,
            pageCount: result.pageCount,
            isScanned: true,
            warning: result.warning || 'Scanned / Image-Only PDF: No embedded text stream detected. OCR is not configured in this demo environment. Document flagged for manual officer review.'
          });
        }
      } catch (err) {
        console.error('PDF ingestion error:', err);
        setPdfUploadStatus({
          fileName: file.name,
          pageCount: 1,
          isScanned: true,
          warning: 'Could not parse PDF. Document flagged for manual officer examination.'
        });
      } finally {
        setIsExtractingPdf(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCreateTenderWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAnalyzing(true);

    try {
      // Call real backend API to analyze tender clauses
      const result = await analyzeTender(newTitle, tenderSnippet, newCategory);

      // PHASE 1: Flow real requirements from Gemini / verified engine directly into the new tender!
      const requirements: TenderRequirement[] = result.requirements.map((r, idx) => ({
        ...r,
        id: r.id || `REQ-${String(idx + 1).padStart(3, '0')}`,
      }));

      const newTenderObj: Tender = {
        id: newRef,
        title: newTitle,
        category: newCategory,
        estimatedValue: newEstValue,
        issuingAuthority: newAuthority,
        publishDate: new Date().toISOString().split('T')[0],
        closingDate: '2026-10-15',
        status: 'ACTIVE',
        bidsCount: 1,
        requirements,
        description: tenderSnippet
      };

      addTender(newTenderObj);
      setIsAnalyzing(false);
      setIsUploadModalOpen(false);
      navigateTo('tender-detail', { tenderId: newTenderObj.id });
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tenders & RFP Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage published tenders, ingest RFP documents, and extract structured compliance checklists.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload & Analyze Tender RFP</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tender reference, department, or keyword..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Showing <strong>{filteredTenders.length}</strong> active tenders</span>
        </div>
      </div>

      {/* Tenders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                  {tender.id}
                </span>
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {tender.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {tender.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">{tender.issuingAuthority}</span>
                </p>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
                  <span className="font-semibold text-slate-800 truncate block">{tender.category}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Value</span>
                  <span className="font-semibold text-slate-800 font-mono truncate block">{tender.estimatedValue}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Checklist</span>
                  <span className="font-semibold text-blue-700 font-mono truncate block">
                    {tender.requirements.length} Clauses
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50/60 p-2.5 rounded border border-slate-100">
                "{tender.description}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Closing: <strong className="text-slate-700">{tender.closingDate}</strong>
              </span>

              <button
                onClick={() => navigateTo('tender-detail', { tenderId: tender.id })}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>View Checklist & Bids</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload & Analyze Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Upload & Ingest Tender Document</h3>
                  <p className="text-xs text-slate-400">Automated multi-category clause extraction with Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenderWithAI} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tender Title / Procurement Scope</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supply and Commissioning of 500 Desktop Computers"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tender ID / GeM Reference</label>
                  <input
                    type="text"
                    required
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Vehicles & Transport">Vehicles & Transport</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Civil Infrastructure">Civil Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Estimated Value</label>
                  <input
                    type="text"
                    value={newEstValue}
                    onChange={(e) => setNewEstValue(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department / Ministry</label>
                  <input
                    type="text"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tender RFP Document Text / Clauses Preview</label>
                <textarea
                  rows={4}
                  value={tenderSnippet}
                  onChange={(e) => setTenderSnippet(e.target.value)}
                  placeholder="Paste tender RFP clauses or specification requirements here..."
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Real PDF Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.txt"
                onChange={handlePdfFileSelect}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg text-center cursor-pointer bg-slate-50 transition-colors"
              >
                {isExtractingPdf ? (
                  <div className="flex flex-col items-center justify-center space-y-1 py-1">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-blue-700">Extracting text from uploaded PDF...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 block">
                      Click to upload Tender RFP PDF (Real Document Ingestion)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Extracts embedded text layer. Scanned documents will be flagged for review.
                    </span>
                  </>
                )}
              </div>

              {/* PDF Status / Scanned Warning */}
              {pdfUploadStatus && (
                <div className={`p-3 rounded-lg border text-xs ${
                  pdfUploadStatus.isScanned
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    {pdfUploadStatus.isScanned ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <p className="font-bold">
                        {pdfUploadStatus.fileName} ({pdfUploadStatus.pageCount} Pages)
                      </p>
                      {pdfUploadStatus.warning ? (
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          {pdfUploadStatus.warning}
                        </p>
                      ) : (
                        <p className="text-[11px] text-emerald-800">
                          ✓ Successfully extracted text from document. Ready for Gemini clause structuring.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Extracting 18 Clauses with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract Requirements Checklist</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
