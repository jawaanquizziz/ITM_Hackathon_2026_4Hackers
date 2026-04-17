import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';

export const LEVELS = [
  { level: 1, maxXP: 100 },
  { level: 2, maxXP: 250 },
  { level: 3, maxXP: 500 },
  { level: 4, maxXP: 1000 },
  { level: 5, maxXP: 2000 },
  // ... Up to 50
];

export async function addExpenseProcessXP(userId, expenseAmount, category) {
  // Logic: Saving gives +XP, excessive spending might give -XP
  // MOCK Logic for Hackathon
  
  const xpGained = expenseAmount < 500 ? 50 : -20; // Example: Small expense = good habit = +XP
  
  if (!userId) return { xpGained, newLevel: null };
  
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      let currentXP = (data.xp || 0) + xpGained;
      let currentLevel = data.level || 1;
      
      // Level Up Logic
      const nextLevelReq = LEVELS.find(l => l.level === currentLevel)?.maxXP || 9999;
      if (currentXP >= nextLevelReq) {
        currentLevel += 1;
        currentXP -= nextLevelReq;
      }

      await updateDoc(userRef, {
        xp: currentXP,
        level: currentLevel,
      });

      return { xpGained, currentXP, currentLevel };
    }
  } catch (error) {
    console.error("Error processing XP", error);
  }
  
  return { xpGained };
}
