'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import StockList from './components/StockList';
import StockChart from './components/StockChart';
import TradePanel from './components/TradePanel';
import AgentTerminal from './components/AgentTerminal';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Info } from 'lucide-react';

export default function ArenaPage() {
  const { initialize } = useGameStore();
  const [selectedSymbol, setSelectedSymbol] = useState('MSFT');

  useEffect(() => {
    const unsub = initialize();
    return () => unsub();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-6 pb-24 md:pb-12 px-4 animate-in fade-in duration-700">
      
      {/* HUD Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-[0_0_25px_rgba(250,204,21,0.3)]">
               <Cpu size={28} className="text-black" />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tighter italic uppercase underline decoration-[var(--color-pac-yellow)] decoration-4 underline-offset-8">
                 THE <span className="text-[var(--color-pac-yellow)]">ARENA</span>
               </h1>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mt-2">PACPAY // NEURAL_EXCHANGE</p>
            </div>
         </div>
         
         <div className="flex items-center gap-6 bg-zinc-900/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-zinc-800">
            <div className="flex flex-col items-end">
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Status</p>
               <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> LIVE
               </div>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div className="flex flex-col items-end">
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Identity</p>
               <p className="text-xs font-black text-[var(--color-pac-blue)] mt-1">GHOST_MSTR</p>
            </div>
         </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Ticker Feed (Scrollable on Desktop, Hidden/Drawer on Mobile potentially) */}
        <div className="md:col-span-3 lg:col-span-3 h-[400px] lg:h-[750px] sticky top-28">
           <StockList onSelect={setSelectedSymbol} selectedSymbol={selectedSymbol} />
        </div>

        {/* Center: Market Chart */}
        <div className="md:col-span-12 lg:col-span-6 space-y-8">
           <div className="h-[400px] md:h-[500px]">
              <StockChart symbol={selectedSymbol} />
           </div>

           {/* Mobile Trade Panel (Shown below chart in vertical stack) */}
           <div className="lg:hidden">
              <TradePanel symbol={selectedSymbol} />
           </div>

           <div className="p-4 bg-[var(--color-pac-blue)]/5 border border-[var(--color-pac-blue)]/20 rounded-2xl flex items-center gap-4">
              <Info className="text-[var(--color-pac-blue)] shrink-0" size={20} />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide leading-relaxed">
                 The Arena is a high-fidelity simulation. All trades use Pac-Tokens and do not represent real financial assets. Play responsibly to climb the high scores.
              </p>
           </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="md:col-span-12 lg:col-span-3 space-y-8">
           <div className="hidden lg:block">
              <TradePanel symbol={selectedSymbol} />
           </div>
           
           <AgentTerminal />

           <div className="bg-[#121212] border border-zinc-900 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                 <Shield size={20} className="text-zinc-800" />
              </div>
              <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Security Protocol</h5>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <p className="text-xs font-bold text-white">Quantum_Key_Synced</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                 <p className="text-xs font-bold text-zinc-600">Proxy_Obfuscation_In_Progress</p>
              </div>
           </div>
        </div>

      </div>

      {/* Decorative BG GLOWS */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[var(--color-pac-blue)] opacity-5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[var(--color-pac-yellow)] opacity-5 blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
}
