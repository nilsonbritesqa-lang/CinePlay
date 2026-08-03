import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      background: '#07070D',
      color: '#FFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: 500 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 99,
          background: 'rgba(229, 9, 20, 0.15)',
          border: '1px solid rgba(229, 9, 20, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Search size={36} color="#E50914" />
        </div>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '2.2rem',
          fontWeight: 900,
          marginBottom: 12
        }}>
          Matéria Não Encontrada
        </h1>

        <p style={{
          color: '#A0A0B5',
          fontSize: 15,
          lineHeight: 1.6,
          marginBottom: 32
        }}>
          O artigo ou conteúdo procurado não foi localizado ou pode ter sido atualizado.
        </p>

        <Link href="/blog" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#E50914',
          color: '#FFF',
          fontWeight: 800,
          fontSize: 14,
          padding: '12px 24px',
          borderRadius: 99,
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(229,9,20,0.4)'
        }}>
          <ArrowLeft size={16} /> Voltar para o Blog
        </Link>
      </div>
    </div>
  );
}
