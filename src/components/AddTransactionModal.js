'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Coffee, Car, CreditCard, Utensils, Zap, Sparkles } from 'lucide-react';
import { atomicTransaction } from '@/services/transactionService';

const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: <Utensils size={18}/>, color: 'text-orange-400' },
  { id: 'gaming', name: 'Gaming & Fun', icon: <Zap size={18}/>, color: 'text-[var(--color-pac-yellow)]' },
  { id: 'travel', name: 'Travel', icon: <Car size={18}/>, color: 'text-[var(--color-pac-blue)]' },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={18}/>, color: 'text-rose-400' },
  { id: 'coffee', name: 'Coffee', icon: <Coffee size={18}/>, color: 'text-amber-400' },
  { id: 'other', name: 'Others', icon: <CreditCard size={18}/>, color: 'text-zinc-400' },
];

export default function AddTransactionModal({ isOpen, onClose, userId }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [merchant, setMerchant] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !merchant) return;

    setIsLoading(true);
    const res = await atomicTransaction(userId, {
      amount: Number(amount),
      category: category.name,
      type: 'debit',
      merchant: merchant
    });

    if (res.success) {
      onClose();
      setAmount('');
      setMerchant('');
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] p-8 z-[70] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[var(--color-pac-yellow)]/10 flex items-center justify-center text-[var(--color-pac-yellow)] border border-[var(--color-pac-yellow)]/20">
                    <Sparkles size={20} />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tighter italic font-heading">ADD TRANSACTION</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Transaction Amount (₹)</label>
                <input 
                  type="number"
                  required
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-yellow)] rounded-2xl p-4 text-3xl font-black text-white outline-none transition-all placeholder:text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Merchant / Description</label>
                <input 
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Starbucks, Steam, Uber"
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-2xl p-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Category Selection</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${category.id === cat.id ? 'bg-zinc-800 border-zinc-600 scale-105' : 'bg-zinc-900/30 border-zinc-800 opacity-60 hover:opacity-100'}`}
                    >
                      <div className={cat.color}>{cat.icon}</div>
                      <span className="text-[8px] font-black uppercase text-zinc-400">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-4 rounded-2xl font-black text-sm transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'SYNCING DATA...' : 'CONFIRM TRANSACTION'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
