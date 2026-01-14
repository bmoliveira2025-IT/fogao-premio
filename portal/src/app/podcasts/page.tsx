'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Mic, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import BrandingHeader from '@/components/BrandingHeader';
import DesktopSidebar from '@/components/DesktopSidebar';
import TabBar from '@/components/TabBar';

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

    useEffect(() => {
        async function fetchPodcasts() {
            try {
                // Force no-store and manual slice to ensure exactly 8 items
                const res = await fetch('/api/podcasts?limit=8', { cache: 'no-store' });
                const data = await res.json();
                if (data.items) {
                    setPodcasts(data.items.slice(0, 8));
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

    return (
        <main className="min-h-screen bg-background dark:bg-zinc-950 text-foreground pb-32 lg:pb-0">
            {/* 1. SIDEBAR - DESKTOP ONLY */}
            <div className="hidden lg:block">
                <DesktopSidebar />
            </div>

            {/* 2. MOBILE HEADER */}
            <div className="lg:hidden">
                <BrandingHeader />
            </div>

            <div className="w-full lg:pl-64">
                <div className="container mx-auto px-4 pt-24 pb-8 lg:p-12 max-w-7xl">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-4 mb-8 lg:mb-12 relative">
                        <Link href="/" className="absolute left-0 top-1 lg:static lg:block p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>

                        <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
                            <h1 className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-premium-gold/20 bg-premium-gold/5 text-xl lg:text-4xl lg:p-0 lg:bg-transparent lg:border-0 font-black uppercase tracking-widest lg:tracking-tighter text-premium-gold lg:text-white">
                                <Mic size={18} className="lg:hidden" />
                                <span className="hidden lg:inline-flex p-3 bg-premium-gold/10 rounded-xl border border-premium-gold/20 text-premium-gold mr-3">
                                    <Mic size={24} className="lg:w-8 lg:h-8" />
                                </span>
                                Podcast 360
                            </h1>
                            <p className="text-zinc-500 font-medium text-xs lg:text-base mt-2 lg:ml-1">
                                Últimos 12 episódios do GE Botafogo
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-48 bg-zinc-900 rounded-2xl border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
                            {podcasts.map((pod) => (
                                <div key={pod.audioUrl} className="group relative bg-zinc-900/40 border border-white/5 hover:border-premium-gold/30 rounded-xl p-2 lg:p-4 transition-all hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-black/50 flex flex-row lg:flex-col gap-3 lg:gap-0 items-center lg:items-start h-auto lg:h-full">

                                    {/* Image Container */}
                                    <div className="relative flex-shrink-0 w-16 h-16 lg:w-full lg:h-64 rounded-lg lg:rounded-xl overflow-hidden bg-zinc-800 shadow-md lg:shadow-lg lg:mb-5">
                                        <img
                                            src={pod.imageUrl || "https://s2-ge.glbimg.com/filters:format(jpg)/https://s2.glbimg.com/w1i2X45b1k82y9k1245b1k82y9k=/0x0:1080x1080/1080x1080/s.glbimg.com/es/ge/f/original/2019/07/26/ge_botafogo.jpg"}
                                            alt={pod.title}
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                        />

                                        {/* Gradient Overlay (Desktop) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity hidden lg:block" />

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors backdrop-blur-[0px] group-hover:backdrop-blur-[2px]">
                                            <button
                                                onClick={() => togglePlay(pod.audioUrl)}
                                                className={`w-8 h-8 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 ${isPlaying === pod.audioUrl ? 'bg-premium-gold scale-100 ring-2 lg:ring-4 ring-premium-gold/30' : 'bg-premium-gold scale-90 group-hover:scale-100'}`}
                                            >
                                                {isPlaying === pod.audioUrl ?
                                                    <Pause fill="black" className="w-3 h-3 lg:w-6 lg:h-6 text-black" /> :
                                                    <Play fill="black" className="w-3 h-3 lg:w-6 lg:h-6 ml-0.5 lg:ml-1 text-black" />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col h-full justify-center">
                                        {/* Date Badge */}
                                        <div className="flex items-center gap-2 mb-1 lg:mb-3">
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-800/80 border border-white/5 text-[9px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                <Calendar size={9} className="lg:hidden" />
                                                <Calendar size={10} className="hidden lg:block" />
                                                {new Date(pod.pubDate).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xs lg:text-lg font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2">
                                            {pod.title}
                                        </h2>

                                        {/* Description (Desktop Only) */}
                                        <p className="hidden lg:block text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                            {pod.description}
                                        </p>

                                        {/* Footer (Desktop Only) */}
                                        <div className="hidden lg:flex items-center justify-between mt-auto border-t border-white/5 pt-4 w-full">
                                            <span className="text-[11px] font-bold text-premium-gold uppercase tracking-wider flex items-center gap-1.5">
                                                <Play size={12} />
                                                Ouvir Agora
                                            </span>
                                            <span className="text-[10px] font-medium text-zinc-500">
                                                GLORIOSO 360
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
