import { Trophy, Target, Star, Ghost } from 'lucide-react';

export default function MissionsLeaderboard() {
  const leaderboard = [
    { rank: 1, name: 'Alex H.', xp: 4500, level: 'LVL 12', bgColor: 'bg-rose-500', color: 'ghost-pink' },
    { rank: 2, name: 'Jawaan (You)', xp: 4120, level: 'LVL 11', bgColor: 'bg-[var(--color-pac-blue)]', color: 'text-[var(--color-pac-blue)] glow-blue' },
    { rank: 3, name: 'Sarah', xp: 3900, level: 'LVL 10', bgColor: 'bg-emerald-500', color: 'ghost-green' },
    { rank: 4, name: 'Michael', xp: 2500, level: 'LVL 6', bgColor: 'bg-violet-500', color: 'ghost-orange' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
      
      <div className="w-full text-center py-8 bg-black arcade-border relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-20 pointer-events-none">
          <Trophy size={80} className="text-[var(--color-pac-yellow)]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-arcade text-[var(--color-pac-yellow)] mb-3 shadow-[0_0_10px_yellow]">
          LEADERBOARD
        </h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 max-w-xs mx-auto">
          Outscore the ghosts. Save money.
        </p>
      </div>

      <div className="w-full">
        <h2 className="text-sm font-arcade uppercase tracking-wider flex items-center gap-2 mb-4 text-rose-500">
          <Target className="animate-pulse" /> ACTIVE QUESTS
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Mission Card */}
          <div className="bg-black arcade-border p-4 flex gap-4 items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-full relative z-10 shadow-inner">
              <Star className="text-yellow-500 drop-shadow-[0_0_5px_yellow]" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-1">No Coffee Streak</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">0 coffee for 3 days</p>
              <div className="w-full bg-zinc-900 border border-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-2/3 shadow-[0_0_5px_red]"></div>
              </div>
            </div>
            <div className="text-[10px] font-arcade text-[var(--color-pac-yellow)] bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl relative z-10 drop-shadow-md">
              +500 XP
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Dots Line */}
      <div className="w-full flex justify-between px-2 py-1 opacity-30">
        {[...Array(15)].map((_, i) => <div key={i} className="pac-dot"></div>)}
      </div>

      <div className="w-full">
        <h2 className="text-sm font-arcade tracking-wider uppercase flex items-center gap-2 mb-4 text-[var(--color-pac-yellow)]">
          <Trophy /> HIGH SCORES
        </h2>
        
        <div className="bg-black arcade-border !border-opacity-80 rounded-2xl overflow-hidden divide-y divide-[var(--color-pac-border)]/50">
          {leaderboard.map((user, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-4 transition-colors hover:bg-zinc-900/80 ${user.name.includes('You') ? 'bg-zinc-900' : ''}`}>
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-arcade drop-shadow-md 
                ${idx === 0 ? 'bg-yellow-500 text-black border border-yellow-400' 
                : idx === 1 ? 'bg-zinc-300 text-black border border-zinc-200' 
                : idx === 2 ? 'bg-orange-500 text-black border border-orange-400' 
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                #{user.rank}
              </div>
              
              <div className="hidden sm:flex relative">
                 <Ghost className={`${user.color} opacity-60`} size={24} />
              </div>
              
              <div className="flex-1 ml-2">
                <h3 className="font-bold text-sm uppercase tracking-wider">{user.name}</h3>
                <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mt-0.5">{user.level}</p>
              </div>
              
              <div className="font-black font-arcade drop-shadow-md text-sm md:text-base">
                {user.xp} <span className="text-[10px] font-normal text-zinc-500 tracking-widest hidden sm:inline"> XP</span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
