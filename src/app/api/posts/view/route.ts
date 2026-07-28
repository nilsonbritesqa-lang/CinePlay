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

export async function POST(request: NextRequest) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Banco de dados não configurado' }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id, slug } = body;

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: 'ID ou slug é obrigatório' }, { status: 400 });
    }

    let query = supabase.from('posts').select('id, visualizacoes');
    if (id) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    }

    const { data: post, error: fetchErr } = await query.maybeSingle();

    if (fetchErr || !post) {
      return NextResponse.json({ success: false, error: 'Post não encontrado' }, { status: 404 });
    }

    const currentViews = Number(post.visualizacoes || 0);
    const newViews = currentViews + 1;

    const { error: updateErr } = await supabase
      .from('posts')
      .update({ visualizacoes: newViews })
      .eq('id', post.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, visualizacoes: newViews });
  } catch (err: any) {
    console.error('[API /posts/view] Erro ao incrementar visualizações:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
