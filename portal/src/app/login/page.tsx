"use client";

import { useState } from 'react';
import { Star, Mail, Lock, ArrowRight, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            console.error("Login Error:", err);
            // Translate common Firebase errors
            let msg = 'Erro ao fazer login. Verifique suas credenciais.';
            if (err.code === 'auth/invalid-email') msg = 'E-mail inválido.';
            if (err.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
            if (err.code === 'auth/wrong-password') msg = 'Senha incorreta.';
            if (err.code === 'auth/operation-not-allowed') msg = 'Login não habilitado no Firebase (Console).';
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
            let msg = 'Erro ao entrar com Google.';
            if (err.code === 'auth/popup-closed-by-user') msg = 'Login cancelado pelo usuário.';
            if (err.code === 'auth/operation-not-allowed') msg = 'Google Auth não habilitado no Firebase (Console).';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-premium-gold selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background via-background/95 to-background/80 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm space-y-8">

                {/* Logo Area */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-premium-gold to-[#B8860B] shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-2">
                        <Star className="text-black fill-black" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black tracking-tight text-foreground mb-1">
                            Bem-vindo
                        </h1>
                        <p className="text-sm text-foreground/40 font-medium">
                            Acesse o universo <span className="text-premium-gold">Fogão Premium</span>
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-lg text-center animate-pulse">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-premium-gold/50 focus:bg-foreground/10 transition-all placeholder:text-foreground/20"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                            <input
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-premium-gold/50 focus:bg-foreground/10 transition-all placeholder:text-foreground/20"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <button type="button" className="text-[11px] font-bold text-foreground/40 hover:text-foreground transition-colors">
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-premium-gold text-black font-black uppercase tracking-widest py-3.5 rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={14} /> : (
                            <>
                                <span>Entrar na conta</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-foreground/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 text-foreground/30 font-bold uppercase tracking-widest text-[10px]">Ou continue com</span>
                    </div>
                </div>

                {/* Social Login */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-card text-foreground font-bold py-3.5 rounded-xl text-xs hover:bg-foreground/5 border border-foreground/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </button>
            </div>

            {/* Guest Link */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <Link href="/" className="inline-flex items-center space-x-2 text-foreground/30 hover:text-foreground transition-colors group px-4 py-2">
                    <User size={14} className="group-hover:text-premium-gold transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Entrar como Convidado</span>
                </Link>
            </div>
        </main>
    );
}
