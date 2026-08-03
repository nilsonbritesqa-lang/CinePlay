import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // TMDB — posters e backdrops de filmes/séries
      { protocol: 'https', hostname: 'image.tmdb.org' },
      // API-Football — escudos de times
      { protocol: 'https', hostname: 'media.api-sports.io' },
      // Football-Data — escudos de times
      { protocol: 'https', hostname: 'crests.football-data.org' },
      // Unsplash — imagens genéricas
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      // OMDB / IMDb Posters
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'ia.media-imdb.com' },
      // UI Avatars
      { protocol: 'https', hostname: 'ui-avatars.com' },
      // OpenAI DALL-E Azure Blobs
      { protocol: 'https', hostname: '*.blob.core.windows.net' },
      // Upload via Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/futebol', destination: '/blog?categoria=futebol', permanent: false },
      { source: '/filmes', destination: '/blog?categoria=cinema', permanent: false },
      { source: '/series', destination: '/blog?categoria=series', permanent: false },
      { source: '/canais', destination: '/blog?categoria=canais', permanent: false },
      { source: '/onde-assistir', destination: '/blog?categoria=onde-assistir', permanent: false },
    ];
  },
};

export default nextConfig;
