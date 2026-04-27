// Redesigned Homepage - Magazine Layout with Mixed Cards
import { db } from '@/lib/firebase-admin';
import ModernFullWidthHero from '@/components/ModernFullWidthHero';
import FeaturedCard from '@/components/FeaturedCard';
import CompactNewsCard from '@/components/CompactNewsCard';
import ModernMatchCard from '@/components/ModernMatchCard';
import SmartNewsFeed from '@/components/SmartNewsFeed';
import LeagueTable from '@/components/LeagueTable';
import ModernInfiniteNews from '@/components/ModernInfiniteNews';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import PersonalizeBanner from '@/components/PersonalizeBanner';
import MobileLiveMatches from '@/components/MobileLiveMatches';

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
    timeLimit.setHours(timeLimit.getHours() - 48);

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      .limit(500);

    const matchThreshold = new Date();
    matchThreshold.setHours(matchThreshold.getHours() - 3);
    const upcomingMatchesRef = db.collection('matches')
      .where('date', '>=', matchThreshold.toISOString())
      .orderBy('date', 'asc')
      .limit(50); // Increased limit to find specific championships

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

    // Advanced Match Logic: Brasileirão + (Sula or Copa)
    let brasileiraoMatch: MatchData | null = null;
    let cupMatch: MatchData | null = null;

    if (!upcomingMatchesSnap.empty) {
      for (const doc of upcomingMatchesSnap.docs) {
        if (doc.id === 'next_match') continue;
        const data = doc.data();
        if (data && data.date) {
          let matchDate;
          try {
            matchDate = data.date?.toDate?.() || new Date(data.date);
            if (isNaN(matchDate.getTime())) continue;
          } catch (e) { continue; }
          
          const status = data.status?.toLowerCase() || '';
          const champ = (data.championship || '').toLowerCase();
          
          if (status !== 'finalizado' && status !== 'encerrada') {
            const matchObj = {
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
              match_id: data.match_id || doc.id,
            } as MatchData;

            // Logic: Brasileirão fixed, others alternate by proximity
            const isBotafogo = (matchObj.home_team?.includes('Botafogo') || matchObj.away_team?.includes('Botafogo'));
            
            if (isBotafogo) {
              if (champ.includes('brasileir') && !brasileiraoMatch) {
                brasileiraoMatch = matchObj;
              } else if ((champ.includes('sul') || champ.includes('copa') || champ.includes('sula') || champ.includes('brasil')) && !cupMatch) {
                if (!champ.includes('brasileir')) {
                  cupMatch = matchObj;
                }
              }
            }
          }
        }
        if (brasileiraoMatch && cupMatch) break;
      }
    }

    const matches: MatchData[] = [];
    if (brasileiraoMatch) matches.push(brasileiraoMatch);
    if (cupMatch) matches.push(cupMatch);

    const videos = videosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        url: data.url || '',
        thumbnail: data.thumbnail || '',
        published_at: data.published_at && typeof data.published_at.toDate === 'function' ? data.published_at.toDate().toISOString() : (data.published_at || new Date().toISOString()),
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

  // Slice news into sections for the new grid layout
  const heroNews = news[0] || null;
  const topFeatured = news.slice(1, 5); // 4 cards for the row below hero
  const mainFeedNews = news.slice(5, 30); // Main list
  const sidebarNews = news.slice(30, 36); // Extra for sidebar
  const remainingNews = news.slice(36);

  // Ticker items
  const tickerItems = news.slice(0, 6).map(n => ({ id: n.id, title: n.title }));

  return (
    <div className="w-full font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 bg-[#0a0a0a]">
      
      {/* 1. TICKER - Full width always */}
      <BreakingNewsTicker items={tickerItems} />

      {/* MAIN CONTENT WRAPPER - Responsive Container */}
      <div className="container mx-auto max-w-[1400px] px-4 md:px-6 py-6 lg:py-10">
        
        {/* GRID SYSTEM: 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAIN FEED (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO SECTION */}
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {heroNews && <ModernFullWidthHero article={heroNews} />}
            </div>

            {/* MOBILE ONLY: LIVE MATCH TICKER */}
            <MobileLiveMatches matches={matches} />

            {/* TOP FEATURED GRID (Desktop Only - Matching reference density) */}
            {topFeatured.length > 0 && (
              <div className="hidden md:grid grid-cols-4 gap-4">
                {topFeatured.map((article) => (
                  <FeaturedCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* MAIN LIST WITH TABS (Editorial Order) */}
            <SmartNewsFeed news={mainFeedNews} />

            {/* INFINITE SCROLL */}
            {remainingNews.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <ModernInfiniteNews initialNews={remainingNews} />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR (4/12) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            
            {/* PERSONALIZE BANNER (Green as per reference) */}
            <PersonalizeBanner />

            {/* PROXIMO JOGO */}
            <div className="bg-[#0d0d0d] rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
                    Próximas Partidas do Glorioso
                  </h3>
                  <Link href="/matches" className="text-[10px] font-bold text-premium-gold hover:underline tracking-widest">VER TUDO</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <div key={match.id} className="w-full">
                        <ModernMatchCard match={match} compact={true} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="glass-ultra rounded-3xl p-8 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01]">
                        <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                          <span className="text-zinc-600 font-black text-xl">!</span>
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nenhum jogo confirmado</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABELA DO BRASILEIRÃO */}
            <div className="bg-[#0d0d0d] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">TABELA BRASILEIRÃO</h3>
              </div>
              <div className="p-2">
                <LeagueTable defaultExpanded={false} />
              </div>
            </div>

            {/* VIDEOS RECENTES - HIDDEN ON MOBILE */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">VÍDEOS</h3>
                <Link href="/videos" className="text-[10px] font-bold text-premium-gold hover:underline">VER MAIS</Link>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {videos.slice(0, 3).map(video => (
                  <div key={video.id} className="group relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/5">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-premium-gold/90 flex items-center justify-center text-black shadow-lg">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent">
                      <p className="text-xs font-bold text-white line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
