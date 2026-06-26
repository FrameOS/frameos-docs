import type { MetadataRoute } from 'next';
import { source, getSortedBlogPosts } from '@/lib/source';

export const dynamic = 'force-static';

const baseUrl = 'https://frameos.net';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/blog/` },
    ...source.getPages().map((page) => ({ url: `${baseUrl}${page.url}/` })),
    ...getSortedBlogPosts().map((post) => ({
      url: `${baseUrl}${post.url}/`,
      lastModified: new Date(post.data.date),
    })),
  ];
}
