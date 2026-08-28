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
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-premium-gold selection:text-white">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-6 max-w-2xl mx-auto border-b border-zinc-200">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors group">
                    <ChevronLeft className="text-zinc-500 group-hover:text-premium-gold transition-colors" />
                </button>
                <h1 className="text-xl font-display font-black text-zinc-900">Configurações da Conta</h1>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

                {/* User Info */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">Seus Dados</h4>
                    <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                        <div className="p-5 flex items-center space-x-4 border-b border-zinc-100">
                            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200">
                                <UserIcon size={24} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{user?.displayName || 'Usuário Fogão'}</p>
                                <p className="text-xs text-zinc-500">Nome de Exibição</p>
                            </div>
                        </div>
                        <div className="p-5 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200">
                                <Mail size={24} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{user?.email || 'email@exemplo.com'}</p>
                                <p className="text-xs text-zinc-500">Email Cadastrado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">Segurança</h4>
                    <div className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                        <button
                            onClick={handlePasswordReset}
                            disabled={loading || resetSent}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20">
                                    <Key size={18} className="text-premium-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-premium-gold">Redefinir Senha</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Enviaremos um email de redefinição</p>
                                </div>
                            </div>
                            {resetSent && <span className="text-xs text-green-500 font-bold">Enviado!</span>}
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-2 pt-6">
                    <h4 className="text-[10px] font-black text-red-500/50 uppercase tracking-widest px-1 mb-2">Zona de Perigo</h4>
                    <div className="bg-white border border-red-200 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full p-5 flex items-center space-x-4 hover:bg-red-50 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-200 group-hover:bg-red-100">
                                <Trash2 size={18} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-600">Excluir Conta Permanentemente</p>
                                <p className="text-[10px] text-red-500/70 uppercase tracking-widest mt-0.5">Esta ação não pode ser desfeita</p>
                            </div>
                        </button>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="ui-alert ui-alert-error ui-alert-light p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                        <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
