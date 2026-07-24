'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Play, Pause, Settings2, RefreshCw, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIProvider } from '@/lib/ai/providers';

const PROVIDERS: { value: AIProvider; label: string; models: string[] }[] = [
  { value: 'gemini', label: '🟢 Google Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'] },
  { value: 'claude', label: '🟠 Anthropic Claude', models: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022'] },
  { value: 'openai', label: '🔵 OpenAI / GPT', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'] },
  { value: 'groq', label: '⚡ GROQ (Ultra rápido)', models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'] },
];

const INICIAL_AGENTES = [
  {
    id: '1', nome: 'Agente Futebol', tipo: '⚽', categoria: 'futebol',
    provider_ia: 'gemini' as AIProvider, modelo: 'gemini-1.5-flash',
    ativo: true, posts_por_dia: 3, dias_antecipacao: 3,
    temperatura: 0.7, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '2026-07-17T18:00:00Z', proxima_execucao: '2026-07-17T20:00:00Z',
    total_posts: 142, logs: [
      { status: 'sucesso', msg: 'Gerou post: Flamengo x Palmeiras 18/07', ago: '2h' },
      { status: 'sucesso', msg: 'Gerou post: Brasileirão Rodada 15', ago: '6h' },
    ],
    apis: ['football-data.org', 'API-Football (escudos)'],
    keywords: ['onde assistir', 'ao vivo hoje', 'qual canal passa', 'transmissão'],
  },
  {
    id: '2', nome: 'Agente Cinema', tipo: '🎬', categoria: 'cinema',
    provider_ia: 'groq' as AIProvider, modelo: 'llama-3.3-70b-versatile',
    ativo: true, posts_por_dia: 2, dias_antecipacao: 5,
    temperatura: 0.8, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '2026-07-17T09:00:00Z', proxima_execucao: '2026-07-18T09:00:00Z',
    total_posts: 89, logs: [
      { status: 'sucesso', msg: 'Gerou: Onde assistir Deadpool & Wolverine', ago: '4h' },
    ],
    apis: ['TMDB (filmes)', 'TMDB (onde assistir)'],
    keywords: ['onde assistir', 'estreias', 'onde ver online', 'estreia hoje'],
  },
  {
    id: '3', nome: 'Agente Séries', tipo: '📺', categoria: 'series',
    provider_ia: 'claude' as AIProvider, modelo: 'claude-3-5-haiku-20241022',
    ativo: true, posts_por_dia: 2, dias_antecipacao: 2,
    temperatura: 0.75, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '2026-07-17T17:00:00Z', proxima_execucao: '2026-07-17T21:00:00Z',
    total_posts: 76, logs: [
      { status: 'sucesso', msg: 'Gerou: Stranger Things S5 data estreia', ago: '1h' },
    ],
    apis: ['TMDB (séries)', 'TMDB (episódios)'],
    keywords: ['quando estreia', 'onde assistir', 'nova temporada', 'novos episódios'],
  },
  {
    id: '4', nome: 'Agente Canais', tipo: '📡', categoria: 'canais',
    provider_ia: 'gemini' as AIProvider, modelo: 'gemini-1.5-pro',
    ativo: false, posts_por_dia: 2, dias_antecipacao: 0,
    temperatura: 0.6, auto_publicar: false, requer_aprovacao: true,
    ultima_execucao: '2026-07-16T10:00:00Z', proxima_execucao: 'Manual',
    total_posts: 23, logs: [
      { status: 'erro', msg: 'Timeout na API de grade de programação', ago: '1d' },
    ],
    apis: [],
    keywords: ['canais disponíveis', 'guia de canais', 'como assistir canal'],
  },
  {
    id: '5', nome: 'Agente Onde Assistir', tipo: '🔍', categoria: 'onde-assistir',
    provider_ia: 'groq' as AIProvider, modelo: 'llama-3.3-70b-versatile',
    ativo: true, posts_por_dia: 4, dias_antecipacao: 0,
    temperatura: 0.65, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '2026-07-17T19:30:00Z', proxima_execucao: '2026-07-17T21:30:00Z',
    total_posts: 198, logs: [
      { status: 'sucesso', msg: 'Gerou: Como assistir futebol grátis 2026', ago: '30min' },
    ],
    apis: ['Google Trends RSS'],
    keywords: ['onde assistir', 'como assistir', 'grátis', 'streaming barato'],
  },
];

export default function AdminAgentesPage() {
  const [agentes, setAgentes] = useState(INICIAL_AGENTES);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [rodando, setRodando] = useState<string | null>(null);

  function toggleAgente(id: string) {
    setAgentes(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
  }

  async function rodarAgente(id: string) {
    setRodando(id);
    const cookies = typeof document !== 'undefined' ? document.cookie.split('; ') : [];
    const adminCookie = cookies.find(row => row.startsWith('cineplay_admin_token='));
    const token = adminCookie ? adminCookie.split('=')[1] : 'cineplay-admin-2026';

    try {
      await fetch('/api/agentes/run', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agente_id: id }),
      });
    } finally {
      setTimeout(() => setRodando(null), 2000);
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
              🤖 Agentes de IA
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Configure e monitore os agentes que geram conteúdo automaticamente.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={async () => {
                for (const a of agentes.filter(a => a.ativo)) {
                  await rodarAgente(a.id);
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-red)', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
              }}
            >
              <RefreshCw size={15} /> Rodar Todos Agora
            </button>
          </div>
        </div>

        {/* Cards de agentes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {agentes.map(agente => (
            <div key={agente.id} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${agente.ativo ? 'var(--border-subtle)' : 'var(--border-subtle)'}`,
              borderLeft: `3px solid ${agente.ativo ? 'var(--color-success)' : 'var(--text-disabled)'}`,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              transition: 'all 0.2s',
            }}>
              {/* Header do agente */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 24 }}>{agente.tipo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15 }}>{agente.nome}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: agente.ativo ? 'rgba(16,185,129,0.1)' : 'rgba(100,100,100,0.1)',
                      color: agente.ativo ? 'var(--color-success)' : 'var(--text-muted)',
                    }}>
                      {agente.ativo ? '● ATIVO' : '○ PAUSADO'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 16 }}>
                    <span>Provider: <strong style={{ color: 'var(--text-secondary)' }}>{PROVIDERS.find(p => p.value === agente.provider_ia)?.label}</strong></span>
                    <span>{agente.posts_por_dia} posts/dia</span>
                    <span>{agente.dias_antecipacao}d antecipação</span>
                    <span>{agente.total_posts} posts gerados</span>
                  </div>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    onClick={() => rodarAgente(agente.id)}
                    disabled={rodando === agente.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 8,
                      border: '1px solid var(--border-default)',
                      background: rodando === agente.id ? 'rgba(229,9,20,0.1)' : 'transparent',
                      color: rodando === agente.id ? 'var(--brand-red)' : 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}
                  >
                    <RefreshCw size={12} className={rodando === agente.id ? 'animate-spin' : ''} />
                    {rodando === agente.id ? 'Rodando...' : 'Rodar'}
                  </button>
                  <button
                    onClick={() => toggleAgente(agente.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 8,
                      border: '1px solid var(--border-default)',
                      background: 'transparent', color: 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {agente.ativo ? <Pause size={12} /> : <Play size={12} />}
                    {agente.ativo ? 'Pausar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => setExpandido(expandido === agente.id ? null : agente.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 8,
                      border: '1px solid var(--border-default)',
                      background: expandido === agente.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
                    }}
                  >
                    <Settings2 size={12} />
                    {expandido === agente.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              </div>

              {/* Configurações expandidas */}
              {expandido === agente.id && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Provider */}
                  <div>
                    <label className="form-label">Provider de IA</label>
                    <select className="form-input" defaultValue={agente.provider_ia}>
                      {PROVIDERS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modelo */}
                  <div>
                    <label className="form-label">Modelo</label>
                    <select className="form-input" defaultValue={agente.modelo}>
                      {PROVIDERS.find(p => p.value === agente.provider_ia)?.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Posts por dia */}
                  <div>
                    <label className="form-label">Posts por Dia (meta)</label>
                    <input className="form-input" type="number" min={1} max={10} defaultValue={agente.posts_por_dia} />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>O agente vai gerar no mínimo X posts diariamente</p>
                  </div>

                  {/* Antecipação */}
                  <div>
                    <label className="form-label">Dias de Antecipação</label>
                    <input className="form-input" type="number" min={0} max={14} defaultValue={agente.dias_antecipacao} />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Posts sobre eventos futuros criados X dias antes</p>
                  </div>

                  {/* Temperatura */}
                  <div>
                    <label className="form-label">Temperatura da IA ({agente.temperatura})</label>
                    <input type="range" min="0" max="1" step="0.05" defaultValue={agente.temperatura}
                      style={{ width: '100%', accentColor: 'var(--brand-red)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-disabled)', marginTop: 4 }}>
                      <span>Mais preciso</span><span>Mais criativo</span>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={agente.auto_publicar} style={{ accentColor: 'var(--brand-red)', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Auto Publicar</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Publica sem aprovação manual</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={agente.requer_aprovacao} style={{ accentColor: 'var(--brand-red)', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Requer Aprovação</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Salva como rascunho para você revisar</div>
                      </div>
                    </label>
                  </div>

                  {/* Prompt customizado */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Prompt do Sistema (opcional — sobrescreve o padrão)</label>
                    <textarea className="form-input" rows={4}
                      placeholder="Deixe em branco para usar o prompt padrão de jornalista especializado em streaming..."
                      style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} />
                  </div>

                  {/* Keywords */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Keywords SEO obrigatórias</label>
                    <input className="form-input" defaultValue={agente.keywords.join(', ')} placeholder="onde assistir, ao vivo, streaming..." />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Separadas por vírgula. A IA vai incluir essas palavras naturalmente.</p>
                  </div>

                  {/* APIs usadas */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">APIs de Dados Utilizadas</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(agente.apis.length > 0 ? agente.apis : ['Nenhuma API externa']).map(api => (
                        <span key={api} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Logs */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Últimas Execuções</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {agente.logs.map((log, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 12px', borderRadius: 8,
                          background: log.status === 'sucesso' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                          border: `1px solid ${log.status === 'sucesso' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                        }}>
                          <span style={{ fontSize: 14 }}>{log.status === 'sucesso' ? '✅' : '❌'}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{log.msg}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.ago} atrás</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salvar */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                      Cancelar
                    </button>
                    <button style={{
                      padding: '9px 20px', borderRadius: 'var(--radius-md)',
                      background: 'var(--gradient-red)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                    }}>
                      Salvar Configuração
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
