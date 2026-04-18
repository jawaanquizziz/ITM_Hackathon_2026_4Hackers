import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  type: 'level-up' | 'badge' | 'streak' | 'achievement' | 'payment';
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
}

const celebrationConfigs = {
  'level-up': {
    emoji: '🎉',
    title: 'Level Up!',
    color: 'from-indigo-500/30 to-purple-500/30',
    border: 'border-indigo-500/30',
  },
  badge: {
    emoji: '🏆',
    title: 'Badge Unlocked!',
    color: 'from-amber-500/30 to-orange-500/30',
    border: 'border-amber-500/30',
  },
  streak: {
    emoji: '🔥',
    title: 'Streak Extended!',
    color: 'from-orange-500/30 to-red-500/30',
    border: 'border-orange-500/30',
  },
  achievement: {
    emoji: '⭐',
    title: 'Achievement Complete!',
    color: 'from-emerald-500/30 to-teal-500/30',
    border: 'border-emerald-500/30',
  },
  payment: {
    emoji: '💰',
    title: 'Payment Sent!',
    color: 'from-cyan-500/30 to-blue-500/30',
    border: 'border-cyan-500/30',
  },
};

export function Celebration({
  type,
  title,
  subtitle,
  onComplete,
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = celebrationConfigs[type];

  useEffect(() => {
    // Fire confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.35, { spread: 60, startVelocity: 40 });
    fire(0.1, { spread: 100, startVelocity: 25, decay: 0.9, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    /* @ts-ignore */
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className={`
              relative
              bg-gradient-to-br ${config.color}
              backdrop-blur-xl
              border ${config.border}
              rounded-3xl
              p-8
              text-center
              shadow-2xl
            `}
          >
            {/* Animated rings */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 border-2 border-white/20 rounded-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="absolute inset-0 border-2 border-white/10 rounded-3xl"
            />

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {config.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {title || config.title}
            </motion.h2>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Sparkle effects */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="text-2xl"
              >
                ✨
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-2 -left-2"
            >
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="text-2xl"
              >
                ✨
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti button trigger
export function useConfetti() {
  const fireConfetti = () => {
    const count = 100;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.35, { spread: 60, startVelocity: 40 });
    fire(0.1, { spread: 100, startVelocity: 25, scalar: 0.8 });
  };

  return fireConfetti;
}

// Simple confetti burst
export function ConfettiBurst({ x = 0.5, y = 0.5 }: { x?: number; y?: number }) {
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
    });
  }, [x, y]);

  return null;
}