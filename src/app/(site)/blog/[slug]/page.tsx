'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import type { PostCard, CTA } from '@/lib/types';
import { CTABlock } from '@/components/site/CTABlock';

interface PostDetail extends PostCard {
  conteudo_html?: string;
  conteudo_completo?: string;
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
        }
      } catch (err) {
        console.error('Erro ao buscar post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#07070D', minHeight: '100vh', padding: '160px 24px', textAlign: 'center', color: '#A0A0B5' }}>
        Carregando artigo...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ background: '#07070D', minHeight: '100vh', padding: '160px 24px', textAlign: 'center', color: '#F0F0F5' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Artigo não encontrado</h1>
        <p style={{ color: '#A0A0B5', marginBottom: 24 }}>O artigo solicitado não existe ou foi removido.</p>
        <Link href="/blog" className="btn btn-primary">Voltar para o Blog</Link>
      </div>
    );
  }

  const htmlContent = post.conteudo_html || post.conteudo_completo || post.resumo;

  return (
    <article style={{ background: '#07070D', minHeight: '100vh', padding: '120px 24px 80px', color: '#F0F0F5' }}>
      
      {/* Schema JSON-LD para SEO no Google Search e Discover */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: post.titulo,
            image: post.imagem_capa_url,
            datePublished: post.publicado_em || new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'CinePlay Editorial',
            },
            description: post.resumo,
          })
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Botão de retorno */}
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 700, color: '#A0A0B5', textDecoration: 'none',
          marginBottom: 32, transition: 'color 0.2s'
        }}>
          <ArrowLeft size={16} /> Voltar para o Blog
        </Link>

        {/* Categoria Badge */}
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 99,
          fontSize: 11, fontWeight: 700, background: 'rgba(229, 9, 20, 0.12)', color: '#E50914',
          border: '1px solid rgba(229, 9, 20, 0.3)', textTransform: 'uppercase',
          letterSpacing: '0.04em', marginBottom: 16
        }}>
          {post.categoria}
        </span>

        {/* Título Principal */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 900,
          lineHeight: 1.2,
          marginBottom: 20,
          color: '#fff'
        }}>
          {post.titulo}
        </h1>

        {/* Metadados */}
        <div style={{
          display: 'flex', gap: 20, fontSize: 13, color: '#A0A0B5',
          borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24,
          marginBottom: 32, flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={14} /> Por CinePlay Editorial
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} /> {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : 'Hoje'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> {post.tempo_leitura_min || 3} minutos de leitura
          </span>
        </div>

        {/* Imagem de Capa */}
        <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 40, border: '1px solid rgba(255,255,255,0.05)' }}>
          <img
            src={post.imagem_capa_url}
            alt={post.titulo}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Conteúdo HTML do Artigo */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: '#D0D0DB',
          }}
        />

        {/* Banner CTA WhatsApp de Conversão */}
        <div style={{
          marginTop: 48, padding: '24px', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(7, 7, 13, 0.9) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.3)', textAlign: 'center'
        }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Dúvidas sobre transmissões ao vivo e canais?
          </h3>
          <p style={{ color: '#A0A0B5', fontSize: 14, marginBottom: 18 }}>
            Fale com a nossa equipe de atendimento no WhatsApp para consultar grades de jogos e suporte.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Ol%C3%A1!+Vim+pelo+CinePlay+e+quero+saber+mais+sobre+transmiss%C3%B5es"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 99, background: '#25D366',
              color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)'
            }}
          >
            <MessageCircle size={18} /> Conversar no WhatsApp
          </a>
        </div>

      </div>
    </article>
  );
}
