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

    const formatParagraph = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-900 font-bold">$1</strong>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/\b(Botafogo|Glorioso|Fogão)\b/g, '<strong class="text-zinc-900 font-bold">$1</strong>');
    };

    return (
        <div className="article-body relative">
            {/* Intro paragraphs */}
            {introParams.map((p, i) => (
                <div key={i} className="mb-5 md:mb-6">
                    <p
                        style={{ fontSize: 'calc(17px * var(--font-scale, 1))' }}
                        className={`
                            text-zinc-800 leading-[1.8] font-normal tracking-[0.01em] transition-all duration-300
                            ${i === 0 ? 'text-[18px] md:text-[21px] text-zinc-900 font-medium leading-[1.75]' : ''}
                            ${activeParagraphIndex === i ? 'bg-amber-500/10 border-l-4 border-amber-500 pl-4 py-2 -ml-4 rounded-r-xl' : ''}
                        `}
                        dangerouslySetInnerHTML={{ __html: formatParagraph(p) }}
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

                        // Add a pull-quote every ~4 paragraphs for editorial feel
                        const showPullQuote = i > 0 && i % 4 === 0 && p.length > 80;

                        return (
                            <div key={`rem-${i}`}>
                                {showPullQuote && (
                                    <blockquote className="my-8 py-3 px-6 border-l-[4px] border-amber-500 bg-amber-500/5 rounded-r-2xl">
                                        <p className="text-[16px] md:text-[18px] font-semibold italic leading-[1.6] text-zinc-900">
                                            "{p.slice(0, Math.min(p.indexOf('.', 50) + 1 || 120, 150))}"
                                        </p>
                                    </blockquote>
                                )}

                                <div className="mb-5 md:mb-6">
                                    <p
                                        style={{ fontSize: 'calc(17px * var(--font-scale, 1))' }}
                                        className={`
                                            text-zinc-800 leading-[1.8] font-normal tracking-[0.01em] transition-all duration-300
                                            ${activeParagraphIndex === actualIndex ? 'bg-amber-500/10 border-l-4 border-amber-500 pl-4 py-2 -ml-4 rounded-r-xl' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: formatParagraph(p) }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

