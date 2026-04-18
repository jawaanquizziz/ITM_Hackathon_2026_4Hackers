import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../components/ui/GlassCard';
import { GlowText } from '../components/ui/GlowText';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { XPProgress } from '../components/gamification/XPProgress';
import { BadgeDisplay } from '../components/gamification/BadgeDisplay';
import { StreakCounter } from '../components/gamification/StreakCounter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Rewards() {
  return (
    <AnimatedBackground variant="aurora" intensity="medium">
      <div className="min-h-screen p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 pt-20 lg:pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <GlowText variant="gradient" color="multi" size="3xl" weight="bold">
              Rewards & Progress
            </GlowText>
            <p className="text-white/60 mt-2">Track your achievements and earn rewards</p>
          </motion.div>

          {/* XP Progress */}
          <motion.div variants={itemVariants}>
            <XPProgress currentXP={2450} targetXP={3000} level={12} streak={7} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Streak */}
            <motion.div variants={itemVariants}>
              <StreakCounter currentStreak={7} longestStreak={14} todayCompleted />
            </motion.div>

            {/* Daily Challenges */}
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full">
                <GlassCardContent>
                  <h3 className="text-xl font-semibold text-white mb-4">Daily Challenges</h3>
                  <div className="space-y-3">
                    <ChallengeItem
                      title="Split an expense"
                      reward="+50 XP"
                      completed
                    />
                    <ChallengeItem
                      title="Settle a debt"
                      reward="+30 XP"
                      completed
                    />
                    <ChallengeItem
                      title="Add a new friend"
                      reward="+20 XP"
                      progress={1}
                      total={3}
                    />
                    <ChallengeItem
                      title="Invite friends to PacPay"
                      reward="+100 XP"
                      progress={0}
                      total={1}
                    />
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>

          {/* Badges */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardContent>
                <BadgeDisplay />
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Leaderboard Preview */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardContent>
                <h3 className="text-xl font-semibold text-white mb-4">Leaderboard</h3>
                <div className="space-y-2">
                  <LeaderboardItem rank={1} name="Sarah M." xp={12500} isYou={false} />
                  <LeaderboardItem rank={2} name="Mike J." xp={11200} isYou={false} />
                  <LeaderboardItem rank={3} name="You" xp={8450} isYou highlight />
                  <LeaderboardItem rank={4} name="Emma D." xp={7800} isYou={false} />
                  <LeaderboardItem rank={5} name="Alex C." xp={6500} isYou={false} />
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}

// Challenge Item
function ChallengeItem({
  title,
  reward,
  completed,
  progress,
  total,
}: {
  title: string;
  reward: string;
  completed?: boolean;
  progress?: number;
  total?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        flex items-center justify-between p-3 rounded-xl transition-all
        ${completed
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-white/5 border border-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${completed ? 'bg-emerald-500/20' : 'bg-white/10'}
        `}>
          {completed ? (
            <span className="text-emerald-400">✓</span>
          ) : (
            <span className="text-white/40 text-sm">{progress}/{total}</span>
          )}
        </div>
        <div>
          <p className={`font-medium ${completed ? 'text-emerald-400' : 'text-white'}`}>
            {title}
          </p>
          {completed && <p className="text-white/40 text-xs">Completed</p>}
        </div>
      </div>
      <span className={`font-semibold ${completed ? 'text-emerald-400' : 'text-indigo-400'}`}>
        {reward}
      </span>
    </motion.div>
  );
}

// Leaderboard Item
function LeaderboardItem({
  rank,
  name,
  xp,
  isYou,
  highlight,
}: {
  rank: number;
  name: string;
  xp: number;
  isYou?: boolean;
  highlight?: boolean;
}) {
  const rankColors = {
    1: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    2: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    3: 'bg-amber-700/20 text-amber-600 border-amber-700/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      className={`
        flex items-center gap-4 p-3 rounded-xl transition-all
        ${highlight
          ? 'bg-indigo-500/10 border border-indigo-500/20'
          : 'bg-white/5 border border-white/10'
        }
      `}
    >
      {/* Rank */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center font-bold
        ${rankColors[rank as keyof typeof rankColors] || 'bg-white/10 text-white/60'}
      `}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
      </div>

      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full bg-gradient-to-br
        ${highlight ? 'from-indigo-500 to-purple-600' : 'from-gray-500 to-gray-600'}
      `} />

      {/* Name & XP */}
      <div className="flex-1">
        <p className={`font-medium ${highlight ? 'text-white' : 'text-white/80'}`}>
          {name}
          {isYou && <span className="text-indigo-400 ml-2">(You)</span>}
        </p>
        <p className="text-white/50 text-sm">{xp.toLocaleString()} XP</p>
      </div>

      {/* Level */}
      <div className="text-right">
        <p className="text-white/60 text-sm">Level {Math.floor(xp / 500)}</p>
      </div>
    </motion.div>
  );
}