"use client";

import { Download, Image as ImageIcon } from 'lucide-react';
import { PREMIUM_WALLPAPERS } from '@/data/premium-content';

export default function PremiumWallpapers() {
    return (
        <div className="mb-12">
            <h3 className="text-xl font-display font-medium text-white mb-6 flex items-center gap-2">
                <ImageIcon className="text-premium-gold" size={20} />
                <span className="text-premium-gold">Wallpapers</span> 4K
            </h3>

            <div className="overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
                <div className="flex gap-4">
                    {PREMIUM_WALLPAPERS.map((wp) => (
                        <div key={wp.id} className="group relative min-w-[160px] md:min-w-[220px] h-[280px] md:h-[350px] rounded-xl overflow-hidden border border-white/5 hover:border-premium-gold/50 transition-all duration-300 shadow-lg">
                            {/* Image */}
                            <img
                                src={wp.url}
                                alt={wp.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 group-hover:via-black/40 transition-all duration-300"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{wp.title}</h4>
                                <a
                                    href={wp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-premium-gold hover:text-white transition-colors"
                                >
                                    <Download size={12} />
                                    Baixar Alta Resolução
                                </a>
                            </div>

                            {/* Hover Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/0 via-premium-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
