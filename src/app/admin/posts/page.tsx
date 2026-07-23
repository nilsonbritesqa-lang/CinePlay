'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FileText, Plus, Search, Eye, Edit, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface PostItem {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  status: 'publicado' | 'rascunho' | 'agendado';
  visualizacoes: number;
  gerado_por_ia: boolean;
  publicado_em: string;
}

const INITIAL_POSTS: PostItem[] = [
  { id: '1', titulo: 'Onde Assistir o Brasileirão 2026: Todos os Canais e Plataformas', slug: 'onde-assistir-brasileirao-2026', categoria: 'futebol', status: 'publicado', visualizacoes: 12430, gerado_por_ia: true, publicado_em: '2026-07-23' },
  { id: '2', titulo: 'As Melhores Séries no Streaming em Julho de 2026', slug: 'melhores-series-streaming-julho-2026', categoria: 'series', status: 'publicado', visualizacoes: 8720, gerado_por_ia: true, publicado_em: '2026-07-23' },
  { id: '3', titulo: 'Onde Assistir Deadpool & Wolverine Online — Já está no Streaming?', slug: 'onde-assistir-deadpool-wolverine', categoria: 'cinema', status: 'publicado', visualizacoes: 21100, gerado_por_ia: false, publicado_em: '2026-07-22' },
  { id: '4', titulo: 'Todos os Canais de Esporte Disponíveis no Streaming em 2026', slug: 'canais-esporte-streaming-2026', categoria: 'canais', status: 'publicado', visualizacoes: 5340, gerado_por_ia: true, publicado_em: '2026-07-22' },
  { id: '5', titulo: 'Como Assistir Futebol ao Vivo de Graça na Internet em 2026', slug: 'futebol-ao-vivo-gratis-internet', categoria: 'onde-assistir', status: 'publicado', visualizacoes: 34200, gerado_por_ia: true, publicado_em: '2026-07-21' },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('futebol');
  const [newContent, setNewContent] = useState('');

  const filteredPosts = posts.filter(p =>
    p.titulo.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newPost: PostItem = {
      id: Date.now().toString(),
      titulo: newTitle,
      slug,
      categoria: newCategory,
      status: 'publicado',
      visualizacoes: 0,
      gerado_por_ia: false,
      publicado_em: new Date().toISOString().split('T')[0]
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              📝 Gerenciar Artigos do Blog
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
              Visualize, edite ou crie novos guias editoriais para o site.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10,
              background: '#E50914', color: '#fff',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(229,9,20,0.3)',
            }}
          >
            <Plus size={16} /> Novo Artigo
          </button>
        </div>

        {/* Busca */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B6B85' }} />
          <input
            type="text"
            placeholder="Buscar por título ou categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
              background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', fontSize: 14, outline: 'none'
            }}
          />
        </div>

        {/* Tabela de Posts */}
        <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85' }}>Título / Slug</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85' }}>Categoria</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85' }}>Status</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85' }}>Visitas</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85' }}>Origem</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B6B85', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{post.titulo}</div>
                    <div style={{ fontSize: 11, color: '#6B6B85' }}>/blog/{post.slug}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: '#A0A0B5', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {post.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Publicado
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 13, color: '#A0A0B5', fontWeight: 600 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={14} color="#6B6B85" /> {post.visualizacoes.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {post.gerado_por_ia ? (
                      <span style={{ fontSize: 11, color: '#818CF8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                        <Sparkles size={11} /> Agente IA
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#A0A0B5', fontWeight: 600 }}>Manual</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Ver no site"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{ padding: 6, borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Criação de Post */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 600, background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                📝 Criar Novo Artigo Manual
              </h2>
              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Título do Artigo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Onde Assistir o Jogo do Palmeiras Hoje"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Categoria</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' }}
                  >
                    <option value="futebol">Futebol</option>
                    <option value="cinema">Cinema</option>
                    <option value="series">Séries</option>
                    <option value="canais">Canais</option>
                    <option value="onde-assistir">Onde Assistir</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Resumo do Artigo</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva um breve resumo atrativo para o leitor..."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#07070D', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '10px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', borderRadius: 8, background: '#E50914', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}
                  >
                    Publicar Artigo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
