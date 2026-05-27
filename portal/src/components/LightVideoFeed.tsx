"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, MoreHorizontal } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import LightVideoPlayer from './LightVideoPlayer';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
}

interface LightVideoFeedProps {
    videos: VideoItem[];
}

export default function LightVideoFeed({ videos }: LightVideoFeedProps) {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    // Mock functions to generate realistic data based on the video ID/Date
    const getMockViews = (id: string) => {
        const hash = id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        const views = Math.abs(hash % 900) + 10;
        return `${views} mil visualizações`;
    };

    const getMockTimeAgo = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
            
            if (diffDays === 0) return 'hoje';
            if (diffDays === 1) return 'há 1 dia';
            if (diffDays < 7) return `há ${diffDays} dias`;
            if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays/7) > 1 ? 's' : ''}`;
            if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays/30) > 1 ? 'es' : ''}`;
            return `há ${Math.floor(diffDays / 365)} ano${Math.floor(diffDays/365) > 1 ? 's' : ''}`;
        } catch {
            return 'recentemente';
        }
    };

    return (
        <div className="w-full min-h-screen bg-white font-sans pb-24">
            {/* Top Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-zinc-100">
                <div className="flex items-center gap-1">
                    <Search size={22} className="text-zinc-800" />
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 border border-zinc-300">
                    <Image src="/images/avatar.png" alt="Avatar" width={32} height={32} className="object-cover" />
                </div>
            </div>

            {/* Video List */}
            <div className="flex flex-col gap-6 pt-4">
                {videos.map(video => (
                    <div key={video.id} className="flex flex-col cursor-pointer" onClick={() => setSelectedVideo(video)}>
                        {/* Thumbnail */}
                        <div className="relative w-full aspect-video bg-zinc-200 overflow-hidden mb-3">
                            <Image 
                                src={getSafeImageSrc(video.thumbnail)} 
                                alt={video.title}
                                fill
                                className="object-cover"
                            />
                            {/* Mock Duration Badge */}
                            <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                                {Math.floor(Math.random() * 10) + 2}:{Math.floor(Math.random() * 50) + 10}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="px-4 flex gap-3">
                            {/* Channel Avatar */}
                            <div className="flex-shrink-0 pt-1">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <Image src="/images/botafogo-logo.png" alt="Botafogo" width={40} height={40} className="object-cover p-1" />
                                </div>
                            </div>
                            
                            {/* Text Info */}
                            <div className="flex-1 pr-2">
                                <h3 className="text-[15px] font-semibold text-zinc-900 leading-snug line-clamp-2 mb-1">
                                    {video.title}
                                </h3>
                                <div className="flex items-center gap-1 text-[12px] text-zinc-500">
                                    <span>{getMockViews(video.id)}</span>
                                    <span>•</span>
                                    <span>{getMockTimeAgo(video.published_at)}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[12px] font-medium text-zinc-600">Botafogo TV</span>
                                    <button className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" onClick={(e) => { e.stopPropagation(); }}>
                                        Inscrever-se
                                    </button>
                                </div>
                            </div>
                            
                            {/* More Options */}
                            <div className="flex-shrink-0 pt-1 text-zinc-500" onClick={(e) => { e.stopPropagation(); }}>
                                <MoreHorizontal size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal/Screen */}
            {selectedVideo && (
                <LightVideoPlayer 
                    video={selectedVideo} 
                    allVideos={videos.filter(v => v.id !== selectedVideo.id)}
                    onClose={() => setSelectedVideo(null)} 
                />
            )}
        </div>
    );
}
