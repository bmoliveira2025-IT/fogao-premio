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
        <div className="prose dark:prose-invert prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6 prose-headings:text-foreground prose-a:text-premium-gold prose-strong:text-premium-gold prose-strong:font-bold font-light relative">

            {/* Intro */}
            {introParams.map((p, i) => (
                <div key={i} className="mb-6">
                    <p
                        style={{ fontSize: 'calc(22px * var(--font-scale, 1))' }}
                        className={`transition-all duration-500 ease-in-out leading-[1.8] text-zinc-100/90 font-sans tracking-wide
                        ${i === 0 ? 'first-letter:text-5xl first-letter:font-black first-letter:text-premium-gold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]' : ''}
                        ${activeParagraphIndex === i ? 'bg-premium-gold/10 text-white border-l-4 border-premium-gold shadow-md pl-4 py-2 -ml-4 rounded-r-xl' : ''}`}
                        dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-premium-gold font-bold">$1</strong>').replace(/__(.*?)__/g, '<u>$1</u>').replace(/Botafogo/g, '<strong class="text-premium-gold font-bold">Botafogo</strong>') }}
                    />
                </div>
            ))}

            {/* Lock or Content */}
            {showLock ? (
                <PremiumLockOverlay />
            ) : (
                <>
                    {remainingParams.map((p, i) => {
                        const actualIndex = i + 3;
                        return (
                            <div key={`rem-${i}`} className="mb-6">
                                <p
                                    style={{ fontSize: 'calc(22px * var(--font-scale, 1))' }}
                                    className={`transition-all duration-500 ease-in-out leading-[1.8] text-zinc-300/90 font-sans tracking-wide
                                    ${activeParagraphIndex === actualIndex ? 'bg-premium-gold/10 text-white border-l-4 border-premium-gold shadow-md pl-4 py-2 -ml-4 rounded-r-xl' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-premium-gold font-bold">$1</strong>').replace(/__(.*?)__/g, '<u>$1</u>').replace(/Botafogo/g, '<strong class="text-premium-gold font-bold">Botafogo</strong>') }}
                                />
                            </div>
                        );
                    })}

                    {/* Footer Insert */}

                </>
            )}
        </div>
    );
}
