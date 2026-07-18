'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Save, RefreshCw, Eye, CheckCircle, Upload, Image as ImageIcon, AlertTriangle, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DEFAULT_BANNER_IMAGES = {
  img1: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80',
  img2: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
  img3: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=500&q=80',
  img4: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
  card_text: 'Stranger Things S5 no ar!'
};

export default function AdminConfigPage() {
  const [config, setConfig] = useState(DEFAULT_BANNER_IMAGES);
  const [savedStatus, setSavedStatus] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  
  // Controle do modal de confirmação customizado
  const [showResetModal, setShowResetModal] = useState(false);

  // Refs para inputs de arquivo invisíveis
  const fileInputRefs = {
    img1: useRef<HTMLInputElement>(null),
    img2: useRef<HTMLInputElement>(null),
    img3: useRef<HTMLInputElement>(null),
    img4: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const saved = localStorage.getItem('cineplay_hero_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cineplay_hero_config', JSON.stringify(config));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_BANNER_IMAGES);
    localStorage.setItem('cineplay_hero_config', JSON.stringify(DEFAULT_BANNER_IMAGES));
    setShowResetModal(false);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  // Processa o upload do arquivo de imagem
  const handleFileChange = async (key: 'img1' | 'img2' | 'img3' | 'img4', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);

    try {
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${key}_${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { data, error } = await supabase.storage
          .from('cineplay-assets')
          .upload(filePath, file, { upsert: true });

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('cineplay-assets')
          .getPublicUrl(filePath);

        setConfig(prev => ({ ...prev, [key]: publicUrl }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setConfig(prev => ({ ...prev, [key]: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setConfig(prev => ({ ...prev, [key]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingKey(null);
    }
  };

  const triggerFileInput = (key: 'img1' | 'img2' | 'img3' | 'img4') => {
    fileInputRefs[key].current?.click();
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D', color: '#F0F0F5' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        
        {/* Banner Modo Demo */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 12, padding: '12px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <p style={{ color: '#F59E0B', fontSize: 13, margin: 0 }}>
            <strong>Modo de Upload Flexível:</strong> Se o Supabase Storage estiver conectado, o upload é enviado para as nuvens. Caso contrário, salvamos a imagem localmente em Base64 no seu navegador.
          </p>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, color: '#fff' }}>
              ⚙️ Configurações do Portal
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Gerencie a identidade visual da Landing Page, faça uploads de posters da Hero e edite textos de avisos.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowResetModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13,
                border: '1px solid var(--border-default)', cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} /> Restaurar Padrões
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 10,
                background: '#E50914', color: '#fff',
                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(229,9,20,0.35)',
              }}
            >
              <Save size={14} /> Salvar Configurações
            </button>
          </div>
        </div>

        {savedStatus && (
          <div style={{
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12, padding: '12px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-success)', fontSize: 14
          }}>
            <CheckCircle size={16} /> Configurações salvas com sucesso! As alterações já estão visíveis na página inicial.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }} className="config-grid">
          
          {/* Formulário de Configuração */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 24
          }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
              🖼️ Imagens do Banner da Hero (Posters)
            </h2>

            {/* Poster 1 */}
            <div>
              <label className="form-label">Poster 1 — Superior (Ex: House of the Dragon)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  className="form-input"
                  value={config.img1.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : config.img1}
                  onChange={e => setConfig({ ...config, img1: e.target.value })}
                  placeholder="URL da Imagem ou faça Upload"
                  style={{ flex: 1 }}
                  disabled={config.img1.startsWith('data:')}
                />
                <input
                  type="file"
                  ref={fileInputRefs.img1}
                  onChange={e => handleFileChange('img1', e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => triggerFileInput('img1')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-default)', color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={14} /> {uploadingKey === 'img1' ? 'Enviando...' : 'Fazer Upload'}
                </button>
              </div>
            </div>

            {/* Poster 2 */}
            <div>
              <label className="form-label">Poster 2 — Central de Destaque (Ex: Futebol ao vivo)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  className="form-input"
                  value={config.img2.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : config.img2}
                  onChange={e => setConfig({ ...config, img2: e.target.value })}
                  placeholder="URL da Imagem ou faça Upload"
                  style={{ flex: 1 }}
                  disabled={config.img2.startsWith('data:')}
                />
                <input
                  type="file"
                  ref={fileInputRefs.img2}
                  onChange={e => handleFileChange('img2', e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => triggerFileInput('img2')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-default)', color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={14} /> {uploadingKey === 'img2' ? 'Enviando...' : 'Fazer Upload'}
                </button>
              </div>
            </div>

            {/* Poster 3 */}
            <div>
              <label className="form-label">Poster 3 — Lado Direito (Ex: The Last of Us)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  className="form-input"
                  value={config.img3.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : config.img3}
                  onChange={e => setConfig({ ...config, img3: e.target.value })}
                  placeholder="URL da Imagem ou faça Upload"
                  style={{ flex: 1 }}
                  disabled={config.img3.startsWith('data:')}
                />
                <input
                  type="file"
                  ref={fileInputRefs.img3}
                  onChange={e => handleFileChange('img3', e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => triggerFileInput('img3')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-default)', color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={14} /> {uploadingKey === 'img3' ? 'Enviando...' : 'Fazer Upload'}
                </button>
              </div>
            </div>

            {/* Poster 4 */}
            <div>
              <label className="form-label">Poster 4 — Inferior (Ex: Dune)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  className="form-input"
                  value={config.img4.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : config.img4}
                  onChange={e => setConfig({ ...config, img4: e.target.value })}
                  placeholder="URL da Imagem ou faça Upload"
                  style={{ flex: 1 }}
                  disabled={config.img4.startsWith('data:')}
                />
                <input
                  type="file"
                  ref={fileInputRefs.img4}
                  onChange={e => handleFileChange('img4', e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => triggerFileInput('img4')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-default)', color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={14} /> {uploadingKey === 'img4' ? 'Enviando...' : 'Fazer Upload'}
                </button>
              </div>
            </div>

            {/* Balão de notificação */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20 }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                💬 Balão Flutuante de Notificação
              </h2>
              <label className="form-label">Texto da Notificação</label>
              <input
                className="form-input"
                value={config.card_text}
                onChange={e => setConfig({ ...config, card_text: e.target.value })}
                placeholder="Ex: Stranger Things S5 no ar!"
              />
            </div>

          </div>

          {/* Coluna de Previews Rápidos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 20, padding: 24
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} /> Previews das Imagens
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Poster 1', url: config.img1 },
                  { label: 'Poster 2', url: config.img2 },
                  { label: 'Poster 3', url: config.img3 },
                  { label: 'Poster 4', url: config.img4 }
                ].map((p, idx) => (
                  <div key={idx} style={{ background: '#07070D', borderRadius: 12, padding: 8, border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{p.label}</span>
                    <div style={{ width: '100%', height: 110, borderRadius: 8, overflow: 'hidden', background: '#12121A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.url ? (
                        <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }} />
                      ) : (
                        <ImageIcon size={24} style={{ color: 'var(--text-disabled)' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(229,9,20,0.04)', border: '1px solid rgba(229,9,20,0.15)',
              borderRadius: 20, padding: 24, color: 'var(--text-secondary)'
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>💡 Dica de Design</h3>
              <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                Para melhor visualização e fidelidade do layout de destaque, utilize imagens verticais de alta qualidade (proporção 2:3 ou 1:1) para os posters 1, 2 e 3, e uma imagem horizontal para o poster 4 (Dune).
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* MODAL DE CONFIRMAÇÃO DE RESTAURAÇÃO */}
      {showResetModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: '#0F0F1A', border: '1px solid rgba(229,9,20,0.3)',
            borderRadius: 24, padding: 32, maxWidth: 480, width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative'
          }}>
            <button
              onClick={() => setShowResetModal(false)}
              style={{
                position: 'absolute', top: 20, right: 20, background: 'transparent',
                border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, color: '#E50914' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Restaurar Padrões da Hero?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              Esta ação irá substituir todas as imagens e textos atualmente carregados pelos posters originais do CinePlay (incluindo as artes do Unsplash correspondentes). Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-default)', color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 22px', borderRadius: 10, background: '#E50914',
                  border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(229,9,20,0.3)'
                }}
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .config-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
