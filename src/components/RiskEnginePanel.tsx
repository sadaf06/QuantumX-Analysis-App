import React from 'react';
import { Target, Activity, Zap, Shield, TrendingUp, ShieldAlert, Crosshair } from 'lucide-react';
import { RiskEngineLevel } from '../types';

interface Props {
  data: RiskEngineLevel;
  isDarkActive: boolean;
}

export const RiskEnginePanel: React.FC<Props> = ({ data, isDarkActive }) => {
  const getQualityColor = (rating: string) => {
    if (rating.includes("A")) return "#00FF85";
    if (rating.includes("B")) return "#00D1FF";
    return "#FFB800";
  };

  return (
    <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FF3B69]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">Risk Engine</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Signal Quality</span>
          <span className="text-sm font-black font-mono px-2 py-1 bg-white/5 border border-white/10 rounded" style={{ color: getQualityColor(data.signalQualityRating) }}>
            {data.signalQualityRating}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { name: "Confidence Score", value: data.confidenceScore ?? 0, icon: Target, color: "#00FF85" },
           { name: "Risk Score", value: data.riskScore ?? 0, icon: Shield, color: "#FF3B69" },
           { name: "Volatility Score", value: data.volatilityScore ?? 0, icon: Activity, color: "#FFB800" },
           { name: "Probability Score", value: data.probabilityScore ?? 0, icon: Crosshair, color: "#00D1FF" },
         ].map((stat, idx) => (
           <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center justify-center ${isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F8F9FA] border-black/5"}`}>
              <stat.icon className="w-5 h-5 mb-2 opacity-80" style={{ color: stat.color }} />
              <span className="text-[9px] uppercase font-black tracking-widest opacity-50 mb-1 text-center leading-tight h-6">{stat.name}</span>
              <span className="font-mono text-xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
           </div>
         ))}
      </div>
    </section>
  );
};
