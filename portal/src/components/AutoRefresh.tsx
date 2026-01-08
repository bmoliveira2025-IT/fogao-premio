"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, limit, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure we have a client-side firebase init
import { RefreshCw } from 'lucide-react';

export default function AutoRefresh() {
    const router = useRouter();
    const [hasUpdate, setHasUpdate] = useState(false);

    useEffect(() => {
        // Listen for the absolute latest news item
        const q = query(collection(db, 'news'), orderBy('created_at', 'desc'), limit(1));

        let initialLoad = true;

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Skip the first event which is the current state
            if (initialLoad) {
                initialLoad = false;
                return;
            }

            if (!snapshot.empty) {
                const changes = snapshot.docChanges();
                // If there is a new addition or modification
                if (changes.some(change => change.type === 'added' || change.type === 'modified')) {
                    console.log("New content detected, refreshing...");
                    setHasUpdate(true);

                    // Trigger a server component refresh
                    router.refresh();

                    // Reset the indicator after a moment
                    setTimeout(() => setHasUpdate(false), 3000);
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!hasUpdate) return null;

    // Optional: Show a visual indicator that a refresh is happening
    return (
        <div className="fixed top-4 right-4 z-50 bg-premium-gold/90 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Atualizando...</span>
        </div>
    );
}
