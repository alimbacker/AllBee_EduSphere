import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBooOxU0CrFiORwBVx8n5pE8agYTOLybg8",
  authDomain: "allbee-edusphere.firebaseapp.com",
  projectId: "allbee-edusphere",
  storageBucket: "allbee-edusphere.firebasestorage.app",
  messagingSenderId: "299831823184",
  appId: "1:299831823184:web:533bae065b754e7a3d3a55",
  measurementId: "G-QZ200SVFKX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, onSnapshot, collection, getDocs };
