'use client';
import { useState } from 'react';
import { db } from '@/firebase/config';
import { doc, updateDoc, increment } from 'firebase/firestore'; 

export function AddExpenseModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSave = async () => {
    // Demo flow: 
    // Wait for fake request, then alert user, minus amount from balance, add XP
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      await updateDoc(doc(db, "users", "demo_user"), {
        balance: increment(-Number(amount)),
        xp: increment(50), // simple reward
        spentThisWeek: increment(Number(amount))
      });
    } else {
      alert("Expense added! (Mock mode without Firebase)");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-900 border border-[var(--color-pac-border)] rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹ Amount" 
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-[var(--color-pac-yellow)] text-xl font-bold" 
        />
        
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-6 focus:outline-none text-zinc-200"
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Subscription</option>
          <option>Shopping</option>
        </select>

        <button onClick={handleSave} className="w-full bg-[var(--color-pac-yellow)] text-black font-bold py-3 rounded-xl hover:opacity-90">
          Save Expense (+50 XP)
        </button>
      </div>
    </div>
  );
}

export function AddMoneyModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('1000');
  
  const handlePayment = async () => {
    // Fake Razorpay integration
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_123",
      amount: Number(amount) * 100,
      name: "PacPay Wallet",
      description: "Add Money to Wallet",
      handler: async function (response) {
        // Upon success, update balance
        if(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
           await updateDoc(doc(db, "users", "demo_user"), {
              balance: increment(Number(amount))
           });
        } else {
           alert(`Payment successful! Added ₹${amount} (Mock mode)`);
        }
        onClose();
      },
      prefill: {
        name: "Jawaan",
        email: "jawaan@example.com"
      },
      theme: { color: "#facc15" }
    };
    
    // Instead of actual Razorpay UI which requires the script, simulate direct success for MVP Hackathon
    alert(`Initializing Razorpay for ₹${amount}...`);
    setTimeout(() => {
       options.handler({ razorpay_payment_id: "pay_xyz123" });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-900 border border-[var(--color-pac-border)] rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💳</span> Add Money via Razorpay
        </h2>
        
        <div className="flex bg-zinc-800 border border-zinc-700 rounded-xl mb-6 overflow-hidden">
          <span className="flex items-center px-4 bg-zinc-800 text-zinc-400 font-bold">₹</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent px-2 py-3 focus:outline-none text-xl font-bold" 
          />
        </div>

        <button onClick={handlePayment} className="w-full relative overflow-hidden group bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
          <span className="relative z-10">Pay with Razorpay</span>
        </button>
      </div>
    </div>
  );
}
