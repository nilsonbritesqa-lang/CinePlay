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

    // Fallback com partidas reais simuladas de alto engajamento se a API não retornar dados ativos
    if (sportsPool.length < 3) {
      const MOCK_FIXTURES = [
        {
          id: 9900001,
          title: "Flamengo x Palmeiras",
          homeTeam: { name: "Flamengo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/180px-Flamengo_braz_logo.svg.png" },
          awayTeam: { name: "Palmeiras", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/180px-Palmeiras_logo.svg.png" },
          league: "Brasileirão Série A",
          leagueFlag: "🇧🇷",
          leagueColor: "#009C3B",
          isLive: true,
          goalsHome: 2,
          goalsAway: 1,
          round: "Rodada 18",
          dateOffsetDays: 0,
        },
        {
          id: 9900002,
          title: "Real Madrid x Barcelona",
          homeTeam: { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Real_Madrid_CF.svg/160px-Real_Madrid_CF.svg.png" },
          awayTeam: { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/FC_Barcelona_%28crested%29.svg/160px-FC_Barcelona_%28crested%29.svg.png" },
          league: "Champions League",
          leagueFlag: "⭐",
          leagueColor: "#1A3A6B",
          isLive: false,
          goalsHome: null,
          goalsAway: null,
          round: "Semifinal",
          dateOffsetDays: 0, // Hoje
          timeStr: "21:30"
        },
        {
          id: 9900003,
          title: "Corinthians x São Paulo",
          homeTeam: { name: "Corinthians", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Corinthians_crest.svg/180px-Corinthians_crest.svg.png" },
          awayTeam: { name: "São Paulo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Escudo_do_S%C3%A3o_Paulo_Futebol_Clube.svg/180px-Escudo_do_S%C3%A3o_Paulo_Futebol_Clube.svg.png" },
          league: "Copa do Brasil",
          leagueFlag: "🇧🇷",
          leagueColor: "#009C3B",
          isLive: false,
          goalsHome: null,
          goalsAway: null,
          round: "Quartas de Final",
          dateOffsetDays: 1, // Amanhã
        },
        {
          id: 9900004,
          title: "Liverpool x Arsenal",
          homeTeam: { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/0/0c/Liverpool_FC.svg/150px-Liverpool_FC.svg.png" },
          awayTeam: { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/5/53/Arsenal_FC.svg/180px-Arsenal_FC.svg.png" },
          league: "Champions League",
          leagueFlag: "⭐",
          leagueColor: "#1A3A6B",
          isLive: false,
          goalsHome: null,
          goalsAway: null,
          round: "Fase de Grupos",
          dateOffsetDays: 2, // Faltam 2 dias
        }
      ];

      MOCK_FIXTURES.forEach((mock) => {
        const fixtureDate = new Date(today);
        fixtureDate.setDate(fixtureDate.getDate() + mock.dateOffsetDays);

        const leagueName = mock.league;
        const subtitle = `${leagueName} - ${mock.round}`;

        let type = 'EXPECTATIVA';
        let overlayBadge = '';
        let liveScore: string | null = null;
        let matchTitle = mock.title;

        if (mock.isLive) {
          type = 'LIVE';
          overlayBadge = 'AO VIVO';
          liveScore = mock.liveScore || '0 x 0';
          matchTitle = `${mock.homeTeam.name} ${liveScore} ${mock.awayTeam.name}`;
        } else if (mock.dateOffsetDays === 0) {
          type = 'URGÊNCIA';
          overlayBadge = `HOJE às ${mock.timeStr || '20:00'}`;
        } else if (mock.dateOffsetDays === 1) {
          type = 'URGÊNCIA';
          overlayBadge = 'É AMANHÃ';
        } else if (mock.dateOffsetDays >= 2 && mock.dateOffsetDays <= 7) {
          type = 'EXPECTATIVA';
          overlayBadge = `FALTAM ${mock.dateOffsetDays} DIAS`;
        }

        const posterUrl = mock.homeTeam.logo;
        const backdropUrl = SPORT_BACKDROPS[Math.floor(Math.random() * SPORT_BACKDROPS.length)];

        sportsPool.push({
          id: mock.id,
          type,
          title: matchTitle,
          subtitle,
          poster_url: posterUrl,
          background_video_url: `/api/sports-video?id=${mock.id}&home=${encodeURIComponent(mock.homeTeam.name)}&away=${encodeURIComponent(mock.awayTeam.name)}&league=${encodeURIComponent(leagueName)}`,
          overlay_badge: overlayBadge,
          live_score: liveScore,
          
          poster: posterUrl,
          backdrop: backdropUrl,
          vote: mock.isLive ? 10 : 9.5,
          sport: true,
          league: leagueName,
          leagueFlag: mock.leagueFlag,
          leagueColor: mock.leagueColor,
          isLive: mock.isLive,
          label: overlayBadge,
          homeTeam: mock.homeTeam,
          awayTeam: mock.awayTeam,
          leagueLogo: null,
          country: "Brazil"
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
    // Retorna a lista mockada para garantir que nunca quebre
    const fallbackList = [
      {
        id: 9900001,
        type: 'LIVE',
        title: "Flamengo 2 x 1 Palmeiras",
        subtitle: "Brasileirão Série A - Rodada 18",
        poster_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/180px-Flamengo_braz_logo.svg.png",
        background_video_url: "/api/sports-video?id=9900001&home=Flamengo&away=Palmeiras&league=Brasileir%C3%A3o%20S%C3%A9rie%20A",
        overlay_badge: "AO VIVO",
        live_score: "2 x 1",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/180px-Flamengo_braz_logo.svg.png",
        backdrop: SPORT_BACKDROPS[0],
        vote: 10,
        sport: true,
        league: "Brasileirão Série A",
        leagueFlag: "🇧🇷",
        leagueColor: "#009C3B",
        isLive: true,
        label: "AO VIVO",
        homeTeam: { name: "Flamengo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/180px-Flamengo_braz_logo.svg.png" },
        awayTeam: { name: "Palmeiras", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/180px-Palmeiras_logo.svg.png" }
      }
    ];

    return NextResponse.json({
      success: false,
      error: error.message,
      pool: fallbackList
    });
  }
}
