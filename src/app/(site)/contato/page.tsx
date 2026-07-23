'use client';

export default function ContatoPage() {
  return (
    <div style={{ background: '#07070D', minHeight: '100vh', padding: '120px 20px 80px', color: '#F0F0F5' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
          📞 Fale Conosco
        </h1>
        <p style={{ fontSize: 16, color: '#A0A0B5', lineHeight: 1.7, marginBottom: 32 }}>
          Dúvidas, sugestões ou parcerias? Nossa equipe está pronta para responder você.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Atendimento no WhatsApp</h3>
            <p style={{ color: '#A0A0B5', fontSize: 14 }}>Atendimento rápido todos os dias.</p>
          </div>
          <a
            href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Preciso%20de%20ajuda"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10, background: '#E50914', color: '#fff',
              fontWeight: 800, textDecoration: 'none', fontFamily: 'Outfit'
            }}
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
