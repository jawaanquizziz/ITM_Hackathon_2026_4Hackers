import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Target, Award } from 'lucide-react';

interface Insight {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  color: 'indigo' | 'emerald' | 'cyan' | 'pink' | 'amber';
}

const insights: Insight[] = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Spending Trend',
    value: '+12.5%',
    change: 'vs last month',
    positive: true,
    color: 'emerald',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Quick Splits',
    value: '23',
    change: 'this week',
    color: 'cyan',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Budget Left',
    value: '$340',
    change: 'of $500',
    positive: true,
    color: 'amber',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Streak',
    value: '7 days',
    change: 'personal best!',
    positive: true,
    color: 'indigo',
  },
];

const colorStyles = {
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function SpendingInsights() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {insights.map((insight, index) => {
        const styles = colorStyles[insight.color];

        return (
          <motion.div
            key={insight.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <div className={`p-2.5 rounded-xl ${styles.bg}`}>
              <span className={styles.text}>{insight.icon}</span>
            </div>

            <div className="flex-1">
              <p className="text-white/50 text-sm">{insight.title}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-white font-semibold text-lg">{insight.value}</p>
                {insight.change && (
                  <p className={`text-sm ${insight.positive ? 'text-emerald-400' : 'text-white/40'}`}>
                    {insight.change}
                  </p>
                )}
              </div>
            </div>

            {insight.positive !== undefined && (
              <div className={`p-1.5 rounded-lg ${insight.positive ? 'bg-emerald-500/20' : 'bg-pink-500/20'}`}>
                {insight.positive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-pink-400" />
                )}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Weekly Goal Progress */}
      <motion.div
        variants={itemVariants}
        className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Weekly Goal</span>
          <span className="text-indigo-400 font-semibold">68%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '68%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-white/50 text-xs mt-2">
          Keep tracking to unlock Split Master badge!
        </p>
      </motion.div>
    </motion.div>
  );
}