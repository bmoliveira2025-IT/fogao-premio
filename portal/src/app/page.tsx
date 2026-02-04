// Forced update - 2026-02-03 - Modern Homepage
import { db } from '@/lib/firebase-admin';
import PremiumNextMatch from '@/components/PremiumNextMatch';
import PremiumWidget from '@/components/PremiumWidget';
import CompactNewsRow from '@/components/CompactNewsRow';
import BotafogoTVCarousel from '@/components/BotafogoTVCarousel';
import QuoteBanner from '@/components/QuoteBanner';
import MatchDayPopup from '@/components/MatchDayPopup';
import ModernNavMenu from '@/components/ModernNavMenu';
import ModernHeroNews from '@/components/ModernHeroNews';
import InfiniteNewsGrid from '@/components/InfiniteNewsGrid';

import { ChevronRight, Users, Trophy } from 'lucide-react';
import Link from 'next/link';


export const revalidate = 0; // Disable cache for real-time updates

interface NewsItem {
  id: string;
  title: string;
  image?: string;
  source?: string;
  created_at: string;
  is_premium?: boolean;
  summary?: string;
  content?: string;
}

export interface MatchData {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  date: string;
  location: string;
  championship: string;
  status: string;
  home_team_logo?: string;
  away_team_logo?: string;
  stadium?: string;
  transmission?: string;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published_at: string;
}

async function getData(): Promise<{ news: NewsItem[]; matches: MatchData[]; videos: VideoItem[]; premiumNews: NewsItem[]; briefing: any }> {
  try {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 24); // 24h window

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      .limit(50); // Increased for infinite scroll

    const nextMatchRef = db.collection('matches').doc('next_match');
    const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(12);
    const premiumRef = db.collection('news').where('is_premium', '==', true).orderBy('created_at', 'desc').limit(3);
    const briefingRef = db.collection('daily_briefings').orderBy('created_at', 'desc').limit(1);

    const [newsSnap, nextMatchSnap, videosSnap, premiumSnap, briefingSnap] = await Promise.all([
      newsRef.get(),
      nextMatchRef.get(),
      videosRef.get(),
      premiumRef.get(),
      briefingRef.get()
    ]);

    const news = newsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        image: data.image,
        source: data.source,
        is_premium: data.is_premium,
        summary: data.summary,
        content: data.content,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      } as NewsItem;
    }).filter(item => !item.is_premium);

    const premiumNews = premiumSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        image: data.image,
        source: data.source,
        is_premium: data.is_premium,
        summary: data.summary,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      } as NewsItem;
    });

    const matches = [];
    if (nextMatchSnap.exists) {
      const data = nextMatchSnap.data()!;
      matches.push({
        id: data.match_id || nextMatchSnap.id,
        home_team: data.home_team || '',
        away_team: data.away_team || '',
        home_score: data.home_score || 0,
        away_score: data.away_score || 0,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        location: data.location || 'Estádio Nilton Santos',
        championship: data.championship || '',
        status: data.status || 'Agendado',
        home_team_logo: data.home_team_logo,
        away_team_logo: data.away_team_logo,
        stadium: data.stadium,
        transmission: data.transmission,
        display_time: data.display_time,
        match_id: data.match_id,
      } as MatchData);
    }

    const videos = videosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        url: data.url || '',
        thumbnail: data.thumbnail || '',
        published_at: data.published_at && typeof data.published_at.toDate === 'function'
          ? data.published_at.toDate().toISOString()
          : (data.published_at || new Date().toISOString()),
      } as VideoItem;
    });

    const briefing = !briefingSnap.empty ? {
      id: briefingSnap.docs[0].id,
      created_at: briefingSnap.docs[0].data().created_at?.toDate().toISOString() || new Date().toISOString(),
      ...briefingSnap.docs[0].data()
    } : null;

    return { news, matches, videos, premiumNews, briefing };

  } catch (error: any) {
    console.error("DATA FETCH ERROR DETAILS:", error);
    return { news: [], matches: [], videos: [], premiumNews: [], briefing: null };
  }
}


