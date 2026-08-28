// Redesigned Homepage - Magazine Layout with Mixed Cards
import { db } from '@/lib/firebase-admin';
import ModernFullWidthHero from '@/components/ModernFullWidthHero';
import FeaturedCard from '@/components/FeaturedCard';
import CompactNewsCard from '@/components/CompactNewsCard';
import ModernMatchCard from '@/components/ModernMatchCard';
import CupMatchCard from '@/components/CupMatchCard';
import SmartNewsFeed from '@/components/SmartNewsFeed';
import LeagueTable from '@/components/LeagueTable';
import ModernInfiniteNews from '@/components/ModernInfiniteNews';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import PersonalizeBanner from '@/components/PersonalizeBanner';
import { botafogoSchedule } from '@/data/schedule';

// Light Theme Components
import MobileUserHeader from '@/components/MobileUserHeader';
import LightHeroCard from '@/components/LightHeroCard';
import LightNewsFilter from '@/components/LightNewsFilter';

import Image from 'next/image';
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

async function getData(): Promise<{ news: NewsItem[]; matches: MatchData[]; copaMatch: MatchData | null; sulaMatch: MatchData | null; videos: VideoItem[] }> {
  try {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 48);

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      // Enough for every home section without sending hundreds of documents to 3G users.
      .limit(80);

    const matchThreshold = new Date();
    matchThreshold.setHours(matchThreshold.getHours() - 3);
    const upcomingMatchesRef = db.collection('matches')
      .where('date', '>=', matchThreshold.toISOString())
      .orderBy('date', 'asc')
      .limit(50); // Increased limit to find specific championships

    const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(3);

    const [newsSnap, upcomingMatchesSnap, videosSnap] = await Promise.all([
      newsRef.get(),
      upcomingMatchesRef.get(),
      videosRef.get()
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
        likes_count: data.likes_count || 0,
        dislikes_count: data.dislikes_count || 0,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      } as NewsItem;
    }).filter(item => !item.is_premium);

    // Build set of matches already finished according to Firestore
    const finishedMatchKeys = new Set<string>();
    for (const doc of upcomingMatchesSnap.docs) {
        const data = doc.data();
        const status = (data.status || '').toUpperCase();
        if (status === 'ENCERRADA' || status === 'FINALIZADO') {
            let dateStr = '';
            if (typeof data.date === 'string') {
                dateStr = data.date.split('T')[0];
            } else if (data.date?.toDate) {
                dateStr = data.date.toDate().toISOString().split('T')[0];
            }
            if (dateStr && data.home_team && data.away_team) {
                finishedMatchKeys.add(`${dateStr}|${data.home_team}|${data.away_team}`);
            }
        }
    }

    // Find next Brasileirão, next Copa do Brasil, and next Sulamericana separately
    let brasileiraoMatch: MatchData | null = null;
    let copaMatch: MatchData | null = null;
    let sulaMatch: MatchData | null = null;

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sortedSchedule = [...botafogoSchedule].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const m of sortedSchedule) {
        const matchDate = new Date(m.date);

        // Skip games before today
        if (matchDate < todayMidnight) continue;

        // Skip games explicitly finished in schedule.ts
        if (m.status === 'FINALIZADO') continue;

        // Skip if Firestore already marked as finished
        const matchDateStr = matchDate.toISOString().split('T')[0];
        const firestoreKey = `${matchDateStr}|${m.home_team}|${m.away_team}`;
        if (finishedMatchKeys.has(firestoreKey)) continue;

        const champ = (m.championship || '').toLowerCase();
        const isBrasileirao = champ.includes('brasileir');
        const isCopa = !isBrasileirao && champ.includes('copa') && champ.includes('brasil');
        const isSula = champ.includes('sudamericana') || champ.includes('sul-americana') || champ.includes('sulamericana');

        // Only track the 3 main competitions
        if (!isBrasileirao && !isCopa && !isSula) continue;

        const displayChamp = isBrasileirao ? 'BRASILEIRÃO'
                           : isCopa ? 'COPA DO BRASIL'
                           : 'SUDAMERICANA';

        const matchObj: MatchData = {
            ...m,
            id: m.id || `${m.date}-${m.home_team}`,
            championship: displayChamp,
        };

        if (isBrasileirao && !brasileiraoMatch) brasileiraoMatch = matchObj;
        else if (isCopa && !copaMatch) copaMatch = matchObj;
        else if (isSula && !sulaMatch) sulaMatch = matchObj;

        if (brasileiraoMatch && copaMatch && sulaMatch) break;
    }

    const matches: MatchData[] = [];
    if (brasileiraoMatch) matches.push(brasileiraoMatch);
    if (sulaMatch) matches.push(sulaMatch);
    if (copaMatch) matches.push(copaMatch);

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

    return { news, matches, copaMatch, sulaMatch, videos };

  } catch (error: unknown) {
    console.error("DATA FETCH ERROR DETAILS:", error);
    return { news: [], matches: [], copaMatch: null, sulaMatch: null, videos: [] };
  }
}


