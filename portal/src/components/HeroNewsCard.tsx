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
        <Link
            href={`/news/${article.id}`}
            className="group relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-3xl border shadow-2xl block"
            style={{ borderColor: 'var(--border-color)' }}
        >    {/* Background Image */}
            <Image
                src={article.image || 'https://via.placeholder.com/800x600'}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                {/* Source & Date - Moved to Top of Content Area */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <SourceIcon source={article.source} className="w-4 h-4 text-premium-gold" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {article.source}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300 drop-shadow-md">
                        <Clock size={12} />
                        <span className="text-xs font-medium uppercase tracking-wider">
                            {new Date(article.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {new Date(article.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                {/* Category Tag - Moved Below Source to avoid overlap */}
                <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-premium-gold text-black text-xs font-black uppercase tracking-widest rounded-md shadow-lg transform -skew-x-6">
                        {article.category || 'GERAL'}
                    </span>
                </div>

                <Link href={`/news/${article.id}`} className="group/title">
                    <h2 className="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-xl group-hover/title:text-premium-gold transition-colors mb-4 line-clamp-3">
                        {article.title}
                    </h2>
                </Link>
                {/* Footer Tags */}
                <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-[#222]/80 backdrop-blur-sm border border-premium-gold/15 rounded-md text-[9px] font-bold text-white/50 uppercase tracking-wider">
                        #BOTAFOGO
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-premium-gold/15 rounded-md text-[9px] font-bold text-white/70 uppercase tracking-wider">
                        NEUTRO
                    </span>
                </div>
            </div>
        </Link>
    );
}
