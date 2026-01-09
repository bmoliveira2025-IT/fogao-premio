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
        fill
                        className = "object-cover transition-transform duration-500 group-hover:scale-110"
        />
                </div >

        {/* Content - Right */ }
        < div className = "flex flex-col justify-between flex-grow py-1" >
            <div>
                {/* Tag */}
                <div className="mb-1.5">
                    <span className="text-[9px] font-black text-premium-gold uppercase tracking-widest">
                        GERAL
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-foreground leading-snug font-display line-clamp-3 group-hover:text-premium-gold/90 transition-colors uppercase italic">
                    {article.title}
                </h3>
            </div>

    {/* Metadata */ }
    <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
            <SourceIcon source={article.source} className="w-4 h-4" />
            <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-wider">
                {article.source || 'FOGÃONET'}
            </span>
        </div>

        <div className="flex items-center text-foreground/20 text-[9px] font-bold">
            <Clock size={8} className="mr-1" />
            <span className="mr-3">{timeAgo(article.created_at)}</span>
            <div className="flex items-center space-x-1 border-l border-foreground/10 pl-3">
                <span className="uppercase tracking-widest">{new Date(article.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}</span>
            </div>
        </div>
    </div>
                </div >
            </div >
        </Link >
    );
}
