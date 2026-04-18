'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGameStore } from '@/store/gameStore';

export default function StockChart({ symbol }) {
  const stocks = useGameStore((state) => state.stocks);
  const stock = stocks.find(s => s.symbol === symbol);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!stock || !mounted) return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/50 border border-zinc-800 rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-pac-yellow)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">Constructing Matrix Feed...</p>
      </div>
    </div>
  );

  const data = stock.history.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: point.price
  }));

  const isUp = stock.currentPrice >= stock.previousPrice;
  const accentColor = isUp ? '#facc15' : '#ef4444';

  const minPrice = Math.min(...data.map(d => d.price)) * 0.995;
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.005;

  return (
    <div className="w-full h-full min-h-[400px] bg-black/40 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 flex flex-col group relative overflow-hidden">
      
      {/* HUD Overlay */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
           <h2 className="text-2xl font-black text-white tracking-tighter italic">{stock.symbol} / {stock.name || 'ASSET'}</h2>
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-1">{stock.sector} SECTOR // NODE_01</p>
        </div>
        <div className="text-right">
           <p className="text-3xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]">
              {stock.currentPrice.toFixed(2)} <span className="text-xs font-normal text-zinc-500 opacity-50 not-italic uppercase tracking-widest">TK</span>
           </p>
           <p className={`text-xs font-black tracking-widest ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUp ? '+' : ''}{((stock.currentPrice - stock.basePrice) / stock.basePrice * 100).toFixed(2)}%
           </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorPrice-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              hide={true}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#666', fontSize: '10px' }}
              formatter={(val) => [`₹${val}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={accentColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#colorPrice-${symbol})`}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Decorative Grid Markers */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-pac-yellow)]/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--color-pac-blue)]/5 to-transparent pointer-events-none"></div>
    </div>
  );
}
