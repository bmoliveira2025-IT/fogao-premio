import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://info-sphere-pro.vercel.app'),
  title: {
    default: "Fogão Prêmio | Notícias Premium do Botafogo",
    template: "%s | Fogão Prêmio"
  },
  description: "Acompanhe as notícias do Botafogo com inteligência artificial e curadoria premium.",
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://info-sphere-pro.vercel.app',
    siteName: 'Fogão Prêmio',
    images: [
      {
        url: '/og-image.jpg', // We might need to ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'Fogão Prêmio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FogaoPremio',
    creator: '@FogaoPremio',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
