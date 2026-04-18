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

const PLACEHOLDER = 'your_api_key_here';
const isConfigured = 
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== PLACEHOLDER;

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
      console.log('✅ Firebase Vault Link Established.');
    }
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error('❌ Firebase Vault Link Failed:', error.message);
    }
    app = null;
    auth = null;
    db = null;
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Firebase Credentials Missing. Running in Local Demo Mode.');
  }
}

export { app, auth, db };
