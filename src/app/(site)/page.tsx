import type { Metadata } from 'next';
import LandingPage from '@/components/site/LandingPage';

export const metadata: Metadata = {
  title: 'CinePlay — Onde Assistir Filmes, Séries e Futebol ao Vivo',
  description: 'O guia definitivo de streaming no Brasil. Saiba onde assistir filmes, séries e futebol ao vivo. Atualizado diariamente por inteligência artificial.',
  openGraph: {
    title: 'CinePlay — Onde Assistir Tudo',
    description: 'Guia completo de streaming no Brasil. Futebol ao vivo, filmes, séries e canais.',
    images: [{ url: '/logo-cineplay.jpeg', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
