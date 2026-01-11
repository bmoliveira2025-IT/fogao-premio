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

        if (diffInSeconds < 60) return 'Agora mesmo';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
        return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
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
                <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                    {/* Source Icon Only on Mobile, Full on Desktop */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <SourceIcon source={article.source} className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 group-hover:text-premium-gold transition-colors" />
                        <span className="hidden md:inline text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">
                            {article.source || 'FOGÃONET'}
                        </span>
                    </div>

                    <span className="text-zinc-600 hidden md:inline">•</span>

                    {/* Time - Simplified */}
                    <div className="flex items-center text-zinc-500 text-[10px] md:text-[10px] font-bold">
                        <span className="md:hidden">•</span>
                        <span className="pl-1 md:pl-0" suppressHydrationWarning>{timeAgo(article.created_at)}</span>
                    </div>
                </div>

                <Link href={`/news/${article.id}`} className="group-hover:text-premium-gold transition-colors block">
                    <h3 className="text-xs md:text-lg font-bold text-white leading-snug font-display uppercase italic line-clamp-3 md:line-clamp-3">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                </Link>
            </div>
        </div>
    );
}
