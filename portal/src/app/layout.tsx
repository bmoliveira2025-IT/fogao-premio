import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import AutoRefresh from "@/components/AutoRefresh";
import NotificationManager from "@/components/NotificationManager";
import InstallPrompt from "@/components/InstallPrompt";
import MorningBriefingPopup from "@/components/MorningBriefingPopup";
import { Suspense } from "react";
import DesktopHeader from "@/components/DesktopHeader";
import MobileBottomNav from "@/components/MobileBottomNav";

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
        url: '/og-image.jpg', // We might need to ensure this exists or use a placeholder
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
    <html lang="pt-BR" suppressHydrationWarning className="overflow-x-hidden">
      <body className="antialiased overflow-x-hidden selection:bg-premium-gold/30">
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <AutoRefresh />
            </Suspense>
            <Suspense fallback={null}>
              <NotificationManager />
            </Suspense>
            <Suspense fallback={null}>
              <InstallPrompt />
            </Suspense>
            <Suspense fallback={null}>
              <MorningBriefingPopup />
            </Suspense>

            <Suspense fallback={null}>
              <DesktopHeader />
            </Suspense>

            {/* Mobile Header - Removed as per user request */}

            {/* Global Top Tabs for Mobile - Removed as per user request to make it more compact */}

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

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
