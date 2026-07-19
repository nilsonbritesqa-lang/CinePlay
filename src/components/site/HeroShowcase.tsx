'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 9001, title: 'Brasileirão Série A', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', vote: 9.5, type: 'Futebol', sport: true, league: 'Brasileirão', leagueFlag: '🇧🇷', leagueColor: '#009C3B' },
];

/*
  Layout: Carrossel em perspectiva com 7 cards
  
  Posição:  [-3]  [-2]  [-1]  [0=MAIN]  [+1]  [+2]  [+3]
  Escala:    0.6   0.7   0.85   1.0      0.85  0.7   0.6
  Z-depth:  -120  -80   -40     0       -40   -80   -120
  Opacidade: 0.3   0.5   0.75   1.0      0.75  0.5   0.3
  Rotação Y: 25°   18°   10°    0°      -10°  -18°  -25°
*/
const CARD_POSITIONS = [
  { offsetX: -320, rotateY: 25,  scale: 0.55, zDepth: -120, opacity: 0.30, w: 110, h: 160 },
  { offsetX: -210, rotateY: 18,  scale: 0.68, zDepth: -80,  opacity: 0.50, w: 120, h: 175 },
  { offsetX: -105, rotateY: 10,  scale: 0.82, zDepth: -35,  opacity: 0.75, w: 135, h: 195 },
  { offsetX: 0,    rotateY: 0,   scale: 1.0,  zDepth: 30,   opacity: 1.0,  w: 210, h: 300 }, // PROTAGONISTA
  { offsetX: 105,  rotateY: -10, scale: 0.82, zDepth: -35,  opacity: 0.75, w: 135, h: 195 },
  { offsetX: 210,  rotateY: -18, scale: 0.68, zDepth: -80,  opacity: 0.50, w: 120, h: 175 },
  { offsetX: 320,  rotateY: -25, scale: 0.55, zDepth: -120, opacity: 0.30, w: 110, h: 160 },
];

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });
  const [pool, setPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 7 slots visíveis simultaneamente
  const [slots, setSlots] = useState<PosterItem[]>(FALLBACK);
  const [fading, setFading] = useState<boolean[]>(new Array(7).fill(false));

  // Parallax lerp suave
  useEffect(() => {
    let id: number;
    const loop = () => {
      setMouse(p => ({
        x: p.x + (targetMouse.x - p.x) * 0.05,
        y: p.y + (targetMouse.y - p.y) * 0.05,
      }));
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [targetMouse]);

  // Carregar pool de conteúdo das APIs
  useEffect(() => {
    async function load() {
      try {
        const [tmdb, sports] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json()),
        ]);

        const items: PosterItem[] = [];
        if (tmdb.status === 'fulfilled' && tmdb.value?.pool?.length) items.push(...tmdb.value.pool);
        if (sports.status === 'fulfilled' && sports.value?.pool?.length) items.push(...sports.value.pool);

        const finalPool = items.length >= 10 ? items : FALLBACK;
        setPool(finalPool);

        const shuffled = [...finalPool].sort(() => Math.random() - 0.5);
        setSlots(shuffled.slice(0, 7).length >= 7
          ? shuffled.slice(0, 7)
          : [...shuffled.slice(0, 7), ...FALLBACK].slice(0, 7)
        );
      } catch {
        setPool(FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Loop de mutação contínua — a cada 600-1200ms troca UM card
  useEffect(() => {
    if (pool.length === 0) return;
    let tid: NodeJS.Timeout;

    const swap = () => {
      const idx = Math.floor(Math.random() * 7);

      setFading(p => { const n = [...p]; n[idx] = true; return n; });

      setTimeout(() => {
        setSlots(prev => {
          const ids = prev.map(s => s.id);
          const avail = pool.filter(m => !ids.includes(m.id));
          const next = avail.length > 0
            ? avail[Math.floor(Math.random() * avail.length)]
            : pool[Math.floor(Math.random() * pool.length)];
          const n = [...prev];
          n[idx] = next;
          return n;
        });
        setFading(p => { const n = [...p]; n[idx] = false; return n; });
      }, 350);

      tid = setTimeout(swap, 600 + Math.random() * 600);
    };

    tid = setTimeout(swap, 1200);
    return () => clearTimeout(tid);
  }, [pool]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  }, []);

  const proto = slots[3]; // card central
  const accentColor = proto?.sport ? (proto.leagueColor || '#009C3B') : proto?.type === 'Série' ? '#6366F1' : '#E50914';

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTargetMouse({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: 460,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        overflow: 'visible',
      }}
    >
      {/* Backdrop atmosférico do protagonista */}
      {proto?.backdrop && (
        <div style={{
          position: 'absolute', top: '-30%', left: '-20%', width: '140%', height: '160%',
          opacity: 0.12, zIndex: 0, pointerEvents: 'none',
          filter: 'blur(40px) saturate(1.3)',
          transition: 'opacity 0.8s ease',
          backgroundImage: `url(${proto.backdrop})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
      )}

      {/* Glow dinâmico */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        width: 400, height: 400,
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
        transform: `translate(-50%,-50%) translate3d(${mouse.x * 8}px, ${mouse.y * 8}px, -60px)`,
        transition: 'background 1s ease',
      }} />

      {loading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#A0A0B5', fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'heroSpin 0.8s linear infinite' }} />
          Carregando...
        </div>
      )}

      {/* Cena 3D — rotação suave do mouse */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', zIndex: 2,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -2}deg) rotateY(${mouse.x * 3}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {CARD_POSITIONS.map((pos, i) => {
          const item = slots[i];
          if (!item) return null;
          const isMain = i === 3;
          const isFading = fading[i];
          const img = item.poster || item.backdrop || '';

          return (
            <div
              key={`slot-${i}`}
              style={{
                position: 'absolute',
                width: pos.w,
                height: pos.h,
                borderRadius: isMain ? 14 : 10,
                overflow: 'hidden',
                border: isMain ? `2px solid ${accentColor}90` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isMain
                  ? `0 25px 60px ${accentColor}18, 0 15px 40px rgba(0,0,0,0.8)`
                  : '0 8px 24px rgba(0,0,0,0.5)',
                opacity: isFading ? 0 : pos.opacity,
                filter: isFading ? 'blur(6px)' : 'blur(0px)',
                transform: `
                  translateX(${pos.offsetX + mouse.x * (pos.zDepth * -0.06)}px)
                  translateY(${mouse.y * (pos.zDepth * -0.04)}px)
                  translateZ(${pos.zDepth}px)
                  rotateY(${pos.rotateY}deg)
                  scale(${isFading ? pos.scale * 0.95 : pos.scale})
                `,
                transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                zIndex: isMain ? 10 : 5 - Math.abs(i - 3),
                cursor: 'default',
              }}
            >
              <img
                src={img}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Info overlay — apenas nos 3 centrais */}
              {Math.abs(i - 3) <= 1 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.5) 55%, transparent 100%)',
                  padding: isMain ? '12px 14px 10px' : '6px 8px',
                  fontFamily: 'Outfit, sans-serif',
                }}>
                  {/* Badge */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    background: item.sport ? `${item.leagueColor || '#009C3B'}20` : item.type === 'Série' ? 'rgba(99,102,241,0.15)' : 'rgba(229,9,20,0.12)',
                    color: item.sport ? (item.leagueColor || '#009C3B') : item.type === 'Série' ? '#818CF8' : '#E50914',
                    padding: '1px 5px', borderRadius: 99,
                    fontSize: isMain ? 8 : 6, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    border: `1px solid ${item.sport ? (item.leagueColor || '#009C3B') : item.type === 'Série' ? '#6366F1' : '#E50914'}30`,
                    marginBottom: isMain ? 3 : 1,
                  }}>
                    {item.isLive && <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#E50914', display: 'inline-block', animation: 'livePulse 1.5s ease-in-out infinite' }} />}
                    {item.sport ? (item.isLive ? 'Ao Vivo' : item.league || 'Futebol') : item.type}
                  </span>

                  <h4 style={{
                    fontSize: isMain ? 14 : 9, fontWeight: 800, color: '#fff', margin: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    letterSpacing: '-0.01em', lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h4>

                  {isMain && (
                    <p style={{ fontSize: 10, color: '#A0A0B5', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{item.league || item.type}</span>
                      <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#555' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                        <Star size={8} fill="#F59E0B" color="#F59E0B" /> {item.vote?.toFixed(1) || '8.0'}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes heroSpin { to { transform: rotate(360deg); } }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