export default async function Home() {
  const { news, matches, videos, premiumNews, briefing } = await getData();

  const nextMatch = matches.length > 0 ? matches[0] : null;

  // CHECK FOR NOTIFICATIONS
  const notifications = [];
  const isMatchDay = nextMatch ? new Date(nextMatch.date).toDateString() === new Date().toDateString() : false;

  if (isMatchDay && nextMatch) {
    const time = new Date(nextMatch.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    notifications.push({
      id: `match-${nextMatch.id}`,
      type: 'MATCH' as const,
      title: 'Hoje tem Fogão!',
      message: `${nextMatch.home_team} x ${nextMatch.away_team} às ${time}`,
      timestamp: new Date().toISOString()
    });
  }

  const recentPremium = premiumNews.filter(item => {
    const created = new Date(item.created_at);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return diff < 86400000; // 24 hours
  });

  recentPremium.forEach(item => {
    notifications.push({
      id: `premium-${item.id}`,
      type: 'PREMIUM' as const,
      title: 'Novo Conteúdo Exclusivo',
      message: item.title,
      timestamp: item.created_at,
      link: `/news/${item.id}`
    });
  });

  if (briefing) {
    const briefingDate = new Date(briefing.created_at).toLocaleDateString('pt-BR');
    const today = new Date().toLocaleDateString('pt-BR');

    if (briefingDate === today) {
      notifications.push({
        id: `briefing-${briefing.id}`,
        type: 'BRIEFING' as const,
        title: 'Resumo do Dia',
        message: 'Confira os destaques de hoje no Fogão Prêmio',
        timestamp: briefing.created_at,
        link: '?briefing=true'
      });
    }
  }

  notifications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Separate first news for hero
  const heroNews = news[0];
  const remainingNews = news.slice(1);

  return (
    <div className="w-full font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 bg-white dark:bg-black">

      {/* MATCH DAY POPUP */}
      <MatchDayPopup nextMatch={nextMatch} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full transition-all duration-300 pb-20 lg:pb-10">
        <div className="container mx-auto px-0 md:px-4 lg:px-12 max-w-[1600px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">

            {/* --- CENTER COLUMN (Main Feed) --- */}
            <div className="lg:col-span-8 space-y-6 lg:space-y-12 animate-fade-in-up">

              {/* HERO NEWS - First News Highlight */}
              {heroNews && (
                <div className="px-0 md:px-0 mt-0 md:mt-8">
                  <ModernHeroNews news={heroNews} />
                </div>
              )}

              {/* NEXT MATCH - Mobile Only (After Hero) */}
              {nextMatch && (
                <div className="lg:hidden px-4 md:px-0">
                  <PremiumNextMatch match={nextMatch} />
                </div>
              )}

              {/* GLORIOSO TV (BOTAFOGO TV CAROUSEL) */}
              <div className="px-0 md:px-0">
                <BotafogoTVCarousel videos={videos} />
              </div>

              {/* INFINITE NEWS GRID - Mixed with Videos */}
              <div className="px-4 md:px-0">
                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-premium-gold rounded-full" />
                  Últimas Notícias
                </h2>
                <InfiniteNewsGrid
                  initialNews={remainingNews}
                  initialVideos={videos}
                />
              </div>

              {/* QUOTE BANNER */}
              <div className="px-4 md:px-0 mt-8 mb-8 lg:mb-0">
                <QuoteBanner />
              </div>

            </div>

            {/* --- RIGHT COLUMN (Widgets - Desktop Only) --- */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-8 mt-8">

              {/* Next Match Card */}
              <PremiumNextMatch match={nextMatch} />

              {/* Premium Widget */}
              <PremiumWidget news={premiumNews} />

              {/* Elenco Banner */}
              <Link href="/elenco" className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-premium-gold/40 transition-all p-6 flex items-center justify-between shadow-lg hover:shadow-premium-gold/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest group-hover:text-premium-gold transition-colors">
                        Elenco 2026
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
                        Plantel Completo
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-zinc-400 dark:text-zinc-600 group-hover:text-premium-gold transition-colors" size={20} />
                </div>
              </Link>

              {/* Standings Banner */}
              <Link href="/tabela" className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-premium-gold/40 transition-all p-6 flex items-center justify-between shadow-lg hover:shadow-premium-gold/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest group-hover:text-premium-gold transition-colors">
                        Classificação
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
                        Tabela Carioca 2026
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-zinc-400 dark:text-zinc-600 group-hover:text-premium-gold transition-colors" size={20} />
                </div>
              </Link>

              {/* Sidebar News Feed */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-premium-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-1 h-4 bg-premium-gold rounded-full" />
                  Últimas do Esporte
                </h3>
                <div className="space-y-4">
                  {news.slice(10, 16).map(article => (
                    <CompactNewsRow key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
