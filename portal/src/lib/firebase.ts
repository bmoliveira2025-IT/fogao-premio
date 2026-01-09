import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAmWOTIPqRaP-YWwhPElY6fPh9DAeFcp-c",
    authDomain: "strive-bra.firebaseapp.com",
    projectId: "strive-bra",
    storageBucket: "strive-bra.firebasestorage.app",
    messagingSenderId: "112700432380",
    appId: "1:112700432380:web:90f802159ddf7ad4bc1c79"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export { db, rtdb, auth };
