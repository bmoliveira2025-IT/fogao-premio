"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Settings, Volume2, FastForward, Rewind } from 'lucide-react';
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
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            // Filter for PT-BR or Portuguese, fallback to all if none
            const ptVoices = available.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
            setVoices(ptVoices.length > 0 ? ptVoices : available);

            // Auto-select first PT-BR voice or Google Default
            if (!selectedVoice && ptVoices.length > 0) {
                setSelectedVoice(ptVoices[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

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

    const changeSpeed = (newSpeed: number) => {
        setSpeed(newSpeed);
        // If playing, restart with new speed is tricky with WebSpeech API, 
        // usually need to cancel and restart from current position (hard to track char index accurately across browsers).
        // For simplicity, we just update state, user re-triggers logic or we restart:
        if (isPlaying || isPaused) {
            window.speechSynthesis.cancel();
            setTimeout(() => startSpeaking(), 100);
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-50 md:left-1/2 md:-translate-x-1/2 md:max-w-md"
        >
            <div className="bg-card/95 backdrop-blur-xl border border-foreground/10 dark:border-premium-gold/10 rounded-2xl p-4 shadow-2xl ring-1 ring-foreground/5 transition-colors duration-300">

                {/* Main Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-premium-gold flex items-center justify-center shadow-lg shadow-premium-gold/20">
                            <Volume2 size={20} className="text-black" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Ouvir Notícia</h4>
                            <span className="text-[10px] text-foreground/40">{isPlaying ? 'Reproduzindo...' : 'Pausado'}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                        >
                            {isPlaying ? <Pause size={18} className="fill-foreground text-foreground" /> : <Play size={18} className="fill-foreground text-foreground ml-0.5" />}
                        </button>

                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-premium-gold/20 text-premium-gold' : 'hover:bg-foreground/10 text-foreground/60'}`}
                        >
                            <Settings size={18} />
                        </button>

                        <button
                            onClick={() => { window.speechSynthesis.cancel(); onClose(); }}
                            className="w-10 h-10 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-colors text-foreground/40 hover:text-red-400"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Settings Drawer */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 pt-4 border-t border-white/10 dark:border-premium-gold/10 space-y-4">

                                {/* Speed Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-foreground/40 uppercase font-bold tracking-widest">
                                        <span>Velocidade</span>
                                        <span>{speed}x</span>
                                    </div>
                                    <div className="flex justify-between bg-foreground/5 rounded-lg p-1">
                                        {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => changeSpeed(s)}
                                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${speed === s ? 'bg-premium-gold text-black shadow-lg' : 'text-foreground/40 hover:text-foreground'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Voice Control */}
                                <div className="space-y-2">
                                    <span className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">Voz (PT-BR)</span>
                                    <div className="flex flex-col space-y-1 max-h-24 overflow-y-auto no-scrollbar">
                                        {voices.map((voice) => (
                                            <button
                                                key={voice.name}
                                                onClick={() => { setSelectedVoice(voice); if (isPlaying) { window.speechSynthesis.cancel(); setTimeout(() => startSpeaking(), 100); } }}
                                                className={`text-left px-3 py-2 rounded-lg text-[10px] font-medium transition-colors ${selectedVoice?.name === voice.name ? 'bg-foreground/10 text-premium-gold border border-premium-gold/30' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                            >
                                                {voice.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}
