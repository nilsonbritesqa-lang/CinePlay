'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PostCard } from '@/lib/types';
import { Clock, Eye } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  futebol:       { label: 'Futebol',       color: 'var(--cat-futebol)',       emoji: '⚽' },
  cinema:        { label: 'Cinema',        color: 'var(--cat-cinema)',        emoji: '🎬' },
  series:        { label: 'Séries',        color: 'var(--cat-series)',        emoji: '📺' },
  canais:        { label: 'Canais',        color: 'var(--cat-canais)',        emoji: '📡' },
  'onde-assistir': { label: 'Onde Assistir', color: 'var(--cat-onde-assistir)', emoji: '🔍' },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

interface PostCardProps {
  post: PostCard;
  featured?: boolean;
}

export function PostCardComponent({ post, featured = false }: PostCardProps) {
  const cat = CATEGORY_CONFIG[post.categoria] ?? CATEGORY_CONFIG['onde-assistir'];

  if (featured) {
    return (
      <Link href={`/${post.categoria === 'cinema' ? 'filmes' : post.categoria}/${post.slug}`} style={{ display: 'block' }}>
        <article style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: 480,
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          {/* Imagem */}
          <Image
            src={post.imagem_capa_url || '/og-default.jpg'}
            alt={post.titulo}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/* Overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.3) 60%, transparent 100%)',
          }} />

          {/* Badge ao vivo (se for futebol de hoje) */}
          <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8 }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: `${cat.color}20`,
              color: cat.color,
              border: `1px solid ${cat.color}40`,
            }}>
              {cat.emoji} {cat.label}
            </span>
            {post.gerado_por_ia && (
              <span style={{
                padding: '4px 10px', borderRadius: 6,
                fontSize: 10, fontWeight: 700,
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                letterSpacing: '0.05em',
              }}>
                ✨ IA
              </span>
            )}
          </div>

          {/* Conteúdo */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 28px' }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 10,
              lineHeight: 1.25,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              {post.titulo}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.resumo}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <span>{formatDate(post.publicado_em)}</span>
              {post.tempo_leitura_min && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {post.tempo_leitura_min} min
                </span>
              )}
              {post.visualizacoes > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={12} /> {post.visualizacoes.toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Card normal
  return (
    <Link href={`/${post.categoria === 'cinema' ? 'filmes' : post.categoria}/${post.slug}`} style={{ display: 'block' }}>
      <article className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
        {/* Thumb */}
        <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
          <Image
            src={post.imagem_capa_url || '/og-default.jpg'}
            alt={post.titulo}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            sizes="(max-width: 768px) 100vw, 350px"
          />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: `${cat.color}25`,
            color: cat.color,
            border: `1px solid ${cat.color}40`,
            backdropFilter: 'blur(8px)',
          }}>
            {cat.emoji} {cat.label}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px 18px' }}>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.titulo}
          </h3>
          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 14,
          }}>
            {post.resumo}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-disabled)' }}>
            <span>{formatDate(post.publicado_em)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {post.tempo_leitura_min && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={10} /> {post.tempo_leitura_min} min
                </span>
              )}
              {post.gerado_por_ia && <span style={{ color: 'var(--text-disabled)' }}>✨</span>}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
