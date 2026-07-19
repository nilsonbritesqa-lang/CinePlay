# CinePlay — Plataforma Premium de Entretenimento & Guia de Transmissão

O **CinePlay** é um guia inteligente de alta conversão focado em ajudar usuários a descobrirem onde assistir seus conteúdos de entretenimento favoritos (filmes, séries, reality shows como o BBB e canais) e eventos esportivos ao vivo (Brasileirão Série A, Champions League, Libertadores e Copa do Brasil), direcionando-os de forma inteligente para conversão direta no WhatsApp.

---

## 🚀 Principais Funcionalidades

1. **Living Collage Hero Section:**
   - Uma composição viva e orgânica no topo da página construída via colagem 3D dinâmica.
   - Integração em tempo real com dados da **API TMDB** (filmes/séries em alta) e da **API-Football** (jogos de futebol ao vivo ou futuros).
   - Efeito parallax interativo baseado no movimento do mouse, glow atmosférico e vinheta suave para criar profundidade e estética cinematográfica.

2. **Chatbot de Conversão Proativo (IA):**
   - Atendimento automático com inteligência artificial contextualizada usando **Gemini 1.5 Flash** ou **Groq (Llama 3)**.
   - Focado exclusivamente no ecossistema CinePlay: se o usuário perguntar algo fora do contexto, o bot redireciona educadamente e envia o link direto para o WhatsApp de vendas.
   - Painel administrativo exclusivo para configurar instruções (memória do bot), número do WhatsApp, mensagens pré-preenchidas e textos de CTA.

3. **Ticker de Canais de Transmissão:**
   - Barra horizontal dinâmica exibindo as principais categorias e modalidades de transmissão de mídia (TV Aberta, TV Fechada, PPV, Streaming, etc.).

4. **Painel de Controle de CTAs e Links:**
   - Controle dinâmico para gerenciar patrocinadores, anúncios e links de redirecionamento de alta visibilidade.

---

## 🛠️ Configuração e Instalação

### 1. Requisitos
- Node.js (v20 ou superior recomendado)
- Conta no Supabase (Banco de Dados Postgres + RLS)
- Chaves de API das plataformas:
  - **TMDB** (Guia de Filmes/Séries)
  - **API-Football / API-Sports** (Jogos de Futebol em tempo real)
  - **Gemini / Groq / OpenAI** (Para a IA do Chatbot)

### 2. Instalação
Clone o projeto e instale as dependências:
```bash
npm install
```

### 3. Variáveis de Ambiente (`.env.local`)
Copie o arquivo de exemplo ou crie o `.env.local` na raiz com as chaves apropriadas:
```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_privada_aqui
DATABASE_URL=postgresql://postgres:sua_senha_do_banco@db.seu-projeto.supabase.co:5432/postgres

# CHAVES DE IA
GEMINI_API_KEY=sua_chave_gemini_aqui
GROQ_API_KEY=sua_chave_groq_aqui

# TMDB & DADOS DE MÍDIA
TMDB_API_KEY=sua_chave_tmdb_api_aqui
TMDB_READ_TOKEN=seu_token_leitura_tmdb_aqui

# API-FOOTBALL (Cobertura de jogos ao vivo)
API_FOOTBALL_KEY=sua_chave_api_football_aqui

# ADMIN SECRET
ADMIN_SECRET=sua_chave_secreta_admin_aqui
```

---

## 🗄️ Integração com Supabase (Banco de Dados)

Os novos projetos do Supabase vêm configurados para acesso exclusivo via **IPv6**. Se o seu provedor de internet local não tem suporte total a IPv6, o resolvedor do Windows pode falhar ao conectar via terminal local no host do banco de dados direta.

Para garantir que o banco de dados funcione perfeitamente com todas as tabelas, triggers e dados iniciais de agentes de IA, siga este passo a passo simplificado:

### Importação de Schema via SQL Editor (Recomendado)

1. Faça login na [Dashboard do Supabase](https://supabase.com/dashboard).
2. Selecione o projeto **CinePlay-Blog** (`hjmsabirunfywjxfsuly`).
3. No menu lateral esquerdo, clique em **SQL Editor** (ícone de terminal com `SQL`).
4. Clique em **New Query** (Nova Consulta).
5. Abra o arquivo [supabase/schema.sql](file:///G:/Desenvolvimento%20Clientes/CinePlay/cineplay/supabase/schema.sql) no seu editor de código local e copie **todo** o seu conteúdo.
6. Cole o código copiado no editor de SQL do Supabase.
7. Clique em **Run** (Executar) no canto inferior direito.
8. Pronto! Todas as tabelas, índices, triggers e funções foram criados no seu banco remoto.

---

## 🖥️ Execução Local

Para iniciar o servidor de desenvolvimento local:
```bash
npm run dev
```
O site estará disponível em [http://localhost:3000](http://localhost:3000).

- **Página Principal (Landing Page):** `http://localhost:3000/`
- **Painel Administrativo do Chatbot:** `http://localhost:3000/admin/chatbot` (use as configurações deste painel para calibrar o número do WhatsApp de vendas e a memória do assistente de IA).

---

## 📦 Build e Deploy

Para validar e gerar a build de produção:
```bash
npm run build
```

O projeto está pronto para deploy automático em plataformas como a **Vercel** ou **Netlify**, conectando o seu repositório Git. Certifique-se de configurar as mesmas variáveis de ambiente na aba de configurações do seu deploy na Vercel.
