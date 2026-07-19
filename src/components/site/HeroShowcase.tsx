'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Play } from 'lucide-react';

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
}

const FALLBACK_POOL: PosterItem[] = [
  { id: 9001, title: 'Brasileirão Série A', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', vote: 9.5, type: 'Futebol', sport: true, league: 'Brasileirão', leagueFlag: '🇧🇷', leagueColor: '#009C3B' },
  { id: 9002, title: 'Champions League', poster: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80', vote: 9.8, type: 'Futebol', sport: true, league: 'Champions League', leagueFlag: '⭐', leagueColor: '#1A3A6B' },
  { id: 9003, title: 'Libertadores', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', vote: 9.3, type: 'Futebol', sport: true, league: 'Libertadores', leagueFlag: '🏆', leagueColor: '#FFD700' },
  { id: 9004, title: 'Dune: Part Two', poster: 'https://image.tmdb.org/t/p/w500/c7D6n1clBL6Vo44x2Uo599026T.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/8Z8dHFw7JVhXPSmx0yg2mtGEyeb.jpg', vote: 8.8, type: 'Filme' },
  { id: 9005, title: 'The Last of Us', poster: 'https://image.tmdb.org/t/p/w500/u3bZ62I4rj75XyH2h45a60xa4iO.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2rezQWg73XFWuKE5eZIBwJ7CBca.jpg', vote: 9.2, type: 'Série' },
  { id: 9006, title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/nCjzUi2YFo6hk6135759lG0i1Iq.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokZ86CTy6akIE5siC4L7y3IG.jpg', vote: 8.9, type: 'Filme' },
  { id: 9007, title: 'BBB 26', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80', vote: 9.0, type: 'Reality' },
  { id: 9008, title: 'House of the Dragon', poster: 'https://image.tmdb.org/t/p/w500/t9X7imfv64es3496nQ3KyIFnN5Y.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/5PN1vU2hDYO9MNJK8g5n24J6LVw.jpg', vote: 9.1, type: 'Série' },
  { id: 9009, title: 'Spider-Man: Across the Spider-Verse', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWERe8448jLLn2u11t17cgs.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2v5Jj2CnEK1YVplgPMocm7P4huC.jpg', vote: 9.0, type: 'Filme' },
];

const STATIC_BADGES = [
  { text: '🔴 Ao Vivo', color: '#E50914' },
  { text: '⭐ Estreia Hoje', color: '#009C3B' },
  { text: '🔥 Em Alta', color: '#FFD700' },
  { text: '🍿 Novo Episódio', color: '#6366F1' },
];

interface SlotState {
  item: PosterItem;
  fade: boolean;
}

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Controle de mouse e física do parallax Apple Vision Pro (amplitude super elegante)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  const [mediaPool, setMediaPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados individuais para cada elemento da composição
  const [protagonist, setProtagonist] = useState<SlotState>({ item: FALLBACK_POOL[0], fade: false });
  const [poster1, setPoster1] = useState<SlotState>({ item: FALLBACK_POOL[4], fade: false });
  const [poster2, setPoster2] = useState<SlotState>({ item: FALLBACK_POOL[5], fade: false });
  const [backdrop1, setBackdrop1] = useState<SlotState>({ item: FALLBACK_POOL[1], fade: false });
  const [backdrop2, setBackdrop2] = useState<SlotState>({ item: FALLBACK_POOL[2], fade: false });
  
  // Estado para o selo flutuante dinâmico
  const [activeBadge, setActiveBadge] = useState({ text: '🔴 Ao Vivo', color: '#E50914', fade: false });

  // Efeito lerp para o movimento do mouse
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setMouse(prev => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.05,
        y: prev.y + (targetMouse.y - prev.y) * 0.05,
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [targetMouse]);

  // Carregar e integrar pools de dados dinâmicos da API
  useEffect(() => {
    async function loadData() {
      try {
        const [tmdbRes, sportsRes] = await Promise.allSettled([
          fetch('/api/tmdb-pool').then(r => r.json()),
          fetch('/api/sports-pool').then(r => r.json())
        ]);

        let tmdbPool: PosterItem[] = [];
        let sportsPool: PosterItem[] = [];

        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.pool?.length > 0) {
          tmdbPool = tmdbRes.value.pool;
        }
        if (sportsRes.status === 'fulfilled' && sportsRes.value?.pool?.length > 0) {
          // Filtra apenas jogos de 2026
          sportsPool = sportsRes.value.pool.filter((item: any) => {
            if (item.label && item.label.includes('2025') && !item.isLive) {
              return false; // Ignora fallbacks antigos
            }
            return true;
          });
        }

        const combined = [...sportsPool, ...tmdbPool];
        const finalPool = combined.length >= 10 ? combined : FALLBACK_POOL;
        setMediaPool(finalPool);

        // Inicializar os slots com dados válidos e sem repetição
        const shuffled = [...finalPool].sort(() => Math.random() - 0.5);
        setProtagonist({ item: shuffled[0] || FALLBACK_POOL[0], fade: false });
        setPoster1({ item: shuffled[1] || FALLBACK_POOL[4], fade: false });
        setPoster2({ item: shuffled[2] || FALLBACK_POOL[5], fade: false });
        setBackdrop1({ item: shuffled[3] || FALLBACK_POOL[1], fade: false });
        setBackdrop2({ item: shuffled[4] || FALLBACK_POOL[2], fade: false });
      } catch (err) {
        console.error('Erro ao ler pools:', err);
        setMediaPool(FALLBACK_POOL);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Loop de Animação Contínua e Assíncrona (A cada 700ms - 1300ms um único elemento muda)
  useEffect(() => {
    if (mediaPool.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const performSingleSlotSwap = () => {
      // Sorteia qual slot vai mudar
      const slots = ['protagonist', 'poster1', 'poster2', 'backdrop1', 'backdrop2', 'badge'];
      const chosenSlot = slots[Math.floor(Math.random() * slots.length)];

      if (chosenSlot === 'badge') {
        setActiveBadge(prev => ({ ...prev, fade: true }));
        setTimeout(() => {
          const nextBadge = STATIC_BADGES[Math.floor(Math.random() * STATIC_BADGES.length)];
          setActiveBadge({ text: nextBadge.text, color: nextBadge.color, fade: false });
        }, 300);
      } else {
        const setter = 
          chosenSlot === 'protagonist' ? setProtagonist :
          chosenSlot === 'poster1' ? setPoster1 :
          chosenSlot === 'poster2' ? setPoster2 :
          chosenSlot === 'backdrop1' ? setBackdrop1 : setBackdrop2;

        // Dispara o fade-out com blur e scale
        setter(prev => ({ ...prev, fade: true }));

        setTimeout(() => {
          setter(prev => {
            // Acha um item aleatório que não esteja em uso
            const currentItemIds = [
              protagonist.item?.id,
              poster1.item?.id,
              poster2.item?.id,
              backdrop1.item?.id,
              backdrop2.item?.id,
            ];

            const availablePool = mediaPool.filter(item => !currentItemIds.includes(item.id));
            const newItem = availablePool.length > 0 
              ? availablePool[Math.floor(Math.random() * availablePool.length)]
              : mediaPool[Math.floor(Math.random() * mediaPool.length)];

            return { item: newItem, fade: false };
          });
        }, 350);
      }

      // Agenda o próximo swap dinâmico
      const nextDelay = 700 + Math.random() * 600; // de 700ms a 1300ms
      timeoutId = setTimeout(performSingleSlotSwap, nextDelay);
    };

    timeoutId = setTimeout(performSingleSlotSwap, 1200);
    return () => clearTimeout(timeoutId);
  }, [mediaPool, protagonist, poster1, poster2, backdrop1, backdrop2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    // Parallax refinado com pouca amplitude (efeito elegante Vision Pro)
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  };

  // Cores dinâmicas para o glow com base no protagonista ativo
  const getGlowColor = () => {
    const item = protagonist.item;
    if (!item) return 'rgba(229, 9, 20, 0.12)';
    if (item.sport) {
      if (item.league === 'Brasileirão') return 'rgba(0, 156, 59, 0.14)';
      if (item.league === 'Champions League') return 'rgba(26, 58, 107, 0.14)';
      return 'rgba(255, 215, 0, 0.10)';
    }
    if (item.type === 'Série') return 'rgba(99, 102, 241, 0.14)';
    return 'rgba(229, 9, 20, 0.12)';
  };

  const getBorderColor = () => {
    const item = protagonist.item;
    if (!item) return '#E50914';
    if (item.sport) return item.leagueColor || '#E50914';
    if (item.type === 'Série') return '#6366F1';
    return '#E50914';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTargetMouse({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        perspective: '1600px',
        transformStyle: 'preserve-3d',
        overflow: 'visible',
      }}
    >
      {/* GLOW DE FUNDO REATIVO */}
      <div style={{
        position: 'absolute', top: '40%', left: '45%',
        width: '580px', height: '580px',
        background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 68%)`,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1,
        transform: `translate(-50%, -50%) translate3d(${mouse.x * 12}px, ${mouse.y * 12}px, -100px)`,
        transition: 'transform 0.2s ease-out, background 1.2s ease',
      }} />

      {/* MÁSCARA LATERAL DE APAGAMENTO (FUSÃO DE COR) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 25,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, #07070D 0%, rgba(7,7,13,0.85) 12%, rgba(7,7,13,0.2) 30%, transparent 50%)',
      }} />

      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, color: '#A0A0B5', fontSize: 12,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          <span>Compondo direção de arte...</span>
        </div>
      )}

      {/* CENA 3D PRINCIPAL */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', zIndex: 3,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -3}deg) rotateY(${mouse.x * 4}deg)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* 1. BACKDROP LARGO ESQUERDO (Fundo Profundo) */}
        {backdrop1.item && (
          <div style={{
            position: 'absolute',
            left: '-60px',
            top: '30px',
            width: '290px',
            height: '160px',
            zIndex: 2,
            opacity: backdrop1.fade ? 0 : 0.22,
            filter: `blur(${backdrop1.fade ? '12px' : '4px'})`,
            transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -14}px, -180px) rotate(-3deg) scale(${backdrop1.fade ? 0.95 : 1})`,
            transition: 'opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}>
            <img 
              src={backdrop1.item.backdrop || backdrop1.item.poster || ''} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        {/* 2. BACKDROP LARGO DIREITO (Fundo Profundo) */}
        {backdrop2.item && (
          <div style={{
            position: 'absolute',
            left: '320px',
            top: '220px',
            width: '270px',
            height: '150px',
            zIndex: 3,
            opacity: backdrop2.fade ? 0 : 0.24,
            filter: `blur(${backdrop2.fade ? '12px' : '5px'})`,
            transform: `translate3d(${mouse.x * -10}px, ${mouse.y * -10}px, -140px) rotate(4deg) scale(${backdrop2.fade ? 0.95 : 1})`,
            transition: 'opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}>
            <img 
              src={backdrop2.item.backdrop || backdrop2.item.poster || ''} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        {/* 3. POSTER MÉDIO ESQUERDO (Atrás à Esquerda) */}
        {poster1.item && (
          <div style={{
            position: 'absolute',
            left: '50px',
            top: '110px',
            width: '125px',
            height: '185px',
            zIndex: 5,
            opacity: poster1.fade ? 0 : 0.5,
            filter: `blur(${poster1.fade ? '10px' : '1px'})`,
            transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, -50px) rotate(-6deg) scale(${poster1.fade ? 0.95 : 1})`,
            transition: 'opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          }}>
            <img 
              src={poster1.item.poster || ''} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        {/* 4. POSTER MÉDIO DIREITO (Atrás à Direita) */}
        {poster2.item && (
          <div style={{
            position: 'absolute',
            left: '390px',
            top: '65px',
            width: '115px',
            height: '172px',
            zIndex: 6,
            opacity: poster2.fade ? 0 : 0.55,
            filter: `blur(${poster2.fade ? '10px' : '1px'})`,
            transform: `translate3d(${mouse.x * 9}px, ${mouse.y * 9}px, -30px) rotate(8deg) scale(${poster2.fade ? 0.95 : 1})`,
            transition: 'opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          }}>
            <img 
              src={poster2.item.poster || ''} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        {/* 5. SELO ANIMADO FLUTUANTE (Orbitando o principal) */}
        <div style={{
          position: 'absolute',
          left: '360px',
          top: '25px',
          zIndex: 12,
          opacity: activeBadge.fade ? 0 : 0.95,
          transform: `translate3d(${mouse.x * 16}px, ${mouse.y * 16}px, 90px) scale(${activeBadge.fade ? 0.8 : 1})`,
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{
            background: activeBadge.color,
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {activeBadge.text}
          </div>
        </div>

        {/* 6. PROTAGONISTA CENTRAL (Destaque Proeminente) */}
        {protagonist.item && (
          <div
            style={{
              position: 'absolute',
              left: '160px',
              top: '40px',
              width: '260px',
              height: '370px',
              zIndex: 10,
              opacity: protagonist.fade ? 0.3 : 1,
              filter: `blur(${protagonist.fade ? '8px' : '0px'})`,
              transform: `translate3d(${mouse.x * -20}px, ${mouse.y * -20}px, 40px) scale(${protagonist.fade ? 0.96 : 1})`,
              transition: 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.8s ease, box-shadow 0.8s ease',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `2px solid ${getBorderColor()}b0`,
              boxShadow: `0 30px 70px ${getBorderColor()}18, 0 25px 60px rgba(0,0,0,0.85)`,
            }}
          >
            {/* Brilho interno */}
            <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 35px ${getBorderColor()}25`, zIndex: 3, pointerEvents: 'none' }} />

            {/* Imagem de Destaque */}
            <img
              src={protagonist.item.poster || protagonist.item.backdrop || ''}
              alt={protagonist.item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Selo e Info Box Inferior */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
              background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.6) 65%, transparent 100%)',
              padding: '14px 16px', fontFamily: 'Outfit, sans-serif',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: protagonist.item.sport ? `${protagonist.item.leagueColor}20` : 'rgba(229,9,20,0.12)',
                color: protagonist.item.sport ? (protagonist.item.leagueColor || '#009C3B') : '#E50914',
                padding: '2px 7px', borderRadius: 99, fontSize: 8, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                border: `1px solid ${protagonist.item.sport ? (protagonist.item.leagueColor || '#009C3B') : '#E50914'}35`,
                marginBottom: 5,
              }}>
                {protagonist.item.isLive ? '🔴 Ao Vivo' : protagonist.item.label || 'Destaque'}
              </span>

              <h3 style={{
                fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                letterSpacing: '-0.01em',
              }}>
                {protagonist.item.title}
              </h3>

              <p style={{ fontSize: 10, color: '#A0A0B5', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{protagonist.item.league || protagonist.item.type}</span>
                <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#A0A0B5' }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                  <Star size={9} fill="#F59E0B" color="#F59E0B" /> {protagonist.item.vote?.toFixed(1) || '9.0'}/10
                </span>
              </p>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
