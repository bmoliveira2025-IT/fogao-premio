"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    isPremium: boolean;
    points: number;
    rank: string;
    preferences: { news: boolean; podcasts: boolean; videos: boolean };
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isPremium: false,
    points: 0,
    rank: "Bronze",
    preferences: { news: true, podcasts: true, videos: true },
    loading: true,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [points, setPoints] = useState(0);
    const [rank, setRank] = useState("Bronze");
    const [preferences, setPreferences] = useState({ news: true, podcasts: true, videos: true });
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setIsPremium(false);
        setPoints(0);
        setRank("Bronze");
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let unsubscribeProfile = () => { };

        if (user) {
            setLoading(true);
            const userRef = doc(db, "users", user.uid);

            unsubscribeProfile = onSnapshot(userRef, (userSnap) => {
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setIsPremium(data?.is_premium === true);
                    setPoints(data?.points || 0);

                    // Logic for Rank
                    const p = data?.points || 0;
                    if (p > 5000) setRank("Platina");
                    else if (p > 2000) setRank("Ouro");
                    else if (p > 500) setRank("Prata");
                    else setRank("Bronze");

                    if (data?.preferences) setPreferences(data.preferences);

                    // Sync Photo from Auth if missing in Firestore or if it updated
                    if (user.photoURL && data.photoURL !== user.photoURL) {
                        setDoc(userRef, { photoURL: user.photoURL }, { merge: true });
                    }
                    if (user.displayName && data.displayName !== user.displayName) {
                        setDoc(userRef, { displayName: user.displayName }, { merge: true });
                    }

                } else {
                    // Create Profile if doesn't exist
                    const defaultPrefs = { news: true, podcasts: true, videos: true };
                    setDoc(userRef, {
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        is_premium: false,
                        points: 0,
                        created_at: new Date().toISOString(),
                        preferences: defaultPrefs
                    });
                    setIsPremium(false);
                    setPoints(0);
                    setRank("Bronze");
                    setPreferences(defaultPrefs);
                }
                setLoading(false);
            }, (error) => {
                // Ignore permission errors during logout transitions
                if (error.code !== 'permission-denied') {
                    console.error("Error fetching profile:", error);
                }
                setLoading(false);
            });
        } else {
            setIsPremium(false);
            setPreferences({ news: true, podcasts: true, videos: true });
            // Loading is set to false in the auth listener for null user
        }

        return () => unsubscribeProfile();
    }, [user]);

    // Activity Points Heartbeat
    useEffect(() => {
        if (!user) return;

        const HEARTBEAT_SECONDS = 300; // 5 minutes
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                const userRef = doc(db, "users", user.uid);
                // We use increment logic here
                setDoc(userRef, {
                    points: (points + 5),
                    last_activity: new Date().toISOString()
                }, { merge: true });
            }
        }, HEARTBEAT_SECONDS * 1000);

        return () => clearInterval(interval);
    }, [user, points]);

    return (
        <AuthContext.Provider value={{ user, isPremium, points, rank, preferences, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
