'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Sparkles,
  Ship,
} from 'lucide-react';

export default function KpiTicker() {
  const tickerItems = [
    { label: 'BCI Capesize', value: '2,195', change: '-28 (-1.2%)', isDown: true },
    { label: 'BPI Panamax', value: '1,375', change: '-11 (-0.8%)', isDown: true },
    { label: 'BSI Supramax', value: '1,130', change: '-5 (-0.4%)', isDown: true },
    { label: 'Brent Crude', value: '$79.50/bbl', change: '+$0.25 (+0.3%)', isDown: false },
    { label: 'VLSFO Bunker (Sin/Fuj)', value: '$605/MT', change: '-$8.5 (-1.4%)', isDown: true },
    { label: 'USD/INR FX', value: '₹86.50', change: '+0.05 (+0.06%)', isDown: false },
    { label: 'Capesize 1Y TC', value: '$22,800/d', change: '-$350', isDown: true },
    { label: 'Panamax 1Y TC', value: '$13,900/d', change: '-$150', isDown: true },
  ];

  return (
    <div className="space-y-4">
      {/* Live Financial & Baltic Index Scrolling Ticker */}
      <div className="bg-[#0A0F1A]/90 border-y border-white/5 py-2.5 overflow-x-auto no-scrollbar backdrop-blur-md">
        <div className="flex items-center gap-6 px-4 min-w-max text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D8F6]/10 border border-[#00D8F6]/30 text-[#00D8F6] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,216,246,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#00D8F6] animate-ping inline-block" />
            Live Baltic &amp; Energy Feed
          </div>

          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-slate-400 font-sans">{item.label}:</span>
              <span className="font-bold text-white font-mono">{item.value}</span>
              <span
                className={`text-[11px] font-mono flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                  item.isDown
                    ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                    : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                }`}
              >
                {item.isDown ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {item.change}
              </span>
              <span className="text-slate-800 ml-2">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Level Strategic Procurement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Average Freight Savings */}
        <div className="bg-[#0E1526]/80 border border-white/10 rounded-[22px] p-5 shadow-xl hover:border-[#00D8F6]/40 hover:shadow-[0_0_25px_rgba(0,216,246,0.15)] transition-all duration-300 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Freight Savings
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">$2.14 / MT</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +11.8%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Achieved via predictive COA timing vs prompt spot fixtures
          </p>
        </div>

        {/* KPI 2: East Coast Congestion Index */}
        <div className="bg-[#0E1526]/80 border border-white/10 rounded-[22px] p-5 shadow-xl hover:border-[#00D8F6]/40 hover:shadow-[0_0_25px_rgba(0,216,246,0.15)] transition-all duration-300 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Port Congestion Avg
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">5.9 / 10</span>
            <span className="text-xs font-mono text-slate-400">~2.6d wait</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Haldia (5.2d) &amp; Paradip (3.4d) highest wait times
          </p>
        </div>

        {/* KPI 3: Active COA Opportunities */}
        <div className="bg-[#0E1526]/80 border border-white/10 rounded-[22px] p-5 shadow-xl hover:border-[#00D8F6]/40 hover:shadow-[0_0_25px_rgba(0,216,246,0.15)] transition-all duration-300 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active COA Windows
            </span>
            <div className="p-2 rounded-xl bg-[#00D8F6]/10 text-[#00D8F6] border border-[#00D8F6]/30 shadow-[0_0_15px_rgba(0,216,246,0.25)]">
              <Ship className="w-4 h-4 text-[#00D8F6]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#00D8F6]">4 Laycans</span>
            <span className="text-xs font-bold text-[#00D8F6] bg-[#00D8F6]/10 border border-[#00D8F6]/30 px-2 py-0.5 rounded-full">
              High Arbitrage
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Queensland &amp; Richards Bay routes in backwardation
          </p>
        </div>

        {/* KPI 4: Total Landed Cost Reduction */}
        <div className="bg-[#0E1526]/80 border border-white/10 rounded-[22px] p-5 shadow-xl hover:border-[#00D8F6]/40 hover:shadow-[0_0_25px_rgba(0,216,246,0.15)] transition-all duration-300 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Projected Landed Savings
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">₹48.2 Crore</span>
            <span className="text-xs font-mono text-slate-400">($5.57M)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Calculated across annual 2.6M MT procurement pipeline
          </p>
        </div>
      </div>
    </div>
  );
}
