'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, X, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    // Extract video ID from URL for embed
    const getEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    return (
        <section className={cn(
            "relative overflow-hidden rounded-none md:rounded-2xl border-y md:border border-premium-gold/30 dark:border-premium-gold/20 bg-card shadow-xl -mx-4 md:mx-0",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-red-600/5 dark:from-black/40 dark:to-red-900/10" />

            {/* Header */}
            <div className="relative p-4 pb-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-red-600/10 border border-red-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                    </div>
                    <span className="text-[10px] lg:text-xs font-black text-foreground uppercase tracking-[0.2em] drop-shadow-sm">
                        Botafogo <span className="text-red-500">TV</span>
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-50">
                    <Tv size={14} className="text-foreground" />
                </div>
            </div>

            {/* Carousel */}
            <div className="relative z-10 pb-5">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-3">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <motion.div
                                key={video.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedVideo(video)}
                                className="shrink-0 w-64 aspect-video relative rounded-xl overflow-hidden border border-white/5 bg-zinc-900/80 cursor-pointer group snap-center"
                            >
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    sizes="(max-width: 768px) 256px, 300px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-premium-gold/90 text-black flex items-center justify-center shadow-lg shadow-black/50 transform group-hover:scale-110 transition-transform duration-300">
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-[10px] font-bold text-white leading-tight line-clamp-2 drop-shadow-lg group-hover:text-premium-gold transition-colors">
                                        {video.title}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        [1, 2, 3].map((_, i) => (
                            <div key={i} className="shrink-0 w-64 aspect-video relative rounded-xl overflow-hidden bg-zinc-900/50 border border-white/5 flex items-center justify-center animate-pulse">
                                <Tv size={24} className="text-zinc-700" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    >
                        <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 bg-zinc-900/80 border-b border-zinc-800">
                                <h3 className="text-sm font-bold text-white line-clamp-1 pr-4">{selectedVideo.title}</h3>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Video Player */}
                            <div className="aspect-video w-full bg-black">
                                <iframe
                                    src={getEmbedUrl(selectedVideo.url)}
                                    title={selectedVideo.title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        {/* Backdrop Click to Close */}
                        <div
                            className="absolute inset-0 -z-10"
                            onClick={() => setSelectedVideo(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
