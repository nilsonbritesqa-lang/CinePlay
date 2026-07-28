'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Save, Plus, Trash2, Edit, HelpCircle, MessageCircle, ExternalLink } from 'lucide-react';
import type { CTA, Patrocinador } from '@/lib/types';

const CATEGORIAS = [
  { value: 'futebol', label: '⚽ Futebol' },
  { value: 'cinema', label: '🎬 Cinema' },
  { value: 'series', label: '📺 Séries' },
  { value: 'canais', label: '📡 Canais' },
  { value: 'onde-assistir', label: '🔍 Onde Assistir' },
];

export default function AdminCTAsPage() {
  const [patrocinadores, setPatrocinadores] = useState<(Patrocinador & { ctas: CTA[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [linkType, setLinkType] = useState<'url' | 'whatsapp'>('whatsapp');
  
  // WhatsApp Form Fields
  const [whatsappNum, setWhatsappNum] = useState('(11) 99999-8888');
  const [whatsappMsg, setWhatsappMsg] = useState('Olá! Quero saber mais sobre os planos.');

  // Form state
  const [form, setForm] = useState({
    patrocinador_nome: '',
    texto_pre: 'Assista agora em alta definição:',
    texto_botao: 'Falar no WhatsApp',
    url_destino: '',
    cor_botao: '#25D366',
    cor_texto_botao: '#ffffff',
    categorias: ['futebol', 'cinema', 'series', 'canais', 'onde-assistir'] as string[],
    tipo_exibicao: 'inline',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
  });

  const fetchCTAs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ctas');
      const data = await res.json();
      if (data.success && data.patrocinadores) {
        setPatrocinadores(data.patrocinadores);
      }
    } catch (err) {
      console.error('Erro ao carregar patrocinadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCTAs();
  }, []);

  function toggleCategoria(cat: string) {
    setForm(f => ({
      ...f,
      categorias: f.categorias.includes(cat)
        ? f.categorias.filter(c => c !== cat)
        : [...f.categorias, cat],
    }));
  }

  // Helper to generate destination URL
  const getFinalUrl = () => {
    if (linkType === 'whatsapp') {
      const cleanNum = whatsappNum.replace(/\D/g, '');
      const fullNum = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      return `https://wa.me/${fullNum}?text=${encodedMsg}`;
    }
    return form.url_destino;
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCtaId, setEditingCtaId] = useState<string | null>(null);

  const handleSave = async () => {
    const finalUrl = getFinalUrl();
    const isEdit = !!editingId;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/ctas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          cta_id: editingCtaId,
          nome: form.patrocinador_nome || 'Patrocinador Oficial',
          texto_pre: form.texto_pre,
          texto_botao: form.texto_botao,
          url_destino: finalUrl,
          cor_botao: form.cor_botao,
          cor_texto_botao: form.cor_texto_botao,
          categorias: form.categorias,
          tipo_exibicao: form.tipo_exibicao
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCTAs();
        setShowForm(false);
        setEditingId(null);
        setEditingCtaId(null);
      } else {
        alert('Erro ao salvar CTA: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar CTA.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este patrocinador e seus CTAs?')) {
      try {
        const res = await fetch(`/api/ctas?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setPatrocinadores(patrocinadores.filter(p => p.id !== id));
        } else {
          alert('Erro ao excluir: ' + (data.error || 'Tente novamente'));
        }
      } catch (err) {
        console.error(err);
        alert('Erro de conexão ao excluir patrocinador.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        
        {/* Banner Status */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 12, padding: '12px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 20 }}>🟢</span>
          <p style={{ color: '#10B981', fontSize: 13, margin: 0 }}>
            <strong>Dados Reais Supabase:</strong> Todos os patrocinadores e botões CTA são sincronizados em tempo real no seu banco de dados.
          </p>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, color: '#fff' }}>
              💰 CTAs & Patrocinadores
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Configure botões rápidos, links tradicionais e atalhos para WhatsApp direto nos posts.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setEditingCtaId(null);
              setForm({
                patrocinador_nome: '',
                texto_pre: 'Assista agora em:',
                texto_botao: linkType === 'whatsapp' ? 'Falar no WhatsApp' : 'Ver Planos',
                url_destino: '',
                cor_botao: linkType === 'whatsapp' ? '#25D366' : '#E50914',
                cor_texto_botao: '#ffffff',
                categorias: [],
                tipo_exibicao: 'inline',
                data_inicio: new Date().toISOString().split('T')[0],
                data_fim: '',
              });
              setShowForm(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-red)', color: '#fff',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Novo Patrocinador
          </button>
        </div>

        {/* Form de criação / edição */}
        {showForm && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 28,
          }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, color: '#fff' }}>
              ✏️ Configurar Novo CTA Patrocinado
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="cta-form-grid">
              
              {/* Nome do patrocinador */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nome do Patrocinador</label>
                <input className="form-input" placeholder="Ex: Operadora Stream X" value={form.patrocinador_nome}
                  onChange={e => setForm(f => ({ ...f, patrocinador_nome: e.target.value }))} />
              </div>

              {/* Tipo de link selector */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Tipo de Ação / Destino</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkType('whatsapp');
                      setForm(f => ({ ...f, cor_botao: '#25D366', texto_botao: 'Falar no WhatsApp' }));
                    }}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12,
                      background: linkType === 'whatsapp' ? 'rgba(37, 211, 102, 0.1)' : 'transparent',
                      border: `1px solid ${linkType === 'whatsapp' ? '#25D366' : 'var(--border-default)'}`,
                      color: linkType === 'whatsapp' ? '#25D366' : 'var(--text-muted)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontWeight: 600, fontSize: 13
                    }}
                  >
                    <MessageCircle size={18} /> Direcionar para o WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkType('url');
                      setForm(f => ({ ...f, cor_botao: '#E50914', texto_botao: 'Ver Planos' }));
                    }}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12,
                      background: linkType === 'url' ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                      border: `1px solid ${linkType === 'url' ? '#E50914' : 'var(--border-default)'}`,
                      color: linkType === 'url' ? '#E50914' : 'var(--text-muted)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontWeight: 600, fontSize: 13
                    }}
                  >
                    <ExternalLink size={18} /> Link Externo / Site
                  </button>
                </div>
              </div>

              {/* URL ou Whatsapp Inputs */}
              {linkType === 'whatsapp' ? (
                <>
                  <div>
                    <label className="form-label">Número do WhatsApp (com DDD)</label>
                    <input
                      className="form-input"
                      placeholder="Ex: (11) 99999-8888"
                      value={whatsappNum}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                        let formatted = digits;
                        if (digits.length > 2 && digits.length <= 7) {
                          formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                        } else if (digits.length > 7) {
                          formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                        }
                        setWhatsappNum(formatted);
                      }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Mensagem Personalizada Automática</label>
                    <input className="form-input" placeholder="Ex: Olá, quero saber mais" value={whatsappMsg}
                      onChange={e => setWhatsappMsg(e.target.value)} />
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">URL de Destino (Link do Site)</label>
                  <input className="form-input" type="url" placeholder="https://operadora.com/planos?ref=cineplay"
                    value={form.url_destino} onChange={e => setForm(f => ({ ...f, url_destino: e.target.value }))} />
                </div>
              )}

              {/* Texto pré-botão */}
              <div>
                <label className="form-label">Texto informativo (antes do botão)</label>
                <input className="form-input" placeholder="Assista agora em:" value={form.texto_pre}
                  onChange={e => setForm(f => ({ ...f, texto_pre: e.target.value }))} />
              </div>

              {/* Texto do botão */}
              <div>
                <label className="form-label">Texto interno do Botão</label>
                <input className="form-input" placeholder="Falar Conosco" value={form.texto_botao}
                  onChange={e => setForm(f => ({ ...f, texto_botao: e.target.value }))} />
              </div>

              {/* Cores */}
              <div>
                <label className="form-label">Cor de Fundo do Botão</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="color" value={form.cor_botao}
                    onChange={e => setForm(f => ({ ...f, cor_botao: e.target.value }))}
                    style={{ width: 40, height: 38, borderRadius: 8, border: '1px solid var(--border-default)', cursor: 'pointer', background: 'none', padding: 2 }} />
                  <input className="form-input" value={form.cor_botao}
                    onChange={e => setForm(f => ({ ...f, cor_botao: e.target.value }))}
                    style={{ flex: 1 }} />
                </div>
              </div>

              <div>
                <label className="form-label">Cor do Texto do Botão</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="color" value={form.cor_texto_botao}
                    onChange={e => setForm(f => ({ ...f, cor_texto_botao: e.target.value }))}
                    style={{ width: 40, height: 38, borderRadius: 8, border: '1px solid var(--border-default)', cursor: 'pointer', background: 'none', padding: 2 }} />
                  <input className="form-input" value={form.cor_texto_botao}
                    onChange={e => setForm(f => ({ ...f, cor_texto_botao: e.target.value }))}
                    style={{ flex: 1 }} />
                </div>
              </div>

              {/* Categorias */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Exibir em quais categorias do Blog</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategoria(cat.value)}
                      style={{
                        padding: '8px 16px', borderRadius: 99,
                        border: form.categorias.includes(cat.value) ? `1px solid ${form.cor_botao}` : '1px solid var(--border-default)',
                        background: form.categorias.includes(cat.value) ? `${form.cor_botao}15` : 'transparent',
                        color: form.categorias.includes(cat.value) ? form.cor_botao : 'var(--text-muted)',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview do CTA em tempo real */}
            <div style={{ marginTop: 28 }}>
              <label className="form-label">Preview em Tempo Real</label>
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, var(--bg-card) 100%)',
                border: `1px solid ${form.cor_botao}40`,
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                flexWrap: 'wrap'
              }}>
                <div>
                  <p style={{ fontSize: 10, color: form.cor_botao, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    ⚡ Patrocinado
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{form.texto_pre || 'Assista agora em:'}</p>
                </div>
                <button style={{
                  padding: '11px 22px', borderRadius: 'var(--radius-lg)',
                  background: form.cor_botao,
                  color: form.cor_texto_botao,
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {linkType === 'whatsapp' && <MessageCircle size={16} />}
                  {form.texto_botao || 'Falar Conosco'} →
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-red)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                }}
              >
                <Save size={14} /> Salvar CTA
              </button>
            </div>
          </div>
        )}

        {/* Lista de patrocinadores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {patrocinadores.map(pat => (
            <div key={pat.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            }}>
              {/* Header do patrocinador */}
              <div style={{
                padding: '18px 24px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: '1px solid var(--border-subtle)',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  🏢
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{pat.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Plano: <span style={{ color: pat.plano === 'premium' ? 'var(--color-warning)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{pat.plano}</span>
                    {' · '}Prioridade: #{pat.prioridade}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                    background: pat.ativo ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: pat.ativo ? 'var(--color-success)' : 'var(--color-danger)',
                  }}>
                    {pat.ativo ? '● Ativo' : '○ Inativo'}
                  </span>
                </div>
              </div>

              {/* CTAs do patrocinador */}
              {pat.ctas.map(cta => (
                <div key={cta.id} style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    
                    {/* Info CTA */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                        {cta.texto_pre}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {cta.categorias.map(cat => (
                          <span key={cat} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-disabled)', display: 'flex', gap: 16 }}>
                        <span>🖱️ {cta.cliques_total} cliques</span>
                        <span>📅 Início: {new Date(cta.data_inicio).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Preview botão */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.2)', padding: '12px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <button style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: cta.cor_botao, color: cta.cor_texto_botao,
                        fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13,
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                      }}>
                        {cta.url_destino.includes('wa.me') && <MessageCircle size={16} />}
                        {cta.texto_botao} →
                      </button>
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingId(pat.id);
                          setEditingCtaId(cta.id);
                          const isWa = cta.url_destino.includes('wa.me');
                          setLinkType(isWa ? 'whatsapp' : 'url');
                          if (isWa) {
                            // Extrai número e msg do link wa.me
                            const match = cta.url_destino.match(/wa\.me\/(\d+)\?text=(.+)/);
                            if (match) {
                              setWhatsappNum(match[1]);
                              setWhatsappMsg(decodeURIComponent(match[2]));
                            }
                          } else {
                            setForm(f => ({ ...f, url_destino: cta.url_destino }));
                          }
                          setForm({
                            patrocinador_nome: pat.nome,
                            texto_pre: cta.texto_pre,
                            texto_botao: cta.texto_botao,
                            url_destino: isWa ? '' : cta.url_destino,
                            cor_botao: cta.cor_botao,
                            cor_texto_botao: cta.cor_texto_botao,
                            categorias: cta.categorias || [],
                            tipo_exibicao: cta.tipo_exibicao || 'inline',
                            data_inicio: cta.data_inicio ? cta.data_inicio.split('T')[0] : new Date().toISOString().split('T')[0],
                            data_fim: cta.data_fim ? cta.data_fim.split('T')[0] : '',
                          });
                          setShowForm(true);
                        }}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pat.id)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      
      {/* Responsividade CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .cta-form-grid {
            grid-template-columns: 1fr !important;
          }
          .cta-form-grid > div {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </div>
  );
}
