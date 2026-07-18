'use client';

import { use } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import type { PostCard, CTA } from '@/lib/types';
import { CTABlock } from '@/components/site/CTABlock';

// Mock dos posts detalhados
const MOCK_POSTS_DATABASE: Record<string, PostCard & { conteudo_completo: string }> = {
  'onde-assistir-brasileirao-2026': {
    id: '1', slug: 'onde-assistir-brasileirao-2026', titulo: 'Onde Assistir o Brasileirão 2026: Todos os Canais e Plataformas', resumo: 'Guia completo com todos os canais que transmitem o Campeonato Brasileiro 2026, incluindo TV aberta e streaming.', imagem_capa_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80', categoria: 'futebol', publicado_em: new Date().toISOString(), visualizacoes: 12430, tempo_leitura_min: 5, gerado_por_ia: true,
    conteudo_completo: `
      <h2>Os Direitos de Transmissão do Brasileirão 2026</h2>
      <p>O Campeonato Brasileiro de 2026 conta com um modelo pulverizado de transmissão. Com o fim dos contratos de exclusividade centralizados de longo prazo, diversos consórcios e plataformas dividem a exibição das partidas.</p>
      
      <h2>Onde Assistir na TV Aberta e Fechada</h2>
      <p>A TV Globo mantém a exibição de partidas selecionadas aos domingos e quartas-feiras na TV aberta. Já na TV fechada, os canais SporTV e Premiere continuam cobrindo a maioria dos jogos no formato pay-per-view.</p>

      <h2>Onde Assistir Online via Streaming</h2>
      <p>Para quem prefere acompanhar pelo celular ou computador, as opções oficiais incluem o Globoplay (com sinal da TV Globo ao vivo em praças selecionadas) e o CazéTV no YouTube, que transmite jogos como mandante de equipes parceiras de forma gratuita.</p>
    `
  },
  'melhores-series-netflix-julho-2026': {
    id: '2', slug: 'melhores-series-netflix-julho-2026', titulo: 'As Melhores Séries da Netflix em Julho de 2026', resumo: 'Confira quais são as séries mais aclamadas que chegaram à Netflix neste mês e por que você precisa assistir.', imagem_capa_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop&q=80', categoria: 'series', publicado_em: new Date().toISOString(), visualizacoes: 8720, tempo_leitura_min: 4, gerado_por_ia: true,
    conteudo_completo: `
      <h2>Estreias Imperdíveis de Julho de 2026</h2>
      <p>A Netflix inicia o segundo semestre de 2026 com lançamentos de peso. De ficção científica a dramas inspirados em fatos reais, há opções imperdíveis para todos os gostos.</p>
      
      <h2>Destaques da Ficção Científica</h2>
      <p>O grande destaque do mês fica por conta da nova série cyberpunk que aborda as relações humanas e transição tecnológica em um futuro distópico. Com efeitos especiais de ponta e roteiro afiado.</p>

      <h2>Como Assistir em Ultra HD 4K</h2>
      <p>Lembre-se que para assistir a estes lançamentos com a melhor qualidade de imagem e som Dolby Atmos, é necessário possuir o plano Premium da Netflix e uma conexão estável à internet.</p>
    `
  }
};

// Mock de CTAs para a demonstração
const MOCK_CTAS_DEMO: CTA[] = [
  {
    id: 'c1', patrocinador_id: '1', texto_pre: 'Quer ter acesso a todos os jogos de futebol sem travar?', texto_botao: 'Falar com Atendente no WhatsApp',
    url_destino: 'https://wa.me/5599999999999?text=Quero+saber+mais+sobre+o+plano+de+futebol', cor_botao: '#25D366', cor_texto_botao: '#fff',
    categorias: ['futebol', 'canais'], tipo_exibicao: 'inline',
    data_inicio: new Date().toISOString(), data_fim: null, ativo: true, cliques_total: 342,
    patrocinador: { id: '1', nome: 'Operadora Stream X', logo_url: '', ativo: true, prioridade: 1, plano: 'premium', criado_em: new Date().toISOString() }
  }
];

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const post = MOCK_POSTS_DATABASE[slug];

  if (!post) {
    return (
      <div style={{ background: '#07070D', minHeight: '100vh', padding: '160px 24px', textAlign: 'center', color: '#F0F0F5' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Artigo não encontrado</h1>
        <p style={{ color: '#A0A0B5', marginBottom: 24 }}>O artigo solicitado não existe ou foi removido.</p>
        <Link href="/blog" className="btn btn-primary">Voltar para o Blog</Link>
      </div>
    );
  }

  // Filtra CTAs da mesma categoria para exibir no post
  const ctasFiltrados = MOCK_CTAS_DEMO.filter(cta => cta.categorias.includes(post.categoria));

  return (
    <article style={{ background: '#07070D', minHeight: '100vh', padding: '120px 24px 80px', color: '#F0F0F5' }}>
      
      {/* Schema JSON-LD para SEO no Google Search e Discover */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.titulo,
            image: post.imagem_capa_url,
            datePublished: post.publicado_em || new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'CinePlay Editorial',
            },
            description: post.resumo,
          })
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Botão de retorno */}
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 700, color: '#A0A0B5', textDecoration: 'none',
          marginBottom: 32, transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#A0A0B5'}
        >
          <ArrowLeft size={16} /> Voltar para a listagem
        </Link>

        {/* Categoria Badge */}
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 99,
          fontSize: 11, fontWeight: 700, background: 'rgba(229, 9, 20, 0.1)', color: '#E50914',
          border: '1px solid rgba(229, 9, 20, 0.3)', textTransform: 'uppercase',
          letterSpacing: '0.04em', marginBottom: 16
        }}>
          {post.categoria}
        </span>

        {/* Título Principal */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 900,
          lineHeight: 1.2,
          marginBottom: 20,
          color: '#fff'
        }}>
          {post.titulo}
        </h1>

        {/* Metadados */}
        <div style={{
          display: 'flex', gap: 20, fontSize: 13, color: '#A0A0B5',
          borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24,
          marginBottom: 32, flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={14} /> Por CinePlay Editorial
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} /> {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR') : 'Hoje'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> {post.tempo_leitura_min} minutos de leitura
          </span>
        </div>

        {/* Imagem de Capa */}
        <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 40, border: '1px solid rgba(255,255,255,0.05)' }}>
          <img
            src={post.imagem_capa_url}
            alt={post.titulo}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Conteúdo HTML do Artigo */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.conteudo_completo }}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: '#D0D0DB',
          }}
        />

        {/* CTA do Patrocinador contextualizado */}
        {ctasFiltrados.length > 0 && (
          <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 40 }}>
            <CTABlock ctas={ctasFiltrados} />
          </div>
        )}

      </div>
    </article>
  );
}
