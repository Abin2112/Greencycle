import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBHz_s5-IdlYqPq14PC_ZE40ubniUtH0ck",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "greencycle-9e610.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "greencycle-9e610",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "greencycle-9e610.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "439595631011",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:439595631011:web:652a0e2c9a1589e033da16",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-T35GRPYYXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service  
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
