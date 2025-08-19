import React, { useState, useEffect } from 'react';
import EnhancedMLSystem from '../services/EnhancedMLSystem';

const AIStrategyGenerator = ({ apiKeys }) => {
    const [mlSystem] = useState(new EnhancedMLSystem());
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateStrategies();
    }, []);

    const generateStrategies = async () => {
        setLoading(true);
        try {
            const recommendations = await mlSystem.generateEnhancedRecommendations();
            
            // Convert to strategies
            const aiStrategies = recommendations.map(rec => ({
                id: Date.now() + Math.random(),
                symbol: rec.symbol,
                type: rec.action.includes('BUY') ? 'LONG' : 'SHORT',
                entry: rec.entryPrice,
                stopLoss: rec.stopLoss,
                takeProfit: rec.takeProfit,
                confidence: rec.confidence,
                risk: rec.riskLevel,
                reasoning: rec.reasoning,
                expectedReturn: ((rec.takeProfit - rec.entryPrice) / rec.entryPrice * 100).toFixed(2)
            }));
            
            setStrategies(aiStrategies);
        } catch (error) {
            console.error('Strategy generation error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🤖 AI Strategy Generator</h2>
                <button 
                    onClick={generateStrategies}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Generate New Strategies
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Analyzing markets with AI...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {strategies.map(strategy => (
                        <div key={strategy.id} className="bg-gray-800 p-4 rounded-lg hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold">{strategy.symbol}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    strategy.type === 'LONG' ? 'bg-green-600' : 'bg-red-600'
                                }`}>
                                    {strategy.type}
                                </span>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Entry:</span>
                                    <span>${strategy.entry.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Stop Loss:</span>
                                    <span className="text-red-400">${strategy.stopLoss.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Take Profit:</span>
                                    <span className="text-green-400">${strategy.takeProfit.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Expected:</span>
                                    <span className="text-yellow-400">+{strategy.expectedReturn}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Confidence:</span>
                                    <span>{strategy.confidence.toFixed(0)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Risk:</span>
                                    <span className={
                                        strategy.risk === 'LOW' ? 'text-green-400' :
                                        strategy.risk === 'MEDIUM' ? 'text-yellow-400' :
                                        'text-red-400'
                                    }>{strategy.risk}</span>
                                </div>
                            </div>
                            
                            <div className="mt-3 p-2 bg-gray-900 rounded text-xs text-gray-300">
                                {strategy.reasoning}
                            </div>
                            
                            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm font-semibold">
                                Execute Strategy
                            </button>
                        </div>
                    ))}
                    {strategies.length === 0 && (
                        <div className="col-span-3 text-center text-gray-400 py-8">
                            No strategies generated yet. Click "Generate New Strategies" to start!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIStrategyGenerator;
