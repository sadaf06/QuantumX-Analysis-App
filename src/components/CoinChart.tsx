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
      <div className="w-full h-64 flex items-center justify-center opacity-50">
        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading Chart Data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center opacity-30">
        <span className="text-xs font-bold uppercase tracking-widest">Chart data unavailable</span>
      </div>
    );
  }

  const isUp = data[0].price <= data[data.length - 1].price;
  const color = isUp ? "#00FF85" : "#FF3B69";

  return (
    <div className="w-full h-72 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
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
                  <div className={`p-2 rounded border text-xs font-mono shadow-xl ${isDarkActive ? "bg-black border-white/10 text-white" : "bg-white border-black/10 text-black"}`}>
                    <div className="opacity-50 mb-1">{date.toLocaleString()}</div>
                    <div className="font-bold">
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
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
