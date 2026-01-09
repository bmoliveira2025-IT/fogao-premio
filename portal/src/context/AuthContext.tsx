"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    isPremium: boolean;
    preferences: { news: boolean; podcasts: boolean; videos: boolean };
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isPremium: false,
    preferences: { news: true, podcasts: true, videos: true },
    loading: true,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [preferences, setPreferences] = useState({ news: true, podcasts: true, videos: true });
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setIsPremium(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);

                // Check User Profile in Firestore
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setIsPremium(data?.is_premium === true);
                    if (data?.preferences) setPreferences(data.preferences);
                } else {
                    // Create Profile if doesn't exist
                    const defaultPrefs = { news: true, podcasts: true, videos: true }; // Default Podcasts to TRUE for new users
                    await setDoc(userRef, {
                        email: currentUser.email,
                        is_premium: false,
                        preferences: defaultPrefs,
                        created_at: new Date().toISOString()
                    });
                    setIsPremium(false);
                    setPreferences(defaultPrefs);
                }
            } else {
                setUser(null);
                setIsPremium(false);
                setPreferences({ news: true, podcasts: true, videos: true }); // Guest defaults
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isPremium, preferences, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
