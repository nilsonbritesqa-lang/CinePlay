'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FileText, Plus, Search, Eye, Edit, Trash2, CheckCircle2, Sparkles, RefreshCw, Wand2, Calendar, Clock } from 'lucide-react';

interface PostItem {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  categoria: string;
  conteudo_html: string;
  imagem_capa_url: string;
  visualizacoes: number;
  gerado_por_ia: boolean;
  publicado_em: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal de Criação / Edição Manual
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);

  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    categoria: 'futebol',
    imagem_capa_url: '',
    publicado_em: '',
    conteudo_html: ''
  });

  // Modal de Correção com IA
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPostTarget, setAiPostTarget] = useState<PostItem | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

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
    p.categoria.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir Modal para Criar
  const handleOpenCreate = () => {
    setEditingPost(null);
    setForm({
      titulo: '',
      slug: '',
      resumo: '',
      categoria: 'futebol',
      imagem_capa_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
      publicado_em: new Date().toISOString().slice(0, 16),
      conteudo_html: '<h2>Subtítulo</h2><p>Escreva aqui o conteúdo do seu artigo...</p>'
    });
    setShowEditModal(true);
  };

  // Abrir Modal para Editar
  const handleOpenEdit = (post: PostItem) => {
    setEditingPost(post);
    setForm({
      titulo: post.titulo || '',
      slug: post.slug || '',
      resumo: post.resumo || '',
      categoria: post.categoria || 'futebol',
      imagem_capa_url: post.imagem_capa_url || '',
      publicado_em: post.publicado_em ? new Date(post.publicado_em).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      conteudo_html: post.conteudo_html || ''
    });
    setShowEditModal(true);
  };

  // Salvar Post (Criar ou Editar Manual)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    setIsSubmitting(true);
    const generatedSlug = form.slug.trim() || form.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      if (editingPost) {
        // PUT Update
        const res = await fetch('/api/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingPost.id,
            titulo: form.titulo,
            slug: generatedSlug,
            resumo: form.resumo,
            categoria: form.categoria,
            imagem_capa_url: form.imagem_capa_url,
            publicado_em: new Date(form.publicado_em).toISOString(),
            conteudo_html: form.conteudo_html
          })
        });
        const data = await res.json();
        if (data.success && data.post) {
          setPosts(posts.map(p => p.id === editingPost.id ? data.post : p));
          setShowEditModal(false);
        } else {
          alert('Erro ao atualizar post: ' + (data.error || 'Erro desconhecido'));
        }
      } else {
        // POST Create
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: form.titulo,
            slug: generatedSlug,
            resumo: form.resumo || form.titulo,
            categoria: form.categoria,
            imagem_capa_url: form.imagem_capa_url,
            publicado_em: new Date(form.publicado_em).toISOString(),
            conteudo_html: form.conteudo_html,
            gerado_por_ia: false,
          }),
        });
        const data = await res.json();
        if (data.success && data.post) {
          setPosts([data.post, ...posts]);
          setShowEditModal(false);
        } else {
          alert('Erro ao criar post: ' + (data.error || 'Tente novamente'));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir Modal de Solicitação de Correção por IA
  const handleOpenAiModal = (post: PostItem) => {
    setAiPostTarget(post);
    setAiPrompt('');
    setShowAiModal(true);
  };

  // Executar Correção por IA
  const handleRunAiRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPostTarget || !aiPrompt.trim()) return;

    setIsAiProcessing(true);
    try {
      const res = await fetch('/api/posts/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: aiPostTarget.id,
          prompt_correcao: aiPrompt
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(posts.map(p => p.id === aiPostTarget.id ? data.post : p));
        setShowAiModal(false);
        alert('✨ Post reescrito e corrigido pela IA com sucesso!');
      } else {
        alert('Erro ao processar correção com IA: ' + (data.error || 'Tente novamente'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao processar correção por IA.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Excluir Post
  const handleDeletePost = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este post do Supabase?')) {
      try {
        const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setPosts(posts.filter(p => p.id !== id));
        } else {
          alert('Erro ao excluir post: ' + (data.error || 'Tente novamente'));
        }
      } catch (err) {
        console.error(err);
        alert('Erro de conexão ao excluir post.');
      }
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
                Edite manualmente, corrija informações com IA e acompanhe as datas de publicação dos artigos do seu blog.
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
                onClick={handleOpenCreate}
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
                placeholder="Buscar por título, categoria ou slug..."
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
                Carregando artigos salvos no Supabase...
              </div>
            ) : filteredPosts.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: '#A0A0B5' }}>
                    <th style={{ padding: '14px 16px' }}>Título / Slug</th>
                    <th style={{ padding: '14px 16px' }}>Categoria</th>
                    <th style={{ padding: '14px 16px' }}>Data e Hora Publicado</th>
                    <th style={{ padding: '14px 16px' }}>Origem</th>
                    <th style={{ padding: '14px 16px' }}>Views</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => {
                    const pubDate = post.publicado_em ? new Date(post.publicado_em) : new Date();
                    const dateFormatted = pubDate.toLocaleDateString('pt-BR');
                    const timeFormatted = pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fff', maxWidth: 300 }}>
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
                        <td style={{ padding: '14px 16px', color: '#A0A0B5' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#fff' }}>
                            <Calendar size={13} color="#8B5CF6" /> {dateFormatted}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#A0A0B5', marginTop: 2 }}>
                            <Clock size={12} /> {timeFormatted}
                          </div>
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
                        <td style={{ padding: '14px 16px', color: '#A0A0B5', fontWeight: 700 }}>
                          {(post.visualizacoes || 0).toLocaleString('pt-BR')}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            {/* Ver */}
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ padding: 7, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', display: 'inline-flex', alignItems: 'center' }}
                              title="Visualizar Artigo"
                            >
                              <Eye size={14} />
                            </a>

                            {/* Editar Manual */}
                            <button
                              onClick={() => handleOpenEdit(post)}
                              style={{ padding: 7, borderRadius: 8, background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              title="Editar Manualmente"
                            >
                              <Edit size={14} />
                            </button>

                            {/* Solicitar Correção com IA */}
                            <button
                              onClick={() => handleOpenAiModal(post)}
                              style={{ padding: 7, borderRadius: 8, background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              title="Solicitar Correção por IA"
                            >
                              <Wand2 size={14} />
                            </button>

                            {/* Excluir */}
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              style={{ padding: 7, borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              title="Excluir Permanentemente"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#A0A0B5' }}>
                Nenhum artigo encontrado com este filtro.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modal 1: Edição / Criação Manual */}
      {showEditModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 999,
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#0F0F18', border: '1px solid var(--border-subtle)',
            borderRadius: 20, width: '100%', maxWidth: 680, padding: 28, margin: 'auto'
          }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editingPost ? '✏️ Editar Post Manualmente' : '➕ Criar Novo Post Manual'}
            </h2>
            <form onSubmit={handleSavePost}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Título do Post</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Ex: Botafogo x Grêmio AO VIVO"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Slug da URL</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="Ex: onde-assistir-botafogo-x-gremio"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Categoria</label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                  >
                    <option value="futebol">Futebol</option>
                    <option value="cinema">Cinema</option>
                    <option value="series">Séries</option>
                    <option value="canais">Canais</option>
                    <option value="onde-assistir">Onde Assistir</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Data e Hora de Publicação</label>
                  <input
                    type="datetime-local"
                    value={form.publicado_em}
                    onChange={e => setForm({ ...form, publicado_em: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={form.imagem_capa_url}
                  onChange={e => setForm({ ...form, imagem_capa_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Resumo (Meta Description)</label>
                <textarea
                  value={form.resumo}
                  onChange={e => setForm({ ...form, resumo: e.target.value })}
                  rows={2}
                  placeholder="Breve resumo informativo do artigo..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 6 }}>Conteúdo HTML do Artigo</label>
                <textarea
                  value={form.conteudo_html}
                  onChange={e => setForm({ ...form, conteudo_html: e.target.value })}
                  rows={8}
                  placeholder="<h2>Subtítulo</h2><p>Escreva o conteúdo do artigo aqui...</p>"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#07070D', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: 13, fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '10px 20px', borderRadius: 8, background: '#E50914', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Outfit' }}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Solicitar Correção por Inteligência Artificial */}
      {showAiModal && aiPostTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 999
        }}>
          <div style={{
            background: '#0F0F18', border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: 20, width: '100%', maxWidth: 540, padding: 28
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B5CF6', marginBottom: 12 }}>
              <Wand2 size={22} />
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>Solicitar Correção por IA</h2>
            </div>
            
            <p style={{ color: '#A0A0B5', fontSize: 13, marginBottom: 18 }}>
              Artigo: <strong>{aiPostTarget.titulo}</strong>
            </p>

            <form onSubmit={handleRunAiRefine}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#A0A0B5', marginBottom: 8 }}>
                  O que você deseja que a IA corrija ou ajuste neste post?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  rows={4}
                  placeholder="Ex: 'Altere o horário do jogo para 21:30', 'Ajuste a chamada de WhatsApp para ficar mais informal', 'Corrija o resumo e a introdução'."
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#07070D', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={isAiProcessing}
                  style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isAiProcessing}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                    color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Outfit'
                  }}
                >
                  {isAiProcessing ? (
                    <>Refinando com IA...</>
                  ) : (
                    <><Wand2 size={16} /> Refinar Post com IA</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
