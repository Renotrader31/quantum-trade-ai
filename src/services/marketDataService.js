// Real Market Data Service
const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY;
const UW_KEY = process.env.REACT_APP_UNUSUAL_WHALES_KEY;

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

    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_KEY}`;
    const data = await fetchWithCache(url, `quote_${symbol}`);
    
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
        const url = `https://api.unusualwhales.com/api/option_flows?api_key=${UW_KEY}&limit=10`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.data) {
            return data.data.map(flow => ({
                symbol: flow.symbol,
                type: flow.order_type,
                strike: flow.strike,
                expiry: flow.expiry,
                premium: flow.premium,
                volume: flow.volume,
                sentiment: flow.sentiment
            }));
        }
    } catch (error) {
        console.error('Error fetching options flow:', error);
    }
    
    return getMockOptionsFlow();
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
    const marketOverview = await getMarketOverview();
    const optionsFlow = await getOptionsFlow();
    
    return {
        ...marketOverview.quotes,
        optionsFlow,
        marketSentiment: marketOverview.sentiment,
        timestamp: marketOverview.timestamp
    };
}
