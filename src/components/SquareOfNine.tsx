import React, { useMemo, useState } from 'react';
import { Target, HelpCircle } from 'lucide-react';

interface Props {
  currentPrice: number;
  vibrationalNodes: string[];
  isDarkActive: boolean;
  lang?: "english" | "hinglish";
  symbol?: string;
}

export const SquareOfNineMatrix: React.FC<Props> = ({ currentPrice, vibrationalNodes, isDarkActive, lang = "english", symbol = "" }) => {
  const gridSize = 9; // 9x9 grid
  const [showHowTo, setShowHowTo] = useState(false);
  
  const cells = useMemo(() => {
    const result: {x: number, y: number, index: number}[] = [];
    let x = Math.floor(gridSize / 2);
    let y = Math.floor(gridSize / 2);
    let dx = 1;
    let dy = 0;
    let segment_length = 1;
    let segment_passed = 0;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      result.push({x, y, index: i + 1});
      x += dx;
      y += dy;
      segment_passed++;
      if (segment_passed === segment_length) {
        segment_passed = 0;
        const temp = dx;
        dx = -dy;
        dy = temp;
        if (dy === 0) {
          segment_length++;
        }
      }
    }
    return result;
  }, [gridSize]);

  // Create a mapping of cell indices to "is active" or "is node"
  const activeCells = useMemo(() => {
    const actives = new Set<number>();
    actives.add(1); // center
    
    // Hash current price + symbol to a cell
    const currentPriceStr = currentPrice.toString().replace('.', '') + symbol;
    const priceHash = currentPriceStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const currentPriceCell = (priceHash % 80) + 2;
    actives.add(currentPriceCell);
    
    // Hash vibrational nodes + symbol to cells
    const nodeCells = new Set<number>();
    vibrationalNodes.forEach((node, idx) => {
      let nodePriceStr = "";
      const match = node.match(/\$([\d,.]+)/);
      if (match) {
        nodePriceStr = match[1].replace(/,/g, '').replace('.', '') + symbol;
      } else {
        nodePriceStr = node + symbol;
      }
      
      const nodeHash = nodePriceStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * (idx + 1);
      let cellId = (nodeHash % 80) + 2;
      
      // Prevent overlap with current price or center
      while (cellId === currentPriceCell || cellId === 1) {
        cellId = (cellId + 1) % 80 + 2;
      }
      
      actives.add(cellId);
      nodeCells.add(cellId);
    });

    return { actives, currentPriceCell, nodeCells };
  }, [currentPrice, vibrationalNodes]);

  const SVG_SIZE = 360;
  const CELL_SIZE = Math.floor(SVG_SIZE / gridSize);
  const ADJUSTED_SVG_SIZE = CELL_SIZE * gridSize;
  const PADDING = 2;

  return (
    <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden h-full ${isDarkActive ? "bg-[#080D16] border-white/5" : "bg-white border-black/5"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/5 to-transparent pointer-events-none" />
      
      <div className="w-full flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2 border-b border-opacity-30 pb-2">
          <Target className="w-5 h-5 text-[#00D1FF]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">Quantum Matrix</h2>
        </div>
        <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest px-2 py-1 rounded">
          Mathematical Harmonics
        </div>
      </div>

      <div className="relative z-10 p-4 bg-black/10 rounded-2xl border backdrop-blur-sm self-center mx-auto shadow-inner" style={{ borderColor: isDarkActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <svg width={ADJUSTED_SVG_SIZE} height={ADJUSTED_SVG_SIZE} viewBox={`0 0 ${ADJUSTED_SVG_SIZE} ${ADJUSTED_SVG_SIZE}`} className="transform group">
          {cells.map(cell => {
            const isCenter = cell.index === 1;
            const isCurrent = cell.index === activeCells.currentPriceCell;
            const isNode = activeCells.nodeCells.has(cell.index);
            
            const px = cell.x * CELL_SIZE + PADDING;
            const py = cell.y * CELL_SIZE + PADDING;
            const size = CELL_SIZE - PADDING * 2;
            
            let fill = isDarkActive ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
            let stroke = isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
            let textColor = isDarkActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)";
            let strokeWidth = 1;

            if (isCenter) {
              fill = "rgba(0, 255, 133, 0.1)";
              stroke = "#00FF85";
              textColor = "#00FF85";
              strokeWidth = 2;
            } else if (isCurrent) {
              fill = "rgba(0, 209, 255, 0.1)";
              stroke = "#00D1FF";
              textColor = "#00D1FF";
              strokeWidth = 2;
            } else if (isNode) {
              fill = "rgba(255, 59, 105, 0.1)";
              stroke = "#FF3B69";
              textColor = "#FF3B69";
            }

            return (
              <g key={cell.index} className="transition-all duration-500 hover:opacity-80">
                <rect 
                  x={px} 
                  y={py} 
                  width={size} 
                  height={size} 
                  fill={fill} 
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  rx={4}
                />
                <text 
                  x={px + size/2} 
                  y={py + size/2 + 3} 
                  fontSize="10" 
                  fontFamily="monospace"
                  fill={textColor} 
                  textAnchor="middle"
                  className={isCenter || isCurrent || isNode ? "font-bold" : ""}
                >
                  {cell.index}
                </text>
                
                {isCurrent && (
                  <circle 
                    cx={px + size/2} 
                    cy={py + size/2} 
                    r={size/2 + 4} 
                    fill="none" 
                    stroke="#00D1FF" 
                    strokeWidth="1" 
                    strokeDasharray="2,2" 
                    className="animate-pulse origin-center" 
                    style={{ transformOrigin: `${px + size/2}px ${py + size/2}px` }} 
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="w-full flex justify-between items-center mt-6 text-[10px] font-mono relative z-10 max-w-[360px] mx-auto">
         <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-2 h-2 rounded bg-[#00FF85]"></div>
            <span className="uppercase">Genesis</span>
         </div>
         <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-2 h-2 rounded bg-[#00D1FF]"></div>
            <span className="uppercase">Locus (Price)</span>
         </div>
         <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-2 h-2 rounded bg-[#FF3B69]"></div>
            <span className="uppercase">Vibration Node</span>
         </div>
      </div>

      <button 
        onClick={() => setShowHowTo(!showHowTo)}
        className={`mt-5 w-full max-w-[360px] py-2.5 rounded-lg text-[10px] font-bold tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isDarkActive 
            ? "border-white/10 bg-white/5 text-[#00D1FF] hover:bg-[#00D1FF]/10 hover:border-[#00D1FF]/30" 
            : "border-black/10 bg-black/5 text-[#0057FF] hover:bg-[#0057FF]/10 hover:border-[#0057FF]/30"
        }`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
        {showHowTo 
          ? (lang === "hinglish" ? "QUANTUM MATRIX MANUAL CHHIPAYEIN" : "HIDE QUANTUM MATRIX MANUAL")
          : (lang === "hinglish" ? "QUANTUM MATRIX / THEORY SAMAJHIYE" : "UNDERSTAND QUANTUM MATRIX / THEORY")
        }
      </button>

      {showHowTo && (
        <div className={`mt-4 p-4 rounded-xl border text-[11px] leading-relaxed max-w-[360px] animate-in fade-in slide-in-from-top-2 duration-300 relative z-10 ${
          isDarkActive ? "bg-[#060B14] border-white/10 text-slate-300" : "bg-slate-50 border-black/10 text-slate-700"
        }`}>
          {lang === "hinglish" ? (
            <>
              <h4 className="font-extrabold text-[#00FF85] mb-2 uppercase tracking-wider text-[9px]">Quantum Square of 9 kya hai?</h4>
              <p className="mb-2">
                Yeh <strong>Square of Nine</strong> numbers ka ek clock jaisa spiral hai jo center mein <strong>1 (Genesis)</strong> se shuru hota hai, aur square by square bahar ki taraf badhta hai. Yeh system financial asset movements ko systemic geometrical laws ke anusaar predict karta hai.
              </p>
              <h4 className="font-extrabold text-[#00D1FF] mb-1 uppercase tracking-wider text-[9px] mt-3">Core Meaning & Practical Application:</h4>
              <ul className="list-disc list-inside space-y-1 text-[10px]">
                <li><strong>Price & Time Squaring:</strong> Yeh maanta hai ki price levels aur repeating time-slots specific angular rays (jaise 45°, 90°, 180°, aur 360°) ke along vibrate karte hain. Jab ek asset ka price ek angular rotation complete karta hai, tab ek primary trend pivot trigger hota hai.</li>
                <li><strong>The Locus (Cell Marker):</strong> Humara system mathematically hash karta hai current asset price ko, aur usko 9x9 board ki geometrical coordinates pe plot karta hai.</li>
                <li><strong>Vibrational Nodes (Red Cells):</strong> Yeh price matrices Quantum logarithmic equations par aadharit hain. Jab koi asset price in ranges mein aata hai, toh strong support ya resistance milti hai, jisse yahan buy ya sell targets set kiye ja sakte hain.</li>
              </ul>
            </>
          ) : (
            <>
              <h4 className="font-extrabold text-[#00FF85] mb-2 uppercase tracking-wider text-[9px]">What is the Quantum Square of 9?</h4>
              <p className="mb-2">
                A mathematical model derived from early 20th-century discoveries that financial asset movements are governed by systemic geometrical laws. The <strong>Square of Nine</strong> is a clock-like spiral of numbers starting with <strong>1 (Genesis)</strong> in the center, winding outwards square by square.
              </p>
              <h4 className="font-extrabold text-[#00D1FF] mb-1 uppercase tracking-wider text-[9px] mt-3">The Core Meaning & Practical Application:</h4>
              <ul className="list-disc list-inside space-y-1 text-[10px]">
                <li><strong>Price & Time Squaring:</strong> Quantum theory posits that price levels and repeating time-slots vibrate along specific angular rays (like 45°, 90°, 180°, and 360°). When an asset price completes an angular rotation, a primary trend pivot is triggered.</li>
                <li><strong>The Locus (Cell Marker):</strong> The system hashes the asset's live market price dynamically to map it onto corresponding mathematical coordinates on the 9x9 board.</li>
                <li><strong>Vibrational Nodes (Red Cells):</strong> These indicate price matrices derived from the logarithmic equations. When the asset price enters these ranges, extreme resistance or absolute support occurs, making them prime buy or sell targets.</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};
