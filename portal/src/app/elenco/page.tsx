import { db } from '@/lib/firebase-admin';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

interface Player {
    id: string;
    name: string;
    position: string; // G, D, M, A
    group: string;
    image: string | null;
    age: string;
    country: string;
    number: string | null;
}

async function getSquad(): Promise<Player[]> {
    try {
        const snapshot = await db.collection('squad')
            .limit(100) // Safe limit for a squad
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    } catch (error) {
        console.error("Error fetching squad (likely quota exceeded):", error);
        return [];
    }
}

const POSITION_MAP: Record<string, string> = {
    'G': 'Goleiros',
    'D': 'Defensores',
    'M': 'Meio-Campistas',
    'A': 'Atacantes'
};

const ORDER = ['G', 'D', 'M', 'A'];

export default async function ElencoPage() {
    const players = await getSquad();

    // Group by position code
    const groupedPlayers = players.reduce((acc, player) => {
        const pos = player.position || 'Unknown';
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(player);
        return acc;
    }, {} as Record<string, Player[]>);

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-premium-gold/15 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
                    <Link href="/" className="p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors group">
                        <ChevronLeft className="text-foreground/70 group-hover:text-premium-gold transition-colors" />
                    </Link>
                    <h1 className="text-lg font-black uppercase tracking-wider text-foreground">
                        Elenco <span className="text-premium-gold">2026</span>
                    </h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-8">
                {ORDER.map(posCode => {
                    const groupTitle = POSITION_MAP[posCode];
                    const groupPlayers = groupedPlayers[posCode];

                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <section key={posCode} className="space-y-3">
                            <div className="flex items-center gap-3 mb-4 px-1">
                                <div className="h-5 w-1 bg-premium-gold rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                                <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-widest">
                                    {groupTitle}
                                </h2>
                            </div>

                            {/* EXTREME COMPACT GRID: 5 cols mobile, 6 sm, 7 md, 8 lg, 9 xl */}
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-1.5">
                                {groupPlayers.map(player => (
                                    <div
                                        key={player.id}
                                        className="group relative aspect-[3/4] overflow-hidden rounded-md bg-card-bg border border-premium-gold/15 hover:border-premium-gold/40 transition-all duration-300 hover:z-50 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                                    >
                                        {/* Image Background */}
                                        <div className="absolute inset-0 bg-graphite">
                                            {player.image ? (
                                                <Image
                                                    src={player.image}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 20vw, 10vw"
                                                    priority={false}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-foreground/5">
                                                    <Shield size={24} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                        {/* Number Badge (Micro) */}
                                        {player.number && (
                                            <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-premium-gold/90 flex items-center justify-center text-black font-black text-[7px] shadow-sm backdrop-blur-sm">
                                                {player.number}
                                            </div>
                                        )}

                                        {/* Content Overlay (Bottom) */}
                                        <div className="absolute bottom-0 inset-x-0 p-1.5 pt-4 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end">

                                            {/* Name */}
                                            <h3 className="text-white text-[9px] sm:text-[10px] font-bold leading-none uppercase tracking-tight mb-0 group-hover:text-premium-gold transition-colors truncate text-center">
                                                {player.name.split(' ')[0]}
                                            </h3>

                                            {/* Full Name Hover */}
                                            <div className="hidden group-hover:block absolute bottom-6 left-[-10px] right-[-10px] bg-background/95 p-1 text-[9px] text-foreground text-center z-50 rounded border border-premium-gold/15 shadow-xl whitespace-nowrap">
                                                {player.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
