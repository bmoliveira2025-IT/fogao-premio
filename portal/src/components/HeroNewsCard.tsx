import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

export default function HeroNewsCard({ article }: { article: any }) {
    if (!article) return null;

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Link href={`/news/${article.id}`} className="group relative block w-full aspect-[4/3] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl mb-8">
            {/* Background Image */}
            <Image
                src={article.image || 'https://via.placeholder.com/800x600'}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end items-start z-10">

                {/* Top Badge */}
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-premium-gold text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                        GERAL
                    </span>
                </div>

                {/* Source & Time */}
                <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 dark:border-premium-gold/10">
                        <SourceIcon source={article.source} className="w-4 h-4 rounded-full text-[6px]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">{article.source || 'FOGÃONET'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-white/60 text-[10px] font-bold tracking-wide">
                        <Clock size={10} />
                        <span>{timeAgo(article.created_at)}</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-black italic text-white leading-tight mb-4 drop-shadow-md font-display uppercase max-w-2xl">
                    {article.title}
                </h2>

                {/* Footer Tags */}
                <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-[#222]/80 backdrop-blur-sm border border-white/5 dark:border-premium-gold/10 rounded-md text-[9px] font-bold text-white/50 uppercase tracking-wider">
                        #BOTAFOGO
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/5 dark:border-premium-gold/10 rounded-md text-[9px] font-bold text-white/70 uppercase tracking-wider">
                        NEUTRO
                    </span>
                </div>
            </div>
        </Link>
    );
}
