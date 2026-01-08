import { db } from '@/lib/firebase-admin';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Shield, User } from 'lucide-react';

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
        const snapshot = await db.collection('squad').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    } catch (error) {
        console.error("Error fetching squad:", error);
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
        <main className="min-h-screen bg-neutral-950 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
                    <Link href="/" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
                        <ChevronLeft className="text-white" />
                    </Link>
                    <h1 className="text-lg font-black uppercase tracking-wider text-white">
                        Elenco <span className="text-premium-gold">2026</span>
                    </h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-12">
                {ORDER.map(posCode => {
                    const groupTitle = POSITION_MAP[posCode];
                    const groupPlayers = groupedPlayers[posCode];

                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <section key={posCode} className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-1 bg-premium-gold rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                                    {groupTitle}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {groupPlayers.map(player => (
                                    <div
                                        key={player.id}
                                        className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-white/5 hover:border-premium-gold/30 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-950">
                                            {player.image ? (
                                                <Image
                                                    src={player.image}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                                    <Shield size={64} strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                            {/* Number Badge (Hypothetical if we had it) */}
                                            {/* <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-premium-gold/90 flex items-center justify-center text-black font-black text-xs shadow-lg">
                                                {player.number}
                                            </div> */}
                                        </div>

                                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                                            <div className="flex items-center gap-2 mb-1">
                                                {/* Country Flag could go here if we had a mapping */}
                                                <span className="text-[10px] font-bold text-premium-gold/80 px-1.5 py-0.5 rounded bg-premium-gold/10 border border-premium-gold/20 uppercase">
                                                    {player.country || 'BRA'}
                                                </span>
                                                <span className="text-[10px] text-white/60 font-medium">
                                                    {player.age} anos
                                                </span>
                                            </div>
                                            <h3 className="text-white font-bold leading-tight group-hover:text-premium-gold transition-colors">
                                                {player.name}
                                            </h3>
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
