import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fogão Prêmio | Notícias Premium do Botafogo",
    description: "Acompanhe as notícias do Botafogo com inteligência artificial e curadoria premium.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
