-- ============================================================
-- CINEPLAY — SCHEMA SUPABASE (COMPLETO v2)
-- Execute no SQL Editor: https://supabase.com/dashboard/project/hjmsabirunfywjxfsuly/sql/new
-- ============================================================

-- Extensão para UUIDs
create extension if not exists "pgcrypto";

-- ============================================================
-- TABELA: posts
-- ============================================================
create table if not exists posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  titulo          text not null,
  resumo          text,
  conteudo_html   text,
  imagem_capa_url text,
  categoria       text not null check (categoria in ('futebol','cinema','series','canais','onde-assistir','eventos')),
  tags            text[] default '{}',
  autor_nome      text default 'CinePlay Editorial',
  status          text not null default 'rascunho' check (status in ('rascunho','publicado','agendado')),
  publicado_em    timestamptz,
  atualizado_em   timestamptz default now(),
  gerado_por_ia   boolean default false,
  agente_tipo     text,
  visualizacoes   integer default 0,
  schema_json     jsonb,
  tempo_leitura_min integer default 1,
  -- Dados esportivos (para posts de futebol)
  partida_id      text,
  time_casa       text,
  time_fora       text,
  liga            text,
  data_partida    timestamptz,
  -- Dados de mídia (para posts de filmes/séries)
  tmdb_id         integer,
  tmdb_type       text check (tmdb_type in ('movie','tv', null))
);

create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_categoria on posts(categoria);
create index if not exists idx_posts_status_publicado on posts(status, publicado_em desc);
create index if not exists idx_posts_partida on posts(partida_id);

alter table posts enable row level security;
create policy "leitura_publica" on posts
  for select using (status = 'publicado');
create policy "admin_full_posts" on posts
  for all using (auth.role() = 'service_role');

-- ============================================================
-- TABELA: patrocinadores
-- ============================================================
create table if not exists patrocinadores (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  logo_url   text,
  ativo      boolean default true,
  prioridade integer default 10,
  plano      text default 'basico' check (plano in ('basico','premium','destaque')),
  criado_em  timestamptz default now()
);

alter table patrocinadores enable row level security;
create policy "admin_full_pat" on patrocinadores for all using (auth.role() = 'service_role');
create policy "cta_leitura_publica" on patrocinadores for select using (ativo = true);

-- ============================================================
-- TABELA: ctas
-- ============================================================
create table if not exists ctas (
  id               uuid primary key default gen_random_uuid(),
  patrocinador_id  uuid references patrocinadores(id) on delete cascade,
  texto_pre        text not null default 'Assista agora em:',
  texto_botao      text not null default 'Ver Planos',
  url_destino      text not null,
  cor_botao        text default '#E50914',
  cor_texto_botao  text default '#ffffff',
  icone_url        text,
  categorias       text[] default '{}',
  tipo_exibicao    text default 'inline' check (tipo_exibicao in ('inline','banner','sidebar')),
  data_inicio      timestamptz default now(),
  data_fim         timestamptz,
  ativo            boolean default true,
  cliques_total    integer default 0
);

create index if not exists idx_ctas_patrocinador on ctas(patrocinador_id);
create index if not exists idx_ctas_ativo on ctas(ativo, data_inicio, data_fim);

alter table ctas enable row level security;
create policy "ctas_leitura_publica" on ctas for select using (ativo = true);
create policy "admin_full_ctas" on ctas for all using (auth.role() = 'service_role');

-- ============================================================
-- TABELA: cta_cliques
-- ============================================================
create table if not exists cta_cliques (
  id          uuid primary key default gen_random_uuid(),
  cta_id      uuid references ctas(id) on delete cascade,
  post_id     uuid references posts(id) on delete set null,
  ip_hash     text,
  user_agent  text,
  clicado_em  timestamptz default now()
);

create index if not exists idx_cliques_cta on cta_cliques(cta_id, clicado_em desc);

alter table cta_cliques enable row level security;
create policy "insert_clique" on cta_cliques for insert with check (true);
create policy "admin_cliques" on cta_cliques for select using (auth.role() = 'service_role');

