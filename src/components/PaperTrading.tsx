import React, { useState } from "react";
import { 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  History,
  TrendingUp,
  AlertCircle
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
      setError("Enter a valid amount");
      return;
    }

    if (tradeType === "BUY") {
      const cost = numAmount * asset.priceUsd;
      if (cost > profile.balance) {
        setError(`Insufficient funds. Balance: $${profile.balance.toLocaleString()}`);
        return;
      }
    } else {
      if (numAmount > holding.amount) {
        setError(`Insufficient holdings. You have ${holding.amount} ${asset.symbol}`);
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
    <div className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
        <Briefcase className="w-5 h-5 text-[#00FF85]" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Institutional Paper Trade</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ACCOUNT STATUS */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Available Capital</span>
              <Wallet className="w-3.5 h-3.5 opacity-20" />
            </div>
            <span className="text-xl font-black font-mono text-[#00FF85]">${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className={`p-4 rounded-xl border ${isDarkActive ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Current Position</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] text-[8px] font-black uppercase">
                {asset.symbol} LIVE
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col">
                  <span className="text-[9px] opacity-40 font-bold uppercase mb-0.5">Holding</span>
                  <span className="text-sm font-black font-mono">{holding.amount.toLocaleString()} {asset.symbol}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] opacity-40 font-bold uppercase mb-0.5">Value</span>
                  <span className="text-sm font-black font-mono">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] opacity-40 font-bold uppercase mb-0.5">Avg Price</span>
                  <span className="text-sm font-black font-mono">${holding.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] opacity-40 font-bold uppercase mb-0.5">P/L Impact</span>
                  <span className={`text-sm font-black font-mono ${pl >= 0 ? "text-[#00FF85]" : "text-[#FF3B69]"}`}>
                    {pl >= 0 ? "+" : ""}{pl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({plPercent.toFixed(2)}%)
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* TRADE EXECUTION */}
        <div className="flex flex-col gap-4">
           <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setTradeType("BUY")}
                className={`flex-1 py-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  tradeType === "BUY" ? "bg-[#00FF85] text-black shadow-lg" : "opacity-30 hover:opacity-100"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> BUY {asset.symbol}
              </button>
              <button 
                onClick={() => setTradeType("SELL")}
                className={`flex-1 py-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  tradeType === "SELL" ? "bg-[#FF3B69] text-white shadow-lg" : "opacity-30 hover:opacity-100"
                }`}
              >
                <ArrowDownRight className="w-4 h-4" /> SELL {asset.symbol}
              </button>
           </div>

           <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none opacity-30 text-[10px] font-bold uppercase">Amt Units</div>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full h-16 pt-6 pb-2 px-4 rounded-xl text-lg font-black font-mono outline-none border transition-all ${
                  isDarkActive 
                    ? "bg-white/5 border-white/10 text-white focus:border-[#00D1FF]/50" 
                    : "bg-black/5 border-black/10 text-black focus:border-[#0057FF]/50"
                }`}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-black opacity-30 tracking-widest">{asset.symbol}</div>
           </div>

           <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-lg text-[10px] font-mono">
              <span className="opacity-40">ESTIMATED COST:</span>
              <span className="font-bold text-[#00D1FF]">
                ${(parseFloat(amount || "0") * asset.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
           </div>

           {error && (
             <div className="flex items-center gap-2 text-[#FF3B69] text-[10px] font-bold uppercase animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
             </div>
           )}

           <button 
             onClick={handleAction}
             className={`h-14 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${
               tradeType === "BUY" 
                 ? "bg-[#00FF85] text-black hover:bg-[#00FF85]/80 active:scale-[0.98]" 
                 : "bg-[#FF3B69] text-white hover:bg-[#FF3B69]/80 active:scale-[0.98]"
             }`}
           >
             <TrendingUp className="w-4 h-4" /> EXECUTE {tradeType} ORDER
           </button>
        </div>
      </div>

      {/* RECENT HISTORY PREVIEW */}
      {profile.history.filter(t => t.assetId === asset.id).length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 opacity-30" />
              <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Execution History ({asset.symbol})</span>
           </div>
           <div className="flex flex-col gap-2">
              {profile.history.filter(t => t.assetId === asset.id).slice(0, 3).map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 text-[10px]">
                   <div className="flex items-center gap-3">
                      <span className={`font-black tracking-widest ${t.type === "BUY" ? "text-[#00FF85]" : "text-[#FF3B69]"}`}>{t.type}</span>
                      <span className="font-mono opacity-60">{t.amount} {t.symbol}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="font-mono font-bold">$ {t.priceAtTrade.toLocaleString()}</span>
                      <span className="opacity-30 text-[8px]">{new Date(t.timestamp).toLocaleString()}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
