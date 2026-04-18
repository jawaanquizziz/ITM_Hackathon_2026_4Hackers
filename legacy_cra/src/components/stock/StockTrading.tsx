import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ShoppingCart, AlertCircle } from 'lucide-react';
import { Stock } from '../../types';
import { useStockStore } from '../../store/stockStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency, formatPercent, getStockColor } from '../../services/marketService';

interface StockTradingProps {
  stock: Stock;
  onClose: () => void;
}

export const StockTrading: React.FC<StockTradingProps> = ({ stock, onClose }) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { portfolio, buyStock, sellStock } = useStockStore();
  const { addXP, addTokens } = useUserStore();

  const holding = portfolio.holdings.find(h => h.symbol === stock.symbol);
  const totalCost = shares * stock.currentPrice;
  const canBuy = portfolio.balance >= totalCost;
  const canSell = holding && holding.shares >= shares;

  const handleTrade = () => {
    setError(null);
    setSuccess(null);

    if (orderType === 'buy') {
      if (!canBuy) {
        setError('Insufficient balance for this purchase.');
        return;
      }
      const success = buyStock(stock.symbol, shares, stock.currentPrice);
      if (success) {
        setSuccess(`Successfully bought ${shares} shares of ${stock.symbol}!`);
        addXP(Math.floor(totalCost / 10)); // XP for trading
        if (shares >= 10) addTokens(5); // Bonus tokens for large trades
      } else {
        setError('Transaction failed. Please try again.');
      }
    } else {
      if (!canSell) {
        setError('Insufficient shares to sell.');
        return;
      }
      const success = sellStock(stock.symbol, shares, stock.currentPrice);
      if (success) {
        setSuccess(`Successfully sold ${shares} shares of ${stock.symbol}!`);
        addXP(Math.floor(totalCost / 10));
      } else {
        setError('Transaction failed. Please try again.');
      }
    }
  };

  const priceChange = stock.currentPrice - stock.previousPrice;
  const percentChange = stock.previousPrice > 0
    ? ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#15151A] rounded-2xl border border-white/10 p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{stock.symbol}</h2>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatCurrency(stock.currentPrice)}</p>
            <div className={`flex items-center gap-1 justify-end ${getStockColor(stock.currentPrice, stock.previousPrice)}`}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm">{formatPercent(percentChange)}</span>
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="bg-white/5 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-400 mb-2">{stock.description}</p>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Sector: <span className="text-white">{stock.sector}</span></span>
            <span className="text-gray-500">Volatility: <span className="text-white">{(stock.volatility * 100).toFixed(0)}%</span></span>
          </div>
        </div>

        {/* Order Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all ${
              orderType === 'buy'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all ${
              orderType === 'sell'
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Holdings Info */}
        {holding && (
          <div className="bg-white/5 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1">Your Holdings</p>
            <div className="flex justify-between">
              <span className="text-white">{holding.shares} shares</span>
              <span className={`${holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(holding.totalValue)} ({formatPercent(holding.profitLossPercent)})
              </span>
            </div>
          </div>
        )}

        {/* Shares Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Number of Shares</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShares(Math.max(1, shares - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              -
            </button>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => setShares(shares + 1)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              +
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShares(10)}
            className="flex-1 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            10 shares
          </button>
          <button
            onClick={() => setShares(Math.floor(portfolio.balance / stock.currentPrice))}
            className="flex-1 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            Max
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-bold">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Balance</span>
            <span className="text-white">{formatCurrency(portfolio.balance)}</span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <ShoppingCart className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">{success}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={(orderType === 'buy' && !canBuy) || (orderType === 'sell' && !canSell)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              orderType === 'buy'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white disabled:opacity-50'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white disabled:opacity-50'
            }`}
          >
            {orderType === 'buy' ? 'Buy' : 'Sell'} {shares} {shares === 1 ? 'Share' : 'Shares'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};