'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Tv, HelpCircle, Activity } from 'lucide-react';

interface MediaItem {
  title: string;
  type: string;
  poster: string | null;
  backdrop: string | null;
  platform: string;
  status: string;
  isLive?: boolean;
}

const DEFAULT_MOVIES = [
  { title: 'Duna: Parte Dois', type: 'Filme', poster: 'https://image.tmdb.org/t/p/w500/c7D6n1clBL6Vo44x2Uo599026T.jpg', backdrop: null, platform: 'Max (HBO)', status: 'Disponível em 4K HDR' },
  { title: 'House of the Dragon', type: 'Série', poster: 'https://image.tmdb.org/t/p/w500/t9X7imfv64es3496nQ3KyIFnN5Y.jpg', backdrop: null, platform: 'Max & Prime Video', status: 'Novos episódios aos domingos' },
];

const DEFAULT_SPORTS = [
  { title: 'Flamengo x Palmeiras', type: 'Futebol', poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80', backdrop: null, platform: 'Premiere & Globo', status: 'Ao Vivo agora' },
  { title: 'Real Madrid x Man City', type: 'Futebol', poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&auto=format&fit=crop&q=80', backdrop: null, platform: 'TNT & Max', status: 'Terça-feira às 16:00' },
];

const STREAMING_PLATFORMS = [
  { name: 'Netflix', color: '#E50914' },
  { name: 'Prime Video', color: '#00A8E1' },
  { name: 'Disney+', color: '#113CCF' },
  { name: 'Max', color: '#002BE7' },
  { name: 'Globoplay', color: '#FF3333' },
  { name: 'Premiere', color: '#FFD700' },
];

export default function DiscoveryEngine() {
  const [activeCategory, setActiveCategory] = useState<'futebol' | 'filme' | 'serie'>('futebol');
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningIdx, setScanningIdx] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [resultItem, setResultItem] = useState<MediaItem | null>(null);

  // Pools dinâmicos carregados da API
  const [sportsPool, setSportsPool] = useState<MediaItem[]>([]);
  const [moviesPool, setMoviesPool] = useState<MediaItem[]>([]);
  const [seriesPool, setSeriesPool] = useState<MediaItem[]>([]);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar dados reais das APIs
  useEffect(() => {
    async function fetchPools() {
      try {
        const [tmdbRes, sportsRes] = await Promise.all([
          fetch('/api/tmdb-pool').then(r => r.json()).catch(() => null),
          fetch('/api/sports-pool').then(r => r.json()).catch(() => null)
        ]);

        if (sportsRes?.success && sportsRes.pool?.length) {
          const formattedSports = sportsRes.pool.map((item: any) => ({
            title: item.title,
            type: 'Futebol',
            poster: item.poster || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&q=80',
            backdrop: item.backdrop,
            platform: item.league || 'Canais Esportivos',
            status: item.isLive ? '🔴 Transmissão Ao Vivo' : item.label || 'Jogo agendado',
            isLive: item.isLive
          }));
          setSportsPool(formattedSports);
        }

        if (tmdbRes?.success && tmdbRes.pool?.length) {
          const movies = tmdbRes.pool
            .filter((item: any) => item.type === 'Filme')
            .map((item: any) => ({
              title: item.title,
              type: 'Filme',
              poster: item.poster,
              backdrop: item.backdrop,
              platform: 'Disponível no Streaming',
              status: item.vote ? `★ Nota Média: ${item.vote.toFixed(1)}` : 'Recém Lançado'
            }));
          setMoviesPool(movies);

          const series = tmdbRes.pool
            .filter((item: any) => item.type === 'Série')
            .map((item: any) => ({
              title: item.title,
              type: 'Série',
              poster: item.poster,
              backdrop: item.backdrop,
              platform: 'Plataformas de Vídeo',
              status: 'Novos episódios listados'
            }));
          setSeriesPool(series);
        }
      } catch (err) {
        console.error('Erro ao ler pools no DiscoveryEngine:', err);
      }
    }
    fetchPools();
  }, []);

  // Controlar o fluxo de digitação, escaneamento e revelação
  useEffect(() => {
    triggerEngineFlow();
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [activeCategory, sportsPool, moviesPool, seriesPool]);

  function triggerEngineFlow() {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Resetar estados
    setTypedText('');
    setIsTyping(true);
    setIsScanning(false);
    setShowResult(false);
    setScanningIdx(-1);

    const question = getQuestionForCategory(activeCategory);
    let charIdx = 0;

    // Efeito de digitação da IA
    function typeNextChar() {
      if (charIdx < question.length) {
        setTypedText(question.slice(0, charIdx + 1));
        charIdx++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 35);
      } else {
        setIsTyping(false);
        // Pequena pausa após a digitação
        typingTimeoutRef.current = setTimeout(() => {
          startScanningPhase();
        }, 350);
      }
    }

    typeNextChar();
  }

  function startScanningPhase() {
    setIsScanning(true);
    let currentScan = 0;
    
    // Animação rápida de scanner piscando pelos logos
    const interval = setInterval(() => {
      setScanningIdx(currentScan % STREAMING_PLATFORMS.length);
      currentScan++;

      if (currentScan >= 15) {
        clearInterval(interval);
        setIsScanning(false);
        setScanningIdx(-1);
        revealResult();
      }
    }, 90);
  }

  function revealResult() {
    // Escolher item da pool real ou fallback se não houver dados carregados ainda
    let item: MediaItem;
    if (activeCategory === 'futebol') {
      item = sportsPool.length > 0 
        ? sportsPool[Math.floor(Math.random() * Math.min(5, sportsPool.length))]
        : DEFAULT_SPORTS[Math.floor(Math.random() * DEFAULT_SPORTS.length)];
    } else if (activeCategory === 'filme') {
      item = moviesPool.length > 0
        ? moviesPool[Math.floor(Math.random() * Math.min(5, moviesPool.length))]
        : DEFAULT_MOVIES[0];
    } else {
      item = seriesPool.length > 0
        ? seriesPool[Math.floor(Math.random() * Math.min(5, seriesPool.length))]
        : DEFAULT_MOVIES[1];
    }

    setResultItem(item);
    setShowResult(true);
  }

  function getQuestionForCategory(cat: 'futebol' | 'filme' | 'serie'): string {
    switch (cat) {
      case 'futebol':
        return 'Onde assistir as principais partidas de futebol hoje?';
      case 'filme':
        return 'Qual é o filme mais pesquisado no Brasil nas últimas 24h?';
      case 'serie':
        return 'Onde está passando o episódio mais recente da série em alta?';
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 510,
      margin: '0 auto',
      background: 'rgba(15, 15, 27, 0.45)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 18,
      padding: '24px 20px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      position: 'relative',
      overflow: 'hidden'
    }} className="discovery-engine-card">
      
      {/* Grade pontilhada técnica de fundo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        opacity: 0.8, pointerEvents: 'none', zIndex: 0
      }} />

      {/* Brilho neon sutil que muda conforme a categoria de busca */}
      <div style={{
        position: 'absolute',
        top: -80, right: -80,
        width: 260, height: 260,
        background: activeCategory === 'futebol' 
          ? 'radial-gradient(circle, rgba(0, 156, 59, 0.12) 0%, transparent 70%)' 
          : activeCategory === 'filme'
          ? 'radial-gradient(circle, rgba(229, 9, 20, 0.14) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Topo do painel - Status da IA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E50914', display: 'inline-block' }} />
              <span style={{
                position: 'absolute', width: 14, height: 14, borderRadius: '50%',
                border: '1.5px solid #E50914', display: 'inline-block',
                animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#9090A5', textTransform: 'uppercase', fontFamily: 'Outfit' }}>
              CinePlay AI Discovery Engine
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 99, padding: '2px 8px' }}>
            <Activity size={10} color="#E50914" />
            <span style={{ fontSize: 9, fontWeight: 600, color: '#A0A0B5' }}>Online</span>
          </div>
        </div>

        {/* Console Box / Terminal de Digitação */}
        <div style={{
          background: 'rgba(5, 5, 10, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: 12,
          padding: '14px 16px',
          minHeight: 68,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 16
        }}>
          <Sparkles size={16} style={{ color: '#E50914', marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#F0F0F5',
              lineHeight: 1.4,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}>
              {typedText}
              {isTyping && (
                <span className="blinking-cursor" style={{ fontWeight: 800, color: '#E50914', marginLeft: 2 }}>|</span>
              )}
            </div>
          </div>
        </div>

        {/* Plataformas de Streaming Sendo Escaneadas */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: '#65657B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, paddingLeft: 2 }}>
            {isScanning ? 'Escaneando bases de dados...' : 'Canais de transmissão monitorados'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {STREAMING_PLATFORMS.map((platform, index) => {
              const active = index === scanningIdx;
              return (
                <div
                  key={platform.name}
                  style={{
                    background: active ? platform.color : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: 8,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                    boxShadow: active ? `0 0 12px ${platform.color}88` : 'none'
                  }}
                >
                  <span style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: active ? '#fff' : 'rgba(255, 255, 255, 0.28)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}>
                    {platform.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Caixa de Evidência / Resposta da IA */}
        <div style={{ minHeight: 120, position: 'relative' }}>
          {showResult && resultItem ? (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(229, 9, 20, 0.15)',
                borderRadius: 12,
                padding: 12,
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="result-box-neon"
            >
              {/* Brilho interno do card */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 2, height: '100%',
                background: '#E50914'
              }} />

              {/* Poster / Imagem de Evidência */}
              {resultItem.poster ? (
                <img
                  src={resultItem.poster}
                  alt={resultItem.title}
                  style={{
                    width: 64,
                    height: 84,
                    borderRadius: 6,
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: 64, height: 84, borderRadius: 6,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Tv size={20} color="rgba(255,255,255,0.2)" />
                </div>
              )}

              {/* Informações detalhadas */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 8, fontWeight: 800, color: '#fff',
                    background: 'rgba(229, 9, 20, 0.18)', border: '1px solid rgba(229, 9, 20, 0.25)',
                    padding: '1px 5px', borderRadius: 4, textTransform: 'uppercase'
                  }}>
                    {resultItem.type}
                  </span>
                  <span style={{ fontSize: 10, color: '#85859B', fontWeight: 600 }}>CinePlay Resolveu</span>
                </div>
                <h4 style={{
                  fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {resultItem.title}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#E50914' }}>Onde assistir:</span> {resultItem.platform}
                  </div>
                  <div style={{ fontSize: 10, color: '#9090A5', fontWeight: 500 }}>
                    {resultItem.status}
                  </div>
                </div>
              </div>

              {/* Botão rápido para acessar link */}
              <div style={{ flexShrink: 0 }}>
                <a
                  href="https://wa.me/5511999999999?text=Olá!%20Quero%20saber%20onde%20assistir%20este%20conteúdo%20no%20CinePlay."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#E50914',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', boxShadow: '0 4px 10px rgba(229, 9, 20, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  className="pulsing-button"
                >
                  <Play size={12} fill="#fff" style={{ marginLeft: 2 }} />
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              height: 110,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1px dashed rgba(255,255,255,0.03)',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.005)'
            }}>
              <span className="scanning-bar-effect" />
              <div style={{ fontSize: 11, color: '#55556B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <HelpCircle size={12} /> Consultando inteligência de streams...
              </div>
            </div>
          )}
        </div>

        {/* Atalhos Rápidos Interativos na Base */}
        <div style={{ marginTop: 22, borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: 16 }}>
          <div style={{ fontSize: 10, color: '#707085', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, textAlign: 'center' }}>
            Selecione uma categoria para a IA pesquisar:
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {(['futebol', 'filme', 'serie'] as const).map(cat => {
              const label = cat === 'futebol' ? '⚽ Futebol' : cat === 'filme' ? '🍿 Filmes' : '📺 Séries';
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (isTyping || isScanning) return;
                    setActiveCategory(cat);
                  }}
                  disabled={isTyping || isScanning}
                  style={{
                    background: active ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: active ? '1px solid rgba(229, 9, 20, 0.25)' : '1px solid rgba(255, 255, 255, 0.04)',
                    color: active ? '#fff' : 'rgba(255, 255, 255, 0.55)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: (isTyping || isScanning) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  className="category-trigger-btn"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .blinking-cursor {
          animation: blinkCursor 0.8s infinite steps(2);
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .result-box-neon {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 16px rgba(229, 9, 20, 0.06);
        }
        .category-trigger-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
        .pulsing-button:hover {
          transform: scale(1.08);
          background: #b8070f !important;
        }
      `}</style>
    </div>
  );
}
