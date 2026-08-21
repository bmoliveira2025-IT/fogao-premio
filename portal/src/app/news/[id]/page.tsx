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

    // These reads are independent, so start them together to reduce route latency.
    const articlePromise = db.collection('news').doc(id).get();
    const matchPromise = db.collection('matches')
        .orderBy('date', 'asc')
        .where('date', '>=', new Date().toISOString())
        .limit(1)
        .get();
    const relatedPromise = db.collection('news')
        .orderBy('created_at', 'desc')
        .limit(10)
        .get();

    const [articleDoc, matchSnap, relatedSnap] = await Promise.all([
        articlePromise,
        matchPromise,
        relatedPromise
    ]);
    let isBriefing = false;
    let briefingData = null;

    if (!articleDoc.exists) {
        // Fallback: check if it's a daily briefing
        const briefingDoc = await db.collection('daily_briefings').doc(id).get();
        if (briefingDoc.exists) {
            isBriefing = true;
            briefingData = briefingDoc.data();
        } else {
            return <div className="min-h-screen flex items-center justify-center text-foreground">Notícia não encontrada</div>;
        }
    }

    let article: any = {};

    if (isBriefing && briefingData) {
        const text = briefingData.editorial_summary || briefingData.general_summary || "";
        // Clean up emojis and fix missing newlines
        let cleanText = text.replace(/[🎯📊🔥]/g, '').trim();
        
        // If the AI generated everything in one line separated by ⭐
        if (!cleanText.includes('\\n') && cleanText.includes('⭐')) {
            cleanText = cleanText.split('⭐').join('\\n- ');
        }
        
        // Remove remaining ⭐
        cleanText = cleanText.replace(/⭐/g, '').trim();

        // Split into logical blocks
        const blocks = cleanText.split('\\n').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
        
        const destaques = blocks.filter((b: string) => b.startsWith('-') || b.startsWith('*')).map((b: string) => b.substring(1).trim());
        const aberturaBlocks = blocks.filter((b: string) => !b.startsWith('-') && !b.startsWith('*'));
        
        const abertura = aberturaBlocks.join('<br/><br/>');

        let contentHtml = `<div class="font-sans space-y-6 mt-4">`;

        if (abertura) {
            contentHtml += `
                <div class="mb-6">
                    <p class="text-zinc-900 text-lg leading-relaxed font-medium">
                        ${abertura}
                    </p>
                </div>
            `;
        }

        if (destaques.length > 0) {
            contentHtml += `
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">
                        Destaques
                    </h3>
                    <ul class="list-disc pl-5 space-y-2">
                        ${destaques.map((d: string) => `
                            <li class="text-zinc-800 leading-relaxed">${d}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        if (briefingData.indicators) {
            const indicators = briefingData.indicators;
            const isEmptyIndicator = (value?: string) => !value || value.trim().toLowerCase() === 'sem novidades';
            const isDisciplineInfo = (value: string) => /cart(?:ão|ões)|amarelo|vermelho|suspens|expuls|gancho/i.test(value);

            // Older briefings could mix medical and disciplinary updates in `dm`.
            // Split semicolon-separated notes so they render under the correct label.
            const dmParts = typeof indicators.dm === 'string'
                ? indicators.dm.split(/;\s*/).map((part: string) => part.trim()).filter(Boolean)
                : [];
            const medicalParts = dmParts.filter((part: string) => !isDisciplineInfo(part));
            const legacyDisciplineParts = dmParts.filter(isDisciplineInfo);
            const medicalInfo = medicalParts.join('; ');
            const disciplineInfo = [
                !isEmptyIndicator(indicators.discipline) ? indicators.discipline : '',
                ...legacyDisciplineParts,
            ].filter(Boolean).join('; ');

            contentHtml += `
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">
                        Giro Rápido
                    </h3>
                    <ul class="list-disc pl-5 space-y-3">
            `;
            
            if (indicators.next_match) {
                contentHtml += `
                    <li class="text-zinc-800 leading-relaxed">
                        <strong class="text-zinc-900">Próxima Partida:</strong> ${indicators.next_match}
                        ${indicators.location ? `<br/><strong class="text-zinc-900">Local:</strong> ${indicators.location}` : ''}
                        ${indicators.transmission ? `<br/><strong class="text-zinc-900">Transmissão:</strong> ${indicators.transmission}` : ''}
                    </li>
                `;
            }
            
            if (!isEmptyIndicator(indicators.market)) {
                contentHtml += `
                    <li class="text-zinc-800 leading-relaxed">
                        <strong class="text-zinc-900">Mercado:</strong> ${indicators.market}
                    </li>
                `;
            }
            
            if (!isEmptyIndicator(medicalInfo)) {
                contentHtml += `
                    <li class="text-zinc-800 leading-relaxed">
                        <strong class="text-zinc-900">Depto. Médico:</strong> ${medicalInfo}
                    </li>
                `;
            }

            if (!isEmptyIndicator(disciplineInfo)) {
                contentHtml += `
                    <li class="text-zinc-800 leading-relaxed">
                        <strong class="text-zinc-900">Suspensões e cartões:</strong> ${disciplineInfo}
                    </li>
                `;
            }

            if (!isEmptyIndicator(indicators.additional_info)) {
                contentHtml += `
                    <li class="text-zinc-800 leading-relaxed">
                        <strong class="text-zinc-900">Informação adicional:</strong> ${indicators.additional_info}
                    </li>
                `;
            }
            
            contentHtml += `</ul></div>`;
        }

        contentHtml += `</div>`;

        article = {
            id,
            title: `Giro do Fogão: Edição ${briefingData.edition || 'Atual'}`,
            content: contentHtml,
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg/1920px-Botafogo_de_Futebol_e_Regatas_logo.svg.png",
            created_at: briefingData.created_at?.toDate ? briefingData.created_at.toDate().toISOString() : new Date().toISOString(),
            author: "Redação Fogão 360",
            category: "Giro do Fogão"
        };
    } else {
        const articleData = articleDoc.data();
        article = {
            id: articleDoc.id,
            ...articleData,
            title: articleData?.title?.replace(/\*\*/g, ''), // Clean title
            // Serialize Date objects to strings for Client Component
            created_at: articleData?.created_at?.toDate ? articleData.created_at.toDate().toISOString() : new Date().toISOString()
        };
    }

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
