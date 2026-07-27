'use client';

import Link from 'next/link';

const CATEGORIAS = [
  { href: '/blog?categoria=futebol', emoji: '⚽', label: 'Futebol', desc: 'Ao vivo e transmissões', color: 'var(--cat-futebol)' },
  { href: '/blog?categoria=cinema',  emoji: '🎬', label: 'Cinema',  desc: 'Estreias e filmes',      color: 'var(--cat-cinema)' },
  { href: '/blog?categoria=series',  emoji: '📺', label: 'Séries',  desc: 'Temporadas e episódios', color: 'var(--cat-series)' },
  { href: '/blog?categoria=canais',  emoji: '📡', label: 'Canais TV', desc: 'Grade e esportes ao vivo', color: 'var(--cat-canais)' },
];

export default function CategoriasGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
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
