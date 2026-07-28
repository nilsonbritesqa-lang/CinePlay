'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, Film } from 'lucide-react';

export default function LPHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('https://wa.me/5511999998888?text=Olá!%20Gostaria%20de%20saber%20como%20assistir%20no%20CinePlay');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/ctas')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.patrocinadores?.length > 0) {
          const firstCta = data.patrocinadores[0]?.ctas?.[0];
          if (firstCta?.url_destino) {
            setWhatsappUrl(firstCta.url_destino);
          }
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/trailers', label: 'Galeria HD' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(12, 12, 22, 0.92)' : 'rgba(15, 15, 28, 0.65)',
      backdropFilter: 'blur(16px)',
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
              height: 50,
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))',
            }}
          />
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="lp-nav-desktop">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
              transition: 'color 0.2s ease', textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              {l.label}
            </Link>
          ))}

          {/* Botão Saiba Como Assistir no WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, background: 'rgba(37,211,102,0.15)',
              border: '1px solid rgba(37,211,102,0.4)', color: '#25D366',
              fontSize: 12, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s'
            }}
          >
            <MessageCircle size={14} /> Saiba Como Assistir
          </a>
        </nav>

        {/* CTA Blog + Mobile Menu */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/blog" style={{
            padding: '7px 16px', borderRadius: 8,
            background: '#E50914', color: '#fff',
            fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 12,
            transition: 'background 0.2s ease, transform 0.1s ease',
            textDecoration: 'none'
          }} 
          onMouseEnter={e => { e.currentTarget.style.background = '#b8070f'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#E50914'; }}
          className="lp-cta-btn">
            Acessar Blog
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lp-hamburger" style={{
            display: 'none', width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: 'rgba(7,7,13,0.98)', backdropFilter: 'blur(20px)',
          padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 14, padding: '12px', borderRadius: 8,
              background: '#25D366', color: '#fff', fontWeight: 800,
              fontSize: 14, textDecoration: 'none'
            }}
          >
            <MessageCircle size={18} /> Saiba Como Assistir
          </a>

          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{
            display: 'block', marginTop: 10, padding: '12px',
            background: '#E50914', borderRadius: 8,
            color: '#fff', fontWeight: 800, textAlign: 'center', fontSize: 14,
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
