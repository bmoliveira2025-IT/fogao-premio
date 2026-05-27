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
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-900 font-semibold">$1</strong>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/Botafogo/g, '<strong class="text-zinc-900 font-semibold">Botafogo</strong>');
    };

    return (
        <div className="article-body relative">
            {/* Intro paragraphs */}
            {introParams.map((p, i) => (
                <div key={i} className="mb-5">
                    <p
                        style={{ fontSize: 'calc(16px * var(--font-scale, 1))' }}
                        className={`
                            text-zinc-600 leading-[1.8] font-normal tracking-[0.01em] transition-all duration-300
                            ${i === 0 ? 'text-[18px] md:text-[20px] text-zinc-500 font-medium' : ''}
                            ${activeParagraphIndex === i ? 'bg-blue-50 border-l-2 border-blue-500 pl-4 py-2 -ml-4 rounded-r-lg' : ''}
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
                                    <blockquote className="my-8 py-2 px-5 border-l-[3px] border-[#4285F4]">
                                        <p className="text-[15px] md:text-[17px] font-medium italic leading-[1.6] text-zinc-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                            "{p.slice(0, Math.min(p.indexOf('.', 50) + 1 || 120, 150))}"
                                        </p>
                                    </blockquote>
                                )}

                                <div className="mb-5">
                                    <p
                                        style={{ fontSize: 'calc(16px * var(--font-scale, 1))' }}
                                        className={`
                                            text-zinc-600 leading-[1.8] font-normal tracking-[0.01em] transition-all duration-300
                                            ${activeParagraphIndex === actualIndex ? 'bg-blue-50 border-l-2 border-blue-500 pl-4 py-2 -ml-4 rounded-r-lg' : ''}
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
