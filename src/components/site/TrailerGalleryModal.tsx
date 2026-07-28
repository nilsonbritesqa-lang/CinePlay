'use client';

import { useState, useEffect } from 'react';
import { X, Play, Star, Film, Volume2, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react';

interface TrailerItem {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  vote?: number;
  type: string;
}

interface TrailerGalleryModalProps {
  onClose: () => void;
}

export default function TrailerGalleryModal({ onClose }: TrailerGalleryModalProps) {
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<{ key: string; title: string } | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

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
        setSelectedTrailer({ key: data.videoKey, title: item.title });
      } else {
        alert('Trailer indisponível no momento para este título.');
      }
    } catch {
      alert('Erro ao carregar o trailer.');
    } finally {
      setLoadingVideo(false);
    }
  };

  return (
    <>
      {/* Modal Principal de Galeria */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: 'rgba(7, 7, 13, 0.94)', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px', overflowY: 'auto'
      }}>
        <div style={{
          background: '#0E0E18', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, width: '100%', maxWidth: 1100, maxHeight: '90vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 80px rgba(0,0,0,0.95)'
        }}>
          
          {/* Header do Modal */}
          <div style={{
            padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 38, height: 38, borderRadius: 10, background: '#E50914',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(229,9,20,0.5)'
              }}>
                <Film size={22} color="#fff" />
              </span>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>
                  Galeria Oficial de Trailers HD
                </h2>
                <p style={{ fontSize: 12, color: '#A0A0B5', margin: 0 }}>
                  Clique em qualquer poster para assistir ao trailer dublado/legendado em alta definição.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Grid de Posters da Galeria */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#A0A0B5', fontSize: 14 }}>
                Carregando acervo de trailers...
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 16
              }}>
                {trailers.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handlePlayTrailer(item)}
                    style={{
                      position: 'relative', borderRadius: 14, overflow: 'hidden',
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
                      padding: 10
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 900, color: '#fff',
                          background: item.type === 'Série' ? '#6366F1' : '#E50914',
                          padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase'
                        }}>
                          {item.type}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 99, background: 'rgba(229, 9, 20, 0.92)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(229, 9, 20, 0.7)'
                        }}>
                          <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                        </div>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 800, color: '#fff', margin: '4px 0 0', lineHeight: 1.25 }}>
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
          background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#0B0B14', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, width: '100%', maxWidth: 960, overflow: 'hidden',
            boxShadow: '0 25px 90px rgba(0,0,0,1)', display: 'flex', flexDirection: 'column'
          }}>
            {/* Topbar do Player */}
            <div style={{
              padding: '16px 24px', background: '#0F0F1A', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setSelectedTrailer(null)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)',
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
                  width: 32, height: 32, borderRadius: 99, background: 'rgba(255,255,255,0.1)',
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
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.key}?autoplay=1&controls=1&modestbranding=1&rel=0`}
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
