"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, Share2, PlusSquare, ChevronDown, Bell, Check, Maximize2, X } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import CompactNewsRow from './CompactNewsRow';

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
}

interface LightVideoPlayerProps {
    video: VideoItem;
    allVideos: VideoItem[];
    recommendedNews?: NewsItem[];
    onClose: () => void;
    onVideoSelect: (video: VideoItem) => void;
    isSubscribed: boolean;
    onSubscribeChange: (subscribed: boolean) => void;
}

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
    likes_count?: number;
    dislikes_count?: number;
}

const getVideoDuration = (id: string) => {
    const hash = Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0);
    return `${(hash % 10) + 2}:${String((hash % 50) + 10).padStart(2, '0')}`;
};

export default function LightVideoPlayer({ video, allVideos, recommendedNews = [], onClose, onVideoSelect, isSubscribed, onSubscribeChange }: LightVideoPlayerProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const selectVideo = (nextVideo: VideoItem) => {
        setIsLiked(false);
        setIsDisliked(false);
        setIsSaved(false);
        setIsMinimized(false);
        onVideoSelect(nextVideo);
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) setIsDisliked(false);
    };

    const handleDislike = () => {
        setIsDisliked(!isDisliked);
        if (!isDisliked) setIsLiked(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: video.title,
                    url: video.url || window.location.href,
                });
            } catch (err) {
                console.error("Error sharing", err);
            }
        } else {
            alert("Compartilhar: " + video.url);
        }
    };
    
    // Prevent background scrolling ONLY when player is expanded
    useEffect(() => {
        if (!isMinimized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMinimized]);

    // Extract video ID for iframe
    const getVideoId = (url: string) => {
        try {
            if (!url) return null;
            if (/^\d+$/.test(url)) return url;
            if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        } catch {
            return null;
        }
    };

    const youtubeId = getVideoId(video.url);

    const getMockViewsAndDate = (id: string, dateStr: string) => {
        const hash = id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        const views = (Math.abs(hash % 900) + 10).toLocaleString('pt-BR');
        
        let dateFormatted = '';
        try {
            dateFormatted = new Date(dateStr).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            dateFormatted = 'Hoje';
        }

        return `${views},000 visualizações • ${dateFormatted}`;
    };    return (
        <div
            className={
                isMinimized
                    ? "fixed bottom-20 right-3.5 z-[55] w-72 sm:w-80 bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/80 dark:border-white/20 animate-in slide-in-from-bottom-5 duration-300"
                    : "fixed inset-0 z-[60] bg-white flex flex-col font-sans animate-in slide-in-from-bottom-full duration-300"
            }
        >
            {/* Header Bar for Minimized View */}
            {isMinimized && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 text-white text-xs">
                    <span className="font-bold truncate max-w-[180px]">{video.title}</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(false)}
                            className="p-1 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            title="Maximizar vídeo"
                        >
                            <Maximize2 size={14} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 text-zinc-300 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                            title="Fechar janela do vídeo"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Video Player Area - Preserved in DOM tree so playback never resets */}
            <div className="w-full aspect-video bg-black relative flex-shrink-0">
                {youtubeId ? (
                    <iframe
                        key={youtubeId}
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                        className="w-full h-full"
                        title={video.title}
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                        Vídeo indisponível
                    </div>
                )}
            </div>

            {/* Scrollable Content (Only rendered when player is full screen) */}
            {!isMinimized && (
                <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain pb-[calc(4rem+env(safe-area-inset-bottom))]">
                    {/* Header & Title */}
                    <div className="px-4 pt-3 pb-3 border-b border-zinc-100">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-[16px] font-semibold text-zinc-900 leading-tight">
                                {video.title}
                            </h1>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold"
                                    title="Minimizar vídeo"
                                >
                                    <ChevronDown size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-zinc-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                    title="Fechar vídeo"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[12px] text-zinc-500 mt-1.5">
                            {getMockViewsAndDate(video.id, video.published_at)}
                        </p>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between mt-2.5">
                            <button onClick={handleLike} className={`flex flex-col items-center gap-1.5 ${isLiked ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-blue-500 text-white' : 'hover:bg-zinc-100 text-zinc-700'}`}>
                                    <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />
                                </div>
                                <span className="text-[11px] font-medium">67K</span>
                            </button>
                            <button onClick={handleDislike} className={`flex flex-col items-center gap-1.5 ${isDisliked ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDisliked ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-100 text-zinc-700'}`}>
                                    <ThumbsDown size={18} className={isDisliked ? "fill-current" : ""} />
                                </div>
                                <span className="text-[11px] font-medium">2.3K</span>
                            </button>
                            <button onClick={handleShare} className="flex flex-col items-center gap-1.5 text-zinc-700">
                                <div className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors">
                                    <Share2 size={18} />
                                </div>
                                <span className="text-[11px] font-medium">Compartilhar</span>
                            </button>
                            <button onClick={() => setIsSaved(!isSaved)} className={`flex flex-col items-center gap-1.5 ${isSaved ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-100 text-zinc-700'}`}>
                                    {isSaved ? <Check size={18} /> : <PlusSquare size={18} />}
                                </div>
                                <span className="text-[11px] font-medium">{isSaved ? 'Salvo' : 'Salvar'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Channel Info */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold text-lg flex items-center justify-center overflow-hidden uppercase">
                                {(video.source || 'Botafogo TV').charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-[14px] font-semibold text-zinc-900 truncate max-w-[150px]">{video.source || 'Botafogo TV'}</h3>
                                <p className="text-[12px] text-zinc-500">3,020,172 inscritos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {isSubscribed ? (
                                <button 
                                    className="flex items-center gap-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors text-[13px] font-medium px-4 py-2 rounded-full"
                                    onClick={() => onSubscribeChange(false)}
                                >
                                    <Bell size={16} className="fill-current" />
                                    Inscrito
                                    <ChevronDown size={14} />
                                </button>
                            ) : (
                                <button 
                                    className="bg-red-600 text-white hover:bg-red-700 transition-colors text-[13px] font-medium px-4 py-2 rounded-full"
                                    onClick={() => onSubscribeChange(true)}
                                >
                                    Inscrever-se
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Up Next Section */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[14px] font-bold text-zinc-900">Próximos vídeos</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Autoplay</span>
                                <div className="w-8 h-4 rounded-full bg-blue-500 relative">
                                    <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4">
                            {allVideos.slice(0, 10).map(v => (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => selectVideo(v)}
                                    className="w-[160px] flex-shrink-0 flex flex-col gap-2 cursor-pointer text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    aria-label={`Reproduzir ${v.title}`}
                                >
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-100">
                                        <Image 
                                            src={getSafeImageSrc(v.thumbnail)} 
                                            alt={v.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 rounded">
                                            {getVideoDuration(v.id)}
                                        </div>
                                    </div>
                                    <h4 className="text-[12px] font-semibold text-zinc-900 line-clamp-2 leading-tight">
                                        {v.title}
                                    </h4>
                                    <p className="text-[11px] text-zinc-500 truncate">{v.source || 'Botafogo TV'}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {recommendedNews.length > 0 && (
                        <section className="px-4 pt-4 pb-6 border-t border-zinc-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[17px] font-bold text-zinc-900">Notícias para você</h3>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Fogão 360</span>
                            </div>
                            <div className="space-y-1">
                                {recommendedNews.slice(0, 4).map(news => (
                                    <CompactNewsRow key={news.id} article={news} dense />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
