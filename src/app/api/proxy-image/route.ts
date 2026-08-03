import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Proxy de Imagens do CinePlay com Failsafe Inteligente e Caching
 * Impede que QUALQUER imagem de capa ou escudo de futebol responda com 404/500 no cliente.
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
        'User-Agent': 'CinePlayBot/1.0 (https://cineplay.com.br; contact@cineplay.com.br) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'image/png';
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Se o servidor de origem retornar 404/429/500/403, aciona o fallback adequado
    return await generateSmartFallback(imageUrl);

  } catch (error) {
    console.warn('[Proxy Imagem] Erro ao buscar imagem externa, acionando fallback:', error);
    return await generateSmartFallback(imageUrl);
  }
}

async function generateSmartFallback(imageUrl: string) {
  const isCrestOrLogo = /teams|crest|logo|avatar|escudo|badge|\.svg$/i.test(imageUrl);

  // Fallback 1: Imagem de capa / Banner do Post
  if (!isCrestOrLogo) {
    const stadiumFallback = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=85';
    try {
      const fallbackRes = await fetch(stadiumFallback);
      if (fallbackRes.ok) {
        const buffer = await fallbackRes.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=604800',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch {
      // ignora se a busca do Unsplash falhar
    }
  }

  // Fallback 2: Escudo de Time / Avatar via UI-Avatars
  try {
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1] || 'CinePlay';
    const cleanName = decodeURIComponent(lastPart)
      .replace(/\.(svg|png|jpg|jpeg|webp)$/i, '')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim() || 'CP';

    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=E50914&color=fff&size=128&bold=true`;
    const fallbackRes = await fetch(fallbackUrl);

    if (fallbackRes.ok) {
      const buffer = await fallbackRes.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': fallbackRes.headers.get('content-type') || 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch {
    // ignora se falhar
  }

  // Fallback 3: SVG estático inline
  const svgInline = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="#E50914"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="44" font-weight="900">CP</text>
  </svg>`;

  return new NextResponse(svgInline, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
