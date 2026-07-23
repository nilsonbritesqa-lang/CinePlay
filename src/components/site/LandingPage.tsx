'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroShowcase from './HeroShowcase';
import MatchDetailsModal from './MatchDetailsModal';
import {
  Calendar, Flame, Sparkles, ChevronRight, Play, ExternalLink, ShieldAlert, Zap,
  CheckCircle2, ArrowRight, MessageCircle, Volume2, Star, Clock, Trophy, ChevronDown, ChevronUp
} from 'lucide-react';

interface MatchItem {
  id: string;
  campeonato: string;
  escudo_campeonato?: string;
  time1: string;
  escudo1?: string;
  time2: string;
  escudo2?: string;
  horario: string;
  data: string;
  onde_assistir: string[];
  destaque: boolean;
  live?: boolean;
}

const CATEGORIAS = [
  { id: 'futebol', title: 'Futebol ao Vivo', desc: 'Brasileirão, Libertadores, Champions League, Sul-Americana e muito mais.', icon: '⚽', badge: 'Ao Vivo' },
  { id: 'cinema', title: 'Filmes', desc: 'Lançamentos, estrelas e onde assistir em cada streaming.', icon: '🎬' },
  { id: 'series', title: 'Séries', desc: 'Novos episódios e temporadas em todas as plataformas.', icon: '📺' },
  { id: 'canais', title: 'Canais de TV', desc: 'Programação ao vivo: BBB, realitys e grandes coberturas.', icon: '📡' },
  { id: 'especiais', title: 'Eventos Especiais', desc: 'Coberturas pay-per-view, finais e shows ao vivo.', icon: '🎤' },
  { id: 'onde-assistir', title: 'Onde Assistir', desc: 'Guias práticos de streaming e canais oficiais.', icon: '🔍' },
];

