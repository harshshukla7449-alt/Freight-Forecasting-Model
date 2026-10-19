'use client';

import React, { useState, useMemo } from 'react';
import {
  Ship,
  Anchor,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Gauge,
  Fuel,
  Info,
  ShieldAlert,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  IndianPortId,
  LoadingPortId,
  VesselTypeId,
  CommodityId,
} from '../types/maritime';
import {
  EAST_COAST_PORTS,
  OVERSEAS_LOADING_PORTS,
  VESSEL_TYPES,
  COMMODITIES,
} from '../data/maritimeData';
import {
  validatePortFeasibility,
  calculateVoyageSimulation,
  formatINR,
  formatUSD,
  getOptimalVesselForShipment,
  getRecommendedParcelSize,
} from '../lib/maritimeCalculations';

interface Presets {
  label: string;
  commodity: CommodityId;
  volume: number;
  loadingPort: LoadingPortId;
  dischargePort: IndianPortId;
}

const PRESETS: Presets[] = [
  {
    label: 'Queensland Coking Coal -> Dhamra (Cape)',
    commodity: 'coking_coal',
    volume: 160000,
    loadingPort: 'gladstone',
    dischargePort: 'dhamra',
  },
  {
    label: 'Indonesian Thermal Coal -> Paradip (Panamax)',
    commodity: 'thermal_coal',
    volume: 75000,
    loadingPort: 'muara_berau',
    dischargePort: 'paradip',
  },
  {
    label: 'Richards Bay Met Coal -> Gangavaram (Cape)',
    commodity: 'coking_coal',
    volume: 150000,
    loadingPort: 'richards_bay',
    dischargePort: 'gangavaram',
  },
  {
    label: 'Hampton Roads Coking -> Vizag Outer (Panamax)',
    commodity: 'coking_coal',
    volume: 75000,
    loadingPort: 'hampton_roads',
    dischargePort: 'vizag_outer',
  },
  {
    label: 'Indonesian Coal -> Haldia (Draft Constrained)',
    commodity: 'thermal_coal',
    volume: 32000,
    loadingPort: 'samarinda',
    dischargePort: 'haldia',
  },
];

