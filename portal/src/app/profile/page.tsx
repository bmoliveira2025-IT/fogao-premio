"use client";

import { useEffect, useState, useMemo } from 'react';
import {
    User, Settings, Bell, Shield, ChevronRight, LogOut,
    Star, Crown, Volume2, Sparkles, Sun, Moon, Zap,
    Award, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import SubscriptionModal from '@/components/SubscriptionModal';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isPremium, points, rank, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    
    // Notification toggles state (local fallback with preferences sync)
    const [notifyBreaking, setNotifyBreaking] = useState(true);
    const [notifyDaily, setNotifyDaily] = useState(true);

    useEffect(() => {
        const savedBreaking = localStorage.getItem('notify_breaking');
        const savedDaily = localStorage.getItem('notify_daily');
        if (savedBreaking !== null) setNotifyBreaking(savedBreaking === 'true');
        if (savedDaily !== null) setNotifyDaily(savedDaily === 'true');
    }, []);

    const toggleBreaking = () => {
        const next = !notifyBreaking;
        setNotifyBreaking(next);
        localStorage.setItem('notify_breaking', String(next));
    };

    const toggleDaily = () => {
        const next = !notifyDaily;
        setNotifyDaily(next);
        localStorage.setItem('notify_daily', String(next));
    };

    const handleLogout = async () => {
        try {
            await logout();
            await signOut(auth);
        } catch {
            // Ignore logout errors
        }
        router.push('/login');
    };

    // Calculate progress to next rank
    const { nextRank, progressPercent, pointsRemaining } = useMemo(() => {
        const p = points || 0;
        if (p < 500) {
            return {
                nextRank: "Prata",
                progressPercent: Math.min(100, Math.round((p / 500) * 100)),
                pointsRemaining: 500 - p,
            };
        } else if (p < 2000) {
            return {
                nextRank: "Ouro",
                progressPercent: Math.min(100, Math.round(((p - 500) / 1500) * 100)),
                pointsRemaining: 2000 - p,
            };
        } else if (p < 5000) {
            return {
                nextRank: "Platina",
                progressPercent: Math.min(100, Math.round(((p - 2000) / 3000) * 100)),
                pointsRemaining: 5000 - p,
            };
        } else {
            return {
                nextRank: "Nível Máximo",
                progressPercent: 100,
                pointsRemaining: 0,
            };
        }
    }, [points]);

    // Rank styling config
    const rankConfig = useMemo(() => {
        switch (rank) {
            case "Platina":
                return {
                    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
                    glow: "from-sky-500/20 via-sky-400/10 to-transparent",
                    text: "text-sky-400",
                };
            case "Ouro":
                return {
                    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                    glow: "from-amber-500/20 via-amber-400/10 to-transparent",
                    text: "text-amber-400",
                };
            case "Prata":
                return {
                    badge: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",
                    glow: "from-zinc-400/20 via-zinc-400/10 to-transparent",
                    text: "text-zinc-300",
                };
            default:
                return {
                    badge: "bg-amber-700/15 text-amber-600 dark:text-amber-400 border-amber-700/30",
                    glow: "from-amber-700/20 via-amber-600/10 to-transparent",
                    text: "text-amber-600 dark:text-amber-400",
                };
        }
    }, [rank]);

    return (
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#0f1013] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-premium-gold selection:text-black pb-28 lg:pb-16 transition-colors duration-200">
            <div className="mx-auto max-w-2xl px-4 pt-4 sm:pt-6 space-y-4 sm:space-y-5">

                {/* Top Header */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-premium-gold">
                            Fogão 360
                        </span>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Meu Perfil
                        </h1>
                    </div>
                    <Link
                        href="/settings"
                        aria-label="Configurações da conta"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-premium-gold/50 shadow-sm transition-all active:scale-95"
                    >
                        <Settings size={18} />
                    </Link>
                </div>

                {/* 1. HERO PROFILE CARD */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-b dark:from-zinc-900/95 dark:to-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] p-5 sm:p-6">
                    {/* Subtle alvinegro/gold ambient light */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-premium-gold/10 dark:bg-premium-gold/15 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                        {/* Avatar with Halo Ring */}
                        <div className="relative flex-shrink-0">
                            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-0.5 bg-gradient-to-tr from-premium-gold via-zinc-400 to-premium-gold dark:from-premium-gold dark:via-zinc-700 dark:to-premium-gold shadow-md">
                                <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "Avatar do Torcedor"}
                                            fill
                                            sizes="96px"
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={38} className="text-zinc-400 dark:text-zinc-500" />
                                    )}
                                </div>
                            </div>
                            {isPremium ? (
                                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-zinc-950 shadow-md border-2 border-white dark:border-zinc-900" title="Membro Premium Ativo">
                                    <Crown size={13} className="fill-current" />
                                </div>
                            ) : (
                                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-800 text-premium-gold shadow-md border-2 border-white dark:border-zinc-900" title="Torcedor Alvinegro">
                                    <Star size={12} className="fill-current" />
                                </div>
                            )}
                        </div>

                        {/* User Meta Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white truncate">
                                    {user?.displayName || 'Torcedor Alvinegro'}
                                </h2>
                                {isPremium && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                        <Crown size={11} className="fill-current" />
                                        VIP
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-3">
                                {user?.email || 'Acesso como Convidado'}
                            </p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-2xs",
                                    rankConfig.badge
                                )}>
                                    <Award size={13} />
                                    Torcedor {rank}
                                </span>

                                <Link
                                    href="/settings"
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/80 dark:border-zinc-700/80"
                                >
                                    Editar Perfil
                                    <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="mt-5 grid grid-cols-3 divide-x divide-zinc-200/80 dark:divide-zinc-800/80 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 p-3 text-center">
                        <div className="px-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Pontos</span>
                            <span className="text-base sm:text-lg font-black text-premium-gold leading-tight">{points}</span>
                        </div>
                        <div className="px-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Nível</span>
                            <span className="text-base sm:text-lg font-black text-zinc-800 dark:text-zinc-200 leading-tight">{rank}</span>
                        </div>
                        <div className="px-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Plano</span>
                            <span className="text-base sm:text-lg font-black text-zinc-800 dark:text-zinc-200 leading-tight">{isPremium ? 'Premium' : 'Livre'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. FOGÃO POINTS & GAMIFICATION */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-zinc-950 shadow-md">
                                <Star size={22} className="fill-current" />
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                                    Gamificação Oficial
                                </span>
                                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                    Fogão Points
                                </h3>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-black text-premium-gold leading-none tracking-tight">
                                {points}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Nível {rank}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                                <Zap size={13} className="text-premium-gold fill-premium-gold" />
                                {pointsRemaining > 0 ? `Rumo ao Nível ${nextRank}` : 'Nível Máximo Atingido!'}
                            </span>
                            <span className="font-bold text-premium-gold">
                                {progressPercent}%
                            </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden p-0.5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-xs transition-all duration-500"
                                style={{ width: `${Math.max(5, progressPercent)}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 pt-0.5">
                            <span>{pointsRemaining > 0 ? `Faltam ${pointsRemaining} pts para ${nextRank}` : 'Você é lenda no Glorioso'}</span>
                            <span>+5 pts a cada 5m no app</span>
                        </div>
                    </div>
                </div>

                {/* 3. PREMIUM VIP CARD */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-amber-500/30 shadow-xl p-5 sm:p-6">
                    {/* Ambient Glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2">
                                    <Crown size={11} className="fill-current" />
                                    {isPremium ? 'Membro Ativo' : 'Experiência Completa'}
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                                    {isPremium ? 'Sua Assinatura Fogão Premium' : 'Desbloqueie o Fogão Premium'}
                                </h3>
                                <p className="text-xs text-zinc-300 mt-1 leading-relaxed max-w-md">
                                    {isPremium
                                        ? 'Você tem acesso ilimitado a todas as análises táticas, áudio em alta fidelidade e zero anúncios.'
                                        : 'Acesse análises exclusivas, podcasts alvinegros, vídeos especiais e navegue sem anúncios.'}
                                </p>
                            </div>
                            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex-shrink-0">
                                <Crown size={24} className="fill-current" />
                            </div>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                                <CheckCircle2 size={13} className="text-amber-400 flex-shrink-0" />
                                <span>Zero Anúncios</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                                <CheckCircle2 size={13} className="text-amber-400 flex-shrink-0" />
                                <span>Análises Táticas</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                                <CheckCircle2 size={13} className="text-amber-400 flex-shrink-0" />
                                <span>Áudio em HD</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => setShowSubscriptionModal(true)}
                            className="w-full mt-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-[0.14em] shadow-[0_4px_18px_rgba(245,158,11,0.3)] hover:brightness-105 active:scale-[0.99] transition-all"
                        >
                            {isPremium ? 'Gerenciar Assinatura' : 'Assinar Agora • Teste Exclusivo'}
                        </button>
                    </div>
                </div>

                {/* 4. APARÊNCIA (THEME SELECTOR) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-premium-gold" />
                            <h4 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
                                Aparência
                            </h4>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-medium">Tema Visual</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={cn(
                                "flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-bold text-xs transition-all active:scale-98 border",
                                theme === 'light'
                                    ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 shadow-sm font-black"
                                    : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            )}
                        >
                            <Sun size={16} className={theme === 'light' ? 'text-amber-500 fill-amber-500' : ''} />
                            Tema Claro
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={cn(
                                "flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-bold text-xs transition-all active:scale-98 border",
                                theme === 'dark'
                                    ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-sm font-black"
                                    : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            )}
                        >
                            <Moon size={16} className={theme === 'dark' ? 'text-amber-400 fill-amber-400' : ''} />
                            Tema Escuro
                        </button>
                    </div>
                </div>

                {/* 5. ACESSIBILIDADE DE ÁUDIO */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Volume2 size={17} className="text-premium-gold" />
                            <h4 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
                                Acessibilidade de Áudio
                            </h4>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-medium">Narração</span>
                    </div>

                    {/* Speed Selector */}
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Velocidade de Leitura
                        </span>
                        <AudioSpeedControl />
                    </div>

                    {/* Voice Selector */}
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Voz Brasileira (PT-BR)
                        </span>
                        <VoiceSelector />
                    </div>
                </div>

                {/* 6. NOTIFICAÇÕES */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-5 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-premium-gold" />
                            <h4 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
                                Notificações do Clube
                            </h4>
                        </div>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        {/* Breaking news */}
                        <div
                            onClick={toggleBreaking}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">Última Hora</span>
                                    <span className="text-[11px] text-zinc-400">Escalações, contratações e notícias urgentes</span>
                                </div>
                            </div>
                            <div className={cn(
                                "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer",
                                notifyBreaking ? "bg-premium-gold" : "bg-zinc-200 dark:bg-zinc-700"
                            )}>
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                                    notifyBreaking ? "translate-x-5" : "translate-x-0"
                                )} />
                            </div>
                        </div>

                        {/* Daily wrap */}
                        <div
                            onClick={toggleDaily}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">Giro do Fogão</span>
                                    <span className="text-[11px] text-zinc-400">Resumo matinal de vídeos e tabela</span>
                                </div>
                            </div>
                            <div className={cn(
                                "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer",
                                notifyDaily ? "bg-premium-gold" : "bg-zinc-200 dark:bg-zinc-700"
                            )}>
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                                    notifyDaily ? "translate-x-5" : "translate-x-0"
                                )} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. CONTA & ATALHOS */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    <Link
                        href="/settings"
                        className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                <Settings size={17} />
                            </div>
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                Configurações Avançadas da Conta
                            </span>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                                <LogOut size={16} />
                            </div>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">
                                Sair da Conta
                            </span>
                        </div>
                        <ChevronRight size={16} className="text-red-300 dark:text-red-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Footer Info */}
                <div className="text-center pt-2 pb-6 text-[11px] text-zinc-400 dark:text-zinc-600 space-y-1">
                    <p className="font-semibold tracking-wider uppercase">Fogão 360 • Oficial da Torcida Alvinegra</p>
                    <p className="text-[10px]">Versão 2.4.0 • Botafogo de Futebol e Regatas</p>
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

function AudioSpeedControl() {
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
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
            {[0.5, 1, 1.5, 2].map((speed) => {
                const isActive = currentSpeed === speed;
                return (
                    <button
                        key={speed}
                        type="button"
                        onClick={() => setSpeed(speed)}
                        className={cn(
                            "py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95",
                            isActive
                                ? "bg-white dark:bg-zinc-900 text-premium-gold shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        )}
                    >
                        {speed}x
                    </button>
                );
            })}
        </div>
    );
}

function VoiceSelector() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const loadVoices = () => {
            if (!isMounted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
            const available = window.speechSynthesis.getVoices();
            const ptVoices = available.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
            const targetList = ptVoices.length > 0 ? ptVoices : available;
            
            setVoices(prev => (prev.length === targetList.length ? prev : targetList));

            const saved = localStorage.getItem('voiceName');
            if (saved) setSelectedVoice(saved);
        };

        loadVoices();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            isMounted = false;
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    const handleSelect = (voiceName: string) => {
        localStorage.setItem('voiceName', voiceName);
        setSelectedVoice(voiceName);
    };

    return voices.length > 0 ? (
        <div className="relative">
            <select
                value={selectedVoice}
                onChange={(event) => handleSelect(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:border-premium-gold dark:focus:border-premium-gold transition-colors"
                aria-label="Selecionar voz em português"
            >
                <option value="">Voz padrão do aparelho</option>
                {voices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <ChevronRight size={14} className="rotate-90" />
            </div>
        </div>
    ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-400 italic">
            Voz nativa do sistema em português ativa
        </div>
    );
}
