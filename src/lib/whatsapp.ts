import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXNhYmlydW5meXdqeGZzdWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDMyMzY0NiwiZXhwIjoyMDk5ODk5NjQ2fQ.pyC3DsxpLQfQbmKEyXb0y6SRUtv34K05ZfpqIcRP6Ps';

export async function fetchActiveCtaOrWhatsapp(category?: string, defaultMsg?: string) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Busca CTAs Ativos
    const { data: ctas } = await supabase
      .from('ctas')
      .select('*')
      .eq('ativo', true)
      .order('criado_em', { ascending: false });

    if (ctas && ctas.length > 0) {
      const match = ctas.find(c => {
        if (!c.categorias) return true;
        if (Array.isArray(c.categorias)) {
          return category ? c.categorias.includes(category) || c.categorias.includes('*') : true;
        }
        return true;
      }) || ctas[0];

      let targetUrl = match.url_destino || '';
      const customMsg = defaultMsg || match.texto_pre || 'Olá! Vim pelo CinePlay e gostaria de saber mais.';

      if (targetUrl) {
        if (!targetUrl.startsWith('http') && !targetUrl.startsWith('https')) {
          const cleanNum = targetUrl.replace(/\D/g, '');
          targetUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(customMsg)}`;
        } else if ((targetUrl.includes('wa.me') || targetUrl.includes('api.whatsapp.com')) && !targetUrl.includes('text=')) {
          targetUrl += `${targetUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(customMsg)}`;
        }
        return {
          url: targetUrl,
          texto_botao: match.texto_botao || 'Falar no WhatsApp Oficial',
          texto_pre: match.texto_pre || 'Atendimento Oficial CinePlay',
          cor_botao: match.cor_botao || '#25D366'
        };
      }
    }

    // 2. Busca Chatbot Config
    const { data: configs } = await supabase
      .from('chatbot_config')
      .select('*')
      .limit(1);

    if (configs && configs.length > 0) {
      const cfg = configs[0];
      const num = (cfg.whatsapp_numero || '5511999999999').replace(/\D/g, '');
      const msg = defaultMsg || cfg.whatsapp_mensagem || 'Olá! Gostaria de obter mais informações sobre os canais.';
      return {
        url: `https://wa.me/${num}?text=${encodeURIComponent(msg)}`,
        texto_botao: 'Falar no WhatsApp Oficial',
        texto_pre: 'Atendimento 24h CinePlay',
        cor_botao: '#25D366'
      };
    }
  } catch (err) {
    console.error('Erro ao resolver CTA ativo no WhatsApp:', err);
  }

  // Fallback padrão seguro
  const cleanNum = '5511999999999';
  const msg = defaultMsg || 'Olá! Gostaria de assistir ao conteúdo em HD.';
  return {
    url: `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`,
    texto_botao: 'Falar no WhatsApp Oficial',
    texto_pre: 'Atendimento Oficial CinePlay',
    cor_botao: '#25D366'
  };
}
