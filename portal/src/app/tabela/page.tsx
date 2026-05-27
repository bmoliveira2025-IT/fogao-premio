import LeagueTable from "@/components/LeagueTable";

export default function TabelaPage() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 font-sans">
            <div className="p-5 lg:max-w-5xl lg:mx-auto lg:p-8 mt-4">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6 lg:mb-10">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-200"></div>
                    <h1 className="text-xl lg:text-3xl font-display font-black text-zinc-900 px-4 py-2 uppercase tracking-widest">
                        Classificação
                    </h1>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-200"></div>
                </div>

                <LeagueTable />

                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-500 italic">
                        * Tabela atualizada automaticamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
