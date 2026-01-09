import { db } from '@/lib/firebase-admin';
import PremiumNextMatch from '@/components/PremiumNextMatch';
import PremiumWidget from '@/components/PremiumWidget';
import HeadlinesWidget from '@/components/HeadlinesWidget'; // NEW
import MorningBriefingPopup from '@/components/MorningBriefingPopup'; // NEW
// import CompactNewsRow from '@/components/CompactNewsRow'; // Maybe still needed for Sidebar extras? yes.
import CompactNewsRow from '@/components/CompactNewsRow';
import BrandingHeader from '@/components/BrandingHeader';
import TabBar from '@/components/TabBar';
import BotafogoTVCarousel from '@/components/BotafogoTVCarousel';
import { Star, ChevronRight, Play, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import MatchDayPopup from '@/components/MatchDayPopup';
import QuoteBanner from '@/components/QuoteBanner';
import DesktopHeader from '@/components/DesktopHeader';

export const revalidate = 60;

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
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published_at: string;
}

async function getData(): Promise<{ news: NewsItem[]; matches: MatchData[]; videos: VideoItem[]; premiumNews: NewsItem[] }> {
  const newsRef = db.collection('news').orderBy('created_at', 'desc').limit(20);
  // Fetch next match
  const matchesRef = db.collection('matches').orderBy('date', 'asc').where('date', '>=', new Date().toISOString()).limit(1);
  // Fetch videos
  const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(8);
  // Fetch premium news
  const premiumRef = db.collection('news').where('is_premium', '==', true).limit(3);

  const [newsSnap, matchesSnap, videosSnap, premiumSnap] = await Promise.all([
    newsRef.get(),
    matchesRef.get(),
    videosRef.get(),
    premiumRef.get()
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

  const matches = matchesSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      home_team: data.home_team || '',
      away_team: data.away_team || '',
      home_score: data.home_score || 0,
      away_score: data.away_score || 0,
      date: data.date || new Date().toISOString(),
      location: data.location || '',
      championship: data.championship || '',
      status: data.status || '',
      home_team_logo: data.home_team_logo,
      away_team_logo: data.away_team_logo,
      stadium: data.location
    } as MatchData;
  });

  const videos = videosSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || '',
      url: data.url || '',
      thumbnail: data.thumbnail || '',
      published_at: data.published_at || ''
    } as VideoItem;
  });

  return { news, matches, videos, premiumNews };
}

export default async function Home() {
  const { news, matches, videos, premiumNews } = await getData();

  const nextMatch = matches.length > 0 ? matches[0] : null;

  // We now use the main 'news' array for the HeadlinesWidget (Top 10)
  // Extra news for sidebar or load more could use news.slice(10, ...)

  // CHECK FOR NOTIFICATIONS
  const notifications = [];

  // 1. Is it Match Day?
  const isMatchDay = nextMatch ? new Date(nextMatch.date).toDateString() === new Date().toDateString() : false;

  if (isMatchDay && nextMatch) {
    const time = new Date(nextMatch.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    notifications.push({
      id: `match-${nextMatch.id}`,
      type: 'MATCH' as const,
      title: 'Hoje tem Fogão!',
      message: `${nextMatch.home_team} x ${nextMatch.away_team} às ${time}`,
      timestamp: new Date().toISOString() // Or match date if preferred
    });
  }

  // 2. Is there recent Premium Content? (Last 24h)
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

  // Sort by newest
  notifications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-premium-gold selection:text-black pb-32 transition-colors duration-300">

      {/* MATCH DAY POPUP */}
      <MatchDayPopup nextMatch={nextMatch} />

      {/* MORNING BRIEFING POPUP (Yesterday's Highlights) */}
      <MorningBriefingPopup />

      {/* 1. HEADER (Fixed Premium Masthead) - MOBILE ONLY */}
      <div className="lg:hidden">
        <BrandingHeader notifications={notifications} />
      </div>

      {/* DESKTOP HEADER */}
      <DesktopHeader />

      <div className="container mx-auto pt-14 px-4 lg:pt-28 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-12 lg:gap-12">

        {/* --- MAIN HEADLINES WIDGET (Hero + Top 10 List) --- */}
        {/* Replaces the old DailyBriefingWidget and Hero/News Sections */}
        <div className="lg:col-span-12 mb-0 lg:mb-8 -mx-4 lg:mx-0">
          <HeadlinesWidget news={news} />
        </div>

        <div className="grid grid-cols-1 lg:col-span-8 lg:space-y-8">
          {/* LEFT COLUMN (Content) */}
          <div className="space-y-0 lg:space-y-8">

            <div className="space-y-0 lg:space-y-6 lg:px-0">

              {/* 3. MANDATORY MATCH BLOCK - MOBILE ONLY */}
              <section className="-mt-0 relative z-10 lg:hidden">
                <PremiumNextMatch match={nextMatch} />
              </section>

              {/* 5. PREMIUM BLOCK - MOBILE ONLY */}
              <PremiumWidget news={premiumNews} className="lg:hidden" />

              {/* SQUAD LINK - MOBILE */}
              <Link href="/elenco" className="block mt-4 -mb-2 lg:hidden group">
                <div className="relative overflow-hidden rounded-none md:rounded-xl bg-gradient-to-r from-card-bg to-background border-y md:border border-premium-gold/15 hover:border-premium-gold/50 transition-all p-4 flex items-center justify-between shadow-lg -mx-4 md:mx-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground uppercase tracking-widest group-hover:text-premium-gold transition-colors">
                        Elenco 2026
                      </h4>
                      <p className="text-[9px] text-foreground/50 font-medium tracking-wide">
                        Conheça os jogadores atualizados
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-foreground/30 group-hover:text-premium-gold transition-colors" size={16} />
                </div>
              </Link>

              {/* QUOTE BANNER - MOBILE ONLY */}
              <div className="py-2 lg:hidden">
                <QuoteBanner />
              </div>

              {/* 6. MULTIMEDIA CAROUSEL */}
              <BotafogoTVCarousel videos={videos} />

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Sidebar - Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-8">
          <div className="sticky top-28 space-y-8">

            {/* Desktop: Next Match */}
            <PremiumNextMatch match={nextMatch} />

            {/* Desktop: Premium Block */}
            <PremiumWidget news={premiumNews} />

            {/* Desktop: Squad Link */}
            <Link href="/elenco" className="block group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-card-bg to-background border border-premium-gold/15 hover:border-premium-gold/50 transition-all p-5 flex items-center justify-between shadow-lg group-hover:shadow-premium-gold/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground uppercase tracking-widest group-hover:text-premium-gold transition-colors">
                      Elenco 2026
                    </h4>
                    <p className="text-[10px] text-foreground/50 font-medium tracking-wide">
                      Confira o plantel completo
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-foreground/30 group-hover:text-premium-gold transition-colors" size={18} />
              </div>
            </Link>

            <QuoteBanner />

            {/* Sidebar Extra News (Giro pelo Mundo / Continuation) */}
            {/* Show items 11-15 approx */}
            <div className="pt-4 border-t border-foreground/10 dark:border-premium-gold/10">
              <h4 className="text-[10px] text-premium-gold/70 font-bold uppercase tracking-widest mb-4">
                Mais Notícias
              </h4>
              <div className="space-y-4">
                {news.slice(10, 15).map((article) => (
                  <CompactNewsRow key={article.id} article={article} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="lg:hidden">
        <TabBar />
      </div>
    </main>
  );
}
