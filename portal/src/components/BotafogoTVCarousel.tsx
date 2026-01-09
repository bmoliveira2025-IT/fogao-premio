'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, X, Tv, MonitorPlay } from 'lucide-react';
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
            "relative overflow-hidden rounded-none md:rounded-2xl border-y md:border border-white/5 bg-zinc-950/80 shadow-2xl w-[calc(100%+2rem)] -ml-4 md:w-auto md:ml-0 md:mx-0",
            className
        )}>
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900/50 to-black pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
                <div className="flex items-center gap-3">
                    {/* Live Dot/Icon */}
                    <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
                    </div>

                    {/* Title Badge matching reference */}
                    <div className="bg-premium-gold px-2 py-0.5 rounded-sm">
                        <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-[0.15em]">
                            Botafogo TV
                        </span>
                    </div>
                </div>

                <MonitorPlay size={16} className="text-zinc-600" />
            </div>

            {/* Carousel */}
            <div className="relative z-10 pb-6 pt-2">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <motion.div
                                key={video.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedVideo(video)}
                                className="shrink-0 w-72 aspect-video relative rounded-xl overflow-hidden cursor-pointer group snap-center shadow-lg border border-white/5 bg-zinc-900"
                            >
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    sizes="(max-width: 768px) 288px, 320px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                                {/* Play Button (Centered & Gold) */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-premium-gold text-black flex items-center justify-center shadow-lg shadow-black/50 transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                                        <Play size={18} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    {/* <span className="inline-block px-1.5 py-0.5 mb-1.5 rounded-[2px] bg-blue-600/80 text-[8px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                                        Novo
                                    </span> */}
                                    <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 drop-shadow-md group-hover:text-premium-gold transition-colors">
                                        {video.title}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        [1, 2, 3].map((_, i) => (
                            <div key={i} className="shrink-0 w-72 aspect-video relative rounded-xl overflow-hidden bg-zinc-900/50 border border-white/5 flex items-center justify-center animate-pulse">
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
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    >
                        <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 bg-zinc-900/80 border-b border-zinc-800">
                                <h3 className="text-xs lg:text-sm font-bold text-white line-clamp-1 pr-4">{selectedVideo.title}</h3>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors"
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
