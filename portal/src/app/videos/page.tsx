import { db } from '@/lib/firebase-admin';
import VideoGrid from '@/components/VideoGrid';
import LightVideoFeed from '@/components/LightVideoFeed';
import { MonitorPlay } from 'lucide-react';
import { getNewsDisplayDate } from '@/lib/news-utils';

export const revalidate = 60;

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
}

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
    likes_count?: number;
    dislikes_count?: number;
}

async function getVideos() {
    const videosRef = db.collection('videos').orderBy('published_at', 'desc').limit(50);
    const snap = await videosRef.get();

    return snap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            url: data.url,
            thumbnail: data.thumbnail,
            published_at: data.published_at,
            source: data.source
        } as VideoItem;
    });
}

async function getRecommendedNews() {
    const newsRef = db.collection('news').orderBy('created_at', 'desc').limit(6);
    const snap = await newsRef.get();

    return snap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title || '',
            image: data.image || data.image_url || '',
            source: data.source || 'Fogão 360',
            created_at: getNewsDisplayDate(data.published_at, data.created_at),
            likes_count: data.likes_count || 0,
            dislikes_count: data.dislikes_count || 0,
        } as NewsItem;
    });
}

export default async function VideosPage() {
    const [videos, recommendedNews] = await Promise.all([getVideos(), getRecommendedNews()]);

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Mobile Light Theme Layout */}
            <div className="block lg:hidden">
                <LightVideoFeed videos={videos} recommendedNews={recommendedNews} />
            </div>

            {/* Desktop Dark Theme Layout */}
            <div className="hidden lg:block pb-24 md:pb-0">
                <div className="p-4 md:p-8 space-y-6 pt-6 md:pt-8 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-premium-gold/10 to-transparent border border-premium-gold/20 backdrop-blur-sm">
                                    <MonitorPlay size={24} className="text-premium-gold" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase italic tracking-wider">
                                    Glorioso <span className="text-premium-gold">TV</span>
                                </h1>
                            </div>
                            <p className="text-sm text-zinc-600 font-medium max-w-2xl">
                                Acompanhe todos os vídeos, bastidores, entrevistas e melhores momentos do Fogão.
                            </p>
                        </div>
                    </div>

                    <VideoGrid videos={videos} />
                </div>
            </div>
        </div>
    );
}
