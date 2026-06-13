import React from "react";
import { 
  Scan, 
  MessageSquare, 
  Zap, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  ZapOff, 
  Globe, 
  RefreshCw, 
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  FileText,
  Lock,
  Compass,
  CornerDownRight,
  UserCheck2,
  CheckCircle,
  HelpCircle,
  Award
} from "lucide-react";
import { CryptoAsset, CoinIntelligenceReport, ChatMessage } from "../types";
import { SquareOfNineMatrix } from "./SquareOfNine";
import { QuantumProjections } from "./QuantumProjections";
import { AIPredictionPanel } from "./AIPredictionPanel";
import { MarketPsychologyEngine } from "./MarketPsychologyEngine";
import { NewsIntelligenceSystem } from "./NewsIntelligenceSystem";
import { RiskEnginePanel } from "./RiskEnginePanel";
import { ExecutionPlansPanel } from "./ExecutionPlansPanel";
import { FiveYearForecastPanel } from "./FiveYearForecastPanel";
import { InstitutionalSentiment } from "./InstitutionalSentiment";

export interface AnalyzedCoinTab {
  coin: CryptoAsset;
  lang: "english" | "hinglish";
  report: CoinIntelligenceReport | null;
  isAnalyzing: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
}

interface Props {
  tabs: AnalyzedCoinTab[];
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onCloseTab: (index: number) => void;
  onSendChat: (index: number) => void;
  onChatInputChange: (index: number, val: string) => void;
  isDarkActive: boolean;
  onOpenTradeView: (asset: CryptoAsset) => void;
  allAssets: CryptoAsset[];
  onTriggerScanForAsset: (asset: CryptoAsset) => void;
}

