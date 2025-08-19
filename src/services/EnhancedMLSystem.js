// Enhanced ML Trading System with real learning capabilities
class MLTradingSystem {
    constructor() {
        this.model = {
            weights: this.initializeWeights(),
            bias: Math.random() * 0.1,
            learningRate: 0.01,
            momentum: 0.9,
            previousGradients: {}
        };
        
        this.patterns = {
            bullish: ['golden_cross', 'ascending_triangle', 'bull_flag', 'cup_handle'],
            bearish: ['death_cross', 'descending_triangle', 'bear_flag', 'head_shoulders'],
            neutral: ['consolidation', 'sideways', 'range_bound']
        };
        
        this.memory = {
            trades: [],
            successfulPatterns: {},
            marketConditions: [],
            performance: []
        };
        
        this.indicators = {
            rsi: { weight: 0.15, value: 0 },
            macd: { weight: 0.20, value: 0 },
            volume: { weight: 0.15, value: 0 },
            sentiment: { weight: 0.10, value: 0 },
            momentum: { weight: 0.20, value: 0 },
            volatility: { weight: 0.10, value: 0 },
            pattern: { weight: 0.10, value: 0 }
        };
    }

    initializeWeights() {
        return {
            price: Math.random() * 0.5,
            volume: Math.random() * 0.3,
            rsi: Math.random() * 0.4,
            macd: Math.random() * 0.4,
            bollinger: Math.random() * 0.3,
            vwap: Math.random() * 0.3,
            options: Math.random() * 0.2,
            sentiment: Math.random() * 0.2
        };
    }

    // Calculate technical indicators
    calculateIndicators(data) {
        const indicators = {};
        
        // RSI Calculation
        if (data.prices && data.prices.length > 14) {
            indicators.rsi = this.calculateRSI(data.prices);
        } else {
            indicators.rsi = 50; // Neutral
        }
        
        // MACD Signal
        indicators.macd = this.calculateMACD(data.prices || []);
        
        // Volume Analysis
        indicators.volumeRatio = data.volume > data.avgVolume ? 
            Math.min(data.volume / data.avgVolume, 3) : 0.5;
        
        // Bollinger Bands
        indicators.bollinger = this.calculateBollingerPosition(data);
        
        // Options Flow
        indicators.optionsSignal = this.analyzeOptionsFlow(data);
        
        // Pattern Recognition
        indicators.pattern = this.detectPattern(data);
        
        // Volatility
        indicators.volatility = this.calculateVolatility(data.prices || []);
        
        return indicators;
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i < period; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }

    calculateMACD(prices) {
        if (prices.length < 26) return 0;
        
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;
        const signal = this.calculateEMA([macd], 9);
        
        return macd - signal; // MACD histogram
    }

    calculateEMA(data, period) {
        if (data.length === 0) return 0;
        const k = 2 / (period + 1);
        let ema = data[0];
        
        for (let i = 1; i < data.length; i++) {
            ema = data[i] * k + ema * (1 - k);
        }
        
        return ema;
    }

    calculateBollingerPosition(data) {
        if (!data.prices || data.prices.length < 20) return 0;
        
        const prices = data.prices.slice(-20);
        const mean = prices.reduce((a, b) => a + b) / prices.length;
        const std = Math.sqrt(
            prices.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / prices.length
        );
        
        const upper = mean + (2 * std);
        const lower = mean - (2 * std);
        const current = data.currentPrice || prices[prices.length - 1];
        
        // Return position between bands (-1 to 1)
        if (current >= upper) return 1;
        if (current <= lower) return -1;
        return (current - mean) / (upper - mean);
    }

    calculateVolatility(prices) {
        if (prices.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }
        
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / returns.length;
        
        return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
    }

    analyzeOptionsFlow(data) {
        if (!data.optionsFlow || data.optionsFlow.length === 0) return 0;
        
        let bullishFlow = 0;
        let bearishFlow = 0;
        
        data.optionsFlow.forEach(flow => {
            const premium = flow.premium || 0;
            if (flow.sentiment === 'BULLISH' || flow.type === 'CALL') {
                bullishFlow += premium;
            } else {
                bearishFlow += premium;
            }
        });
        
        const totalFlow = bullishFlow + bearishFlow;
        if (totalFlow === 0) return 0;
        
        return (bullishFlow - bearishFlow) / totalFlow; // -1 to 1
    }

