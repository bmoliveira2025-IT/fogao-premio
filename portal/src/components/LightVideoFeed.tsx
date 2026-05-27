"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MoreHorizontal, User, Check, Bell, Cast, Youtube, Settings, HelpCircle, LogOut, Crown, Bookmark } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import LightVideoPlayer from './LightVideoPlayer';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

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
    const router = useRouter();
    const { user } = useAuth();
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [subscribedChannels, setSubscribedChannels] = useState<Record<string, boolean>>({});
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getChannelName = (source?: string) => source || 'Botafogo TV';

    const toggleSubscribe = (channel: string) => {
        setSubscribedChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

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
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 border-b border-zinc-100">
                {/* Left: Logo */}
                <div className="flex items-center gap-1.5">
                    <Youtube size={26} className="text-red-600" />
                    <span className="text-[18px] font-semibold tracking-tight text-zinc-900" style={{ letterSpacing: '-0.5px' }}>Vídeos</span>
                </div>
                
                {/* Right: Icons */}
                <div className="flex items-center gap-2 md:gap-4 relative" ref={menuRef}>
                    <button onClick={() => alert('Procurando dispositivos (Chromecast, Smart TV)...')} className="p-1.5 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors" title="Transmitir">
                        <Cast size={20} className="stroke-[1.5]" />
                    </button>
                    <button onClick={() => alert('Você não tem novas notificações.')} className="p-1.5 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors" title="Notificações">
                        <Bell size={20} className="stroke-[1.5]" />
                    </button>
                    <button onClick={() => alert('Pesquisa de vídeos em breve.')} className="p-1.5 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors" title="Pesquisar">
                        <Search size={20} className="stroke-[1.5]" />
                    </button>
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-200 text-white font-bold flex items-center justify-center ml-1 hover:bg-zinc-700 transition-colors overflow-hidden" title="Conta">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[14px]">{(user?.displayName || user?.email || 'B').charAt(0).toUpperCase()}</span>
                        )}
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-3">
                                {user?.photoURL ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-200 text-white font-bold flex flex-shrink-0 items-center justify-center">
                                        <span className="text-[18px]">{(user?.displayName || user?.email || 'B').charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-semibold text-zinc-900 truncate w-36">{user?.displayName || 'Botafoguense'}</span>
                                    <span className="text-[12px] text-zinc-500 truncate w-36">{user?.email || 'Nível: Ouro'}</span>
                                </div>
                            </div>
                            <div className="py-2">
                                <button onClick={() => { setShowUserMenu(false); router.push('/profile'); }} className="w-full text-left px-4 py-2 hover:bg-zinc-100 flex items-center gap-3 text-zinc-700">
                                    <User size={18} />
                                    <span className="text-[14px]">Meu Perfil</span>
                                </button>
                                <button onClick={() => { setShowUserMenu(false); router.push('/premium'); }} className="w-full text-left px-4 py-2 hover:bg-zinc-100 flex items-center gap-3 text-zinc-700">
                                    <Crown size={18} className="text-[#d4af37]" />
                                    <span className="text-[14px]">Plano Premium</span>
                                </button>
                                <button onClick={() => { setShowUserMenu(false); router.push('/profile'); }} className="w-full text-left px-4 py-2 hover:bg-zinc-100 flex items-center gap-3 text-zinc-700">
                                    <Bookmark size={18} />
                                    <span className="text-[14px]">Itens Salvos</span>
                                </button>
                                <button onClick={() => { setShowUserMenu(false); router.push('/settings'); }} className="w-full text-left px-4 py-2 hover:bg-zinc-100 flex items-center gap-3 text-zinc-700">
                                    <Settings size={18} />
                                    <span className="text-[14px]">Configurações</span>
                                </button>
                            </div>
                            <div className="py-2 border-t border-zinc-100">
                                <button onClick={async () => { 
                                    setShowUserMenu(false); 
                                    await signOut(auth); 
                                    router.push('/login');
                                }} className="w-full text-left px-4 py-2 hover:bg-zinc-100 flex items-center gap-3 text-zinc-700">
                                    <LogOut size={18} />
                                    <span className="text-[14px]">Sair</span>
                                </button>
                            </div>
                        </div>
                    )}
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
                                <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold text-lg flex items-center justify-center overflow-hidden uppercase">
                                    {getChannelName(video.source).charAt(0)}
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
                                    <span className="text-[12px] font-medium text-zinc-600 truncate max-w-[120px]">{getChannelName(video.source)}</span>
                                    {subscribedChannels[getChannelName(video.source)] ? (
                                        <button 
                                            className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors text-[11px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 flex-shrink-0"
                                            onClick={(e) => { e.stopPropagation(); toggleSubscribe(getChannelName(video.source)); }}
                                        >
                                            <Bell size={12} className="fill-current" />
                                            Inscrito
                                            <ChevronDownIcon />
                                        </button>
                                    ) : (
                                        <button 
                                            className="bg-red-600 text-white hover:bg-red-700 transition-colors text-[11px] font-bold px-3 py-1.5 rounded-full uppercase flex-shrink-0"
                                            onClick={(e) => { e.stopPropagation(); toggleSubscribe(getChannelName(video.source)); }}
                                        >
                                            Inscrever-se
                                        </button>
                                    )}
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
                    isSubscribed={subscribedChannels[getChannelName(selectedVideo.source)] || false}
                    onSubscribeChange={() => toggleSubscribe(getChannelName(selectedVideo.source))}
                />
            )}
        </div>
    );
}

function ChevronDownIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    )
}
