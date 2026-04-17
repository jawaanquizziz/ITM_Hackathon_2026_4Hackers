'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { generateReferralCode } from '@/services/transactionService';
import { db } from '@/firebase/config';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user already has a vault
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Initialize basic vault for first-time Google sign-in
        await setDoc(docRef, {
          name: user.displayName || "Arcade Player",
          email: user.email,
          phone: user.phoneNumber || "",
          dob: "",
          pan: "GOOGLE_AUTH",
          aadhar: "GOOGLE_AUTH",
          address: "",
          state: "",
          zip: "",
          employment: "Salaried",
          income: "",
          balance: 0,
          xp: 0,
          level: 1,
          referralCode: generateReferralCode(user.displayName),
          createdAt: serverTimestamp()
        });
      }

      router.push('/');
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

          <button type="submit" disabled={isLoading} className={`w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 ${isLoading && 'opacity-70 cursor-wait'}`}>
            {isLoading ? 'Signing In...' : <><>Sign In</> <ArrowRight size={16} /></>}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-medium">OR</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full bg-white hover:bg-gray-100 text-black py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 ${isLoading && 'opacity-70 cursor-wait'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.69 17.57V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.57C14.71 18.23 13.46 18.63 12 18.63C9.21 18.63 6.84 16.75 5.96 14.19H2.27V17.05C4.06 20.61 7.74 23 12 23Z" fill="#34A853"/>
              <path d="M5.96 14.19C5.74 13.52 5.61 12.78 5.61 12C5.61 11.22 5.74 10.48 5.96 9.81V6.95H2.27C1.51 8.46 1.08 10.18 1.08 12C1.08 13.82 1.51 15.54 2.27 17.05L5.96 14.19Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.07 5.93 16.21 7.02L19.34 3.89C17.45 2.12 14.97 1 12 1C7.74 1 4.06 3.39 2.27 6.95L5.96 9.81C6.84 7.25 9.21 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            Sign In with Google
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
