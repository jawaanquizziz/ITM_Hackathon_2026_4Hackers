import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Wallet,
  User,
  Settings,
  TrendingUp,
  Gift,
  Sparkles,
  LineChart,
} from 'lucide-react';
import { GlowText } from '../ui/GlowText';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ai', label: 'AI Advisor', icon: Sparkles },
  { id: 'stocks', label: 'Stocks', icon: LineChart },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'profile', label: 'Profile', icon: User },
];

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 bottom-0 w-20 bg-[#0B0B0E]/80 backdrop-blur-3xl border-r border-white/10 hidden lg:flex flex-col items-center py-6 z-40"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
        </motion.div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`
                  relative w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${isActive
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-indigo-500/20"
                    transition={{ type: 'spring', bounce: 0.2 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
              </motion.button>
            );
          })}
        </div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </motion.nav>

      {/* Mobile Bottom Nav */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-[#0B0B0E]/95 backdrop-blur-3xl border-t border-white/10 lg:hidden z-40"
      >
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                  ${isActive ? 'text-indigo-400' : 'text-white/50'}
                `}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeNavMobile"
                      className="absolute -inset-2 rounded-xl bg-indigo-500/20"
                      transition={{ type: 'spring', bounce: 0.2 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-[#0B0B0E]/80 backdrop-blur-3xl border-b border-white/10 lg:hidden z-40"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <span className="text-lg font-bold text-white">P</span>
            </motion.div>
            <GlowText variant="gradient" color="multi" size="lg" weight="bold">
              PacPay
            </GlowText>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <span className="text-sm">🔥</span>
              <span className="text-amber-400 font-semibold text-sm">7</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-indigo-400 font-semibold text-sm">Lv.12</span>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}

// Top bar for desktop
export function TopBar() {
  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-20 right-0 h-16 bg-[#0B0B0E]/80 backdrop-blur-3xl border-b border-white/10 hidden lg:flex items-center justify-between px-6 z-30"
    >
      <GlowText variant="gradient" color="multi" size="xl" weight="bold">
        PacPay
      </GlowText>

      <div className="flex items-center gap-4">
        {/* Level & XP */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1">
            <span className="text-lg">🔥</span>
            <span className="text-amber-400 font-semibold">7</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-medium">Level 12</span>
            <span className="text-white/50 text-sm">2,450 / 3,000 XP</span>
          </div>
        </div>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          <span className="text-white font-medium">John</span>
        </motion.button>
      </div>
    </motion.header>
  );
}