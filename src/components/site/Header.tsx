'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',            label: 'Início' },
  { href: '#categorias',  label: 'Categorias' },
  { href: '/blog',        label: 'Blog' },
];

export default function LPHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(12, 12, 22, 0.82)' : 'rgba(15, 15, 28, 0.38)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.04)',
      boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.7)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68,
      }}>
        {/* Logo Premium */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', position: 'relative', zIndex: 210 }}>
          <img
            src="/logo-cineplay.png"
            alt="CinePlay Logo"
            style={{
              height: 52,
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))',
            }}
          />
        </Link>

        {/* Nav desktop - Slim */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="lp-nav-desktop">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)',
              transition: 'color 0.2s ease', textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/blog" style={{
            padding: '6px 14px', borderRadius: 8,
            background: '#E50914', color: '#fff',
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 12,
            transition: 'background 0.2s ease, transform 0.1s ease',
            textDecoration: 'none'
          }} 
          onMouseEnter={e => { e.currentTarget.style.background = '#b8070f'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#E50914'; }}
          className="lp-cta-btn">
            Acessar Blog
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lp-hamburger" style={{
            display: 'none', width: 34, height: 34, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: 'none', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: 'rgba(7,7,13,0.98)', backdropFilter: 'blur(20px)',
          padding: '12px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
            }}>
              {l.label}
            </a>
          ))}
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{
            display: 'block', marginTop: 12, padding: '10px',
            background: '#E50914', borderRadius: 8,
            color: '#fff', fontWeight: 600, textAlign: 'center', fontSize: 13,
            textDecoration: 'none'
          }}>
            Acessar Blog →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .lp-nav-desktop { display: none !important; }
          .lp-hamburger { display: flex !important; }
          .lp-cta-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
