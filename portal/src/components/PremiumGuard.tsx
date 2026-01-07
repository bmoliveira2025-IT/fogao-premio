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
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden rounded-2xl border border-premium-gold/20 bg-zinc-900/50">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-premium-gold/20 to-transparent rounded-2xl flex items-center justify-center mb-6 border border-premium-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <Star size={32} className="text-premium-gold fill-premium-gold" />
                    </div>

                    <h2 className="text-2xl font-display font-black italic uppercase text-white mb-2">
                        Acesso <span className="text-premium-gold">Premium</span>
                    </h2>

                    <p className="text-white/60 text-sm max-w-sm mb-8 leading-relaxed">
                        Este conteúdo é exclusivo para sócios Fogão Premium. Desbloqueie análises táticas profundas e notícias com IA.
                    </p>

                    <div className="flex flex-col space-y-3 w-full max-w-xs">
                        <button className="bg-premium-gold text-black font-black uppercase tracking-widest text-xs py-4 px-8 rounded-xl hover:brightness-110 shadow-lg shadow-premium-gold/20 transition-all transform hover:scale-[1.02]">
                            Quero ser Premium
                        </button>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            Logado como: {user.email}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Allowed
    return <>{children}</>;
}
