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
            className="bg-card rounded-3xl overflow-hidden shadow-2xl border flex flex-col h-full group transition-all duration-300 hover:scale-[1.02]"
            style={{ borderColor: 'var(--border-color)' }}
        >
            <Link href={`/news/${article.id}`} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                    src={article.image || 'https://via.placeholder.com/800x600'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 p-4">
                    <div className="mb-2">
                        <span className="px-2 py-1 bg-premium-gold text-black text-[10px] font-black uppercase tracking-widest rounded-md">
                            GERAL
                        </span>
                    </div>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 mb-3">
                    <SourceIcon source={article.source} className="w-4 h-4" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {article.source || 'FOGÃONET'}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <div className="flex items-center text-zinc-500 text-[10px] font-bold">
                        <Clock size={10} className="mr-1" />
                        <span>{timeAgo(article.created_at)}</span>
                    </div>
                </div>

                <Link href={`/news/${article.id}`} className="group-hover:text-premium-gold transition-colors block flex-grow">
                    <h3 className="text-lg font-bold text-white leading-tight font-display uppercase italic mb-2 line-clamp-3">
                        {article.title}
                    </h3>
                </Link>
            </div>
        </div>
    );
}
