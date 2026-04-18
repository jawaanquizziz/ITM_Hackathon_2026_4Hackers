'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Users, Plus, ArrowUpRight, ArrowDownRight, CheckCircle2, CircleDashed, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DebtTrackerPage() {
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [debtType, setDebtType] = useState('owed_to_me'); // 'owed_to_me' | 'borrowed'

  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setUser({ uid: 'demo_user' });
      setDebts([
         { id: '1', personName: 'Alex', amount: 500, type: 'owed_to_me', settled: false },
         { id: '2', personName: 'Boss', amount: 1200, type: 'borrowed', settled: false }
      ]);
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
    if (!user || user.uid === 'demo_user' || !db) return;

    const q = query(
      collection(db, 'debts'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side to avoid needing a composite index
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setDebts(sortedData);
    });

    return () => unsub();
  }, [user]);

  const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!personName.trim() || !amount || Number(amount) <= 0) return;
    
    setIsSubmitting(true);

    try {
      if (db && user.uid !== 'demo_user') {
        await addDoc(collection(db, 'debts'), {
          userId: user.uid,
          personName: personName.trim(),
          amount: Number(amount),
          type: debtType,
          settled: false,
          createdAt: serverTimestamp()
        });
      } else {
        // Local Demo Mode Add
        setDebts([{
           id: Math.random().toString(),
           personName: personName.trim(),
           amount: Number(amount),
           type: debtType,
           settled: false
        }, ...debts]);
      }
      
      setPersonName('');
      setAmount('');
    } catch (err) {
      console.error(err);
      alert('Failed to record debt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettle = async (id, currentSettledStatus) => {
     if (db && user.uid !== 'demo_user') {
        await updateDoc(doc(db, 'debts', id), { settled: !currentSettledStatus });
     } else {
        setDebts(debts.map(d => d.id === id ? { ...d, settled: !d.settled } : d));
     }
  };

  // derived stats
  const activeDebts = debts.filter(d => !d.settled);
  const totalReceivables = activeDebts.filter(d => d.type === 'owed_to_me').reduce((acc, curr) => acc + curr.amount, 0);
  const totalLiabilities = activeDebts.filter(d => d.type === 'borrowed').reduce((acc, curr) => acc + curr.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-pac-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[var(--color-pac-blue)] shadow-lg">
            <Users size={24} />
         </div>
         <div>
            <h1 className="text-3xl font-black font-heading text-white tracking-tighter">Debt Tracker</h1>
            <p className="text-zinc-500 text-xs font-medium">Manage IOUs and outstanding liabilities natively.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Col: Analytics & Form */}
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#121212] border border-emerald-500/20 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                     <ArrowUpRight size={14} className="text-emerald-400" /> Receiving
                  </p>
                  <h3 className="text-2xl font-black text-white">₹{totalReceivables.toLocaleString()}</h3>
               </div>
               
               <div className="bg-[#121212] border border-rose-500/20 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                     <ArrowDownRight size={14} className="text-rose-400" /> Paying
                  </p>
                  <h3 className="text-2xl font-black text-white">₹{totalLiabilities.toLocaleString()}</h3>
               </div>
            </div>

            <form onSubmit={handleAddDebt} className="bg-[#121212] border border-zinc-800 rounded-3xl p-6 shadow-xl">
               <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Plus size={16} className="text-[var(--color-pac-yellow)]" /> Record New Ledger
               </h4>
               
               <div className="space-y-4">
                  <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                     <button type="button" onClick={() => setDebtType('owed_to_me')} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${debtType === 'owed_to_me' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        THEY OWE ME
                     </button>
                     <button type="button" onClick={() => setDebtType('borrowed')} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${debtType === 'borrowed' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        I OWE THEM
                     </button>
                  </div>

                  <div>
                     <input 
                        type="text" 
                        required
                        placeholder="Person's Name" 
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-xl py-3 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-600"
                     />
                  </div>
                  <div>
                     <input 
                        type="number"
                        required
                        min="1"
                        placeholder="Amount (₹)" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-xl py-3 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-600"
                     />
                  </div>

                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-[var(--color-pac-blue)] hover:bg-blue-500 text-black py-4 rounded-xl font-black text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                  >
                     {isSubmitting ? 'Recording...' : 'Add Ledger Entry'}
                  </button>
               </div>
            </form>
         </div>

         {/* Right Col: Active Ledger List */}
         <div className="lg:col-span-2">
            <div className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 shadow-2xl min-h-[500px]">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Filter size={16} className="text-zinc-500" /> Active Ledger
                  </h4>
               </div>

               <div className="flex flex-col gap-3 h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  <AnimatePresence>
                     {debts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-50 grayscale">
                           <Users size={48} className="mb-4 text-zinc-600" />
                           <p className="font-bold text-zinc-400 text-sm uppercase tracking-widest">No Active Debts</p>
                        </div>
                     ) : (
                        debts.map((debt) => (
                           <motion.div 
                              key={debt.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                 debt.settled 
                                    ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60' 
                                    : debt.type === 'owed_to_me' 
                                       ? 'bg-emerald-500/5 border-emerald-500/20' 
                                       : 'bg-rose-500/5 border-rose-500/20'
                              }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    debt.settled ? 'bg-zinc-800 text-zinc-500' : debt.type === 'owed_to_me' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                 }`}>
                                    {debt.type === 'owed_to_me' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                 </div>
                                 <div className={debt.settled ? 'line-through decoration-zinc-600' : ''}>
                                    <h5 className="font-bold text-white text-lg">{debt.personName}</h5>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                       {debt.type === 'owed_to_me' ? 'Owes You' : 'You Owe Them'}
                                    </p>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                 <span className={`font-black tracking-tighter text-2xl ${
                                    debt.settled ? 'text-zinc-600' : debt.type === 'owed_to_me' ? 'text-emerald-400' : 'text-rose-400'
                                 }`}>
                                    ₹{debt.amount.toLocaleString()}
                                 </span>
                                 <button 
                                    onClick={() => handleSettle(debt.id, debt.settled)}
                                    className={`p-2 rounded-full transition-transform hover:scale-110 active:scale-90 ${
                                       debt.settled ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 hover:text-white bg-zinc-800'
                                    }`}
                                 >
                                    {debt.settled ? <CheckCircle2 size={24} /> : <CircleDashed size={24} />}
                                 </button>
                              </div>
                           </motion.div>
                        ))
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
