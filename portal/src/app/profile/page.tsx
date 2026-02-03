"use client";
import { useEffect, useState } from 'react';
import {
    User, Settings, Bell, Shield, ChevronRight, LogOut,
    Moon, Smartphone, Volume2, Star, CreditCard, Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import SubscriptionModal from '@/components/SubscriptionModal';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isPremium, points, rank } = useAuth(); // Use real auth context
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const { theme, setTheme } = useTheme();

    // Preferences State
    const [preferences, setPreferences] = useState({
        news: true,
        podcasts: false,
        videos: true
    });
    const [loadingPreferences, setLoadingPreferences] = useState(true);

    // Load Preferences
    useEffect(() => {
        async function loadPreferences() {
            if (!user) return;
            try {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().preferences) {
                    setPreferences(userSnap.data().preferences);
                }
            } catch (error) {
                console.error("Error loading preferences:", error);
            } finally {
                setLoadingPreferences(false);
            }
        }
        loadPreferences();
    }, [user]);

    // Save Preference
    const handleToggle = async (key: keyof typeof preferences) => {
        if (!user) return;

        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences); // Optimistic update

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { preferences: newPreferences }, { merge: true });
        } catch (error) {
            console.error("Error saving preference:", error);
            setPreferences(preferences); // Revert on error
        }
    };

    useEffect(() => {
        if (!user) {
            // Optional: Handle redirect if needed, but AuthContext handles initial load
        }
    }, [user, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <div className="w-full text-foreground font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 pb-32">
            <div className="lg:max-w-4xl lg:mx-auto lg:p-8 lg:grid lg:grid-cols-12 lg:gap-8">

                {/* Header Area - Wrapped for Mobile Hiding/Desktop Styling */}
                <div className="lg:col-span-4">
                    <div className="mb-6 pt-4 pb-4 px-5 bg-gradient-to-b from-card to-background border-b border-premium-gold/15 lg:rounded-2xl lg:border lg:shadow-lg lg:bg-card lg:mb-0">
                        <h1 className="text-xl font-display font-black text-foreground mb-3 text-center lg:hidden">Perfil</h1>

                        <div className="flex items-center lg:flex-col lg:text-center space-x-3 lg:space-x-0 lg:space-y-4">
                            <div className="w-14 h-14 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-foreground/10 to-transparent border border-premium-gold/15 flex items-center justify-center relative">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={28} className="text-foreground/50" />
                                )}
                                {isPremium && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-8 lg:h-8 bg-premium-gold rounded-full flex items-center justify-center border-2 border-background">
                                        <Star size={10} className="text-black fill-black lg:w-4 lg:h-4" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg lg:text-xl font-bold text-foreground">{user?.displayName || 'Torcedor Alvinegro'}</h2>
                                <p className="text-xs text-foreground/40">{user?.email || 'Convidado'}</p>

                                {isPremium ? (
                                    <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-premium-gold/10 border border-premium-gold/20">
                                        <Crown size={10} className="text-premium-gold fill-premium-gold" />
                                        <span className="text-[10px] font-bold text-premium-gold uppercase tracking-wider">
                                            Membro Premium
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                                        <User size={10} className="text-zinc-400" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                            Torcedor {rank}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 space-y-6 lg:col-span-8 lg:px-0 lg:space-y-8">

                    {/* Points Card */}
                    <div className="flex items-center justify-between p-5 bg-zinc-900/50 border border-premium-gold/20 rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/30">
                                <Star size={24} className="text-premium-gold fill-premium-gold" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white leading-none uppercase italic tracking-tighter">Fogão Points</h3>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Sua Pontuação de Lealdade</p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <div className="text-3xl font-black text-premium-gold leading-none tracking-tighter">{points}</div>
                            <div className={cn(
                                "text-[9px] font-bold uppercase tracking-widest mt-1",
                                rank === "Platina" ? "text-blue-400" :
                                    rank === "Ouro" ? "text-premium-gold" :
                                        rank === "Prata" ? "text-zinc-300" : "text-zinc-500"
                            )}>Nível {rank}</div>
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div className="relative group overflow-hidden rounded-xl border border-premium-gold/15 bg-card p-5 shadow-lg">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-premium-gold/5 blur-[60px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-foreground mb-1">
                                        {isPremium ? 'Assinatura Premium Ativa' : 'Desbloqueie o Premium'}
                                    </h3>
                                    <p className="text-[10px] text-foreground/50 max-w-[200px]">
                                        {isPremium
                                            ? 'Sua próxima renovação será em 15 de Outubro.'
                                            : 'Acesse análises táticas, vídeos exclusivos e mais.'}
                                    </p>
                                </div>
                                <Star className={`text-premium-gold ${isPremium ? 'fill-premium-gold' : ''}`} size={20} />
                            </div>

                            <button
                                onClick={() => isPremium ? setShowSubscriptionModal(true) : null}
                                className="w-full py-2.5 bg-transparent border border-premium-gold/15 rounded-lg text-premium-gold font-bold text-[10px] uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all"
                            >
                                {isPremium ? 'Gerenciar Assinatura' : 'Assinar Agora'}
                            </button>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">

                        {/* Preferences */}
                        <div className="space-y-2 lg:col-span-2">
                            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Preferências de Conteúdo</h4>
                            <div className="bg-[#121212] border border-premium-gold/15 rounded-xl overflow-hidden shadow-lg">
                                <ToggleItem
                                    icon={Smartphone}
                                    label="Notícias"
                                    checked={preferences.news}
                                    onChange={() => handleToggle('news')}
                                    disabled={loadingPreferences}
                                />
                                <ToggleItem
                                    icon={Volume2}
                                    label="Podcasts"
                                    checked={preferences.podcasts}
                                    onChange={() => handleToggle('podcasts')}
                                    disabled={loadingPreferences}
                                />
                                <ToggleItem
                                    icon={CreditCard}
                                    label="Vídeos Exclusivos"
                                    checked={preferences.videos}
                                    onChange={() => handleToggle('videos')}
                                    disabled={loadingPreferences}
                                />
                            </div>
                        </div>

                        {/* Audio Preferences */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Preferências de Áudio</h4>
                            <div className="bg-[#121212] border border-premium-gold/15 rounded-xl overflow-hidden shadow-lg p-4 space-y-4">

                                {/* Speed Control */}
                                <div className="space-y-2">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Velocidade de Leitura</span>
                                    <div className="flex bg-black rounded-lg p-1 border border-premium-gold/15">
                                        {[0.5, 1, 1.5, 2].map((s) => (
                                            <AudioSpeedButton key={s} speed={s} />
                                        ))}
                                    </div>
                                </div>

                                {/* Voice Control */}
                                <div className="space-y-2">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Voz (PT-BR)</span>
                                    <VoiceSelector />
                                </div>

                            </div>
                        </div>

                        {/* Appearance (Existing) */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Aparência</h4>
                            <div className="bg-[#121212] border border-premium-gold/15 rounded-xl overflow-hidden shadow-lg h-full">
                                <div className="flex items-center justify-between p-4 border-b border-premium-gold/15 last:border-0 h-full">
                                    <div className="flex items-center space-x-3">
                                        <Moon size={18} className="text-white/70" />
                                        <span className="text-sm font-medium text-white/90">Tema</span>
                                    </div>
                                    <div className="flex bg-black rounded-lg p-0.5 border border-premium-gold/15 gap-0.5">
                                        <button
                                            onClick={() => setTheme('glorioso')}
                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${theme === 'glorioso' ? 'bg-[#1A1A1A] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50' : 'text-white/40 hover:text-[#D4AF37]'}`}
                                        >
                                            Glorioso
                                        </button>
                                        <button
                                            onClick={() => setTheme('gloriosa')}
                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${theme === 'gloriosa' ? 'bg-pink-500 text-white shadow-sm ring-1 ring-pink-400' : 'text-white/40 hover:text-pink-400'}`}
                                        >
                                            Gloriosa
                                        </button>
                                        <button
                                            onClick={() => setTheme('biriba')}
                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${theme === 'biriba' ? 'bg-white text-black shadow-sm ring-1 ring-white/50' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Biriba
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Notificações</h4>
                            <div className="bg-[#121212] border border-premium-gold/15 rounded-xl overflow-hidden shadow-lg">
                                <ToggleItem icon={Bell} label="Última Hora" checked={true} />
                                <ToggleItem icon={Shield} label="Dia de Jogo" checked={true} />
                            </div>
                        </div>

                        {/* Account */}
                        <div className="space-y-2 lg:col-span-2 lg:mt-16">
                            <div className="bg-[#121212] border border-premium-gold/15 rounded-xl overflow-hidden shadow-lg">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
                                    <div className="flex items-center space-x-3">
                                        <Settings size={18} className="text-white/70" />
                                        <span className="text-sm font-medium text-white/90">Configurações da Conta</span>
                                    </div>
                                    <ChevronRight size={14} className="text-white/30" />
                                </button>
                                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors text-left group">
                                    <div className="flex items-center space-x-3">
                                        <LogOut size={18} className="text-red-500/70 group-hover:text-red-500" />
                                        <span className="text-sm font-medium text-red-500/90 group-hover:text-red-500">Sair da Conta</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-white/20 pt-4 lg:col-span-2">
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


function ToggleItem({ icon: Icon, label, checked, onChange, disabled }: { icon: any, label: string, checked: boolean, onChange?: () => void, disabled?: boolean }) {
    const [internalChecked, setInternalChecked] = useState(checked);

    useEffect(() => {
        setInternalChecked(checked);
    }, [checked]);

    const handleClick = () => {
        if (disabled) return;
        if (onChange) {
            onChange();
        } else {
            setInternalChecked(!internalChecked);
        }
    };

    const isOn = onChange ? checked : internalChecked;

    return (
        <div
            className={`flex items-center justify-between p-4 border-b border-premium-gold/15 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-3">
                <Icon size={18} className="text-white/70" />
                <span className="text-sm font-medium text-white/90">{label}</span>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-premium-gold' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}

function AudioSpeedButton({ speed }: { speed: number }) {
    const [currentSpeed, setCurrentSpeed] = useState(1);

    useEffect(() => {
        const saved = localStorage.getItem('voiceSpeed');
        if (saved) setCurrentSpeed(parseFloat(saved));
    }, []);

    const setSpeed = (s: number) => {
        localStorage.setItem('voiceSpeed', s.toString());
        setCurrentSpeed(s);
    };

    return (
        <button
            onClick={() => setSpeed(speed)}
            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${currentSpeed === speed ? 'bg-premium-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
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
            setVoices(ptVoices.length > 0 ? ptVoices : available);

            const saved = localStorage.getItem('voiceName');
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
                    className={`text-left px-3 py-2 rounded-lg text-[10px] font-medium transition-colors border ${selectedVoice === voice.name ? 'bg-white/10 text-premium-gold border-premium-gold/30' : 'border-transparent text-white/50 hover:bg-white/5'}`}
                >
                    {voice.name}
                </button>
            )) : <p className="text-[10px] text-white/20 italic">Carregando vozes...</p>}
        </div>
    );
}

