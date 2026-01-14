"use client";

import { useEffect, useState } from 'react';
import { X, Sunrise, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface TopStory {
    rank: number;
    title: string;
    image?: string | null;
    category?: string;
    id?: string;
}

interface DailyBriefing {
    general_summary?: string;
    editorial_summary?: string;
    reading_time?: string;
    indicators?: {
        next_match?: string;
        location?: string;
        dm?: string;
        market?: string;
    };
    top_stories?: TopStory[];
    generated_at_formatted?: string;
}

export default function MorningBriefingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const formatPremiumText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2);
                return (
                    <span key={index} className="font-bold text-premium-gold mx-0.5">
                        {content}
                    </span>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        const checkAndFetch = async () => {
            const today = new Date().toLocaleDateString('en-CA');
            const lastSeen = localStorage.getItem('seenMorningBriefing');
            const forceOpen = searchParams.get('briefing') === 'true';

            // Fetch if needed (force open OR not seen today)
            // Ideally we fetch anyway to check if available, but let's optimize
            // Actually, we need to fetch to know if we SHOULD show it.

            try {
                // Determine if we should show based on local logic BEFORE fetch? 
                // No, we need data first.
                // But we can skip fetch if not forceOpen AND saw today.
                if (!forceOpen && lastSeen === today) {
                    return;
                }

                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data && (data.general_summary || data.editorial_summary)) {
                        setBriefing(data);

                        if (forceOpen || lastSeen !== today) {
                            setIsVisible(true);
                            if (forceOpen) setIsExpanded(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching briefing for popup:", error);
            }
        };

        checkAndFetch();
    }, [searchParams]); // Re-run if params change

    const handleDismiss = () => {
        setIsVisible(false);
        const today = new Date().toLocaleDateString('en-CA');
        localStorage.setItem('seenMorningBriefing', today);

        // Remove query param if present
        if (searchParams.get('briefing') === 'true') {
            router.replace(pathname, { scroll: false });
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (!isVisible || !briefing) return null;

    return (
        <div className="fixed top-20 lg:top-24 left-0 right-0 z-40 px-2 md:px-0 flex justify-center pointer-events-none">
            <div className="w-full max-w-4xl bg-zinc-900/95 backdrop-blur-md border border-premium-gold/30 shadow-2xl rounded-xl overflow-hidden pointer-events-auto animate-in slide-in-from-top-2 duration-500">
                {/* Header - Premium */}
                <div
                    className="flex flex-col gap-1 p-5 pb-3 cursor-pointer bg-zinc-900 border-b border-white/5"
                    onClick={toggleExpand}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-premium-gold/10 rounded-lg">
                                <Sunrise className="text-premium-gold" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-display font-bold text-white leading-tight">
                                    Resumo do Dia <span className="text-white/30 font-light mx-2">|</span> Botafogo
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-white/50 font-medium">
                                        📅 {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                    </span>
                                    {briefing.reading_time && (
                                        <span className="text-xs text-premium-gold/70 font-medium flex items-center gap-1">
                                            ⏱ {briefing.reading_time}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                                className="p-2 text-white/30 hover:text-white transition-colors"
                            >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                                className="p-2 text-white/30 hover:text-red-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content - Collapsible */}
                {isExpanded && (
                    <div className="p-6 bg-zinc-950/50 animate-in slide-in-from-top-1 duration-300">
                        {/* 2. Editorial Summary */}
                        <div className="mb-6">
                            <p className="text-[15px] md:text-base text-white/80 leading-relaxed font-serif tracking-wide text-justify">
                                {briefing.editorial_summary || briefing.general_summary}
                            </p>
                        </div>

                        {/* 3. Indicators (Chips) */}
                        {briefing.indicators && (
                            <div className="flex flex-wrap gap-2 md:gap-3 mb-2">
                                {/* Next Match */}
                                {briefing.indicators.next_match && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full">
                                        <span className="text-xs text-white/40 font-bold uppercase">⚽ Próximo:</span>
                                        <span className="text-xs text-white font-medium">{briefing.indicators.next_match}</span>
                                    </div>
                                )}
                                {/* Location */}
                                {briefing.indicators.location && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full">
                                        <span className="text-xs text-white/40 font-bold uppercase">🏟 Local:</span>
                                        <span className="text-xs text-white font-medium">{briefing.indicators.location}</span>
                                    </div>
                                )}
                                {/* DM */}
                                {briefing.indicators.dm && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full">
                                        <span className="text-xs text-white/40 font-bold uppercase">🩺 DM:</span>
                                        <span className="text-xs text-red-300/90 font-medium">{briefing.indicators.dm}</span>
                                    </div>
                                )}
                                {/* Market */}
                                {briefing.indicators.market && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full">
                                        <span className="text-xs text-white/40 font-bold uppercase">🔁 Mercado:</span>
                                        <span className="text-xs text-emerald-300/90 font-medium">{briefing.indicators.market}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Optional: Generated At Footer */}
                        {briefing.generated_at_formatted && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                <span className="text-[10px] text-white/20">
                                    Gerado às {briefing.generated_at_formatted}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
