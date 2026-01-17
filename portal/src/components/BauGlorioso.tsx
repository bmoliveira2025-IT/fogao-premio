"use client";

import { PlayCircle, Tv } from 'lucide-react';
import { HISTORICAL_MATCHES } from '@/data/premium-content';
import { useState } from 'react';
import VideoModal from '@/components/VideoModal';

export default function BauGlorioso() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handleVideoSelect = (match: any) => {
        // GloboPlay Security Check: Force new tab to avoid "Connection Refused" (X-Frame-Options)
        if (match.url && (match.url.includes('globoplay') || match.url.includes('globo.com'))) {
            window.open(match.url, '_blank');
            return;
        }

        // YouTube & Generic Handling
        if (match.videoId && match.videoId !== '' && match.videoId.length < 15) { // Assuming IDs are short, urls are long
            // Simple valid ID check
            setSelectedVideo(match.videoId);
        } else if (match.url && match.url.includes('youtube.com')) {
            try {
                const url = new URL(match.url);
                const v = url.searchParams.get('v');
                if (v) {
                    setSelectedVideo(v);
                } else {
                    window.open(match.url, '_blank');
                }
            } catch (e) {
                window.open(match.url, '_blank');
            }
        } else {
            // Fallback
            match.url ? window.open(match.url, '_blank') : null;
        }
    };

    return (
        <div className="mb-12">
            <h3 className="text-xl font-display font-medium text-white mb-6 flex items-center gap-2">
                <Tv className="text-premium-gold" size={20} />
                <span className="text-premium-gold">Baú</span> Glorioso
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HISTORICAL_MATCHES.map((match) => (
                    <div key={match.id} className="group bg-zinc-900/40 border border-white/5 hover:border-premium-gold/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-premium-gold/5 flex flex-col">

                        {/* Thumbnail Container */}
                        <div
                            className="relative h-48 w-full overflow-hidden cursor-pointer"
                            onClick={() => handleVideoSelect(match)}
                        >
                            <img
                                src={match.thumbnail}
                                alt={match.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-premium-gold/20 backdrop-blur-sm border border-premium-gold/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircle size={24} className="text-premium-gold fill-premium-gold/20" />
                                </div>
                            </div>

                            {/* Date Badge */}
                            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] font-bold text-zinc-300 border border-white/10">
                                {match.date}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                            <h4 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-premium-gold transition-colors">{match.title}</h4>
                            <p className="text-xs font-medium text-premium-gold/80 mb-3 uppercase tracking-wider">{match.subtitle}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">
                                {match.description}
                            </p>

                            <button
                                onClick={() => handleVideoSelect(match)}
                                className="mt-auto w-full py-2.5 rounded-lg bg-white/5 hover:bg-premium-gold hover:text-black border border-white/10 hover:border-premium-gold transition-all duration-300 text-xs font-black uppercase tracking-widest text-center"
                            >
                                Assistir Jogo
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    videoId={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    );
}
