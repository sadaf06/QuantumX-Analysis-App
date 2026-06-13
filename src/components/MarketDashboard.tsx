import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ChevronRight, 
  RefreshCw,
  Activity,
  Radio
} from "lucide-react";
import { CryptoAsset, MarketGlobalStats } from "../types";

interface Props {
  marketStats: MarketGlobalStats | null;
  selectedCoinId: string;
  onSelectAsset: (asset: CryptoAsset) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: CryptoAsset[];
  isSearchFocused: boolean;
  setIsSearchFocused: (val: boolean) => void;
  notifications: string[];
  isDarkActive: boolean;
  timeSinceUpdate: number;
}

export const MarketDashboard: React.FC<Props> = ({
  marketStats,
  selectedCoinId,
  onSelectAsset,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearchFocused,
  setIsSearchFocused,
  notifications,
  isDarkActive,
  timeSinceUpdate
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-500">
      
      {/* SIDEBAR: SEARCH & LISTS */}
      <section className="lg:col-span-4 flex flex-col gap-6 w-full">
        
        {/* Search Panel */}
        <div className={`p-4 rounded-xl border relative transition-all ${
          isDarkActive 
            ? "bg-[#080D16]/90 border-white/10 shadow-xl" 
            : "bg-white border-black/10 shadow-sm"
        }`}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-extrabold opacity-40 mb-3 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" /> SECURE ASSET DISCOVERY
          </h3>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search symbol (e.g. SUI, BTC)..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 rounded-lg text-sm bg-transparent border outline-none font-medium transition-all ${
                isDarkActive 
                  ? "border-white/10 text-white placeholder-white/30 focus:border-[#00D1FF]/50" 
                  : "border-black/10 text-black placeholder-black/30 focus:border-[#0057FF]/50"
              }`}
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 opacity-40" />
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div className={`absolute left-0 right-0 mt-2 p-1.5 rounded-lg border z-50 max-h-64 overflow-y-auto shadow-2xl ${
              isDarkActive ? "bg-[#0A101A] border-white/10" : "bg-white border-black/10 text-black"
            }`}>
              {searchResults.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => {
                    onSelectAsset(coin);
                    setIsSearchFocused(false);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition-all text-left group ${
                    isDarkActive ? "hover:bg-white/5" : "hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs tracking-wider bg-white/5 px-1.5 py-0.5 rounded text-[#00D1FF]">{coin.symbol}</span>
                    <span className="text-xs font-bold">{coin.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">${coin.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className={`text-[10px] font-bold ${coin.changePercent24Hr >= 0 ? "text-[#00FF85]" : "text-[#FF3B69]"}`}>
                      {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(1)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist */}
        <div className={`p-4 rounded-xl border ${isDarkActive ? "bg-[#080D16]/90 border-white/10" : "bg-white border-black/10"}`}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-extrabold opacity-40 mb-3">INSTITUTIONAL CORE</h3>
          {marketStats ? (
            <div className="flex flex-col gap-1">
              {marketStats.trending.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => onSelectAsset(coin)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all group ${
                    selectedCoinId === coin.id 
                      ? (isDarkActive ? "bg-[#111A24] border-white/10" : "bg-[#EDF5FD] border-black/5")
                      : `hover:bg-white/5`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-bold text-[10px] text-[#00D1FF]">
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <span className="text-xs font-black tracking-tight">{coin.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold">
                      ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 text-[#00D1FF] transition-all ${selectedCoinId === coin.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center gap-2 opacity-30">
               <RefreshCw className="w-5 h-5 animate-spin" />
               <span className="text-[10px] font-bold">SYNCING ASSET FEED...</span>
            </div>
          )}
        </div>

        {/* Dynamic Activity Feed */}
        <div className={`p-4 rounded-xl border border-dashed transition-all ${
          isDarkActive ? "bg-[#080D16]/50 border-white/5 text-white/40" : "bg-white border-black/5 text-black/40"
        }`}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-extrabold opacity-40 mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00D1FF]" /> SYSTEM TELEMETRY
          </h3>
          <div className="flex flex-col gap-2 font-mono text-[9px]">
            {notifications.slice(0, 4).map((note, idx) => (
              <div key={idx} className="flex gap-2 leading-tight">
                <span className="text-[#00D1FF]">PROMETHEUS:</span>
                <p className="truncate">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN FEED: GRID OF ASSETS */}
      <section className="lg:col-span-8 flex flex-col gap-6 w-full">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GAINERS */}
            <div className={`p-5 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10"}`}>
               <h2 className="text-xs font-black text-[#00FF85] tracking-widest uppercase mb-4 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4" /> ALPHA GAINERS
               </h2>
               <div className="flex flex-col gap-2">
                  {marketStats?.gainers.map((coin) => (
                    <button key={coin.id} onClick={() => onSelectAsset(coin)} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                      <span className="text-xs font-bold">{coin.name} <span className="opacity-40 ml-1">{coin.symbol}</span></span>
                      <span className="text-xs font-mono font-black text-[#00FF85]">+{coin.changePercent24Hr.toFixed(1)}%</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* LOSERS */}
            <div className={`p-5 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10"}`}>
               <h2 className="text-xs font-black text-[#FF3B69] tracking-widest uppercase mb-4 flex items-center gap-2">
                 <TrendingDown className="w-4 h-4" /> VOLATILITY RISK
               </h2>
               <div className="flex flex-col gap-2">
                  {marketStats?.losers.map((coin) => (
                    <button key={coin.id} onClick={() => onSelectAsset(coin)} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                      <span className="text-xs font-bold">{coin.name} <span className="opacity-40 ml-1">{coin.symbol}</span></span>
                      <span className="text-xs font-mono font-black text-[#FF3B69]">{coin.changePercent24Hr.toFixed(1)}%</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* FULL MARKET LIST (TOP 20) */}
         <div className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/10" : "bg-white border-black/10"}`}>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest">LIVE QUANT FEED (TOP 50)</h2>
                <div className="text-[10px] font-mono opacity-40">AUTO-REFRESH: {timeSinceUpdate}S</div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="text-[10px] text-left opacity-30 uppercase font-black border-b border-white/5">
                         <th className="pb-3 px-2">#</th>
                         <th className="pb-3">Symbol</th>
                         <th className="pb-3 text-right">Price (USD)</th>
                         <th className="pb-3 text-right">24H Δ</th>
                         <th className="pb-3 text-right hidden md:table-cell">Market Cap</th>
                         <th className="pb-3 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs">
                      {marketStats?.trending.slice(0, 20).map((coin) => (
                         <tr key={coin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="py-4 px-2 font-mono opacity-40">{coin.rank}</td>
                            <td className="py-4">
                               <div className="flex flex-col">
                                  <span className="font-black text-[#00D1FF]">{coin.symbol}</span>
                                  <span className="text-[10px] opacity-40 font-bold">{coin.name}</span>
                               </div>
                            </td>
                            <td className="py-4 text-right font-mono font-bold">
                               ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: coin.priceUsd > 100 ? 2 : 5 })}
                            </td>
                            <td className={`py-4 text-right font-mono font-black ${coin.changePercent24Hr >= 0 ? "text-[#00FF85]" : "text-[#FF3B69]"}`}>
                               {coin.changePercent24Hr >= 0 ? "+" : ""}{coin.changePercent24Hr.toFixed(1)}%
                            </td>
                            <td className="py-4 text-right opacity-40 hidden md:table-cell">
                               ${(coin.marketCapUsd / 1e9).toFixed(1)}B
                            </td>
                            <td className="py-4 text-right">
                               <button 
                                 onClick={() => onSelectAsset(coin)}
                                 className="px-3 py-1.5 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] font-black text-[10px] hover:bg-[#00D1FF] hover:text-black transition-all uppercase tracking-tighter"
                               >
                                  TRADE / SCAN
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>

         <div className="flex items-center gap-4 text-[10px] font-mono opacity-20 uppercase tracking-widest justify-center py-6">
            <Radio className="w-3 h-3 text-[#00FF85] animate-pulse" />
            Terminal active • Live WebSocket proxy enabled • VWAP feed stable
         </div>
      </section>

    </div>
  );
};
