import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { useStockStore } from '../../store/stockStore';

export const MarketEvents: React.FC = () => {
  const { marketEvents } = useStockStore();

  if (marketEvents.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No market events yet</p>
        <p className="text-xs">Events will appear here randomly during trading</p>
      </div>
    );
  }

  const getEventIcon = (effect: Record<string, number>) => {
    const values = Object.values(effect);
    const avgEffect = values.reduce((a, b) => a + b, 0) / values.length;
    return avgEffect > 1 ? (
      <TrendingUp className="w-5 h-5 text-green-400" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-400" />
    );
  };

  const getEventColor = (effect: Record<string, number>) => {
    const values = Object.values(effect);
    const avgEffect = values.reduce((a, b) => a + b, 0) / values.length;
    return avgEffect > 1
      ? 'bg-green-500/10 border-green-500/20'
      : 'bg-red-500/10 border-red-500/20';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-2">
      {marketEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-xl p-4 border ${getEventColor(event.effect)}`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              {getEventIcon(event.effect)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{event.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{event.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(event.effect).map(([symbol, multiplier]) => (
                  <span
                    key={symbol}
                    className={`text-xs px-2 py-0.5 rounded ${
                      multiplier > 1
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {symbol}: {multiplier > 1 ? '+' : ''}{((multiplier - 1) * 100).toFixed(0)}%
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(event.timestamp)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};