export default function CharterSimulator() {
  // Simulator State
  const [commodityId, setCommodityId] = useState<CommodityId>('coking_coal');
  const [parcelVolume, setParcelVolume] = useState<number>(75000);
  const [loadingPortId, setLoadingPortId] = useState<LoadingPortId>('gladstone');
  const [dischargePortId, setDischargePortId] = useState<IndianPortId>('paradip');
  const [laycanMonthIndex, setLaycanMonthIndex] = useState<number>(0); // 0: Prompt Oct, 1: Nov, 2: Dec, 3: Jan
  const [manualVesselOverride, setManualVesselOverride] = useState<VesselTypeId | null>(null);
  const [bunkerSensitivity, setBunkerSensitivity] = useState<number>(0); // % change (-15 to +15)
  const [applySandheadsLightening, setApplySandheadsLightening] = useState<boolean>(false);

  // Automatically determine recommended vessel unless manually overridden
  const recommendedVesselId = useMemo(() => {
    return getOptimalVesselForShipment(dischargePortId, parcelVolume);
  }, [dischargePortId, parcelVolume]);

  const activeVesselId = manualVesselOverride || recommendedVesselId;

  // Real-time Feasibility Check with Lightening Plan state
  const feasibility = useMemo(() => {
    return validatePortFeasibility(
      dischargePortId,
      activeVesselId,
      parcelVolume,
      applySandheadsLightening
    );
  }, [dischargePortId, activeVesselId, parcelVolume, applySandheadsLightening]);

  // Real-time Voyage & Economics Simulation
  const simulation = useMemo(() => {
    return calculateVoyageSimulation({
      commodityId,
      parcelVolume,
      loadingPortId,
      dischargePortId,
      vesselTypeId: activeVesselId,
      laycanMonthIndex,
      bunkerAdjustmentPercent: bunkerSensitivity,
      applySandheadsLightening,
    });
  }, [
    commodityId,
    parcelVolume,
    loadingPortId,
    dischargePortId,
    activeVesselId,
    laycanMonthIndex,
    bunkerSensitivity,
    applySandheadsLightening,
  ]);

  const laycanMonths = [
    { label: 'Prompt (Oct 2026)', desc: 'Immediate Fixture' },
    { label: 'Nov 2026', desc: '15-45 Day Forward' },
    { label: 'Dec 2026', desc: '60 Day Forward' },
    { label: 'Jan 2027', desc: '90 Day Forward' },
  ];

  const applyPreset = (preset: Presets) => {
    setCommodityId(preset.commodity);
    setParcelVolume(preset.volume);
    setLoadingPortId(preset.loadingPort);
    setDischargePortId(preset.dischargePort);
    setManualVesselOverride(null);
    setApplySandheadsLightening(false);
  };

  const handleDischargePortChange = (newPort: IndianPortId) => {
    setDischargePortId(newPort);
    if (newPort !== 'haldia') {
      setApplySandheadsLightening(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Bar (Animmaster Neumorphic Glow Pills) */}
      <div className="bg-[#0E1526]/85 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xl shadow-xl flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00D8F6]" />
          Industry Benchmarks:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-[#151F36]/60 text-slate-300 border border-slate-700/50 hover:border-[#00D8F6]/40 hover:text-white hover:bg-[#1A2642] transition-all duration-300 font-medium hover:shadow-[0_0_15px_rgba(0,216,246,0.2)]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Input Controls (5 cols) & Right Intelligence Cards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Parameter Input Panel */}
        <div className="lg:col-span-5 bg-[#0E1526]/85 border border-white/10 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 text-[#00D8F6] shadow-[0_0_15px_rgba(0,216,246,0.25)]">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Voyage Parameters</h3>
                <p className="text-xs text-slate-400">Bulk Charter &amp; Parcel Configurator</p>
              </div>
            </div>
            {manualVesselOverride && (
              <button
                onClick={() => setManualVesselOverride(null)}
                className="text-xs flex items-center gap-1 text-[#00D8F6] hover:underline font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Auto Vessel
              </button>
            )}
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Commodity Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bulk Cargo Commodity
              </label>
              <select
                value={commodityId}
                onChange={(e) => {
                  const newComm = e.target.value as CommodityId;
                  setCommodityId(newComm);
                  setParcelVolume(COMMODITIES[newComm].defaultParcelSize);
                }}
                className="w-full bg-[#11192E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/40 transition-all shadow-inner"
              >
                {Object.values(COMMODITIES).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Parcel Volume MT Slider & Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Parcel Volume (Metric Tons)
                </label>
                <span className="text-xs font-mono font-bold text-[#00D8F6] bg-[#00D8F6]/10 px-2.5 py-0.5 rounded-full border border-[#00D8F6]/30 shadow-[0_0_10px_rgba(0,216,246,0.2)]">
                  {parcelVolume.toLocaleString()} MT
                </span>
              </div>
              <input
                type="range"
                min="25000"
                max="180000"
                step="2500"
                value={parcelVolume}
                onChange={(e) => setParcelVolume(Number(e.target.value))}
                className="w-full h-2 bg-[#151F36] rounded-lg appearance-none cursor-pointer accent-[#00D8F6]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Handysize (35k)</span>
                <span>Supramax (58k)</span>
                <span>Kamsarmax (82k)</span>
                <span>Capesize (175k)</span>
              </div>
            </div>

            {/* Loading Origin Port */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Overseas Loading Terminal
              </label>
              <select
                value={loadingPortId}
                onChange={(e) => setLoadingPortId(e.target.value as LoadingPortId)}
                className="w-full bg-[#11192E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/40 transition-all shadow-inner"
              >
                {Object.values(OVERSEAS_LOADING_PORTS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.country} ({p.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Indian Discharge Port */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                East Coast Indian Discharge Port
              </label>
              <select
                value={dischargePortId}
                onChange={(e) => handleDischargePortChange(e.target.value as IndianPortId)}
                className="w-full bg-[#11192E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/40 transition-all font-medium shadow-inner"
              >
                {Object.values(EAST_COAST_PORTS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.state}) — Draft: {p.maxDraft}m | LOA: {p.maxLoa}m
                  </option>
                ))}
              </select>
            </div>

            {/* Target Laycan Window (Animmaster style glow pills) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Laycan / Arrival Month
              </label>
              <div className="grid grid-cols-2 gap-2">
                {laycanMonths.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLaycanMonthIndex(idx)}
                    className={`text-left p-3 rounded-2xl border transition-all duration-300 ${
                      laycanMonthIndex === idx
                        ? 'bg-[#00D8F6] text-slate-950 font-bold border-[#00D8F6] shadow-[0_0_20px_rgba(0,216,246,0.45)]'
                        : 'bg-[#151F36]/60 border-white/5 text-slate-400 hover:text-white hover:border-[#00D8F6]/40'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className={`text-[10px] ${laycanMonthIndex === idx ? 'text-slate-800' : 'text-slate-400'}`}>
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vessel Class Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Vessel Class Selection
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {manualVesselOverride ? 'Manual Selection' : 'AI Optimal Pick'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VESSEL_TYPES).map((v) => {
                  const isSelected = activeVesselId === v.id;
                  const isAutoRec = recommendedVesselId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setManualVesselOverride(v.id)}
                      className={`relative p-3 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#0E1B33] border-[#00D8F6] text-white shadow-[0_0_20px_rgba(0,216,246,0.3)] ring-1 ring-[#00D8F6]/50'
                          : 'bg-[#151F36]/50 border-white/5 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {isAutoRec && (
                        <span className="absolute -top-2 -right-1 px-2 py-0.5 bg-[#00D8F6] text-slate-950 font-extrabold text-[9px] rounded-full uppercase shadow-[0_0_10px_rgba(0,216,246,0.6)]">
                          AI Match
                        </span>
                      )}
                      <div className="font-bold text-xs text-white">{v.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Draft: {v.draftTypical}m | LOA: {v.loaTypical}m
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bunker Fuel Sensitivity Slider */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  VLSFO Bunker Sensitivity
                </label>
                <span
                  className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                    bunkerSensitivity > 0
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                      : bunkerSensitivity < 0
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : 'bg-[#151F36] text-slate-400 border border-white/5'
                  }`}
                >
                  {bunkerSensitivity > 0 ? `+${bunkerSensitivity}%` : `${bunkerSensitivity}%`}{' '}
                  (${(605 * (1 + bunkerSensitivity / 100)).toFixed(0)}/MT)
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="2.5"
                value={bunkerSensitivity}
                onChange={(e) => setBunkerSensitivity(Number(e.target.value))}
                className="w-full h-1.5 bg-[#151F36] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Real-time Validation Engine & Contract Recommendation */}
        <div className="lg:col-span-7 space-y-5">
          {/* Real-time Feasibility & Port Constraint Warning Banner (Neumorphic Glow) */}
          <div
            className={`rounded-[26px] p-5 border transition-all duration-300 backdrop-blur-xl ${
              applySandheadsLightening
                ? 'bg-[#091C1E]/85 border-[#00D8F6]/50 text-cyan-200 shadow-[0_0_25px_rgba(0,216,246,0.2)]'
                : feasibility.isFeasible
                ? 'bg-[#062419]/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.18)]'
                : 'bg-[#220B13]/85 border-rose-500/50 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.22)]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  applySandheadsLightening
                    ? 'bg-[#00D8F6]/20 text-[#00D8F6] shadow-[0_0_15px_rgba(0,216,246,0.35)]'
                    : feasibility.isFeasible
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'bg-rose-500/20 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                }`}
              >
                {applySandheadsLightening ? (
                  <Anchor className="w-6 h-6" />
                ) : feasibility.isFeasible ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sm tracking-wide text-white">
                    {applySandheadsLightening
                      ? `FEASIBLE VIA ANCHORAGE TRANSSHIPMENT: ${feasibility.port.name}`
                      : feasibility.isFeasible
                      ? `FEASIBILITY CONFIRMED: ${feasibility.vessel.name} accommodates at ${feasibility.port.name}`
                      : `PHYSICAL PORT CONSTRAINT DETECTED: ${feasibility.port.name}`}
                  </h4>
                  <span
                    className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold uppercase ${
                      applySandheadsLightening
                        ? 'bg-[#00D8F6]/20 text-[#00D8F6] border border-[#00D8F6]/40 shadow-[0_0_15px_rgba(0,216,246,0.3)]'
                        : feasibility.isFeasible
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                    }`}
                  >
                    {applySandheadsLightening
                      ? 'Anchorage Lightening Active'
                      : feasibility.isFeasible
                      ? 'Permissible Direct Call'
                      : 'Draft / LOA Restriction'}
                  </span>
                </div>

                {applySandheadsLightening ? (
                  <div className="space-y-2">
                    <p className="text-xs text-cyan-200/90 leading-relaxed">
                      Offshore transshipment plan active at Sandheads / Sagar Deepwater Anchorage.
                      ~{Math.max(10000, parcelVolume - 22000).toLocaleString()} MT transloaded to
                      river barges prior to lock gate entry (+ $3.80/MT floating crane & lighterage
                      allowance factored into rate). Arrival freshwater draft reduced safely to ~7.8m
                      for {feasibility.port.name} threshold ({feasibility.port.maxDraft}m).
                    </p>
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <span className="text-[11px] font-mono text-[#00D8F6] font-semibold">
                        Transshipment Cost: ~${(parcelVolume * 3.8).toLocaleString()} USD ({formatINR(parcelVolume * 3.8 * 86.5)})
                      </span>
                      <button
                        type="button"
                        onClick={() => setApplySandheadsLightening(false)}
                        className="text-xs text-slate-400 hover:text-rose-300 underline font-medium"
                      >
                        Remove Lightening Plan
                      </button>
                    </div>
                  </div>
                ) : feasibility.reasons.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="space-y-1">
                      {feasibility.reasons.map((r, i) => (
                        <p key={i} className="leading-relaxed flex items-center gap-1.5 text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          {r}
                        </p>
                      ))}
                    </div>

                    {/* Mitigation Strategies for Shallow / Riverine Ports (Haldia or draft < 9m) */}
                    {feasibility.requiresLighteningOrShortLoad ? (
                      <div className="mt-3 pt-3 border-t border-rose-500/20 space-y-2.5">
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Actionable Riverine Mitigation Options:
                        </div>

                        {/* If non-Handysize is selected for Haldia, offer quick switch to Handysize */}
                        {feasibility.canSwitchVessel && feasibility.recommendedVessel && (
                          <div className="bg-[#11192E]/90 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs text-slate-300">
                              Selected vessel exceeds river lock limits. Switch to riverine Handysize:
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setManualVesselOverride('handysize');
                                setParcelVolume(getRecommendedParcelSize('handysize', dischargePortId));
                              }}
                              className="px-3 py-1.5 bg-[#00D8F6]/20 hover:bg-[#00D8F6]/30 border border-[#00D8F6]/50 rounded-xl text-[#00D8F6] font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(0,216,246,0.2)]"
                            >
                              Switch to Handysize (22k MT)
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {/* Strategy A: Offshore Lightening */}
                          <div className="bg-[#11192E]/90 border border-white/10 hover:border-[#00D8F6]/50 rounded-2xl p-3.5 flex flex-col justify-between space-y-2 transition-all duration-300 shadow-lg">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#00D8F6]">
                                  Strategy A: Offshore Lightening
                                </span>
                                <span className="text-[10px] font-mono bg-[#00D8F6]/10 text-[#00D8F6] px-2 py-0.5 rounded-full border border-[#00D8F6]/30">
                                  +$3.80/MT
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                Recommend transloading ~{Math.max(10000, parcelVolume - 22000).toLocaleString()} MT at deepwater anchorage (Sandheads / Sagar Anchorage) or co-discharging at Paradip/Dhamra prior to Haldia river entry.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setApplySandheadsLightening(true)}
                              className="w-full py-2 px-3 bg-[#00D8F6]/15 hover:bg-[#00D8F6] text-[#00D8F6] hover:text-slate-950 border border-[#00D8F6]/40 hover:border-[#00D8F6] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(0,216,246,0.2)] hover:shadow-[0_0_25px_rgba(0,216,246,0.6)]"
                            >
                              <Anchor className="w-3.5 h-3.5" />
                              Apply Sandheads Lightening Plan
                            </button>
                          </div>

                          {/* Strategy B: Short-Load Parcel */}
                          <div className="bg-[#11192E]/90 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-3.5 flex flex-col justify-between space-y-2 transition-all duration-300 shadow-lg">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-emerald-300">
                                  Strategy B: Short-Load Parcel
                                </span>
                                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  Zero Transshipment
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                Recommend capping parcel intake strictly to ~20,000–22,000 MT to keep arrival freshwater draft within Haldia&apos;s ~8.0m–8.5m river threshold.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setParcelVolume(22000);
                                setManualVesselOverride('handysize');
                                setApplySandheadsLightening(false);
                              }}
                              className="w-full py-2 px-3 bg-emerald-500/15 hover:bg-emerald-400 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 hover:border-emerald-400 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                            >
                              <Ship className="w-3.5 h-3.5" />
                              Apply Short-Load Cap (22,000 MT)
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Resolution for Other Ports (Paradip, Gopalpur, Vizag Outer, etc.) */
                      !feasibility.isFeasible &&
                      feasibility.canSwitchVessel &&
                      feasibility.recommendedVessel && (
                        <div className="mt-2 pt-2 border-t border-rose-500/20 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#00D8F6]">Recommended Resolution:</span>
                            <span>
                              Reconfigure shipment for {VESSEL_TYPES[feasibility.recommendedVessel].name}:
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const targetVessel = feasibility.recommendedVessel!;
                              setManualVesselOverride(targetVessel);
                              const targetVolume = getRecommendedParcelSize(targetVessel, dischargePortId);
                              setParcelVolume(targetVolume);
                            }}
                            className="px-3.5 py-1.5 bg-[#00D8F6]/20 hover:bg-[#00D8F6] text-[#00D8F6] hover:text-slate-950 border border-[#00D8F6]/50 hover:border-[#00D8F6] rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(0,216,246,0.25)] hover:shadow-[0_0_25px_rgba(0,216,246,0.6)]"
                          >
                            <Ship className="w-3.5 h-3.5" />
                            Switch vessel to {VESSEL_TYPES[feasibility.recommendedVessel].name} ({getRecommendedParcelSize(feasibility.recommendedVessel, dischargePortId).toLocaleString()} MT)
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-300/90 leading-relaxed">
                    Vessel loaded arrival draft ({feasibility.calculatedSailingDraft}m) and LOA (
                    {feasibility.vessel.loaTypical}m) remain safely within port threshold (
                    Draft: {feasibility.port.maxDraft}m, LOA: {feasibility.port.maxLoa}m, Beam: {feasibility.port.maxBeam}m). Berth discharge rate: ~
                    {feasibility.port.dailyDischargeRate.toLocaleString()} MT/day.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Contract Recommendation Engine (Master Card) */}
          <div className="bg-[#0E1526]/85 border border-white/10 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background Ambient Radial Glow */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00D8F6]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Recommendation Header & Action Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#00D8F6]" />
                  Contract Decision Matrix
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Spot vs 3-Month COA Optimization
                </h3>
              </div>

              {/* Actionable Decision Badge with Animmaster Glow */}
              <div
                className={`px-4 py-2 rounded-full font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all ${
                  simulation.decisionRecommendation === 'ENTER_COA'
                    ? 'bg-[#062419] border border-emerald-400/80 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'bg-[#261B07] border border-amber-400/80 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                }`}
              >
                {simulation.decisionRecommendation === 'ENTER_COA' ? (
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {simulation.decisionRecommendation === 'ENTER_COA'
                    ? '[ENTER 3-MONTH COA CONTRACT - HIGH SAVINGS]'
                    : '[STAY ON SPOT - RATES PROJECTED TO DROP 12% IN 30 DAYS]'}
                </span>
              </div>
            </div>

            {/* Rate Comparison Inset Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              {/* Spot Rate Tile */}
              <div className="bg-[#11192E]/90 border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-xs text-slate-400 font-medium">Prompt Spot Freight</div>
                <div className="text-2xl font-mono font-bold text-white">
                  ${simulation.spotRatePerMT.toFixed(2)}
                  <span className="text-xs text-slate-400 font-sans font-normal"> / MT</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Total: {formatUSD(simulation.spotTotalCostUSD)}
                </div>
                {simulation.isTransshipmentApplied && (
                  <div className="text-[10px] text-[#00D8F6] bg-[#00D8F6]/10 px-2 py-0.5 rounded-full border border-[#00D8F6]/20 font-mono w-fit mt-1">
                    Includes +$3.80/MT Sandheads Transshipment
                  </div>
                )}
              </div>

              {/* 3-Month COA Rate Tile */}
              <div className="bg-[#0C1A30]/90 border border-[#00D8F6]/40 rounded-2xl p-4 space-y-1 relative shadow-[0_0_20px_rgba(0,216,246,0.12)]">
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#00D8F6]/20 text-[#00D8F6] text-[9px] font-bold rounded-full uppercase border border-[#00D8F6]/30">
                  Contract
                </span>
                <div className="text-xs text-slate-300 font-medium">3-Month COA Benchmark</div>
                <div className="text-2xl font-mono font-bold text-[#00D8F6]">
                  ${simulation.coaRatePerMT.toFixed(2)}
                  <span className="text-xs text-slate-400 font-sans font-normal"> / MT</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Total: {formatUSD(simulation.coaTotalCostUSD)}
                </div>
                {simulation.isTransshipmentApplied && (
                  <div className="text-[10px] text-[#00D8F6] bg-[#00D8F6]/10 px-2 py-0.5 rounded-full border border-[#00D8F6]/20 font-mono w-fit mt-1">
                    Includes +$3.80/MT Sandheads Transshipment
                  </div>
                )}
              </div>

              {/* Cost Savings Breakdown Tile */}
              <div className="bg-gradient-to-br from-[#062419] to-[#0E1526] border border-emerald-500/40 rounded-2xl p-4 space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.18)]">
                <div className="text-xs text-emerald-300 font-medium flex items-center justify-between">
                  <span>Projected Savings</span>
                  <span className="font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {simulation.savingsPercent}% Net
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400">
                  {formatUSD(simulation.potentialSavingsUSD)}
                </div>
                <div className="text-[11px] font-mono font-semibold text-emerald-300">
                  {formatINR(simulation.potentialSavingsINR)} landed
                </div>
              </div>
            </div>

            {/* Decision Rationale */}
            <div className="bg-[#11192E]/70 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#00D8F6]" />
                Chartering Rationale &amp; Quantitative Basis:
              </span>
              <p className="text-slate-300 pl-5">{simulation.decisionRationale}</p>
            </div>
          </div>

          {/* Voyage Logistics & Demurrage Risk Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Nautical Distance & Sailing */}
            <div className="bg-[#0E1526]/85 border border-white/10 rounded-[22px] p-4 space-y-1 shadow-lg hover:border-[#00D8F6]/30 transition-all">
              <div className="text-slate-400 text-xs flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-[#00D8F6]" /> Sailing Distance
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {simulation.distanceNM.toLocaleString()} NM
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ~{simulation.sailingDaysOneWay} sailing days @ {VESSEL_TYPES[activeVesselId].speedKnots} kts
              </div>
            </div>

            {/* Turnaround Time */}
            <div className="bg-[#0E1526]/85 border border-white/10 rounded-[22px] p-4 space-y-1 shadow-lg hover:border-[#00D8F6]/30 transition-all">
              <div className="text-slate-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00D8F6]" /> Turn-around Cycle
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {simulation.totalTurnaroundDays} Days
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Load: {simulation.loadingDays}d | Disch: {simulation.dischargeDays}d
              </div>
            </div>

            {/* Bunker Consumption */}
            <div className="bg-[#0E1526]/85 border border-white/10 rounded-[22px] p-4 space-y-1 shadow-lg hover:border-amber-400/30 transition-all">
              <div className="text-slate-400 text-xs flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" /> Bunker Burn
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {simulation.bunkerConsumptionTotalMT} MT
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Est. {formatUSD(simulation.bunkerCostUSD)} VLSFO
              </div>
            </div>

            {/* Demurrage Risk Indicator */}
            <div className="bg-[#0E1526]/85 border border-white/10 rounded-[22px] p-4 space-y-1 shadow-lg hover:border-rose-400/30 transition-all">
              <div className="text-slate-400 text-xs flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Demurrage Risk
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    simulation.demurrageRiskLevel === 'LOW'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : simulation.demurrageRiskLevel === 'MODERATE'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {simulation.demurrageRiskLevel}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ~{simulation.portWaitingDays}d wait
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Exposure: {formatUSD(simulation.estimatedDemurrageExposureUSD)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
