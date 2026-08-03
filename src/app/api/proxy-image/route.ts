import { NextResponse } from 'next/server';

/**
 * Proxy de Imagens do CinePlay
 * Bypassa bloqueios de CORS e Hotlinking (ex: Wikimedia, API-Sports, CDN externas)
 * permitindo que escudos de futebol e imagens de parceiros carreguem com 100% de estabilidade.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL de imagem ausente', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      next: { revalidate: 86400 }, // Cache de 24h
    });

    if (!response.ok) {
      return new NextResponse(`Erro ao buscar imagem: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erro no Proxy de Imagem:', error);
    return new NextResponse('Falha ao processar imagem', { status: 500 });
  }
}
