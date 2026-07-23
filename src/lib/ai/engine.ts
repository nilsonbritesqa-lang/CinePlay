/**
 * Motor de Agentes de IA do CinePlay
 * 
 * Regras Fundamentais:
 * - 1. Sincronização Estrita de Data e Hora no fuso de Brasília (America/Sao_Paulo)
 * - 2. Trava Antialucinação: Apenas cria posts sobre partidas/lançamentos reais confirmados pelas APIs
 * - 3. Fallback Inteligente (Evergreen/High-Intent) caso a temporada esteja em pausa ou sem jogos no dia
 * - 4. Otimização SEO/GEO para indicação por IAs (ChatGPT, Gemini, Claude) e Google Discover
 * - 5. Inserção estratégica de CTAs de conversão para o WhatsApp
 */

import { generateAIWithFallback, type AIProvider } from '@/lib/ai/providers';
import { tmdb, footballData, getPostImage } from '@/lib/images/service';
import type { Categoria } from '@/lib/types';

// =====================
// TIPOS DO ENGINE
// =====================
export interface AgentConfig {
  id: string;
  nome: string;
  tipo: Categoria | 'onde-assistir';
  provider_ia: AIProvider;
  modelo_ia?: string;
  temperatura: number;
  auto_publicar: boolean;
  requer_aprovacao: boolean;
  posts_por_dia: number;
  dias_antecipacao: number;
  prompt_sistema_custom?: string;
  keywords_seo: string[];
}

export interface PostGerado {
  titulo: string;
  resumo: string;
  conteudo_html: string;
  slug: string;
  categoria: Categoria;
  tags: string[];
  imagem_capa_url: string;
  schema_json: Record<string, unknown>;
  publicar_em?: string;
  gerado_por_ia: boolean;
  agente_tipo: string;
  tempo_leitura_min: number;
}

// =====================
// PROMPT JORNALÍSTICO ANTIALUCINAÇÃO
// =====================
const PROMPT_JORNALISTA_BASE = `Você é um jornalista sênior especialista em esportes, cinema, séries e entretenimento no Brasil.
REGRAS CRÍTICAS INVIOLÁVEIS:
1. NUNCA invente informações, placares, horários ou times que não foram fornecidos no contexto.
2. Escreva em português brasileiro fluido, profissional, atraente e persuasivo.
3. OTIMIZAÇÃO SEO & GEO: Escreva parágrafos iniciais diretos e claros para serem citados por IAs (ChatGPT, Gemini, Claude) e destacados no Google Discover.
4. Estruture o artigo utilizando cabeçalhos <h2> e <h3>.
5. Em cada artigo, informe exatamente ONDE ASSISTIR o evento/conteúdo (canais de TV, plataformas de streaming).
6. Inclua naturalmente chamadas sutis para o leitor consultar o atendimento no WhatsApp para tirar dúvidas de transmissão.
7. Mantenha extensão de 600 a 1200 palavras.`;

// =====================
// GERAÇÃO GENÉRICA COM IA
// =====================
async function gerarPostComIA(
  config: AgentConfig,
  contexto: string,
  metadados: Partial<PostGerado>
): Promise<PostGerado> {
  const promptSistema = config.prompt_sistema_custom 
    ? `${PROMPT_JORNALISTA_BASE}\n\nORIENTAÇÕES ADICIONAIS DO PAINEL ADM:\n${config.prompt_sistema_custom}`
    : PROMPT_JORNALISTA_BASE;

  // Adiciona a hora atual do Brasil ao prompt para garantir consciência temporal
  const agoraBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const resultado = await generateAIWithFallback(
    {
      temperature: config.temperatura,
      maxTokens: 3200,
      messages: [
        { role: 'system', content: promptSistema },
        {
          role: 'user',
          content: `
[DATA E HORA ATUAL DO SISTEMA: ${agoraBR}]

CONTEXTO REAL BASEADO EM DADOS OFICIAIS:
${contexto}

INSTRUÇÃO:
Gere um post de blog completo, altamente atraente para SEO e leitores, em formato JSON rigoroso:
{
  "titulo": "Título de alto impacto com foco em palavra-chave (máx 65 chars)",
  "resumo": "Meta description persuasiva com palavra-chave principal (150-160 chars)",
  "slug": "slug-url-amigavel",
  "tags": ["tag1", "tag2", "tag3"],
  "conteudo_html": "HTML completo do post com H2, H3, parágrafos informativos, tabelas explicativas se aplicável, e aviso de transmissão."
}

Retorne APENAS o código JSON válido, sem qualquer texto fora do JSON.
          `.trim(),
        },
      ],
    },
    config.provider_ia
  );

  let parsed: Record<string, unknown>;
  try {
    let clean = resultado.content.trim();
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = clean.match(jsonBlockRegex);
    if (match && match[1]) {
      clean = match[1].trim();
    }
    clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(`A IA gerou uma resposta malformada. Tente novamente ou ajuste a temperatura. Detalhes: ${resultado.content.slice(0, 200)}`);
  }

  const titulo = String(parsed.titulo ?? '');
  const slug = String(parsed.slug ?? gerarSlug(titulo));
  const imagem = metadados.imagem_capa_url ?? await getPostImage({
    categoria: config.tipo as string,
    titulo,
  });

  const palavras = String(parsed.conteudo_html ?? '').split(/\s+/).length;
  const tempoLeitura = Math.max(1, Math.round(palavras / 200));

  return {
    titulo,
    resumo: String(parsed.resumo ?? ''),
    conteudo_html: String(parsed.conteudo_html ?? ''),
    slug,
    categoria: (config.tipo === 'onde-assistir' ? 'onde-assistir' : config.tipo) as Categoria,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
    imagem_capa_url: imagem,
    schema_json: metadados.schema_json ?? {},
    publicar_em: metadados.publicar_em,
    gerado_por_ia: true,
    agente_tipo: config.tipo,
    tempo_leitura_min: tempoLeitura,
  };
}

