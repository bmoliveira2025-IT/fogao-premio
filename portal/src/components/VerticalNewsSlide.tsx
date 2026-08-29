"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Share2, Bookmark, ChevronRight } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import LikeDislikeButtons from './LikeDislikeButtons';

interface VerticalNewsSlideProps {
    article: any;
    index: number;
}

export default function VerticalNewsSlide({ article, index }: VerticalNewsSlideProps) {
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min atrás`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h atrás`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    // Vibrate gradient colors for visual variety (like the Behance reference)
    const gradients = [
        "from-blue-900/80 via-[#111]/60",
        "from-red-900/80 via-[#111]/60",
        "from-purple-900/80 via-[#111]/60",
        "from-emerald-900/80 via-[#111]/60",
        "from-[#111]/90 via-[#111]/50", // Default dark
    ];

    // Choose gradient based on index or default to black
    const gradient = gradients[index % gradients.length];

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-zinc-200 text-white">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/800x1200')}
                    alt={article.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                    unoptimized
                />
            </div>

            {/* Tint/Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]/90" />

            {/* Top Bar removed as requested */}

            {/* Main Content (Bottom Left aligned like reference) */}
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 z-20 pb-24 flex flex-col justify-end min-h-[50%]">

                {/* Date / Metadata */}
                <div className="mb-3">
                    <span className="text-[12px] font-bold tracking-widest text-white/80 uppercase">
                        {timeAgo(article.created_at)}
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="text-[32px] md:text-[48px] font-[800] leading-[1.1] mb-6 tracking-tight drop-shadow-lg"

                >
                    {toSentenceCase(article.title)}
                </h1>

                {/* Summary (optional if present, to tease content) */}
                {article.summary && (
                    <p className="text-white/70 text-[14px] leading-relaxed mb-6 line-clamp-3">
                        {article.summary}
                    </p>
                )}

                {/* Footer Bar (Logo + Actions) */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <SourceIcon source={article.source || 'Fogão'} className="w-6 h-6 rounded-full bg-white p-1 text-black" />
                        <span className="text-[13px] font-bold">{article.source || 'Redação'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <LikeDislikeButtons
                            articleId={article.id}
                            initialLikes={article.likes_count}
                            initialDislikes={article.dislikes_count}
                            variant="compact"
                            className="text-white/80"
                        />

                        <Link
                            href={`/news/${article.id}`}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                        >
                            <ChevronRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
