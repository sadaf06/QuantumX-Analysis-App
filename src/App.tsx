import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, 
  RefreshCw, 
  Moon, 
  Sun, 
  Monitor, 
  Radio,
  Sliders,
  Briefcase,
  X
} from "lucide-react";
import { 
  CryptoAsset, 
  CoinIntelligenceReport, 
  MarketGlobalStats, 
  ChatMessage,
  UserProfile,
  Trade
} from "./types";
import { MarketDashboard } from "./components/MarketDashboard";
import { CoinDetail } from "./components/CoinDetail";
import { PortfolioCenter } from "./components/PortfolioCenter";
import { AnalysisTabCenter, AnalyzedCoinTab } from "./components/AnalysisTabCenter";
import { AiAssistantTab } from "./components/AiAssistantTab";
import { MessageSquare } from "lucide-react";

const INITIAL_PROFILE: UserProfile = {
  balance: 100000, // Starts with $100k
  holdings: {},
  history: []
};

export default function App() {
  // Theme Management
  const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
    const saved = localStorage.getItem("quantum_theme");
    return (saved as "dark" | "light" | "system") || "dark";
  });
  
  const [systemIsDark, setSystemIsDark] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(media.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const isDarkActive = theme === "dark" || (theme === "system" && systemIsDark);

  useEffect(() => {
    localStorage.setItem("quantum_theme", theme);
  }, [theme]);

  // Top-Level Tab States
  const [activeTopTab, setActiveTopTab] = useState<"TRADE" | "ANALYSIS" | "PORTFOLIO" | "CHAT">("TRADE");

  // Multi-coin Analysis Sub-Tabs States
  const [analysisTabs, setAnalysisTabs] = useState<AnalyzedCoinTab[]>([]);
  const [activeAnalysisIndex, setActiveAnalysisIndex] = useState<number>(-1);

  // Quick Action / Language Prompt States
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedModalAsset, setSelectedModalAsset] = useState<CryptoAsset | null>(null);
  const [showLangSelectionStep, setShowLangSelectionStep] = useState(false);
  const [selectedModalLang, setSelectedModalLang] = useState<"english" | "hinglish">("english");

  // Core App States (for Direct Trade view)
  const [currentView, setCurrentView] = useState<"DASHBOARD" | "DETAIL">("DASHBOARD");
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CryptoAsset[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Data States
  const [marketStats, setMarketStats] = useState<MarketGlobalStats | null>(null);
  const [activeAsset, setActiveAsset] = useState<CryptoAsset | null>(null);
  const [activeCoinReport, setActiveCoinReport] = useState<CoinIntelligenceReport | null>(null);
  
  // User Profile / Paper Trading
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("quantum_profile");
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("quantum_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Real-time synchronization for activeCoinReport price
  useEffect(() => {
    if (!activeCoinReport || currentView !== "DETAIL" || activeTopTab !== "TRADE") return;

    const priceSyncInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/coin/${activeCoinReport.asset.id}/price`);
        if (res.ok) {
          const data = await res.json();
          if (data.priceUsd !== activeCoinReport.asset.priceUsd) {
            setActiveCoinReport(prev => prev ? {
              ...prev,
              asset: {
                ...prev.asset,
                priceUsd: data.priceUsd,
                changePercent24Hr: data.changePercent24Hr
              }
            } : null);
          }
        }
      } catch (err) {
        // Silent error for background sync
      }
    }, 12000); // Sync every 12s

    return () => clearInterval(priceSyncInterval);
  }, [activeCoinReport?.asset.id, currentView, activeTopTab]);

  const handleTrade = (tradeData: Omit<Trade, "id" | "timestamp">) => {
    const trade: Trade = {
      ...tradeData,
      id: "t_" + Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };

    setUserProfile(prev => {
      const next = { ...prev };
      const cost = trade.amount * trade.priceAtTrade;
      
      if (trade.type === "BUY") {
        next.balance -= cost;
        const currentHolding = next.holdings[trade.symbol] || { amount: 0, averagePrice: 0 };
        const newAmount = currentHolding.amount + trade.amount;
        const newAvgPrice = ((currentHolding.amount * currentHolding.averagePrice) + cost) / newAmount;
        next.holdings[trade.symbol] = { amount: newAmount, averagePrice: newAvgPrice };
      } else {
        next.balance += cost;
        const currentHolding = next.holdings[trade.symbol] || { amount: 0, averagePrice: 0 };
        const newAmount = Math.max(0, currentHolding.amount - trade.amount);
        // Average price remains the same for sells in this simple FIFO/Avg model
        if (newAmount === 0) {
          delete next.holdings[trade.symbol];
        } else {
          next.holdings[trade.symbol] = { ...currentHolding, amount: newAmount };
        }
      }

      next.history = [trade, ...next.history].slice(0, 150);
      return next;
    });

    pushNotification(`Trade Executed: ${trade.type} ${trade.amount} ${trade.symbol} at $${trade.priceAtTrade.toLocaleString()}`);
  };

  // UI States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Terminal initialized: Securing real-time L1 cryptographic data pipelines.",
    "Order flow monitors online: Tracking whale transaction sweeps."
  ]);
  const [latency, setLatency] = useState(11);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  // Chat States (for legacy Direct Trade Detail view chat if report active)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome_init",
      role: "assistant",
      content: "Welcome to **Quantum Intelligence X Specialist Core**. This desk compiles elite technical target pricing, market structure trends, Quantum cyclic anniversary grids, and smart money behaviors.\n\nInput a specific inquiry regarding the selected asset or query general macro trends below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Periodic Refresh Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSinceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchGlobalMarketStats();

    const dataInterval = setInterval(() => {
      fetchGlobalMarketStats();
    }, 12000); // refresh raw stats every 12s to keep prices accurate

    const latencyInterval = setInterval(() => {
      setLatency(prev => Math.max(7, Math.min(18, prev + (Math.random() > 0.5 ? 1 : -1))));
      if (Math.random() > 0.8) {
        const randNotes = [
          "Whale Accumulation: Consolidated $24M spot into a dormant multi-signature contract.",
          "Vol compression detected: Bollinger bands contracting on standard hourly ranges.",
          "OTC volume alert: Bulk swap detected on sovereign institutional liquidity channel."
        ];
        pushNotification(randNotes[Math.floor(Math.random() * randNotes.length)]);
      }
    }, 10000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(latencyInterval);
    };
  }, []);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delaySearch = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      }
    }, 150);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const pushNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 4)]);
  };

  const fetchGlobalMarketStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/market");
      if (res.ok) {
        const stats = await res.json();
        setMarketStats(stats);
        setTimeSinceUpdate(0);
      }
    } catch (err) {
      console.error("Market stats error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Intercept the click on a coin to ask for options (Direct trading view vs Deep analysis)
  const handleSelectAsset = (asset: CryptoAsset) => {
    setSelectedModalAsset(asset);
    setShowLangSelectionStep(false);
    setSelectedModalLang("english");
    setShowSelectionModal(true);
  };

  const handleOpenDirectTrade = (asset: CryptoAsset) => {
    setActiveAsset(asset);
    setActiveCoinReport(null);
    setSelectedCoinId(asset.id);
    setCurrentView("DETAIL");
    setActiveTopTab("TRADE");
    setShowSelectionModal(false);
    pushNotification(`Established Direct Trade line for ${asset.symbol}.`);
  };

  // Launch analysis sub-tab under the Analysis Tab
  const handleLaunchAnalysis = async (asset: CryptoAsset, lang: "english" | "hinglish") => {
    setShowSelectionModal(false);
    setActiveTopTab("ANALYSIS");

    // Check if subtab for this coin and language already exists
    const existingIndex = analysisTabs.findIndex(t => t.coin.id === asset.id && t.lang === lang);
    if (existingIndex >= 0) {
      setActiveAnalysisIndex(existingIndex);
      return;
    }

    // Prepare new tab template
    const newTab: AnalyzedCoinTab = {
      coin: asset,
      lang,
      report: null,
      isAnalyzing: true,
      chatMessages: [
        {
          id: `welcome_${asset.id}_${Date.now()}`,
          role: "assistant",
          content: lang === "hinglish"
            ? `Namaste! **${asset.name} (${asset.symbol})** ka advanced quantitative scanning processing me hai... hum cyclical vectors detect kar rahe hain. Live chart price: **$${asset.priceUsd.toLocaleString()}**. Koi specific queries hon toh directly yaha pucho.`
            : `Welcome to the core specialist quantitative desk for **${asset.name} (${asset.symbol})** trading live at **$${asset.priceUsd.toLocaleString()}**. System diagnostics are active. Ask me about support barriers, squaring parameters, or volume block anomalies.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      chatInput: ""
    };

    const newTabsList = [...analysisTabs, newTab];
    const newIdx = newTabsList.length - 1;
    setAnalysisTabs(newTabsList);
    setActiveAnalysisIndex(newIdx);

    // Fetch deep report from server-side Gemini Core
    try {
      const res = await fetch(`/api/coin/${asset.id}?lang=${lang}`);
      if (res.ok) {
        const report = await res.json();
        setAnalysisTabs(prev => prev.map((t, idx) => idx === newIdx ? {
          ...t,
          report,
          isAnalyzing: false,
          chatMessages: [
            ...t.chatMessages,
            {
              id: `init_rep_${Date.now()}`,
              role: "assistant",
              content: lang === "hinglish"
                ? `**${asset.name}** deep cycle scanning parameters loaded successfully! Suggestion call: **${report.signal?.action}** (Probability: **${report.signal?.probabilityOfCall || "N/A"}**). Stop-loss limit specified at: **${report.signal?.executionMatrix?.stopLoss}**.`
                : `Analytical scan completed for **${asset.name} (${asset.symbol})**. Aegis directional signal issued: **${report.signal?.action}** (Win likelihood: **${report.signal?.probabilityOfCall || "N/A"}**). Matrix stop boundaries: **${report.signal?.executionMatrix?.stopLoss}**.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        } : t));
        pushNotification(`Analytical cycle resolved for ${asset.symbol} in ${lang.toUpperCase()}.`);
      } else {
        throw new Error("Pipeline returned non-OK status");
      }
    } catch (err) {
      console.error("Deep scan loading failed:", err);
      setAnalysisTabs(prev => prev.map((t, idx) => idx === newIdx ? {
        ...t,
        isAnalyzing: false,
        chatMessages: [
          ...t.chatMessages,
          {
            id: `err_rep_${Date.now()}`,
            role: "assistant",
            content: `Failed loading predictive cycles. Programmatic secondary calculations are actively stabilizing indicators on the terminal.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      } : t));
    }
  };

  const handleCloseAnalysisTab = (idxToClose: number) => {
    const updated = analysisTabs.filter((_, idx) => idx !== idxToClose);
    setAnalysisTabs(updated);
    if (activeAnalysisIndex === idxToClose) {
      setActiveAnalysisIndex(updated.length - 1);
    } else if (activeAnalysisIndex > idxToClose) {
      setActiveAnalysisIndex(activeAnalysisIndex - 1);
    }
  };

  const handleAnalysisChatInputChange = (tabIdx: number, val: string) => {
    setAnalysisTabs(prev => prev.map((t, idx) => idx === tabIdx ? { ...t, chatInput: val } : t));
  };

  const handleSendAnalysisChat = async (tabIdx: number) => {
    const tab = analysisTabs[tabIdx];
    if (!tab || !tab.chatInput.trim() || tab.isAnalyzing) return;

    const userMessage: ChatMessage = {
      id: "u_" + Math.random().toString(36).substring(7),
      role: "user",
      content: tab.chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update with user query and clean input
    setAnalysisTabs(prev => prev.map((t, idx) => idx === tabIdx ? {
      ...t,
      chatMessages: [...t.chatMessages, userMessage],
      chatInput: ""
    } : t));

    try {
      const response = await fetch("/api/chat-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...tab.chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
          targetCoin: tab.coin,
          lang: tab.lang
        })
      });

      if (response.ok) {
        const reply = await response.json();
        setAnalysisTabs(prev => prev.map((t, idx) => idx === tabIdx ? {
          ...t,
          chatMessages: [
            ...t.chatMessages,
            {
              id: reply.id,
              role: "assistant",
              content: reply.content,
              timestamp: new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        } : t));
      }
    } catch (err) {
      console.error("Analysis chat process error:", err);
    }
  };

  // Direct Detail Chat (for legacy direct trade chat)
  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMessage: ChatMessage = {
      id: "u_" + Math.random().toString(36).substring(7),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMessage]);
    const inputStr = chatInput;
    setChatInput("");
    setIsChatLoading(true);
    try {
      const response = await fetch("/api/chat-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
          targetCoin: activeCoinReport?.asset || null,
          lang: "english"
        })
      });
      if (response.ok) {
        const reply = await response.json();
        setChatMessages(prev => [
          ...prev,
          {
            id: reply.id,
            role: "assistant",
            content: reply.content,
            timestamp: new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error("Chat analyst error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen font-sans flex flex-col transition-colors duration-200 overflow-x-hidden ${
      isDarkActive ? "bg-[#03060A] text-[#E2E8F0]" : "bg-[#F3F6FA] text-[#0F172A]"
    }`}>
      {/* HEADER */}
      <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl ${
        isDarkActive ? "border-white/5 bg-[#03060A]/85" : "border-black/5 bg-[#F3F6FA]/85"
      }`}>
        <div className="flex items-center gap-3 md:gap-6">
          {currentView === "DETAIL" && activeTopTab === "TRADE" && (
            <button 
              onClick={() => setCurrentView("DASHBOARD")}
              className={`p-2 rounded-md transition-all flex items-center gap-2 text-[10px] font-black border tracking-wider cursor-pointer ${
                isDarkActive ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/10"
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              BACK TO TERMINAL
            </button>
          )}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer animate-in slide-in-from-left duration-500" onClick={() => {
            setCurrentView("DASHBOARD");
            setActiveTopTab("TRADE");
          }}>
            <div className="w-8 h-8 rounded-md bg-[#00D1FF] flex items-center justify-center font-black text-sm text-black">QX</div>
            <div className="flex flex-col">
               <span className="font-black tracking-tight text-xs md:text-sm leading-none">QUANTUM<span className="text-[#00D1FF]">X</span></span>
               <span className="text-[7px] tracking-[0.2em] font-medium leading-none mt-1 opacity-40 uppercase">Intelligence Terminal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={fetchGlobalMarketStats} className="hidden sm:flex items-center gap-2 p-2 rounded-md border border-white/10 text-[10px] font-mono cursor-pointer">
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-[#00D1FF]" : ""}`} />
            <span>SYNC: {timeSinceUpdate}S</span>
          </button>
          
          <div className={`flex items-center p-0.5 rounded-lg border ${isDarkActive ? "border-white/5 bg-white/5" : "border-black/5 bg-black/5"}`}>
            {[
              { id: "dark", icon: <Moon className="w-3 h-3" /> },
              { id: "light", icon: <Sun className="w-3 h-3" /> },
              { id: "system", icon: <Monitor className="w-3 h-3" /> }
            ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id as any)} className={`p-1.5 rounded-md transition-all cursor-pointer ${theme === t.id ? "bg-[#00D1FF] text-black" : "opacity-40"}`}>
                {t.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* TICKER */}
      <section className={`h-8 border-b flex items-center overflow-hidden text-[9px] font-mono tracking-widest uppercase ${
        isDarkActive ? "bg-[#050B12]/80 border-white/5" : "bg-[#EDF2F8]/80 border-black/5"
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
           {marketStats && (
              <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap no-scrollbar flex-1">
                 <span className="opacity-40">BTC: <span className="text-[#00FF85] font-bold">${marketStats.btcPrice.toLocaleString()}</span></span>
                 <span className="opacity-40">ETH: <span className="text-[#00D1FF] font-bold">${marketStats.ethPrice.toLocaleString()}</span></span>
                 <span className="opacity-40">DOM: <span className="text-white font-bold">{marketStats.btcDominance.toFixed(1)}%</span></span>
                 <span className="opacity-40">FNG: <span className="text-[#FFB800] font-bold">{marketStats.fearAndGreedIndex} {marketStats.fearAndGreedLabel}</span></span>
              </div>
           )}
           <div className="hidden sm:flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#00FF85] animate-pulse"></span>
              <span className="opacity-30">LATENCY: {latency}MS</span>
           </div>
        </div>
      </section>

      {/* WORKSPACE NAVIGATION BAR */}
      <section className={`w-full border-b backdrop-blur-md sticky top-[97px] z-40 transition-colors ${
        isDarkActive ? "bg-[#04080F]/90 border-white/5" : "bg-[#E6ECF4]/90 border-black/5"
      }`}>
         <div className="w-full max-w-7xl mx-auto px-2 md:px-6 py-2.5 flex items-center justify-start gap-1 overflow-x-auto no-scrollbar scroll-smooth snap-x">
            {[
               { id: "TRADE", label: "Direct Trade", count: undefined, icon: <Sliders className="w-3.5 h-3.5" /> },
               { id: "ANALYSIS", label: "Quantum Analysis", count: analysisTabs.length, icon: <Radio className="w-3.5 h-3.5" /> },
               { id: "PORTFOLIO", label: "Portfolio", count: undefined, icon: <Briefcase className="w-3.5 h-3.5" /> },
               { id: "CHAT", label: "Ai Assistant", count: undefined, icon: <MessageSquare className="w-3.5 h-3.5" /> }
            ].map((tab) => {
               const isActive = activeTopTab === tab.id;
               return (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTopTab(tab.id as any)}
                     className={`py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 snap-center ${
                        isActive 
                           ? "bg-[#00D1FF] text-black font-extrabold shadow-lg scale-105" 
                           : "opacity-50 hover:bg-white/5 hover:opacity-100"
                     }`}
                  >
                     {tab.icon}
                     <span className="whitespace-nowrap">{tab.label}</span>
                     {tab.count !== undefined && tab.count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black leading-none ${isActive ? "bg-black text-white" : "bg-[#00D1FF]/20 text-[#00D1FF]"}`}>
                           {tab.count}
                        </span>
                     )}
                  </button>
               );
            })}
         </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20">
         {activeTopTab === "TRADE" ? (
            currentView === "DASHBOARD" ? (
              <MarketDashboard 
                marketStats={marketStats}
                selectedCoinId={selectedCoinId}
                onSelectAsset={handleSelectAsset}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                isSearchFocused={isSearchFocused}
                setIsSearchFocused={setIsSearchFocused}
                notifications={notifications}
                isDarkActive={isDarkActive}
                timeSinceUpdate={timeSinceUpdate}
              />
            ) : (
              activeAsset && (
                <CoinDetail 
                   activeAsset={activeAsset}
                   report={activeCoinReport}
                   onDeepScan={() => {
                      setSelectedModalAsset(activeAsset);
                      setShowLangSelectionStep(true);
                      setShowSelectionModal(true);
                   }}
                   isAnalyzing={isAnalyzing}
                   chatMessages={chatMessages}
                   chatInput={chatInput}
                   setChatInput={setChatInput}
                   onSendChat={handleSendChat}
                   isChatLoading={isChatLoading}
                   isDarkActive={isDarkActive}
                   userProfile={userProfile}
                   onTrade={handleTrade}
                />
              )
            )
         ) : activeTopTab === "ANALYSIS" ? (
            <AnalysisTabCenter 
              tabs={analysisTabs}
              activeIndex={activeAnalysisIndex}
              onSelectTab={setActiveAnalysisIndex}
              onCloseTab={handleCloseAnalysisTab}
              onSendChat={handleSendAnalysisChat}
              onChatInputChange={handleAnalysisChatInputChange}
              isDarkActive={isDarkActive}
              onOpenTradeView={(asset) => {
                 setActiveAsset(asset);
                 setCurrentView("DETAIL");
                 setActiveTopTab("TRADE");
              }}
              allAssets={marketStats?.trending || []}
              onTriggerScanForAsset={(asset) => {
                 setSelectedModalAsset(asset);
                 setShowLangSelectionStep(true);
                 setShowSelectionModal(true);
              }}
            />
         ) : activeTopTab === "CHAT" ? (
            <AiAssistantTab isDarkActive={isDarkActive} />
         ) : (
            <PortfolioCenter 
              profile={userProfile}
              trendingAssets={marketStats?.trending || []}
              isDarkActive={isDarkActive}
            />
         )}
      </main>

      {/* DOCK SELECTION PROMPT MODAL */}
      {showSelectionModal && selectedModalAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 ${
            isDarkActive ? "bg-[#080E17] border-white/10 text-[#E2E8F0]" : "bg-white border-black/10 text-slate-800"
          }`}>
            <button 
              onClick={() => setShowSelectionModal(false)}
              className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-all rounded-full p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!showLangSelectionStep ? (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] opacity-40 uppercase block mb-1">Asset Operational Workspace</span>
                  <h3 className="text-lg font-black tracking-tight">{selectedModalAsset.name} ({selectedModalAsset.symbol})</h3>
                  <p className="text-xs opacity-60 leading-relaxed mt-1 font-sans">
                     Choose how you wish to load this asset on the specialist core panels.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Direct Trade view */}
                  <button
                    onClick={() => handleOpenDirectTrade(selectedModalAsset)}
                    className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      isDarkActive 
                        ? "bg-white/5 border-white/10 hover:border-[#00D1FF]/40 hover:bg-white/[0.08]" 
                        : "bg-black/[0.02] border-black/10 hover:border-[#0057FF]/40 hover:bg-black/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sliders className="w-4 h-4 text-[#00FF85]" />
                      <span className="font-sans font-black text-xs uppercase tracking-wider text-[#00FF85]">Direct Trade terminal</span>
                    </div>
                    <p className="text-[10px] opacity-60 leading-relaxed font-sans mt-1">
                       Immediate access to live historical charts, paper trades execution, and active asset balance ledger. Zero analysis compiling downtime.
                    </p>
                  </button>

                  {/* Quantitative Scan */}
                  <button
                    onClick={() => setShowLangSelectionStep(true)}
                    className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      isDarkActive 
                        ? "bg-white/5 border-white/10 hover:border-[#00D1FF]/40 hover:bg-white/[0.08]" 
                        : "bg-black/[0.02] border-black/10 hover:border-[#0057FF]/40 hover:bg-black/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="w-4 h-4 text-[#00D1FF] animate-pulse" />
                      <span className="font-sans font-black text-xs uppercase tracking-wider text-[#00D1FF]">Quantum deep scan analysis</span>
                    </div>
                    <p className="text-[10px] opacity-60 leading-relaxed font-sans mt-1">
                       Process multi-layer geometric calculations including Quantum square matrices, stop limits, and probability success call metrics.
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] opacity-40 uppercase block mb-1">Local Configuration</span>
                  <h3 className="text-lg font-black tracking-tight">Configure translation vector</h3>
                  <p className="text-xs opacity-60 leading-relaxed mt-1 font-sans">
                     The Aegis scan must assemble its reports in your preferred communication model.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* English Card */}
                  <div
                    onClick={() => setSelectedModalLang("english")}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer select-none ${
                      selectedModalLang === "english" 
                        ? (isDarkActive ? "bg-[#00D1FF]/10 border-[#00D1FF] text-[#00D1FF]" : "bg-[#0057FF]/10 border-[#0057FF] text-[#0057FF]")
                        : (isDarkActive ? "bg-white/5 border-white/5 opacity-55 hover:opacity-100" : "bg-black/[0.02] border-black/5 opacity-55 hover:opacity-100")
                    }`}
                  >
                    <span className="block font-black text-xs uppercase">English</span>
                    <span className="block text-[8px] opacity-50 font-bold uppercase tracking-wider mt-1 font-sans">Standard translation</span>
                  </div>

                  {/* Hinglish Card */}
                  <div
                    onClick={() => setSelectedModalLang("hinglish")}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer select-none ${
                      selectedModalLang === "hinglish" 
                        ? (isDarkActive ? "bg-[#00D1FF]/10 border-[#00D1FF] text-[#00D1FF]" : "bg-[#0057FF]/10 border-[#0057FF] text-[#0057FF]")
                        : (isDarkActive ? "bg-white/5 border-white/5 opacity-55 hover:opacity-100" : "bg-black/[0.02] border-[#0057FF] opacity-55 hover:opacity-100")
                    }`}
                  >
                    <span className="block font-black text-xs uppercase">Hinglish</span>
                    <span className="block text-[8px] opacity-50 font-bold uppercase tracking-wider mt-1 font-sans">Hinglish Translation</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => setShowLangSelectionStep(false)}
                    className={`flex-1 py-3 border rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all hover:bg-white/5 ${
                      isDarkActive ? "border-white/10 text-white" : "border-black/10 text-slate-700"
                    }`}
                  >
                     Back
                  </button>
                  <button
                    onClick={() => handleLaunchAnalysis(selectedModalAsset, selectedModalLang)}
                    className="flex-2 py-3 bg-[#00D1FF] hover:bg-[#00b2d8] text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-md cursor-pointer"
                  >
                     LAUNCH SCAN ENGINES
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
