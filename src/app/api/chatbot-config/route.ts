import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const DEFAULT_CONFIG = {
  id: 1,
  nome: 'CinePlay Atendente',
  saudacao: 'Olá! 👋 Quer saber onde assistir um filme, série, jogo ou programa? Posso te ajudar!',
  whatsapp_numero: '5511999999999',
  whatsapp_mensagem: 'Olá! Vim pelo CinePlay e quero saber mais sobre como assistir conteúdo.',
  cta_texto: 'Falar no WhatsApp',
  instrucoes: [],
  ativo: true,
};

async function readFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chatbot_config?select=*&limit=1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { ...DEFAULT_CONFIG, ...data[0] };
      }
    }
  } catch (err) {
    console.error('Erro ao ler chatbot_config do Supabase:', err);
  }
  return DEFAULT_CONFIG;
}

async function writeToSupabase(config: any) {
  try {
    const cleanConfig = {
      id: config.id || 1,
      nome: config.nome || DEFAULT_CONFIG.nome,
      saudacao: config.saudacao || DEFAULT_CONFIG.saudacao,
      whatsapp_numero: config.whatsapp_numero || DEFAULT_CONFIG.whatsapp_numero,
      whatsapp_mensagem: config.whatsapp_mensagem || DEFAULT_CONFIG.whatsapp_mensagem,
      cta_texto: config.cta_texto || DEFAULT_CONFIG.cta_texto,
      instrucoes: Array.isArray(config.instrucoes) ? config.instrucoes : [],
      ativo: config.ativo !== undefined ? config.ativo : true,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/chatbot_config`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(cleanConfig),
    });

    if (res.ok) {
      const saved = await res.json();
      return Array.isArray(saved) && saved.length > 0 ? saved[0] : cleanConfig;
    }
  } catch (err) {
    console.error('Erro ao salvar chatbot_config no Supabase:', err);
  }
  return config;
}

export async function GET() {
  const config = await readFromSupabase();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readFromSupabase();
    const updated = { ...current, ...body };
    const saved = await writeToSupabase(updated);
    return NextResponse.json({ success: true, config: saved });
  } catch (error: any) {
    console.error('Erro ao processar POST /api/chatbot-config:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao salvar chatbot' }, { status: 500 });
  }
}
