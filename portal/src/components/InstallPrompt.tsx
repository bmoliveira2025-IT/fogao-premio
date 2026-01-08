"use client";

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // 1. Check if already installed/standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) {
            return;
        }

        // 2. Check if iOS
        // Simple check: looking for iPhone/iPad in user agent
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // 3. Listen for Android/Chrome install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Prevent mini-infobar
            setDeferredPrompt(e);
            setShowPrompt(true); // Show our custom UI
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 4. For iOS, we might want to show it anyway if it's not standalone
        if (isIosDevice) {
            // Delay slightly to not bombard immediately? Or just show.
            // User asked: "entrar no site a primeira vez... e toda vez que ele entrar"
            // Let's check session storage to avoid re-showing in same session if dismissed?
            // User said "toda vez que ele entrar". Let's show it.
            setShowPrompt(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:bottom-auto md:top-0">
            <div className="bg-zinc-900/95 backdrop-blur-md border border-premium-gold/30 rounded-xl shadow-2xl p-4 md:max-w-md md:mx-auto animate-in slide-in-from-bottom-10 fade-in duration-500">

                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl border border-premium-gold/20 flex items-center justify-center shrink-0">
                            {/* Use the new icon we made */}
                            <img src="/icon.png" alt="App Icon" className="w-10 h-10 object-contain" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-white text-sm">Instalar Fogão Prêmio</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed max-w-[240px]">
                                Tenha a melhor experiência! Veja as notícias do Botafogo direto pelo aplicativo, sem barra de navegação.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPrompt(false)}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-4">
                    {isIOS ? (
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-300 space-y-2 border border-white/5">
                            <p className="flex items-center gap-2">
                                1. Toque no botão <Share size={14} className="text-blue-400" /> <strong>Compartilhar</strong> abaixo.
                            </p>
                            <p className="flex items-center gap-2">
                                2. Selecione <span className="font-bold text-white">Adicionar à Tela de Início</span>.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleInstallClick}
                            className="w-full bg-premium-gold text-black font-bold text-sm py-2.5 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download size={16} />
                            Instalar Aplicativo
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
