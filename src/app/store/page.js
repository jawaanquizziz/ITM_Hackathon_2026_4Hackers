'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Zap, ChevronRight, ShoppingCart, Ghost as GhostIcon, Trophy } from 'lucide-react';

const STORE_ITEMS = [
  {
    id: 'starter',
    name: 'POWER PELLET',
    tokens: 100,
    price: 99,
    description: 'Entry-level boost for casual trading.',
    icon: Coins,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400/50',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    tag: 'READY'
  },
  {
    id: 'trader',
    name: 'SUPER CHOMP',
    tokens: 500,
    price: 399,
    description: 'Pro-grade capital for day trading.',
    icon: Zap,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/50',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    tag: 'POPULAR'
  },
  {
    id: 'whale',
    name: 'GHOST HUNTER',
    tokens: 2000,
    price: 1499,
    description: 'Unlimited power for market dominance.',
    icon: TrendingUp,
    color: 'text-purple-400',
    borderColor: 'border-purple-400/50',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.3)]',
    tag: 'ULTIMATE'
  }
];

export default function StorePage() {
  const [selectedItem, setSelectedItem] = useState('trader');

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans">
      
      {/* Retro Arcade Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>

      {/* Floating Decorative Ghosts */}
      <Ghost color="text-red-500" top="15%" left="10%" delay={0} />
      <Ghost color="text-pink-400" top="70%" left="85%" delay={2} />
      <Ghost color="text-cyan-400" top="40%" left="80%" delay={1} />

      <div className="max-w-xl mx-auto px-6 pt-28 pb-32 relative z-10">
        
        {/* Arcade Header */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-cyan-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_5px_#0ea5e9]">Level 1 Store</span>
              <div className="h-1 w-12 bg-cyan-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
            </div>
            <h1 className="text-5xl font-black font-heading tracking-tighter mb-2 italic">
              PAC<span className="text-yellow-400">STORE</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-wide">INSERT COINS TO CONTINUE TRADING</p>
          </motion.div>
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 gap-5">
          {STORE_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedItem(item.id)}
              className={`group relative cursor-pointer rounded-2xl p-0.5 transition-all duration-300 ${selectedItem === item.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              {/* Neon Border Effect */}
              <div className={`absolute inset-0 rounded-2xl blur-sm transition-opacity ${selectedItem === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} ${item.borderColor.replace('border-', 'bg-')}`}></div>
              
              <div className={`relative h-full bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 border-2 transition-colors ${selectedItem === item.id ? item.borderColor : 'border-zinc-800 group-hover:border-zinc-700'}`}>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-zinc-800 border-2 ${selectedItem === item.id ? item.borderColor : 'border-zinc-700'}`}>
                      <item.icon className={`w-7 h-7 ${item.color} ${selectedItem === item.id ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xl font-black tracking-tight">{item.name}</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedItem === item.id ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
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
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Select</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-center gap-8">
            <Stat icon={Trophy} label="Rank" value="#128" />
            <div className="w-px h-8 bg-zinc-800"></div>
            <Stat icon={Coins} label="Current" value="42" />
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(250,204,21,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-16 bg-yellow-400 text-black rounded-2xl font-black text-xl tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {/* Animated Highlight */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <ShoppingCart className="w-6 h-6" />
            Purchase Tokens
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
