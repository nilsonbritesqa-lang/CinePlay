/**
 * Motor de Agentes de IA
 * 
 * Cada agente:
 * - Busca dados contextuais de APIs externas
 * - Gera posts proativos (dias antes dos eventos) E posts do dia
 * - Publica automaticamente ou salva como rascunho para aprovação
 * - Configurável 100% via painel admin
 */

import { generateAIWithFallback, type AIProvider } from '@/lib/ai/providers';
import { tmdb, footballData, footballApi, getPostImage } from '@/lib/images/service';
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
  posts_por_dia: number;           // meta diária
  dias_antecipacao: number;        // posts criados X dias antes do evento
  prompt_sistema_custom?: string;  // prompt personalizado via painel
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
  publicar_em?: string;          // null = publicar agora, ISO date = agendar
  gerado_por_ia: boolean;
  agente_tipo: string;
  tempo_leitura_min: number;
}

// =====================
// PROMPTS BASE
// =====================
const PROMPT_JORNALISTA = `Você é um jornalista especialista em entretenimento e streaming do Brasil.
Escreva em português brasileiro, tom informal mas profissional.
Foque em SEO: inclua palavras-chave naturalmente no texto.
Use H2 e H3 para estruturar o conteúdo.
Sempre mencione onde assistir o conteúdo (plataformas disponíveis).
Cite fontes quando possível.
Seja factual: não invente informações que não foram fornecidas.
O conteúdo deve ter entre 600-1200 palavras.`;

// =====================
// GERAÇÃO GENÉRICA
// =====================
async function gerarPostComIA(
  config: AgentConfig,
  contexto: string,
  metadados: Partial<PostGerado>
): Promise<PostGerado> {
  const promptSistema = config.prompt_sistema_custom ?? PROMPT_JORNALISTA;

  const resultado = await generateAIWithFallback(
    {
      temperature: config.temperatura,
      maxTokens: 3000,
      messages: [
        { role: 'system', content: promptSistema },
        {
          role: 'user',
          content: `
${contexto}

Gere um post de blog completo em formato JSON com a seguinte estrutura:
{
  "titulo": "Título otimizado para SEO (máx 65 chars)",
  "resumo": "Meta description (150-160 chars, inclua palavra-chave)",
  "slug": "slug-url-amigavel",
  "tags": ["tag1", "tag2", "tag3"],
  "conteudo_html": "HTML completo do post com H2, H3, parágrafos, listas"
}

Retorne APENAS o JSON, sem markdown, sem explicações.
          `.trim(),
        },
      ],
    },
    config.provider_ia
  );

  let parsed: Record<string, unknown>;
  try {
    // Tratamento robusto para extrair apenas a parte JSON da resposta caso a IA inclua texto
    let clean = resultado.content.trim();
    
    // Se a resposta contiver blocos de código markdown do tipo ```json ... ``` ou ``` ... ```
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = clean.match(jsonBlockRegex);
    if (match && match[1]) {
      clean = match[1].trim();
    }
    
    // Remove potenciais caracteres de controle invisíveis ou inválidos antes de parsear
    clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(`IA retornou JSON inválido ou malformado. Resposta bruta: ${resultado.content.slice(0, 300)}`);
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
    categoria: config.tipo as Categoria,
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
// AGENTE: FUTEBOL
// =====================
export async function runAgenteFutebol(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  // 1. Jogos hoje
  const jogosHoje = await footballData.upcomingMatches(0);
  // 2. Jogos nos próximos N dias (posts antecipados)
  const jogosProximos = await footballData.upcomingMatches(config.dias_antecipacao);

  const todosJogos = [...jogosHoje, ...jogosProximos].slice(0, config.posts_por_dia);

  for (const jogo of todosJogos) {
    const dataJogo = new Date(jogo.utcDate);
    const dataStr = dataJogo.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    const horaStr = dataJogo.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    });

    const isHoje = new Date().toDateString() === dataJogo.toDateString();
    const dias = Math.ceil((dataJogo.getTime() - Date.now()) / 86400000);

    const contexto = `
Jogo: ${jogo.homeTeam.name} x ${jogo.awayTeam.name}
Campeonato: ${jogo.competition.name}
Data/Hora: ${dataStr} às ${horaStr} (Horário de Brasília)
${dias > 0 ? `O jogo acontece em ${dias} dia(s) — crie um post antecipando o confronto.` : 'O jogo é HOJE — crie um post urgente de "onde assistir hoje".'}
Status atual: ${jogo.status}

Foque em: onde assistir ao vivo, histórico do confronto, importância do jogo no campeonato.
Palavras-chave obrigatórias: "onde assistir ${jogo.homeTeam.name} x ${jogo.awayTeam.name}", "ao vivo", "transmissão".
    `.trim();

    // Agendar publicação: posts antecipados publicam 1 dia antes do evento
    let publicarEm: string | undefined;
    if (dias > 1) {
      const pubDate = new Date(dataJogo);
      pubDate.setDate(pubDate.getDate() - 1);
      pubDate.setHours(8, 0, 0, 0);
      publicarEm = pubDate.toISOString();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      about: {
        '@type': 'SportsEvent',
        name: `${jogo.homeTeam.name} x ${jogo.awayTeam.name}`,
        startDate: jogo.utcDate,
        sport: 'Futebol',
      },
    };

    try {
      const post = await gerarPostComIA(config, contexto, {
        categoria: 'futebol',
        schema_json: schema,
        publicar_em: publicarEm,
        imagem_capa_url: await getPostImage({
          categoria: 'futebol',
          titulo: `${jogo.homeTeam.name} x ${jogo.awayTeam.name}`,
        }),
      });
      posts.push(post);
    } catch (err) {
      console.error(`[AgenteFutebol] Erro gerando post para ${jogo.homeTeam.name} x ${jogo.awayTeam.name}:`, err);
    }
  }

  return posts;
}

