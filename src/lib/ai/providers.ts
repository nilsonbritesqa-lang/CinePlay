/**
 * AI Provider Abstraction Layer
 * Suporta: GROQ, Gemini, Claude (Anthropic), OpenAI/GPT
 * Configurável por agente via painel admin
 */

export type AIProvider = 'groq' | 'gemini' | 'claude' | 'openai';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerateOptions {
  provider: AIProvider;
  model?: string;        // modelo específico, opcional
  temperature?: number;  // 0.0 - 1.0
  maxTokens?: number;
  messages: AIMessage[];
}

export interface AIGenerateResult {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
}

// ===== MODELOS PADRÃO POR PROVIDER =====
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  groq: 'llama-3.3-70b-versatile',
  gemini: 'gemini-1.5-pro',
  claude: 'claude-3-5-haiku-20241022',
  openai: 'gpt-4o-mini',
};

// ===== DISPONIBILIDADE =====
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (process.env.GROQ_API_KEY) providers.push('groq');
  if (process.env.GEMINI_API_KEY) providers.push('gemini');
  if (process.env.ANTHROPIC_API_KEY) providers.push('claude');
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  return providers;
}

export function getDefaultProvider(): AIProvider {
  const available = getAvailableProviders();
  if (available.length === 0) throw new Error('Nenhuma API de IA configurada no .env.local');
  // Ordem de preferência: Gemini > Claude > GPT > GROQ
  const priority: AIProvider[] = ['gemini', 'claude', 'openai', 'groq'];
  return priority.find(p => available.includes(p)) ?? available[0];
}

// ===== GROQ =====
async function generateGroq(opts: AIGenerateOptions): Promise<AIGenerateResult> {
  const model = opts.model ?? DEFAULT_MODELS.groq;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 4096,
    }),
  });
  if (!res.ok) throw new Error(`GROQ error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'groq',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ===== GEMINI =====
async function generateGemini(opts: AIGenerateOptions): Promise<AIGenerateResult> {
  const model = opts.model ?? DEFAULT_MODELS.gemini;
  // Concatena mensagens: system vai como primeiro user turn
  const systemMsg = opts.messages.find(m => m.role === 'system');
  const userMsgs = opts.messages.filter(m => m.role !== 'system');

  const contents = userMsgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }
  body.generationConfig = {
    temperature: opts.temperature ?? 0.7,
    maxOutputTokens: opts.maxTokens ?? 4096,
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    provider: 'gemini',
    model,
  };
}

// ===== CLAUDE (Anthropic) =====
async function generateClaude(opts: AIGenerateOptions): Promise<AIGenerateResult> {
  const model = opts.model ?? DEFAULT_MODELS.claude;
  const systemMsg = opts.messages.find(m => m.role === 'system');
  const userMsgs = opts.messages.filter(m => m.role !== 'system');

  const body: Record<string, unknown> = {
    model,
    max_tokens: opts.maxTokens ?? 4096,
    messages: userMsgs.map(m => ({ role: m.role, content: m.content })),
  };
  if (systemMsg) body.system = systemMsg.content;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Claude error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    content: data.content[0].text,
    provider: 'claude',
    model,
    tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
  };
}

// ===== OPENAI / GPT =====
async function generateOpenAI(opts: AIGenerateOptions): Promise<AIGenerateResult> {
  const model = opts.model ?? DEFAULT_MODELS.openai;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 4096,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'openai',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ===== ENTRYPOINT PRINCIPAL =====
export async function generateAI(opts: AIGenerateOptions): Promise<AIGenerateResult> {
  switch (opts.provider) {
    case 'groq':   return generateGroq(opts);
    case 'gemini': return generateGemini(opts);
    case 'claude': return generateClaude(opts);
    case 'openai': return generateOpenAI(opts);
    default:       throw new Error(`Provider desconhecido: ${opts.provider}`);
  }
}

/** Tenta o provider configurado, com fallback automático */
export async function generateAIWithFallback(
  opts: Omit<AIGenerateOptions, 'provider'>,
  preferred?: AIProvider
): Promise<AIGenerateResult> {
  const available = getAvailableProviders();
  const order = preferred
    ? [preferred, ...available.filter(p => p !== preferred)]
    : available;

  let lastError: Error | null = null;
  for (const provider of order) {
    try {
      return await generateAI({ ...opts, provider });
    } catch (err) {
      lastError = err as Error;
      console.warn(`[AI] Falha no provider ${provider}:`, lastError.message);
    }
  }
  throw lastError ?? new Error('Todos os providers de IA falharam');
}
