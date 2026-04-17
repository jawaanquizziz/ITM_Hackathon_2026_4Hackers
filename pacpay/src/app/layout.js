import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import { TopNavbar, BottomNavigation } from '@/components/Navigation';
import { FAB } from '@/components/FAB';
import SplashScreen from '@/components/SplashScreen';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-main' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const viewport = {
  themeColor: '#050505',
};

export const metadata = {
  title: 'PacPay - Premium Finance',
  description: 'Manage money and earn professional rewards.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PacPay',
  },
};

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Allowing for the 2.5s animation + small buffer
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} ${outfit.variable} min-h-screen flex flex-col bg-[var(--color-pac-bg)]`}>
        <AnimatePresence>
          {loading && <SplashScreen />}
        </AnimatePresence>

        {!loading && (
          <div className="animate-in fade-in duration-700">
            <TopNavbar />
            
            {/* Main Content Area - Maximized Space Efficiency */}
            <main className="flex-1 pb-24 md:pb-10 pt-6 md:pt-24 px-4 w-full max-w-lg md:max-w-4xl mx-auto flex flex-col relative z-10">
              {children}
            </main>

            <FAB />
            <BottomNavigation />
          </div>
        )}
      </body>
    </html>
  );
}
