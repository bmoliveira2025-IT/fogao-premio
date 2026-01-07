"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NewsCard from '@/components/NewsCard';
import TabBar from '@/components/TabBar';
import MatchWidget from '@/components/MatchWidget';

export default function HomePage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'news'),
            orderBy('created_at', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNews(newsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <main className="min-h-screen bg-premium-black text-white px-4 pt-8 pb-24">
            <header className="max-w-2xl mx-auto mb-10 text-center">
                <h1 className="text-4xl md:text-5xl uppercase italic mb-2 tracking-tighter">
                    Fogão <span className="gold-text">Prêmio</span>
                </h1>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                    Inteligência Alvinegra • Notícias Premium
                </p>
            </header>

            <MatchWidget />

            <div className="max-w-2xl mx-auto">
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-64 rounded-2xl animate-pulse opacity-50" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {news.map((item) => (
                            <NewsCard key={item.id} article={item} />
                        ))}
                    </div>
                )}
            </div>

            <TabBar />
        </main>
    );
}
