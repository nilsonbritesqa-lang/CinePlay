import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0 24px',
      marginTop: 64,
    }}>
      <div className="container-site">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Marca */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <img
                src="/logo-cineplay.png"
                alt="CinePlay Logo"
                style={{
                  height: 96,
                  width: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 220 }}>
              O guia definitivo de streaming no Brasil. Saiba onde assistir tudo.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              Categorias
            </h4>
            {[
              { href: '/futebol', label: 'Futebol ao Vivo' },
              { href: '/filmes', label: 'Filmes' },
              { href: '/series', label: 'Séries' },
              { href: '/canais', label: 'Canais' },
              { href: '/onde-assistir', label: 'Onde Assistir' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Plataformas */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              Plataformas
            </h4>
            {['Netflix', 'Max (HBO)', 'Prime Video', 'Disney+', 'Globoplay', 'Paramount+'].map(p => (
              <Link key={p} href={`/onde-assistir?plataforma=${p.toLowerCase()}`} style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {p}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              CinePlay
            </h4>
            {[
              { href: '/sobre', label: 'Sobre nós' },
              { href: '/anuncie', label: 'Anuncie Aqui' },
              { href: '/contato', label: 'Contato' },
              { href: '/politica-de-privacidade', label: 'Privacidade' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {year} CinePlay. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-disabled)' }}>
            Conteúdo editorial independente. Parceiros comerciais identificados como "Patrocinado".
          </p>
        </div>
      </div>
    </footer>
  );
}
