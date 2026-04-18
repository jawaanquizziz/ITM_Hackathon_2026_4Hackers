'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShieldAlert, RefreshCw, BarChart2, Award, ChevronRight } from 'lucide-react';

export default function OverspentScreen() {
  const [level, setLevel] = useState('Gold');
  const [animationStage, setAnimationStage] = useState('idle'); // idle, moving, impact, downgraded
  const [eatenDots, setEatenDots] = useState([]);
  const controls = useAnimation();
  const badgeControls = useAnimation();

  const DOT_COUNT = 10;
  const [isChomped, setIsChomped] = useState(false);

  // Rapid chomp like SplashScreen
  useEffect(() => {
    const chompInterval = setInterval(() => {
      setIsChomped(prev => !prev);
    }, 120);
    return () => clearInterval(chompInterval);
  }, []);

  const MOVEMENT_DURATION = 2.5;

  // Start animation automatically for demo
  useEffect(() => {
    startSequence();
  }, []);

  const startSequence = async () => {
    setAnimationStage('moving');
    setEatenDots([]);
    setLevel('Gold');
    
    // 1. Move Pac-Man across the track eating coins
    controls.start({
      x: ['0%', '85%'],
      transition: { duration: MOVEMENT_DURATION, ease: 'linear' }
    });

    // Make dots disappear precisely when Pac-Man reaches them
    for (let i = 0; i < DOT_COUNT; i++) {
      const positionPercentage = 0.1 + (0.8 / (DOT_COUNT - 1)) * i;
      const delayTime = MOVEMENT_DURATION * positionPercentage * 1000;
      setTimeout(() => setEatenDots(prev => [...prev, i]), delayTime);
    }

    // Wait for movement to finish
    await new Promise(resolve => setTimeout(resolve, MOVEMENT_DURATION * 1000));

    // 2. The "Eating" Moment
    setAnimationStage('impact');
    
    // Pac-Man lunges at the badge
    controls.start({
      x: ['85%', '95%', '85%'],
      scale: [1, 1.3, 1],
      transition: { duration: 0.4 }
    });

    // Badge gets "swallowed" (shrinks to 0)
    await badgeControls.start({
      scale: [1, 1.2, 0],
      rotate: [0, 45, 180],
      opacity: [1, 1, 0],
      transition: { duration: 0.4 }
    });

    // 3. Digestion / Downgrade
    setAnimationStage('downgraded');
    setLevel('Silver');

    // Screen Shake on downgrade
    await controls.start({
      x: [0, -20, 20, -20, 20, 0],
      transition: { duration: 0.4 }
    });

    // New badge "pops" back out
    await badgeControls.start({
      scale: [0, 1.5, 1],
      opacity: [0, 1, 1],
      rotate: [180, -10, 0],
      transition: { duration: 0.8, ease: "easeOut" }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden relative">
      
      {/* 1. ARCADE BACKGROUND: Neon Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #1e40af 1px, transparent 1px), linear-gradient(to bottom, #1e40af 1px, transparent 1px)`, 
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
          }}
        ></div>
        {/* Scrolling Floor Effect */}
        <motion.div 
          animate={{ backgroundPositionY: [0, 40] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-full h-1/2 opacity-40"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, transparent, #1e40af 1px, transparent 1px)`, 
            backgroundSize: '100% 40px',
            transform: 'perspective(500px) rotateX(60deg)'
          }}
        />
      </div>

      {/* 2. CRT SCANLINES OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* 3. DECORATIVE GHOSTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
         <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 left-20 text-red-500 text-6xl opacity-30">👻</motion.div>
         <motion.div animate={{ y: [0, 30, 0], x: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-40 right-20 text-blue-400 text-6xl opacity-20">👻</motion.div>
      </div>

      {/* 4. MAIN HUD (High Score Area) */}
      <div className="absolute top-10 w-full flex justify-between px-10 font-mono text-[var(--color-pac-yellow)] tracking-tighter z-50">
         <div className="flex flex-col">
            <span className="text-[10px] opacity-50 uppercase">1UP</span>
            <span className="text-xl font-black">2,450</span>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] opacity-50 uppercase italic font-black">BUDGET EXCEEDED</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-xl font-black text-red-500"
            >
              LIMIT ERROR
            </motion.span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-50 uppercase">HI-SCORE</span>
            <span className="text-xl font-black">99,999</span>
         </div>
      </div>

      {/* 5. MAIN CONSOLE CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-xl border-4 border-zinc-800 rounded-[2.5rem] p-8 shadow-[0_0_80px_rgba(0,0,0,1)] relative z-20 arcade-border"
      >
        {/* Neon Glow around the card */}
        <div className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-20 blur-sm -z-10"></div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            className="mx-auto w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            animate={{ 
              scale: animationStage === 'downgraded' ? [1, 1.1, 1] : 1,
              borderColor: animationStage === 'downgraded' ? ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.3)'] : 'rgba(239,68,68,0.3)'
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 font-heading uppercase">
            Game Over <span className="text-red-500 font-arcade">!</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="h-[2px] w-8 bg-zinc-800"></div>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Daily Limit Violated</p>
             <div className="h-[2px] w-8 bg-zinc-800"></div>
          </div>
        </div>

        {/* STATS HUD INSIDE CARD */}
        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
              <span className="text-[8px] font-black text-zinc-500 uppercase block mb-1">Limit Set</span>
              <span className="text-lg font-bold">₹1,000</span>
           </div>
           <div className="bg-red-500/5 p-3 rounded-2xl border border-red-500/20">
              <span className="text-[8px] font-black text-red-400 uppercase block mb-1">Final Spend</span>
              <span className="text-lg font-bold text-red-500">₹1,250</span>
           </div>
        </div>

        {/* The Track and Pac-Man Sequence */}
        <div className="relative w-full h-24 mb-12 flex items-center px-4 bg-zinc-900/30 rounded-3xl border border-zinc-800/30 overflow-hidden">
          
          {/* Progress Bar Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
          </div>

          <div className="absolute left-6 right-6 h-1 bg-zinc-800 rounded-full">
            <motion.div 
              className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: MOVEMENT_DURATION, ease: 'linear' }}
            />
          </div>

          {/* Coins (Dots) */}
          <div className="absolute w-[80%] left-[10%] flex justify-between px-2">
            {Array.from({ length: DOT_COUNT }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: eatenDots.includes(i) ? [1, 1.4, 0] : 1, 
                  opacity: eatenDots.includes(i) ? [1, 1, 0] : 1,
                  rotateY: eatenDots.includes(i) ? 0 : [0, 180, 360]
                }}
                transition={{ 
                  scale: { duration: 0.15 },
                  opacity: { duration: 0.15 },
                  rotateY: { repeat: Infinity, duration: 1.5, ease: "linear" }
                }}
                className="w-4 h-4 rounded-full bg-gradient-to-t from-yellow-600 to-yellow-300 border border-yellow-700/50 shadow-[0_0_12px_rgba(250,204,21,0.5)] flex items-center justify-center text-[7px] font-black text-yellow-900/80"
              >
                ₹
              </motion.div>
            ))}
          </div>

          {/* Pac-Man Character */}
          <motion.div 
            animate={controls}
            className="absolute left-0 -ml-5 z-20 flex items-center justify-center"
            style={{ width: 'calc(100% - 2.5rem)' }} 
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FACC15] blur-[15px] opacity-30 rounded-full"></div>
              <svg width="56" height="56" viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
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
          </motion.div>

          {/* Target Badge */}
          <motion.div 
            animate={badgeControls}
            className="absolute right-4 z-10"
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-4 shadow-2xl transition-all duration-700 rotate-12
                ${level === 'Gold' 
                  ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-200 shadow-[0_0_30px_rgba(250,204,21,0.6)]' 
                  : 'bg-gradient-to-br from-zinc-700 to-zinc-900 border-zinc-600 shadow-[0_0_20px_rgba(0,0,0,0.5)] grayscale'
                }`}
              >
                <Award className={`w-8 h-8 ${level === 'Gold' ? 'text-yellow-100' : 'text-zinc-300'}`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level Downgrade Text */}
        <div className="text-center mb-10 h-16">
          <AnimatePresence>
            {animationStage === 'downgraded' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">Rank Decreased</span>
                <div className="flex items-center gap-3">
                   <span className="line-through text-zinc-600 font-bold text-sm">GOLD SAVER</span>
                   <ChevronRight className="text-zinc-700" size={16} />
                   <span className="font-black text-white text-lg tracking-tight shadow-text">SILVER SAVER</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 relative z-10">
          <button 
            onClick={() => {
              setLevel('Gold');
              setAnimationStage('idle');
              setEatenDots([]);
              controls.set({ x: '0%', scale: 1 });
              setTimeout(startSequence, 500);
            }}
            className="w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black font-black py-4 px-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            <RefreshCw className="w-5 h-5" />
            Restart Level
          </button>
          
          <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 px-4 rounded-2xl transition-all border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 text-xs tracking-widest">
            <BarChart2 className="w-5 h-5" />
            Analyze Failures
          </button>
        </div>
      </motion.div>

      {/* FOOTER HINT */}
      <p className="mt-8 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 z-10">
         Press Start to Continue
      </p>

    </div>
  );
}

