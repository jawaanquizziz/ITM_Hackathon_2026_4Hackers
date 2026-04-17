import { Gift, Lock, Coins, Shield } from 'lucide-react';

export default function RewardsPage() {
  const rewards = [
    { id: 1, title: '₹100 Amazon Voucher', cost: 1000, locked: false, type: 'voucher' },
    { id: 2, title: 'Free Coffee Token', cost: 500, locked: false, type: 'food' },
    { id: 3, title: 'Swiggy 20% Off', cost: 800, locked: true, reqLevel: 5, type: 'food' },
    { id: 4, title: 'AI Assistant Pro', cost: 2000, locked: true, reqLevel: 10, type: 'app' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
       
       {/* Hero Section */}
       <div className="w-full bg-black arcade-border !border-[var(--color-pac-yellow)]/50 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_20px_rgba(250,204,21,0.2)]">
         <div>
            <h1 className="text-xl md:text-2xl font-black mb-2 font-arcade text-[var(--color-pac-yellow)] drop-shadow-[0_0_5px_yellow]">LOOT</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-loose">Trade XP <br/> for real rewards.</p>
         </div>
         <div className="flex flex-col items-center justify-center p-4 bg-zinc-900 border-2 border-zinc-700 rounded-xl shadow-inner">
            <Coins className="text-[var(--color-pac-yellow)] mb-1 drop-shadow-md" size={32} />
            <span className="font-black font-arcade text-lg mt-2">450</span>
         </div>
       </div>

       {/* Decorative Drop */}
       <div className="w-full flex justify-between px-2 py-1 opacity-40">
         {[...Array(15)].map((_, i) => <div key={i} className="pac-dot bg-[var(--color-pac-yellow)]"></div>)}
       </div>

       <div className="grid grid-cols-2 gap-4 w-full">
          {rewards.map(r => (
            <div key={r.id} className="bg-black arcade-border hover:border-[var(--color-pac-yellow)] hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all rounded-2xl p-4 flex flex-col justify-between h-44 relative overflow-hidden group">
               
               {r.locked && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                    <Shield className="text-[var(--color-pac-blue)] mb-2 animate-pulse" size={30} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase font-arcade tracking-wider">Lvl {r.reqLevel}</span>
                 </div>
               )}
               
               <div className="mb-2 relative z-10 flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner flex items-center justify-center mb-4">
                    <Gift className={r.locked ? 'text-zinc-600' : 'text-[var(--color-pac-yellow)] drop-shadow-md'} size={24} />
                 </div>
                 <h3 className="font-bold text-xs uppercase tracking-widest leading-tight">{r.title}</h3>
               </div>
               
               <button className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-[10px] font-arcade tracking-widest font-bold transition flex items-center justify-center gap-2 relative z-10">
                 <Coins size={14} className="text-[var(--color-pac-yellow)]"/> {r.cost}
               </button>
            </div>
          ))}
       </div>
    </div>
  );
}
