'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Target, Gift, User, Bell, Store } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function TopNavbar() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav hidden md:block border-b border-zinc-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 10.96 21.84 9.96 21.54 9H11V2.46C11.33 2.16 11.66 2 12 2ZM22 14C22 14.5 21.94 15 21.82 15.48L15 12L21.36 8.35C21.75 9.48 22 10.7 22 12V14Z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white mt-1">
              PacPay
            </span>
          </div>

          <div className="flex space-x-10">
            <NavItem href="/" icon={Home} label="Dashboard" active={pathname === '/'} desktop />
            <NavItem href="/insights" icon={LineChart} label="Insights" active={pathname === '/insights'} desktop />
            <NavItem href="/store" icon={Store} label="Store" active={pathname === '/store'} desktop />
            <NavItem href="/missions" icon={Target} label="Quests" active={pathname === '/missions'} desktop />
            <NavItem href="/rewards" icon={Gift} label="Rewards" active={pathname === '/rewards'} desktop />
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 rounded-full hover:bg-zinc-800/50 transition">
              <Bell size={20} className="text-zinc-400" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]"></div>
            </button>
            <Link href="/profile" className="flex items-center space-x-2 py-1.5 pl-3 pr-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition">
              <span className="text-sm font-medium pr-1 text-white">Jawaan</span>
              <div className="w-7 h-7 rounded-full bg-[var(--color-pac-blue)] flex items-center justify-center shadow-inner">
                <User size={14} className="text-white" />
              </div>
            </Link>
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
        
        <NavItem href="/store" icon={Store} label="Store" active={pathname === '/store'} />

        <NavItem href="/rewards" icon={Gift} label="Rewards" active={pathname === '/rewards'} />
        <NavItem href="/missions" icon={Target} label="Quests" active={pathname === '/missions'} />
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
