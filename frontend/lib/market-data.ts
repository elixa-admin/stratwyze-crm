// JSE market data: Twelvedata (primary) → Alpha Vantage (fallback)
// Cache: 6h during JSE trading hours (09:00–17:00 SAST Mon–Fri), 24h otherwise

export interface MarketQuote {
  symbol: string;
  exchange: string;
  price: number;
  change: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currency: string;
}

export interface MarketSignal {
  type: string;
  label: string;
  sentiment: 'positive' | 'neutral' | 'caution' | 'risk';
}

export interface MarketHealthData {
  source: 'twelvedata' | 'alphavantage' | 'unavailable';
  fetchedAt: string;
  symbol: string;
  exchange: string;
  quote: MarketQuote | null;
  healthScore: number;       // 0–100
  healthLabel: 'Strong' | 'Healthy' | 'Stable' | 'Under Pressure' | 'At Risk';
  healthColor: 'green' | 'amber' | 'red';
  signals: MarketSignal[];
  salesContext: string;      // One-paragraph sales intelligence note
  rangePosition: number;     // 0–100: where price sits in 52-week range
}

// JSE opens 09:00, closes 17:00 SAST (UTC+2)
function isJseTradingHours(): boolean {
  const now = new Date();
  const sast = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
  const day = sast.getDay(); // 0=Sun, 6=Sat
  const hour = sast.getHours();
  if (day === 0 || day === 6) return false;
  return hour >= 9 && hour < 17;
}

function cacheTtlMs(): number {
  return isJseTradingHours() ? 6 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
}

export function isCacheStale(fetchedAt: string | null | undefined): boolean {
  if (!fetchedAt) return true;
  const age = Date.now() - new Date(fetchedAt).getTime();
  return age > cacheTtlMs();
}

function calcHealthScore(quote: MarketQuote): {
  score: number;
  label: MarketHealthData['healthLabel'];
  color: MarketHealthData['healthColor'];
  rangePosition: number;
  signals: MarketSignal[];
} {
  let score = 50;
  const signals: MarketSignal[] = [];

  // 52-week range position (0–100)
  const range = quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow;
  const rangePosition = range > 0
    ? Math.round(((quote.price - quote.fiftyTwoWeekLow) / range) * 100)
    : 50;

  if (rangePosition >= 75) {
    score += 15;
    signals.push({ type: '52w_high', label: `Near 52-week high (${rangePosition}% of range)`, sentiment: 'positive' });
  } else if (rangePosition >= 50) {
    score += 5;
    signals.push({ type: '52w_mid', label: `Mid 52-week range (${rangePosition}%)`, sentiment: 'neutral' });
  } else if (rangePosition >= 25) {
    score -= 8;
    signals.push({ type: '52w_low', label: `Lower half of 52-week range (${rangePosition}%)`, sentiment: 'caution' });
  } else {
    score -= 18;
    signals.push({ type: '52w_bottom', label: `Near 52-week low (${rangePosition}% of range)`, sentiment: 'risk' });
  }

  // 30-day / intraday price change
  if (quote.percentChange > 3) {
    score += 15;
    signals.push({ type: 'momentum', label: `Strong momentum: +${quote.percentChange.toFixed(1)}% today`, sentiment: 'positive' });
  } else if (quote.percentChange > 0) {
    score += 5;
    signals.push({ type: 'up', label: `Up ${quote.percentChange.toFixed(1)}% today`, sentiment: 'neutral' });
  } else if (quote.percentChange > -3) {
    score -= 5;
    signals.push({ type: 'soft', label: `Soft session: ${quote.percentChange.toFixed(1)}% today`, sentiment: 'caution' });
  } else {
    score -= 15;
    signals.push({ type: 'selloff', label: `Down ${quote.percentChange.toFixed(1)}% today`, sentiment: 'risk' });
  }

  // Volume context (high volume = conviction, either direction)
  if (quote.volume > 1_000_000) {
    const label = quote.percentChange >= 0 ? 'High volume on up day — conviction buying' : 'High volume on down day — watch for volatility';
    signals.push({ type: 'volume', label, sentiment: quote.percentChange >= 0 ? 'positive' : 'caution' });
    score += quote.percentChange >= 0 ? 5 : -5;
  }

  score = Math.max(0, Math.min(100, score));

  let label: MarketHealthData['healthLabel'];
  let color: MarketHealthData['healthColor'];
  if (score >= 78) { label = 'Strong'; color = 'green'; }
  else if (score >= 62) { label = 'Healthy'; color = 'green'; }
  else if (score >= 45) { label = 'Stable'; color = 'amber'; }
  else if (score >= 28) { label = 'Under Pressure'; color = 'amber'; }
  else { label = 'At Risk'; color = 'red'; }

  return { score, label, color, rangePosition, signals };
}

