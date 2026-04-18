'use client';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Download, Trophy, Zap, Ghost, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RankCard({ userData, rank }) {
  const cardRef = useRef(null);

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      // Convert to blob for sharing
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'pacpay-rank-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My PacPay Rank Card',
          text: `I just reached Level ${userData.level} on PacPay! Can you outscore me? 🕹️`,
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.download = 'pacpay-rank-card.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

  const getRankTier = (level) => {
    if (level >= 10) return { name: 'ARCADE MASTER', color: 'text-yellow-400', ghost: 'rose-500' };
    if (level >= 5) return { name: 'PRO GAMER', color: 'text-blue-400', ghost: 'cyan-400' };
    return { name: 'ROOKIE', color: 'text-emerald-400', ghost: 'emerald-400' };
  };

  const tier = getRankTier(userData.level);

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* THE ACTUAL SHAREABLE CARD (High DPI Rendering) */}
      <div className="p-4 bg-black rounded-[2.5rem] border-4 border-zinc-800 shadow-2xl relative overflow-hidden" ref={cardRef} style={{ width: '360px', height: '520px' }}>
         {/* Arcade Grid Background */}
         <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 grid-rows-8">
            {Array.from({length: 48}).map((_, i) => <div key={i} className="border border-zinc-700"></div>)}
         </div>
         
         {/* Glows */}
         <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]"></div>
         <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

         <div className="relative z-10 h-full flex flex-col items-center justify-between py-8 px-6 text-center">
            
            {/* Header */}
            <div>
               <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-pac-yellow)] flex items-center justify-center shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 100 100">
                      <path fill="black" d="M 50 50 L 95 30 A 50 50 0 1 0 95 70 Z" />
                    </svg>
                  </div>
                  <span className="font-heading font-black text-xl text-white tracking-tighter uppercase italic">PacPay</span>
               </div>
               <div className={`text-[10px] font-black tracking-[0.4em] uppercase ${tier.color}`}>
                  {tier.name}
               </div>
            </div>

            {/* Avatar Area */}
            <div className="relative group">
               <div className={`absolute inset-0 bg-${tier.ghost} blur-3xl opacity-30 animate-pulse`}></div>
               <div className="w-32 h-32 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                  <Ghost size={64} className={`text-${tier.ghost} drop-shadow-[0_0_15px_currentColor]`} />
               </div>
               <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl z-20">
                  <span className="text-black font-black text-xs leading-none">#{rank}</span>
               </div>
            </div>

            {/* User Stats */}
            <div className="w-full">
               <h3 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase italic">{userData.name}</h3>
               <div className="flex items-center justify-center gap-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-4">
                  <span>LEVEL {userData.level}</span>
                  <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                  <span>{userData.xp} XP</span>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" style={{ width: `${(userData.xp / 1000) * 100}%` }}></div>
               </div>
            </div>

            {/* Footer / QR / Code */}
            <div className="w-full pt-6 border-t border-zinc-900">
               <div className="flex justify-between items-center text-left">
                  <div>
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Referral Code</p>
                     <p className="text-sm font-black text-white tracking-tighter mt-1">{userData.referralCode || 'PAC-MASTER'}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg opacity-80">
                     {/* Simplified QR Placeholder */}
                     <div className="w-10 h-10 grid grid-cols-4 grid-rows-4 gap-0.5">
                        {Array.from({length:16}).map((_,i) => <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'} rounded-[1px]`}></div>)}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Sharing Buttons */}
      <div className="flex gap-4 w-full max-w-sm">
         <button 
           onClick={handleShare}
           className="flex-1 bg-white hover:bg-zinc-100 text-black py-4 rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
         >
            <Share2 size={20} /> SHARE TO SOCIALS
         </button>
         <button 
           onClick={handleShare}
           className="w-16 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-3xl flex items-center justify-center transition-all active:scale-95"
         >
            <Download size={20} />
         </button>
      </div>

    </div>
  );
}
