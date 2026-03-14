"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    summary?: string;
    created_at: string;
}

export default function ModernFullWidthHero({ article }: { article: NewsItem }) {
    if (!article) return null;

    return (
        <div className="mb-1 border-b-[3px] border-[#0a0a0a]">
            <Link
                href={`/news/${article.id}`}
                className="group relative block w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2.5/1] bg-[#111] overflow-hidden"
            >
                {/* Full Background Image */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-[4s] ease-out group-hover:scale-[1.03]"
                    unoptimized
                />
                
                {/* Granular Dirt/Noise Overlay for depth (simulated via CSS or tiny SVG noise pattern, or just intense gradient) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/95 z-0" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10" />
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

                {/* Main Content Area */}
                <div className="absolute inset-0 p-4 md:p-8 lg:px-12 lg:py-10 flex flex-col justify-end z-20">
                    
                    {/* Title */}
                    <div className="max-w-[85%] md:max-w-[65%] lg:max-w-[55%] pb-2">
                        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-[900] text-white leading-[1.05] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {article.title?.replace(/\*\*/g, '')}
                        </h1>

                        {article.summary && (
                            <p className="mt-2 md:mt-3 text-[14px] md:text-base text-white/90 font-medium leading-[1.4] drop-shadow-md hidden md:block" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                {article.summary}
                            </p>
                        )}
                    </div>

                    {/* "VER DETALHES" Button */}
                    <div className="mt-3 md:mt-5 mb-2">
                        <span className="inline-flex px-5 py-2 md:px-6 md:py-2.5 bg-gradient-to-b from-[#e3c678] via-[#d4af37] to-[#aa831b] text-black font-[900] text-[12px] md:text-[14px] tracking-wide shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-[#f5e0a3]/40 rounded-sm transition-all duration-300 hover:brightness-110" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            VER DETALHES
                        </span>
                    </div>
                </div>

            </Link>
        </div>
    );
}
