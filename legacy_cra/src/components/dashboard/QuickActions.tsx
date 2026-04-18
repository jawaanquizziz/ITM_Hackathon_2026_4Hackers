import { motion } from 'framer-motion';
import {
  Plus,
  Send,
  UserPlus,
  Receipt,
  Wallet,
  ScanLine,
} from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  color: 'indigo' | 'emerald' | 'cyan' | 'pink' | 'amber';
}

const actions: QuickAction[] = [
  { icon: <Plus className="w-5 h-5" />, label: 'Add Expense', color: 'indigo' },
  { icon: <Send className="w-5 h-5" />, label: 'Send Money', color: 'emerald' },
  { icon: <UserPlus className="w-5 h-5" />, label: 'Add Friend', color: 'cyan' },
  { icon: <Receipt className="w-5 h-5" />, label: 'Scan Receipt', color: 'pink' },
  { icon: <Wallet className="w-5 h-5" />, label: 'Top Up', color: 'amber' },
  { icon: <ScanLine className="w-5 h-5" />, label: 'Show QR', color: 'indigo' },
];

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-500/20 hover:bg-indigo-500/30',
    border: 'border-indigo-500/30 hover:border-indigo-500/50',
    text: 'text-indigo-400',
  },
  emerald: {
    bg: 'bg-emerald-500/20 hover:bg-emerald-500/30',
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    text: 'text-emerald-400',
  },
  cyan: {
    bg: 'bg-cyan-500/20 hover:bg-cyan-500/30',
    border: 'border-cyan-500/30 hover:border-cyan-500/50',
    text: 'text-cyan-400',
  },
  pink: {
    bg: 'bg-pink-500/20 hover:bg-pink-500/30',
    border: 'border-pink-500/30 hover:border-pink-500/50',
    text: 'text-pink-400',
  },
  amber: {
    bg: 'bg-amber-500/20 hover:bg-amber-500/30',
    border: 'border-amber-500/30 hover:border-amber-500/50',
    text: 'text-amber-400',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function QuickActions() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-3"
    >
      {actions.map((action, index) => {
        const styles = colorStyles[action.color];

        return (
          <motion.button
            key={action.label}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl
              ${styles.bg}
              border ${styles.border}
              transition-all duration-200
            `}
          >
            <div className={styles.text}>{action.icon}</div>
            <span className="text-white/80 text-xs font-medium">{action.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}