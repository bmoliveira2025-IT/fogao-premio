'use client';

import { useState, useRef } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuoteItem {
    text: string;
    author: string | null;
    image?: string; // Optional custom background
}

const QUOTES: QuoteItem[] = [
    {
        text: "O nosso sangue ferve por você.",
        author: "Arquibancada",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"
    },
    {
        text: "Foi uma vitória de superação. Esse grupo mostrou mais uma vez que tem garra.",
        author: "Artur Jorge",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0565c71?q=80&w=1000&auto=format&fit=crop"
    },
    {
        text: "A estrela solitária brilha mais forte quando estamos juntos.",
        author: null,
        image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        text: "Botafogo, Botafogo, campeão desde 1910.",
        author: "Hino Oficial"
    },
    {
        text: "Não escolhi o Botafogo, fui escolhido.",
        author: "Torcedor Alvinegro"
    },
    {
        text: "Aqui é Fogo!",
        author: null
    }
];

export default function QuoteBanner() {
    // We display all quotes in a carousel on mobile, so we don't need random selection state for mobile
    // But for Desktop pill, we might still want one random or a carousel. Let's keep Desktop as Pill.
    const [desktopQuote] = useState(QUOTES[0]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Mobile: Swipeable Carousel */}
            <div className="lg:hidden -mx-4 overflow-hidden relative group">

                {/* Scroll Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {QUOTES.map((quote, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0 snap-center relative h-40 flex items-center justify-center bg-zinc-950"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={quote.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"}
                                    alt="Background"
                                    className="w-full h-full object-cover opacity-20 grayscale transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            </div>

                            {/* Quote Icon - Watermark */}
                            <div className="absolute top-2 right-4 opacity-5 pointer-events-none">
                                <Quote size={60} className="text-premium-gold" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center gap-2 px-10 text-center max-w-[90%]">
                                <Quote size={16} className="text-premium-gold/50 mb-1" />
                                <p className="text-sm text-white font-medium italic leading-snug drop-shadow-md">
                                    "{quote.text}"
                                </p>
                                {quote.author && (
                                    <div className="flex items-center gap-2 mt-2 opacity-60">
                                        <div className="w-4 h-[1px] bg-premium-gold/40"></div>
                                        <span className="text-[9px] font-bold text-premium-gold uppercase tracking-widest">
                                            {quote.author}
                                        </span>
                                        <div className="w-4 h-[1px] bg-premium-gold/40"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots (Optional Visual Cue) */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-20">
                    {QUOTES.map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
                    ))}
                </div>
            </div>

            {/* Desktop: Pill (Original - Preserved) */}
            <div className="hidden lg:flex bg-white dark:bg-zinc-900/40 border border-premium-gold/15 rounded-full pl-1 pr-4 py-1 items-center gap-3 w-fit mx-auto shadow-md backdrop-blur-sm transition-colors cursor-default">
                {/* Image or Icon */}
                {desktopQuote.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-premium-gold/50 relative shrink-0">
                        <img src={desktopQuote.image} alt={desktopQuote.author || ''} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 shrink-0">
                        <Quote size={12} className="text-premium-gold" />
                    </div>
                )}

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-zinc-800 dark:text-zinc-300 font-medium italic leading-tight">
                        "{desktopQuote.text}"
                    </p>
                    {desktopQuote.author && (
                        <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider opacity-90 mt-0.5">
                            — {desktopQuote.author}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
