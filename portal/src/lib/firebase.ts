import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDARXxRCxKoAU_SeEyxRp1uXPR0roOVm7Y",
    authDomain: "coastal-epigram-392314.firebaseapp.com",
    databaseURL: "https://coastal-epigram-392314-default-rtdb.firebaseio.com",
    projectId: "coastal-epigram-392314",
    storageBucket: "coastal-epigram-392314.firebasestorage.app",
    messagingSenderId: "526525338401",
    appId: "1:526525338401:web:626a18b11f492d9294e460",
    measurementId: "G-33MNNN57SE"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export { db, rtdb, auth };
