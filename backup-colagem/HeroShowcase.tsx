'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, Star, Play, Tv, Shield } from 'lucide-react';

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

// Imagens de fallback de futebol de alta qualidade (estádios, torcidas)
const SPORT_BACKDROPS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
];

const FALLBACK_POOL: PosterItem[] = [
  { id: 9001, title: 'Brasileirão Série A', poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', backdrop: SPORT_BACKDROPS[0], vote: 9.5, type: 'Futebol', sport: true, league: 'Brasileirão', leagueFlag: '🇧🇷', leagueColor: '#009C3B' },
  { id: 9002, title: 'Champions League', poster: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', backdrop: SPORT_BACKDROPS[1], vote: 9.8, type: 'Futebol', sport: true, league: 'Champions League', leagueFlag: '⭐', leagueColor: '#1A3A6B' },
  { id: 9003, title: 'Libertadores', poster: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80', backdrop: SPORT_BACKDROPS[2], vote: 9.3, type: 'Futebol', sport: true, league: 'Libertadores', leagueFlag: '🏆', leagueColor: '#FFD700' },
  { id: 9004, title: 'Dune: Part Two', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80', vote: 8.8, type: 'Filme' },
  { id: 9005, title: 'The Last of Us', poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=1200&q=80', vote: 9.2, type: 'Série' },
  { id: 9006, title: 'Interstellar', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80', vote: 8.9, type: 'Filme' },
  { id: 9007, title: 'BBB 26', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80', vote: 9.0, type: 'Reality' },
  { id: 9008, title: 'House of the Dragon', poster: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=1200&q=80', vote: 9.1, type: 'Série' },
  { id: 9009, title: 'Spider-Man: Across the Spider-Verse', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&q=80', backdrop: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&q=80', vote: 9.0, type: 'Filme' },
];

// Configuração estática dos slots flutuantes (Posições, escalas, rotações e profundidades 3D)
// Distribuição caótica que se projeta para fora do contêiner e invade a área do texto (lado esquerdo)
const SLOT_CONFIGS = [
  // Pôsteres Verticais
  { id: 1, left: '-20px', top: '15%', width: '100px', height: '145px', zIndex: 12, rotate: '12deg', translateZ: '30px', opacity: 0.65, type: 'poster' },
  { id: 2, left: '110px', top: '-10px', width: '115px', height: '165px', zIndex: 14, rotate: '-8deg', translateZ: '50px', opacity: 0.8, type: 'poster' },
  { id: 3, left: '260px', top: '55%', width: '105px', height: '155px', zIndex: 11, rotate: '14deg', translateZ: '20px', opacity: 0.75, type: 'poster' },
  { id: 4, left: '460px', top: '35%', width: '120px', height: '175px', zIndex: 15, rotate: '-6deg', translateZ: '80px', opacity: 0.85, type: 'poster' },
  { id: 5, left: '590px', top: '-20px', width: '110px', height: '160px', zIndex: 7, rotate: '10deg', translateZ: '-30px', opacity: 0.55, type: 'poster' },
  { id: 6, left: '690px', top: '45%', width: '125px', height: '180px', zIndex: 13, rotate: '-12deg', translateZ: '40px', opacity: 0.8, type: 'poster' },
  { id: 7, left: '830px', top: '10%', width: '105px', height: '150px', zIndex: 8, rotate: '8deg', translateZ: '-10px', opacity: 0.6, type: 'poster' },

  // Backdrops Horizontais
  { id: 8, left: '160px', top: '48%', width: '160px', height: '90px', zIndex: 9, rotate: '-4deg', translateZ: '10px', opacity: 0.7, type: 'backdrop' },
  { id: 9, left: '400px', top: '5%', width: '180px', height: '101px', zIndex: 10, rotate: '5deg', translateZ: '30px', opacity: 0.75, type: 'backdrop' },
  { id: 10, left: '730px', top: '15%', width: '150px', height: '84px', zIndex: 6, rotate: '-8deg', translateZ: '-50px', opacity: 0.5, type: 'backdrop' },

  // Selos, Widgets e Logos flutuantes
  { id: 11, left: '70px', top: '38%', zIndex: 25, rotate: '-5deg', translateZ: '100px', opacity: 0.9, type: 'badge-live' },
  { id: 12, left: '220px', top: '18%', zIndex: 26, rotate: '6deg', translateZ: '110px', opacity: 0.9, type: 'badge-rating' },
  { id: 13, left: '580px', top: '32%', zIndex: 24, rotate: '-10deg', translateZ: '90px', opacity: 0.85, type: 'badge-platform' },
  { id: 14, left: '380px', top: '52%', zIndex: 23, rotate: '8deg', translateZ: '70px', opacity: 0.85, type: 'badge-tag' },
  { id: 15, left: '780px', top: '40%', zIndex: 27, rotate: '15deg', translateZ: '120px', opacity: 0.9, type: 'badge-4k' },
];

export default function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Controle de mouse e física do parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  const [mediaPool, setMediaPool] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos slots e protagonista
  const [protagonist, setProtagonist] = useState<PosterItem>(FALLBACK_POOL[0]);
  const [protagonistFade, setProtagonistFade] = useState(false);
  const [slotsData, setSlotsData] = useState<Record<number, PosterItem>>({});
  const [transitioningSlots, setTransitioningSlots] = useState<Record<number, boolean>>({});

  // Efeito lerp para o movimento do mouse
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

  // Carregamento dos dados das APIs
  useEffect(() => {
    async function fetchAllPools() {
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

        const combined = [...sportsPool, ...tmdbPool];
        const finalPool = combined.length > 5 ? combined : FALLBACK_POOL;
        
        setMediaPool(finalPool);

        // Inicializar slots de forma aleatória sem repetições
        const liveGame = sportsPool.find(m => m.isLive);
        const initialProtagonist = liveGame || sportsPool[0] || finalPool[0];
        setProtagonist(initialProtagonist);

        const assignments: Record<number, PosterItem> = {};
        const availablePool = finalPool.filter(m => m.id !== initialProtagonist.id);
        
        SLOT_CONFIGS.forEach((config) => {
          if (availablePool.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePool.length);
            assignments[config.id] = availablePool[randomIndex];
            // Remove para evitar repetição direta inicial
            availablePool.splice(randomIndex, 1);
          } else {
            assignments[config.id] = finalPool[Math.floor(Math.random() * finalPool.length)];
          }
        });

        setSlotsData(assignments);
      } catch {
        setMediaPool(FALLBACK_POOL);
        setProtagonist(FALLBACK_POOL[0]);
        const assignments: Record<number, PosterItem> = {};
        SLOT_CONFIGS.forEach((config, idx) => {
          assignments[config.id] = FALLBACK_POOL[(idx + 1) % FALLBACK_POOL.length];
        });
        setSlotsData(assignments);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPools();
  }, []);

  // 1. Protagonista: troca a cada 12 segundos com transição de fade suave
  useEffect(() => {
    if (!mediaPool.length) return;
    const interval = setInterval(() => {
      setProtagonistFade(true);
      setTimeout(() => {
        const available = mediaPool.filter(m => m.id !== protagonist.id);
        const next = available[Math.floor(Math.random() * available.length)] || mediaPool[0];
        setProtagonist(next);
        setProtagonistFade(false);
      }, 700); // tempo de fade out
    }, 12000);

    return () => clearInterval(interval);
  }, [mediaPool, protagonist]);

  // 2. Trocas independentes e assíncronas para os outros cards (Efeito Vivo de Cinema)
  // Sorteia um slot aleatório em tempos descompassados (0.8s a 2.3s) e troca sutilmente
  useEffect(() => {
    if (!mediaPool.length) return;

    let timeoutId: NodeJS.Timeout;

    const triggerRandomSwap = () => {
      const activeSlotIds = SLOT_CONFIGS.map(c => c.id);
      const targetSlotId = activeSlotIds[Math.floor(Math.random() * activeSlotIds.length)];
      
      // Coloca o slot selecionado em transição (fade-out)
      setTransitioningSlots(prev => ({ ...prev, [targetSlotId]: true }));

      setTimeout(() => {
        setSlotsData(prev => {
          const currentItem = prev[targetSlotId];
          const currentActiveIds = Object.values(prev).map(item => item.id);
          currentActiveIds.push(protagonist.id);

          const unusedMedia = mediaPool.filter(m => !currentActiveIds.includes(m.id));
          const nextItem = unusedMedia.length > 0
            ? unusedMedia[Math.floor(Math.random() * unusedMedia.length)]
            : mediaPool[Math.floor(Math.random() * mediaPool.length)];

          return { ...prev, [targetSlotId]: nextItem };
        });

        // Tira o slot de transição (fade-in)
        setTimeout(() => {
          setTransitioningSlots(prev => ({ ...prev, [targetSlotId]: false }));
        }, 100);

      }, 400);

      const nextDelay = 800 + Math.random() * 1500; // Tempo dinâmico entre 0.8s e 2.3s
      timeoutId = setTimeout(triggerRandomSwap, nextDelay);
    };

    timeoutId = setTimeout(triggerRandomSwap, 1500);
    return () => clearTimeout(timeoutId);
  }, [mediaPool, protagonist]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTargetMouse({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  };

  // Cores dinâmicas para o glow de fundo com base no protagonista
  const getGlowColor = () => {
    if (protagonist.sport) {
      if (protagonist.league === 'Brasileirão') return 'rgba(0, 156, 59, 0.16)'; // Verde Brasil
      if (protagonist.league === 'Champions League') return 'rgba(26, 58, 107, 0.16)'; // Azul escuro
      return 'rgba(255, 215, 0, 0.12)'; // Dourado Libertadores
    }
    if (protagonist.type === 'Reality') return 'rgba(6, 182, 212, 0.16)'; // Cyan BBB
    return 'rgba(229, 9, 20, 0.14)'; // Vermelho clássico CinePlay
  };

  const getBorderColor = () => {
    if (protagonist.sport) return protagonist.leagueColor || '#E50914';
    if (protagonist.type === 'Reality') return '#06b6d4';
    return '#E50914';
  };

  const glowColor = getGlowColor();
  const borderColor = getBorderColor();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTargetMouse({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        perspective: '1600px',
        transformStyle: 'preserve-3d',
        overflow: 'visible', // Permite que elementos invadam o layout exterior
      }}
    >
      {/* 1. GLOW DINÂMICO REACTIVO AO CONTEÚDO */}
      <div style={{
        position: 'absolute', top: '35%', left: '40%',
        width: '650px', height: '650px',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 1,
        transform: `translate(-50%, -50%) translate3d(${mouse.x * 24}px, ${mouse.y * 24}px, -150px) scale(1.25)`,
        transition: 'transform 0.15s ease-out, background 1.5s ease-in-out',
      }} />

      {/* 2. TEXTURA DE PARTICULAS FLUTUANTES NO PARALLAX */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px', opacity: 0.65, pointerEvents: 'none', zIndex: 2,
        transform: `translate3d(${mouse.x * 12}px, ${mouse.y * 12}px, -80px)`,
        transition: 'transform 0.15s ease-out',
      }} />

      {/* 3. MÁSCARA DE FUSÃO GRADIENTE (Elimina cortes secos na lateral do texto) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, #07070D 0%, rgba(7,7,13,0.85) 10%, rgba(7,7,13,0.3) 25%, transparent 45%)',
      }} />

      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, color: '#A0A0B5', fontSize: 13,
        }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          <span>Criando composição...</span>
        </div>
      )}

      {/* SCENE 3D */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', zIndex: 3,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mouse.y * -6}deg) rotateY(${mouse.x * 8}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
      }}>

        {/* CAMADA INFERIOR: BACKDROP ATMOSFÉRICO SUTIL */}
        {slotsData[10] && (
          <div style={{
            position: 'absolute', left: '10%', top: '5%', width: '80%', height: '80%',
            opacity: 0.14, zIndex: 1, pointerEvents: 'none',
            transform: `translate3d(${mouse.x * -10}px, ${mouse.y * -10}px, -200px)`,
            transition: 'transform 0.2s ease-out',
          }}>
            <img
              src={slotsData[10].backdrop || slotsData[10].poster || ''}
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px) contrast(1.1)', borderRadius: '30px' }}
            />
          </div>
        )}

        {/* =================════════════════════════════════════
            A. SLOTS DA COLAGEM CAÓTICA E FLUTUANTE
            ========================================================= */}
        {SLOT_CONFIGS.map((config) => {
          const item = slotsData[config.id];
          if (!item) return null;

          const isTrans = transitioningSlots[config.id];

          // Determinar imagem correta
          const src = (config.type === 'backdrop' && item.backdrop)
            ? item.backdrop
            : (item.poster || item.backdrop || '');

          return (
            <div
              key={config.id}
              style={{
                position: 'absolute',
                left: config.left,
                top: config.top,
                width: config.width || 'auto',
                height: config.height || 'auto',
                zIndex: config.zIndex,
                opacity: isTrans ? 0 : config.opacity,
                transform: `translate3d(${mouse.x * (parseInt(config.translateZ) * 0.4)}px, ${mouse.y * (parseInt(config.translateZ) * 0.4)}px, ${config.translateZ}) rotateZ(${config.rotate})`,
                transition: 'transform 0.2s ease-out, opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'none',
                boxShadow: config.type === 'badge-live' || config.type === 'badge-rating' || config.type === 'badge-platform' || config.type === 'badge-tag' || config.type === 'badge-4k'
                  ? 'none'
                  : '0 12px 36px rgba(0,0,0,0.7)',
                borderRadius: config.type.startsWith('badge') ? '0' : '10px',
                overflow: config.type.startsWith('badge') ? 'visible' : 'hidden',
                border: config.type.startsWith('badge') ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Renderização de acordo com o formato */}
              {config.type === 'poster' && (
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}

              {config.type === 'backdrop' && (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)'
                  }} />
                </div>
              )}

              {/* SELO: LIVE */}
              {config.type === 'badge-live' && (
                <div style={{
                  background: 'rgba(229, 9, 20, 0.95)', color: '#fff',
                  padding: '4px 10px', borderRadius: '6px', fontSize: 9, fontWeight: 900,
                  display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit',
                  boxShadow: '0 4px 12px rgba(229,9,20,0.4)', letterSpacing: '0.04em',
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'ping 1s infinite' }} />
                  <span>AO VIVO</span>
                </div>
              )}

              {/* SELO: RATING */}
              {config.type === 'badge-rating' && (
                <div style={{
                  background: 'rgba(10,10,18,0.75)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)', color: '#fff',
                  padding: '4px 8px', borderRadius: '6px', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Outfit',
                }}>
                  <Star size={9} fill="#F59E0B" color="#F59E0B" />
                  <span>{item.vote ? item.vote.toFixed(1) : '8.8'}</span>
                </div>
              )}

              {/* SELO: PLATFORM */}
              {config.type === 'badge-platform' && (
                <div style={{
                  background: 'rgba(229, 9, 20, 0.1)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(229, 9, 20, 0.35)', color: '#E50914',
                  padding: '4px 8px', borderRadius: '6px', fontSize: 9, fontWeight: 800,
                  fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  <span>{item.type || 'FUTEBOL'}</span>
                </div>
              )}

              {/* SELO: TAG */}
              {config.type === 'badge-tag' && (
                <div style={{
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                  padding: '4px 8px', borderRadius: '6px', fontSize: 9, fontWeight: 700,
                  fontFamily: 'Outfit',
                }}>
                  <span>{item.sport ? 'PREMIERE' : 'NOVO'}</span>
                </div>
              )}

              {/* SELO: 4K HDR */}
              {config.type === 'badge-4k' && (
                <div style={{
                  background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)', color: '#A0A0B5',
                  padding: '4px 8px', borderRadius: '6px', fontSize: 8, fontWeight: 900,
                  fontFamily: 'Outfit', letterSpacing: '0.08em',
                }}>
                  <span>4K HDR</span>
                </div>
              )}
            </div>
          );
        })}

        {/* =================════════════════════════════════════
            B. PROTAGONISTA CENTRAL (Destaque Proeminente)
            ========================================================= */}
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: '12%',
            width: '260px',
            height: '350px',
            zIndex: 20,
            opacity: protagonistFade ? 0.3 : 1,
            transform: `translate3d(${mouse.x * -35}px, ${mouse.y * -35}px, 60px) rotateY(-6deg) rotateX(3deg)`,
            transition: 'transform 0.2s ease-out, opacity 0.7s ease-in-out, border-color 1s ease, box-shadow 1s ease',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `2px solid ${borderColor}bb`,
            boxShadow: `0 35px 80px ${borderColor}25, 0 30px 70px rgba(0,0,0,0.9)`,
          }}
        >
          {/* Brilho interno do card */}
          <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 35px ${borderColor}30`, zIndex: 3, pointerEvents: 'none' }} />

          {/* Imagem */}
          {protagonist.sport && protagonist.backdrop ? (
            <img
              src={protagonist.backdrop}
              alt={protagonist.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={protagonist.poster || ''}
              alt={protagonist.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Times de Futebol Overlay */}
          {protagonist.sport && (protagonist.homeTeam || protagonist.league) && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.3) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 6,
            }}>
              {protagonist.homeTeam && protagonist.awayTeam ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={protagonist.homeTeam.logo} alt={protagonist.homeTeam.name} style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))' }} />
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, fontFamily: 'Outfit', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>×</span>
                  <img src={protagonist.awayTeam.logo} alt={protagonist.awayTeam.name} style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))' }} />
                </div>
              ) : protagonist.leagueFlag && (
                <span style={{ fontSize: 44, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>{protagonist.leagueFlag}</span>
              )}
            </div>
          )}

          {/* Letreiro Inferior */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
            background: 'linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.6) 65%, transparent 100%)',
            padding: '14px 16px', fontFamily: 'Outfit, sans-serif',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: protagonist.sport ? `${protagonist.leagueColor}20` : 'rgba(229,9,20,0.12)',
              color: protagonist.sport ? (protagonist.leagueColor || '#009C3B') : '#E50914',
              padding: '2px 7px', borderRadius: 99, fontSize: 8, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              border: `1px solid ${protagonist.sport ? (protagonist.leagueColor || '#009C3B') : '#E50914'}35`,
              marginBottom: 4,
            }}>
              {protagonist.isLive && (
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: 'ping 1s infinite' }} />
              )}
              {protagonist.isLive ? '🔴 Ao Vivo' : protagonist.label || 'Destaque'}
            </span>

            <h3 style={{
              fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}>
              {protagonist.title}
            </h3>

            <p style={{ fontSize: 10, color: '#A0A0B5', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{protagonist.league || protagonist.type}</span>
              <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#A0A0B5' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                <Star size={9} fill="#F59E0B" color="#F59E0B" /> {protagonist.vote?.toFixed(1)}/10
              </span>
            </p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
      `}</style>
    </div>
  );
}
