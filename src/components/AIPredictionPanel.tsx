import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AIPredictionPanel as AIPredictionPanelType } from '../types';

interface Props {
  data: AIPredictionPanelType;
  isDarkActive: boolean;
}

export const AIPredictionPanel: React.FC<Props> = ({ data, isDarkActive }) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* 3 Zones probabilities row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Bullish */}
        <div className={`p-4 rounded border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-[#14B8A6]/5 border-[#14B8A6]/15 text-[#14B8A6]" 
            : "bg-teal-50 border-teal-100 text-teal-850"
        }`}>
           <TrendingUp className="w-4.5 h-4.5 mb-1 text-current opacity-85" />
           <span className="text-[8px] uppercase font-mono font-bold tracking-widest opacity-60">Bull Probability</span>
           <span className="text-xl font-bold font-mono tracking-tight text-current mt-1.5 tabular-nums">{data.probabilities?.bullish || 0}%</span>
        </div>

        {/* Bearish */}
        <div className={`p-4 rounded border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-red-500/5 border-red-500/15 text-red-400" 
            : "bg-red-50 border-red-100 text-red-850"
        }`}>
           <TrendingDown className="w-4.5 h-4.5 mb-1 text-current opacity-85" />
           <span className="text-[8px] uppercase font-mono font-bold tracking-widest opacity-60">Bear Probability</span>
           <span className="text-xl font-bold font-mono tracking-tight text-current mt-1.5 tabular-nums">{data.probabilities?.bearish || 0}%</span>
        </div>

        {/* Sideways */}
        <div className={`p-4 rounded border flex flex-col justify-center items-center ${
          isDarkActive 
            ? "bg-[#C5A880]/5 border-[#C5A880]/15 text-[#C5A880]" 
            : "bg-amber-50 border-amber-100 text-amber-900"
        }`}>
           <Minus className="w-4.5 h-4.5 mb-1 text-current opacity-85" />
           <span className="text-[8px] uppercase font-mono font-bold tracking-widest opacity-60">Flat Probability</span>
           <span className="text-xl font-bold font-mono tracking-tight text-current mt-1.5 tabular-nums">{data.probabilities?.sideways || 0}%</span>
        </div>

      </div>

      {/* Vertical timeline details */}
      <div className="flex flex-col gap-3 font-sans">
        {[
          { title: 'Immediate Core Wave (Short-Term)', outlook: data.outlooks?.shortTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Intermediate Symmetry (Mid-Term)', outlook: data.outlooks?.midTerm || { forecast: "N/A", reasoning: "N/A" } },
          { title: 'Macro Cyclic Projection (Long-Term)', outlook: data.outlooks?.longTerm || { forecast: "N/A", reasoning: "N/A" } },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded border ${
            isDarkActive 
              ? "bg-[#121216]/60 border-white/[0.04]" 
              : "bg-zinc-50 border-black/[0.05]"
          }`}>
            <span className={`text-[8px] font-mono font-bold uppercase tracking-[0.16em] mb-1.5 block ${
              isDarkActive ? "text-[#C5A880]" : "text-amber-900"
            }`}>{item.title}</span>
            <span className="text-xs font-bold block mb-1 text-current tracking-tight">{item.outlook.forecast}</span>
            <span className="text-[11px] opacity-70 leading-relaxed block font-sans">{item.outlook.reasoning}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
