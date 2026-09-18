"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Key, Mail, Trash2, User as UserIcon, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import Image from 'next/image';

export default function SettingsPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [resetSent, setResetSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setLoading(true);
        setError(null);
        try {
            await sendPasswordResetEmail(auth, user.email);
            setResetSent(true);
            setTimeout(() => setResetSent(false), 6000);
        } catch {
            setError('Erro ao enviar email de redefinição. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é permanente e irreversível.");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await deleteUser(user);
            router.push('/login');
        } catch (err: any) {
            if (err.code === 'auth/requires-recent-login') {
                setError('Para excluir sua conta por segurança, faça login novamente e repita o processo.');
            } else {
                setError('Erro ao excluir conta. Tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0f1013] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-premium-gold selection:text-black pb-28 transition-colors duration-200">
            {/* Header */}
            <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3 px-4 py-3.5 max-w-2xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        aria-label="Voltar"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-premium-gold block leading-tight">
                            Fogão 360
                        </span>
                        <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Configurações da Conta
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                {/* User Info */}
                <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 px-1">
                        Seus Dados Cadastrados
                    </h2>
                    <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        <div className="p-4 sm:p-5 flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-premium-gold to-zinc-400 dark:to-zinc-700 flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <Image src={user.photoURL} alt="Avatar" fill sizes="48px" className="rounded-full object-cover" />
                                    ) : (
                                        <UserIcon size={22} className="text-zinc-400 dark:text-zinc-500" />
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                                    Nome de Exibição
                                </span>
                                <p className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                                    {user?.displayName || 'Torcedor Alvinegro'}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                                    Email de Acesso
                                </span>
                                <p className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                                    {user?.email || 'Acesso como Convidado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 px-1">
                        Segurança & Acesso
                    </h2>
                    <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            disabled={loading || resetSent || !user?.email}
                            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-premium-gold flex-shrink-0">
                                    <Key size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-premium-gold transition-colors">
                                        Redefinir Senha
                                    </p>
                                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                        Enviaremos um link seguro para o seu email
                                    </p>
                                </div>
                            </div>
                            {resetSent ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    <CheckCircle2 size={13} />
                                    Enviado!
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-premium-gold opacity-80 group-hover:opacity-100">
                                    Solicitar
                                </span>
                            )}
                        </button>
                    </div>

                    {resetSent && (
                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-xs flex items-center gap-2.5">
                            <ShieldCheck size={18} className="flex-shrink-0 text-green-500" />
                            <span>Link enviado com sucesso para <strong>{user?.email}</strong>. Verifique sua caixa de entrada e spam.</span>
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="space-y-2 pt-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.14em] text-red-500/80 px-1">
                        Zona de Perigo
                    </h2>
                    <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-red-200/80 dark:border-red-900/40 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-red-50/70 dark:hover:bg-red-950/20 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200 dark:border-red-900/40 flex-shrink-0">
                                    <Trash2 size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Excluir Minha Conta Permanentemente
                                    </p>
                                    <p className="text-[11px] text-red-500/70 dark:text-red-400/60">
                                        Seus pontos, conquistas e dados serão apagados
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-red-500 opacity-70 group-hover:opacity-100">
                                Excluir
                            </span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                        <ShieldAlert className="shrink-0 mt-0.5 text-red-500" size={17} />
                        <p>{error}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
