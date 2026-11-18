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

export interface TimeframeTechnicalNode {
  timeframe: "1H" | "4H" | "1D" | "1W";
  rsi14: number;
  rsiState: "OVERSOLD" | "BULLISH" | "NEUTRAL" | "BEARISH" | "OVERBOUGHT";
  mfi14: number; // Money Flow Index (0-100)
  moneyFlowState: "STRONG INFLOW" | "MODERATE INFLOW" | "NEUTRAL" | "MODERATE OUTFLOW" | "HEAVY OUTFLOW";
  cmf20: number; // Chaikin Money Flow (-1 to +1)
  ema20: number;
  ema50: number;
  ema200: number;
  macdHistogram: number;
  trend: "STRONG UPTREND" | "UPTREND" | "RANGING" | "DOWNTREND" | "STRONG DOWNTREND";
  trendStrength: number; // 0-100
  atr: number;
  volatilityPct: number;
  support1: number;
  support2: number;
  resistance1: number;
  resistance2: number;
  pivotPoint: number;
  volumeSpikeRatio: number; // Current/Recent Vol vs 20-MA Vol
  whaleActivity: "ACCUMULATION SPIKE" | "DISTRIBUTION SPIKE" | "STEADY INSTITUTIONAL" | "RETAIL NORMAL";
}

export interface WhaleAndMoneyFlowSummary {
  netMoneyFlowBias: "NET INSTITUTIONAL INFLOW" | "NET INSTITUTIONAL OUTFLOW" | "BALANCED FLOW";
  aggregateMfi: number;
  volumeAnomalyRatio: number;
  largeTransferSignal: string;
  orderBookImbalance: string;
  exchangeNetflowEstimate: string;
  whaleConcentrationScore: number;
  hourlyFlowSparkline: { period: string; netFlow: number; isWhaleSpike: boolean }[];
}

export interface QuantConfluenceSummary {
  overallConfluenceScore: number; // 0 - 100
  historicalSetupAccuracy: number; // Calibrated 70-86% based on multi-TF alignment
  alignedTimeframesCount: number; // out of 4 (1H, 4H, 1D, 1W)
  primaryDriver: string;
  confluenceBreakdown: {
    trendAlignmentScore: number;
    momentumRsiScore: number;
    moneyFlowWhaleScore: number;
    supportResistanceScore: number;
  };
}

export interface MasterTradeSignal {
  direction: "BUY" | "SELL";
  strength: "STRONG" | "NORMAL" | "LOW";
  fullLabel: string; // e.g., "STRONG BUY", "NORMAL BUY", "LOW BUY", "STRONG SELL", "NORMAL SELL", "LOW SELL"
  spotPrice: string;
  buyPrice: string;
  sellPrice: string;
  tp1: string;
  tp2: string;
  tp3: string;
  sl: string;
  expectedGainPct: string;
  maxRiskPct: string;
  riskReward: string;
  accuracyPct: number;
  scanSummary: string;
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
  riskRewardRatio?: string;
}

export interface AegisSignal {
  action: "STRONG BUY" | "NORMAL BUY" | "LOW BUY" | "STRONG SELL" | "NORMAL SELL" | "LOW SELL" | "LAYERED ACCUMULATION" | "NEUTRAL / HOLD" | "TAKE PROFIT / REDUCE";
  masterSignal?: MasterTradeSignal;
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
  generatedAt?: string;
  multiTimeframe?: {
    "1h": TimeframeTechnicalNode;
    "4h": TimeframeTechnicalNode;
    "1d": TimeframeTechnicalNode;
    "1w": TimeframeTechnicalNode;
  };
  whaleAndMoneyFlow?: WhaleAndMoneyFlowSummary;
  confluence?: QuantConfluenceSummary;
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
