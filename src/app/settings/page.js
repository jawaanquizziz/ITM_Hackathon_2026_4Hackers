'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Settings, User, Bell, Shield, Wallet, Save, LogOut, ChevronRight, Tooltip } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    state: '',
    zip: '',
    employment: '',
    bio: 'Financial Gamer'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          state: data.state || '',
          zip: data.zip || '',
          employment: data.employment || '',
          bio: 'Financial Gamer'
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, formData);
      setSuccessMsg('Vault profile successfully updated! 🛡️');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-pac-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 animate-in fade-in duration-700">
      
      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[var(--color-pac-yellow)] shadow-lg">
            <Settings size={24} />
         </div>
         <div>
            <h1 className="text-3xl font-black font-heading text-white tracking-tighter">Control Center</h1>
            <p className="text-zinc-500 text-xs font-medium">Fine-tune your PacPay experience</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Sidebar Controls */}
         <div className="space-y-4">
            <SettingsSidebarItem active icon={<User size={18}/>} label="Personal Profile" />
            <SettingsSidebarItem icon={<Bell size={18}/>} label="Notifications" />
            <SettingsSidebarItem icon={<Shield size={18}/>} label="Security & Privacy" />
            <SettingsSidebarItem icon={<Wallet size={18}/>} label="Finance Limits" />
            
            <button 
               onClick={() => signOut(auth)}
               className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 transition-all mt-8 group"
            >
               <span className="flex items-center gap-3 font-bold text-sm">
                  <LogOut size={18} /> Sign Out
               </span>
               <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-2">
            <div className="bg-[#121212] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
               
               {/* Success Banner */}
               {successMsg && (
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-black py-2 px-4 text-center text-xs font-black animate-in slide-in-from-top duration-300 z-20">
                     {successMsg}
                  </div>
               )}

               <form onSubmit={handleUpdate} className="space-y-6">
                  
                  <div className="space-y-4">
                     <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Identity Information</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Display Name" name="name" value={formData.name} onChange={handleChange} />
                        <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Location & Base</h3>
                     <InputGroup label="Address" name="address" value={formData.address} onChange={handleChange} />
                     <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="State" name="state" value={formData.state} onChange={handleChange} />
                        <InputGroup label="Zip Code" name="zip" value={formData.zip} onChange={handleChange} />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Vault Status</h3>
                     <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between opacity-60 grayscale cursor-not-allowed">
                        <div className="flex items-center gap-3">
                           <Shield size={18} className="text-[var(--color-pac-yellow)]" />
                           <span className="text-sm font-bold text-zinc-300">KYC Documents (Locked)</span>
                        </div>
                        <span className="text-[10px] font-black bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full italic">SIGNED</span>
                     </div>
                  </div>

                  <button 
                     type="submit" 
                     disabled={isSaving}
                     className="w-full bg-[var(--color-pac-blue)] hover:bg-blue-500 text-black py-4 rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 group mt-8"
                  >
                     {isSaving ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                        <>
                           <Save size={18} /> Update Arcade Permissions
                        </>
                     )}
                  </button>

               </form>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 p-8 rounded-[2rem] border border-red-500/10 bg-red-500/5">
                <h4 className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Critical Action</h4>
                <p className="text-zinc-500 text-xs mb-6 font-medium">Once you delete your arcade vault, all XP, balance, and levels will be permanently wiped. This action is not reversible.</p>
                <button className="text-red-500 text-xs font-black underline decoration-red-500/30 underline-offset-4 hover:decoration-red-500 transition-all">
                   Permanently Decommission Vault
                </button>
            </div>
         </div>
      </div>

    </div>
  );
}

function SettingsSidebarItem({ icon, label, active = false }) {
   return (
      <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${active ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900/50'}`}>
         <div className="flex items-center gap-3 font-bold text-sm">
            {icon} {label}
         </div>
         <ChevronRight size={16} className={`opacity-0 group-hover:opacity-50 transition-all ${active ? 'opacity-100' : ''}`} />
      </div>
   );
}

function InputGroup({ label, name, value, onChange }) {
   return (
      <div className="flex flex-col gap-2">
         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">{label}</label>
         <input 
            type="text" 
            name={name}
            value={value}
            onChange={onChange}
            className="bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] focus:ring-1 focus:ring-[var(--color-pac-blue)] rounded-xl py-3 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-600"
         />
      </div>
   );
}
