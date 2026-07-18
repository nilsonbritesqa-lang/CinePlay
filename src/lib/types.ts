export type Categoria = 
  | 'futebol' 
  | 'cinema' 
  | 'series' 
  | 'canais' 
  | 'onde-assistir';

export type StatusPost = 'rascunho' | 'publicado' | 'agendado';

export type TipoAgente = 
  | 'futebol' 
  | 'cinema' 
  | 'series' 
  | 'canais' 
  | 'onde-assistir';

export type TipoExibicaoCTA = 'inline' | 'banner' | 'sidebar';

export type PlanoCTA = 'basico' | 'premium' | 'destaque';

/* =====================
   POST
   ===================== */
export interface Post {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo_html: string;
  imagem_capa_url: string;
  categoria: Categoria;
  tags: string[];
  autor_nome: string;
  status: StatusPost;
  publicado_em: string | null;
  atualizado_em: string;
  gerado_por_ia: boolean;
  agente_tipo?: TipoAgente;
  visualizacoes: number;
  schema_json?: Record<string, unknown>;
  tempo_leitura_min?: number;
}

export interface PostCard {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_capa_url: string;
  categoria: Categoria;
  publicado_em: string | null;
  visualizacoes: number;
  tempo_leitura_min?: number;
  gerado_por_ia: boolean;
}

/* =====================
   PATROCINADOR / CTA
   ===================== */
export interface Patrocinador {
  id: string;
  nome: string;
  logo_url: string;
  ativo: boolean;
  prioridade: number;
  plano: PlanoCTA;
  criado_em: string;
  ctas?: CTA[];
}

export interface CTA {
  id: string;
  patrocinador_id: string;
  patrocinador?: Patrocinador;
  texto_pre: string;          // "Assista agora em:"
  texto_botao: string;        // "Ver Planos" / "Assine Agora"
  url_destino: string;
  cor_botao: string;          // hex
  cor_texto_botao: string;    // hex
  icone_url?: string;
  categorias: Categoria[];    // onde o CTA aparece
  tipo_exibicao: TipoExibicaoCTA;
  data_inicio: string;
  data_fim: string | null;
  ativo: boolean;
  cliques_total: number;
}

export interface CTAClique {
  id: string;
  cta_id: string;
  post_id?: string;
  clicado_em: string;
}

/* =====================
   AGENTE DE IA
   ===================== */
export interface Agente {
  id: string;
  nome: string;
  tipo: TipoAgente;
  descricao: string;
  ativo: boolean;
  frequencia_cron: string;
  ultima_execucao: string | null;
  proxima_execucao: string | null;
  total_posts_gerados: number;
  config: AgenteConfig;
}

export interface AgenteConfig {
  modelo_ia: string;           // "gemini-1.5-pro"
  temperatura: number;         // 0.7
  max_tokens: number;
  prompt_sistema: string;
  categorias_alvo: Categoria[];
  keywords_seo: string[];
  apis_externas: string[];     // ["tmdb", "football-data"]
  auto_publicar: boolean;
  requer_aprovacao: boolean;
  imagem_auto: boolean;
}

export interface AgenteLog {
  id: string;
  agente_id: string;
  status: 'sucesso' | 'erro' | 'pendente';
  post_gerado_id?: string;
  mensagem: string;
  executado_em: string;
  duracao_ms?: number;
}

/* =====================
   DASHBOARD / ANALYTICS
   ===================== */
export interface DashboardStats {
  total_posts: number;
  posts_publicados: number;
  posts_rascunho: number;
  posts_agendados: number;
  total_visualizacoes: number;
  total_cliques_cta: number;
  patrocinadores_ativos: number;
  agentes_ativos: number;
  posts_esta_semana: number;
  top_categoria: Categoria;
}

/* =====================
   TMDB (API externa)
   ===================== */
export interface TMDBFilme {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  streaming_providers?: TMDBProvider[];
}

export interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

/* =====================
   FOOTBALL DATA (API externa)
   ===================== */
export interface Partida {
  id: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchday: number;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'FINISHED';
  score?: {
    home: number | null;
    away: number | null;
  };
}
