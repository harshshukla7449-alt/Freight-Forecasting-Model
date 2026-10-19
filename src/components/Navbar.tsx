'use client';

import React from 'react';
import {
  Compass,
  Ship,
  TrendingUp,
  Download,
  Radio,
  Sliders,
  TableProperties,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'simulator' | 'forecast' | 'ports' | 'routes';
  setActiveTab: (tab: 'simulator' | 'forecast' | 'ports' | 'routes') => void;
  onOpenExportModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenExportModal,
}: NavbarProps) {
  return (
    <header className="bg-[#070A12]/85 border-b border-white/10 sticky top-0 z-40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(0,216,246,0.35)]">
              <div className="w-full h-full bg-[#070A12] rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#00D8F6]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center">
                  NaviFreight<span className="text-[#00D8F6] ml-1">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D8F6]/10 text-[#00D8F6] border border-[#00D8F6]/30 shadow-[0_0_10px_rgba(0,216,246,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D8F6] animate-ping" />
                  V2.6 ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-normal">
                Intelligent Maritime Freight Forecasting &amp; Bulk Chartering Platform
              </p>
            </div>
          </div>

          {/* Navigation Pill Bar (Animmaster style) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#0E1526]/80 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeTab === 'simulator'
                  ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#151F36]/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Charter Simulator
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeTab === 'forecast'
                  ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#151F36]/80'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Forecast Hub
            </button>

            <button
              onClick={() => setActiveTab('ports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeTab === 'ports'
                  ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#151F36]/80'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Port Matrix
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeTab === 'routes'
                  ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#151F36]/80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Voyage Corridors
            </button>
          </nav>

          {/* Right Action Button: Export Memorandum */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#11192E] hover:bg-[#151F36] text-slate-200 hover:text-white border border-white/10 hover:border-[#00D8F6]/50 text-xs font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,216,246,0.3)]"
            >
              <Download className="w-3.5 h-3.5 text-[#00D8F6]" />
              <span className="hidden sm:inline">Export Charter Memo</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="lg:hidden flex items-center justify-around py-2.5 border-t border-white/5 text-xs font-semibold overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              activeTab === 'simulator'
                ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,216,246,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Charter Simulator
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              activeTab === 'forecast'
                ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,216,246,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forecast Hub
          </button>
          <button
            onClick={() => setActiveTab('ports')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              activeTab === 'ports'
                ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,216,246,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Port Matrix
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              activeTab === 'routes'
                ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,216,246,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corridors
          </button>
        </div>
      </div>
    </header>
  );
}
