'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, collection, query, where, orderBy, limit, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { atomicTransaction } from '@/services/transactionService';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Activity, 
  Sparkles, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  ShieldAlert,
  Zap,
  User,
  History,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArcadePreview from '@/components/ArcadePreview';
import AddTransactionModal from '@/components/AddTransactionModal';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Player',
    balance: 0,
    xp: 0,
    level: 1,
    spentThisWeek: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not configured. Entering Demo Mode.");
      setUser({ uid: 'demo_user', displayName: 'Jawaan' });
      setIsLoading(false);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    if (!user || !db) {
      if (!db && user) {
        // Provide some default demo data if DB is missing
        setTransactions([
          { id: '1', amount: 500, category: 'Food', type: 'debit', merchant: 'Pac-Cafe', timestamp: new Date() },
          { id: '2', amount: 1200, category: 'Gaming', type: 'debit', merchant: 'Arcade Zone', timestamp: new Date() }
        ]);
        setUserData(prev => ({ ...prev, balance: 1450.50, spentThisWeek: 230 }));
        setIsLoading(false);
      }
      return;
    }
    
    // 1. Listen to User Profile
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(prev => ({ ...prev, ...data }));
        
        // AUTO-TRIGGER: If spent > limit, trigger the animation!
        const maxSpend = data.spendingLimit || 1000;
        if (data.spentThisWeek > maxSpend) {
          
          // Demote Rank Logic: if level > 1 and haven't been demoted yet for this overspend
          if (data.level > 1 && !data.rankDemotedThisWeek) {
             updateDoc(doc(db, "users", user.uid), {
                level: data.level - 1,
                rankDemotedThisWeek: true,
             }).catch(console.error);
          }

          router.push('/overspent');
        }
      }
      setIsLoading(false);
    });

    // 2. Listen to Recent Transactions (Real-time updates)
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      limit(50)
    );

    const unsubTrans = onSnapshot(q, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Client-side sort to avoid index requirement
      const sorted = transData.sort((a, b) => {
        const tA = a.timestamp?.seconds || 0;
        const tB = b.timestamp?.seconds || 0;
        return tB - tA;
      }).slice(0, 6);
      setTransactions(sorted);
    });

    return () => {
      unsubUser();
      unsubTrans();
    };
  }, [user, router]);

  const handleAddMoney = async (amount) => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({ action: 'create_order', amount })
    });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "PacPay Arcade",
      description: "Vault Refill",
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch('/api/payment', {
          method: 'POST',
          body: JSON.stringify({ 
            action: 'verify_payment',
            orderId: order.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
        });
        const verifyData = await verifyRes.json();
        
        if (verifyData.success) {
          await atomicTransaction(user.uid, {
            amount: Number(amount),
            category: "Deposit",
            type: "credit",
            merchant: "Razorpay Cloud"
          });
        }
      },
      theme: { color: "#FACC15" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-[var(--color-pac-yellow)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Syncing Vault...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-700 pb-12">
      
      {/* 1. Welcomer - Spans 2 cols */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 bg-[#121212] border border-zinc-800 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl"
      >
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-[radial-gradient(circle_at_center,_var(--color-pac-blue)_0%,_transparent_70%)] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[var(--color-pac-yellow)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Player Overview</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white tracking-tighter">
            Hi, {userData.name.split(' ')[0]}
          </h1>
          <p className="text-zinc-400 font-medium text-sm mt-2 max-w-sm italic opacity-80">
            Current session active. Your arcade performance is up 12% today.
          </p>
        </div>
        
        <div className="mt-8 flex items-center gap-4 relative z-10">
          <button 
            onClick={() => handleAddMoney(1000)}
            className="bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95"
          >
            QUICK DEPOSIT ₹1000
          </button>
          
          {/* DEMO TOOL: Trigger Animation */}
          <button 
            onClick={() => router.push('/overspent')}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 group"
          >
            <ShieldAlert size={14} className="group-hover:animate-pulse" />
            SIMULATE OVERSPEND
          </button>

          <div className="hidden md:flex -space-x-3">
             <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">J</div>
             <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">K</div>
          </div>
        </div>
      </motion.div>

      {/* 2. Balance Card - Spans 2 cols on tablet, 1 on Large */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 bg-[radial-gradient(circle_at_center,_var(--color-pac-yellow)_0%,_transparent_70%)] opacity-10"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Wallet size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Vault Balance</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">
              ₹{(userData.balance || 0).toLocaleString()}
            </h2>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700 shadow-lg">
             <TrendingUp size={24} className="text-emerald-400" />
          </div>
        </div>

        <div className="flex gap-4 mt-8 relative z-10">
           <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Weekly Spent</p>
              <div className="flex items-center gap-2">
                 <ArrowDownRight size={16} className="text-rose-400" />
                 <span className="text-xl font-black text-white">₹{(userData.spentThisWeek || 0).toLocaleString()}</span>
              </div>
           </div>
           <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Safe Savings</p>
              <div className="flex items-center gap-2">
                 <ArrowUpRight size={16} className="text-emerald-400" />
                 <span className="text-xl font-black text-white">₹{Math.floor((userData.balance || 0) * 0.3).toLocaleString()}</span>
              </div>
           </div>
        </div>
      </motion.div>

      {/* 3. Level Progress - Spans 1 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 flex flex-col gap-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Target size={20} />
          </div>
          <span className="text-[10px] font-black text-orange-400 bg-orange-400/5 px-3 py-1 rounded-full border border-orange-400/10 uppercase tracking-widest">Arcade Rank</span>
        </div>
        
        <div className="mt-2 text-center">
          <h3 className="text-5xl font-black text-white tracking-tighter">LVL {userData.level || 1}</h3>
          <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-widest">Master of Vaults</p>
        </div>

        <div className="mt-4 flex-grow flex flex-col justify-end">
           <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase mb-2">
              <span>Next Level</span>
              <span>{userData.xp || 0} / 500 XP</span>
           </div>
           <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((userData.xp || 0) / 500) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
              />
           </div>
        </div>
      </motion.div>

      {/* 4. Ghost Insights (AI) - Spans 1 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Sparkles size={20} />
          </div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ghost Insights</p>
        </div>

        <div className="mt-2 flex-grow">
           <p className="text-sm font-medium text-zinc-300 leading-relaxed italic border-l-2 border-emerald-500/40 pl-4 py-2 bg-emerald-500/5 rounded-r-xl">
             "You've saved ₹450 compared to last week. At this rate, you'll reach Level 5 by Tuesday!"
           </p>
        </div>

        <div className="mt-4 flex items-center gap-2 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
           <ShieldCheck size={16} className="text-emerald-400" />
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Security Optimal</span>
        </div>
      </motion.div>

      {/* 5. Recent Activity - Spans 2 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2 bg-[#121212] border border-zinc-800 rounded-[2rem] p-8 shadow-xl flex flex-col min-h-[400px] h-full"
      >
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[var(--color-pac-blue)]/10 flex items-center justify-center text-[var(--color-pac-blue)] border border-[var(--color-pac-blue)]/20">
                  <Activity size={20} />
               </div>
               <h3 className="text-xl font-black text-white tracking-tighter">Session Logs</h3>
            </div>
            <button className="text-[10px] font-black text-[var(--color-pac-blue)] uppercase tracking-widest hover:underline flex items-center gap-1">
               <History size={14} /> Full History
            </button>
         </div>

         <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
            {transactions.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center opacity-30 gap-3 grayscale py-12">
                 <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">?</div>
                 <p className="text-xs font-bold uppercase tracking-widest">No Logs Found</p>
              </div>
            ) : (
              transactions.map((tx, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.05) }}
                  key={tx.id} 
                  className="flex justify-between items-center p-4 bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all rounded-[1.5rem] group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-rose-400'}`}>
                      {tx.type === 'credit' ? '💎' : '👻'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{tx.merchant || tx.category}</p>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-600 uppercase mt-0.5">
                       {tx.timestamp?.toDate ? new Date(tx.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
         </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:col-span-2 lg:col-span-2 lg:col-start-2 grid grid-cols-2 gap-4 h-full"
      >
         <ActionTile 
            icon={<User size={24}/>} 
            title="Invite Squad" 
            desc="Earn ₹100 bonus" 
            color="border-indigo-500/20 text-indigo-400"
            onClick={() => router.push('/profile')}
         />
         <ActionTile 
            icon={<Plus size={24}/>} 
            title="Add Activity" 
            desc="Manual Session Log" 
            color="border-emerald-500/20 text-emerald-400" 
            onClick={() => setIsModalOpen(true)}
         />
         <div className="col-span-2 flex flex-col justify-center items-center text-center relative group overflow-hidden bg-gradient-to-r from-[var(--color-pac-yellow)] to-orange-400 rounded-[2rem] p-6 shadow-xl cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => handleAddMoney(500)}>
            <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 scale-150">
               <Wallet size={120} fill="black" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
               <div>
                  <h4 className="text-xl font-black text-black tracking-tighter uppercase transition-transform group-hover:scale-105">Instant Vault Refill</h4>
                  <p className="text-black/60 text-xs font-bold uppercase tracking-widest">Get ₹500 credits now</p>
               </div>
               <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[var(--color-pac-yellow)] shadow-lg transition-all group-hover:rotate-12">
                  <Plus size={24} strokeWidth={3} />
               </div>
            </div>
         </div>
      </motion.div>

      {/* 7. Arcade Live Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="md:col-span-2 lg:col-span-4 bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col mt-4"
      >
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[radial-gradient(circle_at_center,_var(--color-pac-blue)_0%,_transparent_70%)] opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[radial-gradient(circle_at_center,_var(--color-pac-yellow)_0%,_transparent_70%)] opacity-20"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
           <div>
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 font-heading tracking-tighter italic">
                 <Sparkles className="text-[var(--color-pac-yellow)]" /> CYBERPUNK TRADING ARENA
              </h3>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Live High-Fidelity Global Market Feed</p>
           </div>
           <button onClick={() => router.push('/arena')} className="bg-[var(--color-pac-yellow)] w-full md:w-auto text-black font-black text-xs px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(250,204,21,0.4)] flex items-center justify-center gap-3">
              <Zap size={18} fill="black" /> INSERT COINS // PLAY
           </button>
        </div>
        
        <div 
          className="w-full h-[400px] md:h-[550px] overflow-hidden" 
          onClick={() => router.push('/arena')}
        >
           <ArcadePreview />
        </div>
      {/* 8. Future Tech Lab - The Vision */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="md:col-span-2 lg:col-span-4 mt-8"
      >
         <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
               <div className="w-2 h-2 bg-[var(--color-pac-blue)] rounded-full animate-ping"></div>
            </div>
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] italic">PAC-LABS / FUTURE SCOPE</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FutureTile 
               icon={<Sparkles size={24} />}
               title="Ghost AI Coach"
               desc="Advanced Virtual Intelligence will soon analyze your vault to provide hyper-personalized savings strategies."
               tag="RESEARCHING"
               color="emerald"
            />
            <FutureTile 
               icon={<Zap size={24} />}
               title="Arcade Staking"
               desc="Enter the Yield Quest. Lock your balance in the vault to earn Passive XP and exclusive Arcade NFT rewards."
               tag="PROTOTYPING"
               color="blue"
            />
            <FutureTile 
               icon={<Users size={24} />}
               title="Global Clan Wars"
               desc="Team up with friends to form Savings Clans and battle other cities in global financial efficiency tournaments."
               tag="PLANNED"
               color="orange"
            />
         </div>
      </motion.div>
      </motion.div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user?.uid} 
      />
    </div>
  );
}

function ActionTile({ icon, title, desc, color, onClick }) {
   return (
      <div 
        onClick={onClick}
        className={`bg-[#121212] border ${color} rounded-[2rem] p-6 flex flex-col items-center text-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group shadow-lg`}
      >
         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors group-hover:rotate-12">
            {icon}
         </div>
         <div>
            <h4 className="font-black text-white text-lg tracking-tighter leading-none mb-1">{title}</h4>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{desc}</p>
         </div>
      </div>
   );
}

function FutureTile({ icon, title, desc, tag, color }) {
    const colorClasses = {
        emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
        blue: "border-blue-500/20 text-blue-400 bg-blue-500/5",
        orange: "border-orange-500/20 text-orange-400 bg-orange-500/5"
    };

    return (
        <div className={`p-8 rounded-[2rem] border ${colorClasses[color]} flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-default`}>
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center">
                  {icon}
               </div>
               <span className="text-[8px] font-black tracking-widest bg-zinc-900/50 px-3 py-1 rounded-full border border-white/5 opacity-60">
                  {tag}
               </span>
            </div>
            <div>
               <h4 className="font-black text-white text-lg tracking-tighter mb-2 italic uppercase">{title}</h4>
               <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                  {desc}
               </p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </div>
    );
}
