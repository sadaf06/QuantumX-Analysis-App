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
          color: "#FF3B69",
        },
        {
          name: "Greed",
          value: data.emotions?.greed ?? 0,
          color: "#00FF85",
        },
        {
          name: "Euphoria",
          value: data.emotions?.euphoria ?? 0,
          color: "#00D1FF",
        },
        {
          name: "Panic",
          value: data.emotions?.panic ?? 0,
          color: "#FF3B69",
        },
        {
          name: "FOMO",
          value: data.emotions?.fomo ?? 0,
          color: "#FFB800",
        },
        {
          name: "Capitulation",
          value: data.emotions?.capitulation ?? 0,
          color: "#8E44AD",
        },
  ];

  return (
    <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#FFB800]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">Market Psychology Engine</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {emotions.map((emo, idx) => (
           <div key={idx} className={`p-3 rounded-xl border flex flex-col items-center justify-center ${isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F8F9FA] border-black/5"}`}>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-2">{emo.name}</span>
              <div className="w-full bg-black/20 h-1.5 rounded-full mb-2 overflow-hidden flex">
                 <div className="h-full" style={{ width: `${emo.value}%`, backgroundColor: emo.color }}></div>
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: emo.color }}>{emo.value}/100</span>
           </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border ${isDarkActive ? "bg-[#FFB800]/5 border-[#FFB800]/20" : "bg-[#FFB800]/10 border-[#FFB800]/30"}`}>
        <div className="flex items-center gap-2 mb-2">
           <Users className="w-4 h-4 text-[#FFB800]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB800]">Crowd Positioning Estimate</span>
        </div>
        <p className="text-xs opacity-90 leading-relaxed font-sans">{data.crowdPositioningEstimate}</p>
      </div>
    </section>
  );
};
