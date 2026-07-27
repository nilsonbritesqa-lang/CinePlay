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
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          return NextResponse.json({ success: false, error: 'Post não encontrado' }, { status: 404 });
        }

        // Incrementa visualizações reais
        await supabase.from('posts').update({ visualizacoes: (data.visualizacoes || 0) + 1 }).eq('id', data.id);
        return NextResponse.json({ success: true, post: data });
      } else {
        let query = supabase.from('posts').select('*').order('publicado_em', { ascending: false });
        if (categoria) {
          query = query.eq('categoria', categoria);
        }
        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json({ success: true, posts: data || [] });
      }
    } catch (e) {
      console.warn('[API /posts] Erro na busca do Supabase:', e);
    }
  }

  // Retorna lista vazia caso não haja conexão ou não haja posts cadastrados
  return NextResponse.json({
    success: true,
    posts: []
  });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Banco de dados não configurado' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { titulo, slug, resumo, conteudo_html, categoria, imagem_capa_url, gerado_por_ia } = body;

    const { data, error } = await supabase.from('posts').insert([{
      titulo,
      slug,
      resumo: resumo || titulo,
      conteudo_html: conteudo_html || '<p>Conteúdo do post...</p>',
      categoria: categoria || 'geral',
      imagem_capa_url: imagem_capa_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
      visualizacoes: 0,
      gerado_por_ia: !!gerado_por_ia,
      publicado_em: new Date().toISOString(),
      status: 'publicado'
    }]).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID não fornecido' }, { status: 400 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Banco de dados não configurado' }, { status: 500 });
  }

  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
