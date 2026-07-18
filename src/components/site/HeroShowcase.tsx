'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, Star } from 'lucide-react';

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

type SlotState = { current: PosterItem; next: PosterItem | null; fade: boolean };

const SPORT_BACKDROPS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&q=85',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=85',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=85',
  'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=1200&q=85',
];

const FALLBACK_POOL: PosterItem[] = [
  { id: 9001, title: 'Brasileirão Série A', poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', backdrop: SPORT_BACKDROPS[0], vote: 9.5, type: 'Futebol', sport: true, league: 'Brasileirão', leagueFlag: '🇧🇷', leagueColor: '#009C3B' },
  { id: 9002, title: 'Champions League', poster: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', backdrop: SPORT_BACKDROPS[1], vote: 9.8, type: 'Futebol', sport: true, league: 'Champions League', leagueFlag: '⭐', leagueColor: '#1A3A6B' },
  { id: 9003, title: 'Libertadores', poster: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80', backdrop: SPORT_BACKDROPS[2], vote: 9.3, type: 'Futebol', sport: true, league: 'Libertadores', leagueFlag: '🏆', leagueColor: '#FFD700' },
  { id: 9004, title: 'Dune: Part Two', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80', vote: 8.8, type: 'Filme' },
  { id: 9005, title: 'The Last of Us', poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=1200&q=80', vote: 9.2, type: 'Série' },
  { id: 9006, title: 'Interstellar', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80', vote: 8.9, type: 'Filme' },
  { id: 9007, title: 'BBB 26', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80', vote: 9.0, type: 'Reality' },
];

const mkSlot = (item: PosterItem): SlotState => ({ current: item, next: null, fade: false });

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });
  const [mediaPool, setMediaPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [slotBackdrop, setSlotBackdrop] = useState<SlotState>(mkSlot(FALLBACK_POOL[0]));
  const [slotProtagonist, setSlotProtagonist] = useState<SlotState>(mkSlot(FALLBACK_POOL[1]));
  const [slotSideLeft, setSlotSideLeft] = useState<SlotState>(mkSlot(FALLBACK_POOL[2]));
  const [slotSideRight, setSlotSideRight] = useState<SlotState>(mkSlot(FALLBACK_POOL[3]));
  const [slotFrontOverflow, setSlotFrontOverflow] = useState<SlotState>(mkSlot(FALLBACK_POOL[4]));

  const [widgetText, setWidgetText] = useState('🔥 Novo episódio no ar');
  const [widgetVisible, setWidgetVisible] = useState(true);

  // Suavização do mouse (lerp)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setMouse(prev => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.08,
        y: prev.y + (targetMouse.y - prev.y) * 0.08,
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [targetMouse]);

  // ============================================================
  // CARREGAMENTO COMBINADO: TMDB + API-FOOTBALL
  // ============================================================
  useEffect(() => {
    async function loadPool() {
      try {
        const [tmdbRes, sportsRes] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json()),
        ]);

        let tmdbPool: PosterItem[] = [];
        let sportsPool: PosterItem[] = [];

        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.pool?.length > 0) {
          tmdbPool = tmdbRes.value.pool;
        }
        if (sportsRes.status === 'fulfilled' && sportsRes.value?.pool?.length > 0) {
          sportsPool = sportsRes.value.pool;
        }

        // Pool combinado: esportes primeiro (maior prioridade visual)
        const combined: PosterItem[] = [...sportsPool, ...tmdbPool];
        const pool = combined.length > 5 ? combined : FALLBACK_POOL;

        setMediaPool(pool);
        initSlots(pool, sportsPool);
      } catch {
        setMediaPool(FALLBACK_POOL);
        initSlots(FALLBACK_POOL, []);
      } finally {
        setLoading(false);
      }
    }
    loadPool();
  }, []);

  const initSlots = (pool: PosterItem[], sportsPool: PosterItem[]) => {
    // Protagonista: jogo ao vivo > próximo jogo > filme/série em destaque
    const liveGame = sportsPool.find(m => m.isLive);
    const protagonist = liveGame || sportsPool[0] || pool[0];
    const rest = pool.filter(m => m.id !== protagonist.id);

    setSlotProtagonist(mkSlot(protagonist));
    setSlotBackdrop(mkSlot(rest[0] ?? FALLBACK_POOL[0]));
    setSlotSideLeft(mkSlot(rest[1] ?? FALLBACK_POOL[1]));
    setSlotSideRight(mkSlot(rest[2] ?? FALLBACK_POOL[2]));
    setSlotFrontOverflow(mkSlot(rest[3] ?? FALLBACK_POOL[3]));
  };

  // Helper para trocar um slot com animação
  const swapSlot = (
    setter: React.Dispatch<React.SetStateAction<SlotState>>,
    pool: PosterItem[],
    currentId: number,
    delay = 600
  ) => {
    const available = pool.filter(m => m.id !== currentId);
    const next = available[Math.floor(Math.random() * available.length)] || pool[0];
    setter(prev => ({ ...prev, fade: true }));
    setTimeout(() => {
      setter({ current: next, next: null, fade: false });
    }, delay);
  };

  // Protagonista: troca a cada 12s
  useEffect(() => {
    if (!mediaPool.length) return;
    const interval = setInterval(() => {
      swapSlot(setSlotProtagonist, mediaPool, slotProtagonist.current.id, 800);
    }, 12000);
    return () => clearInterval(interval);
  }, [mediaPool, slotProtagonist.current.id]);

  // Backdrop: troca a cada 24s
  useEffect(() => {
    if (!mediaPool.length) return;
    const interval = setInterval(() => {
      swapSlot(setSlotBackdrop, mediaPool, slotBackdrop.current.id, 1000);
    }, 24000);
    return () => clearInterval(interval);
  }, [mediaPool, slotBackdrop.current.id]);

  // Slots secundários: independentes
  useEffect(() => {
    if (!mediaPool.length) return;
    const iL = setInterval(() => swapSlot(setSlotSideLeft, mediaPool, slotSideLeft.current.id), 4000);
    const iR = setInterval(() => swapSlot(setSlotSideRight, mediaPool, slotSideRight.current.id), 7000);
    const iF = setInterval(() => swapSlot(setSlotFrontOverflow, mediaPool, slotFrontOverflow.current.id), 10000);
    return () => { clearInterval(iL); clearInterval(iR); clearInterval(iF); };
  }, [mediaPool, slotSideLeft.current.id, slotSideRight.current.id, slotFrontOverflow.current.id]);

  // Widget rotativo
  useEffect(() => {
    const list = [
      '🔥 Lançamento no Premiere',
      '⚽ Brasileirão ao vivo hoje',
      '🎬 Estreia no streaming',
      '🏆 Champions League — Oitavas',
      '⭐ Libertadores 2025 em alta',
      '📺 BBB 26 — Paredão hoje',
    ];
    const interval = setInterval(() => {
      setWidgetVisible(false);
      setTimeout(() => {
        setWidgetText(list[Math.floor(Math.random() * list.length)]);
        setWidgetVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  };

  // Helper para renderizar uma imagem com cross-fade
  const renderImg = (slot: SlotState, main = false) => {
    const src = slot.current.sport
      ? (slot.current.backdrop || slot.current.poster || '')
      : (slot.current.poster || '');

    return (
      <>
        <img
          src={src}
          alt={slot.current.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: slot.fade ? 0.2 : 1,
            filter: slot.fade ? 'blur(12px)' : 'none',
            transform: `scale(${slot.fade ? 0.96 : 1})`,
            transition: `all ${main ? 0.8 : 0.6}s cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        />
        {slot.next && (
          <img
            src={slot.next.sport ? (slot.next.backdrop || slot.next.poster || '') : (slot.next.poster || '')}
            alt=""
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: slot.fade ? 1 : 0,
              filter: slot.fade ? 'none' : 'blur(12px)',
              transition: `all ${main ? 0.8 : 0.6}s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          />
        )}
      </>
    );
  };

  const protagonist = slotProtagonist.current;
  const borderColor = protagonist.sport ? (protagonist.leagueColor || '#E50914') : '#E50914';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTargetMouse({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        background: '#040408',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.03)',
        perspective: '1400px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Luz volumétrica */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: '600px', height: '600px',
        background: `radial-gradient(circle, ${protagonist.sport ? 'rgba(0,156,59,0.16)' : 'rgba(229,9,20,0.14)'} 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1,
        transform: `translate(-50%,-50%) translate3d(${mouse.x * 20}px,${mouse.y * 20}px,-150px) scale(1.3)`,
        transition: 'transform 0.12s ease-out, background 1s ease',
      }} />

      {/* Grade de partículas */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '36px 36px', opacity: 0.5, pointerEvents: 'none', zIndex: 2,
        transform: `translate3d(${mouse.x * 15}px,${mouse.y * 15}px,-80px)`,
        transition: 'transform 0.12s ease-out',
      }} />

      {/* Vinheta que funde bordas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15,
        pointerEvents: 'none', borderRadius: '24px',
        background: `
          linear-gradient(to right, #040408 0%, transparent 20%, transparent 80%, #040408 100%),
          linear-gradient(to bottom, #040408 0%, transparent 18%, transparent 82%, #040408 100%)
        `,
      }} />

      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: '#040408', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, color: '#A0A0B5', fontSize: 13,
        }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          Carregando entretenimento...
        </div>
      )}

      {/* SCENE 3D */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', zIndex: 3,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -8}deg) rotateY(${mouse.x * 8}deg)`,
        transition: 'transform 0.18s ease-out',
      }}>

        {/* CAMADA 0: BACKDROP ATMOSFÉRICO */}
        <div style={{
          position: 'absolute', left: '-5%', top: '-5%', width: '110%', height: '110%',
          opacity: 0.25, zIndex: 1, pointerEvents: 'none',
          transform: `translate3d(${mouse.x * -8}px,${mouse.y * -8}px,-180px)`,
          transition: 'transform 0.18s ease-out',
        }}>
          <img
            src={slotBackdrop.current.backdrop || slotBackdrop.current.poster || ''}
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px) contrast(1.15)', transition: 'opacity 1s ease' }}
          />
        </div>

        {/* CAMADA 1: POSTER ESQUERDO */}
        <div style={{
          position: 'absolute', left: '-8%', top: '12%', width: '28%', height: '65%',
          zIndex: 2, borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          transform: `translate3d(${mouse.x * -24}px,${mouse.y * -24}px,-80px) rotateY(15deg) rotateZ(3deg)`,
          transition: 'transform 0.18s ease-out', pointerEvents: 'none',
        }}>
          {renderImg(slotSideLeft)}
        </div>

        {/* CAMADA 2: POSTER SUPERIOR DIREITO */}
        <div style={{
          position: 'absolute', right: '-5%', top: '-5%', width: '32%', height: '60%',
          zIndex: 3, borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
          transform: `translate3d(${mouse.x * -20}px,${mouse.y * -20}px,-50px) rotateY(-18deg) rotateZ(-4deg)`,
          transition: 'transform 0.18s ease-out', pointerEvents: 'none',
        }}>
          {renderImg(slotSideRight)}
        </div>

        {/* CAMADA 3: PROTAGONISTA GIGANTE */}
        <div style={{
          position: 'absolute', left: '26%', top: '6%', width: '45%', height: '86%',
          zIndex: 10, borderRadius: '20px', overflow: 'hidden',
          border: `2px solid ${borderColor}aa`,
          boxShadow: `0 30px 90px ${borderColor}40, 0 35px 80px rgba(0,0,0,0.95)`,
          transform: `translate3d(${mouse.x * -40}px,${mouse.y * -40}px,60px) rotateY(-4deg) rotateX(2deg)`,
          transition: 'transform 0.18s ease-out, border-color 0.8s ease, box-shadow 0.8s ease',
        }}>
          <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 40px ${borderColor}40`, zIndex: 3, pointerEvents: 'none' }} />

          {/* Para jogos de futebol: backdrop de estádio */}
          {protagonist.sport && protagonist.backdrop ? (
            <img
              src={protagonist.backdrop}
              alt={protagonist.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: slotProtagonist.fade ? 0.2 : 1,
                filter: slotProtagonist.fade ? 'blur(15px)' : 'none',
                transform: `scale(${slotProtagonist.fade ? 0.95 : 1})`,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ) : (
            <img
              src={protagonist.poster || ''}
              alt={protagonist.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: slotProtagonist.fade ? 0.2 : 1,
                filter: slotProtagonist.fade ? 'blur(15px)' : 'none',
                transform: `scale(${slotProtagonist.fade ? 0.95 : 1})`,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          )}

          {/* Para jogos de futebol: overlay com logos dos times */}
          {protagonist.sport && (protagonist.homeTeam || protagonist.league) && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8,
            }}>
              {protagonist.homeTeam && protagonist.awayTeam ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <img src={protagonist.homeTeam.logo} alt={protagonist.homeTeam.name} style={{ width: 52, height: 52, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }} />
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, fontFamily: 'Outfit', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>×</span>
                  <img src={protagonist.awayTeam.logo} alt={protagonist.awayTeam.name} style={{ width: 52, height: 52, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }} />
                </div>
              ) : protagonist.leagueFlag && (
                <span style={{ fontSize: 52, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.9))' }}>{protagonist.leagueFlag}</span>
              )}
            </div>
          )}

          {/* Letreiro inferior */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
            background: 'linear-gradient(to top, rgba(4,4,8,0.97) 0%, rgba(4,4,8,0.6) 60%, transparent 100%)',
            padding: '16px 18px', fontFamily: 'Outfit, sans-serif',
          }}>
            {/* Badge dinâmico */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: protagonist.sport ? `${protagonist.leagueColor}25` : 'rgba(229,9,20,0.15)',
              color: protagonist.sport ? (protagonist.leagueColor || '#009C3B') : '#E50914',
              padding: '3px 8px', borderRadius: 99, fontSize: 9, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              border: `1px solid ${protagonist.sport ? (protagonist.leagueColor || '#009C3B') : '#E50914'}50`,
              marginBottom: 6,
            }}>
              {protagonist.isLive && (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: 'ping 1s infinite' }} />
              )}
              {protagonist.isLive ? '🔴 Ao Vivo' : protagonist.label || 'Destaque Principal'}
            </span>

            <h3 style={{
              fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}>
              {protagonist.title}
            </h3>

            <p style={{ fontSize: 11, color: '#A0A0B5', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{protagonist.league || protagonist.type}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#A0A0B5' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#F59E0B' }}>
                <Star size={10} fill="#F59E0B" /> {protagonist.vote?.toFixed(1)}/10
              </span>
            </p>
          </div>
        </div>

        {/* CAMADA 4: FRONTAL OVERFLOW */}
        <div style={{
          position: 'absolute', right: '-8%', bottom: '-12%', width: '30%', height: '62%',
          zIndex: 12, borderRadius: '16px', overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.95)',
          transform: `translate3d(${mouse.x * -52}px,${mouse.y * -52}px,120px) rotateY(-10deg) rotateZ(5deg)`,
          transition: 'transform 0.18s ease-out', pointerEvents: 'none',
        }}>
          {renderImg(slotFrontOverflow)}
        </div>

      </div>

      {/* WIDGET FLUTUANTE */}
      <div style={{
        position: 'absolute', left: '26%', top: '80%', zIndex: 20,
        opacity: widgetVisible ? 0.96 : 0,
        transform: widgetVisible
          ? `translate3d(${mouse.x * -45}px,${mouse.y * -45}px,100px) scale(1)`
          : `translate3d(${mouse.x * -45}px,${mouse.y * -45}px,100px) scale(0.9) translateY(4px)`,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10,10,18,0.88)', backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(229,9,20,0.45)', borderRadius: '12px',
          padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8,
          color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 11,
          boxShadow: '0 8px 24px rgba(229,9,20,0.2)',
        }}>
          <Flame size={12} fill="#E50914" color="#E50914" />
          <span>{widgetText}</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
      `}</style>
    </div>
  );
}
