"use client";

import React, { createContext, useContext, useState } from 'react';
import LightVideoPlayer from '@/components/LightVideoPlayer';

export interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
}

interface VideoPlayerContextType {
    activeVideo: VideoItem | null;
    playlist: VideoItem[];
    isMinimized: boolean;
    playVideo: (video: VideoItem, playlist?: VideoItem[]) => void;
    closeVideo: () => void;
    setMinimized: (minimized: boolean) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: React.ReactNode }) {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const [playlist, setPlaylist] = useState<VideoItem[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [subscribedChannels, setSubscribedChannels] = useState<Record<string, boolean>>({});

    const playVideo = (video: VideoItem, currentPlaylist: VideoItem[] = []) => {
        setActiveVideo(video);
        if (currentPlaylist.length > 0) setPlaylist(currentPlaylist);
        setIsMinimized(false);
    };

    const closeVideo = () => {
        setActiveVideo(null);
        setIsMinimized(false);
    };

    const toggleSubscribe = (channel: string) => {
        setSubscribedChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

    return (
        <VideoPlayerContext.Provider
            value={{
                activeVideo,
                playlist,
                isMinimized,
                playVideo,
                closeVideo,
                setMinimized: setIsMinimized,
            }}
        >
            {children}
            {activeVideo && (
                <LightVideoPlayer
                    video={activeVideo}
                    allVideos={playlist.filter(v => v.id !== activeVideo.id)}
                    onClose={closeVideo}
                    onVideoSelect={(nextVideo) => setActiveVideo(nextVideo)}
                    isSubscribed={subscribedChannels[activeVideo.source || 'Botafogo TV'] || false}
                    onSubscribeChange={() => toggleSubscribe(activeVideo.source || 'Botafogo TV')}
                />
            )}
        </VideoPlayerContext.Provider>
    );
}

export function useVideoPlayer() {
    const context = useContext(VideoPlayerContext);
    if (!context) {
        return {
            activeVideo: null,
            playlist: [],
            isMinimized: false,
            playVideo: () => {},
            closeVideo: () => {},
            setMinimized: () => {},
        };
    }
    return context;
}
