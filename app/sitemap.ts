import { MetadataRoute } from 'next';

export default function sitemap() {
  const routes = [''].map((route) => ({
    lastModified: new Date().toISOString().split('T')[0],
    url: `https://cretu.dev${route}`,
  }));

  return [...routes] as MetadataRoute.Sitemap;
}
