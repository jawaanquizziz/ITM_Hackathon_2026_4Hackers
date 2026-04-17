'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Shield, Star, Wallet, Calendar, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    
    const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setProfileData(doc.data());
      }
      setIsLoading(false);
    });

    return () => unsubProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-pac-yellow)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4 px-2 animate-in fade-in duration-700">
      
      {/* Profile Header Card */}
      <div className="relative group overflow-hidden bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-pac-blue)] rounded-full blur-[100px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-pac-yellow)] rounded-full blur-[100px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl">
                 <User size={64} className="text-zinc-700" />
                 {user?.photoURL && (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                 )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[var(--color-pac-yellow)] text-black font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-4 border-[#121212] flex items-center gap-1.5">
                 <Star size={14} fill="black" /> LVL {profileData?.level || 1}
              </div>
           </div>

           <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tighter text-white mb-2">
                 {profileData?.name}
              </h1>
              <p className="text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm italic opacity-80 mb-6">
                 "Professional Financial Arcade Player"
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Shield size={14} /> KYC VERIFIED
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    Joined {profileData?.createdAt?.toDate ? new Date(profileData.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Wallet Card */}
         <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-pac-yellow)]/10 flex items-center justify-center text-[var(--color-pac-yellow)]">
               <Wallet size={20} />
            </div>
            <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Vault Balance</p>
               <h3 className="text-2xl font-black text-white">₹{profileData?.balance?.toLocaleString() || 0}</h3>
            </div>
         </div>

         {/* XP Progress Card */}
         <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-pac-blue)]/10 flex items-center justify-center text-[var(--color-pac-blue)]">
               <Star size={20} />
            </div>
            <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Arcade XP</p>
               <h3 className="text-2xl font-black text-white">{profileData?.xp || 0} XP</h3>
               <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-pac-blue)] shadow-[0_0_10px_var(--color-pac-blue)]" 
                    style={{ width: `${(profileData?.xp % 1000) / 10}%` }}
                  ></div>
               </div>
            </div>
         </div>

         {/* Achievements Card */}
         <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
               <Award size={20} />
            </div>
            <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Achievements</p>
               <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center" title="Early Bird">🐣</div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center opacity-30">🛡️</div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center opacity-30">💎</div>
               </div>
            </div>
         </div>
      </div>

      {/* Invite Friends Section - NEW */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-8 shadow-lg">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-10 animate-pulse"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
               <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Award className="text-indigo-400" /> Build Your Squad
               </h3>
               <p className="text-zinc-400 text-sm font-medium">Earn ₹100 instant bonus for every friend who joins the arcade!</p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
               <div className="bg-black/40 backdrop-blur-md border border-zinc-700/50 rounded-2xl px-6 py-3 flex flex-col items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Your Arcade Code</span>
                  <span className="text-xl font-black text-indigo-400 tracking-tighter">{profileData?.referralCode || 'NO-CODE'}</span>
               </div>
               
               <button 
                  onClick={() => {
                     if (navigator.share) {
                        navigator.share({
                           title: 'Join PacPay Arcade 🕹️',
                           text: `🕹️ I've opened my secure financial vault in PacPay! Join me and we BOTH get ₹100 bonus instantly! Use my Arcade Code: ${profileData?.referralCode}`,
                           url: window.location.origin,
                        }).catch(console.error);
                     } else {
                        navigator.clipboard.writeText(`🕹️ Join me in PacPay and get ₹100 bonus! Use my Arcade Code: ${profileData?.referralCode}`);
                        alert('Referral message copied to clipboard!');
                     }
                  }}
                  className="bg-white text-black px-8 py-3 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
               >
                  INVITE FRIENDS
               </button>
            </div>
         </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Identity Information */}
         <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
               <Shield size={16} className="text-[var(--color-pac-yellow)]" /> Identity Vault
            </h4>
            <div className="space-y-6">
               <DetailItem icon={<Mail size={16}/>} label="Email Address" value={profileData?.email} />
               <DetailItem icon={<Phone size={16}/>} label="Phone Number" value={profileData?.phone} />
               <DetailItem icon={<Briefcase size={16}/>} label="Employment" value={profileData?.employment} />
               <DetailItem icon={<Calendar size={16}/>} label="Date of Birth" value={profileData?.dob} />
            </div>
         </div>

         {/* Verification & Tech */}
         <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
               <MapPin size={16} className="text-[var(--color-pac-blue)]" /> Location & Finance
            </h4>
            <div className="space-y-6">
               <DetailItem icon={<MapPin size={16}/>} label="Base of Operations" value={`${profileData?.address}, ${profileData?.state}`} />
               <DetailItem icon={<Shield size={16}/>} label="PAN Signature" value={profileData?.pan} />
               <DetailItem icon={<Shield size={16}/>} label="Aadhar ID" value={profileData?.aadhar} />
               <DetailItem icon={<Wallet size={16}/>} label="Monthly Income" value={profileData?.income ? `₹${profileData.income}` : 'N/A'} />
            </div>
         </div>
      </div>

    </div>
  );
}

function DetailItem({ icon, label, value }) {
   return (
      <div className="flex items-start gap-4">
         <div className="mt-1 text-zinc-600">{icon}</div>
         <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-white">{value || 'Not provided'}</p>
         </div>
      </div>
   );
}
