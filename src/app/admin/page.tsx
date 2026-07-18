'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { FileText, Bot, Megaphone, Eye, Zap, Play } from 'lucide-react';

const STATS = [
  { label: 'Posts Publicados', value: '247', change: '+12 hoje', icon: FileText, color: 'var(--cat-series)' },
  { label: 'Visualizações (30d)', value: '124.8K', change: '+18%', icon: Eye, color: 'var(--cat-futebol)' },
  { label: 'Cliques em CTAs', value: '3.241', change: '+8% hoje', icon: Megaphone, color: 'var(--brand-red)' },
  { label: 'Agentes Ativos', value: '5/5', change: 'Todos online', icon: Bot, color: 'var(--cat-canais)' },
];

const AGENTES_STATUS = [
  { nome: 'Agente Futebol', tipo: '⚽', status: 'ativo', ultima: 'há 2h', proxima: '20:00', posts_hoje: 3 },
  { nome: 'Agente Cinema', tipo: '🎬', status: 'ativo', ultima: 'há 4h', proxima: '09:00 amanhã', posts_hoje: 2 },
  { nome: 'Agente Séries', tipo: '📺', status: 'ativo', ultima: 'há 1h', proxima: '18:00', posts_hoje: 2 },
  { nome: 'Agente Canais', tipo: '📡', status: 'pausado', ultima: 'há 1d', proxima: 'Manual', posts_hoje: 0 },
  { nome: 'Onde Assistir', tipo: '🔍', status: 'ativo', ultima: 'há 30min', proxima: '15:00', posts_hoje: 4 },
];

const ULTIMOS_POSTS = [
  { titulo: 'Onde Assistir Flamengo x Palmeiras — 18/07', categoria: '⚽', status: 'publicado', ia: true, ago: '2h' },
  { titulo: 'Stranger Things Temporada 5: Data e Onde Assistir', categoria: '📺', status: 'publicado', ia: true, ago: '4h' },
  { titulo: 'Top 10 Filmes que Chegam ao Streaming em Julho', categoria: '🎬', status: 'agendado', ia: true, ago: '1h' },
  { titulo: 'Guia: Como Assistir Futebol Sem TV a Cabo em 2026', categoria: '🔍', status: 'rascunho', ia: false, ago: '6h' },
];

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
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
            <strong>Dados de Demonstração:</strong> Os dados de cliques, visualizações e posts exibidos abaixo são mockados localmente. Ao configurar o Supabase, as métricas e logs serão lidos em tempo real do banco de dados.
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
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-red)', color: '#fff',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(229,9,20,0.3)',
            }}
          >
            <Zap size={16} /> Rodar Agentes Agora
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${stat.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                    {stat.change}
                  </span>
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            );
          })}
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
            {AGENTES_STATUS.map(agente => (
              <div key={agente.nome} className="table-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: 18 }}>{agente.tipo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{agente.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Próxima: {agente.proxima}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {agente.posts_hoje} posts hoje
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: agente.status === 'ativo' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: agente.status === 'ativo' ? 'var(--color-success)' : 'var(--color-warning)',
                  }}>
                    {agente.status === 'ativo' ? '● ATIVO' : '⏸ PAUSADO'}
                  </span>
                </div>
                <button style={{
                  width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Play size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Últimos posts */}
          <div className="admin-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                📝 Últimos Posts
              </h2>
              <a href="/admin/posts" style={{ fontSize: 12, color: 'var(--brand-red)', fontWeight: 600, textDecoration: 'none' }}>Ver todos →</a>
            </div>
            {ULTIMOS_POSTS.map((post, i) => (
              <div key={i} className="table-row" style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{post.categoria}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.titulo}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                      background: post.status === 'publicado' ? 'rgba(16,185,129,0.15)' : post.status === 'agendado' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                      color: post.status === 'publicado' ? 'var(--color-success)' : post.status === 'agendado' ? 'var(--color-info)' : 'var(--color-warning)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {post.status}
                    </span>
                    {post.ia && <span style={{ fontSize: 10, color: 'var(--text-disabled)' }}>✨ IA</span>}
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{post.ago} atrás</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { href: '/admin/posts/novo', label: '+ Novo Post', icon: '📝', desc: 'Criar manualmente' },
            { href: '/admin/agentes', label: 'Configurar Agentes', icon: '🤖', desc: 'IA e automações' },
            { href: '/admin/ctas', label: 'Gerenciar CTAs', icon: '💰', desc: 'Patrocinadores' },
            { href: '/admin/config', label: 'Configurações', icon: '⚙️', desc: 'APIs e chaves' },
          ].map(action => (
            <a
              key={action.href}
              href={action.href}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s', cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 22 }}>{action.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{action.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
