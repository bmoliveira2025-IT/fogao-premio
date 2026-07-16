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

  // Simple keyword-based filtering since we don't have explicit categories
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

  // If a filter is too strict and returns no results, show all (fallback)
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
      <div className="flex gap-3 overflow-x-auto py-5 no-scrollbar -mx-5 px-5">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={cn(
              "px-4 py-1.5 text-[13px] font-bold rounded-xl whitespace-nowrap transition-all",
              activeFilter === filter
                ? "bg-green-700 text-white shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-zinc-600"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-1 pb-4">
        {displayNews.slice(0, visibleCount).map((article) => (
          <LightNewsRow key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Observer Target */}
      {visibleCount < displayNews.length && (
        <div ref={loadMoreRef} className="h-12 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin opacity-50"></div>
        </div>
      )}
      
      {/* Fallback padding if no more items */}
      {visibleCount >= displayNews.length && (
        <div className="h-8" aria-hidden="true" />
      )}
    </div>
  );
}
