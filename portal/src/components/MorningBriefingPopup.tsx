"use client";

import { useEffect, useState } from 'react';
import { X, Sunrise, ChevronDown, ChevronUp } from 'lucide-react';

interface DailyBriefing {
    date: string;
    general_summary: string;
}

export default function MorningBriefingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);

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

            if (lastSeen === today) {
                return;
            }

            try {
                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.general_summary) {
                        setBriefing(data);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching briefing for popup:", error);
            }
        };

        checkAndFetch();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        const today = new Date().toLocaleDateString('en-CA');
        localStorage.setItem('seenMorningBriefing', today);
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
                            <h3 className="text-sm font-bold text-white leading-none">Destaques de Ontem</h3>
                            <p className="text-[10px] text-white/50 mt-0.5">
                                {isExpanded ? 'Resumo diário do Fogão Prêmio' : 'Toque para expandir'}
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
                        <p className="text-sm text-white/90 leading-relaxed font-medium mt-3 border-l-2 border-premium-gold pl-3">
                            {formatPremiumText(briefing.general_summary)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
