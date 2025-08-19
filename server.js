const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API server is working!',
    timestamp: new Date().toISOString()
  });
});

// Polygon API proxy - for paid tier
app.get('/api/polygon/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
    
    console.log(`Fetching ${symbol} from Polygon...`);
    
    // Use the previous day aggregates endpoint (works with paid tier)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Polygon response:', data);
    res.json(data);
  } catch (error) {
    console.error('Polygon API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Twelve Data proxy (backup)
app.get('/api/twelve/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.REACT_APP_TWELVE_DATA_KEY;
    
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alpha Vantage proxy (free backup)
app.get('/api/alpha/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';
    
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`  - GET /api/test`);
  console.log(`  - GET /api/polygon/:symbol`);
  console.log(`  - GET /api/twelve/:symbol`);
  console.log(`  - GET /api/alpha/:symbol`);
});
