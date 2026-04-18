import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Star } from 'lucide-react';
import { Stock } from '../../types';
import { formatCurrency, formatPercent, getStockColor, getSectorColor } from '../../services/marketService';

interface StockCardProps {
  stock: Stock;
  onSelect: (stock: Stock) => void;
  onAddToWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onSelect,
  onAddToWatchlist,
  isInWatchlist,
}) => {
  const priceChange = stock.currentPrice - stock.previousPrice;
  const percentChange = stock.previousPrice > 0
    ? ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100
    : 0;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-xl border border-white/10 p-4 hover:border-purple-500/50 transition-all cursor-pointer"
      onClick={() => onSelect(stock)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getSectorColor(stock.sector)}`}>
              {stock.sector}
            </span>
          </div>
          <p className="text-sm text-gray-400">{stock.name}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWatchlist(stock.symbol);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            isInWatchlist
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-white/5 text-gray-500 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" fill={isInWatchlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stock.currentPrice)}</p>
          <div className={`flex items-center gap-1 ${getStockColor(stock.currentPrice, stock.previousPrice)}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{formatPercent(percentChange)}</span>
          </div>
        </div>

        <div className="text-right text-xs text-gray-500">
          <p>H: {formatCurrency(stock.dayHigh)}</p>
          <p>L: {formatCurrency(stock.dayLow)}</p>
        </div>
      </div>
    </motion.div>
  );
};