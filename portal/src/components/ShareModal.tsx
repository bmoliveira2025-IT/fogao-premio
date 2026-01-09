"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Facebook, Twitter, Smartphone, Send } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: Smartphone, // Using Smartphone as a proxy for WhatsApp if simple-icons not available, or we can just use text. Actually Lucide doesn't have brand icons. I will use a generic icon or SVG if needed, but for now let's stick to Lucide placeholders or standard icons.
            // Wait, usually people use react-icons for brands, but I'll stick to Lucide for consistency with the codebase.
            // I'll create custom SVGs for brands to look premium.
            color: "bg-[#25D366]",
            href: `https://wa.me/?text=${encodeURIComponent(url)}` // Just URL to let WhatsApp generate the preview card cleanly
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "bg-[#000000]",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-[#1877F2]",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: "Telegram",
            icon: Send,
            color: "bg-[#0088cc]",
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        }
    ];

    // Custom WhatsApp Icon (Lucide doesn't have it)
    const WhatsAppIcon = () => (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>
    );

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
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-[#0a0a0a] border border-premium-gold/15 rounded-2xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 pb-2 flex items-center justify-between">
                                <h3 className="text-lg font-display font-bold text-white tracking-wide">
                                    Compartilhar
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Divider with Gold Accent */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent mb-6" />

                            {/* Share Options Grid */}
                            <div className="grid grid-cols-4 gap-4 px-6 mb-8">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${link.name === 'WhatsApp' ? 'bg-[#25D366]' : ''} ${link.name === 'Telegram' ? 'bg-[#0088cc]' : ''} ${link.name === 'Facebook' ? 'bg-[#1877F2]' : ''} ${link.name === 'Twitter' ? 'bg-black border border-premium-gold/15' : ''}`}>
                                            {link.name === 'WhatsApp' ? (
                                                <WhatsAppIcon />
                                            ) : (
                                                <link.icon size={22} className="text-white" />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider group-hover:text-premium-gold transition-colors">
                                            {link.name}
                                        </span>
                                    </a>
                                ))}
                            </div>

                            {/* Copy Link Section */}
                            <div className="px-6 pb-8">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">
                                    Link da Notícia
                                </label>
                                <div className="flex items-center gap-2 bg-white/5 border border-premium-gold/15 rounded-xl p-2 pr-2">
                                    <div className="flex-1 px-3 text-xs text-white/70 truncate font-mono select-all">
                                        {url}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className={`p-2 rounded-lg flex items-center justify-center transition-all duration-300 ${copied ? 'bg-green-500/20 text-green-500' : 'bg-premium-gold/10 text-premium-gold hover:bg-premium-gold/20'}`}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
