import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runAgente } from '@/lib/ai/engine';
import { getDefaultProvider } from '@/lib/ai/providers';
import type { AgentConfig } from '@/lib/ai/engine';
import { createClient } from '@supabase/supabase-js';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  return authHeader === `Bearer ${secret}`;
}

function getSupabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { agente_id, config } = body;

    const agenteConfig: AgentConfig = {
      id: agente_id ?? 'manual',
      nome: config?.nome ?? 'Agente Autônomo',
      tipo: config?.tipo ?? 'onde-assistir',
      provider_ia: config?.provider_ia ?? getDefaultProvider(),
      modelo_ia: config?.modelo_ia,
      temperatura: config?.temperatura ?? 0.7,
      auto_publicar: config?.auto_publicar ?? true,
      requer_aprovacao: config?.requer_aprovacao ?? false,
      posts_por_dia: config?.posts_por_dia ?? 2,
      dias_antecipacao: config?.dias_antecipacao ?? 3,
      prompt_sistema_custom: config?.prompt_sistema_custom,
      keywords_seo: config?.keywords_seo ?? ['onde assistir', 'streaming', 'futebol ao vivo'],
    };

    const posts = await runAgente(agenteConfig);

    // Persiste no Supabase se houver conexão
    const supabase = getSupabaseService();
    if (supabase && posts.length > 0) {
      for (const post of posts) {
        try {
          await supabase.from('posts').upsert(
            {
              titulo: post.titulo,
              slug: post.slug,
              resumo: post.resumo,
              conteudo_html: post.conteudo_html,
              categoria: post.categoria,
              tags: post.tags,
              imagem_capa_url: post.imagem_capa_url,
              status: agenteConfig.auto_publicar ? 'publicado' : 'rascunho',
              gerado_por_ia: true,
              agente_tipo: post.agente_tipo,
              tempo_leitura_min: post.tempo_leitura_min,
              schema_json: post.schema_json,
              publicado_em: post.publicar_em || new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
        } catch (e) {
          console.warn('[AgentesRun] Erro ao salvar post no Supabase:', e);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      posts_gerados: posts.length,
      posts: posts.map(p => ({ titulo: p.titulo, slug: p.slug, categoria: p.categoria })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[API /agentes/run]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    agentes: [
      { id: 'futebol', nome: 'Futebol', ativo: true, provider: 'gemini' },
      { id: 'cinema', nome: 'Cinema', ativo: true, provider: 'groq' },
      { id: 'series', nome: 'Séries', ativo: true, provider: 'claude' },
      { id: 'canais', nome: 'Canais', ativo: true, provider: 'gemini' },
      { id: 'onde-assistir', nome: 'Onde Assistir', ativo: true, provider: 'groq' },
    ],
  });
}
