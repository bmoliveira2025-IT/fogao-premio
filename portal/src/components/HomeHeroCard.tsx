"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Tag } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import { cleanMarkdown } from '@/lib/news-utils';

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
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function getRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
        const minutes = Math.max(1, Math.floor(diff / (1000 * 60)));
        return `${minutes}m atrás`;
    }
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
}

export default function HomeHeroCard({ article, category = 'Destaque' }: { article: NewsItem; category?: string }) {
    const readTime = estimateReadTime(article.content, article.summary);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
            <Link href={`/news/${article.id}`} className="block relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                {/* Background Image */}
                {article.image && (
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 home-hero-gradient" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:p-14">
                    {/* Badges row */}
                    <div className="flex items-center gap-2.5 mb-3 md:mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-premium-gold/20 backdrop-blur-md border border-premium-gold/30 text-[10px] md:text-xs font-bold uppercase tracking-widest text-premium-gold">
                            <Tag size={11} className="stroke-[2.5]" />
                            {category}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-semibold text-white/80">
                            <BookOpen size={11} />
                            {readTime} min de leitura
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-white leading-[1.15] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:text-premium-gold transition-colors duration-500">
                        {cleanMarkdown(article.title)}
                    </h1>

                    {/* Summary - desktop only */}
                    {article.summary && (
                        <p className="hidden md:block mt-3 text-sm md:text-base text-white/70 font-medium line-clamp-2 max-w-3xl leading-relaxed">
                            {cleanMarkdown(article.summary)}
                        </p>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1.5 mt-3 md:mt-4" suppressHydrationWarning>
                        <Clock size={13} className="text-premium-gold/90" />
                        <span className="text-[11px] md:text-xs font-bold text-white uppercase tracking-wider" suppressHydrationWarning>
                            {getRelativeTime(article.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
