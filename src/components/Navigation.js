'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LineChart, Target, Gift, User, Bell, Settings, Store, LogOut, Users, ArrowUpRight, ArrowDownRight, Trophy } from 'lucide-react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    if (!auth) {
      setUserData({ name: 'Demo Player' });
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (db) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData({ name: user.displayName || 'Player', uid: user.uid });
          }
        } else {
          setUserData({ name: user.displayName || 'Player', uid: user.uid });
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubAuth();
  }, []);

  // Fetch debts for notifications
  const [debts, setDebts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!auth || !auth.currentUser || !db) return;
    const q = query(collection(db, 'debts'), where('userId', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setDebts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [userData]); // trigger refetch when user logs in

  // Close dropdown on click outside
  useEffect(() => {
     function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
           setShowNotifications(false);
        }
     }
     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const unreadCount = debts.filter(d => !d.settled).length;

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.replace('/login');
  };
  
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav hidden md:block border-b border-zinc-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100">
                  <path fill="black" d="M 50 50 L 95 30 A 50 50 0 1 0 95 70 Z" />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-tighter text-white mt-1 group-hover:text-[var(--color-pac-yellow)] transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                PAC<span className="text-[var(--color-pac-yellow)]">PAY</span>
              </span>
            </Link>
          </div>

          <div className="flex space-x-8">
            <NavItem href="/" icon={Home} label="Dashboard" active={pathname === '/'} desktop />
            <NavItem href="/insights" icon={LineChart} label="Insights" active={pathname === '/insights'} desktop />
            <NavItem href="/store" icon={Store} label="Store" active={pathname === '/store'} desktop />
            <NavItem href="/leaderboard" icon={Trophy} label="Leaderboard" active={pathname === '/leaderboard'} desktop />
            <NavItem href="/debts" icon={Users} label="Debts" active={pathname === '/debts'} desktop />
            <NavItem href="/rewards" icon={Gift} label="Rewards" active={pathname === '/rewards'} desktop />
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/settings" className="p-2 rounded-full hover:bg-zinc-800/50 transition text-zinc-400 hover:text-white">
              <Settings size={20} />
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-zinc-800/50 transition focus:outline-none"
              >
                <Bell size={20} className={showNotifications ? 'text-[var(--color-pac-yellow)]' : 'text-zinc-400'} />
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]"></div>
                )}
              </button>

              {/* Advanced Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 right-[-60px] md:right-0 w-80 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 fade-in z-[100]">
                  <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                     <span className="font-bold text-white text-sm">Notifications</span>
                     {unreadCount > 0 && <span className="bg-red-500/20 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount} Pending</span>}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col">
                     {debts.filter(d => !d.settled).length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest grayscale opacity-50">
                           <Bell size={24} className="mx-auto mb-2" />
                           No Active Ledgers
                        </div>
                     ) : (
                        debts.filter(d => !d.settled).map((debt) => (
                           <div key={debt.id} className="p-4 border-b border-zinc-800 hover:bg-zinc-900 transition-colors flex items-start gap-3 cursor-pointer group" onClick={() => {setShowNotifications(false); router.push('/debts');}}>
                              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${debt.type === 'owed_to_me' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                 {debt.type === 'owed_to_me' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-bold text-white">
                                    {debt.type === 'owed_to_me' ? `${debt.personName} owes you` : `You owe ${debt.personName}`}
                                 </p>
                                 <p className={`text-xs font-black mt-1 ${debt.type === 'owed_to_me' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    ₹{debt.amount.toLocaleString()}
                                 </p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
                </div>
              )}
            </div>
            <Link href="/profile" className="flex items-center space-x-2 py-1.5 pl-3 pr-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition shadow-inner">
              <span className="text-xs font-bold pr-1 text-zinc-200">{userData?.name?.split(' ')[0] || 'Player'}</span>
              <div className="w-7 h-7 rounded-full bg-[var(--color-pac-blue)] flex items-center justify-center shadow-lg">
                <User size={14} className="text-white" />
              </div>
            </Link>
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2 rounded-full hover:bg-red-500/10 transition text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <div className="fixed bottom-0 w-full glass-nav border-t border-zinc-800 z-50 md:hidden pb-safe shadow-lg">
      <div className="flex justify-between items-center px-6 py-2">
        <NavItem href="/" icon={Home} label="Home" active={pathname === '/'} />
        <NavItem href="/insights" icon={LineChart} label="Insights" active={pathname === '/insights'} />
        
        {/* Floating Profile Button for Mobile */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
           <Link href="/profile" className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)] border-4 border-[#050505] transition-transform active:scale-90 ${pathname === '/profile' ? 'bg-[var(--color-pac-yellow)] text-black' : 'bg-zinc-900 text-[var(--color-pac-yellow)]'}`}>
              <User size={24} strokeWidth={3} />
           </Link>
        </div>

        <div className="w-16"></div>

        <NavItem href="/store" icon={Store} label="Store" active={pathname === '/store'} />
        <NavItem href="/leaderboard" icon={Trophy} label="Rankings" active={pathname === '/leaderboard'} />
        <NavItem href="/debts" icon={Users} label="Debts" active={pathname === '/debts'} />
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active, desktop = false }) {
  return (
    <Link 
      href={href}
      className={twMerge(
        "flex flex-col items-center justify-center gap-1 transition-all relative group",
        desktop ? "flex-row gap-2 py-2" : "w-14 h-12 mt-1",
        active ? "text-[var(--color-pac-yellow)]" : "text-zinc-500 hover:text-white"
      )}
    >
      <Icon 
        size={desktop ? 18 : 22} 
        strokeWidth={active ? 2.5 : 2} 
      />
      <span className={clsx(
         "text-[10px] font-medium tracking-wide", 
         desktop ? "text-sm font-medium" : ""
      )}>
        {label}
      </span>
      {desktop && active && (
        <span className="absolute -bottom-[29px] left-0 right-0 h-0.5 bg-[var(--color-pac-yellow)] rounded-t-full shadow-[0_-2px_10px_rgba(250,204,21,0.3)]"></span>
      )}
      {desktop && !active && (
        <span className="absolute -bottom-[29px] left-0 right-0 h-0.5 bg-white opacity-0 group-hover:opacity-20 rounded-t-full transition-opacity"></span>
      )}
    </Link>
  );
}
