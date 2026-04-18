'use client';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import AddTransactionModal from '@/components/AddTransactionModal';
import { Plus } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function InsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  // Aggregation Logic
  const categoryTotals = transactions.reduce((acc, tx) => {
    if (tx.type === 'debit') {
      const cat = tx.category || 'Other';
      acc[cat] = (acc[cat] || 0) + (tx.amount || 0);
    }
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);
  const totalSpent = totals.reduce((a, b) => a + b, 0);

  // Weekly Trend
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailySpend = new Array(7).fill(0);
  
  transactions.forEach(tx => {
    if (tx.type === 'debit' && tx.timestamp) {
      const date = tx.timestamp.toDate ? tx.timestamp.toDate() : new Date();
      dailySpend[date.getDay()] += tx.amount;
    }
  });

  const expenseData = {
    labels: labels.length > 0 ? labels : ['No Activity'],
    datasets: [
      {
        data: totals.length > 0 ? totals : [1],
        backgroundColor: ['#facc15', '#0ea5e9', '#f43f5e', '#10b981', '#8b5cf6', '#f97316'],
        borderColor: '#000000',
        borderWidth: 4,
      },
    ],
  };

  const trendData = {
    labels: days,
    datasets: [
      {
        label: 'Spending',
        data: dailySpend,
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#ffffff', font: { family: 'Space Grotesk', weight: 'bold' } }
      }
    },
    maintainAspectRatio: false,
    cutout: '70%'
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 border-4 border-[var(--color-pac-blue)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Decrypting Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center pb-20">
      
      {/* Featured Action Station HUD */}
      <div className="w-full bg-[#0a0a0a] border-4 border-zinc-800 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-pac-blue)] to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 relative z-10">
           <h1 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tighter italic uppercase">
              DATA <span className="text-[var(--color-pac-blue)]">COMMAND</span>
           </h1>
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM_LIVE // LOG_SESSIONS
           </p>
        </div>

        <button 
           onClick={() => setIsModalOpen(true)}
           className="w-full md:w-auto bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black px-8 py-5 rounded-[2rem] font-black text-xs transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
           <Plus size={20} strokeWidth={4} />
           <span>ADD EXPENSES</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 flex flex-col items-center relative shadow-xl">
           <h2 className="text-[10px] font-black uppercase tracking-widest w-full text-left mb-6 text-zinc-500">Category Breakdown</h2>
           <div className="w-full max-w-[220px] aspect-square relative">
             <Doughnut data={expenseData} options={options} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
               <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Spent</span>
               <span className="text-xl font-black text-white">₹{totalSpent}</span>
             </div>
           </div>
        </div>

        <div className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 shadow-xl w-full min-h-[300px]">
           <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-500">Weekly Performance</h2>
           <div className="w-full h-[200px]">
             <Line data={trendData} options={{ 
                 responsive: true, 
                 maintainAspectRatio: false, 
                 scales: { 
                    x: { grid: { display: false }, ticks: { color: '#52525b', font: { family: 'Space Grotesk', weight: 'bold' } } }, 
                    y: { grid: { color: '#27272a' }, ticks: { color: '#52525b', font: { family: 'Space Grotesk', weight: 'bold' } } } 
                 } 
               }} 
             />
           </div>
        </div>
      </div>
      
      <div className="w-full bg-[#121212] border border-zinc-800 rounded-[2rem] p-6 shadow-xl">
        <h3 className="font-black mb-6 text-[10px] uppercase tracking-widest text-zinc-500">Detailed Session Log</h3>
        <div className="space-y-4">
          {labels.length > 0 ? labels.map((label, i) => (
             <div key={label} className="flex items-center justify-between group p-3 bg-black/20 rounded-2xl border border-transparent hover:border-zinc-800 transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: expenseData.datasets[0].backgroundColor[i] }}></div>
                   <span className="font-bold text-xs uppercase text-zinc-300">{label}</span>
                </div>
                <div className="font-black text-white">
                   ₹{categoryTotals[label]}
                </div>
             </div>
          )) : (
            <div className="py-10 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest italic opacity-40">
               Waiting for first transaction...
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user?.uid} 
      />
    </div>
  );
}
