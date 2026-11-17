import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const firebaseConfig = {
 apiKey:"AIzaSyBXqXJGvRCSO8tkw98vs5uDTlBB0-3AGvw",
 authDomain:"digital-mana-badi.firebaseapp.com",
 projectId:"digital-mana-badi",
 storageBucket:"digital-mana-badi.firebasestorage.app",
 messagingSenderId:"53518036330",
 appId:"1:53518036330:web:4837ac67d28c1bfa8b0913",
 measurementId:"G-M00DCSB15Z"
};
const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
