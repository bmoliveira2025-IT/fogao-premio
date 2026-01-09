import { db } from '@/lib/firebase-admin';
import PremiumNextMatch from '@/components/PremiumNextMatch';
import PremiumWidget from '@/components/PremiumWidget';
import HeadlinesWidget from '@/components/HeadlinesWidget';
import MorningBriefingPopup from '@/components/MorningBriefingPopup';
import CompactNewsRow from '@/components/CompactNewsRow';
import BrandingHeader from '@/components/BrandingHeader';
import TabBar from '@/components/TabBar';
import BotafogoTVCarousel from '@/components/BotafogoTVCarousel';
import { ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import MatchDayPopup from '@/components/MatchDayPopup';
import QuoteBanner from '@/components/QuoteBanner';
import DesktopSidebar from '@/components/DesktopSidebar';
import PodcastWidget from '@/components/PodcastWidget';

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
  try {
    const timeLimit = new Date();
    timeLimit.setDate(timeLimit.getDate() - 7); // Widen to 7 days temporarily to debug missing news

    const newsRef = db.collection('news')
      .where('created_at', '>=', timeLimit)
      .orderBy('created_at', 'desc')
      .limit(20);

    // Matches, Videos, Premium (keep existing logic but with safety limits if needed)
    const matchesRef = db.collection('matches').orderBy('date', 'asc').where('date', '>=', new Date().toISOString()).limit(1);
    const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(8);
    const premiumRef = db.collection('news').where('is_premium', '==', true).orderBy('created_at', 'desc').limit(3);

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
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        location: data.location || 'Estádio Nilton Santos',
        championship: data.championship || '',
        status: data.status || 'Agendado',
        home_team_logo: data.home_team_logo,
        away_team_logo: data.away_team_logo,
        stadium: data.stadium,
      } as MatchData;
    });

    const videos = videosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        url: data.url || '',
        thumbnail: data.thumbnail || '',
        published_at: data.published_at?.toDate().toISOString() || new Date().toISOString(),
      } as VideoItem;
    });

    return { news, matches, videos, premiumNews };

  } catch (error) {
    console.warn("Failed to Fetch Data (likely Quota Exceeded), returning empty.");
    return { news: [], matches: [], videos: [], premiumNews: [] };
  }
}


export default async function Home() {
  const { news, matches, videos, premiumNews } = await getData();

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

  notifications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <main className="min-h-screen bg-background dark:bg-zinc-950 text-foreground font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">

      {/* MATCH DAY POPUP */}
      <MatchDayPopup nextMatch={nextMatch} />

      {/* UPDATE: BRIEFING POPUP IS NOW DESKTOP & MOBILE */}
      <MorningBriefingPopup />

      {/* 1. SIDEBAR - DESKTOP ONLY */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="lg:hidden">
        <BrandingHeader notifications={notifications} />
      </div>

      {/* 3. MAIN CONTENT WRAPPER */}
      <div className="w-full lg:pl-64 transition-all duration-300 pb-32 lg:pb-10">
        <div className="container mx-auto pt-20 px-4 lg:pt-12 lg:px-12 max-w-[1600px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">

            {/* --- CENTER COLUMN (Main Feed) --- */}
            <div className="lg:col-span-8 space-y-2 lg:space-y-12">

              {/* Headlines Widget */}
              <div className="-mx-4 lg:mx-0">
                <HeadlinesWidget news={news} nextMatch={nextMatch} />
              </div>

              {/* PODCAST WIDGET */}
              <PodcastWidget />

              {/* MOBILE INTERSTITIALS (Visible only on Mobile) */}
              <div className="lg:hidden space-y-0">
                {/* 3. MANDATORY MATCH BLOCK - MOBILE ONLY (REMOVED - INTEGRATED IN WIDGET) */}
                {/* <section className="-mt-0 relative z-10 lg:hidden">
                  <PremiumNextMatch match={nextMatch} />
                </section> */}

                {/* QUOTE BANNER - MOBILE ONLY */}
                <div className="lg:hidden mb-4">
                  <QuoteBanner />
                </div>

                {/* 5. PREMIUM BLOCK - MOBILE ONLY */}
                <PremiumWidget news={premiumNews} className="lg:hidden mb-4" />

                {/* SQUAD LINK - MOBILE */}
                <Link href="/elenco" className="block mt-4 -mb-4 lg:hidden group relative">
                  <div className="relative overflow-hidden rounded-none md:rounded-xl bg-zinc-900 transition-all p-5 flex items-center justify-between shadow-lg -mx-4 md:mx-0">

                    {/* Background Image - Players */}
                    <div className="absolute inset-0 z-0 opacity-20">
                      <img
                        src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-zinc-900/80 mix-blend-multiply" />
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                      <div className="p-2.5 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20 backdrop-blur-sm">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-premium-gold transition-colors drop-shadow-md">
                          Elenco 2026
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                          Conheça os jogadores atualizados
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="relative z-10 text-white/30 group-hover:text-premium-gold transition-colors" size={18} />
                  </div>
                </Link>
              </div>

              {/* Botafogo TV (Visible Both) */}
              <BotafogoTVCarousel videos={videos} className="-mt-10 lg:mt-0" />

              {/* Extra News Section (Desktop - Center Column Extension?) 
                           Or maybe keep Extra News in Sidebar? 
                           Let's put extra news in Desktop Sidebar as 'Giro pelo Mundo' style
                        */}
            </div>

            {/* --- RIGHT COLUMN (Widgets - Desktop Only) --- */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-8">

              {/* Next Match Card */}
              <PremiumNextMatch match={nextMatch} />

              {/* Premium Widget */}
              <PremiumWidget news={premiumNews} />

              {/* Elenco Banner */}
              <Link href="/elenco" className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-premium-gold/30 transition-all p-6 flex items-center justify-between shadow-2xl group-hover:shadow-premium-gold/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-premium-gold transition-colors">
                        Elenco 2026
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                        Plantel Completo
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-zinc-600 group-hover:text-premium-gold transition-colors" size={20} />
                </div>
              </Link>

              {/* Quote */}
              <QuoteBanner />

              {/* Sidebar News Feed */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
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

      <div className="lg:hidden">
        <TabBar />
      </div>
    </main>
  );
}
