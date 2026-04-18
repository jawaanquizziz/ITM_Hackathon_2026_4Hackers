import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Zap, Target, Crown, Gift, Medal } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'cyan' | 'pink' | 'amber';
  unlocked: boolean;
  progress?: number;
}

const badges: Badge[] = [
  {
    id: 'first-split',
    name: 'First Split',
    description: 'Split your first expense',
    icon: <Target className="w-6 h-6" />,
    color: 'emerald',
    unlocked: true,
  },
  {
    id: 'split-master',
    name: 'Split Master',
    description: 'Split 50 expenses',
    icon: <Star className="w-6 h-6" />,
    color: 'indigo',
    unlocked: false,
    progress: 23,
  },
  {
    id: 'streak-king',
    name: 'Streak King',
    description: 'Maintain a 7-day streak',
    icon: <Zap className="w-6 h-6" />,
    color: 'amber',
    unlocked: true,
  },
  {
    id: 'group-creator',
    name: 'Group Creator',
    description: 'Create 5 groups',
    icon: <Trophy className="w-6 h-6" />,
    color: 'cyan',
    unlocked: false,
    progress: 3,
  },
  {
    id: 'settle-champion',
    name: 'Settle Champion',
    description: 'Settle 20 debts',
    icon: <Medal className="w-6 h-6" />,
    color: 'pink',
    unlocked: false,
    progress: 12,
  },
  {
    id: 'royal-member',
    name: 'Royal Member',
    description: 'Be a member for 30 days',
    icon: <Crown className="w-6 h-6" />,
    color: 'indigo',
    unlocked: false,
    progress: 15,
  },
];

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
  },
  pink: {
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function BadgeDisplay() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Achievements</h3>
        <span className="text-white/50 text-sm">
          {badges.filter((b) => b.unlocked).length} / {badges.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => {
          const styles = colorStyles[badge.color];

          return (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`
                relative flex flex-col items-center p-4 rounded-xl
                ${badge.unlocked ? styles.bg : 'bg-white/5'}
                border ${badge.unlocked ? styles.border : 'border-white/10'}
                ${badge.unlocked ? styles.glow : ''}
                transition-all cursor-pointer group
              `}
            >
              {/* Locked overlay */}
              {!badge.unlocked && (
                <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white/40" />
                </div>
              )}

              {/* Icon */}
              <motion.div
                animate={badge.unlocked ? { y: [0, -2, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`p-3 rounded-xl ${badge.unlocked ? styles.bg : 'bg-white/10'} mb-2`}
              >
                <span className={badge.unlocked ? styles.text : 'text-white/40'}>
                  {badge.icon}
                </span>
              </motion.div>

              {/* Name */}
              <p className={`text-sm font-medium text-center ${badge.unlocked ? 'text-white' : 'text-white/50'}`}>
                {badge.name}
              </p>

              {/* Progress */}
              {badge.progress !== undefined && !badge.unlocked && (
                <p className="text-xs text-white/30 mt-1">
                  {badge.progress} / {badge.id.includes('50') ? 50 : badge.id.includes('5') ? 5 : badge.id.includes('20') ? 20 : badge.id.includes('30') ? 30 : 10}
                </p>
              )}

              {/* Unlock animation */}
              {badge.unlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <div className={`w-4 h-4 rounded-full ${styles.bg} border ${styles.border} flex items-center justify-center`}>
                    <Star className="w-2.5 h-2.5 fill-current" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress to next badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Gift className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Next Badge</p>
            <p className="text-white/50 text-sm">
              Split {50 - 23} more expenses to unlock <span className="text-indigo-400">Split Master</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Single Badge Component
export function Badge({ badge, size = 'md' }: { badge: Badge; size?: 'sm' | 'md' | 'lg' }) {
  const styles = colorStyles[badge.color];
  const sizes = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`
        ${sizes[size]}
        rounded-xl ${badge.unlocked ? styles.bg : 'bg-white/5'}
        border ${badge.unlocked ? styles.border : 'border-white/10'}
        ${badge.unlocked ? styles.glow : ''}
        transition-all
      `}
    >
      <span className={badge.unlocked ? styles.text : 'text-white/40'}>
        {badge.icon}
      </span>
    </motion.div>
  );
}