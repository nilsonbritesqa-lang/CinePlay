import type { Metadata } from 'next';
import Link from 'next/link';
import LPHeader from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import TrailersPageClient from '@/components/site/TrailersPageClient';

export const metadata: Metadata = {
  title: 'Galeria Oficial de Trailers HD | CinePlay',
  description: 'Assista aos lançamentos mais recentes de filmes, séries e transmissões de esportes em alta definição com 1 clique.',
  alternates: { canonical: 'https://cine-play-seven.vercel.app/trailers' },
};

export default function TrailersPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#07070D', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <LPHeader />

      <main style={{ flex: 1, paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A0A0B5', marginBottom: 20 }}>
            <Link href="/" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Início</Link>
            <span>/</span>
            <span style={{ color: '#E50914', fontWeight: 700 }}>Galeria de Trailers HD</span>
          </div>

          <TrailersPageClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
