// Redesigned Homepage - 2026-03-07 - Hero + Dynamic Grid
import { db } from '@/lib/firebase-admin';
import ModernFullWidthHero from '@/components/ModernFullWidthHero';
import ModernFullWidthRow from '@/components/ModernFullWidthRow';
import ModernMatchCard from '@/components/ModernMatchCard';
import ModernVideoCard from '@/components/ModernVideoCard';
import LeagueTable from '@/components/LeagueTable';
import ModernInfiniteNews from '@/components/ModernInfiniteNews';

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
    timeLimit.setHours(timeLimit.getHours() - 48); // 48h window explicitly requested

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      .limit(500); // Massive limit to ensure we cover the entire 36h window natively

    const matchThreshold = new Date();
    matchThreshold.setHours(matchThreshold.getHours() - 3);
    const upcomingMatchesRef = db.collection('matches')
      .where('date', '>=', matchThreshold.toISOString())
      .orderBy('date', 'asc')
      .limit(5);
    const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(12);
    const premiumRef = db.collection('news').where('is_premium', '==', true).orderBy('created_at', 'desc').limit(3);
    const briefingRef = db.collection('daily_briefings').orderBy('created_at', 'desc').limit(1);

    const [newsSnap, upcomingMatchesSnap, videosSnap, premiumSnap, briefingSnap] = await Promise.all([
      newsRef.get(),
      upcomingMatchesRef.get(),
      videosRef.get(),
      premiumRef.get(),
      briefingRef.get()
    ]);

    console.log(`[DEBUG] Fetched ${newsSnap.docs.length} news items from the last 36 hours.`);

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

    if (!upcomingMatchesSnap.empty) {
      for (const doc of upcomingMatchesSnap.docs) {
        if (doc.id === 'next_match') continue; // Avoid the static old document if it's there
        const data = doc.data();
        const matchDate = data.date?.toDate?.() || new Date(data.date);
        const status = data.status?.toLowerCase() || '';

        // Strict check: if finished, don't show in upcoming/next match
        if (status !== 'finalizado' && status !== 'encerrada') {
          matches.push({
            id: data.match_id || doc.id,
            home_team: data.home_team,
            away_team: data.away_team,
            home_score: data.home_score || 0,
            away_score: data.away_score || 0,
            date: matchDate.toISOString(),
            location: data.location || 'A definir',
            championship: data.championship || 'Campeonato',
            status: data.status || 'Agendado',
            home_team_logo: data.home_team_logo || data.home_logo,
            away_team_logo: data.away_team_logo || data.away_logo,
            stadium: data.stadium,
            transmission: data.transmission,
            display_time: data.display_time,
            match_id: data.match_id || doc.id,
          });
          break; // We only need the next valid match for the homepage
        }
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

  // Hero = first news
  const heroNews = news[0] || null;
  const secondNews = news[1] || null;
  const thirdNews = news[2] || null;
  const fourthNews = news[3] || null;
  const fifthNews = news[4] || null;
  const sixthNews = news[5] || null;
  const latestVideo = videos[0] || null;
  const remainingNews = news.slice(6); // Pass the rest for infinite scroll

  return (
    <div className="w-full font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 bg-[#0a0a0a]">

      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full transition-all duration-300 pb-24 lg:pb-12 bg-black">
        <div className="container mx-auto max-w-[1600px] flex justify-center">

          {/* SINGLE COLUMN MOBILE-FIRST FEED LAYOUT (matching screenshot) */}
          <div className="w-full max-w-2xl flex flex-col pt-2 bg-[#111] min-h-screen">

            {/* HERO NEWS (Botafogo Assume a Liderança) */}
            {heroNews && <ModernFullWidthHero article={heroNews} />}

            {/* SECONDARY NEWS (Gatito Fernández) */}
            {secondNews && <ModernFullWidthRow article={secondNews} />}

            {/* NEXT MATCH CARD */}
            <ModernMatchCard match={nextMatch} />

            {/* VIDEO CARD (Hat-Trick Tiquinho) */}
            {/* MORE NEWS (To complete 6 initial items) */}
            {thirdNews && <ModernFullWidthRow article={thirdNews} />}
            {fourthNews && <ModernFullWidthRow article={fourthNews} />}
            {fifthNews && <ModernFullWidthRow article={fifthNews} />}
            {sixthNews && <ModernFullWidthRow article={sixthNews} />}

            {/* LEAGUE TABLE WIDGET */}
            <div className="px-3 md:px-0 mt-6 mb-8">
              <div className="bg-[#111] border-t border-x border-white/5 rounded-t-lg p-3">
                  <h2 className="text-sm md:text-base font-bold text-white tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Tabela do Brasileirão
                  </h2>
              </div>
              <div className="bg-[#151515] rounded-b-lg border border-white/10 overflow-hidden shadow-2xl">
                 <LeagueTable defaultExpanded={false} />
              </div>
            </div>

            {/* Remaining News Feed (Infinite Load 2 by 2) */}
            <div className="mt-4">
              <ModernInfiniteNews initialNews={remainingNews} />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
