"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft, X, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import LightNewsRow from '@/components/LightNewsRow';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
    summary?: string;
    likes_count?: number;
    dislikes_count?: number;
}

const POPULAR_TAGS = [
    "John Textor",
    "Vitinho",
    "Reforços",
    "Escalação",
    "Brasileirão",
    "Libertadores",
    "Tabela"
];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                }
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false);
                setSearched(true);
            }
        };

        const timer = setTimeout(() => {
            fetchResults();
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectTag = (tag: string) => {
        setQuery(tag);
        router.replace(`/search?q=${encodeURIComponent(tag)}`);
    };

    const handleClear = () => {
        setQuery("");
        router.replace('/search');
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-4 pb-24 px-4 font-sans">
            <div className="max-w-2xl mx-auto space-y-5">
                
                {/* Top Bar Navigation */}
                <div className="flex items-center gap-3 py-1">
                    <Link
                        href="/"
                        className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors"
                        aria-label="Voltar para a página inicial"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Pesquisar Notícias</h1>
                        <p className="text-xs text-zinc-500 font-medium">Fogão 360 • Busca em tempo real</p>
                    </div>
                </div>

                {/* Instant Search Bar */}
                <div className="relative">
                    <div className="flex items-center bg-zinc-100 border border-zinc-200/80 rounded-2xl px-4 py-3 gap-3 focus-within:bg-white focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-900/5 shadow-xs transition-all">
                        <Search size={20} className="text-zinc-400 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por jogador, jogo, reforço ou assunto..."
                            className="w-full bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={handleClear}
                                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors shrink-0"
                                aria-label="Limpar pesquisa"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Popular Search Suggestions */}
                <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <TrendingUp size={14} className="text-amber-500" />
                        <span>Termos em alta</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_TAGS.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all border ${query.toLowerCase() === tag.toLowerCase() ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200/70'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="pt-3 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                            <Loader2 size={28} className="animate-spin text-amber-500" />
                            <span className="text-xs font-bold">Buscando as notícias mais recentes...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 px-1">
                                <span>{results.length} notícias encontradas</span>
                                {query && <span className="text-zinc-400">Para "{query}"</span>}
                            </div>
                            <div className="space-y-3">
                                {results.map((article) => (
                                    <LightNewsRow key={article.id} article={article} />
                                ))}
                            </div>
                        </>
                    ) : searched ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6">
                            <div className="w-14 h-14 bg-zinc-200/70 rounded-2xl flex items-center justify-center text-zinc-500">
                                <Search size={28} />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <h3 className="text-base font-bold text-zinc-900">Nenhum resultado encontrado</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Não encontramos notícias para "<span className="font-semibold text-zinc-800">{query}</span>". Tente termos como "Textor", "Vitinho" ou selecione uma das sugestões acima.
                                </p>
                            </div>
                            <button
                                onClick={handleClear}
                                className="mt-2 px-5 py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                            >
                                Ver todas as notícias
                            </button>
                        </div>
                    ) : null}
                </div>

            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 size={28} className="animate-spin text-amber-500" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
