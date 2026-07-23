'use client';

export default function PoliticaPrivacidadePage() {
  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 20px 80px', color: '#F0F0F5' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.3rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
          🔒 Política de Privacidade
        </h1>
        <p style={{ fontSize: 14, color: '#A0A0B5', lineHeight: 1.7, marginBottom: 24 }}>
          A sua privacidade é fundamental para o CinePlay. Esta política explica como coletamos e protegemos suas informações ao navegar em nosso site.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, color: '#A0A0B5', fontSize: 14, lineHeight: 1.8 }}>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 10 }}>1. Coleta de Dados</h2>
          <p style={{ marginBottom: 16 }}>Não coletamos dados pessoais sensíveis sem o seu consentimento prévio. Coletamos apenas métricas anônimas de visualização para aprimorar a experiência do portal.</p>

          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 10 }}>2. Cookies e Navegação</h2>
          <p style={{ marginBottom: 16 }}>Utilizamos cookies de sessão padrão para garantir um carregamento rápido de conteúdos e o correto funcionamento do nosso assistente interativo.</p>

          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 10 }}>3. Direcionamento Seguro</h2>
          <p>Links externos e de atendimento são protegidos via SSL de alta segurança.</p>
        </div>
      </div>
    </div>
  );
}
