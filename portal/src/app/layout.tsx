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
import BrandingHeader from "@/components/BrandingHeader";
import TabBar from "@/components/TabBar";
import DesktopSidebar from "@/components/DesktopSidebar";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fogao-premio.vercel.app'),
  title: {
    default: "Fogão Prêmio | Notícias Premium do Botafogo",
    template: "%s | Fogão Prêmio"
  },
  description: "Acompanhe as notícias do Botafogo com inteligência artificial e curadoria premium.",
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fogao-premio.vercel.app',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fogão Prêmio',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AutoRefresh />
            <NotificationManager />
            <InstallPrompt />
            <Suspense fallback={null}>
              <MorningBriefingPopup />
            </Suspense>

            {/* Standardized Header & Sidebar */}
            <DesktopHeader />
            <div className="hidden lg:block">
              <DesktopSidebar />
            </div>
            <BrandingHeader />

            {/* Main Content Wrapper with Safe Area Handling */}
            <main className="min-h-screen bg-background lg:pl-64 flex flex-col pt-16 lg:pt-0">
              {/* Mobile Header Spacer - h-16 + safe area top */}
              <div className="lg:hidden h-[env(safe-area-inset-top)]"></div>

              <div className="flex-1">
                {children}
              </div>
            </main>

            {/* Mobile TabBar & Navigation */}
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <TabBar />
              </Suspense>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
