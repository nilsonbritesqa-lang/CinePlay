import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { cta_id, post_id } = await request.json();
    if (!cta_id) return NextResponse.json({ error: 'cta_id obrigatório' }, { status: 400 });

    // TODO: salvar no Supabase quando configurado
    // const supabase = createServiceClient();
    // await supabase.from('cta_cliques').insert({ cta_id, post_id });

    console.log(`[CTA Click] cta_id=${cta_id} post_id=${post_id}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
