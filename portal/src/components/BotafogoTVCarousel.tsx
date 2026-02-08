'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Tv, MonitorPlay, Hand, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';
import { getSafeImageSrc } from '@/lib/images';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    is_live?: boolean;
}

interface BotafogoTVCarouselProps {
    videos: VideoItem[];
    className?: string;
}

export default function BotafogoTVCarousel({ videos, className }: BotafogoTVCarouselProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    // Sort: Live first, then by date (if date strings are comparable)
    const sortedVideos = [...videos].sort((a, b) => {
        if (a.is_live && !b.is_live) return -1;
        if (!a.is_live && b.is_live) return 1;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    const hasLive = videos.some(v => v.is_live);

    // Robust Video ID extraction (YouTube & GloboPlay)
    const getVideoId = (url: string) => {
        try {
            if (!url) return null;

            // Check if it's already just an ID (numeric for GloboPlay or 11 chars for YT)
            if (/^\d+$/.test(url)) return url; // GloboPlay ID
            if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url; // YouTube ID

            // GloboPlay URL
            if (url.includes('globoplay.globo.com')) {
                const match = url.match(/\/v\/(\d+)/);
                return match ? match[1] : null;
            }

            // YouTube URL
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        } catch (e) {
            console.error('Error parsing video URL:', url, e);
            return null;
        }
    };

    const handleVideoClick = (video: VideoItem) => {
        const videoId = getVideoId(video.url);
        if (videoId) {
            setSelectedVideoId(videoId);
        } else {
            console.warn('Could not extract video ID from URL:', video.url);
        }
    };

    return (
        <section className={cn(
            "relative w-full mb-6 pt-4",
            className
        )}>
            {/* Premium Header with Glassmorphism & Animated Border */}
            <div className="flex items-center justify-between px-4 lg:px-0 mb-8">
                <motion.div
                    className="relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-ultra border border-white/10 shadow-2xl overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/10 via-premium-gold/20 to-premium-gold/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer-gold"
                        style={{ backgroundSize: '200% 100%' }}
                    />

                    {/* Animated Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80" />

                    {/* Live Indicator - Enhanced */}
                    <div className="relative flex h-3 w-3 z-10">
                        {hasLive && (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/30 blur-md"></span>
                            </>
                        )}
                        <span className={cn(
                            "relative inline-flex rounded-full h-3 w-3 shadow-[0_0_10px_rgba(239,68,68,0.6)]",
                            hasLive ? "bg-red-600" : "bg-zinc-700"
                        )}></span>
                    </div>

                    {/* Title with Glow Effect */}
                    <span className="relative text-sm md:text-base font-black text-white tracking-[0.2em] uppercase z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        GLORIOSO <span className="text-premium-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">TV</span>
                    </span>

                    {/* Sparkle Icon */}
                    <Sparkles size={16} className="text-premium-gold z-10 animate-glow-pulse" />
                </motion.div>

                <Link
                    href="/videos"
                    className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-premium-gold transition-all duration-300 group overflow-hidden glass-ultra hover:border-premium-gold/20 border border-transparent"
                >
                    <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Ver todos</span>
                    <MonitorPlay size={16} className="relative z-10 group-hover:scale-110 transition-transform" />
                </Link>
            </div>

            {/* Ultra Premium Carousel */}
            <div className="relative group/carousel">
                {/* Drag Hint Overlay */}
                <DragHint />

                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 lg:px-0 gap-6 pb-8">
                    {sortedVideos.length > 0 ? (
                        sortedVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleVideoClick(video)}
                                className="shrink-0 w-[85vw] lg:w-80 aspect-video relative rounded-3xl overflow-hidden cursor-pointer group snap-center lg:snap-start shadow-2xl hover:shadow-premium-gold/40 transition-all duration-500"
                            >
                                {/* Multi-Layer Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/30 via-white/10 to-premium-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] rounded-3xl">
                                    <div className="w-full h-full bg-black rounded-3xl" />
                                </div>

                                {/* Image Container with Enhanced Effects */}
                                <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 group-hover:border-premium-gold/40 transition-colors duration-500">
                                    <Image
                                        src={getSafeImageSrc(video.thumbnail)}
                                        alt={video.title}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 85vw, 320px"
                                        className="object-cover transition-all duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                                    />

                                    {/* Lighter Gradient - Bottom Only */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </div>

                                {/* Live Badge - Ultra Premium */}
                                {video.is_live && (
                                    <motion.div
                                        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full glass-ultra border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                                        animate={{
                                            boxShadow: [
                                                "0 0 20px rgba(239, 68, 68, 0.6)",
                                                "0 0 30px rgba(239, 68, 68, 0.9)",
                                                "0 0 20px rgba(239, 68, 68, 0.6)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">AO VIVO</span>
                                    </motion.div>
                                )}

                                {/* Trending Badge for First Video */}
                                {index === 0 && !video.is_live && (
                                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-premium-gold border border-black/20 shadow-gold-glow">
                                        <TrendingUp size={12} className="text-black" />
                                        <span className="text-[10px] font-black text-black uppercase tracking-wider">Em Alta</span>
                                    </div>
                                )}

                                {/* Premium Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <motion.div
                                        className="relative w-16 h-16 rounded-full glass-ultra border-2 border-white/30 flex items-center justify-center group-hover:bg-premium-gold group-hover:border-premium-gold transition-all duration-300 shadow-2xl"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {/* Glow rings */}
                                        <div className="absolute inset-0 rounded-full bg-premium-gold/20 blur-xl group-hover:bg-premium-gold/40 transition-all duration-300" />
                                        <div className="absolute inset-0 rounded-full border border-premium-gold/30 opacity-0 group-hover:opacity-100 animate-ping" />

                                        <Play size={22} className="fill-white group-hover:fill-black text-white group-hover:text-black ml-1 transition-all duration-300 relative z-10 drop-shadow-lg" />
                                    </motion.div>
                                </div>

                                {/* Content Footer - Enhanced */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                                    <h4 className="text-sm md:text-base font-black text-white leading-tight line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:text-premium-gold transition-colors mb-2">
                                        {video.title}
                                    </h4>
                                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-ultra border border-white/10">
                                            <Tv size={11} className="text-premium-gold" />
                                            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
                                                Assista Agora
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                            </motion.div>
                        ))
                    ) : (
                        [1, 2, 3].map((_, i) => (
                            <div key={i} className="shrink-0 w-[85vw] lg:w-80 aspect-video relative rounded-3xl overflow-hidden glass-ultra border border-white/5 flex items-center justify-center animate-pulse">
                                <Tv size={32} className="text-zinc-800" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideoId && (
                    <VideoModal
                        videoId={selectedVideoId}
                        onClose={() => setSelectedVideoId(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function DragHint() {
    const [visible, setVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hasShown) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasShown) {
                    setVisible(true);
                    setHasShown(true);
                    setTimeout(() => setVisible(false), 6000);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasShown]);

    return (
        <>
            <div ref={ref} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />

            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none lg:hidden"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <motion.div
                                animate={{ x: [-25, 25, -25] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                className="w-14 h-14 rounded-full glass-ultra border-2 border-premium-gold/40 flex items-center justify-center shadow-gold-glow"
                            >
                                <Hand size={26} className="text-premium-gold fill-premium-gold/20" />
                            </motion.div>
                            <motion.span
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="text-xs font-black text-white uppercase tracking-widest glass-ultra px-4 py-2 rounded-full border border-premium-gold/20 shadow-lg"
                            >
                                ← Arraste →
                            </motion.span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
