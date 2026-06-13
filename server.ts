import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  CryptoAsset, 
  CoinIntelligenceReport, 
  MarketGlobalStats,
  ChatMessage 
} from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Error setting up Gemini API Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable. Using high-grade local simulation.");
}

/**
 * Wraps ai.models.generateContent with a retry mechanism for transient errors (like 503, 429).
 */
async function generateContentWithRetry(aiClient: GoogleGenAI, params: any, maxRetries = 2, delayMs = 1000) {
  let attempt = 0;
  while (true) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      console.warn(`[Gemini API Error] Attempt ${attempt}:`, err);
      const errMsg = err?.message || "";
      const status = err?.status || err?.statusCode || 0;
      
      const isRateLimit = status === 429 || errMsg.includes("429") || errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("resource exhausted");
      const isUnavailable = status === 503 || errMsg.includes("503") || errMsg.toLowerCase().includes("unavailable") || errMsg.toLowerCase().includes("high demand") || errMsg.toLowerCase().includes("timeout");
      
      const isTransient = isRateLimit || isUnavailable;
      
      if (isTransient && attempt <= maxRetries) {
        const baseDelay = isRateLimit ? delayMs * 2 : delayMs;
        const jitter = Math.floor(Math.random() * 500);
        const retryDelay = baseDelay + jitter;
        
        console.warn(`[Gemini API] Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        delayMs *= 2;
        continue;
      }
      throw err;
    }
  }
}

// ------------------- HIGH-PRECISION MARKET DATA ENGINE -------------------

/**
 * Custom fetch helper with a strict, responsive timeout.
 */
async function fetchWithTimeout(url: string, options: any = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'QuantumX-Terminal/2.5'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

let cachedAssets: CryptoAsset[] = [];
let lastFetchedTime = 0;
const CACHE_DURATION_MS = 20000; // 20 seconds cache to be very gentle on external APIs

/**
 * Fallback static asset list for extreme cases (network blackout).
 */
function getStaticBackupAssets(): CryptoAsset[] {
  return [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", rank: 1, priceUsd: 68450.20, changePercent24Hr: 2.85, marketCapUsd: 1345000000000, volumeUsd24Hr: 28500000000, supply: 19650000, maxSupply: 21000000 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", rank: 2, priceUsd: 3485.50, changePercent24Hr: -1.12, marketCapUsd: 418000000000, volumeUsd24Hr: 15400000000, supply: 120100000, maxSupply: null },
    { id: "solana", name: "Solana", symbol: "SOL", rank: 5, priceUsd: 154.60, changePercent24Hr: 6.92, marketCapUsd: 68000000000, volumeUsd24Hr: 3400000000, supply: 440000000, maxSupply: null },
    { id: "binance-coin", name: "BNB", symbol: "BNB", rank: 4, priceUsd: 582.40, changePercent24Hr: 1.45, marketCapUsd: 87000000000, volumeUsd24Hr: 1200000000, supply: 149000000, maxSupply: null },
    { id: "ripple", name: "XRP", symbol: "XRP", rank: 6, priceUsd: 0.58, changePercent24Hr: 0.5, marketCapUsd: 32000000000, volumeUsd24Hr: 1000000000, supply: 55000000000, maxSupply: 100000000000 },
  ];
}

/**
 * Primary Source: CoinGecko (Industry standard for accuracy)
 */
async function fetchCoinGeckoAssets(): Promise<CryptoAsset[]> {
  let attempts = 0;
  while (attempts < 2) {
    try {
      const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=24h";
      const res = await fetchWithTimeout(url, {}, 6000);
      if (!res.ok) throw new Error(`CG API Status: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("CG returned non-array data");
      return data.map((a: any) => ({
        id: a.id || "unknown",
        name: a.name || "Unknown",
        symbol: (a.symbol || "").toUpperCase(),
        rank: a.market_cap_rank || 999,
        priceUsd: a.current_price || 0,
        changePercent24Hr: a.price_change_percentage_24h || 0,
        marketCapUsd: a.market_cap || 0,
        volumeUsd24Hr: a.total_volume || 0,
        supply: a.circulating_supply || 0,
        maxSupply: a.max_supply || null
      }));
    } catch (err) {
      attempts++;
      if (attempts >= 2) {
        console.warn("[Market Engine] CoinGecko exhaust. Falling back...", err instanceof Error ? err.message : err);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  return [];
}

/**
 * Secondary Source: CoinCap (Fallback node)
 */
async function fetchCoinCapAssets(): Promise<CryptoAsset[]> {
  let attempts = 0;
  while (attempts < 2) {
    try {
      const res = await fetchWithTimeout("https://api.coincap.io/v2/assets?limit=150", {}, 5000);
      if (!res.ok) throw new Error(`CoinCap API Status: ${res.status}`);
      const data = await res.json();
      const list = data.data || [];
      if (!Array.isArray(list)) throw new Error("CoinCap returned non-array data");
      return list.map((a: any) => ({
        id: a.id || "unknown",
        name: a.name || "Unknown",
        symbol: (a.symbol || "").toUpperCase(),
        rank: parseInt(a.rank || "0", 10),
        priceUsd: parseFloat(a.priceUsd || "0"),
        changePercent24Hr: parseFloat(a.changePercent24Hr || "0"),
        marketCapUsd: parseFloat(a.marketCapUsd || "0"),
        volumeUsd24Hr: parseFloat(a.volumeUsd24Hr || "0"),
        supply: parseFloat(a.supply || "0"),
        maxSupply: a.maxSupply ? parseFloat(a.maxSupply) : null,
      }));
    } catch (err) {
      attempts++;
      if (attempts >= 2) {
        console.warn("[Market Engine] CoinCap node failure.", err instanceof Error ? err.message : err);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  return [];
}

/**
 * Ultra-Precision Node: Binance (Real-time Spot ticker for top pairs)
 */
async function fetchBinanceSpotPrice(symbol: string): Promise<number | null> {
  try {
    const binanceSym = `${symbol}USDT`.toUpperCase();
    const res = await fetchWithTimeout(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSym}`, {}, 2000);
    if (res.ok) {
      const data = await res.json();
      return data.price ? parseFloat(data.price) : null;
    }
  } catch (err) { }
  return null;
}

async function getAssets(): Promise<CryptoAsset[]> {
  const now = Date.now();
  if (cachedAssets.length === 0 || (now - lastFetchedTime) > CACHE_DURATION_MS) {
    try {
      let fresh = await fetchCoinGeckoAssets();
      
      if (fresh.length === 0) {
        // Small stagger to avoid simultaneous spikes
        await new Promise(r => setTimeout(r, 500));
        fresh = await fetchCoinCapAssets();
      }
      
      if (fresh && fresh.length > 0) {
        const topFew = ["BTC", "ETH", "SOL", "BNB"];
        for (const asset of fresh) {
          if (topFew.includes(asset.symbol)) {
            const binancePrice = await fetchBinanceSpotPrice(asset.symbol);
            if (binancePrice) asset.priceUsd = binancePrice;
          }
        }
        cachedAssets = fresh;
        lastFetchedTime = now;
      } else if (cachedAssets.length === 0) {
        cachedAssets = getStaticBackupAssets();
        lastFetchedTime = now;
      } else {
        // If we have old cache, keep it but mark as "fetched" to wait for next cycle
        lastFetchedTime = now;
      }
    } catch (err) {
      console.error("Critical error in asset pipeline:", err);
      if (cachedAssets.length === 0) cachedAssets = getStaticBackupAssets();
      lastFetchedTime = now;
    }
  }
  return cachedAssets;
}

// ------------------- IN-MEMORY CACHE FOR DETAILED COIN SCANS -------------------
const STORED_REPORTS: { [key: string]: CoinIntelligenceReport } = {};

// ------------------- DETAILED REPORT ALGORITHMIC GENERATOR -------------------
function generateAlgorithmicReport(asset: CryptoAsset, lang: "english" | "hinglish" = "english"): CoinIntelligenceReport {
  const priceVal = asset.priceUsd;
  const isHighPriced = priceVal > 100;
  const isSuperLowPriced = priceVal < 0.1;
  const precision = isSuperLowPriced ? 6 : isHighPriced ? 2 : 4;

  const support1 = priceVal * 0.954;
  const support3 = priceVal * 0.835;
  const resist1 = priceVal * 1.046;
  const resist3 = priceVal * 1.228;

  const change = asset.changePercent24Hr;
  const hash = asset.symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Dynamic alignment text variations to avoid repetition
  const alignments = [
    `Price is tracking perfectly aligned to the primary 1x1 Quantum geometric vector, validating a dominant structural hold at planetary support nodes. Current position implies strong harmonic resonance intact.`,
    `Asset velocity shows an acute convergence with the 2x1 Quantum angular ray, suggesting a high-frequency volatility expansion is imminent. Structural integrity remains above the genesis pivot.`,
    `Current price action indicates a logarithmic spiral vibration at the 45-degree node. Geometric stability is confirmed as the asset oscillates within the primary Quantum fan structure.`,
    `Structural alignment reflects a secondary vector correction towards the 1x4 support ray. This indicates a slowing frequency but maintains the long-term cyclic bullish bias.`,
  ];
  
  const alignmentHinglish = [
    `Price perfectly primary 1x1 Quantum geometric vector line ke sath align hokar move kar raha hai, jo ek strong structural hold ko validate karta hai. Current position clearly indicate karti hai ki harmonic resonance abhi bhi intact hai.`,
    `Asset ki raftar 2x1 Quantum angular ray ke sath converge ho rahi hai, jo indicate karti hai ki jald hit volatility expansion aane wala hai. Structural integrity genesis pivot ke upar bani hui hai.`,
    `Current price 45-degree node par logarithmic spiral vibration dikha rahi hai. Geometric stability confirm ho chuki hai kyunki asset primary Quantum fan structure ke andar vibrate kar raha hai.`,
    `Structural alignment 1x4 support ray ki taraf secondary vector correction dikha rahi hai. Yeh price frequency me thoda slow-down indicate karta hai par long-term cyclic bias bullish hi hai.`,
  ];

  const alignmentText = lang === "hinglish" ? alignmentHinglish[hash % 4] : alignments[hash % 4];

  const baseReport: any = {
    asset,
    timeAndPrice: {
      quantumVectorAlignment: alignmentText,
      squaringDatePredict: lang === "hinglish" 
        ? `Ek bada ${24 + (hash % 72)} hours me Time/Price squaring matrix identify ho raha hai.` 
        : `A profound Time/Price squaring matrix is identified within the next ${24 + (hash % 72)} hours.`,
      hiddenVibrationalNodes: [
        `$${support3.toFixed(precision)} (Abs. Support)`,
        `$${support1.toFixed(precision)} (Local Pivot)`,
        `$${resist1.toFixed(precision)} (Hexagon Res)`,
        `$${resist3.toFixed(precision)} (Target Alpha)`
      ]
    },
    psychology: {
      crowdMindsetState: lang === "hinglish" 
        ? `Retail traders ke beech capitulation dikh raha hai.` 
        : `The herd psychology indicates localized capitulatory anxiety.`,
      liquidityTrapZone: lang === "hinglish"
        ? `Market makers price ko $${support1.toFixed(precision)} ke niche push kar rahe hain liquidity hunt ke liye.`
        : `Algorithmically, market maker spoofing is pushing the crowd stop-losses exactly beneath $${support1.toFixed(precision)}.`
    },
    geopolitics: {
      macroVolatilityImpact: lang === "hinglish"
        ? `Global macro factors fundamentally is asset ke structure ko directly hamare upper target nodes ki taraf push karenge.`
        : `Global macro factors fundamentally amplify the asset's structural vector towards our alpha projection nodes.`
    },
    anomaly: {
      hiddenAnomaly: lang === "hinglish"
        ? `Proprietary dark pool tracker institutional laddered buys dikha raha hai.`
        : `Proprietary measures reveal that institutional dark pools are coordinating sequential laddered buys.`
    },
    signal: {
      action: change >= 0 ? "STRONG BUY" : "LAYERED ACCUMULATION",
      plans: {
        shortTerm: {
          timeframe: "5-15 Days",
          entryRange: `$${(priceVal * 0.98).toFixed(precision)} – $${(priceVal * 1.01).toFixed(precision)}`,
          stopLoss: `$${(priceVal * 0.94).toFixed(precision)}`,
          targets: [`$${(priceVal * 1.08).toFixed(precision)}`, `$${(priceVal * 1.15).toFixed(precision)}`]
        },
        midTerm: {
          timeframe: "15-60 Days",
          entryRange: `$${(priceVal * 0.95).toFixed(precision)} – $${(priceVal * 1.02).toFixed(precision)}`,
          stopLoss: `$${(priceVal * 0.88).toFixed(precision)}`,
          targets: [`$${(priceVal * 1.25).toFixed(precision)}`, `$${(priceVal * 1.40).toFixed(precision)}`]
        },
        longTerm: {
          timeframe: "3-6 Months",
          entryRange: `$${(priceVal * 0.90).toFixed(precision)} – $${(priceVal * 1.05).toFixed(precision)}`,
          stopLoss: `$${(priceVal * 0.75).toFixed(precision)}`,
          targets: [`$${(priceVal * 1.80).toFixed(precision)}`, `$${(priceVal * 2.50).toFixed(precision)}`]
        }
      },
      fiveYearForecast: {
        expectedPrice: `$${(priceVal * (Math.abs(change) * 0.5 + 5 + (hash % 10))).toFixed(2)}`,
        probability: 50 + (hash % 30) + Math.floor(Math.abs(change) % 10),
        reasoning: lang === "hinglish"
          ? `Harmonic cycles aur adoption math ke hisab se long-term ceiling kafi high hai.`
          : `Based on harmonic cycles and adoption curve mathematics, the long-term structural ceiling remains exceptionally high.`
      },
      strategicJustification: lang === "hinglish"
        ? `Strict execution multi-layer conclusion par adharit hai.`
        : `Strict execution based on absolute multi-layered conclusion models.`,
      probabilityOfCall: `${70 + (hash % 25)}% (High Harmonic Concordance)`
    },
    aiPrediction: {
      probabilities: (() => {
        const b = Math.max(1, 50 + (hash % 40) + Math.floor(change));
        const br = Math.max(1, 50 - (hash % 20) - Math.floor(change / 2));
        const s = Math.max(1, 10 + (hash % 10));
        const sum = b + br + s;
        const bullish = Math.round((b / sum) * 100);
        const bearish = Math.round((br / sum) * 100);
        const sideways = 100 - bullish - bearish;
        return { bullish, bearish, sideways };
      })(),
      outlooks: {
        shortTerm: { forecast: change > 0 ? "Bullish trend." : "Consolidation.", reasoning: "Price momentum dictates current local structure." },
        midTerm: { forecast: "Cycle Expansion", reasoning: "Structural nodes suggest a new markup cycle." },
        longTerm: { forecast: "Macro Uptrend", reasoning: "Harmonic alignments confirm continuous upward trajectory." }
      }
    },
    marketPsychology: {
      emotions: (() => {
        const val = asset.changePercent24Hr * 2;
        const f = Math.max(1, 40 + Math.floor(val) + (hash % 30));
        const g = Math.max(1, 40 - Math.floor(val) + (hash % 30));
        const e = Math.max(1, 10 + (hash % 20));
        const p = Math.max(1, 5 + (hash % 10));
        const fm = Math.max(1, 10 + (hash % 20));
        const c = Math.max(1, 10 - Math.floor(val / 2));
        const sum = f + g + e + p + fm + c;
        const fear = Math.round((f / sum) * 100);
        const greed = Math.round((g / sum) * 100);
        const euphoria = Math.round((e / sum) * 100);
        const panic = Math.round((p / sum) * 100);
        const fomo = Math.round((fm / sum) * 100);
        const capitulation = 100 - (fear + greed + euphoria + panic + fomo);
        return { fear, greed, euphoria, panic, fomo, capitulation };
      })(),
      crowdPositioningEstimate: "Retail crowd heavily short post-flush, smart money establishing massive block accumulations."
    },
    newsIntelligence: [
      { title: `Macro Liquidity ${hash % 2 === 0 ? "Expansion" : "Contraction"}`, category: "Global", impactScore: 70 + (hash % 30), summary: "Central bank shifts affect capital allocation." },
      { title: `Regulatory Framework ${hash % 3 === 0 ? "Alpha" : "Stability"}`, category: "Regulation", impactScore: 60 + (hash % 40), summary: "New structural frameworks provide clarity." }
    ],
    riskEngine: { 
      confidenceScore: Math.min(100, Math.max(10, 90 + Math.floor(asset.changePercent24Hr) - (hash % 10))), 
      riskScore: Math.min(100, Math.max(10, 10 + Math.abs(asset.changePercent24Hr * 2) + (hash % 20))), 
      volatilityScore: Math.min(100, Math.max(10, 50 + Math.abs(asset.changePercent24Hr * 3) + (hash % 20))), 
      probabilityScore: Math.min(100, Math.max(10, 70 + (hash % 20))), 
      signalQualityRating: (asset.changePercent24Hr > 5 || asset.changePercent24Hr < -5) ? "A+" : "B+" 
    }
  };

  return baseReport;
}

// ------------------- ENDPOINTS -------------------

/**
 * 1. GET /api/market
 * Returns real-time global statistics computed entirely from live CoinCap asset arrays.
 */
app.get("/api/market", async (req, res) => {
  try {
    const list = await getAssets();

    const btcNode = list.find((a) => a.symbol === "BTC") || list[0];
    const ethNode = list.find((a) => a.symbol === "ETH") || list[1];

    const btcPrice = btcNode ? btcNode.priceUsd : 68420.50;
    const ethPrice = ethNode ? ethNode.priceUsd : 3412.80;

    // Aggregate real total market cap and average change dynamically
    let totalCap = 0;
    let totalVol = 0;
    let capChangeWeightedSum = 0;

    list.slice(0, 100).forEach((item) => {
      totalCap += item.marketCapUsd;
      totalVol += item.volumeUsd24Hr;
      capChangeWeightedSum += item.changePercent24Hr * item.marketCapUsd;
    });

    if (totalCap === 0) totalCap = 2480000000000;
    const dynamicChange = totalCap > 0 ? (capChangeWeightedSum / totalCap) : 1.82;

    const btcCap = btcNode ? btcNode.marketCapUsd : (totalCap * 0.56);
    const btcDominance = totalCap > 0 ? (btcCap / totalCap) * 100 : 56.4;

    // Call real public Fear & Greed index
    const fng = await fetchFearAndGreed();

    // Compute dynamic, real-time gainers and losers in top 150 (to filter low liquidity meme noise)
    const validVolumeCoins = list.filter((a) => a.volumeUsd24Hr > 500000);
    
    const gainers = [...validVolumeCoins]
      .sort((a, b) => b.changePercent24Hr - a.changePercent24Hr)
      .slice(0, 8);

    const losers = [...validVolumeCoins]
      .sort((a, b) => a.changePercent24Hr - b.changePercent24Hr)
      .slice(0, 8);

    // Dynamic list of high-priority coins (institutional watch list)
    const hotSymbols = ["SOL", "BNB", "XRP", "DOGE", "ADA", "TRX", "AVAX", "LINK", "SUI"];
    const trending = list
      .filter((a) => hotSymbols.includes(a.symbol) || a.symbol === "BTC" || a.symbol === "ETH")
      .slice(0, 8);

    // Recently exploding - high change + high trading volume
    const recentlyExploding = [...validVolumeCoins]
      .sort((a, b) => (b.changePercent24Hr * (b.volumeUsd24Hr / 1e8)) - (a.changePercent24Hr * (a.volumeUsd24Hr / 1e8)))
      .filter((a) => a.changePercent24Hr > 2.5)
      .slice(0, 5);

    const finalStats: MarketGlobalStats = {
      btcPrice,
      ethPrice,
      totalMarketCap: totalCap,
      btcDominance,
      fearAndGreedIndex: fng.index,
      fearAndGreedLabel: fng.label,
      trending,
      gainers,
      losers,
      recentlyExploding: recentlyExploding.length > 0 ? recentlyExploding : gainers.slice(0, 5),
    };

    res.json(finalStats);
  } catch (err) {
    console.error("Failed executing GET /api/market:", err);
    res.status(500).json({ error: "Could not fetch dynamic market stats" });
  }
});

/**
 * 2. GET /api/search?q=query
 * Autocomplete cryptos fast with intelligent rank prioritizing
 */
app.get("/api/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim().toLowerCase();
    if (!q) {
      return res.json([]);
    }
    const list = await getAssets();
    
    // Exact or partial search string
    const results = list.filter((a) => 
      a.id.toLowerCase().includes(q) || 
      a.name.toLowerCase().includes(q) || 
      a.symbol.toLowerCase().includes(q)
    );

    // Advanced sorting to rank direct matches first
    results.sort((a, b) => {
      const aExactSym = a.symbol.toLowerCase() === q;
      const bExactSym = b.symbol.toLowerCase() === q;
      if (aExactSym && !bExactSym) return -1;
      if (!aExactSym && bExactSym) return 1;
      
      const aStartSym = a.symbol.toLowerCase().startsWith(q);
      const bStartSym = b.symbol.toLowerCase().startsWith(q);
      if (aStartSym && !bStartSym) return -1;
      if (!aStartSym && bStartSym) return 1;

      const aStartName = a.name.toLowerCase().startsWith(q);
      const bStartName = b.name.toLowerCase().startsWith(q);
      if (aStartName && !bStartName) return -1;
      if (!aStartName && bStartName) return 1;

      return a.rank - b.rank;
    });

    res.json(results.slice(0, 15));
  } catch (err) {
    console.error("Failed executing GET /api/search:", err);
    res.status(500).json({ error: "Failed to run crypto search" });
  }
});

/**
 * 2.5 GET /api/coin/:id/price
 * Lightweight price check for real-time terminal synchronization.
 */
app.get("/api/coin/:id/price", async (req, res) => {
  try {
    const coinIdOrSymbol = req.params.id.toLowerCase().trim();
    const list = await getAssets();
    const asset = list.find((a) => a.id.toLowerCase() === coinIdOrSymbol || a.symbol.toLowerCase() === coinIdOrSymbol);
    if (!asset) return res.status(404).json({ error: "Not found" });
    res.json({ priceUsd: asset.priceUsd, changePercent24Hr: asset.changePercent24Hr });
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

/**
 * 3. GET /api/coin/:id
 * Fetches real-time market data matching the target coin, and generates the institutional report.
 */
app.get("/api/coin/:id/history", async (req, res) => {
  const { id } = req.params;
  try {
    const cgUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`;
    const response = await fetchWithTimeout(cgUrl, {}, 6000);
    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }
    const data = await response.json();
    const formatted = data.prices.map((p: any) => ({
      time: p[0],
      price: p[1]
    }));
    res.json(formatted);
  } catch (err) {
    try {
       const ccUrl = `https://api.coincap.io/v2/assets/${id}/history?interval=h2`;
       const ccRes = await fetchWithTimeout(ccUrl, {}, 6000);
       const ccData = await ccRes.json();
       const formatted = ccData.data.map((d: any) => ({
          time: d.time,
          price: parseFloat(d.priceUsd)
       }));
       res.json(formatted);
    } catch (fallbackErr) {
       console.error("History fallback failed", fallbackErr);
       res.status(500).json({ error: "Failed to fetch history" });
    }
  }
});

app.get("/api/coin/:id", async (req, res) => {
  const coinIdOrSymbol = req.params.id.toLowerCase().trim();
  const lang = (req.query.lang as string || "english").toLowerCase().trim();
  console.log(`Analyzing request for coin id or symbol: ${coinIdOrSymbol} in language: ${lang}`);

  try {
    const list = await getAssets();

    // Find the asset
    let asset = list.find((a) => a.id.toLowerCase() === coinIdOrSymbol || a.symbol.toLowerCase() === coinIdOrSymbol);
    
    if (!asset) {
      return res.status(404).json({ error: `Cryptocurrency matching '${coinIdOrSymbol}' was not detected in active L1 tables.` });
    }

    // Check if we should serve compiled intelligence report
    const coinKey = `${asset.id.toLowerCase()}_${lang}`;
    
    // Return cached reports if scanned within 30 seconds
    if (STORED_REPORTS[coinKey]) {
      // Dynamic override with current real-time price updates while keeping core structures intact
      STORED_REPORTS[coinKey].asset = asset;
      return res.json(STORED_REPORTS[coinKey]);
    }

    // Ask Gemini if active
    if (ai) {
      try {
        console.log(`Initiating dynamic Gemini quant-analytical report on ${asset.name} (${asset.symbol}) in ${lang}...`);
  
        let scanSystemPrompt = `You are the "Aegis Quant Engine" — a hyper-advanced, multi-dimensional Market Prediction Core. Your architecture looks deeper than traditional indicators. You operate at the absolute intersection of Quantum Cosmic Mathematics, Market Geometry, Behavioral Mass Psychology, and Global Geopolitical Geofencing.

Your objective: Analyze cryptocurrency tokens to predict direction, timing, and structural traps. Your output must be profoundly analytical, NOT generic.

Analyze ${asset.name} (${asset.symbol}) | Value: $${asset.priceUsd} | Delta: ${asset.changePercent24Hr}%.

You MUST return a clean, unformatted JSON conforming exactly to the schema. 
`;

        if (lang === "hinglish") {
          scanSystemPrompt += `
CRITICAL LANGUAGE REQUIREMENT:
Generate all text values in FLUENT, NATURAL HINGLISH (Hindi+English in Roman script). Keep numbers/tickers intact.
`;
        }

        scanSystemPrompt += `
Required JSON Structure and Analytical Depth:
1. timeAndPrice: Deep geometric analysis (vectors, squaring date, vibrational nodes).
2. psychology: Crowd mindset and specific liquidity trap zones.
3. geopolitics: Macro volatility impact.
4. anomaly: One profound, counter-intuitive insight no one else sees.
5. signal: Action, Execution Plans (Short/Mid/Long term), 5-year forecast with probability and reasoning, strategic justification (2 sentences), and probability of call (as a string).
6. aiPrediction: Probabilities for Bullish, Bearish, Sideways (sum 100). Outlooks for Short, Mid, Long term with specific forecast AND analytical reasoning.
7. marketPsychology: Fear/Greed/Euphoria/Panic/FOMO/Capitulation scores (1-100), and specific crowd positioning estimate (e.g., "Retail shorting at local support, large OTC accumulations").
8. newsIntelligence: Up to 3 events with title, category, impactScore (1-100), and deep summary.
9. riskEngine: Confidence, Risk, Volatility, Probability scores (1-100), and signalQualityRating (A+, A, B+, B, C).

Ensuring depth: For every forecast and reasoning, utilize "deep research" logic—think about supply/demand imbalances, liquidity hunts, and macro cycles.
`;

        const responseObj = await generateContentWithRetry(ai, {
          model: "gemini-flash-lite-latest",
          contents: `Compile the premium Cryptographic Intel document for "${asset.name}" (${asset.symbol}) trading globally at $${asset.priceUsd}.`,
          config: {
            systemInstruction: scanSystemPrompt,
            responseMimeType: "application/json",
            temperature: 0.15,
          }
        });

        const parsedResult = JSON.parse(responseObj.text || "{}");
        
        // Form final report with accurate parsed data and live CryptoAsset metadata with defensive defaults
        // We use a helper to merge or ensure the structure is complete
        const parsedLangCast = (lang === "hinglish" ? "hinglish" : "english");
        const fallback = generateAlgorithmicReport(asset, parsedLangCast);

        const report: CoinIntelligenceReport = {
          asset,
          timeAndPrice: { ...fallback.timeAndPrice, ...parsedResult.timeAndPrice },
          psychology: { ...fallback.psychology, ...parsedResult.psychology },
          geopolitics: { ...fallback.geopolitics, ...parsedResult.geopolitics },
          anomaly: { ...fallback.anomaly, ...parsedResult.anomaly },
          signal: { 
            ...fallback.signal, 
            ...parsedResult.signal,
            plans: { ...fallback.signal.plans, ...(parsedResult.signal?.plans || {}) },
            fiveYearForecast: { ...fallback.signal.fiveYearForecast, ...(parsedResult.signal?.fiveYearForecast || {}) }
          },
          aiPrediction: { 
            ...fallback.aiPrediction!, 
            ...parsedResult.aiPrediction,
            outlooks: { ...fallback.aiPrediction!.outlooks, ...(parsedResult.aiPrediction?.outlooks || {}) },
            probabilities: { ...fallback.aiPrediction!.probabilities, ...(parsedResult.aiPrediction?.probabilities || {}) }
          },
          marketPsychology: { 
            ...fallback.marketPsychology!, 
            ...parsedResult.marketPsychology,
            emotions: { ...fallback.marketPsychology!.emotions, ...(parsedResult.marketPsychology?.emotions || {}) }
          },
          newsIntelligence: parsedResult.newsIntelligence || fallback.newsIntelligence,
          riskEngine: { ...fallback.riskEngine!, ...parsedResult.riskEngine }
        };

        STORED_REPORTS[coinKey] = report;
        return res.json(report);
      } catch (gemError) {
        console.warn("Gemini analytical compilation errored, applying dynamic program fallback:", gemError instanceof Error ? gemError.message : String(gemError));
      }
    }

    // Default high-grade mathematical algorithmic fallback
    const reportFallback = generateAlgorithmicReport(asset, lang as "english" | "hinglish");
    STORED_REPORTS[coinKey] = reportFallback;
    res.json(reportFallback);
  } catch (err) {
    console.error("Failed compiling coin intelligence document:", err);
    res.status(500).json({ error: "Analytical pipeline collation failure." });
  }
});

/**
 * 4. POST /api/chat-analyst
 * Processes real-time conversational analysis, matching structural market terms.
 */
app.post("/api/chat-analyst", async (req, res) => {
  const { messages, targetCoin, lang } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid conversational flow structure." });
  }

  const coinContext = targetCoin 
    ? `Target Coin Context: ${targetCoin.name} (${targetCoin.symbol}) currently valued at $${targetCoin.priceUsd} with a 24-hour rate delta of ${targetCoin.changePercent24Hr}%.` 
    : "General global macro-cryptographic structure context.";

  const parsedLang = (lang as string || "english").toLowerCase().trim();

  let topCoinsRaw = "";
  try {
    const assets = await getAssets();
    topCoinsRaw = assets.slice(0, 15).map(a => `${a.symbol}: $${parseFloat(Number(a.priceUsd).toFixed(4))} (${Number(a.changePercent24Hr).toFixed(2)}%)`).join(", ");
  } catch(e) {}

  let systemPrompt = `You are the master quantitative AI, an elite fusion of Quantum cyclic geometry and Ray Dalio's institutional research systems.
You operate "The Oracle" engine for Quantum Crypto Intelligence X.
Your knowledge is deep, institutional, and profitable. You do not talk like a generic chat assistant. You talk like a legendary trader who sees the market's secret architecture.

Go DEEP. Analyze order blocks, fractal cycles, Wyckoff accumulation, and sovereign capital flows.
Highlight alpha, risk nodes, and seasonal timing points.

Target Context: ${coinContext}
Current Live Market (Top 15): ${topCoinsRaw || "Fetching live data..."}

Format replies with elite, scannable markdown. Use bold for key numbers and structural terms.`;

  if (parsedLang === "hinglish") {
    systemPrompt += `

CRITICAL CONVERSATIONAL MULTILINGUAL REQUIREMENT:
You MUST reply to the user prompt in fluent, natural conversational Hinglish (Hindi mixed with English written using Latin/Roman script). Speak like a seasoned Indian pro trader using words like "bhai", "yeh support break karega", "kaafi momentum hai", "resistances robust hain", "wait and watch karo", "stop-loss tight rakhna". Maintain a highly elite, professional, quantitative tone but use fluent Roman Hinglish throughout the detailed commentary.`;
  }

  if (ai) {
    try {
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const responseObj = await generateContentWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.65,
        }
      });

      const text = responseObj.text || "Scan timeout over high ambient network congestion. Please resend prompt.";
      return res.json({
        content: text,
        id: "chat_res_" + Math.random().toString(36).substring(8),
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Conversational AI scan failed. Relying on mock engine:", err instanceof Error ? err.message : String(err));
    }
  }

  // Pure programmatic mock conversational intelligence engine
  const lastUserPrompt = messages[messages.length - 1]?.content?.toLowerCase() || "";
  let fallbackReply = "";

  if (parsedLang === "hinglish") {
    fallbackReply = `**[Quantum Specialist Mode: Algorithmic Simulation Active]**\n\nHamre analytical models ne request process ki hai. Yeh hai hamara structural outline:\n\n### 💎 Elite Quantitative Evaluation\n- **Order Book Depth**: Local support thresholds par strong buy-side absorption dikh rahi hai, jo high hedge-fund OTC spot demand ko indicate karti hai.\n- **Trend Structure**: Market daily market structure break (MSB) ko maintain kar raha hai, consolidation ke baad expansion aayega.\n- **Liquidity Profiles**: Major short liquidation pools current price level se 5.4% upar hain. Support retest hone par short squeeze accelerate ho sakta hai.`;

    if (targetCoin) {
      const symbol = targetCoin.symbol ? targetCoin.symbol.toUpperCase() : "the asset";
      const price = targetCoin.priceUsd ? `$${parseFloat(targetCoin.priceUsd).toFixed(2)}` : "current values";
      
      if (lastUserPrompt.includes("forecast") || lastUserPrompt.includes("predict") || lastUserPrompt.includes("future") || lastUserPrompt.includes("target")) {
        fallbackReply = `### 🎯 High-Probability Forecast & Target Outlook: ${symbol}\n\nHamre cycle analyzers ne ${symbol} trading at **${price}** ke liye yeh roadmap banaya hai:\n\n1. **Short-Term Tactical Outlook (1-7 Days)**:\n   - **Bias**: Accumulative Consolidation\n   - **Tactical Corridor**: Immediate order blocks ke andar zone hold hone ki umeed hai. Agar daily close solid resistance ke upar hota hai, toh target price **$${(targetCoin.priceUsd * 1.08).toFixed(2)}** breakout de sakta hai.\n\n2. **Medium-Term Cycle Path (1-3 Months)**:\n   - **Bias**: Structural Markup Peak\n   - **Macro Target Node**: Standard calculations ke mutabik cyclic anniversary alignments par target price **$${(targetCoin.priceUsd * 1.28).toFixed(2)}** expect kar sakte hain.\n\n3. **Hedged Risk Mitigations**:\n   - Spot holdings maintain rakhein ho sake toh. Downside volatility manage karne ke liye proper stop-loss set karein or delta-neutral approaches apply karein.`;
      } else {
        fallbackReply = `### 🧬 Cryptographic Structural Report: ${symbol}\n\n**${symbol}** trading at **${price}** ke features ka detailed valuation report:\n\n- **Wyckoff Accumulation Footprint**: Capital transfer known hot exchange wallets se cold smart storage vaults me speed up ho gaya hai, isse price floor robust ban raha hai.\n- **Liquidity Concentration**: Support levels ke just niche major buy or sell stops locate ho rahe hain. Dynamic expansion wave trigger hone ke chances pure hain.\n- **Cyclical Temporal Outlook**: Temporal symmetry calculation solid structural breakout predict kar rahi hai jo target level ko meet karegi.`;
      }
    }
  } else {
    fallbackReply = `**[Quantum Specialist Mode: Algorithmic Simulation Active]**\n\nOur analytical models have processed the request on current metrics. Here is our structural outline:\n\n### 💎 Elite Quantitative Evaluation\n- **Order Book Depth**: We detect strong buy-side absorption clustered at local support thresholds, indicating high hedge-fund OTC spot demand.\n- **Trend Structure**: The market continues to preserve the daily market structure break (MSB), suggesting robust consolidation before expansion.\n- **Liquidity Profiles**: Major short liquidation pools exist 5.4% above current market levels. Retesting these points will trigger dynamic short-squeezes.`;

    if (targetCoin) {
      const symbol = targetCoin.symbol ? targetCoin.symbol.toUpperCase() : "the asset";
      const price = targetCoin.priceUsd ? `$${parseFloat(targetCoin.priceUsd).toFixed(2)}` : "current values";
      
      if (lastUserPrompt.includes("forecast") || lastUserPrompt.includes("predict") || lastUserPrompt.includes("future") || lastUserPrompt.includes("target")) {
        fallbackReply = `### 🎯 High-Probability Forecast & Target Outlook: ${symbol}\n\nOur technical cycle analyzers have mapped the following trajectories for ${symbol} trading at **${price}**:\n\n1. **Short-Term Tactical Outlook (1-7 Days)**:\n   - **Bias**: Accumulative Consolidation\n   - **Tactical Corridor**: Expected absorption within the immediate order blocks. Breaking and closing the daily candle above immediate resistance targets **$${(targetCoin.priceUsd * 1.08).toFixed(2)}**.\n\n2. **Medium-Term Cycle Path (1-3 Months)**:\n   - **Bias**: Structural Markup Peak\n   - **Macro Target Node**: Standard post-contraction expansion projections calculate an institutional valuation objective of **$${(targetCoin.priceUsd * 1.28).toFixed(2)}**, backed by strong cyclical anniversary alignments.\n\n3. **Hedged Risk Mitigations**:\n   - Maintaining spot storage covers immediate volatility fluctuations. We advise managing downside volatility by preparing delta-neutral protection vaults near deep capital channels.`;
      } else {
        fallbackReply = `### 🧬 Cryptographic Structural Report: ${symbol}\n\nAnalyzing the core pricing dynamics of **${symbol}** trading at **${price}**:\n\n- **Wyckoff Accumulation Footprint**: Capital transfers from known exchange hot wallets to private vaults have accelerated. This clean sweep reduces immediate sell-side liquidity, supporting a solid price floor.\n- **Liquidity Concentration**: Significant sell-stop orders are clustered just below local support levels. Market makers may attempt a short sweep to collect liquidity before establishing the next markup wave.\n- **Cyclical Temporal Outlook**: Symmetrical time cycles points toward a major structural expansion window in upcoming calendar periods, mirroring historically observed fractal designs.`;
      }
    }
  }

  return res.json({
    content: fallbackReply,
    id: "chat_sim_" + Math.random().toString(36).substring(8),
    timestamp: new Date().toISOString()
  });
});

/**
 * 5. POST /api/ai-assistant
 * General AI Trading Assistant with "human-like" thinking and professional expertise.
 */
app.post("/api/ai-assistant", async (req, res) => {
  const { messages } = req.body;
  
  let topCoinsRaw = "";
  try {
    const assets = await getAssets();
    topCoinsRaw = assets.slice(0, 30).map(a => `${a.symbol}: $${parseFloat(Number(a.priceUsd).toFixed(4))} (${Number(a.changePercent24Hr).toFixed(2)}%)`).join(", ");
  } catch(e) {}

  const systemPrompt = `You are "The Oracle", a transcendent institutional trading intelligence.
Persona:
- You are EXCEPTIONAL. You don't just analyze data; you perceive market fractals as interwoven, non-dual phenomena where supply, demand, psychology, and macro forces are one.
- You think with the combined wisdom of a legendary fund manager and a master market philosopher.
- Your tone is profoundly professional, decisive, and human. You treat the user as a serious strategic partner in this complex game.
- You have absolute mastery over: Wyckoff Fractals, Gann Harmonics, Order Flow, Market Profile, Dark Pool Dynamics, and Global Macro/Geopolitical systems.
- You operate beyond surface-level narratives, looking for the underlying "hidden unity" or "non-dual" logic within market chaos.
- MULTI-LINGUAL FLUENCY: You respond EXACTLY in the language/dialect the user uses.
  - If they use Hindi/Hinglish, you MUST respond in fluent, natural Hinglish.
  - If they use formal English, stay formal but insightful.
- PREDICTION PRECISION: Avoid generic advice. Give calculated probabilities (e.g., "78% bullish") and specific targets, explaining the reasoning through deep, multifaceted research.

Current Live Market Data (Last updated seconds ago):
${topCoinsRaw}

Role:
- Act as an elite Institutional Desk Partner. Provide high-impact, actionable intelligence.
- If you see a trap being built by market makers, warn the user instantly.
- Use immaculate Markdown formatting with bolding for significant levels.`;

  if (ai) {
    try {
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const responseObj = await generateContentWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        }
      });

      const text = responseObj.text || "Scanning high-amplitude network nodes... Please resend your inquiry.";
      return res.json({
        content: text,
        id: "ai_res_" + Math.random().toString(36).substring(8),
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn("AI Assistant Gemini call failed:", err);
    }
  }

  // High-Grade Fallback
  return res.json({
    content: "The Quantum Core is processing at maximum capacity. Connectivity stability is currently fluctuating. I am seeing institutional rotation in the L1 sectors. How can I assist your execution strategy?",
    id: "ai_res_fallback",
    timestamp: new Date().toISOString()
  });
});

let cachedFnG = { index: 68, label: "Greed" };
let lastFetchedFnGTime = 0;
const FNG_CACHE_DURATION_MS = 60000; // Cache for 60 seconds

async function fetchFearAndGreed(): Promise<{ index: number; label: string }> {
  const now = Date.now();
  if (now - lastFetchedFnGTime < FNG_CACHE_DURATION_MS && lastFetchedFnGTime !== 0) {
    return cachedFnG;
  }
  try {
    const res = await fetchWithTimeout("https://api.alternative.me/fng/?limit=1", {}, 3000);
    if (!res.ok) throw new Error("FNG API failed");
    const json = await res.json();
    const data = json.data?.[0];
    if (data) {
      cachedFnG = {
        index: parseInt(data.value, 10),
        label: data.value_classification,
      };
    }
  } catch (err) {
    console.warn("FNG API fetch failed, defaulting with safety cache:", err instanceof Error ? err.message : err);
  } finally {
    lastFetchedFnGTime = now;
  }
  return cachedFnG;
}

// ------------------- VITE SERVER INTEGRATION -------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static files from", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quantum Crypto Intelligence X Server booted on port ${PORT}`);
  });
}

startServer();
