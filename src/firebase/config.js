import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
  
  return Object.values(config).every(v => v === true);
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
