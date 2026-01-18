import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';

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
            className="group flex gap-4 md:gap-6 items-center p-4 md:p-6 rounded-2xl hover:bg-white/5 border transition-all hover:scale-[1.01]"
            style={{ borderColor: 'var(--border-color)' }}
        >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-lg">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 80px, 112px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 justify-center gap-1.5">
                {/* Metadata Pill */}
                <div className="flex items-center gap-2">
                    <SourceIcon source={article.source} className="w-3 h-3 text-[11px] transition-all grayscale group-hover:grayscale-0" />

                    <span className="text-[10px] font-bold text-premium-gold/90 uppercase tracking-widest leading-none px-1.5 py-0.5 rounded bg-premium-gold/10 border border-premium-gold/10">
                        {article.source || 'FOGÃONET'}
                    </span>

                    <span className="text-[9px] text-foreground/20">•</span>

                    <span className="text-[10px] text-foreground/40 font-bold tabular-nums">
                        {timeAgo(article.created_at)}
                    </span>
                </div>

                <h4 className="text-[13px] md:text-[16px] font-black text-white group-hover:text-premium-gold transition-colors leading-tight uppercase">
                    {article.title?.replace(/\*\*/g, '')}
                </h4>
            </div>
        </Link>
    );
}
