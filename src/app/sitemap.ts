import type { MetadataRoute } from 'next';
import { GAMES } from '@/lib/games';
import { POSTS } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/ozellikler', '/nasil-calisir', '/oyunlar', '/fiyat', '/sss', '/blog', '/teklif'];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...GAMES.filter((g) => g.play).map((g) => ({ url: `${SITE_URL}/oyunlar/${g.id}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...POSTS.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
