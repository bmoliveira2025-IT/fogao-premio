"use client";

import { Star, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PremiumLockOverlay() {
    return (
        <div className="relative mt-2">
            {/* Blur Overlay */}
            <div className="absolute -top-32 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />

            <div className="relative z-20 bg-[#0a0a0a] pb-10 pt-4 flex flex-col items-center text-center px-6">
                {/* Premium Card */}
                <div className="w-full max-w-sm bg-[#121212] border border-premium-gold/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(var(--premium-gold),0.1)]">
                    {/* Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-premium-gold/10 blur-[50px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-premium-gold/10 border border-premium-gold flex items-center justify-center mb-4">
                            <Lock size={20} className="text-premium-gold" />
                        </div>

                        <h3 className="text-xl font-display font-black text-white mb-2 uppercase italic tracking-wide">
                            Conteúdo Exclusivo
                        </h3>

                        <p className="text-sm text-white/60 mb-6 font-light leading-relaxed">
                            Esta análise tática detalhada é exclusiva para assinantes Premium. Desbloqueie o acesso completo ao universo alvinegro.
                        </p>

                        <div className="space-y-3 w-full">
                            <button className="w-full py-4 bg-gradient-to-r from-premium-gold to-premium-gold/80 rounded-xl text-black font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center space-x-2">
                                <Star size={14} className="fill-black" />
                                <span>Assinar Premium</span>
                            </button>

                            <Link href="/login" className="block w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                                Já sou assinante
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-[10px] text-white/20 uppercase tracking-widest">
                    Apoie o jornalismo independente do Botafogo
                </p>
            </div>
        </div>
    );
}
