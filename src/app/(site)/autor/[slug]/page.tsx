import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User, CheckCircle2, ArrowLeft, Award, BookOpen } from 'lucide-react';
import { getAuthorBySlug, DEFAULT_AUTHORS } from '@/lib/authors/service';
import type { PostCard } from '@/lib/types';
import { PostCardComponent } from '@/components/site/PostCard';

async function getAuthorPosts(authorName: string, authorSlug: string): Promise<PostCard[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  try {
    const res = await fetch(`${url}/rest/v1/posts?select=*&order=publicado_em.desc&limit=24`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const allPosts: PostCard[] = await res.json();
    
    // Filtra posts correspondentes ao autor por nome ou slug
    const matching = allPosts.filter(
      p => p.autor_slug === authorSlug || (p.autor_nome && p.autor_nome.toLowerCase().includes(authorName.toLowerCase()))
    );

    // Se nenhum post coincidir exatamente, exibe os posts mais recentes para garantir boa experiência
    return matching.length > 0 ? matching : allPosts.slice(0, 9);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Autor Não Encontrado — CinePlay',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cine-play-seven.vercel.app';
  const canonicalUrl = `${baseUrl}/autor/${author.slug}`;
  const title = `${author.nome} — ${author.cargo} | CinePlay Editorial`;
  const description = author.bio;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'CinePlay Portal',
      images: [{ url: author.avatar_url, width: 400, height: 400, alt: author.nome }],
      type: 'profile',
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getAuthorPosts(author.nome, author.slug);

  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 20px 80px', color: '#F0F0F5' }}>
      
      {/* Schema JSON-LD para autoridade no Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.nome,
            jobTitle: author.cargo,
            description: author.bio,
            image: author.avatar_url,
            worksFor: {
              '@type': 'Organization',
              name: 'CinePlay',
              url: 'https://cine-play-seven.vercel.app',
            },
          }),
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Botão de Retorno */}
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 700, color: '#A0A0B5', textDecoration: 'none',
          background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 99,
          border: '1px solid rgba(255,255,255,0.08)', marginBottom: 32, transition: 'all 0.2s'
        }}>
          <ArrowLeft size={14} /> Voltar para o Blog
        </Link>

        {/* Hero Card do Autor */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 32, 0.95) 0%, rgba(9, 9, 16, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24, padding: '36px 32px', marginBottom: 48,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap'
        }}>
          {/* Foto Avatar HD */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 140, height: 140, borderRadius: 99, overflow: 'hidden',
              border: '3px solid #E50914', boxShadow: '0 8px 30px rgba(229,9,20,0.4)'
            }}>
              <img
                src={author.avatar_url}
                alt={author.nome}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute', bottom: 4, right: 4, background: '#10B981',
              width: 24, height: 24, borderRadius: 99, display: 'flex',
              alignItems: 'center', justifyContent: 'center', border: '2px solid #07070D'
            }} title="Autor Verificado Redação CinePlay">
              <CheckCircle2 size={15} color="#fff" />
            </div>
          </div>

          {/* Informações de Perfil */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                {author.nome}
              </h1>
              <span style={{
                background: 'rgba(229,9,20,0.15)', color: '#E50914', fontSize: 11,
                fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                border: '1px solid rgba(229,9,20,0.3)', textTransform: 'uppercase'
              }}>
                Membro Oficial
              </span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: '#E50914', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={16} /> {author.cargo}
            </div>

            <p style={{ color: '#A0A0B5', fontSize: 14, lineHeight: 1.6, marginBottom: 18, maxWidth: 680 }}>
              {author.bio}
            </p>

            {/* Badges de Especialidades */}
            {author.especialidades && author.especialidades.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {author.especialidades.map(esp => (
                  <span key={esp} style={{
                    fontSize: 11, fontWeight: 600, color: '#D0D0DB',
                    background: 'rgba(255,255,255,0.05)', padding: '4px 10px',
                    borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    #{esp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seção de Artigos Publicados */}
        <div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800,
            color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10
          }}>
            <BookOpen size={22} color="#E50914" /> Matérias Publicadas por {author.nome} ({posts.length})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {posts.map(p => (
              <PostCardComponent key={p.id} post={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
