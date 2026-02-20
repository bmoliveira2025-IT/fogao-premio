"use client";

import Link from 'next/link';
import { ChevronLeft, Lock, Star, Zap, Crown } from 'lucide-react';
import GloriosoLogo from '@/components/GloriosoLogo';
import TabBar from '@/components/TabBar';
import PremiumGuard from '@/components/PremiumGuard';
import DesktopHeader from '@/components/DesktopHeader';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';

import PremiumWallpapers from '@/components/PremiumWallpapers';
import BauGlorioso from '@/components/BauGlorioso';
// import PremiumGameStats from '@/components/PremiumGameStats';

export default function PremiumPageContent({ premiumNews }: { premiumNews: any[] }) {
    const { user, isPremium } = useAuth();
    return (
        <main className="min-h-screen bg-background text-white font-sans selection:bg-premium-gold selection:text-black pb-32">

            {/* HEADER - MOBILE (Aligned with BrandingHeader.tsx) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-[999] glass-ultra border-b border-white/[0.04] h-16 flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] shadow-premium">
                <Link href="/" className="flex items-center gap-2 group relative">
                    {/* Multi-layer Glow Effect matching BrandingHeader */}
                    <div className="absolute -inset-2 bg-gradient-radial from-premium-gold/30 to-transparent opacity-0 group-active:opacity-100 blur-xl transition-opacity duration-300 rounded-full" />
                    <div className="absolute -inset-1 bg-premium-gold/20 opacity-30 blur-md rounded-full animate-glow-pulse" />

                    <GloriosoLogo size={34} className="drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] relative z-10" />

                </Link>

                <div className="flex items-center gap-2">
                    {isPremium && (
                        <Link href="/premium" className="p-2 text-premium-gold hover:scale-110 active:scale-95 transition-all">
                            <Crown size={22} className="fill-premium-gold/20" />
                        </Link>
                    )}
                    <Link href="?briefing=true" className="p-2 text-zinc-400 hover:text-premium-gold transition-colors">
                        <Zap size={20} className="fill-current" />
                    </Link>

                    {user?.photoURL ? (
                        <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-premium-gold/50 shadow-lg shadow-premium-gold/20">
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        </Link>
                    ) : (
                        <div className="w-6"></div>
                    )}
                </div>
            </header>

            <div className="px-4 lg:max-w-5xl lg:mx-auto">
                <div className="mb-12 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-premium-gold/20 blur-[60px] rounded-full pointer-events-none"></div>
                    <h1 className="text-2xl lg:text-4xl font-display font-bold uppercase relative z-10 flex items-center justify-center gap-3">
                        {user?.photoURL && (
                            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-premium-gold shadow-2xl ring-4 ring-premium-gold/10">
                                <img src={user.photoURL} alt="Premium User" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <span>Área <span className="text-premium-gold">Exclusiva</span></span>
                    </h1>
                    <p className="text-xs lg:text-sm text-white/50 mt-2 max-w-xs lg:max-w-md mx-auto relative z-10">
                        Análises táticas, bastidores e conteúdo exclusivo da Temporada 2026 do Botafogo.
                    </p>
                </div>

                {/* WRAP CONTENT WITH PREMIUM GUARD */}
                <PremiumGuard>

                    {/* NEW: Wallpapers Section */}
                    <PremiumWallpapers />

                    {/* NEW: Bau Glorioso Section */}
                    <BauGlorioso />

                    {/* NEW: Match Stats Section - REMOVED per user request to hide previous games */}
                    {/* <PremiumGameStats /> */}

                    {/* EXISTING: News Section */}
                    <div className="mb-8 flex items-center gap-2">
                        <Zap className="text-premium-gold" size={20} />
                        <h3 className="text-xl font-display font-medium text-white">
                            Análises de <span className="text-premium-gold">Partidas 2026</span>
                        </h3>
                    </div>

                    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                        {premiumNews.length > 0 ? (
                            premiumNews.map((item: any) => (
                                <Link
                                    href={item.match_id ? `/stats/${item.match_id}` : `/news/${item.id}`}
                                    key={item.id}
                                    className="block group"
                                >
                                    <div className="relative glass-panel border border-white/[0.04] p-0 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] hover:border-premium-gold/40 h-full flex flex-col">
                                        {/* Image */}
                                        <div className="h-48 w-full relative overflow-hidden">
                                            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-premium-gold/30 flex items-center space-x-1">
                                                <Zap size={10} className="text-premium-gold fill-premium-gold" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Análise IA</span>
                                            </div>
                                            <img
                                                src={getSafeImageSrc(item.image, 'https://placehold.co/800x400')}
                                                alt={item.title}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-cinematic"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h2 className="text-lg font-display font-medium leading-tight mb-2 group-hover:text-premium-gold transition-colors">
                                                {item.title}
                                            </h2>
                                            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                                                {item.summary || item.content?.substring(0, 100)}...
                                            </p>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                                <span className="text-[10px] text-white/30 uppercase tracking-wider">
                                                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="text-[10px] font-bold text-premium-gold uppercase tracking-wider group-hover:underline">
                                                    Ler Análise Completa
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-xl">
                                <Lock size={32} className="text-white/20 mx-auto mb-4" />
                                <p className="text-sm text-white/40">Nenhum conteúdo exclusivo disponível no momento.</p>
                            </div>
                        )}
                    </div>
                </PremiumGuard>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main >
    );
}
