'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Calendar, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
}

interface VideoGridProps {
    videos: VideoItem[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    // Reuse ID extraction logic (or ideally move to utils, but copying for safety now)
    const getVideoId = (url: string) => {
        try {
            if (!url) return null;
            if (/^\d+$/.test(url)) return url;
            if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
            if (url.includes('globoplay.globo.com')) {
                const match = url.match(/\/v\/(\d+)/);
                return match ? match[1] : null;
            }
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        } catch (e) {
            return null;
        }
    };

    const handleVideoClick = (video: VideoItem) => {
        const videoId = getVideoId(video.url);
        if (videoId) setSelectedVideoId(videoId);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return '';
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {videos.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        onClick={() => handleVideoClick(video)}
                        className="group relative aspect-video bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-white/5 shadow-lg hover:shadow-premium-gold/20 hover:border-premium-gold/30 transition-all duration-300"
                    >
                        {/* Thumbnail */}
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-premium-gold/90 text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <Play size={20} className="ml-1 fill-current" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-bold text-premium-gold uppercase tracking-wider">
                                    {video.source || 'Botafogo TV'}
                                </span>
                                {video.published_at && (
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                        <Calendar size={10} />
                                        {formatDate(video.published_at)}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-md group-hover:text-premium-gold transition-colors">
                                {video.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedVideoId && (
                    <VideoModal
                        videoId={selectedVideoId}
                        onClose={() => setSelectedVideoId(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
