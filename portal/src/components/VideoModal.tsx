"use client";

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
    videoId: string;
    onClose: () => void;
}

export default function VideoModal({ videoId, onClose }: VideoModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const isNumericId = videoId.length > 5 && !isNaN(Number(videoId));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-label="Close modal"
            ></div>

            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-premium-gold/20 text-white/70 hover:text-premium-gold transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Video Embed */}
                <div className="aspect-video w-full">
                    {isNumericId ? (
                        // GloboPlay Embed (Best Guess Format: /v/{id}/iframe/)
                        <iframe
                            className="w-full h-full"
                            src={`https://globoplay.globo.com/v/${videoId}/iframe/`}
                            title="GloboPlay video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        // YouTube Embed
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}
