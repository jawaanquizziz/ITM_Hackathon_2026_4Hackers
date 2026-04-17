import { db } from '@/firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  runTransaction, 
  serverTimestamp 
} from 'firebase/firestore';

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
