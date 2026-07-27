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

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<RealPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
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
  // Ordena por visualizações reais
  const topPosts = [...posts].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070D', color: '#F0F0F5' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>
              📊 Analytics & Desempenho do Blog
            </h1>
            <p style={{ color: '#A0A0B5', fontSize: 14 }}>
              Métricas e estatísticas em tempo real baseadas nos acessos reais do seu blog.
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
                <TrendingUp size={14} /> Dados reais
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Artigos Publicados</span>
                <Users size={20} color="#8B5CF6" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>
                {loading ? '...' : totalPosts}
              </div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> Em produção
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Cliques WhatsApp</span>
                <MousePointer size={20} color="#25D366" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#25D366', fontFamily: 'Outfit' }}>
                0
              </div>
              <div style={{ fontSize: 12, color: '#A0A0B5', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                Aguardando acessos
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Taxa de Engajamento</span>
                <BarChart2 size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>
                {totalPosts > 0 ? `${(totalViews / totalPosts).toFixed(1)} views/post` : '0%'}
              </div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                Média real
              </div>
            </div>

          </div>

          {/* Posts mais Lidos */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              🔥 Top Artigos por Tráfego Orgânico
            </h3>

            {loading ? (
              <div style={{ padding: 20, color: '#A0A0B5', textAlign: 'center' }}>Carregando dados...</div>
            ) : topPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topPosts.map(post => (
                  <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#07070D', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{post.titulo}</div>
                      <div style={{ fontSize: 12, color: '#A0A0B5', marginTop: 2 }}>Categoria: {post.categoria} • Tempo médio: {post.tempo_leitura_min || 3}min</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: 16, color: '#E50914' }}>{(post.visualizacoes || 0).toLocaleString('pt-BR')} views</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 30, color: '#A0A0B5', textAlign: 'center', fontSize: 14 }}>
                Nenhum artigo publicado no momento. Crie um post ou execute os Agentes de IA.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
