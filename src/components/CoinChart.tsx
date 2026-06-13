import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoAsset } from '../types';

interface Props {
  asset: CryptoAsset;
  isDarkActive: boolean;
}

export const CoinChart: React.FC<Props> = ({ asset, isDarkActive }) => {
  const [data, setData] = useState<{time: number, price: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/coin/${asset.id}/history`);
        if (res.ok) {
          const raw = await res.json();
          if (active) {
            setData(raw);
          }
        }
      } catch (err) {
        console.error("Chart data error", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchHistory();
    return () => { active = false; };
  }, [asset.id]);

  if (loading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center opacity-40 gap-3">
        <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
          isDarkActive ? "border-[#C9A96A]" : "border-[#9C7B3E]"
        }`} />
        <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">syncing terminal coordinates...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center opacity-30">
        <span className="text-xs font-mono font-bold tracking-widest">CHART DATA TEMPORARILY OFFLINE</span>
      </div>
    );
  }

  const isUp = data[0].price <= data[data.length - 1].price;
  const color = isUp ? "#5EEAD4" : "#E2675A";

  return (
    <div className="w-full h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            hide 
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const date = new Date(payload[0].payload.time);
                return (
                  <div className={`p-4 rounded-xl border text-xs font-mono shadow-xl backdrop-blur-md ${
                    isDarkActive 
                      ? "bg-[#13131A]/95 border-[rgba(255,255,255,0.08)] text-[#EDEAE3]" 
                      : "bg-white/95 border-[rgba(26,26,31,0.08)] text-[#1A1A1F]"
                  }`}>
                    <div className="opacity-50 mb-1 font-mono text-[9px] uppercase tracking-wider">
                      {date.toLocaleString()}
                    </div>
                    <div className="font-bold text-sm tracking-tight text-current">
                      ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
