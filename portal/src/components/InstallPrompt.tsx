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
        <div className="fixed inset-x-0 top-0 z-[99999] p-4 flex justify-center">
            <div className="bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl p-4 w-full max-w-md animate-in slide-in-from-top-full duration-700 shadow-black/10">

                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center shrink-0">
                            {/* Use the new icon we made */}
                            <img src="/icon.png" alt="App Icon" className="w-10 h-10 object-contain drop-shadow-sm" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-zinc-900 text-sm">Instalar Fogão Prêmio</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">
                                Tenha a melhor experiência! Veja as notícias do Botafogo direto pelo aplicativo, sem barra de navegação.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPrompt(false)}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-4">
                    {isIOS ? (
                        <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-600 space-y-2 border border-zinc-200">
                            <p className="flex items-center gap-2">
                                1. Toque no botão <Share size={14} className="text-blue-500" /> <strong>Compartilhar</strong> abaixo.
                            </p>
                            <p className="flex items-center gap-2">
                                2. Selecione <span className="font-bold text-zinc-900">Adicionar à Tela de Início</span>.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleInstallClick}
                            className="w-full bg-zinc-900 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
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
