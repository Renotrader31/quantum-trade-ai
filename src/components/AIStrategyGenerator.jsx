import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, Brain, Zap, Target, Shield, 
    BarChart3, AlertTriangle, CheckCircle, 
    Activity, DollarSign, Clock, RefreshCw,
    ChevronRight, Sparkles, Award, Settings
} from 'lucide-react';

const AIStrategyGenerator = () => {
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [generatingStrategy, setGeneratingStrategy] = useState(false);
    const [strategies, setStrategies] = useState([]);
    const [parameters, setParameters] = useState({
        riskLevel: 'moderate',
        timeframe: 'swing',
        capital: 10000,
        focusArea: 'momentum'
    });

    // Strategy Templates
    const strategyTemplates = {
        momentum: {
            name: 'Momentum Surge',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'from-green-500 to-emerald-600',
            description: 'Ride strong trends with volume confirmation',
            winRate: 68,
            profitFactor: 2.3
        },
        meanReversion: {
            name: 'Mean Reversion',
            icon: <Activity className="w-5 h-5" />,
            color: 'from-blue-500 to-cyan-600',
            description: 'Trade oversold bounces and overbought pullbacks',
            winRate: 72,
            profitFactor: 1.8
        },
        breakout: {
            name: 'Breakout Hunter',
            icon: <Zap className="w-5 h-5" />,
            color: 'from-purple-500 to-pink-600',
            description: 'Capture explosive moves from consolidation',
            winRate: 58,
            profitFactor: 3.1
        },
        options: {
            name: 'Options Flow',
            icon: <DollarSign className="w-5 h-5" />,
            color: 'from-yellow-500 to-orange-600',
            description: 'Follow smart money with unusual options activity',
            winRate: 64,
            profitFactor: 2.5
        }
    };

    // Generate AI Strategy
    const generateStrategy = async () => {
        setGeneratingStrategy(true);
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const template = strategyTemplates[parameters.focusArea];
        const strategy = {
            id: Date.now(),
            ...template,
            parameters: { ...parameters },
            signals: generateSignals(),
            rules: generateRules(parameters),
            backtest: generateBacktestResults(),
            confidence: Math.floor(Math.random() * 20 + 75),
            timestamp: new Date().toISOString()
        };
        
        setStrategies([strategy, ...strategies.slice(0, 4)]);
        setSelectedStrategy(strategy);
        setGeneratingStrategy(false);
    };

    // Generate trading signals
    const generateSignals = () => {
        const signals = [
            { type: 'BUY', indicator: 'RSI Oversold', value: 28, strength: 'Strong' },
            { type: 'BUY', indicator: 'MACD Cross', value: 'Bullish', strength: 'Moderate' },
            { type: 'SELL', indicator: 'Resistance', value: 450.5, strength: 'Weak' },
            { type: 'BUY', indicator: 'Volume Surge', value: '2.3x', strength: 'Strong' }
        ];
        return signals.sort(() => Math.random() - 0.5).slice(0, 3);
    };

    // Generate strategy rules
    const generateRules = (params) => {
        const baseRules = {
            entry: [],
            exit: [],
            risk: []
        };

        // Entry rules based on strategy type
        if (params.focusArea === 'momentum') {
            baseRules.entry = [
                'Price above 20-day moving average',
                'RSI between 50-70',
                'Volume > 1.5x average',
                'Positive MACD histogram'
            ];
        } else if (params.focusArea === 'meanReversion') {
            baseRules.entry = [
                'RSI < 30 or > 70',
                'Price at Bollinger Band extreme',
                'Volume spike detected',
                'Divergence confirmed'
            ];
        } else if (params.focusArea === 'breakout') {
            baseRules.entry = [
                'Price breaks resistance with volume',
                'ATR expansion confirmed',
                'Consolidation period > 10 days',
                'Relative strength > market'
            ];
        } else {
            baseRules.entry = [
                'Unusual options activity detected',
                'Call/Put ratio > 2.0',
                'Premium > $1M',
                'Near the money strikes'
            ];
        }

        // Exit rules based on risk level
        if (params.riskLevel === 'conservative') {
            baseRules.exit = [
                'Stop loss: 2% from entry',
                'Take profit: 4% gain',
                'Trail stop after 3% profit',
                'Exit on reversal signal'
            ];
            baseRules.risk = [
                'Max position size: 5% of capital',
                'Max daily loss: 2%',
                'Max trades per day: 3'
            ];
        } else if (params.riskLevel === 'moderate') {
            baseRules.exit = [
                'Stop loss: 5% from entry',
                'Take profit: 10% gain',
                'Trail stop after 5% profit',
                'Scale out at targets'
            ];
            baseRules.risk = [
                'Max position size: 10% of capital',
                'Max daily loss: 5%',
                'Max trades per day: 5'
            ];
        } else {
            baseRules.exit = [
                'Stop loss: 8% from entry',
                'Take profit: 20% gain',
                'No trailing stop',
                'All-in/All-out positions'
            ];
            baseRules.risk = [
                'Max position size: 20% of capital',
                'Max daily loss: 10%',
                'No trade limit'
            ];
        }

        return baseRules;
    };

    // Generate backtest results
    const generateBacktestResults = () => {
        const trades = Math.floor(Math.random() * 100 + 50);
        const winRate = Math.random() * 30 + 55;
        const avgWin = Math.random() * 5 + 3;
        const avgLoss = Math.random() * 2 + 1;
        
        return {
            totalTrades: trades,
            winRate: winRate.toFixed(1),
            profitFactor: (avgWin / avgLoss).toFixed(2),
            avgWin: avgWin.toFixed(2),
            avgLoss: avgLoss.toFixed(2),
            maxDrawdown: (Math.random() * 10 + 5).toFixed(1),
            sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2),
            expectancy: ((winRate/100 * avgWin) - ((100-winRate)/100 * avgLoss)).toFixed(2)
        };
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                        <h2 className="text-2xl font-bold">AI Strategy Generator</h2>
                        <p className="text-gray-400">Create data-driven trading strategies</p>
                    </div>
                </div>
                <button
                    onClick={generateStrategy}
                    disabled={generatingStrategy}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {generatingStrategy ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Strategy
                        </>
                    )}
                </button>
            </div>

            {/* Strategy Parameters */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Risk Level</label>
                    <select 
                        value={parameters.riskLevel}
                        onChange={(e) => setParameters({...parameters, riskLevel: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    >
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Timeframe</label>
                    <select 
                        value={parameters.timeframe}
                        onChange={(e) => setParameters({...parameters, timeframe: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    >
                        <option value="scalp">Scalping (1-5m)</option>
                        <option value="day">Day Trading</option>
                        <option value="swing">Swing (2-10 days)</option>
                        <option value="position">Position (weeks)</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Capital</label>
                    <input 
                        type="number"
                        value={parameters.capital}
                        onChange={(e) => setParameters({...parameters, capital: parseInt(e.target.value)})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Strategy Focus</label>
                    <select 
                        value={parameters.focusArea}
                        onChange={(e) => setParameters({...parameters, focusArea: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    >
                        <option value="momentum">Momentum</option>
                        <option value="meanReversion">Mean Reversion</option>
                        <option value="breakout">Breakout</option>
                        <option value="options">Options Flow</option>
                    </select>
                </div>
            </div>

            {/* Strategy Templates */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {Object.entries(strategyTemplates).map(([key, template]) => (
                    <div
                        key={key}
                        onClick={() => setParameters({...parameters, focusArea: key})}
                        className={`p-4 rounded-lg bg-gray-800 border-2 cursor-pointer transition-all ${
                            parameters.focusArea === key ? 'border-purple-500' : 'border-gray-700 hover:border-gray-600'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                            {template.icon}
                        </div>
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-green-400">Win: {template.winRate}%</span>
                            <span className="text-blue-400">PF: {template.profitFactor}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Generated Strategy Display */}
            {selectedStrategy && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedStrategy.color} flex items-center justify-center`}>
                                {selectedStrategy.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedStrategy.name}</h3>
                                <p className="text-sm text-gray-400">{selectedStrategy.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{selectedStrategy.confidence}%</div>
                            <div className="text-xs text-gray-400">Confidence Score</div>
                        </div>
                    </div>

                    {/* Strategy Rules */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2">Entry Rules</h4>
                            <ul className="space-y-1">
                                {selectedStrategy.rules.entry.map((rule, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-2">Exit Rules</h4>
                            <ul className="space-y-1">
                                {selectedStrategy.rules.exit.map((rule, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">Risk Management</h4>
                            <ul className="space-y-1">
                                {selectedStrategy.rules.risk.map((rule, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                                        <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Current Signals */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">Active Signals</h4>
                        <div className="flex gap-2">
                            {selectedStrategy.signals.map((signal, i) => (
                                <div key={i} className={`px-3 py-2 rounded-lg ${
                                    signal.type === 'BUY' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'
                                }`}>
                                    <div className="text-xs font-semibold">{signal.indicator}</div>
                                    <div className="text-xs text-gray-400">{signal.value} • {signal.strength}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Backtest Results */}
                    <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Backtest Performance</h4>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-900 rounded-lg p-3">
                                <div className="text-xs text-gray-400">Win Rate</div>
                                <div className="text-lg font-bold text-green-400">{selectedStrategy.backtest.winRate}%</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-3">
                                <div className="text-xs text-gray-400">Profit Factor</div>
                                <div className="text-lg font-bold text-blue-400">{selectedStrategy.backtest.profitFactor}</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-3">
                                <div className="text-xs text-gray-400">Max Drawdown</div>
                                <div className="text-lg font-bold text-red-400">-{selectedStrategy.backtest.maxDrawdown}%</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-3">
                                <div className="text-xs text-gray-400">Sharpe Ratio</div>
                                <div className="text-lg font-bold text-purple-400">{selectedStrategy.backtest.sharpeRatio}</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700">
                            Deploy Strategy
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600">
                            Backtest More
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600">
                            Save Strategy
                        </button>
                    </div>
                </div>
            )}

            {/* Strategy History */}
            {strategies.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Recent Strategies</h3>
                    <div className="space-y-2">
                        {strategies.map((strategy) => (
                            <div 
                                key={strategy.id}
                                onClick={() => setSelectedStrategy(strategy)}
                                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${strategy.color} flex items-center justify-center`}>
                                        {strategy.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{strategy.name}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(strategy.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm">
                                        <span className="text-green-400">Win: {strategy.backtest.winRate}%</span>
                                        {' • '}
                                        <span className="text-blue-400">PF: {strategy.backtest.profitFactor}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIStrategyGenerator;
