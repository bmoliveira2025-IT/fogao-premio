'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Mic, Calendar, Clock, TrendingUp, Headphones, Download } from 'lucide-react';
import ModernNavMenu from '@/components/ModernNavMenu';

interface PodcastItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    audioUrl: string;
    imageUrl: string;
}

export default function PodcastsPage() {
    const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [featuredPodcast, setFeaturedPodcast] = useState<PodcastItem | null>(null);

    useEffect(() => {
        async function fetchPodcasts() {
            try {
                const res = await fetch('/api/podcasts?limit=20', { cache: 'no-store' });
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    setFeaturedPodcast(data.items[0]); // First one as featured
                    setPodcasts(data.items);
                }
            } catch (err) {
                console.error("Failed to load podcasts", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPodcasts();
    }, []);

    const togglePlay = (url: string) => {
        if (currentAudio) {
            currentAudio.pause();
            if (isPlaying === url) {
                setIsPlaying(null);
                setCurrentAudio(null);
                return;
            }
        }

        const newAudio = new Audio(url);
        const playPromise = newAudio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Audio playback error:", error);
                }
            });
        }

        setCurrentAudio(newAudio);
        setIsPlaying(url);

        newAudio.onended = () => {
            setIsPlaying(null);
            setCurrentAudio(null);
        };
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) return `${diffInHours}h atrás`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 dia atrás';
        if (diffInDays < 7) return `${diffInDays} dias atrás`;
        return formatDate(dateStr);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">

            {/* HERO SECTION - Featured Podcast */}
            {featuredPodcast && !loading && (
                <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={featuredPodcast.imageUrl || "https://s2-ge.glbimg.com/filters:format(jpg)/https://s2.glbimg.com/w1i2X45b1k82y9k1245b1k82y9k=/0x0:1080x1080/1080x1080/s.glbimg.com/es/ge/f/original/2019/07/26/ge_botafogo.jpg"}
                            alt={featuredPodcast.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlays suited for the deeply dark premium background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 md:px-12 max-w-[1600px] flex flex-col justify-end pb-12 md:pb-20">
                        {/* Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-4 py-1.5 bg-premium-gold rounded-full flex items-center gap-2 shadow-gold-glow">
                                <TrendingUp size={14} className="text-black" />
                                <span className="text-xs font-black text-black uppercase tracking-widest">Mais Recente</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                                <Clock size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
                                    {getTimeAgo(featuredPodcast.pubDate)}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mb-4 uppercase tracking-tight">
                            {featuredPodcast.title}
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg text-zinc-300 max-w-3xl mb-6 line-clamp-2 leading-relaxed">
                            {featuredPodcast.description}
                        </p>

                        {/* Play Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => togglePlay(featuredPodcast.audioUrl)}
                                className="group flex items-center gap-3 px-8 py-4 bg-premium-gold hover:bg-white rounded-full shadow-premium hover:shadow-gold-glow transition-all duration-300 active:scale-90"
                            >
                                {isPlaying === featuredPodcast.audioUrl ? (
                                    <>
                                        <Pause fill="black" className="w-5 h-5 text-black" />
                                        <span className="text-sm font-black text-black uppercase tracking-widest">Pausar</span>
                                    </>
                                ) : (
                                    <>
                                        <Play fill="black" className="w-5 h-5 text-black ml-0.5" />
                                        <span className="text-sm font-black text-black uppercase tracking-widest">Ouvir Agora</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={featuredPodcast.audioUrl}
                                download
                                className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 hover:border-white/30 transition-all duration-300 active:scale-90"
                                title="Download"
                            >
                                <Download size={20} className="text-white" />
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 md:px-12 max-w-[1600px] py-12 md:py-20">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-premium-gold/10 rounded-xl shadow-inner border border-premium-gold/20">
                            <Mic size={24} className="text-premium-gold" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight shadow-sm">
                                Todos os Episódios
                            </h2>
                            <p className="text-sm text-zinc-400 font-medium">
                                GE Botafogo - Glorioso 360
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-panel border border-white/5 rounded-full">
                        <Headphones size={16} className="text-premium-gold" />
                        <span className="text-sm font-bold text-zinc-300">
                            {podcasts.length} episódios
                        </span>
                    </div>
                </div>

                {/* Podcast Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {podcasts.slice(1).map((pod, index) => (
                            <div
                                key={pod.audioUrl}
                                className="group relative glass-ultra border border-white/[0.04] hover:border-premium-gold/40 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] active:opacity-90 flex flex-col"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="relative h-56 md:h-64 overflow-hidden bg-zinc-900 w-full flex-shrink-0">
                                    <img
                                        src={pod.imageUrl || "https://s2-ge.glbimg.com/filters:format(jpg)/https://s2.glbimg.com/w1i2X45b1k82y9k1245b1k82y9k=/0x0:1080x1080/1080x1080/s.glbimg.com/es/ge/f/original/2019/07/26/ge_botafogo.jpg"}
                                        alt={pod.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                    />

                                    {/* Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-500">
                                        <button
                                            onClick={() => togglePlay(pod.audioUrl)}
                                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-premium transform transition-all duration-500 active:scale-90 ${isPlaying === pod.audioUrl
                                                ? 'bg-premium-gold scale-100 ring-4 ring-premium-gold/30'
                                                : 'bg-premium-gold/90 scale-90 group-hover:scale-100'
                                                }`}
                                        >
                                            {isPlaying === pod.audioUrl ? (
                                                <Pause fill="black" className="w-6 h-6 text-black" />
                                            ) : (
                                                <Play fill="black" className="w-6 h-6 ml-1 text-black" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Date Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                                        <Calendar size={12} className="text-premium-gold" />
                                        <span className="text-[10px] uppercase font-bold text-zinc-300">
                                            {formatDate(pod.pubDate)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 md:p-6 flex flex-col justify-between h-[200px]">
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-premium-gold transition-colors duration-300">
                                            {pod.title}
                                        </h3>

                                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                                            {pod.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-xs font-black text-premium-gold uppercase tracking-wider flex items-center gap-1.5">
                                            <Headphones size={12} />
                                            Ouvir
                                        </span>
                                        <a
                                            href={pod.audioUrl}
                                            download
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-90"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Download size={14} className="text-zinc-400" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && podcasts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-6">
                            <Mic size={48} className="text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            Nenhum podcast disponível
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Novos episódios em breve!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
