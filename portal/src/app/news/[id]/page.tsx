import { db } from '@/lib/firebase-admin';
import ArticleView from '@/components/ArticleView';

export const revalidate = 60;


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const articleDoc = await db.collection('news').doc(id).get();

    if (!articleDoc.exists) {
        return {
            title: 'Notícia não encontrada | Fogão Prêmio',
        };
    }

    const data = articleDoc.data();

    // Handle summary (it's an array in DB)
    let description = 'Acompanhe as últimas notícias do Botafogo.';
    if (data?.summary) {
        if (Array.isArray(data.summary)) {
            description = data.summary.join('. ');
        } else {
            description = data.summary;
        }
    }

    // Fallback if summary is an error message
    if (description.includes("Erro no processamento") && data?.content) {
        description = data.content;
    }

    // Truncate to avoid cut-off (WhatsApp limit ~150-200)
    // We try to make it cleaner
    if (description.length > 160) {
        description = description.substring(0, 157) + '...';
    }

    const cleanTitle = data?.title?.replace(/\*\*/g, '');

    return {
        title: cleanTitle,
        description: description,
        openGraph: {
            title: cleanTitle,
            description: description,
            url: `https://info-sphere-pro.vercel.app/news/${id}`,
            siteName: 'Fogão Prêmio',
            images: [
                {
                    url: data?.image || 'https://info-sphere-pro.vercel.app/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: data?.title,
                },
            ],
            locale: 'pt_BR',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: data?.title,
            description: description,
            images: [data?.image || ''],
        },
    };
}

export default async function NewsArticle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Article
    const articleDoc = await db.collection('news').doc(id).get();

    // Fetch Next Match
    const matchSnap = await db.collection('matches')
        .orderBy('date', 'asc')
        .where('date', '>=', new Date().toISOString())
        .limit(1)
        .get();

    if (!articleDoc.exists) {
        return <div className="min-h-screen flex items-center justify-center text-foreground">Notícia não encontrada</div>;
    }

    const articleData = articleDoc.data();
    const article = {
        id: articleDoc.id,
        ...articleData,
        title: articleData?.title?.replace(/\*\*/g, ''), // Clean title
        // Serialize Date objects to strings for Client Component
        created_at: articleData?.created_at?.toDate ? articleData.created_at.toDate().toISOString() : new Date().toISOString()
    };

    let nextMatch = null;
    if (!matchSnap.empty) {
        const doc = matchSnap.docs[0];
        const matchData = doc.data();
        nextMatch = {
            id: doc.id,
            home_team: matchData.home_team,
            away_team: matchData.away_team,
            home_score: matchData.home_score,
            away_score: matchData.away_score,
            location: matchData.location,
            championship: matchData.championship,
            status: matchData.status,
            home_team_logo: matchData.home_team_logo,
            away_team_logo: matchData.away_team_logo,
            stadium: matchData.stadium,
            transmission: matchData.transmission,
            display_time: matchData.display_time,
            match_id: matchData.match_id,
            date: matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date,
        };
    }

    // Fetch Related News (Random/Recent)
    const relatedSnap = await db.collection('news')
        .orderBy('created_at', 'desc')
        .limit(10)
        .get();

    let relatedNews = relatedSnap.docs
        .map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : new Date().toISOString()
            };
        })
        .filter(item => item.id !== id);

    // Shuffle array to get random related news
    relatedNews = relatedNews.sort(() => 0.5 - Math.random()).slice(0, 3);

    return (
        <ArticleView article={article} nextMatch={nextMatch} relatedNews={relatedNews} />
    );
}
