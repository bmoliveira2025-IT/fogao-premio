"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TopStory {
    rank: number;
    title: string;
    category: string;
    image?: string;
}

interface DailyBriefing {
    date: string;
    general_summary: string;
    top_stories: TopStory[];
}

export default function DailyBriefingWidget() {
    const { isPremium } = useAuth();
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                // Fetch from our server-side API proxy to avoid client-side permission issues
                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setBriefing(data as DailyBriefing);
                    }
                }
            } catch (error) {
                console.error("Error fetching daily briefing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBriefing();
    }, []);

    if (loading) return null; // Or a skeleton
    if (!briefing) return null;

    // Content for Premium Users
    if (isPremium) {
        const topStory = briefing.top_stories.find(s => s.rank === 1);
        const otherStories = briefing.top_stories.filter(s => s.rank !== 1).sort((a, b) => a.rank - b.rank);

        return (
            <div className="mb-8 w-full">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <FileText className="text-premium-gold" size={20} />
                        Resumo do Dia
                    </h2>
                    <span className="text-xs text-premium-gold/80 bg-premium-gold/10 px-3 py-1 rounded-full border border-premium-gold/20 font-bold uppercase tracking-wider">
                        Premium
                    </span>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Rank 01 - Hero */}
                    {topStory && (
                        <div className="relative h-64 w-full group overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/30" />
                            {topStory.image && (
                                <img
                                    src={topStory.image}
                                    alt={topStory.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        // Fallback if image fails
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}

                            <div className="relative z-20 h-full flex flex-col justify-between p-6">
                                <span className="text-6xl font-display font-black text-white/90 drop-shadow-lg opacity-90">
                                    01
                                </span>
                                <div>
                                    <span className="text-xs font-bold text-premium-gold uppercase tracking-widest mb-2 block drop-shadow-md">
                                        {topStory.category}
                                    </span>
                                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-lg max-w-xl">
                                        {topStory.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 02 & 03 - List */}
                    <div className="divide-y divide-white/5 bg-zinc-900/50 backdrop-blur-sm">
                        {otherStories.map((story) => (
                            <div key={story.rank} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                <span className="text-3xl font-display font-black text-white/20 group-hover:text-premium-gold/40 transition-colors">
                                    0{story.rank}
                                </span>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">
                                        {story.title}
                                    </h4>
                                    <span className="text-[10px] text-white/40 uppercase tracking-wide mt-1 block">
                                        {story.category}
                                    </span>
                                </div>
                                <ChevronRight size={16} className="text-white/20 group-hover:text-premium-gold transition-colors" />
                            </div>
                        ))}
                    </div>

                    {/* General Summary Footer */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <p className="text-xs text-white/60 leading-relaxed italic">
                            "{briefing.general_summary}"
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Blurred Content for Free Users
    return (
        <div className="mb-8 w-full relative">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <FileText className="text-white/50" size={20} />
                    Resumo do Dia
                </h2>
                <Lock size={16} className="text-premium-gold" />
            </div>

            <div className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 h-64">
                {/* Fake Blurred Content */}
                <div className="absolute inset-0 blur-md opacity-30 pointer-events-none">
                    <div className="h-2/3 bg-zinc-800 w-full" />
                    <div className="h-1/3 bg-zinc-900 w-full" />
                </div>

                {/* Overlay CTA */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black/90 to-black/40">
                    <div className="w-12 h-12 rounded-full bg-premium-gold/20 flex items-center justify-center mb-3">
                        <Lock className="text-premium-gold" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                        Resumo Exclusivo
                    </h3>
                    <p className="text-sm text-white/60 mb-4 max-w-xs">
                        Comece o dia sabendo tudo o que importa. Assine o Premium para liberar o Resumo do Dia.
                    </p>
                    <Link href="/premium">
                        <button className="bg-premium-gold text-black font-bold uppercase text-xs py-2.5 px-6 rounded-lg hover:brightness-110 transition-all">
                            Desbloquear Agora
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
