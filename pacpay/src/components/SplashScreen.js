'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isChomped, setIsChomped] = useState(false);

  useEffect(() => {
    // Timing the chomp sound effect/animation step
    const interval = setInterval(() => {
      setIsChomped(prev => !prev);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        
        {/* Large Pac-Man (The Eater) */}
        <motion.div 
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20"
        >
          <svg width="120" height="120" viewBox="0 0 100 100">
            <motion.path
              fill="var(--color-pac-yellow)"
              animate={{
                d: isChomped 
                  ? "M50 50 L100 50 A50 50 0 1 1 100 50 Z" // Closed
                  : "M50 50 L95 25 A50 50 0 1 1 95 75 Z"   // Opened
              }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </motion.div>

        {/* Smaller Pac-Man (The Eaten) */}
        <motion.div 
          animate={{ 
            x: [60, 20],
            opacity: [1, 1, 0],
            scale: [1, 1, 0.5]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeIn",
            repeatDelay: 1
          }}
          className="ml-[-40px] z-10"
        >
          <svg width="50" height="50" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="var(--color-pac-blue)" fillOpacity="0.6" />
            <path d="M50 50 L95 25 A50 50 0 1 1 95 75 Z" fill="#050505" />
          </svg>
        </motion.div>

        {/* Decorative Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: [-100, 200], opacity: [0, 1, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "linear"
            }}
            className="absolute right-[-150px] w-3 h-3 bg-zinc-800 rounded-full"
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-12 text-center"
      >
        <h1 className="text-3xl font-bold font-heading text-white tracking-tighter">
          PacPay
        </h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-pac-yellow)] mt-2 opacity-80">
          Loading Vault...
        </p>
      </motion.div>

      {/* Retro Grid Background Overlay (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 grayscale" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

    </motion.div>
  );
}
