'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Volume2, VolumeX } from 'lucide-react';

interface PosterItem {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  vote: number;
  type: string;
  sport?: boolean;
  isLive?: boolean;
  label?: string;
  league?: string;
  leagueFlag?: string;
  leagueColor?: string;
  homeTeam?: { name: string; logo: string };
  awayTeam?: { name: string; logo: string };
}

const FALLBACK: PosterItem[] = [
  { id: 9004, title: 'Dune: Part Two', poster: 'https://image.tmdb.org/t/p/w500/c7D6n1clBL6Vo44x2Uo599026T.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/8Z8dHFw7JVhXPSmx0yg2mtGEyeb.jpg', vote: 8.8, type: 'Filme' },
  { id: 9005, title: 'The Last of Us', poster: 'https://image.tmdb.org/t/p/w500/u3bZ62I4rj75XyH2h45a60xa4iO.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2rezQWg73XFWuKE5eZIBwJ7CBca.jpg', vote: 9.2, type: 'Série' },
  { id: 9006, title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/nCjzUi2YFo6hk6135759lG0i1Iq.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokZ86CTy6akIE5siC4L7y3IG.jpg', vote: 8.9, type: 'Filme' },
  { id: 9008, title: 'House of the Dragon', poster: 'https://image.tmdb.org/t/p/w500/t9X7imfv64es3496nQ3KyIFnN5Y.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/5PN1vU2hDYO9MNJK8g5n24J6LVw.jpg', vote: 9.1, type: 'Série' },
  { id: 9009, title: 'Spider-Man: Across the Spider-Verse', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWERe8448jLLn2u11t17cgs.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2v5Jj2CnEK1YVplgPMocm7P4huC.jpg', vote: 9.0, type: 'Filme' },
  { id: 9010, title: 'Oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg', vote: 8.5, type: 'Filme' },
  { id: 9011, title: 'Super Mario Bros.', poster: 'https://image.tmdb.org/t/p/w500/qNBA2z9yK6971zO54z8645q6CIb.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/9n2tJBplPbgR2405fsJoN6j108Q.jpg', vote: 7.8, type: 'Filme' },
  { id: 9012, title: 'Batman: The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/qJ2tWGBbeZJy6wtvhrEA1zGvHzF.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUuedz8BdflwR6O48eKt1rA.jpg', vote: 8.5, type: 'Filme' },
  { id: 9013, title: 'Stranger Things', poster: 'https://image.tmdb.org/t/p/w500/49WJ2N36DkQclh2C35QJ6J71Vll.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/56v2Kj2qgo37g341wLTw8DM6oQ4.jpg', vote: 8.6, type: 'Série' }
];

const SPORT_STADIUMS = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80'
];

/*
  Posições horizontais fixas e planas.
  Adicionamos slots fantasmas nas extremidades (-1 e 5) para que os cards que entram e saem do carrossel 
  façam uma transição suave a partir de fora da tela de forma invisível.
*/
const SLOTS = [
  { left: -10, rotateY: 25,  scale: 0.50, zDepth: -150, opacity: 0,    zIndex: 1, w: 120, h: 170, blur: 5 }, // Fora à esquerda
  { left: 12,  rotateY: 20,  scale: 0.65, zDepth: -100, opacity: 0.35, zIndex: 3, w: 140, h: 200, blur: 3 }, // Ponta esquerda
  { left: 30,  rotateY: 10,  scale: 0.82, zDepth: -40,  opacity: 0.70, zIndex: 5, w: 170, h: 245, blur: 1 }, // Esquerda
  { left: 50,  rotateY: 0,   scale: 1.05, zDepth: 40,   opacity: 1.00, zIndex: 10, w: 220, h: 320, blur: 0 },// PROTAGONISTA CENTRO
  { left: 70,  rotateY: -10, scale: 0.82, zDepth: -40,  opacity: 0.70, zIndex: 5, w: 170, h: 245, blur: 1 }, // Direita
  { left: 88,  rotateY: -20, scale: 0.65, zDepth: -100, opacity: 0.35, zIndex: 3, w: 140, h: 200, blur: 3 }, // Ponta direita
  { left: 110, rotateY: -25, scale: 0.50, zDepth: -150, opacity: 0,    zIndex: 1, w: 120, h: 170, blur: 5 }, // Fora à direita
];

// Helper para interpolar linearmente valores numéricos
function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pool, setPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Progresso decimal do carrossel (ex: 2.45 representa que estamos entre o card 2 e 3)
  const [progress, setProgress] = useState(0.0);

  // Parallax estilo Vision Pro
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  // Controle de arraste (drag)
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; progress: number } | null>(null);

  // Controle de Trailer Silencioso no Fundo
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const lastFetchedIdRef = useRef<number | null>(null);
  
  // Estado e Referência para Controle de Áudio (inicia mutado para garantir o autoplay imediato sem controles gigantes na tela)
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (nextMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'mute', args: '' }),
          '*'
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [40] }),
          '*'
        );
      }
    }
  };

  // Habilita som na primeira interação do usuário na página, respeitando a política de autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      setIsMuted(false);
      
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [40] }),
          '*'
        );
      }
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        const [tmdbRes, sportsRes] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json()),
        ]);

        let movies: PosterItem[] = [];
        let sports: PosterItem[] = [];

        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.pool?.length) {
          movies = tmdbRes.value.pool;
        }
        if (sportsRes.status === 'fulfilled' && sportsRes.value?.pool?.length) {
          sports = sportsRes.value.pool.filter((s: PosterItem) => 
            (s.poster || s.homeTeam) && !s.title.includes('Temporada')
          );
        }

        let items: PosterItem[] = [];
        const maxLen = Math.max(movies.length, sports.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < sports.length) items.push(sports[i]);
          if (i < movies.length) items.push(movies[i]);
        }

        let finalPool = items.filter(item => item.poster || item.homeTeam);
        if (finalPool.length < 5) {
          finalPool = [...finalPool, ...FALLBACK].slice(0, 15);
        }
        setPool(finalPool);
      } catch {
        setPool(FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Rotação automática suave à esquerda (0.003 de progresso a cada frame)
  useEffect(() => {
    if (pool.length === 0) return;
    let animId: number;

    const tick = () => {
      if (!isDraggingRef.current) {
        setProgress(prev => {
          const next = prev + 0.0013; // Roda sozinho suavemente (velocidade reduzida para maior tempo de tela)
          return next >= pool.length ? next - pool.length : next;
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [pool]);

  // Efeito Lerp do Parallax do Mouse
  useEffect(() => {
    let animId: number;
    const update = () => {
      setMouse(prev => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.05,
        y: prev.y + (targetMouse.y - prev.y) * 0.05,
      }));
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [targetMouse]);

  // Buscar Trailer Silencioso do Protagonista no Youtube
  const currentIntIndex = pool.length > 0 ? Math.round(progress) % pool.length : 0;
  const protagonist = pool[currentIntIndex];

  useEffect(() => {
    if (!protagonist) {
      setActiveTrailerKey(null);
      return;
    }
    if (lastFetchedIdRef.current === protagonist.id) return;
    lastFetchedIdRef.current = protagonist.id;

    async function fetchTrailer() {
      try {
        const endpoint = protagonist.sport 
          ? `/api/sports-video?id=${protagonist.id}&home=${encodeURIComponent(protagonist.homeTeam?.name || '')}&away=${encodeURIComponent(protagonist.awayTeam?.name || '')}&league=${encodeURIComponent(protagonist.league || '')}`
          : `/api/tmdb-video?id=${protagonist.id}&type=${protagonist.type}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.success && data.videoKey) {
          setActiveTrailerKey(data.videoKey);
        } else {
          setActiveTrailerKey(null);
        }
      } catch {
        setActiveTrailerKey(null);
      }
    }
    fetchTrailer();
  }, [protagonist]);

  // Tratadores de Drag do Mouse / Touch
  const onDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = { clientX, progress };
  };

  const onDragMove = (clientX: number) => {
    if (!isDraggingRef.current || dragStartRef.current === null || pool.length === 0) return;
    const deltaX = clientX - dragStartRef.current.clientX;
    // O sinal negativo faz com que arrastar para a esquerda mova a esteira para a esquerda (próximos cards)
    let newProgress = dragStartRef.current.progress - (deltaX / 320);

    // Módulos circulares
    if (newProgress < 0) {
      newProgress += pool.length;
    }
    newProgress = newProgress % pool.length;

    setProgress(newProgress);
  };

  const onDragEnd = () => {
    isDraggingRef.current = false;
    dragStartRef.current = null;
  };

  // Parallax do mouse
  const onMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  };

  // Renderização do Card de Futebol Personalizado
  const renderSportCard = (item: PosterItem, isMain: boolean) => {
    const backdropImg = item.backdrop || SPORT_STADIUMS[item.id % SPORT_STADIUMS.length];
    
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#07070D',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backdropImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.35, filter: 'blur(1px)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(7,7,13,0.92) 90%)',
        }} />

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, padding: '15px 10px 0', gap: 14
        }}>
          <span style={{
            fontSize: isMain ? 9 : 7, fontWeight: 900, textTransform: 'uppercase',
            color: item.leagueColor || '#009C3B', letterSpacing: '0.08em',
            background: 'rgba(7,7,13,0.85)', padding: '3px 8px', borderRadius: 4,
            border: `1px solid ${item.leagueColor || '#009C3B'}40`,
          }}>
            {item.league || 'Futebol'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMain ? 15 : 8, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', gap: 6 }}>
              <div style={{
                width: isMain ? 56 : 38, height: isMain ? 56 : 38,
                borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
              }}>
                {item.homeTeam?.logo ? (
                  <img src={item.homeTeam.logo} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : <span style={{ fontSize: 16 }}>⚽</span>}
              </div>
              <span style={{
                fontSize: isMain ? 9 : 7, fontWeight: 700, color: '#E1E1E6', textAlign: 'center',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
              }}>
                {item.homeTeam?.name}
              </span>
            </div>

            <span style={{
              fontSize: isMain ? 14 : 10, fontWeight: 900,
              color: item.isLive ? '#E50914' : '#65657B',
              textShadow: item.isLive ? '0 0 10px rgba(229,9,20,0.5)' : 'none',
            }}>
              VS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', gap: 6 }}>
              <div style={{
                width: isMain ? 56 : 38, height: isMain ? 56 : 38,
                borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
              }}>
                {item.awayTeam?.logo ? (
                  <img src={item.awayTeam.logo} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : <span style={{ fontSize: 16 }}>⚽</span>}
              </div>
              <span style={{
                fontSize: isMain ? 9 : 7, fontWeight: 700, color: '#E1E1E6', textAlign: 'center',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
              }}>
                {item.awayTeam?.name}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.7) 100%)',
          padding: isMain ? '12px 14px 10px' : '6px 8px', zIndex: 3, fontFamily: 'Outfit, sans-serif'
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: item.isLive ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.05)',
            color: item.isLive ? '#E50914' : '#A0A0B5',
            padding: '2px 6px', borderRadius: 99,
            fontSize: isMain ? 8 : 6, fontWeight: 900, textTransform: 'uppercase',
            border: `1px solid ${item.isLive ? '#E50914' : 'rgba(255,255,255,0.1)'}30`,
            marginBottom: isMain ? 4 : 2,
          }}>
            {item.isLive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E50914', display: 'inline-block', animation: 'livePulse 1.5s ease-in-out infinite' }} />}
            {item.isLive ? 'Ao Vivo' : item.label || 'Futebol'}
          </span>
          <h4 style={{
            fontSize: isMain ? 13 : 9, fontWeight: 800, color: '#fff', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {item.title}
          </h4>
        </div>
      </div>
    );
  };

  const accentColor = protagonist?.sport ? (protagonist.leagueColor || '#009C3B') : protagonist?.type === 'Série' ? '#6366F1' : '#E50914';

  return (
    <div
      ref={containerRef}
      className="hero-showcase-container"
      onMouseMove={onMouseMove}
      onMouseDown={(e) => { e.preventDefault(); onDragStart(e.clientX); }}
      onMouseMoveCapture={(e) => { if (isDraggingRef.current) { e.preventDefault(); onDragMove(e.clientX); } }}
      onMouseUp={onDragEnd}
      onMouseLeave={() => { onDragEnd(); setTargetMouse({ x: 0, y: 0 }); }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={onDragEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '470px',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        overflow: 'visible',
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ═══════════════════════════════
          TRAILER SILENCIOSO DE FUNDO (YOUTUBE EMBED)
      ═══════════════════════════════ */}
      {activeTrailerKey ? (
        <div className="hero-video-bg">
          {/* Máscara de fusão com o fundo para contraste do texto */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #07070D 0%, rgba(7,7,13,0.95) 20%, rgba(7,7,13,0.3) 55%, rgba(7,7,13,0.7) 80%, #07070D 100%), linear-gradient(to bottom, #07070D 0%, transparent 15%, transparent 85%, #07070D 100%)',
            zIndex: 1,
          }} />
          <iframe
            ref={iframeRef}
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              transform: 'scale(1.42)',
              filter: 'saturate(1.2)',
            }}
            src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${activeTrailerKey}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&enablejsapi=1`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            loading="lazy"
          />
        </div>
      ) : protagonist?.backdrop ? (
        <div className="hero-video-bg" style={{ filter: 'blur(12px) saturate(1.25)', opacity: 0.38 }}>
          {/* Máscara de fusão */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #07070D 0%, rgba(7,7,13,0.92) 22%, rgba(7,7,13,0.3) 50%, rgba(7,7,13,0.8) 80%, #07070D 100%)',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${protagonist.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.8s ease',
          }} />
        </div>
      ) : null}

      {/* Glow de Fundo central */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 440, height: 440,
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 68%)`,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        transform: `translate(-50%,-50%) translate3d(${mouse.x * 8}px, ${mouse.y * 8}px, -100px)`,
        transition: 'background 0.8s ease',
      }} />

      {loading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#A0A0B5', fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          Carregando showcase...
        </div>
      )}

      {/* Container Principal dos Cards */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -2}deg) rotateY(${mouse.x * 2.5}deg)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}>
        {pool.map((item, idx) => {
          // Calcula a distância angular do item em relação ao progresso atual
          let diff = idx - progress;
          // Ajusta a distância para o caminho circular mais curto
          const half = pool.length / 2;
          if (diff > half) diff -= pool.length;
          if (diff < -half) diff += pool.length;

          // Se estiver muito longe do centro (fora dos 5 slots visíveis), não renderiza
          if (diff < -3.2 || diff > 3.2) return null;

          // Mapeia a posição do item baseando-se em sua distância d.
          // O centro d = 0 corresponde ao slot 3 (PROTAGONISTA CENTRO)
          const virtualSlotIdx = diff + 3; 
          const lowerIdx = Math.floor(virtualSlotIdx);
          const upperIdx = Math.ceil(virtualSlotIdx);
          const fraction = virtualSlotIdx - lowerIdx;

          // Interpola as propriedades visuais entre os slots adjacentes
          const slotA = SLOTS[Math.max(0, Math.min(SLOTS.length - 1, lowerIdx))];
          const slotB = SLOTS[Math.max(0, Math.min(SLOTS.length - 1, upperIdx))];

          const interpolatedLeft = lerp(slotA.left, slotB.left, fraction);
          const interpolatedRotateY = lerp(slotA.rotateY, slotB.rotateY, fraction);
          const interpolatedScale = lerp(slotA.scale, slotB.scale, fraction);
          const interpolatedZDepth = lerp(slotA.zDepth, slotB.zDepth, fraction);
          const interpolatedOpacity = lerp(slotA.opacity, slotB.opacity, fraction);
          const interpolatedW = lerp(slotA.w, slotB.w, fraction);
          const interpolatedH = lerp(slotA.h, slotB.h, fraction);
          const interpolatedBlur = lerp(slotA.blur, slotB.blur, fraction);
          
          const isMain = Math.abs(diff) < 0.5;

          return (
            <div
              key={`inter-card-${item.id}-${idx}`}
              onClick={() => {
                if (!isDraggingRef.current && Math.abs(diff) > 0.4) {
                  // Centraliza o card clicado
                  setProgress(idx);
                }
              }}
              style={{
                position: 'absolute',
                left: `${interpolatedLeft}%`,
                width: interpolatedW,
                height: interpolatedH,
                transform: `
                  translate(-50%, -50%)
                  translateZ(${interpolatedZDepth}px)
                  rotateY(${interpolatedRotateY}deg)
                  scale(calc(${interpolatedScale} * var(--mobile-scale, 1)))
                `,
                borderRadius: isMain ? 14 : 10,
                overflow: 'hidden',
                border: isMain ? `2.5px solid ${accentColor}b0` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isMain
                  ? `0 25px 65px ${accentColor}25, 0 15px 40px rgba(0,0,0,0.9)`
                  : '0 8px 24px rgba(0,0,0,0.5)',
                opacity: interpolatedOpacity,
                filter: `blur(${interpolatedBlur}px)`,
                zIndex: isMain ? 10 : Math.round(10 - Math.abs(diff) * 2),
                cursor: isMain ? 'default' : 'pointer',
                top: '50%',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {item.sport ? (
                renderSportCard(item, isMain)
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none' }}>
                  <img
                    src={item.poster || ''}
                    alt={item.title}
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
                  />
                  
                  {/* Overlay Inferior */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.5) 60%, transparent 100%)',
                    padding: isMain ? '12px 14px 10px' : '6px 8px',
                    fontFamily: 'Outfit, sans-serif',
                    userSelect: 'none',
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      background: item.type === 'Série' ? 'rgba(99,102,241,0.15)' : 'rgba(229,9,20,0.12)',
                      color: item.type === 'Série' ? '#818CF8' : '#E50914',
                      padding: '2px 6px', borderRadius: 99,
                      fontSize: isMain ? 8 : 6, fontWeight: 900, textTransform: 'uppercase',
                      border: `1px solid ${item.type === 'Série' ? '#6366F1' : '#E50914'}30`,
                      marginBottom: isMain ? 4 : 2,
                    }}>
                      {item.type}
                    </span>
                    <h4 style={{
                      fontSize: isMain ? 13 : 9, fontWeight: 800, color: '#fff', margin: 0,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {item.title}
                    </h4>
                    {isMain && (
                      <p style={{ fontSize: 9, color: '#A0A0B5', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{item.type}</span>
                        <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#555' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                          <Star size={8} fill="#F59E0B" color="#F59E0B" /> {item.vote?.toFixed(1) || '8.0'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão de Som Premium (Mute/Unmute) */}
      {activeTrailerKey && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 120,
            background: isMuted ? 'rgba(15, 15, 28, 0.72)' : 'rgba(229, 9, 20, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isMuted ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(229, 9, 20, 0.35)',
            borderRadius: 24,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Outfit, sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)';
            if (isMuted) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = isMuted ? 'rgba(15, 15, 28, 0.72)' : 'rgba(229, 9, 20, 0.95)';
          }}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{isMuted ? 'Mudo' : 'Com Som'}</span>
        </button>
      )}

      <style jsx global>{`
        .hero-video-bg {
          position: absolute;
          top: -110px;
          bottom: -32px;
          left: -110%;
          right: -25%;
          opacity: 0.58;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          transition: opacity 0.8s ease;
        }
        @media (max-width: 1024px) {
          .hero-video-bg {
            left: -24px !important;
            right: -24px !important;
            top: -120px !important;
            bottom: -20px !important;
            opacity: 0.52 !important;
          }
          .hero-showcase-container {
            --mobile-scale: 0.74 !important;
            height: 380px !important;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