// =====================
// AGENTE: CINEMA
// =====================
export async function runAgenteCinema(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];
  const filmes = await tmdb.upcomingMovies();
  const aProcessar = filmes.slice(0, config.posts_por_dia);

  for (const filme of aProcessar) {
    const dataEstreia = new Date(filme.release_date ?? '');
    const diasParaEstreia = Math.ceil((dataEstreia.getTime() - Date.now()) / 86400000);
    const providers = filme.id ? await tmdb.watchProviders(filme.id) : [];
    const plataformas = providers.map(p => p.provider_name).join(', ') || 'a ser anunciado';

    const contexto = `
Filme: ${filme.title}
Sinopse: ${filme.overview}
Data de estreia (BR): ${dataEstreia.toLocaleDateString('pt-BR')}
${diasParaEstreia > 0 ? `Estreia em ${diasParaEstreia} dia(s).` : 'JÁ DISPONÍVEL para assistir.'}
Nota TMDB: ${filme.vote_average?.toFixed(1)}/10
Onde assistir no Brasil: ${plataformas}

Foque em: "onde assistir ${filme.title}", "onde está passando?", recomendação.
Inclua a nota, sinopse resumida, e onde encontrar.
    `.trim();

    // Posts antecipados: publicar dias antes da estreia
    let publicarEm: string | undefined;
    if (diasParaEstreia > 1) {
      const pubDate = new Date(dataEstreia);
      pubDate.setDate(pubDate.getDate() - Math.min(2, diasParaEstreia - 1));
      pubDate.setHours(9, 0, 0, 0);
      publicarEm = pubDate.toISOString();
    }

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
        publicar_em: publicarEm,
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
  const series = await tmdb.airingToday();
  const aProcessar = series.slice(0, config.posts_por_dia);

  for (const serie of aProcessar) {
    const providers = serie.id ? await tmdb.watchProviders(serie.id, 'tv') : [];
    const plataformas = providers.map(p => p.provider_name).join(', ') || 'a ser anunciado';

    const contexto = `
Série: ${serie.name}
Sinopse: ${serie.overview}
Em exibição hoje
Nota TMDB: ${serie.vote_average?.toFixed(1)}/10
Onde assistir no Brasil: ${plataformas}

Escreva sobre: onde assistir, de que trata, por que vale a pena.
Inclua "onde assistir ${serie.name}" como palavra-chave principal.
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
// AGENTE: ONDE ASSISTIR (genérico, volume alto)
// =====================
export async function runAgenteOndeAssistir(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  // Tópicos evergreen de alto volume de busca
  const topicos = [
    { titulo: 'Como assistir futebol ao vivo de graça na internet', keywords: ['futebol ao vivo gratis', 'assistir futebol online'] },
    { titulo: 'Melhores aplicativos para assistir séries e filmes em 2026', keywords: ['melhor app streaming', 'streaming barato'] },
    { titulo: 'Como assistir canais abertos no celular ou smart TV', keywords: ['canais abertos online', 'tv ao vivo gratis'] },
    { titulo: 'Qual é o melhor serviço de streaming de vídeo em 2026?', keywords: ['melhor streaming brasil', 'streaming comparativo'] },
    { titulo: 'Como gerenciar e cancelar assinaturas de streaming com facilidade', keywords: ['cancelar assinatura', 'cancelar streaming'] },
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
Escreva um guia completo sobre: "${topico.titulo}"
Palavras-chave SEO obrigatórias: ${topico.keywords.join(', ')}
Formato ideal: guia passo a passo ou comparativo.
Inclua seção "Conclusão" com recomendação clara.
Target: usuário brasileiro que não quer pagar caro por streaming.
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
// AGENTE: CANAIS
// =====================
export async function runAgenteCanais(config: AgentConfig): Promise<PostGerado[]> {
  const posts: PostGerado[] = [];

  const topicos = [
    'Quais canais têm o Brasileirão 2026 ao vivo?',
    'Guia completo: todos os canais de esportes disponíveis no streaming',
    'Canais de filmes e séries disponíveis no Brasil',
    'Como montar um pacote de streaming barato com os canais que você quer',
    'Canais de notícias ao vivo: onde assistir online gratuitamente',
  ];

  const aProcessar = topicos.slice(0, config.posts_por_dia);

  for (const topico of aProcessar) {
    const contexto = `
Escreva sobre: "${topico}"
Formato: guia informativo completo com subtópicos.
Mencione plataformas de vídeo e canais esportivos disponíveis no Brasil de forma genérica.
Inclua dicas de custo-benefício.
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
  console.log(`[Engine] Iniciando agente: ${config.nome} (${config.tipo})`);
  
  switch (config.tipo) {
    case 'futebol':       return runAgenteFutebol(config);
    case 'cinema':        return runAgenteCinema(config);
    case 'series':        return runAgenteSeries(config);
    case 'onde-assistir': return runAgenteOndeAssistir(config);
    case 'canais':        return runAgenteCanais(config);
    default:
      throw new Error(`Tipo de agente desconhecido: ${config.tipo}`);
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
