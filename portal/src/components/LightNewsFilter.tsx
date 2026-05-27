"use client";

import { useState } from "react";
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

export default function LightNewsFilter({ news }: LightNewsFilterProps) {
  const [activeFilter, setActiveFilter] = useState('Para Você');

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

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto py-5 no-scrollbar -mx-5 px-5">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
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
      <div className="space-y-1 pb-24">
        {displayNews.slice(0, 15).map((article) => (
          <LightNewsRow key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
