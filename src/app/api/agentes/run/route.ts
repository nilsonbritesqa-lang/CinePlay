import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runAgente, type AgentConfig, type PostGerado } from '@/lib/ai/engine';
import { getDefaultProvider } from '@/lib/ai/providers';
import { createClient } from '@supabase/supabase-js';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET || 'cineplay-admin-2026';
  const authHeader = request.headers.get('Authorization');
  const userAgent = request.headers.get('user-agent') || '';
  const { searchParams } = new URL(request.url);

  // Vercel Cron, admin secret, token query param, ou ambiente dev
  if (userAgent.includes('vercel-cron')) return true;
  if (authHeader && authHeader === `Bearer ${secret}`) return true;
  if (searchParams.get('cron_secret') === secret) return true;

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && (authHeader === `Bearer ${cronSecret}` || searchParams.get('cron_secret') === cronSecret)) return true;

  if (process.env.NODE_ENV === 'development') return true;
  return false;
}

function getSupabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

const DEFAULT_AGENTS = [
  { id: '1', tipo: 'futebol', nome: 'Agente Futebol', provider_ia: 'gemini' },
  { id: '2', tipo: 'cinema', nome: 'Agente Cinema', provider_ia: 'groq' },
  { id: '3', tipo: 'series', nome: 'Agente Séries', provider_ia: 'gemini' },
  { id: '4', tipo: 'canais', nome: 'Agente Canais', provider_ia: 'openai' },
  { id: '5', tipo: 'onde-assistir', nome: 'Onde Assistir', provider_ia: 'groq' },
];

async function handleRun(agente_id?: string, config?: any) {
  const agentsToRun: AgentConfig[] = [];

  if (!agente_id || agente_id === 'all') {
    for (const ag of DEFAULT_AGENTS) {
      agentsToRun.push({
        id: ag.id,
        nome: ag.nome,
        tipo: ag.tipo as any,
        provider_ia: (ag.provider_ia as any) || getDefaultProvider(),
        temperatura: 0.35,
        auto_publicar: true,
        requer_aprovacao: false,
        posts_por_dia: 1,
        dias_antecipacao: 7,
        keywords_seo: ['onde assistir', 'teste grátis cineplay', 'ao vivo', 'lançamentos'],
      });
    }
  } else {
    const found = DEFAULT_AGENTS.find(a => a.id === String(agente_id) || a.tipo === String(agente_id));
    agentsToRun.push({
      id: agente_id,
      nome: config?.nome ?? found?.nome ?? 'Agente Autônomo',
      tipo: config?.tipo ?? found?.tipo ?? 'onde-assistir',
      provider_ia: config?.provider_ia ?? found?.provider_ia ?? getDefaultProvider(),
      modelo_ia: config?.modelo_ia,
      temperatura: config?.temperatura ?? 0.35,
      auto_publicar: config?.auto_publicar ?? true,
      requer_aprovacao: config?.requer_aprovacao ?? false,
      posts_por_dia: config?.posts_por_dia ?? 1,
      dias_antecipacao: config?.dias_antecipacao ?? 7,
      prompt_sistema_custom: config?.prompt_sistema_custom,
      keywords_seo: config?.keywords_seo ?? ['onde assistir', 'streaming', 'futebol ao vivo'],
    });
  }

  const allGeneratedPosts: PostGerado[] = [];

  for (const agConfig of agentsToRun) {
    try {
      const posts = await runAgente(agConfig);
      allGeneratedPosts.push(...posts);
    } catch (err) {
      console.error(`[API /agentes/run] Erro ao executar ${agConfig.nome}:`, err);
    }
  }

  // Persiste os posts gerados no Supabase
  const supabase = getSupabaseService();
  let savedCount = 0;

  if (supabase && allGeneratedPosts.length > 0) {
    for (const post of allGeneratedPosts) {
      try {
        const { error } = await supabase.from('posts').upsert(
          {
            titulo: post.titulo,
            slug: post.slug,
            resumo: post.resumo,
            conteudo_html: post.conteudo_html,
            categoria: post.categoria,
            imagem_capa_url: post.imagem_capa_url,
            status: 'publicado',
            gerado_por_ia: true,
            visualizacoes: 0,
            publicado_em: post.publicar_em || new Date().toISOString(),
          },
          { onConflict: 'slug' }
        );

        if (error) {
          console.error('[AgentesRun] Erro ao salvar post no Supabase:', error);
        } else {
          savedCount++;
        }
      } catch (e) {
        console.warn('[AgentesRun] Exceção ao salvar post:', e);
      }
    }
  }

  return {
    ok: true,
    posts_gerados: allGeneratedPosts.length,
    posts_salvos: savedCount,
    posts: allGeneratedPosts.map(p => ({ titulo: p.titulo, slug: p.slug, categoria: p.categoria })),
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const result = await handleRun(body.agente_id, body.config);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[API /agentes/run POST]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Se a requisição for disparada pelo Vercel Cron ou com secret/run=true, executa a geração automatizada!
  if (isAuthorized(request) || searchParams.get('run') === 'true') {
    try {
      const result = await handleRun(searchParams.get('agente_id') || undefined);
      return NextResponse.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // Caso contrário, apenas lista os agentes ativos
  return NextResponse.json({
    agentes: DEFAULT_AGENTS.map(a => ({ ...a, ativo: true })),
  });
}
