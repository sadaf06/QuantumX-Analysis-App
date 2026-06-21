import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ChevronRight, 
  RefreshCw,
  Activity,
  Radio,
  Sliders,
  DollarSign,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  BarChart3,
  Terminal,
  Cpu,
  X,
  Compass
} from "lucide-react";
import { CryptoAsset, MarketGlobalStats } from "../types";

interface Props {
  marketStats: MarketGlobalStats | null;
  selectedCoinId: string;
  onSelectAsset: (asset: CryptoAsset) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: CryptoAsset[];
  isSearchFocused: boolean;
  setIsSearchFocused: (val: boolean) => void;
  notifications: string[];
  isDarkActive: boolean;
  timeSinceUpdate: number;
}

export const MarketDashboard: React.FC<Props> = ({
  marketStats,
  selectedCoinId,
  onSelectAsset,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearchFocused,
  setIsSearchFocused,
  notifications,
  isDarkActive,
  timeSinceUpdate
}) => {
  const [filterMode, setFilterMode] = useState<"ALL" | "GAINERS" | "LOSERS">("ALL");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* 1. ULTRA-PREMIUM STATUS HUD */}
      <div className={`p-6 md:p-8 rounded-xl border relative ${
        isDarkActive 
          ? "bg-[#0C0C0F] border-white/[0.04] shadow-[0_12px_30px_-15px_rgba(0,0,0,0.6)]" 
          : "bg-white border-black/[0.05] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.03)]"
      } overflow-hidden`}>
        
        {/* Subtle Fine-mesh Geometric Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none">
          <Terminal className="w-48 h-48 text-[#14B8A6]" />
        </div>
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] flex items-center gap-2 ${
                isDarkActive ? "text-[#14B8A6]" : "text-teal-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                CORE MULTIDECIMAL TELEMETRY MATRIX
              </span>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-current mt-1.5 font-medium">
                Quantum X Mission Control
              </h1>
              <p className="text-xs opacity-50 mt-1 max-w-xl font-sans leading-relaxed">
                Global real-time cryptographic sovereign capital flows. Compiling live institutional order book variance, predictive geometric price vectors, and algorithmic latency indexes.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider rounded-md border ${
                isDarkActive 
                  ? "bg-[#14B8A6]/5 border-[#14B8A6]/20 text-[#14B8A6]" 
                  : "bg-teal-50 border-teal-200 text-teal-800"
              }`}>
                STATUS: DEPLOYED (10Gbps)
              </span>
              <span className="text-[9px] font-mono opacity-40 font-bold uppercase tracking-wider">
                REFRESHED {timeSinceUpdate}s AGO
              </span>
            </div>
          </div>

          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            
            {/* Total Valuation Card */}
            <div className={`p-4 rounded-lg border ${
              isDarkActive 
                ? "bg-[#121216] border-white/[0.04]" 
                : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[100px] transition-all hover:border-white/[0.08]`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Global Capitalization</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 tabular-nums">
                  ${marketStats ? (marketStats.totalMarketCap / 1e12).toFixed(3) : "2.478"}T
                </span>
              </div>
              <div className="flex items-center justify-between text-[8px] font-mono opacity-50 border-t pt-1 border-current border-opacity-5">
                <span>SYSTEM AGGREGATED</span>
                <span className="text-[#14B8A6] font-bold">+1.24% 24h</span>
              </div>
            </div>

            {/* Bitcoin Dominance Card */}
            <div className={`p-4 rounded-lg border ${
              isDarkActive 
                ? "bg-[#121216] border-white/[0.04]" 
                : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[100px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">BTC Dominance Ratio</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 text-[#14B8A6] tabular-nums">
                  {marketStats ? marketStats.btcDominance.toFixed(2) : "57.40"}%
                </span>
              </div>
              <div className="w-full bg-current bg-opacity-5 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#14B8A6] h-full transition-all duration-1000" style={{ width: `${marketStats ? marketStats.btcDominance : 57.4}%` }}></div>
              </div>
            </div>

            {/* Fear & Greed Card */}
            <div className={`p-4 rounded-lg border ${
              isDarkActive 
                ? "bg-[#121216] border-white/[0.04]" 
                : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[100px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Fear & Greed Index</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-xl font-mono font-bold tracking-tight text-[#C5A880] tabular-nums">
                    {marketStats ? marketStats.fearAndGreedIndex : "64"}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase opacity-60">
                    ({marketStats ? marketStats.fearAndGreedLabel : "Greed"})
                  </span>
                </div>
              </div>
              <div className="w-full bg-current bg-opacity-5 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#C5A880] h-full transition-all duration-1000" style={{ width: `${marketStats ? marketStats.fearAndGreedIndex : 64}%` }}></div>
              </div>
            </div>

            {/* Live Signals Sync */}
            <div className={`p-4 rounded-lg border ${
              isDarkActive 
                ? "bg-[#121216] border-white/[0.04]" 
                : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[100px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Order Flow Intensity</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 text-emerald-500">
                  SYSTEM NOMINAL
                </span>
              </div>
              <div className="flex gap-1.5 items-center text-[9px] font-mono opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                <span>Active predictive sync</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN GRID COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE REGISTER WATCHLIST (66% width) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className={`p-6 rounded-xl border ${
            isDarkActive 
              ? "bg-[#09090C] border-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.5)]" 
              : "bg-white border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          }`}>
            {/* Table Controller Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <BarChart3 className={`w-4 h-4 ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`} />
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-current">Sovereign Asset Registries</h2>
              </div>
              
              {/* Refined compact tab selector */}
              <div className={`p-0.5 rounded-lg border flex gap-0.5 ${
                isDarkActive ? "bg-[#121215] border-white/[0.04]" : "bg-zinc-100 border-black/[0.05]"
              }`}>
                {[
                  { id: "ALL", label: "Core registry" },
                  { id: "GAINERS", label: "24h gainers" },
                  { id: "LOSERS", label: "Volatility" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilterMode(t.id as any)}
                    className={`py-1 px-3 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      filterMode === t.id
                        ? (isDarkActive ? "bg-[#14B8A6] text-black" : "bg-teal-700 text-white")
                        : "opacity-40 hover:opacity-90"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE STREAM TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[8px] text-left opacity-40 uppercase font-mono tracking-widest border-b border-current border-opacity-5">
                    <th className="pb-3 px-2 font-bold w-12">Rank</th>
                    <th className="pb-3 font-bold">Asset Token</th>
                    <th className="pb-3 text-right font-bold">Spot Valuation</th>
                    <th className="pb-3 text-right font-bold">Price Velocity</th>
                    <th className="pb-3 text-right font-bold hidden sm:table-cell">Capital Value</th>
                    <th className="pb-3 text-center font-bold w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {marketStats ? (
                    (() => {
                      let list = marketStats.trending;
                      if (filterMode === "GAINERS") list = marketStats.gainers;
                      if (filterMode === "LOSERS") list = marketStats.losers;
                      
                      return list.slice(0, 16).map((coin) => {
                        const isSelected = selectedCoinId === coin.id;
                        return (
                          <tr key={coin.id} className={`border-b border-white/[0.02] last:border-0 transition-all group ${
                            isDarkActive ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"
                          } ${isSelected ? (isDarkActive ? "bg-[#14B8A6]/5" : "bg-teal-50/50") : ""}`}>
                            
                            {/* Rank Column */}
                            <td className="py-3 px-2 font-mono text-[10px] opacity-40 tracking-tight">#{coin.rank}</td>
                            
                            {/* Token Details */}
                            <td className="py-3 font-sans">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[9px] border ${
                                  isDarkActive 
                                    ? "bg-[#15151A] border-white/[0.04] text-[#C5A880]" 
                                    : "bg-zinc-100 border-black/[0.05] text-amber-900"
                                }`}>
                                  {coin.symbol.slice(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`font-mono font-bold text-xs tracking-tight ${isDarkActive ? "text-white" : "text-black"}`}>
                                    {coin.symbol}
                                  </span>
                                  <span className="text-[9px] opacity-45 font-sans leading-none mt-0.5">{coin.name}</span>
                                </div>
                              </div>
                            </td>

                            {/* Spot Price */}
                            <td className="py-3 text-right font-mono font-bold text-xs tracking-tight tabular-nums text-current">
                              ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: coin.priceUsd > 10 ? 2 : 5 })}
                            </td>

                            {/* Volatility Velocity Indicator */}
                            <td className={`py-3 text-right font-mono font-bold tracking-tight tabular-nums ${coin.changePercent24Hr >= 0 ? "text-[#14B8A6]" : "text-red-500"}`}>
                              {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(2)}%
                            </td>

                            {/* Market Cap */}
                            <td className="py-3 text-right opacity-45 hidden sm:table-cell text-[10px] font-mono tabular-nums">
                              ${(coin.marketCapUsd / 1e9).toFixed(2)}B
                            </td>

                            {/* Connector Operations button */}
                            <td className="py-3 text-center">
                              <button 
                                onClick={() => onSelectAsset(coin)}
                                className={`px-2.5 py-1 rounded text-[8px] font-bold font-mono uppercase tracking-widest transition-all cursor-pointer ${
                                  isDarkActive 
                                    ? "bg-white/[0.03] border border-white/[0.08] text-white hover:border-[#14B8A6] hover:bg-[#14B8A6]/10" 
                                    : "bg-zinc-100 border border-black/[0.08] text-black hover:border-teal-700 hover:bg-teal-50"
                                }`}
                              >
                                Connect Core
                              </button>
                            </td>

                          </tr>
                        );
                      });
                    })()
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-20 text-center opacity-40 font-mono text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-3.5 text-[#14B8A6]" />
                        ESTABLISHING SOVEREIGN TELEMETRY RELAY...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Decorative fine-printed footer terminal block */}
            <div className="flex items-center gap-3.5 text-[8px] font-mono opacity-30 uppercase tracking-widest justify-center py-3.5 border-t border-dashed border-current border-opacity-5 mt-5">
              <Terminal className="w-3.5 h-3.5 text-[#14B8A6]" />
              Secure workspace node active • Geometric vector alignment authenticated
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL TELEMETRY & CHANNELS (34% width) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECURE LOOKUP EXPANDABLE PANEL */}
          <div className={`p-6 rounded-xl border transition-all ${
            isDarkActive 
              ? "bg-[#09090C] border-white/[0.04] shadow-md" 
              : "bg-white border-black/[0.05] shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 flex items-center gap-2 ${
                isDarkActive ? "text-[#C5A880]" : "text-amber-800"
              }`}>
                <Search className="w-3.5 h-3.5" /> Workspace Vector Search
              </h3>
              {!isSearchExpanded && (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className={`p-1 rounded border transition-all cursor-pointer ${
                    isDarkActive 
                      ? "border-white/10 bg-white/[0.01] hover:border-[#14B8A6]"
                      : "border-black/10 bg-zinc-50 hover:border-teal-700"
                  }`}
                  title="Expand input desk"
                >
                  <Search className="w-3 h-3 text-current" />
                </button>
              )}
            </div>
            
            {isSearchExpanded && (
              <div className="relative animate-in fade-in zoom-in-95 duration-100">
                <input 
                  type="text"
                  autoFocus
                  placeholder="Query token code (e.g. SOL)..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-10 pl-10 pr-9 rounded text-xs bg-transparent border outline-none font-medium transition-all font-mono ${
                    isDarkActive 
                      ? "border-white/10 text-white placeholder-white/20 focus:border-[#14B8A6] bg-black/20" 
                      : "border-black/10 text-black placeholder-black/35 focus:border-teal-700 bg-zinc-100/50"
                  }`}
                />
                <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 opacity-30 text-current" />
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-3 top-3 hover:opacity-100 opacity-40 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-current" />
                </button>
              </div>
            )}

            {/* AUTOCOMPLETE GRID OVERLAY */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className={`absolute left-0 right-0 mt-2 p-2 rounded-lg border z-50 max-h-60 overflow-y-auto shadow-2xl ${
                isDarkActive 
                  ? "bg-[#0C0C0F] border-white/10 text-white" 
                  : "bg-white border-black/10 text-black"
              }`}>
                {searchResults.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      onSelectAsset(coin);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded transition-all text-left group ${
                      isDarkActive ? "hover:bg-white/5" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-[9px] tracking-wider px-1.5 py-0.5 rounded ${
                        isDarkActive ? "bg-white/5 text-[#14B8A6]" : "bg-teal-50 text-teal-800 border border-teal-100"
                      }`}>
                        {coin.symbol}
                      </span>
                      <span className="text-xs font-semibold">{coin.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold">${coin.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className={`text-[9px] font-mono font-bold ${coin.changePercent24Hr >= 0 ? "text-[#14B8A6]" : "text-red-500"}`}>
                        {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-[8px] opacity-35 mt-2.5 font-mono leading-relaxed uppercase">
              Operational Command: Tap search bar or type "/" to prompt global vector navigators.
            </p>
          </div>

          {/* DENSE TELEMETRY WATCHLIST */}
          <div className={`p-6 rounded-xl border ${
            isDarkActive 
              ? "bg-[#09090C] border-white/[0.04] shadow-md" 
              : "bg-white border-black/[0.05] shadow-sm"
          }`}>
            <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 mb-4 ${
              isDarkActive ? "text-[#C5A880]" : "text-amber-800"
            }`}>
              Operational Quick links
            </h3>
            
            {marketStats ? (
              <div className="flex flex-col gap-1.5">
                {marketStats.trending.slice(0, 6).map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => onSelectAsset(coin)}
                    className={`flex items-center justify-between p-2.5 rounded border border-transparent transition-all group text-xs font-mono font-bold ${
                      isDarkActive 
                        ? "bg-white/[0.01] hover:border-white/5 hover:bg-white/[0.03]" 
                        : "bg-zinc-50 border-zinc-100 hover:border-black/5 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="opacity-30">#0{coin.rank}</span>
                      <span className="text-[#14B8A6]">{coin.symbol}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>${coin.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <ChevronRight className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-all text-current" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center gap-2 text-xs font-mono opacity-30">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Pumping streams...</span>
              </div>
            )}
          </div>

          {/* REAL-TIME INTELLIGENCE CHANNELS */}
          <div className={`p-6 rounded-xl border border-dashed transition-all ${
            isDarkActive 
              ? "bg-[#09090C]/50 border-white/[0.05] text-white/30" 
              : "bg-zinc-50/50 border-black/[0.05] text-black/30"
          }`}>
            <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 mb-3.5 flex items-center gap-2 ${
              isDarkActive ? "text-[#C5A880]" : "text-amber-800"
            }`}>
              <Activity className="w-3.5 h-3.5" /> Intelligence Dossier Stream
            </h3>
            
            <div className="flex flex-col gap-3 font-mono text-[9px] leading-relaxed">
              {notifications.slice(0, 4).map((note, idx) => (
                <div key={idx} className="flex gap-2 relative pl-2.5 border-l border-current">
                  <p className="text-left font-medium text-current/80">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CO-PILOT ADVISORY BOX */}
          <div className={`p-5 rounded-lg border ${
            isDarkActive 
              ? "bg-[#121216]/50 border-white/[0.04]" 
              : "bg-zinc-50 border-black/[0.04]"
          } flex flex-col gap-2`}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#14B8A6] animate-pulse" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#14B8A6]">Oracle Terminal Active</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-55 font-sans">
              The neural Oracle Copilot workspace can be triggered anytime from the right panel. Fire live coin vectors, check geopolitical compression matrices, or prompt manual cycle calculations.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
