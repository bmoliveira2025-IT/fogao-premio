import { db } from '@/lib/firebase-admin';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';
import { Suspense } from 'react';

export const revalidate = 0; // Disable cache for immediate updates

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
            .limit(100)
            .get();

        const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));

        // Deduplicate by Name
        const uniquePlayers = Array.from(new Map(players.map(item => [item.name, item])).values());

        return uniquePlayers;
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
        <main className="min-h-screen bg-background pb-10">
            {/* Content Header (Simple title, no full header) */}
            <div className="flex items-center gap-4 px-4 py-8 max-w-7xl mx-auto">
                <Link href="/" className="p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors group">
                    <ChevronLeft className="text-foreground/70 group-hover:text-premium-gold transition-colors" />
                </Link>
                <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                    Elenco <span className="text-premium-gold">2026</span>
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                {ORDER.map(posCode => {
                    const groupTitle = POSITION_MAP[posCode];
                    const groupPlayers = groupedPlayers[posCode];

                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <section key={posCode} className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                <div className="h-8 w-1.5 bg-gradient-to-b from-premium-gold to-yellow-600 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.4)]" />
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">
                                    {groupTitle}
                                </h2>
                            </div>

                            {/* EA FC Style Grid - Smaller cards */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
                                {groupPlayers.map(player => (
                                    <div
                                        key={player.id}
                                        className="group relative aspect-[0.7] overflow-hidden rounded-xl bg-gradient-to-b from-zinc-800 to-black border border-white/10 hover:border-premium-gold shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-2"
                                    >
                                        {/* Background Texture/Effect */}
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                                        {/* Player Image */}
                                        <div className="absolute inset-0 z-0">
                                            {player.image ? (
                                                <Image
                                                    src={player.image}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                                                    sizes="(max-width: 768px) 50vw, 20vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                                    <Shield size={48} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Golden Top Shield/Badge for Number */}
                                        {player.number && (
                                            <div className="absolute top-0 right-4 w-10 h-12 bg-gradient-to-b from-premium-gold to-yellow-700 clip-path-ribbon flex items-center justify-center shadow-lg z-20">
                                                <span className="text-xl font-black text-black drop-shadow-sm font-mono mt-[-4px]">
                                                    {player.number}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bottom Data Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-4 px-3 z-10">
                                            <div className="flex flex-col items-center text-center">
                                                {/* Name */}
                                                <h3 className="text-white text-[10px] md:text-xs font-black uppercase tracking-wider leading-none mb-1 group-hover:text-premium-gold transition-colors duration-300">
                                                    {player.name}
                                                </h3>

                                                {/* Meta Info */}
                                                <div className="flex items-center gap-1 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <div className="px-1 py-0.5 rounded bg-white/10 backdrop-blur-sm text-[7px] font-bold text-premium-gold uppercase">
                                                        {player.country.substring(0, 3)}
                                                    </div>
                                                    <span className="text-[8px] text-zinc-400 font-mono">
                                                        {player.age}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shiny Border Effect on Hover */}
                                        <div className="absolute inset-0 border border-white/0 group-hover:border-premium-gold/50 rounded-xl transition-all duration-300 pointer-events-none" />
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
