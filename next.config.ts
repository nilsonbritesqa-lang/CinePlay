import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TMDB — posters e backdrops de filmes/séries
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
      // API-Football — escudos de times
      { protocol: 'https', hostname: 'media.api-sports.io', pathname: '/football/**' },
      // Unsplash — imagens genéricas
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      // Upload via Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