    detectPattern(data) {
        if (!data.prices || data.prices.length < 10) return 'unknown';
        
        const recent = data.prices.slice(-10);
        const trend = this.calculateTrend(recent);
        
        // Simple pattern detection
        if (trend > 0.02) {
            if (this.isGoldenCross(data)) return 'golden_cross';
            if (this.isBullFlag(recent)) return 'bull_flag';
            return 'ascending_triangle';
        } else if (trend < -0.02) {
            if (this.isDeathCross(data)) return 'death_cross';
            if (this.isBearFlag(recent)) return 'bear_flag';
            return 'descending_triangle';
        }
        
        return 'consolidation';
    }

    calculateTrend(prices) {
        if (prices.length < 2) return 0;
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        return (lastPrice - firstPrice) / firstPrice;
    }

    isGoldenCross(data) {
        if (!data.prices || data.prices.length < 50) return false;
        const ma50 = this.calculateSMA(data.prices, 50);
        const ma200 = this.calculateSMA(data.prices, 200);
        return ma50 > ma200;
    }

    isDeathCross(data) {
        if (!data.prices || data.prices.length < 50) return false;
        const ma50 = this.calculateSMA(data.prices, 50);
        const ma200 = this.calculateSMA(data.prices, 200);
        return ma50 < ma200;
    }

    isBullFlag(prices) {
        // Simplified bull flag detection
        const trend = this.calculateTrend(prices);
        const volatility = this.calculateVolatility(prices);
        return trend > 0.01 && volatility < 0.2;
    }

    isBearFlag(prices) {
        // Simplified bear flag detection
        const trend = this.calculateTrend(prices);
        const volatility = this.calculateVolatility(prices);
        return trend < -0.01 && volatility < 0.2;
    }

    calculateSMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1] || 0;
        const relevantPrices = prices.slice(-period);
        return relevantPrices.reduce((a, b) => a + b) / period;
    }

    // Neural network forward pass
    predict(features) {
        let activation = this.model.bias;
        
        Object.keys(features).forEach(key => {
            if (this.model.weights[key]) {
                activation += features[key] * this.model.weights[key];
            }
        });
        
        // Sigmoid activation
        return 1 / (1 + Math.exp(-activation));
    }

    // Training function
    train(features, target) {
        const prediction = this.predict(features);
        const error = target - prediction;
        
        // Backpropagation with momentum
        Object.keys(features).forEach(key => {
            const gradient = error * features[key] * prediction * (1 - prediction);
            const momentum = this.model.previousGradients[key] || 0;
            
            this.model.weights[key] += 
                this.model.learningRate * gradient + 
                this.model.momentum * momentum;
            
            this.model.previousGradients[key] = gradient;
        });
        
        this.model.bias += this.model.learningRate * error;
        
        return { prediction, error, accuracy: 1 - Math.abs(error) };
    }

    // Generate recommendations
    generateRecommendations(marketData) {
        const recommendations = [];
        
        Object.keys(marketData).forEach(symbol => {
            if (typeof marketData[symbol] !== 'object' || !marketData[symbol].currentPrice) {
                return;
            }
            
            const data = marketData[symbol];
            const indicators = this.calculateIndicators(data);
            const confidence = this.calculateConfidence(indicators);
            const signal = this.generateSignal(indicators, confidence);
            
            if (signal.action !== 'HOLD') {
                recommendations.push({
                    symbol,
                    action: signal.action,
                    confidence: Math.round(confidence * 100),
                    price: data.currentPrice || 0,
                    target: signal.target,
                    stopLoss: signal.stopLoss,
                    pattern: indicators.pattern,
                    indicators: {
                        rsi: indicators.rsi,
                        macd: indicators.macd > 0 ? 'Bullish' : 'Bearish',
                        volume: indicators.volumeRatio > 1.5 ? 'High' : 'Normal'
                    },
                    reason: this.generateReason(indicators, signal)
                });
            }
        });
        
        // Sort by confidence
        return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    }

    calculateConfidence(indicators) {
        let confidence = 0.5; // Base confidence
        
        // RSI confidence
        if (indicators.rsi < 30) confidence += 0.15; // Oversold
        else if (indicators.rsi > 70) confidence -= 0.15; // Overbought
        
        // MACD confidence
        if (indicators.macd > 0) confidence += 0.1;
        else confidence -= 0.1;
        
        // Volume confirmation
        if (indicators.volumeRatio > 1.5) confidence += 0.1;
        
        // Pattern confidence
        if (this.patterns.bullish.includes(indicators.pattern)) confidence += 0.15;
        else if (this.patterns.bearish.includes(indicators.pattern)) confidence -= 0.15;
        
        // Options flow alignment
        confidence += indicators.optionsSignal * 0.1;
        
        // Bollinger position
        if (Math.abs(indicators.bollinger) > 0.8) confidence += 0.1;
        
        return Math.max(0, Math.min(1, confidence));
    }

    generateSignal(indicators, confidence) {
        const signal = { action: 'HOLD', target: 0, stopLoss: 0 };
        
        if (confidence > 0.65) {
            if (indicators.macd > 0 && indicators.rsi < 70) {
                signal.action = 'BUY';
                signal.target = 1.05; // 5% profit target
                signal.stopLoss = 0.98; // 2% stop loss
            }
        } else if (confidence < 0.35) {
            if (indicators.macd < 0 && indicators.rsi > 30) {
                signal.action = 'SELL';
                signal.target = 0.95; // 5% down target
                signal.stopLoss = 1.02; // 2% stop loss
            }
        }
        
        // Adjust targets based on volatility
        if (indicators.volatility > 0.3) {
            signal.target = signal.action === 'BUY' ? 1.08 : 0.92;
            signal.stopLoss = signal.action === 'BUY' ? 0.95 : 1.05;
        }
        
        return signal;
    }

    generateReason(indicators, signal) {
        const reasons = [];
        
        if (indicators.pattern !== 'unknown') {
            reasons.push(`Pattern: ${indicators.pattern.replace('_', ' ')}`);
        }
        
        if (indicators.rsi < 30) reasons.push('RSI oversold');
        else if (indicators.rsi > 70) reasons.push('RSI overbought');
        
        if (indicators.macd > 0) reasons.push('MACD bullish');
        else if (indicators.macd < 0) reasons.push('MACD bearish');
        
        if (indicators.volumeRatio > 1.5) reasons.push('High volume');
        
        if (Math.abs(indicators.optionsSignal) > 0.5) {
            reasons.push(`Options flow ${indicators.optionsSignal > 0 ? 'bullish' : 'bearish'}`);
        }
        
        return reasons.join(', ') || 'Technical setup';
    }

    // Performance metrics
    getPerformanceMetrics() {
        const trades = this.memory.trades.length;
        const winners = this.memory.trades.filter(t => t.profit > 0).length;
        const losers = trades - winners;
        
        const totalProfit = this.memory.trades.reduce((sum, t) => sum + t.profit, 0);
        const avgWin = winners > 0 ? 
            this.memory.trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / winners : 0;
        const avgLoss = losers > 0 ? 
            Math.abs(this.memory.trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / losers) : 0;
        
        return {
            accuracy: trades > 0 ? (winners / trades * 100).toFixed(1) : 0,
            winRate: trades > 0 ? (winners / trades * 100).toFixed(1) : 0,
            totalTrades: trades,
            profitFactor: avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : 0,
            sharpeRatio: this.calculateSharpeRatio(),
            maxDrawdown: this.calculateMaxDrawdown()
        };
    }

    calculateSharpeRatio() {
        if (this.memory.trades.length < 2) return 0;
        
        const returns = this.memory.trades.map(t => t.profit);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const std = Math.sqrt(
            returns.reduce((sq, n) => sq + Math.pow(n - avgReturn, 2), 0) / returns.length
        );
        
        return std > 0 ? (avgReturn / std * Math.sqrt(252)).toFixed(2) : 0;
    }

    calculateMaxDrawdown() {
        if (this.memory.trades.length === 0) return 0;
        
        let peak = 0;
        let maxDD = 0;
        let runningTotal = 0;
        
        this.memory.trades.forEach(trade => {
            runningTotal += trade.profit;
            if (runningTotal > peak) peak = runningTotal;
            const drawdown = (peak - runningTotal) / peak;
            if (drawdown > maxDD) maxDD = drawdown;
        });
        
        return (maxDD * 100).toFixed(1);
    }

    // Record trade for learning
    recordTrade(trade) {
        this.memory.trades.push(trade);
        
        // Learn from the trade
        const features = trade.features;
        const target = trade.profit > 0 ? 1 : 0;
        this.train(features, target);
        
        // Update successful patterns
        if (trade.profit > 0 && trade.pattern) {
            this.memory.successfulPatterns[trade.pattern] = 
                (this.memory.successfulPatterns[trade.pattern] || 0) + 1;
        }
        
        // Keep only last 100 trades in memory
        if (this.memory.trades.length > 100) {
            this.memory.trades.shift();
        }
    }
}

export default MLTradingSystem;
