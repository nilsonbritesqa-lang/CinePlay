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

export async function GET() {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, patrocinadores: [], ctas: [] });
  }

  try {
    const { data: patrocinadores, error: pErr } = await supabase
      .from('patrocinadores')
      .select('*')
      .order('criado_em', { ascending: false });

    if (pErr) throw pErr;

    const { data: ctas, error: cErr } = await supabase
      .from('ctas')
      .select('*');

    if (cErr) throw cErr;

    const resultado = (patrocinadores || []).map(p => ({
      ...p,
      ctas: (ctas || []).filter(c => c.patrocinador_id === p.id)
    }));

    return NextResponse.json({
      success: true,
      patrocinadores: resultado,
      ctas: ctas || []
    });
  } catch (error: any) {
    console.error('[API /ctas GET]', error);
    return NextResponse.json({ success: false, error: error.message, patrocinadores: [], ctas: [] });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase não configurado' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { nome, plano, prioridade, texto_pre, texto_botao, url_destino, cor_botao, cor_texto_botao, categorias, tipo_exibicao } = body;

    // Insert Patrocinador
    const { data: pat, error: patErr } = await supabase
      .from('patrocinadores')
      .insert([{
        nome: nome || 'Patrocinador Oficial',
        ativo: true,
        plano: plano || 'premium',
        prioridade: prioridade || 1
      }])
      .select()
      .single();

    if (patErr) throw patErr;

    // Insert CTA
    const { data: cta, error: ctaErr } = await supabase
      .from('ctas')
      .insert([{
        patrocinador_id: pat.id,
        texto_pre: texto_pre || 'Assista agora em alta definição:',
        texto_botao: texto_botao || 'Falar no WhatsApp',
        url_destino: url_destino,
        cor_botao: cor_botao || '#25D366',
        cor_texto_botao: cor_texto_botao || '#ffffff',
        categorias: categorias || ['futebol', 'cinema', 'series', 'canais', 'onde-assistir'],
        tipo_exibicao: tipo_exibicao || 'inline',
        ativo: true,
        cliques_total: 0
      }])
      .select()
      .single();

    if (ctaErr) throw ctaErr;

    return NextResponse.json({
      success: true,
      patrocinador: {
        ...pat,
        ctas: [cta]
      }
    });
  } catch (error: any) {
    console.error('[API /ctas POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase não configurado' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, cta_id, nome, plano, prioridade, texto_pre, texto_botao, url_destino, cor_botao, cor_texto_botao, categorias, tipo_exibicao } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do patrocinador é obrigatório' }, { status: 400 });
    }

    // Update Patrocinador
    const { data: pat, error: patErr } = await supabase
      .from('patrocinadores')
      .update({
        nome: nome || 'Patrocinador Oficial',
        plano: plano || 'premium',
        prioridade: prioridade || 1
      })
      .eq('id', id)
      .select()
      .single();

    if (patErr) throw patErr;

    // Update CTA
    let ctaQuery = supabase.from('ctas').update({
      texto_pre: texto_pre || 'Assista agora em alta definição:',
      texto_botao: texto_botao || 'Falar no WhatsApp',
      url_destino: url_destino,
      cor_botao: cor_botao || '#25D366',
      cor_texto_botao: cor_texto_botao || '#ffffff',
      categorias: categorias || ['futebol', 'cinema', 'series', 'canais', 'onde-assistir'],
      tipo_exibicao: tipo_exibicao || 'inline',
    });

    if (cta_id) {
      ctaQuery = ctaQuery.eq('id', cta_id);
    } else {
      ctaQuery = ctaQuery.eq('patrocinador_id', id);
    }

    const { data: ctaData, error: ctaErr } = await ctaQuery.select();

    if (ctaErr) throw ctaErr;

    return NextResponse.json({
      success: true,
      patrocinador: {
        ...pat,
        ctas: ctaData || []
      }
    });
  } catch (error: any) {
    console.error('[API /ctas PUT]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID do patrocinador não fornecido' }, { status: 400 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase não configurado' }, { status: 500 });
  }

  try {
    // Exclui os CTAs do patrocinador primeiro
    await supabase.from('ctas').delete().eq('patrocinador_id', id);

    // Exclui o patrocinador
    const { error } = await supabase.from('patrocinadores').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /ctas DELETE]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
