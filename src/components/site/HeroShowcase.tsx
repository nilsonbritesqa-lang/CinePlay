'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

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
  Posições horizontais fixas e planas (5 slots em arco horizontal suave)
  O card central [index 2] é o protagonista dominante.
*/
const SLOTS_CONFIG = [
  { left: '12%', rotateY: 20,  scale: 0.65, zDepth: -100, opacity: 0.35, zIndex: 3, w: 140, h: 200, blur: 3 },  // Ponta esquerda
  { left: '30%', rotateY: 10,  scale: 0.82, zDepth: -40,  opacity: 0.70, zIndex: 5, w: 170, h: 245, blur: 1 },  // Esquerda
  { left: '50%', rotateY: 0,   scale: 1.05, zDepth: 40,   opacity: 1.00, zIndex: 10, w: 220, h: 320, blur: 0 }, // PROTAGONISTA CENTRO
  { left: '70%', rotateY: -10, scale: 0.82, zDepth: -40,  opacity: 0.70, zIndex: 5, w: 170, h: 245, blur: 1 },  // Direita
  { left: '88%', rotateY: -20, scale: 0.65, zDepth: -100, opacity: 0.35, zIndex: 3, w: 140, h: 200, blur: 3 },  // Ponta direita
];

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pool, setPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // O índice que aponta para o item atual central (protagonista) do pool
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parallax do mouse estilo Vision Pro
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  // Controle de drag / arraste manual
  const dragStartRef = useRef<number | null>(null);

  // Carregar e filtrar dados válidos
  useEffect(() => {
    async function loadData() {
      try {
        const [tmdbRes, sportsRes] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json()),
        ]);

        let items: PosterItem[] = [];
        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.pool?.length) {
          items.push(...tmdbRes.value.pool);
        }
        if (sportsRes.status === 'fulfilled' && sportsRes.value?.pool?.length) {
          // Filtra itens de esporte sem imagem e sem jogo definido para manter alta qualidade
          const validSports = sportsRes.value.pool.filter((s: PosterItem) => 
            (s.poster || s.homeTeam) && !s.title.includes('Temporada')
          );
          items.push(...validSports);
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

  // Rotação/Mudança automática de slide contínua para a esquerda (a cada 4.5 segundos)
  useEffect(() => {
    if (pool.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [pool, currentIndex]);

  // Funções de navegação do carrossel
  const handleNext = () => {
    if (pool.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % pool.length);
  };

  const handlePrev = () => {
    if (pool.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + pool.length) % pool.length);
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

  // Eventos de Touch/Drag para rolar o carrossel
  const onDragStart = (clientX: number) => {
    dragStartRef.current = clientX;
  };

  const onDragMove = (clientX: number) => {
    if (dragStartRef.current === null || pool.length === 0) return;
    const diff = clientX - dragStartRef.current;
    
    // Se arrastar mais de 50px, avança ou retrocede e reseta
    if (diff > 50) {
      handlePrev();
      dragStartRef.current = null;
    } else if (diff < -50) {
      handleNext();
      dragStartRef.current = null;
    }
  };

  const onDragEnd = () => {
    dragStartRef.current = null;
  };

  // Efeito lerp para atualizar coordenadas do mouse
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

  // Obtém o item do pool para cada slot fixo (com rotação suave)
  const getSlotItem = (slotIdx: number): PosterItem | null => {
    if (pool.length === 0) return null;
    // O slot central (2) corresponde ao currentIndex.
    // Calculamos o índice do pool baseado na distância do slot central.
    const poolIdx = (currentIndex + (slotIdx - 2) + pool.length) % pool.length;
    return pool[poolIdx];
  };

  // Renderização do Card Esportivo Personalizado
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
                  <img src={item.homeTeam.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                  <img src={item.awayTeam.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

  const protagonist = pool[currentIndex];
  const accentColor = protagonist?.sport ? (protagonist.leagueColor || '#009C3B') : protagonist?.type === 'Série' ? '#6366F1' : '#E50914';

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMoveCapture={(e) => onDragMove(e.clientX)}
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
        cursor: 'grab',
      }}
    >
      {/* Imagem de Fundo Atmosférica do protagonista central */}
      {protagonist?.backdrop && (
        <div style={{
          position: 'absolute', top: '-10%', left: '-15%', width: '130%', height: '120%',
          opacity: 0.14, zIndex: 0, pointerEvents: 'none',
          filter: 'blur(35px) saturate(1.2)',
          backgroundImage: `url(${protagonist.backdrop})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'background-image 0.8s ease',
        }} />
      )}

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

      {/* Container Principal dos Cards em Perspectiva Linear */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -2}deg) rotateY(${mouse.x * 2.5}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {SLOTS_CONFIG.map((pos, slotIdx) => {
          const item = getSlotItem(slotIdx);
          if (!item) return null;

          const isMain = slotIdx === 2;

          return (
            <div
              key={`slot-${item.id}-${slotIdx}`}
              onClick={() => {
                if (slotIdx === 1) handlePrev();
                if (slotIdx === 3) handleNext();
                if (slotIdx === 0) { handlePrev(); setTimeout(handlePrev, 150); }
                if (slotIdx === 4) { handleNext(); setTimeout(handleNext, 150); }
              }}
              style={{
                position: 'absolute',
                left: pos.left,
                width: pos.w,
                height: pos.h,
                transform: `
                  translate(-50%, -50%)
                  translateZ(${pos.zDepth}px)
                  rotateY(${pos.rotateY}deg)
                  scale(${pos.scale})
                `,
                borderRadius: isMain ? 14 : 10,
                overflow: 'hidden',
                border: isMain ? `2.5px solid ${accentColor}b0` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isMain
                  ? `0 25px 65px ${accentColor}25, 0 15px 40px rgba(0,0,0,0.9)`
                  : '0 8px 24px rgba(0,0,0,0.5)',
                opacity: pos.opacity,
                filter: `blur(${pos.blur}px)`,
                transition: 'left 0.75s cubic-bezier(0.19, 1, 0.22, 1), transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.75s cubic-bezier(0.19, 1, 0.22, 1), filter 0.75s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.4s ease, box-shadow 0.4s ease',
                zIndex: pos.zIndex,
                cursor: isMain ? 'default' : 'pointer',
                top: '50%',
              }}
            >
              {item.sport ? (
                renderSportCard(item, isMain)
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src={item.poster || ''} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  
                  {/* Overlay Inferior */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.5) 60%, transparent 100%)',
                    padding: isMain ? '12px 14px 10px' : '6px 8px',
                    fontFamily: 'Outfit, sans-serif',
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

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
