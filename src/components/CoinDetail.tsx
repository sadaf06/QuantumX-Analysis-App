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
  Check
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
    const defaultColor = color || (isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]");
    
    return (
      <div 
        onClick={() => toggleCollapse(sectionKey)}
        className={`flex items-center justify-between border-b pb-3 mb-3 cursor-pointer select-none group transition-all ${
          isDarkActive ? "border-white/5 hover:border-white/10" : "border-black/5 hover:border-black/10"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${defaultColor}`} />
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{title}</h2>
        </div>
        <div className="flex items-center gap-1 opacity-55 group-hover:opacity-100 transition-all">
          <span className="text-[8px] font-mono uppercase tracking-wider">{isCollapsed ? "expand" : "collapse"}</span>
          {isCollapsed ? (
            <ChevronRightIcon className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    );
  };

  const assetTrades = userProfile.history.filter(t => t.assetId === asset.id);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* 1. ASSET PRICE HEADER */}
      <div className={`p-6 md:p-8 rounded-2xl border transition-all ${
        isDarkActive 
          ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-xl" 
          : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
      } relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <Atom className="w-40 h-40 rotate-12 text-[#C9A96A]" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-5">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg leading-none shadow-sm ${
               isDarkActive ? "bg-[#1A1A22] text-[#C9A96A]" : "bg-[#F0EBE0] text-[#9C7B3E]"
             }`}>
                {asset.symbol.slice(0, 3)}
             </div>
             <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">{asset.name}</h1>
                  <span className={`text-[9px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-lg border ${
                    isDarkActive 
                      ? "bg-[#C9A96A]/10 text-[#C9A96A] border-[#C9A96A]/20" 
                      : "bg-[#9C7B3E]/10 text-[#9C7B3E] border-[#9C7B3E]/20"
                  }`}>
                    {asset.symbol}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-black/15 dark:bg-white/5 rounded-md opacity-60 font-bold uppercase">
                    RANK #{asset.rank}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 font-mono">
                   <span className={`text-xl md:text-2xl font-bold tracking-tight ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                     ${asset.priceUsd.toLocaleString(undefined, { 
                       minimumFractionDigits: asset.priceUsd > 1 
                         ? (asset.priceUsd > 1000 ? 2 : 2) 
                         : 6 
                     })}
                   </span>
                   <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                     isUp ? "bg-[#5EEAD4]/10 text-[#5EEAD4]" : "bg-[#E2675A]/10 text-[#E2675A]"
                   }`}>
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isUp ? "+" : ""}{asset.changePercent24Hr.toFixed(2)}%
                   </span>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-mono border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-current opacity-80">
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-wider uppercase text-[8px]">MARKET CAPITAL</span>
                <span className={`font-bold mt-0.5 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  ${(asset.marketCapUsd / 1e9).toFixed(2)}B
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-wider uppercase text-[8px]">24H TRADED VOL</span>
                <span className={`font-bold mt-0.5 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  ${(asset.volumeUsd24Hr / 1e6).toFixed(1)}M
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-wider uppercase text-[8px]">CIRC COINS</span>
                <span className={`font-bold mt-0.5 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  {(asset.supply / 1e6).toFixed(1)}M
                </span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold tracking-wider uppercase text-[8px]">LIMIT CAP</span>
                <span className={`font-bold mt-0.5 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  {asset.maxSupply ? `${(asset.maxSupply / 1e6).toFixed(1)}M` : "UNSET"}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* 2. CORE INTELLIGENCE CENTER DESK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* =============== LEFT HAND WORKSPACE (65% width) =============== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* A. Live Chart Terminal */}
          <div className={`p-6 rounded-2xl border ${
            isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <Activity className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Real-Time Price action horizon</h2>
              </div>
              <div className="flex items-center gap-1.5 opacity-40 font-mono text-[9px] uppercase font-bold">
                <span className="w-1.5 h-1.5 bg-[#5EEAD4] rounded-full animate-ping"></span>
                LIVE CHART CONNECTED
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

            {/* The Integrated Local Spot Execution Ledger (NO TABS!) */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
            }`}>
              <div>
                <div className="flex items-center justify-between border-b pb-3 mb-3" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 opacity-70" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Coin Execution Ledger</span>
                  </div>
                  <span className="text-[8px] font-mono bg-black/10 dark:bg-white/5 py-0.5 px-2 rounded font-bold">{assetTrades.length} EXECUTED</span>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {assetTrades.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 gap-1.5 font-mono">
                      <Briefcase className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">No active spot records</span>
                      <p className="text-[8px] leading-tight">Execute a trade on the order desk to populate.</p>
                    </div>
                  ) : (
                    assetTrades.sort((a,b) => b.timestamp - a.timestamp).slice(0, 10).map((trade) => (
                      <div key={trade.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-mono ${
                        isDarkActive 
                          ? "bg-black/20 border-white/5 hover:bg-white/[0.02]" 
                          : "bg-black/[0.01] border-black/5 hover:bg-black/[0.02]"
                      } transition-all`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-1 rounded text-[9px] font-black ${
                            trade.type === "BUY" ? "bg-[#5EEAD4]/10 text-[#5EEAD4]" : "bg-[#E2675A]/10 text-[#E2675A]"
                          }`}>
                            {trade.type}
                          </span>
                          <div>
                            <span className="font-bold block tracking-tight">{trade.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS</span>
                            <span className="text-[7px] opacity-35 leading-none block">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold block text-sm leading-none">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t mt-3 border-dashed border-current opacity-30 text-[8px] font-mono uppercase tracking-widest text-center" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                Audit trial synced under secure ledgers
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
          
          {/* IF REPORT IS NULL: SHOW COGNITIVE SCAN STANDBY COCKPIT */}
          {!report ? (
            <div className={`p-8 rounded-2xl border flex flex-col items-center justify-center gap-6 text-center ${
              isDarkActive 
                ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-xl" 
                : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDarkActive ? "bg-[#C9A96A]/10 text-[#C9A96A]" : "bg-[#9C7B3E]/10 text-[#9C7B3E]"
              }`}>
                <Scan className="w-7 h-7" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-serif font-bold tracking-tight mb-2">Aegis Specialist Standby</h3>
                <p className="opacity-60 text-xs leading-relaxed font-sans">
                  The mathematical cycles engine for {asset.name} is in idle standby mode. Inject core scanning telemetry to map local squaring dates, harmonics convergence nodes, and directionality indicators.
                </p>
              </div>
              
              <button 
                onClick={onDeepScan}
                disabled={isAnalyzing}
                className={`w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer ${
                  isDarkActive 
                    ? "bg-[#C9A96A] hover:bg-[#B08A4E] text-black shadow-[#C9A96A]/15" 
                    : "bg-[#9C7B3E] hover:bg-[#7E602A] text-white shadow-[#9C7B3E]/15"
                }`}
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> RUNNING QUANT MODEL...</>
                ) : (
                  <><Zap className="w-4 h-4 animate-pulse" /> ACTIVATE SPECIAL SCAN</>
                )}
              </button>
            </div>
          ) : (
            
            /* OTHERWISE: RENDER UNIFIED COLLAPSIBLE HUB PANELS */
            <div className="flex flex-col gap-4">
              
              {/* THE SOVEREIGN DIRECTIONAL SIGNAL */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="THE DIRECTIONAL CORE" icon={Zap} sectionKey="signal" />
                
                {!collapsed["signal"] && (
                  <div className="flex flex-col gap-4 pt-1 font-sans animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed text-xs focus-within:ring-2 bg-black/10 dark:bg-white/[0.01]" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                      <span className="font-mono text-[9px] font-bold opacity-45 uppercase tracking-wider">AEGIS DEVIATION SIGNAL</span>
                      <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md ${
                        report.signal?.action?.includes("BUY") || report.signal?.action?.includes("ACCUMULATION")
                          ? "bg-[#5EEAD4]/10 text-[#5EEAD4]"
                          : report.signal?.action?.includes("SELL")
                          ? "bg-[#E2675A]/10 text-[#E2675A]"
                          : "bg-[#C9A96A]/10 text-[#C9A96A]"
                      }`}>
                        {report.signal?.action}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                      <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span className="opacity-40 uppercase block text-[8px] font-bold mb-1">PROBABILITY</span>
                        <span className="text-sm font-bold text-[#5EEAD4] tracking-tight">{report.signal?.probabilityOfCall}</span>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span className="opacity-40 uppercase block text-[8px] font-bold mb-1">SIGNAL QUALITY</span>
                        <span className="text-sm font-bold text-[#C9A96A] tracking-tight">{report.riskEngine?.signalQualityRating || "A+"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono font-bold opacity-30 uppercase tracking-widest block mb-1">Justification Analysis</span>
                      <p className="text-[11px] leading-relaxed opacity-85">{report.signal?.strategicJustification}</p>
                    </div>

                    <button
                      onClick={onDeepScan}
                      disabled={isAnalyzing}
                      className={`w-full py-2 bg-black/10 text-xs font-mono font-bold uppercase rounded-lg border flex items-center justify-center gap-1.5 transition-all text-current hover:bg-[#C9A96A] hover:text-black hover:border-transparent cursor-pointer ${
                        isDarkActive ? "border-white/10" : "border-black/10"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                      <span>Reflash coordinates</span>
                    </button>
                  </div>
                )}
              </div>

              {/* CYCLIC TIME & PRICE MATHEMATICS */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="TIME & PRICE MATHEMATICS" icon={Activity} sectionKey="coordinates" />
                
                {!collapsed["coordinates"] && (
                  <div className="flex flex-col gap-3 font-mono text-[10px] animate-in fade-in duration-300">
                    <div className="bg-black/10 dark:bg-white/5 p-3 rounded-lg border border-current opacity-90">
                      <span className="opacity-40 uppercase block text-[8px] font-bold mb-1 tracking-wider">Vector Alignment Mapping</span>
                      <p className="font-sans text-xs leading-relaxed opacity-90">{report.timeAndPrice?.quantumVectorAlignment}</p>
                    </div>

                    <div className="bg-[#5EEAD4]/5 p-3 rounded-lg border border-[#5EEAD4]/15">
                      <span className="text-[#5EEAD4] opacity-50 uppercase block text-[8px] font-bold mb-1 tracking-wider">Estimated Next Pivot (Squaring Date)</span>
                      <p className="font-sans text-xs leading-relaxed text-[#5EEAD4] font-black">{report.timeAndPrice?.squaringDatePredict}</p>
                    </div>

                    <div>
                      <span className="opacity-40 uppercase tracking-widest text-[8px] block mb-1.5">Aegis Convergence Nodes</span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.timeAndPrice?.hiddenVibrationalNodes?.map((node, i) => (
                          <span key={i} className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isDarkActive ? "bg-white/5 border-white/10 text-[#C9A96A]" : "bg-black/5 border-black/10 text-[#9C7B3E]"
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
              <div className={`p-5 rounded-2xl border transition-all ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="GANN HIGH-DIMENSIONAL MATH" icon={Cpu} sectionKey="geometry" />
                
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

              {/* PSYCHOLOGICAL WARFARE & TRAPPING INDICATORS */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="THE PSYCHO-TRAFFIC REPORT" icon={Brain} sectionKey="psychology" />
                
                {!collapsed["psychology"] && (
                  <div className="flex flex-col gap-3 font-sans text-xs animate-in fade-in duration-300">
                    <div>
                      <span className="text-[10px] font-mono opacity-50 uppercase block font-bold mb-1">State Sentiment</span>
                      <p className="opacity-80 leading-relaxed font-sans">{report.psychology?.crowdMindsetState}</p>
                    </div>

                    <div className="bg-[#E2675A]/5 p-4 rounded-xl border border-[#E2675A]/20 relative overflow-hidden">
                      <ZapOff className="absolute -right-4 -top-4 w-20 h-20 text-[#E2675A]/5 rotate-12" />
                      <span className="text-[10px] font-mono font-bold text-[#E2675A] uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Liquidity Trap Risk Range
                      </span>
                      <p className="leading-relaxed opacity-85 text-[11px] relative z-10 mt-1">
                        {report.psychology?.liquidityTrapZone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* GEOPOLITICAL COMPRESSION */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="GEOPOLITICAL ENVELOPE" icon={Globe} sectionKey="geopolitical" />
                
                {!collapsed["geopolitical"] && (
                  <div className="flex flex-col gap-3 font-sans text-xs animate-in fade-in duration-300">
                    <p className="opacity-85 leading-relaxed">{report.geopolitics?.macroVolatilityImpact}</p>
                    
                    <div className="bg-black/10 dark:bg-white/5 p-4 rounded-xl border border-current relative">
                      <div className="absolute top-0 right-4 px-2 py-0.5 bg-[#C9A96A]/20 text-[#C9A96A] text-[7px] font-mono font-bold uppercase tracking-widest rounded-b-lg">
                        Classified
                      </div>
                      <span className={`text-[9px] font-mono font-black uppercase text-current block mb-1 opacity-75`}>Sovereign Anomaly Vector</span>
                      <p className="leading-relaxed opacity-95 text-[11px] font-mono">
                        {report.anomaly?.hiddenAnomaly}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* HEURISTIC PROBABILITIES outlooks */}
              {report.aiPrediction && (
                <div className={`p-5 rounded-2xl border transition-all ${
                  isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
                }`}>
                  <CollapseHeader title="HEURISTIC PROBABILITIES" icon={PieChart} sectionKey="projections" />
                  
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
                <div className={`p-5 rounded-2xl border transition-all ${
                  isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
                }`}>
                  <CollapseHeader title="CROWD EMOTIONAL SCALES" icon={Sliders} sectionKey="emotions" />
                  
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

              {/* CONFIDENCE & RISK MULTI INDICES */}
              {report.riskEngine && (
                <div className={`p-5 rounded-2xl border transition-all ${
                  isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-md" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
                }`}>
                  <CollapseHeader title="RISK INDEX MONITOR" icon={ShieldAlert} sectionKey="risk" />
                  
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

              {/* INTEGRATED SPECIALIST CHAT DESK */}
              <div className={`p-5 rounded-2xl border flex flex-col transition-all h-[420px] ${
                isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
              }`}>
                <CollapseHeader title="UNIFIED SPECIALIST CO-CORE" icon={MessageSquare} sectionKey="chat" />
                
                {!collapsed["chat"] && (
                  <div className="flex-1 flex flex-col gap-3 h-full overflow-hidden animate-in fade-in duration-300">
                    <div className={`flex-1 overflow-y-auto rounded-xl p-3 flex flex-col gap-3.5 border ${
                      isDarkActive ? "bg-black/25 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
                    }`}>
                       {chatMessages.slice(0).map((msgRef) => (
                         <div key={msgRef.id} className={`flex flex-col max-w-[85%] ${
                           msgRef.role === "user" ? "self-end items-end" : "self-start items-start"
                         }`}>
                           <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed relative ${
                             msgRef.role === "user" 
                               ? (isDarkActive ? "bg-[#C9A96A] text-black font-semibold rounded-tr-none" : "bg-[#9C7B3E] text-white font-semibold rounded-tr-none") 
                               : (isDarkActive 
                                   ? "bg-[#1A1A22] text-[#EDEAE3] border border-white/5 rounded-tl-none" 
                                   : "bg-white text-[#1A1A1F] border border-black/5 rounded-tl-none")
                           }`}>
                              {msgRef.role === 'assistant' ? (
                                 msgRef.isNew ? (
                                   <TypewriterText text={msgRef.content} onComplete={() => onClearIsNew?.(msgRef.id)} />
                                 ) : (
                                   <Markdown>{msgRef.content}</Markdown>
                                 )
                               ) : msgRef.content}
                           </div>
                           <div className={`flex items-center gap-3 mt-0.5 px-0.5 ${msgRef.role === 'user' ? 'flex-row-reverse' : ''}`}>
                             <span className="text-[7.5px] font-mono opacity-30">{msgRef.timestamp}</span>
                             <button 
                               onClick={() => handleCopyMsg(msgRef.id, msgRef.content)}
                               className="text-[9px] font-mono opacity-50 hover:opacity-100 flex items-center gap-1 cursor-pointer transition-all hover:text-[#C9A96A] select-none scale-102 hover:scale-105 active:scale-95"
                               title={msgRef.role === 'user' ? "Copy Question" : "Copy Answer"}
                             >
                               {copiedId === msgRef.id ? (
                                 <>
                                   <Check className="w-2.5 h-2.5 text-green-500" />
                                   <span className="text-green-500 text-[8px] font-bold">Copied!</span>
                                 </>
                               ) : (
                                 <>
                                   <Copy className="w-2.5 h-2.5" />
                                   <span className="text-[8px]">{msgRef.role === 'user' ? "Copy" : "Copy"}</span>
                                 </>
                               )}
                             </button>
                           </div>
                         </div>
                      ))}
                      {isChatLoading && (
                        <div className="self-start px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-current opacity-80 flex gap-1.5 items-center">
                           <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A96A]" />
                           <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Compiling coordinates...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                        placeholder="Query squaring nodes, triggers..."
                        className={`flex-1 h-10 px-3 rounded-lg border text-[11px] transition-all outline-none ${
                          isDarkActive 
                            ? "bg-black text-white border-white/10 focus:border-[#C9A96A]/60" 
                            : "bg-white text-black border-black/10 focus:border-[#9C7B3E]/60"
                        }`}
                      />
                      <button 
                        onClick={onSendChat}
                        disabled={isChatLoading || !chatInput.trim()}
                        className={`h-10 px-4 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 cursor-pointer ${
                          isDarkActive 
                            ? "bg-[#C9A96A] text-black hover:bg-[#B08A4E]" 
                            : "bg-[#9C7B3E] text-white hover:bg-[#7E602A]"
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
