import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cineplay.com.br'),
  title: {
    default: 'CinePlay — Onde Assistir Filmes, Séries e Futebol',
    template: '%s | CinePlay',
  },
  description: 'Guia completo de streaming no Brasil: onde assistir filmes, séries, futebol ao vivo e como ter acesso aos melhores canais.',
  keywords: ['onde assistir', 'streaming brasil', 'futebol ao vivo', 'filmes online', 'series streaming'],
  authors: [{ name: 'CinePlay Editorial' }],
  creator: 'CinePlay',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'CinePlay',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cineplaybr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:ital,opsz,wght@0,14..32,300..700;1,14..32,300..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
