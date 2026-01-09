"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Lock, ChevronRight, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
    summary?: string;
}

interface PremiumWidgetProps {
    news: NewsItem[];
    className?: string;
}

export default function PremiumWidget({ news, className }: PremiumWidgetProps) {
    const { isPremium } = useAuth();

    return (
        <section className={cn(
            "relative overflow-hidden rounded-none md:rounded-2xl border-y md:border border-premium-gold/30 dark:border-premium-gold/20 bg-card shadow-2xl group/widget -mx-4 md:mx-0",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-premium-gold/5 dark:from-black/40 dark:to-premium-gold/10" />

            {/* Header */}
            <div className="relative p-3 pb-1 lg:p-5 lg:pb-2 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2 lg:space-x-2.5">
                    <div className="p-1 lg:p-1.5 rounded-full bg-gradient-to-br from-premium-gold to-yellow-600 shadow-lg shadow-premium-gold/20">
                        <Star className="text-white fill-white lg:w-3 lg:h-3" size={10} />
                    </div>
                    <span className="text-[10px] lg:text-xs font-black text-foreground uppercase tracking-[0.2em] drop-shadow-sm">
                        Conteúdo <span className="text-premium-gold">Premium</span>
                    </span>
                </div>

                {/* Visual Indicator of swipe (mobile) */}
                <div className="lg:hidden flex gap-1">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full bg-premium-gold/30 first:bg-premium-gold" />
                    ))}
                </div>
            </div>

            {/* Content - Carousel */}
            <div className="relative z-10">
                {news.length > 0 ? (
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-3 px-3 lg:px-5 gap-3 lg:grid lg:grid-cols-1 lg:gap-4 lg:overflow-visible">
                        {news.map((item, index) => (
                            <Link
                                key={item.id}
                                href={`/news/${item.id}`}
                                className="block min-w-[85%] lg:min-w-0 flex-shrink-0 snap-center"
                            >
                                <div className="group relative h-40 lg:h-20 overflow-hidden rounded-xl border border-white/5 bg-black/40 hover:border-premium-gold/50 transition-all duration-500">
                                    {/* Background Image (Full for mobile carousel feel) */}
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 1024px) 85vw, 33vw"
                                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-900" />
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end lg:flex-row lg:items-center lg:justify-between">
                                        <div className="max-w-[90%]">
                                            <span className="inline-block px-1.5 py-0.5 mb-2 rounded bg-premium-gold/20 backdrop-blur-md border border-premium-gold/30 text-[8px] font-bold text-premium-gold uppercase tracking-wider">
                                                Exclusivo
                                            </span>
                                            <h4 className="text-sm font-bold leading-tight text-white group-hover:text-premium-gold transition-colors line-clamp-2 drop-shadow-lg">
                                                {item.title}
                                            </h4>
                                        </div>

                                        <div className="hidden lg:flex shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 items-center justify-center group-hover:bg-premium-gold group-hover:text-black transition-all">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>

                                    {/* Mobile Lock Icon watermark - Show only if NOT premium */}
                                    {!isPremium && (
                                        <div className="absolute top-2 right-2 text-white/10 lg:hidden">
                                            <Lock size={16} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="inline-block p-2 rounded-full bg-premium-gold/10 mb-2 animate-pulse">
                            <Star className="text-premium-gold/50" size={16} />
                        </div>
                        <p className="text-[10px] text-foreground/50">Carregando...</p>
                    </div>
                )}
            </div>

            {/* Footer / CTA */}
            <div className="relative p-3 lg:p-4 border-t border-white/5 bg-white/5 backdrop-blur-sm">
                <Link href={isPremium ? "/premium" : "/premium"} className="group block">
                    {isPremium ? (
                        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-premium-gold to-yellow-600 text-black text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2">
                            <Unlock size={12} className="text-black/70" />
                            <span>Acesso Liberado</span>
                        </button>
                    ) : (
                        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-premium-gold to-yellow-600 text-black text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2">
                            <Lock size={12} className="text-black/70" />
                            <span>Desbloquear Acesso</span>
                        </button>
                    )}
                </Link>
            </div>
        </section>
    );
}
