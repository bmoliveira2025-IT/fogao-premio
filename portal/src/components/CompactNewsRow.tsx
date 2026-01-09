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

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return (
        <Link href={`/news/${article.id}`} className="group block w-full active:scale-[0.99] transition-transform duration-200">
            <div className="flex items-start space-x-3 py-3 border-b border-foreground/10 dark:border-premium-gold/10 group-last:border-0 relative overflow-hidden">
                {/* Highlight Line (Hover) */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-premium-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Thumbnail (Small) */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    <Image
                        src={article.image || 'https://via.placeholder.com/150'}
                        alt={article.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow min-w-0 justify-center h-16">
                    <div className="flex items-center space-x-2 mb-1">
                        <SourceIcon source={article.source} className="w-3 h-3 text-[5px]" />
                        <span className="text-[9px] text-premium-gold/80 font-bold uppercase tracking-wider truncate">
                            {article.source || 'FOGÃONET'}
                        </span>
                        <span className="text-foreground/10 text-[8px]">•</span>
                        <span className="text-[9px] text-foreground/40 font-bold tabular-nums">
                            {timeAgo(article.created_at)}
                        </span>
                    </div>

                    <h4 className="text-[13px] font-bold text-foreground leading-tight font-sans line-clamp-2 group-hover:text-premium-gold transition-colors">
                        {article.title}
                    </h4>
                </div>
            </div>
        </Link>
    );
}
