import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

export default function CompactNewsRow({ article }: any) {
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
        <Link
            href={`/news/${article.id}`}
            className="group flex gap-3 items-center p-3 rounded-xl hover:bg-white/5 border transition-all"
            style={{ borderColor: 'var(--border-color)' }}
        >
            {/* Thumbnail */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/5">
                <Image
                    src={article.image || 'https://via.placeholder.com/150'}
                    alt={article.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 justify-center gap-1.5">
                {/* Metadata Pill */}
                <div className="flex items-center gap-2">
                    <SourceIcon source={article.source} className="w-3 h-3 text-[10px] transition-all grayscale group-hover:grayscale-0" />

                    <span className="text-[9px] font-bold text-premium-gold/90 uppercase tracking-widest leading-none px-1.5 py-0.5 rounded bg-premium-gold/10 border border-premium-gold/10">
                        {article.source || 'FOGÃONET'}
                    </span>

                    <span className="text-[8px] text-foreground/20">•</span>

                    <span className="text-[9px] text-foreground/40 font-bold tabular-nums">
                        {timeAgo(article.created_at)}
                    </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-premium-gold transition-colors line-clamp-2 leading-tight">
                    {article.title?.replace(/\*\*/g, '')}
                </h4>
            </div>
        </Link>
    );
}
