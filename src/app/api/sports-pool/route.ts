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

const SPORT_BACKDROPS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&q=85',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1280&q=85',
  'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=1280&q=85',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1280&q=85',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1280&q=85',
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1280&q=85',
  'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1280&q=85',
];

async function fetchWithAPIFootball(endpoint: string, apiKey: string) {
  const res = await fetch(`${API_FOOTBALL_BASE}${endpoint}`, {
    headers: {
      'x-apisports-key': apiKey,
    },
    next: { revalidate: 300 } // cache 5 min para tempo real
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
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  try {
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

    results.forEach((result) => {
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

          const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status);
          
          // Cálculo de diferença de dias
          const diffTime = fixtureDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isToday = fixtureDate.toDateString() === today.toDateString();

          const leagueInfo = LEAGUES.find(l => l.id === league?.id);
          const leagueName = leagueInfo?.name || league?.name || 'Futebol';
          const roundName = fixture.league?.round || 'Rodada Principal';
          const subtitle = `${leagueName} - ${roundName}`;

          let type = 'EXPECTATIVA';
          let overlayBadge = '';
          let liveScore: string | null = null;
          let matchTitle = `${homeTeam?.name} x ${awayTeam?.name}`;

          if (isLive) {
            type = 'LIVE';
            overlayBadge = 'AO VIVO';
            const gHome = fixture.goals?.home ?? 0;
            const gAway = fixture.goals?.away ?? 0;
            liveScore = `${gHome} x ${gAway}`;
            matchTitle = `${homeTeam?.name} ${gHome} x ${gAway} ${awayTeam?.name}`;
          } else if (isToday) {
            type = 'URGÊNCIA';
            const timeStr = fixtureDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            overlayBadge = `HOJE às ${timeStr}`;
          } else if (diffDays === 1) {
            type = 'URGÊNCIA';
            overlayBadge = 'É AMANHÃ';
          } else if (diffDays >= 2 && diffDays <= 7) {
            type = 'EXPECTATIVA';
            overlayBadge = `FALTAM ${diffDays} DIAS`;
          } else {
            type = 'AGENDADO';
            overlayBadge = `📅 ${fixtureDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
          }

          const posterUrl = homeTeam?.logo || awayTeam?.logo || null;
          const backdropUrl = SPORT_BACKDROPS[Math.floor(Math.random() * SPORT_BACKDROPS.length)];

          sportsPool.push({
            id: fixtureId + 1000000,
            type,
            title: matchTitle,
            subtitle,
            poster_url: posterUrl,
            background_video_url: `/api/sports-video?id=${fixtureId}&home=${encodeURIComponent(homeTeam?.name || '')}&away=${encodeURIComponent(awayTeam?.name || '')}&league=${encodeURIComponent(leagueName)}`,
            overlay_badge: overlayBadge,
            live_score: liveScore,
            
            // Compatibilidade total com layout do front-end
            poster: posterUrl,
            backdrop: backdropUrl,
            vote: isLive ? 10 : 9.5,
            sport: true,
            league: leagueName,
            leagueFlag: leagueInfo?.flag || '⚽',
            leagueColor: leagueInfo?.color || '#E50914',
            isLive,
            label: overlayBadge,
            homeTeam: { name: homeTeam?.name, logo: homeTeam?.logo },
            awayTeam: { name: awayTeam?.name, logo: awayTeam?.logo },
            leagueLogo: league?.logo,
            country: league?.country,
          });
        });
      }
    });

    // Fallback com marcas reais se pouca atividade em tempo real
    if (sportsPool.length < 3) {
      LEAGUES.forEach((league, idx) => {
        sportsPool.push({
          id: 9000000 + idx,
          type: 'EXPECTATIVA',
          title: league.name,
          subtitle: `${league.name} - Temporada 2026`,
          poster_url: null,
          background_video_url: `/api/sports-video?league=${encodeURIComponent(league.name)}`,
          overlay_badge: `${league.flag} EDICÃO 2026`,
          live_score: null,
          
          poster: null,
          backdrop: SPORT_BACKDROPS[idx % SPORT_BACKDROPS.length],
          vote: 9.5,
          sport: true,
          league: league.name,
          leagueFlag: league.flag,
          leagueColor: league.color,
          isLive: false,
          label: `${league.flag} Edição 2026`,
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
    const fallback = LEAGUES.map((league, idx) => ({
      id: 9000000 + idx,
      type: 'EXPECTATIVA',
      title: league.name,
      subtitle: `${league.name} - Temporada 2026`,
      poster_url: null,
      background_video_url: `/api/sports-video?league=${encodeURIComponent(league.name)}`,
      overlay_badge: `${league.flag} EDICÃO 2026`,
      live_score: null,
      
      poster: null,
      backdrop: SPORT_BACKDROPS[idx % SPORT_BACKDROPS.length],
      vote: 9.5,
      sport: true,
      league: league.name,
      leagueFlag: league.flag,
      leagueColor: league.color,
      isLive: false,
      label: `${league.flag} Edição 2026`,
    }));

    return NextResponse.json({
      success: false,
      error: error.message,
      pool: fallback
    });
  }
}
