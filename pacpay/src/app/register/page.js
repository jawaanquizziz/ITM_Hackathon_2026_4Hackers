'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, MapPin, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', dob: '', phone: '',
    panData: '', ssn: '', address: '', state: '', zip: '',
    employment: 'Salaried', income: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    router.push('/');
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

          <div className="pt-2">
            <button type="submit" className="w-full bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2">
              Create Account
            </button>
          </div>

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
function FormInput({ label, onChange, ...props }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">{label}</label>
      <input 
        {...props}
        onChange={onChange}
        className="w-full bg-[#121212] border border-zinc-800 focus:border-zinc-600 rounded-lg py-2 px-3 text-xs font-medium text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-zinc-900/50"
      />
    </div>
  );
}
