'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DEFAULT_AUTHORS } from '@/lib/authors/service';
import type { Author } from '@/lib/types';
import { User, Plus, ExternalLink, CheckCircle2, Award, Edit, Trash2 } from 'lucide-react';

export default function AdminAutoresPage() {
  const [authors, setAuthors] = useState<Author[]>(DEFAULT_AUTHORS);
  const [showModal, setShowModal] = useState(false);

  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [especialidades, setEspecialidades] = useState('');

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cargo || !bio) return;

    const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    
    const newAuthor: Author = {
      id: `autor-${Date.now()}`,
      nome,
      cargo,
      bio,
      avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      slug,
      especialidades: especialidades.split(',').map(s => s.trim()).filter(Boolean),
      ativo: true,
    };

    setAuthors([newAuthor, ...authors]);
    setShowModal(false);
    setNome(''); setCargo(''); setBio(''); setAvatarUrl(''); setEspecialidades('');
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D', color: '#fff' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>
              Gestão de Autores da Redação
            </h1>
            <p style={{ color: '#A0A0B5', fontSize: 14, margin: '4px 0 0' }}>
              Cadastre e gerencie os autores da redação CinePlay. Os agentes de IA sorteiam aleatoriamente os créditos de cada post entre os autores ativos.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 10, background: '#E50914',
              color: '#fff', fontWeight: 800, fontSize: 14, border: 'none',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              boxShadow: '0 4px 15px rgba(229,9,20,0.4)'
            }}
          >
            <Plus size={18} /> Cadastrar Novo Autor
          </button>
        </div>

        {/* Form Modal */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999, padding: 20
          }}>
            <div style={{
              background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: 32, width: '100%', maxWidth: 540,
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
            }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
                Cadastrar Autor da Redação
              </h2>

              <form onSubmit={handleAddAuthor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6 }}>
                    Nome Completo
                  </label>
                  <input
                    type="text" required placeholder="Ex: Carlos Eduardo"
                    value={nome} onChange={e => setNome(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6 }}>
                    Cargo / Especialidade Editorial
                  </label>
                  <input
                    type="text" required placeholder="Ex: Editor-Chefe de Esportes"
                    value={cargo} onChange={e => setCargo(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6 }}>
                    Biografia Resumida
                  </label>
                  <textarea
                    rows={3} required placeholder="Breve currículo do autor..."
                    value={bio} onChange={e => setBio(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6 }}>
                    URL da Foto de Perfil (Avatar HD)
                  </label>
                  <input
                    type="url" placeholder="https://..."
                    value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6 }}>
                    Tags de Especialidades (separadas por vírgula)
                  </label>
                  <input
                    type="text" placeholder="Futebol, Brasileirão, Guias"
                    value={especialidades} onChange={e => setEspecialidades(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 8, background: '#E50914', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                    Salvar Autor
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid de Autores Cadastrados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {authors.map(aut => (
            <div
              key={aut.id}
              style={{
                background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', gap: 16
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 99, overflow: 'hidden', border: '2px solid #E50914', flexShrink: 0 }}>
                  <img src={aut.avatar_url} alt={aut.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                    {aut.nome}
                  </h3>
                  <div style={{ fontSize: 12, color: '#E50914', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Award size={13} /> {aut.cargo}
                  </div>
                </div>
              </div>

              <p style={{ color: '#A0A0B5', fontSize: 13, lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {aut.bio}
              </p>

              <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> Ativo no Sorteio de IA
                </span>

                <Link
                  href={`/autor/${aut.slug}`}
                  target="_blank"
                  style={{
                    fontSize: 12, fontWeight: 700, color: '#6366F1', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  Ver Perfil Público <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
