'use client';

import React, { useState, useMemo } from 'react';
import {
  Anchor,
  Search,
  ChevronDown,
  ChevronUp,
  Ship,
  Train,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { EAST_COAST_PORTS, VESSEL_TYPES } from '../data/maritimeData';
import { IndianPortId, VesselTypeId } from '../types/maritime';

export default function PortMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCapesizeOnly, setFilterCapesizeOnly] = useState(false);
  const [filterLowCongestion, setFilterLowCongestion] = useState(false);
  const [expandedPortId, setExpandedPortId] = useState<IndianPortId | null>('paradip');

  const portsList = useMemo(() => {
    return Object.values(EAST_COAST_PORTS).filter((port) => {
      const matchesSearch =
        port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.berthType.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterCapesizeOnly && port.maxDraft < 17.5) return false;
      if (filterLowCongestion && port.congestionIndex >= 5.0) return false;

      return true;
    });
  }, [searchQuery, filterCapesizeOnly, filterLowCongestion]);

  const getCompatibility = (portDraft: number, portLoa: number, portBeam: number, vesselId: VesselTypeId) => {
    const vessel = VESSEL_TYPES[vesselId];
    const draftOk = vessel.draftTypical <= portDraft;
    const loaOk = vessel.loaTypical <= portLoa;
    const beamOk = vessel.beamTypical <= portBeam;
    return draftOk && loaOk && beamOk;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header (Animmaster Neumorphic Panel) */}
      <div className="bg-[#0E1526]/85 border border-white/10 rounded-[26px] p-5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search port name, state, berth features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11192E] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/40 transition-all shadow-inner"
          />
        </div>

        {/* Filter Quick Glow Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCapesizeOnly(!filterCapesizeOnly)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-2 ${
              filterCapesizeOnly
                ? 'bg-[#00D8F6] text-slate-950 font-bold border-[#00D8F6] shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                : 'bg-[#151F36]/60 text-slate-300 border-white/10 hover:border-[#00D8F6]/40 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            Capesize-Ready (Draft &ge; 17.5m)
          </button>

          <button
            onClick={() => setFilterLowCongestion(!filterLowCongestion)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-2 ${
              filterLowCongestion
                ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-[#151F36]/60 text-slate-300 border-white/10 hover:border-emerald-400/40 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Low Queue (&lt; 2 Days)
          </button>
        </div>
      </div>

      {/* Main Table / Matrix Card */}
      <div className="bg-[#0E1526]/85 border border-white/10 rounded-[28px] shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#070A12]/90 border-b border-white/10 text-slate-400 uppercase font-mono tracking-wider">
                <th className="py-4 px-5 font-semibold">East Coast Port</th>
                <th className="py-4 px-3 font-semibold text-center">Permissible Draft</th>
                <th className="py-4 px-3 font-semibold text-center">Max LOA</th>
                <th className="py-4 px-3 font-semibold text-center">Max Beam</th>
                <th className="py-4 px-3 font-semibold text-right">Daily Discharge</th>
                <th className="py-4 px-4 font-semibold text-center">Berth Congestion</th>
                <th className="py-4 px-4 font-semibold text-center">Vessel Feasibility Matrix</th>
                <th className="py-4 px-3 font-semibold text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {portsList.map((port) => {
                const isExpanded = expandedPortId === port.id;
                const capeOk = getCompatibility(port.maxDraft, port.maxLoa, port.maxBeam, 'capesize');
                const panaOk = getCompatibility(port.maxDraft, port.maxLoa, port.maxBeam, 'kamsarmax_panamax');
                const supraOk = getCompatibility(port.maxDraft, port.maxLoa, port.maxBeam, 'supramax_ultramax');
                const handyOk = getCompatibility(port.maxDraft, port.maxLoa, port.maxBeam, 'handysize');

                return (
                  <React.Fragment key={port.id}>
                    <tr
                      className={`hover:bg-[#11192E]/70 transition-colors ${
                        isExpanded ? 'bg-[#11192E]/50' : ''
                      }`}
                    >
                      {/* Port Name & State */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-2xl border shrink-0 ${
                              port.isRiverine
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                                : port.maxDraft >= 17.5
                                ? 'bg-[#00D8F6]/10 text-[#00D8F6] border-[#00D8F6]/30 shadow-[0_0_12px_rgba(0,216,246,0.2)]'
                                : 'bg-[#151F36] text-slate-300 border-white/10'
                            }`}
                          >
                            <Anchor className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              {port.name}
                              {port.isRiverine && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                                  Riverine Lock
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {port.state} &bull; {port.berthType.slice(0, 34)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Draft */}
                      <td className="py-4 px-3 text-center font-mono">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-bold ${
                            port.maxDraft >= 17.5
                              ? 'bg-[#00D8F6]/20 text-[#00D8F6] border border-[#00D8F6]/40 shadow-[0_0_12px_rgba(0,216,246,0.25)]'
                              : port.maxDraft >= 14.0
                              ? 'bg-[#151F36] text-white border border-white/10'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                          }`}
                        >
                          {port.maxDraft.toFixed(1)} m
                        </span>
                      </td>

                      {/* LOA */}
                      <td className="py-4 px-3 text-center font-mono text-white font-semibold">
                        {port.maxLoa} m
                      </td>

                      {/* Beam */}
                      <td className="py-4 px-3 text-center font-mono text-slate-300">
                        {port.maxBeam} m
                      </td>

                      {/* Daily Discharge */}
                      <td className="py-4 px-3 text-right font-mono">
                        <span className="font-bold text-white text-sm">
                          {port.dailyDischargeRate.toLocaleString()}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">MT/d</span>
                      </td>

                      {/* Congestion Index */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-3 py-0.5 rounded-full font-mono font-bold text-xs ${
                              port.congestionIndex <= 4.5
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                                : port.congestionIndex <= 7.0
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                            }`}
                          >
                            Index {port.congestionIndex} / 10
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 font-mono">
                            ~{port.avgWaitDays}d wait
                          </span>
                        </div>
                      </td>

                      {/* Feasibility Badges */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            title={`Capesize: ${capeOk ? 'Feasible' : 'Exceeds Draft/LOA'}`}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              capeOk
                                ? 'bg-[#00D8F6]/20 text-[#00D8F6] border border-[#00D8F6]/40 shadow-[0_0_8px_rgba(0,216,246,0.3)]'
                                : 'bg-[#151F36]/60 text-slate-600 line-through'
                            }`}
                          >
                            Cape
                          </span>

                          <span
                            title={`Panamax: ${panaOk ? 'Feasible' : 'Exceeds Draft'}`}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              panaOk
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                : 'bg-[#151F36]/60 text-slate-600 line-through'
                            }`}
                          >
                            Panamax
                          </span>

                          <span
                            title={`Supramax: ${supraOk ? 'Feasible' : 'Exceeds Draft'}`}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              supraOk
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                                : 'bg-[#151F36]/60 text-slate-600 line-through'
                            }`}
                          >
                            Supra
                          </span>

                          <span
                            title={`Handysize: ${handyOk ? 'Feasible' : 'Restricted'}`}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                          >
                            Handy
                          </span>
                        </div>
                      </td>

                      {/* Expand Button */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => setExpandedPortId(isExpanded ? null : port.id)}
                          className="p-2 rounded-full hover:bg-[#151F36] text-slate-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#00D8F6]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#070A12]/95 border-b border-white/10">
                        <td colSpan={8} className="p-5 sm:p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Berthing Specs */}
                            <div className="bg-[#11192E]/90 border border-white/10 rounded-2xl p-4.5 space-y-2.5 shadow-lg">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D8F6] flex items-center gap-1.5">
                                <Ship className="w-3.5 h-3.5" /> Marine Terminal Parameters
                              </span>
                              <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Terminal Type:</span>
                                  <span className="font-semibold text-white">
                                    {port.berthType}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Harbor Classification:</span>
                                  <span className="font-semibold text-white">
                                    {port.isRiverine ? 'Riverine Lock (Hugli Estuary)' : 'All-Weather Coastal Deep-Draft'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Demurrage Sensitivity:</span>
                                  <span
                                    className={`font-semibold ${
                                      port.congestionIndex > 7
                                        ? 'text-rose-400'
                                        : port.congestionIndex > 4
                                        ? 'text-amber-400'
                                        : 'text-emerald-400'
                                    }`}
                                  >
                                    {port.congestionIndex > 7
                                      ? 'Severe (>5 days wait)'
                                      : 'Normal Fast Dispatch'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Operational Notes */}
                            <div className="bg-[#11192E]/90 border border-white/10 rounded-2xl p-4.5 space-y-2.5 shadow-lg">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> Harbor Master Guidance &amp; Advisory
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">{port.notes}</p>
                            </div>

                            {/* Evacuation Rail */}
                            <div className="bg-[#11192E]/90 border border-white/10 rounded-2xl p-4.5 space-y-2.5 shadow-lg">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                <Train className="w-3.5 h-3.5" /> Hinterland Rail &amp; Steel Plant Dispatch
                              </span>
                              <div className="text-xs text-slate-300 space-y-1.5">
                                <p className="leading-relaxed">
                                  Direct Indian Railways East Coast Railway (ECoR) &amp; South Eastern
                                  Railway (SER) rake links to Kalinganagar, Rourkela, Angul, Jamshedpur, and Vizag.
                                </p>
                                <div className="text-[11px] text-[#00D8F6] pt-1 font-mono font-semibold">
                                  Discharge Rate: ~{(port.dailyDischargeRate / 3800).toFixed(1)} train rakes / day
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
