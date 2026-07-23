'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface WhatsAppInfo {
  url: string;
  cta: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState<WhatsAppInfo | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carrega config do chatbot
  useEffect(() => {
    fetch('/api/chatbot-config')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        if (data.ativo) {
          // Popula dados do WhatsApp imediatamente
          setWhatsapp({
            url: `https://wa.me/${data.whatsapp_numero}?text=${encodeURIComponent(data.whatsapp_mensagem)}`,
            cta: data.cta_texto || 'Saiba como Assistir'
          });
          // Mostra a bolha de texto pequena após 3s
          const bubbleTimer = setTimeout(() => setShowBubble(true), 3000);
          return () => clearTimeout(bubbleTimer);
        }
      })
      .catch(() => {
        // fallback silencioso
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    setShowBubble(false);
    if (messages.length === 0 && config) {
      setMessages([{ role: 'assistant', content: config.saudacao }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          userMessage: userMsg
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.whatsapp) {
        setWhatsapp({
          url: data.whatsapp.url,
          cta: data.whatsapp.cta
        });
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ops! Algo deu errado. Fale com nossa equipe direto pelo WhatsApp!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!config?.ativo) return null;

  return (
    <>
      {/* Bolha proativa flutuante de texto pequeno e limpo (estilo balãozinho) */}
      {showBubble && !open && (
        <div
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: 90,
            right: 14,
            background: '#ffffff',
            color: '#07070D',
            padding: '10px 14px',
            borderRadius: '16px 16px 4px 16px',
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            zIndex: 9998,
            cursor: 'pointer',
            maxWidth: 'calc(100vw - 70px)',
            lineHeight: 1.4,
            border: '1px solid rgba(0,0,0,0.06)',
            animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>💬</span>
          <span>Quer saber como assistir? Veja aqui.</span>
        </div>
      )}

      {/* Botão Flutuante */}
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#E50914',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(229, 9, 20, 0.5)',
            zIndex: 9999,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          className="chatbot-btn"
          aria-label="Abrir Chat"
        >
          <MessageCircle size={24} color="#fff" />
          {/* Indicador de ativo */}
          <span style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 14, height: 14,
            borderRadius: '50%',
            background: '#25D366',
            border: '2px solid #07070D',
            animation: 'ping 1.5s ease-in-out infinite'
          }} />
        </button>
      )}

      {/* Janela do Chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            height: 520,
            background: '#0C0C18',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            animation: 'chatOpen 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {/* Header */}
          <div style={{
            background: '#E50914',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>🎬</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
                  {config?.nome || 'CinePlay Atendente'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online agora
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Banner Pinned do WhatsApp (Sempre visível no topo do chat para conversão imediata) */}
          {whatsapp && (
            <div style={{
              background: 'rgba(37, 211, 102, 0.08)',
              borderBottom: '1px solid rgba(37, 211, 102, 0.15)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#25D366',
              fontWeight: 700,
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}>🟢</span>
                <span>Saiba como Assistir</span>
              </div>
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                  transition: 'opacity 0.2s'
                }}
              >
                Veja Aqui
              </a>
            </div>
          )}

          {/* Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#E50914' : 'rgba(255,255,255,0.07)',
                  color: '#fff',
                  fontSize: 13,
                  lineHeight: 1.5,
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', gap: 4, alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#A0A0B5',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA WhatsApp no final da conversa */}
            {whatsapp && messages.length > 1 && (
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#25D366',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginTop: 4,
                  transition: 'opacity 0.2s',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {whatsapp.cta}
              </a>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.02)'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Onde posso assistir...?"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() ? '#E50914' : 'rgba(255,255,255,0.06)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.85) translateY(20px); transform-origin: bottom right; }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .chatbot-btn:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 28px rgba(229, 9, 20, 0.65) !important;
        }
      `}</style>
    </>
  );
}
