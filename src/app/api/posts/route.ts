import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const categoria = searchParams.get('categoria');

  const supabase = getSupabaseService();

  if (supabase) {
    try {
      if (slug) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data && !error) {
          // Incrementa visualizações
          await supabase.from('posts').update({ visualizacoes: (data.visualizacoes || 0) + 1 }).eq('id', data.id);
          return NextResponse.json({ success: true, post: data });
        }
      } else {
        let query = supabase.from('posts').select('*').order('publicado_em', { ascending: false });
        if (categoria) {
          query = query.eq('categoria', categoria);
        }
        const { data, error } = await query;
        if (data && !error && data.length > 0) {
          return NextResponse.json({ success: true, posts: data });
        }
      }
    } catch (e) {
      console.warn('[API /posts] Erro na busca do Supabase:', e);
    }
  }

  // Retorna lista padrão se não houver dados no banco
  return NextResponse.json({
    success: true,
    posts: [
      {
        id: '1',
        slug: 'onde-assistir-brasileirao-2026',
        titulo: 'Onde Assistir o Brasileirão 2026: Todos os Canais e Plataformas',
        resumo: 'Guia completo com todos os canais que transmitem o Campeonato Brasileiro 2026, incluindo TV aberta e streaming.',
        conteudo_html: `
          <h2>Os Direitos de Transmissão do Brasileirão 2026</h2>
          <p>O Campeonato Brasileiro de 2026 conta com um modelo pulverizado de transmissão. Com o fim dos contratos de exclusividade centralizados, diversas plataformas dividem a exibição das partidas em HD e 4K.</p>
          
          <h2>Onde Assistir na TV Aberta e Fechada</h2>
          <p>A TV Globo mantém a exibição de partidas aos domingos e quartas-feiras. Na TV fechada, SporTV e Premiere cobrem os demais jogos no formato pay-per-view com narração oficial.</p>

          <h2>Onde Assistir Online via Streaming</h2>
          <p>Para acompanhar pelo celular, computador ou Smart TV, a CazéTV no YouTube e as plataformas integradas transmitem partidas ao vivo com sinal em alta definição.</p>
        `,
        categoria: 'futebol',
        imagem_capa_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
        publicado_em: new Date().toISOString(),
        visualizacoes: 12430,
        tempo_leitura_min: 5,
        gerado_por_ia: true,
      },
      {
        id: '2',
        slug: 'melhores-series-streaming-julho-2026',
        titulo: 'As Melhores Séries no Streaming em Julho de 2026',
        resumo: 'Confira quais são as séries de suspense e drama mais aclamadas do momento e onde assistir cada uma delas.',
        conteudo_html: `
          <h2>Estreias Imperdíveis do Mês</h2>
          <p>Os serviços de streaming iniciam o mês com lançamentos de peso. De ficção científica a dramas policiais, há opções imperdíveis em todas as plataformas.</p>

          <h2>Como Assistir em Ultra HD 4K</h2>
          <p>Assista aos episódios com áudio original, dublado e resolução máxima em Smart TVs ou dispositivos móveis.</p>
        `,
        categoria: 'series',
        imagem_capa_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=80',
        publicado_em: new Date().toISOString(),
        visualizacoes: 8720,
        tempo_leitura_min: 4,
        gerado_por_ia: true,
      }
    ]
  });
}