create or replace function increment_cta_cliques()
returns trigger as $$
begin
  update ctas set cliques_total = cliques_total + 1 where id = NEW.cta_id;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_increment_cliques
after insert on cta_cliques
for each row execute function increment_cta_cliques();

-- ============================================================
-- TABELA: agentes
-- ============================================================
create table if not exists agentes (
  id                   uuid primary key default gen_random_uuid(),
  nome                 text not null,
  tipo                 text not null check (tipo in ('futebol','cinema','series','canais','onde-assistir','eventos')),
  descricao            text,
  ativo                boolean default true,
  frequencia_cron      text default '0 8,14,20 * * *',
  ultima_execucao      timestamptz,
  proxima_execucao     timestamptz,
  total_posts_gerados  integer default 0,
  config               jsonb not null default '{}'::jsonb
);

alter table agentes enable row level security;
create policy "admin_agentes" on agentes for all using (auth.role() = 'service_role');

-- ============================================================
-- TABELA: agentes_logs
-- ============================================================
create table if not exists agentes_logs (
  id              uuid primary key default gen_random_uuid(),
  agente_id       uuid references agentes(id) on delete cascade,
  status          text check (status in ('sucesso','erro','pendente')),
  post_gerado_id  uuid references posts(id) on delete set null,
  mensagem        text,
  executado_em    timestamptz default now(),
  duracao_ms      integer
);

create index if not exists idx_logs_agente on agentes_logs(agente_id, executado_em desc);

alter table agentes_logs enable row level security;
create policy "admin_logs" on agentes_logs for all using (auth.role() = 'service_role');

-- ============================================================
-- TABELA: chatbot_config (configurações do chatbot de vendas)
-- ============================================================
create table if not exists chatbot_config (
  id               uuid primary key default gen_random_uuid(),
  nome             text default 'CinePlay Atendente',
  saudacao         text default 'Olá! 👋 Quer saber onde assistir um filme, série, jogo ou programa? Posso te ajudar!',
  whatsapp_numero  text default '5511999999999',
  whatsapp_mensagem text default 'Olá! Vim pelo CinePlay e quero saber mais.',
  cta_texto        text default 'Falar no WhatsApp',
  instrucoes       text[] default '{}',
  ativo            boolean default true,
  atualizado_em    timestamptz default now()
);

alter table chatbot_config enable row level security;
create policy "chatbot_leitura_publica" on chatbot_config for select using (true);
create policy "admin_chatbot" on chatbot_config for all using (auth.role() = 'service_role');

-- Inserir configuração padrão
insert into chatbot_config (nome, saudacao, instrucoes) values (
  'CinePlay Atendente',
  'Olá! 👋 Quer saber onde assistir um filme, série, jogo de futebol ou programa como o BBB? Posso te ajudar!',
  ARRAY[
    'Você é um assistente de vendas do CinePlay, guia de entretenimento brasileiro.',
    'Responda apenas sobre: filmes, séries, futebol (Brasileirão, Champions, Libertadores), BBB, reality shows e streaming.',
    'Seu objetivo é sempre direcionar o usuário para o WhatsApp.',
    'Seja simpático e direto. Máximo 2 frases por resposta.',
    'Se a pergunta for fora do contexto de entretenimento, redirecione educadamente para o WhatsApp.'
  ]
) on conflict do nothing;

-- ============================================================
-- TABELA: hero_media_cache (cache de mídia para o hero)
-- ============================================================
create table if not exists hero_media_cache (
  id          uuid primary key default gen_random_uuid(),
  source      text not null check (source in ('tmdb','football','manual')),
  external_id text,
  title       text not null,
  poster_url  text,
  backdrop_url text,
  meta        jsonb default '{}',
  categoria   text,
  score       float default 0,
  cached_at   timestamptz default now(),
  expires_at  timestamptz default now() + interval '6 hours'
);

create index if not exists idx_hero_cache_source on hero_media_cache(source, expires_at);
create index if not exists idx_hero_cache_categoria on hero_media_cache(categoria);

alter table hero_media_cache enable row level security;
create policy "hero_leitura_publica" on hero_media_cache for select using (true);
create policy "admin_hero_cache" on hero_media_cache for all using (auth.role() = 'service_role');

