import { NextResponse } from 'next/server';

const FEED_URL = 'https://audio.globoradio.globo.com/podcast/feed/690/ge-botafogo';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 5;

        const response = await fetch(FEED_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const xmlText = await response.text();

        // Simple Regex Parser for RSS Items
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
        const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;
        const linkRegex = /<link>(.*?)<\/link>/;
        const dateRegex = /<pubDate>(.*?)<\/pubDate>/;
        const enclosureRegex = /<enclosure.*?url="(.*?)".*?type="(.*?)".*?\/>/;
        const imageRegex = /<itunes:image.*?href="(.*?)".*?\/>/;

        let match;
        while ((match = itemRegex.exec(xmlText)) !== null) {
            const itemContent = match[1];

            const titleMatch = titleRegex.exec(itemContent);
            const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Sem título';

            const descMatch = descRegex.exec(itemContent);
            const description = descMatch ? (descMatch[1] || descMatch[2]) : '';

            const linkMatch = linkRegex.exec(itemContent);
            const link = linkMatch ? linkMatch[1] : '';

            const dateMatch = dateRegex.exec(itemContent);
            const pubDate = dateMatch ? dateMatch[1] : '';

            const enclosureMatch = enclosureRegex.exec(itemContent);
            const audioUrl = enclosureMatch ? enclosureMatch[1] : '';

            const imageMatch = imageRegex.exec(itemContent);
            const imageUrl = imageMatch ? imageMatch[1] : '';

            if (audioUrl) {
                items.push({
                    title,
                    description: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...', // Strip HTML & Truncate
                    link,
                    pubDate,
                    audioUrl,
                    imageUrl
                });
            }

            if (items.length >= limit) break;
        }

        return NextResponse.json({ items });

    } catch (error) {
        console.error('Error fetching podcast feed:', error);
        return NextResponse.json({ error: 'Failed to fetch podcast feed' }, { status: 500 });
    }
}
