'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Zap, ChevronRight, ShoppingCart, Ghost as GhostIcon, Trophy } from 'lucide-react';

const STORE_LEVELS = {
  1: {
    name: 'BRONZE TIER',
    color: 'cyan',
    accent: '#0ea5e9',
    items: [
      { id: 'starter', name: 'POWER PELLET', tokens: 100, price: 99, description: 'Basic boost for casual trading.', icon: Coins, color: 'text-cyan-400', borderColor: 'border-cyan-400/50', tag: 'READY' },
      { id: 'trader', name: 'SUPER CHOMP', tokens: 500, price: 399, description: 'Pro-grade capital for day trading.', icon: Zap, color: 'text-cyan-400', borderColor: 'border-cyan-400/50', tag: 'POPULAR' }
    ]
  },
  5: {
    name: 'SILVER TIER',
    color: 'zinc',
    accent: '#d4d4d8',
    items: [
      { id: 'silver_pack', name: 'QUICKSILVER', tokens: 1000, price: 799, description: 'High-speed capital infusion.', icon: Zap, color: 'text-zinc-300', borderColor: 'border-zinc-300/50', tag: 'UNLOCKED' },
      { id: 'silver_vault', name: 'SILVER VAULT', tokens: 2500, price: 1899, description: 'Strategic reserve for long-term gains.', icon: Trophy, color: 'text-zinc-300', borderColor: 'border-zinc-300/50', tag: 'BEST VALUE' }
    ]
  },
  10: {
    name: 'GOLD TIER',
    color: 'yellow',
    accent: '#facc15',
    items: [
      { id: 'gold_rush', name: 'GOLD RUSH', tokens: 5000, price: 3499, description: 'Elite capital for market makers.', icon: TrendingUp, color: 'text-yellow-400', borderColor: 'border-yellow-400/50', tag: 'PREMIUM' },
      { id: 'king_pac', name: 'KING PAC', tokens: 10000, price: 5999, description: 'Maximum power. Rule the arcade.', icon: Trophy, color: 'text-yellow-400', borderColor: 'border-yellow-400/50', tag: 'EXCLUSIVE' }
    ]
  },
  20: {
    name: 'LEGENDARY TIER',
    color: 'purple',
    accent: '#a855f7',
    items: [
      { id: 'diamond_core', name: 'DIAMOND CORE', tokens: 50000, price: 19999, description: 'Infinite liquidity for legends only.', icon: Zap, color: 'text-purple-400', borderColor: 'border-purple-400/50', tag: 'MYTHIC' },
      { id: 'god_mode', name: 'GOD MODE', tokens: 100000, price: 34999, description: 'Complete market transcendence.', icon: TrendingUp, color: 'text-purple-400', borderColor: 'border-purple-400/50', tag: 'ASCENDED' }
    ]
  }
};

export default function StorePage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedItem, setSelectedItem] = useState('starter');
  
  const activeTier = STORE_LEVELS[currentLevel] || STORE_LEVELS[1];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans transition-colors duration-1000">
      
      {/* Retro Arcade Grid Background - Changes Color based on Tier */}
      <div className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000" 
           style={{ 
             backgroundImage: `linear-gradient(to right, ${activeTier.accent} 1px, transparent 1px), linear-gradient(to bottom, ${activeTier.accent} 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>

      {/* Floating Decorative Ghosts */}
      <Ghost color={`text-${activeTier.color}-500`} top="15%" left="10%" delay={0} />
      <Ghost color={`text-${activeTier.color}-400`} top="70%" left="85%" delay={2} />

      <div className="max-w-xl mx-auto px-6 pt-28 pb-32 relative z-10">
        
        {/* DEMO LEVEL SELECTOR */}
        <div className="mb-8 flex justify-center gap-2">
           {[1, 5, 10, 20].map(lvl => (
             <button 
               key={lvl}
               onClick={() => setCurrentLevel(lvl)}
               className={`px-3 py-1 rounded-full text-[9px] font-black border transition-all ${currentLevel === lvl ? `bg-${activeTier.color}-500 border-${activeTier.color}-400 text-black` : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
             >
               LVL {lvl}
             </button>
           ))}
        </div>

        {/* Arcade Header */}
        <div className="mb-12 text-center">
          <motion.div 
            key={currentLevel}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`h-1 w-12 rounded-full shadow-lg transition-all duration-700`} style={{ backgroundColor: activeTier.accent, boxShadow: `0 0 10px ${activeTier.accent}` }}></div>
              <span className={`text-xs font-black uppercase tracking-[0.3em] transition-all duration-700`} style={{ color: activeTier.accent, textShadow: `0 0 5px ${activeTier.accent}` }}>
                {activeTier.name}
              </span>
              <div className={`h-1 w-12 rounded-full shadow-lg transition-all duration-700`} style={{ backgroundColor: activeTier.accent, boxShadow: `0 0 10px ${activeTier.accent}` }}></div>
            </div>
            <h1 className="text-5xl font-black font-heading tracking-tighter mb-2 italic">
              PAC<span style={{ color: activeTier.accent }} className="transition-colors duration-700">STORE</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-wide">ACCESSING {activeTier.name} INVENTORY</p>
          </motion.div>
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 gap-5">
          {activeTier.items.map((item, index) => (
            <motion.div
              key={`${currentLevel}-${item.id}`}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedItem(item.id)}
              className={`group relative cursor-pointer rounded-2xl p-0.5 transition-all duration-300 ${selectedItem === item.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <div className={`absolute inset-0 rounded-2xl blur-sm transition-opacity ${selectedItem === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} style={{ backgroundColor: activeTier.accent }}></div>
              
              <div className={`relative h-full bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 border-2 transition-colors ${selectedItem === item.id ? 'border-zinc-400' : 'border-zinc-800'}`}>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-zinc-800 border-2 ${selectedItem === item.id ? 'border-zinc-400' : 'border-zinc-700'}`}>
                      <item.icon className={`w-7 h-7 ${selectedItem === item.id ? 'text-white animate-pulse' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xl font-black tracking-tight text-white">{item.name}</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedItem === item.id ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium mb-2">{item.description}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></div>
                        <span className="text-yellow-400 font-black text-sm tabular-nums">{item.tokens} PAC-TOKENS</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black font-heading italic text-white leading-none">₹{item.price}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-center gap-8">
            <Stat icon={Trophy} label="Rank" value={currentLevel > 15 ? 'LEGEND' : currentLevel > 5 ? 'VETERAN' : 'ROOKIE'} />
            <div className="w-px h-8 bg-zinc-800"></div>
            <Stat icon={Coins} label="Current" value="42" />
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${activeTier.accent}66` }}
            whileTap={{ scale: 0.97 }}
            style={{ backgroundColor: activeTier.accent }}
            className="w-full h-16 text-black rounded-2xl font-black text-xl tracking-[0.2em] uppercase shadow-lg transition-all duration-700 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            <ShoppingCart className="w-6 h-6" />
            Buy {activeTier.name.split(' ')[0]} Pack
          </motion.button>
          
          <p className="text-center text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase">
            SECURE CHECKOUT BY PAC-SECURE V2.0
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

function Ghost({ color, top, left, delay }) {
  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 4, delay, ease: "easeInOut" }}
      className={`absolute ${top} ${left} opacity-20 pointer-events-none`}
    >
      <GhostIcon className={`w-12 h-12 ${color} blur-[1px]`} />
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-zinc-500" />
      <div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-0.5">{label}</p>
        <p className="text-sm font-black text-white leading-none">{value}</p>
      </div>
    </div>
  );
}
