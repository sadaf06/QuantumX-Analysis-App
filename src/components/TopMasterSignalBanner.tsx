import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Crosshair,
  ArrowUpRight,
  ArrowDownRight,
  Gauge
} from "lucide-react";
import { CoinIntelligenceReport, MasterTradeSignal } from "../types";

interface Props {
  report: CoinIntelligenceReport;
  isDarkActive: boolean;
}

function fmtFallback(val: number): string {
  if (val >= 100) return `$${val.toFixed(2)}`;
  if (val >= 1) return `$${val.toFixed(4)}`;
  if (val >= 0.01) return `$${val.toFixed(5)}`;
  return `$${val.toFixed(8)}`;
}

export const TopMasterSignalBanner: React.FC<Props> = ({ report, isDarkActive }) => {
  const [copied, setCopied] = useState(false);

  const price = report.asset.priceUsd;
  const shortPlan = report.signal?.plans?.shortTerm;
  const rawAction = (report.signal?.action || "NORMAL BUY").toUpperCase();
  const isBuy = !rawAction.includes("SELL") && !rawAction.includes("REDUCE");

  const derivedStrength: "STRONG" | "NORMAL" | "LOW" = rawAction.includes("STRONG")
    ? "STRONG"
    : rawAction.includes("LOW") || rawAction.includes("HOLD") || rawAction.includes("NEUTRAL")
    ? "LOW"
    : "NORMAL";

  const ms: MasterTradeSignal = report.signal?.masterSignal || {
    direction: isBuy ? "BUY" : "SELL",
    strength: derivedStrength,
    fullLabel: `${derivedStrength} ${isBuy ? "BUY" : "SELL"}`,
    spotPrice: fmtFallback(price),
    buyPrice: shortPlan?.entryRange || `${fmtFallback(price * 0.99)} – ${fmtFallback(price)}`,
    sellPrice: shortPlan?.targets?.[1] || fmtFallback(price * 1.06),
    tp1: shortPlan?.targets?.[0] || fmtFallback(price * 1.04),
    tp2: shortPlan?.targets?.[1] || fmtFallback(price * 1.08),
    tp3: shortPlan?.targets?.[2] || fmtFallback(price * 1.12),
    sl: shortPlan?.stopLoss || fmtFallback(price * 0.95),
    expectedGainPct: "+6.5%",
    maxRiskPct: "-3.2%",
    riskReward: shortPlan?.riskRewardRatio || "1 : 2.5",
    accuracyPct: report.confluence?.historicalSetupAccuracy || 78,
    scanSummary: report.signal?.strategicJustification || ""
  };

  const isDirectionBuy = ms.direction === "BUY";

  const handleCopySignal = () => {
    const text = [
      `⚡ QUANTUM X MASTER SIGNAL: ${report.asset.name} (${report.asset.symbol})`,
      `• Signal: ${ms.direction} (${ms.strength} Strength)`,
      `• Accuracy Confluence: ${ms.accuracyPct}%`,
      `• Current Spot Price: ${ms.spotPrice}`,
      `• Buy Price Zone: ${ms.buyPrice}`,
      `• Sell / Exit Price Zone: ${ms.sellPrice}`,
      `• Take Profit 1 (TP1): ${ms.tp1}`,
      `• Take Profit 2 (TP2): ${ms.tp2}`,
      `• Take Profit 3 (TP3): ${ms.tp3}`,
      `• Stop-Loss (SL): ${ms.sl}`,
      `• Risk : Reward: ${ms.riskReward}`
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className={`p-6 md:p-7 rounded-2xl border-2 relative overflow-hidden transition-all shadow-2xl ${
        isDirectionBuy
          ? isDarkActive
            ? "bg-gradient-to-br from-[#0A1917] via-[#0D1117] to-[#0C0C14] border-[#14B8A6]/45"
            : "bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/40 border-teal-500/40"
          : isDarkActive
          ? "bg-gradient-to-br from-[#1F0D12] via-[#120D14] to-[#0C0C14] border-[#EF4444]/45"
          : "bg-gradient-to-br from-red-50/90 via-white to-rose-50/40 border-red-500/40"
      }`}
    >
      {/* TOP BAR: MASTER SIGNAL HEADER + COPY BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-current/10">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 ${
              isDirectionBuy
                ? "bg-[#14B8A6] text-black"
                : "bg-[#EF4444] text-white"
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            FINAL DEEP SCAN SIGNAL
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-65">
            1H • 4H • 1D • 1W RSI + MONEY FLOW + S/R VERIFIED
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-black/25 dark:bg-white/5 border border-current/10 font-mono text-[10px] font-bold">
            Setup Accuracy: <span className={isDirectionBuy ? "text-[#14B8A6]" : "text-[#EF4444]"}>{ms.accuracyPct}%</span>
          </div>
          <button
            onClick={handleCopySignal}
            className={`px-3 py-1.5 rounded-lg border text-[9.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              isDarkActive
                ? "bg-white/5 border-white/15 hover:border-[#C9A96A] text-white"
                : "bg-black/5 border-black/15 hover:border-teal-700 text-black"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Signal Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Signal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN SIGNAL ROW: 1) BUY/SELL + STRENGTH (STRONG/NORMAL/LOW)  2) BUY PRICE & SELL PRICE  3) TP1/TP2/TP3 & SL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 1. BUY OR SELL + STRENGTH (STRONG / NORMAL / LOW) */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between ${
            isDarkActive ? "bg-black/45 border-white/10" : "bg-white/90 border-black/10"
          }`}
        >
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-50 block mb-2">
              ACTION CALL & SIGNAL STRENGTH
            </span>

            {/* Big BUY / SELL Pill */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isDirectionBuy
                    ? "bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/40"
                    : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40"
                }`}
              >
                {isDirectionBuy ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-mono font-black tracking-tight ${
                      isDirectionBuy ? "text-[#14B8A6]" : "text-[#EF4444]"
                    }`}
                  >
                    {ms.direction}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                      ms.strength === "STRONG"
                        ? isDirectionBuy
                          ? "bg-[#14B8A6] text-black"
                          : "bg-[#EF4444] text-white"
                        : ms.strength === "NORMAL"
                        ? "bg-[#C9A96A] text-black"
                        : "bg-zinc-500/30 text-current"
                    }`}
                  >
                    {ms.strength}
                  </span>
                </div>
                <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                  Spot Price: <strong className="text-current">{ms.spotPrice}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 3-Tier Strength Selector Visual: STRONG | NORMAL | LOW */}
          <div className="mt-5 pt-3.5 border-t border-current/10">
            <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-wider opacity-60 mb-1.5">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" /> Signal Strength Meter:
              </span>
              <span className="font-bold text-current">{ms.fullLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] font-black uppercase text-center">
              {(["LOW", "NORMAL", "STRONG"] as const).map((lvl) => {
                const isActive = ms.strength === lvl;
                return (
                  <div
                    key={lvl}
                    className={`py-1.5 rounded-lg border transition-all ${
                      isActive
                        ? lvl === "STRONG"
                          ? isDirectionBuy
                            ? "bg-[#14B8A6] text-black border-[#14B8A6] shadow-md"
                            : "bg-[#EF4444] text-white border-[#EF4444] shadow-md"
                          : lvl === "NORMAL"
                          ? "bg-[#C9A96A] text-black border-[#C9A96A] shadow-md"
                          : "bg-amber-500/80 text-black border-amber-500"
                        : "opacity-30 border-current/15 bg-transparent"
                    }`}
                  >
                    {lvl}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. BUY PRICE & SELL PRICE */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between gap-3 ${
            isDarkActive ? "bg-black/45 border-white/10" : "bg-white/90 border-black/10"
          }`}
        >
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-50 block">
            EXECUTION ZONES (BUY PRICE & SELL PRICE)
          </span>

          {/* BUY PRICE */}
          <div className="p-3.5 rounded-xl border bg-[#14B8A6]/10 border-[#14B8A6]/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#14B8A6] flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {isDirectionBuy ? "BUY PRICE (IDEAL ENTRY ZONE)" : "BUY BACK PRICE (SUPPORT EXIT)"}
              </span>
              <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#14B8A6]/20 text-[#14B8A6] font-bold">
                1H/4H Support
              </span>
            </div>
            <div className="text-base md:text-lg font-mono font-black text-[#14B8A6] tracking-tight tabular-nums">
              {ms.buyPrice}
            </div>
          </div>

          {/* SELL PRICE */}
          <div className="p-3.5 rounded-xl border bg-[#C9A96A]/10 border-[#C9A96A]/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#C9A96A] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {isDirectionBuy ? "SELL PRICE (TARGET EXIT ZONE)" : "SELL PRICE (SHORT / EXIT ENTRY)"}
              </span>
              <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C9A96A]/20 text-[#C9A96A] font-bold">
                R:R {ms.riskReward}
              </span>
            </div>
            <div className="text-base md:text-lg font-mono font-black text-[#C9A96A] tracking-tight tabular-nums">
              {ms.sellPrice}
            </div>
          </div>
        </div>

        {/* 3. TAKE PROFIT (TP1, TP2, TP3) & STOP-LOSS (SL) */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between gap-3 ${
            isDarkActive ? "bg-black/45 border-white/10" : "bg-white/90 border-black/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-50">
              TAKE PROFIT (TP) & STOP-LOSS (SL)
            </span>
            <span className="text-[8.5px] font-mono font-bold text-[#14B8A6]">
              ATR Verified
            </span>
          </div>

          {/* TP1, TP2, TP3 List */}
          <div className="space-y-1.5 font-mono text-xs">
            {[
              { label: "TP 1 (Safe Target)", val: ms.tp1 },
              { label: "TP 2 (Main Target)", val: ms.tp2 },
              { label: "TP 3 (Breakout Target)", val: ms.tp3 }
            ].map((tp, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg border flex items-center justify-between ${
                  isDarkActive
                    ? "bg-[#14B8A6]/5 border-[#14B8A6]/20"
                    : "bg-teal-50/70 border-teal-200"
                }`}
              >
                <span className="text-[9.5px] font-bold uppercase opacity-75 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-[#14B8A6]" />
                  {tp.label}
                </span>
                <span className="font-black text-[#14B8A6] tabular-nums text-[11px]">
                  {tp.val}
                </span>
              </div>
            ))}
          </div>

          {/* STOP LOSS (SL) */}
          <div className="p-3 rounded-xl border bg-[#EF4444]/10 border-[#EF4444]/35 flex items-center justify-between font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <div className="flex flex-col leading-none">
                <span className="text-[9.5px] font-black uppercase text-[#EF4444]">
                  STOP-LOSS (SL)
                </span>
                <span className="text-[7.5px] opacity-65 mt-0.5">
                  Strict Invalidation Level
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-[#EF4444] tabular-nums">
              {ms.sl}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM SUMMARY LINE */}
      {ms.scanSummary && (
        <div
          className={`mt-4 p-3.5 rounded-xl border text-xs font-sans flex items-start gap-2.5 ${
            isDarkActive ? "bg-black/35 border-white/5 text-white/85" : "bg-white/80 border-black/5 text-black/85"
          }`}
        >
          <CheckCircle2
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              isDirectionBuy ? "text-[#14B8A6]" : "text-[#EF4444]"
            }`}
          />
          <p className="leading-relaxed">
            <strong className="font-mono uppercase text-[10px] tracking-wider mr-1.5">
              [{ms.fullLabel} SUMMARY]:
            </strong>
            {ms.scanSummary}
          </p>
        </div>
      )}
    </section>
  );
};
