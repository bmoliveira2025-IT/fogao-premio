"use client";

import { useState } from 'react';
import { Star, Mail, Lock, ArrowRight, User, Loader2, ChevronRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // For Sign Up
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isSignUp) {
                // Sign Up Logic
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
            } else {
                // Login Logic
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.push('/');
        } catch (err: any) {
            console.error("Auth Error:", err);
            let msg = 'Erro na autenticação.';
            if (err.code === 'auth/email-already-in-use') msg = 'Este e-mail já está em uso.';
            if (err.code === 'auth/weak-password') msg = 'A senha deve ter pelo menos 6 caracteres.';
            if (err.code === 'auth/invalid-email') msg = 'E-mail inválido.';
            if (err.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
            if (err.code === 'auth/wrong-password') msg = 'Senha incorreta.';
            if (err.code === 'auth/invalid-credential') msg = 'Credenciais inválidas.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError('Erro ao entrar com Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">

            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" /> {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop"
                    alt="Stadium Background"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            {/* Glass Card */}
            <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl ring-1 ring-white/5">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-premium-gold to-premium-gold/80 shadow-[0_0_30px_rgba(var(--premium-gold),0.4)] mb-4 transform hover:scale-105 transition-transform duration-500">
                        <Star className="text-black fill-black" size={24} />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                        {isSignUp ? 'Crie sua conta' : 'Fogão Prêmio'}
                    </h1>
                    <p className="text-white/50 text-sm font-medium">
                        {isSignUp ? 'Junte-se à elite alvinegra' : 'Acesse o conteúdo exclusivo'}
                    </p>
                </div>

                {/* Main Actions */}
                <div className="space-y-6">

                    {/* Google Login (Primary) */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold h-12 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-lg group relative overflow-hidden"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-sm tracking-wide">
                            {isSignUp ? 'Cadastrar com Google' : 'Continuar com Google'}
                        </span>
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-black/50 px-4 text-[10px] text-white/30 font-bold uppercase tracking-widest backdrop-blur-sm rounded-full">
                                Ou use seu e-mail
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div role="alert" className="ui-alert ui-alert-error bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            {isSignUp && (
                                <div className="relative group animate-in slide-in-from-top-2 fade-in duration-300">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-premium-gold transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-premium-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-premium-gold transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-premium-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-premium-gold transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-premium-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-premium-gold text-black font-black uppercase tracking-widest h-12 rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(var(--premium-gold),0.15)]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                                    {isSignUp ? <UserPlus size={16} /> : <ArrowRight size={16} />}
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs text-white/60 hover:text-premium-gold transition-colors font-medium"
                            >
                                {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Crie uma agora'}
                            </button>
                        </div>
                    </form>

                    {/* Guest Option */}
                    <div className="pt-2 text-center border-t border-white/5 mt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 text-white/40 hover:text-premium-gold transition-colors group px-4 py-2 mt-2"
                        >
                            <User size={14} className="group-hover:text-premium-gold transition-colors" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Visitante? Entrar sem conta
                            </span>
                            <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 w-full text-center z-20">
                <p className="text-[10px] text-white/20">
                    &copy; 2026 Fogão Prêmio. Feito por alvinegros.
                </p>
            </div>
        </main>
    );
}
