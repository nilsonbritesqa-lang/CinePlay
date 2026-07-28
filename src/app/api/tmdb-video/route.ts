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
    // 1. Tentar obter vídeos especificando idioma Português (pt-BR e pt)
    let res = await fetch(`${TMDB_API}/${mediaType}/${id}/videos?api_key=${apiKey}&language=pt-BR&include_video_language=pt,br,en`);
    let data = await res.json();

    let videos = data.results || [];

    // Priorizar trailer em Português (iso_639_1 == 'pt' ou título contendo Trailer / Dublado / Legendado)
    let ptTrailer = videos.find((v: any) =>
      v.site === 'YouTube' &&
      (v.iso_639_1 === 'pt' || v.iso_3166_1 === 'BR' || /dublado|legendado|oficial|trailer/i.test(v.name)) &&
      (v.type === 'Trailer' || v.type === 'Teaser')
    );

    if (ptTrailer) {
      return NextResponse.json({ success: true, videoKey: ptTrailer.key });
    }

    // 2. Se não encontrou específico de PT, pegar qualquer trailer no resultado em português
    let anyPtVideo = videos.find((v: any) => v.site === 'YouTube' && (v.iso_639_1 === 'pt' || v.iso_3166_1 === 'BR'));
    if (anyPtVideo) {
      return NextResponse.json({ success: true, videoKey: anyPtVideo.key });
    }

    // 3. Fallback genérico de trailer no YouTube
    let genericTrailer = videos.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || videos.find((v: any) => v.site === 'YouTube');

    return NextResponse.json({
      success: true,
      videoKey: genericTrailer ? genericTrailer.key : null
    });
  } catch (error: any) {
    console.error('Erro tmdb-video:', error);
    return NextResponse.json({ success: false, error: error.message, videoKey: null });
  }
}
