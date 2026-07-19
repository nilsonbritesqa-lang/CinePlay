import { NextResponse } from 'next/server';

const TMDB_API = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const apiKey = process.env.TMDB_API_KEY;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // 'Filme' ou 'Série'

  if (!apiKey || !id) {
    return NextResponse.json({ success: false, videoKey: null });
  }

  const mediaType = type === 'Série' ? 'tv' : 'movie';

  try {
    // 1. Tentar obter vídeos em Português
    let res = await fetch(`${TMDB_API}/${mediaType}/${id}/videos?api_key=${apiKey}&language=pt-BR`);
    let data = await res.json();

    let trailer = data.results?.find(
      (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    // 2. Se não encontrar, tentar em Inglês (fallback universal)
    if (!trailer) {
      res = await fetch(`${TMDB_API}/${mediaType}/${id}/videos?api_key=${apiKey}`);
      data = await res.json();
      trailer = data.results?.find(
        (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );
    }

    // 3. Se ainda assim não encontrar, pegar qualquer clipe do Youtube
    if (!trailer) {
      trailer = data.results?.find((v: any) => v.site === 'YouTube');
    }

    return NextResponse.json({
      success: true,
      videoKey: trailer ? trailer.key : null
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, videoKey: null });
  }
}
