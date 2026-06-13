import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, Brain, Users } from 'lucide-react';
import { MarketPsychologyEngine as MarketPsychologyEngineType } from '../types';

interface Props {
  data: MarketPsychologyEngineType;
  isDarkActive: boolean;
}

export const MarketPsychologyEngine: React.FC<Props> = ({ data, isDarkActive }) => {
  const emotions = [
    {
      name: "Fear",
      value: data.emotions?.fear ?? 0,
      color: "#E2675A",
    },
    {
      name: "Greed",
      value: data.emotions?.greed ?? 0,
      color: "#5EEAD4",
    },
    {
      name: "Euphoria",
      value: data.emotions?.euphoria ?? 0,
      color: "#C9A96A",
    },
    {
      name: "Panic",
      value: data.emotions?.panic ?? 0,
      color: "#E2675A",
    },
    {
      name: "FOMO",
      value: data.emotions?.fomo ?? 0,
      color: "#B08A4E",
    },
    {
      name: "Capitulation",
      value: data.emotions?.capitulation ?? 0,
      color: "#A78BFA",
    },
  ];

  return (
    <section className={`p-8 rounded-2xl border ${
      isDarkActive ? "bg-[#13131A] border-[rgba(255,255,255,0.08)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.08)] shadow-sm"
    }`}>
      <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
        isDarkActive ? "border-white/5" : "border-black/5"
      }`}>
        <div className="flex items-center gap-2.5">
          <Brain className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Market Psychology Indexing</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {emotions.map((emo, idx) => (
           <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
             isDarkActive ? "bg-[#1A1A22] border-[rgba(255,255,255,0.08)]" : "bg-[#F7F5F0]/60 border-[rgba(26,26,31,0.08)]"
           }`}>
              <span className="text-[9px] font-mono uppercase font-bold tracking-widest opacity-60 mb-2.5">{emo.name}</span>
              <div className="w-full bg-black/10 dark:bg-black/40 h-1.5 rounded-full mb-2.5 overflow-hidden flex">
                 <div className="h-full rounded-full" style={{ width: `${emo.value}%`, backgroundColor: emo.color }}></div>
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: emo.color }}>{emo.value}/100</span>
           </div>
        ))}
      </div>

      <div className={`p-5 rounded-2xl border ${
        isDarkActive 
          ? "bg-[#C9A96A]/5 border-[#C9A96A]/15 text-[#EDEAE3]" 
          : "bg-[#9C7B3E]/5 border-[#9C7B3E]/15 text-[#1A1A1F]"
      }`}>
        <div className="flex items-center gap-2 mb-2">
           <Users className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
           <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
             isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
           }`}>Crowd Positioning Estimate</span>
        </div>
        <p className="text-xs opacity-80 leading-relaxed font-sans">{data.crowdPositioningEstimate}</p>
      </div>
    </section>
  );
};
