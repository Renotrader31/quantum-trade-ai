import React, { useState } from 'react';
import MLTradingDashboard from './components/MLTradingDashboard';
import AIStrategyGenerator from './components/AIStrategyGenerator';
import { 
  Brain, TrendingUp, Activity, Shield, Zap,
  DollarSign, Target, AlertCircle, BarChart3, Sparkles,
  ArrowUpRight, ArrowDownRight, ChevronRight,
  RefreshCw, Award, Flame, LineChart, Clock,
  TrendingDown, Calendar, PieChart, BarChart2
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('ML Dashboard');

  const navItems = [
    { name: 'ML Dashboard', icon: '🧠', active: true },
    { name: 'AI Strategy', icon: '🤖' },
    { name: 'Backtesting', icon: '📊' },
    { name: 'Portfolio', icon: '💼' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Settings', icon: '⚙️' }
  ];

  // Placeholder components for tabs that don't have components yet
  const BacktestingComponent = () => (
    <div className="bg-gray-900 text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Backtesting Engine</h2>
      <p className="text-gray-400">Backtesting functionality coming soon...</p>
    </div>
  );

  const PortfolioComponent = () => (
    <div className="bg-gray-900 text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Portfolio Manager</h2>
      <p className="text-gray-400">Portfolio management coming soon...</p>
    </div>
  );

  const AnalyticsComponent = () => (
    <div className="bg-gray-900 text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Market Analytics</h2>
      <p className="text-gray-400">Advanced analytics coming soon...</p>
    </div>
  );

  const SettingsComponent = () => (
    <div className="bg-gray-900 text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-400">Settings configuration coming soon...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  QuantumTrade AI
                </span>
              </div>
              <div className="ml-6 text-sm text-gray-400">
                Self-Learning Trading System
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Market Status:</span>
                <span className="ml-2 text-yellow-500 font-semibold">MARKET PRE-MARKET</span>
              </div>
              <div className="text-sm text-gray-400">
                9:14:55 AM
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                GL
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === item.name
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold">$125,430.52</p>
                <p className="text-green-500 text-sm">+18.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's P&L</p>
                <p className="text-2xl font-bold">+$2,847.30</p>
                <p className="text-green-500 text-sm">+2.3%</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold">73.5%</p>
                <p className="text-blue-500 text-sm">152 trades</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ML Confidence</p>
                <p className="text-2xl font-bold">87.3%</p>
                <p className="text-purple-500 text-sm">High accuracy</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'ML Dashboard' && <MLTradingDashboard />}
          {activeTab === 'AI Strategy' && <AIStrategyGenerator />}
          {activeTab === 'Backtesting' && <BacktestingComponent />}
          {activeTab === 'Portfolio' && <PortfolioComponent />}
          {activeTab === 'Analytics' && <AnalyticsComponent />}
          {activeTab === 'Settings' && <SettingsComponent />}
        </div>

        {/* Market Overview */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Market Movers</h2>
            <button className="text-blue-500 hover:text-blue-400">
              View All <ChevronRight className="inline w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {['NVDA', 'AAPL', 'TSLA', 'SPY', 'QQQ'].map((symbol) => (
              <div key={symbol} className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{symbol}</span>
                  <span className="text-green-500 text-xs">
                    <ArrowUpRight className="inline w-3 h-3" />
                    +2.4%
                  </span>
                </div>
                <div className="text-lg font-bold">$487.30</div>
                <div className="text-xs text-gray-400">Vol: 28.5M</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">AI Detection: High Probability Setup</h2>
          </div>
          <p className="text-gray-300 mb-4">
            NVDA showing bullish divergence with 89% confidence. Golden cross pattern detected. 
            Volume surge indicates institutional accumulation. Options flow heavily skewed bullish.
          </p>
          <div className="flex gap-4">
            <button 
              className="px-6 py-2 rounded-lg font-semibold transition-colors"
              style={{
                background: 'linear-gradient(135deg, #0066ff 0%, #8b5cf6 100%)',
                color: 'white'
              }}
            >
              View Analysis
            </button>
            <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold">
              Set Alert
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
