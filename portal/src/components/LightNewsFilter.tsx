"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import LightNewsRow from "@/components/LightNewsRow";

interface NewsItem {
  id: string;
  title: string;
  image?: string;
  source?: string;
  created_at: string;
  is_premium?: boolean;
  summary?: string;
  content?: string;
  likes_count?: number;
  dislikes_count?: number;
}

interface LightNewsFilterProps {
  news: NewsItem[];
}

const FILTERS = ['Para Você', 'Mercado', 'Jogos', 'Clube'];
const ITEMS_PER_PAGE = 15;

export default function LightNewsFilter({ news }: LightNewsFilterProps) {
  const [activeFilter, setActiveFilter] = useState('Para Você');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Simple keyword-based filtering
  const filteredNews = news.filter((article) => {
    if (activeFilter === 'Para Você') return true;
    
    const content = (article.title + " " + (article.summary || "")).toLowerCase();
    
    if (activeFilter === 'Mercado') {
      return ["contratação", "reforço", "venda", "mercado", "proposta", "valores", "salário", "compra", "janela", "zagueiro", "atacante", "meia"].some(k => content.includes(k));
    }
    
    if (activeFilter === 'Jogos') {
      return ["jogo", "partida", "campeonato", "libertadores", "copa", "brasileirão", "vitória", "derrota", "empate", "gols", "escalação", "arbitragem"].some(k => content.includes(k));
    }
    
    if (activeFilter === 'Clube') {
      return ["clube", "ct", "treino", "textor", "diretoria", "bastidores", "patrocínio", "camisa", "ingressos", "sócio", "musa", "torcida"].some(k => content.includes(k));
    }
    
    return true;
  });

  const displayNews = filteredNews.length > 0 ? filteredNews : news;

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, displayNews.length));
      }
    }, { threshold: 0.1, rootMargin: '100px' });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayNews.length]);

  return (
    <div>
      {/* Filter Pills */}
      <div className="mx-auto grid w-full max-w-md grid-cols-4 items-center gap-1.5 py-5">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={cn(
              "min-h-11 min-w-0 px-1 py-2 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap transition-all duration-200 border active:scale-95",
              activeFilter === filter
                ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 shadow-xs"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-3 pb-4">
        {displayNews.slice(0, visibleCount).map((article) => (
          <LightNewsRow key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Observer Target */}
      {visibleCount < displayNews.length && (
        <div ref={loadMoreRef} className="h-14 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin opacity-80"></div>
        </div>
      )}
      
      {/* Fallback padding if no more items */}
      {visibleCount >= displayNews.length && (
        <div className="h-8" aria-hidden="true" />
      )}
    </div>
  );
}

