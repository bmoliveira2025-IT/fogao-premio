'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuoteItem {
    text: string;
    author: string | null;
    image?: string;
}

const QUOTES: QuoteItem[] = [
    { text: "Foi uma vitória de superação. Esse grupo mostrou mais uma vez que tem garra.", author: "Artur Jorge" },
    { text: "Botafogo, Botafogo, campeão desde 1910.", author: "Hino Oficial" },
    { text: "Não escolhi o Botafogo, fui escolhido.", author: "Torcedor Alvinegro" },
    { text: "A estrela solitária brilha mais forte quando estamos juntos.", author: null },
    { text: "O nosso sangue ferve por você.", author: "Arquibancada" },
    { text: "E ninguém cala esse nosso amor.", author: "Cântico" },
    { text: "Ser Botafogo é ter a alma forjada no fogo.", author: null },
    { text: "O Glorioso não é moda, é religião.", author: null },
    { text: "Aqui é Fogo!", author: null }
];

export default function QuoteBanner() {
    const [quote, setQuote] = useState(QUOTES[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Higher chance to show for testing/engagement
        const shouldShow = Math.random() < 0.6;
        if (shouldShow) {
            const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            setQuote(random);
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Mobile: Full Width Strip */}
            <div className="lg:hidden -mx-4 bg-zinc-900 relative overflow-hidden h-32 flex items-center justify-center">
                {/* Background Image - Arquibancada */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"
                        alt="Arquibancada"
                        className="w-full h-full object-cover opacity-10 grayscale"
                    />
                    <div className="absolute inset-0 bg-black/60" /> {/* Darker overlay */}
                </div>

                {/* Big Quote Icon Background */}
                <div className="absolute top-2 right-4 opacity-5">
                    <Quote size={60} className="text-premium-gold" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1 px-8 text-center">
                    <p className="text-xs text-zinc-200 font-medium italic leading-tight">
                        "{quote.text}"
                    </p>
                    {quote.author && (
                        <div className="flex items-center gap-2 mt-1.5 opacity-80">
                            <div className="w-6 h-[1px] bg-premium-gold/40"></div>
                            <span className="text-[9px] font-bold text-premium-gold uppercase tracking-widest">
                                {quote.author}
                            </span>
                            <div className="w-6 h-[1px] bg-premium-gold/40"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop: Pill (Original) */}
            <div className="hidden lg:flex bg-white dark:bg-zinc-900/40 border border-premium-gold/15 rounded-full pl-1 pr-4 py-1 items-center gap-3 w-fit mx-auto shadow-md backdrop-blur-sm transition-colors">
                {/* Image or Icon */}
                {quote.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-premium-gold/50 relative shrink-0">
                        <img src={quote.image} alt={quote.author || ''} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 shrink-0">
                        <Quote size={12} className="text-premium-gold" />
                    </div>
                )}

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-zinc-800 dark:text-zinc-300 font-medium italic leading-tight">
                        "{quote.text}"
                    </p>
                    {quote.author && (
                        <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider opacity-90 mt-0.5">
                            — {quote.author}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
