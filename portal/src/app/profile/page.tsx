"use client";
import { useEffect, useState } from 'react';
import {
    User, Settings, Bell, Shield, ChevronRight, LogOut,
    Star, Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import SubscriptionModal from '@/components/SubscriptionModal';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isPremium, points, rank } = useAuth(); // Use real auth context
    const { theme, setTheme } = useTheme();
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    useEffect(() => {
        if (!user) {
            // Optional: Handle redirect if needed
        }
    }, [user, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-premium-gold selection:text-white transition-colors duration-300 pb-8 lg:pb-32">
            <div className="lg:max-w-4xl lg:mx-auto lg:p-8 lg:grid lg:grid-cols-12 lg:gap-8">

                {/* Header Area */}
                <div className="lg:col-span-4">
                    <div className="mb-4 pt-5 pb-5 px-5 bg-white border-b border-zinc-200 lg:rounded-[2rem] lg:border lg:shadow-sm lg:mb-0">
                        <h1 className="text-2xl font-display font-black text-zinc-900 mb-4 text-center lg:hidden">Perfil</h1>

                        <div className="flex items-center lg:flex-col lg:text-center space-x-3 lg:space-x-0 lg:space-y-4">
                            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-sm">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={28} className="text-zinc-400" />
                                )}
                                {isPremium && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-8 lg:h-8 bg-premium-gold rounded-full flex items-center justify-center border-2 border-white">
                                        <Star size={10} className="text-white fill-white lg:w-4 lg:h-4" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 leading-tight">{user?.displayName || 'Torcedor Alvinegro'}</h2>
                                <p className="text-sm text-zinc-500 mt-0.5 break-all">{user?.email || 'Convidado'}</p>

                                {isPremium ? (
                                    <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-premium-gold/10 border border-premium-gold/25">
                                        <Crown size={12} className="text-premium-gold fill-premium-gold" />
                                        <span className="text-[11px] font-bold text-premium-gold uppercase tracking-wider">
                                            Membro Premium
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                                        <User size={10} className="text-zinc-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                            Torcedor {rank}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 space-y-4 lg:col-span-8 lg:px-0 lg:space-y-4">

                    {/* Points Card */}
                    <div className="flex items-center justify-between p-5 bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden relative group shadow-sm hover:shadow-md transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/30 group-hover:bg-premium-gold/20 transition-colors">
                                <Star size={24} className="text-premium-gold fill-premium-gold" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-zinc-900 leading-none uppercase italic tracking-tighter">Fogão Points</h3>
                                <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-[0.12em] mt-1.5">Sua Pontuação de Lealdade</p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <div className="text-[40px] font-black text-premium-gold leading-none tracking-tighter">{points}</div>
                            <div className={cn(
                                "text-[10px] font-bold uppercase tracking-widest mt-1",
                                rank === "Platina" ? "text-blue-500" :
                                    rank === "Ouro" ? "text-premium-gold" :
                                        rank === "Prata" ? "text-zinc-400" : "text-zinc-500"
                            )}>Nível {rank}</div>
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div className="relative group overflow-hidden rounded-[1.5rem] bg-white border border-zinc-200 p-5 shadow-sm hover:border-premium-gold/40 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-premium-gold/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-premium-gold/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900 mb-1.5">
                                        {isPremium ? 'Assinatura Premium Ativa' : 'Desbloqueie o Premium'}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-zinc-500 max-w-[260px]">
                                        {isPremium
                                            ? 'Sua próxima renovação será em 15 de Outubro.'
                                            : 'Acesse análises táticas, vídeos exclusivos e mais.'}
                                    </p>
                                </div>
                                <Star className={`text-premium-gold ${isPremium ? 'fill-premium-gold' : ''}`} size={20} />
                            </div>

                            <button
                                onClick={() => isPremium ? setShowSubscriptionModal(true) : null}
                                className="w-full py-3.5 bg-white border border-zinc-200 rounded-xl text-premium-gold font-bold text-[12px] uppercase tracking-[0.14em] hover:border-premium-gold/50 hover:bg-premium-gold/5 transition-all duration-300 active:scale-[0.98]"
                            >
                                {isPremium ? 'Gerenciar Assinatura' : 'Assinar Agora'}
                            </button>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">

                        {/* Audio Preferences */}
                        <div className="space-y-2 lg:col-span-2">
                            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.14em] px-1 mb-2">Acessibilidade de Áudio</h4>
                            <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm p-5 space-y-4">

                                {/* Speed Control */}
                                <div className="space-y-2">
                                    <span className="text-xs text-zinc-600 uppercase font-bold tracking-[0.12em]">Velocidade de Leitura</span>
                                    <div className="flex bg-zinc-50 rounded-lg p-1 border border-zinc-200">
                                        {[0.5, 1, 1.5, 2].map((s) => (
                                            <AudioSpeedButton key={s} speed={s} />
                                        ))}
                                    </div>
                                </div>

                                {/* Voice Control */}
                                <div className="space-y-2">
                                    <span className="text-xs text-zinc-600 uppercase font-bold tracking-[0.12em]">Voz (PT-BR)</span>
                                    <VoiceSelector />
                                </div>

                            </div>
                        </div>

                        {/* Appearances */}
                        <div className="space-y-2 lg:col-span-2">
                            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.14em] px-1 mb-2">Aparência</h4>
                            <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm p-5 space-y-4">
                                <div className="space-y-2">
                                    <span className="text-xs text-zinc-600 uppercase font-bold tracking-[0.12em]">Tema do Aplicativo</span>
                                    <div className="flex bg-zinc-50 rounded-lg p-1 border border-zinc-200">
                                        <button
                                            onClick={() => setTheme('glorioso')}
                                            className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${theme === 'glorioso' ? 'bg-white text-premium-gold shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
                                        >
                                            <Star size={14} className={theme === 'glorioso' ? 'fill-premium-gold' : ''} />
                                            Glorioso (Ouro)
                                        </button>
                                        <button
                                            onClick={() => setTheme('gloriosa')}
                                            className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${theme === 'gloriosa' ? 'bg-white text-pink-500 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
                                        >
                                            <Crown size={14} className={theme === 'gloriosa' ? 'fill-pink-500' : ''} />
                                            Gloriosa (Rosa)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="space-y-2 lg:col-span-2">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">Notificações</h4>
                            <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors duration-300">
                                    <div className="flex items-center space-x-3">
                                        <Bell size={18} className="text-zinc-600" />
                                        <span className="text-sm font-medium text-zinc-900">Última Hora</span>
                                    </div>
                                    <div className="w-10 h-6 rounded-full p-1 transition-colors duration-300 bg-premium-gold">
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 translate-x-4" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors duration-300">
                                    <div className="flex items-center space-x-3">
                                        <Shield size={18} className="text-zinc-600" />
                                        <span className="text-sm font-medium text-zinc-900">Dia de Jogo</span>
                                    </div>
                                    <div className="w-10 h-6 rounded-full p-1 transition-colors duration-300 bg-premium-gold">
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 translate-x-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account */}
                        <div className="space-y-2 lg:col-span-2 lg:mt-6">
                            <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                                <Link href="/settings" className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors text-left block">
                                    <div className="flex items-center space-x-3">
                                        <Settings size={18} className="text-zinc-600" />
                                        <span className="text-sm font-medium text-zinc-900">Configurações da Conta</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
                                    <div className="flex items-center space-x-3">
                                        <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
                                        <span className="text-sm font-medium text-red-500 group-hover:text-red-600">Sair da Conta</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-zinc-400 pt-4 lg:col-span-2">
                            Versão 2.1.0 • Botafogo Premium
                        </p>

                    </div>
                </div>
            </div>
            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                user={user}
            />
        </div>
    );
}