function buildSalesContext(quote: MarketQuote, health: ReturnType<typeof calcHealthScore>, companyName: string): string {
  const below52w = ((quote.fiftyTwoWeekHigh - quote.price) / quote.fiftyTwoWeekHigh * 100).toFixed(0);
  const above52wLow = ((quote.price - quote.fiftyTwoWeekLow) / quote.fiftyTwoWeekLow * 100).toFixed(0);

  if (health.color === 'green') {
    return `${companyName} is trading in the upper range of its 52-week band (+${above52wLow}% above annual low), with ${health.label.toLowerCase()} market momentum. This signals a company in growth or confidence mode — leadership tends to approve strategic IT investment during periods of stock strength. Good timing to position HaloITSM as a growth enabler rather than a cost-cutting tool.`;
  }
  if (health.color === 'amber') {
    return `${companyName} is trading around the mid-point of its 52-week range. Stable, but not in strong growth mode. Budget conversations may require a clear ROI case — position HaloITSM around operational efficiency and cost reduction. Avoid leading with premium features; lead with payback period.`;
  }
  return `${companyName} is trading ${below52w}% below its 52-week high, signalling potential cost pressure or market headwinds. IT budget scrutiny is likely elevated. Lead every conversation with TCO reduction and fast time-to-value — frame HaloITSM as a way to cut costs versus the incumbent, not as a new investment. Avoid multi-year commitments in the proposal; offer a phased start.`;
}

async function fetchTwelvedata(symbol: string, companyName: string): Promise<MarketHealthData | null> {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&exchange=JSE&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status === 'error' || !data.close) return null;

    const quote: MarketQuote = {
      symbol: data.symbol,
      exchange: 'JSE',
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      percentChange: parseFloat(data.percent_change),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      volume: parseInt(data.volume, 10),
      fiftyTwoWeekHigh: parseFloat(data.fifty_two_week?.high ?? data.high),
      fiftyTwoWeekLow: parseFloat(data.fifty_two_week?.low ?? data.low),
      currency: data.currency ?? 'ZAR',
    };

    const health = calcHealthScore(quote);
    return {
      source: 'twelvedata',
      fetchedAt: new Date().toISOString(),
      symbol,
      exchange: 'JSE',
      quote,
      healthScore: health.score,
      healthLabel: health.label,
      healthColor: health.color,
      signals: health.signals,
      salesContext: buildSalesContext(quote, health, companyName),
      rangePosition: health.rangePosition,
    };
  } catch {
    return null;
  }
}

async function fetchAlphaVantage(symbol: string, companyName: string): Promise<MarketHealthData | null> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) return null;

  try {
    // Alpha Vantage uses symbol.JO suffix for JSE
    const avSymbol = `${symbol}.JO`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(avSymbol)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;

    const data = await res.json();
    const q = data['Global Quote'];
    if (!q || !q['05. price']) return null;

    const price = parseFloat(q['05. price']);
    const change = parseFloat(q['09. change']);
    const pct = parseFloat(q['10. change percent']?.replace('%', '') ?? '0');
    const high = parseFloat(q['03. high']);
    const low = parseFloat(q['04. low']);

    const quote: MarketQuote = {
      symbol,
      exchange: 'JSE',
      price,
      change,
      percentChange: pct,
      open: parseFloat(q['02. open']),
      high,
      low,
      volume: parseInt(q['06. volume'], 10),
      fiftyTwoWeekHigh: parseFloat(q['03. high']),
      fiftyTwoWeekLow: parseFloat(q['04. low']),
      currency: 'ZAR',
    };

    const health = calcHealthScore(quote);
    return {
      source: 'alphavantage',
      fetchedAt: new Date().toISOString(),
      symbol,
      exchange: 'JSE',
      quote,
      healthScore: health.score,
      healthLabel: health.label,
      healthColor: health.color,
      signals: health.signals,
      salesContext: buildSalesContext(quote, health, companyName),
      rangePosition: health.rangePosition,
    };
  } catch {
    return null;
  }
}

