/**
 * Serviço de Imagens do CinePlay
 * - TMDB: posters e backdrops oficiais de filmes/séries (100% fiéis)
 * - OMDB: fallback oficial de pôsteres via IMDb
 * - OpenAI DALL-E 3: geração de pôsteres ultra-realistas e exclusivos para partidas de futebol e eventos de TV
 * - API-Football: escudos oficiais de clubes
 * - Unsplash: imagens de fundo curadas para guias de streaming e TV
 */

const TMDB_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API  = 'https://api.themoviedb.org/3';

// =====================
// OPENAI DALL-E 3 (Pôsteres de Jogos e Programas Exclusivos)
// =====================
export const openaiImage = {
  async generateImage(promptTitle: string): Promise<string | null> {
    const apiKey = process.env.OPENAI_IMAGE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Ultra-high-resolution 4k sports match poster banner or TV broadcasting cover graphic for: "${promptTitle}". Dramatic stadium or cinematic lighting, professional 3D sports graphic design, high contrast, vivid colors, landscape orientation.`,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      });

      if (!res.ok) {
        console.warn('[OpenAI DALL-E 3] Não foi possível gerar a imagem:', await res.text().catch(() => ''));
        return null;
      }

      const data = await res.json();
      return data.data?.[0]?.url ?? null;
    } catch (err) {
      console.error('[OpenAI DALL-E 3] Exceção ao gerar imagem:', err);
      return null;
    }
  }
};

// =====================
// TMDB
// =====================
export const tmdb = {
  imageUrl(path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w780'): string {
    return `${TMDB_BASE}/${size}${path}`;
  },

  async searchMovie(query: string): Promise<TMDBSearchResult | null> {
    if (!process.env.TMDB_API_KEY) return null;
    try {
      const res = await fetch(
        `${TMDB_API}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.results?.[0] ?? null;
    } catch {
      return null;
    }
  },

  async searchSeries(query: string): Promise<TMDBSearchResult | null> {
    if (!process.env.TMDB_API_KEY) return null;
    try {
      const res = await fetch(
        `${TMDB_API}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.results?.[0] ?? null;
    } catch {
      return null;
    }
  },

  async upcomingMovies(): Promise<TMDBSearchResult[]> {
    if (!process.env.TMDB_API_KEY) return [];
    try {
      const res = await fetch(
        `${TMDB_API}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&region=BR`,
        { next: { revalidate: 21600 } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.results?.slice(0, 10) ?? [];
    } catch {
      return [];
    }
  },

  async airingToday(): Promise<TMDBSearchResult[]> {
    if (!process.env.TMDB_API_KEY) return [];
    try {
      const res = await fetch(
        `${TMDB_API}/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`,
        { next: { revalidate: 21600 } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.results?.slice(0, 10) ?? [];
    } catch {
      return [];
    }
  },

  async watchProviders(movieId: number, type: 'movie' | 'tv' = 'movie'): Promise<StreamingProvider[]> {
    if (!process.env.TMDB_API_KEY) return [];
    try {
      const res = await fetch(
        `${TMDB_API}/${type}/${movieId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      const br = data.results?.BR;
      if (!br) return [];
      const all = [
        ...(br.flatrate ?? []),
        ...(br.rent ?? []),
        ...(br.buy ?? []),
      ];
      const seen = new Set<number>();
      return all.filter(p => {
        if (seen.has(p.provider_id)) return false;
        seen.add(p.provider_id);
        return true;
      });
    } catch {
      return [];
    }
  },
};

// =====================
// OMDB API
// =====================
export const omdb = {
  async searchByTitle(title: string, year?: string): Promise<OMDBSearchResult | null> {
    const apiKey = process.env.OMDB_API_KEY || 'a48d1250';
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
    if (year) url += `&y=${year}`;
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.Response === 'False') return null;
      return data;
    } catch {
      return null;
    }
  },

  async getById(imdbId: string): Promise<OMDBSearchResult | null> {
    const apiKey = process.env.OMDB_API_KEY || 'a48d1250';
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data.Response === 'False') return null;
      return data;
    } catch {
      return null;
    }
  }
};

// =====================
// API-FOOTBALL
// =====================
export const footballApi = {
  teamLogoUrl(teamId: number): string {
    return `https://media.api-sports.io/football/teams/${teamId}.png`;
  },
};

