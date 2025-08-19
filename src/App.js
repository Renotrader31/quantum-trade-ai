import React, { useState, useEffect } from 'react';

// Import components (we'll create these)
import MLTradingDashboard from './components/MLTradingDashboard';
import AIStrategyGenerator from './components/AIStrategyGenerator';
import BacktestingEngine from './components/BacktestingEngine';
import PortfolioManager from './components/PortfolioManager';
import MarketAnalytics from './components/MarketAnalytics';
import Settings from './components/Settings';

// Icons - using emoji for simplicity, can replace with lucide-react
const Navigation = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', name: 'ML Dashboard', icon: '🧠' },
    { id: 'ai-strategy', name: 'AI Strategy', icon: '🤖' },
    { id: 'backtest', name: 'Backtesting', icon: '📊' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h1 className="text-xl font-bold text-white">QuantumTrade AI</h1>
                <p className="text-xs text-gray-400">Self-Learning Trading System</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeView === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <MarketStatus />
            <AccountInfo />
          </div>
        </div>
      </div>
    </nav>
  );
};

const MarketStatus = () => {
  const [status, setStatus] = useState('OPEN');
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      const hour = new Date().getHours();
      const day = new Date().getDay();
      
      // Simple market hours check (NYSE: 9:30 AM - 4:00 PM ET, Mon-Fri)
      if (day === 0 || day === 6) {
        setStatus('CLOSED');
      } else if (hour >= 9.5 && hour < 16) {
        setStatus('OPEN');
      } else if (hour >= 4 && hour < 9.5) {
        setStatus('PRE-MARKET');
      } else {
        setStatus('AFTER-HOURS');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right">
      <div className="text-xs text-gray-400">{time}</div>
      <div className={`text-xs font-bold ${
        status === 'OPEN' ? 'text-green-400' : 
        status === 'CLOSED' ? 'text-red-400' : 
        'text-yellow-400'
      }`}>
        MARKET {status}
      </div>
    </div>
  );
};

const AccountInfo = () => {
  return (
    <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
      <div className="text-right">
        <div className="text-xs text-gray-400">Portfolio Value</div>
        <div className="text-sm font-bold text-white">$125,430.52</div>
      </div>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
        GL
      </div>
    </div>
  );
};

const StatsBar = () => {
  const stats = [
    { label: 'ML Accuracy', value: '87.3%', change: '+2.1%', positive: true },
    { label: 'Win Rate', value: '64.2%', change: '+5.3%', positive: true },
    { label: 'Total P&L', value: '$12,430', change: '+18.2%', positive: true },
    { label: 'Active Trades', value: '7', change: '3 pending', neutral: true },
    { label: 'Risk Score', value: '3.2/10', change: 'Low', positive: true }
  ];

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
              </div>
              <div className={`text-xs ${
                stat.positive ? 'text-green-400' : 
                stat.neutral ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [apiKeys, setApiKeys] = useState({
    polygon: process.env.REACT_APP_POLYGON_API_KEY || '',
    unusualWhales: process.env.REACT_APP_UNUSUAL_WHALES_KEY || '',
    fmp: process.env.REACT_APP_FMP_API_KEY || '',
    ortex: process.env.REACT_APP_ORTEX_API_KEY || ''
  });

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleApiKeysUpdate = (newKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('apiKeys', JSON.stringify(newKeys));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-black' : 'bg-gray-50'}`}>
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <StatsBar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Alert Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-white font-semibold">AI Detection: High Probability Setup</h3>
                <p className="text-gray-300 text-sm">
                  NVDA showing bullish divergence with 89% confidence. Golden cross pattern detected.
                </p>
              </div>
            </div>
          <button
    className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
    style={{
        background: 'linear-gradient(135deg, #0066ff 0%, #8b5cf6 100%)',
        color: 'white',
        minWidth: '140px',
        border: 'none'
    }}
>
    View Analysis
</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[600px]">
          {activeView === 'dashboard' && <MLTradingDashboard apiKeys={apiKeys} />}
          {activeView === 'ai-strategy' && <AIStrategyGenerator apiKeys={apiKeys} />}
          {activeView === 'backtest' && <BacktestingEngine apiKeys={apiKeys} />}
          {activeView === 'portfolio' && <PortfolioManager apiKeys={apiKeys} />}
          {activeView === 'analytics' && <MarketAnalytics apiKeys={apiKeys} />}
          {activeView === 'settings' && (
            <Settings 
              apiKeys={apiKeys} 
              onApiKeysUpdate={handleApiKeysUpdate}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              © 2024 QuantumTrade AI - Self-Learning Trading System
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Model Version: 2.0</span>
              <span className="text-gray-400">Last Training: {new Date().toLocaleDateString()}</span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-green-400">System Online</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
