"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PremiumGuard({ children }: { children: React.ReactNode }) {
    const { user, isPremium, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-white/50 space-y-4">
                <Loader2 className="animate-spin text-premium-gold" size={32} />
                <p className="text-xs uppercase tracking-widest">Verificando credenciais...</p>
            </div>
        );
    }

    // 1. Not Logged In
    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                    <Lock size={32} className="text-white/40" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Área Restrita</h2>
                <p className="text-white/50 text-sm max-w-xs mb-8">
                    Faça login para acessar conteúdos exclusivos e análises táticas do Botafogo.
                </p>
                <Link href="/login">
                    <button className="bg-white text-black font-bold uppercase tracking-widest text-xs py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">
                        Fazer Login
                    </button>
                </Link>
            </div>
        );
    }

    // 2. Logged In but NOT Premium
    if (!isPremium) {
        return (
            <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                {/* Background FX - Deeper Layering */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-premium-gold/10 blur-[100px] rounded-full pointer-events-none opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-black pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center max-w-sm w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-10 rounded-2xl shadow-2xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-premium-gold/30 to-premium-gold/5 rounded-3xl flex items-center justify-center mb-8 border border-premium-gold/40 shadow-[0_0_40px_rgba(var(--premium-gold),0.15)] transform -rotate-3">
                        <Star size={40} className="text-premium-gold fill-premium-gold drop-shadow-lg" />
                    </div>

                    <h2 className="text-3xl font-display font-black italic uppercase text-white mb-3 tracking-tight">
                        Acesso <span className="text-premium-gold">Premium</span>
                    </h2>

                    <p className="text-white/80 text-[13px] font-medium mb-10 leading-relaxed">
                        Este conteúdo é exclusivo para <span className="text-premium-gold font-bold">Sócios Fogão Premium</span>. <br />
                        Desbloqueie inteligência tática avançada e cobertura em tempo real.
                    </p>

                    <div className="flex flex-col space-y-4 w-full">
                        <button className="w-full bg-premium-gold text-black font-black uppercase tracking-widest text-sm py-4.5 rounded-2xl hover:brightness-110 shadow-xl shadow-premium-gold/25 transition-all transform active:scale-95">
                            Quero ser Premium
                        </button>
                        <div className="pt-2">
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Logado como: {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Allowed
    return <>{children}</>;
}
