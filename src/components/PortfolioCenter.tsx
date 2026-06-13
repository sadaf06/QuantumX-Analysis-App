import React, { useState, useMemo } from "react";
import { 
  Briefcase, 
  Wallet, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Percent,
  CheckCircle2,
  Cpu,
  TrendingUp as TrendUp,
  FileSpreadsheet
} from "lucide-react";
import { CryptoAsset, UserProfile, Trade } from "../types";

interface Props {
  profile: UserProfile;
  trendingAssets: CryptoAsset[];
  isDarkActive: boolean;
}

export const PortfolioCenter: React.FC<Props> = ({ profile, trendingAssets, isDarkActive }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Compile map of symbols to live prices
  const livePrices = useMemo(() => {
    const map: { [symbol: string]: number } = {};
    trendingAssets.forEach(a => {
      map[a.symbol.toUpperCase()] = a.priceUsd;
    });
    return map;
  }, [trendingAssets]);

  // Calculate live holdings and aggregate metrics
  const holdingsSummary = useMemo(() => {
    let cryptoValueSum = 0;
    const items = Object.entries(profile.holdings).map(([symbol, rawHolding]) => {
      const holding = rawHolding as { amount: number; averagePrice: number };
      const livePrice = livePrices[symbol.toUpperCase()] || holding.averagePrice;
      const currentValue = holding.amount * livePrice;
      cryptoValueSum += currentValue;

      const totalCost = holding.amount * holding.averagePrice;
      const pnlDollars = currentValue - totalCost;
      const pnlPercent = holding.averagePrice > 0 ? (pnlDollars / totalCost) * 100 : 0;

      return {
        symbol,
        amount: holding.amount,
        averagePrice: holding.averagePrice,
        livePrice,
        currentValue,
        pnlDollars,
        pnlPercent
      };
    });

    const totalValue = profile.balance + cryptoValueSum;
    const initialBalance = 100000;
    const overallPnlDollars = totalValue - initialBalance;
    const overallPnlPercent = (overallPnlDollars / initialBalance) * 100;

    return {
      items,
      cryptoVal: cryptoValueSum,
      totalVal: totalValue,
      overallPnlDollars,
      overallPnlPercent
    };
  }, [profile.holdings, profile.balance, livePrices]);

  // Pagination for trade history
  const tradeHistoryTotal = profile.history.length;
  const totalPages = Math.max(1, Math.ceil(tradeHistoryTotal / ITEMS_PER_PAGE));
  const paginatedHistory = useMemo(() => {
    return profile.history.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [profile.history, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* 1. FUND MANAGER HEADER */}
      <div className={`p-6 md:p-8 rounded-2xl border ${
        isDarkActive 
          ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-xl" 
          : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
      } relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <FileSpreadsheet className="w-56 h-56 rotate-12 text-[#C9A96A]" />
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-1.5 ${
                isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse"></span>
                AUDITED DEPOSIT SECURED LEDGER
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight mt-1">
                Fund Manager Ledger
              </h1>
              <p className="text-xs opacity-55 mt-1 max-w-xl">
                Active institutional allocations interface. Inspect aggregate multi-currency NAV balances, spot allocation rates, and live audited transaction entries.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg ${
                isDarkActive ? "bg-[#C9A96A]/10 text-[#C9A96A]" : "bg-[#9C7B3E]/10 text-[#9C7B3E]"
              }`}>
                LICENSE STATUS: VERIFIED PRIME
              </span>
            </div>
          </div>

          {/* MASTER METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            
            {/* Total Net Asset Valuation */}
            <div className={`p-5 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-28`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Net Asset Valuation (NAV)</span>
                <span className={`text-xl md:text-2xl font-mono font-black tracking-tight block mt-1 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  ${holdingsSummary.totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black flex items-center gap-1 ${
                  holdingsSummary.overallPnlDollars >= 0 ? "bg-[#5EEAD4]/10 text-[#5EEAD4]" : "bg-[#E2675A]/10 text-[#E2675A]"
                }`}>
                  {holdingsSummary.overallPnlDollars >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {holdingsSummary.overallPnlDollars >= 0 ? "+" : ""}{holdingsSummary.overallPnlPercent.toFixed(2)}%
                </span>
                <span className="text-[8px] opacity-40 font-mono font-bold tracking-wider uppercase">Inception Delta (Ref: $100K)</span>
              </div>
            </div>

            {/* Liquid Cash Reserve */}
            <div className={`p-5 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-28`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Liquid Cash reserve</span>
                <span className={`text-xl md:text-2xl font-mono font-black tracking-tight block mt-1 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                  ${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-[#C9A96A] h-full" style={{ width: `${(profile.balance / holdingsSummary.totalVal) * 100}%` }}></div>
              </div>
            </div>

            {/* Allocated Collateral value */}
            <div className={`p-5 rounded-xl border ${
              isDarkActive ? "bg-black/30 border-white/5" : "bg-[#F7F5F0]/60 border-black/5"
            } flex flex-col justify-between h-28`}>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40 block">Allocated Collateral</span>
                <span className={`text-xl md:text-2xl font-mono font-black tracking-tight block mt-1 ${isDarkActive ? "text-[#EDEAE3]" : "text-[#5EEAD4]"}`}>
                  ${holdingsSummary.cryptoVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="w-full bg-black/20 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-[#5EEAD4] h-full" style={{ width: `${(holdingsSummary.cryptoVal / holdingsSummary.totalVal) * 100}%` }}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. LIVE POSITIONS REGISTRY */}
      <section className={`p-6 rounded-2xl border ${
        isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
      }`}>
         <div className="flex items-center gap-2.5 border-b pb-4 mb-4" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
            <Briefcase className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Active Positions Ledger</h2>
         </div>

         {holdingsSummary.items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 gap-1.5 font-mono">
               <Briefcase className="w-8 h-8 opacity-40 mb-1" />
               <span className="text-xs font-bold uppercase tracking-widest">No active spot balances allocated</span>
               <p className="text-[10px] leading-relaxed max-w-xs mx-auto mt-1">
                 Accumulate units on any asset detail center to synchronize core positions onto your audited fund ledger.
               </p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="text-[9px] text-left opacity-40 uppercase font-mono tracking-wider border-b pb-2 border-current">
                        <th className="pb-3 px-2">Asset Symbol</th>
                        <th className="pb-3 text-right">Units Held</th>
                        <th className="pb-3 text-right">Average Base</th>
                        <th className="pb-3 text-right">Market Spot</th>
                        <th className="pb-3 text-right">Net Value</th>
                        <th className="pb-3 text-right">Performance Impact</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                     {holdingsSummary.items.map((item) => (
                        <tr key={item.symbol} className={`border-b transition-colors ${
                          isDarkActive ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"
                        }`}>
                           <td className={`py-3.5 px-2 font-mono font-bold text-sm tracking-tight ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`}>
                             {item.symbol}
                           </td>
                           <td className="py-3.5 text-right font-medium">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 5 })}</td>
                           <td className="py-3.5 text-right opacity-60">${item.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                           <td className="py-3.5 text-right font-medium">${item.livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                           <td className={`py-3.5 text-right font-bold ${isDarkActive ? "text-[#EDEAE3]" : "text-[#1A1A1F]"}`}>
                             ${item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className={`py-3.5 text-right font-bold ${item.pnlDollars >= 0 ? "text-[#5EEAD4]" : "text-[#E2675A]"}`}>
                              <span>{item.pnlDollars >= 0 ? "+" : ""}${item.pnlDollars.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              <span className="block text-[8px] opacity-65 font-bold mt-0.5">({item.pnlPercent >= 0 ? "+" : ""}{item.pnlPercent.toFixed(2)}%)</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </section>

      {/* 3. CHRONOLOGICAL TRANSACTION TIMELINE */}
      <section className={`p-6 rounded-2xl border ${
        isDarkActive ? "bg-[#101017] border-[rgba(255,255,255,0.06)] shadow-lg" : "bg-white border-[rgba(26,26,31,0.06)] shadow-sm"
      }`}>
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4" style={{ borderColor: isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2.5">
               <History className={`w-4 h-4 ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`} />
               <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Audited TRANSACTION TIMELINE ({tradeHistoryTotal})</h2>
            </div>
            
            {/* PAGINATION */}
            {totalPages > 1 && (
               <div className="flex items-center gap-2 font-mono text-[9px]">
                  <button 
                     onClick={handlePrevPage}
                     disabled={currentPage === 1}
                     className={`p-1 px-2.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                       isDarkActive 
                         ? "bg-white/5 border-white/10 hover:bg-white/10" 
                         : "bg-black/5 border-black/10 hover:bg-black/10"
                     }`}
                  >
                     <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="opacity-55">PAGE {currentPage} OF {totalPages}</span>
                  <button 
                     onClick={handleNextPage}
                     disabled={currentPage === totalPages}
                     className={`p-1 px-2.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                       isDarkActive 
                         ? "bg-white/5 border-white/10 hover:bg-white/10" 
                         : "bg-black/5 border-black/10 hover:bg-black/10"
                     }`}
                  >
                     <ChevronRight className="w-3.5 h-3.5" />
                  </button>
               </div>
            )}
         </div>

         {tradeHistoryTotal === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 gap-1.5 font-mono">
               <History className="w-8 h-8 opacity-40 mb-1" />
               <span className="text-xs font-bold uppercase tracking-widest">No transaction timeline compiled</span>
            </div>
         ) : (
            <div className="flex flex-col gap-2.5 font-mono">
               {paginatedHistory.map((trade) => {
                  const currentLivePrice = livePrices[trade.symbol.toUpperCase()];
                  let pnlImpactStr = "—";
                  let isPositive = true;

                  if (trade.type === "BUY") {
                     if (currentLivePrice) {
                        const cost = trade.amount * trade.priceAtTrade;
                        const currValue = trade.amount * currentLivePrice;
                        const gain = currValue - cost;
                        isPositive = gain >= 0;
                        const changePercent = ((currentLivePrice - trade.priceAtTrade) / trade.priceAtTrade) * 100;
                        pnlImpactStr = `${isPositive ? "+" : ""}$${gain.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${isPositive ? "+" : ""}${changePercent.toFixed(2)}%)`;
                     }
                  } else {
                     pnlImpactStr = "Realized collateral liquidation";
                  }

                  return (
                     <div key={trade.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border text-[10px] gap-2 transition-all ${
                       isDarkActive 
                         ? "bg-black/20 border-white/5 hover:bg-white/[0.01]" 
                         : "bg-black/[0.01] border-black/5 hover:bg-black/[0.01]"
                     }`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[9px] select-none ${
                              trade.type === "BUY" ? "bg-[#5EEAD4]/10 text-[#5EEAD4]" : "bg-[#E2675A]/10 text-[#E2675A]"
                           }`}>
                              {trade.type}
                           </div>
                           <div>
                              <span className={`font-mono font-bold text-xs ${isDarkActive ? "text-[#C9A96A]" : "text-[#9C7B3E]"}`}>{trade.symbol}</span>
                              <span className="opacity-45 ml-2">({trade.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS)</span>
                              <span className="block text-[8px] opacity-30 mt-0.5">{new Date(trade.timestamp).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 justify-between text-right">
                           <div>
                              <span className="block text-[7.5px] opacity-35 uppercase font-bold tracking-wider">Execution spot</span>
                              <span className="font-bold font-mono text-xs">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div>
                              <span className="block text-[7.5px] opacity-35 uppercase font-bold tracking-wider">Current status</span>
                              <span className={`font-bold font-mono text-xs ${trade.type === "BUY" ? (isPositive ? "text-[#5EEAD4]" : "text-[#E2675A]") : `text-[#C9A96A] opacity-75`}`}>
                                 {pnlImpactStr}
                              </span>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </section>

    </div>
  );
};
