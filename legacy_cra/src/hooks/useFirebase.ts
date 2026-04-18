import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useFinanceStore } from '../store/financeStore';
import { useStockStore } from '../store/stockStore';
import {
  subscribeToUserData,
  subscribeToTransactions,
  subscribeToMissions,
  subscribeToBadges,
  subscribeToPortfolio
} from '../services/firebaseService';

export const useFirebaseSync = () => {
  const { firebaseUser, isInitialized } = useAuthStore();
  const { setUser, setMissions, setBadges } = useUserStore();
  const { setTransactions } = useFinanceStore();

  useEffect(() => {
    if (!isInitialized || !firebaseUser) return;

    // Subscribe to user data
    const unsubUser = subscribeToUserData(firebaseUser.uid, (userData) => {
      if (userData) {
        setUser(userData);
      }
    });

    // Subscribe to transactions
    const unsubTransactions = subscribeToTransactions(firebaseUser.uid, (transactions) => {
      setTransactions(transactions);
    });

    // Subscribe to missions
    const unsubMissions = subscribeToMissions(firebaseUser.uid, (missions) => {
      setMissions(missions);
    });

    // Subscribe to badges
    const unsubBadges = subscribeToBadges(firebaseUser.uid, (badges) => {
      setBadges(badges);
    });

    return () => {
      unsubUser();
      unsubTransactions();
      unsubMissions();
      unsubBadges();
    };
  }, [firebaseUser, isInitialized, setUser, setTransactions, setMissions, setBadges]);
};

export const usePortfolioSync = () => {
  const { firebaseUser, isInitialized } = useAuthStore();
  const { portfolio, buyStock, sellStock } = useStockStore();

  // Sync portfolio to Firebase when it changes
  useEffect(() => {
    if (!isInitialized || !firebaseUser) return;

    // Import the sync function dynamically to avoid circular deps
    import('../services/firebaseService').then(({ syncPortfolioToFirestore }) => {
      syncPortfolioToFirestore(firebaseUser.uid, {
        balance: portfolio.balance,
        holdings: portfolio.holdings.map(h => ({
          symbol: h.symbol,
          shares: h.shares,
          avgBuyPrice: h.avgBuyPrice,
        })),
      });
    });
  }, [portfolio, firebaseUser, isInitialized]);
};