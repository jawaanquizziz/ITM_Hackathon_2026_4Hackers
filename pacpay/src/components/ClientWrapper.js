'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';
import { TopNavbar, BottomNavigation } from './Navigation';
import { FAB } from './FAB';

export default function ClientWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>

      {!loading && (
        <div className="animate-in fade-in duration-700">
          <TopNavbar />
          
          <main className="flex-1 pb-24 md:pb-10 pt-6 md:pt-24 px-4 w-full max-w-lg md:max-w-4xl mx-auto flex flex-col relative z-10">
            {children}
          </main>

          <FAB />
          <BottomNavigation />
        </div>
      )}
    </>
  );
}
