'use client';

import { useState, useEffect } from 'react';
import { X, Play, Star, Film, Sparkles, ArrowLeft, Search, Tv, Flame, Trophy } from 'lucide-react';

interface TrailerItem {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  vote?: number;
  type: string;
  synopsis?: string;
}

interface TrailerGalleryModalProps {
  onClose: () => void;
}

export default function TrailerGalleryModal({ onClose }: TrailerGalleryModalProps) {
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<{ key: string; title: string; synopsis?: string } | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadPool() {
      try {
        const res = await fetch('/api/tmdb-pool');
        const data = await res.json();
        if (data.success && data.pool) {
          const valid = data.pool.filter((i: TrailerItem) => i.poster);
          // Embaralha para variar a cada abertura
          setTrailers(valid.sort(() => 0.5 - Math.random()));
        }
      } catch (err) {
        console.error('Erro ao carregar galeria de trailers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPool();
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

  return (
    <>
      {/* Modal Principal de Galeria Estilo Cinema & Streaming */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: 'rgba(7, 7, 13, 0.96)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', overflowY: 'auto'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #0F0F1A 0%, #08080E 100%)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 24, width: '100%', maxWidth: 1180, maxHeight: '92vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 100px rgba(0,0,0,0.98)'
        }}>
          
          {/* Header Superior com Busca e Filtros */}
          <div style={{
            padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(229,9,20,0.5)'
              }}>
                <Film size={24} color="#fff" />
              </span>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>
                  Galeria de Trailers & Lançamentos HD
                </h2>
                <p style={{ fontSize: 12, color: '#A0A0B5', margin: 0 }}>
                  Assista a todos os trailers de filmes, séries e partidas em alta definição com 1 clique.
                </p>
              </div>
            </div>

            {/* Barra de Pesquisa */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 360 }}>
              <div style={{
                position: 'relative', width: '100%', display: 'flex', alignItems: 'center'
              }}>
                <Search size={16} color="#A0A0B5" style={{ position: 'absolute', left: 12 }} />
                <input
                  type="text"
                  placeholder="Buscar trailer por nome..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px 9px 36px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 38, height: 38, borderRadius: 99, background: 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Filtros em Abas */}
          <div style={{
            padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: 10, background: 'rgba(0,0,0,0.2)', flexWrap: 'wrap'
          }}>
            {[
              { id: 'all', label: '🔥 Todos os Destaques' },
              { id: 'movie', label: '🎬 Filmes' },
              { id: 'tv', label: '📺 Séries' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '7px 16px', borderRadius: 99,
                  background: filterType === tab.id ? '#E50914' : 'rgba(255,255,255,0.05)',
                  color: filterType === tab.id ? '#fff' : '#A0A0B5',
                  border: filterType === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Banner de Destaque no Topo da Galeria */}
          {featured && !searchQuery && filterType === 'all' && (
            <div style={{
              margin: '20px 28px 0', padding: 24, borderRadius: 20,
              position: 'relative', overflow: 'hidden', minHeight: 180,
              background: featured.backdrop ? `url(${featured.backdrop})` : '#141422',
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', alignItems: 'flex-end',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.6) 60%, transparent 100%)',
                zIndex: 1
              }} />
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#E50914', background: 'rgba(229,9,20,0.15)', padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⭐ Destaque do Dia
                </span>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, color: '#fff', margin: '8px 0 6px' }}>
                  {featured.title}
                </h3>
                <button
                  onClick={() => handlePlayTrailer(featured)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 22px', borderRadius: 10, background: '#E50914',
                    color: '#fff', fontWeight: 800, fontSize: 13, border: 'none',
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    boxShadow: '0 4px 15px rgba(229,9,20,0.5)', marginTop: 8
                  }}
                >
                  <Play size={16} fill="#fff" /> Assistir Trailer Oficial
                </button>
              </div>
            </div>
          )}

          {/* Grid de Posters da Galeria */}
          <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5', fontSize: 14 }}>
                Carregando galeria HD...
              </div>
            ) : filteredTrailers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5', fontSize: 14 }}>
                Nenhum trailer encontrado para a busca "{searchQuery}".
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                gap: 18
              }}>
                {filteredTrailers.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handlePlayTrailer(item)}
                    style={{
                      position: 'relative', borderRadius: 16, overflow: 'hidden',
                      aspectRatio: '2/3', background: '#141422', cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.25s ease, border-color 0.25s ease'
                    }}
                    className="trailer-card-item"
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(7,7,13,0.95) 0%, rgba(7,7,13,0.2) 50%, transparent 100%)',
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
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                            ★ {item.vote.toFixed(1)}
                          </span>
                        ) : null}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 99, background: 'rgba(229, 9, 20, 0.95)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 18px rgba(229, 9, 20, 0.8)'
                        }}>
                          <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                        </div>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 800, color: '#fff', margin: '6px 0 0', lineHeight: 1.25 }}>
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal Reprodutor de Vídeo Player HD Dedicado (Centralizado sem scroll) */}
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

            {/* Reprodutor Iframe HD com Áudio Ativado por Padrão */}
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
    </>
  );
}
