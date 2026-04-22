import type { MetadataRoute } from 'next';
import { projects } from '@content/projects';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://indulohithnarisetty.com';
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/detections', '/projects', '/experience', '/skills', '/attack-matrix', '/triage', '/book'];
  const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
  const now = new Date();
  return [...staticRoutes, ...projectRoutes].map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r === '' ? 1 : 0.7,
  }));
}
