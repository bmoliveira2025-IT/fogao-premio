"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Volume2, FastForward, Rewind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoicePlayerProps {
    text: string;
    onClose: () => void;
    onProgress?: (charIndex: number) => void;
}

export default function VoicePlayer({ text, onClose, onProgress }: VoicePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Load Settings from LocalStorage on Mount
    useEffect(() => {
        const loadSettings = () => {
            const savedSpeed = localStorage.getItem('voiceSpeed');
            if (savedSpeed) setSpeed(parseFloat(savedSpeed));

            const savedVoiceName = localStorage.getItem('voiceName');
            const available = window.speechSynthesis.getVoices();

            if (available.length > 0) {
                // Try to find saved voice
                let voiceToUse = available.find(v => v.name === savedVoiceName);

                // Fallback to first PT-BR
                if (!voiceToUse) {
                    voiceToUse = available.find(v => v.lang.includes('pt') || v.lang.includes('PT'));
                }

                // Fallback to default
                if (!voiceToUse) {
                    voiceToUse = available[0];
                }

                setSelectedVoice(voiceToUse || null);
            }
        };

        loadSettings();
        // Voices load asynchronously
        window.speechSynthesis.onvoiceschanged = loadSettings;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
        } else {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
                setIsPlaying(true);
            } else {
                startSpeaking();
            }
        }
    };

    const startSpeaking = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = speed;
        utterance.pitch = 1;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            if (onProgress) onProgress(0);
        };

        utterance.onboundary = (event) => {
            if (onProgress) onProgress(event.charIndex);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    };

    // Auto-start when component mounts and voice is ready (optional, but good for UX)
    // For now we wait for user to click play or use the auto-play passed as prop if needed.
    // Let's just play automatically if the user opened the player (implied intent)
    useEffect(() => {
        if (selectedVoice && !isPlaying && !isPaused) {
            startSpeaking();
        }
    }, [selectedVoice]);


    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-14 left-4 right-4 z-[49] lg:left-1/2 lg:-translate-x-1/2 lg:max-w-md lg:top-24"
        >
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl flex items-center justify-between">

                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-premium-gold flex items-center justify-center shadow-lg shadow-premium-gold/20 animate-pulse-slow">
                        <Volume2 size={16} className="text-black" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Lendo Notícia</h4>
                        <span className="text-[9px] text-white/40 font-medium">Velocidade {speed}x</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        {isPlaying ? <Pause size={14} className="fill-white" /> : <Play size={14} className="fill-white ml-0.5" />}
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                    <button
                        onClick={() => { window.speechSynthesis.cancel(); onClose(); }}
                        className="w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-colors text-white/40 hover:text-red-400"
                    >
                        <X size={16} />
                    </button>
                </div>

            </div>
        </motion.div>
    );
}
