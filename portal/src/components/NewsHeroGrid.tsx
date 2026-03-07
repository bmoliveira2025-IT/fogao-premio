import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import { cn } from '@/lib/utils';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    is_premium?: boolean;
    summary?: string;
    created_at: string;
}

interface NewsHeroGridProps {
    news: NewsItem[];
}

export default function NewsHeroGrid({ news }: NewsHeroGridProps) {
    if (!news || news.length === 0) return null;

    const mainStory = news[0];
    const sideStories = news.slice(1, 4); // Take up to 3 side stories if needed, or 2 for the grid

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
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
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-8 lg:mb-12">
            {/* Main Story (Takes 3/4 width on desktop) */}
            <Link
                href={`/news/${mainStory.id}`}
                className="lg:col-span-3 relative h-[450px] md:h-[650px] rounded-2xl md:rounded-[2rem] overflow-hidden group border border-white/5 hover:border-premium-gold/30 transition-all duration-700 shadow-2xl hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-zinc-900">
                    <Image
                        src={getSafeImageSrc(mainStory.image)}
                        alt={mainStory.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        priority
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-50" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-20">
                    {/* Badges */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 flex gap-2">
                        <span className="px-4 py-2 rounded-xl bg-premium-gold/90 backdrop-blur-md text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-1.5 border border-white/20">
                            <TrendingUp size={14} className="stroke-[2.5]" /> Exclusivo
                        </span>
                    </div>

                    <div className="max-w-4xl space-y-4 md:space-y-5">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[1.1] drop-shadow-2xl group-hover:text-premium-gold transition-colors duration-500 tracking-tight">
                            {mainStory.title}
                        </h2>

                        {mainStory.summary && (
                            <p className="text-base md:text-xl text-zinc-300 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-lg hidden md:block">
                                {mainStory.summary}
                            </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-2">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <SourceIcon source={mainStory.source || 'default'} className="w-4 h-4 text-premium-gold" />
                                <span className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest leading-none">
                                    {mainStory.source || 'Botafogo'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Clock size={14} className="text-zinc-400" />
                                <span className="text-[11px] md:text-[12px] font-bold text-zinc-300 uppercase tracking-widest leading-none" suppressHydrationWarning>
                                    {timeAgo(mainStory.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Side Stories (Vertical Column) */}
            <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 h-full">
                {sideStories.map((story) => (
                    <Link
                        key={story.id}
                        href={`/news/${story.id}`}
                        className="relative flex-1 min-h-[200px] md:min-h-[250px] lg:min-h-0 rounded-2xl md:rounded-[1.5rem] overflow-hidden group border border-white/5 hover:border-premium-gold/30 transition-all duration-500 shadow-xl hover:-translate-y-1 bg-zinc-950"
                    >
                        <Image
                            src={getSafeImageSrc(story.image, 'https://placehold.co/400x300')}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                            <h3 className="text-base md:text-[17px] font-display font-bold text-white/95 leading-[1.3] drop-shadow-lg group-hover:text-premium-gold transition-colors mb-3">
                                {story.title}
                            </h3>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                    <Clock size={12} className="text-white flex-shrink-0" />
                                    <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap" suppressHydrationWarning>
                                        {timeAgo(story.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
