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
import { getRandomAuthor } from '@/lib/authors/service';
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
  autor_nome?: string;
  autor_cargo?: string;
  autor_avatar?: string;
  autor_slug?: string;
  autor_bio?: string;
}

// =====================
// =====================
// PROMPT JORNALÍSTICO ANTIALUCINAÇÃO & ESTILO EDITORIAL G1
// =====================
const PROMPT_JORNALISTA_BASE = `Você é um jornalista sênior chefe de redação de grandes portais de notícias do Brasil (padrão G1, Globo Esporte e O Omelete), especializado em cobertura jornalística de futebol, cinema, séries e guias de mídia.

REGRAS CRÍTICAS DE ESTILO, EXTENSÃO E INVIOLABILIDADE:
1. EXTENSÃO E PROFUNDIDADE JORNALÍSTICA (900 a 1500 PALAVRAS): Desenvolva matérias jornalísticas completas, profundas e ricas em detalhes. Proibido resumos curtos ou genéricos.
2. LINGUAGEM 100% HUMANA E FLUIDA: Escreva com estilo editorial humano de alta classe. NUNCA use clichês robóticos de IA (como "No entanto o status é de adiamento", "Em suma", "Fique ligado").
3. ESTRUTURA VISUAL EDITORIAL OBRIGATÓRIA:
   - DESTAQUES INICIAIS: Insira uma caixa de destaques no início: <div class="key-takeaways-box"><h4>📌 Destaques Principais da Matéria</h4><ul><li>...</li></ul></div>.
   - SEÇÕES PRINCIPAIS: Divida em pelo menos 4 seções usando <h2> e <h3> bem estruturados.
   - TABELA EDITORIAL: Insira obrigatoriamente uma tabela informativa: <table class="editorial-table"><thead><tr><th>Item</th><th>Detalhe</th></tr></thead><tbody>...</tbody></table>.
   - CITAÇÃO CTA CINEPLAY: Insira um bloco <blockquote> com convite profissional para o leitor consultar o guia de transmissão ao vivo em HD no WhatsApp.
   - SEÇÃO FAQ AO FINAL: Inclua uma seção <h2>Perguntas Frequentes (FAQ)</h2> com 3 perguntas e respostas diretas sobre onde e como assistir.
4. INTEGRAÇÃO NATURAL DE "ONDE ASSISTIR" (SEO DE ELITE): Use "onde assistir" no título, subtítulo e introdução para ranqueamento de topo no Google Discover.
5. PROIBIÇÃO ABSOLUTA DE MARCAS CONCORRENTES: NUNCA mencione marcas concorrentes (como Netflix, Globoplay, Premiere, HBO Max, Disney+, Paramount+).
6. PROIBIÇÃO DAS PALAVRAS "GRÁTIS" OU "GRATUITO": Use sempre "Ao Vivo em HD", "Transmissão Oficial" ou "Acesso em Alta Definição".`;

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

  // Seleciona um autor sorteado para dar os créditos da matéria
  const autorSorteado = getRandomAuthor(metadados.categoria || (config.tipo as string));

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
    autor_nome: autorSorteado.nome,
    autor_cargo: autorSorteado.cargo,
    autor_avatar: autorSorteado.avatar_url,
    autor_slug: autorSorteado.slug,
    autor_bio: autorSorteado.bio,
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
  // Times e competições de grande torcida no Brasil para máxima atração de tráfego
  const TIMES_POPULARES = [
    'flamengo', 'palmeiras', 'sao paulo', 'são paulo', 'corinthians', 'santos',
    'gremio', 'grêmio', 'internacional', 'botafogo', 'fluminense', 'vasco',
    'atletico mineiro', 'atlético-mg', 'cruzeiro', 'bahia', 'fortaleza', 'sport',
    'real madrid', 'barcelona', 'manchester city', 'liverpool', 'psg', 'bayern'
  ];

  function prioridadePartida(j: typeof jogosHoje[0]): number {
    let score = 0;
    const home = (j.homeTeam?.name || '').toLowerCase();
    const away = (j.awayTeam?.name || '').toLowerCase();
    const comp = (j.competition?.name || '').toLowerCase();

    if (TIMES_POPULARES.some(t => home.includes(t))) score += 20;
    if (TIMES_POPULARES.some(t => away.includes(t))) score += 20;

    if (comp.includes('brasileir') || comp.includes('serie a') || comp.includes('bsa')) score += 30;
    if (comp.includes('libertadores') || comp.includes('cli')) score += 30;
    if (comp.includes('copa do brasil')) score += 25;
    if (comp.includes('champions league') || comp.includes('cl')) score += 20;
    if (comp.includes('sudamericana') || comp.includes('sul-americana')) score += 15;

    return score;
  }

  // Filtra jogos ativos e ordena priorizando grandes clássicos e times populares do Brasil
  const todosJogos = [...jogosHoje, ...jogosProximos]
    .filter(j => j.status !== 'POSTPONED' && j.status !== 'CANCELLED' && j.status !== 'SUSPENDED')
    .sort((a, b) => prioridadePartida(b) - prioridadePartida(a))
    .slice(0, config.posts_por_dia);

  // SE NÃO HOUVER JOGOS CONFIRMADOS: NÃO ALUCINA! Faz fallback para Guia Editorial de Futebol
  if (todosJogos.length === 0) {
    const contextoFallback = `
TEMA: Guia Completo de Transmissões dos Jogos de Futebol esta Semana.
CAMPEONATOS COBERTOS: Brasileirão Série A, Copa do Brasil, Libertadores, Sul-Americana e Ligas Europeias.
OBJETIVO: Informar o torcedor sobre os horários dos jogos e como assistir em HD na Smart TV ou celular.
FOCO DE CONVERSÃO EXCLUSIVO: Explicar como tirar dúvidas sobre a grade de partidas e liberar o sinal ao vivo entrando em contato no atendimento oficial via WhatsApp.
NÃO MENCIONE MARCAS OU PLATAFORMAS CONCORRENTES.
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
Crie um artigo jornalístico pré-jogo detalhado e atraente para atração de tráfego orgânico no Google e IAs.
Palavras-chave obrigatórias: "onde assistir ${jogo.homeTeam.name} x ${jogo.awayTeam.name}", "ao vivo", "transmissão ${jogo.homeTeam.name}".
SEÇÃO ONDE ASSISTIR: Explique que o torcedor pode assistir à transmissão ao vivo sem travamentos no celular ou Smart TV. Direcione o leitor a clicar no botão de WhatsApp para solicitar seu teste ou liberação de sinal imediata.
IMPORTANTE: NUNCA MENCIONE NOMES DE CONCORRENTES OU OUTROS STREAMINGS.
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
TEMA: Os Grandes Lançamentos do Cinema e Filmes Mais Aguardados.
OBJETIVO: Apresentar a sinopse, notas de avaliação e orientar o leitor sobre como assistir em alta definição no conforto de casa através do suporte oficial no WhatsApp.
NENHUMA MARCA CONCORRENTE DEVE SER MENCIONADA.
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

    const contexto = `
FILME OFICIAL: ${filme.title}
SINOPSE: ${filme.overview}
DATA DE ESTREIA BR: ${dataEstreia.toLocaleDateString('pt-BR')}
AVALIAÇÃO TMDB: ${filme.vote_average?.toFixed(1)}/10

Escreva uma análise completa e guia de exibição sobre "${filme.title}".
Na seção "Onde Assistir", explique como assistir ao filme em 4K/Full HD no celular ou Smart TV sem travamentos, orientando o leitor a consultar o suporte no WhatsApp.
LEMBRE-SE: NÃO MENCIONE NOMES DE PLATAFORMAS CONCORRENTES.
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
TEMA: As Séries de Maior Sucesso e Lançamentos da Temporada.
OBJETIVO: Apresentar os episódios do momento e orientar o leitor a liberar o catálogo completo pelo atendimento no WhatsApp.
NENHUMA MARCA CONCORRENTE DEVE SER MENCIONADA.
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
    const contexto = `
SÉRIE EM EXIBIÇÃO: ${serie.name}
SINOPSE: ${serie.overview}
AVALIAÇÃO: ${serie.vote_average?.toFixed(1)}/10

Escreva sobre os novos episódios de "${serie.name}", novidades da trama e onde assistir.
Na seção "Onde Assistir", explique como assistir a todos os episódios em qualidade extrema sem travamentos via Smart TV ou celular falando no WhatsApp oficial.
NÃO MENCIONE PLATAFORMAS CONCORRENTES.
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
    { titulo: 'Como Assistir Futebol ao Vivo no Celular ou Smart TV sem Travamentos', keywords: ['futebol ao vivo em hd', 'assistir futebol online no celular'] },
    { titulo: 'Guia Definitivo: Como Ter Filmes, Séries e Canais ao Vivo em Alta Definição', keywords: ['melhor serviço de streaming', 'assistir tv online hd'] },
    { titulo: 'Como Assistir Jogos da Semana e Programação de Esportes Online', keywords: ['canais ao vivo online', 'transmissao de futebol ao vivo'] },
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
GUIA EDITORIAL EVERGREEN: "${topico.titulo}"
PALAVRAS-CHAVE SEO OBRIGATÓRIAS: ${topico.keywords.join(', ')}

Escreva um guia completo com passo a passo de como o leitor pode ter a melhor experiência de transmissão ao vivo no celular, computador ou Smart TV.
Destaque a facilidade de solicitar um teste e tirar dúvidas diretamente no atendimento via WhatsApp.
REGRA DE OURO: NÃO MENCIONE NOMES DE OUTROS SERVIÇOS OU STREAMINGS CONCORRENTES.
    `.trim();

    try {
      const post = await gerarPostComIA(config, contexto, {
        categoria: 'canais',
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
    'Guia Completo: Como Assistir aos Canais de Esportes e Futebol ao Vivo',
    'Guia da Grade de Programação de Filmes, Séries e Esportes no Streaming',
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
GUIA DE CANAIS: "${topico}"
Detalhamento de transmissão de esportes, filmes e entretenimento ao vivo no Brasil.
Oriente o leitor a consultar a lista completa de canais e liberar o acesso entrando em contato pelo WhatsApp oficial.
NENHUMA MARCA CONCORRENTE DEVE SER CITADA.
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
