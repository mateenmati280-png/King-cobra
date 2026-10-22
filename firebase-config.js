/* ============================================================
   🔥 FIREBASE CONFIG — King Cobra
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { 
    getFirestore, collection, doc, setDoc, getDoc, getDocs, 
    updateDoc, deleteDoc, query, where, orderBy, 
    onSnapshot, serverTimestamp, addDoc,
    increment, limit, arrayUnion, arrayRemove, writeBatch 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { 
    getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";/* ============================================================
   🔑 YOUR FIREBASE CONFIGURATION
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyATAbDaGyBAMz_Ba4xsimPYNoN7Xz7BT7w",
  authDomain: "kingcobra-caa5c.firebaseapp.com",
  databaseURL: "https://kingcobra-caa5c-default-rtdb.firebaseio.com",
  projectId: "kingcobra-caa5c",
  storageBucket: "kingcobra-caa5c.firebasestorage.app",
  messagingSenderId: "438138102537",
  appId: "1:438138102537:web:04f580bcce029c8dc229d8",
  measurementId: "G-MM163RYMFH"
};

/* ============================================================
   🚀 INITIALIZE FIREBASE
   ============================================================ */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ============================================================
   📦 EXPORTS
   ============================================================ */

export { 
    db, 
    auth, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    serverTimestamp, 
    addDoc,
    increment, 
    limit, 
    arrayUnion, 
    arrayRemove, 
    writeBatch,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
};