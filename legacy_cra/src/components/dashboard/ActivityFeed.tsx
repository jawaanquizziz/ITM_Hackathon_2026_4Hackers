import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Receipt,
  CreditCard,
  Gift,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'payment' | 'request' | 'group' | 'split' | 'reward';
  title: string;
  subtitle: string;
  amount?: number;
  positive?: boolean;
  time: string;
  avatar?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Sarah paid you',
    subtitle: 'Dinner at Mario\'s',
    amount: 45.5,
    positive: true,
    time: '2m ago',
  },
  {
    id: '2',
    type: 'split',
    title: 'New split in Road Trip',
    subtitle: 'Gas station - $87.50',
    amount: -14.58,
    positive: false,
    time: '15m ago',
  },
  {
    id: '3',
    type: 'request',
    title: 'Payment request',
    subtitle: 'Mike wants $23.00',
    amount: -23.0,
    positive: false,
    time: '1h ago',
  },
  {
    id: '4',
    type: 'reward',
    title: 'Achievement unlocked!',
    subtitle: 'Split Master badge earned',
    time: '2h ago',
  },
  {
    id: '5',
    type: 'group',
    title: 'New group created',
    subtitle: 'Apartment 4B added',
    time: '3h ago',
  },
  {
    id: '6',
    type: 'payment',
    title: 'You paid Alex',
    subtitle: 'Coffee at Blue Bottle',
    amount: -8.5,
    positive: false,
    time: '5h ago',
  },
];

const iconMap = {
  payment: CreditCard,
  request: ArrowDownLeft,
  group: Users,
  split: Receipt,
  reward: Gift,
};

const colorMap = {
  payment: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  request: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  group: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  split: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  reward: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function ActivityFeed() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
    >
      {activities.map((activity) => {
        const Icon = iconMap[activity.type];
        const colors = colorMap[activity.type];

        return (
          <motion.div
            key={activity.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <div className={`p-2.5 rounded-xl ${colors.bg}`}>
              <Icon className={`w-4 h-4 ${colors.text}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {activity.title}
              </p>
              <p className="text-white/50 text-xs truncate">{activity.subtitle}</p>
            </div>

            {activity.amount !== undefined && (
              <div className="text-right">
                <p className={`text-sm font-semibold ${activity.positive ? 'text-emerald-400' : 'text-white'}`}>
                  {activity.positive ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                </p>
              </div>
            )}

            <span className="text-white/30 text-xs whitespace-nowrap">{activity.time}</span>
          </motion.div>
        );
      })}

      {/* Load More */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 text-center text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
      >
        View all activity
      </motion.button>
    </motion.div>
  );
}