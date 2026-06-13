import React from 'react';
import { Calendar, TrendingUp, Activity, Target, ShieldCheck } from 'lucide-react';

interface Props {
  forecast: {
    expectedPrice: string;
    probability: number;
    reasoning: string;
  };
  isDarkActive: boolean;
}

export const FiveYearForecastPanel: React.FC<Props> = ({ forecast, isDarkActive }) => {
  return (
    <section className={`p-6 rounded-2xl border relative overflow-hidden ${
      isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10 shadow-sm"
    }`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Calendar className="w-32 h-32 rotate-12" />
      </div>

      <div className="flex items-center gap-2 mb-6 border-b pb-4" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <TrendingUp className="w-5 h-5 text-[#00FF85]" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">5-Year Quantum Projection</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Estimated 2031 Valuation</span>
            <span className="text-4xl font-black font-mono text-[#00FF85] tracking-tighter">{forecast.expectedPrice}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Mathematical Probability</span>
              <span className="text-sm font-black font-mono text-[#00FF85]">{forecast.probability}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#00FF85] to-[#00D1FF] transition-all duration-1000" 
                style={{ width: `${forecast.probability}%` }}
              />
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${isDarkActive ? "bg-white/5 border-white/10" : "bg-[#F8F9FA] border-black/5"}`}>
          <div className="flex items-center gap-2 mb-3">
             <ShieldCheck className="w-4 h-4 text-[#00D1FF]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#00D1FF]">Algorithmic Multi-Year Conclusion</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80 italic">
            "{forecast.reasoning}"
          </p>
        </div>
      </div>
    </section>
  );
};
