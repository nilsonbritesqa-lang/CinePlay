'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight, Sparkles, Flame, User } from 'lucide-react';
import type { PostCard } from '@/lib/types';

const CAT_COLORS: Record<string, string> = {
  futebol: '#E50914',
  cinema: '#8B5CF6',
  series: '#3B82F6',
  canais: '#F59E0B',
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

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '110px 20px 80px', color: '#F0F0F5' }} className="blog-page-container">
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        
        {/* Header da página (Estilo Mockup) */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔴 BLOG DO CINEPLAY
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', margin: '4px 0 8px' }}>
            Últimas notícias do Entretenimento
          </h1>
          <p style={{ color: '#A0A0B5', fontSize: 15, margin: 0 }}>
            Filmes, séries, esportes e TV. Tudo o que você precisa saber para não perder nada.
          </p>
        </div>

        {/* Busca e Filtros (Estilo Mockup) */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16, marginBottom: 36,
          alignItems: 'center'
        }} className="blog-filter-bar">
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#A0A0B5' }} size={18} />
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 46px', borderRadius: 10,
                background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, outline: 'none'
              }}
            />
          </div>

          <div>
            <select
              value={activeCategory || ''}
              onChange={e => setActiveCategory(e.target.value || null)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              <option value="">Todas as categorias</option>
              <option value="futebol">Futebol ao vivo</option>
              <option value="cinema">Cinema</option>
              <option value="series">Séries</option>
              <option value="canais">Canais de TV</option>
              <option value="onde-assistir">Onde Assistir</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5', fontSize: 14 }}>
            Carregando matérias da redação...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div>
            {/* Card Destaque Principal (Estilo Mockup) */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
                <article style={{
                  position: 'relative', borderRadius: 24, overflow: 'hidden',
                  height: 420, border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: 32
                }}
                className="featured-post-card"
                >
                  <img
                    src={featuredPost.imagem_capa_url || '/og-default.jpg'}
                    alt={featuredPost.titulo}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.5) 60%, transparent 100%)'
                  }} />

                  <div style={{ position: 'relative', zIndex: 2, maxWidth: 780 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 900,
                        background: '#E50914', color: '#fff', textTransform: 'uppercase',
                        letterSpacing: '0.06em'
                      }}>
                        DESTAQUE
                      </span>
                      <span style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 900,
                        background: 'rgba(255,255,255,0.15)', color: '#fff', textTransform: 'uppercase',
                        letterSpacing: '0.06em', backdropFilter: 'blur(8px)'
                      }}>
                        {featuredPost.categoria.toUpperCase()}
                      </span>
                    </div>

                    <h2 style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                      fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.2
                    }}>
                      {featuredPost.titulo}
                    </h2>

                    <p style={{
                      color: '#D0D0DB', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {featuredPost.resumo}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#A0A0B5' }}>
                      <span style={{ color: '#fff', fontWeight: 700 }}>
                        Por {featuredPost.autor_nome || 'CinePlay Editorial'}
                      </span>
                      <span>•</span>
                      <span>{featuredPost.publicado_em ? new Date(featuredPost.publicado_em).toLocaleDateString('pt-BR') : '2026-07-23'}</span>
                      <span>•</span>
                      <span>{featuredPost.tempo_leitura_min || 5} min de leitura</span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Listagem de Posts Secundários (Estilo Mockup) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {secondaryPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{
                    background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    height: '100%', transition: 'transform 0.25s, border-color 0.25s'
                  }}
                  className="secondary-post-card"
                  >
                    <div style={{ position: 'relative', height: 190, width: '100%' }}>
                      <img
                        src={post.imagem_capa_url || '/og-default.jpg'}
                        alt={post.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                        background: 'rgba(229,9,20,0.85)', color: '#fff',
                        textTransform: 'uppercase', letterSpacing: '0.04em', backdropFilter: 'blur(8px)'
                      }}>
                        {post.categoria}
                      </span>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 8, color: '#fff', lineHeight: 1.35 }}>
                          {post.titulo}
                        </h3>
                        <p style={{ fontSize: 13, color: '#A0A0B5', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.resumo}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6B6B85' }}>
                        <span>Por {post.autor_nome || 'CinePlay Editorial'}</span>
                        <span>{post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : '2026-07-23'}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5' }}>
            Nenhum artigo encontrado para a busca realizada.
          </div>
        )}

      </div>
    </div>
  );
}
