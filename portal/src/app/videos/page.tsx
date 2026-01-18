import { db } from '@/lib/firebase-admin';
import BrandingHeader from '@/components/BrandingHeader';
import DesktopSidebar from '@/components/DesktopSidebar';
import VideoGrid from '@/components/VideoGrid';
import TabBar from '@/components/TabBar';
import { ArrowLeft, MonitorPlay } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
    source?: string;
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

export default async function VideosPage() {
    const videos = await getVideos();

    return (
        <div className="min-h-screen bg-black pb-24 md:pb-0 md:pl-64">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>

            {/* Mobile Header + Back Button */}
            <div className="md:hidden">
                <BrandingHeader />
            </div>

            <main className="p-4 md:p-8 space-y-6 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-premium-gold/10 to-transparent border border-premium-gold/20 backdrop-blur-sm">
                                <MonitorPlay size={24} className="text-premium-gold" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-wider">
                                Glorioso <span className="text-premium-gold">TV</span>
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-400 font-medium max-w-2xl">
                            Acompanhe todos os vídeos, bastidores, entrevistas e melhores momentos do Fogão.
                        </p>
                    </div>
                </div>

                <VideoGrid videos={videos} />
            </main>

            <TabBar />
        </div>
    );
}
