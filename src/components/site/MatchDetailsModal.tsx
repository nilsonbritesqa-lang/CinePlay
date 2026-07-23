'use client';

import { X, Calendar, Clock, Tv, MessageCircle } from 'lucide-react';

interface MatchItem {
  id: string;
  campeonato: string;
  escudo_campeonato?: string;
  time1: string;
  escudo1?: string;
  time2: string;
  escudo2?: string;
  horario: string;
  data: string;
  onde_assistir: string[];
  destaque: boolean;
  live?: boolean;
}

interface MatchDetailsModalProps {
  match: MatchItem;
  whatsappUrl: string;
  onClose: () => void;
}

export default function MatchDetailsModal({ match, whatsappUrl, onClose }: MatchDetailsModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#0F0F1A',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 24,
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.06)', border: 'none',
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Header do Campeonato */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {match.escudo_campeonato && (
            <img src={match.escudo_campeonato} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          )}
          <span style={{ fontSize: 12, fontWeight: 800, color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Outfit' }}>
            {match.campeonato}
          </span>
        </div>

        {/* Confronto */}
        <div style={{ textAlign: 'center', margin: '20px 0', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            {match.time1} <span style={{ color: '#E50914' }}>x</span> {match.time2}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 13, color: '#A0A0B5' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} /> {match.horario}
            </span>
            {match.live && (
              <span style={{ fontSize: 10, fontWeight: 900, color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: 99 }}>
                AO VIVO AGORA
              </span>
            )}
          </div>
        </div>

        {/* Onde Assistir */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 8, letterSpacing: '0.05em' }}>
            📺 Transmissão / Canais
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {match.onde_assistir && match.onde_assistir.length > 0 ? (
              match.onde_assistir.map((canal, i) => (
                <span key={i} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tv size={12} color="#10B981" /> {canal}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 12, color: '#A0A0B5' }}>Canais a confirmar pela emissora</span>
            )}
          </div>
        </div>

        {/* Botão de Ação WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px', borderRadius: 12,
            background: '#25D366', color: '#fff',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 14,
            textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,211,102,0.35)'
          }}
        >
          <MessageCircle size={18} /> Saiba como Assistir no WhatsApp
        </a>
      </div>
    </div>
  );
}
