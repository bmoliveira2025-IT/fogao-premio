"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import { Clock } from 'lucide-react';

interface LightHeroCardProps {
    article: any;
}

export default function LightHeroCard({ article }: LightHeroCardProps) {
    if (!article) return null;

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <Link href={`/news/${article.id}`} className="block relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Image
                src={getSafeImageSrc(article.image, 'https://placehold.co/800x600')}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                priority
                unoptimized
            />
            
            {/* Gradient Overlay for bottom text */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Badge on Top Left */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-[11px] font-medium text-white">Destaque</span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/80">
                    <SourceIcon source={article.source} className="w-4 h-4 rounded-full" />
                    <span className="text-[11px] font-medium">Por {article.source || 'Redação'}</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="text-[11px]">{timeAgo(article.created_at)}</span>
                </div>
                
                <h2 className="text-white text-[18px] font-bold leading-tight line-clamp-3">
                    {toSentenceCase(article.title)}
                </h2>
            </div>
        </Link>
    );
}