// =====================
// AGENTE: FUTEBOL (Com Trava Antialucinação)
// =====================
export async function runAgenteFutebol(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  // Busca dados de partidas confirmadas
  const jogosHoje = await footballData.upcomingMatches(0).catch(() => []);
  const jogosProximos = await footballData.upcomingMatches(config.dias_antecipacao).catch(() => []);

  const todosJogos = [...jogosHoje, ...jogosProximos].slice(0, config.posts_por_dia);

  // SE NÃO HOUVER JOGOS CONFIRMADOS: NÃO ALUCINA! Faz fallback para Guia Editorial de Futebol
  if (todosJogos.length === 0) {
    const contextoFallback = `
TEMA: Guia Completo de Transmissões de Futebol esta Semana no Brasil.
CAMPEONATOS COBERTOS: Brasileirão Série A, Copa do Brasil, Libertadores, Sul-Americana e Liga dos Campeões.
OBJETIVO: Informar o leitor onde encontrar cada campeonato nas plataformas de streaming (Premiere, Prime Video, Paramount+, Max, Disney+/ESPN).
FOCO DE CONVERSÃO: Explicar como tirar dúvidas sobre a grade de programação entrando em contato pelo WhatsApp.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contextoFallback, {
        categoria: 'futebol',
        schema_json: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: 'Onde Assistir aos Jogos de Futebol esta Semana ao Vivo',
        },
        imagem_capa_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85',
      });
      posts.push(post);
    } catch (e) {
      console.error('[AgenteFutebol] Erro no post de fallback:', e);
    }
    return posts;
  }

  for (const jogo of todosJogos) {
    const dataJogo = new Date(jogo.utcDate);
    const dataStr = dataJogo.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo'
    });
    const horaStr = dataJogo.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    });

    const contexto = `
PARTIDA REAL CONFIRMADA: ${jogo.homeTeam.name} vs ${jogo.awayTeam.name}
COMPETIÇÃO: ${jogo.competition.name}
DATA E HORA: ${dataStr} às ${horaStr} (Horário de Brasília)
STATUS: ${jogo.status}

TAREFA:
Crie um artigo jornalístico pré-jogo detalhado e atraente.
Explique onde o torcedor poderá assistir ao vivo (canais e streamings oficiais).
Analise o momento atual dos dois times na temporada de forma factual.
Palavras-chave obrigatórias: "onde assistir ${jogo.homeTeam.name} x ${jogo.awayTeam.name}", "ao vivo", "transmissão ${jogo.homeTeam.name}".
    `.trim();

    try {
      const post = await gerarPostComIA(config, contexto, {
        categoria: 'futebol',
        schema_json: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          about: {
            '@type': 'SportsEvent',
            name: `${jogo.homeTeam.name} x ${jogo.awayTeam.name}`,
            startDate: jogo.utcDate,
            sport: 'Futebol',
          },
        },
        imagem_capa_url: await getPostImage({
          categoria: 'futebol',
          titulo: `${jogo.homeTeam.name} x ${jogo.awayTeam.name}`,
        }),
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteFutebol] Erro:`, err);
    }
  }

  return posts;
}

// =====================
// AGENTE: CINEMA
// =====================
export async function runAgenteCinema(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];
  const filmes = await tmdb.upcomingMovies().catch(() => []);
  const aProcessar = filmes.slice(0, config.posts_por_dia);

  if (aProcessar.length === 0) {
    const contextoFallback = `
TEMA: Os Lançamentos de Cinema e Streaming Mais Aguardados do Mês.
OBJETIVO: Apresentar os destaques das telonas e dos serviços de streaming com notas de avaliação e onde assistir.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contextoFallback, {
        categoria: 'cinema',
        imagem_capa_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=85'
      });
      posts.push(post);
    } catch (e) {
      console.error('[AgenteCinema] Erro fallback:', e);
    }
    return posts;
  }

  for (const filme of aProcessar) {
    const dataEstreia = new Date(filme.release_date ?? '');
    const providers = filme.id ? await tmdb.watchProviders(filme.id).catch(() => []) : [];
    const plataformas = providers.map(p => p.provider_name).join(', ') || 'Streaming Oficial e Cinemas';

    const contexto = `
FILME OFICIAL: ${filme.title}
SINOPSE: ${filme.overview}
DATA DE ESTREIA BR: ${dataEstreia.toLocaleDateString('pt-BR')}
AVALIAÇÃO TMDB: ${filme.vote_average?.toFixed(1)}/10
PLATAFORMAS CONFIRMADAS: ${plataformas}

Escreva uma crítica e guia de exibição sobre "${filme.title}".
Foque em: onde assistir, expectativa de bilheteria e por que vale a pena assistir.
    `.trim();

    try {
      const imagem = await getPostImage({
        categoria: 'cinema',
        titulo: filme.title ?? '',
        backdropPath: filme.backdrop_path ?? undefined,
        posterPath: filme.poster_path ?? undefined,
      });

      const post = await gerarPostComIA(config, contexto, {
        categoria: 'cinema',
        imagem_capa_url: imagem,
        schema_json: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          about: {
            '@type': 'Movie',
            name: filme.title,
            datePublished: filme.release_date,
          },
        },
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteCinema] Erro:`, err);
    }
  }

  return posts;
}

