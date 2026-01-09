'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
}

export default function BotafogoTVCarousel({ videos }: { videos: VideoItem[] }) {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    // Extract video ID from URL for embed
    // URL format: https://www.youtube.com/watch?v=VIDEO_ID
    const getEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    return (
        <section>
            <div className="flex items-center space-x-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Botafogo TV</h3>
            </div>

            <div className="flex overflow-x-auto space-x-3 pb-4 no-scrollbar -mx-5 px-5">
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="shrink-0 w-48 aspect-video relative rounded-lg overflow-hidden bg-foreground/5 border border-premium-gold/15 group cursor-pointer"
                        >
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                sizes="(max-width: 768px) 192px, 250px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-premium-gold flex items-center justify-center text-black shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                    <Play size={12} fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="text-[9px] font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                                    {video.title}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    [1, 2, 3].map((_, i) => (
                        <div key={i} className="shrink-0 w-48 aspect-video relative rounded-lg overflow-hidden bg-foreground/5 border border-premium-gold/15 group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-[9px] text-foreground/30">Carregando vídeos...</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-premium-gold/15">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Video Player */}
                        <div className="aspect-video w-full">
                            <iframe
                                src={getEmbedUrl(selectedVideo.url)}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        <div className="p-4 bg-zinc-900/50">
                            <h3 className="text-lg font-bold text-white">{selectedVideo.title}</h3>
                        </div>
                    </div>

                    {/* Backdrop Click to Close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setSelectedVideo(null)}
                    />
                </div>
            )}
        </section>
    );
}
