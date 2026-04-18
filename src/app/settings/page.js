'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Wallet, 
  Save, 
  LogOut, 
  ChevronRight, 
  Lock, 
  EyeOff,
  Smartphone,
  Mail,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    state: '',
    zip: '',
    employment: '',
    spendingLimit: 1000,
    bio: 'Financial Gamer',
    notifications: {
      push: true,
      email: true,
      missionAlerts: true,
      weeklyReport: false
    },
    security: {
      twoFactor: false,
      biometric: true,
      incognitoMode: false,
      dataPrivacy: true
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setUser({ uid: 'demo_user' });
      setIsLoading(false);
      return;
    }

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
    if (!user || !db) return;
    
    // Use onSnapshot for real-time sync in settings
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFormData(prev => ({
          ...prev,
          ...data,
          notifications: data.notifications || prev.notifications,
          security: data.security || prev.security,
          spendingLimit: data.spendingLimit || prev.spendingLimit
        }));
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleToggle = (category, field) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    
    try {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, formData);
      setSuccessMsg('Vault preferences locked! 🛡️');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-pac-blue)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Retrieving Vault Config...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'limits', label: 'Limits', icon: Wallet },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[var(--color-pac-yellow)] shadow-[0_0_30px_rgba(250,204,21,0.15)]">
               <Settings size={28} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tighter italic uppercase">Control <span className="text-[var(--color-pac-blue)]">Center</span></h1>
               <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Manage your arcade vault parameters</p>
            </div>
         </div>
         <button 
           onClick={handleUpdate}
           disabled={isSaving}
           className="bg-[var(--color-pac-yellow)] hover:bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
         >
           {isSaving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Save size={16} />}
           SAVE CONFIG
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Sidebar Controls */}
         <div className="lg:col-span-3 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-zinc-900 border-zinc-700 text-white shadow-xl' 
                    : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--color-pac-blue)]' : ''} />
                  {tab.label}
                </div>
                <ChevronRight size={16} className={`transition-all ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} />
              </button>
            ))}
            
            <div className="h-px bg-zinc-800/50 my-6"></div>

            <button 
               onClick={() => signOut(auth)}
               className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 transition-all group"
            >
               <span className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                  <LogOut size={18} /> Exit Vault
               </span>
               <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[500px]"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-pac-blue)] opacity-[0.03] blur-[100px] pointer-events-none"></div>

                {successMsg && (
                   <motion.div 
                     initial={{ y: -20, opacity: 0 }} 
                     animate={{ y: 0, opacity: 1 }} 
                     className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-50 border-2 border-emerald-400"
                   >
                     {successMsg}
                   </motion.div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <SectionHeader title="Account Identity" icon={User} color="blue" />
                    <div className="grid md:grid-cols-2 gap-6">
                       <InputGroup label="Player Name" name="name" value={formData.name} onChange={handleChange} />
                       <InputGroup label="Uplink Number" name="phone" value={formData.phone} onChange={handleChange} />
                       <InputGroup label="Residential Base" name="address" value={formData.address} onChange={handleChange} isFullWidth />
                       <InputGroup label="State Protocol" name="state" value={formData.state} onChange={handleChange} />
                       <InputGroup label="Zip Sequence" name="zip" value={formData.zip} onChange={handleChange} />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <SectionHeader title="Alert Frequency" icon={Bell} color="yellow" />
                    <div className="grid gap-4">
                      <ToggleOption 
                        icon={Smartphone} 
                        title="Mission Push Alerts" 
                        desc="Real-time notifications for mission rewards and vault updates." 
                        active={formData.notifications.push}
                        onToggle={() => handleToggle('notifications', 'push')}
                      />
                      <ToggleOption 
                        icon={Mail} 
                        title="In-Game Summaries" 
                        desc="Weekly performance logs sent directly to your encrypted mail." 
                        active={formData.notifications.email}
                        onToggle={() => handleToggle('notifications', 'email')}
                      />
                      <ToggleOption 
                        icon={Zap} 
                        title="Level-Up Flashes" 
                        desc="Instant HUD alerts when you earn enough XP for a higher rank." 
                        active={formData.notifications.missionAlerts}
                        onToggle={() => handleToggle('notifications', 'missionAlerts')}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <SectionHeader title="Defense Systems" icon={Shield} color="red" />
                    <div className="grid gap-4">
                      <ToggleOption 
                        icon={Lock} 
                        title="Arcade 2FA" 
                        desc="Extra layer of encryption for large vault withdrawals." 
                        active={formData.security.twoFactor}
                        onToggle={() => handleToggle('security', 'twoFactor')}
                      />
                      <ToggleOption 
                        icon={EyeOff} 
                        title="Ghost Mode (Incognito)" 
                        desc="Hide your balance and level from the public leaderboards." 
                        active={formData.security.incognitoMode}
                        onToggle={() => handleToggle('security', 'incognitoMode')}
                      />
                      <ToggleOption 
                        icon={Globe} 
                        title="Public Data Shield" 
                        desc="Prevent 3rd party arcade analysis of your spending habits." 
                        active={formData.security.dataPrivacy}
                        onToggle={() => handleToggle('security', 'dataPrivacy')}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'limits' && (
                  <div className="space-y-8">
                    <SectionHeader title="Financial Constraints" icon={Wallet} color="orange" />
                    <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
                      <div className="flex justify-between items-end mb-8">
                         <div>
                            <h4 className="text-xl font-black text-white italic tracking-tighter">VAULT CAPACITOR</h4>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Weekly Spending Threshold</p>
                         </div>
                         <div className="text-right">
                            <span className="text-3xl font-black text-[var(--color-pac-yellow)]">₹{formData.spendingLimit.toLocaleString()}</span>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PER WEEK</p>
                         </div>
                      </div>
                      
                      <input 
                        type="range" 
                        min="500" 
                        max="50000" 
                        step="500"
                        name="spendingLimit"
                        value={formData.spendingLimit}
                        onChange={handleChange}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--color-pac-yellow)]"
                      />
                      
                      <div className="flex justify-between mt-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                         <span>₹500</span>
                         <span>₹50,000</span>
                      </div>

                      <div className="mt-10 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4 items-start">
                         <ShieldCheck className="text-orange-500 shrink-0" size={20} />
                         <div>
                            <p className="text-xs font-bold text-orange-200">Guard Protocol Active</p>
                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Exceeding this threshold will trigger the "Overspent" Arcade sequence and impact your global SAVER rank.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em] text-center opacity-40">
               Encryption Level : Alpha-9 // Session ID : {user ? user.uid.slice(0, 8) : 'ANON'}
            </p>
         </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  };

  return (
    <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6 mb-8">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{title}</h3>
    </div>
  );
}

function ToggleOption({ icon: Icon, title, desc, active, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      className="w-full p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-between group hover:bg-zinc-900/60 transition-all text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-[var(--color-pac-blue)]/10 text-[var(--color-pac-blue)] shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-zinc-800 text-zinc-600'}`}>
          <Icon size={22} />
        </div>
        <div>
          <h4 className="font-black text-white text-sm italic tracking-tight uppercase">{title}</h4>
          <p className="text-[10px] text-zinc-500 font-medium max-w-[280px] mt-0.5">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-[var(--color-pac-blue)]' : 'bg-zinc-800'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md ${active ? 'left-7' : 'left-1'}`}></div>
      </div>
    </button>
  );
}

function InputGroup({ label, name, value, onChange, type = "text", isFullWidth = false }) {
   return (
      <div className={`flex flex-col gap-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
         <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
         <input 
            type={type} 
            name={name}
            value={value}
            onChange={onChange}
            autoComplete="off"
            className="bg-zinc-900/50 border border-zinc-800 focus:border-[var(--color-pac-blue)] focus:ring-1 focus:ring-[var(--color-pac-blue)] rounded-xl py-3 px-4 text-xs font-bold text-white outline-none transition-all placeholder:text-zinc-700"
         />
      </div>
   );
}