// =====================
// AGENTE: SÉRIES
// =====================
export async function runAgenteSeries(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];
  const series = await tmdb.airingToday().catch(() => []);
  const aProcessar = series.slice(0, config.posts_por_dia);

  if (aProcessar.length === 0) {
    const contextoFallback = `
TEMA: As Séries Mais Assistidas no Streaming em 2026.
OBJETIVO: Apresentar o ranking das séries do momento na Netflix, Max, Prime Video e Disney+.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contextoFallback, {
        categoria: 'series',
        imagem_capa_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=85'
      });
      posts.push(post);
    } catch (e) {
      console.error('[AgenteSeries] Erro fallback:', e);
    }
    return posts;
  }

  for (const serie of aProcessar) {
    const providers = serie.id ? await tmdb.watchProviders(serie.id, 'tv').catch(() => []) : [];
    const plataformas = providers.map(p => p.provider_name).join(', ') || 'Plataformas de Streaming';

    const contexto = `
SÉRIIE EM EXIBIÇÃO: ${serie.name}
SINOPSE: ${serie.overview}
AVALIAÇÃO: ${serie.vote_average?.toFixed(1)}/10
ONDE ASSISTIR: ${plataformas}

Escreva sobre os novos episódios de "${serie.name}", onde assistir e resumo do enredo.
    `.trim();

    try {
      const imagem = await getPostImage({
        categoria: 'series',
        titulo: serie.name ?? '',
        backdropPath: serie.backdrop_path ?? undefined,
        posterPath: serie.poster_path ?? undefined,
      });

      const post = await gerarPostComIA(config, contexto, {
        categoria: 'series',
        imagem_capa_url: imagem,
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteSeries] Erro:`, err);
    }
  }

  return posts;
}

// =====================
// AGENTE: ONDE ASSISTIR (Evergreen & Tráfego Massivo)
// =====================
export async function runAgenteOndeAssistir(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  const topicos = [
    { titulo: 'Como Assistir Futebol ao Vivo no Celular ou Smart TV em 2026', keywords: ['futebol ao vivo gratis', 'assistir futebol online'] },
    { titulo: 'Melhores Plataformas de Streaming de Filmes e Séries em 2026', keywords: ['melhor app streaming', 'streaming barato'] },
    { titulo: 'Como Assistir Canais de TV Fechada e Esportes Online em HD', keywords: ['canais ao vivo online', 'tv por assinatura gratis'] },
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
GUIA EDITORIAL EVERGREEN: "${topico.titulo}"
PALAVRAS-CHAVE SEO OBRIGATÓRIAS: ${topico.keywords.join(', ')}

Escreva um guia completo com passo a passo, comparando custos, facilidade de uso e onde solicitar suporte no WhatsApp.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contexto, {
        categoria: 'onde-assistir',
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteOndeAssistir] Erro:`, err);
    }
  }

  return posts;
}

// =====================
// AGENTE: CANAIS DE TV
// =====================
export async function runAgenteCanais(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  const topicos = [
    'Quais Canais Transmitem o Brasileirão 2026 ao Vivo?',
    'Guia Completo: Todos os Canais de Esportes e PPV Disponíveis no Streaming',
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
GUIA DE CANAIS: "${topico}"
Detalhamento de canais esportivos, de filmes e programas ao vivo no Brasil.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contexto, {
        categoria: 'canais',
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteCanais] Erro:`, err);
    }
  }

  return posts;
}

// =====================
// DISPATCHER PRINCIPAL
// =====================
export async function runAgente(config: AgentConfig): Promise<PostGerado[]> {
  console.log(`[Engine] Executando agente com trava de tempo real: ${config.nome} (${config.tipo})`);
  
  switch (config.tipo) {
    case 'futebol':       return runAgenteFutebol(config);
    case 'cinema':        return runAgenteCinema(config);
    case 'series':        return runAgenteSeries(config);
    case 'onde-assistir': return runAgenteOndeAssistir(config);
    case 'canais':        return runAgenteCanais(config);
    default:
      throw new Error(`Tipo de agente não suportado: ${config.tipo}`);
  }
}

// =====================
// UTILITÁRIOS
// =====================
function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}
