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
  DollarSign
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

  const SectionHeader = ({ icon: Icon, title, color = "text-[#00D1FF]" }: any) => (
    <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h2>
    </div>
  );

  const activeTab = tabs[activeIndex];

  return (
    <div className="grid grid-cols-1 gap-6 items-start animate-in fade-in duration-500">
      
      {/* 1. TABS HEADER BAR */}
      <div className={`p-1 flex flex-wrap gap-1 rounded-xl border items-center ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10"}`}>
         <div className="px-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-35 hidden sm:inline-block">Scanned Nodes:</div>
         
         {tabs.map((tab, idx) => (
            <div 
               key={`${tab.coin.id}_${tab.lang}`} 
               className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-tight cursor-pointer select-none group ${
                  idx === activeIndex 
                     ? (isDarkActive ? "bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20" : "bg-[#0057FF]/10 text-[#0057FF] border border-[#0057FF]/20")
                     : `opacity-50 hover:bg-white/5`
               }`}
               onClick={() => onSelectTab(idx)}
            >
               <span className="font-black bg-white/5 px-1 py-0.5 rounded text-[10px]">{tab.coin.symbol}</span>
               <span className="text-[10px] opacity-75">{tab.lang === "hinglish" ? "Hi" : "En"}</span>
               <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onCloseTab(idx);
                  }}
                  className="rounded-full p-0.5 bg-black/10 text-white/50 hover:bg-[#FF3B69]/20 hover:text-[#FF3B69] transition-all"
               >
                  <X className="w-3 h-3" />
               </button>
            </div>
         ))}

         {tabs.length === 0 && (
            <span className="px-3 py-2 text-xs font-semibold opacity-40 font-mono">NO ACTIVE MULTI-DECIMAL SECTIONS</span>
         )}
      </div>

      {/* 2. TAB VIEWPORT */}
      {tabs.length === 0 ? (
         <div className={`p-12 rounded-2xl border flex flex-col items-center justify-center gap-6 text-center ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
            <div className="w-20 h-20 rounded-full bg-[#00D1FF]/10 flex items-center justify-center">
              <Scan className="w-10 h-10 text-[#00D1FF] animate-pulse" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-black tracking-widest text-[#00D1FF] mb-2 uppercase">Analysis Engine Idle</h3>
              <p className="opacity-60 text-xs leading-relaxed mb-4">
                You have not initiated any localized scans. Select a cryptocurrency asset below or use the main **Trade Center** card to execute a dynamic, multi-dimensional cycle scan.
              </p>
              
              {/* Quick Launch Assets Selector */}
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed bg-black/10" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#FF8A00]">Fast Quantum Launchers</span>
                 <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                    {allAssets.slice(0, 6).map(asset => (
                       <button
                          key={asset.id}
                          onClick={() => onTriggerScanForAsset(asset)}
                          className="px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-tight uppercase hover:bg-[#00D1FF] hover:text-black hover:border-transparent transition-all"
                          style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
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
               
               {/* 2A. LOADERS BLOCK FOR COIN COMPILATION */}
               {activeTab.isAnalyzing ? (
                  <div className={`p-20 rounded-2xl border flex flex-col items-center justify-center gap-4 text-center ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                     <RefreshCw className="w-10 h-10 text-[#00D1FF] animate-spin" />
                     <div className="max-w-md">
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-40">Aegis Quant Matrix Pipeline</span>
                        <h3 className="text-sm font-black tracking-widest uppercase mt-1 mb-2">SYNTHESIS ACTIVE FOR {activeTab.coin.name}</h3>
                        <p className="opacity-50 text-[10px] leading-relaxed">
                           Performing 20-layer geometric calculations, fetching real-time on-chain dark pool coordinates, and structuring mathematical squaring vectors...
                        </p>
                     </div>
                  </div>
               ) : (
                  activeTab.report && (
                     <div className="flex flex-col gap-6">
                        
                        {/* 2B. COIN BRIEFING OVERVIEW */}
                        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center transition-all relative overflow-hidden gap-4 ${
                          isDarkActive ? "bg-[#080F1B] border-white/10 shadow-2xl" : "bg-white border-black/10 shadow-lg"
                        }`}>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00D1FF] to-[#0057FF] flex items-center justify-center font-black text-xs text-black uppercase">
                                 {activeTab.coin.symbol.slice(0, 3)}
                              </div>
                              <div>
                                 <h2 className="text-xl font-black tracking-tight">{activeTab.coin.name} <span className="text-xs uppercase px-2 py-0.5 rounded bg-white/5 text-[#00D1FF] ml-1 font-bold">{activeTab.coin.symbol}</span></h2>
                                 <span className="text-[10px] font-mono opacity-50 block mt-1 uppercase">Live feed target price: <span className="text-[#00FF85] font-black">${activeTab.coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                              </div>
                           </div>

                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-35">MATRIX SETTING: {activeTab.lang.toUpperCase()}</span>
                              <button 
                                 onClick={() => onOpenTradeView(activeTab.coin)}
                                 className="px-4 py-2 bg-[#00D1FF]/10 hover:bg-[#00D1FF] hover:text-black text-[#00D1FF] border border-[#00D1FF]/20 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 uppercase"
                              >
                                 Open trading chart <ArrowRight className="w-3 h-3" />
                              </button>
                           </div>
                        </div>

                        {/* 2C. THE AEGIS SIGNAL AND SUGGESTION (BUY/SELL AND PROBABILITY) */}
                        <section className={`p-0 rounded-2xl border overflow-hidden relative ${isDarkActive ? "bg-black border-white/10" : "bg-white border-black/10"}`}>
                           <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/5 to-transparent pointer-events-none" />
                           <div className="p-6 relative z-10 h-full flex flex-col justify-between">
                             <SectionHeader icon={Zap} title="THE AEGIS CORE DIRECTIONAL INDICATOR" />
                             
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                {/* Buy/Sell Action Panel */}
                                <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-6">
                                   <span className="text-[9px] font-black uppercase opacity-35 tracking-[0.2em] mb-3">AI CORE RECOMMENDATION</span>
                                   <span className={`text-2xl font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border block text-center ${
                                     activeTab.report.signal?.action?.includes("BUY") || activeTab.report.signal?.action?.includes("ACCUMULATION")
                                       ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]"
                                       : activeTab.report.signal?.action?.includes("SELL")
                                       ? "bg-[#FF3B69]/10 border-[#FF3B69]/30 text-[#FF3B69]"
                                       : "bg-[#FFB800]/10 border-[#FFB800]/30 text-[#FFB800]"
                                   }`}>
                                     {activeTab.report.signal?.action}
                                   </span>
                                </div>

                                {/* Probability Call Panel */}
                                <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:px-6">
                                   <span className="text-[9px] font-black uppercase opacity-35 tracking-[0.2em] mb-2">PROBABILITY OF SUCCESS CALL</span>
                                   <div className={`text-2xl font-black font-mono tracking-tight flex items-center gap-1.5 ${
                                      activeTab.report.signal?.action?.includes("BUY") || activeTab.report.signal?.action?.includes("ACCUMULATION")
                                        ? "text-[#00FF85]"
                                        : "text-[#00D1FF]"
                                   }`}>
                                      <TrendingUp className="w-5 h-5 opacity-70" />
                                      {activeTab.report.signal?.probabilityOfCall || "83.4% (Harmonic High)"}
                                   </div>
                                   <span className="text-[9px] opacity-40 font-bold uppercase tracking-wider mt-1 text-center font-sans">
                                      Combined Angle Cycle Concordance
                                   </span>
                                </div>

                                {/* Justification */}
                                <div className="lg:col-span-4 flex flex-col justify-center">
                                   <span className="text-[9px] font-black uppercase opacity-35 tracking-[0.2em] mb-1.5 block">STRATEGIC JUSTIFICATION</span>
                                   <p className="text-xs opacity-75 leading-relaxed font-sans">
                                      {activeTab.report.signal?.strategicJustification}
                                   </p>
                                </div>
                             </div>
                             
                             <div className="flex flex-col gap-2 mt-4 text-[10px] font-mono">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                  <span className="opacity-40 uppercase font-black">AI Conviction Score</span>
                                  <span className="font-bold text-sm text-[#00D1FF]">{activeTab.report.signal?.probabilityOfCall}</span>
                                </div>
                             </div>
                           </div>
                        </section>

                        {/* HIGH VISIBILITY PROJECTIONS & PLANS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {/* 5-Year Projection */}
                           <div className="w-full h-full">
                              {activeTab.report.signal?.fiveYearForecast && (
                                 <FiveYearForecastPanel 
                                    forecast={activeTab.report.signal.fiveYearForecast} 
                                    isDarkActive={isDarkActive} 
                                 />
                              )}
                           </div>

                           {/* Multi-Tier Execution */}
                           <div className="w-full h-full">
                              {activeTab.report.signal?.plans && (
                                 <ExecutionPlansPanel 
                                    plans={activeTab.report.signal.plans} 
                                    isDarkActive={isDarkActive} 
                                 />
                              )}
                           </div>
                        </div>

                        {/* AI PREDICTIONS & INSTITUTIONAL SENTIMENT */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {activeTab.report.aiPrediction && (
                             <AIPredictionPanel 
                                data={activeTab.report.aiPrediction}
                                isDarkActive={isDarkActive}
                             />
                           )}
                           
                           <InstitutionalSentiment 
                              isDarkActive={isDarkActive} 
                              symbol={activeTab.coin.symbol} 
                           />
                        </div>

                        {/* 2D. GEOMETRIC MODEL & DETAILED BLOCKS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           
                           {/* Price Vectors Alignment */}
                           <section className={`p-6 rounded-2xl border flex flex-col h-full ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                             <div>
                                <SectionHeader icon={Activity} title="THE TIME & PRICE COORDINATES" />
                                <div className="flex flex-col gap-4 text-xs">
                                  <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/10">
                                    <span className="font-bold opacity-50 uppercase tracking-wider text-[8px] mb-2 text-[#00D1FF]">Quantum Vector Alignment</span>
                                    <p className="font-mono text-xs leading-relaxed opacity-95">{activeTab.report.timeAndPrice?.quantumVectorAlignment}</p>
                                  </div>
                                  
                                  <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/10">
                                    <span className="font-bold opacity-50 uppercase tracking-wider text-[8px] mb-2 text-[#00FF85]">The Squaring Date (Next Pivot)</span>
                                    <p className="font-mono text-xs leading-relaxed text-[#00FF85] font-black">{activeTab.report.timeAndPrice?.squaringDatePredict}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-[8px] font-bold opacity-30 uppercase mb-2 mt-2">Hidden Vibrational Nodes</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {activeTab.report.timeAndPrice?.hiddenVibrationalNodes?.map((n, i) => (
                                        <span key={i} className="text-[10px] font-mono font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-1 rounded-md border border-[#00D1FF]/20">
                                          {n}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                             </div>
                           </section>

                           {/* Quantum Matrix Visual Core */}
                           <SquareOfNineMatrix 
                             currentPrice={activeTab.coin.priceUsd} 
                             vibrationalNodes={activeTab.report.timeAndPrice?.hiddenVibrationalNodes || []}
                             isDarkActive={isDarkActive}
                             lang={activeTab.lang}
                             symbol={activeTab.coin.symbol}
                           />
                        </div>

                        {/* Quantum Framework Overview */}
                        <div className="mt-2 flex flex-col gap-6">
                           <QuantumProjections 
                             currentPrice={activeTab.coin.priceUsd} 
                             isDarkActive={isDarkActive} 
                             symbol={activeTab.coin.symbol} 
                           />
                           
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             {/* Psychological Trapping */}
                             <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                               <SectionHeader icon={ShieldAlert} title="THE PSYCHOLOGICAL WARFARE" />
                               <div className="flex flex-col gap-5 text-xs">
                                  <div className="flex flex-col gap-1.5">
                                     <span className="text-[8px] font-bold text-[#FF8A00] uppercase tracking-wider">Crowd Mindset State</span>
                                     <p className="opacity-95 leading-relaxed text-xs">{activeTab.report.psychology?.crowdMindsetState}</p>
                                  </div>
                                  <div className="flex flex-col gap-2 p-4 bg-[#FF3B69]/5 rounded-xl border border-[#FF3B69]/20 relative overflow-hidden">
                                     <ZapOff className="absolute -right-4 -top-4 w-20 h-20 text-[#FF3B69]/10 rotate-12" />
                                     <span className="text-[9px] font-black text-[#FF3B69] uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                                       <AlertTriangle className="w-3.5 h-3.5" />
                                       The Liquidity Trap Zone
                                     </span>
                                     <p className="opacity-95 leading-relaxed text-xs relative z-10 mt-1">
                                       {activeTab.report.psychology?.liquidityTrapZone}
                                     </p>
                                  </div>
                               </div>
                             </section>

                             {/* Geopolitical Compression */}
                             <section className={`p-6 rounded-2xl border flex flex-col justify-between ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                               <div>
                                 <SectionHeader icon={Globe} title="GEOPOLITICAL COMPRESSION" />
                                 <p className="text-xs opacity-95 leading-relaxed">
                                   {activeTab.report.geopolitics?.macroVolatilityImpact}
                                 </p>
                               </div>
                               <div className="mt-5 p-4 bg-[#00D1FF]/10 rounded-xl border border-[#00D1FF]/20 relative">
                                  <div className="absolute top-0 right-4 px-2 py-0.5 bg-[#00D1FF] text-black text-[8px] font-black tracking-widest uppercase rounded-b-sm">
                                    Classified
                                  </div>
                                  <span className="text-[9px] font-bold text-[#00D1FF] uppercase block mb-1 opacity-80 font-sans">The Hidden Anomaly</span>
                                  <p className="font-mono text-xs leading-relaxed text-white">
                                    {activeTab.report.anomaly?.hiddenAnomaly}
                                  </p>
                               </div>
                             </section>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                           
                           {activeTab.report.newsIntelligence && (
                             <NewsIntelligenceSystem 
                                data={activeTab.report.newsIntelligence}
                                isDarkActive={isDarkActive}
                             />
                           )}
                        </div>
                     </div>
                  )
               )}
            </div>
         )
      )}
    </div>
  );
};
