import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, Globe, FileText } from 'lucide-react';
import { NewsIntelligenceEvent } from '../types';

interface Props {
  data: NewsIntelligenceEvent[];
  isDarkActive: boolean;
}

export const NewsIntelligenceSystem: React.FC<Props> = ({ data, isDarkActive }) => {
  return (
    <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#8E44AD]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">News Intelligence System</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex gap-4 ${isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F8F9FA] border-black/5"}`}>
             <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-lg bg-black/20 w-16 h-16">
                <span className="text-[10px] uppercase font-black opacity-50 mb-1">Impact</span>
                <span className="font-mono text-sm font-bold text-[#8E44AD]">{item.impactScore}</span>
             </div>
             <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-[#8E44AD]/20 text-[#8E44AD] px-2 py-0.5 rounded-full">{item.category}</span>
                  <span className="text-sm font-bold">{item.title}</span>
                </div>
                <span className="text-[11px] opacity-70 leading-relaxed max-w-xl">{item.summary}</span>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="p-4 rounded-xl border border-dashed flex flex-col items-center justify-center opacity-50">
            <span className="text-xs uppercase font-black tracking-widest">No major events detected</span>
          </div>
        )}
      </div>
    </section>
  );
};
