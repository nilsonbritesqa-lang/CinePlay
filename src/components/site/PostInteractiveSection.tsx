'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, MessageSquare, Send, Check } from 'lucide-react';

interface PostInteractiveSectionProps {
  postTitle: string;
  shareUrl: string;
}

export function PostInteractiveSection({ postTitle, shareUrl }: PostInteractiveSectionProps) {
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState('');
  const [nome, setNome] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitted(true);
    setComment('');
    setNome('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${postTitle} — ${shareUrl}`)}`;

  return (
    <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
      
      {/* Bloco de Compartilhamento social (Estilo Mockup) */}
      <div style={{ marginBottom: 48 }}>
        <h4 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700,
          color: '#A0A0B5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16
        }}>
          Compartilhe esta notícia
        </h4>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={fbShare} target="_blank" rel="noopener noreferrer"
            style={{
              width: 42, height: 42, borderRadius: 99, background: '#1877F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', textDecoration: 'none', transition: 'transform 0.2s'
            }}
            title="Compartilhar no Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          <a
            href={twitterShare} target="_blank" rel="noopener noreferrer"
            style={{
              width: 42, height: 42, borderRadius: 99, background: '#000',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', textDecoration: 'none', transition: 'transform 0.2s'
            }}
            title="Compartilhar no X (Twitter)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          <a
            href={waShare} target="_blank" rel="noopener noreferrer"
            style={{
              width: 42, height: 42, borderRadius: 99, background: '#25D366',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', textDecoration: 'none', transition: 'transform 0.2s'
            }}
            title="Compartilhar no WhatsApp"
          >
            <Share2 size={18} />
          </a>

          <button
            onClick={handleCopyLink}
            style={{
              height: 42, padding: '0 16px', borderRadius: 99,
              background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${copied ? '#10B981' : 'rgba(255, 255, 255, 0.15)'}`,
              color: copied ? '#10B981' : '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </button>
        </div>
      </div>

      {/* Seção de Comentários (Estilo Mockup) */}
      <div style={{
        background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '28px 32px'
      }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
          Comentários
        </h3>
        <p style={{ color: '#A0A0B5', fontSize: 13, margin: '0 0 20px' }}>
          Seja o primeiro a comentar!
        </p>

        {submitted ? (
          <div style={{
            padding: '16px 20px', borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: 14, fontWeight: 700
          }}>
            ✓ Seu comentário foi enviado com sucesso e está aguardando moderação da equipe CinePlay!
          </div>
        ) : (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="text"
              placeholder="Seu nome (opcional)..."
              value={nome}
              onChange={e => setNome(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                background: '#07070D', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, outline: 'none'
              }}
            />

            <textarea
              rows={4}
              placeholder="Escreva seu comentário..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12,
                background: '#07070D', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical'
              }}
            />

            <div>
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 10, background: '#E50914',
                  color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                  fontSize: 14, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
                }}
              >
                <Send size={15} /> Publicar comentário
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
