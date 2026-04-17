'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase/config';
import { atomicTransaction } from '@/services/transactionService';
import { X, IndianRupee, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddExpenseModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Shopping');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!amount || isSaving) return;
    const user = auth.currentUser;
    if (!user) {
        alert("Session expired. Please log in again.");
        return;
    }

    setIsSaving(true);
    try {
      const res = await atomicTransaction(user.uid, {
        amount: Number(amount),
        category: category,
        type: "debit",
        merchant: "Marketplace Purchase"
      });
      
      if (res.success) {
        onClose();
      } else {
        alert("Transaction failed. Check balance.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#050505] border border-zinc-800 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 rounded-full blur-[80px] opacity-10"></div>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
               <Tag size={20} className="text-rose-400" /> New Expense
            </h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
               <X size={20} />
            </button>
        </div>
        
        <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 pl-1">Amount (₹)</p>
                <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   placeholder="0.00" 
                   className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-zinc-800" 
                />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 pl-1">Category</p>
                <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full bg-transparent text-sm font-bold text-zinc-200 outline-none appearance-none"
                >
                   <option className="bg-zinc-900 text-white">Shopping</option>
                   <option className="bg-zinc-900 text-white">Food & Drinks</option>
                   <option className="bg-zinc-900 text-white">Transport</option>
                   <option className="bg-zinc-900 text-white">Bills</option>
                   <option className="bg-zinc-900 text-white">Entertainment</option>
                </select>
            </div>
        </div>

        <button 
           onClick={handleSave} 
           disabled={isSaving}
           className="w-full bg-white text-black font-black py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
           {isSaving ? (
             <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
           ) : (
             <>RECORD PURCHASE <Sparkles size={16} /></>
           )}
        </button>

        <p className="text-[9px] font-bold text-center text-zinc-500 mt-4 uppercase tracking-[0.2em] italic">
           +50 XP for healthy record keeping
        </p>
      </motion.div>
    </div>
  );
}

export function AddMoneyModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('1000');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = async () => {
    if (!amount || isProcessing) return;
    const user = auth.currentUser;
    if (!user) return;

    setIsProcessing(true);
    // Real-ish flow using Razorpay pattern from Dashboard
    try {
        const res = await fetch('/api/payment', {
            method: 'POST',
            body: JSON.stringify({ action: 'create_order', amount: Number(amount) })
        });
        const order = await res.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "PacPay Arcade",
            description: "Instant Vault Funding",
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
                        merchant: "Razorpay Secure"
                    });
                    onClose();
                } else {
                    alert("Verification failed.");
                }
            },
            theme: { color: "#FACC15" },
            modal: {
                ondismiss: function() {
                    setIsProcessing(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error(err);
        alert("Payment initialization failed.");
        setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#050505] border border-zinc-800 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-pac-yellow)] rounded-full blur-[80px] opacity-5"></div>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
               <IndianRupee size={20} className="text-[var(--color-pac-yellow)]" /> Refill Vault
            </h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
               <X size={20} />
            </button>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-center ring-1 ring-[var(--color-pac-yellow)]/20 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Funding Amount</p>
           <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-zinc-600">₹</span>
              <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-24 bg-transparent text-4xl font-black text-white outline-none" 
              />
           </div>
        </div>

        <button 
           onClick={handlePayment} 
           disabled={isProcessing}
           className="w-full bg-[var(--color-pac-yellow)] text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
           {isProcessing ? (
             <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
           ) : (
             <>PROCEED TO SECURE PAY <ShieldCheck size={18} /></>
           )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
           <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Powered by Razorpay Secure</span>
        </div>
      </motion.div>
    </div>
  );
}
