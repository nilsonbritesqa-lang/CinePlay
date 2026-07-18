import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Inicialização segura do cliente Supabase para evitar erros se as variáveis ainda não foram definidas
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mensagem informativa no console sobre o status da conexão
if (!supabase) {
  console.warn(
    '[Supabase Client] Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontradas. O site está rodando em modo mockado de demonstração local.'
  );
}
