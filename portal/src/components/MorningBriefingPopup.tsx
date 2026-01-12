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
    date: string;
    general_summary: string;
    top_stories?: TopStory[];
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
                    if (data && data.general_summary) {
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
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-zinc-900 to-black hover:bg-white/5 transition-colors"
                    onClick={toggleExpand}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-premium-gold/10 rounded-full">
                            <Sunrise className="text-premium-gold" size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white leading-none">Resumo do Dia</h3>
                            <p className="text-[10px] text-white/50 mt-0.5">
                                {isExpanded ? 'Destaques diários do Fogão Prêmio' : 'Toque para expandir'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                            className="p-1.5 text-white/40 hover:text-premium-gold transition-colors"
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <div className="w-px h-6 bg-white/10" />
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                            className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content - Collapsible */}
                {isExpanded && (
                    <div className="p-4 pt-0 border-t border-white/5 bg-black/20 animate-in slide-in-from-top-1 duration-300">
                        <p className="text-sm text-white/90 leading-relaxed font-medium mt-3 border-l-2 border-premium-gold pl-3 mb-4">
                            {formatPremiumText(briefing.general_summary)}
                        </p>

                        {/* Top Top Story - Hero (Rank 01) */}
                        {briefing.top_stories && briefing.top_stories.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {(() => {
                                    // Separate Rank 1 from the rest
                                    const mainStory = briefing.top_stories.find(s => s.rank === 1) || briefing.top_stories[0];
                                    const otherStories = briefing.top_stories.filter(s => s !== mainStory).slice(0, 4); // Show max 4 others

                                    return (
                                        <>
                                            {/* Hero Image Card */}
                                            {mainStory && (
                                                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-white/10 bg-black shadow-lg">
                                                    {mainStory.image ? (
                                                        <img
                                                            src={mainStory.image}
                                                            alt={mainStory.title}
                                                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                                            <FileText className="text-white/20" size={32} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                                    <div className="absolute bottom-0 inset-x-0 p-3">
                                                        {mainStory.category && (
                                                            <span className="inline-block px-1.5 py-0.5 bg-premium-gold/90 text-black text-[9px] font-black uppercase tracking-wider rounded-sm mb-1.5">
                                                                Destaque
                                                            </span>
                                                        )}
                                                        <h4 className="text-sm md:text-base font-bold text-white leading-tight drop-shadow-md">
                                                            {mainStory.title}
                                                        </h4>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Compact List for Others */}
                                            {otherStories.length > 0 && (
                                                <div className="flex flex-col gap-3 mt-2">
                                                    {otherStories.map((story, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="text-3xl font-display font-black text-premium-gold leading-none">
                                                                0{story.rank || idx + 2}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                {story.category && (
                                                                    <span className="text-[9px] font-bold text-premium-gold/60 uppercase tracking-widest block mb-1">
                                                                        {story.category}
                                                                    </span>
                                                                )}
                                                                <h5 className="text-sm font-bold text-white leading-tight line-clamp-2">
                                                                    {story.title}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
