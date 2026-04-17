'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { atomicTransaction } from '@/services/transactionService';
import { Sparkles, ArrowUpRight, ArrowDownRight, Wallet, Activity, Plus } from 'lucide-react';

export default function Dashboard() {
  const [userData, setUserData] = useState({
    balance: 0,
    xp: 0,
    level: 1,
    spentThisWeek: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = "demo_user"; // In production, get this from Firebase Auth
    if (!db) return;
    
    // 1. Listen to User Profile (Balance, XP)
    const unsubUser = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setUserData(prev => ({ ...prev, ...doc.data() }));
      }
      setIsLoading(false);
    });

    // 2. Listen to Recent Transactions
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubTrans = onSnapshot(q, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transData);
    });

    return () => {
      unsubUser();
      unsubTrans();
    };
  }, []);

  // Razorpay Handle: Add Money
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
      description: "Level Up your Balance",
      order_id: order.id,
      handler: async function (response) {
        // Verify payment on server
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
          // Add to Firebase atomically
          await atomicTransaction("demo_user", {
            amount,
            category: "Deposit",
            type: "credit",
            merchant: "Razorpay"
          });
        }
      },
      theme: { color: "#FACC15" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* Top Banner & Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Profile Card */}
        <div className="md:col-span-2 w-full flex justify-between items-center bg-[#121212] p-4 md:p-5 rounded-2xl border border-zinc-800 shadow-sm">
          <div>
            <h1 className="text-xl font-bold font-heading text-white">
              Welcome back, Jawaan
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-medium">Your financial overview</p>
          </div>
          <div className="text-right z-10 flex flex-col items-end">
            <div className="text-xs font-bold text-[var(--color-pac-yellow)] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              Level {userData.level}
            </div>
            <div className="w-24 md:w-32 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[var(--color-pac-yellow)] transition-all duration-500" style={{ width: `${(userData.xp / 500) * 100}%` }}></div>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1 font-medium">{userData.xp} / 500 XP</div>
          </div>
        </div>

        {/* AI AI Insights Widget */}
        <div className="w-full bg-[#121212] border border-zinc-800 rounded-2xl p-4 relative overflow-hidden accent-glow flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-2 text-[var(--color-pac-yellow)]">
            <Sparkles size={16} />
            <h3 className="font-bold text-xs tracking-wide font-heading">AI Coach</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-snug font-main">
             Coffee spending is up 15%. Reduce it to hit your ₹5,000 monthly target early!
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        
        {/* Balance Card */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black p-5 md:p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-pac-blue)] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-medium mb-1 text-xs">
              <Wallet size={14} /> Total Balance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
              ₹{userData.balance.toFixed(2)}
            </h2>
          </div>
          
          <div className="flex gap-3 mt-6">
            <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-3 flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Spent</p>
                <ArrowDownRight size={12} className="text-red-400" />
              </div>
              <p className="font-bold text-base md:text-lg text-white">₹{userData.spentThisWeek.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-3 flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Saved</p>
                <ArrowUpRight size={12} className="text-emerald-400" />
              </div>
              <p className="font-bold text-base md:text-lg text-white">₹450.00</p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between flex-col">
          <h3 className="font-semibold text-zinc-400 text-xs mb-2 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5"><Activity size={14}/> Recent Activity</span>
            <button 
               onClick={() => handleAddMoney(500)}
               className="text-[10px] font-bold text-[var(--color-pac-yellow)] bg-yellow-500/10 px-2 py-1 rounded flex items-center gap-1 hover:bg-yellow-500/20 transition"
            >
              <Plus size={10} /> Add ₹500
            </button>
          </h3>
          <div className="flex flex-col gap-2">
            {transactions.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-zinc-800 rounded-xl">
                <p className="text-[10px] text-zinc-500 font-medium">No activity yet. Level up by adding money!</p>
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-lg">
                      {tx.type === 'credit' ? '💰' : '💳'}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{tx.merchant || tx.category}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 capitalize">{tx.category}</p>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
