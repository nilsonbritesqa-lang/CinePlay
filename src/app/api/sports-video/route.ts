import { NextResponse } from 'next/server';

// Banco de Vídeos Institucionais / YouTube Trailer Keys para Ligas e Times Esportivos
const LEAGUE_VIDEOS: Record<string, string> = {
  'Brasileirão Série A': 'w82bO2sE6Xw',
  'Copa do Brasil': 'yV-W926e8tM',
  'Libertadores': 'l5hM65iB0E0',
  'Sul-Americana': 'l5hM65iB0E0',
  'Champions League': '04854XqcfCY',
  'Europa League': 'mb11BqAkyGg',
  'NBA': '5_x4j7M0lK0',
  'UFC': '44gP8e8tS7M',
};

const TEAM_VIDEOS: Record<string, string> = {
  'Flamengo': '0F57C0XJ1_M',
  'Palmeiras': 'Wv2-x060jZ4',
  'Corinthians': 'vGgU0o_4D_E',
  'São Paulo': '3a-Xo9Q5Lq0',
  'Real Madrid': 'c_n-54Pz9_4',
  'Barcelona': 'g10-82W4hZ8',
  'Santos': 'w82bO2sE6Xw',
  'Grêmio': 'w82bO2sE6Xw',
  'Internacional': 'w82bO2sE6Xw',
  'Atlético Mineiro': 'w82bO2sE6Xw',
  'Botafogo': 'w82bO2sE6Xw',
  'Fluminense': 'w82bO2sE6Xw',
  'Vasco': 'w82bO2sE6Xw',
  'Cruzeiro': 'w82bO2sE6Xw',
};

// Fallback de vídeo de estádio/torcida de alta resolução em loop
const DEFAULT_SPORT_LOOP = '7P_m3YvH7F4';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league') || '';
  const home = searchParams.get('home') || '';
  const away = searchParams.get('away') || '';

  // 1. Tentar encontrar vídeo por time mandante ou visitante
  let videoKey = TEAM_VIDEOS[home] || TEAM_VIDEOS[away];

  // 2. Se não encontrar time específico, tentar por liga/campeonato
  if (!videoKey && league) {
    const matchedKey = Object.keys(LEAGUE_VIDEOS).find(l => 
      league.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(league.toLowerCase())
    );
    if (matchedKey) {
      videoKey = LEAGUE_VIDEOS[matchedKey];
    }
  }

  // 3. Fallback genérico de alta energia (estádio/torcida)
  if (!videoKey) {
    videoKey = DEFAULT_SPORT_LOOP;
  }

  return NextResponse.json({
    success: true,
    videoKey
  });
}
