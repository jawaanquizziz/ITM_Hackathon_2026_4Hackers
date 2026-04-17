import { db } from '@/firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  runTransaction, 
  serverTimestamp,
  getDocs,
  query,
  where,
  limit
} from 'firebase/firestore';

/**
 * generateReferralCode: Creates a unique code for the user.
 */
export function generateReferralCode(name) {
  const prefix = name ? name.split(' ')[0].toUpperCase().substring(0, 4) : 'PAC';
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * processReferralBonus: Rewards both inviter and invitee.
 */
export async function processReferralBonus(inviteeId, referralCode) {
  if (!referralCode) return { success: false };

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", referralCode), limit(1));
    const inviterSnap = await getDocs(q);

    if (inviterSnap.empty) {
      console.warn("Invalid referral code provided.");
      return { success: false, error: "Invalid referral code" };
    }

    const inviterDoc = inviterSnap.docs[0];
    const inviterId = inviterDoc.id;

    await runTransaction(db, async (transaction) => {
      const inviterRef = doc(db, "users", inviterId);
      const inviteeRef = doc(db, "users", inviteeId);

      const inviterData = (await transaction.get(inviterRef)).data();
      const inviteeData = (await transaction.get(inviteeRef)).data();

      if (!inviteeData) throw new Error("Invitee profile not found");

      // Update Inviter
      transaction.update(inviterRef, {
        balance: (inviterData.balance || 0) + 100,
        xp: (inviterData.xp || 0) + 200
      });

      // Update Invitee
      transaction.update(inviteeRef, {
        balance: (inviteeData.balance || 0) + 100,
        xp: (inviteeData.xp || 0) + 500 // Welcome bonus XP
      });

      // Log both transactions
      const transRef1 = doc(collection(db, "transactions"));
      const transRef2 = doc(collection(db, "transactions"));

      transaction.set(transRef1, {
        userId: inviterId, amount: 100, category: "Referral Bonus", 
        type: "credit", merchant: `Referred ${inviteeData.name}`, timestamp: serverTimestamp()
      });

      transaction.set(transRef2, {
        userId: inviteeId, amount: 100, category: "Referral Bonus", 
        type: "credit", merchant: `Used ${inviterData.name}'s code`, timestamp: serverTimestamp()
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Referral process failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * atomicTransaction: Standardized way to add an expense or money.
 * Ensures balance and transaction list are ALWAYS in sync.
 */
export async function atomicTransaction(userId, data) {
  const { amount, category, type, merchant } = data;
  
  const userRef = doc(db, "users", userId);
  const transCollection = collection(db, "transactions");

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      // If user doesn't exist, initialize them (common for new players)
      if (!userDoc.exists()) {
        transaction.set(userRef, {
          balance: type === 'credit' ? amount : 0,
          xp: 100,
          level: 1,
          createdAt: serverTimestamp()
        });
      } else {
        const newBalance = type === 'credit' 
          ? (userDoc.data().balance || 0) + amount 
          : (userDoc.data().balance || 0) - amount;
        
        transaction.update(userRef, { balance: Math.max(0, newBalance) });
      }

      // Add the history record
      const newTransRef = doc(transCollection);
      transaction.set(newTransRef, {
        userId,
        amount,
        category,
        type,
        merchant,
        timestamp: serverTimestamp()
      });
    });
    
    return { success: true };
  } catch (e) {
    console.error("Transaction failed: ", e);
    return { success: false, error: e.message };
  }
}
