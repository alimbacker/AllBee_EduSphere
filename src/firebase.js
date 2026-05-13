// ─────────────────────────────────────────────────────────────
//  AllBee EduSphere — Firebase Configuration
//  Place this file at:  src/firebase.js
//
//  HOW TO SET UP:
//  1. Go to https://console.firebase.google.com
//  2. Create a new project  →  "allbee-edusphere"
//  3. Click "Web" (</>)  →  Register app  →  Copy firebaseConfig
//  4. Replace the config object below with your own values
//  5. In Firebase console:
//       Build → Firestore Database → Create database
//       Start in TEST MODE (or set rules after testing)
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, getDocs } from "firebase/firestore";

// ⚠️  REPLACE THIS WITH YOUR FIREBASE PROJECT CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, onSnapshot, collection, getDocs };
