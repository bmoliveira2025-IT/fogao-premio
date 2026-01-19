'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Tv, MonitorPlay, Hand } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
}

interface BotafogoTVCarouselProps {
    videos: VideoItem[];
    className?: string;
}

export default function BotafogoTVCarousel({ videos, className }: BotafogoTVCarouselProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

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
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
            console.warn('Could not extract video ID from URL:', video.url, 'Using full URL as fallback if possible or failing.');
            // Fallback: if we can't parse it but it's not empty, maybe pass it through? 
            // VideoModal might not handle it well if it's a full URL, but better than nothing?
            // Actually, let's try to pass it if it looks kinda valid? 
            // For now, strict on ID but with better parsers.
        }
    };

    return (
        <section className={cn(
            "relative w-full mb-8 pt-4",
            className
        )}>
            {/* Header - Glass Pill Centered/Left */}
            <div className="flex items-center justify-between px-4 lg:px-0 mb-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-2xl">
                    {/* Live Dot */}
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </div>

                    <span className="text-[13px] md:text-[14px] font-black text-white tracking-[0.2em] uppercase">
                        Glorioso <span className="text-premium-gold">TV</span>
                    </span>
                </div>

                <Link href="/videos" className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer group">
                    Ver todos <MonitorPlay size={14} className="group-hover:text-premium-gold transition-colors" />
                </Link>
            </div>

            {/* Cinematic Carousel */}
            <div className="relative group/carousel">
                {/* Drag Hint Overlay */}
                <DragHint />

                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 lg:px-0 gap-4 pb-8">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <motion.div
                                key={video.id}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleVideoClick(video)}
                                className="shrink-0 w-[85vw] lg:w-72 aspect-video relative rounded-2xl overflow-hidden cursor-pointer group snap-center lg:snap-start border border-white/5 bg-zinc-900 shadow-2xl hover:shadow-premium-gold/20 hover:border-premium-gold/30 transition-all duration-300"
                            >
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    sizes="(max-width: 768px) 280px, 320px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />

                                {/* Cinematic Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Play Button - Minimal Glass */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-premium-gold group-hover:border-premium-gold transition-colors duration-300 shadow-xl">
                                        <Play size={20} className="fill-white group-hover:fill-black text-white group-hover:text-black ml-1 transition-colors duration-300" />
                                    </div>
                                </div>

                                {/* Source Badge (If available) & Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                    <h4 className="text-[13px] md:text-[14px] font-bold text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-premium-gold transition-colors mb-1">
                                        {video.title}
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                                        <Tv size={10} />
                                        Assista agora
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        [1, 2, 3].map((_, i) => (
                            <div key={i} className="shrink-0 w-[85vw] md:w-[450px] aspect-video relative rounded-2xl overflow-hidden bg-zinc-900/30 border border-white/5 flex items-center justify-center animate-pulse">
                                <Tv size={24} className="text-zinc-800" />
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
        if (hasShown) return; // Only show once per session

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasShown) {
                    setVisible(true);
                    setHasShown(true);

                    // Hide after 12 seconds
                    setTimeout(() => setVisible(false), 12000);
                }
            },
            { threshold: 0.3 } // Show when 30% visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasShown]);

    if (!visible) return null;

    return (
        <motion.div
            ref={ref}
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
