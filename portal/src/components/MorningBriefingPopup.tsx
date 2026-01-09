"use client";

import { useEffect, useState } from 'react';
import { X, Sunrise } from 'lucide-react';

interface DailyBriefing {
    date: string;
    general_summary: string;
}

export default function MorningBriefingPopup() {
    const [isOpen, setIsOpen] = useState(false);
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
            // 1. Check LocalStorage
            const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
            const lastSeen = localStorage.getItem('seenMorningBriefing');

            if (lastSeen === today) {
                return; // Already seen today
            }

            try {
                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.general_summary) {
                        setBriefing(data);
                        setIsOpen(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching briefing for popup:", error);
            }
        };

        checkAndFetch();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        const today = new Date().toLocaleDateString('en-CA');
        localStorage.setItem('seenMorningBriefing', today);
    };

    if (!isOpen || !briefing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-premium-gold/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-zinc-900 to-black p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-premium-gold/10 rounded-full">
                            <Sunrise className="text-premium-gold" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">Destaques de Ontem</h3>
                            <p className="text-xs text-white/50 mt-1">Resumo diário do Fogão Prêmio</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-base text-white/90 leading-relaxed font-medium border-l-2 border-premium-gold pl-4">
                        {formatPremiumText(briefing.general_summary)}
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-black/40 p-4 border-t border-white/5 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-premium-gold text-black font-bold rounded-lg hover:bg-premium-gold/90 transition-colors text-sm"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}
