import { NextResponse } from 'next/server';

const TMDB_API = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

let tmdbCache: { timestamp: number; pool: any[] } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hora de Cache para o catálogo de filmes/séries

function poster(path: string | null) {
  return path ? `${TMDB_IMG}/w500${path}` : null;
}
function backdrop(path: string | null) {
  return path ? `${TMDB_IMG}/w1280${path}` : null;
}

export async function GET() {
  // Retorna do Cache em Memória se ainda for válido
  if (tmdbCache && (Date.now() - tmdbCache.timestamp < CACHE_DURATION_MS)) {
    return NextResponse.json({
      success: true,
      fromCache: true,
      total: tmdbCache.pool.length,
      pool: tmdbCache.pool
    });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: false, pool: [] });
  }

  try {
    const urls = [
      `${TMDB_API}/trending/movie/day?api_key=${apiKey}&language=pt-BR`,
      `${TMDB_API}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`,
      `${TMDB_API}/movie/popular?api_key=${apiKey}&language=pt-BR&page=2`,
      `${TMDB_API}/movie/now_playing?api_key=${apiKey}&language=pt-BR&region=BR`,
      `${TMDB_API}/movie/top_rated?api_key=${apiKey}&language=pt-BR&page=1`,
      `${TMDB_API}/trending/tv/day?api_key=${apiKey}&language=pt-BR`,
      `${TMDB_API}/tv/popular?api_key=${apiKey}&language=pt-BR&page=1`,
      `${TMDB_API}/tv/popular?api_key=${apiKey}&language=pt-BR&page=2`,
    ];

    const responses = await Promise.allSettled(
      urls.map(url =>
        fetch(url, { next: { revalidate: 3600 } })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    );

    const poolMap = new Map<number, any>();

    responses.forEach(r => {
      if (r.status === 'fulfilled' && r.value?.results) {
        r.value.results.forEach((item: any) => {
          if ((item.poster_path || item.backdrop_path) && !poolMap.has(item.id)) {
            poolMap.set(item.id, {
              id: item.id,
              title: item.title || item.name || 'Sem título',
              synopsis: item.overview && item.overview.trim().length > 10 ? item.overview : 'Confira os detalhes completos deste lançamento e saiba exatamente em qual canal ou plataforma de streaming assistir.',
              poster: poster(item.poster_path),
              backdrop: backdrop(item.backdrop_path),
              vote: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5,
              type: item.title ? 'Filme' : 'Série',
              category: item.title ? '🎬 Destaque do Cinema' : '📺 Em Alta no Streaming'
            });
          }
        });
      }
    });

    const pool = Array.from(poolMap.values()).slice(0, 150);

    // Guarda em Cache
    tmdbCache = { timestamp: Date.now(), pool };

    return NextResponse.json({
      success: true,
      fromCache: false,
      total: pool.length,
      pool
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, pool: [] });
  }
}
