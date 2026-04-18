'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ArcadePreview() {
  const [prices, setPrices] = useState([420, 422, 419, 421, 425, 423, 426]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = prev[prev.length - 1] + (Math.random() * 4 - 2);
        return [...prev.slice(1), Number(next.toFixed(1))];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050505] rounded-[1.5rem] border-2 border-zinc-800/50 group cursor-pointer shadow-black/50 shadow-inner">
      
      {/* Background Cyber-Grid */}
      <div className="absolute inset-0 opacity-20 cyber-grid"></div>
      
      {/* Scanning Line (Video Feel) */}
      <motion.div 
        animate={{ translateY: ['-100%', '1000%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-[var(--color-pac-blue)]/10 to-transparent z-10 opacity-30"
      />

      {/* Simulated Gameplay Header */}
      <div className="absolute top-4 left-6 right-6 z-20 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 border border-zinc-800/50 rounded-xl">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-lg">
                <svg width="18" height="18" viewBox="0 0 100 100">
                  <path fill="black" d="M 50 50 L 95 30 A 50 50 0 1 0 95 70 Z" />
                </svg>
            </div>
            <div className="hidden sm:block">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Live Arena Stream</p>
               <h4 className="text-xs font-black text-white italic tracking-tighter">THE TRADING MATRIX</h4>
            </div>
         </div>
         <div className="flex items-center gap-4 text-[10px] font-black italic">
            <div className="flex items-center gap-1.5 text-[var(--color-pac-blue)]">
               <Activity size={12} className="animate-pulse" />
               <span className="uppercase tracking-widest">12ms Latency</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
               <span className="uppercase tracking-widest">MARKET OPEN</span>
            </div>
         </div>
      </div>

      {/* Simulated Gameplay Content: Candlestick Chart Loop */}
      <div className="absolute inset-x-8 bottom-12 top-24 flex items-end gap-2 md:gap-4 justify-between opacity-80">
         {prices.map((p, i) => {
            const height = (p / 430) * 100;
            const isUp = p >= prices[i-1] || i === 0;
            return (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${Math.max(10, height)}%` }}
                 className={`flex-1 rounded-t-sm relative ${isUp ? 'bg-emerald-500/40 border-t-2 border-emerald-400' : 'bg-rose-500/40 border-t-2 border-rose-400'}`}
               >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                     ₹{p}
                  </div>
               </motion.div>
            );
         })}
      </div>

      {/* Center Interaction UI */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/60">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 bg-[var(--color-pac-yellow)] rounded-2xl flex items-center justify-center md:-translate-y-4 shadow-[0_0_40px_rgba(250,204,21,0.4)] group-hover:shadow-[0_0_60px_rgba(250,204,21,0.6)] transition-all duration-300"
        >
           <svg width="40" height="40" viewBox="0 0 100 100">
             <path fill="black" d="M 50 50 L 95 30 A 50 50 0 1 0 95 70 Z" />
           </svg>
        </motion.div>
        
        <div className="mt-8 flex flex-col items-center gap-4">
           <span className="text-[var(--color-pac-yellow)] font-black tracking-[0.2em] uppercase bg-[#121212] px-8 py-4 rounded-full border border-zinc-700 shadow-2xl flex items-center gap-3 transition-transform group-hover:scale-110">
              <Zap size={20} className="fill-[var(--color-pac-yellow)]" /> INSERT COIN // ENTER
           </span>
           <div className="px-4 py-2 bg-black/60 rounded-lg border border-zinc-800 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
              <TrendingUp size={14} className="text-emerald-400" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Live Global Feed Active</p>
           </div>
        </div>
      </div>

      {/* Retro HUD edge markers */}
      <div className="absolute left-4 bottom-4 font-mono text-[8px] text-zinc-700 tracking-[0.3em] uppercase opacity-40">
         Hardware_Acceleration_Stream
      </div>
      <div className="absolute right-4 bottom-4 font-mono text-[8px] text-zinc-700 tracking-[0.3em] uppercase opacity-40">
         Core_Rev: 4.2.0_PAC
      </div>

    </div>
  );
}
