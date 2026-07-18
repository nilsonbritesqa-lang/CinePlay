import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'chatbot-config.json');

const DEFAULT_CONFIG = {
  nome: 'CinePlay Atendente',
  saudacao: 'Olá! 👋 Quer saber onde assistir um filme, série, jogo ou programa? Posso te ajudar!',
  whatsapp_numero: '5511999999999',
  whatsapp_mensagem: 'Olá! Vim pelo CinePlay e quero saber mais sobre como assistir conteúdo.',
  cta_texto: 'Falar no WhatsApp',
  instrucoes: [] as string[],
  ativo: true,
};

async function readConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

async function writeConfig(config: typeof DEFAULT_CONFIG) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export async function GET() {
  const config = await readConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readConfig();
    const updated = { ...current, ...body };
    await writeConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
