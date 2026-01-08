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
            <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
                    <Link href="/" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors group">
                        <ChevronLeft className="text-white/70 group-hover:text-premium-gold transition-colors" />
                    </Link>
                    <h1 className="text-lg font-black uppercase tracking-wider text-white">
                        Elenco <span className="text-premium-gold">2026</span>
                    </h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-10">
                {ORDER.map(posCode => {
                    const groupTitle = POSITION_MAP[posCode];
                    const groupPlayers = groupedPlayers[posCode];

                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <section key={posCode} className="space-y-3">
                            <div className="flex items-center gap-3 mb-4 px-1">
                                <div className="h-5 w-1 bg-premium-gold rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-widest">
                                    {groupTitle}
                                </h2>
                            </div>

                            {/* ULTRA COMPACT GRID: 4 cols mobile, 5 sm, 7 lg, 8 xl */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2">
                                {groupPlayers.map(player => (
                                    <div
                                        key={player.id}
                                        className="group relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-900 border border-white/5 hover:border-premium-gold/40 transition-all duration-300 hover:z-10 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                                    >
                                        {/* Image Background */}
                                        <div className="absolute inset-0 bg-neutral-800">
                                            {player.image ? (
                                                <Image
                                                    src={player.image}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 25vw, 15vw"
                                                    priority={false}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                                    <Shield size={32} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                        {/* Number Badge (Very Small) */}
                                        {player.number && (
                                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-premium-gold/90 flex items-center justify-center text-black font-black text-[8px] shadow-sm backdrop-blur-sm">
                                                {player.number}
                                            </div>
                                        )}

                                        {/* Content Overlay (Bottom) */}
                                        <div className="absolute bottom-0 inset-x-0 p-2 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">

                                            {/* Name */}
                                            <h3 className="text-white text-[10px] sm:text-xs font-bold leading-tight uppercase tracking-tight mb-0 group-hover:text-premium-gold transition-colors truncate">
                                                {player.name.split(' ')[0]} {player.name.split(' ').length > 1 ? player.name.split(' ')[1][0] + '.' : ''}
                                            </h3>

                                            {/* Full Name on Hover Tooltip (Simulated) */}
                                            <div className="hidden group-hover:block absolute bottom-8 left-0 right-0 bg-black/90 p-1 text-[9px] text-white text-center z-20 rounded border border-white/10 mx-1 shadow-xl">
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
