import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Brain, 
  ShieldCheck,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Compass,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../types';
import { TypewriterText } from './TypewriterText';
import Markdown from 'react-markdown';

interface Props {
  isDarkActive: boolean;
}

export const AiAssistantTab: React.FC<Props> = ({ isDarkActive }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("quantum_general_assistant_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure old messages don't re-animate
        return parsed.map((m: any) => ({ ...m, isNew: false }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'init',
        role: 'assistant',
        content: "Greetings. I am **The Aegis Oracle**, your institutional-grade trading cognitive partner. I specialize in identifying high-probability market shifts, geometric price symmetries, and mathematical trend exhaustions.\n\nHow can I refine your market strategy today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: false
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyMsg = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    localStorage.setItem("quantum_general_assistant_messages", JSON.stringify(messages));
  }, [messages]);

  const handleClearIsNew = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isNew: false } : m));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: data.id,
          role: 'assistant',
          content: data.content,
          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        }]);
      } else {
        throw new Error('Network congestion detected in the Quantum relay.');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: "Structural feedback loop detected. Connectivity with the Oracle Core is temporarily unstable. Please re-synchronize your inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px] animate-in fade-in duration-300">
      
      {/* SIDEBAR: SYSTEM VERIFICATIONS */}
      <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
        <div className={`p-5 rounded-2xl border ${isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <Brain className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">Cognitive Specs</span>
          </div>
          
          <div className="flex flex-col gap-2.5 font-mono">
             {[
               { icon: <Globe className="w-3.5 h-3.5 text-[#5EEAD4]" />, label: "Dual-lingual", status: "Enabled" },
               { icon: <TrendingUp className="w-3.5 h-3.5 text-[#C9A96A]" />, label: "Quant Sizing", status: "Active" },
               { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#5EEAD4]" />, label: "Volatility", status: "Calibrated" },
               { icon: <Zap className="w-3.5 h-3.5 text-[#E2675A]" />, label: "Sovereign Core", status: "Online" }
             ].map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/10 dark:bg-white/[0.01] border border-current opacity-95">
                 <div className="flex items-center gap-2 opacity-65 text-[10px] font-bold uppercase">
                   {item.icon}
                   <span>{item.label}</span>
                 </div>
                 <span className="text-[8px] font-black uppercase text-[#5EEAD4]">{item.status}</span>
               </div>
             ))}
          </div>
          
          <div className="mt-5 p-4 bg-black/10 rounded-xl border border-dashed text-[10px]" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
             <div className="flex items-center gap-2 mb-2 text-[#C9A96A]">
               <Sparkles className="w-3 h-3 text-current" />
               <span className="font-bold uppercase tracking-wider">Hinglish Translation</span>
             </div>
             <p className="opacity-60 leading-relaxed italic">
               You can prompt me in custom English, Hindi, or Hinglish. I will automatically adapt structural recommendations contextually.
             </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${isDarkActive ? "bg-[#101017] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
           <span className="text-[10px] font-mono font-bold uppercase opacity-35 block mb-1">Oracle Handshake</span>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse" />
             <span className="text-[9px] font-mono opacity-60 font-bold uppercase tracking-widest">Protocol Sync verified</span>
           </div>
        </div>
      </div>

      {/* MAIN CHAT CONSOLE */}
      <div className={`flex-1 lg:col-span-9 rounded-2xl border flex flex-col overflow-hidden ${
        isDarkActive ? "bg-[#101017] border-white/5 shadow-2xl" : "bg-white border-black/10 shadow-lg"
      }`}>
        {/* Header bar */}
        <div className={`px-4 md:px-6 py-4 border-b flex items-center justify-between ${
          isDarkActive ? "bg-white/[0.02] border-white/5" : "bg-black/[0.01] border-black/10"
        }`}>
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg leading-none shadow-sm ${
               isDarkActive ? "bg-[#1A1A22] text-[#C9A96A]" : "bg-[#F0EBE0] text-[#9C7B3E]"
             }`}>
                Φ
             </div>
             <div>
                <h2 className="text-xs md:text-sm font-serif font-semibold tracking-tight">The Aegis AI Oracle</h2>
                <span className="text-[9px] md:text-[10px] opacity-40 font-mono font-bold uppercase tracking-wider leading-none">Universal sovereign intelligence core</span>
             </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-black/10 dark:bg-white/5 border border-current text-[9px] font-mono font-bold uppercase tracking-wider opacity-65">
            CLASS I SECURITY SYSTEM
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-5 no-scrollbar"
        >
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex items-start gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'assistant' 
                  ? "bg-black/10 text-[#C9A96A]" 
                  : isDarkActive ? "bg-white/5 text-[#EDEAE3]" : "bg-black/5 text-[#1A1A1F]"
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 md:w-5 md:h-5 text-current" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              
              <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-xs md:text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? (isDarkActive ? "bg-[#C9A96A] text-black font-semibold rounded-tr-none" : "bg-[#9C7B3E] text-white font-semibold rounded-tr-none")
                    : isDarkActive 
                      ? "bg-[#1A1A22] text-[#EDEAE3] border border-white/5 rounded-tl-none" 
                      : "bg-[#F7F5F0]/50 text-[#1A1A1F] border border-black/5 rounded-tl-none"
                }`}>
                  {msg.role === 'assistant' ? (
                    msg.isNew ? (
                      <TypewriterText text={msg.content} onComplete={() => handleClearIsNew(msg.id)} />
                    ) : (
                      <Markdown>{msg.content}</Markdown>
                    )
                  ) : msg.content}
                </div>
                <div className={`flex items-center gap-3 mt-0.5 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[8px] font-mono opacity-30">{msg.timestamp}</span>
                  <button 
                    onClick={() => handleCopyMsg(msg.id, msg.content)}
                    className="text-[9px] font-mono opacity-50 hover:opacity-100 flex items-center gap-1 cursor-pointer transition-all hover:text-[#C9A96A] select-none scale-102 hover:scale-105 active:scale-95"
                    title={msg.role === 'user' ? "Copy Question" : "Copy Answer"}
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-green-500" />
                        <span className="text-green-500 text-[8px] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span className="text-[8px]">{msg.role === 'user' ? "Copy" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-pulse">
               <div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-[#C9A96A] animate-spin" />
               </div>
               <div className={`px-3 py-1.5 rounded-xl text-[10px] font-mono opacity-50 ${isDarkActive ? "bg-white/5" : "bg-black/5"}`}>
                  Compiling sovereign cycles ledger...
               </div>
            </div>
          )}
        </div>

        {/* Chat input form */}
        <div className={`p-4 md:p-5 border-t ${isDarkActive ? "border-white/5 bg-[#14141A]" : "border-black/5 bg-[#F8FAFC]"}`}>
          <div className="flex gap-2 relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the Oracle (e.g., 'Analyze BTC macro support', 'hinglish query')..."
              className={`flex-1 h-12 pl-4 pr-14 rounded-xl border text-xs transition-all outline-none ${
                isDarkActive 
                  ? "bg-black text-white border-white/10 focus:border-[#C9A96A]/60" 
                  : "bg-white text-black border-black/10 focus:border-[#9C7B3E]/60"
              }`}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-1.5 top-1.5 h-9 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 select-none shadow cursor-pointer ${
                isDarkActive 
                  ? "bg-[#C9A96A] text-black hover:bg-[#B08A4E]" 
                  : "bg-[#9C7B3E] text-white hover:bg-[#7E602A]"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-[8px] font-mono font-bold uppercase opacity-20 tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Multi-Lingual Core
            </span>
            <span className="text-[8px] font-mono font-bold uppercase opacity-20 tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3" /> Geometric Analysis
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
