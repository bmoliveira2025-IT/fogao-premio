"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import PremiumLockOverlay from '@/components/PremiumLockOverlay';

interface ArticleReaderProps {
    paragraphs: string[];
    isPremium: boolean;
    activeParagraphIndex?: number;
}

export default function ArticleReader({ paragraphs, isPremium, activeParagraphIndex = -1 }: ArticleReaderProps) {
    const [user, setUser] = useState<any>(undefined); // undefined = loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 1. Initial 3 paragraphs always shown
    const introParams = paragraphs.slice(0, 3);
    const remainingParams = paragraphs.slice(3);

    // 2. Logic: Show lock if Premium AND (Loading OR Not Logged In)
    const showLock = isPremium && (!user || loading);

    return (
        <div className="prose dark:prose-invert prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6 prose-headings:text-foreground prose-a:text-premium-gold font-light relative">

            {/* Intro */}
            {introParams.map((p, i) => (
                <p
                    key={i}
                    className={`transition-all duration-500 ease-in-out px-4 py-2 -mx-4 rounded-xl ${activeParagraphIndex === i ? 'bg-premium-gold/10 text-foreground border-l-4 border-premium-gold shadow-md translate-x-1' : ''}`}
                >
                    {p}
                </p>
            ))}

            {/* Lock or Content */}
            {showLock ? (
                <PremiumLockOverlay />
            ) : (
                <>
                    {remainingParams.map((p, i) => {
                        const actualIndex = i + 3;
                        return (
                            <p
                                key={`rem-${i}`}
                                className={`transition-all duration-500 ease-in-out px-4 py-2 -mx-4 rounded-xl ${activeParagraphIndex === actualIndex ? 'bg-premium-gold/10 text-foreground border-l-4 border-premium-gold shadow-md translate-x-1' : ''}`}
                            >
                                {p}
                            </p>
                        );
                    })}

                    {/* Footer Insert */}
                    <div className="my-8 p-6 bg-card border-l-2 border-premium-gold rounded-r-xl shadow-lg">
                        <p className="text-lg font-display font-medium text-foreground italic mb-2">
                            "O Botafogo vive um momento único em sua história, unindo tradição e modernidade."
                        </p>
                        <span className="text-xs font-bold text-premium-gold uppercase tracking-widest">— John Textor</span>
                    </div>
                </>
            )}
        </div>
    );
}
