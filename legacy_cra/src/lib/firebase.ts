import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export default app;