'use client';

import type { CTA } from '@/lib/types';
import { ExternalLink, Zap } from 'lucide-react';

interface CTABlockProps {
  ctas: CTA[];
  posicao?: 'inline' | 'sidebar';
}

export function CTABlock({ ctas, posicao = 'inline' }: CTABlockProps) {
  const ativos = ctas.filter(c => {
    if (!c.ativo) return false;
    const now = new Date();
    if (new Date(c.data_inicio) > now) return false;
    if (c.data_fim && new Date(c.data_fim) < now) return false;
    return true;
  });

  if (ativos.length === 0) return null;

  // Ordena por prioridade do patrocinador
  const sorted = [...ativos].sort((a, b) => 
    (a.patrocinador?.prioridade ?? 99) - (b.patrocinador?.prioridade ?? 99)
  );

  if (posicao === 'sidebar') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sorted.map(cta => (
          <CTACard key={cta.id} cta={cta} compact />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '32px 0' }}>
      {sorted.map(cta => (
        <CTACard key={cta.id} cta={cta} />
      ))}
    </div>
  );
}

function CTACard({ cta, compact = false }: { cta: CTA; compact?: boolean }) {
  async function handleClick() {
    // Registrar clique
    await fetch('/api/cta/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cta_id: cta.id }),
    });
    window.open(cta.url_destino, '_blank', 'noopener,noreferrer');
  }

  if (compact) {
    return (
      <div className="cta-block" style={{ padding: '18px 20px' }}>
        <span className="cta-sponsor-tag">Patrocinado</span>
        {cta.patrocinador?.logo_url && (
          <img
            src={cta.patrocinador.logo_url}
            alt={cta.patrocinador.nome}
            style={{ height: 28, objectFit: 'contain', marginBottom: 10 }}
          />
        )}
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{cta.texto_pre}</p>
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: cta.cor_botao || 'var(--gradient-red)',
            color: cta.cor_texto_botao || '#fff',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {cta.texto_botao} <ExternalLink size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="cta-block">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span className="cta-sponsor-tag">
            <Zap size={10} style={{ display: 'inline', marginRight: 4 }} />
            Conteúdo Patrocinado
          </span>

          {cta.patrocinador?.logo_url && (
            <img
              src={cta.patrocinador.logo_url}
              alt={cta.patrocinador.nome}
              style={{ height: 32, objectFit: 'contain', marginBottom: 10, display: 'block' }}
            />
          )}

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 0 }}>
            {cta.texto_pre}
          </p>
        </div>

        <button
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-lg)',
            background: cta.cor_botao || 'linear-gradient(135deg, #E50914 0%, #9B0A13 100%)',
            color: cta.cor_texto_botao || '#fff',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          {cta.texto_botao} <ExternalLink size={15} />
        </button>
      </div>
    </div>
  );
}