function AudioSpeedButton({ speed }: { speed: number }) {
    const [currentSpeed, setCurrentSpeed] = useState(1);

    useEffect(() => {
        const saved = localStorage.getItem('voiceSpeed');
        // eslint-disable-next-line
        if (saved) setCurrentSpeed(parseFloat(saved));
    }, []);

    const setSpeed = (s: number) => {
        localStorage.setItem('voiceSpeed', s.toString());
        setCurrentSpeed(s);
    };

    return (
        <button
            onClick={() => setSpeed(speed)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${currentSpeed === speed ? 'bg-white border-zinc-200 text-zinc-900 shadow-sm border' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
            {speed}x
        </button>
    );
}

function VoiceSelector() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            const ptVoices = available.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
            // eslint-disable-next-line
            setVoices(ptVoices.length > 0 ? ptVoices : available);

            const saved = localStorage.getItem('voiceName');
            // eslint-disable-next-line
            if (saved) setSelectedVoice(saved);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleSelect = (voiceName: string) => {
        localStorage.setItem('voiceName', voiceName);
        setSelectedVoice(voiceName);
    };

    return (
        <div className="flex flex-col space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {voices.length > 0 ? voices.map((voice: SpeechSynthesisVoice) => (
                <button
                    key={voice.name}
                    onClick={() => handleSelect(voice.name)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${selectedVoice === voice.name ? 'bg-white text-premium-gold border-premium-gold/30 shadow-sm' : 'border-transparent text-zinc-600 hover:bg-zinc-50'}`}
                >
                    {voice.name}
                </button>
            )) : <p className="text-sm text-zinc-400 italic">Carregando vozes...</p>}
        </div>
    );
}
