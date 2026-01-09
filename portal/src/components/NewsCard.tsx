import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

export default function NewsCard({ article }: any) {
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`; // Changed from 'h' to 'm' for minutes
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return (
        <div
            className="bg-card rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border flex flex-row md:flex-col h-[100px] md:h-full group transition-all duration-300 hover:scale-[1.02]"
            style={{ borderColor: 'var(--border-color)' }}
        >
            <Link href={`/news/${article.id}`} className="block relative w-[130px] md:w-full md:aspect-[16/10] shrink-0 overflow-hidden">
                <Image
                    src={article.image || 'https://via.placeholder.com/800x600'}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 130px, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-t md:from-black/90 md:via-black/40 md:to-transparent opacity-80" />

                {/* Removed GERAL tag as requested */}
            </Link>

            <div className="p-3 md:p-5 flex flex-col justify-center flex-grow min-w-0">
                <div className="flex items-center space-x-2 mb-1 md:mb-3">
                    <SourceIcon source={article.source} className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">
                        {article.source || 'FOGÃONET'}
                    </span>
                    <span className="text-zinc-600 hidden md:inline">•</span>
                    <div className="hidden md:flex items-center text-zinc-500 text-[10px] font-bold">
                        <Clock size={10} className="mr-1" />
                        <span>{timeAgo(article.created_at)}</span>
                    </div>
                </div>

                <Link href={`/news/${article.id}`} className="group-hover:text-premium-gold transition-colors block">
                    <h3 className="text-xs md:text-lg font-bold text-white leading-tight font-display uppercase italic line-clamp-3 md:line-clamp-3">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                </Link>

                {/* Mobile Timestamp shown below title */}
                <div className="md:hidden mt-1 flex items-center text-zinc-500 text-[9px] font-bold">
                    <Clock size={9} className="mr-1" />
                    <span>{timeAgo(article.created_at)}</span>
                </div>
            </div>
        </div>
    );
}
