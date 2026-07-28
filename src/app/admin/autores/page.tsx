'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DEFAULT_AUTHORS } from '@/lib/authors/service';
import type { Author } from '@/lib/types';
import { User, Plus, ExternalLink, CheckCircle2, Award, Edit3, Trash2, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cineplay_admin_autores';

export default function AdminAutoresPage() {
  const [authors, setAuthors] = useState<Author[]>(DEFAULT_AUTHORS);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [especialidades, setEspecialidades] = useState('');

  // Carrega autores salvos no localStorage no carregamento inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAuthors(parsed);
        }
      }
    } catch (err) {
      console.error('Erro ao ler autores do localStorage:', err);
    }
  }, []);

  // Persiste autores no localStorage
  const saveAuthors = (updated: Author[]) => {
    setAuthors(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar autores no localStorage:', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAuthorId(null);
    setNome(''); setCargo(''); setBio(''); setAvatarUrl(''); setEspecialidades('');
    setShowModal(true);
  };

  const handleOpenEditModal = (author: Author) => {
    setEditingAuthorId(author.id);
    setNome(author.nome);
    setCargo(author.cargo);
    setBio(author.bio);
    setAvatarUrl(author.avatar_url);
    setEspecialidades(author.especialidades ? author.especialidades.join(', ') : '');
    setShowModal(true);
  };

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cargo || !bio) return;

    const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const espList = especialidades.split(',').map(s => s.trim()).filter(Boolean);

    if (editingAuthorId) {
      // Atualiza autor existente
      const updated = authors.map(a => {
        if (a.id === editingAuthorId) {
          return {
            ...a,
            nome,
            cargo,
            bio,
            avatar_url: avatarUrl || a.avatar_url,
            slug,
            especialidades: espList,
          };
        }
        return a;
      });
      saveAuthors(updated);
    } else {
      // Cria novo autor
      const newAuthor: Author = {
        id: `autor-${Date.now()}`,
        nome,
        cargo,
        bio,
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        slug,
        especialidades: espList,
        ativo: true,
      };
      saveAuthors([newAuthor, ...authors]);
    }

    setShowModal(false);
    setEditingAuthorId(null);
  };

  const handleDeleteAuthor = (id: string, authorName: string) => {
    if (confirm(`Tem certeza de que deseja excluir o autor "${authorName}" da redação?`)) {
      const updated = authors.filter(a => a.id !== id);
      saveAuthors(updated);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D', color: '#fff' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>
              Gestão de Autores da Redação
            </h1>
            <p style={{ color: '#A0A0B5', fontSize: 14, margin: '4px 0 0' }}>
              Cadastre, edite fotos/bios ou exclua autores da redação CinePlay. Os agentes de IA sorteiam aleatoriamente os créditos de cada post entre os autores ativos.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
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

        {/* Modal de Cadastro / Edição de Autor */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999, padding: 20
          }}>
            <div style={{
              background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20, padding: 32, width: '100%', maxWidth: 540,
              boxShadow: '0 20px 60px rgba(0,0,0,0.95)', position: 'relative'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute', top: 20, right: 20, background: 'none',
                  border: 'none', color: '#A0A0B5', cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
                {editingAuthorId ? '✏️ Editar Autor da Redação' : '👤 Cadastrar Novo Autor'}
              </h2>

              <form onSubmit={handleSaveAuthor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                  {avatarUrl && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: '#A0A0B5' }}>Pré-visualização:</span>
                      <img src={avatarUrl} alt="Preview" style={{ width: 36, height: 36, borderRadius: 99, objectFit: 'cover', border: '1px solid #E50914' }} />
                    </div>
                  )}
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
                  <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 8, background: '#E50914', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    {editingAuthorId ? 'Salvar Alterações' : 'Cadastrar Autor'}
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
              <div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
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
              </div>

              {/* Botões de Ação: Editar e Excluir */}
              <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Link
                  href={`/autor/${aut.slug}`}
                  target="_blank"
                  style={{
                    fontSize: 12, fontWeight: 700, color: '#6366F1', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  Perfil Público <ExternalLink size={12} />
                </Link>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleOpenEditModal(aut)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.08)',
                      color: '#fff', fontSize: 12, fontWeight: 700, border: 'none',
                      cursor: 'pointer'
                    }}
                    title="Editar Autor"
                  >
                    <Edit3 size={13} /> Editar
                  </button>

                  <button
                    onClick={() => handleDeleteAuthor(aut.id, aut.nome)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.15)',
                      color: '#EF4444', fontSize: 12, fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)',
                      cursor: 'pointer'
                    }}
                    title="Excluir Autor"
                  >
                    <Trash2 size={13} /> Excluir
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
