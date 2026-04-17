'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full animate-in fade-in duration-500">
      
      <div className="w-full max-w-md bg-[#121212] border border-zinc-800 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col items-center shadow-lg">
        {/* Soft Background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-pac-blue)] rounded-full blur-[60px] opacity-10"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-pac-yellow)] rounded-full blur-[60px] opacity-10"></div>
        
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm flex items-center justify-center mb-4 relative z-10">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-pac-yellow)" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 10.96 21.84 9.96 21.54 9H11V2.46C11.33 2.16 11.66 2 12 2ZM22 14C22 14.5 21.94 15 21.82 15.48L15 12L21.36 8.35C21.75 9.48 22 10.7 22 12V14Z" />
           </svg>
        </div>

        <h1 className="text-xl font-bold font-heading text-white tracking-tight mb-1 relative z-10">
          Welcome back
        </h1>
        <p className="text-xs font-medium text-zinc-400 text-center mb-6 relative z-10">
          Enter your details to access your account.
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-3 z-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail size={16} className="text-zinc-500" />
            </div>
            <input 
              type="email" 
              required
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock size={16} className="text-zinc-500" />
            </div>
            <input 
              type="password"
              required 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-yellow)] rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-500"
            />
          </div>

          <div className="text-right pt-0.5 pb-1">
            <a href="#" className="text-[11px] font-medium text-zinc-500 hover:text-[var(--color-pac-blue)] transition">Forgot password?</a>
          </div>

          <button type="submit" className="w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2">
            Sign In <ArrowRight size={16} />
          </button>

        </form>

        <div className="mt-6 flex flex-col items-center z-10">
          <p className="text-[11px] font-medium text-zinc-500">Don't have an account?</p>
          <Link href="/register" className="mt-0.5 text-xs font-bold text-white hover:text-[var(--color-pac-blue)] transition">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
}
