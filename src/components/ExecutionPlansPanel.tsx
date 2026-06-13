import React from 'react';
import { Target, Shield, Zap, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { ExecutionPlan } from '../types';

interface Props {
  plans: {
    shortTerm: ExecutionPlan;
    midTerm: ExecutionPlan;
    longTerm: ExecutionPlan;
  };
  isDarkActive: boolean;
}

export const ExecutionPlansPanel: React.FC<Props> = ({ plans, isDarkActive }) => {
  const PlanCard = ({ plan, title, color }: { plan: ExecutionPlan, title: string, color: string }) => (
    <div className={`p-5 rounded-2xl border flex flex-col gap-4 relative overflow-hidden ${
      isDarkActive ? "bg-black/40 border-white/5" : "bg-white border-black/5"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${color}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</span>
        </div>
        <span className="text-[10px] font-mono opacity-40 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          {plan.timeframe}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5">
          <span className="text-[8px] font-black uppercase opacity-40 mb-1">Entry Range</span>
          <span className="text-sm font-bold font-mono">{plan.entryRange}</span>
        </div>
        <div className="flex flex-col p-3 bg-[#FF3B69]/5 rounded-xl border border-[#FF3B69]/10">
          <span className="text-[8px] font-black uppercase text-[#FF3B69] mb-1">Stop-Loss</span>
          <span className="text-sm font-bold font-mono text-[#FF3B69]">{plan.stopLoss}</span>
        </div>
      </div>

      <div>
        <span className="text-[8px] font-black uppercase opacity-40 mb-2 block">Alpha Targets (T1-T3)</span>
        <div className="flex flex-wrap gap-2">
          {plan.targets.map((t, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-[#00D1FF]/10 text-[#00D1FF] px-2 py-1 rounded-lg border border-[#00D1FF]/20">
               <Target className="w-3 h-3" />
               <span className="text-xs font-black font-mono">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
         <Zap className="w-5 h-5 text-[#FFB800]" />
         <h2 className="text-sm font-black uppercase tracking-[0.2em]">Multi-Tier Execution Matrix</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanCard plan={plans.shortTerm} title="Tactical / Short-Term" color="text-[#00D1FF]" />
        <PlanCard plan={plans.midTerm} title="Strategic / Mid-Term" color="text-[#00FF85]" />
        <PlanCard plan={plans.longTerm} title="Cyclic / Long-Term" color="text-[#FF8A00]" />
      </div>
    </div>
  );
};
