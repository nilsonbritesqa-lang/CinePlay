'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',            label: 'Início' },
  { href: '#categorias',  label: 'Categorias' },
  { href: '#recursos',    label: 'Recursos' },
  { href: '#agentes',     label: 'Agentes de IA' },
  { href: '/blog',        label: 'Blog' },
];

export default function LPHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(7,7,13,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.4s ease',
      padding: '0 0',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src="/logo-cineplay.jpeg"
            alt="CinePlay"
            width={38} height={38}
            style={{ borderRadius: 8, objectFit: 'cover' }}
          />
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #E50914 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>CinePlay</span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="lp-nav-desktop">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              padding: '7px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
              transition: 'color 0.2s', textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/blog" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 10,
            background: '#E50914', color: '#fff',
            fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13,
            boxShadow: '0 4px 16px rgba(229,9,20,0.35)',
            textDecoration: 'none'
          }} className="lp-cta-btn">
            Acessar Blog
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lp-hamburger" style={{
            display: 'none', width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: 'rgba(10,10,20,0.98)', backdropFilter: 'blur(20px)',
          padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
            }}>
              {l.label}
            </a>
          ))}
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{
            display: 'block', marginTop: 16, padding: '14px',
            background: '#E50914', borderRadius: 12,
            color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 15,
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
