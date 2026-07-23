'use client';

export default function SobrePage() {
  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 20px 80px', color: '#F0F0F5' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
          🍿 Sobre o CinePlay
        </h1>
        <p style={{ fontSize: 16, color: '#A0A0B5', lineHeight: 1.7, marginBottom: 24 }}>
          O CinePlay é o portal definitivo de entretenimento, futebol ao vivo e guias de streaming no Brasil. Nossa missão é conectar você aos melhores conteúdos, jogos e lançamentos com agilidade, clareza e alta qualidade.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            🎯 Nosso Compromisso
          </h2>
          <ul style={{ color: '#A0A0B5', fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Guia atualizado diariamente de jogos do Brasileirão, Libertadores e Champions League.</li>
            <li>Recomendações das principais produções de cinema e séries nas maiores plataformas.</li>
            <li>Suporte e atendimento humanizado direto pelo WhatsApp.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
