'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Ship,
  Anchor,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Waves,
  Shield,
  Gauge,
  ChevronDown,
} from 'lucide-react';

export default function ScrollytellingNarrative({
  onJumpToWorkspace,
}: {
  onJumpToWorkspace: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Stage 1 (0.00 to 0.33): Global Bulk Flow Hero
  const stage1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const stage1Scale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);
  const stage1Y = useTransform(scrollYProgress, [0, 0.33], [0, -60]);

  // Stage 2 (0.30 to 0.66): Physical Port Constraint Bottleneck
  const stage2Opacity = useTransform(scrollYProgress, [0.30, 0.38, 0.60, 0.66], [0, 1, 1, 0]);
  const stage2Scale = useTransform(scrollYProgress, [0.32, 0.42, 0.60], [0.95, 1, 0.95]);
  const stage2Y = useTransform(scrollYProgress, [0.30, 0.38, 0.60, 0.66], [60, 0, 0, -60]);

  // Stage 3 (0.63 to 0.98): Algorithmic Arbitrage & Value Proposition
  const stage3Opacity = useTransform(scrollYProgress, [0.63, 0.72, 0.92, 0.98], [0, 1, 1, 0]);
  const stage3Scale = useTransform(scrollYProgress, [0.65, 0.75, 0.95], [0.95, 1, 0.95]);
  const stage3Y = useTransform(scrollYProgress, [0.63, 0.72, 0.92, 0.98], [60, 0, 0, -60]);

  // Background gradient shift based on scroll
  const bgHue = useTransform(scrollYProgress, [0, 0.5, 1], ['#070A12', '#0A0F1A', '#070A12']);

  // Scroll Progress indicator line
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative h-[360vh] bg-[#070A12] text-slate-100 font-sans">
      {/* Top Floating Quick Jump Button */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        <button
          onClick={onJumpToWorkspace}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D8F6] hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all duration-300 shadow-glow-cyan hover:shadow-glow-cyan-lg cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Jump to Simulator</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Persistent Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#070A12]/80">
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-gradient-to-r from-[#00D8F6] via-emerald-400 to-[#00D8F6] shadow-glow-cyan"
        />
      </div>

      {/* Sticky Fullscreen Stage Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        {/* Subtle Maritime Coordinates & Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#00D8F6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070A12]/50 to-[#070A12] pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* STAGE 1: The Global Bulk Flow (Hero Scrollytelling) */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage1Opacity, scale: stage1Scale, y: stage1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 pointer-events-auto"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151F36]/80 border border-cyan-500/30 text-[#00D8F6] text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-glow-cyan">
            <Globe className="w-3.5 h-3.5 text-[#00D8F6]" />
            Global Maritime Freight Intelligence &bull; Bay of Bengal Trunk Corridors
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-white max-w-4xl leading-[1.15]">
            Intelligent Maritime Freight Forecasting &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D8F6] via-cyan-200 to-emerald-400">
              Bulk Chartering Decision Platform
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-4 text-sm sm:text-base text-slate-300 text-center max-w-2xl leading-relaxed">
            Transitioning East Coast India&apos;s steel and energy procurement desks from reactive spot-market volatility to predictive, AI-modeled Contracts of Affreightment (COA).
          </p>

          {/* Animated SVG Corridor Map Display */}
          <div className="w-full max-w-4xl mt-8 bg-[#0E1526]/85 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl shadow-black/70 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00D8F6] font-bold">
                <Compass className="w-4 h-4 text-[#00D8F6] animate-spin-slow" />
                Live Arterial Corridors Tracing to East Coast India
              </span>
              <span className="text-[11px] bg-[#151F36] px-3 py-1 rounded-full text-slate-300 border border-slate-700/50">
                Pacific &bull; Indian Ocean &bull; Bay of Bengal
              </span>
            </div>

            {/* Stylized Vector Route Canvas */}
            <div className="relative h-44 sm:h-52 w-full mt-2 flex items-center justify-center">
              <svg
                viewBox="0 0 800 240"
                className="w-full h-full stroke-cyan-500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Map Grid */}
                <path
                  d="M50 40 H750 M50 100 H750 M50 160 H750 M50 220 H750"
                  stroke="#1E293B"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />

                {/* Route 1: Australia (Gladstone/Newcastle) -> East Coast India */}
                <path
                  d="M710 190 C620 180, 520 140, 430 75"
                  stroke="#00D8F6"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx="710" cy="190" r="5" fill="#00D8F6" className="shadow-glow-cyan" />
                <text x="690" y="215" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  Australia (5,200 NM)
                </text>

                {/* Route 2: Indonesia (Muara Berau) -> East Coast India */}
                <path
                  d="M570 145 C520 125, 470 100, 430 75"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx="570" cy="145" r="4.5" fill="#10B981" />
                <text x="545" y="170" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  Indonesia (2,700 NM)
                </text>

                {/* Route 3: South Africa (Richards Bay) -> East Coast India */}
                <path
                  d="M120 195 C220 160, 320 110, 430 75"
                  stroke="#C084FC"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                <circle cx="120" cy="195" r="4.5" fill="#C084FC" />
                <text x="95" y="220" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  South Africa (4,450 NM)
                </text>

                {/* Target Hub: East Coast India */}
                <circle cx="430" cy="75" r="7" fill="#00D8F6" className="animate-ping opacity-60" />
                <circle cx="430" cy="75" r="6" fill="#00D8F6" stroke="#070A12" strokeWidth="2" />
                <text x="390" y="55" fill="#00D8F6" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  EAST COAST INDIA DISCHARGE HUB
                </text>
                <text x="390" y="68" fill="#64748B" fontSize="9" fontFamily="monospace">
                  (Dhamra &bull; Paradip &bull; Gangavaram &bull; Haldia)
                </text>
              </svg>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-4xl mt-6">
            <div className="bg-[#0E1526]/80 border border-white/10 rounded-2xl p-4 text-center shadow-neumorphic">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#00D8F6] drop-shadow-[0_0_10px_rgba(0,216,246,0.3)]">
                2.6M+ MT
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Annual Coal Inflow Analyzed</div>
            </div>
            <div className="bg-[#0E1526]/80 border border-white/10 rounded-2xl p-4 text-center shadow-neumorphic">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                14.8 Days
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Average Sailing Horizon</div>
            </div>
            <div className="bg-[#0E1526]/80 border border-white/10 rounded-2xl p-4 text-center shadow-neumorphic">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                38.4% Volatility
              </div>
              <div className="text-[11px] text-slate-400 mt-1">30-Day Historical Rate Swing</div>
            </div>
          </div>

          {/* Scroll Down Prompt */}
          <div className="mt-6 flex flex-col items-center gap-1 text-slate-500 text-xs font-mono animate-bounce">
            <span>Scroll to explore physical port bottlenecks</span>
            <ChevronDown className="w-4 h-4 text-[#00D8F6]" />
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* STAGE 2: The Physical Constraint Bottleneck (The Indian Shoreline) */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage2Opacity, scale: stage2Scale, y: stage2Y }}
          className="absolute inset-0 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 pointer-events-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3 shadow-glow-amber">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Stage 2 &bull; The Physical Shoreline Constraint
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white text-center tracking-tight">
            Paper Savings Mean Nothing Without{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              Draft &amp; LOA Feasibility
            </span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 text-center max-w-2xl">
            A discounted Capesize fixture is a multi-million-dollar disaster if routed to a draft-restricted port. Haldia requires shallow riverine transshipment, while Paradip requires strict Kamsarmax sizing.
          </p>

          {/* Interactive Depth Meters / Water Column Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
            {/* Port 1: Dhamra Deepwater */}
            <div className="bg-[#0E1526]/85 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-glow-emerald backdrop-blur-xl">
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="font-bold text-sm text-white">Dhamra Port (DPCL)</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-glow-emerald">
                    17.5m Draft
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  All-weather deep draft terminal. Handles fully laden Capesize bulk carriers (180,000 DWT) without offshore lightening.
                </p>
              </div>

              {/* Water Column Graphic */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400">Berth Clearance</span>
                  <span className="text-emerald-400 font-bold">Capesize Fully Permissible</span>
                </div>
                <div className="w-full bg-[#070A12] h-7 rounded-xl overflow-hidden border border-emerald-500/30 relative flex items-center px-2.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/40 w-[95%]" />
                  <span className="relative z-10 text-[10px] font-mono font-bold text-emerald-200">
                    Depth: 17.5m | Max LOA: 300m
                  </span>
                </div>
              </div>
            </div>

            {/* Port 2: Paradip Port */}
            <div className="bg-[#0E1526]/85 border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-glow-amber backdrop-blur-xl">
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="font-bold text-sm text-white">Paradip Port (PPT)</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-glow-amber">
                    14.5m Draft
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Workhorse coal hub in Odisha. Strict 14.5m draft cap accommodates Kamsarmax parcels. Fully laden Capesize strictly barred.
                </p>
              </div>

              {/* Water Column Graphic */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400">Berth Clearance</span>
                  <span className="text-amber-400 font-bold">Kamsarmax Threshold</span>
                </div>
                <div className="w-full bg-[#070A12] h-7 rounded-xl overflow-hidden border border-amber-500/30 relative flex items-center px-2.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-amber-600/30 w-[78%]" />
                  <span className="relative z-10 text-[10px] font-mono font-bold text-amber-200">
                    Depth: 14.5m | Max LOA: 260m
                  </span>
                </div>
              </div>
            </div>

            {/* Port 3: Haldia Dock Complex */}
            <div className="bg-[#0E1526]/85 border border-rose-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-glow-rose backdrop-blur-xl">
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="font-bold text-sm text-white">Haldia Dock (HDC)</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-glow-rose">
                    8.0m Riverine
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Hugli river estuary with lock gates. Requires Sandheads anchorage lightening or capping parcel strictly to ~22,000 MT.
                </p>
              </div>

              {/* Water Column Graphic */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400">Berth Clearance</span>
                  <span className="text-rose-400 font-bold">Handysize / Transshipment</span>
                </div>
                <div className="w-full bg-[#070A12] h-7 rounded-xl overflow-hidden border border-rose-500/30 relative flex items-center px-2.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 to-rose-600/30 w-[42%]" />
                  <span className="relative z-10 text-[10px] font-mono font-bold text-rose-200">
                    Depth: 8.0m | Riverine Lock
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Vessel Draft Matcher Banner */}
          <div className="mt-5 w-full bg-[#0E1526]/90 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-neumorphic">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-[#00D8F6]">
                <Ship className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-slate-300">
                <strong className="text-white">Dynamic Draft Simulation:</strong> NaviFreight calculates loaded arrival draft down to the centimeter based on parcel weight and fuel consumption.
              </span>
            </div>
            <span className="font-mono text-[#00D8F6] bg-cyan-500/10 px-3 py-1.5 rounded-full shrink-0 border border-cyan-500/30 shadow-glow-cyan text-[11px]">
              Zero Hull Collisions &bull; Zero Demurrage Penalties
            </span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* STAGE 3: The Algorithmic Advantage (Spot vs. COA Arbitrage) */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage3Opacity, scale: stage3Scale, y: stage3Y }}
          className="absolute inset-0 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 pointer-events-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3 shadow-glow-emerald">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Stage 3 &bull; Mathematical Value Creation
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white text-center tracking-tight">
            Capturing the Spread:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D8F6] via-cyan-200 to-emerald-400">
              Spot vs. 3-Month COA Arbitrage
            </span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 text-center max-w-2xl">
            Why leave multi-million dollar freight budgets exposed to daily volatility? NaviFreight predicts forward paper dips, pinpointing when to lock multi-voyage COAs.
          </p>

          {/* Comparative Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-6">
            {/* Left: Traditional Spot Fixtures */}
            <div className="bg-[#0E1526]/85 border border-slate-700/60 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-neumorphic backdrop-blur-xl">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-bold text-white text-sm">Traditional Spot Market</span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase border border-rose-500/30 shadow-glow-rose">
                  High Exposure
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <span>Subject to prompt vessel supply squeezes and sudden bunker spikes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <span>Demurrage exposure: $18,500 to $28,000/day during monsoon queues</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <span>Average landed Queensland-to-India cost: <strong className="text-white">$18.44 / MT</strong></span>
                </li>
              </ul>
            </div>

            {/* Right: NaviFreight Predictive COA Contract */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-[#0E1526] to-cyan-950/30 border border-emerald-500/50 rounded-2xl p-6 space-y-3 relative shadow-2xl backdrop-blur-xl shadow-glow-emerald">
              <div className="flex justify-between items-center pb-2.5 border-b border-emerald-500/30">
                <span className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> NaviFreight COA Engine
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30 shadow-glow-emerald">
                  11.8% Net Savings
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span>Locks forward backwardation dips across 90-day predictive curves</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span>Guaranteed laycan arrival windows eliminate anchorage demurrage risk</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span>Average landed cost: <strong className="text-white">$16.30 / MT</strong> (Saving $2.14/MT or ₹48.2 Cr)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Large Action CTA Button to enter Workspace */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={onJumpToWorkspace}
              className="px-8 py-3.5 rounded-full bg-[#00D8F6] hover:bg-cyan-300 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Launch Live Charter Simulator &amp; Decision Hub</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Includes Haldia Sandheads Lightening Engine &bull; Baltic Forward Paper Curves
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
