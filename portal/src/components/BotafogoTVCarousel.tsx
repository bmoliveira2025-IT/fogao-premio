'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Tv, MonitorPlay } from 'lucide-react';
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
            "relative overflow-hidden rounded-none md:rounded-2xl border-b md:border border-white/5 bg-zinc-950/80 shadow-2xl w-[calc(100%+2rem)] -ml-4 md:w-auto md:ml-0 md:mx-0",
            className
        )}>
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900/50 to-black pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-0 pb-1">
                <div className="flex items-center gap-2">
                    {/* Live Dot/Icon */}
                    <div className="w-6 h-6 rounded-full bg-red-900/20 border border-red-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
                    </div>

                    {/* Title - Typographic Premium Style */}
                    <div>
                        <span className="text-[13px] md:text-[15px] font-black text-white italic tracking-widest uppercase shadow-black drop-shadow-md">
                            GLORIOSO <span className="text-premium-gold">TV</span>
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
                                onClick={() => handleVideoClick(video)}
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
                                    <p className="text-[12px] font-bold text-white leading-tight line-clamp-2 drop-shadow-md group-hover:text-premium-gold transition-colors">
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
