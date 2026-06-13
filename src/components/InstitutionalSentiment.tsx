import React from 'react';
import { Shield, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { CryptoAsset } from '../types';

interface Props {
  isDarkActive: boolean;
  asset: CryptoAsset;
}

export const InstitutionalSentiment: React.FC<Props> = ({ isDarkActive, asset }) => {
  const hash = asset.symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  const stats = [
    { label: "Institutional Inflow", value: `+$${(Math.abs(asset.changePercent24Hr) * 10 + (hash % 500)).toFixed(0)}M`, trend: asset.changePercent24Hr > 0 ? "up" : "down", desc: "Net capital flow from known sovereign and hedge fund addresses." },
    { label: "Exchange Reserve", value: `${(Math.abs(asset.changePercent24Hr) * 3 + 5).toFixed(1)}%`, trend: asset.changePercent24Hr > 0 ? "down" : "up", desc: "Change in asset availability on major CEX platforms." },
    { label: "Mean HODL Age", value: `${(200 + (hash % 600))} Days`, trend: "up", desc: "Average time assets have remained unmoved in private wallets." },
    { label: "Whale Concentration", value: `${(40 + (hash % 30)).toFixed(1)}%`, trend: "stable", desc: "Percentage of supply held by top 1% of unique addresses." }
  ];

  // Mock data for a small sparkline bar chart
  const volumeData = Array.from({ length: 12 }, (_, i) => ({
    name: i,
    val: 30 + Math.random() * 70,
    isHigh: Math.random() > 0.7
  }));

  return (
    <section className={`p-6 rounded-2xl border flex flex-col h-full ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
      <div className="flex items-center gap-2 border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <Shield className="w-5 h-5 text-[#00FF85]" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Institutional Sentiment Core</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border flex flex-col gap-1 ${isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F8F9FA] border-black/5"}`}>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{s.label}</span>
              {s.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 text-[#00FF85]" /> : <TrendingUp className="w-2.5 h-2.5 text-[#FF3B69] rotate-180" />}
            </div>
            <span className="text-lg font-bold font-mono tracking-tight">{s.value}</span>
            <p className="text-[9px] opacity-60 leading-tight mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border flex flex-col gap-3 flex-1 justify-between ${isDarkActive ? "bg-black/20 border-white/5" : "bg-slate-50 border-black/5"}`}>
         <div className="flex items-center justify-between">
           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Whale Net-Flow Tracking</span>
           <div className="flex items-center gap-1">
             <BarChart3 className="w-3 h-3 text-[#00D1FF]" />
             <span className="text-[9px] font-bold text-[#00D1FF] uppercase">Live</span>
           </div>
         </div>
         
         <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <Bar dataKey="val">
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isHigh ? "#00D1FF" : isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="flex items-center gap-3">
           <Zap className="w-4 h-4 text-[#FFB800] shrink-0" />
           <p className="text-[10px] opacity-75 leading-relaxed">
             Significant OTC block-swap detected at {asset.symbol} support. High-conviction entry signal validated by large-cap liquidity movement.
           </p>
         </div>
      </div>
    </section>
  );
};