// =====================
// FOOTBALL-DATA.ORG
// =====================
export const footballData = {
  async upcomingMatches(days = 3): Promise<SimpleMatch[]> {
    const token = process.env.FOOTBALL_DATA_TOKEN || process.env.FOOTBALL_DATA_API_KEY;
    if (!token) return [];
    const from = new Date().toISOString().split('T')[0];
    const to = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}&competitions=BSA,BSB,CL,EL,PL,PD,FL1,BL1,SA`,
        {
          headers: { 'X-Auth-Token': token },
          next: { revalidate: 3600 },
        }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.matches ?? [];
    } catch {
      return [];
    }
  },
};

// =====================
// UNSPLASH
// =====================
export const unsplash = {
  async randomPhoto(query: string): Promise<string | null> {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return null;
    }
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
        {
          headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 3600 },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.urls?.regular ?? null;
    } catch {
      return null;
    }
  },
};

// =====================
// PROTOCOLO DE SELEÇÃO DE IMAGEM CONTEXTUAL MULTICAMADAS
// =====================
export async function getPostImage(params: {
  categoria: string;
  titulo: string;
  tmdbId?: number;
  tmdbType?: 'movie' | 'tv';
  backdropPath?: string;
  posterPath?: string;
}): Promise<string> {
  const { categoria, titulo, backdropPath, posterPath } = params;

  // 1. Filmes/Séries com backdrop ou poster do TMDB já fornecidos
  if (backdropPath) return tmdb.imageUrl(backdropPath, 'original');
  if (posterPath) return tmdb.imageUrl(posterPath, 'w780');

  // 2. Busca ativa em Cinema
  if (categoria === 'cinema') {
    const movie = await tmdb.searchMovie(titulo);
    if (movie?.backdrop_path) return tmdb.imageUrl(movie.backdrop_path, 'original');
    if (movie?.poster_path) return tmdb.imageUrl(movie.poster_path, 'w780');
    
    // Fallback OMDB
    const omdbMovie = await omdb.searchByTitle(titulo);
    if (omdbMovie?.Poster && omdbMovie.Poster !== 'N/A') return omdbMovie.Poster;
    
    // Fallback DALL-E 3 (OpenAI)
    const generated = await openaiImage.generateImage(`Cinema movie poster for ${titulo}`);
    if (generated) return generated;

    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=85';
  }

  // 3. Busca ativa em Séries
  if (categoria === 'series') {
    const series = await tmdb.searchSeries(titulo);
    if (series?.backdrop_path) return tmdb.imageUrl(series.backdrop_path, 'original');
    if (series?.poster_path) return tmdb.imageUrl(series.poster_path, 'w780');
    
    // Fallback OMDB
    const omdbSeries = await omdb.searchByTitle(titulo);
    if (omdbSeries?.Poster && omdbSeries.Poster !== 'N/A') return omdbSeries.Poster;
    
    // Fallback DALL-E 3 (OpenAI)
    const generated = await openaiImage.generateImage(`TV Series poster for ${titulo}`);
    if (generated) return generated;

    return 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=85';
  }

  // 4. Futebol & Esportes (Pôsteres de Jogos Exclusivos com DALL-E 3 ou Estádio HD)
  if (categoria === 'futebol') {
    // Tenta gerar pôster exclusivo da partida via DALL-E 3
    const matchPoster = await openaiImage.generateImage(`Match day poster banner for soccer game ${titulo}`);
    if (matchPoster) return matchPoster;

    const stadiumImages = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=85',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=85',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=85',
    ];
    return stadiumImages[Math.floor(Math.random() * stadiumImages.length)];
  }

  // 5. Canais / Onde Assistir / Realitys / TV
  const tvPoster = await openaiImage.generateImage(`TV show or broadcast banner for ${titulo}`);
  if (tvPoster) return tvPoster;

  const unsplashKeywords: Record<string, string> = {
    canais: 'television broadcasting studio',
    'onde-assistir': 'smart tv home cinema',
  };

  const query = unsplashKeywords[categoria] ?? 'home cinema streaming';
  const unsplashUrl = await unsplash.randomPhoto(query);
  if (unsplashUrl) return unsplashUrl;

  return 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=85';
}

// =====================
// TIPOS LOCAIS
// =====================
export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface SimpleMatch {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; crest?: string };
  awayTeam: { name: string; crest?: string };
  competition: { name: string };
}

export interface OMDBSearchResult {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}
