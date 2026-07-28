import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ChevronRight, MessageCircle, CheckCircle2, Flame, User, BookOpen, Share2, Sparkles, Check } from 'lucide-react';
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
    const res = await fetch(`${url}/rest/v1/ctas?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 10 },
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoria, post.slug);
  const activeCta = await getActiveCta(post.categoria, post.titulo);

  // Busca autor
  const foundAuthor = DEFAULT_AUTHORS.find(a => a.nome.toLowerCase() === (post.autor_nome || '').toLowerCase()) || DEFAULT_AUTHORS[0];
  const authorName = post.autor_nome || foundAuthor.nome;
  const authorCargo = foundAuthor.cargo;
  const authorAvatar = foundAuthor.avatar_url;
  const authorBio = foundAuthor.bio;
  const authorSlug = foundAuthor.slug;

  const dateObj = new Date(post.publicado_em || Date.now());
  const dateFormatted = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeFormatted = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const shareUrl = `https://cine-play-seven.vercel.app/blog/${post.slug}`;

  // Formata o conteúdo HTML garantindo uma estrutura rica e completa
  let rawContent = post.conteudo_html || post.conteudo_completo || `<p>${post.resumo}</p>`;
  
  // Se o conteúdo for curto, enriquece com tópicos e estruturação completa
  if (rawContent.length < 500) {
    rawContent = `
      <div class="key-takeaways-box">
        <h4>📌 Destaques Principais da Matéria</h4>
        <ul>
          <li><strong>Transmissão em HD/4K:</strong> Cobertura completa com máxima fidelidade visual e sem travamentos.</li>
          <li><strong>Disponibilidade Multiplataforma:</strong> Acesse via Smart TV, TV Box, Smartphone, Tablet ou Computador.</li>
          <li><strong>Informações Atualizadas:</strong> Dados verificados diretamente com as emissoras oficiais e operadoras parceiras.</li>
        </ul>
      </div>

      <h2>1. Panorama Completo sobre ${post.titulo}</h2>
      <p>A experiência de assistir aos seus eventos e produções favoritas evoluiu drasticamente. Com a expansão do streaming e dos canais por assinatura digitais, garantir o acesso rápido, estável e com áudio e vídeo de altíssima definição tornou-se uma prioridade para os entusiastas de entretenimento.</p>
      
      <p>Nesta matéria detalhada, reunimos todas as orientações fundamentais para você não perder nenhum detalhe de <strong>${post.titulo}</strong>.</p>

      <blockquote>
        "O entretenimento de qualidade exige não apenas boa conectividade, mas o canal de transmissão correto para evitar gargalos e latência durante momentos decisivos."
      </blockquote>

      <h2>2. Como Assistir com a Melhor Qualidade e Sem Travamentos</h2>
      <p>Para desfrutar da transmissão sem buffering e com resolução Ultra HD 4K, siga este checklist recomendado pelos nossos especialistas:</p>
      
      <table class="editorial-table">
        <thead>
          <tr>
            <th>Requisito</th>
            <th>Recomendação Mínima</th>
            <th>Ideal para 4K HDR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Velocidade de Internet</td>
            <td>15 Mbps em fibra óptica</td>
            <td>50+ Mbps dedicados</td>
          </tr>
          <tr>
            <td>Conexão do Dispositivo</td>
            <td>Wi-Fi 5Ghz (802.11ac)</td>
            <td>Cabo Ethernet RJ45</td>
          </tr>
          <tr>
            <td>Dispositivo de Saída</td>
            <td>Full HD (1080p)</td>
            <td>Smart TV 4K OLED / QLED</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Perguntas Frequentes & Dicas de Acesso</h2>
      <p>Abaixo responderemos às principais dúvidas da comunidade sobre onde encontrar e como ativar o canal oficial para esta exibição:</p>
      
      <ul>
        <li><strong>Qual a forma mais rápida de obter acesso?</strong> Fale diretamente com o atendimento oficial via WhatsApp pelo botão ao final desta página.</li>
        <li><strong>Funciona em TVs mais antigas?</strong> Sim, utilizando adaptadores como Fire TV Stick, Chromecast ou Mi TV Stick.</li>
        <li><strong>Como garantir suporte imediato?</strong> Nosso canal oficial no WhatsApp oferece atendimento 24/7 para configuração guiada.</li>
      </ul>
    `;
  }

  return (
    <article style={{ minHeight: '100vh', background: '#07070D', color: '#fff', padding: '40px 16px 80px' }}>
      
      {/* Schema.org JSON-LD para SEO */}
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

      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        
        {/* Breadcrumbs Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#A0A0B5', marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Início</Link>
          <ChevronRight size={12} color="#555" />
          <Link href="/blog" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Blog</Link>
          <ChevronRight size={12} color="#555" />
          <span style={{ color: '#E50914', textTransform: 'capitalize', fontWeight: 700 }}>{post.categoria.replace('-', ' ')}</span>
          <ChevronRight size={12} color="#555" />
          <span style={{ color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{post.titulo}</span>
        </div>

        {/* Categoria Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 900,
            background: 'rgba(229, 9, 20, 0.2)', color: '#E50914',
            border: '1px solid rgba(229, 9, 20, 0.4)', textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Flame size={12} style={{ display: 'inline', marginRight: 4 }} /> {post.categoria.toUpperCase()}
          </span>
        </div>

        {/* Título Principal de Notícia (H1) */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: 18,
          color: '#FFFFFF',
          letterSpacing: '-0.025em'
        }}>
          {post.titulo}
        </h1>

        {/* Subtítulo Jornalístico / Excerpt */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)',
          lineHeight: 1.6,
          color: '#D0D0DB',
          marginBottom: 28,
          fontWeight: 500,
          borderLeft: '4px solid #E50914',
          paddingLeft: 18
        }}>
          {post.resumo}
        </p>

        {/* Bloco de Autor, Data e Leitura */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#8E8EA8',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: '16px 20px', marginBottom: 36
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={`/autor/${authorSlug}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
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
            <span style={{ color: '#444' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="#8B5CF6" /> {dateFormatted} às {timeFormatted}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#D0D0DB' }}>
            <Clock size={14} color="#F59E0B" /> {post.tempo_leitura_min || 5} min de leitura
          </div>
        </div>

        {/* Imagem de Capa HD com Moldura e Legenda */}
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 40, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 50px rgba(0,0,0,0.7)' }}>
          <img
            src={post.imagem_capa_url || '/og-default.jpg'}
            alt={post.titulo}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 500, objectFit: 'cover' }}
          />
          <div style={{ background: 'rgba(7,7,13,0.95)', padding: '12px 20px', fontSize: 12, color: '#A0A0B5', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📷</span>
            <span>Foto Oficial: {post.titulo} — Redação CinePlay</span>
          </div>
        </div>

        {/* Estilos CSS para o Conteúdo Editorial */}
        <style dangerouslySetInnerHTML={{ __html: `
          .editorial-body {
            font-size: 1.12rem;
            line-height: 1.85;
            color: #E0E0EC;
          }
          .editorial-body p {
            margin-bottom: 24px;
            color: #D8D8E5;
          }
          .editorial-body h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.7rem;
            font-weight: 800;
            color: #FFFFFF;
            margin: 40px 0 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(229, 9, 20, 0.4);
          }
          .editorial-body h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.35rem;
            font-weight: 700;
            color: #FFFFFF;
            margin: 28px 0 14px;
          }
          .editorial-body blockquote {
            background: rgba(229, 9, 20, 0.08);
            border-left: 4px solid #E50914;
            border-radius: 0 16px 16px 0;
            padding: 20px 24px;
            margin: 32px 0;
            font-style: italic;
            color: #F0F0FF;
            font-size: 1.15rem;
            line-height: 1.7;
          }
          .key-takeaways-box {
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(229,9,20,0.08) 100%);
            border: 1px solid rgba(229,9,20,0.3);
            border-radius: 18px;
            padding: 24px;
            margin-bottom: 36px;
          }
          .key-takeaways-box h4 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.15rem;
            font-weight: 800;
            color: #FFF;
            margin: 0 0 14px;
          }
          .key-takeaways-box ul {
            margin: 0;
            padding-left: 20px;
          }
          .key-takeaways-box li {
            margin-bottom: 8px;
            color: #D0D0DB;
            font-size: 0.98rem;
          }
          .editorial-table {
            width: 100%;
            border-collapse: collapse;
            margin: 28px 0;
            background: rgba(255,255,255,0.02);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
          }
          .editorial-table th {
            background: rgba(229,9,20,0.2);
            color: #FFF;
            font-weight: 800;
            text-align: left;
            padding: 12px 16px;
            font-size: 0.9rem;
            text-transform: uppercase;
          }
          .editorial-table td {
            padding: 12px 16px;
            border-top: 1px solid rgba(255,255,255,0.05);
            color: #D0D0DB;
            font-size: 0.95rem;
          }
        ` }} />

        {/* Conteúdo Renderizado */}
        <div
          className="editorial-body"
          dangerouslySetInnerHTML={{ __html: rawContent }}
        />

        {/* Caixa de Conversão Direta via WhatsApp do Patrocinador Ativo */}
        <div style={{
          padding: '32px 36px', borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.16) 0%, rgba(15, 15, 26, 0.98) 100%)',
          border: '1px solid rgba(229, 9, 20, 0.4)', textAlign: 'center', margin: '48px 0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
        }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.45rem', fontWeight: 900, color: '#fff', marginBottom: 10 }}>
            🚀 Transmissão Exclusiva em Alta Definição
          </h3>
          <p style={{ color: '#A0A0B5', fontSize: 14, maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {activeCta.texto_pre}
          </p>
          <a
            href={activeCta.url_destino}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 99, background: activeCta.cor_botao || '#E50914',
              color: '#fff', fontWeight: 900, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(229, 9, 20, 0.5)', transition: 'transform 0.2s ease',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <MessageCircle size={20} /> {activeCta.texto_botao}
          </a>
        </div>

        {/* Componente Interativo de Compartilhamento & Reações */}
        <PostInteractiveSection postTitle={post.titulo} shareUrl={shareUrl} />

        {/* Card do Autor */}
        <div style={{
          background: 'linear-gradient(145deg, #0F0F1A 0%, #090912 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: '28px 32px', marginTop: 48, marginBottom: 48,
          display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ width: 76, height: 76, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
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
            <p style={{ color: '#D0D0DB', fontSize: 13, lineHeight: 1.55, margin: 0 }}>
              {authorBio}
            </p>
          </div>

          <Link
            href={`/autor/${authorSlug}`}
            style={{
              padding: '10px 20px', borderRadius: 99, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13,
              fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap'
            }}
          >
            Ver todos os artigos →
          </Link>
        </div>

        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 44 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
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
