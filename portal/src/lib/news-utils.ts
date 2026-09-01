// Shared news utility functions — avoid duplicating these across components

export function timeAgo(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const timestamp = new Date(dateStr).getTime();
    if (!Number.isFinite(timestamp)) return '';
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

// Verbose form for hero and article views
export function timeAgoVerbose(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const timestamp = new Date(dateStr).getTime();
    if (!Number.isFinite(timestamp)) return '';
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
    return `há ${Math.floor(diff / 86400)}d`;
}

type FirestoreDateLike = string | Date | { toDate?: () => Date } | null | undefined;

function toISOString(value: FirestoreDateLike): string | null {
    if (!value) return null;
    const candidate = typeof value === 'object' && 'toDate' in value && value.toDate
        ? value.toDate()
        : value;
    const date = candidate instanceof Date ? candidate : new Date(candidate as string);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

/** Publication time for display, with compatibility for legacy news records. */
export function getNewsDisplayDate(publishedAt: FirestoreDateLike, createdAt: FirestoreDateLike): string {
    return toISOString(publishedAt) || toISOString(createdAt) || new Date().toISOString();
}

/** Ingestion time used only by Firestore cursors. */
export function getNewsImportedDate(createdAt: FirestoreDateLike): string {
    return toISOString(createdAt) || new Date().toISOString();
}

export type NewsCategory = 'mercado' | 'analise' | 'medico' | 'resultado' | 'treino' | 'bastidores';

const CATEGORY_MAP: Array<{ key: NewsCategory; keywords: string[] }> = [
    { key: 'mercado',    keywords: ['transferência', 'contrat', 'reforço', 'negocia'] },
    { key: 'analise',    keywords: ['análise', 'tática', 'desempenho'] },
    { key: 'medico',     keywords: ['lesão', 'lesionad', 'departamento médico'] },
    { key: 'resultado',  keywords: ['gol', 'resultado', 'vitória', 'derrota', 'empat'] },
    { key: 'treino',     keywords: ['treino', 'preparação'] },
    { key: 'bastidores', keywords: ['entrevista', 'coletiva', 'declarou'] },
];

export function detectCategoryKey(title: string): NewsCategory | null {
    const t = title.toLowerCase();
    for (const { key, keywords } of CATEGORY_MAP) {
        if (keywords.some(kw => t.includes(kw))) return key;
    }
    return null;
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
    mercado:    'MERCADO',
    analise:    'ANÁLISE',
    medico:     'MÉDICO',
    resultado:  'RESULTADO',
    treino:     'TREINO',
    bastidores: 'BASTIDORES',
};

// Solid — for hero and featured cards
export const CATEGORY_COLORS_SOLID: Record<NewsCategory, string> = {
    mercado:    'bg-emerald-500 text-white',
    analise:    'bg-blue-500 text-white',
    medico:     'bg-red-500 text-white',
    resultado:  'bg-amber-500 text-black',
    treino:     'bg-purple-500 text-white',
    bastidores: 'bg-cyan-500 text-white',
};

// Subtle — for compact cards and lists
export const CATEGORY_COLORS_SUBTLE: Record<NewsCategory, string> = {
    mercado:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    analise:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medico:     'bg-red-500/20 text-red-400 border-red-500/30',
    resultado:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
    treino:     'bg-purple-500/20 text-purple-400 border-purple-500/30',
    bastidores: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};
