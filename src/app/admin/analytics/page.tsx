'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { BarChart2, TrendingUp, Users, Eye, MousePointer, Calendar } from 'lucide-react';

interface RealPost {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  publicado_em: string;
  visualizacoes: number;
  gerado_por_ia: boolean;
  tempo_leitura_min?: number;
}

interface TrafficLog {
  id: string;
  ip: string;
  dispositivo: 'Mobile' | 'Desktop' | 'Tablet';
  origem: 'Google' | 'ChatGPT / IA' | 'WhatsApp' | 'Social' | 'Direto';
  slug: string;
  user_agent: string;
  criado_em: string;
}

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<RealPost[]>([]);
  const [trafficLogs, setTrafficLogs] = useState<TrafficLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [postsRes, trafficRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/analytics/track')
        ]);
        const postsData = await postsRes.json();
        const trafficData = await trafficRes.json();

        if (postsData.success && postsData.posts) setPosts(postsData.posts);
        if (trafficData.success && trafficData.logs) setTrafficLogs(trafficData.logs);
      } catch (err) {
        console.error('Erro ao carregar dados no analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted) return null;

  const totalViews = posts.reduce((acc, p) => acc + (p.visualizacoes || 0), 0);
  const totalPosts = posts.length;
  const topPosts = [...posts].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));

  // Métricas de Rastreamento por Dispositivo
  const countMobile = trafficLogs.filter(l => l.dispositivo === 'Mobile').length;
  const countDesktop = trafficLogs.filter(l => l.dispositivo === 'Desktop').length;
  const totalLogCount = trafficLogs.length || 1;
  const percMobile = Math.round((countMobile / totalLogCount) * 100);
  const percDesktop = Math.round((countDesktop / totalLogCount) * 100);

  // Métricas de Origem do Tráfego
  const origins = {
    Google: trafficLogs.filter(l => l.origem === 'Google').length,
    'ChatGPT / IA': trafficLogs.filter(l => l.origem === 'ChatGPT / IA').length,
    WhatsApp: trafficLogs.filter(l => l.origem === 'WhatsApp').length,
    Social: trafficLogs.filter(l => l.origem === 'Social').length,
    Direto: trafficLogs.filter(l => l.origem === 'Direto').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070D', color: '#F0F0F5' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>
              📊 Rastreamento de Tráfego & Analytics
            </h1>
            <p style={{ color: '#A0A0B5', fontSize: 14 }}>
              Monitoramento em tempo real de acessos, dispositivos (Mobile/Desktop), origem (Google, GPT, WhatsApp) e endereços IP.
            </p>
          </div>

          {/* Cards de Métricas Principais Reais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Visualizações Totais</span>
                <Eye size={20} color="#3B82F6" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>
                {loading ? '...' : totalViews.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> Dados reais Supabase
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Dispositivo Predominante</span>
                <Users size={20} color="#8B5CF6" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>
                📱 {percMobile > percDesktop ? `${percMobile}% Mobile` : `${percDesktop}% Desktop`}
              </div>
              <div style={{ fontSize: 12, color: '#A0A0B5', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                Mobile: {countMobile} | Desktop: {countDesktop}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Principal Origem</span>
                <MousePointer size={20} color="#25D366" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#25D366', fontFamily: 'Outfit' }}>
                🔍 {origins['ChatGPT / IA'] > 0 ? 'ChatGPT / Search' : 'Google / Direto'}
              </div>
              <div style={{ fontSize: 12, color: '#A0A0B5', marginTop: 6 }}>
                Rastreamento por Referer / UTM
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Artigos Publicados</span>
                <BarChart2 size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>
                {loading ? '...' : totalPosts}
              </div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                No Banco Supabase
              </div>
            </div>

          </div>

          {/* Seção Rastreamento de Dispositivos e Origem */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
            
            {/* Breakdown de Origem */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                🌐 Canal / Origem do Tráfego
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: '🔍 Google Search', count: origins.Google, color: '#3B82F6' },
                  { label: '🤖 ChatGPT / IA', count: origins['ChatGPT / IA'], color: '#10B981' },
                  { label: '💬 WhatsApp', count: origins.WhatsApp, color: '#25D366' },
                  { label: '📱 Redes Sociais', count: origins.Social, color: '#8B5CF6' },
                  { label: '⚡ Acesso Direto', count: origins.Direto, color: '#F59E0B' },
                ].map(o => (
                  <div key={o.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#D0D0E0' }}>{o.label}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: o.color }}>{o.count} acessos</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Posts por Tráfego */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                🔥 Artigos Mais Acessados
              </h3>
              {topPosts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {topPosts.slice(0, 4).map(post => (
                    <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#07070D', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                        {post.titulo}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#E50914' }}>
                        {(post.visualizacoes || 0)} views
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#A0A0B5', fontSize: 13 }}>Nenhum artigo acessado ainda.</div>
              )}
            </div>

          </div>

          {/* Tabela de Rastreamento de IP em Tempo Real */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              🛡️ Registro de Acessos Recentes & Endereços IP
            </h3>

            {trafficLogs.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#A0A0B5' }}>
                      <th style={{ padding: '10px 12px' }}>Data / Hora</th>
                      <th style={{ padding: '10px 12px' }}>IP</th>
                      <th style={{ padding: '10px 12px' }}>Dispositivo</th>
                      <th style={{ padding: '10px 12px' }}>Origem</th>
                      <th style={{ padding: '10px 12px' }}>Artigo / Página</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficLogs.slice(0, 10).map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px', color: '#A0A0B5' }}>
                          {new Date(log.criado_em).toLocaleTimeString('pt-BR')}
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#3B82F6' }}>
                          {log.ip}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {log.dispositivo === 'Mobile' ? '📱 Mobile' : '💻 Desktop'}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#10B981' }}>
                          {log.origem}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#fff' }}>
                          {log.slug}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 20, color: '#A0A0B5', textAlign: 'center', fontSize: 13 }}>
                Acessando o blog pela primeira vez... Os endereços IP e dispositivos aparecerão aqui instantaneamente.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
