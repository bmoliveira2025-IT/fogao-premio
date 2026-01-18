"use client";

import { useEffect, useState } from 'react';
import { Zap, PlayCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DailyBriefing {
    date: string;
    editorial_summary?: string;
    general_summary?: string;
    edition?: string;
    generated_at_formatted?: string;
}

export default function DailyBriefingWidget() {
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                const res = await fetch('/api/daily-briefing');
                if (res.ok) {
                    const data = await res.json();
                    setBriefing(data);
                }
            } catch (e) {
                console.error("Failed to fetch briefing widget data", e);
            } finally {
                setLoading(false);
            }
        };

        fetchBriefing();
    }, []);

    if (loading) return null; // Or a skeleton
    if (!briefing) return null;

    // Helper to extract time or use edition
    const getBriefingTime = () => {
        if (briefing.generated_at_formatted) {
            const parts = briefing.generated_at_formatted.split('às');
            if (parts.length > 1) return parts[1].trim();
        }
        return briefing.edition || '24h';
    };

    return (
        <Link
            href="?briefing=true"
            scroll={false}
            className="block group"
        >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-white/5 p-5 shadow-xl hover:shadow-premium-gold/10 transition-all duration-300">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={100} className="text-premium-gold rotate-12" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 group-hover:scale-110 transition-transform">
                            <Zap size={24} className="text-premium-gold fill-premium-gold/20 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                                    Disponível
                                </span>
                                <span className="text-zinc-400 text-[11px] font-medium">
                                    {briefing.generated_at_formatted || 'Hoje'}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none group-hover:text-premium-gold transition-colors">
                                Resumo do Dia
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium mt-1">
                                Fique por dentro de tudo em 1 minuto
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                        <PlayCircle size={16} className="text-premium-gold" />
                        <span className="text-xs font-bold text-white uppercase tracking-wide">
                            Assistir
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
