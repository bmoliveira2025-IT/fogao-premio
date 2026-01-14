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
                priority={true}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-12">
                <h2 className="text-[19px] md:text-[49px] font-black text-white leading-tight drop-shadow-xl group-hover:text-premium-gold transition-colors mb-3 md:mb-4 line-clamp-3">
                    {article.title?.replace(/\*\*/g, '')}
                </h2>

                {/* Footer Tags & Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-[#222]/80 backdrop-blur-sm border border-premium-gold/15 rounded-md text-[10px] font-bold text-white/50 uppercase tracking-wider">
                            #BOTAFOGO
                        </span>

                        {/* Source Moved Here */}
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-premium-gold/15">
                            <SourceIcon source={article.source} className="w-3 h-3 text-premium-gold" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                {article.source}
                            </span>
                        </div>
                    </div>

                    {/* Date Moved Here */}
                    <div className="flex items-center gap-1.5 text-zinc-300 drop-shadow-md bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5">
                        <Clock size={12} className="md:w-3 md:h-3 w-2.5 h-2.5" />
                        <span className="text-[11px] md:text-[13px] font-medium uppercase tracking-wider" suppressHydrationWarning>
                            {new Date(article.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            <span className="hidden md:inline"> às {new Date(article.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
