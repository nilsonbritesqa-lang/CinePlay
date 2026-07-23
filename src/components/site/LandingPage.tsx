'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Play, MessageCircle, ChevronDown, ChevronUp, Zap, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

const CATEGORIAS = [
  { id: 'futebol', title: 'Futebol ao Vivo', desc: 'Brasileirão, Libertadores, Champions League, Sul-Americana e muito mais.', icon: '⚽', badge: 'Ao Vivo' },
  { id: 'filmes', title: 'Filmes', desc: 'Lançamentos, estreias e onde assistir no streaming.', icon: '🎬' },
  { id: 'series', title: 'Séries', desc: 'Novos episódios e temporadas em todas as plataformas.', icon: '📺' },
  { id: 'canais', title: 'Canais de TV', desc: 'Programação ao vivo: BBB, reality shows e eventos.', icon: '📡', badge: 'BBB 26' },
  { id: 'eventos', title: 'Eventos Especiais', desc: 'Coberturas pay-per-view, finais e shows ao vivo.', icon: '🎤' },
  { id: 'onde-assistir', title: 'Onde Assistir', desc: 'Guias práticos de streaming e canais por conteúdo.', icon: '🔍', badge: 'Novo' },
];

const MOVIE_SHOWCASE_ITEMS = [
  {
    id: 1,
    title: 'Duna: Parte 2',
    category: '🎬 Destaque do Cinema',
    type: 'Filme',
    rating: 8.8,
    synopsis: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Diante de uma escolha entre o amor de sua vida e o destino do universo, ele luta para evitar um futuro terrível que só ele pode prever.',
    image: 'https://image.tmdb.org/t/p/w780/8Z8dHFw7JVhXPSmx0yg2mtGEyeb.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/c7D6n1clBL6Vo44x2Uo599026T.jpg',
  },
  {
    id: 2,
    title: 'House of the Dragon (A Casa do Dragão)',
    category: '📺 Novidade nas Séries',
    type: 'Série',
    rating: 9.1,
    synopsis: 'A história da Casa Targaryen 200 anos antes dos eventos de Game of Thrones. A Dança dos Dragões começa quando os Verdes e os Pretos travam uma sangrenta guerra civil pelo Trono de Ferro de Westeros.',
    image: 'https://image.tmdb.org/t/p/w780/5PN1vU2hDYO9MNJK8g5n24J6LVw.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/t9X7imfv64es3496nQ3KyIFnN5Y.jpg',
  },
  {
    id: 3,
    title: 'The Last of Us: 2ª Temporada',
    category: '🔥 Em Alta no Streaming',
    type: 'Série',
    rating: 9.2,
    synopsis: 'Cinco anos após os eventos traumáticos da primeira temporada, Joel e Ellie tentam reconstruir suas vidas em Jackson. No entanto, o passado retorna implacável, desencadeando uma jornada de vingança e sobrevivência.',
    image: 'https://image.tmdb.org/t/p/w780/2rezQWg73XFWuKE5eZIBwJ7CBca.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/u3bZ62I4rj75XyH2h45a60xa4iO.jpg',
  },
  {
    id: 4,
    title: 'Oppenheimer',
    category: '🏆 Vencedor do Oscar',
    type: 'Filme',
    rating: 8.9,
    synopsis: 'A história do físico americano J. Robert Oppenheimer, seu papel no Projeto Manhattan durante a Segunda Guerra Mundial e o desenvolvimento da bomba atômica que mudou o curso da humanidade para sempre.',
    image: 'https://image.tmdb.org/t/p/w780/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  }
];

export default function LandingPage() {
  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [sportsMatches, setSportsMatches] = useState<any[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<any>(null);

  // Navegação de Datas no Calendário Esportivo
  const [selectedDateOffset, setSelectedDateOffset] = useState(0); // 0 = Hoje, 1 = Amanhã, -1 = Ontem...
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Controle de sanfona (accordion) dos campeonatos
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});

  // Notícias/Posteres de Filmes e Séries passando com tempo suficiente (12s) e pausa no hover
  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const toggleLeague = (leagueName: string) => {
    setExpandedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  // Rotação suave a cada 12 segundos (pausa se o usuário estiver com o mouse em cima)
  useEffect(() => {
    if (isBannerHovered) return;
    const showcaseInterval = setInterval(() => {
      setCurrentShowcaseIdx(prev => (prev + 1) % MOVIE_SHOWCASE_ITEMS.length);
    }, 12000);
    return () => clearInterval(showcaseInterval);
  }, [isBannerHovered]);

  // Precarregamento instantâneo de todas as imagens de backdrop e pôster em cache
  useEffect(() => {
    MOVIE_SHOWCASE_ITEMS.forEach(item => {
      const img1 = new Image();
      img1.src = item.image;
      const img2 = new Image();
      img2.src = item.poster;
    });
  }, []);

  // Calcula lista de dias para navegação
  const getDateOptions = () => {
    const options = [];
    const now = new Date();
    for (let offset = -1; offset <= 4; offset++) {
      const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
      const isoDate = d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
      
      let label = d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' });
      let dayName = d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'short' }).replace('.', '');
      
      if (offset === 0) { dayName = 'Hoje'; }
      else if (offset === 1) { dayName = 'Amanhã'; }
      else if (offset === -1) { dayName = 'Ontem'; }

      options.push({ offset, isoDate, label, dayName });
    }
    return options;
  };

  const dateOptions = getDateOptions();
  const selectedDateObj = dateOptions.find(o => o.offset === selectedDateOffset) || dateOptions[1];

  // Carrega dados dinâmicos da API
  useEffect(() => {
    async function loadSportsData() {
      setLoadingMatches(true);
      try {
        const url = `/api/sports-pool?date=${selectedDateObj.isoDate}`;
        const sportsRes = await fetch(url).then(r => r.json()).catch(() => null);

        if (sportsRes?.success && sportsRes.pool?.length) {
          setSportsMatches(sportsRes.pool);
          
          // Expande os 3 primeiros campeonatos por padrão
          const initialExpanded: Record<string, boolean> = {};
          sportsRes.pool.forEach((match: any, index: number) => {
            const league = match.league || 'Futebol';
            if (index < 3) initialExpanded[league] = true;
          });
          setExpandedLeagues(initialExpanded);
        } else {
          setSportsMatches([]);
        }
      } catch (e) {
        console.error("Erro ao buscar esportes por data:", e);
      } finally {
        setLoadingMatches(false);
      }
    }
    loadSportsData();
  }, [selectedDateOffset]);

  useEffect(() => {
    async function loadData() {
      try {
        const [tmdbRes, configRes] = await Promise.all([
          fetch('/api/tmdb-pool').then(r => r.json()).catch(() => null),
          fetch('/api/chatbot-config').then(r => r.json()).catch(() => null)
        ]);

        if (configRes) {
          setWhatsappConfig(configRes);
        }

        const list: any[] = [];

        if (tmdbRes?.success && tmdbRes.pool?.length) {
          tmdbRes.pool.forEach((item: any) => {
            if (item.poster) {
              list.push({
                id: `tmdb-${item.id}`,
                title: item.title,
                poster: item.poster,
                badge: item.type,
                badgeColor: item.type === 'Filme' ? '#E50914' : '#6366F1',
                type: 'movie',
                vote: item.vote,
              });
            }
          });
        }

        if (list.length > 0) {
          setTickerItems(list.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error('Erro ao carregar dados da LandingPage:', err);
      }
    }
    loadData();
  }, []);

  const getMatchWhatsappUrl = (matchTitle: string) => {
    const num = whatsappConfig?.whatsapp_numero || '5511999999999';
    const baseMsg = whatsappConfig?.whatsapp_mensagem || 'Olá! Vim pelo CinePlay e quero saber mais sobre como assistir conteúdo.';
    const text = `${baseMsg} Quero saber como assistir ao jogo: ${matchTitle}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const getMovieWhatsappUrl = (title: string) => {
    const num = whatsappConfig?.whatsapp_numero || '5511999999999';
    const text = `Olá! Quero saber onde assistir o título: ${title}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  // Agrupa os jogos por Campeonato
  const groupedMatches = sportsMatches.reduce((acc: Record<string, any[]>, match) => {
    const league = match.league || 'Outros Campeonatos';
    if (!acc[league]) acc[league] = [];
    acc[league].push(match);
    return acc;
  }, {});

  return (
    <div style={{ 
      background: '#07070D url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.015\'/%3E%3C/svg%3E")', 
      color: '#F0F0F5', 
      overflow: 'hidden', 
      fontFamily: 'Inter, sans-serif' 
    }}>

      {/* Precarregador invisível de imagens para garantia de carregamento instantâneo */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {MOVIE_SHOWCASE_ITEMS.map((item) => (
          <div key={`preload-${item.id}`}>
            <img src={item.image} alt="" />
            <img src={item.poster} alt="" />
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════
          1. HERO
      ═══════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: '110px 24px 32px',
        background: 'radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.06) 0%, transparent 60%)',
      }}>
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
                href={whatsappConfig?.whatsapp_numero ? `https://wa.me/${whatsappConfig.whatsapp_numero}?text=${encodeURIComponent(whatsappConfig.whatsapp_mensagem || 'Olá! Quero solicitar um teste gratuito do CinePlay.')}` : 'https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay.'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px 20px',
                  borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
                  textDecoration: 'none', fontSize: 13,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'background 0.2s ease, border-color 0.2s ease'
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

          {/* Lado Direito — Banner com Filmes e Séries */}
          <div style={{ zIndex: 1 }} className="hero-visuals-container">
            <HeroShowcase />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          2. SEÇÃO DUPLA: CATEGORIAS + SHOWCASE DE FILMES COMPLETO (ESQUERDA) + AGENDA ESPORTIVA (DIREITA)
      ═══════════════════════════════ */}
      <section id="categorias-e-jogos" style={{
        padding: '56px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'linear-gradient(to bottom, rgba(12,12,24,0.6) 0%, rgba(7,7,13,0.95) 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.9fr',
            gap: 32,
            alignItems: 'stretch'
          }} className="main-content-grid">

            {/* COLUNA ESQUERDA: CATEGORIAS + SHOWCASE COM SINOPSE GRANDE NO TOPO E PÔSTER INTEIRO NO RODAPÉ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
              <div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(229,9,20,0.08)', color: '#E50914',
                    padding: '3px 9px', borderRadius: 99, fontSize: 9, fontWeight: 800,
                    border: '1px solid rgba(229,9,20,0.18)', marginBottom: 6,
                    textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Outfit'
                  }}>
                    Explore por Categoria
                  </span>
                  <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                    O que cobrimos <span style={{ color: '#E50914' }}>para você</span>
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {CATEGORIAS.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/blog?categoria=${cat.id}`}
                      style={{
                        background: '#0a0a12 url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.008\'/%3E%3C/svg%3E")',
                        border: cat.badge ? '1.5px solid rgba(229,9,20,0.3)' : '1px solid rgba(255,255,255,0.04)',
                        borderRadius: 12, padding: '14px 12px',
                        position: 'relative', textDecoration: 'none', display: 'block',
                        transition: 'all 0.28s ease'
                      }}
                      className="category-card"
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
                      <h3 style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{cat.title}</h3>
                      <p style={{ fontSize: 9.5, color: '#9090A5', lineHeight: 1.3, margin: 0 }}>{cat.desc}</p>
                      {cat.badge && (
                        <span style={{
                          position: 'absolute', top: 6, right: 6,
                          fontSize: 7, fontWeight: 800, color: '#E50914',
                          background: 'rgba(229,9,20,0.08)', padding: '1px 5px',
                          borderRadius: 99, border: '1px solid rgba(229,9,20,0.2)'
                        }}>{cat.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* SHOWCASE EXPANDIDO DE FILMES E SÉRIES COM LAYOUT VERTICAL OTIMIZADO */}
              <div
                onMouseEnter={() => setIsBannerHovered(true)}
                onMouseLeave={() => setIsBannerHovered(false)}
                style={{
                  flex: 1,
                  minHeight: 480,
                  position: 'relative',
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#090914',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                className="full-movie-showcase-banner"
              >
                {/* BACKDROP EM CAMADAS COM TRANSIÇÃO SUAVE */}
                {MOVIE_SHOWCASE_ITEMS.map((item, idx) => {
                  const isActive = idx === currentShowcaseIdx;
                  return (
                    <div
                      key={`bg-layer-${item.id}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.9s ease-in-out',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    >
                      <img
                        src={item.image}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=780&q=80';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 20%',
                          filter: 'brightness(0.4) saturate(1.2)',
                        }}
                      />
                    </div>
                  );
                })}

                {/* Overlays Gradientes Cinematográficos */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(7,7,13,0.85) 0%, rgba(7,7,13,0.65) 50%, rgba(7,7,13,0.95) 100%)',
                  zIndex: 1
                }} />

                {/* CONTEÚDO: TÍTULO + SINOPSE AMPLA NO TOPO / PÔSTER SEM CORTE + CTA "ONDE ASSISTIR?" NO RODAPÉ */}
                {MOVIE_SHOWCASE_ITEMS.map((item, idx) => {
                  const isActive = idx === currentShowcaseIdx;
                  if (!isActive) return null;

                  return (
                    <div
                      key={`content-showcase-${item.id}`}
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        padding: '24px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        gap: 16,
                        animation: 'fadeIn 0.5s ease'
                      }}
                    >
                      {/* PARTE SUPERIOR: BADGES + NAVEGAÇÃO + TÍTULO GRANDE + SINOPSE MAIOR */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Header Badges + Controles < > */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                              color: '#E50914', background: 'rgba(229,9,20,0.18)', padding: '5px 12px', borderRadius: 99,
                              border: '1px solid rgba(229,9,20,0.35)', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.06em'
                            }}>
                              {item.category}
                            </span>
                            <span style={{
                              fontSize: 10, fontWeight: 800, color: '#F59E0B', background: 'rgba(245,158,11,0.15)',
                              padding: '5px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4
                            }}>
                              <Star size={12} fill="#F59E0B" color="#F59E0B" /> {item.rating} / 10
                            </span>
                          </div>

                          {/* Botões de Navegação < > */}
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => setCurrentShowcaseIdx(prev => (prev - 1 + MOVIE_SHOWCASE_ITEMS.length) % MOVIE_SHOWCASE_ITEMS.length)}
                              aria-label="Anterior"
                              style={{
                                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                                borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                              }}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              onClick={() => setCurrentShowcaseIdx(prev => (prev + 1) % MOVIE_SHOWCASE_ITEMS.length)}
                              aria-label="Próximo"
                              style={{
                                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                                borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                              }}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Título Principal */}
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.65rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                          {item.title}
                        </h3>

                        {/* BLOCO DE SINOPSE EXPANDIDO OCUPANDO ÁREA MAIOR */}
                        <div style={{
                          background: 'rgba(7,7,13,0.75)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                          padding: '14px 18px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <Info size={13} color="#E50914" /> Sinopse Oficial do Conteúdo:
                          </span>
                          <p style={{ fontSize: '0.94rem', color: '#E0E0F5', margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
                            {item.synopsis}
                          </p>
                        </div>
                      </div>

                      {/* PARTE INFERIOR: PÔSTER INTEIRO SEM CORTES (ABAIXO DO TEXTO) + CTA "ONDE ASSISTIR?" */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: 16,
                        flexWrap: 'wrap'
                      }}>
                        {/* Pôster Oficial Inteiro (Completamente Exibido sem Cortes) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <img
                            src={item.poster}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80';
                            }}
                            style={{
                              height: 125,
                              width: 'auto',
                              maxHeight: 130,
                              borderRadius: 10,
                              objectFit: 'contain',
                              background: '#07070D',
                              border: '1.5px solid rgba(255,255,255,0.2)',
                              boxShadow: '0 8px 22px rgba(0,0,0,0.85)',
                              flexShrink: 0
                            }}
                          />
                          <div>
                            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: '#9090A5', letterSpacing: '0.06em', display: 'block', marginBottom: 2 }}>
                              {item.type}
                            </span>
                            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 4px 0', fontFamily: 'Outfit' }}>
                              {item.title}
                            </h4>
                            <span style={{ fontSize: 11, color: '#25D366', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366' }} /> Guia Disponível no WhatsApp
                            </span>
                          </div>
                        </div>

                        {/* CTA "Onde Assistir?" direcionando ao WhatsApp + Indicadores Dots */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                          <a
                            href={getMovieWhatsappUrl(item.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#25D366',
                              color: '#fff',
                              padding: '12px 24px',
                              borderRadius: 10,
                              fontWeight: 800,
                              fontSize: 13,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              textDecoration: 'none',
                              boxShadow: '0 4px 18px rgba(37, 211, 102, 0.4)',
                              fontFamily: 'Outfit, sans-serif',
                              transition: 'transform 0.2s ease, background 0.2s ease'
                            }}
                            className="onde-assistir-btn"
                          >
                            <MessageCircle size={16} />
                            Onde Assistir?
                          </a>

                          {/* Dots */}
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {MOVIE_SHOWCASE_ITEMS.map((_, i) => (
                              <span
                                key={i}
                                onClick={() => setCurrentShowcaseIdx(i)}
                                style={{
                                  width: i === currentShowcaseIdx ? 22 : 6,
                                  height: 6,
                                  borderRadius: 99,
                                  background: i === currentShowcaseIdx ? '#E50914' : 'rgba(255,255,255,0.25)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* COLUNA DIREITA: COLUNA SLIM DA AGENDA ESPORTIVA COM NAVEGAÇÃO DE DATAS */}
            <div style={{
              background: '#090914',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '20px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }} className="slim-sports-column">
              
              {/* Header da Agenda com Navegador de Datas */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      color: '#25D366', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em'
                    }}>
                      <Zap size={10} /> Agenda de Transmissões (BR - SP)
                    </span>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                      Calendário de Jogos
                    </h3>
                  </div>
                  <span style={{ fontSize: 10, color: '#25D366', background: 'rgba(37,211,102,0.1)', padding: '4px 8px', borderRadius: 6, fontWeight: 800 }}>
                    {selectedDateObj.dayName} ({selectedDateObj.label})
                  </span>
                </div>

                {/* BARRA DE NAVEGAÇÃO ENTRE DATAS (Ontem / Hoje / Amanhã / Próximos) */}
                <div style={{
                  display: 'flex',
                  gap: 6,
                  overflowX: 'auto',
                  paddingBottom: 4,
                  scrollbarWidth: 'none',
                }}>
                  {dateOptions.map((opt) => {
                    const isSelected = opt.offset === selectedDateOffset;
                    return (
                      <button
                        key={opt.isoDate}
                        onClick={() => setSelectedDateOffset(opt.offset)}
                        style={{
                          background: isSelected ? '#25D366' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#000' : '#A0A0B5',
                          border: isSelected ? '1px solid #25D366' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 10,
                          fontWeight: isSelected ? 900 : 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      >
                        {opt.dayName} <span style={{ opacity: 0.8, fontSize: 9 }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {loadingMatches ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#9090A5', fontSize: 12 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(37,211,102,0.2)', borderTopColor: '#25D366', display: 'inline-block', animation: 'spin 0.8s linear infinite', marginRight: 8 }} />
                  Buscando transmissões para {selectedDateObj.dayName}...
                </div>
              ) : sportsMatches.length === 0 ? (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: '#9090A5', fontSize: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                  Sem partidas confirmadas para esta data. <br /> Use a barra acima para ver outros dias!
                </div>
              ) : (
                /* Lista de Campeonatos com Escudos Oficiais de Cada Liga */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(groupedMatches).map(([leagueName, matches]) => {
                    const isExpanded = expandedLeagues[leagueName] ?? false;
                    const sampleMatch = matches[0];
                    const flag = sampleMatch?.leagueFlag || '⚽';
                    const leagueColor = sampleMatch?.leagueColor || '#009C3B';
                    const leagueLogo = sampleMatch?.leagueLogo || 'https://media.api-sports.io/football/leagues/71.png';

                    return (
                      <div
                        key={leagueName}
                        style={{
                          background: '#0B0B18',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Header do Campeonato COM ESCUDO OFICIAL DO CAMPEONATO */}
                        <button
                          onClick={() => toggleLeague(leagueName)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            color: '#fff',
                            outline: 'none',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* ESCUDO / LOGO OFICIAL DO CAMPEONATO */}
                            <img
                              src={leagueLogo}
                              alt=""
                              onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg'; }}
                              style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
                              {leagueName}
                            </span>
                            <span style={{
                              fontSize: 8, fontWeight: 800, color: leagueColor,
                              background: `${leagueColor}18`, padding: '1px 6px', borderRadius: 99
                            }}>
                              {matches.length}
                            </span>
                          </div>
                          <div style={{ color: '#65657B', display: 'flex', alignItems: 'center' }}>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </button>

                        {/* Jogos Retráteis Slim */}
                        {isExpanded && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {matches.map((match) => (
                              <div
                                key={match.id}
                                style={{
                                  padding: '8px 12px',
                                  borderTop: '1px solid rgba(255,255,255,0.04)',
                                  background: match.isLive ? 'rgba(229,9,20,0.05)' : 'transparent',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 6
                                }}
                              >
                                {/* Status e Horário */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{
                                    fontSize: 9, fontWeight: 800,
                                    color: match.isLive ? '#E50914' : '#25D366',
                                    display: 'inline-flex', alignItems: 'center', gap: 4
                                  }}>
                                    {match.isLive && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E50914', animation: 'spin 1s ease infinite' }} />}
                                    {match.overlay_badge || match.label || 'AGENDADO'}
                                  </span>
                                  <span style={{ fontSize: 8, color: '#65657B' }}>
                                    {match.subtitle?.split(' - ')[1] || 'Rodada'}
                                  </span>
                                </div>

                                {/* Confronto com Escudos dos Times Garantidos */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0' }}>
                                  {/* Mandante */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '42%' }}>
                                    <img
                                      src={match.homeTeam?.logo || ''}
                                      alt=""
                                      onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg'; }}
                                      style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                                    />
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {match.homeTeam?.name}
                                    </span>
                                  </div>

                                  {/* Placar ou VS */}
                                  <span style={{ fontSize: 10, fontWeight: 900, color: match.isLive ? '#E50914' : '#65657B', padding: '0 4px' }}>
                                    {match.live_score || 'VS'}
                                  </span>

                                  {/* Visitante */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', width: '42%' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {match.awayTeam?.name}
                                    </span>
                                    <img
                                      src={match.awayTeam?.logo || ''}
                                      alt=""
                                      onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg'; }}
                                      style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                                    />
                                  </div>
                                </div>

                                {/* Botão "Saiba como Assistir" -> Redireciona ao WhatsApp */}
                                <a
                                  href={getMatchWhatsappUrl(match.title)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#25D366',
                                    color: '#fff',
                                    padding: '6px 8px',
                                    borderRadius: 6,
                                    fontWeight: 800,
                                    fontSize: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 6px rgba(37, 211, 102, 0.2)',
                                    marginTop: 2,
                                    transition: 'transform 0.15s ease, background 0.15s ease'
                                  }}
                                  className="saiba-como-assistir-btn"
                                >
                                  <MessageCircle size={11} />
                                  Saiba como Assistir
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          3. TICKER VISUAL — PÔSTERES EM MOVIMENTO
      ═══════════════════════════════ */}
      <section style={{ 
        padding: '24px 0', 
        borderTop: '1px solid rgba(255,255,255,0.03)', 
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        overflow: 'hidden', 
        background: 'rgba(8,8,16,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {tickerItems.length > 0 && (
          <>
            {/* Esteira 1: Roda para a Esquerda */}
            <div className="ticker-container">
              <div className="ticker-track">
                {/* Rodada 1 */}
                <div style={{ display: 'flex', gap: 12, paddingRight: 12 }}>
                  {tickerItems.slice(0, Math.floor(tickerItems.length / 2)).map((item, idx) => {
                    return (
                      <div
                        key={`t1-a-${item.id}-${idx}`}
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
                          background: '#07070D',
                        }}
                      >
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, transparent 100%)',
                          padding: '6px 5px 5px',
                          zIndex: 3,
                        }}>
                          <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                            {item.badge}
                          </span>
                          <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Rodada 2 */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {tickerItems.slice(0, Math.floor(tickerItems.length / 2)).map((item, idx) => {
                    return (
                      <div
                        key={`t1-b-${item.id}-${idx}`}
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
                          background: '#07070D',
                        }}
                      >
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, transparent 100%)',
                          padding: '6px 5px 5px',
                          zIndex: 3,
                        }}>
                          <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                            {item.badge}
                          </span>
                          <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Esteira 2: Roda para a Direita */}
            <div className="ticker-container">
              <div className="ticker-track-reverse">
                {/* Rodada 1 */}
                <div style={{ display: 'flex', gap: 12, paddingRight: 12 }}>
                  {tickerItems.slice(Math.floor(tickerItems.length / 2)).map((item, idx) => {
                    return (
                      <div
                        key={`t2-a-${item.id}-${idx}`}
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
                          background: '#07070D',
                        }}
                      >
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, transparent 100%)',
                          padding: '6px 5px 5px',
                          zIndex: 3,
                        }}>
                          <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                            {item.badge}
                          </span>
                          <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Rodada 2 */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {tickerItems.slice(Math.floor(tickerItems.length / 2)).map((item, idx) => {
                    return (
                      <div
                        key={`t2-b-${item.id}-${idx}`}
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
                          background: '#07070D',
                        }}
                      >
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, transparent 100%)',
                          padding: '6px 5px 5px',
                          zIndex: 3,
                        }}>
                          <span style={{ display: 'block', fontSize: 6, fontWeight: 800, textTransform: 'uppercase', color: item.badgeColor || '#E50914', letterSpacing: '0.04em', marginBottom: 1 }}>
                            {item.badge}
                          </span>
                          <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
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
              href={whatsappConfig?.whatsapp_numero ? `https://wa.me/${whatsappConfig.whatsapp_numero}?text=${encodeURIComponent(whatsappConfig.whatsapp_mensagem || 'Olá! Quero solicitar um teste gratuito do CinePlay.')}` : 'https://wa.me/5511999999999?text=Olá!%20Quero%20solicitar%20um%20teste%20gratuito%20do%20CinePlay.'}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
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
          .main-content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .full-movie-showcase-banner {
            min-height: 400px !important;
          }
        }
        .category-card {
          transition: transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.28s;
        }
        .category-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(229,9,20,0.5) !important;
        }
        .saiba-como-assistir-btn:hover {
          transform: scale(1.03);
          background: #20ba59 !important;
        }
        .onde-assistir-btn:hover {
          transform: translateY(-2px) scale(1.02);
          background: #20ba59 !important;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45) !important;
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
        .ticker-track-reverse {
          display: flex;
          width: max-content;
          animation: tickerAnimationReverse 80s linear infinite;
        }
        .ticker-container:hover .ticker-track,
        .ticker-container:hover .ticker-track-reverse {
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
        @keyframes tickerAnimationReverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </div>
  );
}
