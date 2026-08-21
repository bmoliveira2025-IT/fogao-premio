"use client";
import Link from 'next/link';
import Image from 'next/image';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import LikeDislikeButtons from './LikeDislikeButtons';

interface CompactNewsArticle {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
    likes_count?: number;
    dislikes_count?: number;
}

interface CompactNewsRowProps {
    article: CompactNewsArticle;
    dense?: boolean;
}

export default function CompactNewsRow({ article, dense = false }: CompactNewsRowProps) {
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <Link
            href={`/news/${article.id}`}
            className={`group flex items-stretch rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-zinc-300 transition-all duration-200 ${dense ? 'min-h-[96px] gap-3 px-2 py-2' : 'min-h-[104px] gap-3.5 p-3'}`}
        >
            {/* Standard Mobile Thumbnail (72x72) */}
            <div className="relative w-20 min-h-20 sm:w-[88px] flex-shrink-0 self-stretch overflow-hidden bg-zinc-100 rounded-xl border border-zinc-200/60">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="(min-width: 640px) 88px, 80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    unoptimized={true}
                />
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-grow flex-col justify-between gap-2 py-0.5">
                <h4 className="text-[15px] sm:text-[16px] font-bold leading-[1.3] text-zinc-900 line-clamp-2 group-hover:text-amber-600 transition-colors tracking-tight">
                    {toSentenceCase(article.title)}
                </h4>

                {/* Metadata Row with Glass Badge */}
                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 shrink items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/80">
                            <SourceIcon source={article.source} className="w-3.5 h-3.5" />
                            <span className="max-w-[62px] truncate text-[10px] font-bold text-zinc-700 sm:max-w-[82px]">
                                {article.source || 'Botafogo'}
                            </span>
                        </div>

                        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                            <span className="mr-1 text-zinc-300">•</span>{timeAgo(article.created_at)}
                        </span>
                    </div>

                    <LikeDislikeButtons
                        className="shrink-0"
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />
                </div>
            </div>
        </Link>
    );
}