export const AnalysisTabCenter: React.FC<Props> = ({
  tabs,
  activeIndex,
  onSelectTab,
  onCloseTab,
  onSendChat,
  onChatInputChange,
  isDarkActive,
  onOpenTradeView,
  allAssets,
  onTriggerScanForAsset
}) => {

  const SectionHeader = ({ icon: Icon, title, color = "text-[#C9A96A]" }: any) => (
    <div className="flex items-center gap-2.5 border-b pb-3 mb-4" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
      <Icon className={`w-4 h-4 ${color}`} />
      <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{title}</h2>
    </div>
  );

  const activeTab = tabs[activeIndex];

  return (
    <div className="flex flex-col gap-6 items-stretch animate-in fade-in duration-300">
      
      {/* 1. SECURED REPORTS DOSSIER TABS */}
      <div className={`p-2 flex flex-wrap gap-1.5 rounded-2xl border items-center justify-between ${
        isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5 shadow-sm"
      }`}>
         <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-black/10 dark:bg-white/5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5">
             <Lock className="w-3 h-3 text-[#C9A96A]" /> SECURE ANALYSIS CACHE
           </div>
         </div>
         
         <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
           {tabs.map((tab, idx) => (
              <div 
                 key={`${tab.coin.id}_${tab.lang}`} 
                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all tracking-tight cursor-pointer select-none border ${
                    idx === activeIndex 
                       ? (isDarkActive ? "bg-[#C9A96A]/10 border-[#C9A96A]/30 text-[#C9A96A]" : "bg-[#9C7B3E]/10 border-[#9C7B3E]/30 text-[#9C7B3E]")
                       : `bg-transparent border-transparent opacity-50 hover:bg-black/5 dark:hover:bg-white/5`
                 }`}
                 onClick={() => onSelectTab(idx)}
              >
                 <span className="font-mono bg-black/15 dark:bg-white/5 px-2 py-0.5 rounded text-[9px] tracking-wider">{tab.coin.symbol}</span>
                 <span className="text-[9px] opacity-60 font-mono tracking-wider">{tab.lang === "hinglish" ? "Hinglish" : "English"}</span>
                 <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       onCloseTab(idx);
                    }}
                    className="rounded-full p-0.5 hover:bg-[#E2675A]/20 hover:text-[#E2675A] transition-all ml-1"
                 >
                    <X className="w-3 h-3" />
                 </button>
              </div>
           ))}

           {tabs.length === 0 && (
              <span className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase opacity-35 font-mono">No reports compiled</span>
           )}
         </div>
      </div>

      {/* 2. REPORT VIEWPORT */}
      {tabs.length === 0 ? (
         <div className={`p-12 md:p-16 rounded-2xl border flex flex-col items-center justify-center gap-6 text-center ${
           isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5"
         }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDarkActive ? "bg-[#C9A96A]/10 text-[#C9A96A]" : "bg-[#9C7B3E]/15 text-[#9C7B3E]"
            }`}>
              <FileText className="w-8 h-8 animate-pulse" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-serif font-black tracking-tight mb-2 uppercase">Research Center Standby</h3>
              <p className="opacity-60 text-xs leading-relaxed mb-6 font-sans">
                You have not compiled any analytical report dossiers. Trigger a scanning vector on any asset from the selection pool below or from the Mission Control stream.
              </p>
              
              {/* Quick Launch Panel */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-dashed bg-black/10" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                 <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#C9A96A]">Dossier Research Launchers</span>
                 <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {allAssets.slice(0, 6).map(asset => (
                       <button
                          key={asset.id}
                          onClick={() => onTriggerScanForAsset(asset)}
                          className={`px-3 py-2 rounded-xl border text-[9px] font-mono font-bold tracking-wider uppercase bg-transparent transition-all hover:scale-[1.02] cursor-pointer ${
                            isDarkActive 
                              ? "border-white/10 hover:border-[#C9A96A] hover:bg-white/5" 
                              : "border-black/10 hover:border-[#9C7B3E] hover:bg-black/5"
                          }`}
                       >
                          Analyze {asset.symbol}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
         </div>
      ) : (
         activeTab && (
            <div className="flex flex-col gap-6">
               
               {/* PILOT COMPILATION LOADER */}
               {activeTab.isAnalyzing ? (
                  <div className={`p-20 rounded-2xl border flex flex-col items-center justify-center gap-4 text-center ${
                    isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5"
                  }`}>
                     <RefreshCw className="w-8 h-8 text-[#C9A96A] animate-spin" />
                     <div className="max-w-md">
                        <span className="text-[9px] font-mono tracking-[0.25em] uppercase opacity-40">Aegis Intelligence Dossier Synthesis</span>
                        <h3 className="text-sm font-mono font-black tracking-widest uppercase mt-1 mb-2">COMPILING PORTFOLIO RESEARCH FOR {activeTab.coin.name}</h3>
                        <p className="opacity-55 text-[10px] leading-relaxed">
                           Sourcing planetary resistance matrices, calculating Bollinger standard dev vectors, and mapping chronological cyclical squares...
                        </p>
                     </div>
                  </div>
               ) : (
                  activeTab.report && (
                     <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                        
                        {/* 2A. EXECUTIVE RESEARCH HEADER STRIP */}
                        <div className={`p-8 rounded-2xl border flex flex-col md:flex-row justify-between items-center transition-all relative overflow-hidden gap-6 ${
                          isDarkActive ? "bg-[#101017] border-white/5 shadow-2xl" : "bg-white border-black/10 shadow-lg"
                        }`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg select-none ${
                                isDarkActive ? "bg-white/5 text-[#C9A96A]" : "bg-black/5 text-[#9C7B3E]"
                              }`}>
                                 Φ
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase px-1.5 py-0.5 bg-black/20 text-[#C9A96A] rounded">RESTRICTED DOSSIER</span>
                                   <span className="text-[9px] font-mono font-bold opacity-30">// SECTION 20-L4</span>
                                 </div>
                                 <h2 className="text-2xl font-serif font-semibold tracking-tight mt-1">
                                   {activeTab.coin.name} Deep Intelligence Briefing
                                 </h2>
                              </div>
                           </div>

                           <div className="flex items-center gap-3">
                              <button 
                                 onClick={() => onOpenTradeView(activeTab.coin)}
                                 className={`px-4 py-2 text-[10px] font-mono font-bold rounded-xl border transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                                   isDarkActive 
                                     ? "border-white/10 hover:border-[#C9A96A] bg-transparent text-[#EDEAE3]" 
                                     : "border-black/10 hover:border-[#9C7B3E] bg-transparent text-[#1A1A1F]"
                                 }`}
                              >
                                 Load spot desk <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>

                        {/* 2B. EDITORIAL STYLE STRATEGIC JUSTIFICATION BOARD */}
                        <section className={`p-8 rounded-2xl border relative overflow-hidden ${
                          isDarkActive ? "bg-[#101017] border-white/5 text-slate-100" : "bg-white border-black/10 text-slate-900 shadow-md"
                        }`}>
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                             <Award className="w-40 h-40 text-[#C9A96A] rotate-12" />
                           </div>

                           <div className="relative z-10">
                             <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                               <div className="flex items-center gap-2">
                                 <Compass className="w-4.5 h-4.5 text-[#C9A96A]" />
                                 <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase">I. Core Directional Calibration</span>
                               </div>
                               <span className="text-[8px] font-mono opacity-50 font-bold uppercase tracking-widest">Aegis Oracle Signature Core</span>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                               
                               {/* Left Score */}
                               <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-current pb-4 md:pb-0 md:pr-6 border-opacity-10 opacity-90 h-full">
                                 <div>
                                   <span className="text-[8.5px] font-mono font-bold uppercase opacity-45 tracking-widest block mb-2">SYSTEM CONVICTION INDICATOR</span>
                                   <span className={`text-xl font-mono font-black uppercase tracking-wider block ${
                                     activeTab.report.signal?.action?.includes("BUY") || activeTab.report.signal?.action?.includes("ACCUMULATION")
                                       ? "text-[#5EEAD4]"
                                       : activeTab.report.signal?.action?.includes("SELL")
                                       ? "text-[#E2675A]"
                                       : "text-[#C9A96A]"
                                   }`}>
                                     {activeTab.report.signal?.action}
                                   </span>
                                 </div>
                                 <span className="text-[7.5px] font-mono block opacity-30 mt-4">Calculated across 20 spatial harmonics</span>
                               </div>

                               {/* Mid Probability Progress */}
                               <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-current pb-4 md:pb-0 md:px-6 border-opacity-10 opacity-90 h-full">
                                 <div>
                                   <span className="text-[8.5px] font-mono font-bold uppercase opacity-45 tracking-widest block mb-1.5">CONCORDANCE ALIGNMENT delta</span>
                                   <div className="text-2xl font-mono font-bold text-current flex items-end gap-1">
                                     {activeTab.report.signal?.probabilityOfCall}
                                   </div>
                                 </div>
                                 <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden mt-3">
                                   <div className="bg-[#5EEAD4] h-full" style={{ width: "84%" }}></div>
                                 </div>
                               </div>

                               {/* Right Strategic Insight */}
                               <div className="flex flex-col justify-center h-full">
                                 <span className="text-[8.5px] font-mono font-bold opacity-45 tracking-widest uppercase block mb-1">PROPRIETARY RATIONALE SUMMARY</span>
                                 <p className="text-xs leading-relaxed opacity-80 font-serif italic">
                                   "{activeTab.report.signal?.strategicJustification}"
                                 </p>
                               </div>

                             </div>
                           </div>
                        </section>

                        {/* 2C. MACRO AND CYCLICAL COMPLEMENTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {/* execution targets short/mid/long */}
                           {activeTab.report.signal?.plans && (
                              <ExecutionPlansPanel 
                                 plans={activeTab.report.signal.plans} 
                                 isDarkActive={isDarkActive} 
                              />
                           )}

                           {/* 5-year cyclical target projections */}
                           {activeTab.report.signal?.fiveYearForecast && (
                              <FiveYearForecastPanel 
                                 forecast={activeTab.report.signal.fiveYearForecast} 
                                 isDarkActive={isDarkActive} 
                              />
                           )}
                        </div>

                        {/* 2D. MATHEMATICAL COORDINATES & PLANETARY SCALARS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           
                           {/* Price Vectors coordinates */}
                           <section className={`p-6 rounded-2xl border flex flex-col justify-between ${isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5"}`}>
                             <div>
                                <SectionHeader icon={Activity} title="II. Chronosequence Price coordinates" />
                                <div className="flex flex-col gap-4 text-xs font-mono">
                                  <div className="flex flex-col bg-black/15 dark:bg-white/5 p-3 rounded-lg border border-white/5">
                                    <span className="font-bold opacity-30 uppercase tracking-wider text-[8px] mb-1.5">Vibrational Alignment Vector</span>
                                    <p className="text-xs leading-relaxed text-current font-medium">{activeTab.report.timeAndPrice?.quantumVectorAlignment}</p>
                                  </div>
                                  
                                  <div className="flex flex-col bg-black/15 dark:bg-white/5 p-3 rounded-lg border border-white/5">
                                    <span className="font-bold opacity-30 uppercase tracking-wider text-[8px] mb-1.5 text-[#5EEAD4]">Estimated Next Squaring Epoch</span>
                                    <p className="text-xs leading-relaxed text-[#5EEAD4] font-bold">{activeTab.report.timeAndPrice?.squaringDatePredict}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-[8px] font-bold opacity-30 uppercase mb-2">Hidden Resonance Threshold Nodes</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {activeTab.report.timeAndPrice?.hiddenVibrationalNodes?.map((n, i) => (
                                        <span key={i} className="text-[10px] font-mono font-bold text-[#C9A96A] bg-[#C9A96A]/10 px-2.5 py-0.5 rounded border border-[#C9A96A]/10">
                                          {n}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                             </div>
                           </section>

                           {/* Gann squaring matrix */}
                           <SquareOfNineMatrix 
                              currentPrice={activeTab.coin.priceUsd} 
                              vibrationalNodes={activeTab.report.timeAndPrice?.hiddenVibrationalNodes || []}
                              isDarkActive={isDarkActive}
                              lang={activeTab.lang}
                              symbol={activeTab.coin.symbol}
                           />
                        </div>

                        {/* Quantum projections detailed charts */}
                        <div className="flex flex-col gap-6">
                           <QuantumProjections 
                             currentPrice={activeTab.coin.priceUsd} 
                             isDarkActive={isDarkActive} 
                             symbol={activeTab.coin.symbol} 
                           />
                           
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Psychological warfare zones */}
                              <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5"}`}>
                                <SectionHeader icon={ShieldAlert} title="III. Crowd Psychological Warfare" />
                                <div className="flex flex-col gap-4 text-xs">
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-[#C9A96A] uppercase tracking-wider font-mono">Current Trajectory Bias</span>
                                      <p className="opacity-80 leading-relaxed text-xs">{activeTab.report.psychology?.crowdMindsetState}</p>
                                   </div>
                                   <div className="flex flex-col gap-2 p-4 bg-[#E2675A]/5 rounded-xl border border-[#E2675A]/15 relative overflow-hidden">
                                      <ZapOff className="absolute -right-4 -top-4 w-20 h-20 text-[#E2675A]/10 rotate-12" />
                                      <span className="text-[9px] font-mono font-bold text-[#E2675A] uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Inbound Liquidity Trap Zone
                                      </span>
                                      <p className="opacity-80 leading-relaxed text-[11px] relative z-10 mt-1">
                                        {activeTab.report.psychology?.liquidityTrapZone}
                                      </p>
                                   </div>
                                </div>
                              </section>

                              {/* Geopolitical compression and classified anomalies */}
                              <section className={`p-6 rounded-2xl border flex flex-col justify-between ${isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5"}`}>
                                <div>
                                  <SectionHeader icon={Globe} title="IV. Geopolitical capital Compression" />
                                  <p className="text-xs opacity-80 leading-relaxed">
                                    {activeTab.report.geopolitics?.macroVolatilityImpact}
                                  </p>
                                </div>
                                <div className="mt-5 p-4 bg-black/20 dark:bg-white/5 rounded-xl border border-dashed relative">
                                   <div className="absolute top-0 right-4 px-2 py-0.5 bg-[#C9A96A] text-black text-[7px] font-mono font-bold tracking-widest uppercase rounded-b-sm">
                                     Classified
                                   </div>
                                   <span className="text-[8px] font-mono font-bold text-[#C9A96A] uppercase block mb-1 opacity-70">Proprietary anomaly detect</span>
                                   <p className="font-mono text-xs leading-relaxed text-white">
                                     {activeTab.report.anomaly?.hiddenAnomaly}
                                   </p>
                                </div>
                              </section>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                              {activeTab.report.marketPsychology && (
                                <MarketPsychologyEngine 
                                  data={activeTab.report.marketPsychology}
                                  isDarkActive={isDarkActive}
                                />
                              )}
                              {activeTab.report.riskEngine && (
                                <RiskEnginePanel 
                                  data={activeTab.report.riskEngine}
                                  isDarkActive={isDarkActive}
                                />
                              )}
                           </div>
                           
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {activeTab.report.aiPrediction && (
                                <AIPredictionPanel 
                                   data={activeTab.report.aiPrediction}
                                   isDarkActive={isDarkActive}
                                />
                              )}
                              <InstitutionalSentiment 
                                 isDarkActive={isDarkActive} 
                                 asset={activeTab.coin} 
                              />
                           </div>

                           {activeTab.report.newsIntelligence && (
                              <NewsIntelligenceSystem 
                                 data={activeTab.report.newsIntelligence}
                                 isDarkActive={isDarkActive}
                              />
                           )}
                        </div>

                        {/* 2E. DETAILED ADVISORY CHAT MODULE */}
                        <section className={`p-6 rounded-2xl border ${
                          isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/10"
                        } flex flex-col gap-4 h-[440px]`}>
                          <SectionHeader icon={MessageSquare} title="V. Dedicated Dossier chat specialist" />
                          
                          <div className={`flex-1 overflow-y-auto rounded-xl p-4 flex flex-col gap-3.5 border ${
                            isDarkActive ? "bg-black/25 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
                          }`}>
                            {activeTab.chatMessages.map((msg) => (
                               <div key={msg.id} className={`flex flex-col max-w-[85%] ${
                                 msg.role === "user" ? "self-end items-end" : "self-start items-start"
                               }`}>
                                 <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                                   msg.role === "user" 
                                     ? (isDarkActive ? "bg-[#C9A96A] text-black font-semibold rounded-tr-none" : "bg-[#9C7B3E] text-white font-semibold rounded-tr-none") 
                                     : (isDarkActive 
                                         ? "bg-[#161B24] text-[#EDEAE3] border border-white/5 rounded-tl-none" 
                                         : "bg-white text-[#1A1A1F] border border-black/5 rounded-tl-none")
                                 }`}>
                                    {msg.content}
                                 </div>
                                 <span className="text-[8px] font-mono opacity-30 mt-0.5 px-0.5">{msg.timestamp}</span>
                               </div>
                            ))}
                          </div>

                          <div className="flex gap-2.5">
                            <input 
                              type="text" 
                              value={activeTab.chatInput}
                              onChange={(e) => onChatInputChange(activeIndex, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && onSendChat(activeIndex)}
                              placeholder={`Query Sizing ratios or entries about ${activeTab.coin.symbol}...`}
                              className={`flex-1 h-11 px-4 rounded-xl border text-xs transition-all outline-none ${
                                isDarkActive 
                                  ? "bg-black text-white border-white/10 focus:border-[#C9A96A]/60" 
                                  : "bg-white text-black border-black/10 focus:border-[#9C7B3E]/60"
                              }`}
                            />
                            <button 
                              onClick={() => onSendChat(activeIndex)}
                              disabled={!activeTab.chatInput.trim()}
                              className={`h-11 px-5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer ${
                                isDarkActive 
                                  ? "bg-[#C9A96A] text-black hover:bg-[#B08A4E]" 
                                  : "bg-[#9C7B3E] text-white hover:bg-[#7E602A]"
                              }`}
                            >
                              Execute
                            </button>
                          </div>
                        </section>

                     </div>
                  )
               )}
            </div>
         )
      )}
    </div>
  );
};
