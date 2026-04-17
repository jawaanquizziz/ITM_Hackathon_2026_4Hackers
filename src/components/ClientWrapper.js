'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';
import { TopNavbar, BottomNavigation } from './Navigation';
import { FAB } from './FAB';

export default function ClientWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Min splash duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    // 2. Auth listener
    if (!auth) {
      console.warn("Auth not configured. Bypassing check.");
      setIsAuthVerified(true);
      return () => clearTimeout(timer);
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthVerified(true);
      
      // If we are verified and on a protected route while logged out, redirect
      const isAuthRoute = pathname === '/login' || pathname === '/register';
      if (!user && !isAuthRoute) {
        router.push('/login');
      }
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [pathname, router]);

  // Wait for both timer and auth to be known before hiding splash
  const showSplash = loading || !isAuthVerified;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      {!showSplash && (
        <div className="animate-in fade-in duration-700 min-h-screen flex flex-col">
          <TopNavbar />
          
          <main className="flex-1 pb-24 md:pb-12 pt-6 md:pt-28 px-4 w-full max-w-lg md:max-w-6xl mx-auto flex flex-col relative z-10 transition-all duration-500">
            {children}
          </main>

          <FAB />
          <BottomNavigation />
        </div>
      )}
    </>
  );
}
