"use client";

import { useEffect, useState } from 'react';
import { X, Sunrise, Moon, ChevronDown, ChevronUp, TrendingUp, Users, Trophy, DollarSign, Briefcase, Target, Zap } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface DailyBriefing {
    general_summary?: string;
    editorial_summary?: string;
    reading_time?: string;
    indicators?: {
        next_match?: string;
        location?: string;
        market?: string;
    };
    top_stories?: any[];
    generated_at_formatted?: string;
}

function getBriefingWindow(): '07h' | '20h' | null {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) return '07h';
    if (hour >= 19 && hour <= 23) return '20h';
    return null;
}

function getSeenKey(): string {
    const today = new Date().toLocaleDateString('en-CA');
    const window = getBriefingWindow();
    return `briefing_seen_${today}_${window}`;
}

// Enhanced text formatting with icons and visual elements
function formatEnhancedText(text: string) {
    // Keywords to highlight with icons and colors
    const highlights: { pattern: RegExp; icon: string; color: string; bgColor: string }[] = [
        { pattern: /transfer\s*ban/gi, icon: '🚫', color: 'text-red-400', bgColor: 'bg-red-500/10' },
        { pattern: /contratação|contratou|reforço/gi, icon: '✅', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { pattern: /lesão|lesionado|DM|departamento médico/gi, icon: '🏥', color: 'text-red-400', bgColor: 'bg-red-500/10' },
        { pattern: /gol|marcou|vitória|venceu/gi, icon: '⚽', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { pattern: /milhões|milhão|R\$|dólares/gi, icon: '💰', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
        { pattern: /Anselmi|técnico|comissão técnica/gi, icon: '📋', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
        { pattern: /mercado|transferência|saída|chegada/gi, icon: '🔄', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
        { pattern: /Libertadores|Campeonato|Carioca|Brasileirão/gi, icon: '🏆', color: 'text-premium-gold', bgColor: 'bg-premium-gold/10' },
        { pattern: /treino|treinamento|atividade/gi, icon: '🏃', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
        { pattern: /diretoria|SAF|Eagle Football/gi, icon: '🏢', color: 'text-zinc-300', bgColor: 'bg-zinc-500/10' },
    ];

    // First handle **bold** markers
    let result = text;
    const parts: (string | React.ReactNode)[] = [];

    // Split by bold markers first
    const boldSplit = result.split(/(\*\*.*?\*\*)/g);

    let keyIndex = 0;
    boldSplit.forEach((segment) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
            const content = segment.slice(2, -2);
            parts.push(
                <span key={`bold-${keyIndex++}`} className="font-bold text-premium-gold border-b border-premium-gold/30">
                    {content}
                </span>
            );
        } else {
            // Check for keyword highlights in non-bold text
            let processedSegment = segment;
            let hasHighlight = false;

            for (const { pattern, icon, color, bgColor } of highlights) {
                if (pattern.test(processedSegment)) {
                    const splitByKeyword = processedSegment.split(pattern);
                    const matches = processedSegment.match(pattern) || [];

                    splitByKeyword.forEach((part, idx) => {
                        if (part) parts.push(part);
                        if (matches[idx]) {
                            parts.push(
                                <span
                                    key={`hl-${keyIndex++}`}
                                    className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded ${bgColor} ${color} font-medium`}
                                >
                                    <span className="text-[10px]">{icon}</span>
                                    {matches[idx]}
                                </span>
                            );
                        }
                    });
                    hasHighlight = true;
                    break; // Only apply first matching highlight
                }
            }

            if (!hasHighlight) {
                parts.push(segment);
            }
        }
    });

    return parts;
}

export default function MorningBriefingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [currentWindow, setCurrentWindow] = useState<'07h' | '20h' | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAndFetch = async () => {
            const forceOpen = searchParams.get('briefing') === 'true';
            const window = getBriefingWindow();
            setCurrentWindow(window);

            if (!forceOpen && !window) return;

            const seenKey = getSeenKey();
            const alreadySeen = localStorage.getItem(seenKey);

            if (!forceOpen && alreadySeen === 'true') return;

            try {
                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data && (data.general_summary || data.editorial_summary)) {
                        setBriefing(data);
                        setIsVisible(true);
                        if (forceOpen) setIsExpanded(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching briefing:", error);
            }
        };
        checkAndFetch();
    }, [searchParams]);

    const handleDismiss = () => {
        setIsVisible(false);
        const seenKey = getSeenKey();
        localStorage.setItem(seenKey, 'true');

        const today = new Date().toLocaleDateString('en-CA');
        const window = getBriefingWindow() || '07h';
        const briefingNotifId = `briefing-${today}-${window}`;
        const readHistory = JSON.parse(localStorage.getItem('read_notifications_v1') || '{}');
        readHistory[briefingNotifId] = Date.now();
        localStorage.setItem('read_notifications_v1', JSON.stringify(readHistory));

        if (searchParams.get('briefing') === 'true') {
            router.replace(pathname, { scroll: false });
        }
    };

    if (!isVisible || !briefing) return null;

    const isMorning = currentWindow === '07h';
    const WindowIcon = isMorning ? Sunrise : Moon;
    const summaryText = briefing.editorial_summary || briefing.general_summary || "";

    return (
        <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 px-3 md:px-4 flex justify-center pointer-events-none">
            <div className="w-full max-w-lg bg-zinc-950 shadow-2xl shadow-black/80 rounded-xl overflow-hidden pointer-events-auto animate-in slide-in-from-top-2 duration-300 border border-zinc-800/50 relative">

                {/* Background Image - Real Stadium Photo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-[0.10] grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
                </div>

                {/* Premium glow effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-premium-gold/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-premium-gold/3 rounded-full blur-2xl pointer-events-none" />

                {/* Decorative top line */}
                <div className="relative h-[2px] bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-premium-gold/30 rounded-lg blur-md" />
                            <div className="relative p-2 rounded-lg bg-gradient-to-br from-premium-gold/20 to-premium-gold/5">
                                <WindowIcon className="text-premium-gold" size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                {isMorning ? 'Bom Dia!' : 'Boa Noite!'}
                                <Zap size={12} className="text-premium-gold" />
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-zinc-400">
                                    {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="text-[9px] font-bold text-premium-gold bg-premium-gold/15 px-1.5 py-0.5 rounded">
                                    {currentWindow}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isExpanded && (
                    <div className="px-4 py-4">
                        {/* Summary with enhanced formatting */}
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-premium-gold via-premium-gold/50 to-transparent" />
                            <p className="text-[13px] text-white/90 leading-[1.8] pl-4">
                                {formatEnhancedText(summaryText)}
                            </p>
                        </div>

                        {/* Indicators - Bright Pills */}
                        {briefing.indicators && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800/30">
                                {briefing.indicators.next_match && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 rounded-lg">
                                        <Trophy size={11} className="text-premium-gold" />
                                        <span className="text-[10px] text-white font-medium">
                                            Botafogo: {briefing.indicators.next_match}
                                        </span>
                                    </div>
                                )}
                                {briefing.indicators.location && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 rounded-lg">
                                        <Target size={11} className="text-white" />
                                        <span className="text-[10px] text-white font-medium">{briefing.indicators.location}</span>
                                    </div>
                                )}
                                {briefing.indicators.market && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 rounded-lg">
                                        <TrendingUp size={11} className="text-white" />
                                        <span className="text-[10px] text-white font-medium line-clamp-1">{briefing.indicators.market}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer */}
                        {briefing.generated_at_formatted && (
                            <div className="mt-3 flex justify-end">
                                <span className="text-[9px] text-zinc-600 italic">
                                    Atualizado às {briefing.generated_at_formatted}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom accent */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>
        </div>
    );
}
