import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArsFk0_ibMRp_6L4OJvrSSSrR3FAa3O7M",
  authDomain: "tourguide-5b480.firebaseapp.com",
  databaseURL: "https://tourguide-5b480-default-rtdb.firebaseio.com",
  projectId: "tourguide-5b480",
  storageBucket: "tourguide-5b480.firebasestorage.app",
  messagingSenderId: "941398045215",
  appId: "1:941398045215:web:e8368f3862923da3c4db2a",
  measurementId: "G-GK103KM9V1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;