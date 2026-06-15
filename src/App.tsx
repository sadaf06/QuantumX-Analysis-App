import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ChevronRight, 
  RefreshCw, 
  Moon, 
  Sun, 
  Monitor, 
  Radio, 
  Sliders, 
  Briefcase, 
  X, 
  MessageSquare, 
  Search, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Lock, 
  Compass, 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  Activity, 
  Layers, 
  Keyboard, 
  ArrowUpRight, 
  User, 
  ArrowDownRight, 
  Menu,
  Check,
  Copy,
  Plus,
  Trash2,
  Edit,
  MessageSquareCode,
  Paperclip,
  Image
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
import { TypewriterText } from "./components/TypewriterText";
import Markdown from "react-markdown";

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

  // Top-Level Tab States (Remapped for Left Sidebar directories)
  const [activeTopTab, setActiveTopTab] = useState<"TRADE" | "ANALYSIS" | "PORTFOLIO" | "CHAT">(() => {
    return (localStorage.getItem("quantum_active_top_tab") as any) || "TRADE";
  });

  // Multi-coin Analysis Sub-Tabs States
  const [analysisTabs, setAnalysisTabs] = useState<AnalyzedCoinTab[]>(() => {
    const saved = localStorage.getItem("quantum_analysis_tabs");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeAnalysisIndex, setActiveAnalysisIndex] = useState<number>(() => {
    const saved = localStorage.getItem("quantum_active_analysis_index");
    return saved ? JSON.parse(saved) : -1;
  });

  useEffect(() => {
    localStorage.setItem("quantum_active_top_tab", activeTopTab);
  }, [activeTopTab]);

  useEffect(() => {
    localStorage.setItem("quantum_analysis_tabs", JSON.stringify(analysisTabs));
  }, [analysisTabs]);

  useEffect(() => {
    localStorage.setItem("quantum_active_analysis_index", JSON.stringify(activeAnalysisIndex));
  }, [activeAnalysisIndex]);

  // Command Bar & Custom Navigation parameters
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCopilotPulsing, setIsCopilotPulsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsCopilotPulsing(false), 5000);
    return () => clearTimeout(timer);
  }, []);


  // Quick Action / Language Selection Modal States
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedModalAsset, setSelectedModalAsset] = useState<CryptoAsset | null>(null);
  const [showLangSelectionStep, setShowLangSelectionStep] = useState(false);
  const [selectedModalLang, setSelectedModalLang] = useState<"english" | "hinglish">("english");

  // Core App States (for Direct Trade view)
  const [currentView, setCurrentView] = useState<"DASHBOARD" | "DETAIL">(() => {
    return (localStorage.getItem("quantum_current_view") as any) || "DASHBOARD";
  });
  const [selectedCoinId, setSelectedCoinId] = useState<string>(() => {
    return localStorage.getItem("quantum_selected_coin_id") || "bitcoin";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CryptoAsset[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Data States
  const [marketStats, setMarketStats] = useState<MarketGlobalStats | null>(null);
  const [activeAsset, setActiveAsset] = useState<CryptoAsset | null>(() => {
    const saved = localStorage.getItem("quantum_active_asset");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeCoinReport, setActiveCoinReport] = useState<CoinIntelligenceReport | null>(null);
  
  // User Profile / Paper Trading
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("quantum_profile");
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("quantum_current_view", currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("quantum_selected_coin_id", selectedCoinId);
  }, [selectedCoinId]);

  useEffect(() => {
    if (activeAsset) {
      localStorage.setItem("quantum_active_asset", JSON.stringify(activeAsset));
    } else {
      localStorage.removeItem("quantum_active_asset");
    }
  }, [activeAsset]);

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

  // Copilot Sessions configuration for multi-chat support
  interface CopilotSession {
    id: string;
    name: string;
    messages: ChatMessage[];
  }

  const [copilotSessions, setCopilotSessions] = useState<CopilotSession[]>(() => {
    const saved = localStorage.getItem("quantum_copilot_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: any) => ({
            ...s,
            messages: (s.messages || []).map((m: any) => ({ ...m, isNew: false }))
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "general_default",
        name: "General Companion Core",
        messages: [
          {
            id: "copilot_init",
            role: "assistant" as const,
            content: "I am your persistent **Aegis AI Copilot**. I analyze risk vectors, beta exposures, and cyclical squared resistance milestones.\n\nUse quick prompts below or ask anything about our portfolio.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNew: false
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem("quantum_copilot_active_session_id") || "general_default";
  });

  // Persist sessions and active session
  useEffect(() => {
    localStorage.setItem("quantum_copilot_sessions", JSON.stringify(copilotSessions));
  }, [copilotSessions]);

  useEffect(() => {
    localStorage.setItem("quantum_copilot_active_session_id", activeSessionId);
  }, [activeSessionId]);

  // Retrieve active session's messages
  const copilotGlobalMessages = useMemo(() => {
    const active = copilotSessions.find(s => s.id === activeSessionId);
    return active ? active.messages : [];
  }, [copilotSessions, activeSessionId]);

  // Set messages for active session helper
  const setCopilotGlobalMessages = (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setCopilotSessions(prev => 
      prev.map(s => {
        if (s.id === activeSessionId) {
          const updated = typeof updater === 'function' ? updater(s.messages) : updater;
          return { ...s, messages: updated };
        }
        return s;
      })
    );
  };

  // Coin Detail persistent chat history mapping
  const [coinDetailChats, setCoinDetailChats] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem("quantum_coin_detail_chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleaned: Record<string, ChatMessage[]> = {};
        for (const coinId in parsed) {
          cleaned[coinId] = (parsed[coinId] || []).map((m: any) => ({ ...m, isNew: false }));
        }
        return cleaned;
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("quantum_coin_detail_chats", JSON.stringify(coinDetailChats));
  }, [coinDetailChats]);

  // Clear isNew flag to stop recursive animations across any chat tab
  const handleClearCopilotMessageIsNew = (msgId: string) => {
    // 1. Clear general copilot sessions
    setCopilotSessions(prev =>
      prev.map(s => ({
        ...s,
        messages: s.messages.map(m => m.id === msgId ? { ...m, isNew: false } : m)
      }))
    );

    // 2. Clear detail page chats
    setCoinDetailChats(prev => {
      const keys = Object.keys(prev);
      const updated: Record<string, ChatMessage[]> = {};
      for (const key of keys) {
        updated[key] = prev[key].map(m => m.id === msgId ? { ...m, isNew: false } : m);
      }
      return updated;
    });

    // 3. Clear analysis sub-tabs
    setAnalysisTabs(prev =>
      prev.map(t => ({
        ...t,
        chatMessages: t.chatMessages.map(m => m.id === msgId ? { ...m, isNew: false } : m)
      }))
    );
  };

  // Multi-step progressive search phases exactly like the first video loading animation
  const [copilotSearchQuery, setCopilotSearchQuery] = useState<string | null>(null);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState<number>(0);
  const loadingPhases = [
    "Initializing cognitive neural linkages...",
    "Scanning structural orderbooks & dark pools...",
    "Triggering predictive cycle squaring algorithms...",
    "Formulating strategic AI intelligence dispatch..."
  ];

  const [copilotAttachment, setCopilotAttachment] = useState<{
    name: string;
    type: string;
    data: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        pushNotification("Error: File size must be less than 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCopilotAttachment({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });
        pushNotification(`Attached: ${file.name}`);
      };
      reader.onerror = () => {
        pushNotification("Error reading attachment file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        pushNotification("Error: File size must be less than 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCopilotAttachment({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });
        pushNotification(`Attached via drop: ${file.name}`);
      };
      reader.onerror = () => {
        pushNotification("Error reading dropped attachment file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const [copilotInput, setCopilotInput] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copiedCopilotId, setCopiedCopilotId] = useState<string | null>(null);

  const handleCopyCopilotMsg = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCopilotId(msgId);
    setTimeout(() => setCopiedCopilotId(null), 2000);
  };

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
    }, 12000);

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

  // Keyboard shortcut listener for Universal Command Bar ("/")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowCommandBar(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [commandResults, setCommandResults] = useState<CryptoAsset[]>([]);

  useEffect(() => {
    if (!commandQuery.trim()) {
      setCommandResults([]);
      return;
    }
    const delaySearch = setTimeout(async () => {
      try {
        const query = commandQuery.toLowerCase();
        // If it starts with a '/' we shouldn't search api for matching coins, just commands
        if (query.startsWith("/")) {
          setCommandResults([]);
          return;
        }
        
        let searchString = query;
        if (query.startsWith("scan ")) {
          searchString = query.replace("scan ", "");
        }
        
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchString)}`);
        if (res.ok) {
          const data = await res.json();
          // Keep to a max of 20 results in the command palette
          setCommandResults(data.slice(0, 20));
        }
      } catch (err) {}
    }, 150);
    return () => clearTimeout(delaySearch);
  }, [commandQuery]);

  // Dynamic calculations for Profile Net Asset Value (NAV)
  const livePrices = useMemo(() => {
    const map: { [symbol: string]: number } = {};
    if (marketStats) {
      marketStats.trending.forEach(a => {
        map[a.symbol.toUpperCase()] = a.priceUsd;
      });
    }
    return map;
  }, [marketStats]);

  const profileNav = useMemo(() => {
    let cryptoValueSum = 0;
    Object.entries(userProfile.holdings).forEach(([symbol, rawHolding]) => {
      const holding = rawHolding as { amount: number; averagePrice: number };
      const livePrice = livePrices[symbol.toUpperCase()] || holding.averagePrice;
      cryptoValueSum += holding.amount * livePrice;
    });
    return userProfile.balance + cryptoValueSum;
  }, [userProfile.holdings, userProfile.balance, livePrices]);

  // Search logic for standard search fields
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

  const handleLaunchAnalysis = async (asset: CryptoAsset, lang: "english" | "binglish" | "hinglish") => {
    setShowSelectionModal(false);
    setActiveTopTab("ANALYSIS");

    const l = lang === "hinglish" ? "hinglish" : "english";
    const existingIndex = analysisTabs.findIndex(t => t.coin.id === asset.id && t.lang === l);
    if (existingIndex >= 0) {
      setActiveAnalysisIndex(existingIndex);
      return;
    }

    const newTab: AnalyzedCoinTab = {
      coin: asset,
      lang: l,
      report: null,
      isAnalyzing: true,
      chatMessages: [
        {
          id: `welcome_${asset.id}_${Date.now()}`,
          role: "assistant",
          content: l === "hinglish"
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

    try {
      const res = await fetch(`/api/coin/${asset.id}?lang=${l}`);
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
              content: l === "hinglish"
                ? `**${asset.name}** deep cycle scanning parameters loaded successfully! Suggestion call: **${report.signal?.action}** (Probability: **${report.signal?.probabilityOfCall || "N/A"}**). Stop-loss limit specified at: **${report.signal?.plans?.shortTerm?.stopLoss || "N/A"}**.`
                : `Analytical scan completed for **${asset.name} (${asset.symbol})**. Aegis directional signal issued: **${report.signal?.action}** (Win likelihood: **${report.signal?.probabilityOfCall || "N/A"}**). Matrix stop boundaries: **${report.signal?.plans?.shortTerm?.stopLoss || "N/A"}**.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        } : t));
        pushNotification(`Analytical cycle resolved for ${asset.symbol} in ${l.toUpperCase()}.`);
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

  // Direct Detail Chat (for legacy direct trade chat mapped per asset)
  const chatMessages = useMemo(() => {
    if (!activeAsset) return [];
    return coinDetailChats[activeAsset.id] || [
      {
        id: "welcome_init_" + activeAsset.id,
        role: "assistant" as const,
        content: `Welcome to **Quantum Intelligence ${activeAsset.symbol} Specialist Core**. This desk compiles elite technical target pricing, market structure trends, Quantum cyclic anniversary grids, and smart money behaviors.\n\nInput a specific inquiry regarding ${activeAsset.name} or general macro trends.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: false
      }
    ];
  }, [coinDetailChats, activeAsset]);

  const updateActiveAssetChatMessages = (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    if (!activeAsset) return;
    setCoinDetailChats(prev => {
      const existing = prev[activeAsset.id] || [
        {
          id: "welcome_init_" + activeAsset.id,
          role: "assistant" as const,
          content: `Welcome to **Quantum Intelligence ${activeAsset.symbol} Specialist Core**. This desk compiles elite technical target pricing, market structure trends, Quantum cyclic anniversary grids, and smart money behaviors.\n\nInput a specific inquiry regarding ${activeAsset.name} or general macro trends.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: false
        }
      ];
      const updated = typeof updater === 'function' ? updater(existing) : updater;
      return {
        ...prev,
        [activeAsset.id]: updated
      };
    });
  };

  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading || !activeAsset) return;
    const userMessage: ChatMessage = {
      id: "u_" + Math.random().toString(36).substring(7),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateActiveAssetChatMessages(prev => [...prev, userMessage]);
    const inputStr = chatInput;
    setChatInput("");
    setIsChatLoading(true);
    try {
      const response = await fetch("/api/chat-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
          targetCoin: activeCoinReport?.asset || activeAsset,
          lang: "english"
        })
      });
      if (response.ok) {
        const reply = await response.json();
        updateActiveAssetChatMessages(prev => [
          ...prev,
          {
            id: reply.id,
            role: "assistant",
            content: reply.content,
            timestamp: new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNew: true
          }
        ]);
      }
    } catch (err) {
      console.error("Chat analyst error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Multi-chat companion session state managers
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionName, setEditingSessionName] = useState("");

  const handleCreateCopilotSession = () => {
    const newId = "session_" + Date.now();
    const count = copilotSessions.filter(s => s.id.startsWith("session_") || s.id === "general_default").length + 1;
    const newSession: CopilotSession = {
      id: newId,
      name: `Conversation Arc #${count}`,
      messages: [
        {
          id: "copilot_init_" + newId,
          role: "assistant",
          content: "I have initialized a new specialized **Aegis AI Chat Session** for your portfolio. What asset or risk vector shall we deep scan?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: false
        }
      ]
    };
    setCopilotSessions(prev => [...prev, newSession]);
    setActiveSessionId(newId);
  };

  const handleDeleteCopilotSession = (sessionId: string) => {
    if (copilotSessions.length <= 1) return;
    const remaining = copilotSessions.filter(s => s.id !== sessionId);
    setCopilotSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleRenameCopilotSession = (sessionId: string, newName: string) => {
    if (!newName.trim()) return;
    setCopilotSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, name: newName.trim() } : s)
    );
  };

  // Persisted general Aegis Copilot chat operation - everywhere on the right
  const handleSendCopilot = async (customPrompt?: string) => {
    const txt = (customPrompt || copilotInput).trim();
    if (!txt && !copilotAttachment) return;
    if (isCopilotLoading) return;

    // Route query safely to active tabs and specialist assistants if detailed or scanned reports views
    const isDetailView = activeTopTab === "TRADE" && currentView === "DETAIL";
    const isReportsView = activeTopTab === "ANALYSIS" && activeAnalysisIndex >= 0;

    const attachmentPayload = copilotAttachment ? {
      name: copilotAttachment.name,
      type: copilotAttachment.type,
      data: copilotAttachment.data
    } : undefined;

    if (isDetailView && activeAsset) {
      // Directs to activeCoinReport's direct trade chat helper!
      setChatInput(txt);
      const userMsg: ChatMessage = {
        id: "u_c_" + Date.now(),
        role: "user",
        content: txt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: attachmentPayload
      };
      updateActiveAssetChatMessages(prev => [...prev, userMsg]);
      setIsCopilotLoading(true);
      setCopilotInput("");
      setCopilotAttachment(null);
      
      try {
        const response = await fetch("/api/chat-analyst", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatMessages, userMsg].map(m => ({ 
              role: m.role, 
              content: m.content,
              attachment: m.attachment
            })),
            targetCoin: activeAsset,
            lang: "english"
          })
        });
        if (response.ok) {
          const reply = await response.json();
          updateActiveAssetChatMessages(prev => [
            ...prev,
            {
              id: reply.id,
              role: "assistant",
              content: reply.content,
              timestamp: new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isNew: true
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCopilotLoading(false);
      }
      return;
    }

    if (isReportsView) {
      // Directs to the active research reports dossier chat tab!
      handleAnalysisChatInputChange(activeAnalysisIndex, txt);
      const activeTabObj = analysisTabs[activeAnalysisIndex];
      const userMsg: ChatMessage = {
        id: "u_c_r_" + Date.now(),
        role: "user",
        content: txt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: attachmentPayload
      };
      
      setAnalysisTabs(prev => prev.map((t, i) => i === activeAnalysisIndex ? {
        ...t,
        chatMessages: [...t.chatMessages, userMsg],
        chatInput: ""
      } : t));
      setIsCopilotLoading(true);
      setCopilotInput("");
      setCopilotAttachment(null);

      try {
        const response = await fetch("/api/chat-analyst", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...activeTabObj.chatMessages, userMsg].map(m => ({ 
              role: m.role, 
              content: m.content,
              attachment: m.attachment
            })),
            targetCoin: activeTabObj.coin,
            lang: activeTabObj.lang
          })
        });
        if (response.ok) {
          const reply = await response.json();
          setAnalysisTabs(prev => prev.map((t, idx) => idx === activeAnalysisIndex ? {
            ...t,
            chatMessages: [
              ...t.chatMessages,
              {
                id: reply.id,
                role: "assistant",
                content: reply.content,
                timestamp: new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isNew: true
              }
            ]
          } : t));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCopilotLoading(false);
      }
      return;
    }

    // Default to general companion advisor:
    const userMsg: ChatMessage = {
      id: "u_g_" + Date.now(),
      role: 'user',
      content: txt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachmentPayload
    };

    setCopilotGlobalMessages(prev => [...prev, userMsg]);
    setCopilotInput("");
    setCopilotAttachment(null);
    setIsCopilotLoading(true);

    // Progressive search loading phase indicator mimicking first video
    setCopilotSearchQuery(txt || "Attached document scanning...");
    setLoadingPhaseIndex(0);
    const phaseInterval = setInterval(() => {
      setLoadingPhaseIndex(prev => (prev < 3 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...copilotGlobalMessages, userMsg].map(m => ({ 
            role: m.role, 
            content: m.content,
            attachment: m.attachment
          })) 
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCopilotGlobalMessages(prev => [...prev, {
          id: data.id,
          role: 'assistant',
          content: data.content,
          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(phaseInterval);
      setCopilotSearchQuery(null);
      setIsCopilotLoading(false);
    }
  };

  // Run dynamic scanning on the active asset inside detailed screen
  const executeDeepScanForActive = async () => {
    if (!activeAsset) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/coin/${activeAsset.id}?lang=english`);
      if (res.ok) {
        const report = await res.json();
        setActiveCoinReport(report);
        pushNotification(`Compiled quantitative report for ${activeAsset.symbol}.`);
      }
    } catch (err) {
      console.error("Deep scan failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Execute commands received from the CMD command bar modal
  const handleExecuteCommand = async (cmdText: string) => {
    setShowCommandBar(false);
    setCommandQuery("");
    const text = cmdText.trim().toLowerCase();

    if (text === "/dashboard" || text === "dashboard" || text === "home") {
      setActiveTopTab("TRADE");
      setCurrentView("DASHBOARD");
      pushNotification("Navigated to: Mission Control Dashboard.");
    } else if (text === "/portfolio" || text === "portfolio" || text === "fund") {
      setActiveTopTab("TRADE"); // Switch to portfolio in bottom
      setActiveTopTab("TRADE" as any); // Keep trade
      // Set to special active tab PORTFOLIO which is checked in renderer
      setActiveTopTab("PORTFOLIO" as any);
      pushNotification("Navigated to: Fund Manager Ledger.");
    } else if (text === "/copilot" || text === "ai" || text === "oracle") {
      setActiveTopTab("CHAT");
      pushNotification("Navigated to: Aegis AI Oracle Desk.");
    } else if (text === "/reflash" || text === "refresh" || text === "sync") {
      fetchGlobalMarketStats();
      pushNotification("Command Triggered: Synchronized global markets pipeline.");
    } else if (text.startsWith("/scan ") || text.startsWith("scan ")) {
      const symbol = text.replace("/scan ", "").replace("scan ", "").trim().toUpperCase();
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(symbol)}`);
        if (res.ok) {
          const results = await res.json();
          const coin = results.find((c: any) => c.symbol.toUpperCase() === symbol || c.id.toLowerCase() === symbol.toLowerCase());
          if (coin) {
            handleSelectAsset(coin);
            return;
          }
        }
      } catch (err) {}
      if (marketStats) {
        const coin = marketStats.trending.find(c => c.symbol.toUpperCase() === symbol) ||
                     marketStats.gainers.find(c => c.symbol.toUpperCase() === symbol) ||
                     marketStats.losers.find(c => c.symbol.toUpperCase() === symbol);
        if (coin) {
          handleSelectAsset(coin);
          return;
        }
      }
      pushNotification(`Command error: Symbol ${symbol} not resolved.`);
    } else if (text.startsWith("/detail ") || text.startsWith("detail ") || text.startsWith("/open ")) {
      const symbol = text.replace("/detail ", "").replace("detail ", "").replace("/open ", "").trim().toUpperCase();
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(symbol)}`);
        if (res.ok) {
          const results = await res.json();
          const coin = results.find((c: any) => c.symbol.toUpperCase() === symbol || c.id.toLowerCase() === symbol.toLowerCase());
          if (coin) {
            handleOpenDirectTrade(coin);
            return;
          }
        }
      } catch (err) {}
      if (marketStats) {
        const coin = marketStats.trending.find(c => c.symbol.toUpperCase() === symbol) ||
                     marketStats.gainers.find(c => c.symbol.toUpperCase() === symbol) ||
                     marketStats.losers.find(c => c.symbol.toUpperCase() === symbol);
        if (coin) {
          handleOpenDirectTrade(coin);
          return;
        }
      }
      pushNotification(`Command error: Symbol ${symbol} not resolved.`);
    } else {
      // General search lookup fallback
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`);
        if (res.ok) {
          const results = await res.json();
          const coin = results.find((c: any) => c.symbol.toLowerCase() === text || c.name.toLowerCase() === text || c.id.toLowerCase() === text);
          if (coin) {
            handleSelectAsset(coin);
            return;
          }
        }
      } catch (err) {}
      if (marketStats) {
        const coin = marketStats.trending.find(c => c.symbol.toLowerCase() === text || c.name.toLowerCase() === text) ||
                     marketStats.gainers.find(c => c.symbol.toLowerCase() === text || c.name.toLowerCase() === text) ||
                     marketStats.losers.find(c => c.symbol.toLowerCase() === text || c.name.toLowerCase() === text);
        if (coin) {
          handleSelectAsset(coin);
          return;
        }
      }
      pushNotification(`Unknown command structure: "${cmdText}"`);
    }
  };

  return (
    <div className={`w-full min-h-screen font-sans flex transition-colors duration-300 overflow-hidden ${
      isDarkActive 
        ? "bg-[#08080A] text-[#EDEAE3]" 
        : "bg-[#F7F5F0] text-[#1A1A1F]"
    }`}>
      
      {/* ================= LEFT COMMAND SIDEBAR DIRECTORY ================= */}
      <aside className={`h-screen border-r flex flex-col justify-between transition-all shrink-0 z-50 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative ${
        isDarkActive 
          ? "border-[rgba(255,255,255,0.06)] bg-[#0C0C10]" 
          : "border-[rgba(26,26,31,0.06)] bg-[#FDFCF7]"
      } ${isSidebarCollapsed ? "w-16" : "w-64"}`}>
        
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-5 border-b border-current border-opacity-5 flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div 
                onClick={() => { setActiveTopTab("TRADE"); setCurrentView("DASHBOARD"); }}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-sm font-black border ${
                  isDarkActive 
                    ? "bg-[#14141E] border-[rgba(255,255,255,0.1)] text-[#C9A96A]" 
                    : "bg-white border-black/10 text-[#9C7B3E]"
                }`}>
                  Φ
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black tracking-tight text-xs leading-none">
                    QUANTUM<span className={isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}>OS</span>
                  </span>
                  <span className="text-[7.5px] font-mono tracking-widest uppercase opacity-45 leading-none mt-1">
                    HEDGE COGNITIVE NODE
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center font-serif text-sm font-bold bg-[#C9A96A]/10 text-[#C9A96A]">
                Φ
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md opacity-45 hover:opacity-100 md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`p-1 rounded-md opacity-45 hover:opacity-100 hidden md:block cursor-pointer ${
                  isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                }`}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Directory Workspace Links */}
          <nav className="p-4 flex flex-col gap-1.5 mt-2">
            {[
              { 
                id: "DASHBOARD", 
                tab: "TRADE", 
                view: "DASHBOARD", 
                label: "Mission Control", 
                detail: "Global telemetry stream",
                icon: <Compass className="w-4 h-4" /> 
              },
              { 
                id: "DETAIL", 
                tab: "TRADE", 
                view: "DETAIL", 
                label: "Intelligence Hub", 
                detail: "Detailed spot terminal",
                icon: <Cpu className="w-4 h-4" /> 
              },
              { 
                id: "ANALYSIS", 
                tab: "ANALYSIS", 
                view: undefined, 
                label: "Research Briefings", 
                detail: "Specialist dossier files",
                count: analysisTabs.length, 
                icon: <BookOpen className="w-4 h-4" /> 
              },
              { 
                id: "PORTFOLIO", 
                tab: "PORTFOLIO", 
                view: undefined, 
                label: "Prime Ledger", 
                detail: "Hedge asset management",
                icon: <Briefcase className="w-4 h-4" /> 
              },
              { 
                id: "CHAT", 
                tab: "CHAT", 
                view: undefined, 
                label: "Oracle Copilot Core", 
                detail: "Global cognitive core",
                icon: <MessageSquare className="w-4 h-4" /> 
              }
            ].map((link) => {
              const matchesTab = activeTopTab === link.tab;
              const matchesView = link.view === undefined || currentView === link.view;
              const isLinkActive = matchesTab && matchesView;

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTopTab(link.tab as any);
                    if (link.view) setCurrentView(link.view as any);
                    setIsMobileMenuOpen(false);
                    // Automatically load bitcoin if entering hub with no active asset
                    if (link.id === "DETAIL" && !activeAsset && marketStats) {
                      setActiveAsset(marketStats.trending[0]);
                      setSelectedCoinId(marketStats.trending[0].id);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl text-left flex items-center justify-between transition-all select-none cursor-pointer border ${
                    isLinkActive
                      ? (isDarkActive 
                          ? "bg-[#14141A] border-white/5 text-[#EDEAE3] font-bold" 
                          : "bg-[#F3EFE7] border-black/5 text-[#1A1A1F] font-bold")
                      : "bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                  } ${isSidebarCollapsed ? "px-2.5 justify-center" : "px-3.5"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isLinkActive ? (isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]") : "text-current"}>
                      {link.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <div className="flex flex-col leading-none">
                        <span className="text-[11px] uppercase tracking-wider font-bold">{link.label}</span>
                        <span className="text-[7.5px] opacity-40 font-mono mt-0.5 whitespace-nowrap">{link.detail}</span>
                      </div>
                    )}
                  </div>

                  {!isSidebarCollapsed && "count" in link && link.count !== undefined && link.count > 0 && (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                      isDarkActive ? "bg-[#C9A96A]/20 text-[#C9A96A]" : "bg-[#9C7B3E]/15 text-[#9C7B3E]"
                    }`}>
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapsible active diagnostics logs on left sidebar */}
          {!isSidebarCollapsed && (
            <div className="p-4 mx-4 mt-6 border border-dashed rounded-xl font-mono text-[8.5px]" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
               <span className="font-bold opacity-45 uppercase tracking-widest block mb-2 text-[#5EEAD4]">Active Pipeline</span>
               <div className="flex flex-col gap-1.5 opacity-60">
                 {notifications.slice(0, 2).map((item, id) => (
                    <div key={id} className="truncate">» {item}</div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Bottom profile / holdings indicators (Hedge fund design) */}
        <div className="p-4 border-t border-current border-opacity-5 flex flex-col gap-3">
          
          {/* Theme selection panel */}
          {!isSidebarCollapsed ? (
            <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
              isDarkActive ? "bg-[#14141E] border-white/5" : "bg-[#F3EFE7] border-black/5"
            }`}>
              {[
                { id: "dark", label: "Dark", icon: <Moon className="w-3 h-3" /> },
                { id: "light", label: "Light", icon: <Sun className="w-3 h-3" /> },
                { id: "system", label: "Sys", icon: <Monitor className="w-3 h-3" /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`py-1 px-3.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                    theme === t.id
                      ? (isDarkActive ? "bg-[#C9A96A] text-black" : "bg-[#9C7B3E] text-white")
                      : "opacity-45 hover:opacity-90"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <button 
              onClick={() => setTheme(isDarkActive ? "light" : "dark")}
              className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center border border-current border-opacity-10 bg-black/5 text-current hover:opacity-100"
            >
              {isDarkActive ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Quick Fund Net Value progress widget */}
          {!isSidebarCollapsed ? (
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-black/15 border text-[10px] font-black ${
                  isDarkActive ? "border-white/5 text-[#C9A96A]" : "border-black/5 text-[#9C7B3E]"
                }`}>
                  F
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] font-mono opacity-40 font-bold uppercase tracking-wider">Prime Valuation</span>
                  <span className="text-xs font-mono font-black mt-0.5 tracking-tight text-[#5EEAD4]">
                    ${profileNav.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <div className="w-24 bg-black/20 h-0.5 rounded-full mt-1 overflow-hidden">
                     <div className="bg-[#5EEAD4] h-full" style={{ width: "74%" }}></div>
                  </div>
                </div>
             </div>
          ) : (
             <div className="w-2 h-2 rounded-full bg-[#5EEAD4] mx-auto animate-pulse"></div>
          )}
          
        </div>

      </aside>
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT PANE (Scrollable container) ================= */}
      <section className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* A. Top Chronicle Ticker & Command trigger Bar */}
        <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between backdrop-blur-xl shrink-0 z-30 transition-all ${
          isDarkActive 
            ? "border-[rgba(255,255,255,0.06)] bg-[#0A0A0C]/80" 
            : "border-[rgba(26,26,31,0.06)] bg-[#FDFCF7]/80"
        }`}>
          
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
              <Menu className="w-5 h-5 opacity-50" />
            </button>
            {/* Back to dashboard handle */}
            {currentView === "DETAIL" && activeTopTab === "TRADE" && (
              <button 
                onClick={() => setCurrentView("DASHBOARD")}
                className={`p-2.5 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                  isDarkActive 
                    ? "border-white/10 text-[#EDEAE3] bg-black/20 hover:border-[#C9A96A]" 
                    : "border-black/10 text-[#1A1A1F] bg-white hover:bg-black/[0.02]"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            )}

            {/* Search Trigger */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCommandBar(true)}
                className={`p-2 rounded-xl border transition-all ${
                  isDarkActive 
                    ? "border-[rgba(255,255,255,0.06)] bg-black/20 hover:border-[#C9A96A]"
                    : "border-[rgba(26,26,31,0.06)] bg-[#F5F2EA] hover:border-[#9C7B3E]"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Asset Ticker rates */}
          <div className="flex items-center gap-5 shrink-0 pl-4 border-l border-current border-opacity-5">
            {marketStats && (
              <div className="hidden lg:flex items-center gap-5 text-[10px] font-mono leading-none">
                <div className="flex flex-col">
                  <span className="opacity-35 font-bold uppercase text-[7.5px]">BTC SPOT</span>
                  <span className={`font-black mt-0.5 ${isDarkActive ? "text-[#5EEAD4]" : "text-[#9C7B3E]"}`}>${marketStats.btcPrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-35 font-bold uppercase text-[7.5px]">ETH SPOT</span>
                  <span className={`font-black mt-0.5 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#9C7B3E]"}`}>${marketStats.ethPrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-35 font-bold uppercase text-[7.5px]">FEAR INDEX</span>
                  <span className="font-black mt-0.5 text-[#C9A96A]">{marketStats.fearAndGreedIndex} {marketStats.fearAndGreedLabel}</span>
                </div>
              </div>
            )}

            {/* latency & refresh controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchGlobalMarketStats}
                className={`p-2.5 rounded-xl border hover:scale-[1.02] cursor-pointer transition-all ${
                  isDarkActive ? "border-white/5 text-[#EDEAE3]/65" : "border-black/5 text-[#1A1A1F]/65"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#C9A96A]" : "opacity-60"}`} />
              </button>

              <button 
                onClick={() => { setIsCopilotOpen(!isCopilotOpen); setIsCopilotPulsing(false); }}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  isCopilotOpen 
                    ? (isDarkActive ? "bg-[#C9A96A]/10 border-[#C9A96A]/20 text-[#C9A96A]" : "bg-[#9C7B3E]/10 border-[#9C7B3E]/20 text-[#9C7B3E]")
                    : (isDarkActive ? "border-white/5 text-[#EDEAE3]/65 bg-transparent" : "border-black/5 text-[#1A1A1F]/65 bg-transparent")
                } ${isCopilotPulsing ? "animate-pulse border-[#C9A96A]/50" : ""}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copilot</span>
              </button>
            </div>
          </div>

        </header>

        {/* B. Main Viewport Render slot */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 no-scrollbar">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTopTab}_${currentView}_${selectedCoinId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
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
                       onDeepScan={executeDeepScanForActive}
                       isAnalyzing={isAnalyzing}
                       chatMessages={chatMessages}
                       chatInput={chatInput}
                       setChatInput={setChatInput}
                       onSendChat={handleSendChat}
                       isChatLoading={isChatLoading}
                       isDarkActive={isDarkActive}
                       userProfile={userProfile}
                       onTrade={handleTrade}
                       onClearIsNew={handleClearCopilotMessageIsNew}
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
                  onTriggerScanForAsset={handleSelectAsset}
                  onClearIsNew={handleClearCopilotMessageIsNew}
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
            </motion.div>
          </AnimatePresence>

        </div>

      </section>

      {/* ================= PERSISTENT RIGHT COMPANION SLIDING AEGIS COPILOT ================= */}
      <AnimatePresence>
        {isCopilotOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 280 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={`w-full md:w-72 lg:w-80 h-[100dvh] border-l flex flex-col justify-between shrink-0 z-40 fixed md:relative inset-y-0 right-0 shadow-2xl ${
              isDarkActive 
                ? "border-[rgba(255,255,255,0.06)] bg-[#0C0C10]" 
                : "border-[rgba(26,26,31,0.06)] bg-[#FDFCF7]"
            }`}
          >
            {/* Header portion */}
            <div className="p-4 border-b border-current border-opacity-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A] animate-pulse" : "text-[#9C7B3E] animate-pulse"}`} />
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C9A96A]">Aegis Co-Pilot</span>
                  <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest mt-1">State-aware advisor desk</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsCopilotOpen(false)}
                className={`p-1 rounded opacity-45 hover:opacity-100 transition-all cursor-pointer ${
                  isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STATE-AWARE COMPANION DIALOGUES LIST */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 no-scrollbar">
              
              {/* Context spec tags */}
              <div className="p-2.5 rounded-lg border text-[8.5px] font-mono uppercase bg-black/15 space-y-2" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                 <div className="flex justify-between items-center text-[#5EEAD4]">
                   <span>ACTIVE COPILOT SYNC:</span>
                   <span>NOMINAL</span>
                 </div>
                 <div className="opacity-45 leading-normal truncate">
                   {activeTopTab === "TRADE" && currentView === "DETAIL" && activeAsset
                     ? `SCREEN: DETAIL CENTER // SPECIALIST: ${activeAsset.symbol}`
                     : activeTopTab === "ANALYSIS" && activeAnalysisIndex >= 0
                     ? `SCREEN: RESEARCH DOSSIER // SPECIALIST: ${analysisTabs[activeAnalysisIndex].coin.symbol}`
                     : "SCREEN: GLOBAL COMPANION // GENERAL ORACLE CORE"
                   }
                 </div>

                 {/* MULTI-CHAT CORE SESSION CONTROLS - Displayed only for General Companion views or when activeTopTab is standard */}
                 {!(activeTopTab === "TRADE" && currentView === "DETAIL") && !(activeTopTab === "ANALYSIS" && activeAnalysisIndex >= 0) && (
                   <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                     <div className="text-[7.5px] font-bold text-white/40">COMPANION CHAT CHANNELS</div>
                     
                     {editingSessionId === activeSessionId ? (
                       <div className="flex items-center gap-1.5 w-full">
                         <input 
                           type="text"
                           value={editingSessionName}
                           onChange={(e) => setEditingSessionName(e.target.value)}
                           className="flex-1 px-2 py-1 text-[9px] rounded border border-[#C9A96A] bg-black text-white outline-none font-mono leading-none"
                           autoFocus
                         />
                         <button 
                           onClick={() => {
                             handleRenameCopilotSession(activeSessionId, editingSessionName);
                             setEditingSessionId(null);
                           }}
                           className="px-1.5 py-1 text-[8px] bg-green-950 border border-green-800 text-green-400 rounded hover:bg-green-900 transition-all font-bold"
                         >
                           SAVE
                         </button>
                         <button 
                           onClick={() => setEditingSessionId(null)}
                           className="px-1.5 py-1 text-[8px] bg-red-950 border border-red-800 text-red-500 rounded hover:bg-red-900 transition-all"
                         >
                           ESC
                         </button>
                       </div>
                     ) : (
                       <div className="flex items-center justify-between w-full gap-1">
                         <select
                           value={activeSessionId}
                           onChange={(e) => setActiveSessionId(e.target.value)}
                           className="flex-1 h-6 px-1 text-[8.5px] rounded border border-white/10 bg-black/45 text-white outline-none font-mono"
                         >
                           {copilotSessions.map(s => (
                             <option key={s.id} value={s.id} className="bg-[#0C0C10] text-[#EDEAE3]">{s.name}</option>
                           ))}
                         </select>
                         
                         <button
                           onClick={() => {
                             setEditingSessionId(activeSessionId);
                             const current = copilotSessions.find(s => s.id === activeSessionId)?.name || "";
                             setEditingSessionName(current);
                           }}
                           title="Rename Session"
                           className="p-1 rounded border border-white/5 bg-black/20 text-[#C9A96A] hover:bg-black/40 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                         >
                           <Edit className="w-2.5 h-2.5" />
                         </button>

                         <button
                           onClick={handleCreateCopilotSession}
                           title="Create New Session"
                           className="p-1 rounded border border-white/5 bg-black/20 text-[#C9A96A] hover:bg-black/40 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                         >
                           <Plus className="w-2.5 h-2.5" />
                         </button>

                         {copilotSessions.length > 1 && (
                           <button
                             onClick={() => handleDeleteCopilotSession(activeSessionId)}
                             title="Delete Session"
                             className="p-1 rounded border border-white/5 bg-black/20 text-red-400 hover:bg-black/40 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                           >
                             <Trash2 className="w-2.5 h-2.5" />
                           </button>
                         )}
                       </div>
                     )}
                   </div>
                 )}
              </div>

              {/* Message timeline viewport */}
              <div className="space-y-4 pr-1">
                {(() => {
                  let timeline = copilotGlobalMessages;
                  if (activeTopTab === "TRADE" && currentView === "DETAIL") {
                    timeline = chatMessages;
                  } else if (activeTopTab === "ANALYSIS" && activeAnalysisIndex >= 0) {
                    timeline = analysisTabs[activeAnalysisIndex].chatMessages;
                  }

                  return timeline.slice(-6).map((msg) => {
                    const isUser = msg.role === "user";
                    return (
                      <div key={msg.id} className={`flex flex-col relative group ${isUser ? "items-end" : "items-start"}`}>
                        <div className={`px-3 py-2 rounded-xl text-[10px] leading-relaxed max-w-[95%] shadow-sm ${
                          isUser
                            ? (isDarkActive ? "bg-[#C9A96A] text-black font-semibold rounded-tr-none" : "bg-[#9C7B3E] text-white font-semibold rounded-tr-none")
                            : (isDarkActive 
                                ? "bg-[#14141A] text-[#EDEAE3] border border-white/5 rounded-tl-none" 
                                : "bg-[#F3EFE7]/80 text-[#1A1A1F] border border-black/5 rounded-tl-none")
                        }`}>
                          <div className="flex flex-col gap-1.5">
                            {msg.role === 'assistant' ? (
                              msg.isNew ? (
                                <TypewriterText text={msg.content} onComplete={() => handleClearCopilotMessageIsNew(msg.id)} />
                              ) : (
                                <div className="markdown-body">
                                  <Markdown>{msg.content}</Markdown>
                                </div>
                              )
                            ) : (
                              <div>{msg.content}</div>
                            )}
                            {msg.attachment && (
                              <div className={`mt-1.5 p-1.5 flex flex-col gap-2 rounded text-[8px] font-mono border max-w-full overflow-hidden ${
                                isDarkActive 
                                  ? "bg-white/5 border-white/10 text-white/90" 
                                  : "bg-black/5 border-black/10 text-black/90"
                              }`}>
                                {msg.attachment.type && msg.attachment.type.startsWith("image/") ? (
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-1">
                                      <Image className="w-3 h-3 text-[#C9A96A]" />
                                      <span className="truncate font-bold">{msg.attachment.name}</span>
                                    </div>
                                    <img 
                                      src={msg.attachment.data} 
                                      alt={msg.attachment.name}
                                      className="max-h-24 rounded border border-white/10 object-cover w-auto h-auto max-w-full"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 truncate w-full">
                                    <Paperclip className="w-3 h-3 text-[#C9A96A]" />
                                    <span className="truncate font-bold">{msg.attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 mt-0.5 px-0.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[7.5px] font-mono opacity-30">{msg.timestamp}</span>
                          <button 
                            onClick={() => handleCopyCopilotMsg(msg.id, msg.content)}
                            className="text-[9px] font-mono opacity-50 hover:opacity-100 flex items-center gap-1 cursor-pointer transition-all hover:text-[#C9A96A] select-none scale-102 hover:scale-105 active:scale-95"
                            title={isUser ? "Copy Question" : "Copy Answer"}
                          >
                            {copiedCopilotId === msg.id ? (
                              <>
                                <Check className="w-2 h-2 text-green-500" />
                                <span className="text-green-500 text-[8px] font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2 h-2" />
                                <span className="text-[8px]">{isUser ? "Copy" : "Copy"}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}

                {isCopilotLoading && (
                  <div className="flex flex-col gap-2 p-3 rounded-lg border border-white/5 bg-black/10 font-mono text-[9px] animate-pulse">
                    <div className="flex items-center gap-1.5 text-[#C9A96A]">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#C9A96A]" />
                      <span>COGNITIVE PIPELINE ACTIVE</span>
                    </div>
                    <div className="text-white/60 space-y-1">
                      <div>➔ {loadingPhases[loadingPhaseIndex]}</div>
                      {copilotSearchQuery && (
                        <div className="opacity-45 italic text-[8px] truncate">Targeting: "{copilotSearchQuery}"</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom quick suggestions & prompt inputs area */}
            <div className="p-4 border-t border-current border-opacity-5 space-y-3.5 bg-black/15">
              
              {/* DYNAMIC ACTION TRIGGER CHIPS (State aware!) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-mono font-bold opacity-30 uppercase tracking-widest block font-bold">Suggested Cognitive actions</span>
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    const isDetail = activeTopTab === "TRADE" && currentView === "DETAIL" && activeAsset;
                    const isReports = activeTopTab === "ANALYSIS" && activeAnalysisIndex >= 0;

                    let chips = [
                      "Calculate Portfolio beta indicators",
                      "Analyze current macro liquidity anomalies",
                      "Locate smart money accumulation blocks"
                    ];

                    if (isDetail && activeAsset) {
                      chips = [
                        `Is ${activeAsset.symbol}'s squaring pivot verified?`,
                        `Detail recent liquidity trapping ranges`,
                        `Project ultimate resistance boundaries`
                      ];
                    } else if (isReports) {
                      const coin = analysisTabs[activeAnalysisIndex].coin;
                      chips = [
                        `Highlight ${coin.symbol}'s sovereign volatility risks`,
                        `Summarize execution forecasts`,
                        `Analyze market psychology indices`
                      ];
                    }

                    return chips.map((txt, id) => (
                      <button
                        key={id}
                        onClick={() => handleSendCopilot(txt)}
                        className={`text-[8.5px] text-left leading-snug px-2 py-1 rounded border transition-all hover:scale-[1.01] cursor-pointer block w-full ${
                          isDarkActive 
                            ? "bg-[#14141E] border-white/5 text-[#EDEAE3]/80 hover:border-[#C9A96A]" 
                            : "bg-white border-black/5 text-[#1A1A1F]/85 hover:border-[#9C7B3E]"
                        }`}
                      >
                        » {txt}
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Attachment chip indicator above the input */}
              {copilotAttachment && (
                <div className={`p-1.5 rounded flex items-center justify-between text-[8px] font-mono border ${
                  isDarkActive 
                    ? "bg-[#14141E] border-white/5 text-[#EDEAE3]" 
                    : "bg-white border-black/5 text-[#1A1A1F]"
                }`}>
                  <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                    {copilotAttachment.type && copilotAttachment.type.startsWith("image/") ? (
                      <Image className="w-3 h-3 text-[#C9A96A] shrink-0" />
                    ) : (
                      <Paperclip className="w-3 h-3 text-[#C9A96A] shrink-0" />
                    )}
                    <span className="truncate font-bold">{copilotAttachment.name}</span>
                  </div>
                  <button 
                    onClick={() => setCopilotAttachment(null)}
                    className="p-0.5 rounded hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}

              {/* Interactive prompt input */}
              <div 
                className="relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {/* Hidden input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {/* Paperclip trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-2.5 top-2.5 text-current opacity-40 hover:opacity-100 hover:text-[#C9A96A] transition-all cursor-pointer"
                  title="Upload attachment (Drag & drop supported)"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                <input 
                  type="text" 
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCopilot()}
                  placeholder="Direct prompt (or drag / drop files)..."
                  className={`w-full h-9 pl-8 pr-14 border rounded-lg text-[10px] transition-all outline-none leading-none ${
                    isDarkActive 
                      ? "bg-black text-white border-white/10 focus:border-[#C9A96A]/60" 
                      : "bg-white text-black border-black/10 focus:border-[#9C7B3E]/60"
                  }`}
                />
                <button 
                  onClick={() => handleSendCopilot()}
                  disabled={(!copilotInput.trim() && !copilotAttachment) || isCopilotLoading}
                  className={`absolute right-1 top-1 h-7 px-2.5 text-[8px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                    isDarkActive ? "bg-[#C9A96A] text-black" : "bg-[#9C7B3E] text-white"
                  }`}
                >
                  Ask
                </button>
              </div>

            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= UNIVERSAL CMD COMMAND BAR DIALOG OVERLAY ================= */}
      <AnimatePresence>
        {showCommandBar && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-xl rounded-2xl border p-4 shadow-2xl relative ${
                isDarkActive ? "bg-[#101014] border-white/10 text-white" : "bg-white border-black/10 text-black"
              }`}
            >
              
              {/* CMD input */}
              <div className="flex items-center gap-3 border-b pb-3 mb-3" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <Search className="w-4 h-4 opacity-40" />
                <input 
                  type="text"
                  autoFocus
                  placeholder="Execute cmd (e.g. /dashboard, /portfolio) or search symbol..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleExecuteCommand(commandQuery)}
                  className="flex-1 bg-transparent border-none outline-none text-xs font-mono placeholder-current placeholder-opacity-30 h-8"
                />
                <button 
                  onClick={() => setShowCommandBar(false)}
                  className={`px-2 py-1 rounded text-[8px] font-mono leading-none border uppercase opacity-35 hover:opacity-100 ${
                    isDarkActive ? "border-white/10" : "border-black/10"
                  }`}
                >
                  ESC
                </button>
              </div>

              {/* Autocompletes results and static operations guidelines */}
              <div className="flex flex-col gap-2 font-mono text-[10px]">
                
                {/* Dynamically queries active symbols links if query supplied */}
                {commandResults.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[7.5px] opacity-35 uppercase block font-bold mb-1 tracking-widest">Matched Assets</span>
                    {commandResults.map(coin => (
                      <button
                        key={coin.id}
                        onClick={() => handleExecuteCommand(`/open ${coin.symbol}`)}
                        className={`w-full p-2 rounded text-left flex justify-between items-center ${
                          isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                        } cursor-pointer`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#C9A96A] font-bold">{coin.symbol}</span>
                          <span className="opacity-60">{coin.name}</span>
                        </div>
                        <span className="opacity-45 text-[8.5px] uppercase">/open {coin.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Static navigation actions shortcuts (Raycast style) */}
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-[7.5px] opacity-35 uppercase block font-bold mb-1 tracking-widest">Sovereign OS Command Shortcuts</span>
                  
                  {[
                    { cmd: "/dashboard", desc: "Go to Mission Control dashboard" },
                    { cmd: "/portfolio", desc: "Go to audited Asset Allocations Ledger" },
                    { cmd: "/copilot", desc: "Consult Aegis cognitive oracle companion" },
                    { cmd: "/reflash", desc: "Synchronize L1 market stats pipeline" },
                    { cmd: "scan <coin>", desc: "E.g., '/scan BTC' to launch deep scan setup" }
                  ].map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteCommand(act.cmd)}
                      className={`w-full p-2 rounded text-left flex justify-between items-center transition-all ${
                        isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                      } cursor-pointer`}
                    >
                      <span className="font-bold opacity-80 text-current">{act.desc}</span>
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider ${
                        isDarkActive ? "bg-white/5 text-[#C9A96A]" : "bg-black/5 text-[#9C7B3E]"
                      }`}>{act.cmd}</span>
                    </button>
                  ))}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= EXTRA SELECTION PROMPT MODAL PORTED EXACTLY ================= */}
      <AnimatePresence>
        {showSelectionModal && selectedModalAsset && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-lg rounded-3xl border p-8 shadow-2xl relative ${
                isDarkActive 
                  ? "bg-[#101015] border-white/5 text-[#EDEAE3]" 
                  : "bg-white border-black/10 text-[#1A1A1F]"
              }`}
            >
              <button 
                onClick={() => setShowSelectionModal(false)}
                className={`absolute top-5 right-5 opacity-40 hover:opacity-100 transition-all rounded-full p-2 cursor-pointer ${
                  isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {!showLangSelectionStep ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className={`text-[9px] font-mono tracking-[0.25em] uppercase block mb-1.5 ${
                      isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
                    }`}>
                      Dossier Workspace Action
                    </span>
                    <h3 className="text-2xl font-serif font-black tracking-tight mb-2 uppercase">
                      Initialize {selectedModalAsset.name} ({selectedModalAsset.symbol})
                    </h3>
                    <p className="text-xs leading-relaxed opacity-60">
                       Configure processing pipelines to deploy detailed technical reports or interactive execution centers.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 font-sans">
                    {/* Direct Trade views */}
                    <button
                      onClick={() => handleOpenDirectTrade(selectedModalAsset)}
                      className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group ${
                        isDarkActive 
                          ? "bg-white/[0.01] border-white/5 hover:border-[#C9A96A]/45 hover:bg-white/[0.03]" 
                          : "bg-black/[0.01] border-black/5 hover:border-[#9C7B3E]/45 hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <Sliders className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
                        <span className={`font-semibold text-xs uppercase tracking-wider ${
                          isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
                        }`}>
                          Direct spot Trade hub
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-60">
                         Access interactive real-time price action charts, order input form vectors, and spot execution ledgers immediately.
                      </p>
                    </button>

                    {/* deep scan report analysis */}
                    <button
                      onClick={() => setShowLangSelectionStep(true)}
                      className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group ${
                        isDarkActive 
                          ? "bg-white/[0.01] border-white/5 hover:border-[#C9A96A]/45 hover:bg-white/[0.03]" 
                          : "bg-black/[0.01] border-black/5 hover:border-[#9C7B3E]/45 hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <Radio className={`w-4 h-4 text-current animate-pulse`} />
                        <span className={`font-semibold text-xs uppercase tracking-wider ${
                          isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
                        }`}>
                          QUANTUM DEEP VECTOR ANALYSIS
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-60">
                         Run multi-tiered predictive AI models, support/resistance vibrational zones, probability win indices, and risk matrix briefs.
                      </p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 font-sans">
                  <div>
                    <span className={`text-[9px] font-mono tracking-[0.25em] uppercase block mb-1.5 ${
                      isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
                    }`}>
                      Pipeline Compilation Config
                    </span>
                    <h3 className="text-2xl font-serif font-black tracking-tight mb-2 uppercase text-current">
                      Select Translation Core
                    </h3>
                    <p className="text-xs leading-relaxed opacity-60">
                       Determine the language synthesis vector to compile the deep intelligence report and analytical graphs.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* English */}
                    <div
                      onClick={() => setSelectedModalLang("english")}
                      className={`p-5 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                        selectedModalLang === "english" 
                          ? (isDarkActive ? "bg-[#C9A96A]/15 border-[#C9A96A] text-[#C9A96A]" : "bg-[#9C7B3E]/10 border-[#9C7B3E] text-[#9C7B3E]")
                          : (isDarkActive ? "bg-white/5 border-transparent opacity-60 hover:opacity-100" : "bg-black/5 border-transparent opacity-60 hover:opacity-100")
                      }`}
                    >
                      <span className="block font-bold text-xs uppercase">English Core</span>
                      <span className="block text-[8px] opacity-40 uppercase font-mono tracking-wider mt-1.5">Standard English brief</span>
                    </div>

                    {/* Hinglish */}
                    <div
                      onClick={() => setSelectedModalLang("hinglish")}
                      className={`p-5 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                        selectedModalLang === "hinglish" 
                          ? (isDarkActive ? "bg-[#C9A96A]/15 border-[#C9A96A] text-[#C9A96A]" : "bg-[#9C7B3E]/10 border-[#9C7B3E] text-[#9C7B3E]")
                          : (isDarkActive ? "bg-white/5 border-transparent opacity-60 hover:opacity-100" : "bg-black/5 border-transparent opacity-60 hover:opacity-100")
                      }`}
                    >
                      <span className="block font-bold text-xs uppercase">Hinglish Core</span>
                      <span className="block text-[8px] opacity-40 uppercase font-mono tracking-wider mt-1.5">Hindi-English adapter</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center justify-end mt-4">
                    <button
                      onClick={() => setShowLangSelectionStep(false)}
                      className={`flex-1 py-3 border rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                        isDarkActive 
                          ? "border-white/10 bg-black/25 text-[#EDEAE3] hover:bg-black/40" 
                          : "border-black/10 bg-white text-[#1A1A1F] hover:bg-black/[0.01]"
                      }`}
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleLaunchAnalysis(selectedModalAsset, selectedModalLang)}
                      className={`flex-2 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer ${
                        isDarkActive 
                          ? "bg-[#C9A96A] hover:bg-[#B08A4E] text-black shadow-[#C9A96A]/10" 
                          : "bg-[#9C7B3E] hover:bg-[#7E602A] text-white shadow-[#9C7B3E]/10"
                      }`}
                    >
                      COMPILE BRIEFING
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
