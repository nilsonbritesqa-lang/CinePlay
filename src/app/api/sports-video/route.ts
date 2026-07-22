import { NextResponse } from 'next/server';

// Banco de Vídeos Promocionais 100% autorizados para embed global (EA Sports FC / UCL Anthems)
// Evita o erro "Este vídeo não está disponível" devido a direitos de transmissão
const LEAGUE_VIDEOS: Record<string, string> = {
  'Brasileirão Série A': 'Xh8K0tL75L8', // EA Sports FC 24 Gameplay
  'Copa do Brasil': 'zM21c6F5_sM',      // FIFA 23 Gameplay
  'Libertadores': 'mb11BqAkyGg',        // UCL / Copa Hype
  'Sul-Americana': 'mb11BqAkyGg',
  'Champions League': 'mb11BqAkyGg',    // UCL Anthem
  'Europa League': 'mb11BqAkyGg',
  'NBA': '5_x4j7M0lK0',                 // NBA 2K Trailer
  'UFC': '44gP8e8tS7M',                 // UFC EA Sports Trailer
};

// Fallback de vídeo de estádio/torcida de alta resolução em loop (autorizado para embed)
const DEFAULT_SPORT_LOOP = '7P_m3YvH7F4';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league') || '';

  let videoKey = '';

  // Procura vídeo correspondente à liga
  if (league) {
    const matchedKey = Object.keys(LEAGUE_VIDEOS).find(l => 
      league.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(league.toLowerCase())
    );
    if (matchedKey) {
      videoKey = LEAGUE_VIDEOS[matchedKey];
    }
  }

  // Se não encontrar, ou se for time específico (que geralmente tem vídeos bloqueados),
  // enviamos os trailers de gameplay cinematográficos de alta energia (FC 24/FC 25)
  if (!videoKey) {
    videoKey = 'Xh8K0tL75L8'; // EA Sports FC Gameplay (100% funcional e com clima de futebol real)
  }

  return NextResponse.json({
    success: true,
    videoKey
  });
}
