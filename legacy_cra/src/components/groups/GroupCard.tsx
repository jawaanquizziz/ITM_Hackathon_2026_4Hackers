import { motion } from 'framer-motion';
import { Users, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface GroupCardProps {
  id: string;
  name: string;
  members: number;
  balance: number;
  type: 'owed' | 'owe' | 'settled';
  lastActivity: string;
  avatar: string;
  onAddExpense?: () => void;
}

const statusStyles = {
  owed: {
    badge: 'bg-emerald-500/20 text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  owe: {
    badge: 'bg-pink-500/20 text-pink-400',
    border: 'border-pink-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]',
  },
  settled: {
    badge: 'bg-cyan-500/20 text-cyan-400',
    border: 'border-cyan-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
  },
};

export function GroupCard({
  name,
  members,
  balance,
  type,
  lastActivity,
  avatar,
  onAddExpense,
}: GroupCardProps) {
  const styles = statusStyles[type];
  const isOwed = type === 'owed';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-white/[0.04] to-white/[0.01]
        backdrop-blur-xl
        border ${styles.border}
        rounded-2xl p-5
        transition-all duration-300
        ${styles.glow}
        cursor-pointer group
      `}
    >
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{avatar}</div>
            <div>
              <h3 className="text-white font-semibold text-lg">{name}</h3>
              <div className="flex items-center gap-1 text-white/50 text-sm">
                <Users className="w-3.5 h-3.5" />
                <span>{members} members</span>
              </div>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
            {type === 'settled' ? 'Settled' : isOwed ? 'Owed' : 'Owe'}
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          {type !== 'settled' ? (
            <>
              <p className="text-white/50 text-xs mb-1">
                {isOwed ? "You're owed" : 'You owe'}
              </p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${isOwed ? 'text-emerald-400' : 'text-white'}`}>
                  ${Math.abs(balance).toFixed(2)}
                </p>
                {isOwed ? (
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-pink-400" />
                )}
              </div>
            </>
          ) : (
            <p className="text-2xl font-bold text-cyan-400">All Settled!</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-white/40 text-sm">Last activity: {lastActivity}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddExpense?.();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Plus className="w-4 h-4 text-white/70" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}