export async function fetchMarketData(symbol: string, companyName: string): Promise<MarketHealthData> {
  const clean = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const result = await fetchTwelvedata(clean, companyName)
    ?? await fetchAlphaVantage(clean, companyName);

  if (result) return result;

  return {
    source: 'unavailable',
    fetchedAt: new Date().toISOString(),
    symbol: clean,
    exchange: 'JSE',
    quote: null,
    healthScore: 50,
    healthLabel: 'Stable',
    healthColor: 'amber',
    signals: [],
    salesContext: 'Market data temporarily unavailable. Check JSE.co.za for latest price and trading activity.',
    rangePosition: 50,
  };
}

// Auto-detect JSE ticker from SerpAPI research text
const JSE_TICKER_PATTERNS = [
  /JSE[:\s]+([A-Z]{2,6})/gi,
  /\(JSE[:\s]*([A-Z]{2,6})\)/gi,
  /listed on the JSE[^.]*?(?:as|under|ticker)[:\s]+([A-Z]{2,6})/gi,
  /JSE[:\s]*listed[^.]*?([A-Z]{2,6})/gi,
  /(?:JSE|Johannesburg Stock Exchange)[^.]*?(?:symbol|code|ticker)[:\s]+([A-Z]{2,6})/gi,
];

// Known JSE tickers for major SA companies
const KNOWN_JSE_TICKERS: Record<string, string> = {
  naspers: 'NPN', 'standard bank': 'SBK', fnb: 'FSR', firstrand: 'FSR',
  absa: 'ABG', nedbank: 'NED', capitec: 'CPI', discovery: 'DSY',
  mtn: 'MTN', vodacom: 'VOD', telkom: 'TKG', sasol: 'SOL',
  'anglo american': 'AGL', 'bhp billiton': 'BHP', bhp: 'BHP',
  impala: 'IMP', 'implats': 'IMP', lonmin: 'LON', sibanye: 'SSW',
  'shoprite': 'SHP', 'pick n pay': 'PIK', 'woolworths': 'WHL',
  'spar': 'SPP', mr: 'MRP', 'mr price': 'MRP', foschini: 'TFG',
  'liberty holdings': 'LBH', 'old mutual': 'OMU', sanlam: 'SLM',
  'tiger brands': 'TBS', 'aeci': 'AFE', bidcorp: 'BID', bidvest: 'BVT',
  remgro: 'REM', richemont: 'CFR', redefine: 'RDF', growthpoint: 'GRT',
  'hyprop': 'HYP', 'emira': 'EMI', 'vukile': 'VKE', 'attacq': 'ATT',
  'city lodge': 'CLH', sun: 'SUI', 'sun international': 'SUI',
  tsogo: 'TSG', 'tsogo sun': 'TSG', 'exxaro': 'EXX', kumba: 'KIO',
  'datatec': 'DTC', dimension: 'DTC', 'blue label': 'BLU',
  transaction: 'TCP', 'net1': 'NT1', 'multichoice': 'MCG',
  dstv: 'MCG', 'clicks': 'CLS', dis: 'DCP', 'dis-chem': 'DCP',
};

export function detectJseTicker(researchText: string, companyName: string): string | null {
  const text = researchText ?? '';

  // Check known tickers first
  const nameLower = companyName.toLowerCase();
  for (const [key, ticker] of Object.entries(KNOWN_JSE_TICKERS)) {
    if (nameLower.includes(key)) return ticker;
  }

  // Pattern matching on research text
  for (const pattern of JSE_TICKER_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match?.[1] && match[1].length >= 2 && match[1].length <= 6) {
      return match[1].toUpperCase();
    }
  }

  // Check if research text mentions JSE listing at all
  const jseMentioned = /JSE|Johannesburg Stock Exchange|JSE-listed|listed company/i.test(text);
  if (!jseMentioned) return null;

  return null;
}
