import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Wallet, PieChart, Newspaper, RefreshCw, Search } from 'lucide-react';
import { useStockStore } from '../store/stockStore';
import { useUserStore } from '../store/userStore';
import { Stock } from '../types';
import { StockCard } from '../components/stock/StockCard';
import { StockTrading } from '../components/stock/StockTrading';
import { Portfolio } from '../components/stock/Portfolio';
import { MarketEvents } from '../components/stock/MarketEvents';
import { shouldTriggerMarketEvent, generateRandomMarketEvent, generateMarketNews } from '../services/marketService';

export const StockMarket: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'events'>('market');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(30);

  const { stocks, portfolio, watchlist, updatePrices, applyMarketEvent, addToWatchlist, marketEvents } = useStockStore();
  const { addXP } = useUserStore();

  // Update prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();

      // Random market event (2% chance)
      if (shouldTriggerMarketEvent(0.02)) {
        const event = generateRandomMarketEvent();
        applyMarketEvent(event);
      }

      setCountdown(30);
    }, 30000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [updatePrices, applyMarketEvent]);

  // XP for trading activity
  useEffect(() => {
    if (portfolio.transactions.length > 0) {
      addXP(5);
    }
  }, [portfolio.transactions.length]);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchedStocks = stocks.filter((stock) => watchlist.includes(stock.symbol));

  const tabs = [
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'events', label: 'Events', icon: Newspaper, badge: marketEvents.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Stock Market
          </h1>
          <p className="text-sm text-gray-400">Trade virtual stocks with PacTokens</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400">Next update in</p>
            <p className="text-lg font-bold text-green-400">{countdown}s</p>
          </div>
          <button
            onClick={() => {
              updatePrices();
              setCountdown(30);
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 mb-6 border border-green-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Your Portfolio</p>
            <p className="text-3xl font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(portfolio.totalValue)}
            </p>
            <p className={`text-sm ${portfolio.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.totalProfitLoss >= 0 ? '+' : ''}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(portfolio.totalProfitLoss)}{' '}
              ({portfolio.totalProfitLoss >= 0 ? '+' : ''}
              {portfolio.totalProfitLossPercent.toFixed(2)}%)
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Cash</p>
                <p className="font-bold text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(portfolio.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {/* @ts-ignore */}
      <AnimatePresence mode="wait">
        {activeTab === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>

            {/* Watchlist */}
            {watchedStocks.length > 0 && !searchQuery && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Watchlist</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {watchedStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className="flex-shrink-0 bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-green-500/50 transition-all"
                    >
                      <p className="font-medium text-white">{stock.symbol}</p>
                      <p className={`text-sm ${stock.currentPrice >= stock.previousPrice ? 'text-green-400' : 'text-red-400'}`}>
                        ${stock.currentPrice.toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Stocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onSelect={setSelectedStock}
                  onAddToWatchlist={addToWatchlist}
                  isInWatchlist={watchlist.includes(stock.symbol)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 rounded-2xl border border-white/10 p-4"
          >
            <Portfolio />
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 rounded-2xl border border-white/10 p-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Market Events</h3>
            <MarketEvents />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trading Modal */}
      {/* @ts-ignore */}
      <AnimatePresence>
        {selectedStock && (
          <StockTrading stock={selectedStock} onClose={() => setSelectedStock(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};