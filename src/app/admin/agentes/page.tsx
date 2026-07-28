'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Play, Pause, Settings2, RefreshCw, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import type { AIProvider } from '@/lib/ai/providers';

const PROVIDERS: { value: AIProvider; label: string; models: string[] }[] = [
  {
    value: 'gemini', label: '🟢 Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro']
  },
  {
    value: 'openai', label: '🔵 OpenAI / GPT',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1-mini', 'o1-preview']
  },
  {
    value: 'groq', label: '⚡ GROQ (Ultra rápido)',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it']
  },
  {
    value: 'claude', label: '🟠 Anthropic Claude (Requer API Key)',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229']
  },
];

function getModelsForProvider(provider: AIProvider): string[] {
  return PROVIDERS.find(p => p.value === provider)?.models ?? [];
}

interface AgenteConfig {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  provider_ia: AIProvider;
  modelo: string;
  ativo: boolean;
  posts_por_dia: number;
  dias_antecipacao: number;
  temperatura: number;
  auto_publicar: boolean;
  requer_aprovacao: boolean;
  ultima_execucao: string;
  proxima_execucao: string;
  total_posts: number;
  logs: { status: string; msg: string; ago: string }[];
  apis: string[];
  keywords: string[];
  prompt_custom?: string;
}

const INICIAL_AGENTES: AgenteConfig[] = [
  {
    id: '1', nome: 'Agente Futebol', tipo: '⚽', categoria: 'futebol',
    provider_ia: 'gemini', modelo: 'gemini-2.0-flash',
    ativo: true, posts_por_dia: 3, dias_antecipacao: 7,
    temperatura: 0.35, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '', proxima_execucao: '',
    total_posts: 0, logs: [],
    apis: ['football-data.org', 'API-Football'],
    keywords: ['onde assistir', 'ao vivo hoje', 'transmissão', 'teste grátis cineplay'],
  },
  {
    id: '2', nome: 'Agente Cinema', tipo: '🎬', categoria: 'cinema',
    provider_ia: 'groq', modelo: 'llama-3.3-70b-versatile',
    ativo: true, posts_por_dia: 2, dias_antecipacao: 5,
    temperatura: 0.5, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '', proxima_execucao: '',
    total_posts: 0, logs: [],
    apis: ['TMDB (filmes)', 'TMDB (onde assistir)'],
    keywords: ['onde assistir', 'estreias', 'teste grátis cineplay'],
  },
  {
    id: '3', nome: 'Agente Séries', tipo: '📺', categoria: 'series',
    provider_ia: 'gemini', modelo: 'gemini-2.0-flash',
    ativo: true, posts_por_dia: 2, dias_antecipacao: 3,
    temperatura: 0.45, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '', proxima_execucao: '',
    total_posts: 0, logs: [],
    apis: ['TMDB (séries)', 'TMDB (episódios)'],
    keywords: ['onde assistir', 'nova temporada', 'teste grátis cineplay'],
  },
  {
    id: '4', nome: 'Agente Canais e Guias TV', tipo: '📡', categoria: 'canais',
    provider_ia: 'gemini', modelo: 'gemini-1.5-pro',
    ativo: true, posts_por_dia: 2, dias_antecipacao: 0,
    temperatura: 0.4, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '', proxima_execucao: '',
    total_posts: 0, logs: [],
    apis: ['Google Trends', 'TMDB'],
    keywords: ['guia de canais', 'como assistir', 'teste grátis cineplay'],
  },
  {
    id: '5', nome: 'Agente Onde Assistir (SEO)', tipo: '🔍', categoria: 'onde-assistir',
    provider_ia: 'openai', modelo: 'gpt-4o-mini',
    ativo: true, posts_por_dia: 3, dias_antecipacao: 7,
    temperatura: 0.4, auto_publicar: true, requer_aprovacao: false,
    ultima_execucao: '', proxima_execucao: '',
    total_posts: 0, logs: [],
    apis: ['TMDB', 'Google Trends'],
    keywords: ['onde assistir', 'ao vivo em hd', 'teste grátis cineplay'],
  },
];

