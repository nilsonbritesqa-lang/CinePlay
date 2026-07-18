'use client';

import Link from 'next/link';
import { ArrowRight, Star, Play, Tv, Globe, MessageCircle } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

const CATEGORIAS = [
  { id: 'futebol', title: 'Futebol ao Vivo', desc: 'Brasileirão, Libertadores, Champions League, Sul-Americana e muito mais.', icon: '⚽', badge: 'Ao Vivo' },
  { id: 'filmes', title: 'Filmes', desc: 'Lançamentos, estreias e onde assistir no streaming.', icon: '🎬' },
  { id: 'series', title: 'Séries', desc: 'Novos episódios e temporadas em todas as plataformas.', icon: '📺' },
  { id: 'canais', title: 'Canais de TV', desc: 'Programação ao vivo: BBB, reality shows e eventos.', icon: '📡', badge: 'BBB 26' },
  { id: 'eventos', title: 'Eventos Especiais', desc: 'Coberturas pay-per-view, finais e shows ao vivo.', icon: '🎤' },
  { id: 'onde-assistir', title: 'Onde Assistir', desc: 'Guias práticos de streaming e canais por conteúdo.', icon: '🔍', badge: 'Novo' },
];

const PLATAFORMAS = ['Netflix', 'Prime Video', 'Disney+', 'HBO Max', 'Globoplay', 'Premiere', 'CazéTV', 'SporTV', 'Band', 'Record'];

export default function LandingPage() {
  return (
    <div style={{ background: '#07070D', color: '#F0F0F5', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* ═══════════════════════════════
          1. HERO
      ═══════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: '90px 24px 40px',
        background: 'radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.08) 0%, transparent 60%)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 32, alignItems: 'center' }} className="hero-grid">

          {/* Lado Esquerdo */}
          <div style={{ zIndex: 2 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(229, 9, 20, 0.08)', color: '#E50914',
              padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 800,
              border: '1px solid rgba(229, 9, 20, 0.2)', marginBottom: 16,
              textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Outfit'
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E50914', display: 'inline-block' }} />
              Guia Inteligente de Entretenimento
            </span>

            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.0rem, 3.8vw, 3.2rem)',
              fontWeight: 900, lineHeight: 1.1, marginBottom: 16,
              letterSpacing: '-0.02em', color: '#fff'
            }}>
              Nunca mais perca o <br />
              melhor do <span style={{ color: '#E50914' }}>entretenimento.</span>
            </h1>

            <p style={{ fontSize: '0.98rem', color: '#A0A0B5', maxWidth: 460, marginBottom: 24, lineHeight: 1.55 }}>
              Saiba exatamente onde assistir filmes, séries, futebol ao vivo e programas como BBB — 
              em qual canal, plataforma ou streaming. Simples assim.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <Link href="/blog" style={{
                background: '#E50914', color: '#fff', padding: '12px 24px',
                borderRadius: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(229, 9, 20, 0.35)', textDecoration: 'none', fontSize: 14
              }}>
                Acessar o Blog <ArrowRight size={15} />
              </Link>
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366', color: '#fff', padding: '12px 24px',
                  borderRadius: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
                  textDecoration: 'none', fontSize: 14,
                  boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
                }}
                id="cta-teste-gratis-hero"
              >
                <MessageCircle size={15} /> Solicite Teste Grátis
              </a>
            </div>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
                ].map((src, i) => (
                  <img key={i} src={src} alt="user" style={{
                    width: 30, height: 30, borderRadius: '50%', border: '2px solid #07070D',
                    marginRight: -8, objectFit: 'cover'
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#A0A0B5', marginLeft: 14 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>+10.000 pessoas</span> já acompanham
              </div>
              <div style={{ display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
              </div>
            </div>
          </div>

          {/* Lado Direito — Living Collage */}
          <div style={{ zIndex: 1 }} className="hero-visuals-container">
            <HeroShowcase />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          2. CATEGORIAS
      ═══════════════════════════════ */}
      <section id="categorias" style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              O que cobrimos <span style={{ color: '#E50914' }}>para você</span>
            </h2>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: '#A0A0B5', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
              Ver todos os artigos <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(172px, 1fr))', gap: 14 }}>
            {CATEGORIAS.map(cat => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.id}`}
                style={{
                  background: '#0F0F1A',
                  border: cat.badge ? '1.5px solid rgba(229,9,20,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 14, padding: '20px 18px',
                  position: 'relative', textDecoration: 'none', display: 'block'
                }}
                className="category-card"
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{cat.title}</h3>
                <p style={{ fontSize: 11, color: '#A0A0B5', lineHeight: 1.5 }}>{cat.desc}</p>
                {cat.badge && (
                  <span style={{
                    position: 'absolute', top: 14, right: 14,
                    fontSize: 9, fontWeight: 800, color: '#E50914',
                    background: 'rgba(229,9,20,0.1)', padding: '2px 7px',
                    borderRadius: 99, border: '1px solid rgba(229,9,20,0.25)'
                  }}>{cat.badge}</span>
                )}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          3. PLATAFORMAS (ticker)
      ═══════════════════════════════ */}
      <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 32, animation: 'ticker 18s linear infinite', whiteSpace: 'nowrap' }}>
          {[...PLATAFORMAS, ...PLATAFORMAS].map((p, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 700, color: '#404050', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          4. CTA CENTRAL — TESTE GRÁTIS
      ═══════════════════════════════ */}
      <section id="teste-gratis" style={{
        padding: '72px 24px',
        background: '#090912',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(37,211,102,0.1)', color: '#25D366',
            padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, fontFamily: 'Outfit',
            border: '1px solid rgba(37,211,102,0.25)'
          }}>
            Sem cartão de crédito · Acesso imediato
          </span>

          <h2 style={{
            fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.15
          }}>
            Quer saber onde assistir <br />
            <span style={{ color: '#E50914' }}>qualquer conteúdo?</span>
          </h2>

          <p style={{ fontSize: '1rem', color: '#A0A0B5', marginBottom: 36, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 36px' }}>
            Fale com nossa equipe no WhatsApp. Respondemos onde encontrar filmes, 
            séries, futebol ao vivo, BBB e muito mais — em segundos.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-teste-gratis-section"
              style={{
                background: '#25D366', color: '#fff', padding: '15px 32px',
                borderRadius: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 10,
                textDecoration: 'none', fontSize: 16,
                boxShadow: '0 6px 24px rgba(37,211,102,0.35)',
                fontFamily: 'Outfit'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Solicitar Teste Grátis no WhatsApp
            </a>
            <Link href="/blog" style={{
              background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '15px 28px',
              borderRadius: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontSize: 15, fontFamily: 'Outfit'
            }}>
              <Play size={15} fill="#fff" /> Ver Guias Gratuitos
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 991px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-visuals-container {
            width: 100% !important;
            margin-top: 32px;
          }
        }
        .category-card {
          transition: transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.28s;
        }
        .category-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: rgba(229,9,20,0.6) !important;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
