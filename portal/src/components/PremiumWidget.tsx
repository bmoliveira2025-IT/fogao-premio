import Link from 'next/link';
import Image from 'next/image';
import { Star, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    return (
        <section className={cn(
            "relative overflow-hidden rounded-2xl border border-premium-gold/30 dark:border-premium-gold/20 bg-card shadow-2xl group/widget",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-premium-gold/5 dark:from-black/40 dark:to-premium-gold/10" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-premium-gold/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

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
            </div>

            {/* Content */}
            <div className="relative p-3 pt-1 lg:p-5 lg:pt-3 space-y-2 lg:space-y-4 z-10">
                {news.length > 0 ? (
                    news.map((item, index) => (
                        <Link key={item.id} href={`/news/${item.id}`} className="block">
                            <div
                                className="group relative overflow-hidden rounded-lg lg:rounded-xl border border-white/5 dark:border-white/5 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 hover:border-premium-gold/30 transition-all duration-500 ease-out"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/0 via-premium-gold/0 to-premium-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex p-2 gap-2 lg:p-3 lg:gap-3">
                                    {/* Image */}
                                    <div className="w-16 h-12 lg:w-24 lg:h-16 shrink-0 relative rounded-md lg:rounded-lg overflow-hidden shadow-sm border border-black/5 dark:border-white/5 group-hover:border-premium-gold/30 transition-colors">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 64px, 96px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-premium-gold/10 flex items-center justify-center">
                                                <Star size={12} className="text-premium-gold/40 lg:w-4 lg:h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <h4 className="text-xs lg:text-[13px] font-bold leading-tight text-foreground/90 group-hover:text-premium-gold transition-colors line-clamp-2 font-display">
                                            {item.title}
                                        </h4>
                                        <div className="hidden lg:flex items-center mt-2 space-x-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                                            <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider">Ler Agora</span>
                                            <ChevronRight size={10} className="text-premium-gold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-6 lg:py-8">
                        <div className="inline-block p-2 lg:p-3 rounded-full bg-premium-gold/10 mb-2 animate-pulse">
                            <Star className="text-premium-gold/50 lg:w-5 lg:h-5" size={16} />
                        </div>
                        <p className="text-[10px] lg:text-xs text-foreground/50 font-medium">Carregando exclusividades...</p>
                    </div>
                )}
            </div>

            {/* Footer / CTA */}
            <div className="relative p-3 lg:p-4 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                <Link href="/premium" className="group block">
                    <button className="w-full py-2 lg:py-2.5 rounded-lg bg-gradient-to-r from-premium-gold to-yellow-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2">
                        <Lock size={10} className="text-white/80" />
                        <span>Desbloquear Acesso</span>
                    </button>
                </Link>
            </div>
        </section >
    );
}
