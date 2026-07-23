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
  { id: 71,  name: 'Brasileirão Série A', flag: '🇧🇷', color: '#009C3B', logo: 'https://media.api-sports.io/football/leagues/71.png' },
  { id: 73,  name: 'Copa do Brasil',      flag: '🇧🇷', color: '#009C3B', logo: 'https://media.api-sports.io/football/leagues/73.png' },
  { id: 13,  name: 'Libertadores',        flag: '🏆', color: '#FFD700', logo: 'https://media.api-sports.io/football/leagues/13.png' },
  { id: 11,  name: 'Sul-Americana',       flag: '🌎', color: '#E67E22', logo: 'https://media.api-sports.io/football/leagues/11.png' },
  { id: 2,   name: 'Champions League',    flag: '⭐', color: '#1A3A6B', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 3,   name: 'Europa League',       flag: '🏅', color: '#F39C12', logo: 'https://media.api-sports.io/football/leagues/3.png' },
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
    next: { revalidate: 300 } // cache 5 min
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`);
  return res.json();
}

export async function GET(request: Request) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const { searchParams } = new URL(request.url);
  const requestedDate = searchParams.get('date');

  // Data atual exata no Fuso Horário de Brasília (America/Sao_Paulo)
  const now = new Date();
  const brDateStr = requestedDate || now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }); // Formato ISO YYYY-MM-DD
  
  const tomorrowObj = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const brTomorrowStr = tomorrowObj.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

  const sportsPool: any[] = [];

  if (apiKey && apiKey !== 'SUA_CHAVE_AQUI') {
    try {
      const fixturePromises = [
        fetchWithAPIFootball(`/fixtures?live=all&timezone=America/Sao_Paulo`, apiKey),
        fetchWithAPIFootball(`/fixtures?date=${brDateStr}&timezone=America/Sao_Paulo`, apiKey),
      ];

      const results = await Promise.allSettled(fixturePromises);
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
            const status = fixture.fixture?.status?.short;

            const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'IN_PLAY'].includes(status);

            const fixtureDate = new Date(fixture.fixture?.date);
            const fixDateStr = fixtureDate.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
            const fixTimeStr = fixtureDate.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

            const isToday = (fixDateStr === brDateStr);
            const isTomorrow = (fixDateStr === brTomorrowStr);

            const leagueInfo = LEAGUES.find(l => l.id === league?.id);
            const leagueName = leagueInfo?.name || league?.name || 'Futebol';
            const leagueLogo = leagueInfo?.logo || league?.logo || 'https://media.api-sports.io/football/leagues/71.png';
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
              overlayBadge = `HOJE às ${fixTimeStr}`;
            } else if (isTomorrow) {
              type = 'URGÊNCIA';
              overlayBadge = `AMANHÃ às ${fixTimeStr}`;
            } else {
              type = 'EXPECTATIVA';
              overlayBadge = `📅 ${fixtureDate.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'short' })} às ${fixTimeStr}`;
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
              
              poster: posterUrl,
              backdrop: backdropUrl,
              vote: isLive ? 10 : 9.5,
              sport: true,
              league: leagueName,
              leagueFlag: leagueInfo?.flag || '⚽',
              leagueColor: leagueInfo?.color || '#E50914',
              leagueLogo,
              isLive,
              label: overlayBadge,
              homeTeam: { name: homeTeam?.name, logo: homeTeam?.logo },
              awayTeam: { name: awayTeam?.name, logo: awayTeam?.logo },
              country: league?.country,
              dateStr: fixDateStr
            });
          });
        }
      });
    } catch (e) {
      console.warn("Erro ao buscar da API Football. Usando fallback de mock...", e);
    }
  }

  // Partidas de mock com datas dinâmicas se a API externa estiver vazia
  if (sportsPool.length < 3) {
    const MOCK_FIXTURES = [
      {
        id: 9900001,
        title: "Corinthians 2 x 1 Palmeiras",
        homeTeam: { name: "Corinthians", logo: "https://media.api-sports.io/football/teams/131.png" },
        awayTeam: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" },
        league: "Brasileirão Série A",
        leagueFlag: "🇧🇷",
        leagueColor: "#009C3B",
        leagueLogo: "https://media.api-sports.io/football/leagues/71.png",
        isLive: true,
        liveScore: "2 x 1",
        overlayBadge: "AO VIVO",
        round: "Rodada 18",
        type: "LIVE"
      },
      {
        id: 9900002,
        title: "Flamengo x São Paulo",
        homeTeam: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" },
        awayTeam: { name: "São Paulo", logo: "https://media.api-sports.io/football/teams/126.png" },
        league: "Copa do Brasil",
        leagueFlag: "🇧🇷",
        leagueColor: "#009C3B",
        leagueLogo: "https://media.api-sports.io/football/leagues/73.png",
        isLive: false,
        liveScore: null,
        overlayBadge: "HOJE às 21:30",
        round: "Quartas de Final",
        type: "URGÊNCIA"
      },
      {
        id: 9900003,
        title: "Real Madrid x Barcelona",
        homeTeam: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
        awayTeam: { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
        league: "Champions League",
        leagueFlag: "⭐",
        leagueColor: "#1A3A6B",
        leagueLogo: "https://media.api-sports.io/football/leagues/2.png",
        isLive: false,
        liveScore: null,
        overlayBadge: "HOJE às 19:00",
        round: "Semifinal",
        type: "URGÊNCIA"
      },
      {
        id: 9900004,
        title: "Liverpool x Arsenal",
        homeTeam: { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
        awayTeam: { name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
        league: "Champions League",
        leagueFlag: "⭐",
        leagueColor: "#1A3A6B",
        leagueLogo: "https://media.api-sports.io/football/leagues/2.png",
        isLive: false,
        liveScore: null,
        overlayBadge: "AMANHÃ às 16:00",
        round: "Fase de Grupos",
        type: "URGÊNCIA"
      },
      {
        id: 9900005,
        title: "Boca Juniors x River Plate",
        homeTeam: { name: "Boca Juniors", logo: "https://media.api-sports.io/football/teams/451.png" },
        awayTeam: { name: "River Plate", logo: "https://media.api-sports.io/football/teams/435.png" },
        league: "Libertadores",
        leagueFlag: "🏆",
        leagueColor: "#FFD700",
        leagueLogo: "https://media.api-sports.io/football/leagues/13.png",
        isLive: false,
        liveScore: null,
        overlayBadge: "AMANHÃ às 21:30",
        round: "Fase de Grupos",
        type: "EXPECTATIVA"
      }
    ];

    MOCK_FIXTURES.forEach((mock, idx) => {
      const leagueName = mock.league;
      const subtitle = `${leagueName} - ${mock.round}`;

      const posterUrl = mock.homeTeam.logo;
      const backdropUrl = SPORT_BACKDROPS[idx % SPORT_BACKDROPS.length];

      sportsPool.push({
        id: mock.id,
        type: mock.type,
        title: mock.title,
        subtitle,
        poster_url: posterUrl,
        background_video_url: `/api/sports-video?id=${mock.id}&home=${encodeURIComponent(mock.homeTeam.name)}&away=${encodeURIComponent(mock.awayTeam.name)}&league=${encodeURIComponent(leagueName)}`,
        overlay_badge: mock.overlayBadge,
        live_score: mock.liveScore,
        
        poster: posterUrl,
        backdrop: backdropUrl,
        vote: mock.isLive ? 10 : 9.5,
        sport: true,
        league: leagueName,
        leagueFlag: mock.leagueFlag,
        leagueColor: mock.leagueColor,
        leagueLogo: mock.leagueLogo,
        isLive: mock.isLive,
        label: mock.overlayBadge,
        homeTeam: mock.homeTeam,
        awayTeam: mock.awayTeam,
        country: "Brazil"
      });
    });
  }

  return NextResponse.json({
    success: true,
    total: sportsPool.length,
    pool: sportsPool
  });
}
