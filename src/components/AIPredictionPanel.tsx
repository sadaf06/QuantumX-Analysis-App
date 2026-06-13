import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AIPredictionPanel as AIPredictionPanelType } from '../types';

interface Props {
  data: AIPredictionPanelType;
  isDarkActive: boolean;
}

export const AIPredictionPanel: React.FC<Props> = ({ data, isDarkActive }) => {
  return (
    <section className={`p-8 rounded-2xl border ${
      isDarkActive ? "bg-[#13131A] border-[rgba(255,255,255,0.08)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.08)] shadow-sm"
    }`}>
      <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
        isDarkActive ? "border-white/5" : "border-black/5"
      }`}>
        <div className="flex items-center gap-2.5">
          <Activity className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">AI Predictive Model Projections</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-5 rounded-2xl border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-[#5EEAD4]/5 border-[#5EEAD4]/15 text-[#5EEAD4]" 
            : "bg-[#5EEAD4]/10 border-[#5EEAD4]/20 text-[#2D8E7E]"
        }`}>
           <TrendingUp className="w-5 h-5 mb-2 text-current" />
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Bullish Prob.</span>
           <span className="text-3xl font-bold font-mono tracking-tight text-current mt-1">{data.probabilities?.bullish || 0}%</span>
        </div>
        <div className={`p-5 rounded-2xl border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-[#E2675A]/5 border-[#E2675A]/15 text-[#E2675A]" 
            : "bg-[#E2675A]/10 border-[#E2675A]/20 text-[#B84E42]"
        }`}>
           <TrendingDown className="w-5 h-5 mb-2 text-current" />
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Bearish Prob.</span>
           <span className="text-3xl font-bold font-mono tracking-tight text-current mt-1">{data.probabilities?.bearish || 0}%</span>
        </div>
        <div className={`p-5 rounded-2xl border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-[#C9A96A]/5 border-[#C9A96A]/15 text-[#C9A96A]" 
            : "bg-[#9C7B3E]/10 border-[#9C7B3E]/20 text-[#9C7B3E]"
        }`}>
           <Minus className="w-5 h-5 mb-2 text-current" />
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Sideways Prob.</span>
           <span className="text-3xl font-bold font-mono tracking-tight text-current mt-1">{data.probabilities?.sideways || 0}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 font-sans">
        {[
          { title: 'Short-Term Horizon', outlook: data.outlooks?.shortTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Mid-Term Horizon', outlook: data.outlooks?.midTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Long-Term Horizon', outlook: data.outlooks?.longTerm || { forecast: "N/A", reasoning: "N/A" } },
        ].map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${
            isDarkActive 
              ? "bg-[#1A1A22] border-[rgba(255,255,255,0.08)]" 
              : "bg-[#F7F5F0]/60 border-[rgba(26,26,31,0.08)]"
          }`}>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 block ${
              isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
            }`}>{item.title}</span>
            <span className="text-sm font-bold block mb-1 tracking-tight">{item.outlook.forecast}</span>
            <span className="text-xs opacity-70 leading-relaxed block font-sans">{item.outlook.reasoning}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
