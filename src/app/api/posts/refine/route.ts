import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAIWithFallback } from '@/lib/ai/providers';

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
    const body = await request.json();
    const { id, prompt_correcao } = body;

    if (!id || !prompt_correcao) {
      return NextResponse.json({ success: false, error: 'ID do post e instrução de correção são obrigatórios' }, { status: 400 });
    }

    // Busca o post existente
    const { data: post, error: fetchErr } = await supabase.from('posts').select('*').eq('id', id).single();
    if (fetchErr || !post) {
      return NextResponse.json({ success: false, error: 'Post não encontrado' }, { status: 404 });
    }

    // Monta o prompt para a IA aperfeiçoar o post
    const promptSistema = `Você é um editor sênior de conteúdo digital e especialista em SEO e conversão.
Sua missão é REVISAR E CORRIGIR o post fornecido com base nas orientações de ajuste do usuário.

REGRAS INVIOLÁVEIS:
1. NUNCA mencione plataformas concorrentes de streaming (como Netflix, Premiere, Amazon Prime Video, Disney+, Globoplay, etc.).
2. Mantenha ou reforce a chamada persuasiva para o leitor consultar o atendimento no WhatsApp para tirar dúvidas e assinar o CinePlay.
3. Mantenha a formatação HTML com cabeçalhos <h2>, <h3>, tabelas <table> e <blockquote> se apropriado.
4. Aplique a correção solicitada pelo usuário com extrema precisão.`;

    const promptUsuario = `
ORIENTAÇÃO DE CORREÇÃO ENVIADA PELO USUÁRIO:
"${prompt_correcao}"

DADOS ATUAIS DO POST:
- Título Atual: "${post.titulo}"
- Resumo Atual: "${post.resumo}"
- Conteúdo HTML Atual:
${post.conteudo_html}

INSTRUÇÃO:
Gere a versão final corrigida do post em formato JSON estrito:
{
  "titulo": "Título corrigido (máx 70 chars)",
  "resumo": "Meta resumo persuasivo (150-160 chars)",
  "conteudo_html": "HTML completo corrigido e revisado com H2, H3, parágrafos e aviso de WhatsApp"
}

Retorne APENAS o JSON válido.
    `.trim();

    const aiRes = await generateAIWithFallback({
      temperature: 0.5,
      maxTokens: 3200,
      messages: [
        { role: 'system', content: promptSistema },
        { role: 'user', content: promptUsuario }
      ]
    });

    let parsed: any = {};
    try {
      let clean = aiRes.content.trim();
      const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) clean = match[1].trim();
      clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      parsed = JSON.parse(clean);
    } catch (e) {
      throw new Error(`A IA retornou um formato inválido ao corrigir o post. Resposta original: ${aiRes.content.slice(0, 150)}`);
    }

    const novoTitulo = parsed.titulo || post.titulo;
    const novoResumo = parsed.resumo || post.resumo;
    const novoHtml = parsed.conteudo_html || post.conteudo_html;

    // Atualiza no Supabase
    const { data: postAtualizado, error: updateErr } = await supabase
      .from('posts')
      .update({
        titulo: novoTitulo,
        resumo: novoResumo,
        conteudo_html: novoHtml,
        gerado_por_ia: true,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, post: postAtualizado });
  } catch (err: any) {
    console.error('[API /posts/refine] Erro:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
