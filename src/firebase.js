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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBooOxU0CrFiORwBVx8n5pE8agYTOLybg8",
  authDomain: "allbee-edusphere.firebaseapp.com",
  projectId: "allbee-edusphere",
  storageBucket: "allbee-edusphere.firebasestorage.app",
  messagingSenderId: "299831823184",
  appId: "1:299831823184:web:533bae065b754e7a3d3a55",
  measurementId: "G-QZ200SVFKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db, doc, setDoc, onSnapshot, collection, getDocs };
