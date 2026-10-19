'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import KpiTicker from '../components/KpiTicker';
import CharterSimulator from '../components/CharterSimulator';
import ForecastChart from '../components/ForecastChart';
import PortMatrix from '../components/PortMatrix';
import RouteVoyageMap from '../components/RouteVoyageMap';
import ExportReportModal from '../components/ExportReportModal';
import ScrollytellingNarrative from '../components/ScrollytellingNarrative';
import {
  Compass,
  Ship,
  TrendingUp,
  TableProperties,
  MapPin,
  Anchor,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'forecast' | 'ports' | 'routes'>('simulator');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleJumpToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A12] text-slate-100 font-sans selection:bg-[#00D8F6] selection:text-slate-950 relative">
      {/* Framer Motion Multi-Stage Scrollytelling Narrative Landing Experience */}
      <ScrollytellingNarrative onJumpToWorkspace={handleJumpToWorkspace} />

      {/* Target Operational Workspace anchor */}
      <div id="workspace" className="scroll-mt-4 flex flex-col flex-1 relative z-10">
        {/* Top Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Ticker & Strategic KPIs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 space-y-5">
          <KpiTicker />

          {/* Subtle Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          {/* Tab Header Banner */}
          <div className="bg-[#0E1526]/80 border border-white/10 backdrop-blur-xl rounded-[28px] p-5 sm:p-6 shadow-2xl shadow-black/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300">
            <div>
              <div className="text-xs font-bold text-[#00D8F6] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shadow-glow-cyan" />
                {activeTab === 'simulator' && 'Active Module: Bulk Charter Feasibility & Contract Simulator'}
                {activeTab === 'forecast' && 'Active Module: Baltic Dry Forward Curves & Volatility Hub'}
                {activeTab === 'ports' && 'Active Module: East Coast India Port Capability Matrix'}
                {activeTab === 'routes' && 'Active Module: Global Bulk Shipping Corridors & Chokepoint Intel'}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                {activeTab === 'simulator' && 'Intelligent Vessel Validation & Spot vs COA Decision Engine'}
                {activeTab === 'forecast' && '6-Month Baltic Sub-Indices (BCI, BPI, BSI) & 90-Day P10/P50/P90 Forecast'}
                {activeTab === 'ports' && 'Physical Port Dimensions, Discharge Speed & Real-Time Congestion Index'}
                {activeTab === 'routes' && 'Australia, Indonesia, South Africa, US Gulf to Bay of Bengal Navigation'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-mono bg-[#151F36]/80 px-4 py-2 rounded-full border border-slate-700/60 shadow-neumorphic">
                Procurement Cycle: Q4 2026 - Q1 2027
              </span>
            </div>
          </div>

          {/* Active Module Content */}
          <main className="py-2">
            {activeTab === 'simulator' && <CharterSimulator />}
            {activeTab === 'forecast' && <ForecastChart />}
            {activeTab === 'ports' && <PortMatrix />}
            {activeTab === 'routes' && <RouteVoyageMap />}
          </main>
        </div>

        {/* Enterprise Footer */}
        <footer className="mt-16 border-t border-white/5 bg-[#04060B] py-8 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-[#00D8F6] shadow-glow-cyan">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">NaviFreight AI</span>
              <span className="text-slate-400">&bull; Intelligent Maritime Freight Forecasting &amp; Bulk Chartering Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <span>East Coast India Ports: Paradip, Dhamra, Gangavaram, Vizag, Gopalpur, Haldia</span>
              <span>&bull;</span>
              <span>Baltic Sub-Indices: BCI, BPI, BSI</span>
              <span>&bull;</span>
              <span>Data Ref: Platts / Baltic Exchange</span>
            </div>
          </div>
        </footer>

        {/* Export Report / Decision Memorandum Modal */}
        <ExportReportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      </div>
    </div>
  );
}