-- ============================================================
-- DADOS INICIAIS: 5 agentes
-- ============================================================
insert into agentes (nome, tipo, descricao, frequencia_cron, config) values
(
  'Agente Futebol', 'futebol',
  'Cria posts sobre jogos ao vivo, transmissões e resultados. Antecipa eventos de futebol.',
  '0 8,14,20 * * *',
  '{"provider_ia":"gemini","modelo_ia":"gemini-1.5-flash","temperatura":0.7,"posts_por_dia":3,"dias_antecipacao":3,"auto_publicar":true,"requer_aprovacao":false,"keywords_seo":["onde assistir","ao vivo","qual canal passa","transmissão ao vivo"],"apis_externas":["football-data","api-football"]}'::jsonb
),
(
  'Agente Cinema', 'cinema',
  'Cria posts sobre estreias de filmes, trailers e onde assistir online.',
  '0 9 * * 4',
  '{"provider_ia":"groq","modelo_ia":"llama-3.3-70b-versatile","temperatura":0.8,"posts_por_dia":2,"dias_antecipacao":5,"auto_publicar":true,"requer_aprovacao":false,"keywords_seo":["onde assistir","estreias","Netflix","Prime Video","HBO"],"apis_externas":["tmdb","omdb"]}'::jsonb
),
(
  'Agente Séries', 'series',
  'Monitora lançamentos de temporadas e episódios nas plataformas de streaming.',
  '0 18 * * *',
  '{"provider_ia":"groq","modelo_ia":"llama-3.1-8b-instant","temperatura":0.75,"posts_por_dia":2,"dias_antecipacao":2,"auto_publicar":true,"requer_aprovacao":false,"keywords_seo":["nova temporada","onde assistir","quando estreia","novos episódios"],"apis_externas":["tmdb"]}'::jsonb
),
(
  'Agente Canais', 'canais',
  'Guias de canais disponíveis no streaming e comparativos de pacotes.',
  '0 10 * * 1',
  '{"provider_ia":"gemini","modelo_ia":"gemini-1.5-pro","temperatura":0.6,"posts_por_dia":2,"dias_antecipacao":0,"auto_publicar":false,"requer_aprovacao":true,"keywords_seo":["canais disponíveis","guia de canais","como assistir","sem TV a cabo"],"apis_externas":[]}'::jsonb
),
(
  'Agente Onde Assistir', 'onde-assistir',
  'Responde às principais buscas de "onde assistir" baseado em trending topics.',
  '0 */2 * * *',
  '{"provider_ia":"groq","modelo_ia":"llama-3.3-70b-versatile","temperatura":0.65,"posts_por_dia":4,"dias_antecipacao":0,"auto_publicar":true,"requer_aprovacao":false,"keywords_seo":["onde assistir","como assistir","gratis","streaming barato","sem assinar"],"apis_externas":["google-trends"]}'::jsonb
)
on conflict do nothing;

-- ============================================================
-- FUNÇÃO: buscar CTAs ativos por categoria
-- ============================================================
create or replace function get_ctas_by_categoria(cat text)
returns setof ctas as $$
  select * from ctas
  where ativo = true
    and cat = any(categorias)
    and data_inicio <= now()
    and (data_fim is null or data_fim > now())
  order by (select prioridade from patrocinadores where id = patrocinador_id) asc
  limit 3;
$$ language sql security definer;

-- ============================================================
-- VIEW: posts publicados
-- ============================================================
create or replace view posts_publicados as
  select
    p.id, p.slug, p.titulo, p.resumo, p.imagem_capa_url,
    p.categoria, p.tags, p.autor_nome,
    p.publicado_em, p.atualizado_em,
    p.gerado_por_ia, p.agente_tipo,
    p.visualizacoes, p.tempo_leitura_min,
    p.schema_json,
    p.time_casa, p.time_fora, p.liga, p.data_partida,
    p.tmdb_id, p.tmdb_type
  from posts p
  where p.status = 'publicado'
    and p.publicado_em <= now()
  order by p.publicado_em desc;
