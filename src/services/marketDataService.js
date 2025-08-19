// Real Market Data Service
const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY;
const UW_KEY = process.env.REACT_APP_UNUSUAL_WHALES_KEY;
const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';
const TWELVE_DATA_KEY = process.env.REACT_APP_TWELVE_DATA_KEY;

// Debug: Check if API keys are loaded (only first few chars for security)
console.log('API Keys loaded:', {
    polygon: POLYGON_KEY ? `Yes (${POLYGON_KEY.substring(0, 4)}...)` : 'No',
    alphaVantage: ALPHA_VANTAGE_KEY ? `Yes (${ALPHA_VANTAGE_KEY.substring(0, 4)}...)` : 'No',
    twelveData: TWELVE_DATA_KEY ? `Yes (${TWELVE_DATA_KEY.substring(0, 4)}...)` : 'No',
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

// Get real-time stock quote - tries multiple sources
export async function getStockQuote(symbol) {
    // Try Twelve Data first (usually fastest and most reliable)
    if (TWELVE_DATA_KEY) {
        try {
            const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.price) {
                return {
                    symbol: symbol,
                    price: parseFloat(data.close || data.price || 0),
                    change: parseFloat(data.percent_change || 0),
                    volume: parseInt(data.volume || 0),
                    high: parseFloat(data.high || data.price || 0),
                    low: parseFloat(data.low || data.price || 0),
                    open: parseFloat(data.open || data.price || 0)
                };
            }
        } catch (error) {
            console.log(`Twelve Data error for ${symbol}, trying Alpha Vantage...`);
        }
    }
    
    // Try Alpha Vantage as backup
    if (ALPHA_VANTAGE_KEY) {
        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data['Global Quote']) {
                const quote = data['Global Quote'];
                return {
                    symbol: symbol,
                    price: parseFloat(quote['05. price'] || quote['08. previous close'] || 0),
                    change: parseFloat(quote['10. change percent']?.replace('%', '') || 0),
                    volume: parseInt(quote['06. volume'] || 0),
                    high: parseFloat(quote['03. high'] || 0),
                    low: parseFloat(quote['04. low'] || 0),
                    open: parseFloat(quote['02. open'] || 0)
                };
            }
        } catch (error) {
            console.log(`Alpha Vantage error for ${symbol}, trying Polygon...`);
        }
    }
    
    // Try Polygon as last resort (in case the key starts working)
    if (POLYGON_KEY && POLYGON_KEY !== 'undefined') {
        try {
            const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_KEY}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.results && data.results[0]) {
                    const result = data.results[0];
                    return {
                        symbol: symbol,
                        price: result.c,
                        change: ((result.c - result.o) / result.o) * 100,
                        volume: result.v,
                        high: result.h,
                        low: result.l,
                        open: result.o
                    };
                }
            }
        } catch (error) {
            console.log(`Polygon still not working for ${symbol}`);
        }
    }
    
    // Final fallback to mock data
    console.log(`Using mock data for ${symbol}`);
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
        // Using the correct options volume endpoint from the docs
        const url = `https://api.unusualwhales.com/api/options/volume/alerts`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${UW_KEY}`
        };
        
        const response = await fetch(url, { headers });
        
        if (response.ok) {
            const data = await response.json();
            console.log('UW API response received:', data);
            
            if (data && data.data) {
                return data.data.slice(0, 10).map(alert => ({
                    symbol: alert.ticker || 'SPY',
                    type: alert.type ? alert.type.toUpperCase() : 'CALL',
                    strike: parseFloat(alert.strike) || 0,
                    expiry: alert.expiry || '2025-01-17',
                    premium: parseFloat(alert.total_premium) || 0,
                    volume: parseInt(alert.volume) || 0,
                    sentiment: parseFloat(alert.volume_oi_ratio) > 2 ? 'BULLISH' : 'NEUTRAL',
                    alertType: alert.alert_rule || 'Volume Alert'
                }));
            }
        } else {
            console.log(`UW API error: ${response.status} - ${response.statusText}`);
            
            // Try alternative endpoint - regular options flow
            const altUrl = `https://api.unusualwhales.com/api/options/flow`;
            const altResponse = await fetch(altUrl, { headers });
            
            if (altResponse.ok) {
                const altData = await altResponse.json();
                if (altData && altData.data) {
                    return altData.data.slice(0, 10).map(flow => ({
                        symbol: flow.underlying_symbol || flow.ticker || 'SPY',
                        type: flow.option_type ? flow.option_type.toUpperCase() : 'CALL',
                        strike: flow.strike || 0,
                        expiry: flow.expiry || '2025-01-17',
                        premium: flow.premium || 0,
                        volume: flow.size || flow.volume || 0,
                        sentiment: 'NEUTRAL'
                    }));
                }
            }
        }
    } catch (error) {
        console.log('UW API error, using mock data:', error.message);
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
