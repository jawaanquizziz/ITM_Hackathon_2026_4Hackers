'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { generateReferralCode, processReferralBonus } from '@/services/transactionService';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', dob: '', phone: '',
    panData: '', ssn: '', address: '', state: '', zip: '',
    employment: 'Salaried', income: '',
    referralCodeInput: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Restrictions
    if (name === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, ''); // Only letters and spaces
    } else if (name === 'phone' || name === 'ssn' || name === 'zip') {
      value = value.replace(/[^\d]/g, ''); // Only numbers
    }

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (formData.name.length < 3) return "Full Name is too short.";
    if (formData.password.length < 8) return "Password must be at least 8 characters.";
    if (!/^\d{10}$/.test(formData.phone)) return "Phone number must be exactly 10 digits.";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panData.toUpperCase())) return "Invalid PAN Number format (e.g., ABCDE1234F).";
    if (!/^\d{12}$/.test(formData.ssn)) return "Aadhar number must be 12 digits.";
    if (!/^\d{6}$/.test(formData.zip)) return "Postal code must be 6 digits.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    if (!auth || !db) {
      console.warn("Firebase not configured. Entering Demo Mode.");
      setTimeout(() => router.push('/'), 800);
      return;
    }

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Initialize Firestore Vault
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        pan: formData.panData.toUpperCase(),
        aadhar: formData.ssn,
        address: formData.address,
        state: formData.state,
        zip: formData.zip,
        employment: formData.employment,
        income: formData.income,
        balance: 0,
        xp: 0,
        level: 1,
        referralCode: generateReferralCode(formData.name),
        createdAt: serverTimestamp()
      });

      // 3. Process referral if provided
      if (formData.referralCodeInput) {
        await processReferralBonus(user.uid, formData.referralCodeInput);
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. This email might already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError('');

    if (!auth || !db) {
      console.warn("Firebase not configured. Entering Demo Mode.");
      setTimeout(() => router.push('/'), 800);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user already has a vault to avoid overwriting existing data
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Initialize basic vault
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
      console.error(err);
      setError("Google Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full animate-in fade-in duration-500">
      
      <div className="w-full max-w-2xl bg-[#121212] border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
        
        {/* Soft Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-pac-blue)] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        
        <div className="mb-6 text-center relative z-10">
           <h1 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
             Create your Account
           </h1>
           <p className="text-xs font-medium text-zinc-400 mt-1">
             Complete your details to securely open your PacPay vault.
           </p>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-4 z-10 relative">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-100 text-[11px] font-bold p-3 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
               ⚠️ Error: {error}
            </div>
          )}
          
          {/* Section 1: Basic Credentials */}
          <div className="bg-zinc-900/30 p-4 md:p-5 rounded-2xl border border-zinc-800/50">
             <h2 className="text-xs font-bold flex items-center gap-1.5 text-white mb-3">
                <User size={14} className="text-[var(--color-pac-blue)]" /> Personal Identity
             </h2>
             <div className="grid md:grid-cols-2 gap-3">
                <FormInput label="Full Legal Name" name="name" type="text" placeholder="John Doe" required onChange={handleChange} />
                <FormInput label="Date of Birth" name="dob" type="date" required onChange={handleChange} />
                <FormInput label="Email Address" name="email" type="email" placeholder="john@example.com" required onChange={handleChange} />
                <FormInput label="Secure Password" name="password" type="password" placeholder="••••••••" required onChange={handleChange} />
                <FormInput label="Phone Number" name="phone" type="tel" placeholder="+91 9876543210" required onChange={handleChange} />
             </div>
          </div>

          {/* Section 2: Verification (Bank Level KYC) */}
          <div className="bg-zinc-900/30 p-4 md:p-5 rounded-2xl border border-zinc-800/50">
             <h2 className="text-xs font-bold flex items-center gap-1.5 text-white mb-3">
                <ShieldCheck size={14} className="text-[var(--color-pac-yellow)]" /> Identity Verification
             </h2>
             <div className="grid md:grid-cols-2 gap-3">
                <FormInput label="PAN Number" name="panData" type="text" placeholder="ABCDE1234F" required onChange={handleChange} />
                <FormInput label="Aadhar Number" name="ssn" type="text" placeholder="1234 5678 9012" required onChange={handleChange} />
             </div>
          </div>

          {/* Section 3: Address */}
          <div className="bg-zinc-900/30 p-4 md:p-5 rounded-2xl border border-zinc-800/50">
             <h2 className="text-xs font-bold flex items-center gap-1.5 text-white mb-3">
                <MapPin size={14} className="text-rose-400" /> Location Data
             </h2>
             <div className="grid md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <FormInput label="Current Residential Address" name="address" type="text" placeholder="Apt 4B, Sector 7" required onChange={handleChange} />
                </div>
                <FormInput label="State" name="state" type="text" placeholder="Maharashtra" required onChange={handleChange} />
                <FormInput label="Postal Code" name="zip" type="text" placeholder="400001" required onChange={handleChange} />
             </div>
          </div>

          {/* Section 4: Financial Profile */}
          <div className="bg-zinc-900/30 p-4 md:p-5 rounded-2xl border border-zinc-800/50">
             <h2 className="text-xs font-bold flex items-center gap-1.5 text-white mb-3">
                <Briefcase size={14} className="text-emerald-400" /> Financial Profile
             </h2>
             <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Employment Status</label>
                  <select name="employment" onChange={handleChange} className="w-full bg-[#121212] border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-lg py-2 px-3 text-xs font-medium text-white outline-none transition-all">
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business">Business Owner</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Annual Income Range</label>
                  <select name="income" onChange={handleChange} className="w-full bg-[#121212] border border-zinc-800 focus:border-[var(--color-pac-blue)] rounded-lg py-2 px-3 text-xs font-medium text-white outline-none transition-all">
                    <option value="0-5L">₹0 - ₹5 Lakhs</option>
                    <option value="5L-10L">₹5 - ₹10 Lakhs</option>
                    <option value="10L-25L">₹10 - ₹25 Lakhs</option>
                    <option value="25L+">₹25 Lakhs +</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-zinc-800">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Referral Invitation</h4>
            <div className="relative">
              <input 
                name="referralCodeInput"
                placeholder="Got an invite code? Enter it here for a ₹100 bonus!"
                value={formData.referralCodeInput}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500 rounded-xl py-3 px-4 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded italic">
                OPTIONAL BONUS
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className={twMerge(
                "w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2",
                isLoading && "opacity-70 cursor-wait"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                   Initializing Vault...
                </div>
              ) : "Create Account"}
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-medium">OR</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className={`w-full bg-white hover:bg-gray-100 text-black py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 ${isLoading && 'opacity-70 cursor-wait'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.69 17.57V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.57C14.71 18.23 13.46 18.63 12 18.63C9.21 18.63 6.84 16.75 5.96 14.19H2.27V17.05C4.06 20.61 7.74 23 12 23Z" fill="#34A853"/>
              <path d="M5.96 14.19C5.74 13.52 5.61 12.78 5.61 12C5.61 11.22 5.74 10.48 5.96 9.81V6.95H2.27C1.51 8.46 1.08 10.18 1.08 12C1.08 13.82 1.51 15.54 2.27 17.05L5.96 14.19Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.07 5.93 16.21 7.02L19.34 3.89C17.45 2.12 14.97 1 12 1C7.74 1 4.06 3.39 2.27 6.95L5.96 9.81C6.84 7.25 9.21 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

        </form>

        <div className="mt-6 flex flex-col items-center z-10 text-center relative">
          <p className="text-[11px] font-medium text-zinc-500">Already have an account?</p>
          <Link href="/login" className="mt-0.5 text-xs font-bold text-white hover:text-[var(--color-pac-blue)] transition">
            Sign in instead
          </Link>
        </div>

      </div>
    </div>
  );
}

// Reusable Input Component
function FormInput({ label, onChange, type = "text", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">{label}</label>
      <div className="relative">
        <input 
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          onChange={onChange}
          className="w-full bg-[#121212] border border-zinc-800 focus:border-zinc-600 rounded-lg py-2 px-3 text-xs font-medium text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-zinc-900/50 pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
