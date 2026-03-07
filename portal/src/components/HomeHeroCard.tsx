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
        return `${minutes}min`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
}

export default function HomeHeroCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const readTime = estimateReadTime(article.content, article.summary);
    const category = article.source || 'Botafogo';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={`/news/${article.id}`}
                className="group relative block w-full aspect-[4/3] md:aspect-[16/8] overflow-hidden rounded-2xl md:rounded-3xl"
            >
                {/* Image */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    unoptimized
                />

                {/* Dark gradient overlay for text readability */}
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
                        {article.title?.replace(/\*\*/g, '')}
                    </h1>

                    {/* Summary - desktop only */}
                    {article.summary && (
                        <p className="hidden md:block mt-3 text-sm md:text-base text-white/70 font-medium line-clamp-2 max-w-3xl leading-relaxed">
                            {article.summary}
                        </p>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1.5 mt-3 md:mt-4" suppressHydrationWarning>
                        <Clock size={13} className="text-white/50" />
                        <span className="text-[11px] md:text-xs font-semibold text-white/50 uppercase tracking-wider" suppressHydrationWarning>
                            {getRelativeTime(article.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
