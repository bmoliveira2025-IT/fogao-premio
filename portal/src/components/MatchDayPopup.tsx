'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MatchData } from '@/app/page';
import GloriosoLogo from '@/components/GloriosoLogo';
import { X } from 'lucide-react';

interface MatchDayPopupProps {
    nextMatch: any; // Using any to avoid complex type imports for now, or redefine interface
}

const POPUP_MESSAGES = [
    { title: "HOJE TEM", highlight: "FOGÃO!", text: null },
    { title: "DIA DE", highlight: "GLORIOSO", text: "A estrela solitária brilha mais forte hoje." },
    { title: "PRA CIMA", highlight: "DELES!", text: "Honrem a camisa. Joguem por nós." },

    { title: "JUNTOS PELO", highlight: "BOTAFOGO", text: "Ninguém cala esse nosso amor." },
    { title: "LUTAREMOS", highlight: "ATÉ O FIM", text: "O gigante acordou. Hoje é dia de vitória." },
    { title: "SINTA A", highlight: "ENERGIA", text: "Vamos transformar o estádio em um caldeirão!" },
    { title: "ORGULHO DE SER", highlight: "ALVINEGRO", text: "Hoje o Rio de Janeiro é preto e branco." },
    { title: "EM BUSCA DA", highlight: "GLÓRIA", text: "“Foi uma vitória de superação. Esse grupo mostrou mais uma vez que tem garra.”" },
    { title: "FOGO!", highlight: "EU TE AMO", text: "Não se compara. Quando você joga não importa nada." },
];

export default function MatchDayPopup({ nextMatch }: MatchDayPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState(POPUP_MESSAGES[0]);

    useEffect(() => {
        if (!nextMatch) return;

        const checkMatchDay = () => {
            const matchDate = new Date(nextMatch.date);
            const today = new Date();

            // Match Logic ...
            const isToday = matchDate.getDate() === today.getDate() &&
                matchDate.getMonth() === today.getMonth() &&
                matchDate.getFullYear() === today.getFullYear();

            if (isToday) {
                // Randomize Message
                const randomMsg = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
                setMessage(randomMsg);

                const storageKey = `match_popup_shown_${matchDate.toISOString().split('T')[0]}`;
                const hasShown = localStorage.getItem(storageKey);

                if (!hasShown) {
                    setIsOpen(true);
                    localStorage.setItem(storageKey, 'true');
                }
            }
        };

        checkMatchDay();
    }, [nextMatch]);

    if (!isOpen || !nextMatch) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-premium-gold/30 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/50 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col items-center justify-center p-8 text-center relative">
                            {/* Animated Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-premium-gold/20 blur-[60px] rounded-full animate-pulse" />

                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6 relative z-10"
                            >
                                <GloriosoLogo size={80} className="drop-shadow-2xl" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-black font-display text-white uppercase italic leading-none mb-4"
                            >
                                {message.title} <br /> <span className="text-premium-gold text-4xl">{message.highlight}</span>
                            </motion.h2>

                            {message.text && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-white/80 text-sm font-medium mb-6 italic px-4"
                                >
                                    {message.text}
                                </motion.p>
                            )}

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/60 font-medium mb-6 text-xs"
                            >
                                {nextMatch.home_team} vs {nextMatch.away_team}
                                <br />
                                <span className="opacity-60">
                                    {new Date(nextMatch.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {nextMatch.location}
                                </span>
                            </motion.p>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => setIsOpen(false)}
                                className="bg-premium-gold text-black font-bold uppercase tracking-widest text-xs py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                Vamos lá!
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
