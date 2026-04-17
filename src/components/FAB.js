'use client';
import { Plus, IndianRupee, Receipt } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
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
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
        
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

        {/* Main Pac-Man Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full fab-button transition-transform duration-300 border-2 border-yellow-200 ${isOpen ? 'rotate-45' : 'hover:scale-110 shadow-[0_0_20px_rgba(250,204,21,0.8)]'}`}
        >
          <Plus size={32} className="text-black transition-transform" />
          
          {/* Decorative dots to simulate Pac-Man eating */}
          <div className={`absolute -right-4 w-2 h-2 rounded-full bg-white opacity-0 ${isOpen ? '' : 'animate-ping'}`} style={{ animationDuration: '2s' }}></div>
        </button>
      </div>

      <AddExpenseModal isOpen={expenseModal} onClose={() => setExpenseModal(false)} />
      <AddMoneyModal isOpen={moneyModal} onClose={() => setMoneyModal(false)} />
    </>
  );
}

function ActionBtn({ label, color, delay, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-max bg-black arcade-border !rounded-full pl-4 pr-1 py-1 shadow-[0_0_15px_rgba(30,58,138,0.5)] hover:border-white transition-all ${delay}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest font-arcade text-white">{label}</span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black drop-shadow-md ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </button>
  );
}
