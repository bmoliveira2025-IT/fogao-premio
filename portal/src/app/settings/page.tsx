"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Key, Mail, Trash2, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import Link from 'next/link';

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
            setTimeout(() => setResetSent(false), 5000);
        } catch (err: any) {
            setError('Erro ao enviar email de redefinição. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            // Note: Firebase requires recent authentication to delete a user.
            // If they haven't logged in recently, this will throw auth/requires-recent-login
            await deleteUser(user);
            router.push('/login');
        } catch (err: any) {
            if (err.code === 'auth/requires-recent-login') {
                setError('Para excluir sua conta, você precisa fazer login novamente. Saia e entre na sua conta para continuar.');
            } else {
                setError('Erro ao excluir conta. Tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-premium-gold selection:text-black">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-6 max-w-2xl mx-auto border-b border-white/5">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors group">
                    <ChevronLeft className="text-foreground/70 group-hover:text-premium-gold transition-colors" />
                </button>
                <h1 className="text-xl font-display font-black text-white">Configurações da Conta</h1>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

                {/* User Info */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">Seus Dados</h4>
                    <div className="glass-panel border border-white/[0.04] rounded-[1.5rem] overflow-hidden shadow-premium">
                        <div className="p-5 flex items-center space-x-4 border-b border-white/5">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <UserIcon size={24} className="text-white/50" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/90">{user?.displayName || 'Usuário Fogão'}</p>
                                <p className="text-xs text-white/40">Nome de Exibição</p>
                            </div>
                        </div>
                        <div className="p-5 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Mail size={24} className="text-white/50" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/90">{user?.email || 'email@exemplo.com'}</p>
                                <p className="text-xs text-white/40">Email Cadastrado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">Segurança</h4>
                    <div className="glass-panel border border-white/[0.04] rounded-[1.5rem] overflow-hidden shadow-premium">
                        <button
                            onClick={handlePasswordReset}
                            disabled={loading || resetSent}
                            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20">
                                    <Key size={18} className="text-premium-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-premium-gold">Redefinir Senha</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Enviaremos um email de redefinição</p>
                                </div>
                            </div>
                            {resetSent && <span className="text-xs text-green-400 font-bold">Enviado!</span>}
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-2 pt-6">
                    <h4 className="text-[10px] font-black text-red-500/50 uppercase tracking-widest px-1 mb-2">Zona de Perigo</h4>
                    <div className="glass-panel border border-red-500/20 rounded-[1.5rem] overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full p-5 flex items-center space-x-4 hover:bg-red-500/10 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 group-hover:bg-red-500/20">
                                <Trash2 size={18} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-500">Excluir Conta Permanentemente</p>
                                <p className="text-[10px] text-red-500/50 uppercase tracking-widest mt-0.5">Esta ação não pode ser desfeita</p>
                            </div>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
                        <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
