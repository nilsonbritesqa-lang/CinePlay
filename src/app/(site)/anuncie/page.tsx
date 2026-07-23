'use client';

export default function AnunciePage() {
  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 20px 80px', color: '#F0F0F5' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
          📢 Anuncie no CinePlay
        </h1>
        <p style={{ fontSize: 16, color: '#A0A0B5', lineHeight: 1.7, marginBottom: 32 }}>
          Alcance milhares de apaixonados por futebol, filmes e séries todos os dias no maior ecossistema de entretenimento.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 40 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Seja um Patrocinador Oficial
          </h2>
          <p style={{ color: '#A0A0B5', fontSize: 14, marginBottom: 24 }}>
            Disponibilizamos banners no Hero Showcase, destaques no Calendário de Esportes e chamadas exclusivas em nossos artigos.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20no%20CinePlay"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 99, background: '#25D366', color: '#fff',
              fontWeight: 800, textDecoration: 'none', fontFamily: 'Outfit'
            }}
          >
            Falar com Comercial no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
