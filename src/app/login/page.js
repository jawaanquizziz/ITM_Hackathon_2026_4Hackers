'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  browserPopupRedirectResolver 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { generateReferralCode } from '@/services/transactionService';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

// Helper to create/get a user vault in Firestore after Google Sign-In
async function ensureUserVault(user) {
  if (!db) return;
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      name: user.displayName || 'Arcade Player',
      email: user.email,
      phone: user.phoneNumber || '',
      dob: '',
      pan: 'GOOGLE_AUTH',
      aadhar: 'GOOGLE_AUTH',
      address: '',
      state: '',
      zip: '',
      employment: 'Salaried',
      income: '',
      balance: 0,
      xp: 0,
      level: 1,
      spentThisWeek: 0,
      referralCode: generateReferralCode(user.displayName),
      createdAt: serverTimestamp(),
    });
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // ── Email / Password Sign-In ──────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!auth) throw new Error('Firebase is not configured.');
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Wrong email or password. Please try again.'
          : err.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many failed attempts. Try again later.'
          : 'Sign-in failed. Please try again.';
      setError(msg);
      console.error(err.code, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Sign-In / Sign-Up ──────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      if (!auth) throw new Error('Firebase configuration missing in .env.local');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Attempt Popup first (Better for desktop UX)
      try {
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        await ensureUserVault(result.user);
        router.replace('/');
      } catch (popupErr) {
        // If popup is blocked or fails on mobile, try Redirect
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
          console.log('Popup failed/blocked, attempting redirect flow...');
          await signInWithRedirect(auth, provider);
        } else {
          throw popupErr;
        }
      }
    } catch (err) {
      console.error('Final Auth Error:', err.code, err.message);
      
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add it in Firebase Console > Authentication > Settings > Authorized Domains.');
      } else {
        setError(`Sign-in Error: ${err.message}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#050505] relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--color-pac-blue)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--color-pac-yellow)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] mb-4">
            <svg width="28" height="28" viewBox="0 0 100 100">
              <path fill="black" d="M 50 50 L 85.35 14.65 A 50 50 0 1 0 85.35 85.35 Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Welcome Back</h1>
          <p className="text-zinc-500 text-xs font-medium mt-1">Sign in to access your PacPay Vault</p>
        </div>

        {/* Google Button — Primary CTA */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || isLoading}
          className="w-full bg-white hover:bg-zinc-100 text-black py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex justify-center items-center gap-3 mb-5 disabled:opacity-60 disabled:cursor-wait hover:scale-[1.01] active:scale-[0.98]"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.69 17.57V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.57C14.71 18.23 13.46 18.63 12 18.63C9.21 18.63 6.84 16.75 5.96 14.19H2.27V17.05C4.06 20.61 7.74 23 12 23Z" fill="#34A853"/>
              <path d="M5.96 14.19C5.74 13.52 5.61 12.78 5.61 12C5.61 11.22 5.74 10.48 5.96 9.81V6.95H2.27C1.51 8.46 1.08 10.18 1.08 12C1.08 13.82 1.51 15.54 2.27 17.05L5.96 14.19Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.07 5.93 16.21 7.02L19.34 3.89C17.45 2.12 14.97 1 12 1C7.74 1 4.06 3.39 2.27 6.95L5.96 9.81C6.84 7.25 9.21 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="mx-4 text-zinc-600 text-xs font-semibold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
              ⚠️ {error}
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
              className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-[var(--color-pac-blue)] rounded-xl py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600"
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
              className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-[var(--color-pac-yellow)] rounded-xl py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || googleLoading}
            className="w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-3 rounded-2xl font-black text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-wait hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16}/></>}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs font-medium mt-6">
          No account?{' '}
          <Link href="/register" className="text-white font-bold hover:text-[var(--color-pac-yellow)] transition">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
