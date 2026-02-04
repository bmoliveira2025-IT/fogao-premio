'use client';

import Link from 'next/link';
import { Lock, ChevronRight, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_premium?: boolean;
}

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

export default function PremiumWidget({ news, className }: { news: NewsItem[], className?: string }) {
    if (!news || news.length === 0) return null;

    // We assume the top one is the featured premium story
    const featured = news[0];
    const others = news.slice(1, 4);

    return (
        <section className={cn(
            "relative overflow-hidden rounded-none md:rounded-2xl border-y md:border border-premium-gold/10 bg-card shadow-2xl group/widget w-[calc(100%+2rem)] -ml-4 md:w-auto md:ml-0 md:mx-0",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-premium-gold/5 dark:from-black/40 dark:to-premium-gold/5" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-premium-gold/5 bg-gradient-to-r from-premium-gold/5 to-transparent">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-premium-gold text-black shadow-lg shadow-premium-gold/20">
                        <Crown size={14} fill="currentColor" />
                    </div>
                    <span className="text-[13px] font-black text-premium-gold uppercase tracking-widest drop-shadow-sm">
                        Conteúdo Premium
                    </span>
                </div>
                <Link href="/premium" className="group flex items-center gap-1 text-[11px] font-bold text-premium-gold/60 hover:text-premium-gold transition-colors uppercase tracking-wider">
                    Ver Todos
                    <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Featured Article */}
            <Link href={`/news/${featured.id}`} className="block group relative aspect-[16/9] overflow-hidden">
                <img
                    src={featured.image || "https://images.unsplash.com/photo-1556968037-33d7b80c3260?q=80&w=1000&auto=format&fit=crop"}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 rounded-full bg-black/60 border border-premium-gold/30 flex items-center justify-center backdrop-blur-md shadow-lg">
                            <Lock size={14} className="text-premium-gold" />
                        </div>
                    </div>
                    <h2 className="text-[21px] font-extrabold text-white drop-shadow-lg mb-2 normal-case">
                        {toSentenceCase(featured.title)}
                    </h2>
                    <p className="text-[13px] text-zinc-300 drop-shadow-md">
                        {featured.summary || "Análise tática exclusiva, bastidores e entrevistas especiais para assinantes."}
                    </p>
                </div>
            </Link>

            {/* Other Premium Articles */}
            <div className="p-4 pt-0">
                <h3 className="text-[13px] font-bold text-premium-gold uppercase tracking-widest mb-4 mt-6 flex items-center gap-2 relative z-10">
                    <div className="w-1 h-4 bg-premium-gold rounded-full shadow-[0_0_10px_#D4AF37]" />
                    Conteúdo Premium
                </h3>

                <div className="space-y-4 relative z-10">
                    {others.map(item => (
                        <Link
                            key={item.id}
                            href={`/news/${item.id}`}
                            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border hover:bg-white/10 hover:border-premium-gold/30 transition-all group/item"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            <div className="relative w-16 h-12 rounded bg-zinc-900 overflow-hidden shrink-0 border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                {/* Mini Lock for List Items */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Lock size={10} className="text-premium-gold/80" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-[13px] font-bold text-zinc-300 group-hover:text-white transition-colors normal-case">
                                    {toSentenceCase(item.title)}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </section>
    );
}
