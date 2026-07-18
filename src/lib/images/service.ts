/**
 * Serviço de Imagens
 * - TMDB: posters e backdrops de filmes/séries
 * - API-Football: escudos de times
 * - Unsplash: imagens genéricas por tema
 */

const TMDB_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API  = 'https://api.themoviedb.org/3';

// =====================
// TMDB
// =====================
export const tmdb = {
  /** URL de imagem TMDB */
  imageUrl(path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w780'): string {
    return `${TMDB_BASE}/${size}${path}`;
  },

  /** Busca filme por título */
  async searchMovie(query: string): Promise<TMDBSearchResult | null> {
    if (!process.env.TMDB_API_KEY) return null;
    const res = await fetch(
      `${TMDB_API}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] ?? null;
  },

  /** Busca série por título */
  async searchSeries(query: string): Promise<TMDBSearchResult | null> {
    if (!process.env.TMDB_API_KEY) return null;
    const res = await fetch(
      `${TMDB_API}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] ?? null;
  },

  /** Filmes em estreia na semana */
  async upcomingMovies(): Promise<TMDBSearchResult[]> {
    if (!process.env.TMDB_API_KEY) return [];
    const res = await fetch(
      `${TMDB_API}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&region=BR`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results?.slice(0, 10) ?? [];
  },

  /** Séries populares / em exibição */
  async airingToday(): Promise<TMDBSearchResult[]> {
    if (!process.env.TMDB_API_KEY) return [];
    const res = await fetch(
      `${TMDB_API}/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results?.slice(0, 10) ?? [];
  },

  /** Providers de streaming para um filme (onde assistir) */
  async watchProviders(movieId: number, type: 'movie' | 'tv' = 'movie'): Promise<StreamingProvider[]> {
    if (!process.env.TMDB_API_KEY) return [];
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
    // Remove duplicatas
    const seen = new Set<number>();
    return all.filter(p => {
      if (seen.has(p.provider_id)) return false;
      seen.add(p.provider_id);
      return true;
    });
  },
};

// =====================
// OMDB API
// =====================
export const omdb = {
  /** Busca dados adicionais de filme ou série pelo título no OMDb */
  async searchByTitle(title: string, year?: string): Promise<OMDBSearchResult | null> {
    const apiKey = process.env.OMDB_API_KEY || 'a48d1250';
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
    if (year) {
      url += `&y=${year}`;
    }
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.Response === 'False') return null;
      return data;
    } catch (e) {
      console.error('Erro ao buscar dados na API do OMDb:', e);
      return null;
    }
  },

  /** Busca dados de filme ou série pelo ID do IMDb no OMDb */
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
    } catch (e) {
      console.error('Erro ao buscar ID na API do OMDb:', e);
      return null;
    }
  }
};

// =====================
// API-FOOTBALL (escudos de times)
// =====================
export const footballApi = {
  /** Próximos jogos do dia */
  async matchesToday(): Promise<FootballMatch[]> {
    if (!process.env.API_FOOTBALL_KEY) return [];
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&timezone=America/Sao_Paulo`,
      {
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.response ?? [];
  },

  /** Próximos jogos dos próximos N dias (para posts antecipados) */
  async upcomingMatches(days = 3): Promise<FootballMatch[]> {
    if (!process.env.API_FOOTBALL_KEY) return [];
    const matches: FootballMatch[] = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures?date=${dateStr}&timezone=America/Sao_Paulo&league=71,72,73,2,3,4`, // BR + Europeus
          {
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
            },
            next: { revalidate: 7200 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          matches.push(...(data.response ?? []));
        }
      } catch {}
    }
    return matches;
  },

  /** URL do escudo de um time */
  teamLogoUrl(teamId: number): string {
    return `https://media.api-sports.io/football/teams/${teamId}.png`;
  },
};

// =====================
// FOOTBALL-DATA.ORG (gratuito, sem escudos)
// =====================
export const footballData = {
  async upcomingMatches(days = 3): Promise<SimpleMatch[]> {
    if (!process.env.FOOTBALL_DATA_API_KEY) return [];
    const from = new Date().toISOString().split('T')[0];
    const to = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    const res = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}&competitions=BSA,BSB,CL,EL,PL,PD,FL1,BL1,SA`,
      {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.matches ?? [];
  },
};

// =====================
// UNSPLASH (imagens genéricas)
// =====================
export const unsplash = {
  async randomPhoto(query: string): Promise<string | null> {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      // Fallback: URL direta sem API key
      return `https://source.unsplash.com/1280x720/?${encodeURIComponent(query)}`;
    }
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
  },
};

// =====================
// SELETOR DE IMAGEM POR CATEGORIA
// =====================
export async function getPostImage(params: {
  categoria: string;
  titulo: string;
  tmdbId?: number;
  tmdbType?: 'movie' | 'tv';
  backdropPath?: string;
  posterPath?: string;
}): Promise<string> {
  const { categoria, titulo, tmdbId, tmdbType, backdropPath, posterPath } = params;

  // Prioridade 1: backdrop do TMDB (ideal para filmes/séries — 1280px)
  if (backdropPath) return tmdb.imageUrl(backdropPath, 'original');

  // Prioridade 2: poster do TMDB
  if (posterPath) return tmdb.imageUrl(posterPath, 'w780');

  // Prioridade 3: busca automática no TMDB
  if (categoria === 'cinema') {
    const movie = await tmdb.searchMovie(titulo);
    if (movie?.backdrop_path) return tmdb.imageUrl(movie.backdrop_path, 'original');
    if (movie?.poster_path) return tmdb.imageUrl(movie.poster_path, 'w780');
  }

  if (categoria === 'series') {
    const series = await tmdb.searchSeries(titulo);
    if (series?.backdrop_path) return tmdb.imageUrl(series.backdrop_path, 'original');
    if (series?.poster_path) return tmdb.imageUrl(series.poster_path, 'w780');
  }

  // Prioridade 4: Unsplash por tema
  const themeMap: Record<string, string> = {
    futebol: 'football stadium',
    cinema: 'cinema movie',
    series: 'tv series binge',
    canais: 'television streaming',
    'onde-assistir': 'streaming service',
  };

  const query = themeMap[categoria] ?? titulo;
  const unsplashUrl = await unsplash.randomPhoto(query);
  if (unsplashUrl) return unsplashUrl;

  // Fallback final
  return `/og-default.jpg`;
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

export interface FootballMatch {
  fixture: {
    id: number;
    date: string;
    status: { short: string; long: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
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
