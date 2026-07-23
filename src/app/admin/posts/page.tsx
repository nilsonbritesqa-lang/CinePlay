'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FileText, Plus, Search, Eye, Edit, Trash2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('futebol');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Erro ao buscar posts no admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p =>
    p.titulo.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
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
    setIsSubmitting(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070D', color: '#F0F0F5' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>
                📝 Gerenciador de Posts
              </h1>
              <p style={{ color: '#A0A0B5', fontSize: 14 }}>
                Gerencie todos os artigos salvos no Supabase ou gerados autonomamente pelos Agentes de IA.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={fetchPosts}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Atualizar
              </button>

              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 18px', borderRadius: 10, background: '#E50914',
                  color: '#fff', fontSize: 13, fontWeight: 800, border: 'none',
                  cursor: 'pointer', fontFamily: 'Outfit'
                }}
              >
                <Plus size={16} /> Novo Post Manual
              </button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div style={{
            display: 'flex', gap: 16, marginBottom: 24,
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 14
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#A0A0B5' }} size={16} />
              <input
                type="text"
                placeholder="Buscar por título ou categoria..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px 10px 40px', borderRadius: 8,
                  background: '#07070D', border: '1px solid var(--border-subtle)',
                  color: '#fff', fontSize: 13, outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Tabela de Posts */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 16, overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#A0A0B5', fontSize: 14 }}>
                Carregando publicações do Supabase...
              </div>
            ) : filteredPosts.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: '#A0A0B5' }}>
                    <th style={{ padding: '14px 16px' }}>Título</th>
                    <th style={{ padding: '14px 16px' }}>Categoria</th>
                    <th style={{ padding: '14px 16px' }}>Origem</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Views</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fff', maxWidth: 360 }}>
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {post.titulo}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B6B85', fontWeight: 400, marginTop: 2 }}>
                          /{post.slug}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: 'rgba(255,255,255,0.05)', color: '#D0D0DB'
                        }}>
                          {post.categoria}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {post.gerado_por_ia ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8B5CF6', fontSize: 11, fontWeight: 700 }}>
                            <Sparkles size={12} /> Agente IA
                          </span>
                        ) : (
                          <span style={{ color: '#A0A0B5', fontSize: 11 }}>Manual</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: 'rgba(16, 185, 129, 0.12)', color: '#10B981'
                        }}>
                          <CheckCircle2 size={12} /> Publicado
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#A0A0B5', fontWeight: 700 }}>
                        {post.visualizacoes.toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                            title="Ver Artigo"
                          >
                            <Eye size={14} />
                          </a>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ padding: 6, borderRadius: 6, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'none', cursor: 'pointer' }}
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
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#A0A0B5' }}>
                Nenhum post encontrado.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modal de Criação Manual */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 999
        }}>
          <div style={{
            background: '#0F0F18', border: '1px solid var(--border-subtle)',
            borderRadius: 20, width: '100%', maxWidth: 540, padding: 24
          }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Criar Post Manual</h2>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Título do Post</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Onde Assistir o Jogo Hoje ao Vivo"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Categoria</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                >
                  <option value="futebol">Futebol</option>
                  <option value="cinema">Cinema</option>
                  <option value="series">Séries</option>
                  <option value="canais">Canais</option>
                  <option value="onde-assistir">Onde Assistir</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Conteúdo HTML</label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={5}
                  placeholder="<h2>Subtítulo</h2><p>Escreva o conteúdo do artigo aqui...</p>"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '10px 20px', borderRadius: 8, background: '#E50914', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Outfit' }}
                >
                  Salvar Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
