'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import SplashScreen from './SplashScreen';
import { TopNavbar, BottomNavigation } from './Navigation';
import { FAB } from './FAB';
import InstallPrompt from './InstallPrompt';

const PUBLIC_ROUTES = ['/login', '/register'];
const SPLASH_DURATION = 2800;

export default function ClientWrapper({ children }) {
  const [splashDone, setSplashDone] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Splash timer — always run for the minimum duration
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Auth listener
  useEffect(() => {
    if (!auth) {
      // Demo mode: no Firebase, skip auth check
      console.warn('Firebase Auth not available. Running in Demo Mode.');
      setIsLoggedIn(true);
      setAuthChecked(true);
      return;
    }

    // Force sign out on initial load for demo purposes so it always shows the login screen
    signOut(auth).catch(console.error);

    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });

    return () => unsub();
  }, []);

  // Route guard — only runs once both checks are done and splash is shown
  useEffect(() => {
    if (!splashDone || !authChecked) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isLoggedIn && !isPublicRoute) {
      router.replace('/login');
    } else if (isLoggedIn && isPublicRoute) {
      router.replace('/');
    }
  }, [splashDone, authChecked, isLoggedIn, pathname, router]);

  // Show splash until both the timer is up AND auth state is known
  const showSplash = !splashDone || !authChecked;

  // While splash is up, always show it
  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen key="splash" />
      </AnimatePresence>
    );
  }

  // After splash, if on a public route (login/register), render children with no nav
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (isPublicRoute) {
    return (
      <div className="animate-in fade-in duration-500 min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        {children}
      </div>
    );
  }

  // Main app shell with nav
  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1 pb-24 md:pb-12 pt-6 md:pt-28 px-4 w-full max-w-lg md:max-w-6xl mx-auto flex flex-col relative z-10 transition-all duration-500">
        {children}
      </main>
      <FAB />
      <BottomNavigation />
      <InstallPrompt />
    </div>
  );
}
