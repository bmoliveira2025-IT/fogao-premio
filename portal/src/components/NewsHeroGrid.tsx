import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

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
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
            {/* Main Story (Takes 3/4 width on desktop) */}
            <Link
                href={`/news/${mainStory.id}`}
                className="lg:col-span-3 relative h-[450px] md:h-[650px] rounded-2xl overflow-hidden group border border-white/5 hover:border-premium-gold/40 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
                <div className="absolute inset-0">
                    <Image
                        src={getSafeImageSrc(mainStory.image)}
                        alt={mainStory.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                    {/* Badges - Inside flex flow */}
                    <div className="flex mb-4">
                        <span className="px-3 py-1 rounded-full bg-premium-gold text-black text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <TrendingUp size={12} /> Destaque
                        </span>
                    </div>

                    {/* Source & Time */}
                    <div className="flex items-center gap-3 mb-3 text-zinc-300 text-xs font-bold uppercase tracking-wider">
                        <span className="text-premium-gold">{mainStory.source || 'FOGÃONET'}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1" suppressHydrationWarning>
                            <Clock size={12} />
                            {timeAgo(mainStory.created_at)}
                        </div>
                    </div>

                    <h2 className="text-xl md:text-4xl lg:text-6xl font-black text-white leading-[1] uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] group-hover:text-premium-gold transition-colors duration-500 tracking-tighter">
                        {mainStory.title}
                    </h2>

                    {mainStory.summary && (
                        <p className="mt-4 text-sm md:text-base text-zinc-300 line-clamp-2 max-w-3xl font-medium leading-relaxed hidden md:block">
                            {mainStory.summary}
                        </p>
                    )}
                </div>
            </Link>

            {/* Side Stories (Vertical Column) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                {sideStories.map((story) => (
                    <Link
                        key={story.id}
                        href={`/news/${story.id}`}
                        className="relative flex-1 min-h-[220px] md:min-h-[300px] rounded-xl overflow-hidden group border border-white/5 hover:border-premium-gold/40 transition-all duration-500 shadow-xl"
                    >
                        <Image
                            src={getSafeImageSrc(story.image, 'https://placehold.co/400x300')}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-premium-gold uppercase">
                                {story.source || 'FOGÃONET'}
                                <span className="text-zinc-500">•</span>
                                <span className="text-zinc-400" suppressHydrationWarning>{timeAgo(story.created_at)}</span>
                            </div>
                            <h3 className="text-sm md:text-lg font-black text-white leading-tight uppercase drop-shadow-xl group-hover:text-premium-gold transition-colors">
                                {story.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
