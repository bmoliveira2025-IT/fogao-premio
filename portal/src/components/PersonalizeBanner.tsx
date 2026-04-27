'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PersonalizeBanner() {
    const { user } = useAuth();

    return (
        <div className="bg-[#22c55e] rounded-3xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-[20px] font-black text-white leading-tight mb-2">Personalize sua experiência</h3>
                <p className="text-[12px] text-white/90 font-medium mb-4">
                    {user 
                        ? 'Tudo pronto! Acesse seu perfil para gerenciar suas preferências e notificações.' 
                        : 'Acompanhe apenas o que te interessa e receba notificações em tempo real.'}
                </p>
                <Link 
                    href={user ? "/profile" : "/login"} 
                    className="inline-block px-5 py-2 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all shadow-xl"
                >
                    {user ? "Ver meu perfil" : "Entrar agora"}
                </Link>
            </div>
            {/* Abstract shape background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-500" />
        </div>
    );
}
