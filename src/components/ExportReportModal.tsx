'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  Ship,
  Anchor,
  ShieldCheck,
  TrendingDown,
  Download,
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textContent = `
========================================================================
NAVIFREIGHT AI: INTELLIGENT BULK CHARTERING DECISION MEMORANDUM
Generated: October 19, 2026 | East Coast India Procurement Desk
========================================================================

EXECUTIVE SUMMARY & DECISION:
Action Tag: [ENTER 3-MONTH COA CONTRACT - HIGH SAVINGS]
Optimal Vessel Class: Kamsarmax (82,000 DWT) / Capesize (Dhamra/Gangavaram)
Recommended Route: Gladstone / Newcastle (Australia) -> Dhamra / Paradip
Projected Landed Freight Savings: $2.14 / MT (11.8% Net Savings)
Total Landed Cost Reduction: ₹48.20 Crore ($5.57M USD equivalent)

PHYSICAL PORT FEASIBILITY CHECK:
- Paradip (PPT): Draft 14.5m, Max LOA 260m -> Kamsarmax Permissible (Capesize Restricted)
- Dhamra (DPCL): Draft 17.5m, Max LOA 300m -> Capesize 100% Permissible
- Gangavaram (GPL): Draft 18.5m, Max LOA 310m -> Capesize & Newcastlemax Permissible
- Haldia (HDC): Draft 8.0m Riverine -> Handysize Only

MARKET OUTLOOK & QUANTITATIVE BASIS:
- Baltic Capesize (BCI) forward curves indicate a softening trend into Dec/Jan
- VLSFO Singapore bunker normalized at $605/MT
- Structured 3-Month COA provides rate certainty and insulates from prompt spot volatility
========================================================================
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0E1526] border border-white/10 rounded-[28px] max-w-2xl w-full p-6 sm:p-7 shadow-2xl shadow-black/90 space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-[#00D8F6] border border-cyan-500/30 shadow-glow-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">
                Executive Chartering Decision Memorandum
              </h3>
              <p className="text-xs text-slate-400">
                Official bulk freight forecasting &amp; contract procurement dossier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#151F36]/60 hover:bg-[#1A2642] text-slate-400 hover:text-white border border-slate-700/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Preview Document */}
        <div className="bg-[#070A12] border border-slate-800 rounded-2xl p-5 sm:p-6 text-xs text-slate-300 font-mono space-y-4 shadow-neumorphic-inset">
          <div className="flex justify-between items-start pb-3.5 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-[#00D8F6]">
                NaviFreight AI Procurement Platform
              </div>
              <div className="text-[11px] text-slate-400">
                Document Ref: NF-MEMO-2026-Q4-082
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Date: Oct 19, 2026</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 shadow-glow-emerald inline-block">
                Status: APPROVED FOR CHARTERING
              </div>
            </div>
          </div>

          {/* Section 1: Strategic Recommendation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              1. STRATEGIC CONTRACT DETERMINATION
            </span>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-emerald-300 font-sans shadow-glow-emerald">
              <div className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                ENTER 3-MONTH COA CONTRACT - HIGH SAVINGS
              </div>
              <p className="text-xs text-emerald-200/90 mt-1.5 leading-relaxed">
                Recommend entering a 3-Month Contract of Affreightment (COA) for 4 parcels
                (320,000 MT total). Benchmark COA rate of $16.30/MT yields an estimated landed
                savings of $2.14/MT vs volatile prompt spot rates ($18.44/MT), generating
                ₹5.92 Cr in direct freight savings.
              </p>
            </div>
          </div>

          {/* Section 2: Port & Vessel Compatibility Verification */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              2. MARITIME PHYSICAL FEASIBILITY AUDIT
            </span>
            <div className="bg-[#11192E]/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5 text-slate-300">
              <p>&bull; Paradip: Kamsarmax (14.4m draft) feasible. Capesize requires offshore lightening.</p>
              <p>&bull; Dhamra: Deep-water (17.5m draft) accommodates fully laden Capesize.</p>
              <p>&bull; Gangavaram: (18.5m draft) accommodates Capesize with fastest mechanized discharge.</p>
              <p>&bull; Haldia: Riverine lock (8.0m draft) strictly restricted to Handysize parcels.</p>
            </div>
          </div>

          {/* Section 3: Financial & Demurrage Summary */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              3. FINANCIAL &amp; RISK PROFILE
            </span>
            <div className="bg-[#11192E]/60 border border-slate-800/80 p-3.5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>Bunker Fuel Baseline: $605/MT VLSFO</div>
              <div>Demurrage Risk Allowance: $18,500/day</div>
              <div>Estimated Voyage Days: 14.8 Days (Aust-India)</div>
              <div>Turnaround Days at Port: 3.2 Days avg</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151F36]/80 hover:bg-[#1A2642] text-slate-200 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Plaintext'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D8F6] hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
