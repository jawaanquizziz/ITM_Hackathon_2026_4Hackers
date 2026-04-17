'use client';
import { Plus, IndianRupee, Receipt } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AddExpenseModal, AddMoneyModal } from './Modals';

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [moneyModal, setMoneyModal] = useState(false);
  const pathname = usePathname();

  // Hide FAB on auth routes
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <>
      {/* Overlays */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div className="fixed bottom-[90px] md:bottom-10 right-6 md:right-10 z-[60] flex flex-col items-end">
        
        {/* Menu Options (pop up when open) */}
        <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <ActionBtn 
            label="ADD EXPENSE" 
            color="bg-red-500" 
            delay="delay-100" 
            icon={Receipt}
            onClick={() => { setIsOpen(false); setExpenseModal(true); }}
          />
          <ActionBtn 
            label="ADD MONEY" 
            color="bg-emerald-500" 
            delay="delay-75" 
            icon={IndianRupee}
            onClick={() => { setIsOpen(false); setMoneyModal(true); }}
          />
        </div>

        {/* Main interactive Pac-Man Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full glass-nav transition-all duration-300 border-2 overflow-hidden shadow-2xl ${isOpen ? 'border-[var(--color-pac-blue)] scale-90' : 'border-[var(--color-pac-yellow)] hover:scale-110 shadow-[0_0_20px_rgba(250,204,21,0.4)]'}`}
        >
          <div className="relative w-10 h-10">
             <svg width="40" height="40" viewBox="0 0 100 100">
               <motion.path
                 fill="var(--color-pac-yellow)"
                 animate={{
                   d: isOpen 
                     ? "M 50 50 L 100 49 A 50 50 0 1 0 100 51 Z" 
                     : "M 50 50 L 85.35 14.65 A 50 50 0 1 0 85.35 85.35 Z"
                 }}
                 transition={{ duration: 0.12 }}
               />
             </svg>
          </div>
          
          {/* Subtle pulse when closed */}
          {!isOpen && (
            <div className="absolute inset-0 bg-[var(--color-pac-yellow)] opacity-10 animate-ping rounded-full"></div>
          )}
        </button>
      </div>

      <AddExpenseModal isOpen={expenseModal} onClose={() => setExpenseModal(false)} />
      <AddMoneyModal isOpen={moneyModal} onClose={() => setMoneyModal(false)} />
    </>
  );
}

function ActionBtn({ label, color, delay, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-max bg-black arcade-border !rounded-full pr-1 pl-4 py-1 shadow-[0_0_15px_rgba(30,58,138,0.5)] hover:border-white transition-all ${delay}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest font-arcade text-white">{label}</span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black drop-shadow-md ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </button>
  );
}
