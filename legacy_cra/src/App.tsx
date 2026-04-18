import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/globals.css';
import { Navigation, TopBar } from './components/layout/Navigation';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { Rewards } from './pages/Rewards';
import { AIAgent } from './pages/AIAgent';
import { StockMarket } from './pages/StockMarket';
import { initializeAuth } from './store/authStore';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Initialize Firebase auth
    const unsubscribe = initializeAuth();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setShowOnboarding(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return showOnboarding ? <Home /> : <Dashboard />;
      case 'ai':
        return <AIAgent />;
      case 'stocks':
        return <StockMarket />;
      case 'groups':
        return <Groups />;
      case 'wallet':
        return <Dashboard />;
      case 'rewards':
        return <Rewards />;
      case 'profile':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Top Bar for Desktop */}
      {!showOnboarding && <TopBar />}

      {/* Main Content */}
      <main className={`
        ${!showOnboarding ? 'lg:ml-20' : ''}
        ${!showOnboarding ? 'lg:pt-16' : ''}
        transition-all duration-300
      `}>
        {/* @ts-ignore */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;