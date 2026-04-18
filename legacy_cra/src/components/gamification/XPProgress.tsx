import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

interface XPProgressProps {
  currentXP: number;
  targetXP: number;
  level: number;
  streak?: number;
}

export function XPProgress({ currentXP, targetXP, level, streak }: XPProgressProps) {
  const progress = (currentXP / targetXP) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 p-5"
    >
      {/* Background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-2 rounded-xl bg-indigo-500/20"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </motion.div>
            <div>
              <p className="text-white/60 text-sm">Level {level}</p>
              <p className="text-white font-semibold">
                {currentXP.toLocaleString()} / {targetXP.toLocaleString()} XP
              </p>
            </div>
          </div>

          {streak && streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30"
            >
              <span className="text-lg">🔥</span>
              <span className="text-amber-400 font-semibold">{streak}</span>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #6366F1, #EC4899, #22D3EE)',
            }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>

        {/* XP to next level */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-white/40 text-sm">
            {(targetXP - currentXP).toLocaleString()} XP to next level
          </p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+15% this week</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Mini XP bar for inline use
export function MiniXPBar({ currentXP, targetXP }: { currentXP: number; targetXP: number }) {
  const progress = (currentXP / targetXP) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>
      <span className="text-white/60 text-xs font-mono">{Math.round(progress)}%</span>
    </div>
  );
}