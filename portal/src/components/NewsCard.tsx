import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';

export default function NewsCard({ article }: any) {
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora mesmo';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    };

    return (
        <div
            className="editorial-card group relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-premium-gold/10 hover:border-premium-gold/30"
            style={{ minHeight: '350px' }}
        >
            <Link
                href={`/news/${article.id}`}
                className="block w-full h-full relative"
            >
                {/* Full Background Image */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    unoptimized={true}
                />

                {/* Cinematic Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20">

                    {/* Meta Badges */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-premium-gold/40 transition-colors">
                            <SourceIcon source={article.source || 'default'} className="w-4 h-4 text-premium-gold" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5 drop-shadow-md" suppressHydrationWarning>
                            <Clock size={11} className="text-premium-gold" />
                            {timeAgo(article.created_at)}
                        </span>
                    </div>

                    {/* Large Title */}
                    <h3 className="text-xl md:text-2xl font-black font-sans text-white leading-[1.1] uppercase drop-shadow-xl group-hover:text-premium-gold transition-colors duration-300 mb-1">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                </div>
            </Link>
        </div>
    );
}
