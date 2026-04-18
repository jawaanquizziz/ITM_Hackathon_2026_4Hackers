import { motion } from 'framer-motion';
import { Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BalanceCardProps {
  groupName: string;
  balance: number;
  members: number;
  type: 'owed' | 'owe';
  color: 'indigo' | 'cyan' | 'emerald' | 'pink' | 'amber';
}

const colorStyles = {
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-500/20 to-indigo-500/5',
    border: 'border-indigo-500/20',
    glow: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]',
    text: 'text-indigo-400',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    glow: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]',
    text: 'text-cyan-400',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    glow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    text: 'text-emerald-400',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-500/20 to-pink-500/5',
    border: 'border-pink-500/20',
    glow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]',
    text: 'text-pink-400',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
    glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    text: 'text-amber-400',
  },
};

export function BalanceCard({ groupName, balance, members, type, color }: BalanceCardProps) {
  const styles = colorStyles[color];
  const isOwed = type === 'owed';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden
        ${styles.bg}
        backdrop-blur-xl
        border ${styles.border}
        rounded-2xl p-5
        transition-shadow duration-300
        ${styles.glow}
        cursor-pointer group
      `}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{groupName}</h3>
            <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
              <Users className="w-3.5 h-3.5" />
              <span>{members} members</span>
            </div>
          </div>
          <div className={`p-2 rounded-xl ${isOwed ? 'bg-emerald-500/20' : 'bg-pink-500/20'}`}>
            {isOwed ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-pink-400" />
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <p className="text-white/50 text-xs mb-1">
            {isOwed ? "You're owed" : 'You owe'}
          </p>
          <p className={`text-3xl font-bold ${isOwed ? 'text-emerald-400' : 'text-white'}`}>
            ${Math.abs(balance).toFixed(2)}
          </p>
        </div>

        {/* Action hint */}
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm">Tap to settle</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className={`${styles.text}`}
          >
            <ArrowUpRight className="w-4 h-4 rotate-45" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}