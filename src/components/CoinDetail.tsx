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
  History
} from "lucide-react";
import { CryptoAsset, CoinIntelligenceReport, ChatMessage, UserProfile, Trade } from "../types";
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
  onTrade
}) => {
  const [activeTab, setActiveTab] = useState<"QUICK_TRADE" | "DEEP_SCAN" | "HISTORY">("QUICK_TRADE");
  const asset = activeAsset;
  const isUp = asset.changePercent24Hr >= 0;

  const SectionHeader = ({ icon: Icon, title, color = "text-[#00D1FF]" }: any) => (
    <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h2>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. OVERVIEW PLATE */}
      <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${
        isDarkActive ? "bg-[#080F1B] border-white/10 shadow-2xl" : "bg-white border-black/10 shadow-lg"
      }`}>
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Atom className="w-32 h-32 rotate-12" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00D1FF] to-[#0057FF] flex items-center justify-center font-black text-2xl text-black">
                {asset.symbol.slice(0, 3)}
             </div>
             <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-black tracking-tight">{asset.name}</h1>
                  <span className="text-sm uppercase font-extrabold tracking-widest bg-[#00D1FF]/10 px-3 py-1 rounded text-[#00D1FF] border border-[#00D1FF]/20">
                    {asset.symbol}
                  </span>
                  <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded opacity-50">
                    RANK #{asset.rank}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                   <span className="text-3xl font-mono font-black text-[#00FF85]">
                     ${asset.priceUsd.toLocaleString(undefined, { 
                       minimumFractionDigits: asset.priceUsd > 1 
                         ? (asset.priceUsd > 1000 ? 2 : 2) 
                         : 6 
                     })}
                   </span>
                   <span className={`px-2 py-1 rounded text-sm font-bold flex items-center gap-1 ${
                     isUp ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-[#FF3B69]/10 text-[#FF3B69]"
                   }`}>
                      {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {isUp ? "+" : ""}{asset.changePercent24Hr.toFixed(2)}%
                   </span>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs font-mono self-center">
             <div className="flex flex-col">
                <span className="opacity-40 font-bold uppercase tracking-tighter">MARKET CAP</span>
                <span className="font-black text-[#00D1FF]">${(asset.marketCapUsd / 1e9).toFixed(2)}B</span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold uppercase tracking-tighter">24H VOLUME</span>
                <span className="font-black text-[#00D1FF]">${(asset.volumeUsd24Hr / 1e6).toFixed(1)}M</span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold uppercase tracking-tighter">SUPPLY</span>
                <span className="font-black text-[#00D1FF]">{(asset.supply / 1e6).toFixed(1)}M</span>
             </div>
             <div className="flex flex-col">
                <span className="opacity-40 font-bold uppercase tracking-tighter">MAX LIMIT</span>
                <span className="font-black text-[#00D1FF]">{asset.maxSupply ? `${(asset.maxSupply / 1e6).toFixed(1)}M` : "∞"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* TABS MENU */}
      <div className={`p-1 flex items-center gap-1 rounded-xl border ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10"}`}>
         <button onClick={() => setActiveTab("QUICK_TRADE")} className={`flex-1 py-3 text-xs font-black tracking-widest uppercase transition-all rounded-lg ${activeTab === "QUICK_TRADE" ? (isDarkActive ? "bg-white/10 text-white" : "bg-black/10 text-black") : "opacity-50 hover:bg-white/5"}`}>
            QUICK TRADE
         </button>
         <button onClick={() => setActiveTab("DEEP_SCAN")} className={`flex-1 py-3 text-xs font-black tracking-widest uppercase transition-all rounded-lg flex items-center justify-center gap-2 ${activeTab === "DEEP_SCAN" ? "bg-[#00D1FF]/10 text-[#00D1FF]" : "opacity-50 hover:bg-white/5"}`}>
            {isAnalyzing && activeTab !== "DEEP_SCAN" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            DEEP SCAN 
         </button>
         <button onClick={() => setActiveTab("HISTORY")} className={`flex-1 py-3 text-xs font-black tracking-widest uppercase transition-all rounded-lg ${activeTab === "HISTORY" ? (isDarkActive ? "bg-white/10 text-white" : "bg-black/10 text-black") : "opacity-50 hover:bg-white/5"}`}>
            TRADE HISTORY
         </button>
      </div>

      {/* QUICK TRADE TAB */}
      {activeTab === "QUICK_TRADE" && (
        <div className="flex flex-col gap-6">
          <div className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
            <SectionHeader icon={Activity} title="PRICE ACTION HORIZON" />
            <CoinChart asset={asset} isDarkActive={isDarkActive} />
          </div>

          <PaperTrading 
            asset={asset}
            profile={userProfile}
            onTrade={onTrade}
            isDarkActive={isDarkActive}
          />
        </div>
      )}

      {/* DEEP SCAN TAB */}
      {activeTab === "DEEP_SCAN" && (
        <div className="flex flex-col gap-6">
          {!report ? (
             <div className={`p-12 rounded-2xl border flex flex-col items-center justify-center gap-6 text-center ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                <div className="w-24 h-24 rounded-full bg-[#00D1FF]/10 flex items-center justify-center">
                  <Scan className="w-12 h-12 text-[#00D1FF]" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl font-black tracking-widest text-[#00D1FF] mb-2 uppercase">Quantum Core Idle</h3>
                  <p className="opacity-60 text-sm leading-relaxed">
                    Initiate the Aegis Quant Engine to execute a deep forensic scan of {asset.name}. This will extract hidden structural math, mass psychological trapping zones, and absolute execution coordinates.
                  </p>
                </div>
                <button 
                  onClick={onDeepScan}
                  disabled={isAnalyzing}
                  className="mt-4 px-8 py-4 bg-[#00D1FF] hover:bg-[#00B4DB] text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isAnalyzing ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> SYNTHESIZING MATRIX</>
                  ) : (
                    <><Zap className="w-5 h-5" /> INITIATE DEEP SCAN</>
                  )}
                </button>
             </div>
          ) : (
            <>
              {/* === THE DEEP SCAN REPORTS BLOCKS === */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 2. PRICE ANALYSIS */}
                <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                  <SectionHeader icon={Activity} title="THE TIME & PRICE COORDINATES" />
                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/10">
                      <span className="font-bold opacity-50 uppercase tracking-wider text-[10px] mb-2">Quantum Vector Alignment</span>
                      <p className="font-mono text-sm leading-relaxed">{report.timeAndPrice?.quantumVectorAlignment}</p>
                    </div>
                    
                    <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/10">
                      <span className="font-bold opacity-50 uppercase tracking-wider text-[10px] mb-2">The Squaring Date (Next Pivot)</span>
                      <p className="font-mono text-sm leading-relaxed text-[#00FF85]">{report.timeAndPrice?.squaringDatePredict}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-bold opacity-30 uppercase mb-2 mt-2">Hidden Vibrational Nodes</h4>
                      <div className="flex flex-wrap gap-2">
                        {report.timeAndPrice?.hiddenVibrationalNodes?.map((n, i) => (
                          <span key={i} className="text-xs font-mono font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-1 rounded-md border border-[#00D1FF]/20">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <SquareOfNineMatrix 
                  currentPrice={asset.priceUsd} 
                  vibrationalNodes={report.timeAndPrice?.hiddenVibrationalNodes || []}
                  isDarkActive={isDarkActive}
                />

                {/* 3. MARKET STRUCTURE */}
                <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                  <SectionHeader icon={ShieldAlert} title="THE PSYCHOLOGICAL WARFARE" />
                  <div className="flex flex-col gap-5 text-sm">
                     <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-[#FF8A00] uppercase tracking-tighter">Crowd Mindset State</span>
                        <p className="opacity-90 leading-relaxed text-sm">{report.psychology?.crowdMindsetState}</p>
                     </div>
                     <div className="flex flex-col gap-2 p-4 bg-[#FF3B69]/5 rounded-xl border border-[#FF3B69]/20 relative overflow-hidden">
                        <ZapOff className="absolute -right-4 -top-4 w-24 h-24 text-[#FF3B69]/10 rotate-12" />
                        <span className="text-xs font-black text-[#FF3B69] uppercase tracking-widest flex items-center gap-2 relative z-10">
                          <AlertTriangle className="w-4 h-4" />
                          The Liquidity Trap Zone
                        </span>
                        <p className="opacity-90 leading-relaxed text-sm relative z-10 mt-1">
                          {report.psychology?.liquidityTrapZone}
                        </p>
                     </div>
                  </div>
                </section>

                <section className={`p-6 rounded-2xl border flex flex-col justify-between ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
                  <div>
                    <SectionHeader icon={Globe} title="GEOPOLITICAL COMPRESSION" />
                    <p className="text-sm opacity-90 leading-relaxed">
                      {report.geopolitics?.macroVolatilityImpact}
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-[#00D1FF]/10 rounded-xl border border-[#00D1FF]/20 relative">
                     <div className="absolute top-0 right-4 px-2 py-1 bg-[#00D1FF] text-black text-[8px] font-black tracking-widest uppercase rounded-b-md">
                       Classified
                     </div>
                     <span className="text-[10px] font-bold text-[#00D1FF] uppercase block mb-2 opacity-80">The Hidden Anomaly</span>
                     <p className="font-mono text-sm leading-relaxed text-white">
                       {report.anomaly?.hiddenAnomaly}
                     </p>
                  </div>
                </section>

                {/* 5. THE AEGIS SIGNAL */}
                <section className={`p-0 rounded-2xl border overflow-hidden relative ${isDarkActive ? "bg-black border-white/10" : "bg-white border-black/10"}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/5 to-transparent pointer-events-none" />
                  <div className="p-6 relative z-10 h-full flex flex-col justify-between">
                    <SectionHeader icon={Zap} title="THE AEGIS SIGNAL" />
                    
                    <div className="flex flex-col items-center justify-center py-6">
                       <span className={`text-3xl font-black uppercase tracking-widest text-[#00FF85] mb-2 px-6 py-2 rounded-xl border ${
                         report.signal?.action?.includes("BUY") || report.signal?.action?.includes("ACCUMULATION")
                           ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]"
                           : report.signal?.action?.includes("SELL")
                           ? "bg-[#FF3B69]/10 border-[#FF3B69]/30 text-[#FF3B69]"
                           : "bg-[#FFB800]/10 border-[#FFB800]/30 text-[#FFB800]"
                       }`}>
                         {report.signal?.action}
                       </span>
                       <p className="text-center text-xs opacity-70 mt-4 leading-relaxed max-w-[80%] mx-auto">
                         {report.signal?.strategicJustification}
                       </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 text-[10px] font-mono">
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                         <span className="opacity-40 uppercase font-black">AI Conviction Score</span>
                         <span className="font-bold text-sm text-[#00D1FF]">{report.signal?.probabilityOfCall}</span>
                       </div>
                    </div>
                  </div>
                </section>
                
                {/* 5.1 MULTI-TIER EXECUTION */}
                <div className="col-span-1 lg:col-span-2">
                   {report.signal?.plans && (
                     <ExecutionPlansPanel 
                       plans={report.signal.plans} 
                       isDarkActive={isDarkActive} 
                     />
                   )}
                </div>

                {/* 5.2 5-YEAR PROJECTION */}
                <div className="col-span-1 lg:col-span-2">
                   {report.signal?.fiveYearForecast && (
                     <FiveYearForecastPanel 
                       forecast={report.signal.fiveYearForecast} 
                       isDarkActive={isDarkActive} 
                     />
                   )}
                </div>
                
                {/* 10. CHAT ANALYST (QUANTUM / DEEP QUANT) */}
                <section className={`col-span-1 lg:col-span-2 p-6 rounded-2xl border ${isDarkActive ? "bg-[#080E16] border-white/10" : "bg-white border-black/10"} flex flex-col gap-6 h-[600px]`}>
                  <SectionHeader icon={MessageSquare} title="QUANTUM ANALYST DESK" />
                  
                  <div className={`flex-1 overflow-y-auto rounded-xl p-4 flex flex-col gap-4 ${isDarkActive ? "bg-black/50" : "bg-[#F3F6FA]"}`}>
                    {chatMessages.map((msgRef) => (
                      <div key={msgRef.id} className={`flex flex-col max-w-[85%] ${msgRef.role === "user" ? "self-end items-end" : "self-start items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                          msgRef.role === "user" 
                            ? "bg-[#00D1FF] text-black font-medium" 
                            : isDarkActive 
                              ? "bg-[#111A29] text-white border border-white/5" 
                              : "bg-white text-black border border-black/5"
                        }`}>
                           {msgRef.content}
                        </div>
                        <span className="text-[10px] font-mono opacity-40 mt-1 px-1">{msgRef.timestamp}</span>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="self-start px-4 py-3 rounded-2xl bg-[#111A29] border border-white/5 flex gap-2 items-center">
                         <RefreshCw className="w-4 h-4 animate-spin text-[#00D1FF]" />
                         <span className="text-xs font-mono opacity-50">COMPILING...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                      placeholder="Query specific entry nodes, macro timing cycles, or planetary resistance..."
                      className={`flex-1 h-12 px-4 rounded-xl border text-sm transition-all focus:border-[#00D1FF] outline-none ${
                        isDarkActive ? "bg-black text-white border-white/10" : "bg-white text-black border-black/10"
                      }`}
                    />
                    <button 
                      onClick={onSendChat}
                      disabled={isChatLoading || !chatInput.trim()}
                      className="h-12 px-6 bg-[#00D1FF] text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:bg-[#00b2d8] disabled:opacity-50"
                    >
                      EXECUTE
                    </button>
                  </div>
                </section>
              </div>

              {/* 11. QUANTUM PROJECTIONS (FULL FRAMEWORK) */}
              <div className="mt-6 flex flex-col gap-6">
                <QuantumProjections 
                  currentPrice={asset.priceUsd}
                  isDarkActive={isDarkActive}
                  symbol={asset.symbol}
                />
                
                {report.aiPrediction && (
                  <AIPredictionPanel 
                    data={report.aiPrediction}
                    isDarkActive={isDarkActive}
                  />
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {report.marketPsychology && (
                    <MarketPsychologyEngine 
                      data={report.marketPsychology}
                      isDarkActive={isDarkActive}
                    />
                  )}
                  {report.riskEngine && (
                    <RiskEnginePanel 
                      data={report.riskEngine}
                      isDarkActive={isDarkActive}
                    />
                  )}
                </div>
                
                {report.newsIntelligence && (
                  <NewsIntelligenceSystem 
                    data={report.newsIntelligence}
                    isDarkActive={isDarkActive}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "HISTORY" && (
        <div className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
          <SectionHeader icon={History} title="LOCAL TRADE HISTORY" color="text-[#FF8A00]" />
          <div className="flex flex-col gap-2">
            {userProfile.history.filter(t => t.assetId === asset.id).length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                 <History className="w-12 h-12 mb-4" />
                 <span className="text-sm font-bold uppercase tracking-widest">No paper trades executed for {asset.symbol}</span>
               </div>
            ) : (
               userProfile.history.filter(t => t.assetId === asset.id).sort((a,b) => b.timestamp - a.timestamp).map((trade) => (
                 <div key={trade.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                       trade.type === "BUY" ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-[#FF3B69]/10 text-[#FF3B69]"
                     }`}>
                       {trade.type.charAt(0)}
                     </div>
                     <div>
                       <span className="block font-bold text-sm tracking-wide">{trade.amount} {trade.symbol}</span>
                       <span className="text-xs font-mono opacity-50">{new Date(trade.timestamp).toLocaleString()}</span>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="block font-mono font-black text-sm">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     <span className="text-[10px] uppercase font-bold opacity-40">Entry Price</span>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};
