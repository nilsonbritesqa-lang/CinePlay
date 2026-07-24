'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import type { PostCard } from '@/lib/types';

const CAT_COLORS: Record<string, string> = {
  futebol: '#10B981',
  cinema: '#8B5CF6',
  series: '#3B82F6',
  canais: '#F59E0B',
  'onde-assistir': '#EF4444',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PostCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const url = activeCategory ? `/api/posts?categoria=${activeCategory}` : '/api/posts';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Erro ao carregar posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [activeCategory]);

  const filteredPosts = posts.filter(post =>
    post.titulo.toLowerCase().includes(search.toLowerCase()) ||
    post.resumo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '110px 20px 60px', color: '#F0F0F5' }} className="blog-page-container">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header da página */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: 'rgba(229,9,20,0.12)', color: '#E50914', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
            <Sparkles size={14} /> Guia Editorial & Notícias de Entretenimento
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, marginBottom: 10 }}>
            📰 Blog CinePlay
          </h1>
          <p style={{ color: '#A0A0B5', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            Guias de streaming, lançamentos de filmes, futebol ao vivo e canais oficiais.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 16, padding: '20px'
        }} className="blog-filter-card">
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#A0A0B5' }} size={18} />
            <input
              type="text"
              placeholder="Buscar guias, partidas, canais..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 46px', borderRadius: 10,
                background: '#07070D', border: '1px solid var(--border-subtle)',
                color: '#fff', fontSize: 14, outline: 'none'
              }}
            />
          </div>

          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
          }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: activeCategory === null ? '#E50914' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeCategory === null ? '#E50914' : 'var(--border-subtle)'}`,
                color: '#fff', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              Todos os Conteúdos
            </button>
            {Object.keys(CAT_COLORS).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: activeCategory === cat ? CAT_COLORS[cat] : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeCategory === cat ? CAT_COLORS[cat] : 'var(--border-subtle)'}`,
                  color: '#fff', transition: 'all 0.2s', textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0,
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Listagem de Posts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5', fontSize: 14 }}>
            Carregando artigos do blog...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filteredPosts.map(post => (
              <article key={post.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.25s, border-color 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = CAT_COLORS[post.categoria] || '#E50914';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              >
                <div style={{ position: 'relative', height: 180, width: '100%' }}>
                  <img
                    src={post.imagem_capa_url}
                    alt={post.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800,
                    background: CAT_COLORS[post.categoria] || '#E50914', color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Outfit'
                  }}>
                    {post.categoria}
                  </span>
                </div>

                <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 8, color: '#fff', lineHeight: 1.3 }}>
                      {post.titulo}
                    </h3>
                    <p style={{ fontSize: 12, color: '#A0A0B5', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.resumo}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#6B6B85' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }} suppressHydrationWarning>
                      <Calendar size={12} /> {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : '2026-07-23'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        color: '#E50914', fontWeight: 800, textDecoration: 'none',
                        fontFamily: 'Outfit'
                      }}
                    >
                      Ler Artigo <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5' }}>
            Nenhum artigo encontrado para o filtro selecionado.
          </div>
        )}

      </div>
    </div>
  );
}
