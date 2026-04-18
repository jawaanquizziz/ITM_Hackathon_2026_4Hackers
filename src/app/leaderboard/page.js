'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Trophy, Medal, Crown, Ghost, Sparkles, Share2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RankCard from '@/components/RankCard';

export default function LeaderboardPage() {
  const [user, setUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRank, setUserRank] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    if (!db) {
      // Demo Data
      setPlayers([
        { id: '1', name: 'Alex Arcade', level: 15, xp: 4800 },
        { id: '2', name: 'Retro Queen', level: 12, xp: 3900 },
        { id: '3', name: 'Jawaan (Demo)', level: 11, xp: 3500 },
        { id: '4', name: 'PacMaster', level: 8, xp: 2100 },
        { id: '5', name: 'Blinky', level: 5, xp: 1200 },
      ]);
      setUserRank(3);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      limit(100)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side: Level Desc, then XP Desc
      const sortedData = data.sort((a, b) => {
        if ((b.level || 0) !== (a.level || 0)) {
           return (b.level || 0) - (a.level || 0);
        }
        return (b.xp || 0) - (a.xp || 0);
      }).slice(0, 50);
      
      setPlayers(sortedData);
      
      // Find current user's rank
      if (user) {
        const index = data.findIndex(p => p.id === user.uid);
        if (index !== -1) {
           setUserRank(index + 1);
           setCurrentUserData(data[index]);
        }
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-pac-yellow)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Retrieving High Scores...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-12 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500 rounded-full blur-[100px] opacity-10"></div>
         <h1 className="text-4xl md:text-6xl font-black font-heading text-white tracking-tighter mb-4 italic flex justify-center items-center gap-4">
            <Trophy size={48} className="text-[var(--color-pac-yellow)]" /> GLOBAL LEADERBOARD
         </h1>
         <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] font-arcade">Only the most disciplined vault masters survive here</p>
      </div>

      {/* Sharing CTA Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 bg-[#121212] border-2 border-[var(--color-pac-yellow)]/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group"
      >
         <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-pac-yellow)] rounded-full blur-[100px] opacity-10"></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)]">
               <Crown size={40} fill="black" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-white tracking-tighter leading-none mb-2 italic">#{userRank || '?'} GLOBAL RANK</h2>
               <p className="text-zinc-400 text-[10px] font-black tracking-widest uppercase">You are outscoring {Math.max(0, players.length - userRank)} players this week!</p>
            </div>
         </div>
         <button 
           onClick={() => setShowShareModal(true)}
           className="bg-white hover:bg-zinc-100 text-black px-8 py-4 rounded-3xl font-black text-sm transition-all shadow-xl active:scale-95 flex items-center gap-3 relative z-10 group-hover:scale-105"
         >
            <Share2 size={18} /> SOCIAL SHARE RANK
         </button>
      </motion.div>

      {/* Players List */}
      <div className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Ghost size={16} /> Player Rankings
            </span>
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Total XP</span>
         </div>
         
         <div className="divide-y divide-zinc-800/50">
            {players.map((player, index) => {
               const isCurrentUser = user && player.id === user.uid;
               const rank = index + 1;
               return (
                  <motion.div 
                    layoutId={player.id}
                    key={player.id}
                    className={`flex items-center justify-between p-6 transition-all hover:bg-zinc-800/10 ${isCurrentUser ? 'bg-[var(--color-pac-yellow)]/5 border-x-4 border-l-[var(--color-pac-yellow)] border-r-transparent' : ''}`}
                  >
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 flex items-center justify-center font-black text-xl italic ${
                           rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-zinc-300' : rank === 3 ? 'text-orange-400' : 'text-zinc-600'
                        }`}>
                           {rank === 1 ? <Medal size={32} /> : rank === 2 ? <Medal size={28} /> : rank === 3 ? <Medal size={24} /> : `#${rank}`}
                        </div>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCurrentUser ? 'bg-[var(--color-pac-yellow)] text-black' : 'bg-zinc-900 text-[var(--color-pac-yellow)] border border-zinc-800'}`}>
                              <Ghost size={20} className={isCurrentUser ? '' : 'animate-bounce'}/>
                           </div>
                           <div>
                              <h4 className={`font-black tracking-tighter text-lg leading-none ${isCurrentUser ? 'text-[var(--color-pac-yellow)]' : 'text-white'}`}>
                                 {player.name} {isCurrentUser && <span className="text-[10px] font-black uppercase text-white/40 ml-2 italic">(YOU)</span>}
                              </h4>
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                 LVL {player.level || 1} <span className="w-1 h-1 bg-zinc-700 rounded-full"></span> {player.rankDemotedThisWeek ? '🔻 TIER DEMOTED' : '🛡️ ACTIVE VAULT'}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-2xl font-black text-white tracking-tighter italic">
                           {(player.xp || 0).toLocaleString()} <span className="text-[10px] font-normal text-zinc-600 tracking-widest not-italic">XP</span>
                        </div>
                     </div>
                  </motion.div>
               );
            })}
         </div>
      </div>

      {/* Share Modal Backdrop */}
      <AnimatePresence>
         {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowShareModal(false)}
                 className="absolute inset-0 bg-black/90 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="relative z-10 w-full max-w-lg mt-12 md:mt-0"
               >
                  <div className="flex justify-between items-center mb-6">
                     <div className="text-center w-full">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">YOUR ARCADE PASSPORT</h3>
                        <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">READY FOR SOCIAL SHARE</p>
                     </div>
                     <button onClick={() => setShowShareModal(false)} className="absolute right-0 text-zinc-500 hover:text-white font-black text-xl">✕</button>
                  </div>
                  
                  <RankCard 
                    userData={currentUserData || { name: user?.displayName || 'Player', level: 1, xp: 0 }} 
                    rank={userRank} 
                  />
                  
                  <div className="mt-8 flex items-center gap-3 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                     <Info size={20} className="text-blue-400 shrink-0" />
                     <p className="text-[10px] font-bold text-zinc-400">PacPay uses high-fidelity rendering to create your rank card. If sharing fails, the card will simply download as an image.</p>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
