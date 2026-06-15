/**
 * Clean & Type-Safe Interfaces for the Professional Crypto Market Intelligence Terminal.
 */

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
  volumeUsd24Hr: number;
  supply: number;
  maxSupply: number | null;
}

export interface AegisTimeAndPrice {
  quantumVectorAlignment: string;
  squaringDatePredict: string;
  hiddenVibrationalNodes: string[];
}

export interface AegisPsychologicalWarfare {
  crowdMindsetState: string;
  liquidityTrapZone: string;
}

export interface AegisGeopoliticalCompression {
  macroVolatilityImpact: string;
}

export interface AegisAnomalyPrediction {
  hiddenAnomaly: string;
}

export interface ExecutionPlan {
  entryRange: string;
  stopLoss: string;
  targets: string[];
  timeframe: string;
}

export interface AegisSignal {
  action: "STRONG BUY" | "LAYERED ACCUMULATION" | "STRONG SELL" | "PATIENT CASH";
  plans: {
    shortTerm: ExecutionPlan;
    midTerm: ExecutionPlan;
    longTerm: ExecutionPlan;
  };
  fiveYearForecast?: {
    expectedPrice: string;
    probability: number;
    reasoning: string;
  };
  strategicJustification: string;
  probabilityOfCall?: string;
}

export interface Trade {
  id: string;
  type: "BUY" | "SELL";
  assetId: string;
  symbol: string;
  priceAtTrade: number;
  amount: number;
  timestamp: number;
}

export interface UserProfile {
  balance: number;
  holdings: {
    [symbol: string]: {
      amount: number;
      averagePrice: number;
    };
  };
  history: Trade[];
}

export interface AIPredictionPanel {
  probabilities: {
    bullish: number;
    bearish: number;
    sideways: number;
  };
  outlooks: {
    shortTerm: { forecast: string; reasoning: string };
    midTerm: { forecast: string; reasoning: string };
    longTerm: { forecast: string; reasoning: string };
  };
}

export interface MarketPsychologyEngine {
  emotions: {
    fear: number;
    greed: number;
    euphoria: number;
    panic: number;
    fomo: number;
    capitulation: number;
  };
  crowdPositioningEstimate: string;
}

export interface NewsIntelligenceEvent {
  title: string;
  category: "Global" | "Crypto" | "Regulation" | "ETF" | "Central Bank" | "Geopolitics" | "Election" | "Economics";
  impactScore: number; // 1-100
  summary: string;
}

export interface RiskEngineLevel {
  confidenceScore: number; // 1-100
  riskScore: number; // 1-100
  volatilityScore: number; // 1-100
  probabilityScore: number; // 1-100
  signalQualityRating: "A+" | "A" | "B+" | "B" | "C";
}

export interface CoinIntelligenceReport {
  asset: CryptoAsset;
  timeAndPrice: AegisTimeAndPrice;
  psychology: AegisPsychologicalWarfare;
  geopolitics: AegisGeopoliticalCompression;
  anomaly: AegisAnomalyPrediction;
  signal: AegisSignal;
  aiPrediction?: AIPredictionPanel;
  marketPsychology?: MarketPsychologyEngine;
  newsIntelligence?: NewsIntelligenceEvent[];
  riskEngine?: RiskEngineLevel;
}

export interface MarketGlobalStats {
  btcPrice: number;
  ethPrice: number;
  totalMarketCap: number;
  btcDominance: number;
  fearAndGreedIndex: number;
  fearAndGreedLabel: string;
  trending: CryptoAsset[];
  gainers: CryptoAsset[];
  losers: CryptoAsset[];
  recentlyExploding: CryptoAsset[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isNew?: boolean;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
}
