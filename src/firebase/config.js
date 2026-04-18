import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBddCZn6vxtK_vcG0jJCMao8ZAU-j5nckA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pacpay-b0324.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pacpay-b0324",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pacpay-b0324.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "232782131024",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:232782131024:web:122447dad9f3b5f5b34655",
};

// ─── ENVIRONMENT DIAGNOSTICS ───────────────────────────────────
const getFirebaseStatus = () => {
  const config = {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  
  if (typeof window !== 'undefined') {
    console.table({ 'Vault_Security_Link': config });
  }
  
  return true; // Bypass env check because we have hardcoded fallback
};

const isConfigured = getFirebaseStatus();

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    const apps = getApps();
    app = !apps.length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    
    if (typeof window !== 'undefined') {
      console.log('✅ PacPay Vault: Link Secure');
    }
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error('❌ PacPay Vault: Link Interrupted ->', error.message);
    }
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ PacPay Vault: Running in Local Offline Mode (Env Vars Missing)');
  }
}

export { app, auth, db };
