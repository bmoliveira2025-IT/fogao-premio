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
                <p
                    key={i}
                    className={`transition-all duration-500 ease-in-out px-4 py-2 -mx-4 rounded-xl ${activeParagraphIndex === i ? 'bg-premium-gold/10 text-foreground border-l-4 border-premium-gold shadow-md translate-x-1' : ''}`}
                    dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} // Simple markdown parser fallback if content comes raw, though usually paragraphs are plain text.
                // Wait, the content is likely "raw text" but might contain markdown **bold**.
                // If the backend cleans it, it might still have **.
                // Let's assume the scraper AI returns Markdown.
                // If 'paragraphs' is an array of strings split by newline, they might contain **text**.
                // React renders string as text. I need to parse it or use a markdown renderer.
                // For this simple case, I'll stick to rendering text, but IF I want to color BOLD, I need to parse.
                // The prompt says: "use Markdown basic (paragraphs, bold)".
                // The current ArticleReader takes `paragraphs: string[]`.
                // I will add a simple parser: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                // and use dangerouslySetInnerHTML safely since I trust my backend AI.
                />
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
                                dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                            />
                        );
                    })}

                    {/* Footer Insert */}

                </>
            )}
        </div>
    );
}
