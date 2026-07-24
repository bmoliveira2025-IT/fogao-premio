"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, limit, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure we have a client-side firebase init
import { RefreshCw } from 'lucide-react';

export default function AutoRefresh() {
    const router = useRouter();
    const [hasUpdate, setHasUpdate] = useState(false);
    const baselineRef = useRef<string | null>(null);

    useEffect(() => {
        // Listen for the absolute latest news item
        const q = query(collection(db, 'news'), orderBy('created_at', 'desc'), limit(1));
        let hideIndicatorTimeout: ReturnType<typeof setTimeout> | undefined;

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) return;

            // A abertura do app pode emitir primeiro o cache e depois o servidor.
            // O cache não deve ser tratado como uma atualização nova.
            if (snapshot.metadata.fromCache) {
                return;
            }

            const latestDocument = snapshot.docs[0];
            const currentVersion = `${latestDocument.id}:${JSON.stringify(latestDocument.data())}`;

            // The first server-confirmed result establishes the baseline.
            if (baselineRef.current === null) {
                baselineRef.current = currentVersion;
                return;
            }

            if (baselineRef.current === currentVersion) return;

            baselineRef.current = currentVersion;
            console.log("New content detected, refreshing...");
            setHasUpdate(true);
            router.refresh();

            clearTimeout(hideIndicatorTimeout);
            hideIndicatorTimeout = setTimeout(() => setHasUpdate(false), 3000);
        });

        return () => {
            unsubscribe();
            clearTimeout(hideIndicatorTimeout);
        };
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
