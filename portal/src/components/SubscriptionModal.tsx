'use client';

import { X, CreditCard, Shield, Star, Check, Smartphone, QrCode, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GloriosoLogo from '@/components/GloriosoLogo';
import { useState } from 'react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any; // Type as needed
}

export default function SubscriptionModal({ isOpen, onClose, user }: SubscriptionModalProps) {
    const [activeTab, setActiveTab] = useState<'card' | 'details'>('card');
    const memberSince = "Out 2023"; // Mock data
    const memberId = "90494021"; // Mock data
    const renewalDate = "15/10/2026";

    // Prevent scrolling when modal is open
    if (typeof window !== 'undefined') {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-premium-gold/20 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Header / Tabs */}
                            <div className="p-6 pb-2 bg-gradient-to-b from-premium-gold/10 to-transparent">
                                <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase text-center mb-6">
                                    <span className="text-premium-gold">Membro</span> Confirmado
                                </h2>

                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => setActiveTab('card')}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'card' ? 'bg-premium-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                    >
                                        Carteirinha
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'details' ? 'bg-premium-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                    >
                                        Detalhes
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">

                                {activeTab === 'card' && (
                                    <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                        {/* Digital Card */}
                                        <div className="aspect-[1.586/1] w-full rounded-2xl relative overflow-hidden shadow-2xl group perspective-1000">
                                            {/* Card Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 animate-gradient-xy">
                                                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-premium-gold/20 rounded-full blur-[80px]"></div>
                                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-premium-gold/10 rounded-full blur-[80px]"></div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="relative z-10 h-full p-6 flex flex-col justify-between border border-premium-gold/30 rounded-2xl">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <GloriosoLogo size={40} />
                                                        <h3 className="text-xs font-bold text-premium-gold uppercase tracking-[0.2em] mt-2">Glorioso 360</h3>
                                                    </div>
                                                    <div className="bg-premium-gold/10 border border-premium-gold/20 p-2 rounded-lg">
                                                        <QrCode size={32} className="text-premium-gold" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-end mb-1">
                                                        <p className="text-lg font-bold text-white uppercase tracking-wider shadow-black drop-shadow-md">
                                                            {user?.displayName || 'Torcedor VIP'}
                                                        </p>
                                                        <Shield size={16} className="text-premium-gold fill-premium-gold mb-1" />
                                                    </div>
                                                    <div className="flex justify-between text-[10px] text-white/50 font-mono uppercase tracking-widest">
                                                        <span>ID: {memberId}</span>
                                                        <span>Desde: {memberSince}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></div>
                                        </div>

                                        <p className="text-center text-xs text-white/30 italic">
                                            Apresente este QR Code em eventos exclusivos para validar sua entrada.
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">

                                        {/* Plan Status */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Plano Atual</p>
                                                <h3 className="text-lg font-bold text-white mt-0.5">Anual Premium</h3>
                                                <p className="text-[10px] text-premium-gold mt-1 flex items-center gap-1">
                                                    <Check size={10} /> Renovação automática em {renewalDate}
                                                </p>
                                            </div>
                                            <div className="h-10 w-10 bg-premium-gold/10 rounded-full flex items-center justify-center border border-premium-gold/20">
                                                <Star className="text-premium-gold fill-premium-gold" size={18} />
                                            </div>
                                        </div>

                                        {/* Benefits List */}
                                        <div>
                                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-1">Seus Benefícios</h4>
                                            <div className="space-y-2">
                                                <BenefitItem text="Acesso ilimitado a notícias exclusivas" />
                                                <BenefitItem text="Vídeos em 4K e Replays" />
                                                <BenefitItem text="Transmissões ao vivo sem anúncios" />
                                                <BenefitItem text="Descontos na loja oficial (15%)" />
                                                <BenefitItem text="Badge de Membro Verificado" />
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="border-t border-white/5 pt-4">
                                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-1">Método de Pagamento</h4>
                                            <div className="flex items-center justify-between bg-black rounded-lg p-3 border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white/10 p-2 rounded">
                                                        <CreditCard size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">Mastercard •••• 8829</p>
                                                        <p className="text-[10px] text-white/40">Expira em 12/28</p>
                                                    </div>
                                                </div>
                                                <button className="text-[10px] font-bold text-premium-gold hover:underline">ALTERAR</button>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-colors">
                                                Histórico
                                            </button>
                                            <button className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-bold text-white/60 hover:text-red-500 transition-colors">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/5 bg-zinc-950/50">
                                <button onClick={onClose} className="w-full py-3 bg-premium-gold hover:bg-premium-gold/90 text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-colors shadow-lg shadow-premium-gold/20">
                                    Fechar
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-premium-gold/20 transition-colors">
            <div className="bg-green-500/20 p-1 rounded-full">
                <Check size={10} className="text-green-500" />
            </div>
            <span className="text-xs font-medium text-white/80">{text}</span>
        </div>
    );
}
