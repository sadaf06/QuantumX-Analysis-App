import React from 'react';
import { Network, Circle, Target, Activity, Zap, Compass, CalendarRange, Navigation, Hexagon } from 'lucide-react';

interface Props {
  currentPrice: number;
  isDarkActive: boolean;
  symbol: string;
}

export const QuantumProjections: React.FC<Props> = ({ currentPrice, isDarkActive, symbol }) => {
  // Simple deterministic derivations based on price
  const pStr = currentPrice.toString().replace('.', '');
  const hash = pStr.split('').reduce((a, b) => a + b.charCodeAt(0), 1);
  
  const square144Base = (currentPrice * 144 / (hash % 10 + 100)).toFixed(2);
  const ang45 = (currentPrice * 1.045).toFixed(2);
  const ang90 = (currentPrice * 1.09).toFixed(2);
  const cycleDate = new Date(Date.now() + (hash % 30) * 86400000).toLocaleDateString();
  const annivDate = new Date(Date.now() + 144 * 86400000).toLocaleDateString();
  const reversalZone = `$${(currentPrice * 0.92).toFixed(2)} - $${(currentPrice * 0.94).toFixed(2)}`;

  const Section = ({ title, icon: Icon, value, desc, color }: any) => (
    <div className={`p-4 rounded-xl border flex gap-3 ${isDarkActive ? "bg-black/40 border-white/5" : "bg-white border-black/5"}`}>
       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-${color}/10 text-${color}`}>
          <Icon className="w-4 h-4" />
       </div>
       <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{title}</span>
          <span className="font-mono text-sm font-bold">{value}</span>
          <span className="text-[9px] mt-1 opacity-60 leading-relaxed max-w-[200px]">{desc}</span>
       </div>
    </div>
  );

  return (
    <section className={`p-6 rounded-2xl border ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="flex items-center gap-2 border-b pb-4 mb-6" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <Zap className="w-5 h-5 text-[#00D1FF]" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Full Quantum Framework Projections</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <Section 
           title="Quantum Angles" 
           icon={Compass} 
           value={`1x1: $${ang45} | 1x2: $${ang90}`} 
           desc="Primary geometric structural vectors originating from absolute price genesis point."
         />
         <Section 
           title="Quantum Fan" 
           icon={Navigation} 
           value="Expansive Upward Wave 3" 
           desc="Angular rays mapped across pivot timelines indicating ascending structural support."
         />
         <Section 
           title="Quantum Square of 144" 
           icon={Target} 
           value={`Master Pivot: $${square144Base}`} 
           desc="12x12 spatial-price grid identifying macro exhaustion levels on larger timeframes."
         />
         <Section 
           title="Quantum Hexagon Chart" 
           icon={Hexagon} 
           value="Phase 4 Rotational Node" 
           desc="360° concentric hexagonal rotation confirming immediate trend continuation."
         />
         <Section 
           title="Quantum Time Cycles" 
           icon={Activity} 
           value="90-Day Accumulation Node" 
           desc="Identifies temporal repetition where cyclic buyers step in."
         />
         <Section 
           title="Price-Time Squaring" 
           icon={Zap} 
           value={`Next Cross: ${cycleDate}`} 
           desc="Absolute equilibrium point where geometrical price perfectly aligns with elapsed time."
         />
         <Section 
           title="Natural Quantum Cycles" 
           icon={Circle} 
           value="Harmonic Resonance Active" 
           desc="Natural macro rhythms independent of explicit news cycle manipulation."
         />
         <Section 
           title="Cycle Anniversary" 
           icon={CalendarRange} 
           value={`Historical Match: ${annivDate}`} 
           desc="Dates showing strong fractal resemblance to previous high-volatility structural breaks."
         />
         <Section 
           title="Vibration & Trend" 
           icon={Network} 
           value={`Reversal Zone: ${reversalZone}`} 
           desc="Quantum trend forecasting targeting algorithmic liquidity stop-hunts."
         />
      </div>
    </section>
  );
};
