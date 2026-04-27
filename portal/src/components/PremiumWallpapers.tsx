"use client";

import { Download, Image as ImageIcon, X } from 'lucide-react';
import { PREMIUM_WALLPAPERS } from '@/data/premium-content';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PremiumWallpapers() {
    const [selectedWallpaper, setSelectedWallpaper] = useState<typeof PREMIUM_WALLPAPERS[0] | null>(null);

    return (
        <div className="mb-12">
            <h3 className="text-xl font-display font-medium text-white mb-6 flex items-center gap-2">
                <ImageIcon className="text-premium-gold" size={20} />
                <span className="text-premium-gold">Wallpapers</span> 4K
            </h3>

            {/* Gallery Track */}
            <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-4">
                    {PREMIUM_WALLPAPERS.map((wp) => (
                        <div
                            key={wp.id}
                            onClick={() => setSelectedWallpaper(wp)}
                            className="group cursor-pointer relative snap-center min-w-[200px] md:min-w-[260px] aspect-[4/5] rounded-[1.5rem] overflow-hidden glass-ultra border border-white/[0.04] hover:border-premium-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-premium active:scale-[0.98]"
                        >
                            {/* Image Thumbnail */}
                            <img
                                src={wp.thumbnail}
                                alt={wp.title}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-cinematic group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />

                            {/* Gradient Backing */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 className="text-sm font-bold font-display text-white mb-1.5 leading-tight">{wp.title}</h4>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-premium-gold group-hover:text-amber-300 transition-colors">
                                    <Download size={12} strokeWidth={3} />
                                    Ver 4K
                                </span>
                            </div>

                            {/* Hover Premium Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/0 via-premium-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {selectedWallpaper && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/90 backdrop-blur-3xl"
                    >
                        {/* Header Controls */}
                        <div className="absolute top-0 left-0 right-0 h-20 pt-[env(safe-area-inset-top)] flex items-center justify-between px-6 z-50 bg-gradient-to-b from-black/80 to-transparent">
                            <h4 className="text-white/80 font-display font-medium text-lg tracking-wide drop-shadow-md">
                                {selectedWallpaper.title}
                            </h4>
                            <button
                                onClick={() => setSelectedWallpaper(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-full glass-panel border border-white/10 hover:bg-white/10 active:scale-90 transition-all text-white/70 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Edge-to-Edge Image Focus */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-[90vw] md:max-w-2xl aspect-[4/5] md:aspect-auto md:h-[80vh] rounded-3xl overflow-hidden glass-ultra shadow-2xl border border-white/10"
                        >
                            <img
                                src={selectedWallpaper.url}
                                alt={selectedWallpaper.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Floating Action Bar */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="absolute bottom-10 left-0 right-0 px-6 pb-[env(safe-area-inset-bottom)] flex justify-center z-50"
                        >
                            <a
                                href={selectedWallpaper.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-premium-gold text-black px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-gold-glow hover:scale-105 active:scale-95 transition-all w-full max-w-sm justify-center"
                            >
                                <Download size={20} strokeWidth={3} className="animate-bounce" />
                                Baixar em 4K
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