export default function LandingPage() {
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);
  const [openLeagues, setOpenLeagues] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [showAllLeagues, setShowAllLeagues] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [movieItems, setMovieItems] = useState<any[]>([
    {
      id: 'm1',
      title: 'Star Wars: O Mandaloriano e Grogu',
      category: '🎬 Filme em Destaque',
      type: 'Filme',
      rating: 9.4,
      synopsis: 'O maligno Império caiu e os senhores da guerra Imperiais ainda estão espalhados pela galáxia. Enquanto a jovem Nova República luta para proteger tudo pelo que a Rebelião batalhou, ela conta com a ajuda do caçador de recompensas Mandaloriano e Grogu.',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    }
  ]);

  const [seriesItems, setSeriesItems] = useState<any[]>([
    {
      id: 's1',
      title: 'Unidade de Elite GIGN',
      category: '📺 Série em Alta no Streaming',
      type: 'Série',
      rating: 9.1,
      synopsis: 'Depois de um ataque sem precedentes que destrói sua unidade, um oficial prestes a se aposentar precisa liderar uma equipe de novatos para derrubar uma conspiração internacional antes que seja tarde demais.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    }
  ]);

  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [currentMovieIdx, setCurrentMovieIdx] = useState(0);
  const [currentSeriesIdx, setCurrentSeriesIdx] = useState(0);
  const [isMovieHovered, setIsMovieHovered] = useState(false);
  const [isSeriesHovered, setIsSeriesHovered] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState<any>(null);

  // Carrega jogos reais da API Sports Pool
  useEffect(() => {
    async function fetchSports() {
      setLoadingMatches(true);
      try {
        const res = await fetch(`/api/sports-pool?dateOffset=${selectedDateOffset}`);
        const data = await res.json();
        if (data.success && data.matches) {
          setMatches(data.matches);
        }
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
      } finally {
        setLoadingMatches(false);
      }
    }
    fetchSports();
  }, [selectedDateOffset]);

  // Carrega TMDB Pool e WhatsApp Config
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

        if (tmdbRes?.success && tmdbRes.pool?.length) {
          const validPool = tmdbRes.pool.filter((item: any) => item.poster && item.backdrop && item.synopsis && item.synopsis.length > 20);

          const movies = validPool
            .filter((item: any) => item.type === 'Filme')
            .slice(0, 8)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              category: '🎬 Filme em Destaque',
              type: 'Filme',
              rating: item.vote || 8.5,
              synopsis: item.synopsis,
              image: item.backdrop,
              poster: item.poster
            }));

          const series = validPool
            .filter((item: any) => item.type === 'Série')
            .slice(0, 8)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              category: '📺 Série em Alta no Streaming',
              type: 'Série',
              rating: item.vote || 8.8,
              synopsis: item.synopsis,
              image: item.backdrop,
              poster: item.poster
            }));

          if (movies.length > 0) setMovieItems(movies);
          if (series.length > 0) setSeriesItems(series);

          const list: any[] = [];
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

          if (list.length > 0) {
            setTickerItems(list.sort(() => Math.random() - 0.5));
          }
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
    const baseMsg = whatsappConfig?.whatsapp_mensagem || 'Olá! Vim pelo CinePlay e quero saber como assistir com alta qualidade.';
    const text = `${baseMsg} Quero saber onde e como assistir: ${title}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  // Rotação suave dos containers de filmes e séries
  useEffect(() => {
    if (isMovieHovered || movieItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentMovieIdx(prev => (prev + 1) % movieItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isMovieHovered, movieItems.length]);

  useEffect(() => {
    if (isSeriesHovered || seriesItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSeriesIdx(prev => (prev + 1) % seriesItems.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [isSeriesHovered, seriesItems.length]);

  // Agrupa jogos por liga
  const matchesByLeague = matches.reduce((acc, m) => {
    if (!acc[m.campeonato]) acc[m.campeonato] = [];
    acc[m.campeonato].push(m);
    return acc;
  }, {} as Record<string, MatchItem[]>);

  const toggleLeague = (league: string) => {
    setOpenLeagues(prev => ({ ...prev, [league]: !prev[league] }));
  };

  // Datas dinâmicas para navegação (-1 até +5 dias)
  const dateTabs = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 1;
    const d = new Date();
    d.setDate(d.getDate() + offset);
    let label = '';
    if (offset === -1) label = 'Ontem';
    else if (offset === 0) label = 'Hoje';
    else if (offset === 1) label = 'Amanhã';
    else label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');

    return { offset, label, fullDate: d.toLocaleDateString('pt-BR') };
  });

  const leagueEntries = Object.entries(matchesByLeague);
  const displayedLeagues = showAllLeagues ? leagueEntries : leagueEntries.slice(0, 8);

  return (
    <div style={{ background: '#07070D', minHeight: '100vh', color: '#fff', overflowX: 'hidden', width: '100%' }}>
      
      {/* ═════════════════════════════════════════════════════════════════
          SEÇÃO HERO 3D COM SHOWCASE E CHAMADA DE IMPACTO
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: '110px 24px 32px',
        background: 'radial-gradient(ellipse at top, rgba(229, 9, 20, 0.15) 0%, rgba(7, 7, 13, 0.98) 70%)',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        width: '100%'
      }} className="hero-section">
        
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
            gap: 24,
            alignItems: 'center'
          }} className="hero-grid">
            
            {/* Coluna Texto da Hero */}
            <div style={{ zIndex: 3, paddingRight: 10, minWidth: 0 }} className="hero-text-col">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 99,
                background: 'rgba(229, 9, 20, 0.12)', border: '1px solid rgba(229, 9, 20, 0.3)',
                color: 'var(--brand-red)', fontSize: 12, fontWeight: 800,
                marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                <Sparkles size={14} /> Guia Oficial de Entretenimento & Esportes
              </div>

              <h1 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: '-0.02em',
                color: '#fff',
                wordBreak: 'break-word'
              }}>
                Tudo Sobre <span className="gradient-text">Filmes, Séries</span> e Onde Assistir <span style={{ color: '#E50914' }}>Futebol ao Vivo</span>
              </h1>

              <p style={{
                fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                color: '#A0A0B5',
                lineHeight: 1.6,
                marginBottom: 24,
                maxWidth: 540
              }}>
                Saiba exatamente onde assistir aos jogos do seu time, os lançamentos de cinema mais aguardados e as melhores séries em todas as plataformas de streaming.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${whatsappConfig?.whatsapp_numero || '5511999999999'}?text=${encodeURIComponent(whatsappConfig?.whatsapp_mensagem || 'Olá! Vim pelo CinePlay e quero saber como assistir conteúdo.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 28px', borderRadius: 12,
                    background: '#25D366', color: '#fff',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15,
                    textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                    transition: 'transform 0.2s'
                  }}
                  className="mobile-full-btn"
                >
                  <MessageCircle size={18} /> Saiba como Assistir no WhatsApp
                </a>
              </div>
            </div>

            {/* Coluna Visual do Carrossel 3D */}
            <div style={{ position: 'relative', zIndex: 2, minWidth: 0, width: '100%' }} className="hero-visuals-container">
              <HeroShowcase />
            </div>

          </div>
        </div>
      </section>


      {/* ═════════════════════════════════════════════════════════════════
          SEÇÃO PRINCIPAL: DESTAQUES DUPLOS + CALENDÁRIO SLIM FIT
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 24px 60px', maxWidth: 1280, margin: '0 auto', width: '100%' }} className="main-section">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'start'
        }} className="main-content-grid">
          
          {/* -------------------------------------------------------------
              COLUNA ESQUERDA: CATEGORIAS + DESTAQUES DUPLOS (FILME + SÉRIE)
          ------------------------------------------------------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            
            {/* Grid de Categorias */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#E50914', letterSpacing: '0.08em', fontFamily: 'Outfit' }}>
                  EXPLORE POR CATEGORIA
                </span>
                <h2 style={{ fontSize: 17, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#fff', margin: 0 }}>
                  O que cobrimos <span style={{ color: '#E50914' }}>para você</span>
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, width: '100%' }} className="categories-grid">
                {CATEGORIAS.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/blog?categoria=${cat.id}`}
                    style={{
                      background: '#0a0a12',
                      border: cat.badge ? '1.5px solid rgba(229,9,20,0.3)' : '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 12, padding: '12px 10px',
                      position: 'relative', textDecoration: 'none', display: 'block',
                      transition: 'all 0.28s ease', minWidth: 0
                    }}
                    className="category-card"
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{cat.icon}</div>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{cat.title}</h3>
                    <p style={{ fontSize: 9, color: '#9090A5', lineHeight: 1.3, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.desc}</p>
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

            {/* CONTAINER 1: FILME EM DESTAQUE */}
            <div
              onMouseEnter={() => setIsMovieHovered(true)}
              onMouseLeave={() => setIsMovieHovered(false)}
              style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(229,9,20,0.25)', background: '#090914',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)', minHeight: 320,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                width: '100%', minWidth: 0
              }}
              className="showcase-card-container"
            >
              {movieItems.map((item, idx) => {
                const isActive = idx === currentMovieIdx;
                return (
                  <div key={`movie-bg-${item.id}`} style={{ position: 'absolute', inset: 0, opacity: isActive ? 1 : 0, transition: 'opacity 0.8s ease-in-out', pointerEvents: 'none', zIndex: 0 }}>
                    <img src={item.image} alt="" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=780&q=80'; }} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', filter: 'brightness(0.68) saturate(1.25)' }} />
                  </div>
                );
              })}

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.7) 45%, rgba(7,7,13,0.85) 100%)', zIndex: 1 }} />

              {movieItems.map((item, idx) => {
                if (idx !== currentMovieIdx) return null;
                return (
                  <div key={`movie-content-${item.id}`} style={{ position: 'relative', zIndex: 2, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 14, minWidth: 0 }} className="card-content-inner">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ padding: '4px 12px', borderRadius: 99, background: '#E50914', color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{item.rating} / 10</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 0 }} className="card-media-synopsis">
                      <div style={{ width: 85, height: 125, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.8)', flexShrink: 0 }} className="poster-img-responsive">
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 900, color: '#fff', marginBottom: 6, lineHeight: 1.25 }}>
                          {item.title}
                        </h3>
                        <p style={{ color: '#D0D0E0', fontSize: 'clamp(0.8rem, 1vw, 0.88rem)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.synopsis}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 10 }} className="card-footer-cta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#25D366', fontWeight: 700 }}>
                        <span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}>🟢</span> Guia Oficial no WhatsApp
                      </div>
                      <a href={getMovieWhatsappUrl(item.title)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 13, textDecoration: 'none', fontFamily: 'Outfit' }} className="onde-assistir-btn">
                        <MessageCircle size={15} /> Onde Assistir?
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTAINER 2: SÉRIE EM ALTA */}
            <div
              onMouseEnter={() => setIsSeriesHovered(true)}
              onMouseLeave={() => setIsSeriesHovered(false)}
              style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(99,102,241,0.3)', background: '#090914',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)', minHeight: 320,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                width: '100%', minWidth: 0
              }}
              className="showcase-card-container"
            >
              {seriesItems.map((item, idx) => {
                const isActive = idx === currentSeriesIdx;
                return (
                  <div key={`series-bg-${item.id}`} style={{ position: 'absolute', inset: 0, opacity: isActive ? 1 : 0, transition: 'opacity 0.8s ease-in-out', pointerEvents: 'none', zIndex: 0 }}>
                    <img src={item.image} alt="" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=780&q=80'; }} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', filter: 'brightness(0.65) saturate(1.2)' }} />
                  </div>
                );
              })}

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.7) 45%, rgba(7,7,13,0.85) 100%)', zIndex: 1 }} />

              {seriesItems.map((item, idx) => {
                if (idx !== currentSeriesIdx) return null;
                return (
                  <div key={`series-content-${item.id}`} style={{ position: 'relative', zIndex: 2, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 14, minWidth: 0 }} className="card-content-inner">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ padding: '4px 12px', borderRadius: 99, background: '#6366F1', color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{item.rating} / 10</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 0 }} className="card-media-synopsis">
                      <div style={{ width: 85, height: 125, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.8)', flexShrink: 0 }} className="poster-img-responsive">
                        <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 900, color: '#fff', marginBottom: 6, lineHeight: 1.25 }}>
                          {item.title}
                        </h3>
                        <p style={{ color: '#D0D0E0', fontSize: 'clamp(0.8rem, 1vw, 0.88rem)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.synopsis}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 10 }} className="card-footer-cta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#25D366', fontWeight: 700 }}>
                        <span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}>🟢</span> Disponível em HD / 4K
                      </div>
                      <a href={getMovieWhatsappUrl(item.title)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 13, textDecoration: 'none', fontFamily: 'Outfit' }} className="onde-assistir-btn">
                        <MessageCircle size={15} /> Saiba como Assistir
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>


          {/* -------------------------------------------------------------
              COLUNA DIREITA: CALENDÁRIO ESPORTIVO SLIM FIT
          ------------------------------------------------------------- */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 16, padding: '18px 16px',
            display: 'flex', flexDirection: 'column',
            maxHeight: 700, overflow: 'hidden', minWidth: 0, width: '100%'
          }} className="slim-sports-column">
            
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Outfit' }}>
                  ⚽ JOGOS AO VIVO & DE HOJE
                </span>
                <span style={{ fontSize: 10, color: '#A0A0B5', fontWeight: 600 }}>{matches.length} partidas</span>
              </div>

              {/* Navegação por Datas com Scroll Suave no Celular */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                {dateTabs.map(tab => (
                  <button
                    key={tab.offset}
                    onClick={() => setSelectedDateOffset(tab.offset)}
                    style={{
                      padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      background: selectedDateOffset === tab.offset ? '#E50914' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selectedDateOffset === tab.offset ? '#E50914' : 'rgba(255,255,255,0.06)'}`,
                      color: selectedDateOffset === tab.offset ? '#fff' : '#A0A0B5',
                      whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Campeonatos e Partidas */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loadingMatches ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0A0B5', fontSize: 13 }}>
                  Carregando calendário de jogos...
                </div>
              ) : displayedLeagues.length > 0 ? (
                displayedLeagues.map(([leagueName, leagueMatches]) => {
                  const isOpen = !!openLeagues[leagueName];
                  const firstMatch = leagueMatches[0];

                  return (
                    <div key={leagueName} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, background: '#0a0a12', overflow: 'hidden', flexShrink: 0 }}>
                      <button
                        onClick={() => toggleLeague(leagueName)}
                        style={{
                          width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'left', minHeight: 44
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          {firstMatch?.escudo_campeonato && (
                            <img src={firstMatch.escudo_campeonato} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                          )}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leagueName}</span>
                          <span style={{ fontSize: 10, color: '#A0A0B5', fontWeight: 600 }}>({leagueMatches.length})</span>
                        </div>
                        {isOpen ? <ChevronUp size={14} color="#A0A0B5" /> : <ChevronDown size={14} color="#A0A0B5" />}
                      </button>

                      {isOpen && (
                        <div style={{ padding: '6px 10px 10px', display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          {leagueMatches.map(m => (
                            <div
                              key={m.id}
                              onClick={() => setSelectedMatch(m)}
                              style={{
                                padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {m.time1} x {m.time2}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                {m.live ? (
                                  <span style={{ fontSize: 9, fontWeight: 900, color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 99 }}>
                                    AO VIVO
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 10, color: '#A0A0B5', fontWeight: 600 }}>
                                    {m.horario}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0A0B5', fontSize: 12 }}>
                  Nenhuma partida agendada para esta data.
                </div>
              )}
            </div>

            {/* Alternador "Ver Todos os Campeonatos" */}
            {leagueEntries.length > 8 && (
              <button
                onClick={() => setShowAllLeagues(!showAllLeagues)}
                style={{
                  marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', color: '#A0A0B5', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', width: '100%', textAlign: 'center', fontFamily: 'Outfit'
                }}
              >
                {showAllLeagues ? '▲ Mostrar Menos Campeonatos' : `▼ Ver Todos (${leagueEntries.length}) Campeonatos`}
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Modal de Detalhes da Partida */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          whatsappUrl={getMatchWhatsappUrl(`${selectedMatch.time1} x ${selectedMatch.time2}`)}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* ESTILOS RESPONSIVOS GLOBAIS DE ALTA PRECISÃO */}
      <style jsx global>{`
        *, *::before, *::after {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        html, body {
          overflow-x: hidden !important;
          width: 100vw !important;
          max-width: 100vw !important;
        }
        @media (min-width: 1025px) {
          .hero-visuals-container {
            margin-left: -110px !important;
            width: calc(100% + 110px) !important;
          }
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 24px !important;
          }
          .hero-visuals-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-top: 10px;
            overflow: hidden !important;
          }
          .hero-text-col {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .main-content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .slim-sports-column {
            max-height: 550px !important;
          }
        }
        @media (max-width: 640px) {
          .hero-section {
            padding: 80px 12px 18px !important;
          }
          .main-section {
            padding: 24px 10px !important;
          }
          .mobile-full-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .card-content-inner {
            padding: 14px 10px !important;
          }
          .card-media-synopsis {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          .poster-img-responsive {
            width: 70px !important;
            height: 100px !important;
          }
          .categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
            width: 100% !important;
          }
          .category-card {
            padding: 10px 8px !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }
          .card-footer-cta {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .onde-assistir-btn {
            justify-content: center !important;
            width: 100% !important;
          }
          .showcase-card-container {
            min-height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
