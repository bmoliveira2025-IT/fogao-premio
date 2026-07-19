export default function ArticleLoading() {
    return (
        <div className="min-h-screen bg-white px-5 pb-24 pt-6 text-zinc-900" role="status" aria-label="Carregando notícia">
            <div className="mx-auto max-w-3xl animate-pulse">
                <div className="mb-8 h-5 w-20 rounded-full bg-zinc-100" />
                <div className="mb-5 aspect-[16/9] w-full rounded-2xl bg-zinc-100" />
                <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-zinc-100" />
                <div className="mx-auto mb-3 h-9 w-[92%] rounded-lg bg-zinc-200" />
                <div className="mx-auto mb-6 h-9 w-[72%] rounded-lg bg-zinc-200" />
                <div className="mx-auto mb-8 h-8 w-32 rounded-full bg-zinc-100" />
                <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-zinc-100" />
                    <div className="h-4 w-[96%] rounded bg-zinc-100" />
                    <div className="h-4 w-[88%] rounded bg-zinc-100" />
                    <div className="h-4 w-[93%] rounded bg-zinc-100" />
                </div>
            </div>
        </div>
    );
}
