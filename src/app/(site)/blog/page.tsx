'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import type { PostCard } from '@/lib/types';

// Dados simulados ricos para o blog
const MOCK_POSTS: PostCard[] = [
  {
    id: '1', slug: 'onde-assistir-brasileirao-2026', titulo: 'Onde Assistir o Brasileirão 2026: Todos os Canais e Plataformas', resumo: 'Guia completo com todos os canais que transmitem o Campeonato Brasileiro 2026, incluindo TV aberta e streaming.', imagem_capa_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80', categoria: 'futebol', publicado_em: new Date().toISOString(), visualizacoes: 12430, tempo_leitura_min: 5, gerado_por_ia: true,
  },
  {
    id: '2', slug: 'melhores-series-netflix-julho-2026', titulo: 'As Melhores Séries da Netflix em Julho de 2026', resumo: 'Confira quais são as séries mais aclamadas que chegaram à Netflix neste mês e por que você precisa assistir.', imagem_capa_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80', categoria: 'series', publicado_em: new Date(Date.now() - 3600000).toISOString(), visualizacoes: 8720, tempo_leitura_min: 4, gerado_por_ia: true,
  },
  {
    id: '3', slug: 'onde-assistir-deadpool-wolverine', titulo: 'Onde Assistir Deadpool & Wolverine Online — Já está no Streaming?', resumo: 'Descubra em qual plataforma de streaming você pode assistir ao maior sucesso de bilheteria do Marvel.', imagem_capa_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80', categoria: 'cinema', publicado_em: new Date(Date.now() - 7200000).toISOString(), visualizacoes: 21100, tempo_leitura_min: 3, gerado_por_ia: false,
  },
  {
    id: '4', slug: 'canais-esporte-streaming-2026', titulo: 'Todos os Canais de Esporte Disponíveis no Streaming em 2026', resumo: 'De ESPN a SporTV: quais canais esportivos você pode assistir sem TV a cabo e onde encontrá-los.', imagem_capa_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80', categoria: 'canais', publicado_em: new Date(Date.now() - 14400000).toISOString(), visualizacoes: 5340, tempo_leitura_min: 6, gerado_por_ia: true,
  },
  {
    id: '5', slug: 'futebol-ao-vivo-gratis-internet', titulo: 'Como Assistir Futebol ao Vivo de Graça na Internet em 2026', resumo: 'Descubra os melhores aplicativos e sites legais para assistir futebol ao vivo sem pagar nada.', imagem_capa_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=80', categoria: 'onde-assistir', publicado_em: new Date(Date.now() - 86400000).toISOString(), visualizacoes: 34200, tempo_leitura_min: 7, gerado_por_ia: true,
  },
  {
    id: '6', slug: 'netflix-ou-prime-video-2026', titulo: 'Netflix ou Prime Video: Qual Vale Mais a Pena em 2026?', resumo: 'Comparamos preços, catálogos e funcionalidades para você decidir qual streaming assinar.', imagem_capa_url: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&auto=format&fit=crop&q=80', categoria: 'onde-assistir', publicado_em: new Date(Date.now() - 172800000).toISOString(), visualizacoes: 18900, tempo_leitura_min: 8, gerado_por_ia: false,
  },
];

const CAT_COLORS: Record<string, string> = {
  futebol: '#10B981',
  cinema: '#8B5CF6',
  series: '#3B82F6',
  canais: '#F59E0B',
  'onde-assistir': '#EF4444',
};

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = post.titulo.toLowerCase().includes(search.toLowerCase()) ||
      post.resumo.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? post.categoria === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 24px 80px', color: '#F0F0F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header da página */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>
            📰 Blog CinePlay
          </h1>
          <p style={{ color: '#A0A0B5', fontSize: 16 }}>
            Guias de streaming, lançamentos de filmes, futebol ao vivo e canais oficiais.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 20, padding: 24
        }}>
          {/* Busca por texto */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#A0A0B5' }} size={18} />
            <input
              type="text"
              placeholder="Buscar guias, partidas, canais..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12,
                background: '#07070D', border: '1px solid var(--border-subtle)',
                color: '#fff', fontSize: 14, outline: 'none'
              }}
            />
          </div>

          {/* Categorias Filtros */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: activeCategory === null ? '#E50914' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeCategory === null ? '#E50914' : 'var(--border-subtle)'}`,
                color: '#fff', transition: 'all 0.2s'
              }}
            >
              Todos os Conteúdos
            </button>
            {Object.keys(CAT_COLORS).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: activeCategory === cat ? CAT_COLORS[cat] : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeCategory === cat ? CAT_COLORS[cat] : 'var(--border-subtle)'}`,
                  color: '#fff', transition: 'all 0.2s', textTransform: 'capitalize'
                }}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Listagem de Posts */}
        {filteredPosts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filteredPosts.map(post => (
              <article key={post.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column',
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
                {/* Imagem Capa */}
                <div style={{ position: 'relative', height: 200, width: '100%' }}>
                  <img
                    src={post.imagem_capa_url}
                    alt={post.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: 16, left: 16,
                    padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: CAT_COLORS[post.categoria] || '#E50914', color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.04em'
                  }}>
                    {post.categoria}
                  </span>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#A0A0B5', marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> {post.tempo_leitura_min} min de leitura
                    </span>
                  </div>

                  <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: '#fff', lineHeight: 1.4, fontFamily: 'Outfit' }}>
                    {post.titulo}
                  </h2>
                  <p style={{ fontSize: 13, color: '#A0A0B5', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                    {post.resumo}
                  </p>

                  <Link href={`/blog/${post.slug}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none',
                    marginTop: 'auto'
                  }}>
                    Ler Artigo Completo <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: 40 }}>🔍</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12, marginBottom: 6 }}>Nenhum artigo encontrado</h3>
            <p style={{ color: '#A0A0B5', fontSize: 14 }}>Tente pesquisar por outros termos ou mudar os filtros.</p>
          </div>
        )}

      </div>
    </div>
  );
}
