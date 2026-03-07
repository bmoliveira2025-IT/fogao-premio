// Forced update - 2026-02-08 - Redesigned Homepage with Featured News
import { db } from '@/lib/firebase-admin';
import PremiumNextMatch from '@/components/PremiumNextMatch';
import PremiumWidget from '@/components/PremiumWidget';
import CompactNewsRow from '@/components/CompactNewsRow';
import BotafogoTVCarousel from '@/components/BotafogoTVCarousel';
import QuoteBanner from '@/components/QuoteBanner';
import MatchDayPopup from '@/components/MatchDayPopup';
import ModernNavMenu from '@/components/ModernNavMenu';
import NewsHeroGrid from '@/components/NewsHeroGrid';
import SmartNewsFeed from '@/components/SmartNewsFeed';
import StaggeredEntry from '@/components/StaggeredEntry';

import { ChevronRight, Users, Trophy } from 'lucide-react';
import Link from 'next/link';


export const revalidate = 60; // Enable ISR (60s) for better TTFB

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
  home_logo?: string;
  away_logo?: string;
  stadium?: string;
  transmission?: string;
  display_time?: string;
  match_id?: string;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published_at: string;
}

interface NotificationItem {
  id: string;
  type: 'MATCH' | 'PREMIUM' | 'BRIEFING';
  title: string;
  message: string;
  timestamp: string;
  link?: string;
}

interface Briefing {
  id: string;
  created_at: string;
  [key: string]: any; // Allow for other fields from Firestore
}

async function getData(): Promise<{ news: NewsItem[]; matches: MatchData[]; videos: VideoItem[]; premiumNews: NewsItem[]; briefing: Briefing | null }> {
  try {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 48); // 48h window

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      .limit(100); // Higher limit to account for deduplication

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

    const seenImages = new Set<string>();
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
        likes_count: data.likes_count || 0,
        dislikes_count: data.dislikes_count || 0,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      } as NewsItem;
    }).filter(item => {
      // 1. Remove Premium (already done in main query but double checking)
      if (item.is_premium) return false;

      // 2. Deduplicate by image URL
      if (!item.image) return true; // Keep text-only or default-image news
      if (seenImages.has(item.image)) return false;
      seenImages.add(item.image);
      return true;
    });

    const premiumNews = premiumSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        image: data.image,
        source: data.source,
        is_premium: data.is_premium,
        summary: data.summary,
        likes_count: data.likes_count || 0,
        dislikes_count: data.dislikes_count || 0,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      } as NewsItem;
    });

    // Transform and filter matches
    const matches: MatchData[] = [];
    const now = new Date();

    if (nextMatchSnap.exists) {
      const data = nextMatchSnap.data()!;
      const matchDate = data.date?.toDate?.() || new Date(data.date);
      const isFinished = data.status?.toLowerCase() === 'finalizado';

      // Strict check: if finished, don't show in upcoming/next match
      if (!isFinished) {
        matches.push({
          id: data.match_id || nextMatchSnap.id,
          home_team: data.home_team,
          away_team: data.away_team,
          home_score: data.home_score,
          away_score: data.away_score,
          date: matchDate.toISOString(),
          location: data.location,
          championship: data.championship || 'Carioca Série A',
          status: data.status,
          home_team_logo: data.home_team_logo || data.home_logo,
          away_team_logo: data.away_team_logo || data.away_logo,
          stadium: data.stadium,
          transmission: data.transmission,
          display_time: data.display_time,
          match_id: data.match_id,
        });
      }
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
    } as Briefing : null;

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
  const notifications: NotificationItem[] = [];
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

  notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Separate featured news (first 7) for the featured section
  const featuredNews = news.slice(0, 7);
  const feedNews = news.slice(7);

  return (
    <div className="w-full font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 bg-white dark:bg-black">

      {/* MATCH DAY POPUP - Disabled due to invalid date issues */}
      {/* <MatchDayPopup nextMatch={nextMatch} /> */}


      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full transition-all duration-300 pb-20 lg:pb-10">
        <div className="container mx-auto px-3 md:px-4 lg:px-12 max-w-[1600px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">

            {/* --- CENTER COLUMN (Main Feed) --- */}
            <div className="lg:col-span-8 space-y-6 lg:space-y-10">

              <StaggeredEntry staggerDelay={0.15}>
                {/* HERO NEWS GRID - Premium Editorial Hero */}
                {featuredNews.length > 0 && (
                  <div className="mt-0 md:mt-8">
                    <NewsHeroGrid news={featuredNews.slice(0, 4)} />
                  </div>
                )}

                {/* NEXT MATCH - Mobile Only - Disabled per user request */}
                {/* {nextMatch && (
                  <div className="lg:hidden">
                    <PremiumNextMatch match={nextMatch} />
                  </div>
                )} */}


                {/* GLORIOSO TV (BOTAFOGO TV CAROUSEL) */}
                <div className="px-0 md:px-0">
                  <BotafogoTVCarousel videos={videos} />
                </div>

                {/* SMART NEWS FEED - Lazy Loading 8+1 */}
                <SmartNewsFeed initialNews={feedNews} className="mt-4" />

                {/* QUOTE BANNER */}
                <div className="px-4 md:px-0 mt-8 mb-8 lg:mb-0">
                  <QuoteBanner />
                </div>
              </StaggeredEntry>

            </div>

            {/* --- RIGHT COLUMN (Widgets - Desktop Only) --- */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 lg:gap-8 mt-8">
              <StaggeredEntry delay={0.2} staggerDelay={0.1}>
                {/* Next Match Card - Disabled per user request */}
                {/* <PremiumNextMatch match={nextMatch} /> */}


                {/* Premium Widget */}
                <PremiumWidget news={premiumNews} />

                {/* Elenco Banner */}
                <Link href="/elenco" className="block group">
                  <div className="relative overflow-hidden rounded-[2rem] bg-card/60 backdrop-blur-xl border border-white/[0.04] hover:border-premium-gold/40 transition-all duration-500 ease-out p-8 flex items-center justify-between shadow-premium hover:shadow-card-hover group-hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                      <div className="p-4 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                        <Users size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-athletic text-white group-hover:text-premium-gold transition-colors">
                          Elenco 2026
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">
                          Plantel Completo
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-zinc-600 group-hover:text-premium-gold transition-colors" size={24} />
                  </div>
                </Link>

                {/* Standings Banner */}
                <Link href="/tabela" className="block group">
                  <div className="relative overflow-hidden rounded-[2rem] bg-card/60 backdrop-blur-xl border border-white/[0.04] hover:border-premium-gold/40 transition-all duration-500 ease-out p-8 flex items-center justify-between shadow-premium hover:shadow-card-hover group-hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                      <div className="p-4 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                        <Trophy size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-athletic text-white group-hover:text-premium-gold transition-colors">
                          Classificação
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">
                          Tabela Carioca 2026
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-zinc-600 group-hover:text-premium-gold transition-colors" size={24} />
                  </div>
                </Link>

                {/* Sidebar News Feed */}
                <div className="glass-ultra border border-white/[0.04] rounded-[2rem] p-6 shadow-premium">
                  <h3 className="text-sm font-athletic text-premium-gold mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-premium-gold rounded-full" />
                    Últimas do Esporte
                  </h3>
                  <div className="space-y-6">
                    {news.slice(10, 16).map(article => (
                      <CompactNewsRow key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              </StaggeredEntry>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
