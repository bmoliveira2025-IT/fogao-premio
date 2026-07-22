"use client";
import Link from 'next/link';
import Image from 'next/image';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import LikeDislikeButtons from './LikeDislikeButtons';

export default function CompactNewsRow({ article, dense = false }: any) {
    const { user } = useAuth();
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

    return (
        <Link
            href={`/news/${article.id}`}
            className={`group flex items-center rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-zinc-300 transition-all duration-200 ${dense ? 'gap-3 px-2 py-2' : 'gap-3.5 p-3'}`}
        >
            {/* Standard Mobile Thumbnail (72x72) */}
            <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-zinc-100 rounded-xl border border-zinc-200/60">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    unoptimized={true}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 justify-between h-[72px] sm:h-20 py-0.5">
                <h4 className="text-[14px] sm:text-[15px] font-bold leading-[1.3] text-zinc-900 line-clamp-2 group-hover:text-amber-600 transition-colors tracking-tight">
                    {toSentenceCase(article.title)}
                </h4>

                {/* Metadata Row with Glass Badge */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/80">
                            <SourceIcon source={article.source} className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold text-zinc-700 truncate max-w-[90px]">
                                {article.source || 'Botafogo'}
                            </span>
                        </div>

                        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                            • {timeAgo(article.created_at)}
                        </span>
                    </div>

                    <LikeDislikeButtons
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />
                </div>
            </div>
        </Link>
    );
}



