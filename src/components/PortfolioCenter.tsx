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
  Percent
} from "lucide-react";
import { CryptoAsset, UserProfile, Trade } from "../types";

interface Props {
  profile: UserProfile;
  trendingAssets: CryptoAsset[];
  isDarkActive: boolean;
}

export const PortfolioCenter: React.FC<Props> = ({ profile, trendingAssets, isDarkActive }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* PORTFOLIO METRICS HEADER */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Value */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkActive ? "bg-[#09111C] border-[#00D1FF]/10 shadow-2xl" : "bg-white border-black/10 shadow-md"
        }`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></span>
              Portfolio Net Asset Valuation
            </span>
            <div className="text-3xl font-black font-mono tracking-tight text-[#00D1FF]">
              ${holdingsSummary.totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
              holdingsSummary.overallPnlDollars >= 0 ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-[#FF3B69]/10 text-[#FF3B69]"
            }`}>
              {holdingsSummary.overallPnlDollars >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {holdingsSummary.overallPnlDollars >= 0 ? "+" : ""}{holdingsSummary.overallPnlDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">
              {holdingsSummary.overallPnlPercent >= 0 ? "Gain" : "Drawdown"} Since Inception
            </span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkActive ? "bg-[#080D16] border-white/5 shadow-lg" : "bg-white border-black/10 shadow-sm"
        }`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 opacity-60" /> Available Liquid Capital
            </span>
            <div className="text-2xl font-black font-mono tracking-tight">
              ${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] opacity-35 font-mono mt-3">Ready spot buying power on paper ledger.</span>
        </div>

        {/* Crypto Value */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkActive ? "bg-[#080D16] border-white/5 shadow-lg" : "bg-white border-black/10 shadow-sm"
        }`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800] opacity-80" /> Active Crypto Assets
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-[#00FF85]">
              ${holdingsSummary.cryptoVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] opacity-35 font-mono mt-3">Live valuation of current spot holdings.</span>
        </div>

      </section>

      {/* ACTIVE SPOTS DETAILS */}
      <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
         <div className="flex items-center gap-2 border-b border-light pb-4 mb-4" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <Briefcase className="w-5 h-5 text-[#00D1FF]" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">CURRENT LEDGER POSITION</h2>
         </div>

         {holdingsSummary.items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
               <Briefcase className="w-10 h-10 mb-3" />
               <span className="text-xs font-bold uppercase tracking-widest">No active spot positions held on ledger</span>
               <p className="text-[10px] font-mono mt-1">Select an asset from the direct trade desk to accumulate units.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="text-[10px] text-light border-b text-left opacity-30 uppercase font-black" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                        <th className="pb-3 px-2">Asset</th>
                        <th className="pb-3 text-right">Units Held</th>
                        <th className="pb-3 text-right">Avg Entry</th>
                        <th className="pb-3 text-right">Current Price</th>
                        <th className="pb-3 text-right">Current Value</th>
                        <th className="pb-3 text-right">P/L Impact</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                     {holdingsSummary.items.map((item) => (
                        <tr key={item.symbol} className="border-b border-light hover:bg-white/5 transition-all" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                           <td className="py-4 px-2 font-sans font-black text-[#00D1FF]">{item.symbol}</td>
                           <td className="py-4 text-right font-bold">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                           <td className="py-4 text-right opacity-60">${item.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</td>
                           <td className="py-4 text-right font-bold">${item.livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</td>
                           <td className="py-4 text-right font-black text-white">${item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           <td className={`py-4 text-right font-bold ${item.pnlDollars >= 0 ? "text-[#00FF85]" : "text-[#FF3B69]"}`}>
                              <span>{item.pnlDollars >= 0 ? "+" : ""}{item.pnlDollars.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              <span className="block text-[8px] opacity-70">({item.pnlPercent >= 0 ? "+" : ""}{item.pnlPercent.toFixed(2)}%)</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </section>

      {/* PAPER TRADING HISTORY */}
      <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
         <div className="flex justify-between items-center border-b border-light pb-4 mb-4" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2">
               <History className="w-5 h-5 text-[#FF8A00]" />
               <h2 className="text-sm font-black uppercase tracking-[0.2em]">COMPLETE ACCOUNTS LEDGER ({tradeHistoryTotal})</h2>
            </div>
            
            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
               <div className="flex items-center gap-2">
                  <button 
                     onClick={handlePrevPage}
                     disabled={currentPage === 1}
                     className="p-1 px-2 rounded bg-white/5 border border-white/10 text-[9px] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                     <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono opacity-50">Page {currentPage} of {totalPages}</span>
                  <button 
                     onClick={handleNextPage}
                     disabled={currentPage === totalPages}
                     className="p-1 px-2 rounded bg-white/5 border border-white/10 text-[9px] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                     <ChevronRight className="w-3.5 h-3.5" />
                  </button>
               </div>
            )}
         </div>

         {tradeHistoryTotal === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
               <History className="w-10 h-10 mb-3" />
               <span className="text-xs font-bold uppercase tracking-widest">No paper trades executed yet</span>
            </div>
         ) : (
            <div className="flex flex-col gap-2">
               {paginatedHistory.map((trade) => {
                  // Calculate dynamic transaction profit impact if possible
                  const currentLivePrice = livePrices[trade.symbol.toUpperCase()];
                  let pnlImpactStr = "—";
                  let isPositive = true;

                  if (trade.type === "BUY") {
                     // Buying has an active paper P&L impact relative to the current market price
                     if (currentLivePrice) {
                        const cost = trade.amount * trade.priceAtTrade;
                        const currValue = trade.amount * currentLivePrice;
                        const gain = currValue - cost;
                        isPositive = gain >= 0;
                        const changePercent = ((currentLivePrice - trade.priceAtTrade) / trade.priceAtTrade) * 100;
                        pnlImpactStr = `${isPositive ? "+" : ""}$${gain.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${isPositive ? "+" : ""}${changePercent.toFixed(2)}%)`;
                     }
                  } else {
                     // Sells have a realized profit impact against average buy price at sell time if known, 
                     // or we can compute relative to price differences
                     pnlImpactStr = "Realized Position Lift";
                  }

                  return (
                     <div key={trade.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] gap-2 hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${
                              trade.type === "BUY" ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-[#FF3B69]/10 text-[#FF3B69]"
                           }`}>
                              {trade.type}
                           </div>
                           <div>
                              <span className="font-sans font-black text-[#00D1FF]">{trade.symbol}</span>
                              <span className="opacity-40 font-mono ml-2">({trade.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS)</span>
                              <span className="block text-[9px] opacity-35 font-mono mt-0.5">{new Date(trade.timestamp).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 justify-between text-right font-mono">
                           <div>
                              <span className="block text-[8px] opacity-30 uppercase font-bold">Execution Price</span>
                              <span className="font-bold">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div>
                              <span className="block text-[8px] opacity-30 uppercase font-bold">P/L Impact</span>
                              <span className={`font-black ${trade.type === "BUY" ? (isPositive ? "text-[#00FF85]" : "text-[#FF3B69]") : "text-[#00D1FF] opacity-75"}`}>
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
