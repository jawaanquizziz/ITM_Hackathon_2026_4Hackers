import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import {
  onAuthChange,
  getUserData,
  updateUserData,
  subscribeToUserData,
} from '../services/firebaseService';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  initialize: () => {
    set({ isLoading: true, isInitialized: false });

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        set({ firebaseUser });

        // Subscribe to user data changes
        const unsubscribeUser = subscribeToUserData(firebaseUser.uid, (userData) => {
          if (userData) {
            set({ user: userData, isLoading: false, isInitialized: true });
          } else {
            // User document doesn't exist yet
            set({ user: null, isLoading: false, isInitialized: true });
          }
        });

        return () => {
          unsubscribeUser();
        };
      } else {
        set({
          firebaseUser: null,
          user: null,
          isLoading: false,
          isInitialized: true,
        });
      }
    });

    return unsubscribe;
  },

  updateProfile: async (data) => {
    const { firebaseUser } = get();
    if (!firebaseUser) {
      set({ error: 'No user logged in' });
      return;
    }

    try {
      set({ isLoading: true });
      await updateUserData(firebaseUser.uid, data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    const { initialize } = get();
    set({ isLoading: true });

    // The sign out will trigger the auth state change
    // which will update the store
    const { signOut } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    await signOut(auth);

    set({
      firebaseUser: null,
      user: null,
      isLoading: false,
    });
  },
}));

// Export the initialize function for use in App.tsx
export const initializeAuth = useAuthStore.getState().initialize;