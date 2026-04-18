import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { GlowText } from '../components/ui/GlowText';
import { Scene3D } from '../components/three/Scene3D';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { Dashboard } from './Dashboard';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

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

export function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <Scene3D />

      {/* Content */}
      <AnimatedBackground variant="mesh" intensity="subtle">
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-white/80 text-sm">Split payments made beautiful</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="mb-6">
              <GlowText
                variant="gradient"
                color="multi"
                size="5xl"
                weight="bold"
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
              >
                PacPay
              </GlowText>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-white/60 mt-4 max-w-2xl mx-auto"
              >
                Split expenses with friends, track spending, and earn rewards together.
                The ultimate student payment app.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <NeonButton
                variant="primary"
                size="lg"
                glowColor="indigo"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => setShowDashboard(true)}
              >
                Get Started
              </NeonButton>
              <NeonButton variant="secondary" size="lg">
                Learn More
              </NeonButton>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <FeatureCard
                icon="💸"
                title="Split Instantly"
                description="Split any expense with friends in seconds. No more awkward conversations."
                delay={0.1}
              />
              <FeatureCard
                icon="📊"
                title="Track Everything"
                description="Beautiful analytics to understand your spending patterns."
                delay={0.2}
              />
              <FeatureCard
                icon="🏆"
                title="Earn Rewards"
                description="Level up, earn badges, and compete with friends on the leaderboard."
                delay={0.3}
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <StatItem value="50K+" label="Active Users" />
              <StatItem value="$2M+" label="Split Monthly" />
              <StatItem value="4.9" label="App Rating" />
              <StatItem value="99%" label="Happy Splitters" />
            </motion.div>
          </motion.div>
        </div>
      </AnimatedBackground>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <GlassCard variant="interactive" className="h-full">
        <GlassCardContent className="text-center py-8">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            {icon}
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/60 text-sm">{description}</p>
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <GlowText variant="shimmer" color="multi" size="2xl" weight="bold">
        {value}
      </GlowText>
      <p className="text-white/50 text-sm mt-1">{label}</p>
    </div>
  );
}