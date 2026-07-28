'use client';

import { useState, useEffect } from 'react';
import { Play, Search, Film, Star, ArrowLeft, RefreshCw, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface TrailerItem {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  vote?: number;
  type: string;
  synopsis?: string;
}

export default function TrailersPageClient() {
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<{ key: string; title: string; synopsis?: string } | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCta, setActiveCta] = useState<any>(null);

  const fetchPool = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tmdb-pool');
      const data = await res.json();
      if (data.success && data.pool) {
        const valid = data.pool.filter((i: TrailerItem) => i.poster);
        // Sorteio aleatório de títulos a cada carregamento
        setTrailers(valid.sort(() => 0.5 - Math.random()));
      }
    } catch (err) {
      console.error('Erro ao buscar acervo de trailers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPool();

    // Carrega CTA do Supabase
    fetch('/api/ctas')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.patrocinadores?.length > 0) {
          const first = data.patrocinadores[0]?.ctas?.[0];
          if (first) setActiveCta(first);
        }
      })
      .catch(() => {});
  }, []);

  const handlePlayTrailer = async (item: TrailerItem) => {
    setLoadingVideo(true);
    try {
      const res = await fetch(`/api/tmdb-video?id=${item.id}&type=${item.type}`);
      const data = await res.json();
      if (data.success && data.videoKey) {
        setSelectedTrailer({ key: data.videoKey, title: item.title, synopsis: item.synopsis });
      } else {
        alert('Trailer indisponível no momento para este título.');
      }
    } catch {
      alert('Erro ao carregar o trailer.');
    } finally {
      setLoadingVideo(false);
    }
  };

  const filteredTrailers = trailers.filter(item => {
    const matchesFilter =
      filterType === 'all' ? true :
      filterType === 'movie' ? item.type === 'Filme' :
      filterType === 'tv' ? item.type === 'Série' : true;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featured = trailers[0];
  const ctaLink = activeCta?.url_destino || 'https://wa.me/5511999998888?text=Olá!%20Vim%20pela%20Galeria%20de%20Trailers';

  return (
    <div>
      {/* Banner Principal Topo */}
      <div style={{
        padding: '32px 28px', borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(229,9,20,0.18) 0%, rgba(15,15,28,0.98) 100%)',
        border: '1px solid rgba(229,9,20,0.3)', marginBottom: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 99, background: 'rgba(229,9,20,0.2)', border: '1px solid rgba(229,9,20,0.4)', color: '#E50914', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            <Film size={14} /> Acervo Oficial CinePlay
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
            Galeria Completa de Trailers & Lançamentos HD
          </h1>
          <p style={{ color: '#A0A0B5', fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
            Explore o catálogo atualizado com sorteio aleatório de títulos. Clique em qualquer poster para assistir ao pré-da matéria dublado e legendado.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={fetchPool}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}
          >
            <RefreshCw size={16} /> Sortear Novos Títulos
          </button>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, background: '#25D366',
              color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(37,211,102,0.4)', fontFamily: 'Outfit, sans-serif'
            }}
          >
            <MessageCircle size={18} /> Assista no WhatsApp
          </a>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 28, padding: '16px 20px',
        background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16
      }}>
        {/* Abas */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🔥 Todos os Destaques' },
            { id: 'movie', label: '🎬 Filmes' },
            { id: 'tv', label: '📺 Séries' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '8px 18px', borderRadius: 99,
                background: filterType === tab.id ? '#E50914' : 'rgba(255,255,255,0.05)',
                color: filterType === tab.id ? '#fff' : '#A0A0B5',
                border: filterType === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Pesquisa */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <Search size={16} color="#A0A0B5" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Pesquisar por título..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 38px', borderRadius: 99,
              background: '#07070D', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: 13, outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Highlighted Banner */}
      {featured && !searchQuery && filterType === 'all' && (
        <div style={{
          marginBottom: 32, padding: 32, borderRadius: 24,
          position: 'relative', overflow: 'hidden', minHeight: 220,
          background: featured.backdrop ? `url(${featured.backdrop})` : '#141422',
          backgroundSize: 'cover', backgroundPosition: 'center',
          display: 'flex', alignItems: 'flex-end',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.7)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,7,13,0.96) 0%, rgba(7,7,13,0.6) 65%, transparent 100%)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 650 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#E50914', background: 'rgba(229,9,20,0.15)', padding: '4px 12px', borderRadius: 6, textTransform: 'uppercase' }}>
              ⭐ Filme em Destaque
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 900, color: '#fff', margin: '10px 0 8px' }}>
              {featured.title}
            </h2>
            <button
              onClick={() => handlePlayTrailer(featured)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12, background: '#E50914',
                color: '#fff', fontWeight: 900, fontSize: 14, border: 'none',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 6px 20px rgba(229,9,20,0.5)', marginTop: 6
              }}
            >
              <Play size={18} fill="#fff" /> Assistir Trailer Oficial HD
            </button>
          </div>
        </div>
      )}

      {/* Grid de Trailers */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#A0A0B5', fontSize: 14 }}>
          Carregando catálogo de filmes e séries...
        </div>
      ) : filteredTrailers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#A0A0B5', fontSize: 14 }}>
          Nenhum título encontrado para "{searchQuery}".
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 20
        }}>
          {filteredTrailers.map(item => (
            <div
              key={item.id}
              onClick={() => handlePlayTrailer(item)}
              style={{
                position: 'relative', borderRadius: 18, overflow: 'hidden',
                aspectRatio: '2/3', background: '#141422', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
                willChange: 'transform'
              }}
              className="trailer-card-item"
            >
              <img
                src={item.poster}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.2) 55%, transparent 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 9, fontWeight: 900, color: '#fff',
                    background: item.type === 'Série' ? '#6366F1' : '#E50914',
                    padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase'
                  }}>
                    {item.type}
                  </span>
                  {item.vote ? (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#F59E0B', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                      ★ {item.vote.toFixed(1)}
                    </span>
                  ) : null}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', textAlign: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 99, background: 'rgba(229, 9, 20, 0.95)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 18px rgba(229, 9, 20, 0.8)'
                  }}>
                    <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 800, color: '#fff', margin: '4px 0 0', lineHeight: 1.25 }}>
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Reprodutor Player de Vídeo HD (Garante visualização focada no clique) */}
      {selectedTrailer && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0, 0, 0, 0.96)', backdropFilter: 'blur(24px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#0B0B14', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 24, width: '100%', maxWidth: 1000, overflow: 'hidden',
            boxShadow: '0 30px 100px rgba(0,0,0,1)', display: 'flex', flexDirection: 'column'
          }}>
            {/* Topbar do Player */}
            <div style={{
              padding: '16px 24px', background: '#0F0F1A', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setSelectedTrailer(null)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.1)',
                    border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={16} /> Voltar para Galeria
                </button>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Trailer: <span style={{ color: '#E50914' }}>{selectedTrailer.title}</span>
                </h3>
              </div>

              <button
                onClick={() => setSelectedTrailer(null)}
                style={{
                  width: 34, height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.1)',
                  border: 'none', color: '#fff', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Reprodutor Iframe HD */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.key}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
