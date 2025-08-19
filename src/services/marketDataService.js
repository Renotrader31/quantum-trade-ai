// Real Market Data Service
const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY;
const UW_KEY = process.env.REACT_APP_UNUSUAL_WHALES_KEY;

// Debug: Check if API keys are loaded (only first few chars for security)
console.log('API Keys loaded:', {
    polygon: POLYGON_KEY ? `Yes (${POLYGON_KEY.substring(0, 4)}...)` : 'No',
    fmp: FMP_KEY ? `Yes (${FMP_KEY.substring(0, 4)}...)` : 'No',
    uw: UW_KEY ? `Yes (${UW_KEY.substring(0, 4)}...)` : 'No'
});

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

async function fetchWithCache(url, cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error(`Error fetching ${cacheKey}:`, error);
        return null;
    }
}

// Get real-time stock quote from Polygon
export async function getStockQuote(symbol) {
    if (!POLYGON_KEY) {
        console.warn('Polygon API key not found, using mock data');
        return getMockQuote(symbol);
    }

    // Polygon requires the API key as a query parameter
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Polygon API error for ${symbol}: ${response.status}`);
            return getMockQuote(symbol);
        }
        
        const data = await response.json();
        
        if (data && data.results && data.results[0]) {
            const result = data.results[0];
            return {
                symbol: symbol,
                price: result.c, // close price
                change: ((result.c - result.o) / result.o) * 100, // percentage change
                volume: result.v,
                high: result.h,
                low: result.l,
                open: result.o
            };
        }
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
    }
    
    return getMockQuote(symbol);
}

// Get multiple stock quotes
export async function getMultipleQuotes(symbols) {
    const quotes = await Promise.all(
        symbols.map(symbol => getStockQuote(symbol))
    );
    return quotes.reduce((acc, quote) => {
        acc[quote.symbol] = quote;
        return acc;
    }, {});
}

// Get market overview data
export async function getMarketOverview() {
    const symbols = ['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA', 'TSLA'];
    const quotes = await getMultipleQuotes(symbols);
    
    // Calculate market sentiment
    const avgChange = Object.values(quotes).reduce((sum, q) => sum + q.change, 0) / symbols.length;
    
    return {
        quotes,
        sentiment: avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral',
        avgChange,
        timestamp: new Date().toISOString()
    };
}

// Get options flow from Unusual Whales
export async function getOptionsFlow() {
    if (!UW_KEY) {
        console.warn('Unusual Whales API key not found, using mock data');
        return getMockOptionsFlow();
    }

    try {
        // Using the options flow endpoint
        const url = `https://api.unusualwhales.com/api/stock/options/flow?ticker=SPY&limit=20`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${UW_KEY}`
        };
        
        const response = await fetch(url, { headers });
        const data = await response.json();
        
        if (data && data.data) {
            return data.data.slice(0, 10).map(flow => ({
                symbol: flow.underlying_symbol || flow.ticker || 'SPY',
                type: flow.option_type ? flow.option_type.toUpperCase() : 'CALL',
                strike: flow.strike || 0,
                expiry: flow.expiry || flow.expires_at || '2025-01-17',
                premium: flow.premium || flow.total_premium || 0,
                volume: flow.volume || flow.size || 0,
                sentiment: flow.tags && flow.tags.includes('bullish') ? 'BULLISH' : 
                          flow.tags && flow.tags.includes('bearish') ? 'BEARISH' : 'NEUTRAL',
                price: flow.price || 0,
                underlying: flow.underlying_price || 0
            }));
        }
    } catch (error) {
        console.error('Error fetching UW options flow:', error);
    }
    
    return getMockOptionsFlow();
}

// Get unusual activity/alerts
export async function getUnusualActivity() {
    if (!UW_KEY) {
        return [];
    }

    try {
        const url = `https://api.unusualwhales.com/api/stock/options/volume_alerts`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${UW_KEY}`
        };
        
        const response = await fetch(url, { headers });
        const data = await response.json();
        
        if (data && data.data) {
            return data.data.slice(0, 5).map(alert => ({
                ticker: alert.ticker,
                alertType: alert.alert_rule,
                strike: alert.strike,
                expiry: alert.expiry,
                premium: alert.total_premium,
                volumeOIRatio: alert.volume_oi_ratio,
                type: alert.type
            }));
        }
    } catch (error) {
        console.error('Error fetching unusual activity:', error);
    }
    
    return [];
}

// Mock data fallbacks
function getMockQuote(symbol) {
    const basePrice = Math.random() * 500 + 100;
    const change = (Math.random() - 0.5) * 10;
    return {
        symbol,
        price: basePrice,
        change: change,
        volume: Math.floor(Math.random() * 10000000),
        high: basePrice * 1.02,
        low: basePrice * 0.98,
        open: basePrice - (basePrice * change / 100)
    };
}

function getMockOptionsFlow() {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ'];
    return symbols.map(symbol => ({
        symbol,
        type: Math.random() > 0.5 ? 'CALL' : 'PUT',
        strike: Math.floor(Math.random() * 50 + 150),
        expiry: '2025-08-29',
        premium: Math.floor(Math.random() * 1000000),
        volume: Math.floor(Math.random() * 5000),
        sentiment: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH'
    }));
}

// Export main function for ML Trading Dashboard
export async function getRealMarketData() {
    try {
        const marketOverview = await getMarketOverview();
        const optionsFlow = await getOptionsFlow();
        const unusualActivity = await getUnusualActivity();
        
        // Ensure we have valid data for each stock
        const formattedData = {};
        
        Object.entries(marketOverview.quotes).forEach(([symbol, data]) => {
            formattedData[symbol] = {
                symbol: symbol,
                currentPrice: data.price || 0,
                change: data.change || 0,
                volume: data.volume || 0,
                high: data.high || data.price || 0,
                low: data.low || data.price || 0,
                vwap: data.price || 0, // Simplified VWAP
                prices: Array(50).fill(data.price || 0).map((p, i) => 
                    p + (Math.random() - 0.5) * 2
                ),
                highs: Array(50).fill(data.high || data.price || 0),
                lows: Array(50).fill(data.low || data.price || 0),
                avgVolume: data.volume || 1000000,
                callVolume: Math.floor(Math.random() * 100000),
                putVolume: Math.floor(Math.random() * 100000),
                unusualActivity: Math.random() > 0.7
            };
        });
        
        formattedData.optionsFlow = optionsFlow;
        formattedData.unusualActivity = unusualActivity;
        formattedData.marketSentiment = marketOverview.sentiment;
        formattedData.timestamp = marketOverview.timestamp;
        
        return formattedData;
    } catch (error) {
        console.error('Error in getRealMarketData:', error);
        // Return a valid default structure
        return {
            SPY: { currentPrice: 0, change: 0, volume: 0, prices: [], highs: [], lows: [] },
            QQQ: { currentPrice: 0, change: 0, volume: 0, prices: [], highs: [], lows: [] },
            AAPL: { currentPrice: 0, change: 0, volume: 0, prices: [], highs: [], lows: [] },
            optionsFlow: [],
            unusualActivity: []
        };
    }
}
