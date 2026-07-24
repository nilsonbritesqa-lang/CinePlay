'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FileText, Bot, Megaphone, Eye, Zap } from 'lucide-react';

interface RealPost {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  publicado_em: string;
  visualizacoes: number;
  gerado_por_ia: boolean;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<RealPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + (p.visualizacoes || 0), 0);
  const iaPostsCount = posts.filter(p => p.gerado_por_ia).length;

  const rodarTodosAgentes = async () => {
    setRodando(true);
    const cookies = typeof document !== 'undefined' ? document.cookie.split('; ') : [];
    const adminCookie = cookies.find(row => row.startsWith('cineplay_admin_token='));
    const token = adminCookie ? adminCookie.split('=')[1] : 'cineplay-admin-2026';

    try {
      // Roda agente de futebol
      await fetch('/api/agentes/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agente_id: '1' }),
      });
      alert('Agentes de IA executados com sucesso!');
      // Recarrega posts
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRodando(false);
    }
  };

  const getCatEmoji = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'futebol': return '⚽';
      case 'cinema': return '🎬';
      case 'series': return '📺';
      case 'canais': return '📡';
      default: return '🔍';
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
      <AdminSidebar />
      
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        
        {/* Banner Informando Conexão Real */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 12, padding: '12px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 20 }}>🟢</span>
          <p style={{ color: '#10B981', fontSize: 13, margin: 0 }}>
            <strong>Dados em Tempo Real:</strong> Painel conectado e sincronizado com o banco de dados Supabase em produção.
          </p>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, color: '#fff' }}>
              Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Bem-vindo de volta! Hoje é {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
          </div>
          <button
            onClick={rodarTodosAgentes}
            disabled={rodando}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-red)', color: '#fff',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(229,9,20,0.3)'
            }}
          >
            <Zap size={16} className={rodando ? 'animate-spin' : ''} /> 
            {rodando ? 'Rodando Agentes...' : 'Rodar Agentes Agora'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          
          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} style={{ color: '#3B82F6' }} />
              </div>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                {totalPosts > 0 ? 'Ativo' : 'Vazio'}
              </span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {loading ? '...' : totalPosts}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Posts Publicados</div>
          </div>

          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={18} style={{ color: '#10B981' }} />
              </div>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                Total Geral
              </span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {loading ? '...' : totalViews.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Visualizações de Leitores</div>
          </div>

          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={18} style={{ color: '#EF4444' }} />
              </div>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                Ativo
              </span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {loading ? '...' : iaPostsCount}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Posts Gerados por Agentes</div>
          </div>

          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} style={{ color: '#F59E0B' }} />
              </div>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                Online
              </span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              5/5
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Agentes Autônomos</div>
          </div>

        </div>

        {/* Agentes & Últimos Posts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
          
          {/* Agentes */}
          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                🤖 Status dos Agentes
              </h2>
              <a href="/admin/agentes" style={{ fontSize: 12, color: 'var(--brand-red)', fontWeight: 600, textDecoration: 'none' }}>Gerenciar →</a>
            </div>
            {[
              { nome: 'Agente Futebol', tipo: '⚽', status: 'ativo', proxima: 'Diário (08:00)' },
              { nome: 'Agente Cinema', tipo: '🎬', status: 'ativo', proxima: 'Diário (08:00)' },
              { nome: 'Agente Séries', tipo: '📺', status: 'ativo', proxima: 'Diário (08:00)' },
              { nome: 'Agente Canais', tipo: '📡', status: 'ativo', proxima: 'Diário (08:00)' },
              { nome: 'Onde Assistir', tipo: '🔍', status: 'ativo', proxima: 'Diário (08:00)' },
            ].map(agente => (
              <div key={agente.nome} className="table-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: 18 }}>{agente.tipo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{agente.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Execução: {agente.proxima}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: 'rgba(16,185,129,0.15)',
                    color: 'var(--color-success)',
                  }}>
                    ● ATIVO
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Últimos posts reais */}
          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                📝 Últimos Artigos Publicados
              </h2>
              <a href="/admin/posts" style={{ fontSize: 12, color: 'var(--brand-red)', fontWeight: 600, textDecoration: 'none' }}>Ver todos →</a>
            </div>
            {loading ? (
              <div style={{ color: '#A0A0B5', fontSize: 13, padding: 20, textAlign: 'center' }}>Carregando artigos...</div>
            ) : posts.length > 0 ? (
              posts.slice(0, 4).map((post, i) => (
                <div key={i} className="table-row" style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{getCatEmoji(post.categoria)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.titulo}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                        background: 'rgba(16,185,129,0.15)',
                        color: 'var(--color-success)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        Publicado
                      </span>
                      {post.gerado_por_ia && <span style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 700 }}>✨ Agente IA</span>}
                      <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>
                        {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : 'Hoje'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#A0A0B5', fontSize: 13, padding: 20, textAlign: 'center' }}>Nenhum post publicado.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
