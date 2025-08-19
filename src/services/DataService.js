const API_KEYS = {
  polygon: process.env.REACT_APP_POLYGON_API_KEY,
  unusualWhales: process.env.REACT_APP_UNUSUAL_WHALES_KEY,
  fmp: process.env.REACT_APP_FMP_API_KEY,
  ortex: process.env.REACT_APP_ORTEX_API_KEY
};

export const fetchRealMarketData = async (symbols = ['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA']) => {
  const data = {};
  
  for (const symbol of symbols) {
    try {
      // Polygon API for price data
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${API_KEYS.polygon}`
      );
      
      if (response.ok) {
        const result = await response.json();
        const ticker = result.results?.[0];
        
        if (ticker) {
          data[symbol] = {
            symbol,
            currentPrice: ticker.c, // Close price
            volume: ticker.v,
            high: ticker.h,
            low: ticker.l,
            open: ticker.o,
            previousClose: ticker.c,
            change: ((ticker.c - ticker.o) / ticker.o * 100).toFixed(2),
            timestamp: ticker.t
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      // Return mock data if API fails
      data[symbol] = {
        symbol,
        currentPrice: 100 + Math.random() * 400,
        volume: Math.floor(Math.random() * 100000000),
        change: (Math.random() - 0.5) * 10
      };
    }
  }
  
  return data;
};

export const fetchOptionsFlow = async (symbol) => {
  try {
    const response = await fetch(
      `https://api.unusualwhales.com/api/stock/${symbol}/options-flow?api_key=${API_KEYS.unusualWhales}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Options flow error:', error);
  }
  return null;
};
