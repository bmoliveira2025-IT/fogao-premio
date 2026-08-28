"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Tag } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    content?: string;
    summary?: string;
    created_at: string;
}

function estimateReadTime(content?: string, summary?: string): number {
    const text = content || summary || '';
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
}

interface HomeNewsCardProps {
    article: NewsItem;
    index: number;
    isWide?: boolean;
}

export default function HomeNewsCard({ article, index, isWide = false }: HomeNewsCardProps) {
    const readTime = estimateReadTime(article.content, article.summary);
    const category = article.source || 'Botafogo';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
                duration: 0.5,
                delay: (index % 6) * 0.08,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={isWide ? 'home-grid-wide' : ''}
        >
            <Link
                href={`/news/${article.id}`}
                className="editorial-card group flex flex-col h-full rounded-2xl overflow-hidden bg-zinc-950/50 backdrop-blur-sm border border-white/[0.06] home-news-card-hover"
            >
                {/* Image container */}
                <div className={`relative w-full overflow-hidden bg-zinc-900 shrink-0 ${isWide ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover object-top transition-transform duration-[1s] ease-out group-hover:scale-[1.06]"
                        sizes={isWide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                        unoptimized
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 md:p-5">
                    {/* Category + Read time */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-premium-gold/10 border border-premium-gold/15 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] text-premium-gold">
                            <Tag size={9} className="stroke-[2.5]" />
                            {category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                            <BookOpen size={9} />
                            {readTime} min
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-white/95 leading-[1.3] tracking-tight group-hover:text-premium-gold transition-colors duration-400 ${isWide ? 'text-lg md:text-xl lg:text-2xl line-clamp-2' : 'text-[15px] md:text-base line-clamp-3'}`}>
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>

                    {/* Summary for wide cards */}
                    {isWide && article.summary && (
                        <p className="hidden md:block mt-2 text-sm text-zinc-400/80 font-medium line-clamp-2 leading-relaxed">
                            {article.summary}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 mt-auto pt-3" suppressHydrationWarning>
                        <Clock size={11} className="text-premium-gold/80" />
                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider" suppressHydrationWarning>
                            {getRelativeTime(article.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
