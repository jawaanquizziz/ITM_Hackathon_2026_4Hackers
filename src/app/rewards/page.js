'use client';
import { useEffect, useState } from 'react';
import { Gift, Ghost, Coins, Zap, Star, ShieldAlert, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase/config';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ balance: 0, level: 1, xp: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const rewards = [
    { id: 1, title: '₹100 Amazon Voucher', cost: 1000, locked: false, type: 'voucher', ghost: 'red' },
    { id: 2, title: 'Free Coffee Token', cost: 500, locked: false, type: 'food', ghost: 'pink' },
    { id: 3, title: 'Swiggy BOGO Offer', cost: 800, locked: true, reqLevel: 3, type: 'food', ghost: 'cyan' },
    { id: 4, title: 'Premium AI Skins', cost: 1500, locked: true, reqLevel: 5, type: 'app', ghost: 'orange' },
    { id: 5, title: 'Instant ₹500 Cashback', cost: 5000, locked: true, reqLevel: 10, type: 'voucher', ghost: 'red' },
    { id: 6, title: 'Vault Pass Pro', cost: 2500, locked: true, reqLevel: 7, type: 'security', ghost: 'pink' },
  ];

  useEffect(() => {
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setIsLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          balance: data.balance || 0,
          level: data.level || 1,
          xp: data.xp || 0
        });
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleClaim = async (reward) => {
    if (!user || claimingId || userData.balance < reward.cost) return;

    setClaimingId(reward.id);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balance: increment(-reward.cost)
      });
      
      setSuccessMsg(`LOOT ACQUIRED: ${reward.title}! 🎁`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Redemption Failure:", err);
    } finally {
      setClaimingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-[var(--color-pac-yellow)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Caching Loot Table...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 w-full flex flex-col items-center pb-20 relative px-2">
       
       {/* Background Maze Ambience */}
       <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
          <div className="absolute inset-0 cyber-grid"></div>
       </div>

       {/* Success Toast Notification */}
       <AnimatePresence>
         {successMsg && (
           <motion.div 
             initial={{ y: -100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -100, opacity: 0 }}
             className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
           >
             <div className="bg-[var(--color-pac-blue)] text-black p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(14,165,233,0.5)] border-2 border-white/20">
               <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Mission Success</p>
                  <p className="text-sm font-black uppercase tracking-tight">{successMsg}</p>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Arcade HUD Header */}
       <motion.div 
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         className="w-full bg-[#0a0a0a] border-4 border-zinc-800 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
       >
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-pac-yellow)] via-[var(--color-pac-blue)] to-[var(--color-pac-yellow)] animate-[gradient_3s_linear_infinite] bg-[length:200%_auto]"></div>
         
         <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="relative">
               <div className="w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-[var(--color-pac-yellow)] flex items-center justify-center text-[var(--color-pac-yellow)] shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                  <Trophy size={32} />
               </div>
               <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full border border-white/20 uppercase">1UP</div>
            </div>
            <div>
               <h1 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tighter italic leading-none uppercase">THE <span className="text-[var(--color-pac-yellow)]">TREASURY</span></h1>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                  <Zap size={10} className="text-[var(--color-pac-blue)]" /> INSERT XP // REAP LOOT
               </p>
            </div>
         </div>

         <div className="flex gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">P1 CREDITS</p>
               <div className="flex items-center gap-2">
                  <Coins className="text-[var(--color-pac-yellow)]" size={20} />
                  <span className="text-3xl font-black text-white italic tracking-tighter">₹{userData.balance.toLocaleString()}</span>
               </div>
            </div>
            <div className="flex-1 md:flex-none">
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">HIGH SCORE</p>
               <div className="flex items-center gap-2">
                  <Star className="text-[var(--color-pac-blue)]" size={20} />
                  <span className="text-3xl font-black text-white italic tracking-tighter">{userData.xp.toLocaleString()}</span>
               </div>
            </div>
         </div>
       </motion.div>

       {/* Sub-HUD Maze Dots */}
       <div className="w-full flex justify-between px-4 py-2 opacity-20 relative z-10">
         {[...Array(12)].map((_, i) => (
           <motion.div 
             key={i} 
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
             className="w-1.5 h-1.5 bg-[var(--color-pac-yellow)] rounded-full shadow-[0_0_10px_var(--color-pac-yellow)]"
           ></motion.div>
         ))}
       </div>

       {/* Reward Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10 p-2">
          {rewards.map((r, i) => {
            const isLocked = r.locked && userData.level < r.reqLevel;
            const canAfford = userData.balance >= r.cost;
            const isClaiming = claimingId === r.id;

            const ghostColors = {
               red: 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
               pink: 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]',
               cyan: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
               orange: 'text-orange-400 drop-shadow-[0_0_8_rgba(251,146,60,0.5)]'
            };

            return (
              <motion.div 
                key={r.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={!isLocked ? { y: -5 } : {}}
                className={`group relative bg-[#121212] border-2 rounded-[2.5rem] p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl ${
                  isLocked ? 'border-zinc-800 opacity-80' : 'border-zinc-800 hover:border-[var(--color-pac-yellow)]'
                }`}
              >
                 {/* Internal HUD Elements */}
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={100} />
                 </div>

                 {isLocked && (
                   <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className={ghostColors[r.ghost]}
                      >
                         <Ghost size={48} fill="currentColor" />
                      </motion.div>
                      <h4 className="mt-4 font-black text-xl italic tracking-tighter text-white uppercase">SENTRY BLOCK</h4>
                      <div className="flex items-center gap-2 mt-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                         <ShieldAlert size={14} className="text-red-500" />
                         <span className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.2em]">Rank {r.reqLevel} Required</span>
                      </div>
                   </div>
                 )}
                 
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all group-hover:scale-110 ${
                        isLocked ? 'bg-zinc-900 border-zinc-800 text-zinc-700' : 'bg-zinc-900 border-zinc-800 text-[var(--color-pac-yellow)] group-hover:border-[var(--color-pac-yellow)]'
                      }`}>
                         <Gift size={28} />
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Loot Type</p>
                         <p className="font-bold text-xs text-zinc-300 uppercase italic tracking-tighter">{r.type}</p>
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none mb-2 group-hover:text-[var(--color-pac-yellow)] transition-colors">
                      {r.title}
                   </h3>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
                      Secure this vault asset with your credits.
                   </p>
                 </div>
                 
                 <button 
                   onClick={() => handleClaim(r)}
                   disabled={isLocked || !canAfford || isClaiming}
                   className={`w-full py-4 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-3 relative z-10 uppercase tracking-widest relative overflow-hidden group/btn ${
                   isLocked || !canAfford
                     ? 'bg-zinc-900 border border-zinc-800 text-zinc-700' 
                     : 'bg-white text-black hover:bg-[var(--color-pac-yellow)] hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                 }`}>
                   {isClaiming ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                   ) : (
                      <>
                        <Coins size={16} /> 
                        {r.cost.toLocaleString()} <span className="opacity-40">/</span> {canAfford ? 'CLAIM' : 'LOW FUNDS'}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity animate-pulse"></div>
                      </>
                   )}
                 </button>
              </motion.div>
            );
          })}
       </div>

       {/* Footer Arcade Banner */}
       <div className="mt-12 p-8 rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 text-center w-full max-w-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-pac-yellow)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Master Challenge</h4>
          <p className="text-zinc-400 text-sm font-bold leading-relaxed mb-6">
             Level up your <span className="text-white italic">FINANCIAL SAVVY</span> to unlock legendary tier ghost-guarded vaults.
          </p>
          <div className="flex items-center justify-center gap-2 text-[var(--color-pac-yellow)]">
             <Star size={16} fill="currentColor" />
             <Star size={16} fill="currentColor" />
             <Star size={16} fill="currentColor" />
          </div>
       </div>

       <style jsx>{`
         @keyframes gradient {
           0% { background-position: 0% 50%; }
           100% { background-position: 200% 50%; }
         }
       `}</style>
    </div>
  );
}
