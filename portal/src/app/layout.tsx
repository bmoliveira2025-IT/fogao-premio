import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import "./editorial.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { VideoPlayerProvider } from "@/context/VideoPlayerContext";
import { Suspense } from "react";
import DesktopHeader from "@/components/DesktopHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import DeferredEnhancements from "@/components/DeferredEnhancements";
import InitialSplash from "@/components/InitialSplash";

const roboto = localFont({
  src: '../../public/fonts/roboto-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-roboto',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090B',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fogao-premio.vercel.app'),
  title: {
    default: "Fogão 360 | Tudo sobre o Botafogo",
    template: "%s | Fogão 360"
  },
  description: "Notícias, jogos, tabela, vídeos e análises do Botafogo em um só lugar.",
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fogao-premio.vercel.app',
    siteName: 'Fogão 360',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fogão 360',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fogão 360',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${roboto.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased overflow-x-hidden selection:bg-premium-gold/30">
        <InitialSplash />
        <ThemeProvider>
          <AuthProvider>
            <VideoPlayerProvider>
              <DeferredEnhancements />

              <Suspense fallback={null}>
                <DesktopHeader />
              </Suspense>

              <main className="min-h-screen bg-background text-foreground flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] pt-0 lg:pb-0 lg:pt-16">
                <div className="flex-1">
                  {children}
                </div>
              </main>

              {/* Mobile Bottom Navigation (Native App Style) */}
              <MobileBottomNav />

              {/* Footer - Desktop/General */}
              <div className="hidden lg:block">
                {/* Optional footer content for PC */}
              </div>
            </VideoPlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
