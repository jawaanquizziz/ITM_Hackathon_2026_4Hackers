'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShieldAlert, RefreshCw, BarChart2, Award } from 'lucide-react';

export default function OverspentScreen() {
  const [level, setLevel] = useState('Gold');
  const [animationStage, setAnimationStage] = useState('idle'); // idle, moving, impact, downgraded
  const [eatenDots, setEatenDots] = useState([]);
  const controls = useAnimation();
  const badgeControls = useAnimation();

  const DOT_COUNT = 10;
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

    // New badge "pops" back out
    await badgeControls.start({
      scale: [0, 1.5, 1],
      opacity: [0, 1, 1],
      rotate: [180, -10, 0],
      transition: { duration: 0.8, ease: "easeOut" }
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-neon-yellow selection:text-black">
      
      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        {/* Background Glow when downgraded */}
        <motion.div 
          className="absolute inset-0 bg-red-500/5 mix-blend-screen pointer-events-none"
          animate={{ opacity: animationStage === 'downgraded' ? 1 : 0 }}
          transition={{ duration: 1 }}
        />

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <motion.div 
            className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
            animate={{ 
              boxShadow: animationStage === 'downgraded' 
                ? ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.5)', '0 0 0px rgba(239,68,68,0)'] 
                : 'none'
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">You Overspent Today <span className="text-2xl">💸</span></h1>
          <p className="text-gray-400 text-sm">
            Daily limit: ₹1000 &nbsp;|&nbsp; Spent: <span className="text-red-400 font-semibold">₹1250</span>
          </p>
        </div>

        {/* The Track and Pac-Man Sequence */}
        <div className="relative w-full h-16 mb-12 flex items-center">
          
          {/* Progress Bar Background */}
          <div className="absolute w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-red-500/50"
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
                className="w-3 h-3 rounded-full bg-gradient-to-t from-yellow-600 to-yellow-300 border border-yellow-700/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] flex items-center justify-center text-[6px] font-black text-yellow-900/80"
              >
                ₹
              </motion.div>
            ))}
          </div>

          {/* Pac-Man Character */}
          <motion.div 
            animate={controls}
            className="absolute left-0 -ml-5 z-20 flex items-center justify-center"
            style={{ width: 'calc(100% - 2.5rem)' }} // Account for badge at the end
          >
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]">
                <motion.path
                  fill="#facc15"
                  animate={{ 
                    d: animationStage === 'moving' 
                      ? [
                          "M 50 50 L 100 50 A 50 50 0 1 1 100 50 Z", // Closed
                          "M 50 50 L 92 20 A 50 50 0 1 1 92 80 Z",  // Wide Open
                          "M 50 50 L 100 50 A 50 50 0 1 1 100 50 Z"  // Closed
                        ]
                      : "M 50 50 L 92 20 A 50 50 0 1 1 92 80 Z"
                  }}
                  transition={{ repeat: Infinity, duration: 0.25, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Target Badge */}
          <motion.div 
            animate={badgeControls}
            className="absolute right-0 z-10"
          >
            <div className="relative">
              {/* Crack overlay when impacted */}
              {animationStage === 'impact' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 text-white flex items-center justify-center font-bold text-2xl drop-shadow-md"
                >
                  ⚡
                </motion.div>
              )}
              
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg transition-colors duration-700
                ${level === 'Gold' 
                  ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                  : 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200 shadow-[0_0_15px_rgba(156,163,175,0.3)] grayscale'
                }`}
              >
                <Award className={`w-7 h-7 ${level === 'Gold' ? 'text-yellow-100' : 'text-gray-100'}`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level Downgrade Text */}
        <div className="text-center mb-8 relative z-10 h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animationStage === 'downgraded' ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-400 font-semibold uppercase tracking-wider text-sm mb-1">Level Downgraded</p>
            <p className="text-gray-300">
              <span className="line-through text-gray-600 mr-2">Gold Saver</span> 
              <span className="font-bold text-gray-100">Silver Saver</span>
            </p>
          </motion.div>
        </div>

        {/* Subtext */}
        <p className="text-center text-gray-500 text-sm mb-8 px-4 leading-relaxed relative z-10">
          You exceeded your daily limit. Stay on track tomorrow to regain your <strong className="text-yellow-500">Gold</strong> level.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => {
              setLevel('Gold');
              setAnimationStage('idle');
              setEatenDots([]);
              controls.set({ x: '0%' });
              setTimeout(startSequence, 500);
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again Tomorrow
          </button>
          
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3.5 px-4 rounded-xl transition-colors border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2">
            <BarChart2 className="w-5 h-5" />
            View Spending Insights
          </button>
        </div>
      </motion.div>
    </div>
  );
}
