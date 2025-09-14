import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHz_s5-IdlYqPq14PC_ZE40ubniUtH0ck",
  authDomain: "greencycle-9e610.firebaseapp.com",
  projectId: "greencycle-9e610",
  storageBucket: "greencycle-9e610.firebasestorage.app",
  messagingSenderId: "439595631011",
  appId: "1:439595631011:web:652a0e2c9a1589e033da16",
  measurementId: "G-T35GRPYYXF"
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
