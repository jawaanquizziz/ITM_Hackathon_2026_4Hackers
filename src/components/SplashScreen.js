'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isChomped, setIsChomped] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Ultra-fast chomp animation loop
    const chompInterval = setInterval(() => {
      setIsChomped(prev => !prev);
    }, 120);
    
    // Sequence Timings
    const timer1 = setTimeout(() => setPhase(1), 1800); // The Impact Flash
    const timer2 = setTimeout(() => setPhase(2), 2000); // The Premium Logo Reveal

    return () => {
      clearInterval(chompInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background cinematic aura */}
      <motion.div 
        animate={{ 
          scale: phase === 2 ? [1, 2.5, 2] : 1,
          opacity: phase === 2 ? [0, 0.4, 0.15] : 0.1 
        }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-pac-blue)_0%,transparent_50%)] blur-[80px]"
      />

      {/* Main Canvas Area */}
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center z-10 h-[250px] md:h-64">
        
        {/* Phase 0: The Pac-Man Entering */}
        <AnimatePresence>
          {phase < 2 && (
            <motion.div 
              initial={{ x: -150, scale: 0.5 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
              className="absolute z-20 flex items-center justify-center"
            >
              <div className="relative group flex items-center justify-center">
                {/* Ambient Yellow Glow */}
                <div className="absolute inset-0 bg-[#FACC15] blur-[40px] opacity-40 rounded-full scale-110"></div>
                
                <svg width="120" height="120" viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                  <motion.path
                    fill="#FACC15"
                    animate={{
                      d: isChomped 
                        ? "M 50 50 L 100 49 A 50 50 0 1 0 100 51 Z"  // Mouth Closed (Line to right edge, arc full circle back to right edge)
                        : "M 50 50 L 85.35 14.65 A 50 50 0 1 0 85.35 85.35 Z" // Mouth Open (45 degree slice removed from right)
                    }}
                    transition={{ duration: 0.12 }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 0: The Dots getting eaten */}
        <AnimatePresence>
          {phase === 0 && (
            <div className="absolute flex space-x-8 left-[90px] z-10 top-1/2 -translate-y-1/2 mt-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0, x: -40 }}
                  transition={{ 
                    delay: i * 0.15, 
                    exit: { duration: 0.2, delay: 0 }
                  }}
                  className="w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_12px_#fff]"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Phase 1: The Impact Flash (Transition) */}
        <AnimatePresence>
          {phase === 1 && (
             <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 30, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute w-12 h-12 bg-white rounded-full z-[100] mix-blend-overlay shadow-[0_0_100px_#fff]"
             />
          )}
        </AnimatePresence>

        {/* Phase 2: The Final Premium Logo Reveal */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center z-30 w-full"
            >
              <div className="flex items-center gap-4 relative">
                
                {/* Glowing Core Icon */}
                <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-black/60 shadow-[0_0_40px_rgba(250,204,21,0.2)] flex items-center justify-center overflow-hidden backdrop-blur-xl">
                   {/* Scanning Ring */}
                   <motion.div 
                     animate={{ rotate: 360 }} 
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-[-2px] border-t-2 border-r-2 border-[var(--color-pac-yellow)] rounded-full opacity-50"
                   />
                  <svg width="28" height="28" viewBox="0 0 100 100" className="drop-shadow-[0_0_8px_#FACC15]">
                    <motion.path
                      fill="#FACC15"
                      animate={{
                        d: isChomped 
                          ? "M 50 50 L 100 49 A 50 50 0 1 0 100 51 Z" 
                          : "M 50 50 L 85.35 14.65 A 50 50 0 1 0 85.35 85.35 Z"
                      }}
                      transition={{ duration: 0.12 }}
                    />
                  </svg>
                </div>

                {/* Glassmorphism Text */}
                <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-lg">
                  PacPay
                </h1>
              </div>
              
              {/* Premium Loader Bar Below Logo */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-8 flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-3 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399] animate-pulse"></div>
                  <p className="text-[9px] md:text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    Initializing Vault
                  </p>
                </div>
                <div className="w-48 md:w-56 h-[3px] overflow-hidden bg-zinc-900 rounded-full relative">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--color-pac-yellow)] to-transparent shadow-[0_0_10px_#FACC15]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Dynamic Cyber Grid */}
      <motion.div 
        animate={{ opacity: phase === 2 ? 0.1 : 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', 
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
        }}
      />
    </motion.div>
  );
}
