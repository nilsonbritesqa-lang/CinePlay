import { NextResponse } from 'next/server';

// ============================================================
// API-FOOTBALL (api-sports.io) — Cobertura Premium de Esportes
// Campeonatos cobertos:
//   - 71  = Brasileirão Série A
//   - 73  = Copa do Brasil
//   - 13  = Libertadores da América
//   - 11  = Sul-Americana
//   - 2   = Champions League
//   - 3   = Europa League
//   - 848 = Conference League
//   - 1   = Copa do Mundo
// ============================================================

const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';

const LEAGUES = [
  { id: 71,  name: 'Brasileirão Série A', flag: '🇧🇷', color: '#009C3B' },
  { id: 73,  name: 'Copa do Brasil',      flag: '🇧🇷', color: '#009C3B' },
  { id: 13,  name: 'Libertadores',        flag: '🏆', color: '#FFD700' },
  { id: 11,  name: 'Sul-Americana',       flag: '🌎', color: '#E67E22' },
  { id: 2,   name: 'Champions League',    flag: '⭐', color: '#1A3A6B' },
  { id: 3,   name: 'Europa League',       flag: '🏅', color: '#F39C12' },
];

// Imagens de escudos de clubes famosos como fallback visual (logos reais via TMDB/Wikipedia)
const TEAM_POSTER_FALLBACKS: Record<string, string> = {
  'Flamengo':      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/180px-Flamengo_braz_logo.svg.png',
  'Palmeiras':     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/180px-Palmeiras_logo.svg.png',
  'Corinthians':   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Corinthians_crest.svg/180px-Corinthians_crest.svg.png',
  'São Paulo':     'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Escudo_do_S%C3%A3o_Paulo_Futebol_Clube.svg/180px-Escudo_do_S%C3%A3o_Paulo_Futebol_Clube.svg.png',
};

// Imagens de backdrop temáticas de alta qualidade para jogos (Unsplash sport)
const SPORT_BACKDROPS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&q=85', // Estadio
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1280&q=85', // Bola/grama
  'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=1280&q=85', // Night game
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1280&q=85', // Trophy
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1280&q=85', // Crowd stadium
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1280&q=85', // Football pitch
  'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1280&q=85', // Champions blue
];

async function fetchWithAPIFootball(endpoint: string, apiKey: string) {
  const res = await fetch(`${API_FOOTBALL_BASE}${endpoint}`, {
    headers: {
      'x-apisports-key': apiKey,
    },
    next: { revalidate: 1800 } // cache 30min
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`);
  return res.json();
}

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'API_FOOTBALL_KEY não configurada',
      pool: []
    });
  }

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  // Próximos 7 dias
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  try {
    // Busca fixtures de hoje e amanhã para os campeonatos principais
    const fixturePromises = [
      fetchWithAPIFootball(`/fixtures?date=${dateStr}&league=71&season=2026`, apiKey),
      fetchWithAPIFootball(`/fixtures?date=${dateStr}&league=13&season=2026`, apiKey),
      fetchWithAPIFootball(`/fixtures?date=${dateStr}&league=2&season=2025`, apiKey),
      fetchWithAPIFootball(`/fixtures?from=${dateStr}&to=${nextWeekStr}&league=71&season=2026`, apiKey),
      fetchWithAPIFootball(`/fixtures?from=${dateStr}&to=${nextWeekStr}&league=13&season=2026`, apiKey),
    ];

    const results = await Promise.allSettled(fixturePromises);

    const sportsPool: any[] = [];
    const seenIds = new Set<number>();

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value?.response) {
        result.value.response.forEach((fixture: any) => {
          const fixtureId = fixture.fixture?.id;
          if (!fixtureId || seenIds.has(fixtureId)) return;
          seenIds.add(fixtureId);

          const homeTeam = fixture.teams?.home;
          const awayTeam = fixture.teams?.away;
          const league = fixture.league;
          const fixtureDate = new Date(fixture.fixture?.date);
          const status = fixture.fixture?.status?.short;

          // Determina se está ao vivo
          const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status);
          const isToday = fixtureDate.toDateString() === today.toDateString();

          // Usa logos dos times como "posters"
          const posterUrl = homeTeam?.logo || null;
          const backdropUrl = SPORT_BACKDROPS[Math.floor(Math.random() * SPORT_BACKDROPS.length)];

          const leagueInfo = LEAGUES.find(l => l.id === league?.id);
          const label = isLive 
            ? '🔴 Ao Vivo'
            : isToday 
            ? `⏰ Hoje ${fixtureDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
            : `📅 ${fixtureDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;

          sportsPool.push({
            id: fixtureId + 1000000, // Offset para não colidir com IDs do TMDB
            title: `${homeTeam?.name} x ${awayTeam?.name}`,
            poster: posterUrl,
            backdrop: backdropUrl,
            vote: isLive ? 10 : 9,
            type: 'Futebol',
            // Metadados esportivos extras
            sport: true,
            league: leagueInfo?.name || league?.name,
            leagueFlag: leagueInfo?.flag || '⚽',
            leagueColor: leagueInfo?.color || '#E50914',
            isLive,
            label,
            homeTeam: { name: homeTeam?.name, logo: homeTeam?.logo },
            awayTeam: { name: awayTeam?.name, logo: awayTeam?.logo },
            leagueLogo: league?.logo,
            country: league?.country,
          });
        });
      }
    });

    // Se não tiver jogos hoje/amanhã, injeta cards de ligas (usando logos das ligas)
    if (sportsPool.length < 3) {
      LEAGUES.forEach((league, idx) => {
        sportsPool.push({
          id: 9000000 + idx,
          title: league.name,
          poster: null,
          backdrop: SPORT_BACKDROPS[idx % SPORT_BACKDROPS.length],
          vote: 9.5,
          type: 'Futebol',
          sport: true,
          league: league.name,
          leagueFlag: league.flag,
          leagueColor: league.color,
          isLive: false,
          label: `${league.flag} Temporada 2026`,
        });
      });
    }

    return NextResponse.json({
      success: true,
      total: sportsPool.length,
      pool: sportsPool
    });

  } catch (error: any) {
    console.error('Erro API-Football:', error.message);
    // Retorna pool de fallback mesmo em erro
    const fallback = LEAGUES.map((league, idx) => ({
      id: 9000000 + idx,
      title: league.name,
      poster: null,
      backdrop: SPORT_BACKDROPS[idx % SPORT_BACKDROPS.length],
      vote: 9.5,
      type: 'Futebol',
      sport: true,
      league: league.name,
      leagueFlag: league.flag,
      leagueColor: league.color,
      isLive: false,
      label: `${league.flag} Acompanhe aqui`,
    }));

    return NextResponse.json({
      success: false,
      error: error.message,
      pool: fallback // Nunca retorna vazio
    });
  }
}
