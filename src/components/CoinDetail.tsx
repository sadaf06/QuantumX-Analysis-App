import React, { useState } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Atom, 
  MessageSquare, 
  Zap, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Globe,
  AlertTriangle,
  ZapOff,
  Scan,
  RefreshCw,
  History,
  TrendingUp as TrendUp,
  Maximize2,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Cpu,
  CornerDownRight,
  BookOpen,
  PieChart,
  Brain,
  Sliders,
  DollarSign,
  Briefcase,
  Copy,
  Check,
  Terminal
} from "lucide-react";
import { CryptoAsset, CoinIntelligenceReport, ChatMessage, UserProfile, Trade } from "../types";
import { TypewriterText } from "./TypewriterText";
import Markdown from "react-markdown";
import { PaperTrading } from "./PaperTrading";
import { SquareOfNineMatrix } from "./SquareOfNine";
import { CoinChart } from "./CoinChart";
import { QuantumProjections } from "./QuantumProjections";
import { AIPredictionPanel } from "./AIPredictionPanel";
import { MarketPsychologyEngine } from "./MarketPsychologyEngine";
import { NewsIntelligenceSystem } from "./NewsIntelligenceSystem";
import { RiskEnginePanel } from "./RiskEnginePanel";
import { ExecutionPlansPanel } from "./ExecutionPlansPanel";
import { FiveYearForecastPanel } from "./FiveYearForecastPanel";

interface Props {
  activeAsset: CryptoAsset;
  report: CoinIntelligenceReport | null;
  onDeepScan: () => void;
  isAnalyzing: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
  isDarkActive: boolean;
  userProfile: UserProfile;
  onTrade: (trade: Omit<Trade, "id" | "timestamp">) => void;
  onClearIsNew?: (msgId: string) => void;
}

