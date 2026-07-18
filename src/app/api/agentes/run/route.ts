import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runAgente } from '@/lib/ai/engine';
import { getDefaultProvider } from '@/lib/ai/providers';
import type { AgentConfig } from '@/lib/ai/engine';

// Autenticação simples por secret
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // dev mode sem secret
  return authHeader === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { agente_id, config } = body;

    // Config padrão se não for passada pelo painel
    const agenteConfig: AgentConfig = {
      id: agente_id ?? 'manual',
      nome: config?.nome ?? 'Manual',
      tipo: config?.tipo ?? 'onde-assistir',
      provider_ia: config?.provider_ia ?? getDefaultProvider(),
      modelo_ia: config?.modelo_ia,
      temperatura: config?.temperatura ?? 0.7,
      auto_publicar: config?.auto_publicar ?? false,
      requer_aprovacao: config?.requer_aprovacao ?? true,
      posts_por_dia: config?.posts_por_dia ?? 2,
      dias_antecipacao: config?.dias_antecipacao ?? 3,
      prompt_sistema_custom: config?.prompt_sistema_custom,
      keywords_seo: config?.keywords_seo ?? ['onde assistir', 'streaming'],
    };

    const posts = await runAgente(agenteConfig);

    // TODO: salvar posts no Supabase
    // const supabase = createServiceClient();
    // for (const post of posts) { await supabase.from('posts').insert(post); }

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

// GET: status dos agentes (para dashboard)
export async function GET() {
  return NextResponse.json({
    agentes: [
      { id: '1', nome: 'Futebol', ativo: true, provider: 'gemini' },
      { id: '2', nome: 'Cinema', ativo: true, provider: 'groq' },
      { id: '3', nome: 'Séries', ativo: true, provider: 'claude' },
      { id: '4', nome: 'Canais', ativo: false, provider: 'gemini' },
      { id: '5', nome: 'Onde Assistir', ativo: true, provider: 'groq' },
    ],
  });
}
