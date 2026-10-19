'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Zap,
  Radio,
} from 'lucide-react';
import { BALTIC_HISTORICAL_AND_FORECAST, MARKET_SIGNALS } from '../data/maritimeData';

type VesselTab = 'all' | 'capesize' | 'panamax' | 'supramax';
type HorizonTab = '30d' | '60d' | '90d' | '180d';

export default function ForecastChart() {
  const [selectedVessel, setSelectedVessel] = useState<VesselTab>('all');
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonTab>('90d');
  const [activeSignalCategory, setActiveSignalCategory] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = React.useMemo(() => {
    let cutoffDate = '2027-01-15';
    if (selectedHorizon === '30d') cutoffDate = '2026-11-15';
    else if (selectedHorizon === '60d') cutoffDate = '2026-12-15';
    else if (selectedHorizon === '90d') cutoffDate = '2027-01-15';
    else if (selectedHorizon === '180d') cutoffDate = '2027-02-01';

    return BALTIC_HISTORICAL_AND_FORECAST.filter((d) => d.date <= cutoffDate).map((item) => {
      const isLiveAnchor = item.date === '2026-10-19';
      return {
        ...item,
        displayDate: item.date.slice(5),
        bciHist: !item.isForecast || isLiveAnchor ? item.bci : undefined,
        bciPred: item.isForecast || isLiveAnchor ? (item.bciP50 || item.bci) : undefined,
        bciRange: item.isForecast ? [item.bciP10, item.bciP90] : undefined,

        bpiHist: !item.isForecast || isLiveAnchor ? item.bpi : undefined,
        bpiPred: item.isForecast || isLiveAnchor ? (item.bpiP50 || item.bpi) : undefined,
        bpiRange: item.isForecast ? [item.bpiP10, item.bpiP90] : undefined,

        bsiHist: !item.isForecast || isLiveAnchor ? item.bsi : undefined,
        bsiPred: item.isForecast || isLiveAnchor ? (item.bsiP50 || item.bsi) : undefined,
        bsiRange: item.isForecast ? [item.bsiP10, item.bsiP90] : undefined,
      };
    });
  }, [selectedHorizon]);

  const filteredSignals = React.useMemo(() => {
    if (activeSignalCategory === 'all') return MARKET_SIGNALS;
    return MARKET_SIGNALS.filter((s) => s.category.toLowerCase() === activeSignalCategory.toLowerCase());
  }, [activeSignalCategory]);

  return (
    <div className="space-y-6">
      {/* Forecast Header & Quick Metric Statistics (Animmaster Neumorphic Inset Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Capesize BCI Card */}
        <div
          onClick={() => setSelectedVessel('capesize')}
          className={`cursor-pointer bg-[#0E1526]/85 border rounded-[22px] p-5 transition-all duration-300 backdrop-blur-xl shadow-xl ${
            selectedVessel === 'capesize'
              ? 'border-[#00D8F6] shadow-[0_0_25px_rgba(0,216,246,0.35)] bg-[#0C1A30]'
              : 'border-white/10 hover:border-[#00D8F6]/40'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D8F6]">
                Baltic Capesize
              </span>
              <h4 className="text-xl font-bold font-mono text-white">BCI 2,195</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> -12.4% (30d)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>TCE: ~$24,500/d</span>
            <span className="text-[#00D8F6]">P50 Dec: 1,980</span>
          </div>
        </div>

        {/* Panamax BPI Card */}
        <div
          onClick={() => setSelectedVessel('panamax')}
          className={`cursor-pointer bg-[#0E1526]/85 border rounded-[22px] p-5 transition-all duration-300 backdrop-blur-xl shadow-xl ${
            selectedVessel === 'panamax'
              ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] bg-[#062419]'
              : 'border-white/10 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Baltic Panamax
              </span>
              <h4 className="text-xl font-bold font-mono text-white">BPI 1,375</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> -7.6% (30d)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>TCE: ~$14,800/d</span>
            <span className="text-emerald-300">P50 Dec: 1,270</span>
          </div>
        </div>

        {/* Supramax BSI Card */}
        <div
          onClick={() => setSelectedVessel('supramax')}
          className={`cursor-pointer bg-[#0E1526]/85 border rounded-[22px] p-5 transition-all duration-300 backdrop-blur-xl shadow-xl ${
            selectedVessel === 'supramax'
              ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.35)] bg-[#1F1235]'
              : 'border-white/10 hover:border-purple-500/40'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Baltic Supramax
              </span>
              <h4 className="text-xl font-bold font-mono text-white">BSI 1,130</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> -6.2% (30d)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>TCE: ~$13,200/d</span>
            <span className="text-purple-300">P50 Dec: 1,060</span>
          </div>
        </div>

        {/* Volatility & Macro Factor */}
        <div className="bg-[#0E1526]/85 border border-white/10 rounded-[22px] p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Historical Volatility (HV-30)
              </span>
              <h4 className="text-xl font-bold font-mono text-white">38.4%</h4>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00D8F6]/10 text-[#00D8F6] border border-[#00D8F6]/30 shadow-[0_0_10px_rgba(0,216,246,0.2)]">
              Backwardation
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between mt-2 font-mono">
            <span>VLSFO Singapore: $605/MT</span>
            <span className="text-amber-400">Confidence: 92%</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section (Master Container Panel) */}
      <div className="bg-[#0E1526]/85 border border-white/10 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl space-y-4">
        {/* Controls Bar: Vessel Toggle & Forecast Horizon Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          {/* Vessel Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Vessel Segment:
            </span>
            <div className="bg-[#0A0F1A] p-1.5 rounded-full border border-white/10 flex gap-1 shadow-inner">
              <button
                onClick={() => setSelectedVessel('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedVessel === 'all'
                    ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Combined
              </button>
              <button
                onClick={() => setSelectedVessel('capesize')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedVessel === 'capesize'
                    ? 'bg-[#00D8F6] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,216,246,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Capesize (BCI)
              </button>
              <button
                onClick={() => setSelectedVessel('panamax')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedVessel === 'panamax'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Panamax (BPI)
              </button>
              <button
                onClick={() => setSelectedVessel('supramax')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedVessel === 'supramax'
                    ? 'bg-purple-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Supramax (BSI)
              </button>
            </div>
          </div>

          {/* Forecast Horizon Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#00D8F6]" />
              Horizon:
            </span>
            <div className="bg-[#0A0F1A] p-1.5 rounded-full border border-white/10 flex gap-1 shadow-inner">
              {(['30d', '60d', '90d', '180d'] as HorizonTab[]).map((hz) => (
                <button
                  key={hz}
                  onClick={() => setSelectedHorizon(hz)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                    selectedHorizon === hz
                      ? 'bg-[#151F36] text-[#00D8F6] border border-[#00D8F6]/50 shadow-[0_0_12px_rgba(0,216,246,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {hz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Trajectory Visual Explainer */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#00D8F6] inline-block shadow-[0_0_6px_rgba(0,216,246,0.8)]" /> Solid = Historical Spot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#00D8F6] inline-block" /> Dashed = Forward Paper P50
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#00D8F6]/20 rounded inline-block border border-[#00D8F6]/30" /> Shaded Band = P10 - P90 Confidence Band
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[#00D8F6] text-[11px] font-mono">
            <Radio className="w-3 h-3 animate-pulse" /> Live Anchor: Oct 19, 2026
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-[380px] w-full pt-2">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2D4A" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="plainline"
                />

                <ReferenceLine
                  x="10-19"
                  stroke="#00D8F6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  label={{
                    value: 'TODAY (FORECAST START)',
                    position: 'top',
                    fill: '#00D8F6',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                />

                {/* CAPESIZE BCI */}
                {(selectedVessel === 'all' || selectedVessel === 'capesize') && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="bciRange"
                      name="BCI P10-P90 Band"
                      stroke="none"
                      fill="#00D8F6"
                      fillOpacity={0.14}
                    />
                    <Line
                      type="monotone"
                      dataKey="bciHist"
                      name="Capesize (BCI Spot)"
                      stroke="#00D8F6"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bciPred"
                      name="Capesize (BCI Forward P50)"
                      stroke="#00D8F6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </>
                )}

                {/* PANAMAX BPI */}
                {(selectedVessel === 'all' || selectedVessel === 'panamax') && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="bpiRange"
                      name="BPI P10-P90 Band"
                      stroke="none"
                      fill="#10B981"
                      fillOpacity={0.14}
                    />
                    <Line
                      type="monotone"
                      dataKey="bpiHist"
                      name="Panamax (BPI Spot)"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bpiPred"
                      name="Panamax (BPI Forward P50)"
                      stroke="#10B981"
                      strokeWidth={1.8}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </>
                )}

                {/* SUPRAMAX BSI */}
                {(selectedVessel === 'all' || selectedVessel === 'supramax') && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="bsiRange"
                      name="BSI P10-P90 Band"
                      stroke="none"
                      fill="#C084FC"
                      fillOpacity={0.14}
                    />
                    <Line
                      type="monotone"
                      dataKey="bsiHist"
                      name="Supramax (BSI Spot)"
                      stroke="#C084FC"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bsiPred"
                      name="Supramax (BSI Forward P50)"
                      stroke="#C084FC"
                      strokeWidth={1.8}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
              Loading maritime predictive forward curves...
            </div>
          )}
        </div>
      </div>

      {/* Market Drivers & Early Warning Banner Section */}
      <div className="bg-[#0E1526]/85 border border-white/10 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Market Drivers &amp; Early Warning Radar
              </h3>
              <p className="text-xs text-slate-400">
                Fundamental catalysts shaping the 30–90 day freight curve
              </p>
            </div>
          </div>

          {/* Filter Categories Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {['all', 'weather', 'port congestion', 'bunker fuel', 'demand'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSignalCategory(cat)}
                className={`px-3 py-1.5 rounded-full capitalize transition-all duration-300 ${
                  activeSignalCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#151F36]/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Signals List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              className="bg-[#11192E]/90 border border-white/10 hover:border-white/20 rounded-2xl p-4.5 transition-all duration-300 space-y-2.5 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#151F36] text-slate-300 border border-white/5">
                  {signal.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      signal.impact === 'BEARISH'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                        : signal.impact === 'BULLISH'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {signal.impact} FREIGHT IMPACT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{signal.date}</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-white">{signal.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{signal.summary}</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Vessels: {signal.affectedVessel}</span>
                <span className="font-mono text-[#00D8F6]">{signal.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isForecast = data.isForecast;

    return (
      <div className="bg-[#070A12]/95 border border-[#00D8F6]/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px]">
        <div className="flex justify-between items-center pb-1.5 border-b border-white/10">
          <span className="font-bold text-white font-mono">{data.date}</span>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
              isForecast
                ? 'bg-[#00D8F6]/20 text-[#00D8F6] border border-[#00D8F6]/30 shadow-[0_0_8px_rgba(0,216,246,0.3)]'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isForecast ? 'AI Forward Curve' : 'Historical Spot'}
          </span>
        </div>

        <div className="space-y-1 font-mono">
          {data.bci && (
            <div className="flex justify-between text-[#00D8F6]">
              <span>BCI (Capesize):</span>
              <span className="font-bold">{data.bci}</span>
            </div>
          )}
          {isForecast && data.bciP50 && (
            <div className="flex justify-between text-[11px] text-slate-400 pl-2">
              <span>P10 / P50 / P90:</span>
              <span>
                {data.bciP10} / {data.bciP50} / {data.bciP90}
              </span>
            </div>
          )}

          {data.bpi && (
            <div className="flex justify-between text-emerald-400">
              <span>BPI (Panamax):</span>
              <span className="font-bold">{data.bpi}</span>
            </div>
          )}
          {isForecast && data.bpiP50 && (
            <div className="flex justify-between text-[11px] text-slate-400 pl-2">
              <span>P10 / P50 / P90:</span>
              <span>
                {data.bpiP10} / {data.bpiP50} / {data.bpiP90}
              </span>
            </div>
          )}

          {data.bsi && (
            <div className="flex justify-between text-purple-400">
              <span>BSI (Supramax):</span>
              <span className="font-bold">{data.bsi}</span>
            </div>
          )}

          <div className="pt-1.5 mt-1 border-t border-white/10 flex justify-between text-slate-400 text-[10px]">
            <span>VLSFO Bunker:</span>
            <span className="text-amber-300">${data.vlsfoBunker}/MT</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
