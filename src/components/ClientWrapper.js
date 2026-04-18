'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';
import AgentChatbot from './AgentChatbot';
import { TopNavbar, BottomNavigation } from './Navigation';
import { FAB } from './FAB';
import InstallPrompt from './InstallPrompt';

const PUBLIC_ROUTES = ['/login', '/register'];
const SPLASH_DURATION = 2800;

export default function ClientWrapper({ children }) {
  const [splashDone, setSplashDone] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Unknown, LoggedIn (true), or LoggedOut (false)
  const router = useRouter();
  const pathname = usePathname();

  // 1. Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // 2. Auth Context Integration
  useEffect(() => {
    const handleInitialAuth = async () => {
      // Just check if auth is available, don't force logout
      if (!auth) {
        setIsLoggedIn(false);
        setAuthChecked(true);
        return;
      }
      
      setAuthChecked(true);
    };

    handleInitialAuth();

    if (auth) {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
      return () => unsub();
    }
  }, []);

  // 3. Routing Guard
  useEffect(() => {
    if (!splashDone || !authChecked || isLoggedIn === null) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isLoggedIn && !isPublicRoute) {
      router.replace('/login');
    } else if (isLoggedIn && isPublicRoute) {
      router.replace('/');
    }
  }, [splashDone, authChecked, isLoggedIn, pathname, router]);

  // ─── RENDERING LOGIC ───────────────────────────────────────────

  const showSplash = !splashDone || !authChecked || isLoggedIn === null;

  // Level 1: Splash Screen (Always first)
  if (showSplash) {
    return (
      <AnimatePresence mode="wait">
        <SplashScreen key="splash" />
      </AnimatePresence>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Level 2: Safeguard against Dashboard Flicker
  if (!isLoggedIn && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-[var(--color-pac-blue)] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Level 3: Auth/Public Pages (Login/Register)
  if (isPublicRoute) {
    return (
      <div className="animate-in fade-in duration-500 min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        {children}
      </div>
    );
  }

  // Level 4: Main Application Shell (Authenticated)
  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1 pb-32 pt-28 px-4 w-full max-w-6xl mx-auto flex flex-col relative z-10">
        {children}
      </main>
      <AgentChatbot />
      <FAB />
      <BottomNavigation />
      <InstallPrompt />
    </div>
  );
}
