'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TrendingUp, ShoppingCart, Wallet, Zap } from 'lucide-react';

export default function TradePanel({ symbol }) {
  const { stocks, balance, buyStock, sellStock, holdings } = useGameStore();
  const [amount, setAmount] = useState(1);
  const stock = stocks.find(s => s.symbol === symbol);
  const holding = holdings.find(h => h.symbol === symbol);

  if (!stock) return null;

  const totalCost = amount * stock.currentPrice;
  const canAfford = balance >= totalCost;

  return (
    <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-pac-yellow)]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Wallet Info */}
      <div className="flex justify-between items-center text-xs font-black tracking-widest text-zinc-500 uppercase">
         <div className="flex items-center gap-2">
            <Wallet size={14} className="text-[var(--color-pac-yellow)]" />
            VIRTUAL VAULT
         </div>
         <span className="text-white">₹{balance.toLocaleString()}</span>
      </div>

      <div>
         <h4 className="text-sm font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-2">
            <Zap size={16} className="text-[var(--color-pac-yellow)] fill-[var(--color-pac-yellow)]" /> ORDER ENTRY
         </h4>
         
         {/* Input area */}
         <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quantity</span>
                  <span className="text-[10px] font-bold text-zinc-500">MAX: {Math.floor(balance / stock.currentPrice)}</span>
               </div>
               <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 bg-transparent border-none text-2xl font-black text-white outline-none tabular-nums"
                  />
                  <div className="flex items-center gap-2">
                     <button onClick={() => setAmount(Math.max(1, amount - 1))} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">-</button>
                     <button onClick={() => setAmount(amount + 1)} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">+</button>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center px-4">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Transaction</span>
               <span className={`font-black text-lg ${canAfford ? 'text-white' : 'text-rose-500'}`}>₹{totalCost.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
               <button 
                 onClick={() => buyStock(symbol, amount)}
                 disabled={!canAfford}
                 className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  <ShoppingCart size={16} /> BUY
               </button>
               <button 
                 onClick={() => sellStock(symbol, amount)}
                 disabled={!holding || holding.shares < amount}
                 className="bg-rose-500 hover:bg-rose-400 disabled:opacity-30 disabled:hover:bg-rose-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  SELL
               </button>
            </div>
         </div>
      </div>

      {/* Holdings Footer */}
      {holding && (
         <div className="mt-2 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
            <div>
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Your Position</p>
               <p className="font-black text-white">{holding.shares} SHARES</p>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Avg Price</p>
               <p className="font-bold text-[var(--color-pac-yellow)]">₹{holding.avgPrice.toFixed(2)}</p>
            </div>
         </div>
      )}
    </div>
  );
}