export default async function Home() {
  const { news, matches, copaMatch, sulaMatch, videos } = await getData();

  const nextMatch = matches.length > 0 ? matches[0] : null;

  // Slice news into sections for the new grid layout
  const heroNews = news[0] || null;
  const topFeatured = news.slice(1, 5); // 4 cards for the row below hero
  const mainFeedNews = news.slice(5); // Main list for desktop and mobile
  const sidebarNews = news.slice(30, 36); // Extra for sidebar
  const remainingNews = news.slice(36);

  // Ticker items
  const tickerItems = news.slice(0, 6).map(n => ({ id: n.id, title: n.title }));

  return (
    <div className="w-full font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300 bg-[#f4f4f5] lg:bg-[#0a0a0a]">
      
      {/* MOBILE LIGHT THEME */}
      <div className="mobile-app-edge block lg:hidden min-h-screen px-4 pt-safe bg-white">
          <MobileUserHeader />
          <div className="py-1"></div>
          
          <LightHeroCard article={heroNews} />
          
          {/* Interactive Filter and News List */}
          <LightNewsFilter news={news.slice(1)} />
      </div>

      {/* DESKTOP DARK THEME */}
      <div className="hidden lg:block">
        {/* 1. TICKER - Full width always */}
        <BreakingNewsTicker items={tickerItems} />

        {/* MAIN CONTENT WRAPPER - Responsive Container */}
        <div className="container mx-auto max-w-[1400px] px-4 md:px-6 py-6 lg:py-10">
          
          {/* GRID SYSTEM: 12 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: MAIN FEED (8/12) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* HERO SECTION */}
              <div className="rounded-2xl overflow-hidden shadow-sm">
                {heroNews && <ModernFullWidthHero article={heroNews} />}
              </div>

              {/* TOP FEATURED GRID (Desktop Only - Matching reference density) */}
              {topFeatured.length > 0 && (
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4">
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

              {/* PRÓXIMO JOGO - BRASILEIRÃO */}
              {nextMatch && <ModernMatchCard match={nextMatch} compact />}

              {/* PRÓXIMOS JOGOS - COPA DO BRASIL / SULAMERICANA (alternância automática) */}
              {(copaMatch || sulaMatch) && <CupMatchCard copaMatch={copaMatch} sulaMatch={sulaMatch} />}

              {/* TABELA DO BRASILEIRÃO */}
              <div className="bg-[#0d0d0d] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="p-5 border-b border-white/5">
                  <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">TABELA BRASILEIRÃO</h3>
                </div>
                <div className="p-2">
                  <LeagueTable defaultExpanded={false} />
                </div>
              </div>

              {/* MAIS NOTÍCIAS */}
              {sidebarNews.length > 0 && (
                <div className="bg-[#0d0d0d] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                  <div className="p-5 border-b border-white/5">
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">MAIS NOTÍCIAS</h3>
                  </div>
                  <div>
                    {sidebarNews.map(article => (
                      <CompactNewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEOS RECENTES - HIDDEN ON MOBILE */}
              <div className="hidden lg:block space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">VÍDEOS</h3>
                  <Link href="/videos" className="text-[10px] font-bold text-premium-gold hover:underline">VER MAIS</Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {videos.slice(0, 3).map(video => (
                    <div key={video.id} className="group relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/5">
                      <Image src={video.thumbnail} alt={video.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" loading="lazy" quality={65} />
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
    </div>
  );
}
