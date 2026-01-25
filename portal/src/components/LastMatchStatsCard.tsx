"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Shield, Zap, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LastMatchStatsCard() {
    const { isPremium } = useAuth();
    const router = useRouter();
    const [lastMatch, setLastMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch stats even if not premium for public card
        const q = query(collection(db, 'match_stats'), orderBy('date', 'desc'), limit(1));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setLastMatch({
                    id: snapshot.docs[0].id,
                    ...snapshot.docs[0].data()
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching last match stats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAction = () => {
        if (isPremium) {
            router.push(`/stats/${lastMatch.id}`);
        } else {
            setShowModal(true);
        }
    };

    if (loading || !lastMatch) return null;

    return (
        <div className="w-full mb-8">
            <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-premium-gold/5 blur-[80px] rounded-full opacity-50" />

                <div className="p-5 relative z-10 flex flex-col items-center">
                    {/* Header */}
                    <div className="w-full flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                <BarChart3 size={20} className="text-premium-gold" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-black text-premium-gold uppercase tracking-[0.2em] italic leading-tight">Análise de Jogo</h4>
                                <p className="text-[10px] text-white/90 uppercase tracking-[0.2em] font-bold">Última Partida • 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Premium</span>
                        </div>
                    </div>

                    {/* Score Area - ULTRA COMPACT */}
                    <div className="flex items-center justify-center gap-6 mb-7 w-full">
                        <div className="flex-1 text-right">
                            <span className="text-base font-black text-white uppercase tracking-wider block leading-tight">{lastMatch.home_team.split(' ')[0]}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-premium-gold float-right mt-1.5" />
                        </div>

                        <div className="flex flex-col items-center shrink-0">
                            <div className="relative">
                                <span className="text-5xl font-black italic text-white leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    {lastMatch.score}
                                </span>
                            </div>
                            <div className="mt-2 px-3 py-0.5 bg-premium-gold/20 border border-premium-gold/40 rounded-full shadow-lg">
                                <span className="text-[9px] font-black text-premium-gold uppercase tracking-widest italic">Finalizado</span>
                            </div>
                        </div>

                        <div className="flex-1 text-left">
                            <span className="text-base font-black text-white/80 uppercase tracking-wider block leading-tight">{lastMatch.away_team.split(' ')[0]}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5" />
                        </div>
                    </div>

                    {/* Stats Tiles - COMPACT GRID */}
                    <div className="grid grid-cols-2 gap-3 w-full mb-6">
                        <div className="bg-white/10 border border-white/10 rounded-[1.5rem] p-4 flex flex-col items-start gap-1 group/stat shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.2em]">Posse</span>
                                <Zap size={15} className="text-premium-gold group-hover/stat:scale-110 transition-transform" />
                            </div>
                            <span className="text-3xl font-black text-white font-mono leading-none">{lastMatch.stats.possession.home}%</span>
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-[1.5rem] p-4 flex flex-col items-start gap-1 group/stat shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.2em]">Chutes</span>
                                <TrendingUp size={15} className="text-premium-gold group-hover/stat:scale-110 transition-transform" />
                            </div>
                            <span className="text-3xl font-black text-white font-mono leading-none">{lastMatch.stats.shots.home}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAction}
                        className="w-full bg-premium-gold hover:bg-white text-black font-black uppercase tracking-[0.2em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-premium-gold/10 active:scale-95"
                    >
                        <span className="text-[11px]">Ver Análise Completa</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Premium Gating Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-premium-gold/30 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-premium-gold" />
                        <div className="flex flex-col items-center text-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 mb-2">
                                <Shield size={32} className="text-premium-gold" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-wider">Conteúdo Exclusivo</h3>
                            <p className="text-sm text-white/50 leading-relaxed">
                                A análise técnica detalhada está disponível apenas para <span className="text-premium-gold font-bold">Sócios Premium Fogão</span>.
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl mt-4 active:scale-95 transition-transform"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
