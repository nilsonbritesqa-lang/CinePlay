'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Play, MessageCircle } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

const CATEGORIAS = [
  { id: 'futebol', title: 'Futebol ao Vivo', desc: 'Brasileirão, Libertadores, Champions League, Sul-Americana e muito mais.', icon: '⚽', badge: 'Ao Vivo' },
  { id: 'filmes', title: 'Filmes', desc: 'Lançamentos, estreias e onde assistir no streaming.', icon: '🎬' },
  { id: 'series', title: 'Séries', desc: 'Novos episódios e temporadas em todas as plataformas.', icon: '📺' },
  { id: 'canais', title: 'Canais de TV', desc: 'Programação ao vivo: BBB, reality shows e eventos.', icon: '📡', badge: 'BBB 26' },
  { id: 'eventos', title: 'Eventos Especiais', desc: 'Coberturas pay-per-view, finais e shows ao vivo.', icon: '🎤' },
  { id: 'onde-assistir', title: 'Onde Assistir', desc: 'Guias práticos de streaming e canais por conteúdo.', icon: '🔍', badge: 'Novo' },
];

export default function LandingPage() {
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickerData() {
      try {
        const [tmdbRes, sportsRes] = await Promise.all([
          fetch('/api/tmdb-pool').then(r => r.json()).catch(() => null),
          fetch('/api/sports-pool').then(r => r.json()).catch(() => null)
        ]);

        const list: any[] = [];

        if (sportsRes?.success && sportsRes.pool?.length) {
          sportsRes.pool.slice(0, 10).forEach((item: any) => {
            list.push({
              id: `sport-${item.id}`,
              title: item.title,
              poster: item.poster || null,
              badge: item.isLive ? '🔴 Ao Vivo' : item.league || 'Futebol',
              badgeColor: item.isLive ? '#E50914' : item.leagueColor || '#009C3B',
              type: 'sport',
              vote: item.vote,
            });
          });
        }

        if (tmdbRes?.success && tmdbRes.pool?.length) {
          tmdbRes.pool.slice(0, 40).forEach((item: any) => {
            if (item.poster) {
              list.push({
                id: `tmdb-${item.id}`,
                title: item.title,
                poster: item.poster,
                badge: item.type,
                badgeColor: item.type === 'Filme' ? '#E50914' : '#6366F1',
                type: item.type === 'Filme' ? 'movie' : 'series',
                vote: item.vote,
              });
            }
          });
        }

        if (list.length > 0) {
          setTickerItems(list.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error('Erro ao ler ticker data:', err);
      }
    }
    loadTickerData();
  }, []);
  return (
    <div style={{ 
      background: '#07070D url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.015\'/%3E%3C/svg%3E")', 
      color: '#F0F0F5', 
      overflow: 'hidden', 
      fontFamily: 'Inter, sans-serif' 
    }}>

      {/* ═══════════════════════════════
          1. HERO
      ═══════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: '110px 24px 32px',
        background: 'radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.06) 0%, transparent 60%)',
      }}>
        {/* Detalhes de luzes de fundo (glows suaves) */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: '1.05fr 1.15fr', 
          gap: 16, 
          alignItems: 'center' 
        }} className="hero-grid">

          {/* Lado Esquerdo - Tipografia Compacta */}
          <div style={{ zIndex: 2, paddingRight: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(229, 9, 20, 0.06)', color: '#E50914',
              padding: '4px 10px', borderRadius: 99, fontSize: 9, fontWeight: 800,
              border: '1px solid rgba(229, 9, 20, 0.15)', marginBottom: 12,
              textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Outfit'
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E50914', display: 'inline-block' }} />
              Guia Inteligente de Entretenimento
            </span>

            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.1rem, 4vw, 3.1rem)',
              fontWeight: 900, lineHeight: 1.05, marginBottom: 12,
              letterSpacing: '-0.03em', color: '#fff'
            }}>
              Nunca mais perca o <br />
              melhor do <span style={{ color: '#E50914' }}>entretenimento.</span>
            </h1>

            <p style={{ fontSize: '0.94rem', color: '#9090A5', maxWidth: 430, marginBottom: 20, lineHeight: 1.5 }}>
              Saiba exatamente onde assistir filmes, séries, futebol ao vivo e programas famosos como BBB — 
              em qual canal, plataforma ou streaming. Simples assim.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <Link href="/blog" style={{
                background: '#E50914', color: '#fff', padding: '10px 20px',
                borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 14px rgba(229, 9, 20, 0.3)', textDecoration: 'none', fontSize: 13,
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b8070f'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E50914'; }}
              >
                Acessar o Blog <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px 20px',
                  borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
                  textDecoration: 'none', fontSize: 13,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'background 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
                id="cta-teste-gratis-hero"
              >
                <MessageCircle size={14} /> Solicite Teste Grátis
              </a>
            </div>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
                ].map((src, i) => (
                  <img key={i} src={src} alt="user" style={{
                    width: 26, height: 26, borderRadius: '50%', border: '2px solid #07070D',
                    marginRight: -6, objectFit: 'cover'
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#9090A5', marginLeft: 10 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>+10.000 pessoas</span> já acompanham
              </div>
              <div style={{ display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
              </div>
            </div>
          </div>

          {/* Lado Direito — Colagem Dinâmica Invadindo o Texto */}
          <div style={{ zIndex: 1 }} className="hero-visuals-container">
            <HeroShowcase />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          2. CATEGORIAS
      ═══════════════════════════════ */}
      <section id="categorias" style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              O que cobrimos <span style={{ color: '#E50914' }}>para você</span>
            </h2>
            <Link href="/blog" style={{ fontSize: 12, fontWeight: 600, color: '#9090A5', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              Ver todos os artigos <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(172px, 1fr))', gap: 14 }}>
            {CATEGORIAS.map(cat => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.id}`}
                style={{
                  background: '#0a0a12 url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.008\'/%3E%3C/svg%3E")',
                  border: cat.badge ? '1.5px solid rgba(229,9,20,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 12, padding: '20px 18px',
                  position: 'relative', textDecoration: 'none', display: 'block',
                  transition: 'all 0.28s ease'
                }}
                className="category-card"
              >
                <div style={{ fontSize: 26, marginBottom: 10 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{cat.title}</h3>
                <p style={{ fontSize: 11, color: '#9090A5', lineHeight: 1.45 }}>{cat.desc}</p>
                {cat.badge && (
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    fontSize: 8, fontWeight: 800, color: '#E50914',
                    background: 'rgba(229,9,20,0.08)', padding: '2px 6px',
                    borderRadius: 99, border: '1px solid rgba(229,9,20,0.2)'
                  }}>{cat.badge}</span>
                )}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          3. TICKER VISUAL — PÔSTERES EM MOVIMENTO
      ═══════════════════════════════ */}
      <section style={{ 
        padding: '16px 0', 
        borderTop: '1px solid rgba(255,255,255,0.03)', 
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        overflow: 'hidden', 
        background: 'rgba(8,8,16,0.5)' 
      }}>
        {tickerItems.length > 0 && (
          <div className="ticker-container">
            <div className="ticker-track">
              {/* Rodada 1 */}
              <div style={{ display: 'flex', gap: 12, paddingRight: 12 }}>
                {tickerItems.map((item, idx) => (
                  <div
                    key={`t1-${item.id}-${idx}`}
                    className="ticker-poster-card"
                    style={{
                      position: 'relative',
                      width: 90,
                      height: 130,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        {item.type === 'sport' ? '⚽' : '🎬'}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                      padding: '6px 5px 5px',
                    }}>
                      <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                        {item.badge}
                      </span>
                      <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                        {item.title}
                      </span>
                      {item.vote > 0 && (
                        <span style={{ fontSize: 7, color: '#F59E0B', fontWeight: 600 }}>★ {item.vote.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Rodada 2 (duplicada para loop infinito) */}
              <div style={{ display: 'flex', gap: 12 }}>
                {tickerItems.map((item, idx) => (
                  <div
                    key={`t2-${item.id}-${idx}`}
                    className="ticker-poster-card"
                    style={{
                      position: 'relative',
                      width: 90,
                      height: 130,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        {item.type === 'sport' ? '⚽' : '🎬'}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                      padding: '6px 5px 5px',
                    }}>
                      <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                        {item.badge}
                      </span>
                      <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                        {item.title}
                      </span>
                      {item.vote > 0 && (
                        <span style={{ fontSize: 7, color: '#F59E0B', fontWeight: 600 }}>★ {item.vote.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════
          4. CTA CENTRAL — TESTE GRÁTIS
      ═══════════════════════════════ */}
      <section id="teste-gratis" style={{
        padding: '64px 24px',
        background: '#090912 url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.015\'/%3E%3C/svg%3E")',
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(229,9,20,0.08)', color: '#E50914',
            padding: '4px 12px', borderRadius: 99, fontSize: 9, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, fontFamily: 'Outfit',
            border: '1px solid rgba(229,9,20,0.18)'
          }}>
            Sem cartão de crédito · Acesso imediato
          </span>

          <h2 style={{
            fontFamily: 'Outfit', fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)',
            fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.02em'
          }}>
            Quer saber onde assistir <br />
            <span style={{ color: '#E50914' }}>qualquer conteúdo?</span>
          </h2>

          <p style={{ fontSize: '0.94rem', color: '#9090A5', marginBottom: 28, lineHeight: 1.5, maxWidth: 480, margin: '0 auto 28px' }}>
            Fale com nossa equipe no WhatsApp. Respondemos onde encontrar filmes, 
            séries, futebol ao vivo, BBB e muito mais — em segundos.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-teste-gratis-section"
              style={{
                background: '#E50914', color: '#fff', padding: '12px 28px',
                borderRadius: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
                textDecoration: 'none', fontSize: 14,
                boxShadow: '0 4px 18px rgba(229, 9, 20, 0.35)',
                fontFamily: 'Outfit',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b8070f'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E50914'; }}
            >
              <MessageCircle size={15} />
              Solicitar Teste Grátis no WhatsApp
            </a>
            <Link href="/blog" style={{
              background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '12px 24px',
              borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
              border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', fontSize: 14, fontFamily: 'Outfit',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <Play size={14} fill="#fff" /> Ver Guias Gratuitos
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-visuals-container {
          margin-left: -110px !important;
          width: calc(100% + 110px) !important;
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 32px !important;
          }
          .hero-visuals-container {
            width: 100% !important;
            margin-left: 0 !important;
            margin-top: 16px;
          }
          .hero-grid > div:first-child {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        .category-card {
          transition: transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.28s;
        }
        .category-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(229,9,20,0.5) !important;
        }
        
        .ticker-container {
          overflow: hidden;
          width: 100%;
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerAnimation 80s linear infinite;
        }
        .ticker-container:hover .ticker-track {
          animation-play-state: paused !important;
        }
        .ticker-poster-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .ticker-poster-card:hover {
          transform: translateY(-6px) scale(1.08);
          border-color: rgba(229, 9, 20, 0.5) !important;
          box-shadow: 0 12px 30px rgba(229, 9, 20, 0.2), 0 8px 20px rgba(0,0,0,0.5);
          z-index: 10;
        }
        @keyframes tickerAnimation {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
