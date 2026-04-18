import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, PartyPopper, Target, RefreshCw } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { useUserStore } from '../../store/userStore';
import { useFinanceStore } from '../../store/financeStore';
import { generateInsights } from '../../services/aiService';
import { AIAdvice } from '../../types';

const getInsightIcon = (type: AIAdvice['type']) => {
  switch (type) {
    case 'insight':
      return <TrendingUp className="w-5 h-5 text-blue-400" />;
    case 'suggestion':
      return <Target className="w-5 h-5 text-green-400" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'celebration':
      return <PartyPopper className="w-5 h-5 text-purple-400" />;
    case 'mission':
      return <Target className="w-5 h-5 text-orange-400" />;
    default:
      return <TrendingUp className="w-5 h-5 text-gray-400" />;
  }
};

const getPriorityColor = (priority: AIAdvice['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-red-500/30 bg-red-500/5';
    case 'medium':
      return 'border-yellow-500/30 bg-yellow-500/5';
    case 'low':
      return 'border-green-500/30 bg-green-500/5';
    default:
      return 'border-white/10 bg-white/5';
  }
};

export const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { insights, addInsight, clearInsights } = useAIStore();
  const { user, missions } = useUserStore();
  const { transactions, monthlyIncome, currentMonthSpending, savingsGoal } = useFinanceStore();

  const refreshInsights = async () => {
    setLoading(true);
    clearInsights();

    const context = {
      level: user.level,
      xp: user.xp,
      behaviorScore: user.behaviorScore,
      pacTokens: user.pacTokens,
      monthlyBudget: monthlyIncome,
      currentSpending: currentMonthSpending(),
      savingsRate: savingsGoal > 0 ? (monthlyIncome - currentMonthSpending()) / monthlyIncome : 0,
      activeMissions: missions.filter(m => !m.completed),
      recentTransactions: transactions.slice(0, 10),
      streakDays: user.streakDays,
    };

    const newInsights = await generateInsights(context);
    newInsights.forEach(insight => addInsight(insight));
    setLoading(false);
  };

  useEffect(() => {
    if (insights.length === 0) {
      refreshInsights();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
        <button
          onClick={refreshInsights}
          disabled={loading}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* @ts-ignore */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Analyzing your finances...</p>
          </motion.div>
        ) : insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <p>No insights available yet.</p>
            <p className="text-sm mt-2">Add some transactions to get personalized insights!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-4 border ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{insight.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{insight.message}</p>
                    {insight.actionable && (
                      <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                        Take action →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};