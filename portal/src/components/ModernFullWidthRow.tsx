"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    summary?: string;
    created_at: string;
}

export default function ModernFullWidthRow({ article }: { article: NewsItem }) {
    if (!article) return null;

    return (
        <div className="px-3 md:px-0 mb-4 mt-2">
            <Link
                href={`/news/${article.id}`}
                className="group relative block w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-2xl bg-[#111] shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-white/5"
            >
                {/* Full Background Image - Clean and Bright */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    className="object-cover object-center transition-transform duration-[3s] ease-in-out group-hover:scale-[1.05]"
                    unoptimized
                />
                
                {/* Minimal Dark Gradient just for text readability - preserving image beauty */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content Area - Floating over the image bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col justify-end z-20">
                    <h3 className="text-xl md:text-3xl font-black text-white leading-[1.15] tracking-tight group-hover:text-zinc-200 transition-colors duration-300 drop-shadow-md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                    
                    {/* Premium Divider */}
                    <div className="w-12 h-[2px] bg-gradient-to-r from-premium-gold to-transparent my-3 md:my-4 opacity-80" />

                    {article.summary && (
                        <p className="text-xs md:text-sm text-zinc-300 font-medium line-clamp-2 md:line-clamp-2 leading-relaxed max-w-2xl drop-shadow-md">
                            {article.summary}
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}
