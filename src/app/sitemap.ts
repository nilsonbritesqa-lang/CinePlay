import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cine-play-seven.vercel.app';
  
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${baseUrl}/anuncie`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjmsabirunfywjxfsuly.supabase.co';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const res = await fetch(`${url}/rest/v1/posts?select=slug,publicado_em`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    const posts = await res.json();
    if (Array.isArray(posts)) {
      posts.forEach((p: { slug: string; publicado_em: string }) => {
        routes.push({
          url: `${baseUrl}/blog/${p.slug}`,
          lastModified: p.publicado_em ? new Date(p.publicado_em) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (err) {
    console.error('Erro ao gerar sitemap:', err);
  }

  return routes;
}
