import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cine-play-seven.vercel.app';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let posts: any[] = [];
  try {
    const res = await fetch(`${url}/rest/v1/posts?select=*&order=publicado_em.desc&limit=30`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (e) {
    console.error('Erro ao buscar posts para RSS feed:', e);
  }

  const feedItems = posts.map(post => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = post.publicado_em ? new Date(post.publicado_em).toUTCString() : new Date().toUTCString();
    const coverImage = post.imagem_capa_url || `${baseUrl}/og-default.jpg`;

    return `
      <item>
        <title><![CDATA[${post.titulo}]]></title>
        <link>${postUrl}</link>
        <guid isPermaLink="true">${postUrl}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${post.resumo || ''}]]></description>
        <category><![CDATA[${post.categoria || 'geral'}]]></category>
        <media:content url="${coverImage}" medium="image" />
        <content:encoded><![CDATA[${post.conteudo_html || post.resumo || ''}]]></content:encoded>
      </item>
    `;
  }).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CinePlay — Guia de Filmes, Séries e Futebol ao Vivo</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Matérias atualizadas sobre lançamentos de filmes, séries, horários de futebol ao vivo e guias de streaming no Brasil.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
