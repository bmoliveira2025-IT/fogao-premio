"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Share2, Type, ExternalLink } from 'lucide-react';
import TabBar from '@/components/TabBar';

export default function ArticlePage() {
    const { id } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            const docRef = doc(db, 'news', id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setArticle(docSnap.data());
            }
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-premium-black animate-pulse" />;
    if (!article) return <div className="min-h-screen bg-premium-black flex items-center justify-center">Artigo não encontrado.</div>;

    return (
        <main className="min-h-screen bg-premium-black text-white pb-24">
            {/* Article Header Photo */}
            <div className="relative h-[40vh] w-full">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-premium-black/20 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <article className="px-6 -mt-20 relative z-10 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-premium-gold text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
                        {article.tags[0]}
                    </span>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">{article.source}</span>
                </div>

                <h1 className="text-2xl md:text-4xl mb-6 leading-tight">
                    {article.title}
                </h1>

                {/* Resumo Executivo */}
                <div className="glass-card p-5 rounded-2xl mb-8 border-l-4 border-l-premium-gold">
                    <h3 className="text-premium-gold text-xs uppercase mb-3 tracking-widest">Resumo Executivo</h3>
                    <ul className="space-y-2">
                        {article.summary.map((point: string, i: number) => (
                            <li key={i} className="text-sm text-white/80 flex items-start">
                                <span className="text-premium-gold mr-3">0{i + 1}</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-8 py-4 border-y border-white/5">
                    <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors">
                            <Share2 size={18} />
                            <span className="text-xs">Compartilhar</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors">
                            <Type size={18} />
                            <span className="text-xs">Fonte</span>
                        </button>
                    </div>
                    <a
                        href={article.original_url}
                        target="_blank"
                        className="text-premium-gold flex items-center space-x-1 text-xs font-bold"
                    >
                        <span>Ver Original</span>
                        <ExternalLink size={12} />
                    </a>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-white/90 leading-relaxed space-y-4">
                    {article.content.split('\n').map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </article>

            <TabBar />
        </main>
    );
}
