import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ChevronRight, MessageCircle, CheckCircle2, Flame, User, BookOpen } from 'lucide-react';
import type { PostCard } from '@/lib/types';
import { PostCardComponent } from '@/components/site/PostCard';
import { PostInteractiveSection } from '@/components/site/PostInteractiveSection';
import { DEFAULT_AUTHORS } from '@/lib/authors/service';

interface PostDetail extends PostCard {
  conteudo_html?: string;
  conteudo_completo?: string;
}

async function getPost(slug: string): Promise<PostDetail | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXNhYmlydW5meXdqeGZzdWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDMyMzY0NiwiZXhwIjoyMDk5ODk5NjQ2fQ.pyC3DsxpLQfQbmKEyXb0y6SRUtv34K05ZfpqIcRP6Ps';

  try {
    const res = await fetch(`${url}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string): Promise<PostCard[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXNhYmlydW5meXdqeGZzdWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDMyMzY0NiwiZXhwIjoyMDk5ODk5NjQ2fQ.pyC3DsxpLQfQbmKEyXb0y6SRUtv34K05ZfpqIcRP6Ps';

  try {
    const res = await fetch(`${url}/rest/v1/posts?categoria=eq.${category}&slug=neq.${encodeURIComponent(currentSlug)}&limit=3&order=publicado_em.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getActiveCta(category: string, postTitle: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXNhYmlydW5meXdqeGZzdWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDMyMzY0NiwiZXhwIjoyMDk5ODk5NjQ2fQ.pyC3DsxpLQfQbmKEyXb0y6SRUtv34K05ZfpqIcRP6Ps';

  try {
    // 1. Tenta buscar CTA cadastrado no Supabase
    const res = await fetch(`${url}/rest/v1/ctas?ativo=eq.true&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const ctas = await res.json();
      if (Array.isArray(ctas) && ctas.length > 0) {
        const matchingCta = ctas.find(c => {
          if (!c.categorias) return true;
          if (Array.isArray(c.categorias)) {
            return c.categorias.includes(category) || c.categorias.includes('*') || c.categorias.length === 0;
          }
          return true;
        }) || ctas[0];

        let targetUrl = matchingCta.url_destino || '';
        if (targetUrl && !targetUrl.startsWith('http') && !targetUrl.startsWith('https')) {
          const cleanNum = targetUrl.replace(/\D/g, '');
          targetUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(`Olá! Estou lendo no CinePlay: "${postTitle}" e gostaria de saber mais.`)}`;
        } else if (targetUrl && (targetUrl.includes('wa.me') || targetUrl.includes('api.whatsapp.com')) && !targetUrl.includes('text=')) {
          targetUrl += `${targetUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(`Olá! Estou lendo no CinePlay: "${postTitle}" e gostaria de saber mais.`)}`;
        }

        return {
          texto_pre: matchingCta.texto_pre || 'Libere o potencial da sua tela! Fale conosco pelo WhatsApp e descubra como acessar seus canais de esportes favoritos em alta definição.',
          texto_botao: matchingCta.texto_botao || 'Falar no WhatsApp Oficial',
          url_destino: targetUrl || `https://wa.me/5511999998888?text=${encodeURIComponent(`Olá! Estou lendo: ${postTitle}`)}`,
          cor_botao: matchingCta.cor_botao || '#E50914',
        };
      }
    }

    // 2. Fallback para chatbot_config
    const configRes = await fetch(`${url}/rest/v1/chatbot_config?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (configRes.ok) {
      const configs = await configRes.json();
      if (Array.isArray(configs) && configs.length > 0) {
        const cfg = configs[0];
        const num = (cfg.whatsapp_numero || '5511999999999').replace(/\D/g, '');
        const msg = cfg.whatsapp_mensagem || `Olá! Vim pelo artigo: ${postTitle}`;
        return {
          texto_pre: 'Libere o potencial da sua tela! Fale conosco pelo WhatsApp e descubra como acessar seus canais de esportes favoritos em alta definição.',
          texto_botao: 'Falar no WhatsApp Oficial',
          url_destino: `https://wa.me/${num}?text=${encodeURIComponent(msg)}`,
          cor_botao: '#E50914',
        };
      }
    }
  } catch (err) {
    console.error('Erro ao resolver CTA:', err);
  }

  return {
    texto_pre: 'Libere o potencial da sua tela! Fale conosco pelo WhatsApp e descubra como acessar seus canais de esportes favoritos em alta definição.',
    texto_botao: 'Falar no WhatsApp Oficial',
    url_destino: `https://wa.me/5511999998888?text=${encodeURIComponent(`Olá! Estou lendo no CinePlay: "${postTitle}"`)}`,
    cor_botao: '#E50914',
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Artigo Não Encontrado — CinePlay',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cine-play-seven.vercel.app';
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const title = `${post.titulo} | Guia CinePlay`;
  const description = post.resumo || `Confira a matéria completa sobre ${post.titulo} com informações atualizadas.`;
  const imageUrl = post.imagem_capa_url || `${baseUrl}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'CinePlay Portal',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.titulo }],
      type: 'article',
      publishedTime: post.publicado_em || new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoria, post.slug);
  const activeCta = await getActiveCta(post.categoria, post.titulo);
  const htmlContent = post.conteudo_html || post.conteudo_completo || post.resumo;
  
  const pubDate = post.publicado_em ? new Date(post.publicado_em) : new Date();
  const dateFormatted = pubDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeFormatted = pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const shareUrl = `https://cine-play-seven.vercel.app/blog/${post.slug}`;
  const defaultAuthor = DEFAULT_AUTHORS[0];

  const authorName = post.autor_nome || defaultAuthor.nome;
  const authorCargo = post.autor_cargo || defaultAuthor.cargo;
  const authorAvatar = post.autor_avatar || defaultAuthor.avatar_url;
  const authorSlug = post.autor_slug || defaultAuthor.slug;
  const authorBio = post.autor_bio || defaultAuthor.bio;

  return (
    <article style={{ background: '#07070D', minHeight: '100vh', padding: '110px 20px 80px', color: '#F0F0F5' }}>
      
      {/* Schema JSON-LD Estruturado para Google Search & Discover */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: post.titulo,
            image: [post.imagem_capa_url || 'https://cine-play-seven.vercel.app/og-default.jpg'],
            datePublished: post.publicado_em || new Date().toISOString(),
            dateModified: post.publicado_em || new Date().toISOString(),
            author: {
              '@type': 'Person',
              name: authorName,
              jobTitle: authorCargo,
              url: `https://cine-play-seven.vercel.app/autor/${authorSlug}`,
            },
            publisher: {
              '@type': 'Organization',
              name: 'CinePlay',
              logo: {
                '@type': 'ImageObject',
                url: 'https://cine-play-seven.vercel.app/logo-cineplay.png',
              },
            },
            description: post.resumo,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': shareUrl,
            },
          }),
        }}
      />

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        
        {/* Breadcrumbs Navigation (Estilo Mockup) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#A0A0B5', marginBottom: 20, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Início</Link>
          <ChevronRight size={12} color="#555" />
          <Link href="/blog" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Blog</Link>
          <ChevronRight size={12} color="#555" />
          <span style={{ color: '#E50914', textTransform: 'capitalize', fontWeight: 600 }}>{post.categoria.replace('-', ' ')}</span>
          <ChevronRight size={12} color="#555" />
          <span style={{ color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{post.titulo}</span>
        </div>

        {/* Categoria Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 900,
            background: 'rgba(229, 9, 20, 0.18)', color: '#E50914',
            border: '1px solid rgba(229, 9, 20, 0.35)', textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Flame size={12} style={{ display: 'inline', marginRight: 4 }} /> {post.categoria.toUpperCase()}
          </span>
        </div>

        {/* Título Principal de Notícia (H1) */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
          fontWeight: 900,
          lineHeight: 1.18,
          marginBottom: 16,
          color: '#FFFFFF',
          letterSpacing: '-0.02em'
        }}>
          {post.titulo}
        </h1>

        {/* Linha Fina / Subtítulo Jornalístico */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          lineHeight: 1.55,
          color: '#D0D0DB',
          marginBottom: 24,
          fontWeight: 500,
          borderLeft: '3px solid #E50914',
          paddingLeft: 16
        }}>
          {post.resumo}
        </p>

        {/* Bloco de Autor, Data e Leitura (Estilo Portal de Notícias G1) */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#8E8EA8',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 0', marginBottom: 32
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={`/autor/${authorSlug}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
                <img
                  src={authorAvatar}
                  alt={authorName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#fff', fontSize: 14 }}>
                  <span>Por {authorName}</span>
                  <CheckCircle2 size={14} color="#10B981" />
                </div>
                <span style={{ fontSize: 11, color: '#E50914', fontWeight: 600 }}>
                  {authorCargo}
                </span>
              </div>
            </Link>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="#8B5CF6" /> {dateFormatted} às {timeFormatted}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#D0D0DB' }}>
            <Clock size={14} color="#F59E0B" /> {post.tempo_leitura_min || 5} min de leitura
          </div>
        </div>

        {/* Imagem de Capa HD com Legenda (Estilo Mockup) */}
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 36, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <img
            src={post.imagem_capa_url || '/og-default.jpg'}
            alt={post.titulo}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 480, objectFit: 'cover' }}
          />
          <div style={{ background: 'rgba(7,7,13,0.95)', padding: '10px 16px', fontSize: 12, color: '#A0A0B5', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📷</span>
            <span>Imagem: {post.titulo}</span>
          </div>
        </div>

        {/* Conteúdo HTML do Post com Tipografia & Tabelas Customizadas */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: '1.08rem',
            lineHeight: 1.85,
            color: '#E0E0EC',
            marginBottom: 48
          }}
        />

        {/* Caixa de Conversão Direta via WhatsApp / CTA Dinâmico do Patrocinador (Estilo Mockup) */}
        <div style={{
          padding: '28px 32px', borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, rgba(15, 15, 26, 0.98) 100%)',
          border: '1px solid rgba(229, 9, 20, 0.35)', textAlign: 'center', marginBottom: 48,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            🚀 Libere o potencial da sua tela! Fale conosco pelo WhatsApp e descubra como acessar seus canais de esportes favoritos em alta definição.
          </h3>
          <p style={{ color: '#A0A0B5', fontSize: 14, maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.6 }}>
            {activeCta.texto_pre}
          </p>
          <a
            href={activeCta.url_destino}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 99, background: activeCta.cor_botao || '#E50914',
              color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(229, 9, 20, 0.4)', transition: 'transform 0.2s ease',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <MessageCircle size={18} /> {activeCta.texto_botao}
          </a>
        </div>

        {/* Componente Interativo de Redes Sociais & Comentários (Estilo Mockup) */}
        <PostInteractiveSection postTitle={post.titulo} shareUrl={shareUrl} />

        {/* Card Sobre o Autor da Matéria */}
        <div style={{
          background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '24px 28px', marginTop: 48, marginBottom: 48,
          display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ width: 72, height: 72, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
            <img
              src={authorAvatar}
              alt={authorName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SOBRE O AUTOR
              </span>
            </div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
              {authorName}
            </h4>
            <div style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600, marginBottom: 8 }}>
              {authorCargo}
            </div>
            <p style={{ color: '#D0D0DB', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
              {authorBio}
            </p>
          </div>

          <Link
            href={`/autor/${authorSlug}`}
            style={{
              padding: '10px 18px', borderRadius: 99, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13,
              fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap'
            }}
          >
            Ver todos os artigos →
          </Link>
        </div>

        {/* Bloco de Posts Relacionados (Leia Também) */}
        {relatedPosts.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              📰 Leia também — Notícias Relacionadas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {relatedPosts.map(rel => (
                <PostCardComponent key={rel.id} post={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
