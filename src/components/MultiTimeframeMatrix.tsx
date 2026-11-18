import React from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ShieldCheck,
  Zap,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Crosshair
} from "lucide-react";
import {
  TimeframeTechnicalNode,
  QuantConfluenceSummary,
  WhaleAndMoneyFlowSummary
} from "../types";

interface Props {
  multiTimeframe: {
    "1h": TimeframeTechnicalNode;
    "4h": TimeframeTechnicalNode;
    "1d": TimeframeTechnicalNode;
    "1w": TimeframeTechnicalNode;
  };
  confluence?: QuantConfluenceSummary;
  whaleAndMoneyFlow?: WhaleAndMoneyFlowSummary;
  currentPrice: number;
  symbol: string;
  isDarkActive: boolean;
}

function fmtPrice(val: number): string {
  if (!val || isNaN(val)) return "$0.00";
  if (val >= 100) return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (val >= 1) return `$${val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 4 })}`;
  if (val >= 0.01) return `$${val.toFixed(5)}`;
  return `$${val.toFixed(8)}`;
}

export const MultiTimeframeMatrix: React.FC<Props> = ({
  multiTimeframe,
  confluence,
  whaleAndMoneyFlow,
  currentPrice,
  symbol,
  isDarkActive
}) => {
  const nodes: TimeframeTechnicalNode[] = [
    multiTimeframe["1h"],
    multiTimeframe["4h"],
    multiTimeframe["1d"],
    multiTimeframe["1w"]
  ].filter(Boolean);

  const getTrendBadge = (trend: TimeframeTechnicalNode["trend"]) => {
    if (trend.includes("UPTREND")) {
      return {
        color: "text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/25",
        icon: <TrendingUp className="w-3 h-3" />
      };
    }
    if (trend.includes("DOWNTREND")) {
      return {
        color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25",
        icon: <TrendingDown className="w-3 h-3" />
      };
    }
    return {
      color: "text-[#C9A96A] bg-[#C9A96A]/10 border-[#C9A96A]/25",
      icon: <Minus className="w-3 h-3" />
    };
  };

  const getRsiColor = (rsi: number) => {
    if (rsi >= 70) return "text-[#EF4444]"; // Overbought
    if (rsi <= 30) return "text-[#14B8A6]"; // Oversold bounce zone
    if (rsi >= 52) return "text-[#14B8A6]";
    if (rsi <= 45) return "text-[#F59E0B]";
    return isDarkActive ? "text-white" : "text-zinc-900";
  };

  const getFlowBadge = (flow: TimeframeTechnicalNode["moneyFlowState"]) => {
    if (flow.includes("INFLOW")) return "text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/20";
    if (flow.includes("OUTFLOW")) return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
    return "text-[#C9A96A] bg-[#C9A96A]/10 border-[#C9A96A]/20";
  };

  return (
    <section
      className={`p-6 rounded-2xl border flex flex-col gap-6 ${
        isDarkActive ? "bg-[#0C0C12] border-white/10 shadow-2xl" : "bg-white border-black/10 shadow-md"
      }`}
    >
      {/* HEADER + CONFLUENCE ACCURACY BADGE */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
        style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDarkActive ? "bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]" : "bg-teal-50 border-teal-200 text-teal-800"
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-black uppercase tracking-[0.2em]">
                Multi-Timeframe Technical & S/R Matrix (1H • 4H • 1D • 1W)
              </h2>
              <span className="px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/30">
                LIVE OHLCV CALCULATED
              </span>
            </div>
            <p className="text-[10px] opacity-55 font-sans mt-0.5">
              Real-time Wilder RSI(14), Money Flow (MFI-14 & CMF-20), EMA-20/50/200, Whale Volume Spikes & Multi-Timeframe Support/Resistance for {symbol}
            </p>
          </div>
        </div>

        {confluence && (
          <div className="flex items-center gap-3">
            <div
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 ${
                isDarkActive ? "bg-black/40 border-[#14B8A6]/30" : "bg-teal-50/70 border-teal-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
              <div className="flex flex-col leading-none">
                <span className="text-[7.5px] font-mono uppercase tracking-widest opacity-55 font-bold">
                  CALIBRATED SETUP ACCURACY
                </span>
                <span className="text-sm font-mono font-black text-[#14B8A6] mt-0.5">
                  {confluence.historicalSetupAccuracy}% ({confluence.alignedTimeframesCount}/4 TF Aligned)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4-PILLAR QUANTITATIVE CONFLUENCE BREAKDOWN */}
      {confluence && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Trend Alignment (1H-1W)",
              score: confluence.confluenceBreakdown.trendAlignmentScore,
              desc: "EMA-20/50/200 & Price Structure"
            },
            {
              label: "RSI & MACD Momentum",
              score: confluence.confluenceBreakdown.momentumRsiScore,
              desc: "Wilder RSI(14) + MACD Histogram"
            },
            {
              label: "Money Flow & Whales",
              score: confluence.confluenceBreakdown.moneyFlowWhaleScore,
              desc: `Aggregate MFI: ${whaleAndMoneyFlow?.aggregateMfi ?? 50} | Spike: ${whaleAndMoneyFlow?.volumeAnomalyRatio ?? 1}x`
            },
            {
              label: "S/R Risk:Reward Ratio",
              score: confluence.confluenceBreakdown.supportResistanceScore,
              desc: "Proximity to Multi-TF Support vs Res."
            }
          ].map((pillar, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                isDarkActive ? "bg-black/30 border-white/5" : "bg-zinc-50 border-black/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider opacity-60">
                  {pillar.label}
                </span>
                <span
                  className={`text-xs font-mono font-black ${
                    pillar.score >= 55 ? "text-[#14B8A6]" : pillar.score <= 45 ? "text-[#EF4444]" : "text-[#C9A96A]"
                  }`}
                >
                  {pillar.score}/100
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-current/10 overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pillar.score >= 55 ? "bg-[#14B8A6]" : pillar.score <= 45 ? "bg-[#EF4444]" : "bg-[#C9A96A]"
                  }`}
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              <span className="text-[8.5px] font-mono opacity-45 truncate">{pillar.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4 TIMEFRAME CARDS: 1H, 4H, 1D, 1W */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const badge = getTrendBadge(node.trend);
          const flowClass = getFlowBadge(node.moneyFlowState);
          const pricePosPct = Math.min(
            98,
            Math.max(
              2,
              ((currentPrice - node.support1) / Math.max(0.0000001, node.resistance1 - node.support1)) * 100
            )
          );

          return (
            <div
              key={node.timeframe}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all ${
                isDarkActive
                  ? "bg-[#12121A] border-white/[0.06] hover:border-[#14B8A6]/40"
                  : "bg-zinc-50/80 border-black/[0.07] hover:border-teal-600/40"
              }`}
            >
              {/* Timeframe Header & Trend Badge */}
              <div className="flex items-center justify-between border-b border-current/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black tracking-wider ${
                      isDarkActive ? "bg-[#C9A96A]/15 text-[#C9A96A] border border-[#C9A96A]/30" : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {node.timeframe}
                  </span>
                  <span className="text-[9px] font-mono opacity-45 uppercase font-bold">
                    {node.timeframe === "1H"
                      ? "Intraday"
                      : node.timeframe === "4H"
                      ? "Tactical Swing"
                      : node.timeframe === "1D"
                      ? "Daily Structure"
                      : "Macro Weekly"}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded border text-[8.5px] font-mono font-bold uppercase flex items-center gap-1 ${badge.color}`}
                >
                  {badge.icon}
                  {node.trend}
                </span>
              </div>

              {/* RSI (14) & Money Flow (MFI-14 / CMF) */}
              <div className="grid grid-cols-2 gap-2.5 font-mono">
                <div
                  className={`p-2.5 rounded-lg border ${
                    isDarkActive ? "bg-black/35 border-white/5" : "bg-white border-black/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase opacity-45 font-bold">RSI (14)</span>
                    <span className="text-[7.5px] uppercase font-bold opacity-70">{node.rsiState}</span>
                  </div>
                  <div className={`text-base font-black mt-0.5 tabular-nums ${getRsiColor(node.rsi14)}`}>
                    {node.rsi14}
                  </div>
                  <div className="w-full h-1 bg-current/10 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        node.rsi14 >= 70 ? "bg-[#EF4444]" : node.rsi14 <= 30 ? "bg-[#14B8A6]" : "bg-[#C9A96A]"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, node.rsi14))}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border ${
                    isDarkActive ? "bg-black/35 border-white/5" : "bg-white border-black/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase opacity-45 font-bold">MFI Flow</span>
                    <span className="text-[7.5px] font-bold opacity-70">CMF {node.cmf20 >= 0 ? `+${node.cmf20}` : node.cmf20}</span>
                  </div>
                  <div className="text-base font-black mt-0.5 tabular-nums text-current">
                    {node.mfi14}
                  </div>
                  <span className={`inline-block mt-1 px-1.5 py-0.2 rounded border text-[7px] font-bold uppercase ${flowClass}`}>
                    {node.moneyFlowState}
                  </span>
                </div>
              </div>

              {/* Support & Resistance Zones for this Timeframe */}
              <div
                className={`p-3 rounded-lg border font-mono text-[10px] space-y-1.5 ${
                  isDarkActive ? "bg-black/40 border-white/5" : "bg-white border-black/5"
                }`}
              >
                <div className="flex items-center justify-between text-[8px] uppercase tracking-wider opacity-45 font-bold mb-1">
                  <span>{node.timeframe} Support / Resistance</span>
                  <span>ATR: {node.volatilityPct}%</span>
                </div>

                <div className="flex items-center justify-between text-[#EF4444]">
                  <span className="text-[8.5px] opacity-75 flex items-center gap-1">
                    <ArrowUpRight className="w-2.5 h-2.5" /> Resistance R2 (Major):
                  </span>
                  <span className="font-bold tabular-nums">{fmtPrice(node.resistance2)}</span>
                </div>

                <div className="flex items-center justify-between text-[#F87171]">
                  <span className="text-[8.5px] opacity-85 flex items-center gap-1">
                    <ArrowUpRight className="w-2.5 h-2.5" /> Resistance R1 (Local):
                  </span>
                  <span className="font-bold tabular-nums">{fmtPrice(node.resistance1)}</span>
                </div>

                {/* Live Price Corridor Bar between S1 and R1 */}
                <div className="py-1">
                  <div className="flex justify-between text-[7.5px] opacity-50 mb-0.5">
                    <span>S1</span>
                    <span>Spot: {fmtPrice(currentPrice)}</span>
                    <span>R1</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-[#14B8A6]/40 via-[#C9A96A]/40 to-[#EF4444]/40 relative">
                    <div
                      className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#14B8A6] absolute -top-0.5 -translate-x-1/2 shadow"
                      style={{ left: `${pricePosPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#34D399]">
                  <span className="text-[8.5px] opacity-85 flex items-center gap-1">
                    <ArrowDownRight className="w-2.5 h-2.5" /> Support S1 (Local):
                  </span>
                  <span className="font-bold tabular-nums">{fmtPrice(node.support1)}</span>
                </div>

                <div className="flex items-center justify-between text-[#14B8A6]">
                  <span className="text-[8.5px] opacity-75 flex items-center gap-1">
                    <ArrowDownRight className="w-2.5 h-2.5" /> Support S2 (Major):
                  </span>
                  <span className="font-bold tabular-nums">{fmtPrice(node.support2)}</span>
                </div>
              </div>

              {/* EMAs & Whale Activity Footer */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-current/5 font-mono text-[8.5px]">
                <div className="flex items-center justify-between opacity-65">
                  <span>EMA 20 / 50:</span>
                  <span className="font-bold tabular-nums">
                    {fmtPrice(node.ema20)} / {fmtPrice(node.ema50)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-65">Whale Vol ({node.volumeSpikeRatio}x):</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[7.5px] ${
                      node.whaleActivity.includes("ACCUMULATION")
                        ? "bg-[#14B8A6]/15 text-[#14B8A6]"
                        : node.whaleActivity.includes("DISTRIBUTION")
                        ? "bg-[#EF4444]/15 text-[#EF4444]"
                        : "bg-current/10 opacity-75"
                    }`}
                  >
                    {node.whaleActivity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
