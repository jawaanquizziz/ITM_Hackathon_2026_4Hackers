import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../components/ui/GlassCard';
import { GlowText } from '../components/ui/GlowText';
import { NeonButton } from '../components/ui/NeonButton';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { SpendingInsights } from '../components/dashboard/SpendingInsights';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import {
  Wallet,
  Users,
  TrendingUp,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Dashboard() {
  return (
    <AnimatedBackground variant="mesh" intensity="medium">
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.header variants={itemVariants} className="flex items-center justify-between">
            <div>
              <GlowText variant="gradient" color="multi" size="3xl" weight="bold">
                Welcome back! 👋
              </GlowText>
              <p className="text-white/60 mt-1">Here's your financial overview</p>
            </div>
            <div className="flex items-center gap-3">
              <NeonButton variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </NeonButton>
              <NeonButton variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </NeonButton>
            </div>
          </motion.header>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Balance"
              value="$2,458.50"
              change="+12.5%"
              positive
              icon={<Wallet className="w-6 h-6" />}
              color="indigo"
            />
            <StatCard
              title="Active Groups"
              value="8"
              change="+2"
              positive
              icon={<Users className="w-6 h-6" />}
              color="cyan"
            />
            <StatCard
              title="You're Owed"
              value="$234.80"
              change="From 4 friends"
              icon={<TrendingUp className="w-6 h-6" />}
              color="emerald"
            />
            <StatCard
              title="You Owe"
              value="$87.50"
              change="To 2 friends"
              icon={<ArrowUpRight className="w-6 h-6" />}
              color="amber"
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <GlassCard variant="glow" glowColor="indigo">
                <GlassCardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Spending Analytics</h2>
                      <p className="text-white/50 text-sm">Last 30 days</p>
                    </div>
                    <div className="flex gap-2">
                      <NeonButton variant="secondary" size="sm">
                        Week
                      </NeonButton>
                      <NeonButton variant="primary" size="sm" glowColor="indigo">
                        Month
                      </NeonButton>
                      <NeonButton variant="secondary" size="sm">
                        Year
                      </NeonButton>
                    </div>
                  </div>
                  <ExpenseChart />
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Activity Feed */}
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full">
                <GlassCardContent>
                  <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                  <ActivityFeed />
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>

          {/* Balance Cards */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-white mb-4">Group Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                groupName="Apartment 4B"
                balance={45.5}
                members={4}
                type="owed"
                color="emerald"
              />
              <BalanceCard
                groupName="Road Trip Crew"
                balance={-23.75}
                members={6}
                type="owe"
                color="pink"
              />
              <BalanceCard
                groupName="Friday Dinners"
                balance={156.2}
                members={8}
                type="owed"
                color="cyan"
              />
            </div>
          </motion.div>

          {/* Quick Actions & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <GlassCard>
                <GlassCardContent>
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                  <QuickActions />
                </GlassCardContent>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard>
                <GlassCardContent>
                  <h2 className="text-xl font-semibold text-white mb-4">Spending Insights</h2>
                  <SpendingInsights />
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ReactNode;
  color: 'indigo' | 'cyan' | 'emerald' | 'pink' | 'amber';
}

function StatCard({ title, value, change, positive, icon, color }: StatCardProps) {
  const colorStyles = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
  };

  const glowStyles = {
    indigo: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]',
    amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${colorStyles[color]}
        backdrop-blur-xl
        border ${colorStyles[color].split(' ')[1]}
        rounded-2xl p-5
        transition-shadow duration-300
        ${glowStyles[color]}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${positive ? 'text-emerald-400' : 'text-pink-400'}`}>
            {positive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-white/10`}>{icon}</div>
      </div>
    </motion.div>
  );
}