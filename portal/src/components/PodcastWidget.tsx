'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Mic, ChevronRight, Hand } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PodcastItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    audioUrl: string;
    imageUrl: string;
}

export default function PodcastWidget() {
    const { preferences } = useAuth();
    const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<string | null>(null); // URL of playing audio

    useEffect(() => {
        async function fetchPodcasts() {
            try {
                const res = await fetch('/api/podcasts');
                const data = await res.json();
                if (data.items) setPodcasts(data.items);
            } catch (err) {
                console.error("Failed to load podcasts", err);
            } finally {
                setLoading(false);
            }
        }

        if (preferences?.podcasts) {
            fetchPodcasts();
        }
    }, [preferences]);

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
                // Auto-play was prevented or interrupted (AbortError)
                // We can ignore this error as it usually means the user 
                // paused/switched tracks quickly.
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

    if (!preferences?.podcasts || podcasts.length === 0) return null;

    return (
        <section className="mt-8 mb-0 lg:mb-12">
            <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
                <h3 className="text-[19px] font-black uppercase tracking-tight flex items-center gap-2">
                    <Mic className="text-premium-gold" size={20} />
                    Podcast 360
                </h3>
                <Link href="/podcasts" className="text-[13px] font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                    VER TODOS <ChevronRight size={14} />
                </Link>
            </div>

            <div className="relative group/carousel">
                {/* Drag Hint Overlay */}
                <DragHint />

                <div className="flex gap-4 overflow-x-auto pb-4 px-4 lg:px-0 snap-x hide-scrollbar">
                    {podcasts.map((pod, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={pod.audioUrl}
                            className="flex-shrink-0 w-[85vw] lg:w-72 bg-zinc-900/50 border border-white/5 rounded-2xl p-3 lg:p-4 snap-center lg:snap-start hover:border-premium-gold/30 transition-all group"
                        >
                            <div className="relative aspect-video lg:aspect-square rounded-xl overflow-hidden mb-3 lg:mb-4 bg-zinc-800">
                                <img src={pod.imageUrl || "https://s2-ge.glbimg.com/filters:format(jpg)/https://s2.glbimg.com/w1i2X45b1k82y9k1245b1k82y9k=/0x0:1080x1080/1080x1080/s.glbimg.com/es/ge/f/original/2019/07/26/ge_botafogo.jpg"} alt={pod.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                                <button
                                    onClick={() => togglePlay(pod.audioUrl)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 lg:opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                >
                                    <div className="w-12 h-12 lg:w-12 lg:h-12 rounded-full bg-premium-gold text-black flex items-center justify-center shadow-lg transform scale-100 lg:scale-90 group-hover:scale-100 transition-transform">
                                        {isPlaying === pod.audioUrl ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-1" />}
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-1 lg:space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] lg:text-[11px] font-bold text-premium-gold uppercase tracking-wider">{new Date(pod.pubDate).toLocaleDateString()}</span>
                                    {/* Mobile Scroll Hint (Visible on first item) */}
                                    {/* Mobile Scroll Hint Removed - Replaced by Global DragHint */}
                                </div>
                                <h4 className="text-[14px] lg:text-[15px] font-bold text-white leading-tight line-clamp-2 min-h-[auto] lg:min-h-[2.5rem]">{pod.title}</h4>
                                <p className="text-[11px] lg:text-[12px] text-zinc-400 line-clamp-2">{pod.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DragHint() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 6000); // 6 seconds
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none lg:hidden"
        >
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl"
                >
                    <Hand size={24} className="text-white fill-white/20" />
                </motion.div>
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"
                >
                    Arraste
                </motion.span>
            </div>
        </motion.div>
    );
}
