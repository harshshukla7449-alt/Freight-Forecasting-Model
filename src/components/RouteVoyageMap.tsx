'use client';

import React, { useState } from 'react';
import {
  Compass,
  Ship,
  Navigation,
  Anchor,
  Globe,
  Waves,
  AlertTriangle,
  Info,
  Clock,
  Fuel,
  ArrowRight,
} from 'lucide-react';
import { OVERSEAS_LOADING_PORTS, EAST_COAST_PORTS, VESSEL_TYPES } from '../data/maritimeData';
import { LoadingPortId, IndianPortId } from '../types/maritime';

export default function RouteVoyageMap() {
  const [selectedOrigin, setSelectedOrigin] = useState<LoadingPortId>('gladstone');
  const [selectedDestination, setSelectedDestination] = useState<IndianPortId>('dhamra');

  const origin = OVERSEAS_LOADING_PORTS[selectedOrigin];
  const destination = EAST_COAST_PORTS[selectedDestination];
  const distanceNM = origin.distanceToEastCoastNM[selectedDestination];

  // Corridor transit analysis
  const corridors: Record<LoadingPortId, {
    corridorName: string;
    routing: string;
    chokepoints: string[];
    monsoonRisk: string;
    bunkeringPort: string;
  }> = {
    gladstone: {
      corridorName: 'Coral Sea & Torres Strait / Lombok Bulk Lane',
      routing: 'Gladstone -> Coral Sea -> Lombok Strait / Sunda Strait -> Indian Ocean -> Bay of Bengal',
      chokepoints: ['Lombok Strait (Deep Cape Draft)', 'Malacca Strait (Panamax/Supramax only)', 'Sunda Strait'],
      monsoonRisk: 'Low during post-monsoon (Oct - April). Swell moderate in Bay of Bengal.',
      bunkeringPort: 'Singapore Anchorage (AES) or Bundaberg',
    },
    newcastle: {
      corridorName: 'Tasman Sea & Western Australia Route',
      routing: 'Newcastle -> Bass Strait / South Australia -> Indian Ocean -> Bay of Bengal',
      chokepoints: ['Great Australian Bight Winter Swell', 'Lombok Strait transit for north route'],
      monsoonRisk: 'Southern Ocean heavy winter swell. Calm equatorial crossing.',
      bunkeringPort: 'Singapore or Port Kembla',
    },
    muara_berau: {
      corridorName: 'Makassar Strait & Singapore Road Shuttle',
      routing: 'Muara Berau -> Makassar Strait -> Singapore Strait -> Malacca Strait -> Andaman Sea -> Bay of Bengal',
      chokepoints: ['Singapore Strait Traffic Separation Scheme (TSS)', 'Malacca Shallow Banks (25m)'],
      monsoonRisk: 'Inter-monsoon squalls in Malacca Strait; overall short 8-9 day transit.',
      bunkeringPort: 'Singapore Eastern Anchorage',
    },
    samarinda: {
      corridorName: 'Mahakam River & Java Sea Corridor',
      routing: 'Samarinda (Mahakam Delta) -> Java Sea -> Karimata Strait -> Singapore -> Bay of Bengal',
      chokepoints: ['Mahakam river draft bar (tides)', 'Singapore TSS'],
      monsoonRisk: 'Shallow bar silting during rainy season; high tidal watch.',
      bunkeringPort: 'Singapore Anchorage',
    },
    richards_bay: {
      corridorName: 'Mozambique Channel & Equatorial Indian Ocean Trunk',
      routing: 'Richards Bay (RBCT) -> Mozambique Channel -> Agulhas Current -> Equatorial Indian Ocean -> Sri Lanka / Dondra Head -> Bay of Bengal',
      chokepoints: ['Mozambique Channel eddy currents', 'Dondra Head TSS (Sri Lanka)'],
      monsoonRisk: 'Agulhas current can add/subtract 2-3 knots depending on heading.',
      bunkeringPort: 'Port Louis (Mauritius) or Durban',
    },
    maputo: {
      corridorName: 'Delagoa Bay to Bay of Bengal Direct Track',
      routing: 'Maputo (Matola) -> Mozambique Channel -> Indian Ocean -> Bay of Bengal',
      chokepoints: ['Mozambique Channel south-bound swell', 'Dondra Head TSS'],
      monsoonRisk: 'Cyclonic season in SW Indian Ocean (Dec - March).',
      bunkeringPort: 'Maputo Anchorage or Port Louis',
    },
    hampton_roads: {
      corridorName: 'Transatlantic & Cape of Good Hope Mega-Haul',
      routing: 'Norfolk (Pier 6) -> North Atlantic -> South Atlantic -> Cape of Good Hope -> Indian Ocean -> Bay of Bengal',
      chokepoints: ['Cape of Good Hope heavy weather', 'Madagascar south passage'],
      monsoonRisk: 'Severe winter gales around Cape Horn/Good Hope; long 28-32 day transit.',
      bunkeringPort: 'Durban / Cape Town or Las Palmas',
    },
  };

  const currentCorridor = corridors[selectedOrigin];

  return (
    <div className="bg-[#0E1526]/80 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 sm:p-7 shadow-2xl shadow-black/60 space-y-6">
      {/* Route Selector Tile */}
      <div className="bg-[#11192E]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-neumorphic space-y-4 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00D8F6] shadow-glow-cyan">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">
                Global Maritime Corridor &amp; Chokepoint Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Nautical routing, passage waypoints, and seasonal sea-keeping risks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 font-mono">Total Distance:</span>
            <span className="font-bold text-slate-950 bg-[#00D8F6] px-3 py-1 rounded-full text-xs font-mono shadow-glow-cyan">
              {distanceNM.toLocaleString()} NM
            </span>
          </div>
        </div>

        {/* Origin & Destination Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D8F6] shadow-glow-cyan" />
              Overseas Loading Origin Port
            </label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value as LoadingPortId)}
              className="w-full bg-[#151F36]/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/50 transition-all cursor-pointer"
            >
              {Object.values(OVERSEAS_LOADING_PORTS).map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0E1526] text-slate-200">
                  {p.name} ({p.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
              East Coast Indian Destination Port
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value as IndianPortId)}
              className="w-full bg-[#151F36]/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#00D8F6] focus:ring-1 focus:ring-[#00D8F6]/50 transition-all cursor-pointer"
            >
              {Object.values(EAST_COAST_PORTS).map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0E1526] text-slate-200">
                  {p.name} ({p.state}) — Draft: {p.maxDraft}m
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Corridor Overview & Interactive Simulation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schematic Route Pathway & Chokepoints */}
        <div className="lg:col-span-2 bg-[#11192E]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-6 shadow-neumorphic space-y-5 transition-all duration-300">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-[#00D8F6]">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{currentCorridor.corridorName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {origin.name} &rarr; {destination.name}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald">
              Open International Sea Lane
            </span>
          </div>

          {/* Interactive Route Progression Steps */}
          <div className="space-y-4">
            <div className="bg-[#151F36]/60 border border-slate-700/50 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#00D8F6] font-bold">
                  <Anchor className="w-4 h-4 text-[#00D8F6]" /> Loading: {origin.name}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Anchor className="w-4 h-4 text-emerald-400" /> Discharging: {destination.name}
                </span>
              </div>

              {/* Progress Line */}
              <div className="relative flex items-center justify-between my-3">
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00D8F6] via-blue-500 to-emerald-400 -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(0,216,246,0.5)]" />
                <div className="relative z-10 w-7 h-7 rounded-full bg-[#00D8F6] text-slate-950 font-bold text-xs flex items-center justify-center shadow-glow-cyan ring-4 ring-[#11192E]">
                  1
                </div>
                <div className="relative z-10 w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center ring-4 ring-[#11192E]">
                  2
                </div>
                <div className="relative z-10 w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-glow-emerald ring-4 ring-[#11192E]">
                  3
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed font-mono bg-[#0E1526]/80 p-3 rounded-lg border border-white/5">
                <span className="text-slate-500 font-semibold">Voyage Track: </span>
                {currentCorridor.routing}
              </div>
            </div>

            {/* Chokepoint & Straits Advisory */}
            <div className="bg-[#151F36]/40 border border-slate-700/40 rounded-xl p-4 space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Strategic Maritime Chokepoints &amp; Navigation Straits
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentCorridor.chokepoints.map((cp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0E1526]/80 border border-slate-800 text-slate-200 flex items-center gap-2.5 hover:border-amber-500/30 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] shrink-0" />
                    <span className="font-medium">{cp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Weather, Bunkering, and Environmental Metrics */}
        <div className="bg-[#11192E]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-neumorphic space-y-4 transition-all duration-300">
          <h4 className="font-bold text-white text-sm pb-2.5 border-b border-white/5 flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#00D8F6]" /> Passage Conditions
          </h4>

          {/* Monsoon & Swell Risk */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Seasonal Swell &amp; Weather
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#151F36]/60 p-3 rounded-xl border border-slate-700/50">
              {currentCorridor.monsoonRisk}
            </p>
          </div>

          {/* Primary Bunkering Hub */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-amber-400" /> Bunkering &amp; Replenishment Port
            </span>
            <p className="text-xs text-slate-200 font-semibold bg-[#151F36]/60 p-3 rounded-xl border border-slate-700/50">
              {currentCorridor.bunkeringPort}
            </p>
          </div>

          {/* Environmental Carbon CII Indicator */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              IMO Carbon Intensity Indicator (CII)
            </span>
            <div className="bg-[#151F36]/60 p-3 rounded-xl border border-slate-700/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Corridor CII Rating:</span>
                <span className="font-bold font-mono text-emerald-400">Rating A / B (Optimized)</span>
              </div>
              <div className="w-full bg-[#070A12] rounded-full h-2.5 overflow-hidden flex border border-slate-800">
                <div className="bg-emerald-400 h-full w-2/5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="bg-[#00D8F6] h-full w-2/5 shadow-[0_0_8px_rgba(0,216,246,0.5)]" />
                <div className="bg-amber-400 h-full w-1/5" />
              </div>
              <div className="text-[10px] text-slate-400 leading-normal">
                Eco-steaming speed at 12.5 knots minimizes fuel burn by ~14%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
