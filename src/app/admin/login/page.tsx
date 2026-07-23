'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('cineplay_admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      setError('Falha ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: '#07070D url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background Lights */}
      <div style={{
        position: 'absolute', top: '20%', left: '30%', width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(229, 9, 20, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(15, 15, 26, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        zIndex: 2, position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/logo-cineplay.png"
            alt="CinePlay Logo"
            style={{ height: 48, margin: '0 auto 16px', display: 'block', objectFit: 'contain' }}
          />
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Painel Administrativo
          </h1>
          <p style={{ fontSize: 13, color: '#A0A0B5', margin: 0 }}>
            Digite suas credenciais para gerenciar o blog e os agentes.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12, padding: '12px 14px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10, color: '#EF4444', fontSize: 13
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6, letterSpacing: '0.05em' }}>
              E-mail de Acesso
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B6B85' }} />
              <input
                type="email"
                required
                placeholder="admin@cineplay.com.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                  background: '#07070D', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 14, outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#A0A0B5', marginBottom: 6, letterSpacing: '0.05em' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B6B85' }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                  background: '#07070D', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 14, outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              padding: '14px', borderRadius: 10,
              background: loading ? '#b8070f' : '#E50914',
              color: '#fff', fontWeight: 800, fontSize: 14,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(229,9,20,0.4)',
              transition: 'all 0.2s ease', fontFamily: 'Outfit, sans-serif'
            }}
          >
            {loading ? 'Autenticando...' : <>Entrar no Painel <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Rodapé com Dica de Credenciais Padrão */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6B6B85', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#10B981" /> Acesso Protegido CinePlay SSL 256-bit
          </div>
        </div>
      </div>
    </div>
  );
}