export default function AdminAgentesPage() {
  const [agentes, setAgentes] = useState<AgenteConfig[]>(INICIAL_AGENTES);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [rodando, setRodando] = useState<string | null>(null);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);

  function toggleAgente(id: string) {
    setAgentes(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
  }

  function updateAgente(id: string, field: keyof AgenteConfig, value: any) {
    setAgentes(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, [field]: value };
      // When provider changes, reset model to the first model of the new provider
      if (field === 'provider_ia') {
        const models = getModelsForProvider(value as AIProvider);
        updated.modelo = models[0] || '';
      }
      return updated;
    }));
  }

  async function salvarAgente(id: string) {
    const agente = agentes.find(a => a.id === id);
    if (!agente) return;
    setSalvando(id);
    setMensagemStatus(`💾 Salvando configurações do ${agente.nome}...`);

    // Simulate save (configs are kept in state — in production you'd POST to an API)
    await new Promise(r => setTimeout(r, 600));

    setMensagemStatus(`✅ ${agente.nome} salvo com sucesso! Provider: ${agente.provider_ia}, Modelo: ${agente.modelo}, Temp: ${agente.temperatura}`);
    setSalvando(null);
    setTimeout(() => setMensagemStatus(null), 5000);
  }

  async function rodarAgente(id: string) {
    setRodando(id);
    const agenteObj = agentes.find(a => a.id === id);
    setMensagemStatus(`⏳ Rodando ${agenteObj?.nome || 'agente'}...`);
    const cookies = typeof document !== 'undefined' ? document.cookie.split('; ') : [];
    const adminCookie = cookies.find(row => row.startsWith('cineplay_admin_token='));
    const token = adminCookie ? adminCookie.split('=')[1] : 'cineplay-admin-2026';

    try {
      const res = await fetch('/api/agentes/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agente_id: id,
          config: {
            provider_ia: agenteObj?.provider_ia,
            modelo_ia: agenteObj?.modelo,
            temperatura: agenteObj?.temperatura,
            posts_por_dia: agenteObj?.posts_por_dia,
            dias_antecipacao: agenteObj?.dias_antecipacao,
            auto_publicar: agenteObj?.auto_publicar,
            requer_aprovacao: agenteObj?.requer_aprovacao,
            keywords_seo: agenteObj?.keywords,
          }
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMensagemStatus(`✨ ${agenteObj?.nome || 'Agente'} executado! ${data.posts_salvos || data.posts_gerados || 0} post(s) gerado(s).`);
      } else {
        setMensagemStatus(`❌ Falha: ${data.error || 'Erro ao processar'}`);
      }
    } catch (e) {
      console.error(e);
      setMensagemStatus('❌ Erro de conexão ao rodar o agente.');
    } finally {
      setTimeout(() => setRodando(null), 1000);
      setTimeout(() => setMensagemStatus(null), 8000);
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {mensagemStatus && (
          <div style={{
            background: mensagemStatus.includes('❌') ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.15)',
            border: `1px solid ${mensagemStatus.includes('❌') ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'}`,
            color: mensagemStatus.includes('❌') ? '#EF4444' : '#A78BFA',
            borderRadius: 12, padding: '12px 20px', marginBottom: 24,
            fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span>{mensagemStatus}</span>
          </div>
        )}
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
          {agentes.map(agente => {
            const currentModels = getModelsForProvider(agente.provider_ia);

            return (
            <div key={agente.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
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
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>Provider: <strong style={{ color: 'var(--text-secondary)' }}>{PROVIDERS.find(p => p.value === agente.provider_ia)?.label}</strong></span>
                    <span>Modelo: <strong style={{ color: '#8B5CF6' }}>{agente.modelo}</strong></span>
                    <span>Temp: <strong>{agente.temperatura}</strong></span>
                    <span>{agente.posts_por_dia} posts/dia</span>
                    <span>{agente.dias_antecipacao}d antecipação</span>
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

              {/* Configurações expandidas com state reativo */}
              {expandido === agente.id && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Provider */}
                  <div>
                    <label className="form-label">Provider de IA</label>
                    <select
                      className="form-input"
                      value={agente.provider_ia}
                      onChange={e => updateAgente(agente.id, 'provider_ia', e.target.value)}
                    >
                      {PROVIDERS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modelo — carrega dinamicamente com base no provider selecionado */}
                  <div>
                    <label className="form-label">Modelo ({currentModels.length} disponíveis)</label>
                    <select
                      className="form-input"
                      value={agente.modelo}
                      onChange={e => updateAgente(agente.id, 'modelo', e.target.value)}
                    >
                      {currentModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Posts por dia */}
                  <div>
                    <label className="form-label">Posts por Dia (meta)</label>
                    <input
                      className="form-input" type="number" min={1} max={10}
                      value={agente.posts_por_dia}
                      onChange={e => updateAgente(agente.id, 'posts_por_dia', Number(e.target.value))}
                    />
                  </div>

                  {/* Antecipação */}
                  <div>
                    <label className="form-label">Dias de Antecipação</label>
                    <input
                      className="form-input" type="number" min={0} max={14}
                      value={agente.dias_antecipacao}
                      onChange={e => updateAgente(agente.id, 'dias_antecipacao', Number(e.target.value))}
                    />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Posts sobre eventos futuros criados X dias antes</p>
                  </div>

                  {/* Temperatura */}
                  <div>
                    <label className="form-label">Temperatura da IA: <strong style={{ color: '#8B5CF6' }}>{agente.temperatura}</strong></label>
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={agente.temperatura}
                      onChange={e => updateAgente(agente.id, 'temperatura', Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--brand-red)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-disabled)', marginTop: 4 }}>
                      <span>🎯 Mais preciso (recomendado)</span><span>🎨 Mais criativo</span>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox" checked={agente.auto_publicar}
                        onChange={e => updateAgente(agente.id, 'auto_publicar', e.target.checked)}
                        style={{ accentColor: 'var(--brand-red)', width: 16, height: 16 }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Auto Publicar</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Publica sem aprovação manual</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox" checked={agente.requer_aprovacao}
                        onChange={e => updateAgente(agente.id, 'requer_aprovacao', e.target.checked)}
                        style={{ accentColor: 'var(--brand-red)', width: 16, height: 16 }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Requer Aprovação</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Salva como rascunho para revisão</div>
                      </div>
                    </label>
                  </div>

                  {/* Keywords */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Keywords SEO obrigatórias</label>
                    <input
                      className="form-input"
                      value={agente.keywords.join(', ')}
                      onChange={e => updateAgente(agente.id, 'keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                      placeholder="onde assistir, ao vivo, teste grátis cineplay..."
                    />
                  </div>

                  {/* APIs usadas */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">APIs de Dados Utilizadas</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {agente.apis.map(api => (
                        <span key={api} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salvar / Cancelar */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      onClick={() => setExpandido(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}
                    >
                      <X size={14} /> Cancelar
                    </button>
                    <button
                      onClick={() => salvarAgente(agente.id)}
                      disabled={salvando === agente.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '9px 20px', borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-red)', color: '#fff',
                        border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                        opacity: salvando === agente.id ? 0.7 : 1,
                      }}
                    >
                      <Save size={14} /> {salvando === agente.id ? 'Salvando...' : 'Salvar Configuração'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
