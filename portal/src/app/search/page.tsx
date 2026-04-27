"use client";

import { useSearchParams } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || "";

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-[1200px]">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Resultados da busca para</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">"{query}"</h1>
                    </div>
                </div>

                {/* Empty State / Results Placeholder */}
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                        <Search size={40} className="text-zinc-700" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Nenhum resultado encontrado</h2>
                    <p className="text-zinc-500 max-w-md">Não encontramos notícias ou jogos para sua pesquisa. Tente usar termos mais genéricos.</p>
                    
                    <Link href="/" className="mt-8 px-8 py-3 bg-premium-gold text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-transform active:scale-95">
                        Voltar para Início
                    </Link>
                </div>

            </div>
        </div>
    );
}
