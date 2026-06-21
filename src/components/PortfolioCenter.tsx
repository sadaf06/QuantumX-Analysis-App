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
  FileSpreadsheet,
  Terminal
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
      
      {/* 1. PORTFOLIO EXECUTIVE HEADER */}
      <div className={`p-6 md:p-8 rounded-xl border relative overflow-hidden ${
        isDarkActive 
          ? "bg-[#0C0C0F] border-white/[0.04] shadow-xl" 
          : "bg-white border-black/[0.05] shadow-sm"
      }`}>
        
        {/* Subtle Fine-mesh Geometric Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <FileSpreadsheet className="w-52 h-52 text-[#14B8A6]" />
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] flex items-center gap-1.5 ${
                isDarkActive ? "text-[#14B8A6]" : "text-teal-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                AUDITED PRIME LIQUIDITY BALANCES // NAV LEDGER
              </span>
              <h1 className="text-2xl font-serif font-bold tracking-tight mt-1 text-current font-medium">
                Quantum X Prime Ledger
              </h1>
              <p className="text-xs opacity-50 mt-1 max-w-xl font-sans leading-relaxed">
                Active multi-currency institutional position allocations, aggregate spot values, risk ratios, and live transaction timelines.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-wider rounded border ${
                isDarkActive 
                  ? "bg-[#14B8A6]/5 border-[#14B8A6]/30 text-[#14B8A6]" 
                  : "bg-teal-50 border-teal-200 text-teal-800"
              }`}>
                PRIME BROKER LICENSE STATUS: ACTIVES SECURED
              </span>
            </div>
          </div>

          {/* MASTER METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            
            {/* Net Asset Valuation (NAV) */}
            <div className={`p-5 rounded-lg border ${
              isDarkActive ? "bg-[#121216] border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[105px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Net Asset Valuation (NAV)</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 tabular-nums text-current">
                  ${holdingsSummary.totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center gap-2.5 border-t border-current border-opacity-5 pt-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold flex items-center gap-1 ${
                  holdingsSummary.overallPnlDollars >= 0 
                    ? "bg-[#14B8A6]/10 text-[#14B8A6]" 
                    : "bg-red-500/10 text-red-500"
                }`}>
                  {holdingsSummary.overallPnlDollars >= 0 ? "+" : ""}{holdingsSummary.overallPnlPercent.toFixed(2)}%
                </span>
                <span className="text-[8px] opacity-40 font-mono tracking-wider uppercase font-bold">INCEPTION ACCELERATOR DELTA</span>
              </div>
            </div>

            {/* Liquid Cash Reserve */}
            <div className={`p-5 rounded-lg border ${
              isDarkActive ? "bg-[#121216] border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[105px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Prime Liquid Cash reserve</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 tabular-nums text-current">
                  ${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="w-full bg-current bg-opacity-5 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#14B8A6] h-full" style={{ width: `${(profile.balance / holdingsSummary.totalVal) * 100}%` }}></div>
              </div>
            </div>

            {/* Allocated Collateral Value */}
            <div className={`p-5 rounded-lg border ${
              isDarkActive ? "bg-[#121216] border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
            } flex flex-col justify-between h-[105px] transition-all`}>
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40 block">Allocated Collateral Allocation</span>
                <span className="text-xl font-mono font-bold tracking-tight block mt-1.5 text-[#14B8A6] tabular-nums">
                  ${holdingsSummary.cryptoVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="w-full bg-current bg-opacity-5 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#14B8A6] h-full" style={{ width: `${(holdingsSummary.cryptoVal / holdingsSummary.totalVal) * 100}%` }}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. ACTIVE POSITIONS REGISTRY */}
      <section className={`p-6 rounded-xl border ${
        isDarkActive 
          ? "bg-[#09090C] border-white/[0.04] shadow-lg" 
          : "bg-white border-black/[0.05] shadow-sm"
      }`}>
         <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4 mb-4">
            <Briefcase className={`w-3.5 h-3.5 ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`} />
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-current">Spot Asset Ledger Records</h2>
         </div>

         {holdingsSummary.items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 gap-2 font-mono">
               <Briefcase className="w-6 h-6 opacity-45 block" />
               <span className="text-[10px] font-bold uppercase tracking-widest">No spot currency units compiled</span>
               <p className="text-[9px] max-w-xs mx-auto leading-relaxed opacity-60">
                 Acquire token capital components under specific spot panels to register dynamic ledger values.
               </p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="text-[8px] text-left opacity-40 uppercase font-mono tracking-widest border-b pb-2 border-current border-opacity-5 font-bold">
                        <th className="pb-3 px-2">Spot Asset Token</th>
                        <th className="pb-3 text-right">Aggregated Holdings</th>
                        <th className="pb-3 text-right">Weighted Cost Base</th>
                        <th className="pb-3 text-right">System Spot Price</th>
                        <th className="pb-3 text-right">Total Net Balance</th>
                        <th className="pb-3 text-right">Weighted Drift (PNL)</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                     {holdingsSummary.items.map((item) => (
                        <tr key={item.symbol} className={`border-b border-white/[0.02] last:border-0 transition-colors ${
                          isDarkActive ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"
                        }`}>
                           <td className={`py-3.5 px-2 font-mono font-bold text-xs tracking-tight ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`}>
                             {item.symbol}
                           </td>
                           <td className="py-3.5 text-right font-medium tabular-nums">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 5 })}</td>
                           <td className="py-3.5 text-right opacity-60 tabular-nums">${item.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                           <td className="py-3.5 text-right font-medium tabular-nums">${item.livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                           <td className={`py-3.5 text-right font-bold tabular-nums ${isDarkActive ? "text-white" : "text-zinc-950"}`}>
                             ${item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className={`py-3.5 text-right font-bold tabular-nums ${item.pnlDollars >= 0 ? "text-[#14B8A6]" : "text-red-500"}`}>
                              <span>{item.pnlDollars >= 0 ? "+" : ""}${item.pnlDollars.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              <span className="block text-[8px] opacity-50 font-bold mt-0.5">({item.pnlPercent >= 0 ? "+" : ""}{item.pnlPercent.toFixed(2)}%)</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </section>

      {/* 3. CHRONOLOGICAL TRANSACTION TIMELINE */}
      <section className={`p-6 rounded-xl border ${
        isDarkActive 
          ? "bg-[#09090C] border-white/[0.04] shadow-lg" 
          : "bg-white border-black/[0.05] shadow-sm"
      }`}>
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 mb-4">
            <div className="flex items-center gap-2">
               <History className={`w-3.5 h-3.5 ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`} />
               <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">Audited Ledger Entry Log ({tradeHistoryTotal})</h2>
            </div>
            
            {/* PAGINATION */}
            {totalPages > 1 && (
               <div className="flex items-center gap-2 font-mono text-[8px] tracking-wider font-bold">
                  <button 
                     onClick={handlePrevPage}
                     disabled={currentPage === 1}
                     className={`p-1 px-2 border rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                       isDarkActive 
                         ? "bg-white/[0.02] border-white/10 hover:bg-white/5" 
                         : "bg-zinc-50 border-black/10 hover:bg-zinc-100"
                     }`}
                  >
                     <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="opacity-45 uppercase">PAGE {currentPage} OF {totalPages}</span>
                  <button 
                     onClick={handleNextPage}
                     disabled={currentPage === totalPages}
                     className={`p-1 px-2 border rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                       isDarkActive 
                         ? "bg-white/[0.02] border-white/10 hover:bg-white/5" 
                         : "bg-zinc-50 border-black/10 hover:bg-zinc-100"
                     }`}
                  >
                     <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            )}
         </div>

         {tradeHistoryTotal === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 gap-1.5 font-mono">
               <History className="w-6 h-6 opacity-45 mb-1" />
               <span className="text-[10px] font-bold uppercase tracking-widest">No chronological logs detected</span>
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
                        pnlImpactStr = `${isPositive ? "+" : ""}$${gain.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${isPositive ? "+" : ""}{changePercent.toFixed(2)}%)`;
                     }
                  } else {
                     pnlImpactStr = "Units spot escrow liquidation";
                  }

                  return (
                     <div key={trade.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded border text-[10px] gap-2 transition-all ${
                       isDarkActive 
                         ? "bg-[#121216] border-white/[0.04] hover:bg-white/[0.01]" 
                         : "bg-zinc-50 border-black/[0.05] hover:bg-zinc-100"
                     }`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-[8px] tracking-wide select-none ${
                              trade.type === "BUY" ? "bg-[#14B8A6]/10 text-[#14B8A6]" : "bg-red-500/10 text-red-500"
                           }`}>
                              {trade.type}
                           </div>
                           <div>
                              <span className={`font-mono font-bold text-xs ${isDarkActive ? "text-[#C5A880]" : "text-amber-800"}`}>{trade.symbol}</span>
                              <span className="opacity-40 font-bold ml-2">({trade.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS)</span>
                              <span className="block text-[7.5px] opacity-30 mt-0.5">{new Date(trade.timestamp).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 justify-between text-right">
                           <div>
                              <span className="block text-[7.5px] opacity-35 uppercase font-bold tracking-wider">Spot price at entry</span>
                              <span className="font-bold font-mono text-xs tabular-nums">${trade.priceAtTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div>
                              <span className="block text-[7.5px] opacity-35 uppercase font-bold tracking-wider">Unrealized Performance</span>
                              <span className={`font-bold font-mono text-xs tabular-nums ${trade.type === "BUY" ? (isPositive ? "text-[#14B8A6]" : "text-red-500") : `opacity-60 text-zinc-500`}`}>
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

      {/* Decorative fineprint banner */}
      <div className="flex items-center justify-center gap-2 opacity-20 text-[8px] font-mono uppercase tracking-[0.2em] py-3">
         <Terminal className="w-3.5 h-3.5" />
         Audited ledger network node active • multi-layer security validated
      </div>

    </div>
  );
};
