import React, { useState } from "react";
import { 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  History,
  TrendingUp,
  AlertCircle,
  Terminal
} from "lucide-react";
import { CryptoAsset, UserProfile, Trade } from "../types";

interface Props {
  asset: CryptoAsset;
  profile: UserProfile;
  onTrade: (trade: Omit<Trade, "id" | "timestamp">) => void;
  isDarkActive: boolean;
}

export const PaperTrading: React.FC<Props> = ({ asset, profile, onTrade, isDarkActive }) => {
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const holding = profile.holdings[asset.symbol] || { amount: 0, averagePrice: 0 };
  const totalValue = holding.amount * asset.priceUsd;
  const pl = holding.amount > 0 ? (asset.priceUsd - holding.averagePrice) * holding.amount : 0;
  const plPercent = holding.averagePrice > 0 ? ((asset.priceUsd - holding.averagePrice) / holding.averagePrice) * 100 : 0;

  const handleAction = () => {
    setError(null);
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid spot quantity");
      return;
    }

    if (tradeType === "BUY") {
      const cost = numAmount * asset.priceUsd;
      if (cost > profile.balance) {
        setError(`Insufficient ledger balance. Capital required: $${cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        return;
      }
    } else {
      if (numAmount > holding.amount) {
        setError(`Insufficient holdings. Max trade allowed: ${holding.amount} ${asset.symbol}`);
        return;
      }
    }

    onTrade({
      type: tradeType,
      assetId: asset.id,
      symbol: asset.symbol,
      priceAtTrade: asset.priceUsd,
      amount: numAmount
    });
    setAmount("");
  };

  return (
    <div className={`p-6 rounded-xl border h-full flex flex-col justify-between ${
      isDarkActive 
        ? "bg-[#09090C] border-white/[0.04] shadow-lg" 
        : "bg-white border-black/[0.05] shadow-sm"
    }`}>
      <div>
        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4 mb-5">
          <Terminal className="w-4 h-4 text-[#14B8A6]" />
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-current">Spot Operations Execution</h2>
        </div>

        <div className="flex flex-col gap-5">
          {/* AVAILABLE RESERVE */}
          <div className="grid grid-cols-1 gap-4">
            <div className={`p-4 rounded border ${
              isDarkActive ? "bg-[#121216] border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-mono font-bold opacity-45 uppercase tracking-widest">Sovereign Reserves (USD)</span>
                <Wallet className="w-3.5 h-3.5 opacity-30 text-[#14B8A6]" />
              </div>
              <span className="text-lg font-mono font-bold text-current tracking-tight tabular-nums">${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {/* POSITION METRICS */}
            <div className={`p-4 rounded border ${
              isDarkActive ? "bg-[#121216]/50 border-white/[0.03]" : "bg-zinc-50 border-black/[0.04]"
            }`}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[8px] font-mono font-bold opacity-45 uppercase tracking-widest">Active Position Ledger</span>
                <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  isDarkActive 
                    ? "bg-[#14B8A6]/5 border-[#14B8A6]/20 text-[#14B8A6]" 
                    : "bg-teal-50 border-teal-100 text-teal-850"
                }`}>
                  {asset.symbol} ACTIVE
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[10px] font-mono">
                 <div className="flex flex-col">
                    <span className="text-[7.5px] opacity-40 font-bold uppercase mb-0.5">Holding Units</span>
                    <span className="font-bold tabular-nums text-current">{holding.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[7.5px] opacity-40 font-bold uppercase mb-0.5">Spot value</span>
                    <span className="font-bold tabular-nums text-current">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[7.5px] opacity-40 font-bold uppercase mb-0.5">Weighted Base</span>
                    <span className="font-bold tabular-nums text-current">${holding.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[7.5px] opacity-40 font-bold uppercase mb-0.5">Drift (PnL)</span>
                    <span className={`font-bold tabular-nums ${pl >= 0 ? "text-[#14B8A6]" : "text-red-500"}`}>
                      {pl >= 0 ? "+" : ""}{pl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({plPercent >= 0 ? "+" : ""}{plPercent.toFixed(2)}%)
                    </span>
                 </div>
              </div>
            </div>
          </div>

          {/* TRADE TYPE CONTROLS */}
          <div className="flex flex-col gap-3">
             <div className={`flex p-0.5 rounded-lg border ${
               isDarkActive ? "bg-[#121216] border-white/[0.04]" : "bg-zinc-100 border-black/[0.05]"
             }`}>
                <button 
                  onClick={() => setTradeType("BUY")}
                  className={`flex-1 py-2 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tradeType === "BUY" 
                      ? (isDarkActive ? "bg-[#14B8A6] text-black" : "bg-teal-700 text-white") 
                      : "opacity-40 hover:opacity-90"
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" /> BUY {asset.symbol}
                </button>
                <button 
                  onClick={() => setTradeType("SELL")}
                  className={`flex-1 py-2 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tradeType === "SELL" 
                      ? "bg-red-650 text-white bg-red-600" 
                      : "opacity-40 hover:opacity-90"
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" /> SELL {asset.symbol}
                </button>
             </div>

             <div className="relative mt-2">
                <div className="absolute top-3.5 left-4 pointer-events-none opacity-30 text-[8px] font-mono font-bold uppercase tracking-widest">Execute amount</div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0000"
                  className={`w-full h-14 pt-5 pb-1 px-4 rounded text-base font-bold font-mono outline-none border transition-all ${
                    isDarkActive 
                      ? "bg-[#121216] border-white/10 text-white focus:border-[#14B8A6]/50" 
                      : "bg-zinc-50 border-black/10 text-black focus:border-teal-700/50"
                  }`}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-[9px] font-mono font-bold opacity-45 tracking-widest">{asset.symbol}</div>
             </div>

             <div className={`flex justify-between items-center px-4 py-2 border rounded text-[9px] font-mono ${
               isDarkActive ? "bg-black/20 border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
             }`}>
                <span className="opacity-45 uppercase font-bold tracking-wider">Estimated collateral:</span>
                <span className="font-bold text-[#14B8A6] tabular-nums">
                  ${(parseFloat(amount || "0") * asset.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
             </div>

             {error && (
               <div className="flex items-center gap-2 text-red-500 text-[9px] font-mono font-bold uppercase tracking-wide py-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
               </div>
             )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleAction}
        className={`w-full h-11 mt-4 rounded font-mono font-bold text-[9px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
          tradeType === "BUY" 
            ? "bg-[#14B8A6] text-black hover:bg-[#0F9688] active:scale-[0.99]" 
            : "bg-red-600 text-white hover:bg-red-750 active:scale-[0.99]"
        }`}
      >
        <TrendingUp className="w-3.5 h-3.5" /> RUN {tradeType} EXECUTION SLATE
      </button>

    </div>
  );
};
