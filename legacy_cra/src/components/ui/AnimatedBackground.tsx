import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: 'mesh' | 'gradient' | 'particles' | 'aurora';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export function AnimatedBackground({
  children,
  variant = 'mesh',
  intensity = 'medium',
  className = '',
}: AnimatedBackgroundProps) {
  const intensityMap = {
    subtle: 'opacity-20',
    medium: 'opacity-40',
    strong: 'opacity-60',
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background layers */}
      <div className="fixed inset-0 -z-10">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0E] via-[#111118] to-[#0B0B0E]" />

        {/* Animated gradient orbs */}
        {variant === 'mesh' && (
          <>
            <motion.div
              className={`absolute top-0 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-500/30 blur-[120px] ${intensityMap[intensity]}`}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px] ${intensityMap[intensity]}`}
              animate={{
                x: [0, -80, 0],
                y: [0, 80, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
            <motion.div
              className={`absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[80px] ${intensityMap[intensity]}`}
              animate={{
                x: [0, 60, 0],
                y: [0, -60, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 4,
              }}
            />
          </>
        )}

        {variant === 'aurora' && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -inset-[10%] opacity-50"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99,102,241,0.3), transparent),
                  radial-gradient(ellipse 60% 40% at 80% 20%, rgba(236,72,153,0.2), transparent),
                  radial-gradient(ellipse 70% 60% at 60% 80%, rgba(34,211,238,0.2), transparent)
                `,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        )}

        {/* Noise overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Floating Orbs Background
export function FloatingOrbs({ count = 6 }: { count?: number }) {
  const colors = [
    'from-indigo-500/30',
    'from-purple-500/25',
    'from-cyan-500/20',
    'from-pink-500/25',
    'from-emerald-500/20',
    'from-amber-500/15',
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-radial ${colors[i % colors.length]} blur-3xl`}
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}