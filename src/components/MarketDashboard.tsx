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
  X
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
      
      {/* 1. MISSION CONTROL HEADER & METRIC BOARDS */}
      <div className={`p-6 md:p-8 rounded-2xl border ${
        isDarkActive 
          ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-xl" 
          : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
      } relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <Cpu className="w-56 h-56 rotate-45 text-[#C9A96A]" />
        </div>
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-1.5 ${
                isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse"></span>
                SYSTEM ACTIVE // CORE MULTI-DECIMAL ENGINE
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight mt-1">
                Quantum Mission Control
              </h1>
              <p className="text-xs opacity-55 mt-1 max-w-xl">
                Global sovereign crypto telemetry matrix. Compiling institutional liquidity movements, geometric price vector squaring, and real-time algorithmic signals.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg ${
                isDarkActive ? "bg-[#5EEAD4]/10 text-[#5EEAD4]" : "bg-black/5 text-[#9C7B3E]"
              }`}>
                DIAGNOSTICS: NOMINAL
              </span>
              <span className="text-xs font-mono font-bold opacity-35">
                UPDATED {timeSinceUpdate}S AGO
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {/* Total Valuation Card */}
            <div className={`p-4 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-24`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Global Crypto Valuation</span>
                <span className={`text-lg font-mono font-bold tracking-tight block mt-1 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  ${marketStats ? (marketStats.totalMarketCap / 1e12).toFixed(2) : "2.45"}T
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden mt-1">
                <div className="bg-[#C9A96A] h-full" style={{ width: "72%" }}></div>
              </div>
            </div>

            {/* Dominance Card */}
            <div className={`p-4 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-24`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Bitcoin Market Dominance</span>
                <span className="text-lg font-mono font-bold tracking-tight block mt-1 text-[#5EEAD4]">
                  {marketStats ? marketStats.btcDominance.toFixed(1) : "57.4"}%
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden mt-1">
                <div className="bg-[#5EEAD4] h-full" style={{ width: `${marketStats ? marketStats.btcDominance : 57.4}%` }}></div>
              </div>
            </div>

            {/* Fear & Greed Card */}
            <div className={`p-4 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-24`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Fear & Greed Index</span>
                <span className="text-lg font-mono font-bold tracking-tight block mt-1 text-[#C9A96A]">
                  {marketStats ? marketStats.fearAndGreedIndex : "64"} ({marketStats ? marketStats.fearAndGreedLabel : "Greed"})
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden mt-1">
                <div className="bg-[#C9A96A] h-full" style={{ width: `${marketStats ? marketStats.fearAndGreedIndex : 64}%` }}></div>
              </div>
            </div>

            {/* Live Synchronizations */}
            <div className={`p-4 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-24`}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 block">Order Flow Influx</span>
                <span className="text-lg font-mono font-bold tracking-tight block mt-1 text-[#E2675A]">
                  HIGH DENSITY
                </span>
              </div>
              <div className="flex gap-1 mt-1 text-[8px] font-mono uppercase opacity-55">
                <span className="w-1.5 h-1.5 bg-[#5EEAD4] animate-pulse rounded-full self-center"></span>
                <span>Active pipeline validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE PANELS OVERVIEW */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* DETAILED WATCHLIST / MARKET FLOW TABLE */}
          <div className={`p-6 rounded-2xl border ${
            isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-5" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Institutional Asset Registry</h2>
              </div>
              
              {/* FILTER TABS (Bloomberg Style) */}
              <div className={`p-1 rounded-lg border flex gap-1 ${
                isDarkActive ? "bg-black/40 border-white/5" : "bg-[#F7F5F0] border-black/5"
              }`}>
                {[
                  { id: "ALL", label: "Registry" },
                  { id: "GAINERS", label: "Gainers" },
                  { id: "LOSERS", label: "Volatility" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilterMode(t.id as any)}
                    className={`py-1.5 px-3.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      filterMode === t.id
                        ? (isDarkActive ? "bg-[#C9A96A] text-black" : "bg-[#9C7B3E] text-white")
                        : "opacity-50 hover:opacity-100"
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
                  <tr className="text-[9px] text-left opacity-40 uppercase font-mono tracking-wider border-b pb-4 border-current">
                    <th className="pb-3 px-2">Rank</th>
                    <th className="pb-3">Asset</th>
                    <th className="pb-3 text-right">Value Spot</th>
                    <th className="pb-3 text-right">24H Velocity</th>
                    <th className="pb-3 text-right hidden sm:table-cell">Valuation</th>
                    <th className="pb-3 text-right">Interface Operations</th>
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
                          <tr key={coin.id} className={`border-b transition-colors group ${
                            isDarkActive ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"
                          } ${isSelected ? (isDarkActive ? "bg-white/[0.02]" : "bg-black/[0.01]") : ""}`}>
                            <td className="py-3 px-2 font-mono opacity-50 text-[10px]">{coin.rank}</td>
                            <td className="py-3 font-sans">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[9px] ${
                                  isDarkActive ? "bg-white/5 text-[#C9A96A]" : "bg-black/5 text-[#9C7B3E]"
                                }`}>
                                  {coin.symbol.slice(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`font-mono font-bold text-sm tracking-tight ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`}>
                                    {coin.symbol}
                                  </span>
                                  <span className="text-[9px] opacity-45 font-sans leading-none mt-0.5">{coin.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-right font-mono font-semibold text-xs">
                              ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: coin.priceUsd > 10 ? 2 : 5 })}
                            </td>
                            <td className={`py-3 text-right font-mono font-bold ${coin.changePercent24Hr >= 0 ? "text-[#5EEAD4]" : "text-[#E2675A]"}`}>
                              {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(2)}%
                            </td>
                            <td className="py-3 text-right opacity-50 hidden sm:table-cell text-[10px] font-mono">
                              ${(coin.marketCapUsd / 1e9).toFixed(1)}B
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => onSelectAsset(coin)}
                                className={`px-3 py-1.5 rounded-lg font-bold font-mono text-[9px] uppercase transition-all shadow-sm cursor-pointer ${
                                  isDarkActive 
                                    ? "bg-white/5 border border-white/10 hover:border-[#C9A96A] text-[#EDEAE3]" 
                                    : "bg-black/[0.02] border border-black/10 hover:border-[#9C7B3E] text-[#1A1A1F]"
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
                      <td colSpan={6} className="py-24 text-center opacity-30 font-mono text-xs">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#C9A96A]" />
                        SYNCING MARKET TELEMETRY...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-mono opacity-30 uppercase tracking-widest justify-center py-4 border-t border-dashed mt-4" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <Terminal className="w-3.5 h-3.5 text-[#5EEAD4] animate-pulse" />
              Sovereign cryptographic network active • Dynamic pipeline verified
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCH & TELEMETRY FEEDS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECURE LOOKUP EXPANDABLE PANEL */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDarkActive 
              ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" 
              : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 flex items-center gap-2 ${
                isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
              }`}>
                <Search className="w-3.5 h-3.5" /> Core Workspace Search
              </h3>
              {!isSearchExpanded && (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDarkActive 
                      ? "border-[rgba(255,255,255,0.08)] bg-black/25 hover:border-[#C9A96A] text-[#EDEAE3]"
                      : "border-[rgba(26,26,31,0.08)] bg-[#F7F5F0]/30 hover:border-[#9C7B3E] text-[#1A1A1F]"
                  }`}
                  title="Expand search bar"
                >
                  <Search className="w-3.5 h-3.5 opacity-80" />
                </button>
              )}
            </div>
            
            {isSearchExpanded && (
              <div className="relative animate-in fade-in zoom-in-95 duration-150">
                <input 
                  type="text"
                  autoFocus
                  placeholder="Lookup asset symbol (e.g. BTC)..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-11 pl-11 pr-10 rounded-xl text-xs bg-transparent border outline-none font-medium transition-all ${
                    isDarkActive 
                      ? "border-[rgba(255,255,255,0.08)] text-[#EDEAE3] placeholder-[#EDEAE3]/30 focus:border-[#C9A96A]/50 bg-black/25" 
                      : "border-[rgba(26,26,31,0.08)] text-[#1A1A1F] placeholder-[#1A1A1F]/30 focus:border-[#9C7B3E]/50 bg-[#F7F5F0]/30"
                  }`}
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 opacity-40 text-current" />
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-3 top-3.5 hover:opacity-100 opacity-40 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-current" />
                </button>
              </div>
            )}

            {/* AUTOCOMPLETE GRID OVERLAY */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className={`absolute left-0 right-0 mt-2 p-2 rounded-xl border z-50 max-h-64 overflow-y-auto shadow-2xl ${
                isDarkActive 
                  ? "bg-[#15151F] border-[rgba(255,255,255,0.08)] text-[#EDEAE3]" 
                  : "bg-white border-[rgba(26,26,31,0.08)] text-[#1A1A1F]"
              }`}>
                {searchResults.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      onSelectAsset(coin);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-left group ${
                      isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono font-bold text-[10px] tracking-wider px-2 py-0.5 rounded ${
                        isDarkActive ? "bg-white/5 text-[#C9A96A]" : "bg-black/5 text-[#9C7B3E]"
                      }`}>
                        {coin.symbol}
                      </span>
                      <span className="text-xs font-semibold">{coin.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-medium">${coin.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className={`text-[10px] font-mono font-bold ${coin.changePercent24Hr >= 0 ? "text-[#5EEAD4]" : "text-[#E2675A]"}`}>
                        {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-[10px] opacity-40 mt-3 font-mono leading-relaxed uppercase">
              Pro-tip: Click search bar or Type "/" to load instant workspace navigators.
            </p>
          </div>

          {/* DENSE WATCHLIST */}
          <div className={`p-6 rounded-2xl border ${
            isDarkActive 
              ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" 
              : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
          }`}>
            <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 mb-4 ${
              isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
            }`}>
              Specialist Quick Links
            </h3>
            
            {marketStats ? (
              <div className="flex flex-col gap-1.5">
                {marketStats.trending.slice(0, 6).map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => onSelectAsset(coin)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group border text-xs font-mono font-bold ${
                      isDarkActive 
                        ? "bg-black/20 border-transparent hover:border-white/10 hover:bg-white/[0.01]" 
                        : "bg-black/[0.01] border-transparent hover:border-black/10 hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="opacity-50">#0{coin.rank}</span>
                      <span className="text-[#5EEAD4]">{coin.symbol}</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5 font-sans font-bold">
                      <span>${coin.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-current" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center gap-2 text-xs font-mono opacity-30">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synchronizing...</span>
              </div>
            )}
          </div>

          {/* REAL-TIME SYSTEM LOGS */}
          <div className={`p-6 rounded-2xl border border-dashed transition-all ${
            isDarkActive 
              ? "bg-[#101017]/50 border-[rgba(255,255,255,0.06)] text-[#EDEAE3]/40" 
              : "bg-[#F7F5F0]/50 border-[rgba(26,26,31,0.06)] text-[#1A1A1F]/40"
          }`}>
            <h3 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold opacity-60 mb-4 flex items-center gap-2 ${
              isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
            }`}>
              <Activity className="w-3.5 h-3.5" /> Intelligence Feeds
            </h3>
            
            <div className="flex flex-col gap-3 font-mono text-[9px] leading-relaxed">
              {notifications.slice(0, 4).map((note, idx) => (
                <div key={idx} className="flex gap-2 relative pl-3 border-l border-current">
                  <p className="text-left font-medium text-current/80">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PERFORMANCE PROMPT BOX */}
          <div className={`p-5 rounded-2xl border ${
            isDarkActive ? "bg-[#1A1A22]/20 border-white/5" : "bg-black/[0.01] border-black/5"
          } flex flex-col gap-2.5`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C9A96A]">Aegis Co-Pilot Online</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-60">
              The Aegis Copilot is active. Open the right panel anytime to run portfolio simulations, read geopolitical risk compression models, or execute automated paper commands.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
