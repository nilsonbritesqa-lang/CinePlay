import { NextRequest, NextResponse } from 'next/server';

// Configuração padrão do Chatbot — sobrescrita pelo admin via /api/chatbot-config
const DEFAULT_CONFIG = {
  nome: 'CinePlay Atendente',
  saudacao: 'Olá! Sou o assistente do CinePlay 👋 Quer saber onde assistir um filme, série, jogo de futebol ou programa? Posso te ajudar!',
  whatsapp_numero: '5511999999999',
  whatsapp_mensagem: 'Olá! Vim pelo CinePlay e quero saber mais sobre como assistir conteúdo.',
  instrucoes: [
    'Você é um assistente de vendas do CinePlay, um guia de entretenimento brasileiro.',
    'O CinePlay informa onde assistir filmes, séries, futebol ao vivo (Brasileirão, Libertadores, Champions League, Sul-Americana), programas de TV como BBB, reality shows e muito mais.',
    'Seu único objetivo é converter o usuário para falar com o time no WhatsApp.',
    'Se o usuário perguntar onde assistir qualquer conteúdo, dê uma resposta breve e direcione para o WhatsApp para saber mais.',
    'Nunca responda perguntas fora do contexto de entretenimento, streaming e serviços do CinePlay.',
    'Seja simpático, direto e conciso. Máximo de 2 frases por resposta.',
    'Sempre termine com um CTA para o WhatsApp.',
  ],
  cta_texto: 'Falar no WhatsApp',
  ativo: true,
};

// Carrega config do arquivo de config local (pode ser expandido para Supabase)
async function loadChatbotConfig() {
  try {
    const configPath = process.cwd() + '/chatbot-config.json';
    const fs = await import('fs/promises');
    const raw = await fs.readFile(configPath, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage } = await req.json();

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    const config = await loadChatbotConfig();
    
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Monta o system prompt com as instruções configuradas pelo admin
    const systemPrompt = `${config.instrucoes.join('\n')}

REGRA CRÍTICA: Se o usuário perguntar algo totalmente fora de entretenimento (ex: política, saúde, receitas, código), responda apenas: "Posso te ajudar apenas com dúvidas sobre onde assistir filmes, séries, futebol e programas! Fale com nossa equipe no WhatsApp." e finalize.

Número de WhatsApp para direcionar: ${config.whatsapp_numero}
Mensagem pré-preenchida: "${config.whatsapp_mensagem}"`;

    // Tenta GROQ primeiro (mais rápido), depois Gemini como fallback
    if (groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...(messages || []).slice(-6), // mantém apenas últimas 6 mensagens no contexto
            { role: 'user', content: userMessage }
          ],
          max_tokens: 200,
          temperature: 0.4,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '';
        
        return NextResponse.json({
          reply,
          whatsapp: {
            numero: config.whatsapp_numero,
            mensagem: config.whatsapp_mensagem,
            cta: config.cta_texto,
            url: `https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(config.whatsapp_mensagem)}`
          }
        });
      }
    }

    // Fallback: Gemini
    if (geminiKey) {
      const fullPrompt = `${systemPrompt}\n\nUsuário: ${userMessage}\n\nResposta:`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.4 }
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({
          reply,
          whatsapp: {
            numero: config.whatsapp_numero,
            mensagem: config.whatsapp_mensagem,
            cta: config.cta_texto,
            url: `https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(config.whatsapp_mensagem)}`
          }
        });
      }
    }

    // Fallback estático se nenhuma IA estiver disponível
    return NextResponse.json({
      reply: `Oi! Para saber onde assistir esse conteúdo, fale diretamente com nossa equipe pelo WhatsApp! Temos todas as informações de streaming, futebol ao vivo e muito mais.`,
      whatsapp: {
        numero: config.whatsapp_numero,
        mensagem: config.whatsapp_mensagem,
        cta: config.cta_texto,
        url: `https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(config.whatsapp_mensagem)}`
      }
    });

  } catch (error: any) {
    console.error('Erro no chatbot:', error.message);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
