import type { Author } from '../types';

export const DEFAULT_AUTHORS: Author[] = [
  {
    id: 'autor-1',
    nome: 'Carlos Eduardo',
    cargo: 'Editor-Chefe de Esportes & Futebol',
    bio: 'Jornalista esportivo com mais de 10 anos de experiência na cobertura de grandes campeonatos nacionais e internacionais (Brasileirão, Libertadores e Champions League).',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    slug: 'carlos-eduardo',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    especialidades: ['Futebol ao Vivo', 'Brasileirão', 'Libertadores', 'Guia de Canais'],
    ativo: true,
  },
  {
    id: 'autor-2',
    nome: 'Mariana Siqueira',
    cargo: 'Crítica de Cinema & Lançamentos',
    bio: 'Especialista em crítica cinematográfica, coberturas de festivais de cinema e análise de estreias nas plataformas de streaming e salas de cinema.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    slug: 'mariana-siqueira',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    especialidades: ['Filmes', 'Lançamentos', 'Festivais de Cinema'],
    ativo: true,
  },
  {
    id: 'autor-3',
    nome: 'Lucas Mendes',
    cargo: 'Especialista em Séries & Streaming',
    bio: 'Apaixonado por universo de séries de TV, maratonas de streaming e produções originais. Traz análises detalhadas, bastidores e guias de maratona.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    slug: 'lucas-mendes',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    especialidades: ['Séries', 'Streaming', 'Guias de Episódios'],
    ativo: true,
  },
  {
    id: 'autor-4',
    nome: 'Juliana Costa',
    cargo: 'Repórter de Entretenimento & Guia de Canais',
    bio: 'Jornalista de entretenimento com foco em grade de programação ao vivo, realities, eventos pay-per-view e coberturas especiais.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    slug: 'juliana-costa',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    especialidades: ['Canais ao Vivo', 'Programação de TV', 'Eventos Especiais'],
    ativo: true,
  },
  {
    id: 'autor-5',
    nome: 'Gabriel Fonseca',
    cargo: 'Analista de Mídia & SEO Esportivo',
    bio: 'Especializado em guias práticos de tecnologia, transmissão de futebol em Smart TVs e aplicativos de streaming sem travamentos.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    slug: 'gabriel-fonseca',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    especialidades: ['Onde Assistir', 'Guias de Transmissão', 'Smart TV'],
    ativo: true,
  },
];

export async function getAuthors(): Promise<Author[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  try {
    const res = await fetch(`${url}/rest/v1/autores?select=*&ativo=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return DEFAULT_AUTHORS;
    const authors = await res.json();
    if (Array.isArray(authors) && authors.length > 0) {
      return authors;
    }
  } catch (err) {
    console.error('Erro ao buscar autores do Supabase:', err);
  }

  return DEFAULT_AUTHORS;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const authors = await getAuthors();
  const found = authors.find(a => a.slug === slug);
  if (found) return found;

  return DEFAULT_AUTHORS.find(a => a.slug === slug) || null;
}

export function getRandomAuthor(category?: string): Author {
  let filtered = DEFAULT_AUTHORS;
  if (category) {
    const matching = DEFAULT_AUTHORS.filter(a =>
      a.especialidades?.some(e => e.toLowerCase().includes(category.toLowerCase()))
    );
    if (matching.length > 0) filtered = matching;
  }
  const idx = Math.floor(Math.random() * filtered.length);
  return filtered[idx];
}