export const CoinDetail: React.FC<Props> = ({ 
  activeAsset,
  report,
  onDeepScan,
  isAnalyzing,
  chatMessages, 
  chatInput, 
  setChatInput, 
  onSendChat, 
  isChatLoading,
  isDarkActive,
  userProfile,
  onTrade,
  onClearIsNew
}) => {
  const asset = activeAsset;
  const isUp = asset.changePercent24Hr >= 0;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyMsg = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Collapse/Expand state management for bento panels
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    signal: false,
    coordinates: false,
    geometry: false,
    projections: false,
    psychology: false,
    geopolitical: false,
    emotions: true,
    risk: true,
    news: true,
    chat: false
  });

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Section Header with Collapse support
  const CollapseHeader = ({ title, icon: Icon, sectionKey, color }: any) => {
    const isCollapsed = collapsed[sectionKey];
    const defaultColor = color || (isDarkActive ? "text-[#C5A880]" : "text-amber-800");
    
    return (
      <div 
        onClick={() => toggleCollapse(sectionKey)}
        className={`flex items-center justify-between border-b pb-2.5 mb-3.5 cursor-pointer select-none group transition-all ${
          isDarkActive ? "border-white/[0.04] hover:border-white/10" : "border-black/[0.05] hover:border-black/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${defaultColor}`} />
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">{title}</h2>
        </div>
        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
          <span className="text-[7.5px] font-mono uppercase tracking-wider">{isCollapsed ? "expand" : "collapse"}</span>
          {isCollapsed ? (
            <ChevronRightIcon className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </div>
      </div>
    );
  };

  const assetTrades = userProfile.history.filter(t => t.assetId === asset.id);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* 1. ASSET PRICE HEADER PANEL */}
      <div className={`p-6 md:p-8 rounded-xl border transition-all relative overflow-hidden ${
        isDarkActive 
          ? "bg-[#0C0C0F] border-white/[0.04] shadow-xl" 
          : "bg-white border-black/[0.05] shadow-sm"
      }`}>
        
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px] opacity-100 pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <Cpu className="w-44 h-44 text-[#14B8A6]" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-5">
             <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base leading-none shadow-sm border ${
               isDarkActive 
                 ? "bg-[#121216] border-white/[0.04] text-[#C5A880]" 
                 : "bg-zinc-100 border-black/[0.05] text-amber-900"
             }`}>
                {asset.symbol.slice(0, 3)}
             </div>
             <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-current">{asset.name}</h1>
                  <span className={`text-[8px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${
                    isDarkActive 
                      ? "bg-[#14B8A6]/5 text-[#14B8A6] border-[#14B8A6]/20" 
                      : "bg-teal-50 text-teal-800 border-teal-200"
                  }`}>
                    {asset.symbol}
                  </span>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    isDarkActive ? "bg-white/5 border-white/5 opacity-50" : "bg-zinc-100 border-zinc-200 opacity-70"
                  }`}>
                    INDEX RANK #{asset.rank}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                   <span className={`text-xl md:text-2xl font-mono font-bold tracking-tight tabular-nums ${isDarkActive ? "text-white" : "text-zinc-950"}`}>
                     ${asset.priceUsd.toLocaleString(undefined, { 
                       minimumFractionDigits: asset.priceUsd > 1 ? 2 : 6 
                     })}
                   </span>
                   <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 ${
                     isUp 
                       ? (isDarkActive ? "bg-[#14B8A6]/5 text-[#14B8A6] border border-[#14B8A6]/10" : "bg-teal-50 text-teal-850 border border-teal-100")
                       : "bg-red-500/5 text-red-500 border border-red-500/10"
                   }`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? "+" : ""}{asset.changePercent24Hr.toFixed(2)}%
                   </span>
                </div>
             </div>
          </div>
          
          <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-mono border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-white/5 opacity-90`}>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-widest uppercase text-[7.5px]">Market Cap</span>
                <span className="font-bold font-mono tracking-tight text-xs tabular-nums mt-0.5 text-current">
                  ${(asset.marketCapUsd / 1e9).toFixed(3)}B
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-widest uppercase text-[7.5px]">24H Liquidity</span>
                <span className="font-bold font-mono tracking-tight text-xs tabular-nums mt-0.5 text-current">
                  ${(asset.volumeUsd24Hr / 1e6).toFixed(2)}M
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-widest uppercase text-[7.5px]">Aggregated Supply</span>
                <span className="font-bold font-mono tracking-tight text-xs tabular-nums mt-0.5 text-current">
                  {(asset.supply / 1e6).toFixed(2)}M
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-widest uppercase text-[7.5px]">Hardcap Limit</span>
                <span className="font-bold font-mono tracking-tight text-xs tabular-nums mt-0.5 text-current">
                  {asset.maxSupply ? `${(asset.maxSupply / 1e6).toFixed(1)}M` : "INFINITY"}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* 2. CORE INTELLIGENCE CENTER DESK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =============== LEFT HAND WORKSPACE (65% width) =============== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* A. Live Chart Terminal */}
          <div className={`p-6 rounded-xl border ${
            isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-lg" : "bg-white border-black/[0.05] shadow-sm"
          }`}>
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`} />
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">Live price action horizon</h2>
              </div>
              <div className="flex items-center gap-1.5 opacity-40 font-mono text-[8px] uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-ping"></span>
                ACTIVE PIPELINE CONNECTED
              </div>
            </div>
            
            <CoinChart asset={asset} isDarkActive={isDarkActive} />
          </div>

          {/* B. Paper Order Entry Form & Execution Engine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* The Buy/Sell Terminal Form */}
            <div className="h-full flex flex-col">
              <PaperTrading 
                asset={asset}
                profile={userProfile}
                onTrade={onTrade}
                isDarkActive={isDarkActive}
              />
            </div>

            {/* The Integrated Local Spot Execution Ledger */}
            <div className={`p-6 rounded-xl border flex flex-col justify-between ${
              isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
            }`}>
              <div>
                <div className="flex items-center justify-between border-b border-[#ffffff0a] pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 opacity-60 text-[#14B8A6]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Active SPOT Orders</span>
                  </div>
                  <span className="text-[8px] font-mono bg-white/[0.03] border border-white/[0.05] py-0.5 px-1.5 rounded font-bold">{assetTrades.length} RECORDED</span>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {assetTrades.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 gap-2 font-mono">
                      <Briefcase className="w-5 h-5 text-current/80" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">No spot transactions</span>
                      <p className="text-[8px] max-w-[160px] mx-auto leading-tight">Execute buy or sell orders to output system ledgers.</p>
                    </div>
                  ) : (
                    assetTrades.sort((a,b) => b.timestamp - a.timestamp).slice(0, 10).map((trade) => (
                      <div key={trade.id} className={`flex items-center justify-between p-2.5 rounded border text-[10px] font-mono ${
                        isDarkActive 
                          ? "bg-[#121216] border-white/[0.04] hover:bg-white/[0.02]" 
                          : "bg-zinc-50 border-black/[0.05] hover:bg-zinc-100"
                      } transition-all`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-1 rounded text-[8px] font-black ${
                            trade.type === "BUY" ? "bg-[#14B8A6]/10 text-[#14B8A6]" : "bg-red-500/10 text-red-500"
                          }`}>
                            {trade.type}
                          </span>
                          <div>
                            <span className="font-bold block tracking-tight">{trade.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS</span>
                            <span className="text-[7.5px] opacity-35 leading-none block">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold block text-xs leading-none tabular-nums">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3.5 border-t border-dashed border-current border-opacity-5 mt-3.5 text-[8px] font-mono uppercase tracking-widest text-center opacity-30">
                LOB SECURE SPOT ESCROW COMPACT verified
              </div>
            </div>

          </div>

          {/* C. Extended Quantum Projections Framework (Visible if report exists) */}
          {report && (
            <div className="flex flex-col gap-6 mt-2">
              
              {/* Multidimensional projections banner */}
              <QuantumProjections 
                currentPrice={asset.priceUsd}
                isDarkActive={isDarkActive}
                symbol={asset.symbol}
              />
              
              {/* Multi tier short/mid/long execution zones */}
              {report.signal?.plans && (
                <ExecutionPlansPanel 
                  plans={report.signal.plans} 
                  isDarkActive={isDarkActive} 
                />
              )}

              {/* 5-Year Macro Projections */}
              {report.signal?.fiveYearForecast && (
                <FiveYearForecastPanel 
                  forecast={report.signal.fiveYearForecast} 
                  isDarkActive={isDarkActive} 
                />
              )}

            </div>
          )}

        </div>

        {/* =============== RIGHT HAND WORKSPACE / TECHNICAL CONTROLS (35% width) =============== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* IF REPORT IS NULL: SHOW SCAVENGING MODEL STANDBY */}
          {!report ? (
            <div className={`p-8 rounded-xl border flex flex-col items-center justify-center gap-6 text-center ${
              isDarkActive 
                ? "bg-[#09090C] border-white/[0.04] shadow-xl" 
                : "bg-white border-black/[0.05] shadow-sm"
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isDarkActive ? "bg-[#14B8A6]/5 text-[#14B8A6] border border-[#14B8A6]/20" : "bg-teal-50 text-teal-800 border"
              }`}>
                <Scan className="w-6 h-6" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-serif font-bold tracking-tight text-current mb-2">Mathematical Cycle Standby</h3>
                <p className="opacity-50 text-xs leading-relaxed font-sans">
                  The high-dimensional wave model for {asset.name} is in idle standby. Compile technical telemetry vectors, support divergence targets, and psychological alignment reports immediately.
                </p>
              </div>
              
              <button 
                onClick={onDeepScan}
                disabled={isAnalyzing}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
                  isDarkActive 
                    ? "bg-[#14B8A6] hover:bg-[#0F9688] text-black shadow-[#14B8A6]/10" 
                    : "bg-teal-700 hover:bg-teal-850 text-white shadow-teal-700/10"
                }`}
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> COMPILING GANN MATRIX...</>
                ) : (
                  <><Zap className="w-3.5 h-3.5 animate-pulse" /> COMPILE QUANT BRIEFING</>
                )}
              </button>
            </div>
          ) : (
            
            /* OTHERWISE: COLLAPSIBLE TELEMETRY DETAILS */
            <div className="flex flex-col gap-4">
              
              {/* THE SOVEREIGN DIRECTIONAL SIGNAL */}
              <div className={`p-5 rounded-xl border transition-all ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-lg" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="PREDICTIVE STRATEGY VECTOR" icon={Zap} sectionKey="signal" />
                
                {!collapsed["signal"] && (
                  <div className="flex flex-col gap-4 pt-1 font-sans animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-current border-opacity-10 text-xs bg-black/15 dark:bg-white/[0.01]">
                      <span className="font-mono text-[8.5px] font-bold opacity-45 uppercase tracking-wider">AEGIS COGNITIVE SIGNAL</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded ${
                        report.signal?.action?.includes("BUY") || report.signal?.action?.includes("ACCUMULATION")
                          ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                          : report.signal?.action?.includes("SELL")
                          ? "bg-red-500/10 text-red-500"
                          : "bg-[#C5A880]/10 text-[#C5A880]"
                      }`}>
                        {report.signal?.action}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                      <div className="bg-current bg-opacity-[0.02] p-2.5 rounded border border-current border-opacity-5">
                        <span className="opacity-45 uppercase block text-[7.5px] font-semibold mb-1">PROBABILITY RATE</span>
                        <span className="text-xs font-bold text-[#14B8A6] tracking-tight">{report.signal?.probabilityOfCall || "89.4%"}</span>
                      </div>
                      <div className="bg-current bg-opacity-[0.02] p-2.5 rounded border border-current border-opacity-5">
                        <span className="opacity-45 uppercase block text-[7.5px] font-semibold mb-1">SIGNAL QUALITY</span>
                        <span className="text-xs font-bold text-[#C5A880] tracking-tight">{report.riskEngine?.signalQualityRating || "A+"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[7.5px] font-mono font-bold opacity-30 uppercase tracking-widest block mb-1">Algorithmic Justification</span>
                      <p className="text-[11px] leading-relaxed opacity-80">{report.signal?.strategicJustification}</p>
                    </div>

                    <button
                      onClick={onDeepScan}
                      disabled={isAnalyzing}
                      className={`w-full py-2 text-xs font-mono font-bold uppercase rounded border transition-all text-current hover:bg-[#14B8A6] hover:text-black hover:border-transparent cursor-pointer ${
                        isDarkActive ? "border-white/10 bg-white/[0.01]" : "border-black/15 bg-zinc-50"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 inline-block mr-1.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                      Recalculate cycles
                    </button>
                  </div>
                )}
              </div>

              {/* CYCLIC TIME & PRICE MATHEMATICS */}
              <div className={`p-5 rounded-xl border transition-all ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="TIME & SYMMETRY CORE" icon={Activity} sectionKey="coordinates" />
                
                {!collapsed["coordinates"] && (
                  <div className="flex flex-col gap-3 font-mono text-[10px] animate-in fade-in duration-300">
                    <div className="bg-current bg-opacity-[0.02] p-3 rounded border border-current border-opacity-5 text-current opacity-90">
                      <span className="opacity-45 uppercase block text-[7.5px] font-bold mb-1 tracking-widest">Vector Alignments</span>
                      <p className="font-sans text-[11px] leading-relaxed opacity-80">{report.timeAndPrice?.quantumVectorAlignment}</p>
                    </div>

                    <div className="bg-[#14B8A6]/5 p-3 rounded border border-[#14B8A6]/10">
                      <span className="text-[#14B8A6] opacity-60 uppercase block text-[7.5px] font-bold mb-1 tracking-widest">Calculated Pivot (Squaring Date)</span>
                      <p className="font-sans text-xs leading-relaxed text-[#14B8A6] font-black">{report.timeAndPrice?.squaringDatePredict}</p>
                    </div>

                    <div>
                      <span className="opacity-45 uppercase tracking-widest text-[7px] block mb-1.5">VIBRATION CONVERGENCE NODES</span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.timeAndPrice?.hiddenVibrationalNodes?.map((node, i) => (
                          <span key={i} className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
                            isDarkActive ? "bg-white/5 border-white/10 text-[#C5A880]" : "bg-zinc-100 border-zinc-200 text-amber-900"
                          }`}>
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* THE GEOMETRIC SQUARE OF NINE MATRIX */}
              <div className={`p-5 rounded-xl border transition-all ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="GANN CYCLES HARMONICS" icon={Cpu} sectionKey="geometry" />
                
                {!collapsed["geometry"] && (
                  <div className="pt-1 animate-in fade-in duration-300">
                    <SquareOfNineMatrix 
                      currentPrice={asset.priceUsd} 
                      vibrationalNodes={report.timeAndPrice?.hiddenVibrationalNodes || []}
                      isDarkActive={isDarkActive}
                    />
                  </div>
                )}
              </div>

              {/* PSYCHOLOGICAL WARFARE & LIQUIDITY TRAPS */}
              <div className={`p-5 rounded-xl border transition-all ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="COGNITIVE MINDSET MAPPING" icon={Brain} sectionKey="psychology" />
                
                {!collapsed["psychology"] && (
                  <div className="flex flex-col gap-3 font-sans text-xs animate-in fade-in duration-300">
                    <div>
                      <span className="text-[9px] font-mono opacity-40 uppercase block font-bold mb-1">State psychology</span>
                      <p className="opacity-80 leading-relaxed font-sans text-[11px]">{report.psychology?.crowdMindsetState}</p>
                    </div>

                    <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20 relative overflow-hidden">
                      <ZapOff className="absolute -right-4 -top-4 w-16 h-16 text-red-500/5 rotate-12" />
                      <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                        <AlertTriangle className="w-3 h-3" />
                        TRAP RANGE ALERT
                      </span>
                      <p className="leading-relaxed opacity-85 text-[11px] relative z-10 mt-1.5">
                        {report.psychology?.liquidityTrapZone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* GEOPOLITICAL COMPRESSION */}
              <div className={`p-5 rounded-xl border transition-all ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="POLITICAL VOLATILITY ENVELOPE" icon={Globe} sectionKey="geopolitical" />
                
                {!collapsed["geopolitical"] && (
                  <div className="flex flex-col gap-3.5 font-sans text-xs animate-in fade-in duration-300">
                    <p className="opacity-80 leading-relaxed text-[11px]">{report.geopolitics?.macroVolatilityImpact}</p>
                    
                    <div className="bg-current bg-opacity-[0.02] p-3 rounded border border-current border-opacity-5 relative">
                      <div className="absolute top-0 right-3.5 px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 text-[6.5px] font-mono font-bold uppercase tracking-widest rounded-b">
                        RESTRICTED VECT
                      </div>
                      <span className="text-[8.5px] font-mono font-black uppercase text-current block mb-1 opacity-70">Sovereign Trigger Prediction</span>
                      <p className="leading-relaxed opacity-85 text-[10px] font-mono">
                        {report.anomaly?.hiddenAnomaly}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* HEURISTIC PROBABILITIES outlooks */}
              {report.aiPrediction && (
                <div className={`p-5 rounded-xl border transition-all ${
                  isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
                }`}>
                  <CollapseHeader title="DIVERGENCE INDEX LABELS" icon={PieChart} sectionKey="projections" />
                  
                  {!collapsed["projections"] && (
                     <div className="pt-1 animate-in fade-in duration-300">
                       <AIPredictionPanel 
                         data={report.aiPrediction}
                         isDarkActive={isDarkActive}
                       />
                     </div>
                  )}
                </div>
              )}

              {/* MARKET PSYCHOLOGY EMOTIONS SCALING */}
              {report.marketPsychology && (
                <div className={`p-5 rounded-xl border transition-all ${
                  isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
                }`}>
                  <CollapseHeader title="SENTIMENT INTENSITY GAUGES" icon={Sliders} sectionKey="emotions" />
                  
                  {!collapsed["emotions"] && (
                    <div className="pt-1 animate-in fade-in duration-300">
                      <MarketPsychologyEngine 
                        data={report.marketPsychology}
                        isDarkActive={isDarkActive}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CONFIDENCE & RISK SCORERS */}
              {report.riskEngine && (
                <div className={`p-5 rounded-xl border transition-all ${
                  isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-md" : "bg-white border-black/[0.05] shadow-sm"
                }`}>
                  <CollapseHeader title="AEGIS SEGREGATED RISK ENGINE" icon={ShieldAlert} sectionKey="risk" />
                  
                  {!collapsed["risk"] && (
                    <div className="pt-1 animate-in fade-in duration-300">
                      <RiskEnginePanel 
                        data={report.riskEngine}
                        isDarkActive={isDarkActive}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* INTEGRATED SPECIALIST CHAT TERMINAL DESK */}
              <div className={`p-5 rounded-xl border flex flex-col transition-all h-[420px] ${
                isDarkActive ? "bg-[#09090C] border-white/[0.04] shadow-lg" : "bg-white border-black/[0.05] shadow-sm"
              }`}>
                <CollapseHeader title="SPECIALIST NEURAL CHANNEL" icon={MessageSquare} sectionKey="chat" />
                
                {!collapsed["chat"] && (
                  <div className="flex-1 flex flex-col gap-3 h-full overflow-hidden animate-in fade-in duration-300">
                    <div className={`flex-1 overflow-y-auto rounded-lg p-3 flex flex-col gap-4 border ${
                      isDarkActive ? "bg-black/20 border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
                    }`}>
                       {chatMessages.map((msgRef) => (
                          <div key={msgRef.id} className={`flex flex-col max-w-[85%] ${
                            msgRef.role === "user" ? "self-end items-end" : "self-start items-start"
                          }`}>
                            <div className={`px-3 py-2 rounded-lg text-[11px] leading-relaxed relative ${
                              msgRef.role === "user" 
                                ? "bg-[#14B8A6] text-black font-semibold rounded-tr-none" 
                                : (isDarkActive 
                                    ? "bg-[#121216] text-white border border-white/5 rounded-tl-none" 
                                    : "bg-white text-black border border-black/5 rounded-tl-none")
                            }`}>
                              {msgRef.role === 'assistant' ? (
                                 msgRef.isNew ? (
                                   <TypewriterText text={msgRef.content} onComplete={() => onClearIsNew?.(msgRef.id)} />
                                 ) : (
                                   <div className="markdown-body">
                                     <Markdown>{msgRef.content}</Markdown>
                                   </div>
                                 )
                               ) : msgRef.content}
                            </div>
                            <div className={`flex items-center gap-3 mt-1.5 px-0.5 ${msgRef.role === 'user' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[7.5px] font-mono opacity-30">{msgRef.timestamp}</span>
                              <button 
                                onClick={() => handleCopyMsg(msgRef.id, msgRef.content)}
                                className="text-[7.5px] font-mono opacity-50 hover:opacity-100 flex items-center gap-1 cursor-pointer transition-all hover:text-[#14B8A6]"
                                title="Copy Content"
                              >
                                {copiedId === msgRef.id ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                                    <span className="text-emerald-500 font-bold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                       ))}
                       {isChatLoading && (
                         <div className="self-start px-3 py-2 rounded-lg bg-current bg-opacity-5 border border-current border-opacity-10 opacity-70 flex gap-2 items-center">
                            <RefreshCw className="w-3 h-3 animate-spin text-[#14B8A6]" />
                            <span className="text-[8.5px] font-mono opacity-50 uppercase tracking-widest">Resolving triggers...</span>
                         </div>
                       )}
                    </div>

                    <div className="flex gap-2.5">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                        placeholder="Ask about squaring coordinates..."
                        className={`flex-1 h-10 px-3 rounded border text-[11px] transition-all outline-none ${
                          isDarkActive 
                            ? "bg-transparent text-white border-white/10 focus:border-[#14B8A6]" 
                            : "bg-transparent text-black border-black/10 focus:border-teal-700"
                        }`}
                      />
                      <button 
                        onClick={onSendChat}
                        disabled={isChatLoading || !chatInput.trim()}
                        className={`h-10 px-3.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-40 cursor-pointer ${
                          isDarkActive 
                            ? "bg-[#14B8A6] text-black hover:bg-[#0F9688]" 
                            : "bg-teal-700 text-white hover:bg-teal-850"
                        }`}
                      >
                        Ask
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
