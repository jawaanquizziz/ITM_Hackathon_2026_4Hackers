'use client';
import { useGameStore } from '@/store/gameStore';

export default function StockList({ onSelect, selectedSymbol }) {
  const stocks = useGameStore((state) => state.stocks);

  return (
    <div className="h-full bg-black border border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Live Feed</h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {stocks.map((stock) => {
          const isUp = stock.currentPrice >= stock.previousPrice;
          const isSelected = selectedSymbol === stock.symbol;
          
          return (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 ${
                isSelected 
                  ? 'bg-[var(--color-pac-yellow)]/10 border-[var(--color-pac-yellow)] shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
                  : 'bg-[#121212] border-zinc-900 border-transparent hover:border-zinc-800'
              }`}
            >
              <div className="text-left">
                <h4 className={`font-black text-sm tracking-tighter ${isSelected ? 'text-[var(--color-pac-yellow)]' : 'text-white'}`}>
                  {stock.symbol}
                </h4>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{stock.sector}</p>
              </div>
              <div className="text-right">
                <div className={`font-mono text-xs font-black ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.currentPrice.toFixed(2)}
                </div>
                <div className={`text-[9px] font-mono ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isUp ? '+' : ''}{((stock.currentPrice - stock.basePrice) / stock.basePrice * 100).toFixed(2)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
