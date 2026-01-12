import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import AutoRefresh from "@/components/AutoRefresh";
import NotificationManager from "@/components/NotificationManager";
import InstallPrompt from "@/components/InstallPrompt";

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
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
