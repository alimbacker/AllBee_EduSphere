// ─────────────────────────────────────────────────────────────────────────────
//  Firebase (Firestore database)
//  If you ALREADY have a working firebase.js, just replace this whole file with
//  yours — it must export: db, doc, setDoc, onSnapshot, collection, getDocs.
//
//  Otherwise, fill in the config from:
//    Firebase console → Project settings → General → Your apps → SDK setup & config
//  These web-config values are safe to commit; your data is protected by your
//  Firestore *security rules*, not by hiding these keys.
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, onSnapshot, collection, getDocs };
