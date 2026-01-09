'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Mic, ArrowLeft } from 'lucide-react';
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
                const res = await fetch('/api/podcasts?limit=50');
                const data = await res.json();
                if (data.items) setPodcasts(data.items);
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
                <BrandingHeader notifications={[]} />
            </div>

            <div className="w-full lg:pl-64">
                <div className="container mx-auto px-4 py-8 lg:p-12 max-w-5xl">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/" className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <span className="p-3 bg-zinc-900 rounded-xl border border-white/10 text-premium-gold">
                                    <Mic size={24} />
                                </span>
                                Podcast 360
                            </h1>
                            <p className="text-zinc-400 text-sm mt-1 ml-1">Todos os episódios do GE Botafogo</p>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-3 lg:space-y-4">
                        {loading ? (
                            <div className="text-center py-20 text-zinc-500 animate-pulse">Carregando episódios...</div>
                        ) : (
                            podcasts.map((pod) => (
                                <div key={pod.audioUrl} className="group relative bg-zinc-900/40 border border-white/5 hover:border-premium-gold/30 rounded-2xl p-3 lg:p-6 transition-all flex flex-row gap-4 lg:gap-6 items-center">

                                    {/* Image & Play Button */}
                                    <div className="relative flex-shrink-0 w-20 h-20 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-zinc-800 shadow-xl">
                                        <img src={pod.imageUrl || "https://s2-ge.glbimg.com/filters:format(jpg)/https://s2.glbimg.com/w1i2X45b1k82y9k1245b1k82y9k=/0x0:1080x1080/1080x1080/s.glbimg.com/es/ge/f/original/2019/07/26/ge_botafogo.jpg"} alt={pod.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                                        <button
                                            onClick={() => togglePlay(pod.audioUrl)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors backdrop-blur-[2px]"
                                        >
                                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ${isPlaying === pod.audioUrl ? 'bg-premium-gold scale-100' : 'bg-white/90 scale-90 group-hover:scale-100 group-hover:bg-premium-gold'}`}>
                                                {isPlaying === pod.audioUrl ? <Pause size={16} lg:size={20} fill="black" className="text-black" /> : <Play size={16} lg:size={20} fill="black" className="ml-1 text-black" />}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                                            <span className="hidden lg:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 uppercase tracking-wider border border-white/5">
                                                EPISÓDIO RECENTE
                                            </span>
                                            <span className="text-[10px] lg:text-[11px] font-bold text-premium-gold/80 uppercase tracking-widest">
                                                {new Date(pod.pubDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h2 className="text-sm lg:text-xl font-bold text-white mb-1 lg:mb-2 leading-tight group-hover:text-premium-gold transition-colors line-clamp-2">
                                            {pod.title}
                                        </h2>

                                        <p className="hidden lg:block text-sm text-zinc-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                            {pod.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
