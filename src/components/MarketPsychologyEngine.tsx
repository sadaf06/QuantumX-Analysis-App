import React from 'react';
import { Brain, Users } from 'lucide-react';
import { MarketPsychologyEngine as MarketPsychologyEngineType } from '../types';

interface Props {
  data: MarketPsychologyEngineType;
  isDarkActive: boolean;
}

export const MarketPsychologyEngine: React.FC<Props> = ({ data, isDarkActive }) => {
  const emotions = [
    {
      name: "Fear",
      value: data.emotions?.fear ?? 0,
      color: "#EF4444",
    },
    {
      name: "Greed",
      value: data.emotions?.greed ?? 0,
      color: "#14B8A6",
    },
    {
      name: "Euphoria",
      value: data.emotions?.euphoria ?? 0,
      color: "#C5A880",
    },
    {
      name: "Panic",
      value: data.emotions?.panic ?? 0,
      color: "#EF4444",
    },
    {
      name: "FOMO",
      value: data.emotions?.fomo ?? 0,
      color: "#C5A880",
    },
    {
      name: "Capitulation",
      value: data.emotions?.capitulation ?? 0,
      color: "#A78BFA",
    },
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Grid of micro indicators */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
        {emotions.map((emo, idx) => (
           <div key={idx} className={`p-3 rounded border flex flex-col justify-between ${
             isDarkActive ? "bg-[#121216]/60 border-white/[0.04]" : "bg-zinc-50 border-black/[0.05]"
           }`}>
              <span className="text-[8px] font-mono uppercase font-semibold tracking-widest opacity-45 mb-2 block">{emo.name}</span>
              <div>
                <div className="w-full bg-current bg-opacity-[0.08] h-[3px] rounded-full overflow-hidden flex mb-2">
                   <div className="h-full rounded-full" style={{ width: `${emo.value}%`, backgroundColor: emo.color }}></div>
                </div>
                <span className="font-mono text-[10px] font-bold block" style={{ color: emo.color }}>{emo.value}/100</span>
              </div>
           </div>
        ))}
      </div>

      {/* Narrative block */}
      <div className={`p-4 rounded border ${
        isDarkActive 
          ? "bg-[#C5A880]/5 border-[#C5A880]/15" 
          : "bg-amber-50 border-amber-100"
      }`}>
        <div className="flex items-center gap-1.5 mb-1.5">
           <Users className={`w-3.5 h-3.5 ${isDarkActive ? "text-[#C5A880]" : "text-amber-900"}`} />
           <span className={`text-[8.5px] font-mono font-bold uppercase tracking-widest ${
             isDarkActive ? "text-[#C5A880]" : "text-amber-950"
           }`}>Crowd Positioning Core</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-85 font-sans leading-relaxed">{data.crowdPositioningEstimate}</p>
      </div>

    </div>
  );
};
