'use client';

import { MessageCircle } from 'lucide-react';

interface TeamInfo {
  name: string;
  shortName: string;
  crestUrl: string;
}

interface TeamMatchBannerProps {
  home: TeamInfo | null;
  away: TeamInfo | null;
  ctaUrl: string;
}

export function TeamMatchBanner({ home, away, ctaUrl }: TeamMatchBannerProps) {
  if (!home && !away) return null;

  // Caso 1: Dois times identificados (Confronto Direto)
  if (home && away) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,15,26,0.95), rgba(229,9,20,0.18))',
        border: '1px solid rgba(229,9,20,0.3)',
        borderRadius: 20,
        padding: '24px 20px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-around',
        gap: 16,
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <img
            src={home.crestUrl}
            alt={home.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(home.shortName)}&background=E50914&color=fff`;
            }}
            style={{ width: 68, height: 68, objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
          />
          <div style={{ fontWeight: 900, fontSize: 16, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>{home.name}</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 99, background: '#E50914', color: '#fff', fontWeight: 900, fontSize: 14, letterSpacing: '0.08em', boxShadow: '0 4px 15px rgba(229,9,20,0.4)' }}>
            VS
          </span>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ● TRANSMISSÃO CINEPLAY
          </div>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <img
            src={away.crestUrl}
            alt={away.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(away.shortName)}&background=10B981&color=fff`;
            }}
            style={{ width: 68, height: 68, objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
          />
          <div style={{ fontWeight: 900, fontSize: 16, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>{away.name}</div>
        </div>
      </div>
    );
  }

  // Caso 2: Apenas um time identificado (Banner de Destaque do Clube)
  const mainTeam = home || away;
  if (!mainTeam) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15,15,26,0.95), rgba(229,9,20,0.18))',
      border: '1px solid rgba(229,9,20,0.3)',
      borderRadius: 20,
      padding: '20px 24px',
      marginBottom: 32,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
    }}>
      <img
        src={mainTeam.crestUrl}
        alt={mainTeam.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mainTeam.shortName)}&background=E50914&color=fff`;
        }}
        style={{ width: 64, height: 64, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          ● TRANSMISSÃO AO VIVO NO CINEPLAY
        </div>
        <div style={{ fontWeight: 900, fontSize: 18, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>
          {mainTeam.name} em Campo
        </div>
      </div>
      <a href={ctaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 99, background: '#E50914', color: '#FFF', fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
        <MessageCircle size={14} /> Falar no WhatsApp
      </a>
    </div>
  );
}
