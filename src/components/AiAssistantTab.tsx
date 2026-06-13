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
  Globe
} from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  isDarkActive: boolean;
}

export const AiAssistantTab: React.FC<Props> = ({ isDarkActive }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Greetings. I am **The Oracle**, your institutional-grade trading cognitive partner. I specialize in identifying high-probability market shifts, geometric price symmetries, and mathematical trend exhaustions.\n\nHow can I refine your market strategy today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Network congestion detected in the Quantum relay.');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: "Structural feedback loop detected. Connectivity with the Oracle Core is temporarily unstable. Please re-synchronize your inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] md:h-[calc(100vh-250px)] min-h-[500px]">
      {/* Sidebar Info - Hidden on mobile for space, visible on desktop */}
      <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
        <div className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[#00D1FF]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#00D1FF]">Cognitive Specs</h2>
          </div>
          <div className="flex flex-col gap-3">
             {[
               { icon: <Globe className="w-3 h-3" />, label: "Dynamic Multi-Lingual", status: "Active" },
               { icon: <TrendingUp className="w-3 h-3" />, label: "Institutional Intel", status: "Enabled" },
               { icon: <ShieldCheck className="w-3 h-3" />, label: "Risk Calibration", status: "Nominal" },
               { icon: <Zap className="w-3 h-3" />, label: "Low-Latency Core", status: "Online" }
             ].map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 opacity-60">
                   {item.icon}
                   <span className="text-[10px] font-bold uppercase">{item.label}</span>
                 </div>
                 <span className="text-[8px] font-black uppercase text-[#00FF85]">{item.status}</span>
               </div>
             ))}
          </div>
          <div className="mt-6 p-4 bg-[#FFB800]/5 rounded-xl border border-[#FFB800]/20">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles className="w-3 h-3 text-[#FFB800]" />
               <span className="text-[10px] font-black uppercase text-[#FFB800]">Heuristic Learning</span>
             </div>
             <p className="text-[10px] opacity-60 leading-relaxed italic">
               "Teach me your techniques (Hinglish/English). I will integrate your logic into my session-memory and apply it to market data."
             </p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border mt-auto ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
           <span className="text-[10px] font-black uppercase opacity-35 block mb-2">Oracle Sync</span>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
             <span className="text-[10px] font-mono opacity-60 font-bold uppercase tracking-widest">Protocol Verified</span>
           </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className={`flex-1 lg:col-span-9 rounded-2xl border flex flex-col overflow-hidden ${isDarkActive ? "bg-[#080E16] border-white/10" : "bg-white border-black/10 shadow-xl"}`}>
        {/* Chat Header */}
        <div className={`px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between ${isDarkActive ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}`}>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#00D1FF] to-[#0057FF] flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-black" />
             </div>
             <div>
                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest">The Oracle</h2>
                <span className="text-[8px] md:text-[10px] opacity-40 font-mono font-bold uppercase">Multi-Lingual Market Core</span>
             </div>
          </div>
          <div className="px-2 md:px-3 py-1 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
            Institutional
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-6 no-scrollbar"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'assistant' 
                  ? "bg-[#00D1FF] text-black" 
                  : isDarkActive ? "bg-white/10 text-white" : "bg-black/10 text-black"
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              
              <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 md:px-5 md:py-3.5 rounded-2xl text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? "bg-[#00D1FF] text-black font-semibold rounded-tr-none"
                    : isDarkActive 
                      ? "bg-[#111A29] text-[#E2E8F0] border border-white/5 rounded-tl-none" 
                      : "bg-[#F8FAFC] text-[#0F172A] border border-black/5 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] md:text-[10px] font-mono opacity-30 px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-pulse">
               <div className="w-7 h-7 rounded-lg bg-[#00D1FF]/20 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-[#00D1FF] animate-spin" />
               </div>
               <div className={`px-4 py-2 rounded-2xl text-[11px] font-mono opacity-50 ${isDarkActive ? "bg-[#111A29]" : "bg-[#F8FAFC]"}`}>
                  Analyzing high-dimensional cycles...
               </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className={`p-4 md:p-6 border-t ${isDarkActive ? "border-white/10 bg-[#0A101A]" : "border-black/5 bg-[#F8FAFC]"}`}>
          <div className="flex gap-2 md:gap-3 relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything (English/Hindi/Hinglish)..."
              className={`flex-1 h-12 md:h-14 pl-4 md:pl-6 pr-12 md:pr-14 rounded-xl md:rounded-2xl border text-[13px] md:text-sm transition-all focus:ring-2 focus:ring-[#00D1FF]/30 outline-none ${
                isDarkActive 
                  ? "bg-black text-white border-white/10 focus:border-[#00D1FF]" 
                  : "bg-white text-black border-black/10 focus:border-[#00D1FF]"
              }`}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1.5 h-9 w-9 md:h-11 md:w-11 bg-[#00D1FF] text-black rounded-lg md:rounded-xl flex items-center justify-center transition-all hover:bg-[#00B2D8] disabled:opacity-40 disabled:scale-95 shadow-lg active:scale-95"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-4 md:gap-6 mt-3 md:mt-4">
            <span className="text-[8px] md:text-[9px] font-black uppercase opacity-20 tracking-widest flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" /> All Languages
            </span>
            <span className="text-[8px] md:text-[9px] font-black uppercase opacity-20 tracking-widest flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> High AI Intelligence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
