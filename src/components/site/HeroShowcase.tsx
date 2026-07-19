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

const FALLBACK_POOL: PosterItem[] = [
  { id: 9004, title: 'Dune: Part Two', poster: 'https://image.tmdb.org/t/p/w500/c7D6n1clBL6Vo44x2Uo599026T.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/8Z8dHFw7JVhXPSmx0yg2mtGEyeb.jpg', vote: 8.8, type: 'Filme' },
  { id: 9005, title: 'The Last of Us', poster: 'https://image.tmdb.org/t/p/w500/u3bZ62I4rj75XyH2h45a60xa4iO.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2rezQWg73XFWuKE5eZIBwJ7CBca.jpg', vote: 9.2, type: 'Série' },
  { id: 9006, title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/nCjzUi2YFo6hk6135759lG0i1Iq.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokZ86CTy6akIE5siC4L7y3IG.jpg', vote: 8.9, type: 'Filme' },
  { id: 9008, title: 'House of the Dragon', poster: 'https://image.tmdb.org/t/p/w500/t9X7imfv64es3496nQ3KyIFnN5Y.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/5PN1vU2hDYO9MNJK8g5n24J6LVw.jpg', vote: 9.1, type: 'Série' },
  { id: 9009, title: 'Spider-Man: Across the Spider-Verse', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWERe8448jLLn2u11t17cgs.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2v5Jj2CnEK1YVplgPMocm7P4huC.jpg', vote: 9.0, type: 'Filme' },
  { id: 9001, title: 'Brasileirão Série A', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', vote: 9.5, type: 'Futebol', sport: true, league: 'Brasileirão', leagueFlag: '🇧🇷', leagueColor: '#009C3B' },
  { id: 9002, title: 'Champions League', poster: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80', vote: 9.8, type: 'Futebol', sport: true, league: 'Champions League', leagueFlag: '⭐', leagueColor: '#1A3A6B' },
  { id: 9003, title: 'Libertadores', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', vote: 9.3, type: 'Futebol', sport: true, league: 'Libertadores', leagueFlag: '🏆', leagueColor: '#FFD700' },
  { id: 9007, title: 'BBB 26', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80', vote: 9.0, type: 'Reality' },
  { id: 9010, title: 'Oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg', vote: 8.5, type: 'Filme' },
];

/* ─────────────────────────────────────────────
   Layout estático dos 5 cards visíveis:
   ─ 1 protagonista central grande
   ─ 2 médios atrás (esquerda e direita)
   ─ 2 menores nas bordas mais afastadas
   Todos sempre visíveis. Transições individuais.
   ───────────────────────────────────────────── */

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });
  const [mediaPool, setMediaPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 5 slots de cards simultâneos, cada um com sua própria transição
  const [slots, setSlots] = useState<PosterItem[]>([
    FALLBACK_POOL[0], FALLBACK_POOL[1], FALLBACK_POOL[2], FALLBACK_POOL[3], FALLBACK_POOL[4]
  ]);
  const [fading, setFading] = useState<boolean[]>([false, false, false, false, false]);

  // Parallax lerp suave (Apple Vision Pro)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setMouse(prev => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.06,
        y: prev.y + (targetMouse.y - prev.y) * 0.06,
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [targetMouse]);

  // Carregar pool dinâmico das APIs
  useEffect(() => {
    async function loadPool() {
      try {
        const [tmdbRes, sportsRes] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json()),
        ]);

        let pool: PosterItem[] = [];

        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.pool?.length > 0) {
          pool.push(...tmdbRes.value.pool);
        }
        if (sportsRes.status === 'fulfilled' && sportsRes.value?.pool?.length > 0) {
          pool.push(...sportsRes.value.pool);
        }

        const finalPool = pool.length >= 8 ? pool : FALLBACK_POOL;
        setMediaPool(finalPool);

        // Preencher os 5 slots iniciais sem repetição
        const shuffled = [...finalPool].sort(() => Math.random() - 0.5);
        setSlots([
          shuffled[0] || FALLBACK_POOL[0],
          shuffled[1] || FALLBACK_POOL[1],
          shuffled[2] || FALLBACK_POOL[2],
          shuffled[3] || FALLBACK_POOL[3],
          shuffled[4] || FALLBACK_POOL[4],
        ]);
      } catch {
        setMediaPool(FALLBACK_POOL);
      } finally {
        setLoading(false);
      }
    }
    loadPool();
  }, []);

  // Rotação contínua e assíncrona — a cada 800–1400ms troca UM card
  useEffect(() => {
    if (mediaPool.length === 0) return;
    let timeoutId: NodeJS.Timeout;

    const swapOneSlot = () => {
      const idx = Math.floor(Math.random() * 5);

      // Fase 1: fade-out
      setFading(prev => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });

      // Fase 2: trocar conteúdo e fade-in
      setTimeout(() => {
        setSlots(prev => {
          const currentIds = prev.map(s => s.id);
          const available = mediaPool.filter(m => !currentIds.includes(m.id));
          const newItem = available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : mediaPool[Math.floor(Math.random() * mediaPool.length)];
          const next = [...prev];
          next[idx] = newItem;
          return next;
        });
        setFading(prev => {
          const next = [...prev];
          next[idx] = false;
          return next;
        });
      }, 400);

      timeoutId = setTimeout(swapOneSlot, 800 + Math.random() * 600);
    };

    timeoutId = setTimeout(swapOneSlot, 1500);
    return () => clearTimeout(timeoutId);
  }, [mediaPool]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  }, []);

  // Determina a cor de borda e glow para o card protagonista
  const proto = slots[0];
  const borderColor = proto?.sport ? (proto.leagueColor || '#E50914') : proto?.type === 'Série' ? '#6366F1' : '#E50914';
  const glowColor = proto?.sport
    ? `${proto.leagueColor || '#009C3B'}22`
    : proto?.type === 'Série' ? 'rgba(99,102,241,0.13)' : 'rgba(229,9,20,0.12)';

  /* ── Helpers para renderizar cada card ─────── */
  function renderCard(item: PosterItem, isFading: boolean, style: React.CSSProperties, isProtagonist = false) {
    if (!item) return null;
    const img = item.poster || item.backdrop || '';
    const bColor = isProtagonist ? borderColor : 'rgba(255,255,255,0.06)';
    
    return (
      <div style={{
        position: 'absolute',
        borderRadius: isProtagonist ? 14 : 10,
        overflow: 'hidden',
        border: isProtagonist ? `2px solid ${bColor}b0` : `1px solid ${bColor}`,
        boxShadow: isProtagonist
          ? `0 30px 70px ${borderColor}18, 0 20px 50px rgba(0,0,0,0.85)`
          : '0 12px 35px rgba(0,0,0,0.6)',
        opacity: isFading ? 0 : 1,
        filter: isFading ? 'blur(8px)' : 'blur(0px)',
        transition: 'opacity 0.45s ease, filter 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        ...style,
      }}>
        <img src={img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

        {/* Overlay inferior com info no protagonista e nos médios */}
        {(isProtagonist || style.zIndex === 7 || style.zIndex === 6) && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.5) 60%, transparent 100%)',
            padding: isProtagonist ? '14px 14px 12px' : '8px 10px 8px',
            fontFamily: 'Outfit, sans-serif',
          }}>
            {/* Badge de tipo */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: item.sport ? `${item.leagueColor || '#009C3B'}20` : item.type === 'Série' ? 'rgba(99,102,241,0.15)' : 'rgba(229,9,20,0.12)',
              color: item.sport ? (item.leagueColor || '#009C3B') : item.type === 'Série' ? '#818CF8' : '#E50914',
              padding: '2px 6px', borderRadius: 99,
              fontSize: isProtagonist ? 8 : 7, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              border: `1px solid ${item.sport ? (item.leagueColor || '#009C3B') : item.type === 'Série' ? '#6366F1' : '#E50914'}30`,
              marginBottom: isProtagonist ? 4 : 2,
            }}>
              {item.isLive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E50914', display: 'inline-block', animation: 'livePulse 1.5s ease-in-out infinite' }} />}
              {item.sport ? (item.isLive ? 'Ao Vivo' : item.league || 'Futebol') : item.type}
            </span>

            <h4 style={{
              fontSize: isProtagonist ? 15 : 11,
              fontWeight: 800, color: '#fff', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.01em', lineHeight: 1.3,
            }}>
              {item.title}
            </h4>

            {isProtagonist && (
              <p style={{ fontSize: 10, color: '#A0A0B5', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{item.league || item.type}</span>
                <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#555' }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                  <Star size={9} fill="#F59E0B" color="#F59E0B" /> {item.vote?.toFixed(1) || '8.0'}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTargetMouse({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        overflow: 'visible',
      }}
    >
      {/* Glow de fundo reativo */}
      <div style={{
        position: 'absolute', top: '42%', left: '42%',
        width: 520, height: 520,
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
        transform: `translate(-50%,-50%) translate3d(${mouse.x * 8}px, ${mouse.y * 8}px, -80px)`,
        transition: 'background 1s ease',
      }} />

      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, color: '#A0A0B5', fontSize: 12,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          Carregando...
        </div>
      )}

      {/* Cena 3D com rotação suave de mouse */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', zIndex: 2,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -2.5}deg) rotateY(${mouse.x * 3.5}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Slot 4 — Card pequeno extrema esquerda (parcialmente cortado) */}
        {renderCard(slots[3], fading[3], {
          left: '-30px',
          top: '180px',
          width: 88,
          height: 130,
          zIndex: 3,
          transform: `translate3d(${mouse.x * -5}px, ${mouse.y * -5}px, -100px) rotate(-4deg)`,
        })}

        {/* Slot 4 — Card pequeno extrema direita */}
        {renderCard(slots[4], fading[4], {
          left: '430px',
          top: '40px',
          width: 92,
          height: 136,
          zIndex: 3,
          transform: `translate3d(${mouse.x * -4}px, ${mouse.y * -4}px, -90px) rotate(5deg)`,
        })}

        {/* Slot 1 — Card médio esquerdo */}
        {renderCard(slots[1], fading[1], {
          left: '20px',
          top: '80px',
          width: 130,
          height: 192,
          zIndex: 6,
          transform: `translate3d(${mouse.x * 5}px, ${mouse.y * 5}px, -40px) rotate(-5deg)`,
        })}

        {/* Slot 2 — Card médio direito */}
        {renderCard(slots[2], fading[2], {
          left: '350px',
          top: '130px',
          width: 125,
          height: 185,
          zIndex: 7,
          transform: `translate3d(${mouse.x * 7}px, ${mouse.y * 7}px, -20px) rotate(6deg)`,
        })}

        {/* Slot 0 — PROTAGONISTA CENTRAL (grande, dominante) */}
        {renderCard(slots[0], fading[0], {
          left: '110px',
          top: '30px',
          width: 260,
          height: 370,
          zIndex: 10,
          transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -14}px, 50px)`,
        }, true)}

      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
