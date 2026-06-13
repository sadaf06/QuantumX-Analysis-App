import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AIPredictionPanel as AIPredictionPanelType } from '../types';

interface Props {
  data: AIPredictionPanelType;
  isDarkActive: boolean;
}

export const AIPredictionPanel: React.FC<Props> = ({ data, isDarkActive }) => {
  return (
    <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00D1FF]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">AI Prediction Panel</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center ${isDarkActive ? "bg-[#00FF85]/5 border-[#00FF85]/20" : "bg-[#00FF85]/10 border-[#00FF85]/30"}`}>
           <TrendingUp className="w-6 h-6 text-[#00FF85] mb-2" />
           <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Bullish</span>
           <span className="text-2xl font-bold font-mono text-[#00FF85]">{data.probabilities?.bullish || 0}%</span>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center ${isDarkActive ? "bg-[#FF3B69]/5 border-[#FF3B69]/20" : "bg-[#FF3B69]/10 border-[#FF3B69]/30"}`}>
           <TrendingDown className="w-6 h-6 text-[#FF3B69] mb-2" />
           <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Bearish</span>
           <span className="text-2xl font-bold font-mono text-[#FF3B69]">{data.probabilities?.bearish || 0}%</span>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center ${isDarkActive ? "bg-[#FFB800]/5 border-[#FFB800]/20" : "bg-[#FFB800]/10 border-[#FFB800]/30"}`}>
           <Minus className="w-6 h-6 text-[#FFB800] mb-2" />
           <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Sideways</span>
           <span className="text-2xl font-bold font-mono text-[#FFB800]">{data.probabilities?.sideways || 0}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { title: 'Short-Term Outlook', outlook: data.outlooks?.shortTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Mid-Term Outlook', outlook: data.outlooks?.midTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Long-Term Outlook', outlook: data.outlooks?.longTerm || { forecast: "N/A", reasoning: "N/A" } },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F8F9FA] border-black/5"}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00D1FF] mb-1 block">{item.title}</span>
            <span className="text-sm font-bold block mb-1">{item.outlook.forecast}</span>
            <span className="text-[11px] opacity-70 leading-relaxed block">{item.outlook.reasoning}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
