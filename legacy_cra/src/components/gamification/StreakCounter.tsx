import { motion } from 'framer-motion';
import { Flame, Zap, Target, TrendingUp } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  todayCompleted?: boolean;
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function StreakCounter({
  currentStreak,
  longestStreak,
  todayCompleted = false,
}: StreakCounterProps) {
  const weekProgress = Array(7).fill(false);
  for (let i = 0; i < Math.min(currentStreak, 7); i++) {
    weekProgress[i] = true;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 p-5"
    >
      {/* Animated flame background */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="p-3 rounded-xl bg-amber-500/20"
            >
              <Flame className="w-6 h-6 text-amber-400" />
            </motion.div>
            <div>
              <p className="text-white/60 text-sm">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <motion.p
                  key={currentStreak}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-white"
                >
                  {currentStreak}
                </motion.p>
                <p className="text-amber-400">days</p>
              </div>
            </div>
          </div>

          {todayCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"
            >
              <span className="text-emerald-400 text-sm font-medium">✓ Today</span>
            </motion.div>
          )}
        </div>

        {/* Week Progress */}
        <div className="flex justify-between mb-4">
          {days.map((day, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                  ${weekProgress[index]
                    ? 'bg-amber-500/30 text-amber-400 border border-amber-500/30'
                    : 'bg-white/5 text-white/30 border border-white/10'
                  }
                `}
              >
                {weekProgress[index] && <Zap className="w-4 h-4" />}
              </div>
              <span className="text-xs text-white/40">{day}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-white/50 text-xs">Longest Streak</p>
            <p className="text-white font-semibold">{longestStreak} days</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-white/50 text-xs">Streak Bonus</p>
            <p className="text-amber-400 font-semibold">+{currentStreak * 10} XP</p>
          </div>
        </div>

        {/* Motivation */}
        {currentStreak > 0 && currentStreak < longestStreak && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <p className="text-white/60 text-sm">
                <span className="text-amber-400 font-medium">{longestStreak - currentStreak} days</span> to beat your record!
              </p>
            </div>
          </motion.div>
        )}

        {/* Celebration for new record */}
        {currentStreak === longestStreak && currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <p className="text-amber-400 font-medium">New personal best! 🎉</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Mini streak indicator for inline use
export function MiniStreak({ streak }: { streak: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🔥
      </motion.span>
      <span className="text-amber-400 font-semibold text-sm">{streak}</span>
    </motion.div>
  );
}