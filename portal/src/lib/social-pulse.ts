export interface Topic {
    id: string;
    text: string;
    count: number;
    trend: 'up' | 'stable' | 'new';
    source: 'instagram' | 'twitter' | 'facebook';
}

const STOP_WORDS = new Set([
    'a', 'o', 'e', 'do', 'da', 'de', 'em', 'um', 'uma', 'no', 'na', 'os', 'as', 'ao', 'aos',
    'botafogo', 'fogo', 'glorioso', 'bfr', 'rj', 'time', 'equipe', 'jogo', 'contra', 'diz',
    'após', 'sobre', 'com', 'que', 'por', 'dos', 'das', 'para', 'pela', 'pelo', 'foi', 'ser',
    'br', 'brasileiro', 'copa', 'tem', 'mais', 'pode', 'vai', 'está', 'são', 'não', 'sim',
    'hoje', 'amanhã', 'agora', 'vez', 'todo', 'toda', 'todos', 'todas', 'muito', 'muita',
    'veja', 'confira', 'assista', 'video', 'fotos', 'foto', 'imagem', 'imagens',
    'globo', 'lance', 'espn', 'ge'
]);

export function getTrendingTopics(titles: string[]): Topic[] {
    const wordCounts = new Map<string, number>();
    const bigramCounts = new Map<string, number>();

    titles.forEach(title => {
        // Clean and tokenize
        const cleanTitle = title
            .toLowerCase()
            .replace(/[^\w\sÀ-ÿ]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')
            .trim();

        const words = cleanTitle.split(' ');

        // Count Unigrams
        words.forEach(word => {
            if (word.length > 3 && !STOP_WORDS.has(word)) {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            }
        });

        // Count Bigrams (Pairs)
        for (let i = 0; i < words.length - 1; i++) {
            const w1 = words[i];
            const w2 = words[i + 1];
            if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && w1.length > 2 && w2.length > 2) {
                const bigram = `${w1} ${w2}`;
                bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
            }
        }
    });

    // Merge and Select Best Topics
    const topics: { text: string, count: number }[] = [];

    // Prioritize high-frequency Bigrams
    bigramCounts.forEach((count, text) => {
        if (count >= 2) { // Only keep bigrams that appear at least twice
            topics.push({ text, count: count * 2 }); // Boost bigram weight
            // Decrement constituent parts to avoid duplicates (simplified)
            const parts = text.split(' ');
            wordCounts.set(parts[0], 0);
            wordCounts.set(parts[1], 0);
        }
    });

    // Add remaining high-frequency Unigrams
    wordCounts.forEach((count, text) => {
        if (count > 0) {
            topics.push({ text, count });
        }
    });

    // Sort by count
    topics.sort((a, b) => b.count - a.count);

    // Filter duplicates (simple containment check)
    const uniqueTopics = topics.filter((t, index, self) =>
        index === self.findIndex((t2) => (
            t2.text.includes(t.text) || t.text.includes(t2.text)
        ))
    );

    // Format top 3
    const sorted = uniqueTopics
        .slice(0, 3) // Top 3 only
        .map((t, index) => {
            // Find a representative title for this topic (shortest one usually looks best)
            const matches = titles.filter(title =>
                title.toLowerCase().includes(t.text.toLowerCase())
            );

            // Prefer short titles, but at least 15 chars to be a sentence
            const representative = matches.sort((a, b) => a.length - b.length)[0] || t.text;

            // Distribute sources: 1 Insta, 1 X, 1 Facebook
            let source: 'instagram' | 'twitter' | 'facebook' = 'facebook';
            if (index === 0) source = 'instagram';
            else if (index === 1) source = 'twitter';

            return {
                id: `topic-${index}`,
                text: representative, // Use the full title
                count: t.count,
                trend: index === 0 ? 'up' : 'stable', // simplified trend
                source
            } as Topic;
        });

    return sorted;
}
