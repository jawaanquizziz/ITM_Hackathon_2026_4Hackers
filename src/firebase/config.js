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
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== PLACEHOLDER &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== PLACEHOLDER;

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully.');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.warn('⚠️ Firebase env vars missing or are placeholders. Running in Demo Mode.');
}

export { app, auth, db };
