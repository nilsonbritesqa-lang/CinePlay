'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Save, Plus, Trash2, MessageCircle, RefreshCw, CheckCircle } from 'lucide-react';

export default function ChatbotAdminPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newInstrucao, setNewInstrucao] = useState('');

  useEffect(() => {
    fetch('/api/chatbot-config')
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/chatbot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const addInstrucao = () => {
    if (!newInstrucao.trim()) return;
    setConfig((prev: any) => ({
      ...prev,
      instrucoes: [...(prev.instrucoes || []), newInstrucao.trim()]
    }));
    setNewInstrucao('');
  };

  const removeInstrucao = (idx: number) => {
    setConfig((prev: any) => ({
      ...prev,
      instrucoes: prev.instrucoes.filter((_: string, i: number) => i !== idx)
    }));
  };

  if (loading) return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A0B5' }}>
        Carregando configurações...
      </main>
    </div>
  );

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#07070D' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              💬 Chatbot de Vendas
            </h1>
            <p style={{ color: '#A0A0B5', fontSize: 14 }}>
              Configure o assistente virtual que aborda os visitantes e direciona para o WhatsApp.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saved ? '#10B981' : '#E50914',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 24px', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s'
            }}
          >
            {saved ? <><CheckCircle size={16} /> Salvo!</> : saving ? <><RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Salvando...</> : <><Save size={16} /> Salvar Configurações</>}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1100 }} className="chatbot-grid">

          {/* Coluna 1: Identidade e WhatsApp */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Ativação */}
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>⚙️ Status do Chatbot</h2>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div
                  onClick={() => setConfig((p: any) => ({ ...p, ativo: !p.ativo }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: config?.ativo ? '#E50914' : 'rgba(255,255,255,0.1)',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: config?.ativo ? 22 : 3,
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s'
                  }} />
                </div>
                <span style={{ color: config?.ativo ? '#fff' : '#A0A0B5', fontSize: 14, fontWeight: 600 }}>
                  {config?.ativo ? '✅ Chatbot Ativo' : '⏸️ Chatbot Pausado'}
                </span>
              </label>
            </div>

            {/* Identidade */}
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🤖 Identidade do Bot</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600 }}>Nome do Atendente</span>
                  <input
                    value={config?.nome || ''}
                    onChange={e => setConfig((p: any) => ({ ...p, nome: e.target.value }))}
                    style={inputStyle}
                    placeholder="Ex: CinePlay Atendente"
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600 }}>Mensagem de Saudação (1ª mensagem)</span>
                  <textarea
                    value={config?.saudacao || ''}
                    onChange={e => setConfig((p: any) => ({ ...p, saudacao: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    placeholder="Ex: Olá! Quer saber onde assistir?"
                  />
                </label>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                <span style={{ color: '#25D366' }}>📱</span> WhatsApp
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600 }}>Número (com código do país, sem +)</span>
                  <input
                    value={config?.whatsapp_numero || ''}
                    onChange={e => setConfig((p: any) => ({ ...p, whatsapp_numero: e.target.value }))}
                    style={inputStyle}
                    placeholder="Ex: 5511999999999"
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600 }}>Mensagem pré-preenchida no WhatsApp</span>
                  <textarea
                    value={config?.whatsapp_mensagem || ''}
                    onChange={e => setConfig((p: any) => ({ ...p, whatsapp_mensagem: e.target.value }))}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    placeholder="Ex: Olá! Vim pelo CinePlay e quero saber mais."
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#A0A0B5', fontWeight: 600 }}>Texto do Botão CTA</span>
                  <input
                    value={config?.cta_texto || ''}
                    onChange={e => setConfig((p: any) => ({ ...p, cta_texto: e.target.value }))}
                    style={inputStyle}
                    placeholder="Ex: Falar no WhatsApp"
                  />
                </label>
                {config?.whatsapp_numero && (
                  <a
                    href={`https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(config.whatsapp_mensagem || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366', color: '#fff', borderRadius: 10,
                      padding: '10px 16px', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', gap: 8
                    }}
                  >
                    Testar Link do WhatsApp ↗
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Coluna 2: Memória / Instruções do Bot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, flex: 1 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🧠 Memória e Instruções do Bot</h2>
              <p style={{ fontSize: 12, color: '#A0A0B5', marginBottom: 20, lineHeight: 1.5 }}>
                Adicione instruções que ensinam o bot o que ele deve falar, como responder e o que oferecer. 
                Cada instrução é incorporada diretamente ao prompt da IA. <strong style={{ color: '#fff' }}>O bot aprende o que você escrever aqui.</strong>
              </p>

              {/* Lista de instruções */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, maxHeight: 280, overflowY: 'auto' }}>
                {(config?.instrucoes || []).map((inst: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', alignItems: 'flex-start', gap: 10
                    }}
                  >
                    <span style={{ color: '#E50914', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>#{idx + 1}</span>
                    <span style={{ fontSize: 13, color: '#D0D0DB', flex: 1, lineHeight: 1.5 }}>{inst}</span>
                    <button
                      onClick={() => removeInstrucao(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#606070', flexShrink: 0 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(config?.instrucoes || []).length === 0 && (
                  <p style={{ color: '#606070', fontSize: 13, textAlign: 'center', padding: 20 }}>
                    Nenhuma instrução adicionada ainda.
                  </p>
                )}
              </div>

              {/* Adicionar instrução */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  value={newInstrucao}
                  onChange={e => setNewInstrucao(e.target.value)}
                  placeholder="Ex: Quando perguntarem sobre Brasileirão, informar que cobrimos todos os jogos e direcionar para o WhatsApp."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
                <button
                  onClick={addInstrucao}
                  disabled={!newInstrucao.trim()}
                  style={{
                    background: newInstrucao.trim() ? 'rgba(229, 9, 20, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${newInstrucao.trim() ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: newInstrucao.trim() ? '#E50914' : '#606070',
                    borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700,
                    cursor: newInstrucao.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={15} /> Adicionar Instrução à Memória do Bot
                </button>
              </div>
            </div>

            {/* Preview do WhatsApp */}
            <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>🔗 Preview do Link Gerado</h2>
              <code style={{
                fontSize: 11, color: '#A0A0B5', background: 'rgba(255,255,255,0.04)',
                padding: '8px 12px', borderRadius: 8, display: 'block', wordBreak: 'break-all', lineHeight: 1.6
              }}>
                https://wa.me/{config?.whatsapp_numero || '55...'}?text={encodeURIComponent(config?.whatsapp_mensagem || '...')}
              </code>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @media (max-width: 900px) {
            .chatbot-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  fontFamily: 'Inter, sans-serif',
};
