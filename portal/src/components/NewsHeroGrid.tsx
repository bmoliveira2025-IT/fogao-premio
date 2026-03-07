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
                className="lg:col-span-3 flex flex-col rounded-2xl md:rounded-[2.5rem] overflow-hidden group bg-zinc-950/40 backdrop-blur-xl border border-white/5 transition-all duration-700 shadow-2xl hover:-translate-y-1 hover:border-white/10"
            >
                {/* Cinematic Image Top */}
                <div className="relative w-full aspect-[4/3] md:aspect-[21/10] overflow-hidden bg-zinc-900 shrink-0">
                    <Image
                        src={getSafeImageSrc(mainStory.image)}
                        alt={mainStory.title}
                        fill
                        className="object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                        priority
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-700" />
                </div>

                {/* Content Panel Bottom */}
                <div className="flex flex-col flex-1 p-6 md:p-10 justify-center relative">
                    {/* Badges */}
                    <div className="flex gap-2 mb-4 md:mb-6">
                        <span className="px-3.5 py-1.5 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                            <TrendingUp size={14} className="stroke-[2.5]" /> Destaque
                        </span>
                    </div>

                    <div className="max-w-4xl space-y-3 md:space-y-4">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-white leading-[1.15] tracking-tight group-hover:text-premium-gold transition-colors duration-500">
                            {mainStory.title}
                        </h2>

                        {mainStory.summary && (
                            <p className="text-sm md:text-lg text-zinc-400 font-medium line-clamp-3 leading-relaxed hidden md:block opacity-90">
                                {mainStory.summary}
                            </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 mt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <SourceIcon source={mainStory.source || 'default'} className="w-4 h-4 text-premium-gold" />
                                <span className="text-[10px] md:text-xs font-black text-zinc-300 uppercase tracking-widest leading-none">
                                    {mainStory.source || 'Botafogo'}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-zinc-500" />
                                <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none" suppressHydrationWarning>
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
                        className="flex flex-col flex-1 rounded-2xl md:rounded-[2rem] overflow-hidden group bg-zinc-950/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-500 shadow-xl hover:-translate-y-1 block"
                    >
                        {/* Image Top Half */}
                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-900 shrink-0">
                            <Image
                                src={getSafeImageSrc(story.image, 'https://placehold.co/400x300')}
                                alt={story.title}
                                fill
                                className="object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05] opacity-90 group-hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                unoptimized={true}
                            />
                        </div>

                        {/* Text Bottom Half */}
                        <div className="flex flex-col flex-1 p-5 lg:p-6 justify-between border-t border-white/[0.02]">
                            <div>
                                <h3 className="text-sm md:text-base font-display font-bold text-white/95 leading-[1.35] group-hover:text-premium-gold transition-colors mb-4 line-clamp-3">
                                    {story.title}
                                </h3>
                            </div>

                            <div className="flex items-center justify-between pt-1 mt-auto">
                                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                    <Clock size={12} className="text-zinc-500" />
                                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap" suppressHydrationWarning>
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
