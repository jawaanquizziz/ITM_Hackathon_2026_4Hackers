'use client';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom install banner automatically as requested
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If the app is already installed, this event fires
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100] bg-[#121212] border-2 border-[var(--color-pac-yellow)] p-4 rounded-2xl shadow-[0_10px_40px_rgba(250,204,21,0.2)] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-pac-yellow)] rounded-xl flex items-center justify-center">
              <Download size={20} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">Install PacPay</span>
              <span className="text-xs font-medium text-zinc-400">Get the full native Arcade experience.</span>
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
               onClick={handleInstallClick}
               className="bg-[var(--color-pac-yellow)] text-black font-black text-xs px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
             >
               INSTALL
             </button>
             <button 
               onClick={() => setShowPrompt(false)}
               className="p-2 text-zinc-400 hover:text-white transition"
             >
               <X size={16} />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
