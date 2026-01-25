"use client";

import Link from 'next/link';
import { ChevronLeft, Lock, Star, Zap } from 'lucide-react';
import TabBar from '@/components/TabBar';
import PremiumGuard from '@/components/PremiumGuard';
import DesktopHeader from '@/components/DesktopHeader';
import { getSafeImageSrc } from '@/lib/images';

import PremiumWallpapers from '@/components/PremiumWallpapers';
import BauGlorioso from '@/components/BauGlorioso';
import PremiumGameStats from '@/components/PremiumGameStats';

export default function PremiumPageContent({ premiumNews }: { premiumNews: any[] }) {
    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-premium-gold selection:text-black pb-32">

            {/* HEADER - MOBILE */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-premium-gold/30 h-16 flex items-center justify-between px-4">
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </Link>

                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-premium-gold uppercase tracking-[0.2em]">Fogão Premium</span>
                    <div className="flex items-center space-x-1 mt-0.5">
                        <Star size={8} className="fill-premium-gold text-premium-gold" />
                        <Star size={8} className="fill-premium-gold text-premium-gold" />
                        <Star size={8} className="fill-premium-gold text-premium-gold" />
                    </div>
                </div>

                <div className="w-6"></div> {/* Spacer */}
            </header>

            <DesktopHeader />
            <div className="lg:hidden h-20"></div>
            <div className="hidden lg:block h-24"></div>

            <div className="px-4 lg:max-w-5xl lg:mx-auto">
                <div className="mb-12 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-premium-gold/20 blur-[60px] rounded-full pointer-events-none"></div>
                    <h1 className="text-2xl lg:text-4xl font-display font-bold italic uppercase relative z-10">
                        Área <span className="text-premium-gold">Exclusiva</span>
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

                    {/* NEW: Match Stats Section */}
                    <PremiumGameStats />

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
                                <Link href={`/news/${item.id}`} key={item.id} className="block">
                                    <div className="group relative bg-zinc-900/50 border border-white/5 hover:border-premium-gold/30 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-premium-gold/5 h-full">
                                        {/* Image */}
                                        <div className="h-48 w-full relative overflow-hidden">
                                            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-premium-gold/30 flex items-center space-x-1">
                                                <Zap size={10} className="text-premium-gold fill-premium-gold" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Análise IA</span>
                                            </div>
                                            <img
                                                src={getSafeImageSrc(item.image, 'https://placehold.co/800x400')}
                                                alt={item.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
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
        </main>
    );
}
