import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStockStore } from '../../store/stockStore';
import { formatCurrency, formatPercent } from '../../services/marketService';

export const Portfolio: React.FC = () => {
  const { portfolio } = useStockStore();

  const isPositive = portfolio.totalProfitLoss >= 0;

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Cash Balance</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(portfolio.balance)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Total Value</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
        </motion.div>
      </div>

      {/* Profit/Loss */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl p-4 border ${
          isPositive
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-red-500/10 border-red-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className="text-gray-400">Total Profit/Loss</span>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{formatCurrency(portfolio.totalProfitLoss)}
            </p>
            <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercent(portfolio.totalProfitLossPercent)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Holdings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Holdings</h3>
        {portfolio.holdings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No holdings yet</p>
            <p className="text-sm">Start trading to build your portfolio!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {portfolio.holdings.map((holding, index) => (
              <motion.div
                key={holding.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 rounded-xl p-3 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{holding.symbol}</p>
                    <p className="text-xs text-gray-400">{holding.shares} shares @ {formatCurrency(holding.avgBuyPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(holding.totalValue)}</p>
                    <div className={`flex items-center gap-1 justify-end ${
                      holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {holding.profitLoss >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span className="text-xs">{formatPercent(holding.profitLossPercent)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Recent Transactions</h3>
        {portfolio.transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {portfolio.transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type.toUpperCase()}
                  </span>
                  <span className="text-white">{tx.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-white">{tx.shares} @ {formatCurrency(tx.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};