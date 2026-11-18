import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { CryptoAsset } from "../types";

interface Props {
  asset: CryptoAsset;
  isDarkActive: boolean;
}

interface ChartPoint {
  time: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  ema20?: number;
  ema50?: number;
  support1?: number;
  support2?: number;
  resistance1?: number;
  resistance2?: number;
}

export const CoinChart: React.FC<Props> = ({ asset, isDarkActive }) => {
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d" | "1w">("4h");
  const [showEma, setShowEma] = useState(true);
  const [showSR, setShowSR] = useState(true);
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/coin/${asset.id}/history?tf=${timeframe}`);
        if (res.ok) {
          const text = await res.text();
          if (text && !text.trim().startsWith("<")) {
            const raw = JSON.parse(text);
            if (active && Array.isArray(raw) && raw.length > 0) {
              setData(raw);
              return;
            }
          }
        }
      } catch {
        // Fallback below if server is restarting
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, [asset.id, timeframe]);

  const latestPoint = data[data.length - 1];
  const s1 = latestPoint?.support1;
  const r1 = latestPoint?.resistance1;

  const isUp = data.length > 1 ? data[0].price <= data[data.length - 1].price : true;
  const color = isUp ? "#14B8A6" : "#EF4444";

  const fmtVal = (v: number) => {
    if (!v) return "$0";
    return `$${Number(v).toLocaleString(undefined, {
      minimumFractionDigits: v > 1 ? 2 : 5,
      maximumFractionDigits: v > 1 ? 2 : 6
    })}`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* MULTI-TIMEFRAME & OVERLAY TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-1">
          {(["1h", "4h", "1d", "1w"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                timeframe === tf
                  ? isDarkActive
                    ? "bg-[#14B8A6] text-black border-[#14B8A6]"
                    : "bg-teal-700 text-white border-teal-700"
                  : isDarkActive
                  ? "bg-white/5 border-white/10 text-white/60 hover:text-white"
                  : "bg-zinc-100 border-black/10 text-black/60 hover:text-black"
              }`}
            >
              {tf.toUpperCase()} Chart
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[9px] font-mono">
          <button
            onClick={() => setShowSR(!showSR)}
            className={`px-2.5 py-1 rounded border font-bold uppercase cursor-pointer transition-all ${
              showSR
                ? "bg-[#C9A96A]/15 border-[#C9A96A]/40 text-[#C9A96A]"
                : "opacity-40 border-current/15"
            }`}
          >
            S/R Zones {showSR ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2.5 py-1 rounded border font-bold uppercase cursor-pointer transition-all ${
              showEma
                ? "bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]"
                : "opacity-40 border-current/15"
            }`}
          >
            EMA 20/50 {showEma ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* S/R LEGEND PILLS */}
      {latestPoint && (
        <div className="flex flex-wrap items-center gap-3 text-[9.5px] font-mono pb-1">
          <span className="px-2 py-0.5 rounded bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 font-bold">
            {timeframe.toUpperCase()} Support S1: {fmtVal(s1 || 0)}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 font-bold">
            {timeframe.toUpperCase()} Resistance R1: {fmtVal(r1 || 0)}
          </span>
          {showEma && (
            <>
              <span className="text-[#38BDF8] font-bold">
                • EMA20: {fmtVal(latestPoint.ema20 || 0)}
              </span>
              <span className="text-[#A855F7] font-bold">
                • EMA50: {fmtVal(latestPoint.ema50 || 0)}
              </span>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="w-full h-80 flex flex-col items-center justify-center opacity-40 gap-3">
          <div
            className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
              isDarkActive ? "border-[#14B8A6]" : "border-teal-700"
            }`}
          />
          <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">
            Syncing {timeframe.toUpperCase()} OHLCV & S/R levels...
          </span>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full h-80 flex items-center justify-center opacity-30">
          <span className="text-xs font-mono font-bold tracking-widest">
            CHART DATA TEMPORARILY OFFLINE
          </span>
        </div>
      ) : (
        <div className="w-full h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 15, right: 10, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`colorPrice_${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis yAxisId="price" domain={["auto", "auto"]} hide />
              <YAxis yAxisId="vol" orientation="right" domain={[0, (dataMax: number) => dataMax * 4.5]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt: ChartPoint = payload[0].payload;
                    const date = new Date(pt.time);
                    return (
                      <div
                        className={`p-3.5 rounded-xl border text-xs font-mono shadow-xl backdrop-blur-md space-y-1 ${
                          isDarkActive
                            ? "bg-[#13131A]/95 border-white/10 text-[#EDEAE3]"
                            : "bg-white/95 border-black/10 text-[#1A1A1F]"
                        }`}
                      >
                        <div className="opacity-50 font-mono text-[9px] uppercase tracking-wider">
                          {date.toLocaleString()} ({timeframe.toUpperCase()})
                        </div>
                        <div className="font-bold text-sm tracking-tight text-current">
                          Close: {fmtVal(pt.price)}
                        </div>
                        {pt.high && pt.low && (
                          <div className="text-[10px] opacity-75">
                            H: {fmtVal(pt.high)} | L: {fmtVal(pt.low)}
                          </div>
                        )}
                        {pt.ema20 && (
                          <div className="text-[9.5px] text-[#38BDF8]">
                            EMA20: {fmtVal(pt.ema20)} | EMA50: {fmtVal(pt.ema50 || 0)}
                          </div>
                        )}
                        {pt.volume !== undefined && (
                          <div className="text-[9.5px] text-[#C9A96A]">
                            Vol: ${(pt.volume / 1e6).toFixed(2)}M
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Volume Bars on secondary axis */}
              <Bar
                yAxisId="vol"
                dataKey="volume"
                fill={isDarkActive ? "rgba(201,169,106,0.18)" : "rgba(20,184,166,0.18)"}
                radius={[2, 2, 0, 0]}
              />

              {/* Support & Resistance Reference Lines */}
              {showSR && s1 && (
                <ReferenceLine
                  yAxisId="price"
                  y={s1}
                  stroke="#14B8A6"
                  strokeDasharray="4 4"
                  strokeWidth={1.2}
                />
              )}
              {showSR && r1 && (
                <ReferenceLine
                  yAxisId="price"
                  y={r1}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.2}
                />
              )}

              {/* Price Area */}
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorPrice_${asset.symbol})`}
              />

              {/* EMA Overlays */}
              {showEma && (
                <>
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="ema20"
                    stroke="#38BDF8"
                    strokeWidth={1.2}
                    dot={false}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="ema50"
                    stroke="#A855F7"
                    strokeWidth={1.2}
                    dot={false}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
