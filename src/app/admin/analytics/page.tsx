'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { BarChart2, TrendingUp, Users, Eye, MousePointer, Calendar, ArrowUpRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
              Acompanhe o tráfego orgânico, visualizações dos artigos e métricas de conversão para o WhatsApp.
            </p>
          </div>

          {/* Cards de Métricas Principais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Visualizações Totais</span>
                <Eye size={20} color="#3B82F6" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>95.890</div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> +24% este mês
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Leitores Únicos</span>
                <Users size={20} color="#8B5CF6" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>42.150</div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> +18% este mês
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Cliques WhatsApp</span>
                <MousePointer size={20} color="#25D366" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#25D366', fontFamily: 'Outfit' }}>3.410</div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> +31% este mês
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#A0A0B5', fontWeight: 700 }}>Taxa de Conversão</span>
                <BarChart2 size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>8,09%</div>
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <TrendingUp size={14} /> Alta performance
              </div>
            </div>

          </div>

          {/* Posts mais Lidos */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              🔥 Top Artigos por Tráfego Orgânico
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#07070D', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Como Assistir Futebol ao Vivo de Graça na Internet</div>
                  <div style={{ fontSize: 12, color: '#A0A0B5', marginTop: 2 }}>Categoria: Onde Assistir • Tempo médio: 4min 12s</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#E50914' }}>34.200 views</div>
                  <div style={{ fontSize: 11, color: '#25D366', fontWeight: 700 }}>1.420 leads WA</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#07070D', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Onde Assistir o Deadpool & Wolverine Online</div>
                  <div style={{ fontSize: 12, color: '#A0A0B5', marginTop: 2 }}>Categoria: Cinema • Tempo médio: 3min 05s</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#8B5CF6' }}>21.100 views</div>
                  <div style={{ fontSize: 11, color: '#25D366', fontWeight: 700 }}>890 leads WA</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#07070D', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Onde Assistir o Brasileirão 2026: Todos os Canais</div>
                  <div style={{ fontSize: 12, color: '#A0A0B5', marginTop: 2 }}>Categoria: Futebol • Tempo médio: 5min 40s</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#10B981' }}>12.430 views</div>
                  <div style={{ fontSize: 11, color: '#25D366', fontWeight: 700 }}>640 leads WA</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
