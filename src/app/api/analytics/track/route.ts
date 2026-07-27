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

interface TrafficLog {
  id: string;
  ip: string;
  dispositivo: 'Mobile' | 'Desktop' | 'Tablet';
  origem: 'Google' | 'ChatGPT / IA' | 'WhatsApp' | 'Social' | 'Direto';
  slug: string;
  user_agent: string;
  criado_em: string;
}

// Memory log store as reliable fallback for real-time dashboard stats
export const globalTrafficLogs: TrafficLog[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = body.slug || 'home';

    // Rastreia IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') ||
               '189.10.22.41';

    // Rastreia User Agent & Dispositivo
    const ua = request.headers.get('user-agent') || body.user_agent || '';
    let dispositivo: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
    if (/iPad|Android(?!.*Mobile)/i.test(ua)) {
      dispositivo = 'Tablet';
    } else if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      dispositivo = 'Mobile';
    }

    // Rastreia Referrer & Origem
    const referer = request.headers.get('referer') || body.referer || '';
    let origem: 'Google' | 'ChatGPT / IA' | 'WhatsApp' | 'Social' | 'Direto' = 'Direto';

    if (/google\.com|google\.com\.br/i.test(referer)) {
      origem = 'Google';
    } else if (/chatgpt\.com|openai\.com|claude\.ai|perplexity\.ai|bing\.com/i.test(referer)) {
      origem = 'ChatGPT / IA';
    } else if (/whatsapp|wa\.me/i.test(referer) || body.utm_source === 'whatsapp') {
      origem = 'WhatsApp';
    } else if (/instagram\.com|facebook\.com|t\.co|x\.com|tiktok\.com/i.test(referer)) {
      origem = 'Social';
    }

    const newLog: TrafficLog = {
      id: Math.random().toString(36).substring(2, 9),
      ip,
      dispositivo,
      origem,
      slug,
      user_agent: ua.slice(0, 150),
      criado_em: new Date().toISOString()
    };

    // Guarda em memória local
    globalTrafficLogs.unshift(newLog);
    if (globalTrafficLogs.length > 500) globalTrafficLogs.pop();

    // Incrementa visualizações reais no Supabase
    const supabase = getSupabaseService();
    if (supabase && slug !== 'home') {
      const { data: post } = await supabase.from('posts').select('id, visualizacoes').eq('slug', slug).maybeSingle();
      if (post) {
        await supabase.from('posts').update({ visualizacoes: (post.visualizacoes || 0) + 1 }).eq('id', post.id);
      }
    }

    return NextResponse.json({ success: true, log: newLog });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    total_acessos: globalTrafficLogs.length,
    logs: globalTrafficLogs.slice(0, 50)
  });
}
