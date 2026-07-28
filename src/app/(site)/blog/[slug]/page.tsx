import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ChevronRight, MessageCircle, CheckCircle2, Flame, User, BookOpen, Share2, Sparkles, Check, Eye } from 'lucide-react';
import type { PostCard } from '@/lib/types';
import { PostCardComponent } from '@/components/site/PostCard';
import { PostInteractiveSection } from '@/components/site/PostInteractiveSection';
import { ViewCounter } from '@/components/site/ViewCounter';
import { DEFAULT_AUTHORS } from '@/lib/authors/service';
import { extractTeamsFromTitle } from '@/lib/teams/crests';

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
  const dateFormatted = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
  const timeFormatted = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

  const shareUrl = `https://cine-play-seven.vercel.app/blog/${post.slug}`;

  // Busca os escudos dos times mencionados no título
  const { home: teamHome, away: teamAway } = extractTeamsFromTitle(post.titulo);

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
      <ViewCounter postId={post.id} slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: post.titulo, image: [post.imagem_capa_url || '/og-default.jpg'], datePublished: post.publicado_em || new Date().toISOString(), author: { '@type': 'Person', name: authorName }, publisher: { '@type': 'Organization', name: 'CinePlay' }, description: post.resumo }) }} />

      <div className="blog-layout-container" style={{ maxWidth: 1120, margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#A0A0B5', marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Início</Link>
          <ChevronRight size={12} color="#555" />
          <Link href="/blog" style={{ color: '#A0A0B5', textDecoration: 'none' }}>Blog</Link>
          <ChevronRight size={12} color="#555" />
          <span style={{ color: '#E50914', textTransform: 'capitalize', fontWeight: 700 }}>{post.categoria.replace('-', ' ')}</span>
        </div>

        {/* 2-Column Grid: Content + Sidebar */}
        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
          
          {/* === MAIN CONTENT COLUMN === */}
          <div style={{ minWidth: 0 }}>
            {/* Category Badge */}
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 900, background: 'rgba(229,9,20,0.2)', color: '#E50914', border: '1px solid rgba(229,9,20,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              <Flame size={12} style={{ display: 'inline', marginRight: 4 }} /> {post.categoria.toUpperCase()}
            </span>

            {/* H1 Title */}
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: '#FFF', letterSpacing: '-0.02em' }}>
              {post.titulo}
            </h1>

            {/* Subtitle / Resumo */}
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.6, color: '#C8C8DA', marginBottom: 24, fontWeight: 500, borderLeft: '4px solid #E50914', paddingLeft: 18 }}>
              {post.resumo}
            </p>

            {/* Author + Date Bar */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#8E8EA8', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', marginBottom: 32 }}>
              <Link href={`/autor/${authorSlug}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
                  <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 800, color: '#fff', fontSize: 13 }}>
                    {authorName} <CheckCircle2 size={13} color="#10B981" />
                  </div>
                  <span style={{ fontSize: 10, color: '#E50914', fontWeight: 600 }}>{authorCargo}</span>
                </div>
              </Link>
              <span style={{ color: '#444' }}>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} color="#8B5CF6" /> {dateFormatted} às {timeFormatted}</span>
              <span style={{ color: '#444' }}>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} color="#F59E0B" /> {post.tempo_leitura_min || 5} min</span>
            </div>

            {/* Placar / Banner de Confronto com Escudos Oficiais */}
            {(teamHome || teamAway) && (
              <div style={{ background: 'linear-gradient(135deg, rgba(15,15,26,0.95), rgba(229,9,20,0.18))', border: '1px solid rgba(229,9,20,0.3)', borderRadius: 20, padding: '24px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  {teamHome ? (
                    <>
                      <img src={teamHome.crestUrl} alt={teamHome.name} style={{ width: 68, height: 68, objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }} />
                      <div style={{ fontWeight: 900, fontSize: 16, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>{teamHome.name}</div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#A0A0B5' }}>Mandante</div>
                  )}
                </div>

                <div style={{ textAlign: 'center', padding: '0 8px' }}>
                  <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 99, background: '#E50914', color: '#fff', fontWeight: 900, fontSize: 14, letterSpacing: '0.08em', boxShadow: '0 4px 15px rgba(229,9,20,0.4)' }}>
                    VS
                  </span>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ● TRANSMISSÃO CINEPLAY
                  </div>
                </div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  {teamAway ? (
                    <>
                      <img src={teamAway.crestUrl} alt={teamAway.name} style={{ width: 68, height: 68, objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }} />
                      <div style={{ fontWeight: 900, fontSize: 16, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>{teamAway.name}</div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#A0A0B5' }}>Visitante</div>
                  )}
                </div>
              </div>
            )}

            {/* Cover Image */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 36, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', background: '#0F0F1A', aspectRatio: '16/9' }}>
              <img src={post.imagem_capa_url || '/og-default.jpg'} alt={post.titulo} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
            </div>

            {/* Editorial CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
              .editorial-body { font-size: 1.08rem; line-height: 1.85; color: #D8D8E5; }
              .editorial-body p { margin-bottom: 22px; }
              .editorial-body h2 { font-family: 'Outfit', sans-serif; font-size: 1.55rem; font-weight: 800; color: #FFF; margin: 36px 0 16px; padding-bottom: 8px; border-bottom: 2px solid rgba(229,9,20,0.35); }
              .editorial-body h3 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: #FFF; margin: 24px 0 12px; }
              .editorial-body blockquote { background: rgba(229,9,20,0.08); border-left: 4px solid #E50914; border-radius: 0 14px 14px 0; padding: 18px 22px; margin: 28px 0; font-style: italic; color: #F0F0FF; font-size: 1.05rem; line-height: 1.65; }
              .editorial-body ul, .editorial-body ol { margin: 0 0 22px 20px; }
              .editorial-body li { margin-bottom: 8px; color: #D0D0DB; }
              .key-takeaways-box { background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(229,9,20,0.08)); border: 1px solid rgba(229,9,20,0.3); border-radius: 16px; padding: 22px; margin-bottom: 32px; }
              .key-takeaways-box h4 { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: #FFF; margin: 0 0 12px; }
              .key-takeaways-box li { margin-bottom: 6px; color: #D0D0DB; font-size: 0.95rem; }
              .editorial-table { width: 100%; border-collapse: collapse; margin: 24px 0; background: rgba(255,255,255,0.02); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
              .editorial-table th { background: rgba(229,9,20,0.2); color: #FFF; font-weight: 800; text-align: left; padding: 11px 14px; font-size: 0.88rem; text-transform: uppercase; }
              .editorial-table td { padding: 11px 14px; border-top: 1px solid rgba(255,255,255,0.05); color: #D0D0DB; font-size: 0.92rem; }
              .blog-grid { display: grid; grid-template-columns: 1fr 340px; gap: 40px; }
              @media (max-width: 900px) { .blog-grid { grid-template-columns: 1fr !important; } }
            ` }} />

            {/* Rendered Content */}
            <div className="editorial-body" dangerouslySetInnerHTML={{ __html: rawContent }} />

            {/* Bottom CTA Box */}
            <div style={{ padding: '28px 32px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(229,9,20,0.16), rgba(15,15,26,0.98))', border: '1px solid rgba(229,9,20,0.4)', textAlign: 'center', margin: '40px 0', boxShadow: '0 10px 35px rgba(0,0,0,0.5)' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                📱 Onde Assistir? No CinePlay!
              </h3>
              <p style={{ color: '#A0A0B5', fontSize: 14, maxWidth: 580, margin: '0 auto 20px', lineHeight: 1.6 }}>
                {activeCta.texto_pre}
              </p>
              <a href={activeCta.url_destino} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 99, background: '#25D366', color: '#fff', fontWeight: 900, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,211,102,0.4)', fontFamily: 'Outfit, sans-serif' }}>
                <MessageCircle size={18} /> Solicitar Teste Grátis via WhatsApp
              </a>
            </div>

            <PostInteractiveSection postTitle={post.titulo} shareUrl={shareUrl} />

            {/* Author Card */}
            <div style={{ background: 'linear-gradient(145deg, #0F0F1A, #090912)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 28px', marginTop: 40, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 64, height: 64, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
                <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#E50914', textTransform: 'uppercase' }}>SOBRE O AUTOR</span>
                <h4 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: '#fff', margin: '2px 0' }}>{authorName}</h4>
                <div style={{ fontSize: 11, color: '#A0A0B5', marginBottom: 6 }}>{authorCargo}</div>
                <p style={{ color: '#D0D0DB', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{authorBio}</p>
              </div>
            </div>
          </div>

          {/* === SIDEBAR COLUMN === */}
          <aside className="blog-sidebar" style={{ position: 'sticky', top: 100 }}>
            {/* CTA Widget — FIRST THING IN SIDEBAR */}
            <div style={{ background: 'linear-gradient(180deg, rgba(229,9,20,0.15), rgba(15,15,26,0.95))', border: '1px solid rgba(229,9,20,0.35)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📺</div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
                Onde Assistir?
              </h3>
              <p style={{ color: '#B0B0C5', fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>
                Assista a filmes, séries e esportes ao vivo em HD/4K na sua Smart TV ou celular. Solicite um teste grátis agora!
              </p>
              <a href={activeCta.url_destino} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', borderRadius: 99, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,211,102,0.35)', fontFamily: 'Outfit' }}>
                <MessageCircle size={16} /> Falar no WhatsApp
              </a>
            </div>

            {/* Categorias Widget */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px', marginBottom: 28 }}>
              <h4 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📂 Categorias
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['futebol', 'cinema', 'series', 'canais'].map(cat => (
                  <Link key={cat} href={`/blog?categoria=${cat}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: cat === post.categoria ? 'rgba(229,9,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${cat === post.categoria ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.05)'}`, color: cat === post.categoria ? '#E50914' : '#B0B0C5', textDecoration: 'none', fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                    <span>{cat === 'series' ? 'Séries' : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Posts Widget */}
            {relatedPosts.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px', marginBottom: 28 }}>
                <h4 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📰 Leia Também
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {relatedPosts.map(rel => (
                    <Link key={rel.id} href={`/blog/${rel.slug}`} style={{ display: 'flex', gap: 12, textDecoration: 'none', alignItems: 'center' }}>
                      <div style={{ width: 70, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#0F0F1A' }}>
                        <img src={rel.imagem_capa_url || '/og-default.jpg'} alt={rel.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h5 style={{ fontSize: 12, fontWeight: 700, color: '#E0E0F0', lineHeight: 1.35, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                          {rel.titulo}
                        </h5>
                        <span style={{ fontSize: 10, color: '#888' }}>{rel.publicado_em ? new Date(rel.publicado_em).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : ''}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Second CTA Widget */}
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#B0B0C5', lineHeight: 1.5, marginBottom: 14 }}>
                <strong style={{ color: '#fff' }}>Dúvidas?</strong> Fale conosco no WhatsApp e solicite um teste grátis do CinePlay.
              </p>
              <a href={activeCta.url_destino} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 99, background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#E50914', fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: 'Outfit' }}>
                <MessageCircle size={14} /> WhatsApp CinePlay
              </a>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
