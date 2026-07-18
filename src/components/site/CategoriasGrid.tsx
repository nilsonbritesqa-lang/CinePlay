'use client';

import Link from 'next/link';

const CATEGORIAS = [
  { href: '/futebol',       emoji: '⚽', label: 'Futebol',       desc: 'Ao vivo e transmissões', color: 'var(--cat-futebol)' },
  { href: '/filmes',        emoji: '🎬', label: 'Filmes',        desc: 'Estreias e onde ver',    color: 'var(--cat-cinema)' },
  { href: '/series',        emoji: '📺', label: 'Séries',        desc: 'Novidades do streaming', color: 'var(--cat-series)' },
  { href: '/canais',        emoji: '📡', label: 'Canais',        desc: 'Guia completo',          color: 'var(--cat-canais)' },
  { href: '/onde-assistir', emoji: '🔍', label: 'Onde Assistir', desc: 'Encontre tudo aqui',    color: 'var(--cat-onde-assistir)' },
];

export default function CategoriasGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {CATEGORIAS.map(cat => (
        <Link
          key={cat.href}
          href={cat.href}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 16px',
            textAlign: 'center',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            display: 'block',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = cat.color;
            el.style.transform = 'translateY(-3px)';
            el.style.boxShadow = `0 8px 24px ${cat.color}20`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border-subtle)';
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.emoji}</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
            {cat.label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.desc}</div>
        </Link>
      ))}
    </div>
  );
}
